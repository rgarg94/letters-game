const say = require("say");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const ffmpegPath = require("ffmpeg-static");

const words = {
  A: [
    { word: "Apple", emoji: "🍎" },
    { word: "Airplane", emoji: "✈️" },
    { word: "Ant", emoji: "🐜" }
  ],
  B: [
    { word: "Ball", emoji: "⚽" },
    { word: "Butterfly", emoji: "🦋" }
  ],
  C: [{ word: "Cat", emoji: "🐱" }],
  D: [{ word: "Dog", emoji: "🐶" }],
  E: [{ word: "Elephant", emoji: "🐘" }],
  F: [{ word: "Fish", emoji: "🐠" }],
  G: [{ word: "Giraffe", emoji: "🦒" }],
  H: [{ word: "House", emoji: "🏠" }],
  I: [{ word: "Ice Cream", emoji: "🍦" }],
  J: [{ word: "Jellyfish", emoji: "🪼" }],
  K: [{ word: "Kite", emoji: "🪁" }],
  L: [{ word: "Lion", emoji: "🦁" }],
  M: [{ word: "Moon", emoji: "🌙" }],
  N: [{ word: "Nest", emoji: "🪺" }],
  O: [{ word: "Orange", emoji: "🍊" }],
  P: [{ word: "Penguin", emoji: "🐧" }],
  Q: [{ word: "Queen", emoji: "👸" }],
  R: [{ word: "Rainbow", emoji: "🌈" }],
  S: [{ word: "Sun", emoji: "☀️" }],
  T: [{ word: "Tree", emoji: "🌳" }],
  U: [{ word: "Umbrella", emoji: "☂️" }],
  V: [{ word: "Violin", emoji: "🎻" }],
  W: [{ word: "Whale", emoji: "🐋" }],
  X: [{ word: "Xylophone", emoji: "🎹" }],
  Y: [{ word: "Yellow", emoji: "💛" }],
  Z: [{ word: "Zebra", emoji: "🦓" }]
};

async function generateMp3(phrase, outputMp3Path) {
  return new Promise((resolve, reject) => {
    const tmpWav = outputMp3Path.replace(/\.mp3$/, ".wav");
    say.export(phrase, null, 0.7, tmpWav, (err) => {
      if (err) {
        reject(err);
        return;
      }
      // Convert WAV to MP3 using ffmpeg
      exec(
        `"${ffmpegPath}" -y -i "${tmpWav}" -codec:a libmp3lame -qscale:a 2 "${outputMp3Path}"`,
        (err, stdout, stderr) => {
          // Remove the temporary WAV file
          fs.unlinkSync(tmpWav);
          if (err) {
            reject(stderr || err);
          } else {
            resolve(outputMp3Path);
          }
        }
      );
    });
  });
}

// const phrase = process.argv[2] || "A for Apple";
// const outputMp3 = process.argv[3] || "./audio/a_for_apple.mp3";

// generateMp3(phrase, outputMp3)
//   .then((file) => {
//     console.log(`Generated MP3: ${file}`);
//   })
//   .catch((err) => {
//     console.error("Error:", err);
//   });

const letters = Object.keys(words);
letters.forEach((letter) => {
  const options = words[letter];
  options.forEach((option) => {
    const filename = `${letter.toLowerCase()}_${option.word
      .split(" ")
      .join("_")
      .toLowerCase()}`;
    const path = `./audio/${filename}.mp3`;
    generateMp3(`${letter} for ${option.word}`, path);
    console.log(`import ${filename} from '${path}';`);
    option.audioFile = filename;
  });
});

console.log(JSON.stringify(words));
console.log(words);

// Usage: node generate_mp3.js "A for Apple" ./audio/a_for_apple.mp3
// if (require.main === module) {
// }
