import React, { useState, useEffect, useMemo } from 'react';
import { GAME_DATA } from '../data';
import { DraggableItem, CardType, GameState } from '../types';
import { Card } from './Card';
import { Check, X, RefreshCw, HelpCircle, Lightbulb, Fingerprint, Ruler, Factory, Calculator, ShoppingBag } from 'lucide-react';

interface GameProps {
  onComplete: (attempts: number) => void;
}

// Map string names to components
const IconMap: { [key: string]: React.ElementType } = {
  Lightbulb, Fingerprint, Ruler, Factory, Calculator, ShoppingBag
};

export const Game: React.FC<GameProps> = ({ onComplete }) => {
  // --- Game Initialization ---
  
  // Create the pool of shuffled items
  const initialPoolItems = useMemo(() => {
    const items: DraggableItem[] = [];
    GAME_DATA.forEach(phase => {
      items.push({
        id: `def-${phase.id}`,
        type: CardType.DEFINITION,
        content: phase.definition,
        phaseId: phase.id
      });
      items.push({
        id: `ex-${phase.id}`,
        type: CardType.EXAMPLE,
        content: phase.example,
        phaseId: phase.id
      });
    });
    // Fisher-Yates shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }, []);

  const [poolItems, setPoolItems] = useState<DraggableItem[]>(initialPoolItems);
  const [placedItems, setPlacedItems] = useState<GameState['placedItems']>({});
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [checkResult, setCheckResult] = useState<{success: boolean, message: string} | null>(null);
  const [attempts, setAttempts] = useState(0);

  // --- Handlers ---

  const handleItemClick = (item: DraggableItem) => {
    if (checkResult?.success) return; // Game over
    
    // Toggle selection if clicking the same item
    if (selectedItemId === item.id) {
      setSelectedItemId(null);
      return;
    }
    
    // Select the new item
    setSelectedItemId(item.id);
    setCheckResult(null); // Clear previous messages
  };

  const handleSlotClick = (phaseId: number, slotType: CardType) => {
    if (checkResult?.success) return;
    if (!selectedItemId) return;

    // Find the selected item object
    let itemToMove: DraggableItem | undefined = poolItems.find(i => i.id === selectedItemId);
    let fromSlotKey: string | undefined;

    // If not in pool, check if it's already placed somewhere
    if (!itemToMove) {
      const placedEntry = Object.entries(placedItems).find(([_, item]) => (item as DraggableItem | null)?.id === selectedItemId);
      if (placedEntry) {
        fromSlotKey = placedEntry[0];
        itemToMove = placedEntry[1] as DraggableItem;
      }
    }

    if (!itemToMove) return;

    // Logic: Only allow placing Definition in Def slot, Example in Example slot
    if (itemToMove.type !== slotType) {
      setCheckResult({ success: false, message: `Aquesta targeta és un ${itemToMove.type === CardType.DEFINITION ? 'concepte' : 'exemple'}, no va aquí.` });
      return;
    }

    const targetSlotKey = `${phaseId}-${slotType}`;

    // If target slot is already occupied by THIS item, do nothing
    if (placedItems[targetSlotKey]?.id === itemToMove.id) {
      setSelectedItemId(null);
      return;
    }

    // Check if slot is occupied by another item. If so, swap logic (complex) or prevent (simple).
    // Simple approach: Swap current occupant back to pool (or to the previous slot of the moving item)
    const currentOccupant = placedItems[targetSlotKey];
    
    const newPlacedItems = { ...placedItems };
    const newPoolItems = [...poolItems];

    // 1. Remove item from its old location
    if (fromSlotKey) {
      newPlacedItems[fromSlotKey] = null;
    } else {
      // It was in the pool, remove it
      const index = newPoolItems.findIndex(i => i.id === itemToMove!.id);
      if (index > -1) newPoolItems.splice(index, 1);
    }

    // 2. Handle the item currently in the target slot (evict to pool or swap?)
    // Let's evict to pool for simplicity to avoid type mismatch in swaps
    if (currentOccupant) {
      newPoolItems.push(currentOccupant);
    }

    // 3. Place new item
    newPlacedItems[targetSlotKey] = itemToMove;

    setPlacedItems(newPlacedItems);
    setPoolItems(newPoolItems);
    setSelectedItemId(null);
    setCheckResult(null);
  };

  const handleReturnToPool = (item: DraggableItem) => {
    if (checkResult?.success) return;

    // Find where it is placed
    const placedEntry = Object.entries(placedItems).find(([_, i]) => (i as DraggableItem | null)?.id === item.id);
    if (!placedEntry) return;

    const [slotKey] = placedEntry;
    
    const newPlacedItems = { ...placedItems };
    newPlacedItems[slotKey] = null;

    setPlacedItems(newPlacedItems);
    setPoolItems([...poolItems, item]);
    setSelectedItemId(null);
  };

  const checkAnswers = () => {
    setAttempts(p => p + 1);
    let correctCount = 0;
    const totalSlots = GAME_DATA.length * 2;
    let isComplete = true;
    let firstError = "";

    GAME_DATA.forEach(phase => {
      // Check Definition
      const defItem = placedItems[`${phase.id}-${CardType.DEFINITION}`];
      if (defItem?.phaseId === phase.id) correctCount++;
      else {
        isComplete = false;
        if (!firstError && defItem) firstError = "Hi ha conceptes fora de lloc.";
      }

      // Check Example
      const exItem = placedItems[`${phase.id}-${CardType.EXAMPLE}`];
      if (exItem?.phaseId === phase.id) correctCount++;
      else {
        isComplete = false;
        if (!firstError && exItem) firstError = "Hi ha exemples fora de lloc.";
      }
    });

    // Also check if all slots are filled
    const placedCount = Object.values(placedItems).filter(Boolean).length;
    
    if (placedCount < totalSlots) {
       setCheckResult({ success: false, message: `Encara et falten ${totalSlots - placedCount} targetes per col·locar!` });
       return;
    }

    if (isComplete) {
      setCheckResult({ success: true, message: "Perfecte! Tot està correcte." });
      setTimeout(() => onComplete(attempts + 1), 1500);
    } else {
      setCheckResult({ success: false, message: "Alguna cosa no quadra... Revisa les files vermelles." });
    }
  };

  // --- Render Helpers ---

  const renderSlot = (phaseId: number, type: CardType) => {
    const slotKey = `${phaseId}-${type}`;
    const item = placedItems[slotKey];
    const isTarget = selectedItemId && !item; // Highlight if we can drop here
    
    // Check validation status (only show red/green after user clicks check)
    const isError = checkResult && item && item.phaseId !== phaseId;
    const isCorrect = checkResult && item && item.phaseId === phaseId;
    
    // Check if this specific slot matches the type of the currently selected card
    const selectedItemObj = poolItems.find(i => i.id === selectedItemId) || Object.values(placedItems).find(i => (i as DraggableItem | null)?.id === selectedItemId);
    const isValidTarget = selectedItemObj && selectedItemObj.type === type;


    return (
      <div 
        onClick={() => !item ? handleSlotClick(phaseId, type) : null}
        className={`
          flex-1 min-h-[140px] rounded-lg border-2 border-dashed transition-all duration-200 relative
          flex items-center justify-center p-2
          ${isValidTarget && !item ? 'border-indigo-400 bg-indigo-50 cursor-pointer animate-pulse' : 'border-slate-300 bg-slate-50'}
          ${isError ? 'border-red-400 bg-red-50' : ''}
          ${isCorrect ? 'border-green-400 bg-green-50' : ''}
        `}
      >
        {!item && (
          <div className="text-slate-400 text-sm font-medium text-center pointer-events-none select-none">
            {type === CardType.DEFINITION ? 'Arrossega la Definició' : "Arrossega l'Exemple"}
          </div>
        )}
        
        {item && (
          <div className="w-full h-full relative group">
             <Card 
              item={item} 
              isSelected={selectedItemId === item.id}
              onClick={() => handleItemClick(item)}
              isPlaced={true}
              className={isError ? '!border-red-300 !bg-red-50' : isCorrect ? '!border-green-300 !bg-green-50' : ''}
            />
            {/* Remove button (Desktop hover / Mobile separate tap target if needed, but tap to return works too) */}
            <button 
              onClick={(e) => { e.stopPropagation(); handleReturnToPool(item); }}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow border hover:bg-red-50 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Retornar a la pila"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100 overflow-hidden h-screen">
      
      {/* --- Main Board (Left/Top) --- */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar h-full">
        <header className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Tauler de Marca</h2>
            <p className="text-slate-500 text-sm">Omple la graella. Clica una targeta i després un forat buit.</p>
          </div>
          <div className="flex items-center gap-4">
             {checkResult && (
               <div className={`px-4 py-2 rounded-full text-sm font-bold animate-pop-in ${checkResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                 {checkResult.message}
               </div>
             )}
            <button 
              onClick={checkAnswers}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              <Check size={18} /> Validar
            </button>
          </div>
        </header>

        <div className="space-y-6 pb-32 md:pb-0">
          {GAME_DATA.map((phase) => {
            const Icon = IconMap[phase.iconName] || HelpCircle;
            return (
              <div key={phase.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                {/* Mobile: Stacked. Desktop: Horizontal Grid */}
                <div className="flex flex-col md:flex-row gap-4">
                  
                  {/* Phase Title Column */}
                  <div className="md:w-48 flex-shrink-0 flex md:flex-col items-center md:items-start gap-3 md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-3 md:pb-0 md:pr-4">
                    <div className="bg-indigo-100 p-3 rounded-lg text-indigo-700">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm md:text-base">{phase.title}</h3>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{phase.subtitle}</span>
                    </div>
                  </div>

                  {/* Slots */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderSlot(phase.id, CardType.DEFINITION)}
                    {renderSlot(phase.id, CardType.EXAMPLE)}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- Card Pool (Right/Bottom) --- */}
      <div className="md:w-80 bg-slate-200 border-l border-slate-300 flex flex-col h-[30vh] md:h-full shadow-2xl z-20">
        <div className="p-4 bg-slate-300 border-b border-slate-400 flex justify-between items-center">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <RefreshCw size={16} /> Targetes Disponibles
          </h3>
          <span className="bg-slate-600 text-white text-xs px-2 py-1 rounded-full">{poolItems.length} restants</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
            {poolItems.map((item) => (
              <Card 
                key={item.id}
                item={item}
                isSelected={selectedItemId === item.id}
                onClick={() => handleItemClick(item)}
              />
            ))}
            {poolItems.length === 0 && (
              <div className="text-center py-10 opacity-50">
                <p className="text-slate-500 text-sm">No queden targetes!</p>
                <p className="text-xs text-slate-400 mt-1">Revisa el tauler i prem Validar.</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};