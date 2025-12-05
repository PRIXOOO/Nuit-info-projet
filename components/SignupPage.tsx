
import React, { useState } from 'react';
import { GoogleIcon, ArrowRightIcon, ViverisLogo, XIcon } from './ui/Icons';
import { Input } from './ui/Input';
import { authService } from '../utils/security';

interface SignupPageProps {
  onNavigate: (view: 'login' | 'landing') => void;
  onBack: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onNavigate, onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.register(name, email, password);
      
      if (result.success) {
        setTimeout(() => {
          onNavigate('login');
        }, 1000);
      } else {
        setError(result.message || 'Erreur');
        setIsLoading(false);
      }
    } catch (err) {
      setError("Une erreur est survenue.");
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Simulation inscription réussie');
    }, 1500);
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white relative">
      {/* Bouton Fermer pour revenir à la page précédente */}
      <button 
        onClick={onBack}
        className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-all shadow-sm"
        title="Retour"
      >
        <XIcon className="w-6 h-6" />
      </button>

      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-viveris-red">
        <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay animate-[scaleIn_20s_infinite_alternate-reverse]"
            alt="Réunion Viveris"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-viveris-red/90 mix-blend-multiply" />
        
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-20 text-white">
          <div className="animate-fade-in">
             <ViverisLogo className="w-40 h-auto text-white" />
          </div>
          <div className="animate-slide-up">
            <h1 className="text-5xl font-bold leading-tight mb-6 tracking-tight">
              Votre avenir <br/> commence ici.
            </h1>
            <p className="text-xl text-red-100 max-w-md leading-relaxed font-light">
              Développez vos compétences sur des projets innovants dans le ferroviaire, l'aéronautique, l'énergie et plus encore.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-md animate-fade-in space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Créer un compte</h2>
            <p className="text-slate-500 text-lg">
              Rejoignez les 910 collaborateurs Viveris.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
             <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-semibold py-4 px-4 rounded-2xl transition-all shadow-sm active:scale-[0.98] duration-200"
            >
              <GoogleIcon className="w-5 h-5" />
              <span>S'inscrire avec Google</span>
            </button>

            <div className="relative flex items-center gap-4 py-2">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-slate-400 text-sm font-medium">ou par email</span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
                <Input 
                    label="Nom complet"
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
                <Input 
                    label="Adresse email"
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input 
                        label="Mot de passe"
                        type="password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <Input 
                        label="Confirmation"
                        type="password" 
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
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
                  <span>Créer mon compte</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 font-medium">
            Déjà inscrit ?{' '}
            <button 
              onClick={() => onNavigate('login')} 
              className="text-viveris-red hover:text-red-700 font-bold hover:underline transition-all"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
