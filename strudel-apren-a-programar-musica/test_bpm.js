const code = 'bpm(120)\nso("bd")';

const catalaDictionary = [
    { cat: /\bso\b/g, eng: 's' },
    { cat: /\bbpm\b/g, eng: '((c)=>setcpm(c/4))' }
];

function replaceMapped(
  mappedChars,
  regex,
  replacement
) {
  const r = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
  const currentText = mappedChars.map(mc => mc.char).join('');
  let match;
  
  const matches = [];
  r.lastIndex = 0;
  while ((match = r.exec(currentText)) !== null) {
    matches.push({
      start: match.index,
      end: r.lastIndex,
      matchStr: match[0],
      p1: match[1]
    });
    if (match[0].length === 0) {
      r.lastIndex++;
    }
  }
  
  for (let i = matches.length - 1; i >= 0; i--) {
    const { start, end, matchStr, p1 } = matches[i];
    const repVal = typeof replacement === 'function' ? replacement(matchStr, p1) : replacement;
    
    const origStart = mappedChars[start]?.originalIndex ?? 0;
    const origEnd = mappedChars[end - 1]?.originalIndex ?? origStart;
    
    const newSlice = Array.from(repVal).map((c, idx) => {
      const t = repVal.length > 1 ? idx / (repVal.length - 1) : 0;
      const originalIndex = Math.round(origStart + t * (origEnd - origStart));
      return { char: c, originalIndex };
    });
    
    mappedChars.splice(start, end - start, ...newSlice);
  }
}

const mappedChars = Array.from(code).map((char, index) => ({ char, originalIndex: index }));
catalaDictionary.forEach((pair) => {
    replaceMapped(mappedChars, pair.cat, pair.eng);
});
console.log(mappedChars.map(mc => mc.char).join(''));
