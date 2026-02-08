import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '@/i18n/I18nContext';

gsap.registerPlugin(ScrollTrigger);

interface IdentitySectionProps {
  className?: string;
}

export default function IdentitySection({ className = '' }: IdentitySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const { t } = useI18n();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0-30%)
      scrollTl.fromTo(
        headlineRef.current,
        { y: '60vh', opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0
      );

      scrollTl.fromTo(
        captionRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.1
      );

      // SETTLE (30-70%) - elements hold position

      // EXIT (70-100%)
      scrollTl.fromTo(
        headlineRef.current,
        { y: 0, opacity: 1 },
        { y: '-30vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        captionRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.72
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="studio"
      className={`relative w-full h-screen bg-purple-600 overflow-hidden ${className}`}
    >
      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4 sm:px-6">
        <h2
          ref={headlineRef}
          className="font-display font-bold text-white text-center leading-[0.95] tracking-tight"
          style={{ fontSize: 'clamp(32px, 8vw, 96px)', width: 'min(95vw, 1200px)' }}
        >
          {t.identity.title}
        </h2>

        <p
          ref={captionRef}
          className="mt-6 sm:mt-8 text-white/80 text-center max-w-lg px-4"
          style={{ fontSize: 'clamp(14px, 1.2vw, 20px)' }}
        >
          {t.identity.subtitle}
        </p>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-700/50 via-transparent to-purple-800/50 pointer-events-none" />
    </section>
  );
}
