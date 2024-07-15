import Compressor from "compressorjs";

export async function compressFile(file, isProfile = false) {
  return new Promise((resolve, reject) => {
    new Compressor(file[0], {
      quality: 0.98,
      maxWidth: isProfile ? 1024 : 2600,
      maxHeight: isProfile ? 1024 : 2600,
      convertTypes: ["image/webp"],
      // drew(context, canvas) {
      //   context.fillStyle = "#fff";
      //   context.font = "2rem serif";
      //   context.fillText("Stagemed.com", 20, canvas.height - 20);
      // },
      success(result) {
        resolve(result);
      },
      error(err) {
        console.error(err);
        reject(err);
      },
    });
  });
}

export async function mediumFile(file, isProfile = false) {
  return new Promise((resolve, reject) => {
    new Compressor(file[0], {
      quality: 0.7,
      maxWidth: isProfile ? 512 : 1480,
      maxHeight: isProfile ? 512 : 1480,
      convertTypes: ["image/webp"],
      // drew(context, canvas) {
      //   context.fillStyle = "#fff";
      //   context.font = "2rem serif";
      //   context.fillText("Stagemed.com", 20, canvas.height - 20);
      // },
      success(result) {
        resolve(result);
      },
      error(err) {
        console.error(err);
        reject(err);
      },
    });
  });
}

export async function minimalFile(file, isProfile = false) {
  return new Promise((resolve, reject) => {
    new Compressor(file[0], {
      quality: 0.3,
      maxWidth: isProfile ? 64 : 128,
      maxHeight: isProfile ? 64 : 128,
      convertTypes: ["image/webp"],
      // drew(context, canvas) {
      //   context.fillStyle = "#fff";
      //   context.font = "2rem serif";
      //   context.fillText("Stagemed.com", 20, canvas.height - 20);
      // },
      success(result) {
        resolve(result);
      },
      error(err) {
        console.error(err);
        reject(err);
      },
    });
  });
}
