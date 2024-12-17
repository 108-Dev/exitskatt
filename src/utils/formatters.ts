export const formatToMNOK = (value: number): string => {
  const millions = value / 1_000_000;
  return new Intl.NumberFormat('nb-NO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(millions);
};

export const parseMNOK = (value: string): number => {
  const millions = parseFloat(value);
  return millions * 1_000_000;
};

export const formatNOK = (amount: number): string => {
  return new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: 'NOK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatCurrency = (amount: number, useNOK = false): string => {
  // Always use NOK for amounts less than 1 million
  if (amount < 1_000_000 || useNOK) {
    return formatNOK(amount);
  }
  
  const millions = amount / 1_000_000;
  return `${new Intl.NumberFormat('nb-NO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(millions)} mNOK`;
};