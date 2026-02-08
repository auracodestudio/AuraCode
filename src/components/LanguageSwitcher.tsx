import { useI18n } from '@/i18n/I18nContext';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function LanguageSwitcher() {
  const { language, setLanguage, isRTL } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-2 rounded-full hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground">
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium uppercase">{language}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="bg-dark-light border-white/10 text-foreground min-w-[120px]"
        align={isRTL ? 'end' : 'start'}
      >
        <DropdownMenuItem
          onClick={() => setLanguage('en')}
          className={`cursor-pointer hover:bg-white/5 focus:bg-white/5 ${
            language === 'en' ? 'text-lime' : ''
          }`}
        >
          <span className="mr-2">🇺🇸</span>
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage('ar')}
          className={`cursor-pointer hover:bg-white/5 focus:bg-white/5 ${
            language === 'ar' ? 'text-lime' : ''
          }`}
        >
          <span className="mr-2">🇸🇦</span>
          العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
