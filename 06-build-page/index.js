const fsp = require('node:fs/promises');
const path = require('path');

const templateName = 'template.html';
const pathTofile = path.join(__dirname, templateName);

const copyDirName = 'project-dist';
const pathToCopy = path.join(__dirname, copyDirName);

const componentsPath = path.join(__dirname, 'components');

const fileNames = {
  html: 'index.html',
  css: 'style.css',
};

fsp.mkdir(pathToCopy, { recursive: true });

const createHtml = async () => {
  try {
    const template = await fsp.readFile(pathTofile, 'utf-8');
    const toArr = template.split('{{');

    const promises = toArr.map(async (substr) => {
      const index = substr.indexOf('}}');
      if (index === -1) return substr;

      const componentName = substr.substring(0, index);
      const componentPath = path.join(componentsPath, `${componentName}.html`);
      const componentContent = await fsp.readFile(componentPath, 'utf-8');
      return `${componentContent}${substr.substring(index + 2)}`;
    });

    const html = await Promise.all(promises);
    await fsp.writeFile(path.join(pathToCopy, fileNames.html), html.join(''));
    console.log('index.html compiled');
  } catch (e) {
    console.log(e);
  }
};

const createCss = async () => {
  try {
    const styleDir = path.join(__dirname, 'styles');
    const fileList = await fsp.readdir(styleDir);

    const promises = fileList.map((file) => {
      const filepath = path.join(styleDir, file);
      const extension = path.extname(filepath).slice(1);
      if (extension !== 'css') return null;

      return fsp.readFile(filepath, 'utf-8');
    });

    const content = await Promise.all(promises);
    const data = content.filter(Boolean).join('');
    fsp.writeFile(path.join(pathToCopy, fileNames.css), data);
    console.log('bundle.css compiled');
  } catch (err) {
    console.log(err);
  }
};

const copyDir = async (dirName) => {
  try {
    const currentDir = path.join(__dirname, dirName);
    fsp.mkdir(path.join(pathToCopy, dirName), { recursive: true });

    const fileList = await fsp.readdir(currentDir);
    fileList.map(async (file) => {
      const pathTofile = path.join(currentDir, file);
      const fileStat = await fsp.stat(pathTofile);
      if (fileStat.isDirectory()) {
        const newDir = path.join(dirName, file);
        console.log(newDir);
        return copyDir(newDir);
      }
      const copypath = path.join(pathToCopy, dirName, file);
      await fsp.copyFile(pathTofile, copypath);
    });
  } catch (error) {
    console.log(error);
  }
};

createHtml();
copyDir('assets');
createCss();
