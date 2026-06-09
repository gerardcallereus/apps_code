import fs from 'fs';

const csv = fs.readFileSync('analysis/events_impact_analysis.csv', 'utf8');
const lines = csv.split('\n').filter(l => l.trim().length > 0).slice(1);

const events: any = {};

for (const line of lines) {
    const parts = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
            inQuotes = !inQuotes;
        } else if (line[i] === ',' && !inQuotes) {
            parts.push(current);
            current = '';
        } else {
            current += line[i];
        }
    }
    parts.push(current);

    if (parts.length < 9) continue;

    const [title, category, decisionText, budgetStr, citizenStr, businessStr, politicalStr, envStr, otherEffects] = parts;
    
    if (!events[title]) {
        events[title] = {
            title,
            category,
            decisions: []
        };
    }
    
    events[title].decisions.push({
        text: decisionText,
        budget: parseInt(budgetStr) || 0,
        citizen: parseInt(citizenStr) || 0,
        business: parseInt(businessStr) || 0,
        political: parseInt(politicalStr) || 0,
        env: parseInt(envStr) || 0,
        otherEffects
    });
}

fs.writeFileSync('parsed_events.json', JSON.stringify(events, null, 2));
