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

const inputCode = `bpm(124)

/* ============================
    LOOP MOTOR - MELODIC TECHNO
   ============================ */

const kick   = so("bombo*4")
const hats   = so("~ xarles").ràpid(2)
const claps  = so("~ palmes")
const glitch = so("perc").ràpid(4).sovint(x => x.lent(2))

const bateria = capes(kick, hats, claps, glitch)

const baix = nota("do3 ~ do3 mi3 ~ do3 fa3 ~")
  .escala("la:menor")
  .instrument("triangle")
  .filtreGreus(400)

const melodia = nota("~ do4 mi4 sol4 ~ mi4 la4 do5")
  .escala("la:menor")
  .instrument("serra")
  .filtreGreus(1500)
  .ressò(0.7)

const pad = nota("la3")
  .instrument("sinusoide")
  .barreja(2)
  .ressò(0.9)
  .lent(2)

capes(
  bateria,
  baix,
  melodia,
  pad
)`;

const result = translateCodeAndGetMap(inputCode);
console.log("=== TRANSLATED CODE ===");
console.log(result.translatedText);
