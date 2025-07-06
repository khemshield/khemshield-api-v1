export const formatCurrency = (amount: number, currency = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
  }).format(amount);
