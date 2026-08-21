import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Filter, RotateCcw, Check, Cpu, HardDrive } from 'lucide-react';

export const FilterSidebar = ({ onCloseMobile }) => {
  const { filters, updateFilter, resetFilters, products } = useStore();

  const brands = ['All', ...Array.from(new Set(products.map((p) => p.brand))).sort()];
  const isLaptopsActive = filters.category === 'Laptops' || filters.category === 'All';

  return (
    <aside className="bg-white border border-slate-200 rounded-2xl p-5 space-y-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-sky-400" />
          <h3 className="font-bold text-slate-900 text-sm">Filters & Sorting</h3>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs text-slate-400 hover:text-sky-400 flex items-center gap-1 transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Category Filter */}
      <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
        <div className="grid grid-cols-3 gap-1.5">
          {['All', 'Laptops', 'Accessories'].map((cat) => {
            const active = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => updateFilter('category', cat)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all ${
                  active
                    ? 'bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/30'
                    : 'bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Condition Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Condition</label>
        <div className="space-y-1">
          {[
            { id: 'All', label: 'All Conditions' },
            { id: 'Brand New', label: 'Brand New' },
            { id: 'Like New', label: 'Like New / Open Box' },
            { id: 'Refurbished', label: 'Used / Certified Refurbished' },
          ].map((cond) => {
            const active = filters.condition === cond.id;
            return (
              <button
                key={cond.id}
                onClick={() => updateFilter('condition', cond.id)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  active
                    ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-200'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{cond.label}</span>
                {active && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Brand Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Brand</label>
        <div className="max-h-40 overflow-y-auto pr-1 space-y-1">
          {brands.map((b) => {
            const active = filters.brand === b;
            return (
              <button
                key={b}
                onClick={() => updateFilter('brand', b)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  active
                    ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-200'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{b}</span>
                {active && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Processor Filter (For Laptops) */}
      {isLaptopsActive && (
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-sky-600" />
            <span>Processor (CPU)</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'All', label: 'All CPUs' },
              { id: 'Intel Core i5', label: 'Core i5' },
              { id: 'Intel Core i7', label: 'Core i7' },
              { id: 'Intel Core i9', label: 'Core i9' },
              { id: 'AMD Ryzen', label: 'AMD Ryzen' },
              { id: 'Apple M-Series', label: 'Apple M-Series' },
            ].map((p) => {
              const active = filters.processorGroup === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => updateFilter('processorGroup', p.id)}
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-medium text-center transition-colors ${
                    active
                      ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/40'
                      : 'bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. RAM Memory Filter (For Laptops) */}
      {isLaptopsActive && (
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <HardDrive className="w-3.5 h-3.5 text-sky-600" />
            <span>RAM Memory</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {['All', '8GB', '16GB', '32GB+'].map((ram) => {
              const active = filters.ram === ram;
              return (
                <button
                  key={ram}
                  onClick={() => updateFilter('ram', ram)}
                  className={`py-1.5 rounded-lg text-[11px] font-medium text-center transition-colors ${
                    active
                      ? 'bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/40'
                      : 'bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {ram}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. In Stock Only Toggle */}
      <div className="pt-3 border-t border-slate-200">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
            Show In-Stock Only
          </span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => updateFilter('inStockOnly', e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 accent-sky-600 cursor-pointer"
          />
        </label>
      </div>

      {/* Mobile Close Button */}
      {onCloseMobile && (
        <button
          onClick={onCloseMobile}
          className="w-full py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs shadow-lg"
        >
          Apply Filters
        </button>
      )}

    </aside>
  );
};
