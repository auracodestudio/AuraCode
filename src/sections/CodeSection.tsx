import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '@/i18n/I18nContext';

gsap.registerPlugin(ScrollTrigger);

interface CodeSectionProps {
  className?: string;
}

export default function CodeSection({ className = '' }: CodeSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);
  const { t, isRTL } = useI18n();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0-30%)
      // Left card slides in from left (or right for RTL)
      scrollTl.fromTo(
        cardRef.current,
        { x: isRTL ? '60vw' : '-60vw', opacity: 0, rotate: isRTL ? 8 : -8 },
        { x: 0, opacity: 1, rotate: 0, ease: 'power2.out' },
        0
      );

      // Right headline slides in from right (or left for RTL)
      scrollTl.fromTo(
        headlineRef.current,
        { x: isRTL ? '-50vw' : '50vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0
      );

      // Decoratives pop in
      scrollTl.fromTo(
        decorRef.current?.children || [],
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.05, ease: 'back.out(2)' },
        0.05
      );

      // SETTLE (30-70%) - elements hold position

      // EXIT (70-100%)
      scrollTl.fromTo(
        cardRef.current,
        { x: 0, opacity: 1 },
        { x: isRTL ? '40vw' : '-40vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: isRTL ? '-30vw' : '30vw', opacity: 0, ease: 'power2.in' },
        0.72
      );

      scrollTl.fromTo(
        decorRef.current?.children || [],
        { scale: 1, opacity: 1 },
        { scale: 0.8, opacity: 0, ease: 'power2.in' },
        0.75
      );
    }, section);

    return () => ctx.revert();
  }, [isRTL]);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full h-screen bg-dark-purple overflow-hidden ${className}`}
    >
      {/* Left UI Card - Desktop Only */}
      <div
        ref={cardRef}
        className={`absolute ${isRTL ? 'right-[8vw]' : 'left-[8vw]'} top-1/2 -translate-y-1/2 w-[30vw] max-w-[420px] z-10 hidden lg:block`}
      >
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-purple-500/20 relative">
          <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay" />
          <img
            src="/section3_card_red.jpg"
            alt="Code Card"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* Right Headline */}
      <div
        ref={headlineRef}
        className={`absolute ${isRTL ? 'left-[6vw] sm:left-[9vw]' : 'right-[6vw] sm:right-[9vw]'} top-1/2 -translate-y-1/2 z-10 max-w-[80vw] sm:max-w-[50vw] lg:max-w-[38vw] ${isRTL ? 'text-right' : 'text-left'} px-4 sm:px-0`}
      >
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.08em] text-purple-400 mb-2 sm:mb-4 block">
          {t.code.label}
        </span>
        <h2
          className="font-display font-bold text-foreground leading-[0.95] tracking-tight"
          style={{ fontSize: 'clamp(24px, 5vw, 64px)' }}
        >
          {t.code.title}
        </h2>
        <p className="mt-4 sm:mt-6 text-muted-foreground max-w-sm text-sm sm:text-base">
          {t.code.description}
        </p>
      </div>

      {/* Decorative elements */}
      <div ref={decorRef} className="absolute inset-0 pointer-events-none">
        <div className={`absolute ${isRTL ? 'right-[10vw]' : 'left-[10vw]'} top-[12vh] w-8 h-8 sm:w-11 sm:h-11 rounded-full border-2 border-red-500/60 hidden sm:block`} />
        <div className={`absolute ${isRTL ? 'left-[10vw]' : 'right-[10vw]'} bottom-[12vh] w-6 h-6 sm:w-8 sm:h-8 hidden sm:block`}>
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <path
              d="M16 0L18.5 13.5L32 16L18.5 18.5L16 32L13.5 18.5L0 16L13.5 13.5L16 0Z"
              fill="#a855f7"
              fillOpacity="0.6"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
