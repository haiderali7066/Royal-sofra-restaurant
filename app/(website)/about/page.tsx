"use client";

import React, { use } from "react";
import Image from "next/image";

import { Award, Utensils, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col font-sans">

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[40vh] md:h-[60vh] w-full flex items-center justify-center">
          <Image 
            src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1920"
            alt="Royal Sofra Interior"
            fill
            className="object-cover brightness-50"
            priority
          />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#FFFDF9] mb-4 tracking-tight">
              Our <span className="italic text-[#D4A24C]">Story</span>
            </h1>
            <p className="text-[#E8DFD3] text-sm md:text-lg max-w-2xl mx-auto font-light tracking-wide">
              A legacy of taste, crafted with passion and served with royalty.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 md:py-32 px-6 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative h-[400px] md:h-[600px] w-full rounded-t-full overflow-hidden shadow-2xl border-4 border-[#FAF7F2]">
            <Image 
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800"
              alt="Master Chef Plating"
              fill
              className="object-cover"
            />
          </div>
          
          <div className="flex flex-col justify-center">
            <span className="text-[#D4A24C] font-bold tracking-[0.2em] uppercase text-xs mb-4">
              The Royal Heritage
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#2B1B12] leading-tight mb-8">
              Redefining the <br /> <span className="italic">Art of Dining</span>
            </h2>
            <div className="space-y-6 text-[#5C4638] leading-relaxed font-light text-lg">
              <p>
                Founded in the heart of Lahore, Royal Sofra began with a simple yet ambitious vision: to bring the grandeur of historical royal feasts to the modern dining table. Every recipe in our menu is a carefully guarded secret, passed down through generations of master chefs.
              </p>
              <p>
                We source only the finest, hand-picked ingredients from local artisans to ensure that every bite resonates with authenticity, bold flavors, and unparalleled quality.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-12 border-t border-[#E8DFD3]">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#D4A24C]">
                  <Utensils size={24} />
                </div>
                <h3 className="font-bold text-[#2B1B12]">Authentic</h3>
                <p className="text-sm text-[#5C4638] font-light">Traditional recipes crafted to perfection.</p>
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#D4A24C]">
                  <Award size={24} />
                </div>
                <h3 className="font-bold text-[#2B1B12]">Premium</h3>
                <p className="text-sm text-[#5C4638] font-light">Award-winning chefs and ambiance.</p>
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#D4A24C]">
                  <Heart size={24} />
                </div>
                <h3 className="font-bold text-[#2B1B12]">Passionate</h3>
                <p className="text-sm text-[#5C4638] font-light">Served with love and royal hospitality.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}