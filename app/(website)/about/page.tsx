"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Award, Utensils, Heart, Star, MapPin, Phone, ChevronDown, Check,
  Navigation, Cake, Users, Briefcase, ChefHat, MessageCircle,
} from "lucide-react";

const IMG = {
  hero: "https://images.unsplash.com/photo-1729394405518-eaf2a0203aa7?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  chef: "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9QMAPO5qFwobWFaK3YFua3oAbRwMKIEcNeXIZrGn8i6jZXxlwe6j60YoKs1bT0BhmdiPy470c54XnEwE1Kxe4uvaHK1W2yCjCXkaZDcJg02itVdi1CEKjdGwGPcnNRI9tpPHrHT5c0h92B2=s680-w680-h510-rw",
  cta: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1600",
  gallery: [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6tgi24LRipFRWeEyIISpbGlq1Lvpj1t_pq6RC6TysGvueOBYxm_9Uqv3O&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBPZPtHQb2VGBtkLaMKdznxfEhCws7PveVp1k760j4925efynjX230tmc&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc6fBi1Kdqjq6hjsOsdEUP5zvwUOS01_2U7idgigddaa6b1Tk51Oft5qvd&s=10",
  ],
};

const MENU = [
  { name: "Appetizers", desc: "Starters to begin the feast", img: "https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&q=80&w=900" },
  { name: "Pakistani Handi", desc: "Slow-cooked, rich and aromatic", img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=900", featured: true },
  { name: "Special Karahi", desc: "Sizzling, spiced, unforgettable", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=900", featured: true },
  { name: "BBQ & Kabab", desc: "Flame-grilled to perfection", img: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=900" },
  { name: "Fries", desc: "Crisp and golden", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=900" },
  { name: "Royal Shinwari", desc: "Traditional Shinwari-style flavours", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjGRTVniRBZ8mFLYB3aJNAC4zBuagFl5S5Dnv7nt92Z8U8r6p6yRqLmJY&s=10", featured: true },
  { name: "Royal BBQ", desc: "Our signature grill, royal style", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=900", featured: true },
  { name: "Chinese", desc: "Wok-fired favourites", img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=900" },
  { name: "Platters", desc: "Made for sharing", img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=900" },
  { name: "Bar & Shakes", desc: "Thick, chilled and creamy", img: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&q=80&w=900" },
  { name: "Drinks", desc: "Refreshing sips", img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=900" },
  { name: "Ice", desc: "Cool and refreshing", img: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=900" },
];
const FEATURED = MENU.filter((m) => m.featured);
const MORE = MENU.filter((m) => !m.featured);

const VALUES = [
  { icon: Utensils, title: "Authentic", text: "Traditional recipes crafted to perfection." },
  { icon: Award, title: "Premium", text: "Fresh ingredients and rich flavours in every dish." },
  { icon: Heart, title: "Passionate", text: "Served with love and royal hospitality." },
];

const OCCASIONS = [
  { icon: Cake, label: "Birthday celebrations" },
  { icon: Users, label: "Family gatherings & group dining" },
  { icon: Briefcase, label: "Corporate dinners" },
  { icon: ChefHat, label: "Catering services" },
];

const FAQS = [
  { q: "What kind of food does Royal Sofra serve?", a: "Our menu spans appetizers, Pakistani handi, special karahi, BBQ & kabab, Royal Shinwari, Royal BBQ, Chinese and sharing platters, plus fries, shakes, drinks and ice treats, all made with fresh ingredients." },
  { q: "Do you offer dine-in, takeaway and group dining?", a: "Yes. Dine-in, takeaway and group dining are all available, so you can enjoy Royal Sofra however suits you best." },
  { q: "Can I host a birthday or a corporate dinner?", a: "Absolutely. We host birthday celebrations, family gatherings and corporate dinners, and we also offer catering services. Contact us with your plans and we will help arrange everything." },
  { q: "How do I reserve a table?", a: "Call us on +92 345 9567444 or 051-8894444, message us on WhatsApp, or send a note through our contact page." },
  { q: "Is there parking and a kids' menu?", a: "Yes, we have on-site parking and a kids' menu. Dogs are also welcome in our outside area." },
  { q: "How much does a meal cost?", a: "Most guests spend around Rs 2,000 – 7,000 per person, depending on what they order." },
  { q: "What are your opening hours?", a: "Our hours can vary by day, so please check the latest times on our contact page or give us a quick call." },
];

// Plain image tag: works with any normal link or local path (e.g. "/images/hero.jpg").
// Falls back to a brown gradient if the link fails to load.
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

function CountUp({ end, decimals = 0 }: { end: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - t0) / 1500, 1);
        setVal(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [end]);

  return <span ref={ref}>{val.toFixed(decimals)}</span>;
}

function SectionTitle({ eyebrow, children }: { eyebrow: string; children: ReactNode }) {
  return (
    <div className="text-center mb-14">
      <span className="text-[#D4A24C] font-bold tracking-[0.2em] uppercase text-xs">{eyebrow}</span>
      <h2 className="mt-3 text-3xl md:text-5xl font-serif text-[#2B1B12] leading-tight">{children}</h2>
    </div>
  );
}

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState<number | null>(0);
  const [progress, setProgress] = useState(0);

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

  const heroIn = `transition-all duration-1000 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`;

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans overflow-x-hidden">
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-16px) } }
        .float-slow { animation: float 7s ease-in-out infinite }
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .marquee { animation: marquee 35s linear infinite }
        .marquee:hover { animation-play-state: paused }
      `}</style>

      {/* Scroll progress */}
      <div className="fixed top-0 left-0 z-[60] h-1 bg-[#D4A24C] transition-[width] duration-100" style={{ width: `${progress}%` }} />

      {/* Hero */}
      <section className="relative h-[50vh] md:h-[65vh] w-full flex items-center justify-center rounded-b-[3rem] md:rounded-b-[5rem] overflow-hidden bg-[#2B1B12]">
        <Img src={IMG.hero} alt="Royal Sofra interior" className="brightness-50" priority />
        <div className="float-slow absolute -top-16 -left-16 w-72 h-72 rounded-full bg-[#D4A24C]/20 blur-2xl" />
        <div className="relative z-10 text-center px-4">
          <span className={`inline-block px-5 py-1.5 rounded-full border border-[#D4A24C]/50 text-[#D4A24C] text-xs tracking-[0.25em] uppercase mb-6 ${heroIn}`}>
            About Us
          </span>
          <h1 style={{ transitionDelay: "150ms" }} className={`text-4xl md:text-6xl lg:text-7xl font-serif text-[#FFFDF9] mb-4 tracking-tight ${heroIn}`}>
            Our <span className="italic text-[#D4A24C]">Story</span>
          </h1>
          <p style={{ transitionDelay: "300ms" }} className={`text-[#E8DFD3] text-sm md:text-lg max-w-2xl mx-auto font-light tracking-wide ${heroIn}`}>
            A legacy of taste, crafted with passion and served with royalty.
          </p>
        </div>
      </section>

      {/* Menu ticker */}
      <div className="overflow-hidden bg-[#D4A24C] py-4 mt-10">
        <div className="marquee flex w-max whitespace-nowrap">
          {[...MENU, ...MENU].map((m, i) => (
            <span key={i} className="flex items-center font-serif text-xl text-[#2B1B12]">
              <span className="px-6">{m.name}</span>
              <span className="text-[#2B1B12]/50">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Story */}
      <section className="py-20 md:py-32 px-6 max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <Reveal from="left">
          <div className="relative">
            <div className="relative h-[420px] md:h-[600px] w-full rounded-t-full rounded-b-[3rem] overflow-hidden shadow-2xl border-4 border-[#FAF7F2]">
              <Img src={IMG.chef} alt="Chef plating a dish" />
            </div>
            <div className="absolute -bottom-6 right-2 md:-right-8 bg-white rounded-3xl p-5 shadow-xl border border-[#E8DFD3] flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#2B1B12] text-[#D4A24C] flex items-center justify-center">
                <Star size={26} fill="currentColor" />
              </div>
              <div>
                <p className="text-2xl font-serif text-[#2B1B12] leading-none">5.0</p>
                <p className="text-xs text-[#5C4638] mt-1">161 Google reviews</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal from="right" delay={150}>
          <div className="flex flex-col justify-center">
            <span className="text-[#D4A24C] font-bold tracking-[0.2em] uppercase text-xs mb-4">The Royal Heritage</span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#2B1B12] leading-tight mb-8">
              Redefining the <br /> <span className="italic">Art of Dining</span>
            </h2>
            <div className="space-y-6 text-[#5C4638] leading-relaxed font-light text-lg">
              <p>
                Royal Sofra is a premium family restaurant in Satellite Town, Rawalpindi, built on a simple vision: bring the grandeur of a royal feast to the modern dining table, in an atmosphere that is warm, modern and comfortable.
              </p>
              <p>
                From sizzling BBQ and rich karahi and Royal Shinwari to Chinese favourites, sharing platters and chilled shakes, we cook with fresh ingredients, rich flavours and genuine hospitality, whether you are dining with family, friends or celebrating something special.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-12">
              {VALUES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-3xl bg-white border border-[#E8DFD3] p-5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#D4A24C]/10">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] flex items-center justify-center text-[#D4A24C] mb-3">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-[#2B1B12]">{title}</h3>
                  <p className="text-sm text-[#5C4638] font-light mt-1">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Stats */}
      <section className="px-6 pb-24 md:pb-32">
        <Reveal from="up">
          <div className="max-w-[1200px] mx-auto rounded-[2.5rem] bg-[#2B1B12] px-6 py-12 md:py-14 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {[
              { end: 5, dec: 1, label: "Google rating" },
              { end: 161, dec: 0, label: "Happy reviews" },
              { end: 12, dec: 0, label: "Menu categories" },
              { end: 4, dec: 0, label: "Event types hosted" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-4xl md:text-5xl font-serif text-[#D4A24C]">
                  <CountUp end={s.end} decimals={s.dec} />
                </p>
                <p className="mt-2 text-sm text-[#E8DFD3] font-light tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Menu */}
      <section className="px-6 pb-24 md:pb-32 max-w-[1200px] mx-auto">
        <Reveal from="up">
          <SectionTitle eyebrow="Our Menu">
            Twelve ways to <span className="italic text-[#D4A24C]">feast</span>
          </SectionTitle>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED.map((c, i) => (
            <Reveal key={c.name} from={i % 2 === 0 ? "left" : "right"} delay={i * 100}>
              <div className="group relative h-80 rounded-[2rem] overflow-hidden bg-[#2B1B12]">
                <Img src={c.img} alt={c.name} className="transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B1B12]/95 via-[#2B1B12]/25 to-transparent" />
                <span className="absolute top-5 left-5 w-10 h-10 rounded-full bg-white/15 backdrop-blur text-[#D4A24C] text-sm font-bold flex items-center justify-center">
                  0{i + 1}
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-serif text-[#FFFDF9]">{c.name}</h3>
                  <p className="text-sm text-[#E8DFD3] font-light mt-1">{c.desc}</p>
                  <span className="mt-4 block h-0.5 w-8 bg-[#D4A24C] transition-all duration-500 group-hover:w-20" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MORE.map((c, i) => (
            <Reveal key={c.name} from={i % 2 === 0 ? "left" : "right"} delay={(i % 4) * 80}>
              <div className="group flex items-center gap-4 rounded-full bg-white border border-[#E8DFD3] p-2 pr-6 transition-all hover:-translate-y-1 hover:bg-[#2B1B12] hover:border-[#2B1B12]">
                <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 bg-[#2B1B12]">
                  <Img src={c.img} alt={c.name} className="transition-transform duration-500 group-hover:scale-125" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-[#2B1B12] group-hover:text-[#D4A24C] transition-colors truncate">{c.name}</h3>
                  <p className="text-xs text-[#5C4638] group-hover:text-[#E8DFD3] font-light transition-colors truncate">{c.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Occasions */}
      <section className="px-6 pb-24 md:pb-32 max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <Reveal from="left">
          <div>
            <span className="text-[#D4A24C] font-bold tracking-[0.2em] uppercase text-xs">Celebrate With Us</span>
            <h2 className="mt-3 text-3xl md:text-5xl font-serif text-[#2B1B12] leading-tight mb-6">
              Every occasion deserves a <span className="italic text-[#D4A24C]">royal</span> table
            </h2>
            <p className="text-[#5C4638] font-light text-lg leading-relaxed mb-8">
              From intimate family dinners to large group bookings, we take care of the details so you can enjoy the moment.
            </p>
            <div className="space-y-4">
              {OCCASIONS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-4 rounded-full bg-white border border-[#E8DFD3] px-4 py-3 transition-all hover:translate-x-2 hover:border-[#D4A24C]/60">
                  <span className="w-11 h-11 rounded-full bg-[#FAF7F2] text-[#D4A24C] flex items-center justify-center shrink-0">
                    <Icon size={20} />
                  </span>
                  <span className="text-[#2B1B12] font-medium">{label}</span>
                  <Check size={18} className="ml-auto text-[#D4A24C]" />
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal from="right" delay={150}>
          <div className="grid grid-cols-2 gap-4 h-[460px] md:h-[560px]">
            <div className="relative row-span-2 rounded-[2rem] overflow-hidden">
              <Img src={IMG.gallery[0]} alt="Dining area" />
            </div>
            <div className="relative rounded-[2rem] overflow-hidden">
              <Img src={IMG.gallery[1]} alt="Restaurant ambiance" />
            </div>
            <div className="relative rounded-[2rem] overflow-hidden">
              <Img src={IMG.gallery[2]} alt="Signature dish" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Map */}
      <section className="px-6 pb-24 md:pb-32 max-w-[1200px] mx-auto">
        <Reveal from="up">
          <SectionTitle eyebrow="Find Us">
            Visit <span className="italic text-[#D4A24C]">Royal Sofra</span>
          </SectionTitle>
        </Reveal>
        <Reveal from="up" delay={100}>
          <div className="grid grid-cols-1 lg:grid-cols-3 rounded-[2.5rem] overflow-hidden border border-[#E8DFD3] shadow-[0_20px_60px_-15px_rgba(43,27,18,0.2)]">
            <div className="bg-[#2B1B12] text-[#E8DFD3] p-8 md:p-10 flex flex-col justify-center gap-6">
              <div className="flex gap-4">
                <MapPin className="text-[#D4A24C] shrink-0" />
                <p className="font-light leading-relaxed">
                  5th Road Commercial Market Rd,<br />Block D Satellite Town,<br />Rawalpindi, 46000
                </p>
              </div>
              <div className="flex gap-4">
                <Phone className="text-[#D4A24C] shrink-0" />
                <p className="font-light">+92 345 9567444<br />051-8894444</p>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Royal+Sofra+Satellite+Town+Rawalpindi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D4A24C] hover:bg-[#B8862B] px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-all hover:-translate-y-0.5"
              >
                <Navigation size={16} /> Get Directions
              </a>
            </div>
            <iframe
              title="Royal Sofra location"
              src="https://www.google.com/maps?q=Royal+Sofra+Satellite+Town+Rawalpindi&output=embed"
              className="w-full h-[380px] lg:h-full lg:col-span-2 border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-24 md:pb-32 max-w-[850px] mx-auto">
        <Reveal from="up">
          <SectionTitle eyebrow="FAQ">
            Questions? <span className="italic text-[#D4A24C]">We have answers</span>
          </SectionTitle>
        </Reveal>
        <div className="space-y-4">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} from={i % 2 === 0 ? "left" : "right"} delay={(i % 3) * 80}>
                <div className={`rounded-3xl border bg-white transition-all ${isOpen ? "border-[#D4A24C] shadow-lg shadow-[#D4A24C]/10" : "border-[#E8DFD3]"}`}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                  >
                    <span className="font-semibold text-[#2B1B12]">{f.q}</span>
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${isOpen ? "bg-[#D4A24C] text-white rotate-180" : "bg-[#FAF7F2] text-[#D4A24C]"}`}>
                      <ChevronDown size={18} />
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

      {/* CTA */}
      <section className="px-6 pb-24">
        <Reveal from="up">
          <div className="relative max-w-[1200px] mx-auto rounded-[3rem] overflow-hidden bg-[#2B1B12] text-center px-6 py-20">
            <Img src={IMG.cta} alt="" className="opacity-25" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-serif text-[#FFFDF9] mb-4">
                Reserve your <span className="italic text-[#D4A24C]">royal</span> table
              </h2>
              <p className="text-[#E8DFD3] font-light mb-10">Call, message or drop us a note — we would love to host you.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="tel:+923459567444" className="inline-flex items-center gap-2 rounded-full bg-[#D4A24C] hover:bg-[#B8862B] px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition-all hover:-translate-y-0.5">
                  <Phone size={16} /> Call Now
                </a>
                <a href="https://wa.me/923459567444" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:brightness-95 px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition-all hover:-translate-y-0.5">
                  <MessageCircle size={16} /> WhatsApp
                </a>
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-[#D4A24C] text-[#D4A24C] hover:bg-[#D4A24C] hover:text-white px-7 py-3.5 text-sm font-bold uppercase tracking-widest transition-all hover:-translate-y-0.5">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}