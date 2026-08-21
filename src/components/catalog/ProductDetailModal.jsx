import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  ShoppingBag, 
  MessageSquare, 
  Scale, 
  Layers, 
  Sparkles,
  Plus,
  Minus
} from 'lucide-react';
import { formatPrice, getDiscountPercentage, getConditionColor } from '../../utils/formatters';
import { getSingleProductWhatsAppUrl } from '../../utils/whatsapp';

export const ProductDetailModal = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    settings, 
    addToCart, 
    compareList, 
    toggleCompare, 
    setIsCartOpen 
  } = useStore();

  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) return null;

  const isLaptop = selectedProduct.category === 'Laptops';
  const isCompared = compareList.some((p) => p.id === selectedProduct.id);
  const discount = getDiscountPercentage(selectedProduct.price, selectedProduct.originalPrice);

  const handleAddToCartAndOpen = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${getConditionColor(selectedProduct.condition)}`}>
              {selectedProduct.condition}
            </span>
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              {selectedProduct.brand} � {selectedProduct.category}
            </span>
          </div>

          <button
            onClick={() => setSelectedProduct(null)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Top Section: Photo + Title + Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Image Box */}
            <div className="md:col-span-5 relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 h-64 flex items-center justify-center">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              {discount && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-rose-500 text-white shadow-md">
                  {discount}
                </span>
              )}
            </div>

            {/* Title & Pricing Overview */}
            <div className="md:col-span-7 space-y-3.5">
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                {selectedProduct.name}
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedProduct.summary}
              </p>

              {/* Price & Stock */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                  {formatPrice(selectedProduct.price, settings.currency)}
                </span>
                {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                  <span className="text-sm text-slate-500 line-through">
                    {formatPrice(selectedProduct.originalPrice, settings.currency)}
                  </span>
                )}
                <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${
                  selectedProduct.inStock 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {selectedProduct.inStock ? 'In Stock & Ready' : 'Currently Out of Stock'}
                </span>
              </div>

              {/* Quantity & Comparison Button */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-850"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-850"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isLaptop && (
                  <button
                    onClick={() => toggleCompare(selectedProduct)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                      isCompared
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5 text-sky-400" />
                    <span>{isCompared ? 'In Compare List' : 'Add to Compare'}</span>
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* Full Technical Specifications Table */}
          {selectedProduct.specs && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span>Technical Specifications & Hardware Details</span>
                </h3>
              </div>

              <div className="bg-slate-950 rounded-2xl border border-slate-800/90 overflow-hidden divide-y divide-slate-850">
                {Object.entries(selectedProduct.specs).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-1 sm:grid-cols-3 p-3 text-xs">
                    <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
                      {key}
                    </span>
                    <span className="sm:col-span-2 font-medium text-slate-200 mt-0.5 sm:mt-0">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Upgrade / Repair Hint Box */}
          <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-800/40 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <h4 className="font-bold text-sky-200">Custom RAM and SSD Upgrades Available</h4>
              <p className="text-slate-300 mt-0.5">
                We can upgrade the RAM, install larger NVMe storage, or apply protective screen guards before dispatch. Let us know when ordering on WhatsApp!
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center gap-3 sticky bottom-0 z-10 backdrop-blur-md">
          
          <button
            onClick={handleAddToCartAndOpen}
            disabled={!selectedProduct.inStock}
            className="w-full sm:w-1/2 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-sky-400" />
            <span>Add ({quantity}) to Cart � {formatPrice(selectedProduct.price * quantity, settings.currency)}</span>
          </button>

          <a
            href={getSingleProductWhatsAppUrl(selectedProduct, settings)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-1/2 py-3 rounded-xl bg-whatsapp hover:bg-whatsapp-hover text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-whatsapp/20 transition-all text-center"
          >
            <MessageSquare className="w-4 h-4 fill-slate-950" />
            <span>Order Directly via WhatsApp</span>
          </a>

        </div>

      </div>

    </div>
  );
};
