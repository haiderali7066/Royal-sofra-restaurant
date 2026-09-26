"use client";

import React from "react";
import Image from "next/image";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col font-sans">
      <main className="flex-grow">
        {/* Minimal Hero */}
        <section className="bg-[#2B1B12] py-24 text-center px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image 
              src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=1920"
              alt="Texture"
              fill
              className="object-cover grayscale"
            />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-serif text-[#FFFDF9] mb-4">
              Get in <span className="italic text-[#D4A24C]">Touch</span>
            </h1>
            <p className="text-[#E8DFD3] text-lg font-light">
              Whether you want to reserve a table or ask a question, we are here for you.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="max-w-[1200px] mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left: Contact Form */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_10px_40px_-10px_rgba(43,27,18,0.08)] border border-[#E8DFD3]">
            <h2 className="text-3xl font-serif text-[#2B1B12] mb-8">Send a Message</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#5C4638] uppercase tracking-wider">First Name</label>
                  <input type="text" className="w-full bg-[#FAF7F2] border-none rounded-xl px-4 py-3 text-[#2B1B12] focus:ring-2 focus:ring-[#D4A24C] outline-none transition-all" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#5C4638] uppercase tracking-wider">Last Name</label>
                  <input type="text" className="w-full bg-[#FAF7F2] border-none rounded-xl px-4 py-3 text-[#2B1B12] focus:ring-2 focus:ring-[#D4A24C] outline-none transition-all" placeholder="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#5C4638] uppercase tracking-wider">Email Address</label>
                <input type="email" className="w-full bg-[#FAF7F2] border-none rounded-xl px-4 py-3 text-[#2B1B12] focus:ring-2 focus:ring-[#D4A24C] outline-none transition-all" placeholder="john@example.com" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#5C4638] uppercase tracking-wider">Message</label>
                <textarea rows={5} className="w-full bg-[#FAF7F2] border-none rounded-xl px-4 py-3 text-[#2B1B12] focus:ring-2 focus:ring-[#D4A24C] outline-none transition-all resize-none" placeholder="How can we help you?"></textarea>
              </div>

              <button className="w-full bg-[#D4A24C] hover:bg-[#B8862B] text-white font-bold tracking-widest uppercase py-4 rounded-xl transition-colors shadow-lg shadow-[#D4A24C]/20">
                Send Message
              </button>
            </form>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col justify-center space-y-12">
            <div>
              <h2 className="text-3xl font-serif text-[#2B1B12] mb-8">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FAF7F2] flex items-center justify-center shrink-0 text-[#D4A24C]">
                    <FiMapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2B1B12] text-lg">Location</h3>
                    <p className="text-[#5C4638] font-light mt-1">
                      5th Road Commercial Market Rd,<br />
                      Block D Satellite Town, Rawalpindi, 46000
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FAF7F2] flex items-center justify-center shrink-0 text-[#D4A24C]">
                    <FiPhone size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2B1B12] text-lg">Phone</h3>
                    <p className="text-[#5C4638] font-light mt-1">
                      +92 345 9567444<br />
                      051-8894444
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FAF7F2] flex items-center justify-center shrink-0 text-[#D4A24C]">
                    <FiMail size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2B1B12] text-lg">Email</h3>
                    <p className="text-[#5C4638] font-light mt-1">info@royalsofra.com</p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-[#E8DFD3]" />

            <div>
              <div className="flex items-center gap-3 mb-6">
                <FiClock size={24} className="text-[#D4A24C]" />
                <h3 className="text-2xl font-serif text-[#2B1B12]">Opening Hours</h3>
              </div>
              <ul className="space-y-3 text-[#5C4638] font-light">
                <li className="flex justify-between items-center pb-2 border-b border-[#FAF7F2]">
                  <span>Monday - Thursday</span>
                  <span className="font-medium text-[#2B1B12]">12:00 PM - 11:30 PM</span>
                </li>
                <li className="flex justify-between items-center pb-2 border-b border-[#FAF7F2]">
                  <span>Friday - Sunday</span>
                  <span className="font-medium text-[#2B1B12]">12:00 PM - 01:00 AM</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}