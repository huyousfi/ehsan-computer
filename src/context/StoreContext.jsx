import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_SETTINGS } from '../data/defaultSettings';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const StoreContext = createContext();

const ADMIN_SESSION_MS = 15 * 60 * 1000;
const ADMIN_MAX_ATTEMPTS = 5;
const ADMIN_LOCKOUT_MS = 30 * 1000;

const productToRow = (product) => ({
  id: product.id,
  name: product.name,
  category: product.category,
  brand: product.brand,
  condition: product.condition,
  price: product.price,
  original_price: product.originalPrice || null,
  in_stock: product.inStock !== false,
  stock_count: product.stockCount || 0,
  is_featured: product.isFeatured === true,
  image: product.image || '',
  summary: product.summary || '',
  specs: product.specs || {},
  tags: product.tags || []
});

const rowToProduct = (row) => ({
  id: row.id,
  name: row.name,
  category: row.category,
  brand: row.brand,
  condition: row.condition,
  price: Number(row.price),
  originalPrice: row.original_price ? Number(row.original_price) : null,
  inStock: row.in_stock !== false,
  stockCount: Number(row.stock_count || 0),
  isFeatured: row.is_featured === true,
  image: row.image || '',
  summary: row.summary || '',
  specs: row.specs || {},
  tags: Array.isArray(row.tags) ? row.tags : []
});

const getSupabaseWriteError = (error) => {
  if (error?.code === '23514') {
    return 'Product category must be exactly "Laptops" or "Accessories".';
  }
  if (error?.code === '42501') {
    return 'Supabase rejected this write. Add an INSERT or UPDATE policy for products.';
  }
  return error?.message || 'Supabase rejected the product change.';
};

const IMPORTABLE_SETTING_KEYS = [
  'storeName',
  'tagline',
  'whatsappNumber',
  'currency',
  'currencyCode',
  'email',
  'address',
  'businessHours',
  'servicesNotice',
  'trustBadges'
];

const isValidProduct = (product) => (
  product &&
  typeof product === 'object' &&
  typeof product.name === 'string' &&
  product.name.trim().length > 0 &&
  typeof product.brand === 'string' &&
  (product.category === 'Laptops' || product.category === 'Accessories') &&
  Number.isFinite(Number(product.price))
);

const normalizeImportedProduct = (product) => ({
  ...product,
  name: product.name.trim(),
  brand: product.brand.trim(),
  price: Number(product.price),
  originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
  inStock: product.inStock !== false,
  stockCount: Number.isFinite(Number(product.stockCount)) ? Number(product.stockCount) : 0,
  specs: product.specs && typeof product.specs === 'object' ? product.specs : {},
  summary: typeof product.summary === 'string' ? product.summary : '',
  image: typeof product.image === 'string' ? product.image : ''
});

export const StoreProvider = ({ children }) => {
  // Products and settings are loaded from Supabase only.
  const [products, setProducts] = useState([]);

  // 2. Settings State
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // 3. Cart State
  const [cart, setCart] = useState([]);

  // 4. Compare List State (Laptops)
  const [compareList, setCompareList] = useState([]);

  // 5. Filter State (Simplified for user friendliness)
  const initialFilters = {
    category: 'All', // 'All' | 'Laptops' | 'Accessories'
    brand: 'All',
    condition: 'All', // 'All' | 'Brand New' | 'Like New' | 'Refurbished'
    searchQuery: '',
    sortBy: 'featured', // 'featured' | 'price-low' | 'price-high'
  };

  const [filters, setFilters] = useState(initialFilters);

  // 6. UI Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const loadRemoteStore = async () => {
      const [{ data: productRows, error: productsError }, { data: settingsRow, error: settingsError }] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('store_settings').select('settings').eq('id', 1).maybeSingle()
      ]);

      if (productsError) {
        console.error('Failed to load products from Supabase', productsError);
        showToast(`Could not load products: ${productsError.message}`, 'error');
      } else if (productRows) {
        setProducts(productRows.map(rowToProduct));
      }

      if (settingsError) {
        console.error('Failed to load settings from Supabase', settingsError);
        showToast(`Could not load store settings: ${settingsError.message}`, 'error');
      } else if (settingsRow?.settings) {
        setSettings((previous) => ({ ...previous, ...settingsRow.settings }));
      }
    };

    if (!isSupabaseConfigured) {
      showToast('Supabase is not configured in this deployment.', 'error');
      return undefined;
    }

    supabase.auth.getSession().then(({ data }) => setAuthUser(data.session?.user || null));
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user || null);
    });
    loadRemoteStore();
    return () => authListener.subscription.unsubscribe();
  }, []);

  // Notification Toast State
  const [toast, setToast] = useState(null);
  const [failedAdminAttempts, setFailedAdminAttempts] = useState(0);
  const [adminLockedUntil, setAdminLockedUntil] = useState(0);
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Cart Methods
  const addToCart = (product, quantity = 1) => {
    if (!product.inStock) {
      showToast(`${product.name} is currently out of stock.`, 'warning');
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });

    showToast(`Added ${product.name} to Cart`, 'success');
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Compare Methods
  const toggleCompare = (product) => {
    if (product.category !== 'Laptops') {
      showToast('Comparison is only available for laptops.', 'warning');
      return;
    }

    setCompareList((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast('Removed from comparison', 'info');
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 4) {
        showToast('You can compare up to 4 laptops at a time.', 'warning');
        return prev;
      }
      showToast(`Added ${product.name} to comparison`, 'success');
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  // Filter Methods
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  // Admin / Product Operations
  const addProduct = async (newProductData) => {
    const id = newProductData.id || `prod-${Date.now()}`;
    const newProduct = { ...newProductData, id };
    if (!isSupabaseConfigured || !authUser) {
      showToast('Supabase is not configured.', 'error');
      return false;
    }

    const { error } = await supabase.from('products').insert(productToRow(newProduct));
    if (error) {
      console.error('Failed to create product in Supabase', error);
      showToast(getSupabaseWriteError(error), 'error');
      return false;
    }

    setProducts((prev) => [newProduct, ...prev]);
    showToast('Product created successfully!', 'success');
    return true;
  };

  const updateProduct = async (updatedProduct) => {
    if (!isSupabaseConfigured || !authUser) {
      showToast('Supabase is not configured.', 'error');
      return false;
    }

    const { error } = await supabase.from('products').upsert(productToRow(updatedProduct));
    if (error) {
      console.error('Failed to update product in Supabase', error);
      showToast(getSupabaseWriteError(error), 'error');
      return false;
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    showToast('Product updated successfully!', 'success');
    return true;
  };

  const deleteProduct = async (productId) => {
    if (!isSupabaseConfigured || !authUser) {
      showToast('Supabase is not configured.', 'error');
      return false;
    }

    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      console.error('Failed to delete product in Supabase', error);
      showToast(getSupabaseWriteError(error), 'error');
      return false;
    }

    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((p) => p.id !== productId));
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product deleted', 'info');
    return true;
  };

  const toggleProductStock = (productId) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p))
    );
    if (isSupabaseConfigured) {
      const product = products.find((item) => item.id === productId);
      if (product) {
        supabase.from('products').update({ in_stock: !product.inStock }).eq('id', productId).then(({ error }) => {
          if (error) console.error('Failed to update product stock in Supabase', error);
        });
      }
    }
    showToast('Stock status updated', 'info');
  };

  const updateStoreSettings = async (newSettings) => {
    if (!isSupabaseConfigured || !authUser) {
      showToast('Supabase is not configured.', 'error');
      return false;
    }

    const nextSettings = { ...settings, ...newSettings };
    const { error } = await supabase.from('store_settings').upsert({ id: 1, settings: nextSettings, updated_at: new Date().toISOString() });
    if (error) {
      console.error('Failed to update settings in Supabase', error);
      showToast(getSupabaseWriteError(error), 'error');
      return false;
    }

    setSettings(nextSettings);
    showToast('Settings saved successfully', 'success');
    return true;
  };

  const exportCatalogJSON = () => {
    const { adminPin, ...safeSettings } = settings;
    const data = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      storeName: settings.storeName,
      settings: safeSettings,
      products,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ehsan_catalog_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Catalog exported to JSON', 'success');
  };

  const importCatalogJSON = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (!data || !Array.isArray(data.products) || data.products.length === 0) {
        throw new Error('Backup must contain a non-empty products array');
      }

      const validProducts = data.products.filter(isValidProduct).map(normalizeImportedProduct);
      if (validProducts.length !== data.products.length) {
        throw new Error('Backup contains invalid product records');
      }

      setProducts(validProducts);
      if (data.settings && typeof data.settings === 'object') {
        const safeSettings = IMPORTABLE_SETTING_KEYS.reduce((result, key) => {
          if (Object.prototype.hasOwnProperty.call(data.settings, key)) {
            result[key] = data.settings[key];
          }
          return result;
        }, {});
        setSettings((prev) => ({ ...prev, ...safeSettings }));
      }
      showToast('Catalog imported successfully!', 'success');
      return true;
    } catch (e) {
      showToast('Invalid JSON file format', 'error');
      return false;
    }
  };

  const resetToDefaultData = () => {
    showToast('Browser storage has been removed. Manage catalog data in Supabase.', 'info');
  };

  const loginAdmin = async (email, password) => {
    if (!isSupabaseConfigured) {
      showToast('Supabase is not configured.', 'error');
      return false;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      showToast(error.message, 'error');
      return false;
    }
    showToast('Admin access granted', 'success');
    return true;
  };

  const logoutAdmin = async () => {
    await supabase.auth.signOut();
    setIsAdminOpen(false);
    showToast('Logged out of Admin panel', 'info');
  };

  const updateAdminPassword = async (password) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      showToast(error.message, 'error');
      return false;
    }
    showToast('Password changed successfully', 'success');
    return true;
  };

  useEffect(() => {
    if (!authUser) return undefined;

    const sessionTimer = window.setTimeout(() => {
      supabase.auth.signOut();
      setIsAdminOpen(false);
      showToast('Admin session expired. Please unlock the panel again.', 'info');
    }, ADMIN_SESSION_MS);

    return () => window.clearTimeout(sessionTimer);
  }, [authUser]);

  // Filtered Products
  const filteredProducts = products.filter((product) => {
    // Category
    if (filters.category !== 'All' && product.category !== filters.category) {
      return false;
    }

    // Brand
    if (filters.brand !== 'All' && product.brand.toLowerCase() !== filters.brand.toLowerCase()) {
      return false;
    }

    // Condition
    if (filters.condition !== 'All' && product.condition !== filters.condition) {
      return false;
    }

    // Search Query
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase().trim();
      const matchName = product.name.toLowerCase().includes(query);
      const matchBrand = product.brand.toLowerCase().includes(query);
      const matchSummary = product.summary?.toLowerCase().includes(query);
      const matchTags = product.tags?.some((t) => t.toLowerCase().includes(query));
      if (!matchName && !matchBrand && !matchSummary && !matchTags) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'price-low') return a.price - b.price;
    if (filters.sortBy === 'price-high') return b.price - a.price;
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        products,
        filteredProducts,
        settings,
        cart,
        cartTotalCount,
        cartTotalPrice,
        compareList,
        filters,
        selectedProduct,
        isCartOpen,
        isCompareOpen,
        isAdminOpen,
        isAdminAuthenticated: Boolean(authUser),
        toast,
        // Actions
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        updateFilter,
        resetFilters,
        setSelectedProduct,
        setIsCartOpen,
        setIsCompareOpen,
        setIsAdminOpen,
        showToast,
        // Admin
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStock,
        updateStoreSettings,
        updateAdminPassword,
        exportCatalogJSON,
        importCatalogJSON,
        resetToDefaultData,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
