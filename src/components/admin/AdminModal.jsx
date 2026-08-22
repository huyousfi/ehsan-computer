import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Lock, 
  KeyRound, 
  Package, 
  Settings, 
  LogOut, 
  ArrowRight
} from 'lucide-react';
import { ProductList } from './ProductList';
import { StoreSettings } from './StoreSettings';

export const AdminModal = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    isAdminAuthenticated, 
    loginAdmin, 
    logoutAdmin,
    settings 
  } = useStore();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState('products');

  if (!isAdminOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    await loginAdmin(emailInput, passwordInput);
    setPasswordInput('');
  };

  const handleClose = () => {
    if (isAdminAuthenticated) {
      logoutAdmin();
      return;
    }
    setIsAdminOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/65 backdrop-blur-md overflow-hidden">
      
      <div className="relative w-full max-w-5xl bg-[#f6f8fb] border border-white rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-950">Store Management</h2>
              <p className="text-xs text-slate-500">{settings.storeName} <span className="text-slate-300">/</span> Owner workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                onClick={logoutAdmin}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}

            <button
              onClick={handleClose}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-7 overflow-y-auto flex-1">
          
          {!isAdminAuthenticated ? (
            /* Supabase Auth login screen */
            <div className="max-w-sm mx-auto py-12 text-center space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 mx-auto">
                <KeyRound className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-950">Unlock your store workspace</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Sign in with your Supabase admin account to manage products and store settings.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3">
                <input
                  type="email"
                  autoFocus
                  placeholder="Admin email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full text-center py-3 px-4 bg-white border border-slate-300 rounded-xl text-sm text-slate-950 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full text-center py-3 px-4 bg-white border border-slate-300 rounded-xl text-sm text-slate-950 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                />

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/20 transition-all"
                >
                  <span>Unlock Admin Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            /* Authenticated Admin Dashboard */
            <div className="space-y-6">
              
              {/* Tab Switcher */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    activeTab === 'products'
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                      : 'bg-white text-slate-500 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Products & Inventory</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    activeTab === 'settings'
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                      : 'bg-white text-slate-500 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Store & WhatsApp Settings</span>
                </button>
              </div>

              {/* Tab Contents */}
              {activeTab === 'products' && <ProductList />}
              {activeTab === 'settings' && <StoreSettings />}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
