import axios from 'axios';

// 1. SETUP DASAR
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Wajib: Biar cookie refresh token kebawa otomatis
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. VARIABEL BANTUAN
// "isRefreshing": Penanda kalau asisten lagi lari ngambil token baru
let isRefreshing = false;
// "antrianRequest": Ruang tunggu buat request yang gagal pas token lagi diperbarui
let antrianRequest = [];

// 3. INTERCEPTOR REQUEST (Tugas: Nempelin Token ke Header)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 4. INTERCEPTOR RESPONSE (Tugas: Penyelamat Error 401)
api.interceptors.response.use(
  (response) => response, // Kalau sukses, lolos aja
  async (error) => {
    const requestAsli = error.config;

    // Cek: Apakah errornya 401 (Token Basi)?
    // DAN pastikan request ini belum pernah kita coba perbaiki (biar gak loop selamanya)
    if (error.response?.status === 401 && !requestAsli._retry) {
      
      // SKENARIO A: Token lagi diproses refresh oleh request lain
      if (isRefreshing) {
        // Kita bikin janji (Promise): "Tunggu ya, nanti kalau token baru dapet, aku kabarin"
        return new Promise((resolve) => {
          // Masukin logika "coba lagi" ke dalam antrian
          antrianRequest.push((tokenBaru) => {
            requestAsli.headers.Authorization = `Bearer ${tokenBaru}`;
            resolve(api(requestAsli)); // Jalankan ulang requestnya
          });
        });
      }

      // SKENARIO B: Kita adalah yang pertama error, jadi kita yang harus refresh
      requestAsli._retry = true; // Tandai "udah pernah dicoba"
      isRefreshing = true;       // Pasang bendera "Lagi sibuk refresh"

      try {
        // 1. Minta token baru ke backend (Cookie otomatis dikirim)
        const res = await api.post('/auth/refresh');
        const tokenBaru = res.data.data.accessToken;

        // 2. Simpan token baru
        localStorage.setItem('user_token', tokenBaru);
        
        // 3. Update header default biar request selanjutnya aman
        api.defaults.headers.common['Authorization'] = `Bearer ${tokenBaru}`;

        // 4. PROSES ANTRIAN: Panggil semua teman yang tadi nunggu
        antrianRequest.forEach((callback) => callback(tokenBaru));
        antrianRequest = []; // Kosongkan antrian

        // 5. Terakhir, jalankan ulang request kita sendiri
        requestAsli.headers.Authorization = `Bearer ${tokenBaru}`;
        return api(requestAsli);

      } catch (err) {
        // Kalau refresh gagal juga (misal refresh token expired)
        // Ya sudah, usir user ke halaman login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        // Selesai (baik sukses atau gagal), turunkan bendera
        isRefreshing = false;
      }
    }

    // Kalau errornya bukan 401, biarin aja error
    return Promise.reject(error);
  }
);

export default api;