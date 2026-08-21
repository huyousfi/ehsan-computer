const fs = require('fs');
const path = require('path');

function cleanFile(filePath) {
  let text = fs.readFileSync(filePath, 'utf8');
  let original = text;

  // Replace broken emoji question mark patterns
  text = text.replace(/\?\? Laptops/g, 'Laptops');
  text = text.replace(/\?\?\? Computer Accessories/g, 'Computer Accessories');
  text = text.replace(/\?\? Used/g, 'Used');
  text = text.replace(/\? Brand New/g, 'Brand New');
  text = text.replace(/\? Like New/g, 'Like New');
  text = text.replace(/\? Screen/g, 'Screen');
  text = text.replace(/\? Battery/g, 'Battery');
  text = text.replace(/\? RAM/g, 'RAM');
  text = text.replace(/\? In Stock/g, 'In Stock');
  text = text.replace(/? \?/g, '?');
  text = text.replace(/?? \?/g, 'Compare');
  text = text.replace(/\?\? All Products/g, 'All Products');
  text = text.replace(/\? Compare/g, 'Compare');
  text = text.replace(/Laptops \?/g, 'Laptops');
  text = text.replace(/Accessories \?/g, 'Accessories');
  text = text.replace(/Price \?/g, 'Price');
  text = text.replace(/Ask Repair Price \?/g, 'Ask Repair Price');

  // Replace text question marks
  text = text.replace(/Need Assistance\?/g, 'Contact Support');
  text = text.replace(/Laptop Broken Screen or Weak Battery\?/g, 'Laptop Screen Replacement and Battery Renewal');
  text = text.replace(/Need Screen or Battery Replacement\?/g, 'Laptop Screen and Battery Replacement Available');
  text = text.replace(/Need Custom RAM\/SSD Upgrades or Warranty Extension\?/g, 'Custom RAM and SSD Upgrades Available');
  text = text.replace(/is this item currently in stock\? Can you share warranty and delivery details\?/g, 'Please confirm if this item is currently in stock at your Hazara Town shop.');
  text = text.replace(/Have questions about laptop availability, RAM upgrades, or repair prices\? Message us on WhatsApp:/g, 'For questions regarding laptop models, RAM upgrades, or repair prices, message us on WhatsApp:');

  if (text !== original) {
    fs.writeFileSync(filePath, text, 'utf8');
    console.log('Cleaned question marks in:', filePath);
  }
}

function scan(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      scan(full);
    } else if (full.endsWith('.jsx') || full.endsWith('.js')) {
      cleanFile(full);
    }
  }
}

scan('src');
console.log('Completed question mark removal.');
