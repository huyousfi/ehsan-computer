import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Trash2, 
  Scale, 
  ShoppingBag, 
  MessageSquare
} from 'lucide-react';
import { formatPrice, getConditionColor } from '../../utils/formatters';
import { getSingleProductWhatsAppUrl } from '../../utils/whatsapp';

export const ComparisonModal = () => {
  const { 
    compareList, 
    removeFromCompare, 
    clearCompare, 
    isCompareOpen, 
    setIsCompareOpen, 
    settings, 
    addToCart,
    updateFilter 
  } = useStore();

  if (!isCompareOpen) return null;

  const specKeys = [
    { key: 'processor', label: 'Processor (CPU)' },
    { key: 'ram', label: 'RAM Memory' },
    { key: 'storage', label: 'SSD Storage' },
    { key: 'display', label: 'Display' },
    { key: 'graphics', label: 'Graphics (GPU)' },
    { key: 'battery', label: 'Battery / Health' },
    { key: 'ports', label: 'I/O Ports' },
    { key: 'weight', label: 'Weight' },
    { key: 'os', label: 'Operating System' },
    { key: 'warranty', label: 'Warranty' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-hidden">
      
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Side-by-Side Laptop Comparison
              </h2>
              <p className="text-xs text-slate-400">
                Comparing {compareList.length} of 4 maximum laptops
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-rose-500/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}

            <button
              onClick={() => setIsCompareOpen(false)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Matrix Area */}
        <div className="p-6 overflow-x-auto overflow-y-auto flex-1">
          
          {compareList.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <Scale className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Laptops in Comparison</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Browse the catalog and click the scale icon on any laptop to compare specs side by side.
              </p>
              <button
                onClick={() => {
                  setIsCompareOpen(false);
                  updateFilter('category', 'Laptops');
                }}
                className="px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs shadow-md"
              >
                Browse Laptops Catalog
              </button>
            </div>
          ) : (
            <div className="min-w-[650px]">
              
              {/* Product Cards Row */}
              <div className="grid grid-cols-12 gap-3 pb-6 border-b border-slate-800">
                <div className="col-span-3 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-end pb-2">
                  Hardware Matrix
                </div>

                {compareList.map((laptop) => (
                  <div key={laptop.id} className={`${compareList.length === 1 ? 'col-span-9' : compareList.length === 2 ? 'col-span-4' : compareList.length === 3 ? 'col-span-3' : 'col-span-2'} space-y-3 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800`}>
                    
                    <div className="relative h-32 rounded-xl overflow-hidden bg-slate-900">
                      <img src={laptop.image} alt={laptop.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeFromCompare(laptop.id)}
                        className="absolute top-2 right-2 p-1 rounded-md bg-slate-950/80 text-rose-400 hover:text-rose-300"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <span className={`absolute bottom-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase ${getConditionColor(laptop.condition)}`}>
                        {laptop.condition}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-sky-400 uppercase">{laptop.brand}</span>
                      <h4 className="font-bold text-xs text-white line-clamp-2 mt-0.5">{laptop.name}</h4>
                    </div>

                    <div className="text-base font-extrabold text-emerald-400">
                      {formatPrice(laptop.price, settings.currency)}
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <button
                        onClick={() => addToCart(laptop)}
                        disabled={!laptop.inStock}
                        className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3 text-sky-400" />
                        <span>Add to Cart</span>
                      </button>

                      <a
                        href={getSingleProductWhatsAppUrl(laptop, settings)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-1.5 rounded-lg bg-whatsapp hover:bg-whatsapp-hover text-slate-950 text-[11px] font-bold flex items-center justify-center gap-1 text-center"
                      >
                        <MessageSquare className="w-3 h-3 fill-slate-950" />
                        <span>WhatsApp Order</span>
                      </a>
                    </div>

                  </div>
                ))}
              </div>

              {/* Spec Rows */}
              <div className="divide-y divide-slate-850">
                {specKeys.map((spec) => (
                  <div key={spec.key} className="grid grid-cols-12 gap-3 py-3 items-center text-xs">
                    <div className="col-span-3 font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
                      {spec.label}
                    </div>

                    {compareList.map((laptop) => (
                      <div key={laptop.id} className={`${compareList.length === 1 ? 'col-span-9' : compareList.length === 2 ? 'col-span-4' : compareList.length === 3 ? 'col-span-3' : 'col-span-2'} text-slate-200 font-medium text-xs`}>
                        {laptop.specs?.[spec.key] || '—'}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
