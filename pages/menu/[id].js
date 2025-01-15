import { useRouter } from "next/router";
import { Ourmenu } from "@/constant";
import Section from "@/components/Section";
import { RunningText, TitlePage } from "@/components/TypingText";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";

const CoffeeItem = () => {
  const [client, setClient] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const router = useRouter();
  const { id } = router.query;

  const coffee = Ourmenu.find((item) => item.id === id);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!client || !address) {
      alert("Please fill out all fields.");
      return;
    }

    setLoading(true);
    setResponseMessage("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: client,
          address,
          items: [
            { name: coffee.title, quantity: 1, price: Number(coffee.price) },
          ],
          totalPrice: Number(coffee.price),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResponseMessage("Order Created successful ");
        setClient("");
        setAddress("");
      } else {
        const errorData = await response.json();
        setResponseMessage("Error: " + errorData.message);
      }
    } catch (error) {
      console.error("Error making request:", error);
      setResponseMessage("Error making request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!coffee) {
    return (
      <Section id="menu">
        <RunningText />
        <TitlePage title="Order Page" />
        <div className="mt-[50px] flex flex-row min-h-[70vh] gap-2">
          <h1>No Coffee found</h1>
        </div>
      </Section>
    );
  }

  return (
    <Section id="menu">
      <RunningText />
      <TitlePage title="Order Page" />
      <Link href="/">Go to Home</Link>
      <div className="mt-[50px] flex flex-row min-h-[70vh] gap-2">
        <motion.div className="flex-[10] relative flex items-center justify-center min-w-[180px] h-[450px] cursor-pointer transition-[flex] ease-in-out duration-700 overflow-hidden">
          <Image
            src={coffee.imgUrl}
            alt="coffee"
            fill
            className="rounded-xl object-cover"
          />
          <div className="absolute p-6 w-full h-36 bottom-0 left-0 rounded-b-xl bg-[rgba(0,0,0,0.5)] text-white">
            <h2 className="text-3xl font-semibold">{coffee.title}</h2>
            <p className="text-2xl font-medium">{coffee.price}</p>
          </div>
        </motion.div>
      </div>
      {responseMessage && (
        <p className="mt-4 text-center text-sm text-red-500">
          {responseMessage}
        </p>
      )}
      <div className=" flex items-center justify-center border-2">
        <form className="space-y-4 max-w-lg" onSubmit={handleSubmit}>
          <input
            value={client}
            onChange={(e) => setClient(e.target.value)}
            type="text"
            name="Client"
            placeholder="Name of Client"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            name="Address"
            placeholder="Address of Client"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className=" w-full px-6 py-3 text-white bg-blue-500 rounded-md font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Order"}
          </button>
        </form>
      </div>
    </Section>
  );
};

export default CoffeeItem;
