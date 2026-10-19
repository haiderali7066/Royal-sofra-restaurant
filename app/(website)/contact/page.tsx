"use client";

import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiCheck, FiAlertCircle } from "react-icons/fi";

const BASIN_URL = "https://usebasin.com/f/77d812a5413d";

const INFO = [
  { icon: FiMapPin, title: "Location", lines: ["5th Road Commercial Market Rd,", "Block D Satellite Town, Rawalpindi, 46000"] },
  { icon: FiPhone, title: "Phone", lines: ["+92 345 9567444", "051-8894444"] },
  { icon: FiMail, title: "Email", lines: ["info@royalsofra.com"] },
];

const HOURS = [
  { days: "Monday - Thursday", time: "12:00 PM - 11:30 PM" },
  { days: "Friday - Sunday", time: "12:00 PM - 01:00 AM" },
];

const inputCls =
  "w-full bg-[#FAF7F2] border border-transparent rounded-2xl px-5 py-3.5 text-[#2B1B12] placeholder-[#2B1B12]/35 outline-none transition-all focus:bg-white focus:border-[#D4A24C] focus:ring-4 focus:ring-[#D4A24C]/15";

// Slides/fades in when scrolled into view
function Reveal({ children, from = "left", delay = 0, className = "" }: { children: ReactNode; from?: "left" | "right" | "up"; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setShow(true);
        io.disconnect();
      }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hidden = from === "left" ? "-translate-x-20" : from === "right" ? "translate-x-20" : "translate-y-10";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${show ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${hidden}`} ${className}`}
    >
      {children}
    </div>
  );
}

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch(BASIN_URL, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const heroIn = `transition-all duration-1000 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`;

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans overflow-x-hidden">
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-18px) } }
        .float-slow { animation: float 7s ease-in-out infinite }
        .float-slower { animation: float 10s ease-in-out infinite reverse }
      `}</style>

      {/* Hero */}
      <section className="relative bg-[#2B1B12] rounded-b-[3rem] md:rounded-b-[5rem] pt-24 pb-32 px-4 text-center overflow-hidden">
        <div className="float-slow absolute -top-16 -left-16 w-72 h-72 rounded-full bg-[#D4A24C]/15 blur-2xl" />
        <div className="float-slower absolute -bottom-20 -right-10 w-80 h-80 rounded-full bg-[#D4A24C]/10 blur-2xl" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className={`inline-block px-5 py-1.5 rounded-full border border-[#D4A24C]/40 text-[#D4A24C] text-xs tracking-[0.25em] uppercase mb-6 ${heroIn}`}>
            Contact Us
          </span>
          <h1 style={{ transitionDelay: "150ms" }} className={`text-4xl md:text-6xl font-serif text-[#FFFDF9] mb-4 ${heroIn}`}>
            Get in <span className="italic text-[#D4A24C]">Touch</span>
          </h1>
          <p style={{ transitionDelay: "300ms" }} className={`text-[#E8DFD3] text-lg font-light ${heroIn}`}>
            Whether you want to reserve a table or ask a question, we are here for you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[1200px] mx-auto px-6 -mt-16 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 relative z-10">
        {/* Form — from left */}
        <Reveal from="left">
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(43,27,18,0.15)] border border-[#E8DFD3] h-full">
            <h2 className="text-3xl font-serif text-[#2B1B12] mb-2">Send a Message</h2>
            <p className="text-[#5C4638] font-light mb-8">We usually reply within a day.</p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="first_name" className="text-xs font-bold text-[#5C4638] uppercase tracking-wider">First Name</label>
                  <input id="first_name" name="first_name" type="text" required className={inputCls} placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="last_name" className="text-xs font-bold text-[#5C4638] uppercase tracking-wider">Last Name</label>
                  <input id="last_name" name="last_name" type="text" required className={inputCls} placeholder="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold text-[#5C4638] uppercase tracking-wider">Email Address</label>
                <input id="email" name="email" type="email" required className={inputCls} placeholder="john@example.com" />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold text-[#5C4638] uppercase tracking-wider">Message</label>
                <textarea id="message" name="message" rows={5} required className={`${inputCls} resize-none`} placeholder="How can we help you?" />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="group w-full flex items-center justify-center gap-3 bg-[#D4A24C] hover:bg-[#B8862B] disabled:opacity-70 text-white font-bold tracking-widest uppercase py-4 rounded-full transition-all hover:-translate-y-0.5 shadow-lg shadow-[#D4A24C]/30"
              >
                {status === "sending" ? "Sending..." : "Send Message"}
                <FiSend className="transition-transform group-hover:translate-x-1" />
              </button>

              {status === "success" && (
                <div className="flex items-center gap-3 rounded-2xl bg-green-50 text-green-800 px-5 py-3 text-sm">
                  <span className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0"><FiCheck /></span>
                  Thank you! Your message has been sent.
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-3 rounded-2xl bg-red-50 text-red-800 px-5 py-3 text-sm">
                  <FiAlertCircle className="shrink-0" size={20} />
                  Something went wrong. Please try again.
                </div>
              )}
            </form>
          </div>
        </Reveal>

        {/* Info — from right */}
        <div className="flex flex-col gap-6 lg:pt-20">
          <Reveal from="right">
            <h2 className="text-3xl font-serif text-[#2B1B12]">Contact Information</h2>
          </Reveal>

          {INFO.map(({ icon: Icon, title, lines }, i) => (
            <Reveal key={title} from="right" delay={150 + i * 150}>
              <div className="group flex items-start gap-5 bg-white border border-[#E8DFD3] rounded-3xl p-5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#D4A24C]/10 hover:border-[#D4A24C]/50">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] group-hover:bg-[#D4A24C] group-hover:text-white flex items-center justify-center shrink-0 text-[#D4A24C] transition-colors">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-[#2B1B12] text-lg">{title}</h3>
                  <p className="text-[#5C4638] font-light mt-1">
                    {lines.map((l, idx) => (
                      <span key={idx}>
                        {l}
                        {idx < lines.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal from="right" delay={600}>
            <div className="bg-[#2B1B12] rounded-[2rem] p-7 text-[#E8DFD3]">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-11 h-11 rounded-full bg-[#D4A24C]/15 text-[#D4A24C] flex items-center justify-center"><FiClock size={20} /></span>
                <h3 className="text-2xl font-serif text-[#FFFDF9]">Opening Hours</h3>
              </div>
              <ul className="space-y-3 font-light">
                {HOURS.map((h) => (
                  <li key={h.days} className="flex flex-wrap justify-between gap-2 pb-3 border-b border-white/10 last:border-0 last:pb-0">
                    <span>{h.days}</span>
                    <span className="font-medium text-[#D4A24C]">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}