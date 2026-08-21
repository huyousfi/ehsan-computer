import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShoppingBag, 
  MessageSquare, 
  Scale, 
  Eye, 
  ShieldCheck 
} from 'lucide-react';
import { formatPrice, getDiscountPercentage, getConditionColor } from '../../utils/formatters';
import { getSingleProductWhatsAppUrl } from '../../utils/whatsapp';

export const ProductCard = ({ product }) => {
  const { 
    settings, 
    addToCart, 
    compareList, 
    toggleCompare, 
    setSelectedProduct 
  } = useStore();

  const isLaptop = product.category === 'Laptops';
  const isCompared = compareList.some((p) => p.id === product.id);
  const discountText = getDiscountPercentage(product.price, product.originalPrice);

  return (
    <div className="group relative bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-md">
      
      <div>
        {/* Product Image Box */}
        <div 
          onClick={() => setSelectedProduct(product)}
          className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-100 mb-3 cursor-pointer flex items-center justify-center"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Condition Badge */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <span className={"px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider border backdrop-blur-md " + getConditionColor(product.condition)}>
              {product.condition}
            </span>
            {discountText && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-600 text-white shadow-sm">
                {discountText}
              </span>
            )}
          </div>

          {/* Compare Toggle */}
          {isLaptop && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCompare(product);
              }}
              className={"absolute top-2 right-2 p-1.5 rounded-lg text-xs font-semibold backdrop-blur-md transition-all " + (
                isCompared
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white/90 hover:bg-white text-slate-700 border border-slate-200 shadow-sm'
              )}
              title={isCompared ? 'In comparison' : 'Compare with another laptop'}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Quick Specs View Hint */}
          <div className="absolute inset-x-2 bottom-2 py-1 bg-white/95 text-slate-800 text-[11px] font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 border border-slate-200 shadow-sm">
            <Eye className="w-3.5 h-3.5 text-sky-600" />
            <span>Click for Full Specs</span>
          </div>

          {!product.inStock && (
            <div className="absolute inset-0 bg-white/85 backdrop-blur-sm flex flex-col items-center justify-center p-2 text-center">
              <span className="px-2.5 py-0.5 bg-rose-100 text-rose-700 border border-rose-200 rounded-full font-bold text-xs">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Brand & Name */}
        <div className="mb-2">
          <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">
            {product.brand}
          </span>
          <h3 
            onClick={() => setSelectedProduct(product)}
            className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2 cursor-pointer mt-0.5"
          >
            {product.name}
          </h3>
        </div>

        {/* Key Specs Pill */}
        {isLaptop && product.specs && (
          <div className="text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3 space-y-1">
            <div className="font-semibold text-slate-700 truncate">
              {product.specs.processor ? product.specs.processor.split('(')[0] : 'Processor'}
            </div>
            <div className="text-emerald-700 font-bold truncate">
              {product.specs.ram} • {product.specs.storage}
            </div>
          </div>
        )}

        {!isLaptop && (
          <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {product.summary}
          </p>
        )}

      </div>

      {/* Price & Action Buttons */}
      <div className="pt-3 border-t border-slate-100 space-y-2.5">
        
        {/* Price Row */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-base sm:text-lg font-extrabold text-slate-950">
              {formatPrice(product.price, settings.currency)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="ml-1.5 text-[11px] text-slate-400 line-through">
                {formatPrice(product.originalPrice, settings.currency)}
              </span>
            )}
          </div>

          <span className={"text-[10px] font-semibold " + (product.inStock ? 'text-emerald-600' : 'text-slate-400')}>
            {product.inStock ? 'In Stock' : 'Pre-order'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          
          <button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1 border border-slate-200"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-slate-600" />
            <span>Add Cart</span>
          </button>

          <a
            href={getSingleProductWhatsAppUrl(product, settings)}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1 text-center"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-white" />
            <span>WhatsApp</span>
          </a>

        </div>

      </div>

    </div>
  );
};