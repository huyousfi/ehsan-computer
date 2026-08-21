import React from 'react';
import { useStore } from './context/StoreContext';
import { Header } from './components/layout/Header';
import { Hero } from './components/layout/Hero';
import { ServicesBanner } from './components/layout/ServicesBanner';
import { ProductGrid } from './components/catalog/ProductGrid';
import { ProductDetailModal } from './components/catalog/ProductDetailModal';
import { ComparisonModal } from './components/compare/ComparisonModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { AdminModal } from './components/admin/AdminModal';
import { Footer } from './components/layout/Footer';
import { MessageSquare, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function App() {
  const { settings, toast, compareList, setIsCompareOpen } = useStore();

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900 flex flex-col font-sans selection:bg-sky-200 selection:text-slate-950">
      
      {/* Toast Notification Alert */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-bounce duration-300 max-w-sm">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md ${
            toast.type === 'success' 
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50 shadow-emerald-950/50' 
              : toast.type === 'error'
              ? 'bg-rose-950/90 text-rose-200 border-rose-500/50 shadow-rose-950/50'
              : 'bg-sky-950/90 text-sky-200 border-sky-500/50 shadow-sky-950/50'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-sky-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* 1. Hero with 3 Clear Action Cards */}
        <Hero />

        {/* 2. Main Product Catalog Section */}
        <section id="catalog-section" className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <ProductGrid />
        </section>

        {/* 3. Screen & Battery Replacement Services */}
        <ServicesBanner />

      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
        
        {/* Floating Compare Pill (if items selected) */}
        {compareList.length > 0 && (
          <button
            onClick={() => setIsCompareOpen(true)}
            className="px-4 py-2 rounded-full bg-sky-500 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/30 flex items-center gap-2 hover:scale-105 transition-all"
          >
            <span>Compare ({compareList.length}) Laptops</span>
          </button>
        )}

        {/* Floating WhatsApp Quick-Chat Button */}
        <a
          href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Salam Ehsan Computers! I have an inquiry about your laptops or accessories.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group px-4 py-3 rounded-full bg-whatsapp hover:bg-whatsapp-hover text-slate-950 font-extrabold text-xs shadow-2xl shadow-whatsapp/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          title="Chat with us on WhatsApp"
        >
          <MessageSquare className="w-5 h-5 fill-slate-950" />
          <span className="font-extrabold">WhatsApp Chat</span>
        </a>
      </div>

      {/* Modals & Slide-overs */}
      <ProductDetailModal />
      <ComparisonModal />
      <CartDrawer />
      <AdminModal />

      {/* Footer */}
      <Footer />

    </div>
  );
}
