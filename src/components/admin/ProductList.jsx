import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Edit3, Trash2, Search } from 'lucide-react';
import { formatPrice, getConditionColor } from '../../utils/formatters';
import { ProductForm } from './ProductForm';

export const ProductList = () => {
  const { 
    products, 
    deleteProduct, 
    toggleProductStock, 
    settings 
  } = useStore();

  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      
      {/* Top Header Actions */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-700">Inventory</p>
          <h3 className="text-xl font-extrabold text-slate-950 tracking-tight">Products & stock</h3>
          <p className="text-xs text-slate-500 mt-1">Update listings, pricing, and availability from one place.</p>
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search products in admin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <button
          onClick={() => setIsAddingNew(true)}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Condition</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3 text-center">Stock Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-sky-50/40 transition-colors">
                  
                  {/* Item Image & Title */}
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-11 h-11 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 max-w-xs">
                      <h4 className="font-bold text-slate-900 truncate">{product.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{product.brand}</p>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-50 text-slate-500 border border-slate-200">
                      {product.category}
                    </span>
                  </td>

                  {/* Condition */}
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getConditionColor(product.condition)}`}>
                      {product.condition}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-3 font-bold text-emerald-400">
                    {formatPrice(product.price, settings.currency)}
                  </td>

                  {/* Stock Toggle */}
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => toggleProductStock(product.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                        product.inStock
                          ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30'
                      }`}
                    >
                      {product.inStock ? 'In Stock' : '? Out of Stock'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-sky-100 text-slate-500 hover:text-sky-700 transition-colors"
                      title="Edit Product"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
                          deleteProduct(product.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="px-6 py-14 text-center border-t border-slate-100">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <h4 className="mt-3 text-sm font-bold text-slate-900">Your catalog is ready</h4>
              <p className="mt-1 text-xs text-slate-500">Add your first product to start showing items on the website.</p>
              <button onClick={() => setIsAddingNew(true)} className="mt-4 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold">
                Add first product
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Render Add/Edit Modal when opened */}
      {(isAddingNew || editingProduct) && (
        <ProductForm
          productToEdit={editingProduct}
          onClose={() => {
            setIsAddingNew(false);
            setEditingProduct(null);
          }}
        />
      )}

    </div>
  );
};
