export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
