import connectToDatabase from "../../lib/mongodb";
import Order from "../../models/Order";

export default async function handler(req, res) {
  await connectToDatabase();

  const { method } = req;
  try {
    if (method === "GET") {
      const orders = await Order.find({});
      res.status(200).json(orders);
    } else if (method === "POST") {
      const { name, address, items, totalPrice } = req.body;

      // Validate input
      if (!name || !address || !items || !totalPrice) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      // Create and save the order
      const order = new Order({ name, address, items, totalPrice });
      await order.save();

      res.status(201).json({ message: "Order saved successfully!", order });
    } else if (method === "PUT") {
      // Update an order by ID
      const { id, updates } = req.body;

      if (!id || !updates) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      const updatedOrder = await Order.findByIdAndUpdate(id, updates, {
        new: true, // Return the updated document
      });

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found." });
      }

      res.status(200).json({ message: "Order updated successfully!", updatedOrder });
    } else if (method === "DELETE") {
      // Delete an order by ID
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ message: "Order ID is required." });
      }

      const deletedOrder = await Order.findByIdAndDelete(id);

      if (!deletedOrder) {
        return res.status(404).json({ message: "Order not found." });
      }

      res.status(200).json({ message: "Order deleted successfully!", deletedOrder });
    } else {
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).json({ message: `Method ${method} Not Allowed.` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
}
