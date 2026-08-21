import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { SearchX, RotateCcw } from 'lucide-react';

export const ProductGrid = () => {
  const { filteredProducts, filters, updateFilter, resetFilters } = useStore();

  const categories = [
    { id: 'All', label: 'All Products' },
    { id: 'Laptops', label: 'Laptops' },
    { id: 'Accessories', label: 'Computer Accessories' }
  ];

  const conditions = [
    { id: 'All', label: 'All Conditions' },
    { id: 'Brand New', label: 'Brand New' },
    { id: 'Like New', label: 'Like New' },
    { id: 'Refurbished', label: 'Used / Refurbished' }
  ];

  return (
    <div className="space-y-7">
      
      {/* Category Tabs */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-700">The collection</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">Find your next machine</h2>
        </div>
        <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isActive = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => updateFilter('category', cat.id)}
              className={"px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm " + (
                isActive
                  ? 'bg-sky-600 text-white shadow-sky-600/20 scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              )}
            >
              {cat.label}
            </button>
          );
        })}
        </div>
      </div>

      {/* Filter and Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Condition Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1 hidden sm:inline">Condition:</span>
          {conditions.map((cond) => {
            const isActive = filters.condition === cond.id;
            return (
              <button
                key={cond.id}
                onClick={() => updateFilter('condition', cond.id)}
                className={"px-3 py-1.5 rounded-lg text-xs font-medium transition-colors " + (
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                )}
              >
                {cond.label}
              </button>
            );
          })}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 ml-auto">
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-sky-600 focus:bg-white cursor-pointer font-medium"
          >
            <option value="featured">Featured Items</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          {(filters.category !== 'All' || filters.condition !== 'All' || filters.searchQuery) && (
            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rose-50 font-semibold transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-4 max-w-md mx-auto shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <SearchX className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No products found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Click All Products or message us on WhatsApp to check availability.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-sm hover:bg-sky-700 transition-colors"
          >
            Show All Products
          </button>
        </div>
      )}

    </div>
  );
};