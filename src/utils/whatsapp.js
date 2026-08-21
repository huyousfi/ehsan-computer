export const cleanPhoneNumber = (number) => {
  if (!number) return '923001234567';
  return number.toString().replace(/[^0-9]/g, '');
};

export const getSingleProductWhatsAppUrl = (product, settings) => {
  const phone = cleanPhoneNumber(settings?.whatsappNumber);
  const currency = settings?.currency || '$';
  
  let msg = `*INQUIRY / ORDER FROM WEBSITE*\n`;
  msg += `--------------------------------\n`;
  msg += `*Product:* ${product.name}\n`;
  msg += `*Category:* ${product.category}\n`;
  msg += `*Condition:* ${product.condition}\n`;
  msg += `*Price:* ${currency}${product.price}\n`;

  if (product.specs?.processor) {
    msg += `*CPU:* ${product.specs.processor}\n`;
  }
  if (product.specs?.ram) {
    msg += `*RAM:* ${product.specs.ram}\n`;
  }
  if (product.specs?.storage) {
    msg += `*Storage:* ${product.specs.storage}\n`;
  }

  msg += `--------------------------------\n`;
  msg += `Salam Ehsan Computers! Please confirm if this item is in stock at your Hazara Town shop.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
};

export const getCartOrderWhatsAppUrl = (cartItems, customerInfo, totalAmount, settings) => {
  const phone = cleanPhoneNumber(settings?.whatsappNumber);
  const currency = settings?.currency || '$';

  let msg = `*NEW ORDER: ${settings?.storeName || 'Ehsan Computer and Accessories'}*\n`;
  msg += `--------------------------------\n`;
  msg += `*Customer Name:* ${customerInfo?.name || 'Not specified'}\n`;
  if (customerInfo?.phone) msg += `*Phone:* ${customerInfo.phone}\n`;
  if (customerInfo?.address) msg += `*Delivery Address:* ${customerInfo.address}\n`;
  if (customerInfo?.city) msg += `*City:* ${customerInfo.city}\n`;
  msg += `--------------------------------\n`;
  msg += `*ORDER ITEMS:*\n`;

  cartItems.forEach((item, index) => {
    msg += `\n${index + 1}. *${item.name}* (x${item.quantity})\n`;
    msg += `   � Condition: ${item.condition}\n`;
    if (item.specs?.ram || item.specs?.storage) {
      msg += `   � Specs: ${item.specs?.ram || ''} | ${item.specs?.storage || ''}\n`;
    }
    msg += `   � Price: ${currency}${item.price * item.quantity} (${currency}${item.price} each)\n`;
  });

  msg += `\n--------------------------------\n`;
  msg += `*TOTAL ESTIMATE:* *${currency}${totalAmount.toLocaleString()}*\n`;

  if (customerInfo?.note && customerInfo.note.trim()) {
    msg += `--------------------------------\n`;
    msg += `*Customer Note / Custom Upgrades:*\n"${customerInfo.note.trim()}"\n`;
  }

  msg += `--------------------------------\n`;
  msg += `Please confirm my order and share payment/delivery options. Thank you!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
};

export const getServiceInquiryWhatsAppUrl = (serviceType, settings) => {
  const phone = cleanPhoneNumber(settings?.whatsappNumber);
  let msg = `*REPAIR & SERVICE INQUIRY: ${settings?.storeName || 'Ehsan Computer and Accessories'}*\n`;
  msg += `--------------------------------\n`;
  msg += `Hi! I need help with: *${serviceType || 'Laptop Repair / Screen / Battery Replacement'}*.\n`;
  msg += `My laptop model is: \n`;
  msg += `Issue details: \n`;
  msg += `Please let me know the cost and estimated repair time.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
};
