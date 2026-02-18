import verySad from "../assets/mood-type/very_sad.png";
import sad from "../assets/mood-type/sad.png";
import neutral from "../assets/mood-type/normal.png";
import happy from "../assets/mood-type/happy.png";
import veryHappy from "../assets/mood-type/very_happy.png";

import maskot1 from "../assets/maskot/chick-detective.png";
import maskot2 from "../assets/maskot/chick-run.png";
import maskot3 from "../assets/maskot/chick-sleep.png";
import maskot4 from "../assets/maskot/chick-think.png";
import maskot5 from "../assets/maskot/chick-wave.png";

export const MOOD_IMAGES = {
  1: verySad,
  2: sad,
  3: neutral,
  4: happy,
  5: veryHappy,
};

export const MASKOT_IMAGES = {
  detective: maskot1,
  run: maskot2,
  sleep: maskot3,
  think: maskot4,
  default: maskot5,
};

// Jaga jaga kalau ada moodTypeId yang belum terdefinisi, kita return neutral sebagai default
export const getMoodImage = (id) => {
  return MOOD_IMAGES[id] || MOOD_IMAGES[3];
};
