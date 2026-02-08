import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/i18n/I18nContext';
import { Loader2, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const { login, signup } = useAuth();
  const { t, isRTL } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(loginEmail, loginPassword);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signup(signupEmail, signupPassword, signupName);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1025] border-purple-500/20 text-foreground max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-center">
            {t.auth.welcome}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-[#0f0a1a] border border-purple-500/20">
            <TabsTrigger value="login" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              {t.auth.login}
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              {t.auth.signup}
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">{t.auth.email}</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="bg-[#0f0a1a] border-purple-500/20 text-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">{t.auth.password}</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className={`bg-[#0f0a1a] border-purple-500/20 text-foreground ${isRTL ? 'pl-10' : 'pr-10'}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground`}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  t.auth.login
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                {t.auth.demoHint}
              </p>
            </form>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">{t.auth.fullName}</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="bg-[#0f0a1a] border-purple-500/20 text-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">{t.auth.email}</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="bg-[#0f0a1a] border-purple-500/20 text-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">{t.auth.password}</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className={`bg-[#0f0a1a] border-purple-500/20 text-foreground ${isRTL ? 'pl-10' : 'pr-10'}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground`}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  t.auth.createAccount
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
