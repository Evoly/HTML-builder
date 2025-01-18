const fsp = require('node:fs/promises');
const path = require('path');

const dirName = 'styles';
const pathToDir = path.join(__dirname, dirName);
const copyDir = 'project-dist';
const pathToCopy = path.join(__dirname, copyDir, 'bundle.css');

(async () => {
  try {
    const fileList = await fsp.readdir(pathToDir);

    const promises = fileList.map((file) => {
      const filepath = path.join(pathToDir, file);
      const extension = path.extname(filepath).slice(1);
      if (extension !== 'css') return null;

      return fsp.readFile(filepath, 'utf-8');
    });

    const content = await Promise.all(promises);
    const data = content.filter(Boolean).join('');
    fsp.writeFile(pathToCopy, data);
    console.log('bundle.css compiled!');
  } catch (err) {
    console.log(err);
  }
})();
