const regex = /\bso\b/g;
console.log(regex.exec('so("bd")'));
console.log(/\bso\b/g.exec('so ("bd")'));
console.log(/\bso\b/g.exec('so\'bd\''));
console.log(/\bso\b/g.exec('so.fast()));'));
