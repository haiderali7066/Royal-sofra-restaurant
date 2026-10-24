"use client";

import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiCheck, FiAlertCircle, FiNavigation, FiArrowUpRight, FiChevronDown } from "react-icons/fi";
import { FaWhatsapp, FaInstagram, FaFacebookF, FaYoutube, FaStar } from "react-icons/fa";

const BASIN_URL = "https://usebasin.com/f/77d812a5413d";
const PHONE_1 = "+92 345 9567444";
const PHONE_2 = "051-8894444";
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Royal+Sofra+Satellite+Town+Rawalpindi";
const MAP_EMBED = "https://www.google.com/maps?q=Royal+Sofra+Satellite+Town+Rawalpindi&output=embed";
const REVIEWS_URL = "https://www.google.com/search?q=royal+sofra+rawalpindi";

const HERO_IMG = "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9SdFpe4xYx34IZwoXiTky2nPLQX5KkKqZ5hhhzO5SB_yyOe9WkmvH-IBRZHtHx4oEEGPurLzV1WhomcROygbh142XRv6nWChSyUawKyE9Vc3lehvc9nNUO-qZ-jQDFmTS4xITRrrLOsrz3t=s680-w680-h510-rw";

const QUICK = [
  { icon: FiPhone, title: "Call Us", text: PHONE_1, href: "tel:+923459567444", from: "left" as const },
  { icon: FaWhatsapp, title: "WhatsApp", text: "Chat with us instantly", href: "https://wa.me/923459567444", from: "up" as const },
  { icon: FiMapPin, title: "Visit Us", text: "Satellite Town, Rawalpindi", href: MAPS_URL, from: "right" as const },
];

const SUBJECTS = ["Reservation", "Birthday / Event", "Corporate Dinner", "Catering", "Feedback", "Other"];

// Please double-check these against your real timings
const HOURS = [
  {  time: "11:00 PM - 2:00 AM" },
];

const SOCIALS = [
  { icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/royalsofraofficial/" },
  { icon: FaFacebookF, label: "Facebook", href: "https://www.facebook.com/royalsofraofficial/" },
  { icon: FaYoutube, label: "YouTube", href: "https://www.youtube.com/@royalsofraofficial" },
];

const FAQS = [
  { q: "What is the fastest way to reserve a table?", a: `Call us on ${PHONE_1} or ${PHONE_2}, or message us on WhatsApp. You can also send the form above and choose "Reservation".` },
  { q: "Can you host birthdays and corporate dinners?", a: "Yes. We host birthday celebrations, family gatherings and corporate dinners. Tell us your plans through the form and we will help arrange everything." },
  { q: "Do you offer catering?", a: 'Yes, we offer catering services. Choose "Catering" in the form or call us to discuss your event.' },
  { q: "Is there parking and a kids' menu?", a: "Yes, we have on-site parking and a kids' menu. Dogs are also welcome in our outside area." },
];

const inputCls =
  "w-full bg-[#FAF7F2] border border-transparent rounded-2xl px-5 py-3.5 text-[#2B1B12] placeholder-[#2B1B12]/35 outline-none transition-all focus:bg-white focus:border-[#D4A24C] focus:ring-4 focus:ring-[#D4A24C]/15";

// Plain image tag: any normal link or local path works. Falls back to a gradient on error.
function Img({ src, alt, className = "", priority = false }: { src: string; alt: string; className?: string; priority?: boolean }) {
  const [err, setErr] = useState(false);
  if (err) return <div className="absolute inset-0 bg-gradient-to-br from-[#5C4638] to-[#2B1B12]" />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      onError={() => setErr(true)}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  );
}

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
      className={`transition-all duration-700 ease-out motion-reduce:!translate-x-0 motion-reduce:!translate-y-0 motion-reduce:!opacity-100 ${show ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${hidden}`} ${className}`}
    >
      {children}
    </div>
  );
}

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-16px) } }
        .float-slow { animation: float 7s ease-in-out infinite }
        @keyframes pop { 0% { transform: scale(0.4); opacity: 0 } 70% { transform: scale(1.1) } 100% { transform: scale(1); opacity: 1 } }
        .pop { animation: pop 0.6s ease-out both }
      `}</style>

      {/* Scroll progress */}
      <div className="fixed top-0 left-0 z-[60] h-1 bg-[#D4A24C] transition-[width] duration-100" style={{ width: `${progress}%` }} />

      {/* Hero */}
      <section className="relative h-[50vh] md:h-[58vh] w-full flex items-center justify-center rounded-b-[3rem] md:rounded-b-[5rem] overflow-hidden bg-[#2B1B12] pb-10">
        <Img src={HERO_IMG} alt="Royal Sofra interior" className="brightness-[0.35]" priority />
        <div className="float-slow absolute -top-16 -left-16 w-72 h-72 rounded-full bg-[#D4A24C]/20 blur-2xl" />
        <div className="relative z-10 text-center px-4">
          <span className={`inline-block px-5 py-1.5 rounded-full border border-[#D4A24C]/50 text-[#D4A24C] text-xs tracking-[0.25em] uppercase mb-6 ${heroIn}`}>
            Contact Us
          </span>
          <h1 style={{ transitionDelay: "150ms" }} className={`text-4xl md:text-6xl lg:text-7xl font-serif text-[#FFFDF9] mb-4 tracking-tight ${heroIn}`}>
            Get in <span className="italic text-[#D4A24C]">Touch</span>
          </h1>
          <p style={{ transitionDelay: "300ms" }} className={`text-[#E8DFD3] text-sm md:text-lg max-w-2xl mx-auto font-light ${heroIn}`}>
            Whether you want to reserve a table or ask a question, we are here for you.
          </p>
          <a
            href={REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ transitionDelay: "450ms" }}
            className={`mt-7 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm text-[#FFFDF9] backdrop-blur hover:bg-white/20 ${heroIn}`}
          >
            <span className="flex gap-0.5 text-[#D4A24C]">
              {[...Array(5)].map((_, i) => <FaStar key={i} size={13} />)}
            </span>
            <span className="font-semibold">5.0</span>
            <span className="text-[#E8DFD3] font-light">· 161 Google reviews</span>
          </a>
        </div>
      </section>

      {/* Quick actions */}
      <section className="relative z-10 max-w-[1100px] mx-auto px-6 -mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
        {QUICK.map(({ icon: Icon, title, text, href, from }, i) => (
          <Reveal key={title} from={from} delay={i * 100}>
            <a
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-white rounded-[2rem] p-5 border border-[#E8DFD3] shadow-[0_20px_50px_-20px_rgba(43,27,18,0.25)] transition-all hover:-translate-y-1.5 hover:border-[#D4A24C]"
            >
              <span className="w-14 h-14 rounded-2xl bg-[#FAF7F2] text-[#D4A24C] group-hover:bg-[#D4A24C] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                <Icon size={24} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-[#2B1B12]">{title}</span>
                <span className="block text-sm text-[#5C4638] font-light truncate">{text}</span>
              </span>
              <FiArrowUpRight className="text-[#D4A24C] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={20} />
            </a>
          </Reveal>
        ))}
      </section>

      {/* Form + info */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
        {/* Form: from left */}
        <Reveal from="left" className="lg:col-span-3">
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(43,27,18,0.15)] border border-[#E8DFD3] h-full">
            {status === "success" ? (
              <div className="h-full min-h-[420px] flex flex-col items-center justify-center text-center">
                <span className="pop w-20 h-20 rounded-full bg-[#D4A24C] text-white flex items-center justify-center mb-6">
                  <FiCheck size={38} />
                </span>
                <h2 className="text-3xl font-serif text-[#2B1B12] mb-3">Message sent!</h2>
                <p className="text-[#5C4638] font-light max-w-sm mb-8">
                  Thank you for reaching out. Our team will get back to you soon.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="rounded-full border border-[#D4A24C] text-[#D4A24C] hover:bg-[#D4A24C] hover:text-white px-7 py-3 text-sm font-bold uppercase tracking-widest transition-all"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-serif text-[#2B1B12] mb-2">Send a Message</h2>
                <p className="text-[#5C4638] font-light mb-8">Fill in the form and we will get back to you.</p>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#5C4638] uppercase tracking-wider">What is this about?</span>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECTS.map((s, i) => (
                        <label key={s} className="cursor-pointer">
                          <input type="radio" name="subject" value={s} defaultChecked={i === 0} className="peer sr-only" />
                          <span className="block rounded-full border border-[#E8DFD3] bg-[#FAF7F2] px-4 py-2 text-sm text-[#5C4638] transition-all hover:border-[#D4A24C] peer-checked:bg-[#2B1B12] peer-checked:text-[#D4A24C] peer-checked:border-[#2B1B12] peer-focus-visible:ring-4 peer-focus-visible:ring-[#D4A24C]/30">
                            {s}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label htmlFor="first_name" className="text-xs font-bold text-[#5C4638] uppercase tracking-wider">First Name</label>
                      <input id="first_name" name="first_name" type="text" required className={inputCls} placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="last_name" className="text-xs font-bold text-[#5C4638] uppercase tracking-wider">Last Name</label>
                      <input id="last_name" name="last_name" type="text" required className={inputCls} placeholder="Doe" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-bold text-[#5C4638] uppercase tracking-wider">Email Address</label>
                      <input id="email" name="email" type="email" required className={inputCls} placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-xs font-bold text-[#5C4638] uppercase tracking-wider">Phone (optional)</label>
                      <input id="phone" name="phone" type="tel" className={inputCls} placeholder="+92 300 0000000" />
                    </div>
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

                  {status === "error" && (
                    <div className="flex items-center gap-3 rounded-2xl bg-red-50 text-red-800 px-5 py-3 text-sm">
                      <FiAlertCircle className="shrink-0" size={20} />
                      Something went wrong. Please try again or call us.
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        </Reveal>

        {/* Info: from right */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {[
            { icon: FiMapPin, title: "Location", lines: ["5th Road Commercial Market Rd,", "Block D Satellite Town, Rawalpindi, 46000"] },
            { icon: FiPhone, title: "Phone", lines: [PHONE_1, PHONE_2] },
            { icon: FiMail, title: "Email", lines: ["info@royalsofra.com"] },
          ].map(({ icon: Icon, title, lines }, i) => (
            <Reveal key={title} from="right" delay={i * 120}>
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

          <Reveal from="right" delay={360}>
            <div className="bg-[#2B1B12] rounded-[2rem] p-7 text-[#E8DFD3]">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-11 h-11 rounded-full bg-[#D4A24C]/15 text-[#D4A24C] flex items-center justify-center"><FiClock size={20} /></span>
                <h3 className="text-2xl font-serif text-[#FFFDF9]">Opening Hours</h3>
              </div>
              <ul className="space-y-3 font-light">
                {HOURS.map((h) => (
                  <li className="flex flex-wrap justify-between gap-2 pb-3 border-b border-white/10 last:border-0 last:pb-0">
                    <span className="font-medium text-[#D4A24C]">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal from="right" delay={480}>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-[#2B1B12]">Follow us</span>
              <div className="flex gap-3">
                {SOCIALS.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-12 h-12 rounded-full bg-[#2B1B12] text-[#D4A24C] hover:bg-[#D4A24C] hover:text-white flex items-center justify-center transition-all hover:-translate-y-1"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Map */}
      <section className="max-w-[1200px] mx-auto px-6 pb-20 md:pb-28">
        <Reveal from="up">
          <div className="relative rounded-[2.5rem] overflow-hidden border border-[#E8DFD3] shadow-[0_20px_60px_-15px_rgba(43,27,18,0.2)]">
            <iframe
              title="Royal Sofra location"
              src={MAP_EMBED}
              className="block w-full h-[420px] md:h-[480px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-[#2B1B12] hover:bg-[#D4A24C] px-6 py-3 text-sm font-bold uppercase tracking-widest text-[#FFFDF9] shadow-xl transition-all hover:-translate-y-0.5"
            >
              <FiNavigation size={16} /> Get Directions
            </a>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="max-w-[820px] mx-auto px-6 pb-28">
        <Reveal from="up">
          <div className="text-center mb-12">
            <span className="text-[#D4A24C] font-bold tracking-[0.2em] uppercase text-xs">Quick Answers</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-serif text-[#2B1B12]">
              Before you <span className="italic text-[#D4A24C]">reach out</span>
            </h2>
          </div>
        </Reveal>
        <div className="space-y-4">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} from={i % 2 === 0 ? "left" : "right"} delay={i * 80}>
                <div className={`rounded-3xl border bg-white transition-all ${isOpen ? "border-[#D4A24C] shadow-lg shadow-[#D4A24C]/10" : "border-[#E8DFD3]"}`}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                  >
                    <span className="font-semibold text-[#2B1B12]">{f.q}</span>
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${isOpen ? "bg-[#D4A24C] text-white rotate-180" : "bg-[#FAF7F2] text-[#D4A24C]"}`}>
                      <FiChevronDown size={18} />
                    </span>
                  </button>
                  <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-[#5C4638] font-light leading-relaxed">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}