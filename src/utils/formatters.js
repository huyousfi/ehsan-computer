export const formatPrice = (amount, currency = 'Rs. ') => {
  if (typeof amount !== 'number') return amount;
  return currency + amount.toLocaleString();
};

export const getDiscountPercentage = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) return null;
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
  return discount + '% OFF';
};

export const getConditionColor = (condition) => {
  switch (condition ? condition.toLowerCase() : '') {
    case 'brand new':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
    case 'like new':
      return 'bg-sky-50 text-sky-700 border-sky-200 font-semibold';
    case 'refurbished':
      return 'bg-amber-50 text-amber-800 border-amber-200 font-semibold';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200 font-medium';
  }
};