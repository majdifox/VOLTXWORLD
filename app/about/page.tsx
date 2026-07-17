'use client';

import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValueEvent,
} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import styles from './about.module.css';
import Footer from '../../components/Footer';
import ScrollIndicator from '../../components/ScrollIndicator';

/* ═══════════════════════════════════════════════════════════════════
   Animation Constants
   Slow. Elegant. Invisible. Expensive.
   ═══════════════════════════════════════════════════════════════════ */

const EASE_APPLE = [0.25, 0.1, 0.25, 1.0] as const;
const EASE_SMOOTH = [0.22, 0.61, 0.36, 1.0] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: EASE_APPLE,
      delay,
    },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: {
      duration: 1.4,
      ease: EASE_APPLE,
      delay,
    },
  }),
};

/* ═══════════════════════════════════════════════════════════════════
   Reveal Wrapper — triggers once when scrolled into view
   ═══════════════════════════════════════════════════════════════════ */

function Reveal({
  children,
  delay = 0,
  variant = 'fadeUp',
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  variant?: 'fadeUp' | 'fadeIn';
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const variants = variant === 'fadeUp' ? fadeUp : fadeIn;

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Smart Header — hides on scroll-down, reveals on scroll-up.
   Always visible near the very top and very bottom of the page.
   The classic Apple / Vercel pattern: get out of the way while
   reading, reappear the moment intent-to-go-back shows up.
   ═══════════════════════════════════════════════════════════════════ */

function useSmartHeader() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = lastY.current;
    const delta = latest - previous;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    if (latest < 80 || latest > maxScroll - 80) {
      // Always show near the top of the page and near the very end
      setHidden(false);
    } else if (delta > 4) {
      // Scrolling down with intent — get out of the way
      setHidden(true);
    } else if (delta < -4) {
      // Scrolling up — user wants to go back, bring it back
      setHidden(false);
    }

    lastY.current = latest;
  });

  return hidden;
}

/* ═══════════════════════════════════════════════════════════════════
   § HERO
   ═══════════════════════════════════════════════════════════════════ */

function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Subtle parallax — portrait drifts upward as you scroll down
  // const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  // Slow Ken Burns zoom
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.08]);

  return (
    <section ref={containerRef} className={styles.hero} id="hero">
      {/* Portrait background */}
      <div className={styles.heroImageWrap}>
        <motion.div
          style={{
    scale:imageScale
}}
          className="w-full h-full"
        >
         <Image
  src="/portrait_sign.jpg"
  alt="Mehdi Majdi"
  fill
  priority
  sizes="100vw"
/>
        </motion.div>
      </div>

      {/* Content */}
      <div className={styles.heroContent}>

        <motion.h1
          className={styles.heroName}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.5}
        >
          Mehdi
          <em>Majdi</em>
        </motion.h1>

        <motion.div
          className={styles.heroDivider}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={0.8}
        />

        <motion.p
          className={styles.heroTagline}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.9}
        >
          A Moroccan founder, designer, and entrepreneur, driven by one
          belief — technology shouldn&apos;t replace real life.
        </motion.p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   § STATEMENT
   ═══════════════════════════════════════════════════════════════════ */

function Statement() {
  return (
    <section className={styles.statement} id="statement">
      <Reveal delay={0.1}>
        <p className={styles.statementText}>
          <span className={styles.brand}>VOLTX</span>{' '}
          <span className={styles.editorial}>
            is a different way to experience the world.
          </span>
        </p>
      </Reveal>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   § PHILOSOPHY
   ═══════════════════════════════════════════════════════════════════ */

function Philosophy() {
  return (
    <section className={styles.philosophy} id="philosophy">
      <Reveal delay={0}>
        <h2 className={styles.sectionLabel}>My Philosophy</h2>
      </Reveal>
      <div className={styles.philosophyBody}>
        <Reveal delay={0.15}>
          <p className={styles.philosophyLead}>
            I believe curiosity is humanity's greatest superpower. It has fueled every civilization, challenged every certainty, and shaped every future worth pursuing.
            That belief shapes how I think, what I build, and the problems I choose to solve.

          </p>
        </Reveal>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   § WHY — Editorial pause. Just the question.
   ═══════════════════════════════════════════════════════════════════ */

function Why() {
  return (
    <section className={styles.why} id="why">
      <Reveal delay={0.1}>
        <h2 className={styles.whyTitle}>
          Why I did Build VOLTX?
        </h2>
      </Reveal>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   § QUOTE
   ═══════════════════════════════════════════════════════════════════ */

function Quote() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className={styles.quote} id="quote" ref={ref}>
      <motion.span
        className={styles.quoteMark}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={
          isInView
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.85 }
        }
        transition={{ duration: 1.4, ease: EASE_APPLE }}
      >
        &ldquo;
      </motion.span>

      <Reveal delay={0.2}>
        <blockquote className={styles.quoteText}>
          <p>
            Many people never discover their talent, their passion, or what they are
            truly capable of simply because they never find the right environment or
            the right people.
          </p>

          <p>
            The communities we surround ourselves with shape our habits, our mindset,
            and ultimately the future we create. The right environment can unlock your
            potential. The wrong one can trap you in bad habits, toxic circles, or a
            life of wasted potential.
          </p>

          <p>
            It's heartbreaking how much human potential is lost simply because people
            never found where they truly belonged.
          </p>

          <p>
            I experienced this myself. Finding people to share experiences, make plans,
            play sports, go camping, or build something meaningful with was far harder
            than it should have been.
          </p>

          <p>
            That's why I built VOLTX. A place where finding your people is no longer
            left to chance. A place to discover new experiences, make plans, create
            unforgettable memories, and find where you truly belong.
          </p>

          <p>
            VOLTX connects people who share the same energy, curiosity, and interests.
            You're not just finding something to do. You're finding your tribe.
          </p>

          <p>
            Because the right environment doesn't just change your life. It reveals who
            you were always capable of becoming.
          </p>
        </blockquote>
      </Reveal>

      <Reveal delay={0.4} variant="fadeIn">
        <div className={styles.quoteAttribution}>
          — Mehdi Majdi
        </div>
      </Reveal>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   § CLOSING
   ═══════════════════════════════════════════════════════════════════ */

function Closing() {
  const exploreRef = useRef<HTMLDivElement>(null);
  const isExploreInView = useInView(exploreRef, { once: true, margin: '-60px' });

  return (
    <section className={styles.closing} id="closing">
      <Reveal delay={0}>
        <p className={styles.closingPrelude}>If you&apos;ve made it this far...</p>
      </Reveal>

      <Reveal delay={0.2}>
        <p className={styles.closingThank}>Thank you.</p>
      </Reveal>



      {/* "Go explore." — cinematic moment with letter-spacing animation */}
      <div ref={exploreRef}>
        <motion.p
          className={styles.goExplore}
          initial={{ opacity: 0, letterSpacing: '-0.05em' }}
          animate={
            isExploreInView
              ? { opacity: 1, letterSpacing: '-0.02em' }
              : { opacity: 0, letterSpacing: '-0.05em' }
          }
          transition={{
            duration: 2.0,
            ease: EASE_SMOOTH,
          }}
        >
          Find Your World.
        </motion.p>
      </div>

 


    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════ */

export default function FounderPage() {
  const headerHidden = useSmartHeader();

  return (
    <main className={styles.page}>
      {/* Fixed masthead */}
      <header
        className={`${styles.masthead} ${headerHidden ? styles.mastheadHidden : ''}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="VOLTX_about.svg" alt="VOLTX" className={styles.mastheadLogo} />
      </header>

      <Hero />
      <ScrollIndicator targetId="statement" show={true} />
      <Statement />
      <Philosophy />
      <Why />
      <Quote />
      <Closing />

      {/* Join the Waitlist — small link back to the homepage */}
      <div className="w-full text-center" style={{ padding: '0 0 clamp(48px, 8vh, 96px)' }}>
        <Link
          href="/"
          className="group relative inline-block text-[10px] font-normal uppercase tracking-[0.3em] text-[var(--ink-dim)] opacity-70 transition-opacity duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:opacity-100"
        >
          Join the Waitlist
          <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white/50 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-x-100" />
        </Link>
      </div>

      {/* Footer — shared component (see ../Footer.tsx) */}
      <div className={styles.footer}>
        <Footer />
      </div>
    </main>
  );
}