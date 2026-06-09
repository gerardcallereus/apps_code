import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, Sun, Magnet, ArrowDownToLine, RefreshCw, AlertCircle, Grid3X3, Droplets, Thermometer, Hand } from 'lucide-react';
import { cn } from '../lib/utils';
import Matter from 'matter-js';

type SeparationMethod = 'filtracio' | 'decantacio' | 'evaporacio' | 'magnetisme' | 'tamisatge' | 'destilacio' | 'centrifugacio';

interface SimProps {
  method: SeparationMethod;
  step: number;
}

const SeparationSim = ({ method, step }: SimProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const [clogged, setClogged] = useState(false);
  const cloggedRef = useRef(false);
  
  const [tapOpen, setTapOpen] = useState(false);
  const tapOpenRef = useRef(false);
  const tapStopperRef = useRef<Matter.Body | null>(null);

  const [temperature, setTemperature] = useState(25);
  const tempRef = useRef(25);
  
  const magnetPosRef = useRef({ x: 225, y: 100 });
  const magnetDOMRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     setTapOpen(false);
     tapOpenRef.current = false;
     setTemperature(25);
     tempRef.current = 25;
  }, [step, method]);

  useEffect(() => {
     const handleMouseMove = (e: MouseEvent) => {
        if (!canvasRef.current || method !== 'magnetisme' || step < 1) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const ax = e.clientX - rect.left;
        const ay = e.clientY - rect.top;
        magnetPosRef.current = { x: ax, y: ay };
        
        if (magnetDOMRef.current) {
           magnetDOMRef.current.style.left = `${ax - 32}px`;
           magnetDOMRef.current.style.top = `${ay - 32}px`;
        }
     };
     window.addEventListener('mousemove', handleMouseMove);
     return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [method, step]);

  useEffect(() => {
    tapOpenRef.current = tapOpen;
    if (engineRef.current && tapStopperRef.current) {
        if (tapOpen) {
           Matter.World.remove(engineRef.current.world, tapStopperRef.current);
        } else {
           Matter.World.add(engineRef.current.world, tapStopperRef.current);
        }
    }
  }, [tapOpen]);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    setClogged(false);
    cloggedRef.current = false;
    tapStopperRef.current = null;

    const engine = Matter.Engine.create();
    engineRef.current = engine;
    const render = Matter.Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width: 450,
        height: 380, // slightly taller to fit cup
        wireframes: false,
        background: 'transparent',
      }
    });

    const world = engine.world;

    if (method === 'filtracio') {
      const WALL_CAT = 0x0001;
      const WATER_CAT = 0x0002;
      const SAND_CAT = 0x0004;
      const FILTER_CAT = 0x0008;

      const commonWallProps = { 
        isStatic: true, 
        render: { fillStyle: '#94a3b8' },
        collisionFilter: { category: WALL_CAT }
      };

      const glassProps = { 
        isStatic: true, 
        render: { fillStyle: 'rgba(241, 245, 249, 0.4)', strokeStyle: '#cbd5e1', lineWidth: 2 },
        collisionFilter: { category: WALL_CAT }
      };

      const leftPart = Matter.Bodies.rectangle(155, 120, 180, 10, { ...commonWallProps, angle: Math.PI/3.5 });
      const rightPart = Matter.Bodies.rectangle(295, 120, 180, 10, { ...commonWallProps, angle: -Math.PI/3.5 });
      const cup = [
        Matter.Bodies.rectangle(225, 360, 120, 10, glassProps),
        Matter.Bodies.rectangle(165, 305, 10, 120, glassProps),
        Matter.Bodies.rectangle(285, 305, 10, 120, glassProps),
      ];
      // Make filter paper wider to cover the whole opening
      const filterPaper = Matter.Bodies.rectangle(225, 190, 80, 6, { 
        isStatic: true, 
        render: { fillStyle: '#fff', strokeStyle: '#e2e8f0', lineWidth: 1 },
        collisionFilter: { category: FILTER_CAT, mask: SAND_CAT } // only collides with sand
      });
      
      // Funnel tip moved up and inward slightly to connect with the sloped walls
      const funnelTip1 = Matter.Bodies.rectangle(205, 225, 6, 60, commonWallProps);
      const funnelTip2 = Matter.Bodies.rectangle(245, 225, 6, 60, commonWallProps);

      Matter.World.add(world, [leftPart, rightPart, funnelTip1, funnelTip2, filterPaper, ...cup]);

      let count = 0;
      
      if (step >= 1) {
        // Spawn gradually
        const maxDrops = 100; // Total drops to spawn
        const interval = setInterval(() => {
          if (count < maxDrops) {
             const isWaterDrop = Math.random() > 0.4;
             if (isWaterDrop) {
               const water = Matter.Bodies.circle(210 + Math.random()*30, 20, 3, { 
                   render: { fillStyle: '#3b82f6' }, 
                   label: 'water', restitution: 0.1, friction: 0.001, density: 0.001,
                   collisionFilter: { category: WATER_CAT, mask: WALL_CAT | WATER_CAT | FILTER_CAT }
               });
               Matter.World.add(world, water);
             } else {
               const sand = Matter.Bodies.circle(200 + Math.random()*50, 20, 6, { 
                   render: { fillStyle: '#a8a29e' }, 
                   label: 'sand', restitution: 0.1, friction: 0.8, density: 0.05,
                   collisionFilter: { category: SAND_CAT, mask: WALL_CAT | WATER_CAT | SAND_CAT | FILTER_CAT }
               });
               Matter.World.add(world, sand);
             }
             count++;
          } else {
             clearInterval(interval);
          }
        }, 60);
      }

      Matter.Events.on(engine, 'beforeUpdate', () => {
        const bodies = Matter.Composite.allBodies(world);
        
        if (step >= 1 && count >= 30 && !cloggedRef.current) {
           const sands = bodies.filter(b => b.label === 'sand' && b.position.y > 170);
           if (sands.length > 20) {
               cloggedRef.current = true;
               setClogged(true);
           }
        }

        if (step === 1) {
           // Prevent water from going past paper in step 1
           bodies.forEach(b => {
             if (b.label === 'water' && b.position.y > 185) {
               Matter.Body.setPosition(b, { x: b.position.x, y: 180 });
               Matter.Body.setVelocity(b, { x: 0, y: 0 });
             }
           });
        }
        
        if (step === 2) {
           // In step 3 (2), water should gently fall through the filter paper.
           bodies.forEach(b => {
             if (b.label === 'water' && b.position.y > 175 && b.position.y < 200 && Math.abs(b.position.x - 225) < 40) {
               // Push water slowly downwards through the paper
               Matter.Body.setPosition(b, { x: 225 + (Math.random()-0.5)*10, y: b.position.y + 1 });
               Matter.Body.setVelocity(b, { x: 0, y: 0.5 });
               
               // Avoid sleeping
               Matter.Sleeping.set(b, false);
             }
           });
        }
      });
    } else if (method === 'evaporacio') {
      const glassProps = { 
        isStatic: true, 
        render: { fillStyle: 'rgba(241, 245, 249, 0.4)', strokeStyle: '#cbd5e1', lineWidth: 2 }
      };
      
      const bowl = [
        Matter.Bodies.rectangle(225, 310, 200, 10, glassProps),
        Matter.Bodies.rectangle(125, 275, 10, 80, glassProps),
        Matter.Bodies.rectangle(325, 275, 10, 80, glassProps),
      ];
      Matter.World.add(world, bowl);

      // Add particles
      for(let i=0; i<120; i++) {
         const isW = Math.random() > 0.2; // mostly water
         
         // If we are in step 2 (final), water is already gone. Do not add water.
         if (step === 2 && isW) continue;

         Matter.World.add(world, Matter.Bodies.circle(225+(Math.random()-0.5)*150, 240+Math.random()*60, 5, {
           render: { fillStyle: isW ? '#60a5fa' : '#ffffff' }, label: isW ? 'water' : 'salt',
           friction: 0.1, restitution: 0.5
         }));
      }

      Matter.Events.on(engine, 'beforeUpdate', () => {
        const bodies = Matter.Composite.allBodies(world);
        
        if (step >= 1) {
          if (tempRef.current < 100) {
             const oldT = Math.floor(tempRef.current);
             tempRef.current += 0.2;
             const newT = Math.floor(tempRef.current);
             if (oldT !== newT) setTemperature(newT);
          }

          bodies.forEach(b => {
             if (b.label === 'water' || b.label === 'evaporating_water') {
                if (step === 1 && tempRef.current >= 100) {
                   if (b.label === 'water' && Math.random() > 0.995) {
                       b.label = 'evaporating_water';
                   }
                   if (b.label === 'evaporating_water') {
                       // Smoothly evaporate upwards by directly setting velocity
                       Matter.Body.setVelocity(b, { 
                           x: b.velocity.x * 0.95 + (Math.random()-0.5)*0.2, 
                           y: -0.8 
                       });
                       if (b.position.y < -50) {
                          Matter.World.remove(world, b);
                       }
                   }
                } else if (Math.random() > 0.9 && b.position.y > 280) {
                   // Gentle convection before boiling
                   Matter.Body.applyForce(b, b.position, { x: (Math.random()-0.5)*0.0002, y: -0.00005 * (tempRef.current/25) });
                }
             }
          });
        }
      });
    } else if (method === 'magnetisme') {
      const tray = Matter.Bodies.rectangle(225, 320, 300, 20, { isStatic: true, render: { fillStyle: '#94a3b8' } });
      const leftWall = Matter.Bodies.rectangle(85, 290, 20, 80, { isStatic: true, render: { fillStyle: '#94a3b8' } });
      const rightWall = Matter.Bodies.rectangle(365, 290, 20, 80, { isStatic: true, render: { fillStyle: '#94a3b8' } });
      Matter.World.add(world, [tray, leftWall, rightWall]);

      for(let i=0; i<100; i++) {
        const isI = Math.random() > 0.4;
        Matter.World.add(world, Matter.Bodies.circle(225+(Math.random()-0.5)*240, 280+Math.random()*20, 6, {
          render: { fillStyle: isI ? '#cbd5e1' : '#a8a29e' }, // iron lighter silver, sand darker
          label: isI ? 'iron' : 'sand',
          density: isI ? 0.05 : 0.01 // Iron is heavier
        }));
      }

      if (step >= 1) {
        Matter.Events.on(engine, 'beforeUpdate', () => {
          Matter.Composite.allBodies(world).filter(b => b.label === 'iron').forEach(iron => {
            const dx = magnetPosRef.current.x - iron.position.x;
            const dy = magnetPosRef.current.y - iron.position.y;
            const distSq = dx*dx + dy*dy;
            
            if (iron.isSleeping) {
               Matter.Sleeping.set(iron, false);
            }
            
            if (distSq < 180 * 180) { // within 180px
               if (distSq < 60 * 60) {
                  // Very close: stick to magnet strongly and damp velocity
                  Matter.Body.applyForce(iron, iron.position, { 
                     x: dx * 0.002, 
                     y: dy * 0.002 - 0.05 // counter gravity strongly
                  });
                  Matter.Body.setVelocity(iron, { 
                     x: iron.velocity.x * 0.1, 
                     y: iron.velocity.y * 0.1 
                  });
               } else {
                  // Pull towards magnet
                  Matter.Body.applyForce(iron, iron.position, { x: dx*0.00005, y: dy*0.00008 });
               }
            }
          });
        });
      }
    } else if (method === 'decantacio') {
       const glassProps = { 
         isStatic: true, 
         render: { fillStyle: 'rgba(241, 245, 249, 0.4)', strokeStyle: '#cbd5e1', lineWidth: 2 }
       };
       
       const leftWall = Matter.Bodies.rectangle(175, 140, 10, 160, glassProps);
       const rightWall = Matter.Bodies.rectangle(275, 140, 10, 160, glassProps);
       // Angled bottom funnels
       const funnelL = Matter.Bodies.rectangle(192.5, 237.5, 54, 10, { isStatic: true, angle: Math.PI/4, render: glassProps.render });
       const funnelR = Matter.Bodies.rectangle(257.5, 237.5, 54, 10, { isStatic: true, angle: -Math.PI/4, render: glassProps.render });
       
       // Tap walls
       const tapL = Matter.Bodies.rectangle(210, 275, 10, 40, { isStatic: true, render: glassProps.render });
       const tapR = Matter.Bodies.rectangle(240, 275, 10, 40, { isStatic: true, render: glassProps.render });

       // Cup at the bottom
       const cup = [
          Matter.Bodies.rectangle(225, 360, 100, 10, glassProps),
          Matter.Bodies.rectangle(180, 335, 10, 60, glassProps),
          Matter.Bodies.rectangle(270, 335, 10, 60, glassProps)
       ];

       const tapStopper = Matter.Bodies.rectangle(225, 275, 20, 10, { isStatic: true, render: { fillStyle: '#ef4444' } });
       tapStopperRef.current = tapStopper;

       // Important: if tapOpen is false initially, add it right away. 
       // but we set tapOpen to false when switching methods, so it should be false.
       Matter.World.add(world, [leftWall, rightWall, funnelL, funnelR, tapL, tapR, tapStopper, ...cup]);

       for(let i=0; i<80; i++){
         const isO = i % 2 === 0;
         const renderColor = isO ? '#fbbf24' : '#3b82f6';
         // spawn water at the bottom (150-230) and oil at the top (70-150)
         const px = 185 + Math.random() * 80;
         const py = isO ? 70 + Math.random() * 80 : 150 + Math.random() * 80;
         const p = Matter.Bodies.circle(px, py, 6, {
           render: { fillStyle: renderColor, lineWidth: 1, strokeStyle: isO ? '#d97706' : '#2563eb' }, 
           label: isO ? 'oil' : 'water', 
           density: isO ? 0.0005 : 0.002, // increased density difference
           friction: 0.1,
           restitution: 0.1
         });
         Matter.World.add(world, p);
       }

       Matter.Events.on(engine, 'beforeUpdate', () => {
         const bodies = Matter.Composite.allBodies(world);
         const waters = bodies.filter(b => b.label === 'water');
         const oils = bodies.filter(b => b.label === 'oil');

         if (step >= 1) {
            // Apply gentle buoyancy only if particles are mixed up, 
            // no flying out of the bottle.
            oils.forEach(oil => {
               if (oil.position.y > 160 && oil.position.y < 260) {
                 Matter.Body.applyForce(oil, oil.position, { x: 0, y: -0.00004 });
               }
            });
            waters.forEach(w => {
               if (w.position.y < 160 && w.position.y > 60) {
                 Matter.Body.applyForce(w, w.position, { x: 0, y: 0.00004 });
               }
            });
         }
       });
    } else if (method === 'tamisatge') {
       const WALL_CAT = 0x0001;
       const ROCK_CAT = 0x0002;
       const SAND_CAT = 0x0004;
       const SIEVE_CAT = 0x0008;

       const sieveParts = [];
       for (let i = 0; i < 20; i++) {
         sieveParts.push(Matter.Bodies.rectangle(145 + i * 8.4, 200, 4, 10, { 
           isStatic: true, 
           render: { fillStyle: '#fb923c', strokeStyle: '#ea580c', lineWidth: 1 },
           collisionFilter: { category: SIEVE_CAT, mask: ROCK_CAT } // only stops rocks
         }));
       }

       const glassProps = { 
         isStatic: true, 
         render: { fillStyle: 'rgba(241, 245, 249, 0.4)', strokeStyle: '#cbd5e1', lineWidth: 2 },
         collisionFilter: { category: WALL_CAT }
       };

       const leftWall = Matter.Bodies.rectangle(140, 180, 10, 50, glassProps);
       const rightWall = Matter.Bodies.rectangle(310, 180, 10, 50, glassProps);

       const cup = [
          Matter.Bodies.rectangle(225, 360, 160, 10, glassProps),
          Matter.Bodies.rectangle(150, 310, 10, 110, glassProps),
          Matter.Bodies.rectangle(300, 310, 10, 110, glassProps)
       ];

       Matter.World.add(world, [...sieveParts, leftWall, rightWall, ...cup]);

       let count = 0;
       
       if (step >= 1) {
          const maxParticles = step === 1 ? 40 : 80;
          const interval = setInterval(() => {
            if (count < maxParticles) {
               const isRock = Math.random() > 0.6;
               if (isRock) {
                 const rock = Matter.Bodies.polygon(200 + Math.random()*50, 50, 5 + Math.floor(Math.random()*3), 10, { 
                     render: { fillStyle: '#64748b' }, 
                     label: 'rock', restitution: 0.1, friction: 0.8, density: 0.05,
                     collisionFilter: { category: ROCK_CAT, mask: WALL_CAT | ROCK_CAT | SAND_CAT | SIEVE_CAT }
                 });
                 Matter.World.add(world, rock);
               } else {
                 const sand = Matter.Bodies.circle(200 + Math.random()*50, 50, 4, { 
                     render: { fillStyle: '#d6d3d1' }, 
                     label: 'sand', restitution: 0.1, friction: 0.8, density: 0.05,
                     collisionFilter: { category: SAND_CAT, mask: WALL_CAT | ROCK_CAT | SAND_CAT } // Misses sieve
                 });
                 Matter.World.add(world, sand);
               }
               count++;
            } else {
               clearInterval(interval);
            }
          }, 60);
       }

       Matter.Events.on(engine, 'beforeUpdate', () => {
         const time = engine.timing.timestamp;
         if (step === 2) {
            // Shake the sieve gently
            const offset = Math.sin(time*0.015) * 10;
            sieveParts.forEach((part, index) => {
               Matter.Body.setPosition(part, { x: 145 + index * 8.4 + offset, y: 200 });
            });
         } else if (step === 1) {
            const bodies = Matter.Composite.allBodies(world);
            bodies.forEach(b => {
               if (b.label === 'sand' && b.position.y > 185) {
                 Matter.Body.setPosition(b, { x: b.position.x, y: 180 });
                 Matter.Body.setVelocity(b, { x: 0, y: 0 });
               }
            });
         }
       });
    } else if (method === 'destilacio') {
       const glassProps = { 
         isStatic: true, 
         render: { fillStyle: 'rgba(241, 245, 249, 0.4)', strokeStyle: '#cbd5e1', lineWidth: 2 },
         collisionFilter: { category: 0x0001 }
       };
       // First flask (left), closed at top
       const flask1 = [
         Matter.Bodies.rectangle(100, 320, 100, 10, glassProps), // bottom
         Matter.Bodies.rectangle(55, 215, 10, 220, glassProps),  // left (105 to 325)
         Matter.Bodies.rectangle(100, 110, 100, 10, glassProps), // top
         Matter.Bodies.rectangle(145, 235, 10, 170, glassProps), // bottom right (150 to 320)
       ];
       
       // Tube connecting them (angled downward to right)
       const angle = Math.PI / 12;
       const tube = [
         Matter.Bodies.rectangle(245, 145, 200, 10, { ...glassProps, angle }), // top tube
         Matter.Bodies.rectangle(245, 175, 200, 10, { ...glassProps, angle })  // bottom tube
       ];

       const condenser = [
         Matter.Bodies.rectangle(245, 160, 150, 45, { 
             isStatic: true, angle,
             collisionFilter: { group: -1, mask: 0 },
             render: { fillStyle: 'rgba(59, 130, 246, 0.15)', strokeStyle: 'rgba(59, 130, 246, 0.5)', lineWidth: 2 }
         })
       ];
       
       // Second flask (right)
       const flask2 = [
         Matter.Bodies.rectangle(380, 320, 80, 10, glassProps),  // bottom
         Matter.Bodies.rectangle(345, 265, 10, 110, glassProps), // lower left
         Matter.Bodies.rectangle(415, 225, 10, 190, glassProps), // right wall
         Matter.Bodies.rectangle(380, 130, 80, 10, glassProps),  // top
         Matter.Bodies.rectangle(345, 150, 10, 40, glassProps),  // upper left
       ];
       
       Matter.World.add(world, [...flask1, ...tube, ...condenser, ...flask2]);
       
       for(let i=0; i<100; i++) {
          const isAlc = Math.random() > 0.5;
          Matter.World.add(world, Matter.Bodies.circle(100+(Math.random()-0.5)*60, 290+Math.random()*20, 4, {
             render: { fillStyle: isAlc ? '#a78bfa' : '#3b82f6' },
             label: isAlc ? 'alcohol' : 'water',
             restitution: 0.1, friction: 0.1
          }));
       }
       
       Matter.Events.on(engine, 'beforeUpdate', () => {
          if (step >= 1) {
             const maxTemp = method === 'destilacio' ? 80 : 100;
             if (tempRef.current < maxTemp) {
                 const oldT = Math.floor(tempRef.current);
                 tempRef.current += 0.2;
                 const newT = Math.floor(tempRef.current);
                 if (oldT !== newT) setTemperature(newT);
             }

             const bodies = Matter.Composite.allBodies(world);
             bodies.forEach(b => {
                if (b.label === 'alcohol' || b.label === 'evaporating_alcohol') {
                   if (tempRef.current >= 78) {
                      if (b.label === 'alcohol' && Math.random() > 0.995 && b.position.x < 140) {
                           b.label = 'evaporating_alcohol';
                      }
                      
                      if (b.label === 'evaporating_alcohol') {
                           // Anti-gravity to prevent falling while evaporating
                           Matter.Body.applyForce(b, b.position, { x: 0, y: -0.001 * b.mass }); // counteract gravity
                           
                           if (b.position.y > 140 && b.position.x < 150) {
                              // Still in first flask, move up smoothly
                              Matter.Body.setVelocity(b, { 
                                  x: b.velocity.x * 0.9 + (100 - b.position.x)*0.015, // gently center 
                                  y: -1.0 
                              });
                           } else if (b.position.x < 370) {
                              // Reached tube opening height, start moving right steadily along the tube
                              Matter.Body.applyForce(b, b.position, { 
                                  x: 0.0004, 
                                  y: 0.0002 
                              });
                              // Limit max velocity
                              if (b.velocity.x > 2) Matter.Body.setVelocity(b, { x: 2, y: b.velocity.y });
                           }
                           
                           if (b.position.x > 365) {
                              // Condensed in second flask, back to liquid
                              b.label = 'alcohol';
                           }
                      }
                   }
                   if (b.label === 'alcohol' && Math.random() > 0.9 && b.position.y > 280 && b.position.x < 145) {
                      // Gentle convection before boiling
                      Matter.Body.applyForce(b, b.position, { x: (Math.random()-0.5)*0.0002, y: -0.00005 * (tempRef.current/25) });
                   }
                }
                
                if (b.label === 'water') {
                   if (Math.random() > 0.9 && b.position.y > 280 && b.position.x < 145) {
                      Matter.Body.applyForce(b, b.position, { x: (Math.random()-0.5)*0.0002, y: -0.00005 * (tempRef.current/25) });
                   }
                }
             });
          }
       });
    } else if (method === 'centrifugacio') {
       const glassProps = { 
         render: { fillStyle: 'rgba(241, 245, 249, 0.4)', strokeStyle: '#cbd5e1', lineWidth: 2 }
       };
       const rect = (x:number,y:number,w:number,h:number) => Matter.Bodies.rectangle(x,y,w,h,glassProps);
       
       const pivotCenter = { x: 225, y: 175 };
       // Tube constructed precisely
       const tubeParts = [
          rect(pivotCenter.x, pivotCenter.y + 130, 80, 40),      // bottom thick
          rect(pivotCenter.x - 35, pivotCenter.y + 40, 40, 220), // left thick
          rect(pivotCenter.x + 35, pivotCenter.y + 40, 40, 220), // right thick
          rect(pivotCenter.x, pivotCenter.y - 50, 80, 40)        // top cap thick
       ];
       
       const tubeBody = Matter.Body.create({ parts: tubeParts, frictionAir: 0.01 }); // rotating object

       const constraint = Matter.Constraint.create({ 
           pointA: pivotCenter,
           bodyB: tubeBody,
           pointB: { x: 0, y: -40 }, // top of tube connects to pivot securely without shifting the body
           stiffness: 1, length: 0
       });
       
       Matter.World.add(world, [tubeBody, constraint]);
       const centerMotor = Matter.Bodies.circle(pivotCenter.x, pivotCenter.y, 15, { isStatic: true, render: { fillStyle: '#334155' } });
       Matter.World.add(world, centerMotor);
       
       for(let i=0; i<150; i++) {
          const isHeavy = Math.random() > 0.7; // Red blood cells
          Matter.World.add(world, Matter.Bodies.circle(pivotCenter.x + (Math.random()-0.5)*20, pivotCenter.y + 40 + Math.random()*60, 4, {
             render: { fillStyle: isHeavy ? '#ef4444' : '#fef08a' },
             label: isHeavy ? 'heavy' : 'light',
             friction: 0.1, restitution: 0.2,
             density: 0.002 // Set same density initially to stay mixed
          }));
       }
       
       Matter.Events.on(engine, 'beforeUpdate', () => {
          if (step === 1 || step === 2) {
             let oldAngle = tubeBody.angle;
             let newAngle = oldAngle;

             if (step === 1) {
                 Matter.Body.setAngularVelocity(tubeBody, 0.2);
                 newAngle = tubeBody.angle;
             } else {
                 newAngle = oldAngle * 0.92;
                 Matter.Body.setAngle(tubeBody, newAngle);
                 Matter.Body.setAngularVelocity(tubeBody, 0);
                 
                 const dTh = newAngle - oldAngle;
                 const cosD = Math.cos(dTh);
                 const sinD = Math.sin(dTh);
                 const allBodies = Matter.Composite.allBodies(world);
                 allBodies.forEach(b => {
                    if (b.label === 'heavy' || b.label === 'light') {
                        const drx = b.position.x - pivotCenter.x;
                        const dry = b.position.y - pivotCenter.y;
                        const nx = drx * cosD - dry * sinD;
                        const ny = drx * sinD + dry * cosD;
                        Matter.Body.setPosition(b, { x: pivotCenter.x + nx, y: pivotCenter.y + ny });
                        const vx = b.velocity.x * cosD - b.velocity.y * sinD;
                        const vy = b.velocity.x * sinD + b.velocity.y * cosD;
                        Matter.Body.setVelocity(b, { x: vx, y: vy });
                    }
                 });
             }

             const cosA = Math.cos(newAngle);
             const sinA = Math.sin(newAngle);
             const bodies = Matter.Composite.allBodies(world);

             bodies.forEach(b => {
                if (b.label === 'heavy' || b.label === 'light') {
                   
                   let dx = b.position.x - pivotCenter.x;
                   let dy = b.position.y - pivotCenter.y;
                   
                   let lx = dx * cosA + dy * sinA;
                   let ly = -dx * sinA + dy * cosA;
                   
                   let clamped = false;
                   
                   if (step === 1) {
                       // Heavy goes to exterior (bottom of tube), light to interior (top)
                       let forceMag = b.label === 'heavy' ? 0.002 : -0.001;
                       
                       // Gently slide them past each other to prevent jamming
                       let targetLy = ly;
                       if (b.label === 'light' && ly > 20) targetLy -= 0.5;
                       if (b.label === 'heavy' && ly < 75) targetLy += 0.5;
                       if (targetLy !== ly) {
                           ly = targetLy;
                           clamped = true;
                       }

                       Matter.Body.applyForce(b, b.position, { 
                           x: forceMag * -sinA, 
                           y: forceMag * cosA 
                       });
                       
                       Matter.Body.setDensity(b, b.label === 'heavy' ? 0.02 : 0.0005);
                       Matter.Body.setVelocity(b, { x: b.velocity.x * 0.95, y: b.velocity.y * 0.95 });
                   } else if (step === 2) {
                       // Instantly ensure separation for step 3 if jumping directly
                       let targetLy = ly;
                       if (b.label === 'light' && ly > 35) targetLy -= 3;
                       if (b.label === 'heavy' && ly < 65) targetLy += 3;
                       
                       if (targetLy !== ly) {
                           ly = targetLy;
                           clamped = true;
                       }
                       
                       // Keep them pressed to their sides
                       let forceY = 0;
                       if (b.label === 'light') forceY = -0.0005 * b.mass;
                       if (b.label === 'heavy') forceY = 0.0005 * b.mass;
                       Matter.Body.applyForce(b, b.position, { x: 0, y: forceY });
                       Matter.Body.setVelocity(b, { x: b.velocity.x * 0.9, y: b.velocity.y * 0.9 });
                   }
                   
                   // Strict bounds inside the tube
                   if (lx < -12) { lx = -12; clamped = true; }
                   if (lx > 12) { lx = 12; clamped = true; }
                   if (ly < -25) { ly = -25; clamped = true; }
                   if (ly > 105) { ly = 105; clamped = true; }
                   
                   if (clamped) {
                       const newX = pivotCenter.x + lx * cosA - ly * sinA;
                       const newY = pivotCenter.y + lx * sinA + ly * cosA;
                       Matter.Body.setPosition(b, { x: newX, y: newY });
                       Matter.Body.setVelocity(b, { x: b.velocity.x * 0.5, y: b.velocity.y * 0.5 });
                   }
                }
             });
          }
       });
    }

    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, [method, step]);

  return (
    <div className="relative w-full h-[350px] bg-slate-50/50 rounded-2xl border border-slate-200 overflow-hidden shadow-inner flex items-center justify-center">
       <div ref={canvasRef} className="absolute inset-0" />
       
       <AnimatePresence>
         {clogged && method === 'filtracio' && (
           <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: -10 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              className="absolute top-4 left-4 bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-2 border border-orange-200"
           >
              <AlertCircle className="w-4 h-4" /> Filtre saturat
           </motion.div>
         )}
         {(method === 'evaporacio' || method === 'destilacio') && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-2 rounded-xl shadow-md flex items-center gap-2 border border-slate-200"
           >
             <Thermometer className={cn("w-5 h-5", (method === 'evaporacio' && temperature >= 100) || (method === 'destilacio' && temperature >= 78) ? "text-red-500 animate-pulse" : "text-slate-500")} />
             <span className="font-mono font-bold text-lg">{temperature} °C</span>
           </motion.div>
         )}
       </AnimatePresence>

       {method === 'magnetisme' && step >= 1 && (
         <div 
           ref={magnetDOMRef}
           className="absolute pointer-events-none z-20"
           style={{
             top: magnetPosRef.current.y - 32,
             left: magnetPosRef.current.x - 32,
           }}
         >
           <Magnet className="w-16 h-16 text-rose-500 fill-rose-100 rotate-180 drop-shadow-lg" />
         </div>
       )}
       {method === 'evaporacio' && step >= 1 && (
         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 z-20">
           <div className="w-2 h-6 bg-red-500 rounded-t-full shadow-[0_0_15px_#ef4444] animate-pulse"></div>
           <div className="w-3 h-8 bg-orange-400 rounded-t-full shadow-[0_0_15px_#f97316] animate-pulse delay-75"></div>
           <div className="w-2 h-5 bg-yellow-400 rounded-t-full shadow-[0_0_15px_#eab308] animate-pulse delay-150"></div>
         </div>
       )}
       {method === 'destilacio' && step >= 1 && (
         <div className="absolute bottom-4 left-[100px] -translate-x-1/2 flex items-center justify-center gap-1 z-20">
           <div className="w-2 h-6 bg-red-500 rounded-t-full shadow-[0_0_15px_#ef4444] animate-pulse"></div>
           <div className="w-3 h-8 bg-orange-400 rounded-t-full shadow-[0_0_15px_#f97316] animate-pulse delay-75"></div>
           <div className="w-2 h-5 bg-yellow-400 rounded-t-full shadow-[0_0_15px_#eab308] animate-pulse delay-150"></div>
         </div>
       )}

       {method === 'decantacio' && step >= 2 && (
         <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
            <button 
               onClick={() => setTapOpen(!tapOpen)}
               className={cn("px-4 py-2 rounded-xl font-bold shadow-md transition-colors text-white", tapOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600')}
            >
               {tapOpen ? 'Tancar Aixeta' : 'Obrir Aixeta'}
            </button>
         </div>
       )}
    </div>
  );
};

export default function SeparacioView() {
  const [activeMethod, setActiveMethod] = useState<SeparationMethod | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const methods = [
    {
      id: 'filtracio',
      title: 'Filtració',
      icon: Filter,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'L\'embut i el paper de filtre ajuden a...',
      steps: [
        'Hem preparat un embut i a dins hi posem un tros de paper de filtre escolar.',
        'Aboquem un got brut amb aigua i sorra mesclada a l\'interior.',
        'Les gotes d\'aigua minúscules travessen els forats, i tota la sorra es queda "atrapada" al paper!'
      ]
    },
    {
      id: 'decantacio',
      title: 'Decantació',
      icon: ArrowDownToLine,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      description: 'Fem servir l\'embut de decantació si...',
      steps: [
        'Hem barrejat oli i aigua en un pot... Toca esperar i deixar-ho reposar detingudament.',
        'L\'oli pesa menys (és menys dens) i poc a poc crea una altra fase pujant fins a nedar a la superfície.',
        'Obre lentament l\'aixeta inferior de l\'embut, per deixar caure tota l\'aigua sense barrejar un cop més!'
      ]
    },
    {
      id: 'evaporacio',
      title: 'Evaporació o Cristal·lització',
      icon: Sun,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      description: 'Si engegues un foc per escalfar...',
      steps: [
        'Aboquem aigua de mar (aigua amb sal dissolta) a dins la calor de l\'erlenmeyer.',
        'Amb temperatures altes l\'aigua canvia a gas i s\'evapora formant ximenera cap amunt.',
        'Un cop tota s\'ha assecat, només ens quedarà la màgia de fons... vidres perfectament quadrats de sal!'
      ]
    },
    {
      id: 'magnetisme',
      title: 'Magnetisme Imant',
      icon: Magnet,
      color: 'bg-slate-100 text-slate-800 border-slate-300',
      description: 'Utilitza un imant quan tinguis...',
      steps: [
        'Sorpresa! Algú ha barrejat voluminoses molles de ferro pur de taller amb tota la sorra d\'un pot petit.',
        'Apropar un potent i net imant de ferradura ens farà el treball de separar sense emprar pas ni els dits!',
        'El camp magnètic atrau als trossos forts metàl·lics de seguida desenterrant-los sense esforç.'
      ]
    },
    {
      id: 'tamisatge',
      title: 'Tamisatge (Garbellat)',
      icon: Grid3X3,
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      description: 'Fem servir un garbell o tamís per...',
      steps: [
        'Tenim una mescla sòlida de diferents mides de gra, per exemple pedres grosses i sorra fina.',
        'Aboquem a poc a poc la mescla sobre el tamís superior.',
        'Llisquem suaument! El garbell té petits forats (malla) que permeten a la sorra fina caure lliurement, però les pedres grosses no hi caben i es queden atrapades a dalt.'
      ]
    },
    {
      id: 'destilacio',
      title: 'Destil·lació',
      icon: Droplets,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      description: 'Separem líquids miscibles amb diferent punt d\'ebullició...',
      steps: [
        'Escalfem una mescla de dos líquids (aigua i alcohol) al matràs inicial.',
        'L\'alcohol té un punt d\'ebullició menor (78ºC) i s\'evapora primer, pujant en forma de gas pel tub.',
        'Al passar pel refrigerant es condensa i cau líquid pur en un pot separat, deixant l\'aigua al primer!'
      ]
    },
    {
      id: 'centrifugacio',
      title: 'Centrifugació',
      icon: RefreshCw,
      color: 'bg-teal-50 text-teal-700 border-teal-200',
      description: 'Girem la mescla ràpidament per separar per densitat...',
      steps: [
        'Tenim un tub d\'assaig amb una suspensió (com sang o un precipitat molt fi i tèrbol).',
        'Fem girar la centrifugadora a grans velocitats generant força centrípeta.',
        'Les partícules més denses es veuen forçades al fons del tub immediatament, separant-se del líquid clar a dalt!'
      ]
    }
  ];

  const handleSelect = (id: string) => {
    setActiveMethod(id as SeparationMethod);
    setCurrentStep(0);
  };

  const methodData = methods.find(m => m.id === activeMethod);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Laboratori de Separació</h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Ep! Anem a posar-nos la bata de científic i anem a separar totes aquelles coses que es barregen.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {methods.map((m) => (
          <button
            key={m.id}
            onClick={() => handleSelect(m.id)}
            className={cn(
              "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
              activeMethod === m.id ? "bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105" : "bg-white border-slate-100 text-slate-600 hover:border-indigo-200"
            )}
          >
            <m.icon className="w-6 h-6" />
            <span className="font-bold text-sm">{m.title}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeMethod && methodData && (
          <motion.div
            key={activeMethod}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white p-8 lg:p-12 rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden relative"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">{methodData.title}</h3>
                  <p className="text-slate-500 font-medium">{methodData.description}</p>
                </div>

                <div className="space-y-4">
                   {methodData.steps.map((s, i) => (
                     <div key={i} className={cn(
                       "flex gap-4 p-4 rounded-2xl border transition-all",
                       currentStep === i ? "bg-indigo-50 border-indigo-200 text-indigo-900 shadow-sm scale-102" : "opacity-40 border-slate-100"
                     )}>
                        <div className="w-8 h-8 rounded-xl bg-white border border-current flex items-center justify-center font-black shrink-0">
                          {i + 1}
                        </div>
                        <p className="font-medium leading-relaxed">{s}</p>
                     </div>
                   ))}
                </div>

                <div className="flex gap-4">
                  <button
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep(s => s - 1)}
                    className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-200 font-bold disabled:opacity-20 transition-all hover:bg-slate-50"
                  >
                    Anterior
                  </button>
                  <button
                    disabled={currentStep === methodData.steps.length - 1}
                    onClick={() => setCurrentStep(s => s + 1)}
                    className="flex-1 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold disabled:opacity-20 transition-all hover:bg-slate-700"
                  >
                    Següent Pas
                  </button>
                </div>
              </div>

              <div className="bg-slate-100 p-4 rounded-[2rem] border border-slate-200">
                <SeparationSim method={activeMethod} step={currentStep} />
                <div className="mt-4 flex items-center justify-between px-2">
                   <div className="flex gap-1.5">
                      {[0,1,2].map(i => (
                        <div key={i} className={cn("w-2 h-2 rounded-full", i <= currentStep ? "bg-indigo-600" : "bg-slate-300")} />
                      ))}
                   </div>
                   <button onClick={() => setCurrentStep(0)} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
                     Reiniciar simulació
                   </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
