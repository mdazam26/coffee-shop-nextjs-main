import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  name: { type: String, },
  address: { type: String, },
  items: [
    {
      name: { type: String, },
      quantity: { type: String, },
      price: { type: Number, },
    }
  ],
  totalPrice: { type: Number, },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
