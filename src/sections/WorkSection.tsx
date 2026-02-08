import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';

gsap.registerPlugin(ScrollTrigger);

interface WorkSectionProps {
  className?: string;
}

const cases = [
  {
    title: 'Nova Finance',
    subtitle: 'Dashboard redesign',
    tags: ['Product', 'UI'],
    image: '/case_nova.jpg',
  },
  {
    title: 'Lumen Care',
    subtitle: 'Patient app',
    tags: ['Mobile', 'UX'],
    image: '/case_lumen.jpg',
  },
  {
    title: 'Arc Studios',
    subtitle: 'Brand + web',
    tags: ['Brand', 'Engineering'],
    image: '/case_arc.jpg',
  },
  {
    title: 'Signal Maps',
    subtitle: 'Data visualization',
    tags: ['UI', 'Engineering'],
    image: '/case_signal.jpg',
  },
];

export default function WorkSection({ className = '' }: WorkSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const casesRef = useRef<HTMLDivElement>(null);
  const { t, isRTL } = useI18n();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Case cards animation
      const caseCards = Array.from(casesRef.current?.children || []);
      caseCards.forEach((card: Element) => {
        gsap.fromTo(
          card,
          { x: isRTL ? '10vw' : '-10vw', opacity: 0, scale: 0.98 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, [isRTL]);

  return (
    <section
      ref={sectionRef}
      id="work"
      className={`relative w-full bg-dark-purple py-16 sm:py-20 lg:py-32 ${className}`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-12">
        {/* Heading */}
        <div ref={headingRef} className="mb-10 sm:mb-16">
          <h2
            className="font-display font-bold text-foreground leading-[0.95] tracking-tight mb-3 sm:mb-4"
            style={{ fontSize: 'clamp(28px, 6vw, 64px)' }}
          >
            {t.work.title}
          </h2>
          <p className="text-muted-foreground max-w-md text-sm sm:text-base">
            {t.work.subtitle}
          </p>
        </div>

        {/* Case Cards */}
        <div ref={casesRef} className="space-y-4 sm:space-y-6">
          {cases.map((caseItem, index) => (
            <div
              key={index}
              className="group relative rounded-xl sm:rounded-2xl border border-white/5 bg-[#1a1025] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 cursor-pointer"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Content */}
                <div className="flex-1 p-5 sm:p-8 lg:p-10 flex flex-col justify-center order-2 lg:order-1">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    {caseItem.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/5 text-muted-foreground text-[10px] sm:text-xs font-mono uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl lg:text-3xl text-foreground mb-1 sm:mb-2 group-hover:text-purple-400 transition-colors">
                    {caseItem.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">
                    {caseItem.subtitle}
                  </p>
                  <div className={`flex items-center gap-2 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity transform ${isRTL ? 'translate-x-0 group-hover:-translate-x-1' : 'translate-x-0 group-hover:translate-x-1'}`}>
                    <span className="text-sm font-medium">{t.work.viewCase}</span>
                    <ArrowUpRight className={`w-4 h-4 ${isRTL ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Image */}
                <div className="lg:w-[45%] h-40 sm:h-48 lg:h-auto relative overflow-hidden order-1 lg:order-2">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1a1025] to-transparent z-10 lg:block hidden" />
                  <img
                    src={caseItem.image}
                    alt={caseItem.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
