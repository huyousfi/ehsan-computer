import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MessageSquare, 
  User, 
  FileText
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { getCartOrderWhatsAppUrl } from '../../utils/whatsapp';

export const CartDrawer = () => {
  const { 
    cart, 
    cartTotalCount, 
    cartTotalPrice, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    settings 
  } = useStore();

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    note: ''
  });

  const [showPreview, setShowPreview] = useState(false);

  if (!isCartOpen) return null;

  const handleInputChange = (field, value) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
  };

  const whatsAppUrl = getCartOrderWhatsAppUrl(cart, customerInfo, cartTotalPrice, settings);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        
        {/* Drawer Panel */}
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Top Bar */}
          <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Your Shopping Cart</h2>
                <p className="text-xs text-slate-400">{cartTotalCount} item(s) selected</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded hover:bg-rose-500/10 transition-colors"
                  title="Clear Cart"
                >
                  Empty
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="p-5 overflow-y-auto flex-1 space-y-5">
            
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500 mx-auto">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Your cart is empty</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                    Add laptops or computer accessories to build your custom WhatsApp order.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs shadow-md"
                >
                  Start Browsing
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Selected Items ({cart.length})
                  </label>

                  {cart.map((item) => (
                    <div key={item.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex gap-3 items-center">
                      
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover bg-slate-900 shrink-0 border border-slate-800"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                        <p className="text-[11px] text-slate-400 truncate">
                          {item.specs?.ram ? (item.specs.ram + ' • ' + item.specs.storage) : item.condition}
                        </p>
                        <div className="text-xs font-extrabold text-emerald-400 mt-1">
                          {formatPrice(item.price * item.quantity, settings.currency)}
                          {item.quantity > 1 && (
                            <span className="text-[10px] text-slate-500 font-normal ml-1">
                              ({formatPrice(item.price, settings.currency)} each)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="p-1 text-slate-400 hover:text-white rounded"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="p-1 text-slate-400 hover:text-white rounded"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

                {/* Customer Details Form */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <User className="w-4 h-4 text-sky-400" />
                    <span>Customer & Delivery Details (Optional)</span>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={customerInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="City / Area"
                        value={customerInfo.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                      />
                      <input
                        type="tel"
                        placeholder="Contact Phone"
                        value={customerInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Full Delivery Address or Shop Pickup Note"
                      value={customerInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />

                    <textarea
                      placeholder="Custom Upgrade Request (e.g. Please upgrade RAM to 32GB or check original charger)"
                      rows="2"
                      value={customerInfo.note}
                      onChange={(e) => handleInputChange('note', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* WhatsApp Receipt Preview Toggle */}
                <div>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{showPreview ? 'Hide Message Preview' : 'Preview WhatsApp Message'}</span>
                  </button>

                  {showPreview && (
                    <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300/90 whitespace-pre-wrap leading-relaxed">
                      {decodeURIComponent(whatsAppUrl.split('text=')[1] || '')}
                    </div>
                  )}
                </div>
              </>
            )}

          </div>

          {/* Bottom Checkout Section */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-950/80 space-y-3">
              
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-semibold text-slate-400">Estimated Total</span>
                <span className="text-xl font-extrabold text-emerald-400">
                  {formatPrice(cartTotalPrice, settings.currency)}
                </span>
              </div>

              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-whatsapp hover:bg-whatsapp-hover text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-whatsapp/20 transition-all text-center"
              >
                <MessageSquare className="w-4 h-4 fill-slate-950" />
                <span>Send Order to WhatsApp</span>
              </a>

              <p className="text-[10px] text-center text-slate-500">
                No upfront online payment required • Chat directly with store owner
              </p>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
