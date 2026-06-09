import React, { useState } from 'react';
import { X, BookOpen, Music, Wand2, Drum, Settings2, Play } from 'lucide-react';

const synths = [
  { name: 'triangle', desc: 'Sintetitzador de baix profund tipus ona triangular, molt contundent, ideal per a línies de baix.', code: 'nota("do2 re2").instrument("triangle")' },
  { name: 'sawtooth', desc: 'Ona tipus serra. So aspre, brillant i ric en harmònics. Ideal per a melodies i leads electrònics.', code: 'nota("mi4 fa4").instrument("sawtooth")' },
  { name: 'square', desc: 'Ona quadrada. So retro 8-bit, buit però amb presència. Recorda a videojocs antics.', code: 'nota("do4 sol4").instrument("square")' },
  { name: 'sine', desc: 'Ona sinusoïdal. Un so molt suau, pur i sense harmònics addicionals, semblant a un xiulet.', code: 'nota("la4 do5").instrument("sine")' },
  { name: 'gm_lead_6_voice', desc: 'Sintetitzador tipus veu coral robòtica (General MIDI), molt interessant per a cors.', code: 'nota("do4 mi4 sol4").instrument("gm_lead_6_voice")' },
  { name: 'supersaw', desc: 'Múltiples ones serra desafinades lleugerament juntes. Crea un so molt gran i gruixut.', code: 'nota("la3 [do4 mi4]").instrument("supersaw")' },
  { name: 'rhodes', desc: 'Piano elèctric tipus Fender Rhodes. So càlid i vintage.', code: 'nota("do3 mi3 sol3 si3").instrument("rhodes").ràpid(2)' },
  { name: 'tb303', desc: 'Clàssic sintetitzador de baix Acid House. Molt expressiu quan es juga amb filtres.', code: 'nota("do2 [~ do3] mi2 sol2").instrument("tb303")' },
];

const drums = [
  { name: 'bombo', desc: 'Bombo (Bass Drum). El cop greu principal que marca el pols del ritme.', code: 'so("bombo(3,8)")' },
  { name: 'caixa', desc: 'Caixa (Snare Drum). El cop sec i agut que sol anar en el contratemps.', code: 'so("~ caixa ~ caixa")' },
  { name: 'xarles', desc: 'Hit-Hat Tancat. So ràpid i metàl·lic per donar subdivisió i velocitat al ritme.', code: 'so("xarles*4")' },
  { name: 'ho', desc: 'Hit-Hat Obert. Plateret obert amb un so més prolongat.', code: 'so("xarles ho xarles xarles")' },
  { name: 'palmes', desc: 'Picada de mans (Clap). Dona accent i sovint acompanya o substitueix la caixa.', code: 'so("~ palmes")' },
  { name: 'tomgreu, tommig, tomagut', desc: 'Toms (Low, Mid, High). Tambors de pas per fer "fills" (transicions).', code: 'so("tomagut tommig tomgreu ~")' },
  { name: 'plateret', desc: 'Plateret (Crash). Cop fort que marca inicis de compassos o accents grans.', code: 'so("plateret ~ ~ ~")' },
  { name: 'perc', desc: 'Diversos sons de percussió menors o blocs de fusta.', code: 'so("perc*3")' },
];

const effects = [
  { name: '.ressò(val)', desc: "Afegeix reverberació espacial (ressò d'habitació). val (0 a 1) controla la mida de l'habitació.", code: 'so("bombo caixa").ressò(0.5)' },
  { name: '.filtreGreus(freq)', desc: 'Low Pass Filter: Talla totes les freqüències agudes per sobre del valor (en Hertz) i deixa passar els greus.', code: 'so("sawtooth").filtreGreus(800)' },
  { name: '.filtreAguts(freq)', desc: 'High Pass Filter: Talla totes les freqüències greus per sota del valor indicat i deixa passar els aguts.', code: 'so("sawtooth").filtreAguts(2000)' },
  { name: '.eco(val)', desc: 'Efecte de retard tipus Eco. Sona com repeticions que es van aconseguir.', code: 'nota("do4").instrument("sawtooth").eco(0.5)' },
  { name: '.8bit(val)', desc: "Redueix la qualitat de l'àudio, afegint distorsió digital (Bitcrush). El valor indica quants 'bits' queden (1 a 16).", code: 'so("bombo xarles*3").8bit(4)' },
  { name: '.distorsio(val)', desc: 'Afegeix distorsió analògica, embrutant la senyal. Útil en guitarres o baixos. val (0 a 1).', code: 'nota("mi2").instrument("sawtooth").distorsio(0.8)' },
  { name: '.panorama(val)', desc: "Controla el panorama d'on surt el so pels altaveus: 0 és esquerra, 1 és dreta, 0.5 al centre.", code: 'so("xarles*4").panorama("0 1 0.2 0.8")' },
  { name: '.volum(val)', desc: 'Controla el volum daquest patró concret. 1 és normal, <1 és més fluix, >1 distorsiona una mica.', code: 'so("xarles*8").volum(0.6)' },
];

const functions = [
  { name: '.ràpid(val)', desc: 'Multiplica la velocitat del patró pel valor indicat. Si val=2, dura la meitat de temps (sonarà el doble de ràpid).', code: 'so("bombo caixa").ràpid(2)' },
  { name: '.lent(val)', desc: 'Divideix la velocitat del patró, fent-lo anar més a poc a poc. Si val=2, cada cicle dura el doble.', code: 'nota("do4 re4").lent(2)' },
  { name: '.barreja(val)', desc: "Barreja (aleatoritza) l'ordre de les notes. El valor indica quantes vegades es barregen els esdeveniments.", code: 'nota("do3 mi3 sol3 si3").barreja(2)' },
  { name: '.inversa()', desc: 'Reprodueix tot el patró completament al revés (de dreta a esquerra).', code: 'nota("do4 re4 mi4").inversa()' },
  { name: '.cada(n, fn)', desc: "Aplica una funció (efecte o mètode) cada 'n' cicles. Gran eina per automatitzacions rítmiques.", code: 'so("bombo*4").cada(4, x => x.ràpid(2))' },
  { name: '.sovint(fn)', desc: "Aplica la funció de forma aleatòria, de vegades sí, de vegades no (aprox 50%).", code: 'nota("do4 re4 mi4 fa4").sovint(x => x.inversa())' },
  { name: 'capes()', desc: 'Reprodueix diversos patrons simultàniament creant capes de música.', code: 'capes(\n  so("bombo caixa"),\n  nota("do4 re4").instrument("sawtooth")\n)' },
  { name: 'bpm(val)', desc: "Configura la velocitat global de tota la composició en batecs per minut (ex. 120). S'hauria de posar al principi de l'editor.", code: 'bpm(120)\n\nso("bombo xarles caixa xarles")' },
  { name: 'llibreria(nom)', desc: "Pots carregar una llibreria externa o de synths antics (samples). Prova amb 'antics' (Sons Tidal/Retro complets) o 'gm_synth' (Sons Midi).", code: 'llibreria(antics)\n\nnota("do2 re2").instrument("tb303")' }
];

type TabId = 'synths' | 'drums' | 'effects' | 'functions';

export function DocsModal({ isOpen, onClose, setCode }: { isOpen: boolean; onClose: () => void; setCode: (code: string) => void }) {
  const [activeTab, setActiveTab] = useState<TabId>('synths');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-violet-100 rounded-3xl shadow-xl shadow-violet-900/10 w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-white">
          <h2 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-3">
            <BookOpen size={20} className="text-violet-600 animate-pulse" />
            Guia de Referència l'Aon
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-150 transition-colors cursor-pointer"
            title="Tancar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 py-3 gap-2 overflow-x-auto">
          <TabButton 
            active={activeTab === 'synths'} 
            onClick={() => setActiveTab('synths')}
            icon={<Music size={16} />}
            label="Síntesi (Synths)"
            color="purple"
          />
          <TabButton 
            active={activeTab === 'drums'} 
            onClick={() => setActiveTab('drums')}
            icon={<Drum size={16} />}
            label="Bateries (Drums)"
            color="orange"
          />
          <TabButton 
            active={activeTab === 'effects'} 
            onClick={() => setActiveTab('effects')}
            icon={<Wand2 size={16} />}
            label="Efectes (Effects)"
            color="emerald"
          />
          <TabButton 
            active={activeTab === 'functions'} 
            onClick={() => setActiveTab('functions')}
            icon={<Settings2 size={16} />}
            label="Mètodes i Control"
            color="blue"
          />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50">
          
          {activeTab === 'synths' && (
            <DocSection 
              title="Sintetitzadors (Synths)" 
              icon={<Music size={24} className="text-purple-500" />}
              description='Pots triar l&#39;instrument afegint-lo a les teves notes encadenant el mètode <code class="bg-white border border-violet-200 text-purple-600 px-1.5 py-0.5 rounded-lg font-mono text-[13px] shadow-sm font-bold">.instrument("nom")</code>.'
              items={synths}
              colorClass="purple"
              setCode={setCode}
              onClose={onClose}
            />
          )}

          {activeTab === 'drums' && (
            <DocSection 
              title="Bateries i Percussió (Drums)" 
              icon={<Drum size={24} className="text-orange-500" />}
              description='Escriu aquests noms directament dins de la funció <code class="bg-white border border-violet-200 text-orange-600 px-1.5 py-0.5 rounded-lg font-mono text-[13px] shadow-sm font-bold">so("nom")</code> per crear patrons rítmics.'
              items={drums}
              colorClass="orange"
              setCode={setCode}
              onClose={onClose}
            />
          )}

          {activeTab === 'effects' && (
            <DocSection 
              title="Efectes i Filtres" 
              icon={<Wand2 size={24} className="text-emerald-500" />}
              description='Pots modificar com sonen els teus patrons encadenant efectes al final amb el punt <code class="bg-white border border-emerald-200 text-emerald-600 px-1.5 py-0.5 rounded-lg font-mono text-[13px] shadow-sm font-bold">.efecte()</code>. Es poden posar múltiples efectes seguits.'
              items={effects}
              colorClass="emerald"
              setCode={setCode}
              onClose={onClose}
            />
          )}

          {activeTab === 'functions' && (
            <DocSection 
              title="Mètodes i Control" 
              icon={<Settings2 size={24} className="text-blue-500" />}
              description='Són funcions globals o mètodes de patró que modifiquen el comportament en el temps, la velocitat o reestructuren el patró de notes sencer abans d&#39;aplicar el so.'
              items={functions}
              colorClass="blue"
              setCode={setCode}
              onClose={onClose}
            />
          )}

        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, color }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color: 'purple' | 'orange' | 'emerald' | 'blue' }) {
  const colorStyles = {
    purple: active ? 'bg-purple-100 text-purple-700 border-purple-200 shadow-sm' : 'bg-transparent text-slate-600 hover:bg-slate-100 border-transparent',
    orange: active ? 'bg-orange-100 text-orange-700 border-orange-200 shadow-sm' : 'bg-transparent text-slate-600 hover:bg-slate-100 border-transparent',
    emerald: active ? 'bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm' : 'bg-transparent text-slate-600 hover:bg-slate-100 border-transparent',
    blue: active ? 'bg-blue-100 text-blue-700 border-blue-200 shadow-sm' : 'bg-transparent text-slate-600 hover:bg-slate-100 border-transparent',
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all whitespace-nowrap ${colorStyles[color]}`}
    >
      {icon}
      {label}
    </button>
  );
}

function DocSection({ title, icon, description, items, colorClass, setCode, onClose }: { 
  title: string, 
  icon: React.ReactNode, 
  description: string, 
  items: any[], 
  colorClass: string,
  setCode: (code: string) => void,
  onClose: () => void
}) {
  
  const borderColors = {
    purple: "border-purple-100 hover:border-purple-200 shadow-[0_2px_10px_-3px_rgba(168,85,247,0.15)] hover:shadow-[0_4px_15px_-3px_rgba(168,85,247,0.25)]",
    orange: "border-orange-100 hover:border-orange-200 shadow-[0_2px_10px_-3px_rgba(249,115,22,0.15)] hover:shadow-[0_4px_15px_-3px_rgba(249,115,22,0.25)]",
    emerald: "border-emerald-100 hover:border-emerald-200 shadow-[0_2px_10px_-3px_rgba(16,185,129,0.15)] hover:shadow-[0_4px_15px_-3px_rgba(16,185,129,0.25)]",
    blue: "border-blue-100 hover:border-blue-200 shadow-[0_2px_10px_-3px_rgba(59,130,246,0.15)] hover:shadow-[0_4px_15px_-3px_rgba(59,130,246,0.25)]"
  };

  const badgeColors = {
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
  };

  const buttonHoverColors = {
    purple: "hover:bg-purple-100 text-purple-700 bg-purple-50/50 border-purple-200",
    orange: "hover:bg-orange-100 text-orange-700 bg-orange-50/50 border-orange-200",
    emerald: "hover:bg-emerald-100 text-emerald-700 bg-emerald-50/50 border-emerald-200",
    blue: "hover:bg-blue-100 text-blue-700 bg-blue-50/50 border-blue-200",
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h3 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3 font-display">
        {icon}
        {title}
      </h3>
      <p className="text-[15px] text-slate-600 mb-8 font-medium max-w-3xl" dangerouslySetInnerHTML={{ __html: description }} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {items.map((item, idx) => (
          <div key={idx} className={`bg-white border rounded-2xl p-5 flex flex-col gap-3 transition-all ${borderColors[colorClass as keyof typeof borderColors]}`}>
            <div className="flex items-center gap-2">
              <span className={`border px-3 py-1.5 rounded-lg text-[13px] font-mono font-bold ${badgeColors[colorClass as keyof typeof badgeColors]}`}>
                {item.name}
              </span>
              <button
                onClick={() => {
                  setCode(item.code);
                  onClose();
                }}
                className={`ml-auto border px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-sm ${buttonHoverColors[colorClass as keyof typeof buttonHoverColors]}`}
                title="Carga aquest exemple a l'editor"
              >
                <Play size={10} fill="currentColor" />
                Provar exemple
              </button>
            </div>
            <p className="text-[14px] text-slate-600 leading-relaxed flex-1 font-medium">{item.desc}</p>
            <div className="mt-auto pt-4 border-t border-slate-50">
              <code className="text-[13px] text-slate-700 bg-[#F8FAFC] border border-slate-200 p-3 rounded-xl block whitespace-pre overflow-x-auto font-mono font-medium">
                {item.code}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
