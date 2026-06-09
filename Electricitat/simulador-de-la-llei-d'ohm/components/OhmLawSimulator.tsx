import React, { useState, useEffect } from 'react';
import { Variable } from '../types';
import { BatteryIcon, BoltIcon, ResistorIcon } from './icons';

const SliderInput: React.FC<{
    label: string;
    unit: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
    disabled: boolean;
    icon: React.ReactNode;
}> = ({ label, unit, value, min, max, step, onChange, disabled, icon }) => (
    <div className={`p-4 border rounded-lg transition-all duration-300 ${disabled ? 'bg-slate-200' : 'bg-white shadow-sm'}`}>
        <label className="flex items-center text-lg font-semibold text-slate-700">
            {icon}
            <span className="ml-2">{label} ({unit})</span>
        </label>
        <div className="flex items-center mt-2 space-x-4">
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                disabled={disabled}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed accent-blue-600"
            />
            <input
                type="number"
                value={value.toFixed(2)}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                disabled={disabled}
                className="w-28 text-center font-mono text-lg p-2 border border-slate-300 rounded-md bg-white text-black disabled:bg-white disabled:border-slate-200"
            />
        </div>
    </div>
);


export const OhmLawSimulator: React.FC = () => {
    const [voltage, setVoltage] = useState(12);
    const [current, setCurrent] = useState(2);
    const [resistance, setResistance] = useState(6);
    const [variableToCalculate, setVariableToCalculate] = useState<Variable>(Variable.Current);

    useEffect(() => {
        if (variableToCalculate === Variable.Voltage && current > 0 && resistance > 0) {
            setVoltage(current * resistance);
        }
    }, [current, resistance, variableToCalculate]);

    useEffect(() => {
        if (variableToCalculate === Variable.Current && resistance > 0) {
            setCurrent(voltage / resistance);
        }
    }, [voltage, resistance, variableToCalculate]);

    useEffect(() => {
        if (variableToCalculate === Variable.Resistance && current > 0) {
            setResistance(voltage / current);
        }
    }, [voltage, current, variableToCalculate]);

    const animationDuration = current > 0.1 ? Math.max(0.2, 10 / current) : 1000;
    const numElectrons = current > 0.1 ? Math.min(40, Math.ceil(current * 2)) : 0;

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Simulador Interactiu</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-slate-700 mb-3">1. Tria què vols calcular:</h3>
                        <div className="flex flex-wrap gap-2 rounded-lg bg-slate-100 p-2">
                           {(Object.values(Variable)).map(v => (
                                <button key={v} onClick={() => setVariableToCalculate(v)}
                                    className={`flex-1 px-4 py-2 text-base font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                        variableToCalculate === v ? 'bg-blue-600 text-white shadow' : 'bg-white text-slate-700 hover:bg-blue-100'
                                    }`}>
                                    {v === Variable.Voltage ? "Tensió (V)" : v === Variable.Current ? "Corrent (I)" : "Resistència (R)"}
                                </button>
                           ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-slate-700 mb-3">2. Ajusta els valors coneguts:</h3>
                        <div className="space-y-4">
                           <SliderInput label="Tensió" unit="V" value={voltage} min={0.1} max={100} step={0.1} onChange={setVoltage} disabled={variableToCalculate === Variable.Voltage} icon={<BatteryIcon />} />
                           <SliderInput label="Corrent" unit="A" value={current} min={0.1} max={20} step={0.1} onChange={setCurrent} disabled={variableToCalculate === Variable.Current} icon={<BoltIcon />}/>
                           <SliderInput label="Resistència" unit="Ω" value={resistance} min={0.1} max={500} step={0.1} onChange={setResistance} disabled={variableToCalculate === Variable.Resistance} icon={<ResistorIcon />}/>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-inner min-h-[400px]">
                    <h3 className="text-xl font-semibold text-slate-700 w-full text-center">Circuit Visual</h3>
                    <div className="w-full max-w-md aspect-[4/3] relative flex items-center justify-center" aria-hidden="true">
                        <svg viewBox="0 0 400 300" className="w-full h-full">
                           {/* Wires with gaps for components */}
                            <path d="M 160 50 H 50 V 130 M 50 170 V 250 H 350 V 50 H 240" stroke="#475569" strokeWidth="4" fill="none" strokeLinejoin="round" strokeLinecap="round" />

                            {/* Battery on left side, vertical, replacing wire segment */}
                            <g transform="translate(50, 150)">
                                {/* Connecting wires to symbol */}
                                <line y1="-20" y2="-15" stroke="#475569" strokeWidth="4" />
                                <line y1="15" y2="20" stroke="#475569" strokeWidth="4" />
                                {/* Battery plates */}
                                <path d="M -15 -15 L 15 -15" stroke="#475569" strokeWidth="2.5" />
                                <path d="M -10 -5 L 10 -5" stroke="#475569" strokeWidth="4" />
                                <path d="M -15 5 L 15 5" stroke="#475569" strokeWidth="2.5" />
                                <path d="M -10 15 L 10 15" stroke="#475569" strokeWidth="4" />
                                {/* Polarity */}
                                <text x="25" y="-10" textAnchor="middle" className="font-mono font-bold text-2xl fill-slate-700">+</text>
                                <text x="25" y="20" textAnchor="middle" className="font-mono font-bold text-2xl fill-slate-700">-</text>
                                {/* Voltage Label outside the wire, to the right */}
                                <text x="40" y="0" textAnchor="start" dominantBaseline="middle" className="font-bold text-xl fill-blue-700">{voltage.toFixed(1)}V</text>
                            </g>
                            
                            {/* Resistor on top side, horizontal, replacing wire segment */}
                            <g transform="translate(200, 50)">
                                 {/* Connecting wires to symbol */}
                                <line x1="-40" x2="-30" stroke="#475569" strokeWidth="4" />
                                <line x1="30" x2="40" stroke="#475569" strokeWidth="4" />
                                {/* Zig-zag path */}
                                <path d="M -30 0 l 10 -15 l 10 30 l 10 -30 l 10 30 l 10 -30 l 10 15" stroke="#475569" strokeWidth="4" fill="none" />
                                <text y="-20" x="0" textAnchor="middle" className="font-bold text-xl fill-red-700">{resistance.toFixed(1)}Ω</text>
                            </g>

                            {/* Path for electron animation (conventional current: + to -) */}
                            <path id="electron-path" d="M 50 130 V 50 H 350 V 250 H 50 V 170" fill="none" />

                            {/* Electrons */}
                            {Array.from({ length: numElectrons }).map((_, i) => (
                                <circle key={i} r="5" fill="#3b82f6" className="opacity-75">
                                    <animateMotion 
                                        dur={`${animationDuration}s`}
                                        begin={`-${(animationDuration / numElectrons) * i}s`}
                                        repeatCount="indefinite"
                                    >
                                        <mpath href="#electron-path" />
                                    </animateMotion>
                                </circle>
                            ))}
                        </svg>
                    </div>
                    
                    <div className="w-full mt-4 space-y-2 text-center">
                        <p className="text-xl font-semibold text-slate-700">
                            Corrent (Flux d'electrons):
                            <span className="block font-mono font-bold text-4xl text-blue-600 mt-1">
                                {current.toFixed(2)} A
                            </span>
                        </p>
                         <p className="font-mono text-base bg-slate-200 text-slate-800 p-2 rounded-md">
                            {variableToCalculate === Variable.Voltage && `${current.toFixed(2)} A × ${resistance.toFixed(2)} Ω = ${voltage.toFixed(2)} V`}
                            {variableToCalculate === Variable.Current && `${voltage.toFixed(2)} V / ${resistance.toFixed(2)} Ω = ${current.toFixed(2)} A`}
                            {variableToCalculate === Variable.Resistance && `${voltage.toFixed(2)} V / ${current.toFixed(2)} A = ${resistance.toFixed(2)} Ω`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};