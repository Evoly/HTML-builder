const fsp = require('node:fs/promises');
const path = require('path');

const dirName = 'files';
const pathToDir = path.join(__dirname, dirName);
const copyDir = 'files-copy';
const pathToCopy = path.join(__dirname, copyDir);

(async () => {
  try {
    await fsp.rm(pathToCopy, { recursive: true, force: true });
    fsp.mkdir(pathToCopy, { recursive: true });

    const fileList = await fsp.readdir(pathToDir);

    fileList.forEach((file) => {
      const filepath = path.join(pathToDir, file);
      const copypath = path.join(pathToCopy, file);
      fsp.copyFile(filepath, copypath);
    });
  } catch (err) {
    console.log(err);
  }
})();
