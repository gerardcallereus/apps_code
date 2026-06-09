const fs = require('fs');

const content = fs.readFileSync('src/data/lessons.tsx', 'utf8');

const importLines = `import { FileAudio, Music, ListMusic, Drum, AudioLines, Trophy, Wand2, Sparkles, Target, BookOpen, Code2 } from 'lucide-react';
import React from 'react';
import { CodeBox } from '../components/CodeBox';
import { Lesson } from '../../types';`;

// We find boundaries using regex or indexOf.
// "  },\n  {\n    id: '"
const items = content.split(/\n  \},\n  \{\n/);

fs.mkdirSync('src/data/lessons', { recursive: true });

let exportList = [];
let moduleExports = items.map((item, index) => {
  // Fix the first and last items if they have extra wrapping
  let cleanItem = item;
  if (index === 0) {
    cleanItem = cleanItem.substring(cleanItem.indexOf('export const lessons: Lesson[] = [\n  {\n') + 'export const lessons: Lesson[] = [\n  {\n'.length);
  }
  if (index === items.length - 1) {
    cleanItem = cleanItem.substring(0, cleanItem.lastIndexOf('\n  }\n];'));
  }
  
  // Re-wrap the item body
  const body = `{\n` + cleanItem + `\n}`;
  
  const idMatch = body.match(/id: '([^']+)'/);
  const id = idMatch ? idMatch[1].replace(/[\.-]/g, '_') : `lesson_${index}`;
  const varName = `lesson_${id}`;
  exportList.push(varName);

  const fileContent = `${importLines}\n\nexport const ${varName}: Lesson = ${body};\n`;
  fs.writeFileSync(`src/data/lessons/${varName}.tsx`, fileContent);
  return varName;
});

const indexContent = `import { Lesson } from '../../types';\n` + 
  moduleExports.map(v => `import { ${v} } from './${v}';`).join('\n') + 
  `\n\nexport const lessons: Lesson[] = [\n  ` + moduleExports.join(',\n  ') + `\n];\n`;

fs.writeFileSync('src/data/lessons/index.ts', indexContent);

// Modify old data/lessons.ts to just re-export
fs.writeFileSync('src/data/lessons.tsx', `export { lessons } from './lessons/index';\nexport type { Lesson } from '../types';\n`);

console.log("Split done.");
