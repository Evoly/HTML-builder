const fsp = require('node:fs/promises');
const path = require('path');

const dirName = 'secret-folder';
const pathToDir = path.join(__dirname, dirName);

(async () => {
  const fileList = await fsp.readdir(pathToDir);
  const promises = fileList.map(async (item) => {
    const pathTofile = path.join(pathToDir, item);
    const name = path.parse(item).name;
    const ext = path.extname(item).substring(1);
    const fileStat = await fsp.stat(pathTofile);
    if (!fileStat.isDirectory()) {
      const line = [name, ext, `${fileStat.size}b`];
      console.log(line.join(' - '));
    }
  });
  await Promise.all(promises);
})();

/* 
fs.Dirent:
fsp.readdir(pathToDir, { withFileTypes: true }).then((fileList) => {
  fileList.forEach((item) => {
    if (!item.isDirectory()) {
      console.log(item);
      console.log(path.extname(item.name));
      const pathTofile = path.join(pathToDir, item.name);
      fsp.stat(pathTofile).then((data) => console.log(data.size));
    }
  });
});

Promises: 
fsp.readdir(pathToDir).then((fileList) => {
  fileList.forEach((item) => {
    const pathTofile = path.join(pathToDir, item);
    const name = path.parse(item).name;
    const ext = path.extname(item);
    fsp.stat(pathTofile).then((fileStat) => {
      console.log(fileStat.size, name, ext);
    });
  });
});
*/
