import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Palette, Code2, Fingerprint } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';

gsap.registerPlugin(ScrollTrigger);

interface ServicesSectionProps {
  className?: string;
}

const services = [
  {
    icon: Palette,
    title: 'Product Design',
    description: 'UX audits, interface design, prototyping, and motion.',
    color: 'from-blue-500/20 to-transparent',
  },
  {
    icon: Code2,
    title: 'Engineering',
    description: 'Frontend architecture, performance, accessibility, and QA.',
    color: 'from-red-500/20 to-transparent',
  },
  {
    icon: Fingerprint,
    title: 'Brand Systems',
    description: 'Identity, guidelines, copy direction, and asset libraries.',
    color: 'from-purple-500/20 to-transparent',
  },
];

const processSteps = [
  { number: '01', title: 'Discover', description: 'Research, audits, and strategy' },
  { number: '02', title: 'Structure', description: 'Information architecture and flows' },
  { number: '03', title: 'Craft', description: 'Design, build, and iterate' },
  { number: '04', title: 'Ship', description: 'Launch, measure, and optimize' },
];

export default function ServicesSection({ className = '' }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

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

      // Service cards animation
      const cards = cardsRef.current?.children || [];
      gsap.fromTo(
        cards,
        { y: 80, opacity: 0, rotate: 1 },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Process steps animation
      const steps = processRef.current?.children || [];
      gsap.fromTo(
        steps,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: processRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className={`relative w-full bg-dark-purple py-16 sm:py-20 lg:py-32 ${className}`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-12">
        {/* Heading */}
        <div ref={headingRef} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6 mb-10 sm:mb-16">
          <h2
            className="font-display font-bold text-foreground leading-[0.95] tracking-tight"
            style={{ fontSize: 'clamp(28px, 6vw, 64px)' }}
          >
            {t.services.title}
          </h2>
          <p className="text-muted-foreground max-w-md lg:text-right text-sm sm:text-base">
            {t.services.subtitle}
          </p>
        </div>

        {/* Service Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-24">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative rounded-xl sm:rounded-2xl border border-white/5 bg-[#1a1025] p-6 sm:p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30"
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-purple-500/20 transition-colors">
                  <service.icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <h3 className="font-display font-semibold text-lg sm:text-xl text-foreground mb-2 sm:mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Process Timeline */}
        <div className="border-t border-white/5 pt-10 sm:pt-16">
          <h3 className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.08em] text-purple-400 mb-6 sm:mb-10">
            {t.services.process}
          </h3>
          
          <div ref={processRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                  <span className="font-mono text-xl sm:text-2xl font-bold text-purple-400/60">
                    {step.number}
                  </span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <h4 className="font-display font-semibold text-base sm:text-lg text-foreground mb-0.5 sm:mb-1">
                  {step.title}
                </h4>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
