import React from 'react';
import { useStore } from '../../context/StoreContext';
import { PhoneCall, MapPin, Clock, Lock, MessageSquare } from 'lucide-react';
import logo from '../../assets/Logo.png';

export const Footer = () => {
  const { settings, setIsAdminOpen, updateFilter } = useStore();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Col 1: Store info */}
          <div className="grid grid-cols-[minmax(132px,38%)_1fr] items-center gap-4 sm:gap-6 pl-2 sm:pl-3">
            <img src={logo} alt={settings.storeName} className="w-full h-24 sm:h-28 rounded-lg object-contain bg-white shrink-0" />
            <div className="space-y-2">
              <h1 className="font-extrabold text-white text-xl sm:text-2xl leading-tight">
                {settings.storeName}
              </h1>
              <p className="text-slate-300 leading-relaxed text-sm">
                Quality business and gaming laptops, computer accessories, and screen/battery replacement solutions at Balkhi Chowk, Hazara Town.
              </p>
            </div>
          </div>

          {/* Col 2: Contact details */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Contact & Shop Location</h4>
            <div className="flex items-start gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
              <a 
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline font-bold"
              >
                +92 370 2811078 (WhatsApp / Call)
              </a>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{settings.businessHours}</span>
            </div>
          </div>

          {/* Col 3: WhatsApp CTA */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Contact Support</h4>
            <p className="text-slate-400 text-xs">
              For questions regarding laptop models, RAM upgrades, or repair prices, message us on WhatsApp:
            </p>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Salam Ehsan Computers! I would like to inquire about laptops.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-whatsapp hover:bg-whatsapp-hover text-slate-950 font-bold text-xs shadow-md shadow-whatsapp/20 transition-all"
            >
              <MessageSquare className="w-4 h-4 fill-slate-950" />
              <span>Chat on WhatsApp: +92 370 2811078</span>
            </a>
          </div>

        </div>

        {/* Copyright & Admin Link */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            � {new Date().getFullYear()} {settings.storeName} � Hazara Town, Quetta.
          </div>

          <button
            onClick={() => setIsAdminOpen(true)}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors p-1 rounded hover:bg-slate-900"
            title="Store Admin Panel"
          >
            <Lock className="w-3 h-3" />
            <span>Store Owner Login</span>
          </button>
        </div>

      </div>
    </footer>
  );
};
