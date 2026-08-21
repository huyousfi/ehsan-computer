import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Laptop, Mouse, Wrench, MessageSquare, MapPin, ArrowRight } from 'lucide-react';
import { getServiceInquiryWhatsAppUrl } from '../../utils/whatsapp';

export const Hero = () => {
  const { settings, updateFilter } = useStore();

  const scrollToCatalog = (categoryName) => {
    updateFilter('category', categoryName);
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden bg-[#10263d] border-b border-slate-200 py-12 sm:py-16">
      <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_80%_20%,#1F4F9D_0,transparent_28%),radial-gradient(circle_at_15%_90%,#F26522_0,transparent_24%)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header Text */}
        <div className="relative text-center max-w-3xl mx-auto space-y-4 mb-10">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold">
            <MapPin className="w-3.5 h-3.5 text-sky-600" />
            <span>Balkhi Chowk, Hazara Town, Quetta</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.05]">
            Tech that works as hard as you do.
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Browse our inspected stock with genuine check warranty. All prices in <b>Pakistani Rupees (PKR)</b> with direct WhatsApp ordering.
          </p>

        </div>

        {/* 3 Clean Category Cards */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-8">
          
          {/* Card 1: Laptops */}
          <div 
            onClick={() => scrollToCatalog('Laptops')}
            className="group cursor-pointer p-6 rounded-2xl bg-white/[0.97] border border-white/20 hover:-translate-y-1 transition-all text-left space-y-4 shadow-xl shadow-slate-950/20"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Laptop className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                Laptops Catalog
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Dell, HP, Lenovo and MacBooks tested with store warranty.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700">Browse laptops <ArrowRight className="w-3.5 h-3.5" /></span>
          </div>

          {/* Card 2: Accessories */}
          <div 
            onClick={() => scrollToCatalog('Accessories')}
            className="group cursor-pointer p-6 rounded-2xl bg-white/[0.97] border border-white/20 hover:-translate-y-1 transition-all text-left space-y-4 shadow-xl shadow-slate-950/20"
          >
              <div className="w-12 h-12 rounded-xl bg-[#eef4ff] text-[#1F4F9D] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Mouse className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1F4F9D] transition-colors">
                Computer Accessories
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Original Chargers, Mice, Keyboards, SSDs and Bags.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F4F9D]">Browse accessories <ArrowRight className="w-3.5 h-3.5" /></span>
          </div>

          {/* Card 3: Screen & Battery Repairs */}
          <a
            href={getServiceInquiryWhatsAppUrl('Screen and Battery Replacement', settings)}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-2xl bg-white/[0.97] border border-white/20 hover:-translate-y-1 transition-all text-left space-y-4 shadow-xl shadow-slate-950/20 flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wrench className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                Screen & Battery Repairs
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Screen replacement, fresh batteries and speed upgrades.
              </p>
            </div>
            <div className="inline-flex text-xs font-bold text-amber-700 items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Repair Price</span>
            </div>
          </a>

        </div>

        {/* 4 Trust Highlights */}
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-5xl mx-auto pt-6 border-t border-white/15 text-center">
          {settings.trustBadges.map((b) => (
            <div key={b.id} className="p-3 rounded-xl bg-white/10 border border-white/10">
              <span className="text-xs font-bold text-white block">✓ {b.title}</span>
              <span className="text-[11px] text-slate-300">{b.desc}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};