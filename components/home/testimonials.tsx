"use client";

/**
 * Royal Sofra – Testimonials Section
 * Single-file, self-contained component for Next.js (App Router or Pages Router).
 *
 * Requirements: Tailwind CSS only. No other dependencies, no tailwind.config edits,
 * no external images. Colors are set in the PALETTE block below, so you can tweak
 * the brown / gold in one place.
 *
 * Usage:
 *   import Testimonials from "@/components/ui/testimonial-marquee";
 *   <Testimonials />
 */

import * as React from "react";

/* ----------------------------- palette ----------------------------- */

const PALETTE = {
  section: "#faf6f0", // warm off-white section background
  card: "#3b2218", // dark brown card
  cardBorder: "#5a3a2a", // slightly lighter brown edge
  avatar: "#5a3a2a", // avatar circle
  gold: "#d9a95b", // stars + accents
  text: "#f5ebdd", // cream text on cards
  textMuted: "#c9b39e", // muted cream
  heading: "#2b1810", // heading on section background
  headingMuted: "#6f5a4c", // subheading on section background
};

/* ----------------------------- helpers ----------------------------- */

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* ----------------------------- data ----------------------------- */

type Review = {
  name: string;
  body: string;
  rating?: number; // 1–5, defaults to 5. Set to match each real review.
};

const reviews: Review[] = [
  {
    name: "Ahmed Ali Jan",
    body: "Great dining experience! The food was fresh and full of flavor. The ambiance was beautiful and comfortable, and the staff were welcoming. Highly recommended!",
  },
  {
    name: "Zaka Ullah",
    body: "Fresh, flavorful food with excellent presentation. Great service and a comfortable atmosphere. Definitely worth visiting!",
  },
  {
    name: "Saad Abdullah",
    body: "Had a tasty dinner with great service. The staff were friendly and responsive. A great place for family dinners and events.",
  },
  {
    name: "Khawaja Soban",
    body: "Great atmosphere and excellent food quality. Professional management and friendly staff made the experience even better.",
  },
  {
    name: "Ilyas Mughal",
    body: "Excellent food quality and service. Had a wonderful experience at Royal Sofra.",
  },
  {
    name: "Saima Mazhar",
    body: "Yummy taste and amazing service! The staff were great, and everything was wonderful.",
  },
  {
    name: "Sheikh Awais Farooq",
    body: "Excellent food, a nice setting, and reasonable prices. A great place to enjoy a meal.",
  },
  {
    name: "Bilal Rasheed",
    body: "Amazing food, beautiful ambiance, and excellent service. Great variety of Pakistani and Chinese cuisine. Highly recommended!",
  },
  {
    name: "Ahad Hussain",
    body: "Very tasty food with good ambiance and comfortable seating. A lovely place to dine.",
  },
  {
    name: "Junaid Khan",
    body: "Tasty food, good staff, and a pleasant ambiance. Had a great experience!",
  },
];

const half = Math.ceil(reviews.length / 2);
const firstRow = reviews.slice(0, half);
const secondRow = reviews.slice(half);

/* ----------------------------- marquee ----------------------------- */

type MarqueeProps = {
  children: React.ReactNode;
  reverse?: boolean;
  pauseOnHover?: boolean;
  repeat?: number;
  className?: string;
};

function Marquee({
  children,
  reverse = false,
  pauseOnHover = false,
  repeat = 4,
  className,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden py-1.5 [--gap:0.75rem] sm:py-2 sm:[--gap:1.25rem] [--duration:40s] [gap:var(--gap)]",
        className
      )}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          aria-hidden={i > 0}
          className={cn(
            "rs-marquee-track flex shrink-0 justify-around [gap:var(--gap)]",
            reverse && "rs-marquee-reverse",
            pauseOnHover &&
              "group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused]"
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

/* ----------------------------- card ----------------------------- */

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className="flex gap-0.5"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className="h-3.5 w-3.5 sm:h-4 sm:w-4"
          aria-hidden
          fill={i < rating ? PALETTE.gold : "none"}
          stroke={PALETTE.gold}
          strokeWidth={1}
        >
          <path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6L10 15.1 4.7 18l1.1-6L1.4 7.8l6-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ name, body, rating = 5 }: Review) {
  return (
    <figure
      className="relative flex w-[16.5rem] shrink-0 cursor-default flex-col gap-3 overflow-hidden rounded-xl border p-4 shadow-md shadow-black/10 sm:w-80 sm:gap-4 sm:rounded-2xl sm:p-6"
      style={{
        backgroundColor: PALETTE.card,
        borderColor: PALETTE.cardBorder,
        color: PALETTE.text,
      }}
    >
      <Stars rating={rating} />

      <blockquote className="flex-1 text-sm leading-relaxed sm:text-[15px]">
        {body}
      </blockquote>

      <div
        className="flex items-center gap-3 border-t pt-3 sm:pt-4"
        style={{ borderColor: PALETTE.cardBorder }}
      >
        <div
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold sm:h-10 sm:w-10 sm:text-sm"
          style={{
            backgroundColor: PALETTE.avatar,
            color: PALETTE.gold,
            boxShadow: `0 0 0 1.5px ${PALETTE.gold}`,
          }}
        >
          {getInitials(name)}
        </div>
        <figcaption className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">{name}</span>
          <span className="text-xs" style={{ color: PALETTE.textMuted }}>
            Dined at Royal Sofra
          </span>
        </figcaption>
      </div>
    </figure>
  );
}

/* ----------------------------- main ----------------------------- */

export default function Testimonials() {
  return (
    <section
      aria-labelledby="reviews-heading"
      className="relative w-full overflow-hidden py-10 sm:py-20 lg:py-24"
      style={{ backgroundColor: PALETTE.section }}
    >
      <style>{`
        @keyframes rs-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-100% - var(--gap))); }
        }
        .rs-marquee-track {
          animation: rs-marquee var(--duration) linear infinite;
        }
        .rs-marquee-reverse {
          animation-direction: reverse;
        }
        @media (prefers-reduced-motion: reduce) {
          .rs-marquee-track { animation: none; }
        }
      `}</style>

      <div className="mx-auto mb-8 max-w-2xl px-5 text-center sm:mb-12 sm:px-6">
        <h2
          id="reviews-heading"
          className="font-serif text-2xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
          style={{ color: PALETTE.heading }}
        >
          What our guests say
        </h2>
        <p
          className="mx-auto mt-3 max-w-xl text-sm leading-relaxed sm:mt-4 sm:text-base lg:text-lg"
          style={{ color: PALETTE.headingMuted }}
        >
          Fresh Pakistani and Chinese dishes, warm service, and a comfortable
          room for family dinners and events.
        </p>
        <div
          aria-hidden
          className="mx-auto mt-5 h-px w-12 sm:mt-6 sm:w-16"
          style={{ backgroundColor: PALETTE.gold }}
        />
      </div>

      <div className="relative">
        <Marquee pauseOnHover className="[--duration:55s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:55s]">
          {secondRow.map((review) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </Marquee>

        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-4 sm:w-10 lg:w-16"
          style={{
            background: `linear-gradient(to right, ${PALETTE.section}, transparent)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-4 sm:w-10 lg:w-16"
          style={{
            background: `linear-gradient(to left, ${PALETTE.section}, transparent)`,
          }}
        />
      </div>
    </section>
  );
}