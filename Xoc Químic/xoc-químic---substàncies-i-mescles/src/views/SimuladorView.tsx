import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Droplet, Sparkles, AlertCircle, Magnet, Layers, FlaskConical, Hexagon } from 'lucide-react';
import { cn } from '../lib/utils';
import Matter from 'matter-js';
import MicroscopeView from '../components/MicroscopeView';

type SubstanceId = 'aigua' | 'oli' | 'alcohol' | 'sal' | 'sucre' | 'sorra' | 'ferro' | 'granit' | 'llet' | 'carbo';

interface MixResult {
  title: string;
  desc: string;
}

export default function SimuladorView() {
  const [ingredients, setIngredients] = useState<SubstanceId[]>([]);
  const [result, setResult] = useState<MixResult | null>(null);
  const [viewMode, setViewMode] = useState<'macro' | 'micro'>('macro');
  
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const viewModeRef = useRef(viewMode);
  const ingredientsRef = useRef(ingredients);

  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  useEffect(() => {
    ingredientsRef.current = ingredients;
  }, [ingredients]);

  // Initialize Matter.js
  useEffect(() => {
    if (!sceneRef.current) return;

    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 300,
        height: 400,
        wireframes: false,
        background: 'transparent',
      }
    });

    // Create Beaker walls
    const wallOptions = { 
      isStatic: true, 
      render: { fillStyle: 'rgba(255, 255, 255, 0.4)' },
      friction: 0.1
    };
    
    // Bottom, left, right
    const ground = Matter.Bodies.rectangle(150, 390, 260, 20, wallOptions);
    const leftWall = Matter.Bodies.rectangle(20, 200, 20, 400, wallOptions);
    const rightWall = Matter.Bodies.rectangle(280, 200, 20, 400, wallOptions);

    Matter.World.add(engine.world, [ground, leftWall, rightWall]);

    // Custom physics loop
    Matter.Events.on(engine, 'beforeUpdate', () => {
      const bodies = Matter.Composite.allBodies(engine.world);
      const waters = bodies.filter(b => b.label === 'aigua');
      const oils = bodies.filter(b => b.label === 'oli');
      const alcohols = bodies.filter(b => b.label === 'alcohol');
      const milks = bodies.filter(b => b.label === 'llet');
      const salts = bodies.filter(b => b.label === 'sal' || b.label === 'sucre');

      const fluids = [...waters, ...oils, ...alcohols, ...milks];
      const isMacro = viewModeRef.current === 'macro';
      
      // Update visual appearance based on viewMode
      const hasAqua = waters.length > 0;
      const hasAlc = alcohols.length > 0;
      const hasMilk = milks.length > 0;
      const curSl = ingredientsRef.current;
      const hasSalt = curSl.includes('sal');
      const hasSugar = curSl.includes('sucre');

      bodies.forEach(b => {
        if (b.label === 'aigua') {
          if (isMacro) {
             b.render.strokeStyle = 'transparent';
             b.render.opacity = 1;
             if (hasMilk) b.render.fillStyle = '#f8fafc'; // Perfectly homogeneous with milk
             else if (hasAlc) b.render.fillStyle = '#6366f1'; // Homogeneous mix with alcohol
             else if (hasSalt) b.render.fillStyle = '#60a5fa'; // Light blue for salty water
             else if (hasSugar) b.render.fillStyle = '#7dd3fc'; // Lightest blue for sugar water
             else b.render.fillStyle = '#3b82f6'; 
          } else {
             b.render.fillStyle = '#3b82f6';
             b.render.strokeStyle = '#2563eb';
             b.render.lineWidth = 1;
             b.render.opacity = 0.7;
          }
        } else if (b.label === 'alcohol') {
          if (isMacro) {
             b.render.strokeStyle = 'transparent';
             b.render.opacity = 1;
             if (hasMilk) b.render.fillStyle = '#f8fafc';
             else if (hasAqua) b.render.fillStyle = '#6366f1';
             else b.render.fillStyle = '#a78bfa';
          } else {
             b.render.fillStyle = '#a78bfa';
             b.render.strokeStyle = '#8b5cf6';
             b.render.lineWidth = 1;
             b.render.opacity = 0.5;
          }
        } else if (b.label === 'oli') {
          if (isMacro) {
             b.render.fillStyle = '#fbbf24';
             b.render.strokeStyle = 'transparent';
             b.render.opacity = 0.9;
          } else {
             b.render.fillStyle = '#fbbf24';
             b.render.strokeStyle = '#d97706';
             b.render.lineWidth = 1;
             b.render.opacity = 0.8;
          }
        } else if (b.label === 'llet') {
          if (isMacro) {
             b.render.strokeStyle = '#e2e8f0';
             b.render.lineWidth = 1;
             b.render.opacity = 1;
             if (hasAlc) {
               // Desnaturalització: Heterogènia, grumolls
               if (b.id % 3 === 0) b.render.fillStyle = '#cbd5e1'; // Grumolls més foscs
               else b.render.fillStyle = '#ffffff';
             } else {
               b.render.fillStyle = hasSugar ? '#fef3c7' : '#ffffff'; // creamy milk
             }
          } else {
             if (b.id % 5 === 0) { // 20% fat droplets in emulsion
               b.render.fillStyle = '#fef08a'; // slightly yellow fat droplet
               b.render.strokeStyle = '#facc15';
             } else {
               b.render.fillStyle = '#f8fafc'; // white fluid
               b.render.strokeStyle = '#e2e8f0';
             }
             b.render.lineWidth = 1;
             b.render.opacity = 0.9;
          }
        }
      });

      // 1. Dissolve Salt/Sugar in water or milk
      if (waters.length > 0 || milks.length > 0) {
        salts.forEach(s => {
          if (s.position.y > 220) {
            Matter.Body.scale(s, 0.97, 0.97);
            if (s.bounds.max.x - s.bounds.min.x < 1.5) {
              Matter.World.remove(engine.world, s);
            }
          }
        });
      }

      const mobileBodies = bodies.filter(b => !b.isStatic);

      // Simple Buoyancy: Lighter objects move up past denser objects
      mobileBodies.forEach(f => {
        // Density ordering check
        const denserAboveCount = mobileBodies.filter(other => 
          other.density > f.density && 
          other.position.y < f.position.y && 
          Math.abs(other.position.x - f.position.x) < 30
        ).length;

        const lighterBelowCount = mobileBodies.filter(other => 
          other.density < f.density && 
          other.position.y > f.position.y && 
          Math.abs(other.position.x - f.position.x) < 30
        ).length;

        if (denserAboveCount > 1) {
          // Push lighter object up. Add slight jitter so it navigates through dense objects
          Matter.Body.applyForce(f, f.position, { x: (Math.random() - 0.5) * f.mass * 0.0002, y: -f.mass * 0.0003 });
        }
        if (lighterBelowCount > 1) {
          // Push denser object down.
          Matter.Body.applyForce(f, f.position, { x: (Math.random() - 0.5) * f.mass * 0.0002, y: f.mass * 0.0003 });
        }
      });
    });

    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    engineRef.current = engine;
    renderRef.current = render;
    runnerRef.current = runner;

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
    };
  }, []);

  const addSubstance = (id: SubstanceId) => {
    if (!engineRef.current) return;
    if (ingredients.length >= 2 && !ingredients.includes(id)) return; // Max 2 elements
    
    const newIngredients = Array.from(new Set([...ingredients, id]));
    setIngredients(newIngredients);
    evaluateMixture(newIngredients);

    const world = engineRef.current.world;
    const particles = [];
    const dropX = 150;
    const dropY = 50;

    switch (id) {
      case 'aigua':
        for (let i = 0; i < 80; i++) {
          particles.push(Matter.Bodies.circle(dropX + (Math.random() - 0.5) * 60, dropY - Math.random() * 100, 6, {
            render: { fillStyle: '#3b82f6', opacity: 0.7 },
            restitution: 0.1, friction: 0.005, density: 0.0010, label: 'aigua'
          }));
        }
        break;
      case 'oli':
        for (let i = 0; i < 60; i++) {
          particles.push(Matter.Bodies.circle(dropX + (Math.random() - 0.5) * 60, dropY - Math.random() * 80, 7, {
            render: { fillStyle: '#fbbf24', opacity: 0.8 },
            restitution: 0.1, friction: 0.01, density: 0.0009, label: 'oli'
          }));
        }
        break;
      case 'alcohol':
        for (let i = 0; i < 60; i++) {
          particles.push(Matter.Bodies.circle(dropX + (Math.random() - 0.5) * 60, dropY - Math.random() * 80, 6, {
            render: { fillStyle: '#a78bfa', opacity: 0.5 },
            restitution: 0.1, friction: 0.005, density: 0.0008, label: 'alcohol'
          }));
        }
        break;
      case 'llet':
        for (let i = 0; i < 80; i++) {
          particles.push(Matter.Bodies.circle(dropX + (Math.random() - 0.5) * 60, dropY - Math.random() * 100, 5, {
            render: { fillStyle: '#ffffff', strokeStyle: '#e2e8f0', lineWidth: 1.5 },
            restitution: 0.1, friction: 0.01, density: 0.00103, label: 'llet'
          }));
        }
        break;
      case 'sorra':
        for (let i = 0; i < 60; i++) {
          particles.push(Matter.Bodies.rectangle(dropX + (Math.random() - 0.5) * 40, dropY - Math.random() * 50, 4, 4, {
            render: { fillStyle: '#a8a29e' },
            friction: 0.8, density: 0.015, label: 'sorra'
          }));
        }
        break;
      case 'ferro':
        for (let i = 0; i < 40; i++) {
          particles.push(Matter.Bodies.polygon(dropX + (Math.random() - 0.5) * 40, dropY - Math.random() * 50, 5, 5, {
            render: { fillStyle: '#1e293b' },
            friction: 0.9, density: 0.035, label: 'ferro'
          }));
        }
        break;
      case 'granit':
        for (let i = 0; i < 20; i++) {
          const c = Math.random() > 0.5 ? '#444' : '#999';
          particles.push(Matter.Bodies.rectangle(dropX + (Math.random() - 0.5) * 40, dropY - Math.random() * 50, 12, 12, {
            render: { fillStyle: c },
            friction: 0.9, density: 0.020, label: 'granit'
          }));
        }
        break;
      case 'carbo':
        for (let i = 0; i < 30; i++) {
          particles.push(Matter.Bodies.polygon(dropX + (Math.random() - 0.5) * 40, dropY - Math.random() * 50, 6, 8, {
            render: { fillStyle: '#27272a' },
            friction: 0.8, density: 0.0005, label: 'carbo'
          }));
        }
        break;
      case 'sal':
        for (let i = 0; i < 40; i++) {
          particles.push(Matter.Bodies.rectangle(dropX + (Math.random() - 0.5) * 40, dropY - Math.random() * 50, 4, 4, {
            render: { fillStyle: '#f1f5f9', strokeStyle: '#64748b', lineWidth: 1 },
            friction: 0.5, density: 0.012, label: 'sal'
          }));
        }
        break;
      case 'sucre':
        for (let i = 0; i < 40; i++) {
          particles.push(Matter.Bodies.rectangle(dropX + (Math.random() - 0.5) * 40, dropY - Math.random() * 50, 5, 5, {
            render: { fillStyle: '#e2e8f0', strokeStyle: '#475569', lineWidth: 1 },
            friction: 0.5, density: 0.010, label: 'sucre'
          }));
        }
        break;
    }

    Matter.World.add(world, particles);
  };

  const evaluateMixture = (ings: SubstanceId[]) => {
    if (ings.length === 0) {
      setResult(null);
      return;
    }
    
    if (ings.length === 1) {
      const single = ings[0];
      if (single === 'aigua') setResult({ title: "Substància Pura", desc: "L'aigua (H₂O) actua com un excel·lent dissolvent on hi podem diluir gran varietat de substàncies diàriament gràcies a la seva polaritat." });
      else if (single === 'oli') setResult({ title: "Substància Pura", desc: "L'oli és una substància lipídica. Com que és apolar, resulta insoluble dins d'altres substàncies com l'aigua i flotarà gràcies a presentar una menor densitat." });
      else if (single === 'alcohol') setResult({ title: "Substància Pura", desc: "L'alcohol és un compost molecular volàtil i afí. És totalment miscible dins l'aigua formant dissolucions perfectes." });
      else if (single === 'ferro') setResult({ title: "Substància Pura (Element metàl·lic)", desc: "El ferro (Fe) és un element químic. Un metall sòlid de propietats magnètiques que precipitara cap al fons degut a una gran densitat." });
      else if (single === 'granit') setResult({ title: "Mescla Heterogènia (Roca)", desc: "El granit no és pur. És una roca formada per una mescla on es distingeixen a simple vista els seus diferents minerals: quars, feldespat i mica." });
      else if (single === 'llet') setResult({ title: "Mescla (Col·loide)", desc: "Tot i semblar homogènia, un microscopi revelaria que conté diminutes gotetes de lípids suspeses dins l'aigua. Aquest estat s'anomena col·loide." });
      else if (single === 'carbo') setResult({ title: "Substància Pura", desc: "Una roca fràgil gairebé completament rica a base de l'element químic Carboni provinent d'abundant fossilització orgànica." });
      else setResult({ title: "Substància Pura (Sòlid cristal·lí)", desc: "Sòlids com el sucre o la sal adopten formacions cristal·lines que de posar-se en contacte amb l'aigua són summament solubles." });
      return;
    }

    const has = (a: SubstanceId, b: SubstanceId) => ings.includes(a) && ings.includes(b);
    const hasAnyOf = (sub: SubstanceId, list: SubstanceId[]) => ings.includes(sub) && list.some(i => ings.includes(i));
    const isBoth = (list: SubstanceId[]) => ings.every(i => list.includes(i));

    if (has('aigua', 'oli')) {
      setResult({ title: "Mescla Heterogènia (Líquids immiscibles)", desc: "Aquests líquids són immiscibles. A l'ajuntar-se, es generen dues fases marcades. A ull nu ja veiem que l'oli sura com a capa superior per la seva menor densitat respecte l'aigua." });
    } else if (has('aigua', 'alcohol')) {
      setResult({ title: "Mescla Homogènia (Dissolució líquida)", desc: "L'aigua i l'alcohol s'associen sent completament miscibles per ponts d'hidrogen. A ull nu no els podríem distingir. Al microscopi, veuríem les seves molècules barrejades a la perfecció." });
    } else if (has('oli', 'alcohol')) {
      setResult({ title: "Mescla Heterogènia", desc: "L'alcohol resulta insoluble en l'oli. No es poden barrejar i ràpidament s'aprecien dues altures o fases establertes per la seva diferència de densitat." });
    } else if (has('llet', 'aigua')) {
      setResult({ title: "Mescla Homogènia (aparentment)", desc: "L'aigua s'integra perfectament a la part aquosa de la llet aprimant el seu aspecte tèrbol. A ull nu costa distingir què és aigua i què llet." });
    } else if (has('llet', 'alcohol')) {
      setResult({ title: "Mescla Heterogènia (Desnaturalització)", desc: "L'alcohol sol atresorar aigua i provoca que les proteïnes de la llet (caseïnes) es desprenen i 'tallin' la llet precipitant formant petits grumolls distingibles." });
    } else if (has('llet', 'oli')) {
      setResult({ title: "Mescla Heterogènia (Líquids immiscibles)", desc: "L'oli roman insoluble dins la llet, igual que amb l'aigua, originant una fase clarament distingible a ull nu surant per sobre d'aquesta." });
    } else if (hasAnyOf('aigua', ['sal', 'sucre'])) {
      setResult({ title: "Mescla Homogènia (Dissolució)", desc: "Dissolució on les partícules del sòlid se separen a escala atòmica. A ull nu el sòlid desapareix sota el líquid donant pas a una mescla homogènia (només distingible al microscopi molecular)." });
    } else if (hasAnyOf('alcohol', ['sal', 'sucre'])) {
       setResult({ title: "Mescla Heterogènia", desc: "A diferència de l'aigua, l'alcohol actua com un mal dissolvent per a certes sals o cristalls, les quals precipitaran cap al fons (com es veu a simple vista) fent-se insolubles." });
    } else if (hasAnyOf('aigua', ['sorra', 'ferro', 'carbo', 'granit'])) {
      setResult({ title: "Mescla Heterogènia (Suspensió)", desc: "Són materials completament insolubles en aigua. Gràcies a un l'efecte de la major densitat, aniran sedimentant al fons, originant evidents distincions entre sòlid i líquid ja a ull nu." });
    } else if (hasAnyOf('oli', ['sal', 'sucre', 'sorra', 'ferro', 'granit', 'carbo'])) {
      setResult({ title: "Mescla Heterogènia (Suspensió insoluble)", desc: "Cap d'aquests sòlids s'aconseguirà dissoldre en oli. Restaran separats i cauran cap a la base precipitant-se, creant allò que anomenem una mescla heterogènia evident a primer cop d'ull." });
    } else if (hasAnyOf('alcohol', ['sorra', 'ferro', 'granit', 'carbo'])) {
      setResult({ title: "Mescla Heterogènia (Insolubles)", desc: "L'alcohol no alterarà aquesta mena de materials sòlids. Llavors s'acumularan immòbils al cul de l'embut i creant sedimentació directa perceptible ja al primer instant natural." });
    } else if (hasAnyOf('llet', ['sal', 'sucre'])) {
      setResult({ title: "Mescla Homogènia dins Col·loide", desc: "A ull nu, els cristalls desapareixen perquè es dissolen en la part aquosa de la llet, que mantindrà el seu aspecte blanc intacte sense formar noves fases." });
    } else if (hasAnyOf('llet', ['sorra', 'ferro', 'granit', 'carbo'])) {
      setResult({ title: "Mescla Heterogènia en Col·loide", desc: "Elements inertes a qualsevol canvi natural de medi cauran fins a precipitar el seu pes travessant els col·loides que l'envolta distingits llavors també al mateix pot." });
    } else if (isBoth(['sal', 'sucre', 'sorra', 'granit', 'ferro', 'carbo'])) {
      setResult({ title: "Mescla Heterogènia de Sòlids", desc: "A ull nu ens bastaria per veure amb independència tota diferència lliure creant parts sense uniformitat visual sense dissoldre les mostres de cada test i tipologies prèvies." });
    } else {
      setResult({ title: "Nova Mescla", desc: "Mescla general on es posen sobre la taula algunes relacions de solubilitat i miscibilitats on visualment s'avaluaria el nombre natural de les fases restants completades." });
    }
  };

  const reset = () => {
    setIngredients([]);
    setResult(null);
    if (engineRef.current) {
      const bodies = Matter.Composite.allBodies(engineRef.current.world);
      const toRemove = bodies.filter(b => !b.isStatic);
      Matter.World.remove(engineRef.current.world, toRemove);
    }
  };

  const substances: { id: SubstanceId; label: string; icon: any; color: string }[] = [
    { id: 'aigua', label: 'Aigua', icon: Droplet, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'oli', label: 'Oli', icon: Droplet, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { id: 'alcohol', label: 'Alcohol', icon: FlaskConical, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { id: 'llet', label: 'Llet', icon: Droplet, color: 'text-slate-800 bg-white border-slate-300' },
    { id: 'sal', label: 'Sal', icon: Sparkles, color: 'text-slate-500 bg-slate-50 border-slate-200 shadow-sm' },
    { id: 'sucre', label: 'Sucre', icon: Sparkles, color: 'text-indigo-400 bg-indigo-50 border-indigo-100' },
    { id: 'sorra', label: 'Sorra', icon: AlertCircle, color: 'text-stone-600 bg-stone-100 border-stone-300' },
    { id: 'ferro', label: 'Ferro', icon: Magnet, color: 'text-rose-800 bg-rose-50 border-rose-200' },
    { id: 'carbo', label: 'Carbó', icon: Hexagon, color: 'text-zinc-800 bg-zinc-200 border-zinc-400' },
    { id: 'granit', label: 'Granit', icon: Layers, color: 'text-slate-700 bg-slate-200 border-slate-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start"
    >
      <div className="w-full lg:w-1/3 space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Simulador de Matèria</h2>
          <p className="text-slate-600 text-sm">Escull i afegeix exàctament 2 substàncies per classificar el tipus de mescla i veure en què es converteixen.</p>
        </div>

        <div className="flex gap-2 font-semibold text-sm">
          <div className="flex-1 p-3 bg-slate-50 border-2 rounded-xl text-center shadow-inner relative flex flex-col justify-center min-h-[60px]">
             <span className="text-[10px] uppercase text-slate-400 absolute top-1 left-2">Substància 1</span>
             <span className={ingredients[0] ? "text-indigo-700 mt-2" : "text-slate-400 mt-2"}>
               {ingredients[0] ? substances.find(s => s.id === ingredients[0])?.label : 'Buit'}
             </span>
          </div>
          <div className="flex-1 p-3 bg-slate-50 border-2 rounded-xl text-center shadow-inner relative flex flex-col justify-center min-h-[60px]">
             <span className="text-[10px] uppercase text-slate-400 absolute top-1 left-2">Substància 2</span>
             <span className={ingredients[1] ? "text-indigo-700 mt-2" : "text-slate-400 mt-2"}>
               {ingredients[1] ? substances.find(s => s.id === ingredients[1])?.label : 'Buit'}
             </span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-slate-700">Substàncies:</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {substances.map(sub => {
              const Icon = sub.icon;
              const isAdded = ingredients.includes(sub.id);
              const isFull = ingredients.length >= 2;
              const disabled = isAdded || (!isAdded && isFull);

              return (
                <button
                  key={sub.id}
                  onClick={() => addSubstance(sub.id)}
                  disabled={disabled}
                  className={cn(
                    "flex flex-col items-center p-3 rounded-xl border-2 transition-all",
                    disabled ? "opacity-40 cursor-not-allowed bg-slate-50 border-slate-100" : `active:scale-95 hover:shadow-md ${sub.color}`
                  )}
                >
                  <Icon className="mb-2 w-5 h-5" />
                  <span className="font-medium text-[10px] uppercase tracking-wider">{sub.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={reset}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors shadow-md"
        >
          <RotateCcw className="w-4 h-4" /> Buidar Recipient
        </button>
      </div>

      <div className="w-full lg:w-2/3 flex flex-col items-center bg-slate-100 rounded-3xl p-8 border border-slate-200 shadow-inner">
        <div className="mb-6 flex justify-center w-full">
          <div className="bg-slate-200/70 p-1 rounded-xl inline-flex shadow-sm">
            <button 
               className={`px-5 py-2 rounded-lg font-medium text-sm transition-all ${viewMode === 'macro' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
               onClick={() => setViewMode('macro')}
            >
              👁️ Visió a Ull Nu
            </button>
            <button 
               className={`px-5 py-2 rounded-lg font-medium text-sm transition-all ${viewMode === 'micro' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
               onClick={() => setViewMode('micro')}
            >
              🔬 Visió Microscòpica
            </button>
          </div>
        </div>
        
        <div className="relative w-full flex items-center justify-center" style={{ minHeight: 400 }}>
          {/* Macro View */}
          <div className={cn(
               "absolute top-0 text-center bg-slate-50 border-4 border-slate-300 rounded-b-[40px] shadow-sm overflow-hidden transition-all duration-300",
               viewMode === 'macro' ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 pointer-events-none z-0'
             )} 
               style={{ width: 300, height: 400 }}>
            <div className="absolute top-20 left-0 w-4 h-1 bg-slate-300/50 z-10"></div>
            <div className="absolute top-40 left-0 w-8 h-1 bg-slate-300/50 z-10"></div>
            <div className="absolute top-60 left-0 w-4 h-1 bg-slate-300/50 z-10"></div>
            <div ref={sceneRef} className="absolute inset-0" />
          </div>

          {/* Micro View */}
          <div className={cn(
               "absolute top-0 text-center flex items-center justify-center p-4 transition-all duration-300",
               viewMode === 'micro' ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 pointer-events-none z-0'
             )}>
               <MicroscopeView ingredients={ingredients} />
          </div>
        </div>

        <div className="w-full mt-8 min-h-[140px]">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-indigo-500 h-full overflow-y-auto"
              >
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-lg mb-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {result.title}
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {result.desc}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-full text-center text-slate-400 bg-white/50 border border-transparent rounded-2xl p-6"
              >
                Tira exàctament 2 matèries dins del vas per veure com es barregen.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
