const readline = require('node:readline');
const fs = require('fs');
const path = require('path');

let writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Hello there');
rl.on('line', (line) => {
  if (line.trim() === 'exit') {
    rl.close();
  } else {
    writeStream.write(`${line}\n`);
  }
});

rl.on('close', () => {
  writeStream.end();
  console.log('Bye, have a nice day!');
});
