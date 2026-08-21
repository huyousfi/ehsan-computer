import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Phone, 
  ShieldCheck, 
  FileJson
} from 'lucide-react';

export const StoreSettings = () => {
  const { 
    settings, 
    updateStoreSettings, 
    exportCatalogJSON, 
    importCatalogJSON, 
    resetToDefaultData 
  } = useStore();

  const [formData, setFormData] = useState({ ...settings });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateStoreSettings(formData);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        importCatalogJSON(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="admin-settings space-y-6 text-xs">
      
      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-700">Store profile</p>
          <h4 className="text-lg font-extrabold text-slate-950 flex items-center gap-2 pb-3 border-b border-slate-200 mt-1">
          <ShieldCheck className="w-4 h-4 text-sky-600" />
          <span>General Store & WhatsApp Configuration</span>
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Store Name</label>
            <input
              type="text"
              required
              value={formData.storeName}
              onChange={(e) => handleChange('storeName', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Tagline / Slogan</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">WhatsApp Business Number (digits only, with country code)</label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-whatsapp" />
              <input
                type="text"
                required
                placeholder="923001234567"
                value={formData.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Example: <code>923001234567</code> or <code>14155552671</code> (No + or spaces)
            </p>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Currency Symbol</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="$"
                value={formData.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold text-center focus:outline-none focus:border-sky-500"
              />
              <select
                onChange={(e) => {
                  if (e.target.value) handleChange('currency', e.target.value);
                }}
                className="w-full px-2 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-sky-500"
              >
                <option value="">Presets</option>
                <option value="$">USD ($)</option>
                <option value="PKR ">Pakistani Rupee (PKR)</option>
                <option value="AED ">UAE Dirham (AED)</option>
                <option value="SAR ">Saudi Riyal (SAR)</option>
                <option value="�">Euro (�)</option>
                <option value="�">British Pound (�)</option>
                <option value="?">Indian Rupee (?)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Store Physical Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Business Hours</label>
            <input
              type="text"
              value={formData.businessHours}
              onChange={(e) => handleChange('businessHours', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Admin Security PIN</label>
            <input
              type="text"
              required
              value={formData.adminPin}
              onChange={(e) => handleChange('adminPin', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Contact Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>

      {/* Data Backup & Portability Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-700">Data safety</p>
          <h4 className="text-lg font-extrabold text-slate-950 flex items-center gap-2 pb-3 border-b border-slate-200 mt-1">
          <FileJson className="w-4 h-4 text-sky-600" />
          <span>Catalog Backup & Restore (Portability)</span>
          </h4>
        </div>

        <p className="text-slate-400 leading-relaxed">
          You can download a complete backup of your products, specs, and settings as a JSON file, or restore a previous backup from any device.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* Download JSON Backup */}
          <button
            type="button"
            onClick={exportCatalogJSON}
            className="px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold border border-sky-200 flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Catalog JSON</span>
          </button>

          {/* Import JSON File */}
          <label className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 flex items-center gap-2 cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>Import JSON File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Reset Default Data */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all catalog data back to default starter products?')) {
                resetToDefaultData();
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/30 flex items-center gap-2 ml-auto transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

    </div>
  );
};
