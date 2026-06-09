import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { GameEngine } from '../game/Engine';
import { render } from '../game/Renderer';
import { LEVELS } from '../game/levels';
import { GameCanvas } from './GameCanvas';

function BodyPropertyPanel({ body, engineWorld, engine, setBodyId }: { body: any, engineWorld: Matter.World, engine: Matter.Engine, setBodyId: (id: number) => void }) {
    const baseW = body.plugin?.width || Math.round(body.bounds.max.x - body.bounds.min.x);
    const baseH = body.plugin?.height || Math.round(body.bounds.max.y - body.bounds.min.y);
    const baseSides = body.plugin?.sides || (body.label === 'stone' ? 6 : undefined);

    const [w, setW] = useState(baseW);
    const [h, setH] = useState(baseH);
    const [angle, setAngle] = useState(Math.round(body.angle * 180 / Math.PI));
    const [sides, setSides] = useState(baseSides);
    const [isStatic, setIsStatic] = useState(body.isStatic);

    useEffect(() => {
        setW(body.plugin?.width || Math.round(body.bounds.max.x - body.bounds.min.x));
        setH(body.plugin?.height || Math.round(body.bounds.max.y - body.bounds.min.y));
        setAngle(Math.round(body.angle * 180 / Math.PI));
        setSides(body.plugin?.sides || (body.label === 'stone' ? 6 : undefined));
        setIsStatic(body.isStatic);
    }, [body.id, body.label]);

    const commitChanges = (newW: number, newH: number, newAngle: number, newSides: number | undefined, newIsStatic: boolean, customVerts?: any) => {
        // Mutate the existing body in-place for smooth live updating
        let tempBody;
        const verts = customVerts || body.plugin?.customVertices;
        if (body.label === 'stone') {
             if (verts) {
                 try {
                     tempBody = Matter.Bodies.fromVertices(body.position.x, body.position.y, [verts]);
                 } catch(e) {
                     tempBody = null;
                 }
                 // Fallback if fromVertices fails (it sometimes does for complex or invalid polygons)
                 if (!tempBody) {
                     tempBody = Matter.Bodies.polygon(body.position.x, body.position.y, newSides || 6, newW / 2);
                     Matter.Body.scale(tempBody, 1, newH / newW);
                 } else {
                     const boundsW = tempBody.bounds.max.x - tempBody.bounds.min.x || 1;
                     const boundsH = tempBody.bounds.max.y - tempBody.bounds.min.y || 1;
                     Matter.Body.scale(tempBody, newW / boundsW, newH / boundsH);
                 }
             } else {
                 tempBody = Matter.Bodies.polygon(body.position.x, body.position.y, newSides || 6, newW / 2);
                 Matter.Body.scale(tempBody, 1, newH / newW);
             }
        } else {
             tempBody = Matter.Bodies.rectangle(body.position.x, body.position.y, newW, newH);
        }
        
        Matter.Body.setVertices(body, tempBody.vertices);
        Matter.Body.setAngle(body, newAngle * Math.PI / 180);
        Matter.Body.setStatic(body, newIsStatic);
        body.plugin = { ...body.plugin, width: newW, height: newH, sides: newSides, customVertices: verts };
        
        // Force engine update
        Matter.Engine.update(engine, 1000/60);
    };

    const makeRandomPolygon = () => {
        const numPoints = Math.floor(Math.random() * 5) + 5;
        const verts = [];
        for(let i=0; i<numPoints; i++) {
            const a = (i / numPoints) * Math.PI * 2;
            const r = 50 + Math.random() * 50;
            verts.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
        }
        setSides(numPoints);
        commitChanges(w, h, angle, numPoints, isStatic, verts);
    };

    return (
        <div className="flex flex-col gap-3 mt-1">
            <h3 className="font-bold border-b border-slate-600 pb-1 text-lg">Propietats ({body.label})</h3>
            
            <label className="text-sm flex justify-between items-center">
                Rotate (°):
                <input 
                    type="number" value={angle} 
                    onChange={e => {
                        const val = parseFloat(e.target.value) || 0;
                        setAngle(val);
                        commitChanges(w, h, val, sides, isStatic);
                    }}
                    className="w-20 bg-slate-700 rounded px-2 py-1 text-right"
                />
            </label>
            <label className="text-sm flex justify-between items-center">
                Amplada:
                <input 
                    type="number" value={w} 
                    onChange={e => {
                        const val = Math.max(10, parseFloat(e.target.value) || 10);
                        setW(val);
                        commitChanges(val, h, angle, sides, isStatic);
                    }}
                    className="w-20 bg-slate-700 rounded px-2 py-1 text-right"
                />
            </label>
            <label className="text-sm flex justify-between items-center">
                Alçada:
                <input 
                    type="number" value={h} 
                    onChange={e => {
                        const val = Math.max(10, parseFloat(e.target.value) || 10);
                        setH(val);
                        commitChanges(w, val, angle, sides, isStatic);
                    }}
                    className="w-20 bg-slate-700 rounded px-2 py-1 text-right"
                />
            </label>
            {body.label === 'stone' && (
            <>
            <label className="text-sm flex justify-between items-center">
                Costats:
                <input 
                    type="number" value={sides || 6} min={3} max={20}
                    onChange={e => {
                        const val = Math.max(3, parseInt(e.target.value, 10) || 6);
                        setSides(val);
                        commitChanges(w, h, angle, val, isStatic);
                    }}
                    className="w-20 bg-slate-700 rounded px-2 py-1 text-right"
                />
            </label>
            <button
                onClick={makeRandomPolygon}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1 px-2 rounded-lg text-sm mt-1 shadow"
            >
                🎲 Polígon Aleatori
            </button>
            </>
            )}

            {/* Physics toggle */}
            {body.label !== 'enemy' && body.label !== 'water' && body.label !== 'lava' && (
                <label className="text-sm flex justify-between items-center cursor-pointer mt-1 border-t border-slate-600 pt-2">
                    Físiques (cau):
                    <input 
                        type="checkbox" 
                        checked={!isStatic}
                        onChange={e => {
                            const newIsStatic = !e.target.checked;
                            setIsStatic(newIsStatic);
                            commitChanges(w, h, angle, sides, newIsStatic);
                        }}
                        className="w-4 h-4 cursor-pointer"
                    />
                </label>
            )}
            
            {body.label === 'enemy' && body.plugin && (
                <>
                    <div className="h-px bg-slate-600 my-1"/>
                    <label className="text-sm flex justify-between items-center">
                        Eix mov:
                        <select 
                            value={body.plugin.axis || 'x'} 
                            onChange={e => body.plugin.axis = e.target.value}
                            className="bg-slate-700 rounded px-2 py-1"
                        >
                            <option value="x">Horitzontal</option>
                            <option value="y">Vertical</option>
                        </select>
                    </label>
                    <label className="text-sm flex justify-between items-center">
                        Velocitat:
                        <input 
                            type="number" min="0" step="0.001" 
                            defaultValue={body.plugin.speed ?? 0.0015}
                            onChange={e => body.plugin.speed = parseFloat(e.target.value)}
                            className="w-20 bg-slate-700 rounded px-2 py-1 text-right"
                        />
                    </label>
                    <label className="text-sm flex justify-between items-center">
                        Rang Mov.:
                        <input 
                            type="number" min="0" step="10" 
                            defaultValue={body.plugin.range ?? 300}
                            onChange={e => body.plugin.range = parseFloat(e.target.value)}
                            className="w-20 bg-slate-700 rounded px-2 py-1 text-right"
                        />
                    </label>
                </>
            )}
        </div>
    );
}

export const LevelEditor: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<GameEngine | null>(null);
    const reqRef = useRef<number>(0);
    const [size, setSize] = useState({ w: 1000, h: 800 });
    
    // Editor State
    const [camX, setCamX] = useState(0);
    const [camY, setCamY] = useState(0);
    const [selectedBodyId, setSelectedBodyId] = useState<number | null>(null);
    const [canUndo, setCanUndo] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const undoStack = useRef<any[][]>([]);

    const playTest = () => {
        (window as any).__EDITOR_TEMP_BODIES = getEditorSnapshot();
        LEVELS['editor_temp' as any] = {
             id: 'editor_temp',
             name: 'Mode Test de Nivell',
             desc: 'Estàs testejant el nivell',
             emoji: '⚙️',
             bg: 'bg-slate-900',
             texts: {},
             quiz: [],
             history: []
        } as any;
        setIsPlaying(true);
    };

    const getEditorSnapshot = () => {
        if (!engineRef.current) return [];
        const bodies = Matter.Composite.allBodies(engineRef.current.engine.world);
        return bodies.filter(b => b.label !== 'player' && b.label !== 'boundary' && b.label !== 'void_floor' && b.label !== 'finish').map(b => {
             const boundsW = b.bounds.max.x - b.bounds.min.x;
             const boundsH = b.bounds.max.y - b.bounds.min.y;
             
             let pluginCopy = undefined;
             if (b.plugin) {
                 try { pluginCopy = JSON.parse(JSON.stringify(b.plugin)); } catch (e) { pluginCopy = undefined; }
             }

             let realW = b.plugin?.width;
             let realH = b.plugin?.height;
             
             if (!realW && b.vertices.length === 4 && (!b.label || b.label !== 'stone')) {
                 const dx1 = b.vertices[0].x - b.vertices[1].x;
                 const dy1 = b.vertices[0].y - b.vertices[1].y;
                 const h = Math.sqrt(dx1 * dx1 + dy1 * dy1);
                 
                 const dx2 = b.vertices[1].x - b.vertices[2].x;
                 const dy2 = b.vertices[1].y - b.vertices[2].y;
                 const w = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                 
                 realW = Math.round(w);
                 realH = Math.round(h);
             } else {
                 realW = realW || Math.round(boundsW) || 10;
                 realH = realH || Math.round(boundsH) || 10;
             }

             return {
                 id: b.id,
                 label: b.label,
                 x: Math.round(b.position.x) || 0,
                 y: Math.round(b.position.y) || 0,
                 w: realW,
                 h: realH,
                 angle: b.angle ? Number(b.angle.toFixed(4)) : undefined,
                 isStatic: !!b.isStatic,
                 plugin: pluginCopy,
                 isSensor: !!b.isSensor,
                 circleRadius: b.circleRadius || undefined,
                 friction: b.friction,
                 density: b.density
             };
        });
    };

    const pushHistory = () => {
        const snap = getEditorSnapshot();
        const strSnap = JSON.stringify(snap);
        const lastStr = undoStack.current.length > 0 ? JSON.stringify(undoStack.current[undoStack.current.length - 1]) : null;
        if (strSnap !== lastStr) {
            undoStack.current.push(snap);
            if (undoStack.current.length > 50) undoStack.current.shift();
            setCanUndo(true);
        }
    };

    const handleUndo = () => {
        if (undoStack.current.length === 0 || !engineRef.current) return;
        const snap = undoStack.current.pop();
        if (!snap) return;
        
        const world = engineRef.current.engine.world;
        const currentBodies = Matter.Composite.allBodies(world).filter(b => b.label !== 'player' && !b.label.includes('sign'));
        const snapIds = new Set(snap.map((d: any) => d.id));
        
        // Remove bodies that were created AFTER the snapshot
        const toRemove = currentBodies.filter(b => !snapIds.has(b.id));
        if (toRemove.length > 0) Matter.Composite.remove(world, toRemove);
        
        const bodiesToAdd: Matter.Body[] = [];
        snap.forEach((data: any) => {
             const existing = currentBodies.find(b => b.id === data.id);
             if (existing) {
                 Matter.Body.setPosition(existing, { x: data.x, y: data.y });
                 Matter.Body.setAngle(existing, data.angle || 0);
                 Matter.Body.setStatic(existing, data.isStatic);
                 existing.friction = data.friction;
                 existing.density = data.density;
                 existing.plugin = data.plugin;
             } else {
                 let newBody;
                 if (data.label === 'enemy' || data.circleRadius) {
                     newBody = Matter.Bodies.circle(data.x, data.y, data.circleRadius || 20, {
                         isSensor: data.isSensor, isStatic: data.isStatic, label: data.label, plugin: data.plugin, angle: data.angle, friction: data.friction, density: data.density
                     });
                 } else if (data.label === 'stone') {
                     if (data.plugin?.customVertices) {
                         try {
                             newBody = Matter.Bodies.fromVertices(data.x, data.y, [data.plugin.customVertices]);
                         } catch(e) {
                             newBody = null;
                         }
                         if (!newBody) {
                             newBody = Matter.Bodies.polygon(data.x, data.y, data.plugin?.sides || 6, data.w / 2);
                         } else {
                             const boundsW = newBody.bounds.max.x - newBody.bounds.min.x || 1;
                             const boundsH = newBody.bounds.max.y - newBody.bounds.min.y || 1;
                             Matter.Body.scale(newBody, data.w / boundsW, data.h / boundsH);
                         }
                         newBody.friction = data.friction;
                         newBody.density = data.density;
                         newBody.plugin = data.plugin;
                         Matter.Body.setStatic(newBody, data.isStatic);
                         newBody.isSensor = data.isSensor;
                         Matter.Body.setAngle(newBody, data.angle || 0);
                         newBody.label = data.label;
                     } else {
                         newBody = Matter.Bodies.polygon(data.x, data.y, data.plugin?.sides || 6, data.w / 2, {
                             isSensor: data.isSensor, isStatic: data.isStatic, label: data.label, angle: data.angle, friction: data.friction, density: data.density, plugin: data.plugin
                         });
                     }
                 } else {
                     newBody = Matter.Bodies.rectangle(data.x, data.y, data.w, data.h, {
                         isSensor: data.isSensor, isStatic: data.isStatic, label: data.label, angle: data.angle, friction: data.friction, plugin: data.plugin
                     });
                 }
                 newBody.id = data.id;
                 bodiesToAdd.push(newBody);
             }
        });
        
        if (bodiesToAdd.length > 0) Matter.Composite.add(world, bodiesToAdd);
        setSelectedBodyId(null);
        Matter.Engine.update(engineRef.current.engine, 1000/60);
        setCanUndo(undoStack.current.length > 0);
    };

    // Mouse Tracking
    const isDraggingCam = useRef(false);
    const isDraggingBody = useRef(false);
    const lastMouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const updateSize = () => {
            import('../game/constants').then(mod => {
                const w = window.innerWidth;
                const h = window.innerHeight;
                mod.setCanvasSize(w, h);
                setSize({ w, h });
            });
        };
        window.addEventListener('resize', updateSize);
        updateSize();
        
        engineRef.current = new GameEngine('wheel');
        // Start camera at player spawn
        setCamX(200 - window.innerWidth / 2);
        
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !engineRef.current) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const loop = () => {
            // Force player to be exactly at our camera target so Renderer centers around it
            if (engineRef.current && engineRef.current.playerBody) {
                 Matter.Body.setPosition(engineRef.current.playerBody, { 
                     x: camX + size.w / 2.5, 
                     y: camY + size.h / 1.3 
                 });
            }

            render(ctx, engineRef.current!);
            
            // Draw Editor Overlays
            if (selectedBodyId) {
                const body = Matter.Composite.allBodies(engineRef.current!.engine.world).find(b => b.id === selectedBodyId);
                if (body) {
                    ctx.save();
                    // render() restores ctx.
                    // We must translate based on how render() does it:
                    ctx.translate(-Math.max(-200, camX), 0);
                    ctx.strokeStyle = '#facc15';
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    body.vertices.forEach((v, i) => {
                        if (i === 0) ctx.moveTo(v.x, v.y);
                        else ctx.lineTo(v.x, v.y);
                    });
                    ctx.closePath();
                    ctx.stroke();
                    ctx.restore();
                }
            }

            reqRef.current = requestAnimationFrame(loop);
        };
        
        reqRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(reqRef.current);
    }, [camX, camY, selectedBodyId]);

    const handlePointerDown = (e: React.PointerEvent) => {
        if (!engineRef.current) return;
        const rect = canvasRef.current!.getBoundingClientRect();
        const renderCamX = Math.max(-200, camX);
        const renderCamY = 0;
        
        const worldX = e.clientX - rect.left + renderCamX;
        const worldY = e.clientY - rect.top + renderCamY;
        
        const bodies = Matter.Composite.allBodies(engineRef.current.engine.world);
        const hits = Matter.Query.point(bodies, { x: worldX, y: worldY });
        
        const validHits = hits.filter(b => b.label !== 'player' && b.label !== 'boundary' && b.label !== 'void_floor' && b.label !== 'finish');
        
        lastMouse.current = { x: e.clientX, y: e.clientY };

        if (validHits.length > 0) {
            setSelectedBodyId(validHits[0].id);
            if (e.button === 0) {
                pushHistory();
                isDraggingBody.current = true;
            }
        } else {
            setSelectedBodyId(null);
            if (e.button === 0 || e.button === 1 || e.button === 2) {
                isDraggingCam.current = true;
            }
        }
        
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        const dx = e.clientX - lastMouse.current.x;
        const dy = e.clientY - lastMouse.current.y;
        lastMouse.current = { x: e.clientX, y: e.clientY };

        if (isDraggingCam.current) {
            setCamX(prev => prev - dx);
            setCamY(prev => prev - dy);
        } else if (isDraggingBody.current && selectedBodyId && engineRef.current) {
            const body = Matter.Composite.allBodies(engineRef.current.engine.world).find(b => b.id === selectedBodyId);
            if (body) {
                Matter.Body.setPosition(body, { x: body.position.x + dx, y: body.position.y + dy });
            }
        }
    };

    const handlePointerUp = () => {
        isDraggingCam.current = false;
        isDraggingBody.current = false;
    };

    const handleWheel = (e: React.WheelEvent) => {
        setCamX(prev => prev + e.deltaX);
        setCamY(prev => prev + e.deltaY);
    };

    const addBlock = (label: string, w: number, h: number) => {
        if (!engineRef.current) return;
        const renderCamX = Math.max(-200, camX);
        const centerX = renderCamX + size.w / 2;
        const centerY = size.h / 2;
        pushHistory();
        let body;
        
        if (label === 'enemy') {
            body = Matter.Bodies.circle(centerX, centerY, 20, { 
                isSensor: true, isStatic: true, label: 'enemy', 
                plugin: { origX: centerX, origY: centerY, range: 300, speed: 0.0015, axis: 'x', isEnemy: true }
             });
        } else if (label === 'stone') {
             body = Matter.Bodies.polygon(centerX, centerY, 6, w / 2, {
                 isStatic: true, label: 'stone', density: 0.005, friction: 0.8,
                 plugin: { width: w, sides: 6 }
             });
        } else {
             body = Matter.Bodies.rectangle(centerX, centerY, w, h, { 
                 isStatic: true, 
                 label: label, 
                 friction: label === 'water' || label === 'lava' ? 0 : 1.0,
                 isSensor: label === 'water' || label === 'lava',
                 plugin: { width: w, height: h }
             });
        }
        Matter.Composite.add(engineRef.current.engine.world, body);
        setSelectedBodyId(body.id);
    };

    const exportJSON = () => {
        if (!engineRef.current) return;
        const data = getEditorSnapshot();
        navigator.clipboard.writeText(JSON.stringify(data));
        alert("Codí de nivell copiat al porta-retalls! Pega'l i envia'l a l'IA.");
    };

    const importJSON = () => {
        const input = prompt("Enganxa el codi del nivell aquí:");
        if (!input) return;
        try {
            const data = JSON.parse(input);
            if (!Array.isArray(data)) throw new Error("Format no vàlid");
            
            if (!engineRef.current) return;
            pushHistory();
            
            const world = engineRef.current.engine.world;
            const bodies = Matter.Composite.allBodies(world);
            const toRemove = bodies.filter(b => b.label !== 'player' && !b.label.includes('sign'));
            Matter.Composite.remove(world, toRemove);
            
            const newBodies = data.map(d => {
                if (d.label === 'enemy' || d.circleRadius) {
                    return Matter.Bodies.circle(d.x, d.y, d.circleRadius || 20, {
                        isSensor: d.isSensor, isStatic: d.isStatic, label: d.label, plugin: d.plugin
                    });
                } else if (d.label === 'stone') {
                    if (d.plugin?.customVertices) {
                         let tempBody;
                         try {
                             tempBody = Matter.Bodies.fromVertices(d.x, d.y, [d.plugin.customVertices]);
                         } catch(e) {
                             tempBody = null;
                         }
                         if (!tempBody) {
                             tempBody = Matter.Bodies.polygon(d.x, d.y, d.plugin?.sides || 6, (d.w || 60) / 2);
                         } else {
                             const boundsW = tempBody.bounds.max.x - tempBody.bounds.min.x || 1;
                             const boundsH = tempBody.bounds.max.y - tempBody.bounds.min.y || 1;
                             Matter.Body.scale(tempBody, d.w / boundsW, d.h / boundsH);
                         }
                         tempBody.friction = d.friction;
                         tempBody.density = d.density;
                         tempBody.plugin = d.plugin;
                         Matter.Body.setStatic(tempBody, d.isStatic);
                         tempBody.isSensor = d.isSensor;
                         Matter.Body.setAngle(tempBody, d.angle || 0);
                         tempBody.label = d.label;
                         return tempBody;
                    }
                    return Matter.Bodies.polygon(d.x, d.y, d.plugin?.sides || 6, (d.w || 60) / 2, {
                        isSensor: d.isSensor, isStatic: d.isStatic, label: d.label, angle: d.angle, friction: d.friction, density: d.density, plugin: d.plugin
                    });
                } else {
                    return Matter.Bodies.rectangle(d.x, d.y, d.w, d.h, {
                        isSensor: d.isSensor, isStatic: d.isStatic, label: d.label, angle: d.angle, friction: d.friction, plugin: d.plugin
                    });
                }
            });
            
            Matter.Composite.add(world, newBodies);
            setSelectedBodyId(null);
            Matter.Engine.update(engineRef.current.engine, 1000/60);
        } catch(e) {
            alert("S'ha produït un error al carregar el codi: " + e);
        }
    };

    const cloneSelected = () => {
        if (!engineRef.current || !selectedBodyId) return;
        const body = Matter.Composite.allBodies(engineRef.current.engine.world).find(b => b.id === selectedBodyId);
        if (body) {
            pushHistory();
            const isCircle = body.label === 'enemy' || body.circleRadius;
            let newBody;
            if (isCircle) {
                 newBody = Matter.Bodies.circle(body.position.x + 50, body.position.y + 50, body.circleRadius || 20, {
                      isSensor: body.isSensor, isStatic: body.isStatic, label: body.label, plugin: JSON.parse(JSON.stringify(body.plugin || {}))
                 });
                 if (newBody.plugin) {
                      newBody.plugin.origX = newBody.position.x;
                      newBody.plugin.origY = newBody.position.y;
                 }
            } else if (body.label === 'stone') {
                 // Clone stone
                 const w = body.plugin?.width || 60;
                 if (body.plugin?.customVertices) {
                     try {
                         newBody = Matter.Bodies.fromVertices(body.position.x + 50, body.position.y + 50, [body.plugin.customVertices]);
                     } catch(e) {
                         newBody = null;
                     }
                     if (!newBody) {
                         newBody = Matter.Bodies.polygon(body.position.x + 50, body.position.y + 50, body.plugin?.sides || 6, w / 2);
                     } else {
                         const boundsW = newBody.bounds.max.x - newBody.bounds.min.x || 1;
                         const boundsH = newBody.bounds.max.y - newBody.bounds.min.y || 1;
                         Matter.Body.scale(newBody, w / boundsW, (body.plugin?.height || w) / boundsH);
                     }
                     newBody.friction = body.friction;
                     newBody.density = body.density;
                     newBody.plugin = JSON.parse(JSON.stringify(body.plugin || {}));
                     Matter.Body.setStatic(newBody, body.isStatic);
                     newBody.isSensor = body.isSensor;
                     Matter.Body.setAngle(newBody, body.angle || 0);
                     newBody.label = body.label;
                 } else {
                     newBody = Matter.Bodies.polygon(body.position.x + 50, body.position.y + 50, body.plugin?.sides || 6, w / 2, {
                          isSensor: body.isSensor, isStatic: body.isStatic, label: body.label, angle: body.angle, friction: body.friction, density: body.density, plugin: JSON.parse(JSON.stringify(body.plugin || {}))
                     });
                 }
            } else {
                 const w = body.plugin?.width || (body.bounds.max.x - body.bounds.min.x);
                 const h = body.plugin?.height || (body.bounds.max.y - body.bounds.min.y);
                 newBody = Matter.Bodies.rectangle(body.position.x + 50, body.position.y + 50, w, h, {
                      isSensor: body.isSensor, isStatic: body.isStatic, label: body.label, angle: body.angle, friction: body.friction, plugin: JSON.parse(JSON.stringify(body.plugin || { width: w, height: h }))
                 });
            }
            Matter.Composite.add(engineRef.current.engine.world, newBody);
            setSelectedBodyId(newBody.id);
        }
    };
    
    const deleteSelected = () => {
         if (!engineRef.current || !selectedBodyId) return;
         const body = Matter.Composite.allBodies(engineRef.current.engine.world).find(b => b.id === selectedBodyId);
         if (body) {
             pushHistory();
             Matter.Composite.remove(engineRef.current.engine.world, body);
             setSelectedBodyId(null);
         }
    };

    if (isPlaying) {
         return (
             <div className="absolute inset-0 z-50 bg-slate-900">
                 <GameCanvas machineId={'editor_temp' as any} onBack={() => setIsPlaying(false)} />
             </div>
         );
    }

    return (
        <div className="w-full h-screen bg-slate-900 flex overflow-hidden select-none">
            {/* Left Panel */}
            <div className="w-72 bg-slate-800 border-r border-slate-700 flex flex-col z-10 shadow-lg relative h-full shrink-0">
                <div className="p-4 border-b border-slate-700">
                    <h2 className="text-xl font-black text-white flex items-center gap-2 mb-4">
                        🛠️ Editor
                    </h2>
                    <button onClick={onBack} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg shadow mb-3 transition-colors">
                        ⬅ Tornar al menú
                    </button>
                    <button onClick={handleUndo} disabled={!canUndo} className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg shadow transition-opacity">
                        Desfer {canUndo ? '↶' : ''}
                    </button>
                </div>
                
                <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
                    <h3 className="text-slate-400 font-bold uppercase text-sm mb-1 tracking-wider">Afegeix Elements</h3>
                    <button onClick={() => addBlock('cement', 200, 40)} className="w-full bg-slate-700 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg shadow text-left">
                        + Plataforma
                    </button>
                    <button onClick={() => addBlock('water', 150, 40)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow text-left">
                        + Aigua
                    </button>
                    <button onClick={() => addBlock('lava', 150, 40)} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow text-left">
                        + Lava
                    </button>
                    <button onClick={() => addBlock('enemy', 40, 40)} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg shadow text-left">
                        + Enemic
                    </button>
                    <button onClick={() => addBlock('stone', 60, 60)} className="w-full bg-stone-600 hover:bg-stone-500 text-white font-bold py-2 px-4 rounded-lg shadow text-left">
                        + Pedra
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 relative overflow-hidden">
                <canvas 
                    ref={canvasRef} 
                    width={size.w} 
                    height={size.h} 
                    className="absolute inset-0 cursor-crosshair"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    onWheel={handleWheel}
                    onContextMenu={e => e.preventDefault()}
                />

            {/* Quick Actions Right */}
            {selectedBodyId && (
                <div className="absolute top-4 right-4 flex flex-col gap-2 bg-slate-800/90 p-4 rounded-xl text-white pointer-events-auto w-64 shadow-2xl">
                    <div className="flex gap-2 mb-2">
                        <button onClick={cloneSelected} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-2 rounded-lg shadow text-center text-sm">
                            Clonar
                        </button>
                        <button onClick={deleteSelected} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 px-2 rounded-lg shadow text-center text-sm">
                            Eliminar
                        </button>
                    </div>
                    {(() => {
                         const b = Matter.Composite.allBodies(engineRef.current?.engine.world).find(b => b.id === selectedBodyId);
                         if (!b || !engineRef.current) return null;
                         return <BodyPropertyPanel body={b} engineWorld={engineRef.current.engine.world} engine={engineRef.current.engine} setBodyId={setSelectedBodyId} />;
                    })()}
                </div>
            )}

            {/* Export Bottom */}
            <div className="absolute bottom-4 right-4 flex gap-3">
                <button onClick={playTest} className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-xl shadow-xl text-lg flex items-center gap-2">
                    ▶️ Provar Nivell
                </button>
                <button onClick={importJSON} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl shadow-xl text-lg border-2 border-blue-400/30">
                    📥 Carregar Codi
                </button>
                <button onClick={exportJSON} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl shadow-xl text-lg border-2 border-purple-400/30">
                    📋 Copia Codi
                </button>
            </div>

            {/* Selected Body Info */}
            {selectedBodyId && (
                <div className="absolute bottom-4 left-4 bg-slate-800/80 p-4 rounded-xl text-white font-mono text-sm max-w-sm pointer-events-none">
                    Seleccionat: {Matter.Composite.allBodies(engineRef.current?.engine.world).find(b => b.id === selectedBodyId)?.label} <br />
                    Arrossega per moure l'objecte.<br/>
                    Utilitza la roda del ratolí o arrossega el fons per moure't pel mapa.
                </div>
            )}
            </div>
        </div>
    );
};
