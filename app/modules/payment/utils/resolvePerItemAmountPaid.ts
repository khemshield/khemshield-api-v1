// Assume totalPaid = amountPaid passed from user
export const resolvePerItemAmountPaid = (
  items: { finalPrice: number }[],
  totalPaid: number
) => {
  const totalFinalPrice = items.reduce((sum, i) => sum + i.finalPrice, 0);

  // Avoid divide-by-zero error
  if (totalFinalPrice === 0) {
    return items.map(() => 0);
  }

  return items.map((item) => {
    const share = item.finalPrice / totalFinalPrice;
    return Math.round(share * totalPaid); // Round to nearest Naira
  });
};
