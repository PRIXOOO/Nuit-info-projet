
import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, UserIcon, LogOutIcon, ViverisLogo, ChevronDownIcon, MenuIcon, XIcon, CheckIcon, SearchIcon } from './ui/Icons';
import SearchModal from './SearchModal';

interface FormationsPageProps {
  onNavigate: (view: 'landing' | 'login' | 'signup' | 'dashboard' | 'expertises' | 'metiers' | 'groupe' | 'projets' | 'formations') => void;
  user?: { name: string; email: string };
  onLogout?: () => void;
}

const navigationData = [
    { label: "Notre Groupe", href: "#groupe" },
    { label: "Nos Métiers", href: "#metiers" },
    { 
        label: "Nos Expertises", 
        href: "#expertises",
        isMegaMenu: true,
        children: [
            "Gouvernance de l’information",
            "Master Data Management",
            "Cybersécurité",
            "Test et simulation",
            "Open source",
            "Data science",
            "Agilité",
            "SAP",
            "IoT",
            "Réseaux & Télécommunications",
            "Sûreté de fonctionnement",
            "Mobilité",
            "Systèmes Embarqués",
            "E-commerce B2B",
            "Index des expertises"
        ]
    },
    { label: "Nos Projets", href: "#projets" },
    { label: "Nos Formations", href: "#formations" },
];

// Données du catalogue de formations
const formationsData = [
    {
        id: 1,
        category: "Embarqué & IoT",
        title: "Initiation aux réseaux informatiques et spécificités des réseaux ITS",
        duration: "1 Jour",
        desc: "S'appuyer sur des exemples simples du quotidien pour présenter les généralités et sur des cas concrets (cas d’usage) spécifiques aux C-ITS."
    },
    {
        id: 2,
        category: "Embarqué & IoT",
        title: "Comprendre et appréhender l'IoT",
        duration: "1 Jour",
        desc: "Comprendre les enjeux techniques et managériaux du business de l’IoT. Mieux appréhender l’impact structurel de l’entreprise."
    },
    {
        id: 3,
        category: "Développement logiciel",
        title: "Développement d'applications mobiles avec Android",
        duration: "3 Jours",
        desc: "Créer des applications riches via Java ou Kotlin. Accéder aux fonctionnalités critiques (GPS, Bluetooth, caméra)."
    },
    {
        id: 4,
        category: "Développement logiciel",
        title: "QT / QML",
        duration: "3 Jours",
        desc: "Développer des interfaces graphiques. Apprendre à maîtriser le framework QT via les langages C++ et QML / JavaScript."
    },
    {
        id: 5,
        category: "Méthodologies",
        title: "Méthodes spécifiques à l’intégration et au déploiement continu",
        duration: "2 Jours",
        desc: "Vérifier la qualité du produit à chaque modification (CI/CD). Automatisation des tests et livraisons."
    },
    {
        id: 6,
        category: "Méthodologies",
        title: "Gestion de configuration et intégration continue (Git / GitLab-CI)",
        duration: "2 Jours",
        desc: "Comprendre les bases de Git et les bonnes pratiques pour l'intégration continue avec GitLab."
    },
    {
        id: 7,
        category: "Normes et qualité",
        title: "Assurance Qualité Logicielle",
        duration: "2 Jours",
        desc: "Appréhender les problématiques liées à l’assurance qualité logicielle et les outils associés."
    },
    {
        id: 8,
        category: "Normes et qualité",
        title: "Mise en œuvre de la norme médicale EN62304",
        duration: "2 Jours",
        desc: "Mettre en œuvre la norme EN62304 dans le cadre du développement des logiciels appliqués aux dispositifs médicaux."
    },
    {
        id: 9,
        category: "Agilité",
        title: "Découvrir l’agilité en s’initiant à Scrum",
        duration: "1 Jour",
        desc: "Découvrez les méthodes Agiles et leurs pratiques à travers Scrum, le framework Agile le plus populaire."
    },
    {
        id: 10,
        category: "Agilité",
        title: "Devenir Scrum Master",
        duration: "2 Jours",
        desc: "Conduire ou contribuer à une équipe Scrum. Ateliers et mises en situation pour piloter les projets agiles."
    },
    {
        id: 11,
        category: "Agilité",
        title: "Devenir Product Owner",
        duration: "2 Jours",
        desc: "Définir, partager et suivre l’avancement d’un produit. Compétences clés pour assurer le rôle de PO."
    },
    {
        id: 12,
        category: "Data",
        title: "Initiation au Machine Learning",
        duration: "2 Jours",
        desc: "Appréhender les problématiques liées à l’apprentissage machine : opportunités, méthodes et techniques."
    },
    {
        id: 13,
        category: "AMOA",
        title: "Réussir sa collecte de besoins",
        duration: "2 Jours",
        desc: "Collecter l’ensemble des informations nécessaires pour comprendre, inventorier et analyser les besoins."
    }
];

const trainers = [
    {
        name: "Yves",
        role: "Formateur Agilité Scrum",
        desc: "Ingénieur logiciel et Scrum Master, j'accompagne les équipes pour mettre en place l'état d'esprit agile.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop"
    },
    {
        name: "Gregory",
        role: "Formateur ITS",
        desc: "Expert en systèmes embarqués et IA, spécialisé dans les véhicules communicants et autonomes.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Sébastien",
        role: "Formateur Qualité Logicielle",
        desc: "Responsable processus et logiciel sécuritaire dans les domaines médical, avionique et nucléaire.",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=2574&auto=format&fit=crop"
    },
    {
        name: "Julien",
        role: "Formateur Qt QML",
        desc: "Architecte logiciel, expert en simulation spatiale et technologies Web/Mobile.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop"
    },
    {
        name: "Zakaria",
        role: "Formateur Mobile",
        desc: "7 ans d’expérience Android sur des projets logistique, transport et e-commerce.",
        image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2680&auto=format&fit=crop"
    }
];

const categories = ["Tous", "Embarqué & IoT", "Développement logiciel", "Méthodologies", "Normes et qualité", "Agilité", "Data", "AMOA"];

const FormationsPage: React.FC<FormationsPageProps> = ({ onNavigate, user, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
      e.preventDefault();
      if (href === '#formations') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (href === '#expertises') {
          onNavigate('expertises');
      } else if (href === '#metiers') {
          onNavigate('metiers');
      } else if (href === '#groupe') {
          onNavigate('groupe');
      } else if (href === '#projets') {
          onNavigate('projets');
      } else {
          onNavigate('landing');
      }
  };

  const filteredFormations = activeFilter === "Tous" 
    ? formationsData 
    : formationsData.filter(f => f.category === activeFilter);

  return (
    <div className="min-h-screen w-full bg-viveris-light text-slate-900 overflow-x-hidden font-sans selection:bg-viveris-red selection:text-white">
      
      {/* Search Modal */}
      {isSearchOpen && (
          <SearchModal onClose={() => setIsSearchOpen(false)} onNavigate={onNavigate} />
      )}

      {/* Navbar */}
      <nav className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
        ${scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/50 py-3 shadow-sm' : 'bg-white/50 backdrop-blur-md border-b border-white/20 py-4'}
      `}>
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group z-50 relative" onClick={() => onNavigate('landing')}>
            <ViverisLogo className="w-32 h-auto text-[#E30613] transition-colors" />
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {navigationData.map((item) => (
                <div 
                    key={item.label} 
                    className="relative group"
                    onMouseEnter={() => setActiveMenu(item.label)}
                    onMouseLeave={() => setActiveMenu(null)}
                >
                    <a 
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className={`
                            flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[15px] font-medium transition-all duration-300
                            ${activeMenu === item.label || (item.href === '#formations') ? 'text-viveris-red bg-red-50' : 'text-slate-600 hover:text-viveris-red hover:bg-white/50'}
                        `}
                    >
                        {item.label}
                        {item.children && (
                            <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-300 ${activeMenu === item.label ? 'rotate-180' : ''}`} />
                        )}
                    </a>

                    {item.children && (
                        <div 
                            className={`
                                absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[800px]
                                transition-all duration-300 transform origin-top
                                ${activeMenu === item.label ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'}
                            `}
                        >
                            <div className="bg-white rounded-[2rem] shadow-apple-hover border border-slate-100 p-8 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-viveris-red to-orange-500"></div>
                                <div className="grid grid-cols-3 gap-y-4 gap-x-8 relative z-10">
                                    {item.children.map((subItem) => (
                                        <a key={subItem} href="#" className="group/link flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/link:bg-viveris-red transition-colors"></div>
                                            <span className="text-slate-600 group-hover/link:text-viveris-red font-medium text-sm transition-colors">{subItem}</span>
                                        </a>
                                    ))}
                                </div>
                                <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
                                    <button onClick={() => onNavigate('expertises')} className="text-xs font-bold uppercase tracking-wider text-viveris-red flex items-center gap-2 hover:underline">
                                        Voir toutes les expertises <ArrowRightIcon className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-full bg-slate-100 hover:bg-white hover:shadow-md text-slate-600 hover:text-viveris-red transition-all duration-300"
                title="Rechercher"
            >
                <SearchIcon className="w-5 h-5" />
            </button>

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-3 py-2 pl-2 pr-4 rounded-full bg-slate-100 hover:bg-slate-200 transition-all duration-300">
                   <div className="h-8 w-8 rounded-full bg-gradient-to-br from-viveris-red to-red-600 text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-red-500/30">
                      {getInitials(user.name)}
                   </div>
                   <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                </button>
                <div className="absolute right-0 top-full pt-4 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right z-50">
                   <div className="bg-white/90 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-apple p-2">
                      <button onClick={() => onNavigate('dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 text-sm font-medium text-left transition-colors">
                         <UserIcon className="w-4 h-4" /> Espace Candidat
                      </button>
                      <div className="h-px bg-slate-100 my-1"></div>
                      <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 text-sm font-medium text-left transition-colors">
                         <LogOutIcon className="w-4 h-4" /> Déconnexion
                      </button>
                   </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button onClick={() => onNavigate('login')} className="text-[15px] font-medium text-slate-600 hover:text-viveris-red transition-colors">
                  Se connecter
                </button>
                <button onClick={() => onNavigate('signup')} className="text-[15px] font-semibold bg-viveris-red hover:bg-red-700 text-white px-5 py-2.5 rounded-full transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-0.5 active:translate-y-0">
                  Nous rejoindre
                </button>
              </div>
            )}
          </div>
          
          <div className="lg:hidden flex items-center gap-4">
             <button onClick={() => setIsSearchOpen(true)} className="p-2 text-slate-900 hover:bg-slate-100 rounded-full transition-colors relative z-50">
                <SearchIcon className="w-6 h-6" />
             </button>
             <button onClick={toggleMobileMenu} className="p-2 text-slate-900 hover:bg-slate-100 rounded-full transition-colors relative z-50">
                {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
             </button>
          </div>
        </div>
      </nav>

       {/* Mobile Menu Overlay */}
       <div className={`fixed inset-0 bg-white/95 backdrop-blur-xl z-40 lg:hidden transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
         <div className="pt-24 px-6 pb-12 flex flex-col h-full overflow-y-auto">
            <div className="flex flex-col gap-2">
                {navigationData.map((item) => (
                    <div key={item.label} className="border-b border-slate-100 last:border-0">
                         <a 
                            href={item.href} 
                            onClick={(e) => {
                                e.preventDefault();
                                toggleMobileMenu();
                                handleNavClick(e, item.href);
                            }}
                            className="block py-4 text-lg font-bold text-slate-900"
                        >
                            {item.label}
                        </a>
                    </div>
                ))}
            </div>
            <div className="mt-8 flex flex-col gap-4">
                {user ? (
                    <button onClick={onLogout} className="w-full py-4 text-red-600 font-bold">Se déconnecter</button>
                ) : (
                    <>
                        <button onClick={() => onNavigate('login')} className="w-full py-4 border border-slate-200 text-slate-900 font-bold rounded-xl">Se connecter</button>
                        <button onClick={() => onNavigate('signup')} className="w-full py-4 bg-viveris-red text-white font-bold rounded-xl shadow-lg shadow-red-500/30">Nous rejoindre</button>
                    </>
                )}
            </div>
         </div>
      </div>

      {/* Hero Section */}
      <div className="pt-32 pb-20 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-orange-50 to-transparent rounded-full blur-3xl opacity-60 -z-10 pointer-events-none"></div>
          <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center">
              <span className="inline-block py-1 px-4 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
                  Centre de Formation
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 animate-slide-up leading-tight">
                  Formations <span className="text-transparent bg-clip-text bg-gradient-to-r from-viveris-red to-orange-600">intra & inter-entreprises</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed mb-10 animate-slide-up" style={{animationDelay: '100ms'}}>
                  Sur catalogue, adaptées ou sur-mesure. La transmission de savoirs et de savoir-faire fait partie des valeurs fondatrices du groupe Viveris.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay: '200ms'}}>
                  <button className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                      Catalogue des formations
                  </button>
                  <button className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-bold rounded-full transition-all shadow-sm hover:shadow-md">
                      Nous contacter pour du sur-mesure
                  </button>
              </div>
          </div>
      </div>

      {/* Intro Text Section */}
      <div className="bg-white pb-20">
        <div className="max-w-[900px] mx-auto px-6 text-center">
            <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                <p className="text-lg text-slate-700 leading-relaxed mb-4">
                   Nos programmes sont conçus et animés par des professionnels en exercice — experts de haut niveau disposant de nombreuses années d’expériences dans les secteurs les plus exigeants de l’industrie et du tertiaire — qui pratiquent au quotidien les disciplines qu’ils enseignent.
                </p>
                <p className="text-lg text-slate-700 leading-relaxed">
                   Nous privilégions une pédagogie active alternant concepts, exercices et études de cas.
                </p>
            </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-24 z-30 bg-white/80 backdrop-blur-xl border-y border-slate-200 mb-12 transition-all duration-300">
          <div className="max-w-[1400px] mx-auto px-6 py-4 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-2 md:justify-center min-w-max">
                  {categories.map((cat) => (
                      <button
                          key={cat}
                          onClick={() => setActiveFilter(cat)}
                          className={`
                              px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border
                              ${activeFilter === cat 
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105' 
                                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700'}
                          `}
                      >
                          {cat}
                      </button>
                  ))}
              </div>
          </div>
      </div>

      {/* Catalogue Grid */}
      <div className="max-w-[1400px] mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFormations.map((formation, index) => (
                  <div 
                    key={formation.id} 
                    className="bg-white rounded-[2rem] p-8 shadow-apple hover:shadow-apple-hover transition-all duration-500 hover:-translate-y-2 border border-slate-100 flex flex-col animate-slide-up"
                    style={{animationDelay: `${index * 50}ms`}}
                  >
                      <div className="flex justify-between items-start mb-6">
                          <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wide">
                              {formation.category}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-viveris-red rounded-full text-xs font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-viveris-red"></span>
                              {formation.duration}
                          </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight min-h-[56px]">
                          {formation.title}
                      </h3>
                      
                      <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">
                          {formation.desc}
                      </p>

                      <button className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-viveris-red hover:text-white hover:border-viveris-red transition-all duration-300 flex items-center justify-center gap-2 group">
                          Infos & Inscription
                          <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                  </div>
              ))}
          </div>
           {filteredFormations.length === 0 && (
              <div className="text-center py-20">
                  <p className="text-slate-400 text-xl font-medium">Aucune formation dans cette catégorie.</p>
                  <button onClick={() => setActiveFilter("Tous")} className="mt-4 text-viveris-red font-bold hover:underline">Voir tout le catalogue</button>
              </div>
          )}
      </div>

      {/* Infos Pratiques */}
      <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
         <div className="max-w-[1200px] mx-auto px-6 relative z-10">
             <div className="text-center mb-16">
                 <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">Organisation</h2>
                 <h3 className="text-4xl font-bold">Où ? Quand ? Comment ?</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] hover:bg-white/20 transition-colors">
                     <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl mb-6 flex items-center justify-center shadow-lg">
                         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                     </div>
                     <h4 className="text-xl font-bold mb-3">Où ?</h4>
                     <p className="text-white/70">Nos formations sont dispensées dans vos locaux ou dans nos agences. Nous nous déplaçons chez nos clients et partenaires pour les formations sur-mesure.</p>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] hover:bg-white/20 transition-colors">
                     <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl mb-6 flex items-center justify-center shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </div>
                     <h4 className="text-xl font-bold mb-3">Quand ?</h4>
                     <p className="text-white/70">Généralement de <strong>9h à 12h</strong> et <strong>13h à 17h</strong>. Accueil petit déjeuner inclus. Logistique repas et hébergement possible sur demande.</p>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] hover:bg-white/20 transition-colors">
                     <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mb-6 flex items-center justify-center shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </div>
                     <h4 className="text-xl font-bold mb-3">Accompagnement</h4>
                     <p className="text-white/70">Nous vous accompagnons dans vos démarches administratives et réglementaires (convocation, émargement, évaluations, facturation OPCO…).</p>
                 </div>
             </div>
         </div>
      </div>

      {/* Formateurs */}
      <div className="py-24 bg-slate-50">
          <div className="max-w-[1400px] mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Équipe Pédagogique</h2>
                  <h3 className="text-4xl font-bold text-slate-900">Animés par des professionnels en exercice</h3>
              </div>
              
              <div className="flex overflow-x-auto pb-10 gap-6 snap-x scrollbar-hide">
                  {trainers.map((trainer, index) => (
                      <div 
                        key={index} 
                        className="min-w-[300px] md:min-w-[350px] snap-center bg-white rounded-[2.5rem] p-2 shadow-apple hover:shadow-apple-hover transition-all duration-300 hover:-translate-y-1"
                      >
                          <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 relative">
                              <img src={trainer.image} alt={trainer.name} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
                              <div className="absolute bottom-6 left-6 text-white">
                                  <h4 className="text-2xl font-bold">{trainer.name}</h4>
                                  <p className="text-white/80 text-sm font-medium">{trainer.role}</p>
                              </div>
                          </div>
                          <div className="px-6 pb-6">
                              <p className="text-slate-600 leading-relaxed text-sm">
                                  {trainer.desc}
                              </p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-20 pb-10 px-6">
        <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1 md:col-span-1">
                    <div className="mb-6">
                        <ViverisLogo className="w-24 h-auto text-[#E30613]" />
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Groupe de conseil et d'ingénierie en informatique et électronique.
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-900 mb-6">Secteurs</h4>
                    <ul className="space-y-4 text-sm text-slate-500">
                        <li className="hover:text-viveris-red cursor-pointer transition-colors">Transports</li>
                        <li className="hover:text-viveris-red cursor-pointer transition-colors">Aéronautique & Spatial</li>
                        <li className="hover:text-viveris-red cursor-pointer transition-colors">Défense & Sécurité</li>
                        <li className="hover:text-viveris-red cursor-pointer transition-colors">Énergie & Industrie</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-900 mb-6">Carrières</h4>
                    <ul className="space-y-4 text-sm text-slate-500">
                        <li className="hover:text-viveris-red cursor-pointer transition-colors">Nos offres</li>
                        <li className="hover:text-viveris-red cursor-pointer transition-colors">Candidature spontanée</li>
                        <li className="hover:text-viveris-red cursor-pointer transition-colors">Vie chez Viveris</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-900 mb-6">Nous suivre</h4>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all cursor-pointer">
                            <span className="sr-only">LinkedIn</span>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-400 hover:border-red-400 transition-all cursor-pointer">
                            <span className="sr-only">Twitter</span>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-4">
                <p>© 2025 Viveris. Tous droits réservés.</p>
                <div className="flex gap-6">
                    <span className="hover:text-slate-600 cursor-pointer">Mentions légales</span>
                    <span className="hover:text-slate-600 cursor-pointer">Politique de confidentialité</span>
                    <span className="hover:text-slate-600 cursor-pointer">Gestion des cookies</span>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default FormationsPage;
