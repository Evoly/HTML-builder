const fs = require('fs');
const path = require('path');

const fileName = 'text.txt';
const pathTofile = path.join(__dirname, fileName);

const stream = fs.createReadStream(pathTofile, 'utf-8');
stream.on('data', (chunk) => {
  console.log(chunk);
});
