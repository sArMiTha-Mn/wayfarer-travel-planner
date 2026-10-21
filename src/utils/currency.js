export const supportedCurrencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 152.0 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 84.0 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.50 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.38 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 1.33 },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', rate: 0.88 },
];

export function getCurrencySymbol(currencyCode = 'USD') {
  const match = supportedCurrencies.find((c) => c.code === currencyCode);
  return match ? match.symbol : '$';
}

export function formatCurrency(amount, currencyCode = 'USD') {
  const cur = supportedCurrencies.find((c) => c.code === currencyCode) || supportedCurrencies[0];
  const value = Math.round(amount);

  if (currencyCode === 'JPY') {
    return `¥${value.toLocaleString()}`;
  }
  if (currencyCode === 'INR') {
    return `₹${value.toLocaleString()}`;
  }
  if (currencyCode === 'EUR') {
    return `€${value.toLocaleString()}`;
  }
  if (currencyCode === 'GBP') {
    return `£${value.toLocaleString()}`;
  }
  return `${cur.symbol}${value.toLocaleString()}`;
}
