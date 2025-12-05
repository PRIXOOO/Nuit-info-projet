
import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, UserIcon, LogOutIcon, ViverisLogo, ChevronDownIcon, MenuIcon, XIcon, CheckIcon, SearchIcon } from './ui/Icons';
import SearchModal from './SearchModal';

interface ExpertisesPageProps {
  onNavigate: (view: 'landing' | 'login' | 'signup' | 'dashboard' | 'expertises' | 'metiers' | 'groupe' | 'projets' | 'formations') => void;
  user?: { name: string; email: string };
  onLogout?: () => void;
}

// Navigation Data (Identique à la LandingPage pour consistance)
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

const expertisesList = [
    {
        title: "Agilité",
        desc: "Coaching et formation pour adopter l'état d'esprit et les pratiques agiles face à la complexité des projets.",
        image: "https://images.unsplash.com/photo-1531498860503-62f67a5af444?q=80&w=2070&auto=format&fit=crop",
        tags: ["Scrum", "Kanban", "Safe"]
    },
    {
        title: "Systèmes Embarqués",
        desc: "Conception et réalisation de systèmes critiques, du hardware au logiciel bas niveau.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
        tags: ["Linux", "RTOS", "FPGA"]
    },
    {
        title: "E-commerce B2B",
        desc: "Solutions robustes pour digitaliser les processus de vente complexes et la gestion de données produits.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2070&auto=format&fit=crop",
        tags: ["Intershop", "Stibo Systems", "Keendoo"]
    },
    {
        title: "Gouvernance de l’information",
        desc: "Disponibilité, utilisabilité, intégrité et sécurité de vos données d'entreprise.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
        tags: ["Everteam", "Nuxeo", "M-Files"]
    },
    {
        title: "Master Data Management",
        desc: "Centralisation et cohérence des données produits (PIM) et tiers (MDM) sur tous les canaux.",
        image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2076&auto=format&fit=crop",
        tags: ["Data Quality", "Référentiels"]
    },
    {
        title: "Cybersécurité",
        desc: "Sécurisation des systèmes d'information et des systèmes industriels critiques.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
        tags: ["Audit", "Pentest", "SecNumCloud"]
    },
    {
        title: "Test et simulation",
        desc: "Bancs d'essai et simulateurs pour la R&D, la production et la validation d'équipements.",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
        tags: ["National Instruments", "LabVIEW"]
    },
    {
        title: "Open source",
        desc: "Expertise et contribution aux technologies libres pour des solutions pérennes.",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
        tags: ["Linux Kernel", "Yocto", "Buildroot"]
    },
    {
        title: "Data Science",
        desc: "Analyse prédictive, Intelligence Artificielle et valorisation de vos données.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        tags: ["IA", "Machine Learning", "Big Data"]
    },
    {
        title: "SAP",
        desc: "Conseil, développement et maintenance sur l'ensemble des modules SAP, spécialisation Logistique.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
        tags: ["ERP", "S/4HANA", "Logistique"]
    },
    {
        title: "IoT",
        desc: "De la réalisation des capteurs au cloud : maîtrise globale de la chaîne de valeur IoT.",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
        tags: ["Capteurs", "LoRaWAN", "Edge Computing"]
    },
    {
        title: "Réseaux & Télécoms",
        desc: "Architectures réseaux, connectivité et protocoles pour opérateurs et équipementiers.",
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7f8?q=80&w=2070&auto=format&fit=crop",
        tags: ["5G", "IP", "Arinc"]
    },
    {
        title: "Sûreté de fonctionnement",
        desc: "Validation et vérification pour garantir la fiabilité des équipements critiques (RAMS).",
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop",
        tags: ["EN 50128", "DO-178C", "ISO 26262"]
    },
    {
        title: "Mobilité",
        desc: "Développement d'applications mobiles robustes et ergonomiques pour le terrain.",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop",
        tags: ["iOS", "Android", "Cross-platform"]
    }
];

const ExpertisesPage: React.FC<ExpertisesPageProps> = ({ onNavigate, user, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Gestion intelligente de la navigation
  const handleNavClick = (e: React.MouseEvent, href: string) => {
      e.preventDefault();
      if (href === '#expertises') {
          // Si on est déjà sur la page expertises, on remonte en haut
          window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (href === '#metiers') {
          onNavigate('metiers');
      } else if (href === '#groupe') {
          onNavigate('groupe');
      } else if (href === '#projets') {
          onNavigate('projets');
      } else if (href === '#formations') {
          onNavigate('formations');
      } else {
          // Sinon, on retourne vers la landing page qui gérera l'ancrage
          onNavigate('landing');
      }
  };

  return (
    <div className="min-h-screen w-full bg-viveris-light text-slate-900 overflow-x-hidden font-sans selection:bg-viveris-red selection:text-white">
      
      {/* Search Modal */}
      {isSearchOpen && (
          <SearchModal onClose={() => setIsSearchOpen(false)} onNavigate={onNavigate} />
      )}

      {/* Navbar Unifiée */}
      <nav className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
        ${scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/50 py-3 shadow-sm' : 'bg-white/50 backdrop-blur-md border-b border-white/20 py-4'}
      `}>
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group z-50 relative" onClick={() => onNavigate('landing')}>
            <ViverisLogo className="w-32 h-auto text-[#E30613] transition-colors" />
          </div>

          {/* Desktop Navigation Complet */}
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
                            ${activeMenu === item.label || (item.href === '#expertises') ? 'text-viveris-red bg-red-50' : 'text-slate-600 hover:text-viveris-red hover:bg-white/50'}
                        `}
                    >
                        {item.label}
                        {item.children && (
                            <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-300 ${activeMenu === item.label ? 'rotate-180' : ''}`} />
                        )}
                    </a>

                    {/* Mega Menu Dropdown */}
                    {item.children && (
                        <div 
                            className={`
                                absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[800px]
                                transition-all duration-300 transform origin-top
                                ${activeMenu === item.label ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'}
                            `}
                        >
                            <div className="bg-white rounded-[2rem] shadow-apple-hover border border-slate-100 p-8 overflow-hidden relative">
                                {/* Decorative elements */}
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-viveris-red to-orange-500"></div>
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-50 rounded-full blur-3xl pointer-events-none"></div>

                                <div className="grid grid-cols-3 gap-y-4 gap-x-8 relative z-10">
                                    {item.children.map((subItem) => (
                                        <a 
                                            key={subItem} 
                                            href="#" 
                                            className="group/link flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/link:bg-viveris-red transition-colors"></div>
                                            <span className="text-slate-600 group-hover/link:text-viveris-red font-medium text-sm transition-colors">
                                                {subItem}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                                <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="text-xs font-bold uppercase tracking-wider text-viveris-red flex items-center gap-2 hover:underline"
                                    >
                                        Voir toutes les expertises <ArrowRightIcon className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
          </div>

          {/* User / Auth Buttons */}
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

          {/* Mobile Menu Button */}
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
                        {item.children ? (
                            <details className="group" open={item.href === '#expertises'}>
                                <summary className="flex justify-between items-center py-4 text-lg font-bold text-slate-900 cursor-pointer list-none">
                                    {item.label}
                                    <ChevronDownIcon className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                                </summary>
                                <div className="pl-4 pb-4 flex flex-col gap-3">
                                    {item.children.map(sub => (
                                        <a key={sub} href="#" className="text-slate-500 py-1 hover:text-viveris-red block">{sub}</a>
                                    ))}
                                    <button 
                                        onClick={() => {
                                            toggleMobileMenu();
                                            // on reste sur la page mais on ferme le menu
                                        }}
                                        className="text-viveris-red font-bold py-2 text-left"
                                    >
                                        Voir toutes les expertises
                                    </button>
                                </div>
                            </details>
                        ) : (
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
                        )}
                    </div>
                ))}
            </div>
            
            <div className="mt-8 flex flex-col gap-4">
                {user ? (
                    <>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                            <div className="h-10 w-10 rounded-full bg-viveris-red text-white flex items-center justify-center font-bold">
                                {getInitials(user.name)}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">{user.name}</p>
                                <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                        </div>
                        <button onClick={() => onNavigate('dashboard')} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl">
                            Accéder à mon espace
                        </button>
                        <button onClick={onLogout} className="w-full py-4 text-red-600 font-bold">
                            Se déconnecter
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => onNavigate('login')} className="w-full py-4 border border-slate-200 text-slate-900 font-bold rounded-xl">
                            Se connecter
                        </button>
                        <button onClick={() => onNavigate('signup')} className="w-full py-4 bg-viveris-red text-white font-bold rounded-xl shadow-lg shadow-red-500/30">
                            Nous rejoindre
                        </button>
                    </>
                )}
            </div>
         </div>
      </div>

      {/* Header Section */}
      <div className="pt-32 pb-16 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          <div className="max-w-[1200px] mx-auto px-6 relative z-10">
              <span className="inline-block py-1 px-4 rounded-full bg-red-50 border border-red-100 text-viveris-red text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
                  Savoir-faire
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 animate-slide-up leading-tight">
                  Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-viveris-red to-orange-600">Expertises</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-3xl leading-relaxed animate-slide-up" style={{animationDelay: '100ms'}}>
                  Viveris développe et déploie un ensemble d’expertises stratégiques pour accompagner la transformation digitale de ses clients. Issues de nos activités de veille et de recherche, elles sont au service de la sécurité, de l’innovation et de la performance.
              </p>
          </div>
      </div>

      {/* Grid Expertises */}
      <div className="bg-slate-50 py-20">
          <div className="max-w-[1400px] mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {expertisesList.map((exp, index) => (
                      <div 
                        key={index} 
                        className="group bg-white rounded-[2rem] overflow-hidden shadow-apple hover:shadow-apple-hover transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col h-full animate-slide-up"
                        style={{animationDelay: `${index * 50}ms`}}
                      >
                          <div className="h-56 relative overflow-hidden">
                              <img 
                                src={exp.image} 
                                alt={exp.title} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                              <div className="absolute bottom-4 left-6">
                                  <h3 className="text-2xl font-bold text-white drop-shadow-md group-hover:translate-x-2 transition-transform duration-300">{exp.title}</h3>
                              </div>
                          </div>
                          
                          <div className="p-8 flex flex-col flex-grow">
                              <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                                  {exp.desc}
                              </p>
                              
                              <div className="flex flex-wrap gap-2 mt-auto">
                                  {exp.tags.map(tag => (
                                      <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-slate-200">
                                          {tag}
                                      </span>
                                  ))}
                              </div>

                              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center group/link">
                                  <span className="text-sm font-bold text-viveris-red uppercase tracking-wider">En savoir plus</span>
                                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-viveris-red group-hover/link:bg-viveris-red group-hover/link:text-white transition-all duration-300">
                                      <ArrowRightIcon className="w-4 h-4" />
                                  </div>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* Footer (Identique) */}
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

export default ExpertisesPage;
