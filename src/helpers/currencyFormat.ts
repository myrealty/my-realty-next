export const currencyFormat = (price: number, currency: string) => {
  if (Intl) {
    return Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  }
  return price;
};
