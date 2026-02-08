import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { SectionButton } from '@/components/SmartLink';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = '' }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cardARef = useRef<HTMLDivElement>(null);
  const cardBRef = useRef<HTMLDivElement>(null);
  const cardCRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);
  const { t, isRTL } = useI18n();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Load animation (auto-play on mount)
      const loadTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Headline animation
      loadTl.fromTo(
        headlineRef.current,
        { opacity: 0, y: 40, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9 }
      );

      // Subheadline
      loadTl.fromTo(
        subheadRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.5'
      );

      // CTAs
      loadTl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      );

      // Cards fly in from sides (only on desktop)
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        loadTl.fromTo(
          cardARef.current,
          { x: isRTL ? '50vw' : '-50vw', opacity: 0, rotate: -6 },
          { x: 0, opacity: 1, rotate: 0, duration: 1, ease: 'power3.out' },
          '-=0.8'
        );

        loadTl.fromTo(
          cardBRef.current,
          { x: isRTL ? '-50vw' : '50vw', opacity: 0, rotate: 6 },
          { x: 0, opacity: 1, rotate: 0, duration: 1, ease: 'power3.out' },
          '-=0.9'
        );

        loadTl.fromTo(
          cardCRef.current,
          { x: isRTL ? '-50vw' : '50vw', y: '30vh', opacity: 0, rotate: 8 },
          { x: 0, y: 0, opacity: 1, rotate: 0, duration: 1, ease: 'power3.out' },
          '-=0.9'
        );
      }

      // Decoratives
      loadTl.fromTo(
        decorRef.current?.children || [],
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(2.5)' },
        '-=0.6'
      );

      // Scroll-driven exit animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset all elements to visible when scrolling back to top
            gsap.set([headlineRef.current, subheadRef.current, ctaRef.current], {
              opacity: 1,
              y: 0,
              scale: 1,
            });
            if (!isMobile) {
              gsap.set(cardARef.current, { x: 0, y: 0, opacity: 1 });
              gsap.set(cardBRef.current, { x: 0, y: 0, opacity: 1 });
              gsap.set(cardCRef.current, { x: 0, y: 0, opacity: 1 });
            }
            gsap.set(decorRef.current?.children || [], { scale: 1, opacity: 1 });
          },
        },
      });

      // EXIT phase (70-100%)
      scrollTl.fromTo(
        headlineRef.current,
        { y: 0, opacity: 1, scale: 1 },
        { y: '-18vh', opacity: 0, scale: 0.98, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        subheadRef.current,
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0, ease: 'power2.in' },
        0.72
      );

      scrollTl.fromTo(
        ctaRef.current,
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0, ease: 'power2.in' },
        0.74
      );

      if (!isMobile) {
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
      }

      scrollTl.fromTo(
        decorRef.current?.children || [],
        { scale: 1, opacity: 1 },
        { scale: 0.7, opacity: 0, ease: 'power2.in' },
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
      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(15,10,26,0.6)_100%)]" />

      {/* Floating UI Cards - Desktop Only */}
      <div
        ref={cardARef}
        className={`absolute ${isRTL ? 'right-[6vw]' : 'left-[6vw]'} top-[10vh] w-[28vw] max-w-[380px] z-10 hidden lg:block`}
      >
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-purple-500/20">
          <img
            src="/hero_card_a.jpg"
            alt="UI Card"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      <div
        ref={cardBRef}
        className={`absolute ${isRTL ? 'left-[6vw]' : 'right-[6vw]'} top-[12vh] w-[26vw] max-w-[360px] z-10 hidden lg:block`}
      >
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-purple-500/20">
          <img
            src="/hero_card_b.jpg"
            alt="UI Card"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      <div
        ref={cardCRef}
        className={`absolute ${isRTL ? 'left-[8vw]' : 'right-[8vw]'} bottom-[10vh] w-[24vw] max-w-[340px] z-10 hidden lg:block`}
      >
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-purple-500/20">
          <img
            src="/hero_card_c.jpg"
            alt="UI Card"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* Decorative elements */}
      <div ref={decorRef} className="absolute inset-0 pointer-events-none">
        <div className={`absolute ${isRTL ? 'right-[10vw]' : 'left-[10vw]'} bottom-[12vh] w-8 h-8 sm:w-11 sm:h-11 rounded-full border-2 border-purple-500 opacity-60 hidden sm:block`} />
        <div className={`absolute ${isRTL ? 'right-[48vw]' : 'left-[52vw]'} top-[10vh] w-0 h-0 border-l-[5px] sm:border-l-[7px] border-l-transparent border-r-[5px] sm:border-r-[7px] border-r-transparent border-b-[10px] sm:border-b-[14px] border-b-purple-500 opacity-40 hidden sm:block`} />
      </div>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4 sm:px-6">
        <h1
          ref={headlineRef}
          className="font-display font-bold text-foreground text-center leading-[0.95] tracking-tight px-2"
          style={{ fontSize: 'clamp(28px, 8vw, 72px)', maxWidth: 'min(90vw, 1000px)' }}
        >
          {t.hero.title}
        </h1>

        <p
          ref={subheadRef}
          className="mt-6 sm:mt-8 text-muted-foreground text-center max-w-lg sm:max-w-xl px-4"
          style={{ fontSize: 'clamp(14px, 1.2vw, 20px)' }}
        >
          {t.hero.subtitle}
        </p>

        <div ref={ctaRef} className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full px-4">
          <SectionButton
            to="#contact"
            variant="primary"
            className="w-full sm:w-auto"
          >
            {t.hero.ctaPrimary}
          </SectionButton>
          <SectionButton
            to="#work"
            variant="outline"
            showArrow
            className="w-full sm:w-auto group"
          >
            {t.hero.ctaSecondary}
            <ArrowRight className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'} w-4 h-4 group-hover:translate-x-1 transition-transform`} />
          </SectionButton>
        </div>
      </div>
    </section>
  );
}
