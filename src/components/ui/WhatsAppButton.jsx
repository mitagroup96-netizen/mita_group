"use client";

import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

export default function WhatsAppButton() {

  const phoneNumber = "8801906884840"; 
  const message = "Hello! I want to know about your books.";

  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Link
      href={url}
      target="_blank"
      className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300"
    >
      <FaWhatsapp size={24} />
    </Link>
  );
}