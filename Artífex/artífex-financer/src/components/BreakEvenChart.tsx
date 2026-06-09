import React from 'react';
import { ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ComposedChart } from 'recharts';

interface BreakEvenChartProps {
  fixedCosts: number;
  variableCostPerUnit: number;
  sellingPrice: number;
  maxUnits?: number;
}

export const BreakEvenChart: React.FC<BreakEvenChartProps> = ({
  fixedCosts,
  variableCostPerUnit,
  sellingPrice,
  maxUnits = 20
}) => {
  const data = [];
  const breakEvenPoint = fixedCosts / (sellingPrice - variableCostPerUnit);
  
  // Generate data points
  for (let i = 0; i <= maxUnits; i++) {
    data.push({
      units: i,
      totalInvestment: fixedCosts,
      revenue: sellingPrice * i,
    });
  }

  const profitPerUnit = sellingPrice - variableCostPerUnit;
  const isProfitable = profitPerUnit > 0;

  return (
    <div className="w-full h-full min-h-[500px] bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
      <div className="mb-6 space-y-3">
        <h3 className="font-bold text-gray-800 text-lg">Com s'ha fet aquesta gràfica?</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Aquesta gràfica compara els diners que heu gastat amb els que guanyeu:
        </p>
        <ul className="text-sm text-gray-600 space-y-2 ml-1">
          <li className="flex items-start gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 mt-1 flex-shrink-0" />
            <span>
              <strong>Inversió Total (Fixos + Variables):</strong> Aquesta línia vermella representa la suma de tot el que heu gastat per començar (eines, motlles i tots els materials). És una línia plana perquè són diners que ja heu pagat abans de vendre res.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
            <span>
              <strong>Ingressos (Vendes):</strong> Aquesta línia verda mostra els diners que guanyeu a mesura que veneu arracades. Com més veneu, més puja.
            </span>
          </li>
        </ul>
      </div>

      <div className="flex-grow min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="units" 
              label={{ value: 'Unitats Venudes', position: 'insideBottom', offset: -10 }} 
            />
            <YAxis 
              label={{ value: 'Euros (€)', angle: -90, position: 'insideLeft' }} 
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(2)} €`, '']}
              labelFormatter={(label) => `Unitats: ${label}`}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend verticalAlign="top" height={36}/>
            
            <Line 
              type="monotone" 
              dataKey="totalInvestment" 
              stroke="#ef4444" 
              name="Inversió Total (Fixos + Variables)" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10b981" 
              name="Ingressos (Vendes)" 
              strokeWidth={2}
              dot={false}
            />
            
            {isProfitable && isFinite(breakEvenPoint) && breakEvenPoint > 0 && breakEvenPoint <= maxUnits && (
              <ReferenceLine x={breakEvenPoint} stroke="#6366f1" strokeDasharray="3 3" label="Punt d'Equilibri" />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500 italic">
        El punt on es creuen les línies és quan recupereu la inversió.
      </div>
    </div>
  );
};
