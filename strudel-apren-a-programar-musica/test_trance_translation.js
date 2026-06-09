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

function translateCodeAndGetMap(code) {
  const mappedChars = Array.from(code).map((char, index) => ({ char, originalIndex: index }));

  const catalaDictionary = [
    { cat: /\bso\b/g, eng: 's' },
    { cat: /\bllibreria\b/g, eng: 'await samples' },
    { cat: /\bsoundfonts\b/g, eng: 'await soundfonts' },
    { cat: /\bantics\b/g, eng: "'github:tidalcycles/Dirt-Samples'" },
    { cat: /\bgm_synth\b/g, eng: "'github:joelmatthys/GM-synth'" },
    { cat: /\binstrument\b/g, eng: 's' },
    { cat: /\bnota\b/g, eng: 'note' },
    { cat: /\bnotes\b/g, eng: 'note' },
    { cat: /\btria\b/g, eng: 'choose' },
    { cat: /\bcapes\b/g, eng: 'stack' },
    { cat: /\.ràpid\b/g, eng: '.fast' },
    { cat: /\.lent\b/g, eng: '.slow' },
    { cat: /\.escala\b/g, eng: '.scale' },
    { cat: /\.ress(?:ò|o)(?!\w)/g, eng: '.room' },
    { cat: /\.reverb\b/g, eng: '.room' },
    { cat: /\.barreja\b/g, eng: '.shuffle' },
    { cat: /\.inversa\b/g, eng: '.rev' },
    { cat: /\.rev(?:é|e)s\b/g, eng: '.rev' },
    { cat: /\.panorama\b/g, eng: '.pan' },
    { cat: /\.banc\b/g, eng: '.bank' },
    { cat: /\.filtreGreus\b/g, eng: '.lpf' },
    { cat: /\.filtreAguts\b/g, eng: '.hpf' },
    { cat: /\.eco\b/g, eng: '.delay' },
    { cat: /\.8bit\b/g, eng: '.crush' },
    { cat: /\.distorsi[oó](?!\w)/g, eng: '.distort' },
    { cat: /\.volum\b/g, eng: '.gain' },
    { cat: /\.cada\b/g, eng: '.every' },
    { cat: /\.sovint\b/g, eng: '.sometimes' },
    { cat: /\.deVegades\b/g, eng: '.sometimes' },
    { cat: /\.moltSovint\b/g, eng: '.often' },
    { cat: /\.rarament\b/g, eng: '.rarely' },
    { cat: /\bbombo\b/g, eng: 'bd' },
    { cat: /\bcaixa\b/g, eng: 'sd' },
    { cat: /\bxarles\b/g, eng: 'hh' },
    { cat: /\bobert\b/g, eng: 'ho' },
    { cat: /\bpalmes\b/g, eng: 'cp' },
    { cat: /\bplateret\b/g, eng: 'cr' },
    { cat: /\btomagut\b/g, eng: 'ht' },
    { cat: /\btommig\b/g, eng: 'mt' },
    { cat: /\btomgreu\b/g, eng: 'lt' },
    { cat: /\bserra\b/g, eng: 'sawtooth' },
    { cat: /\bsinusoide\b/g, eng: 'sine' },
    { cat: /\bquadrat\b/g, eng: 'square' },
    { cat: /\btriangle\b/g, eng: 'triangle' },
    { cat: /\bbaix\b/g, eng: 'bass' },
    { cat: /(?<![a-zA-Z])do(?![a-zA-Z])/g, eng: 'c' },
    { cat: /(?<![a-zA-Z])re(?![a-zA-Z])/g, eng: 'd' },
    { cat: /(?<![a-zA-Z])mi(?![a-zA-Z])/g, eng: 'e' },
    { cat: /(?<![a-zA-Z])fa(?![a-zA-Z])/g, eng: 'f' },
    { cat: /(?<![a-zA-Z])sol(?![a-zA-Z])/g, eng: 'g' },
    { cat: /(?<![a-zA-Z])la(?![a-zA-Z])/g, eng: 'a' },
    { cat: /(?<![a-zA-Z])si(?![a-zA-Z])/g, eng: 'b' },
    { cat: /(?<![a-zA-Z])menor(?![a-zA-Z])/g, eng: 'minor' },
    { cat: /(?<![a-zA-Z])major(?![a-zA-Z])/g, eng: 'major' },
    { cat: /\bbpm\b/g, eng: '((c)=>setcpm(c/4))' },
  ];

  catalaDictionary.forEach((pair) => {
    replaceMapped(mappedChars, pair.cat, pair.eng);
  });

  const translatedText = mappedChars.map((mc) => mc.char).join('');
  return { translatedText, mappedChars };
}

const catalanCode = `bpm(140)
// LET US TRANCE (Solo sons base garantits)

capes(
  // 'bombo' (Bass Drum) és el bombo natiu més estàndard i fiable
  so("bombo!4").beat("0,4,8,11,14",16),

  nota("<3@3 4 5 @3 6>*2").add("-14,-21").escala("sol:menor")
    .instrument("supersaw")
    .filtreGreus(2000).lpenv(2),

  // 'palmes' és el clap per defecte
  so("palmes!4").o(.5).beat("0,4,8,11,14",16),

  nota("0@2 <-7 [-5 -2]@3 <0 -3 2 1>@3>").add(7)
    .add("<5 4 0 <0 2>>")
    .escala("sol:menor")
    .instrument("supersaw").o(3)
    .eco(.7).panorama(rand)
    .fm(.5).fmwave("brown")
    .filtreGreus(2500).lpenv(2),

  so("pulse!16").dec(.1).fm(time).fmh(time).o(4),

  so("saw:1").nota("mi2").add("<0 0 7 12 0>")
    .eco(.8).o(.5)
)`;

const result = translateCodeAndGetMap(catalanCode);
console.log("=== TRANSLATED CODE ===");
console.log(result.translatedText);
