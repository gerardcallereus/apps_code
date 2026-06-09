import React from 'react';
import { CostCategory } from '../data/initialData';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface CostTableProps {
  category: CostCategory;
  onUpdateItem: (categoryId: string, itemId: string, newValue: number) => void;
}

export const CostTable: React.FC<CostTableProps> = ({ category, onUpdateItem }) => {
  const total = category.items.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-xl border p-6 shadow-sm", category.color)}
    >
      <h3 className="font-bold text-lg mb-2">{category.title}</h3>
      <p className="text-sm opacity-80 mb-4">{category.description}</p>
      
      <div className="space-y-3">
        {category.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <span title={item.name}>{item.name}</span>
            <div className="flex items-center gap-2">
              {item.isEditable ? (
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.value}
                    onChange={(e) => onUpdateItem(category.id, item.id, parseFloat(e.target.value) || 0)}
                    className="w-24 text-right bg-white/50 border border-black/10 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                  <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs opacity-50 pointer-events-none">€</span>
                </div>
              ) : (
                <span className="font-mono font-medium">{item.value.toFixed(2)} €</span>
              )}
            </div>
          </div>
        ))}
        
        <div className="h-px bg-black/10 my-2" />
        
        <div className="flex items-center justify-between font-bold text-base">
          <span>{category.totalLabel}</span>
          <span className="font-mono text-lg">{total.toFixed(2)} €</span>
        </div>
      </div>
    </motion.div>
  );
};
