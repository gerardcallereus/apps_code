import { UNITS } from '../constants';
import { Unit, UnitCategory, QuizQuestion, BaseQuestion, ComparisonQuestion, FallingQuestion, Card, UnitRaceQuestion, SortingItem, LinkedPuzzleQuestion, LabAlchemyQuestion, LabAlchemyStep } from '../types';

// Helper functions
const getRandomCategory = (): UnitCategory => {
  const categories = Object.keys(UNITS) as UnitCategory[];
  return categories[Math.floor(Math.random() * categories.length)];
};

export const getCategoryForUnit = (unit: Unit): UnitCategory => {
    for (const category in UNITS) {
        if (UNITS[category as UnitCategory].some(u => u.symbol === unit.symbol)) {
            return category as UnitCategory;
        }
    }
    return 'Longitud';
};

const getRandomUnit = (category: UnitCategory, exclude?: Unit): Unit => {
  const units = UNITS[category];
  let unit: Unit;
  do {
    unit = units[Math.floor(Math.random() * units.length)];
  } while (exclude && unit.symbol === exclude.symbol);
  return unit;
};

const getRandomValue = (unit: Unit): number => {
  return Math.floor(Math.random() * 99) + 1; 
};

const getRandomSimpleValue = (): number => {
    const values = [1, 2, 5, 10, 20, 30, 40, 50];
    return values[Math.floor(Math.random() * values.length)];
};

const convert = (value: number, from: Unit, to: Unit): number => {
    const valueInBase = value * from.factor;
    const valueInTarget = valueInBase / to.factor;
    // Round to 8 decimal places to avoid floating point inaccuracies while preserving precision.
    return Math.round(valueInTarget * 1e8) / 1e8;
};


// Question generators
export const generateBaseQuestion = (): BaseQuestion => {
    const category = getRandomCategory();
    const units = UNITS[category];
    const fromUnit = getRandomUnit(category);
    
    const fromIndex = units.findIndex(u => u.symbol === fromUnit.symbol);
    const maxJump = 3; 
    const minToIndex = Math.max(0, fromIndex - maxJump);
    const maxToIndex = Math.min(units.length - 1, fromIndex + maxJump);
    
    let toUnit: Unit;
    do {
      const toIndex = Math.floor(Math.random() * (maxToIndex - minToIndex + 1)) + minToIndex;
      toUnit = units[toIndex];
    } while (toUnit.symbol === fromUnit.symbol);

    const fromValue = getRandomValue(fromUnit);
    const correctAnswer = convert(fromValue, fromUnit, toUnit);

    return { fromUnit, toUnit, fromValue, correctAnswer };
};

export const generateQuizQuestion = (): QuizQuestion => {
    const base = generateBaseQuestion();
    const options = new Set<number>();
    options.add(base.correctAnswer);

    const multipliers = [10, 0.1, 100, 0.01];
    const shuffledMultipliers = multipliers.sort(() => Math.random() - 0.5);
    
    for (const multiplier of shuffledMultipliers) {
        if (options.size >= 4) break;
        const wrongAnswer = Math.round(base.correctAnswer * multiplier * 1e8) / 1e8;
        if (wrongAnswer > 0 && wrongAnswer !== base.correctAnswer) {
           options.add(wrongAnswer);
        }
    }

    while(options.size < 4) {
        const randomFactor = Math.random() > 0.5 ? 2 : 0.5;
        const randomWrongAnswer = Math.round(base.correctAnswer * randomFactor * 1e8) / 1e8;
        if (randomWrongAnswer > 0 && !options.has(randomWrongAnswer)) {
            options.add(randomWrongAnswer);
        } else {
            const fallbackWrongAnswer = Math.round((options.size + 1) * base.correctAnswer * 1e8) / 1e8 + options.size;
            if (fallbackWrongAnswer > 0 && !options.has(fallbackWrongAnswer)) {
                 options.add(fallbackWrongAnswer);
            }
        }
    }
    
    const finalOptions = Array.from(options).slice(0, 4);
    
    if (!finalOptions.includes(base.correctAnswer)) {
        finalOptions[Math.floor(Math.random() * 4)] = base.correctAnswer;
    }

    return { ...base, options: finalOptions.sort(() => Math.random() - 0.5) };
};

export const generateFillBlankQuestion = (): BaseQuestion => {
    return generateBaseQuestion();
};

const getRandomVariedValue = (): number => {
    const tier = Math.random();
    if (tier < 0.2) return Math.floor(Math.random() * 9) + 1; // 1-9 (20%)
    if (tier < 0.5) return Math.floor(Math.random() * 90) + 10; // 10-99 (30%)
    if (tier < 0.8) return Math.floor(Math.random() * 400) + 100; // 100-499 (30%)
    return Math.floor(Math.random() * 5000) + 500; // 500-5499 (20%)
};

export const generateComparisonQuestion = (): ComparisonQuestion => {
    const category = getRandomCategory();
    const units = UNITS[category];
    const unitA = units[Math.floor(Math.random() * units.length)];
    const maxJump = 3;
    const fromIndex = units.findIndex(u => u.symbol === unitA.symbol);
    const minToIndex = Math.max(0, fromIndex - maxJump);
    const maxToIndex = Math.min(units.length - 1, fromIndex + maxJump);

    let unitB: Unit;
    do {
      const toIndex = Math.floor(Math.random() * (maxToIndex - minToIndex + 1)) + minToIndex;
      unitB = units[toIndex];
    } while (unitB.symbol === unitA.symbol);

    const valueA = getRandomVariedValue();
    let valueB = getRandomVariedValue();
    
    let valueAInBase = valueA * unitA.factor;
    let valueBInBase = valueB * unitB.factor;

    if (Math.abs(valueAInBase - valueBInBase) < 0.01) {
       valueB += 1;
       valueBInBase = valueB * unitB.factor;
    }

    let correctAnswer: '>' | '<' | '=';
    if (valueAInBase > valueBInBase) correctAnswer = '>';
    else if (valueAInBase < valueBInBase) correctAnswer = '<';
    else correctAnswer = '=';

    return { valueA, unitA, valueB, unitB, correctAnswer };
};

export const generateFallingQuestion = (): FallingQuestion => {
    const base = generateBaseQuestion();
    const options: { text: string; isCorrect: boolean }[] = [];
    
    options.push({ text: `${base.correctAnswer.toLocaleString('ca-ES')} ${base.toUnit.symbol}`, isCorrect: true });

    const multipliers = [10, 0.1, 100, 0.01];
    const shuffledMultipliers = multipliers.sort(() => Math.random() - 0.5);

    while (options.length < 5) {
        if (shuffledMultipliers.length === 0) {
             shuffledMultipliers.push(Math.random() > 0.5 ? 2 : 0.5);
        }
        const multiplier = shuffledMultipliers.pop()!;
        const wrongValue = Math.round(base.correctAnswer * multiplier * 1e8) / 1e8;

        if (wrongValue > 0 && wrongValue !== base.correctAnswer) {
             const text = `${wrongValue.toLocaleString('ca-ES')} ${base.toUnit.symbol}`;
             if (!options.some(opt => opt.text === text)) {
                 options.push({ text, isCorrect: false });
             }
        }
    }
    
    return {
        fromUnit: base.fromUnit,
        fromValue: base.fromValue,
        options: options.sort(() => Math.random() - 0.5)
    };
};

export const generateUnitMatchGrid = (pairs: number): Card[] => {
    const allUnits = (Object.values(UNITS) as Unit[][]).flat();
    const shuffledUnits = allUnits.sort(() => 0.5 - Math.random());
    const selectedUnits = shuffledUnits.slice(0, pairs);
    
    let cards: Card[] = [];
    let id = 0;
    selectedUnits.forEach((unit, pairId) => {
        const value = getRandomValue(unit);
        
        const category = getCategoryForUnit(unit);
        const units = UNITS[category];
        const maxJump = 3;
        const fromIndex = units.findIndex(u => u.symbol === unit.symbol);
        const minToIndex = Math.max(0, fromIndex - maxJump);
        const maxToIndex = Math.min(units.length - 1, fromIndex + maxJump);

        let targetUnit: Unit;
        do {
            const toIndex = Math.floor(Math.random() * (maxToIndex - minToIndex + 1)) + minToIndex;
            targetUnit = units[toIndex];
        } while (targetUnit.symbol === unit.symbol);
        
        const convertedValue = convert(value, unit, targetUnit);

        cards.push({ id: id++, pairId, text: `${value.toLocaleString('ca-ES')} ${unit.symbol}`, status: 'down' });
        cards.push({ id: id++, pairId, text: `= ${convertedValue.toLocaleString('ca-ES')} ${targetUnit.symbol}`, status: 'down' });
    });

    return cards.sort(() => Math.random() - 0.5);
};

export const generateUnitRaceQuestion = (): UnitRaceQuestion => {
    const category = getRandomCategory();
    const units = UNITS[category];
    const itemCount = 2;
    const items: { value: number; unit: Unit }[] = [];
    let totalInBase = 0;

    // To prevent large magnitude differences, we'll pick units from a similar range.
    const maxJump = 3;
    const baseUnitIndex = Math.floor(Math.random() * (units.length - maxJump));

    const usedIndices = new Set<number>();

    for (let i = 0; i < itemCount; i++) {
        let unitIndex: number;
        do {
            unitIndex = Math.floor(Math.random() * (maxJump + 1)) + baseUnitIndex;
        } while(usedIndices.has(unitIndex));
        usedIndices.add(unitIndex);
        
        const unit = units[unitIndex];
        const value = getRandomSimpleValue();
        items.push({ value, unit });
        totalInBase += value * unit.factor;
    }
    
    // Also constrain the target unit to a similar range.
    let targetUnitIndex: number;
     do {
        targetUnitIndex = Math.floor(Math.random() * (maxJump + 2)) + baseUnitIndex; // slightly larger range for target
        targetUnitIndex = Math.min(targetUnitIndex, units.length - 1);
    } while(usedIndices.has(targetUnitIndex));

    const targetUnit = units[targetUnitIndex];
    const correctAnswer = convert(totalInBase, {name: '', symbol: '', factor: 1}, targetUnit);

    return { items, targetUnit, correctAnswer };
};

export const generateSortingQuestion = (itemCount: number = 5): SortingItem[] => {
    const category = getRandomCategory();
    const items: SortingItem[] = [];
    const usedUnits = new Set<string>();
    
    while (items.length < itemCount) {
        const unit = getRandomUnit(category);
        if (usedUnits.has(unit.symbol) || items.length >= UNITS[category].length) continue;
        
        usedUnits.add(unit.symbol);
        const value = getRandomVariedValue();
        const baseValue = value * unit.factor;
        items.push({
            id: items.length,
            text: `${value.toLocaleString('ca-ES')} ${unit.symbol}`,
            baseValue: baseValue
        });
    }

    return items.sort(() => Math.random() - 0.5);
};

export const generateLinkedPuzzleQuestion = (itemCount: number = 3): LinkedPuzzleQuestion => {
    const category = getRandomCategory();
    const questions: LinkedPuzzleQuestion = [];
    const usedUnits = new Set<string>();
    
    let currentFromUnit = getRandomUnit(category);
    usedUnits.add(currentFromUnit.symbol);
    let currentFromValue = getRandomValue(currentFromUnit);

    for (let i = 0; i < itemCount; i++) {
        const units = UNITS[category];
        const maxJump = 3;
        const fromIndex = units.findIndex(u => u.symbol === currentFromUnit.symbol);
        const minToIndex = Math.max(0, fromIndex - maxJump);
        const maxToIndex = Math.min(units.length - 1, fromIndex + maxJump);

        let toUnit: Unit;
        let attempts = 0;
        do {
            const toIndex = Math.floor(Math.random() * (maxToIndex - minToIndex + 1)) + minToIndex;
            toUnit = units[toIndex];
            attempts++;
        } while ((toUnit.symbol === currentFromUnit.symbol || usedUnits.has(toUnit.symbol)) && attempts < 20);
        
        if (toUnit.symbol === currentFromUnit.symbol || usedUnits.has(toUnit.symbol)) {
            do {
                toUnit = getRandomUnit(category);
            } while (toUnit.symbol === currentFromUnit.symbol);
        }
        
        const correctAnswer = convert(currentFromValue, currentFromUnit, toUnit);
        
        questions.push({
            id: i,
            fromValue: i === 0 ? currentFromValue : 'previous',
            fromUnit: currentFromUnit,
            toUnit: toUnit,
            correctAnswer: correctAnswer
        });
        
        currentFromValue = correctAnswer;
        currentFromUnit = toUnit;
        usedUnits.add(currentFromUnit.symbol);
    }
    return questions;
};

export const generateLabAlchemyQuestion = (): LabAlchemyQuestion => {
    const category: UnitCategory = 'Massa';
    const instructions = [
        `Per començar la poció, necessitem un ingredient base. Afegeix exactament...`,
        `Perfecte! Ara, afegeix amb cura el catalitzador líquid...`,
        `Molt bé. El següent pas és crucial. Afegeix les pólvores màgiques...`,
        `Gairebé ho tenim! L'últim toc és una gota de l'essència...`
    ];
    
    const steps: LabAlchemyQuestion = [];
    for (let i = 0; i < 4; i++) {
        const targetUnit = UNITS[category].find(u => u.symbol === 'g')!;
        const targetValue = getRandomValue(targetUnit);

        const options: { text: string; isCorrect: boolean }[] = [];
        
        const units = UNITS[category];
        const maxJump = 3;
        const fromIndex = units.findIndex(u => u.symbol === targetUnit.symbol);
        const minToIndex = Math.max(0, fromIndex - maxJump);
        const maxToIndex = Math.min(units.length - 1, fromIndex + maxJump);

        let correctOptionUnit: Unit;
        do {
            const toIndex = Math.floor(Math.random() * (maxToIndex - minToIndex + 1)) + minToIndex;
            correctOptionUnit = units[toIndex];
        } while (correctOptionUnit.symbol === targetUnit.symbol);

        const correctOptionValue = convert(targetValue, targetUnit, correctOptionUnit);
        options.push({ text: `${correctOptionValue.toLocaleString('ca-ES')} ${correctOptionUnit.symbol}`, isCorrect: true });

        while (options.length < 3) {
            const wrongUnit = getRandomUnit(category, targetUnit);
            const wrongValue = convert(targetValue, targetUnit, wrongUnit) * (Math.random() > 0.5 ? 10 : 0.1);
            const roundedWrongValue = Math.round(wrongValue * 1e8) / 1e8;
            const wrongText = `${roundedWrongValue.toLocaleString('ca-ES')} ${wrongUnit.symbol}`;
            if (!options.some(opt => opt.text === wrongText)) {
                options.push({ text: wrongText, isCorrect: false });
            }
        }
        
        steps.push({
            id: i,
            instruction: instructions[i],
            targetValue: targetValue,
            targetUnit: targetUnit,
            options: options.sort(() => Math.random() - 0.5)
        });
    }

    return steps;
};