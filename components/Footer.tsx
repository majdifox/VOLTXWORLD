export default function Footer() {
  return (
    <div className="flex w-full flex-col items-center justify-end">
      {/* Created By & Signature */}
      <div className="mb-0 flex flex-col items-center justify-center">
        <p className="-mb-6 text-[0.7rem] uppercase tracking-[0.3em] text-white opacity-50">
          Created by
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/majdi-signature.svg"
          alt="Mehdi Majdi Signature"
          // Responsive signature size: smaller on phones, huge on desktop
          className="h-24 w-auto object-contain opacity-90 sm:h-32 md:h-40"
          style={{ filter: "brightness(0) invert(1)" }}
        />
      </div>

      {/* Contact: X + Instagram + Email — matched icon trio, email reveals on hover */}
      <div className="mb-2 flex items-center justify-center gap-1.5">
        {/* X (Twitter) */}
        <a
          href="https://x.com/voltxworld"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="VOLTX on X"
          className="group relative flex h-9 w-9 items-center justify-center rounded-full text-white opacity-60 transition-opacity duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:opacity-100"
        >
          {/* Soft halo — mirrors Apple's circular icon-button hover state */}
          <span
            aria-hidden="true"
            className="absolute inset-0 scale-90 rounded-full bg-white/0 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-100 group-hover:bg-white/[0.06]"
          />
          {/* Minimal inline X glyph — no external icon package */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="relative transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.08]"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/voltxworld/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="VOLTX on Instagram"
          className="group relative flex h-9 w-9 items-center justify-center rounded-full text-white opacity-60 transition-opacity duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:opacity-100"
        >
          {/* Soft halo — mirrors Apple's circular icon-button hover state */}
          <span
            aria-hidden="true"
            className="absolute inset-0 scale-90 rounded-full bg-white/0 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-100 group-hover:bg-white/[0.06]"
          />
          {/* Minimal inline Instagram glyph — no external icon package */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            aria-hidden="true"
            className="relative transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.08]"
          >
            <rect x="2" y="2" width="20" height="20" rx="6" />
            <circle cx="12" cy="12" r="4.2" />
            <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
          </svg>
        </a>

        {/* Email */}
        <a
          href="mailto:contact@voltxworld.com"
          aria-label="Email VOLTX at contact@voltxworld.com"
          className="group relative flex h-9 items-center overflow-hidden rounded-full pl-[9px] pr-[9px] text-white opacity-60 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:bg-white/[0.06] hover:pr-4 hover:opacity-100"
        >
          {/* Minimal inline envelope glyph — matches Instagram glyph's weight */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            aria-hidden="true"
            className="relative shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.08]"
          >
            <rect x="2.5" y="5" width="19" height="14" rx="3" />
            <path d="M4 6.5 L12 13 L20 6.5" />
          </svg>

          {/* The address — collapsed to nothing at rest, slides out on hover */}
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-[0.8rem] tracking-widest opacity-0 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:ml-2 group-hover:max-w-[220px] group-hover:opacity-100">
            contact@voltxworld.com
          </span>
        </a>
      </div>

      {/* Morocco Line */}
      <div className="mb-4 flex flex-col items-center justify-center gap-2 text-[0.8rem] tracking-widest">
        <div className="flex items-center justify-center gap-1.5 text-white opacity-60">
          <span>Built in Morocco</span>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/morocco-flag.svg"
            alt="Flag of Morocco"
            className="h-4 w-auto object-contain"
          />
        </div>

        <span className="text-white opacity-40">Designed for the world.</span>
      </div>

      {/* Copyright */}
      <footer role="contentinfo">
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white opacity-20">
          © 2026 VOLTX®. All rights reserved.
        </p>
      </footer>
    </div>
  );
}