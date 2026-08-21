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

const formatSpecLabel = (key) => key
  .replace(/([A-Z])/g, ' $1')
  .replace(/^./, (letter) => letter.toUpperCase());

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
  const visibleSpecs = Object.entries(selectedProduct.specs || {})
    .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== '');

  const handleAddToCartAndOpen = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#10263d]/75 backdrop-blur-md overflow-y-auto">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#f6f8fb] border border-white rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-slate-200 bg-white sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${getConditionColor(selectedProduct.condition)}`}>
              {selectedProduct.condition}
            </span>
            <span className="text-xs font-bold text-[#1F4F9D] uppercase tracking-wider">
              {selectedProduct.brand} / {selectedProduct.category}
            </span>
          </div>

          <button
            onClick={() => setSelectedProduct(null)}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-7">
          
          {/* Top Section: Photo + Title + Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Image Box */}
            <div className="md:col-span-5 relative rounded-2xl overflow-hidden bg-white border border-slate-200 h-64 flex items-center justify-center shadow-sm">
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
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F26522]">Product overview</p>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-950 leading-tight">
                {selectedProduct.name}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedProduct.summary || 'A carefully selected product from our current collection.'}
              </p>

              {/* Price & Stock */}
              <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#1F4F9D]">
                  {formatPrice(selectedProduct.price, settings.currency)}
                </span>
                {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(selectedProduct.originalPrice, settings.currency)}
                  </span>
                )}
                <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${
                  selectedProduct.inStock 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {selectedProduct.inStock ? 'In Stock & Ready' : 'Currently Out of Stock'}
                </span>
              </div>

              {/* Quantity & Comparison Button */}
              <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-[#1F4F9D] hover:bg-sky-50"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-[#1F4F9D] hover:bg-sky-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isLaptop && (
                  <button
                    onClick={() => toggleCompare(selectedProduct)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                      isCompared
                        ? 'bg-[#1F4F9D] text-white border-[#1F4F9D]'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-sky-50 hover:text-[#1F4F9D]'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5 text-[#1F4F9D]" />
                    <span>{isCompared ? 'In Compare List' : 'Add to Compare'}</span>
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* Full Technical Specifications Table */}
          {visibleSpecs.length > 0 && (
            <div className="space-y-3 pt-5 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#1F4F9D]" />
                  <span>{isLaptop ? 'Technical Specifications' : 'Product Details'}</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {visibleSpecs.map(([key, value]) => (
                  <div key={key} className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                    <span className="block font-semibold text-[#1F4F9D] uppercase tracking-wider text-[10px]">
                      {formatSpecLabel(key)}
                    </span>
                    <span className="block mt-1 font-semibold text-slate-800 text-xs leading-relaxed">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Upgrade / Repair Hint Box */}
          <div className="p-4 rounded-2xl bg-[#eef4ff] border border-[#bed2ff] flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#F26522] shrink-0 mt-0.5" />
            <div className="text-xs">
              <h4 className="font-bold text-[#1F4F9D]">Need a different setup?</h4>
              <p className="text-slate-600 mt-0.5">
                We can upgrade the RAM, install larger NVMe storage, or apply protective screen guards before dispatch. Let us know when ordering on WhatsApp!
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 sm:px-7 py-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center gap-3 sticky bottom-0 z-10 backdrop-blur-md">
          
          <button
            onClick={handleAddToCartAndOpen}
            disabled={!selectedProduct.inStock}
            className="w-full sm:w-1/2 py-3 rounded-xl bg-[#1F4F9D] hover:bg-[#173f80] disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-[#1F4F9D]/20"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add ({quantity}) to Cart / {formatPrice(selectedProduct.price * quantity, settings.currency)}</span>
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
