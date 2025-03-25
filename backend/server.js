// Load environment variables before importing other modules
const dotenv = require("dotenv");
dotenv.config();

const app = require("./src/app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
