import axios from 'axios';

// 1. SETUP DASAR
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. VARIABEL BANTUAN
let isRefreshing = false;
let antrianRequest = [];

// 3. INTERCEPTOR REQUEST
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

// 4. INTERCEPTOR RESPONSE
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requestAsli = error.config;

    // Cek error 401 DAN pastikan bukan request ke /auth/refresh itu sendiri
    // Biar gak looping kalau refresh tokennya expired
    if (error.response?.status === 401 && !requestAsli._retry && !requestAsli.url.includes('/auth/refresh')) {
      
      // SKENARIO A: Token lagi diproses request lain
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          antrianRequest.push((tokenBaru) => {
             // Kalau tokenBaru null (gagal refresh), reject antrian
            if (!tokenBaru) {
                reject(error); 
                return;
            }
            requestAsli.headers.Authorization = `Bearer ${tokenBaru}`;
            resolve(api(requestAsli));
          });
        });
      }

      // SKENARIO B: Kita yang eksekusi refresh
      requestAsli._retry = true;
      isRefreshing = true;

      try {
        // PERBAIKAN PENTING:
        // Gunakan 'axios' polos, JANGAN 'api'. 
        // Agar request ini tidak dicegat oleh interceptor ini lagi.
        // Kita perlu menyusun URL manual karena axios polos tidak punya baseURL.
        const refreshUrl = `${import.meta.env.VITE_API_URL}/auth/refresh`;
        
        const res = await axios.post(
            refreshUrl, 
            {}, // body kosong
            { withCredentials: true } // Wajib kirim cookie
        );

        const tokenBaru = res.data.data.accessToken; // Sesuaikan struktur response backendmu

        // Simpan & Update default
        localStorage.setItem('user_token', tokenBaru);
        api.defaults.headers.common['Authorization'] = `Bearer ${tokenBaru}`;

        // Eksekusi antrian
        antrianRequest.forEach((callback) => callback(tokenBaru));
        antrianRequest = [];
        
        // Jalanin lagi request asli
        requestAsli.headers.Authorization = `Bearer ${tokenBaru}`;
        return api(requestAsli);

      } catch (refreshError) {
        // Refresh Gagal (Token Refresh Expired/Invalid)
        // Kabari semua antrian kalau gagal
        antrianRequest.forEach((callback) => callback(null));
        antrianRequest = [];

        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;