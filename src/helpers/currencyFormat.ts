export const currencyFormat = (price: number, currency: string) => {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
};
