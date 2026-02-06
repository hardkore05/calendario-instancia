const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("👉 Entró a connectDB()");

  try {
    console.log("👉 Intentando conectar a MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB conectado correctamente");
  } catch (error) {
    console.error("❌ Error conectando MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;



