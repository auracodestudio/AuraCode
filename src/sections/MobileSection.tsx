import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '@/i18n/I18nContext';

gsap.registerPlugin(ScrollTrigger);

interface MobileSectionProps {
  className?: string;
}

export default function MobileSection({ className = '' }: MobileSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardARef = useRef<HTMLDivElement>(null);
  const cardBRef = useRef<HTMLDivElement>(null);
  const cardCRef = useRef<HTMLDivElement>(null);
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
      // Headline rises from bottom
      scrollTl.fromTo(
        headlineRef.current,
        { y: '40vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0
      );

      // Cards fly in with stagger (RTL aware)
      scrollTl.fromTo(
        cardARef.current,
        { x: isRTL ? '60vw' : '-60vw', opacity: 0, rotate: isRTL ? 6 : -6 },
        { x: 0, opacity: 1, rotate: 0, ease: 'power2.out' },
        0
      );

      scrollTl.fromTo(
        cardBRef.current,
        { x: isRTL ? '-60vw' : '60vw', opacity: 0, rotate: isRTL ? -6 : 6 },
        { x: 0, opacity: 1, rotate: 0, ease: 'power2.out' },
        0.06
      );

      scrollTl.fromTo(
        cardCRef.current,
        { x: isRTL ? '-60vw' : '60vw', y: '40vh', opacity: 0, rotate: isRTL ? -8 : 8 },
        { x: 0, y: 0, opacity: 1, rotate: 0, ease: 'power2.out' },
        0.12
      );

      // Decoratives
      scrollTl.fromTo(
        decorRef.current?.children || [],
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.05, ease: 'back.out(2)' },
        0.1
      );

      // SETTLE (30-70%) - elements hold position

      // EXIT (70-100%)
      scrollTl.fromTo(
        headlineRef.current,
        { y: 0, opacity: 1 },
        { y: '-18vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        cardARef.current,
        { x: 0, y: 0, opacity: 1 },
        { x: isRTL ? '40vw' : '-40vw', y: '-20vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        cardBRef.current,
        { x: 0, y: 0, opacity: 1 },
        { x: isRTL ? '-40vw' : '40vw', y: '-20vh', opacity: 0, ease: 'power2.in' },
        0.72
      );

      scrollTl.fromTo(
        cardCRef.current,
        { x: 0, y: 0, opacity: 1 },
        { x: isRTL ? '-40vw' : '40vw', y: '30vh', opacity: 0, ease: 'power2.in' },
        0.74
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
      {/* Center Headline */}
      <div
        ref={headlineRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center px-4 sm:px-6"
        style={{ width: 'min(90vw, 1000px)' }}
      >
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.08em] text-purple-400 mb-3 sm:mb-4 block">
          {t.mobile.label}
        </span>
        <h2
          className="font-display font-bold text-foreground leading-[0.95] tracking-tight"
          style={{ fontSize: 'clamp(24px, 5vw, 64px)' }}
        >
          {t.mobile.title}
        </h2>
        <p className="mt-4 sm:mt-6 text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
          {t.mobile.description}
        </p>
      </div>

      {/* Floating UI Cards - Desktop Only */}
      <div
        ref={cardARef}
        className={`absolute ${isRTL ? 'right-[6vw]' : 'left-[6vw]'} top-[10vh] w-[28vw] max-w-[380px] z-10 hidden lg:block`}
      >
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-purple-500/20 relative">
          <div className="absolute inset-0 bg-purple-500/10 mix-blend-overlay" />
          <img
            src="/section4_card_purple.jpg"
            alt="Mobile Card"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      <div
        ref={cardBRef}
        className={`absolute ${isRTL ? 'left-[6vw]' : 'right-[6vw]'} top-[12vh] w-[26vw] max-w-[360px] z-10 hidden lg:block`}
      >
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-purple-500/20 relative">
          <div className="absolute inset-0 bg-yellow-500/10 mix-blend-overlay" />
          <img
            src="/section4_card_yellow.jpg"
            alt="Mobile Card"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      <div
        ref={cardCRef}
        className={`absolute ${isRTL ? 'left-[8vw]' : 'right-[8vw]'} bottom-[10vh] w-[24vw] max-w-[340px] z-10 hidden lg:block`}
      >
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-purple-500/20 relative">
          <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />
          <img
            src="/section4_card_blue.jpg"
            alt="Mobile Card"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* Decorative elements */}
      <div ref={decorRef} className="absolute inset-0 pointer-events-none">
        <div className={`absolute ${isRTL ? 'right-[52vw]' : 'left-[52vw]'} top-[10vh] w-0 h-0 border-l-[5px] sm:border-l-[7px] border-l-transparent border-r-[5px] sm:border-r-[7px] border-r-transparent border-b-[10px] sm:border-b-[14px] border-b-purple-500/60 hidden sm:block`} />
        <div className={`absolute ${isRTL ? 'right-[10vw]' : 'left-[10vw]'} bottom-[12vh] w-8 h-8 sm:w-11 sm:h-11 rounded-full border-2 border-purple-400/40 hidden sm:block`} />
      </div>
    </section>
  );
}
