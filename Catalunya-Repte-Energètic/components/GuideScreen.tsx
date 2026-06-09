import React, { ReactNode } from 'react';
import { ALL_POLICIES, GAME_EVENTS, BUSINESS_CRISIS_EVENT, CITIZEN_CRISIS_EVENT, ENVIRONMENTALIST_CRISIS_EVENT, POLITICAL_CRISIS_EVENT, EU_SANCTION_EVENT, EU_WARNING_EVENT, CLIMATE_PROTEST_EVENT, AIRPORT_EXPANSION_EVENT, CO2_REDUCTION_SUCCESS_EVENT, ARCHAEOLOGICAL_DISCOVERY_EVENT, NUCLEAR_SAFETY_CONCERNS_EVENT, SOLAR_PROTEST_EVENT, WIND_PROTEST_EVENT, BIOMASS_PROTEST_EVENT, RADIOACTIVE_WASTE_EVENT } from '../constants';
import { Policy, GameEvent, DifficultyLevel, EventCategory } from '../types';

interface GuideScreenProps {
    onBack: () => void;
}

const SectionTitle: React.FC<{ children: ReactNode }> = ({ children }) => <h2 className="text-3xl font-bold text-teal-600 mt-8 mb-3 border-b-2 border-teal-500/50 pb-2">{children}</h2>;
const SubTitle: React.FC<{ children: ReactNode }> = ({ children }) => <h3 className="text-2xl font-semibold text-yellow-600 mt-6 mb-2">{children}</h3>;
const SubSubTitle: React.FC<{ children: ReactNode }> = ({ children }) => <h4 className="text-xl text-teal-700 mt-4 mb-2">{children}</h4>;
const ListItem: React.FC<{ children: ReactNode }> = ({ children }) => <li className="pl-6 relative before:content-['⚡'] before:absolute before:left-0 before:text-teal-500 mb-1">{children}</li>;
const TipBox: React.FC<{ children: ReactNode }> = ({ children }) => <div className="bg-teal-50 border-l-4 border-teal-500 p-3 mt-3 italic text-teal-800 rounded-r-lg">{children}</div>;
const Details: React.FC<{ summary: string, children: ReactNode }> = ({ summary, children }) => (
    <details className="bg-slate-50 border border-slate-200 rounded-lg mb-3">
        <summary className="p-4 font-bold text-lg text-yellow-600 cursor-pointer outline-none marker:text-teal-500">{summary}</summary>
        <div className="p-4 border-t border-slate-200">{children}</div>
    </details>
);

const PolicyItem: React.FC<{policy: Policy}> = ({policy}) => (
    <div className="mb-4">
        <h5 className="font-bold text-slate-800">{policy.title}</h5>
        <p className="text-sm text-slate-500 italic mb-2">{policy.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div>
                <strong className="text-green-600">Pros:</strong>
                <ul className="list-disc pl-5 text-slate-600">
                    {policy.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                </ul>
            </div>
            <div>
                <strong className="text-red-600">Contres:</strong>
                 <ul className="list-disc pl-5 text-slate-600">
                    {policy.cons.map((con, i) => <li key={i}>{con}</li>)}
                </ul>
            </div>
        </div>
    </div>
);

const EventItem: React.FC<{event: GameEvent}> = ({event}) => (
    <div className="mb-4 p-3 bg-slate-100 rounded-md border border-slate-200">
        <h5 className="font-bold text-slate-800">{event.title}</h5>
        <p className="text-sm text-slate-500 italic mb-2">{event.description(DifficultyLevel.Medium)}</p>
    </div>
);


// FIX: Changed to a named export to resolve the import error in App.tsx.
export const GuideScreen: React.FC<GuideScreenProps> = ({ onBack }) => {
    const policiesByCategory = ALL_POLICIES.reduce((acc, policy) => {
        if (!acc[policy.category]) {
            acc[policy.category] = [];
        }
        acc[policy.category].push(policy);
        return acc;
    }, {} as Record<string, Policy[]>);

    const crisisEvents = [BUSINESS_CRISIS_EVENT, ENVIRONMENTALIST_CRISIS_EVENT, POLITICAL_CRISIS_EVENT, CITIZEN_CRISIS_EVENT];
    
    const otherNotableEvents = [
        EU_WARNING_EVENT,
        EU_SANCTION_EVENT,
        CLIMATE_PROTEST_EVENT,
        AIRPORT_EXPANSION_EVENT,
        CO2_REDUCTION_SUCCESS_EVENT,
        ARCHAEOLOGICAL_DISCOVERY_EVENT,
        NUCLEAR_SAFETY_CONCERNS_EVENT,
        RADIOACTIVE_WASTE_EVENT,
        SOLAR_PROTEST_EVENT,
        WIND_PROTEST_EVENT,
        BIOMASS_PROTEST_EVENT
    ];

    const allEvents = Array.from(new Map([...GAME_EVENTS, ...otherNotableEvents].map(e => [e.title, e])).values())
        .sort((a, b) => a.title.localeCompare(b.title));

    const crisisEventTitles = new Set(crisisEvents.map(e => e.title));
    const regularEvents = allEvents.filter(event => !crisisEventTitles.has(event.title));

    const eventsByCategory = regularEvents.reduce((acc, event) => {
        const category = event.category || 'Altres';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(event);
        return acc;
    }, {} as Record<string, GameEvent[]>);
    
    const categoryOrder: EventCategory[] = [
        'Política i Societat',
        'Economia i Mercat',
        'Tecnologia i Indústria',
        'Clima i Desastres',
        'Reacció a Construcció',
    ];

    return (
        <div className="flex flex-col min-h-screen p-4 sm:p-6 lg:p-8 bg-slate-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-auto border border-slate-200 flex-grow flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-slate-200 flex-shrink-0 sticky top-0 bg-white z-10">
                     <h1 className="text-2xl font-bold text-teal-600">Guia del Joc</h1>
                     <button onClick={onBack} className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 px-4 rounded-lg transition duration-300 flex items-center" aria-label="Tornar a l'inici">
                         Tornar
                     </button>
                </div>
                <div className="overflow-y-auto p-6 text-slate-700 leading-relaxed">
                    <SectionTitle>GUIA DEL JOC: CONVERTEIX-TE EN UN/A EXPERT/A EN ENERGIA</SectionTitle>

                    <SubTitle>1. LA TEVA MISSIÓ, SI L'ACCEPTES...</SubTitle>
                    <p>Benvingut/da a "Catalunya: Repte Energètic"! Acabes de ser nomenat/da <strong className="text-slate-900 font-semibold">Conseller/a d'Energia</strong>. El teu objectiu és simple, però no fàcil: has de garantir que a Catalunya hi hagi prou electricitat per a tothom durant els <strong className="text-slate-900 font-semibold">4 anys (16 trimestres)</strong> que dura el teu mandat.</p>
                    <p>Però atenció! No n'hi ha prou amb tenir llum. Has de fer-ho sense arruïnar el país, sense que la gent s'enfadi amb tu i sense contaminar el planeta.</p>

                    <SubSubTitle>Com es guanya i es perd?</SubSubTitle>
                    <ul className="list-none pl-2 space-y-2">
                        <ListItem><strong className="text-slate-900 font-semibold">VICTÒRIA:</strong> Arribes al final dels 4 anys (16 torns) sense haver fallat i mantenint la contaminació per CO₂ sota control. Felicitats, has fet bé la teva feina!</ListItem>
                        <ListItem><strong className="text-slate-900 font-semibold">DERROTA:</strong> La partida s'acaba abans d'hora si et passa alguna d'aquestes tres coses:
                            <ul className="list-none pl-6 mt-2 space-y-1">
                                <li className="pl-6 relative before:content-['-'] before:absolute before:left-0 before:text-red-500"><strong className="text-slate-900 font-semibold">Bancarrota:</strong> Et quedes sense diners (el teu pressupost arriba a 0 €).</li>
                                <li className="pl-6 relative before:content-['-'] before:absolute before:left-0 before:text-red-500"><strong className="text-slate-900 font-semibold">Crisi Social:</strong> La gent està molt descontenta amb tu (l'aprovació baixa del 15%).</li>
                                <li className="pl-6 relative before:content-['-'] before:absolute before:left-0 before:text-red-500"><strong className="text-slate-900 font-semibold">Fracàs Climàtic:</strong> Encara que acabis els 4 anys, si has contaminat massa, no has complert els objectius i perds igualment.</li>
                            </ul>
                        </ListItem>
                    </ul>
                    
                    <SubTitle>2. ELS 4 INDICADORS CLAU: EL TEU TAULELL DE CONTROL</SubTitle>
                    <p>Sempre has de vigilar aquests quatre números. Són el resum de la teva partida.</p>
                    <div className="overflow-x-auto">
                        <table className="w-full mt-6 text-sm border-collapse min-w-[600px]">
                            <thead>
                                <tr>
                                    <th className="border border-slate-300 p-3 text-left bg-slate-100 text-teal-700 font-bold">Indicador</th>
                                    <th className="border border-slate-300 p-3 text-left bg-slate-100 text-teal-700 font-bold">Què és?</th>
                                    <th className="border border-slate-300 p-3 text-left bg-slate-100 text-teal-700 font-bold">Per què és important?</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-slate-300 p-3 bg-white"><strong className="text-slate-900 font-semibold">Pressupost (€)</strong></td>
                                    <td className="border border-slate-300 p-3 bg-white">Els diners que tens per gastar en centrals, pagar sous i resoldre problemes.</td>
                                    <td className="border border-slate-300 p-3 bg-white">Si et quedes a zero, perds la partida. Gestiona'l bé!</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-300 p-3 bg-white"><strong className="text-slate-900 font-semibold">Aprovació Pública (%)</strong></td>
                                    <td className="border border-slate-300 p-3 bg-white">El nivell de felicitat de la gent amb la teva gestió.</td>
                                    <td className="border border-slate-300 p-3 bg-white">Si baixa massa (menys del 15%), la gent et farà fora.</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-300 p-3 bg-white"><strong className="text-slate-900 font-semibold">Emissions de CO₂ (t)</strong></td>
                                    <td className="border border-slate-300 p-3 bg-white">La contaminació que generes. Les centrals de gas són les que més contaminen.</td>
                                    <td className="border border-slate-300 p-3 bg-white">Si contamines massa, la Unió Europea et pot multar i perdràs la partida.</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-300 p-3 bg-white"><strong className="text-slate-900 font-semibold">Producció vs Demanda (MW)</strong></td>
                                    <td className="border border-slate-300 p-3 bg-white">La teva producció ha de ser més gran o igual que la demanda.</td>
                                    <td className="border border-slate-300 p-3 bg-white">Si produeixes menys del que es necessita (dèficit), hauràs de comprar energia a fora, i és molt car!</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <SubTitle>3. CONCEPTES CLAU D'ENERGIA</SubTitle>
                    <ul className="list-none pl-2 space-y-2">
                        <ListItem><strong className="text-slate-900 font-semibold">Producció (MW):</strong> És la quantitat total d'electricitat que totes les teves centrals generen en un trimestre. L'objectiu és que sigui sempre superior a la demanda.</ListItem>
                        <ListItem><strong className="text-slate-900 font-semibold">Demanda (MW):</strong> És la quantitat d'electricitat que necessita Catalunya en un trimestre. Varia segons el trimestre: a l'estiu (per l'aire condicionat) i a l'hivern (per la calefacció) és més alta.</ListItem>
                        <ListItem><strong className="text-slate-900 font-semibold">Dèficit i Superàvit:</strong>
                            <ul className="list-none pl-6 mt-2 space-y-1">
                                <li className="pl-6 relative before:content-['-'] before:absolute before:left-0 before:text-red-500">Si la <strong className="text-slate-800">Producció &lt; Demanda</strong>, tens un <strong className="text-red-600">DÈFICIT</strong>. Això és molt dolent. Hauràs de comprar l'energia que et falta a fora, a un preu molt car, i la teva aprovació baixarà.</li>
                                <li className="pl-6 relative before:content-['-'] before:absolute before:left-0 before:text-green-500">Si la <strong className="text-slate-800">Producció &gt; Demanda</strong>, tens un <strong className="text-green-600">SUPERÀVIT</strong>. Això és bo! Pots vendre l'energia que et sobra i guanyar diners.</li>
                            </ul>
                        </ListItem>
                    </ul>

                    <SubTitle>4. LES CENTRALS ELÈCTRIQUES: LES TEVES EINES</SubTitle>
                    <p>La teva eina principal per guanyar és construir i gestionar centrals. Cada tipus té els seus pros i contres:</p>
                    <Details summary="Centrals Gestionables (Pots regular-les)">
                        <p>Aquestes són les teves centrals de base. Pots engegar-les i aturar-les, i algunes fins i tot regular la seva potència. Són claus per garantir que sempre hi hagi llum.</p>
                        <ul className="list-none mt-2 space-y-1">
                            <ListItem><strong className="text-slate-800">Nuclear:</strong> Molta potència, 0 CO₂, però molt cara i impopular.</ListItem>
                            <ListItem><strong className="text-slate-800">Combustibles Fòssils (Gas):</strong> Es construeix ràpid, però contamina moltíssim.</ListItem>
                            <ListItem><strong className="text-slate-800">Hidràulica:</strong> Neta i potent, però depèn de la pluja (sequeres!).</ListItem>
                            <ListItem><strong className="text-slate-800">Biocombustible:</strong> Gestionable, però contamina i pot ser impopular.</ListItem>
                            <ListItem><strong className="text-slate-800">Termosolar:</strong> Una renovable que pot emmagatzemar calor per produir de nit! Molt cara, però molt útil.</ListItem>
                        </ul>
                    </Details>
                    <Details summary="Centrals No Gestionables (Depenen del temps)">
                        <p>Aquestes són les energies del futur, però tenen un problema: no sempre funcionen. Són intermitents.</p>
                        <ul className="list-none mt-2 space-y-1">
                            <ListItem><strong className="text-slate-800">Solar:</strong> Funciona molt bé quan fa sol (estiu), però de nit o a l'hivern, produeix poc o gens.</ListItem>
                            <ListItem><strong className="text-slate-800">Eòlica:</strong> Funciona quan fa vent, sobretot a l'hivern i primavera.</ListItem>
                            <ListItem><strong className="text-slate-800">Eòlica Marina:</strong> Molt potent i més constant que la terrestre, però extremadament cara de construir.</ListItem>
                        </ul>
                    </Details>

                    <SubSubTitle>Entenent la Potència: Capacitat vs. Generació Real</SubSubTitle>
                    <p>A la pantalla de gestió de centrals veuràs tres valors clau per a cada planta. És vital que els entenguis:</p>
                    <ul className="list-none pl-2 space-y-2 mt-3">
                        <ListItem>
                            <strong className="text-slate-900 font-semibold">Potència (Pot.):</strong> És la capacitat màxima teòrica de la central, el número "oficial". Per exemple, 1000 MW. Això <strong className="text-yellow-600">NO</strong> és el que produeix realment.
                        </ListItem>
                        <ListItem>
                            <strong className="text-slate-900 font-semibold">Rendiment (Rend.):</strong> Aquest és el percentatge clau. Indica l'eficiència real de la central en aquest trimestre concret. Depèn de tres factors:
                            <ul className="list-none pl-6 mt-2 space-y-1">
                                <li className="pl-6 relative before:content-['-'] before:absolute before:left-0 before:text-teal-500">El <strong className="text-slate-800">Factor de Càrrega</strong> base de la tecnologia (una nuclear funciona el 90% del temps, una solar només el 22%).</li>
                                <li className="pl-6 relative before:content-['-'] before:absolute before:left-0 before:text-teal-500">Els <strong className="text-slate-800">Multiplicadors estacionals</strong> (el sol a l'estiu, el vent a l'hivern, la pluja a la primavera...).</li>
                                <li className="pl-6 relative before:content-['-'] before:absolute before:left-0 before:text-teal-500">Els <strong className="text-slate-800">Modificadors per lleis o esdeveniments</strong> (una llei d'R+D pot millorar el rendiment un 10%, per exemple).</li>
                            </ul>
                        </ListItem>
                        <ListItem>
                            <strong className="text-slate-900 font-semibold">Generació Real (Gen.):</strong> Aquest és el número que importa de veritat. És el resultat de multiplicar la <strong className="text-slate-800">Potència</strong> pel <strong className="text-slate-800">Rendiment</strong>. Aquesta és l'electricitat que la central està injectant a la xarxa ARA MATEIX.
                        </ListItem>
                    </ul>
                    <TipBox>
                        <strong>Exemple pràctic:</strong> Una planta solar de <strong className="text-slate-900">1000 MW de Potència</strong> pot tenir un <strong className="text-slate-900">Rendiment del 33%</strong> a l'estiu. La seva <strong className="text-slate-900">Generació Real</strong> serà de 330 MW. Però a l'hivern, el seu rendiment pot baixar al 13%, i la seva generació real serà de només 130 MW. ¡Planifica tenint això en compte!
                    </TipBox>

                    <SubTitle>5. POLÍTIQUES PÚBLIQUES: EL TEU LLEGAT</SubTitle>
                    <p>No tot és construir. També pots impulsar lleis que tinguin un impacte permanent en el sistema energètic. A cada partida, tindràs disponibles 6 polítiques a l'atzar del catàleg total. Són inversions cares i triguen uns quants trimestres a aprovar-se, però els seus efectes poden canviar el rumb de la partida.</p>
                    <p>Per aprovar una llei, necessites suport parlamentari. La probabilitat d'èxit depèn de la teva <strong className="text-slate-900 font-semibold">aprovació pública</strong>. Com més contenta estigui la gent amb tu, més fàcil serà que els teus projectes tirin endavant!</p>

                    <div className="mt-4 space-y-6">
                        {Object.entries(policiesByCategory).map(([category, policies]) => (
                            <Details key={category} summary={category}>
                                {policies.map(policy => <PolicyItem key={policy.id} policy={policy} />)}
                            </Details>
                        ))}
                    </div>

                    <SectionTitle>6. ESDEVENIMENTS: L'INESPERAT SEMPRE PASSA</SectionTitle>
                    <p>Cada trimestre, hi ha la possibilitat que s'activi un esdeveniment aleatori. Aquests esdeveniments representen crisis, oportunitats i reptes que hauràs de resoldre. Les teves decisions tindran un impacte directe i immediat en els teus indicadors. Llegeix amb atenció cada opció abans de decidir. Alguns esdeveniments només apareixen si compleixes certes condicions (com construir una central nuclear o contaminar massa).</p>
                    <TipBox>
                        <strong>Consell:</strong> Els esdeveniments són una part fonamental del joc. Una bona decisió et pot salvar d'una crisi, mentre que una de dolenta et pot costar la partida. De vegades, la millor opció no és la més barata!
                    </TipBox>
                    
                     <SubSubTitle>Esdeveniments de Crisi (Reacció a Baixa Aprovació)</SubSubTitle>
                    <p>Aquests són esdeveniments especials que s'activen automàticament si l'aprovació d'un sector concret cau per sota del <strong className="text-slate-900 font-semibold">llindar crític del 25%</strong>. Són la conseqüència directa d'ignorar les demandes d'un grup social i et forcen a prendre decisions dràstiques.</p>
                    <Details summary="Veure els Esdeveniments de Crisi">
                        {crisisEvents.map(event => <EventItem key={event.title} event={event} />)}
                    </Details>

                    <SubSubTitle>Catàleg d'Esdeveniments per Categories</SubSubTitle>
                    <div className="mt-4 space-y-3">
                        {categoryOrder.map(category => {
                            const events = eventsByCategory[category];
                            if (!events || events.length === 0) return null;
                            return (
                                <Details key={category} summary={category}>
                                    {events.sort((a,b) => a.title.localeCompare(b.title)).map(event => <EventItem key={event.title} event={event} />)}
                                </Details>
                            );
                        })}
                        {Object.keys(eventsByCategory).filter(cat => !categoryOrder.includes(cat as EventCategory)).map(category => {
                             const events = eventsByCategory[category];
                             return (
                                <Details key={category} summary={category}>
                                    {events.sort((a,b) => a.title.localeCompare(b.title)).map(event => <EventItem key={event.title} event={event} />)}
                                </Details>
                             );
                        })}
                    </div>
                    
                    <SectionTitle>7. CONSELLS ESTRATÈGICS PER A UN BON MANDAT</SectionTitle>
                    <ul className="list-none pl-2 space-y-2">
                        <ListItem><strong className="text-slate-900 font-semibold">Anticipa't a la Demanda:</strong> No esperis a tenir un dèficit per construir. Les centrals triguen temps! Mira les gràfiques i planifica amb 2 o 3 trimestres d'antelació.</ListItem>
                        <ListItem><strong className="text-slate-900 font-semibold">Diversifica el Mix:</strong> No apostis tot a una sola carta. Combina energies gestionables (nuclear, hidro) per a la base, i renovables (solar, eòlica) per reduir costos i CO₂.</ListItem>
                        <ListItem><strong className="text-slate-900 font-semibold">Vigila el Pressupost:</strong> Una central nuclear pot semblar una bona idea, però si et deixa sense diners per afrontar una crisi (una sequera, una pujada de preus...), pot ser la teva ruïna.</ListItem>
                        <ListItem><strong className="text-slate-900 font-semibold">L'Aprovació és Clau:</strong> Un/a conseller/a impopular no pot aprovar lleis ni sobreviure a crisis. De vegades, una petita inversió que faci feliç a la gent és més rendible a llarg termini.</ListItem>
                        <ListItem><strong className="text-slate-900 font-semibold">Llegeix els Esdeveniments:</strong> Cada decisió compta. Llegeix bé els pros i els contres de cada opció en els esdeveniments. Una mala decisió et pot costar la partida.</ListItem>
                    </ul>

                    <p className="mt-8 text-center font-bold text-lg text-teal-600">Molta sort, Conseller/a. El futur de Catalunya està a les teves mans!</p>
                </div>
            </div>
        </div>
    );
};