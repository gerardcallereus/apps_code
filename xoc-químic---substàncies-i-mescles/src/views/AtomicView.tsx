import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Microscope, Atom, Share2, ZoomIn, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import Matter from 'matter-js';

type MatterType = 'element' | 'compost' | 'mescla_homogenia' | 'mescla_heterogenia';

interface AtomicExample {
  id: string;
  name: string;
  description: string;
  setup: (world: Matter.World) => void;
}

const AtomicSim = ({ type, exampleId }: { type: MatterType, exampleId: string }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = Matter.Engine.create();
    engine.gravity.y = 0;

    const render = Matter.Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width: 500,
        height: 350,
        wireframes: false,
        background: 'transparent',
      }
    });

    const world = engine.world;
    const wallOptions = { isStatic: true, render: { visible: false } };
    Matter.World.add(world, [
      Matter.Bodies.rectangle(250, 0, 500, 10, wallOptions),
      Matter.Bodies.rectangle(250, 350, 500, 10, wallOptions),
      Matter.Bodies.rectangle(0, 175, 10, 350, wallOptions),
      Matter.Bodies.rectangle(500, 175, 10, 350, wallOptions),
    ]);

    const COLORS = { O: '#ef4444', H: '#60a5fa', C: '#1e293b', He: '#fbbf24', Cl: '#4ade80', Na: '#818cf8', N: '#94a3b8', Au: '#eab308', Cu: '#ea580c', Zn: '#94a3b8', Fel: '#fbcfe8', Qz: '#f8fafc', Mi: '#0f172a' };

    const createMol = (x: number, y: number, atoms: { dx: number, dy: number, c: string }[], options: any = {}) => {
      const parts = atoms.map(a => Matter.Bodies.circle(x+a.dx, y+a.dy, 7, { render: { fillStyle: a.c, strokeStyle: '#fff', lineWidth: 1 } }));
      const body = Matter.Body.create({ parts, frictionAir: 0.01, restitution: 0.9, ...options });
      Matter.Body.setVelocity(body, { x: (Math.random()-0.5)*3, y: (Math.random()-0.5)*3 });
      return body;
    };

    // ELEMENT EXAMPLES
    if (exampleId === 'oxigen') {
      for(let i=0; i<15; i++) Matter.World.add(world, createMol(Math.random()*400+50, Math.random()*250+50, [{dx:-6,dy:0,c:COLORS.O},{dx:6,dy:0,c:COLORS.O}]));
    } else if (exampleId === 'heli') {
      for(let i=0; i<30; i++) {
        const b = Matter.Bodies.circle(Math.random()*400+50, Math.random()*250+50, 8, { render: { fillStyle: COLORS.He }, frictionAir: 0.01, restitution: 0.9 });
        Matter.Body.setVelocity(b, {x:(Math.random()-0.5)*4, y:(Math.random()-0.5)*4});
        Matter.World.add(world, b);
      }
    } else if (exampleId === 'ferro' || exampleId === 'or' || exampleId === 'coure') {
      const cColor = exampleId === 'or' ? COLORS.Au : exampleId === 'coure' ? COLORS.Cu : '#475569';
      for(let i=0; i<10; i++) {
        for(let j=0; j<7; j++) {
           const x = 90 + i * 35 + (j%2===0?15:0);
           const y = 60 + j * 35;
           const atom = Matter.Bodies.circle(x, y, 14, { render: { fillStyle: cColor }, frictionAir: 0.1, restitution: 0.5 });
           const constraint = Matter.Constraint.create({ pointA: { x, y }, bodyB: atom, stiffness: 0.015, damping: 0.01, render: { visible: false } });
           Matter.World.add(world, [atom, constraint]);
        }
      }
    }
    // COMPOST EXAMPLES
    else if (exampleId === 'aigua') {
      for(let i=0; i<25; i++) Matter.World.add(world, createMol(Math.random()*400+50, Math.random()*250+50, [{dx:0,dy:0,c:COLORS.O},{dx:-8,dy:6,c:COLORS.H},{dx:8,dy:6,c:COLORS.H}], { label: 'aigua', restitution: 0.5, frictionAir: 0.04 }));
    } else if (exampleId === 'sal') {
      for(let i=0; i<8; i++) {
        for(let j=0; j<6; j++) {
           const c = (i+j)%2===0 ? COLORS.Na : COLORS.Cl;
           const r = (i+j)%2===0 ? 10 : 14;
           const x = 120 + i * 36;
           const y = 70 + j * 36;
           const atom = Matter.Bodies.circle(x, y, r, { render: { fillStyle: c }, frictionAir: 0.1, restitution: 0.5 });
           const constraint = Matter.Constraint.create({ pointA: { x, y }, bodyB: atom, stiffness: 0.03, damping: 0.02, render: { visible: false } });
           Matter.World.add(world, [atom, constraint]);
        }
      }
    } else if (exampleId === 'co2') {
      for(let i=0; i<15; i++) Matter.World.add(world, createMol(Math.random()*400+50, Math.random()*250+50, [{dx:-10,dy:0,c:COLORS.O},{dx:0,dy:0,c:COLORS.C},{dx:10,dy:0,c:COLORS.O}]));
    } else if (exampleId === 'amoniac') {
      for(let i=0; i<20; i++) Matter.World.add(world, createMol(Math.random()*400+50, Math.random()*250+50, [{dx:0,dy:0,c:COLORS.N},{dx:-8,dy:6,c:COLORS.H},{dx:8,dy:6,c:COLORS.H},{dx:0,dy:-8,c:COLORS.H}]));
    } else if (exampleId === 'sucre_comp') {
      for(let i=0; i<8; i++) {
         const parts = [];
         for(let k=0; k<6; k++) parts.push(Matter.Bodies.circle((Math.random()-0.5)*15, (Math.random()-0.5)*15, 6, { render: { fillStyle: COLORS.C } }));
         for(let k=0; k<5; k++) parts.push(Matter.Bodies.circle((Math.random()-0.5)*20, (Math.random()-0.5)*20, 5, { render: { fillStyle: COLORS.O } }));
         for(let k=0; k<10; k++) parts.push(Matter.Bodies.circle((Math.random()-0.5)*25, (Math.random()-0.5)*25, 4, { render: { fillStyle: COLORS.H } }));
         const body = Matter.Body.create({ parts, restitution: 0.6 });
         Matter.Body.setPosition(body, { x: Math.random()*300+100, y: Math.random()*200+50 });
         Matter.World.add(world, body);
      }
    }
    // MESCLA HOMOGENIA
    else if (exampleId === 'aire') {
       for(let i=0; i<20; i++) Matter.World.add(world, createMol(Math.random()*400+50, Math.random()*250+50, [{dx:-6,dy:0,c:COLORS.N},{dx:6,dy:0,c:COLORS.N}], { restitution: 0.9 }));
       for(let i=0; i<5; i++) Matter.World.add(world, createMol(Math.random()*400+50, Math.random()*250+50, [{dx:-6,dy:0,c:COLORS.O},{dx:6,dy:0,c:COLORS.O}], { restitution: 0.9 }));
    } else if (exampleId === 'dissolucio') {
       for(let i=0; i<25; i++) Matter.World.add(world, createMol(Math.random()*300+100, Math.random()*200+50, [{dx:0,dy:0,c:COLORS.O},{dx:-8,dy:6,c:COLORS.H},{dx:8,dy:6,c:COLORS.H}], { label: 'aigua', restitution: 0.5, frictionAir: 0.04 }));
       for(let i=0; i<6; i++) {
           const na = Matter.Bodies.circle(Math.random()*400+50, Math.random()*250+50, 10, { render: { fillStyle: COLORS.Na }, frictionAir: 0.04, restitution: 0.5 });
           const cl = Matter.Bodies.circle(Math.random()*400+50, Math.random()*250+50, 14, { render: { fillStyle: COLORS.Cl }, frictionAir: 0.04, restitution: 0.5 });
           Matter.Body.setVelocity(na, { x: (Math.random()-0.5)*2, y: (Math.random()-0.5)*2 });
           Matter.Body.setVelocity(cl, { x: (Math.random()-0.5)*2, y: (Math.random()-0.5)*2 });
           Matter.World.add(world, [na, cl]);
       }
    } else if (exampleId === 'acer' || exampleId === 'lleto') {
      const cMain = exampleId === 'acer' ? '#475569' : COLORS.Cu;
      const cSub = exampleId === 'acer' ? COLORS.C : COLORS.Zn;
      for(let i=0; i<10; i++) {
        for(let j=0; j<7; j++) {
           const x = 90 + i * 35 + (j%2===0?15:0);
           const y = 60 + j * 35;
           const isSub = Math.random() < 0.15;
           const atom = Matter.Bodies.circle(x, y, isSub ? 10 : 14, { render: { fillStyle: isSub ? cSub : cMain }, frictionAir: 0.1, restitution: 0.5 });
           const constraint = Matter.Constraint.create({ pointA: { x, y }, bodyB: atom, stiffness: 0.015, damping: 0.01, render: { visible: false } });
           Matter.World.add(world, [atom, constraint]);
        }
      }
    } else if (exampleId === 'aigua_sucre') {
       for(let i=0; i<30; i++) Matter.World.add(world, createMol(Math.random()*300+100, Math.random()*200+50, [{dx:0,dy:0,c:COLORS.O},{dx:-8,dy:6,c:COLORS.H},{dx:8,dy:6,c:COLORS.H}], { label: 'aigua', restitution: 0.5, frictionAir: 0.04 }));
       for(let i=0; i<4; i++) {
         const parts = [];
         for(let k=0; k<6; k++) parts.push(Matter.Bodies.circle((Math.random()-0.5)*15, (Math.random()-0.5)*15, 6, { render: { fillStyle: COLORS.C } }));
         for(let k=0; k<5; k++) parts.push(Matter.Bodies.circle((Math.random()-0.5)*20, (Math.random()-0.5)*20, 5, { render: { fillStyle: COLORS.O } }));
         for(let k=0; k<10; k++) parts.push(Matter.Bodies.circle((Math.random()-0.5)*25, (Math.random()-0.5)*25, 4, { render: { fillStyle: COLORS.H } }));
         const suc = Matter.Body.create({ parts, restitution: 0.6 });
         Matter.Body.setPosition(suc, { x: Math.random()*300+100, y: Math.random()*200+50 });
         Matter.Body.setVelocity(suc, { x: (Math.random()-0.5)*2, y: (Math.random()-0.5)*2 });
         Matter.World.add(world, suc);
       }
    }
    // MESCLA HETEROGENIA
    else if (exampleId === 'oli_aigua') {
       for(let i=0; i<35; i++) Matter.World.add(world, createMol(Math.random()*300+100, Math.random()*150+150, [{dx:0,dy:0,c:COLORS.O},{dx:-8,dy:6,c:COLORS.H},{dx:8,dy:6,c:COLORS.H}], { label: 'aigua', restitution: 0.4, frictionAir: 0.05 }));
       for(let i=0; i<30; i++) {
           const parts = [
             Matter.Bodies.circle(0, -6, 8, { render: { fillStyle: '#fbbf24' } }),
             Matter.Bodies.circle(-6, 6, 8, { render: { fillStyle: '#fbbf24' } }),
             Matter.Bodies.circle(6, 6, 8, { render: { fillStyle: '#fbbf24' } })
           ];
           const oli = Matter.Body.create({ parts, label: 'oli', frictionAir: 0.06, restitution: 0.3 });
           Matter.Body.setPosition(oli, { x: Math.random()*300+100, y: Math.random()*150+20 });
           Matter.Body.setVelocity(oli, { x: (Math.random()-0.5)*2, y: (Math.random()-0.5)*2 });
           Matter.World.add(world, oli);
       }
    } else if (exampleId === 'granit') {
       for(let i=0; i<20; i++) {
         const type = Math.random();
         const c = type < 0.4 ? COLORS.Qz : type < 0.8 ? COLORS.Fel : COLORS.Mi;
         // Create clusters for granit
         const parts = [];
         for(let j=0; j<4; j++) parts.push(Matter.Bodies.polygon((Math.random()-0.5)*20, (Math.random()-0.5)*20, 5, 15, { render: { fillStyle: c } }));
         const chunk = Matter.Body.create({ parts, frictionAir: 0.2 });
         Matter.Body.setPosition(chunk, { x: Math.random()*400+50, y: Math.random()*250+50 });
         Matter.World.add(world, chunk);
       }
    } else if (exampleId === 'sorra_aigua') {
       for(let i=0; i<35; i++) Matter.World.add(world, createMol(Math.random()*300+100, Math.random()*150+150, [{dx:0,dy:0,c:COLORS.O},{dx:-8,dy:6,c:COLORS.H},{dx:8,dy:6,c:COLORS.H}], { label: 'aigua_sorra', restitution: 0.4, frictionAir: 0.05 }));
       for(let i=0; i<40; i++) {
         const s = Matter.Bodies.rectangle(Math.random()*400+50, Math.random()*150+20, 10, 10, { render: { fillStyle: '#a8a29e' }, label: 'sorra' });
         Matter.World.add(world, s);
       }
    } else if (exampleId === 'amanida') {
       for(let i=0; i<15; i++) {
         const type = Math.random();
         const c = type < 0.6 ? '#22c55e' : '#ef4444'; // let/tom
         const parts = [];
         for(let j=0; j<3; j++) parts.push(Matter.Bodies.circle((Math.random()-0.5)*15, (Math.random()-0.5)*15, 12, { render: { fillStyle: c } }));
         const chunk = Matter.Body.create({ parts, frictionAir: 0.05, label: 'amanida' });
         Matter.Body.setPosition(chunk, { x: Math.random()*400+50, y: Math.random()*250+50 });
         Matter.Body.setVelocity(chunk, { x: (Math.random()-0.5)*2, y: (Math.random()-0.5)*2 });
         Matter.World.add(world, chunk);
       }
    } else if (exampleId === 'cereals_llet') {
       for(let i=0; i<35; i++) Matter.World.add(world, Matter.Bodies.circle(Math.random()*400+50, Math.random()*150+150, 10, { render: { fillStyle: '#ffffff' }, label: 'llet' }));
       for(let i=0; i<15; i++) {
         const cer = Matter.Bodies.circle(Math.random()*400+50, Math.random()*100+20, 15, { render: { fillStyle: '#d97706', strokeStyle: '#b45309', lineWidth: 3 }, label: 'cereal' });
         Matter.World.add(world, cer);
       }
    }

    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    Matter.Events.on(engine, 'afterUpdate', () => {
        Matter.Composite.allBodies(world).forEach(b => {
            if (b.isStatic) return;
            
            let jitterForce = 0.00005;
            if (exampleId === 'heli' || exampleId === 'oxigen' || exampleId === 'aire' || exampleId === 'co2' || exampleId === 'amoniac') {
                jitterForce = 0.00015;
            }
            Matter.Body.applyForce(b, b.position, { x: (Math.random()-0.5)*jitterForce, y: (Math.random()-0.5)*jitterForce });

            if (exampleId === 'oli_aigua') {
                if (b.label === 'oli') {
                    Matter.Body.applyForce(b, b.position, { x: 0, y: -0.00008 });
                } else if (b.label === 'aigua') {
                    Matter.Body.applyForce(b, b.position, { x: 0, y: 0.00008 });
                }
            } else if (exampleId === 'sorra_aigua') {
                if (b.label === 'sorra') {
                    Matter.Body.applyForce(b, b.position, { x: 0, y: 0.0001 }); // Sorra goes down
                } else if (b.label === 'aigua_sorra') {
                    Matter.Body.applyForce(b, b.position, { x: 0, y: -0.00002 }); // Aigua goes up slightly relative to sand
                }
            } else if (exampleId === 'cereals_llet') {
                if (b.label === 'cereal') {
                    Matter.Body.applyForce(b, b.position, { x: 0, y: -0.0003 }); // Cereal sura amunt!
                }
            } else if (exampleId === 'amanida' || exampleId === 'granit') {
                Matter.Body.applyForce(b, b.position, { x: (Math.random()-0.5)*0.0003, y: (Math.random()-0.5)*0.0003 });
            }
        });
    });

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, [exampleId]);

  return (
    <div className="relative w-full h-[350px] bg-slate-900 rounded-3xl border-4 border-slate-800 shadow-2xl overflow-hidden">
       <div ref={canvasRef} className="absolute inset-0" />
       <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] text-white/60 font-mono">
          NIVELL ATÒMIC x10⁹
       </div>
    </div>
  );
};

export default function AtomicView() {
  const [activeType, setActiveType] = useState<MatterType>('element');
  const [activeExample, setActiveExample] = useState('oxigen');

  const configs = {
    element: {
      title: 'Elements',
      desc: 'Són les substàncies pures més senzilles. Estan formades per un únic tipus d\'àtom i no es poden descompondre químicament.',
      examples: [
        { id: 'oxigen', name: 'Oxigen (O₂)', info: 'L\'oxigen gasós forma molècules diatòmiques: dues partícules iguals s\'uneixen formant un enllaç.' },
        { id: 'heli', name: 'Heli (He)', info: 'És un gas noble molt poc reactiu. Els seus àtoms viatgen separats i no formen enllaços.' },
        { id: 'ferro', name: 'Ferro (Fe)', info: 'Metall robust on els àtoms s\'apilen estretament formant una xarxa tridimensional endreçada i molt densa.' },
        { id: 'or', name: 'Or (Au)', info: 'Metall pur i noble. Els àtoms s\'ordenen en una estructura cristal·lina molt estable de color groguenc i resistent a l\'oxidació.' },
        { id: 'coure', name: 'Coure (Cu)', info: 'Metall tou i un excel·lent conductor elèctric, gràcies a que els seus àtoms permeten moure lliurement els electrons exteriors per tota una xarxa ataronjada.' }
      ]
    },
    compost: {
      title: 'Compostos',
      desc: 'Substàncies formades per la unió química de dos o més tipus d\'àtoms diferents amb una proporció fixa.',
      examples: [
        { id: 'aigua', name: 'Aigua (H₂O)', info: 'Cada molècula està composta per un àtom d\'oxigen i dos d\'hidrogen units mitjançant un enllaç.' },
        { id: 'sal', name: 'Sal de cuina (NaCl)', info: 'El sodi i el clor s\'enllacen construint un gran cristall on s\'alternen de forma perfecta.' },
        { id: 'co2', name: 'Diòxid de C (CO₂)', info: 'Gas format per molècules on cada àtom de carboni s\'uneix linealment a dos àtoms d\'oxigen.' },
        { id: 'amoniac', name: 'Amoníac (NH₃)', info: 'Molècula gasosa formada per un àtom de nitrogen central embolicat al voltant per tres àtoms d\'hidrogen piramidals.' },
        { id: 'sucre_comp', name: 'Sucre (C₁₂H₂₂O₁₁)', info: 'Compost orgànic enorme que presenta àtoms de carboni, d\'oxigen i d\'hidrogen vinculats construint voluminoses i apinyades molècules sòlides i cristal·lines.' },
      ]
    },
    mescla_homogenia: {
      title: 'Mescles Homogènies',
      desc: 'Conegudes d\'altre mode com a dissolucions. Els materials es barregen perfectament constituint a simple vista una mateixa fase d\'aspecte uniforme.',
      examples: [
        { id: 'aire', name: 'Aire', info: 'Barreja de gasos lliures. A nivell molecular, trobem tant O₂ com N₂ compartint l\'espai de forma completament afí i equitativa.' },
        { id: 'dissolucio', name: 'Aigua Salada', info: 'Els ions es separen del cristall de sal original i queden esbarriats repartint-se harmònicament entre l\'aigua.' },
        { id: 'acer', name: 'Aliatge d\'Acer', info: 'És gairebé exclusivament ferro (fent xarxa contínua), incloent minúsculs àtoms de carboni atrapats i escampats homogeneïtzant un forçut bloc massís indivisible.' },
        { id: 'aigua_sucre', name: 'Aigua Ensucrada', info: 'Els grumolls de sucre es trenquen per l\'aigua. Ara conviuen partícules pesants i flotants indistingibles al líquid!' },
        { id: 'lleto', name: 'Lletó (Cu+Zn)', info: 'Atacant i mesclant-se a temperatura molt ardent, els àtoms de coure s\'emboliquen indistintament amb els de zinc i creen aleatòriament uniformes i immillorables parets or.' }
      ]
    },
    mescla_heterogenia: {
      title: 'Mescles Heterogènies',
      desc: 'En aquestes mescles els materials no es dissolen uniformement. Al no haver-hi solubilitat, podem veure clares divisions o "fases" a ull nu.',
      examples: [
        { id: 'oli_aigua', name: 'Oli i Aigua', info: 'Dos líquids incompatibles químicament (immiscibles). L\'oli crearà la seva pròpia capa, surant amunt degut a la menor densitat respecte l\'aigua.' },
        { id: 'granit', name: 'Roques Granit', info: 'Roca que espolida i presenta pedaços de múltiples colors degut a l\'impacte separat (micros, feldespats i quars purs i independents).' },
        { id: 'sorra_aigua', name: 'Sorra i Aigua', info: 'Un grapat de fina sorra per molta aigua que s\'hagi utilitzat, immediatament s\'empenyirà o pesarà el fons atès a un gran desnivell químic insalvable.' },
        { id: 'amanida', name: 'Amanida Variada', info: 'Representa la combinació i l\'embolic absolut i desmuntat (les fibres, tomàquets i vegetals romanen sencers i per gran que els triturem les seves cèl·lules continuen distintes!!!).' },
        { id: 'cereals_llet', name: 'Cereals amb Llet', info: 'Representació microscòpica, sòlids esponjosos (cereals marrons) i poc humits rellisquen sobre una fusta líquida (llet) flotant separades!' }
      ]
    }
  };

  useEffect(() => {
    setActiveExample(configs[activeType].examples[0].id);
  }, [activeType]);

  const currentExample = configs[activeType].examples.find(e => e.id === activeExample) || configs[activeType].examples[0];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-3">
          <Microscope className="w-10 h-10 text-indigo-600" />
          Mirem pel Microscopi!
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Posa't les ulleres científiques de l'institut. Així s'organitza tot quan mirem els materials en mida extremadament petita que ens envolten.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          {(Object.keys(configs) as MatterType[]).map(type => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={cn(
                "w-full p-4 rounded-2xl text-left border-2 transition-all",
                activeType === type ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-white border-slate-100 text-slate-600 hover:border-indigo-200"
              )}
            >
              <div className="font-bold">{configs[type].title}</div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-8">
          <div className="flex flex-wrap gap-3">
            {configs[activeType].examples.map(ex => (
              <button
                key={ex.id}
                onClick={() => setActiveExample(ex.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-bold border-2 transition-all",
                  activeExample === ex.id ? "bg-indigo-100 border-indigo-300 text-indigo-700" : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                )}
              >
                {ex.name}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <AtomicSim type={activeType} exampleId={activeExample} />
            <div className="space-y-4">
              <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                <h3 className="text-xl font-black text-indigo-900 mb-2">{currentExample.name}</h3>
                <p className="text-indigo-800/80 mb-4">{configs[activeType].desc}</p>
                <div className="flex items-start gap-3 bg-white/60 p-4 rounded-xl">
                   <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                   <p className="text-sm font-medium text-indigo-700">{currentExample.info}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
