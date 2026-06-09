import React, { useState } from 'react';
import { INITIAL_INFRASTRUCTURE, INITIAL_FIXED_COSTS, INITIAL_VARIABLE_COSTS, CostCategory } from './data/initialData';
import { CostTable } from './components/CostTable';
import { BreakEvenChart } from './components/BreakEvenChart';
import { Calculator, Coins, Factory, School, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

function App() {
  const [infrastructure, setInfrastructure] = useState<CostCategory>(INITIAL_INFRASTRUCTURE);
  const [fixedCosts, setFixedCosts] = useState<CostCategory>(INITIAL_FIXED_COSTS);
  const [variableCosts, setVariableCosts] = useState<CostCategory>(INITIAL_VARIABLE_COSTS);
  const [sellingPrice, setSellingPrice] = useState<number>(6.00);

  const handleUpdateItem = (categoryId: string, itemId: string, newValue: number) => {
    const updateCategory = (category: CostCategory) => ({
      ...category,
      items: category.items.map(item => 
        item.id === itemId ? { ...item, value: newValue } : item
      )
    });

    if (categoryId === 'infrastructure') setInfrastructure(updateCategory(infrastructure));
    if (categoryId === 'fixed') setFixedCosts(updateCategory(fixedCosts));
    if (categoryId === 'variable') setVariableCosts(updateCategory(variableCosts));
  };

  const totalFixed = fixedCosts.items.reduce((sum, item) => sum + item.value, 0);
  const totalMaterials = variableCosts.items.reduce((sum, item) => sum + item.value, 0);
  
  // In this simplified model, we treat all material purchases as initial investment to recover
  const totalToRecover = totalFixed + totalMaterials;
  
  // Profit per unit is the full selling price (since materials are already accounted for in the initial investment)
  const profitPerUnit = sellingPrice;
  
  const breakEvenUnits = profitPerUnit > 0 ? totalToRecover / profitPerUnit : Infinity;
  const breakEvenUnitsRounded = Math.ceil(breakEvenUnits);
  
  // Prevent chart from trying to render infinite units
  const chartMaxUnits = isFinite(breakEvenUnitsRounded) 
    ? Math.max(20, Math.ceil(breakEvenUnitsRounded * 1.5)) 
    : 50;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <Factory size={20} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Artífex Financer
            </h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            Departament Financer
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Intro */}
        <section className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Costos i Preu</h2>
          <p className="text-lg text-gray-600">
            Benvinguts al departament financer. Avui farem números per calcular el preu real de les vostres arracades 
            i veure quan començareu a guanyar diners.
          </p>
        </section>

        {/* Tables Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CostTable category={infrastructure} onUpdateItem={handleUpdateItem} />
          <CostTable category={fixedCosts} onUpdateItem={handleUpdateItem} />
          <CostTable category={variableCosts} onUpdateItem={handleUpdateItem} />
        </section>

        {/* Simulator Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50/50">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Calculator className="text-indigo-600" />
              Simulador de Vendes
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:divide-x divide-gray-200">
            
            {/* Controls & Stats */}
            <div className="lg:col-span-4 p-6 space-y-8">
              
              {/* Price Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Preu de Venda (per parell)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                    step="0.50"
                    className="w-full text-3xl font-bold text-indigo-600 border-b-2 border-indigo-200 focus:border-indigo-600 focus:outline-none py-2 bg-transparent pr-8"
                  />
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none">€</span>
                </div>
                <p className="text-xs text-gray-500">Modifica aquest valor per veure com canvia el benefici.</p>
              </div>

              {/* Key Metrics */}
              <div className="space-y-4">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-800 mb-1">
                    <Coins size={18} />
                    <span className="font-semibold">Benefici per Arracada</span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-700">
                    {profitPerUnit.toFixed(2)} €
                  </div>
                  <div className="text-xs text-emerald-600 mt-1">
                    {sellingPrice.toFixed(2)} € (Preu de venda)
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-800 mb-1">
                    <TrendingUp size={18} />
                    <span className="font-semibold">Punt d'Equilibri</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-700">
                    {isFinite(breakEvenUnitsRounded) && breakEvenUnitsRounded > 0 ? breakEvenUnitsRounded : "∞"} unitats
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    Has de vendre {isFinite(breakEvenUnitsRounded) && breakEvenUnitsRounded > 0 ? breakEvenUnitsRounded : "infinites"} arracades per recuperar els {totalToRecover.toFixed(2)} € d'inversió total (Eines + Materials).
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 space-y-2">
                <p><strong>El Repte:</strong> Divideix el "Total a Recuperar" entre el teu "Benefici".</p>
                <code className="block bg-white p-2 rounded border border-gray-200 font-mono text-center">
                  {totalToRecover.toFixed(2)} € / {profitPerUnit.toFixed(2)} € = {breakEvenUnits.toFixed(2)}
                </code>
              </div>

            </div>

            {/* Chart */}
            <div className="lg:col-span-8 p-6 bg-white flex flex-col justify-center">
              <BreakEvenChart 
                fixedCosts={totalToRecover}
                variableCostPerUnit={0}
                sellingPrice={sellingPrice}
                maxUnits={chartMaxUnits}
              />
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;
