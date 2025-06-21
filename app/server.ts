import app from "./app";

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log(`App running on PORT ${PORT} http://localhost:${PORT}`);
  console.log(`GraphiQL running on http://localhost:${PORT}/graphql`);
});
