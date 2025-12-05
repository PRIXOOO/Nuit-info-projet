
import React, { useState } from 'react';
import { GoogleIcon, ArrowRightIcon, ViverisLogo, XIcon } from './ui/Icons';
import { Input } from './ui/Input';
import { authService } from '../utils/security';

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
  onNavigate: (view: 'signup' | 'landing') => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await authService.login(email, password);
      
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setError(result.message || 'Erreur');
        setIsLoading(false);
      }
    } catch (e) {
      setError("Erreur de connexion");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({ name: "Candidat Google", email: "candidat@gmail.com" });
    }, 1500);
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white relative">
      {/* Bouton Fermer pour revenir à la page précédente */}
      <button 
        onClick={onBack}
        className="absolute top-6 right-6 z-[60] p-2.5 rounded-full bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-all shadow-sm"
        title="Retour"
      >
        <XIcon className="w-6 h-6" />
      </button>

      {/* Left Side - Visuals Corporate */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-viveris-red">
        <img 
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2670&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay scale-105 animate-[scaleIn_20s_infinite_alternate]"
            alt="Bureau Viveris"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-viveris-red to-red-900/80 mix-blend-multiply" />
        
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-20 text-white">
          <div className="animate-fade-in">
             <ViverisLogo className="w-40 h-auto text-white" />
          </div>
          
          <div className="animate-slide-up">
            <h1 className="text-5xl font-bold leading-tight mb-6 tracking-tight">
              Espace <br/> Candidat & Collaborateur
            </h1>
            <p className="text-xl text-red-100 max-w-md leading-relaxed font-light mb-8">
              Accédez à vos dossiers, suivez vos candidatures et rejoignez une communauté d'experts passionnés.
            </p>
            <div className="flex gap-2">
                <div className="w-12 h-1 bg-white rounded-full"></div>
                <div className="w-2 h-1 bg-white/30 rounded-full"></div>
                <div className="w-2 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form (Light Mode) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-md animate-fade-in space-y-10">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Rebonjour.</h2>
            <p className="text-slate-500 text-lg">
              Connectez-vous pour continuer.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-semibold py-4 px-4 rounded-2xl transition-all shadow-sm active:scale-[0.98] duration-200"
            >
              <GoogleIcon className="w-5 h-5" />
              <span>Continuer avec Google</span>
            </button>

            <div className="relative flex items-center gap-4 py-2">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-slate-400 text-sm font-medium">ou</span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-2">
                <Input 
                    label="Email professionnel"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <Input 
                    label="Mot de passe"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    rightElement={
                        <a href="#" className="text-xs font-semibold text-viveris-red hover:text-red-700 transition-colors">
                            Oublié ?
                        </a>
                    }
                />
            </div>

            <div className="flex items-center mb-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded-md border-slate-300 text-viveris-red focus:ring-viveris-red transition-all"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-sm text-slate-600 font-medium group-hover:text-slate-800 transition-colors">Se souvenir de moi</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full bg-viveris-red hover:bg-red-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 
                flex items-center justify-center gap-3 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-0.5 active:translate-y-0
                disabled:opacity-70 disabled:cursor-not-allowed
              `}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 font-medium">
            Pas encore de compte ?{' '}
            <button 
              onClick={() => onNavigate('signup')} 
              className="text-viveris-red hover:text-red-700 font-bold hover:underline transition-all"
            >
              Créer un compte
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
