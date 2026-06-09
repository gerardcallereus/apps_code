const code = 'so("bd!4")';

const catalaDictionary = [
    { cat: /\\bso\\b/g, eng: 's' }
];

let currentText = code;
catalaDictionary.forEach((pair) => {
    currentText = currentText.replace(pair.cat, pair.eng);
});
console.log(currentText);
