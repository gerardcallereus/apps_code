import React from 'react';

const UnitScale: React.FC<{ units: string[], category: string }> = ({ units, category }) => (
    <div className="flex w-full flex-col items-center">
        <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{category}</span>
        <div className="flex w-full flex-wrap items-center justify-center gap-x-1 gap-y-2 rounded-lg border border-slate-200 bg-slate-100 px-2 py-2 md:gap-x-2">
            {units.map((unit, index) => (
                <React.Fragment key={unit}>
                    <span className="font-mono text-xs font-bold text-indigo-600 sm:text-sm md:text-base">{unit}</span>
                    {index < units.length - 1 && (
                        <div className="mx-0 flex flex-col items-center text-slate-400 sm:mx-1">
                            <span className="scale-75 text-xs">x10</span>
                            <svg className="h-3 w-5 sm:w-6" fill="none" viewBox="0 0 24 12" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18m-3-3l3 3-3 3" />
                            </svg>
                            <svg className="-mt-1 h-3 w-5 sm:w-6" fill="none" viewBox="0 0 24 12" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 6H3m3-3l-3 3 3 3" />
                            </svg>
                            <span className="scale-75 text-xs">÷10</span>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    </div>
);


const UnitReferenceHeader: React.FC = () => {
    const lengthUnits = ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'];
    const massUnits = ['kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg'];
    
    return (
        <div className="w-full p-4 bg-white/70 border border-slate-200 rounded-lg mb-6 flex flex-col gap-4 items-center justify-center">
           <UnitScale units={lengthUnits} category="Longitud" />
           <UnitScale units={massUnits} category="Massa" />
        </div>
    );
};

export default UnitReferenceHeader;