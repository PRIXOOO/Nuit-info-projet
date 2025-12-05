
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import ExpertisesPage from './components/ExpertisesPage';
import MetiersPage from './components/MetiersPage';
import GroupePage from './components/GroupePage';
import ProjetsPage from './components/ProjetsPage';
import FormationsPage from './components/FormationsPage';
import ChatWidget from './components/ChatWidget';

type View = 'landing' | 'login' | 'signup' | 'dashboard' | 'expertises' | 'metiers' | 'groupe' | 'projets' | 'formations';
type User = { name: string; email: string };

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [user, setUser] = useState<User | undefined>(undefined);
  // Pile d'historique pour savoir d'où l'on vient
  const [history, setHistory] = useState<View[]>([]);

  // Fonction de navigation qui gère l'historique
  const handleNavigate = (view: View) => {
    // Si on bascule entre Login et Signup, on n'ajoute pas à l'historique pour éviter une boucle
    if ((currentView === 'login' && view === 'signup') || (currentView === 'signup' && view === 'login')) {
        setCurrentView(view);
        return;
    }

    // Sinon, on sauvegarde la vue actuelle avant de changer
    setHistory(prev => [...prev, currentView]);
    setCurrentView(view);
  };

  // Fonction pour revenir en arrière
  const handleBack = () => {
    setHistory(prev => {
      const newHistory = [...prev];
      const previousView = newHistory.pop();
      // Si l'historique est vide, on retourne par défaut à landing
      setCurrentView(previousView || 'landing');
      return newHistory;
    });
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    // Au lieu d'aller au dashboard, on revient à la page précédente
    handleBack();
  };

  const handleLogout = () => {
    setUser(undefined);
    setCurrentView('landing');
    setHistory([]);
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingPage 
            onNavigate={handleNavigate} 
            user={user} 
            onLogout={handleLogout} 
          />
        );
      case 'expertises':
        return (
          <ExpertisesPage
            onNavigate={handleNavigate}
            user={user}
            onLogout={handleLogout}
          />
        );
      case 'metiers':
        return (
          <MetiersPage
            onNavigate={handleNavigate}
            user={user}
            onLogout={handleLogout}
          />
        );
      case 'groupe':
        return (
          <GroupePage
            onNavigate={handleNavigate}
            user={user}
            onLogout={handleLogout}
          />
        );
      case 'projets':
        return (
          <ProjetsPage
            onNavigate={handleNavigate}
            user={user}
            onLogout={handleLogout}
          />
        );
      case 'formations':
        return (
          <FormationsPage
            onNavigate={handleNavigate}
            user={user}
            onLogout={handleLogout}
          />
        );
      case 'login':
        return (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess} 
            onNavigate={handleNavigate}
            onBack={handleBack}
          />
        );
      case 'signup':
        return (
          <SignupPage 
            onNavigate={handleNavigate} 
            onBack={handleBack}
          />
        );
      case 'dashboard':
        if (!user) {
            // Protection de la route
            setTimeout(() => setCurrentView('login'), 0);
            return null;
        }
        return (
          <Dashboard 
            user={user} 
            onLogout={handleLogout}
            onBack={handleBack}
          />
        );
      default:
        return (
            <LandingPage 
            onNavigate={handleNavigate} 
            user={user} 
            onLogout={handleLogout} 
          />
        );
    }
  };

  return (
    <div className="antialiased text-slate-100 bg-slate-950 min-h-screen font-sans">
      {renderView()}
      {/* Le ChatWidget est en dehors du switch pour être persistant, mais a besoin des infos user */}
      <ChatWidget user={user} />
    </div>
  );
};

export default App;
