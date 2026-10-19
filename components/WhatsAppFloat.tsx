"use client";

import { FaWhatsapp } from "react-icons/fa";

const PHONE = "923459567444"; // +92 345 9567444
const MESSAGE = "Hello Royal Sofra, I would like to make an inquiry.";

export default function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex items-center"
    >
      <span className="mr-3 hidden sm:block rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#2B1B12] shadow-lg opacity-0 translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
        Chat with us
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/40 transition-transform duration-300 group-hover:scale-110">
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping" />
        <FaWhatsapp size={30} className="relative" />
      </span>
    </a>
  );
}
