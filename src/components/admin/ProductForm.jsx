import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Save, Upload, Image as ImageIcon } from 'lucide-react';

const ACCESSORY_SPEC_FIELDS = [
  { key: 'productType', label: 'Product Type', placeholder: 'e.g. USB Flash Drive, HDMI Cable, Monitor' },
  { key: 'capacity', label: 'Capacity / Size', placeholder: 'e.g. 32GB, 64GB, 1TB, 24-inch' },
  { key: 'connectivity', label: 'Connection / Interface', placeholder: 'e.g. USB-A 3.0, USB-C, HDMI 2.1, Bluetooth' },
  { key: 'compatibility', label: 'Compatibility', placeholder: 'e.g. Windows, Mac, Android, PlayStation' },
  { key: 'length', label: 'Cable Length', placeholder: 'e.g. 1.5 meters (cables only)' },
  { key: 'features', label: 'Main Features', placeholder: 'e.g. Fast charging, wireless, waterproof' },
  { key: 'color', label: 'Color / Finish', placeholder: 'e.g. Black, Silver, White' },
  { key: 'warranty', label: 'Warranty', placeholder: 'e.g. 1 Year Warranty' }
];

export const ProductForm = ({ productToEdit, onClose }) => {
  const { addProduct, updateProduct, settings } = useStore();

  const isEditing = !!productToEdit;

  const [formData, setFormData] = useState({
    name: '',
    category: 'Laptops',
    brand: 'Dell',
    condition: 'Brand New',
    price: '',
    originalPrice: '',
    inStock: true,
    stockCount: 5,
    isFeatured: false,
    image: '',
    summary: '',
    specs: {
      processor: '',
      ram: '',
      storage: '',
      display: '',
      graphics: '',
      battery: '',
      ports: '',
      weight: '',
      os: 'Windows 11 Pro',
      warranty: '3 Months Store Warranty'
    }
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        ...productToEdit,
        price: productToEdit.price || '',
        originalPrice: productToEdit.originalPrice || '',
        specs: { ...productToEdit.specs }
      });
    }
  }, [productToEdit]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpecChange = (specKey, value) => {
    setFormData((prev) => ({
      ...prev,
      specs: { ...prev.specs, [specKey]: value }
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Please choose an image smaller than 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => handleChange('image', reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Please provide at least product name and price.');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      stockCount: Number(formData.stockCount || 1)
    };

    const saved = isEditing
      ? await updateProduct(payload)
      : await addProduct(payload);
    if (saved) {
      onClose();
    }
  };

  const isLaptop = formData.category === 'Laptops';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/65 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#f6f8fb] border border-white rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-slate-200 bg-white sticky top-0 z-10 backdrop-blur-md">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-700">Catalog editor</p>
            <h3 className="text-base font-bold text-slate-950">
            {isEditing ? ('Edit Product: ' + formData.name) : 'Add New Product'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="admin-form p-5 sm:p-7 overflow-y-auto flex-1 space-y-6 text-xs">
          
          {/* General Information */}
          <div className="space-y-3">
            <label className="font-bold text-sky-700 uppercase tracking-wider text-[11px]">
              1. Basic Information
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dell XPS 15 9530"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Brand *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dell, Apple, HP, Logitech"
                  value={formData.brand}
                  onChange={(e) => handleChange('brand', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="Laptops">Laptops</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Condition</label>
                <select
                  value={formData.condition}
                  onChange={(e) => handleChange('condition', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="Brand New">Brand New</option>
                  <option value="Like New">Like New</option>
                  <option value="Refurbished">Refurbished</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Stock Status</label>
                <select
                  value={formData.inStock ? 'true' : 'false'}
                  onChange={(e) => handleChange('inStock', e.target.value === 'true')}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Sale Price ({settings.currency}) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 75000"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl font-bold text-emerald-400 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Original / Cut Price ({settings.currency})</label>
                <input
                  type="number"
                  placeholder="e.g. 90000"
                  value={formData.originalPrice}
                  onChange={(e) => handleChange('originalPrice', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Stock Quantity</label>
                <input
                  type="number"
                  value={formData.stockCount}
                  onChange={(e) => handleChange('stockCount', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Short Summary / Pitch</label>
              <textarea
                rows="2"
                placeholder="Brief description highlighted on the product card..."
                value={formData.summary}
                onChange={(e) => handleChange('summary', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Product image upload */}
          <div className="space-y-2 pt-3 border-t border-slate-800">
            <label className="font-bold text-sky-700 uppercase tracking-wider text-[11px]">
              2. Product Image
            </label>

            <div className="flex gap-3 items-center rounded-2xl border border-slate-200 bg-white p-3">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                {formData.image ? (
                  <img src={formData.image} alt="Product preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-7 h-7 text-slate-300" />
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>{formData.image ? 'Change image' : 'Choose image'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
                </label>
                <p className="text-[10px] text-slate-500">JPG, PNG, or WEBP up to 5 MB. The image stays on this device.</p>
                {formData.image && (
                  <button type="button" onClick={() => handleChange('image', '')} className="text-[10px] font-semibold text-rose-600 hover:text-rose-700">
                    Remove image
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Technical Specifications */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <label className="font-bold text-sky-700 uppercase tracking-wider text-[11px]">
              3. Technical Specifications {isLaptop ? '(Laptop Hardware Details)' : '(Features)'}
            </label>

            {isLaptop ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Processor (CPU)</label>
                  <input
                    type="text"
                    placeholder="e.g. Intel Core i7-13700H (14-Core)"
                    value={formData.specs?.processor || ''}
                    onChange={(e) => handleSpecChange('processor', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">RAM Memory</label>
                  <input
                    type="text"
                    placeholder="e.g. 16GB DDR5 5200MHz"
                    value={formData.specs?.ram || ''}
                    onChange={(e) => handleSpecChange('ram', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">SSD Storage</label>
                  <input
                    type="text"
                    placeholder="e.g. 512GB NVMe PCIe Gen4"
                    value={formData.specs?.storage || ''}
                    onChange={(e) => handleSpecChange('storage', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Display Screen</label>
                  <input
                    type="text"
                    placeholder="e.g. 14.0-inch FHD+ IPS (1920x1200) 400 nits"
                    value={formData.specs?.display || ''}
                    onChange={(e) => handleSpecChange('display', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Graphics (GPU)</label>
                  <input
                    type="text"
                    placeholder="e.g. NVIDIA RTX 4050 6GB or Integrated"
                    value={formData.specs?.graphics || ''}
                    onChange={(e) => handleSpecChange('graphics', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Battery Health / Life</label>
                  <input
                    type="text"
                    placeholder="e.g. 86Wh (95% Health) - up to 9 hours"
                    value={formData.specs?.battery || ''}
                    onChange={(e) => handleSpecChange('battery', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Operating System</label>
                  <input
                    type="text"
                    placeholder="e.g. Windows 11 Pro / macOS"
                    value={formData.specs?.os || ''}
                    onChange={(e) => handleSpecChange('os', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Warranty Period</label>
                  <input
                    type="text"
                    placeholder="e.g. 3 Months Store Warranty + Charger"
                    value={formData.specs?.warranty || ''}
                    onChange={(e) => handleSpecChange('warranty', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            ) : (
              <div>
                <p className="text-[11px] text-slate-500 mb-3">Add the details shoppers need for cables, storage, monitors, mice, keyboards, and other accessories.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ACCESSORY_SPEC_FIELDS.map((field) => (
                    <div key={field.key}>
                      <label className="block text-slate-400 mb-1">{field.label}</label>
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={formData.specs?.[field.key] || ''}
                        onChange={(e) => handleSpecChange(field.key, e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-[#f6f8fb] pb-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Create Product'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
