import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShoppingBag, 
  Scale, 
  Search, 
  MessageSquare, 
  X, 
  PhoneCall, 
  Lock, 
  MapPin 
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import logo from '../../assets/Logo.png';

export const Header = () => {
  const { 
    settings, 
    cartTotalCount, 
    cartTotalPrice, 
    compareList, 
    filters, 
    updateFilter, 
    resetFilters,
    setIsCartOpen, 
    setIsCompareOpen, 
    setIsAdminOpen 
  } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-sm">
      
      {/* Top Shop Notice Bar */}
      <div className="bg-slate-900 text-slate-200 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Open Today
            </span>
            <span className="flex items-center gap-1 text-slate-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              {settings.address}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href={"https://wa.me/" + settings.whatsappNumber}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-3 h-3" /> +92 370 2811078
            </a>
          </div>

        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          
          {/* Logo & Store Title */}
          <div 
            className="flex items-center gap-3 cursor-pointer group shrink-0" 
            onClick={() => { resetFilters(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <img src={logo} alt={settings.storeName} className="w-24 sm:w-32 h-10 sm:h-12 rounded-xl object-contain bg-white group-hover:scale-105 transition-transform" />
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                {settings.storeName}
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Balkhi Chowk, Hazara Town • Laptops & Accessories
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex-1 max-w-md mx-2 sm:mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Dell, HP, Core i7, Chargers, Mouse..."
                value={filters.searchQuery}
                onChange={(e) => updateFilter('searchQuery', e.target.value)}
                className="w-full pl-10 pr-9 py-2 bg-slate-100/90 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10 transition-all"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => updateFilter('searchQuery', '')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Compare Button */}
            {compareList.length > 0 && (
              <button
                onClick={() => setIsCompareOpen(true)}
                className="px-3 py-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Compare Selected Laptops"
              >
                <Scale className="w-4 h-4 text-sky-600" />
                <span>Compare ({compareList.length})</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 flex items-center gap-2 transition-colors"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-slate-700" />
                {cartTotalCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 text-[10px] font-bold text-white bg-emerald-600 rounded-full flex items-center justify-center shadow-sm">
                    {cartTotalCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] uppercase text-slate-500 font-bold">Cart</span>
                <span className="text-xs font-bold text-slate-900">
                  {formatPrice(cartTotalPrice, settings.currency)}
                </span>
              </div>
            </button>

            {/* Direct WhatsApp Shop Button */}
            <a
              href={"https://wa.me/" + settings.whatsappNumber + "?text=" + encodeURIComponent('Salam Ehsan Computers! I want to inquire about available laptops and accessories.')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>WhatsApp Shop</span>
            </a>

            {/* Admin Login Key */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 border border-slate-200 transition-colors"
              title="Store Owner Login"
            >
              <Lock className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};