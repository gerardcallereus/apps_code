const fs = require('fs');

const files = fs.readdirSync('./src/data/lessons').filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
const dict = [
  { search: /\bnote\(/g, replace: 'nota(' },
  { search: /\bn\(/g, replace: 'nota(' },
  { search: /\.s\(/g, replace: '.instrument(' },
  { search: /\bs\(/g, replace: 'so(' },
  { search: /\bchoose\(/g, replace: 'tria(' },
  { search: /\bstack\(/g, replace: 'capes(' },
  { search: /\.fast\(/g, replace: '.ràpid(' },
  { search: /\.slow\(/g, replace: '.lent(' },
  { search: /\.scale\(/g, replace: '.escala(' },
  { search: /\.room\(/g, replace: '.ressò(' },
  { search: /\.jumble\(/g, replace: '.barreja(' },
  { search: /\.rev\(/g, replace: '.inversa(' },
  { search: /\.pan\(/g, replace: '.panorama(' },
  { search: /\.lpf\(/g, replace: '.filtreGreus(' },
  { search: /\.hpf\(/g, replace: '.filtreAguts(' },
  { search: /\.delay\(/g, replace: '.eco(' },
  { search: /\.crush\(/g, replace: '.8bit(' },
  { search: /\.distort\(/g, replace: '.distorsio(' },
  { search: /\.gain\(/g, replace: '.volum(' },
  { search: /\.every\(/g, replace: '.cada(' },
  { search: /\.sometimes\(/g, replace: '.sovint(' }
];

files.forEach(file => {
  const path = './src/data/lessons/' + file;
  let content = fs.readFileSync(path, 'utf8');
  dict.forEach(d => {
    content = content.replace(d.search, d.replace);
  });
  fs.writeFileSync(path, content, 'utf8');
});
console.log('Translated successfully!');
