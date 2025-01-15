import { useState, useEffect } from "react";
import { RunningText, TitlePage } from "@/components/TypingText";
import Section from "@/components/Section";
import Link from "next/link";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleteOrder, setDeleteOrder] = useState(null); // Order to delete

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error("Failed to fetch orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setEditData(order);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedOrder._id, updates: editData }),
      });

      if (response.ok) {
        setSelectedOrder(null);
        fetchOrders(); // Refresh orders list
      } else {
        console.error("Failed to update order.");
      }
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (order) => {
    setDeleteOrder(order);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteOrder) return;

    setLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deleteOrder._id }),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== deleteOrder._id)
        );
        setDeleteOrder(null);
      } else {
        console.error("Failed to delete order.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id="menu">
      <RunningText />
      <TitlePage title="Orders List" />
      <Link href="/">Go to Home</Link>

      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Orders</h1>
        {loading && <p>Loading orders...</p>}
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border p-4 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <p>
                  <strong>Client:</strong> {order.name}
                </p>
                <p>
                  <strong>Address:</strong> {order.address}
                </p>
                <p>
                  <strong>Total Price:</strong> ${order.totalPrice}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEditClick(order)}
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(order)}
                  className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Order Popup */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <form
              onSubmit={handleEditSubmit}
              className="bg-white p-6 rounded-lg shadow-lg space-y-4"
            >
              <h2 className="text-xl font-semibold">Edit Order</h2>
              <div>
                <label className="block font-medium">Client Name</label>
                <input
                  type="text"
                  value={editData.name || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="w-full border px-4 py-2 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium">Address</label>
                <input
                  type="text"
                  value={editData.address || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, address: e.target.value })
                  }
                  className="w-full border px-4 py-2 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium">Total Price</label>
                <input
                  type="number"
                  value={editData.totalPrice || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, totalPrice: e.target.value })
                  }
                  className="w-full border px-4 py-2 rounded-md"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Delete Confirmation Popup */}
        {deleteOrder && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
              <h2 className="text-xl font-semibold">Confirm Delete</h2>
              <p>
                Are you sure you want to delete the order for{" "}
                <strong>{deleteOrder.name}</strong>?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setDeleteOrder(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};

export default Orders;
