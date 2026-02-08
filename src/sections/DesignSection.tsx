import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '@/i18n/I18nContext';

gsap.registerPlugin(ScrollTrigger);

interface DesignSectionProps {
  className?: string;
}

export default function DesignSection({ className = '' }: DesignSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
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
      // Circle mask expands
      scrollTl.fromTo(
        circleRef.current,
        { scale: 0, opacity: 1 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      );

      // Headline slides in from left (or right for RTL)
      scrollTl.fromTo(
        headlineRef.current,
        { x: isRTL ? '50vw' : '-50vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0
      );

      // Card slides in from right (or left for RTL)
      scrollTl.fromTo(
        cardRef.current,
        { x: isRTL ? '-60vw' : '60vw', opacity: 0, rotate: isRTL ? -8 : 8 },
        { x: 0, opacity: 1, rotate: 0, ease: 'power2.out' },
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
        circleRef.current,
        { scale: 1, opacity: 1 },
        { scale: 1.25, opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: isRTL ? '30vw' : '-30vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        cardRef.current,
        { x: 0, opacity: 1 },
        { x: isRTL ? '-40vw' : '40vw', opacity: 0, ease: 'power2.in' },
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
      {/* Circle mask layer */}
      <div
        ref={circleRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160vmax] h-[160vmax] rounded-full bg-[#1a1025] opacity-0"
        style={{ transform: 'translate(-50%, -50%) scale(0)' }}
      />

      {/* Left Headline */}
      <div
        ref={headlineRef}
        className={`absolute ${isRTL ? 'right-[6vw] sm:right-[9vw]' : 'left-[6vw] sm:left-[9vw]'} top-1/2 -translate-y-1/2 z-10 max-w-[80vw] sm:max-w-[50vw] lg:max-w-[34vw] px-4 sm:px-0`}
      >
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.08em] text-purple-400 mb-2 sm:mb-4 block">
          {t.design.label}
        </span>
        <h2
          className="font-display font-bold text-foreground leading-[0.95] tracking-tight"
          style={{ fontSize: 'clamp(24px, 5vw, 64px)' }}
        >
          {t.design.title}
        </h2>
        <p className="mt-4 sm:mt-6 text-muted-foreground max-w-sm text-sm sm:text-base">
          {t.design.description}
        </p>
      </div>

      {/* Right UI Card - Desktop Only */}
      <div
        ref={cardRef}
        className={`absolute ${isRTL ? 'left-[8vw]' : 'right-[8vw]'} top-1/2 -translate-y-1/2 w-[30vw] max-w-[420px] z-10 hidden lg:block`}
      >
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-purple-500/20 relative">
          <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />
          <img
            src="/section2_card_blue.jpg"
            alt="Design Card"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* Decorative elements */}
      <div ref={decorRef} className="absolute inset-0 pointer-events-none">
        <div className={`absolute ${isRTL ? 'left-[12vw]' : 'right-[12vw]'} top-[14vh] w-0 h-0 border-l-[6px] sm:border-l-[9px] border-l-transparent border-r-[6px] sm:border-r-[9px] border-r-transparent border-b-[12px] sm:border-b-[18px] border-b-blue-500/60 hidden sm:block`} />
        <div className={`absolute ${isRTL ? 'right-[8vw]' : 'left-[8vw]'} bottom-[10vh] w-10 h-10 sm:w-16 sm:h-16 rounded-full border-2 border-purple-400/40 hidden sm:block`} />
      </div>
    </section>
  );
}
