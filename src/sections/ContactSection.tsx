import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, ArrowRight, Github, Twitter, Linkedin, Dribbble } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';

gsap.registerPlugin(ScrollTrigger);

interface ContactSectionProps {
  className?: string;
}

export default function ContactSection({ className = '' }: ContactSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t, isRTL } = useI18n();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Content animation
      gsap.fromTo(
        contentRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Form fields animation
      const formFields = formRef.current?.querySelectorAll('.form-field') || [];
      gsap.fromTo(
        formFields,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`relative w-full bg-dark-purple py-16 sm:py-20 lg:py-32 ${className}`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24">
          {/* Left Column - CTA */}
          <div>
            <h2
              className="font-display font-bold text-foreground leading-[0.95] tracking-tight mb-4 sm:mb-6"
              style={{ fontSize: 'clamp(28px, 6vw, 64px)' }}
            >
              {t.contact.title}
            </h2>
            <p className="text-muted-foreground max-w-md mb-6 sm:mb-8 text-sm sm:text-base">
              {t.contact.subtitle}
            </p>
            
            <a
              href={`mailto:${t.contact.email}`}
              className="inline-flex items-center gap-3 text-purple-400 hover:text-purple-300 transition-colors group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-base sm:text-lg font-medium">{t.contact.email}</span>
            </a>

            {/* Social Links */}
            <div className="flex items-center gap-3 sm:gap-4 mt-8 sm:mt-12">
              {[Github, Twitter, Linkedin, Dribbble].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-purple-400 hover:border-purple-500/30 transition-all"
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="form-field space-y-1.5 sm:space-y-2">
                <Label htmlFor="name" className="text-xs sm:text-sm text-muted-foreground">
                  {t.contact.name}
                </Label>
                <Input
                  id="name"
                  placeholder={t.contact.name}
                  className="bg-[#1a1025] border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl text-sm"
                />
              </div>
              <div className="form-field space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm text-muted-foreground">
                  {t.contact.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.contact.email}
                  className="bg-[#1a1025] border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="form-field space-y-1.5 sm:space-y-2">
              <Label htmlFor="budget" className="text-xs sm:text-sm text-muted-foreground">
                {t.contact.budget}
              </Label>
              <Select>
                <SelectTrigger className="bg-[#1a1025] border-white/10 text-foreground focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl text-sm">
                  <SelectValue placeholder={t.contact.budget} />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1025] border-white/10">
                  <SelectItem value="10k">$10k - $25k</SelectItem>
                  <SelectItem value="25k">$25k - $50k</SelectItem>
                  <SelectItem value="50k">$50k - $100k</SelectItem>
                  <SelectItem value="100k">$100k+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="form-field space-y-1.5 sm:space-y-2">
              <Label htmlFor="message" className="text-xs sm:text-sm text-muted-foreground">
                {t.contact.message}
              </Label>
              <Textarea
                id="message"
                placeholder={t.contact.message}
                rows={4}
                className="bg-[#1a1025] border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl resize-none text-sm"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 text-white hover:bg-purple-700 font-semibold py-5 sm:py-6 rounded-full transition-all hover:scale-[1.02] group text-sm sm:text-base"
            >
              {isSubmitted ? t.contact.messageSent : t.contact.sendMessage}
              <ArrowRight className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'} w-4 h-4 group-hover:translate-x-1 transition-transform`} />
            </Button>
          </form>
        </div>

        {/* Footer */}
        <footer className="mt-16 sm:mt-24 pt-8 sm:pt-12 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-foreground text-base sm:text-lg">AuraCode</span>
              <span className="text-muted-foreground text-xs sm:text-sm">Studio</span>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">{t.contact.footer.privacy}</a>
              <a href="#" className="hover:text-foreground transition-colors">{t.contact.footer.terms}</a>
              <a href="#" className="hover:text-foreground transition-colors">{t.contact.footer.cookies}</a>
            </div>
            
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
              {t.contact.footer.copyright}
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}
