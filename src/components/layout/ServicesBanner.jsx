import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Monitor, BatteryCharging, HardDrive, MessageSquare, Wrench, MapPin } from 'lucide-react';
import { getServiceInquiryWhatsAppUrl } from '../../utils/whatsapp';

export const ServicesBanner = () => {
  const { settings } = useStore();

  const services = [
    {
      id: 'screen',
      icon: Monitor,
      title: 'Screen Replacement',
      desc: 'Original & OEM replacement screens for Dell, HP, Lenovo & MacBooks.',
      prompt: 'Screen Replacement Quote for my Laptop'
    },
    {
      id: 'battery',
      icon: BatteryCharging,
      title: 'Battery Replacement',
      desc: 'Fresh backup batteries with tested health & replacement warranty.',
      prompt: 'Battery Replacement Inquiry for my Laptop'
    },
    {
      id: 'upgrades',
      icon: HardDrive,
      title: 'RAM & SSD Speed Upgrades',
      desc: 'Upgrade from slow hard drives to ultra-fast NVMe SSDs & 16GB/32GB RAM.',
      prompt: 'RAM and SSD Speed Upgrade Inquiry'
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#eaf2f8] border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 space-y-1.5">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            <Wrench className="w-3.5 h-3.5" />
            <span>Hardware Repair & Upgrade Services</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Laptop Screen Replacement and Battery Renewal
          </h3>
          <p className="text-xs text-slate-600">
            Visit our workshop at <b>Balkhi Chowk, Hazara Town</b> or click below to message us on WhatsApp for exact cost estimates.
          </p>
        </div>

        {/* 3 Simple Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {services.map((s) => (
            <a
              key={s.id}
              href={getServiceInquiryWhatsAppUrl(s.prompt, settings)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-white hover:-translate-y-1 border border-slate-200 hover:border-amber-300 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
            >
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  {s.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-bold">
                <span>Ask Quote on WhatsApp</span>
                <span className="group-hover:translate-x-1 transition-transform">?</span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
