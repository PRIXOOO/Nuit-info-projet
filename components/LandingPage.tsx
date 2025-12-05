
import React, { useEffect, useState, useRef } from 'react';
import { ArrowRightIcon, UserIcon, LogOutIcon, ViverisLogo, ChevronDownIcon, MenuIcon, XIcon, SearchIcon } from './ui/Icons';
import SearchModal from './SearchModal';

interface LandingPageProps {
  onNavigate: (view: 'landing' | 'login' | 'signup' | 'dashboard' | 'expertises' | 'metiers' | 'groupe' | 'projets' | 'formations') => void;
  user?: { name: string; email: string };
  onLogout?: () => void;
}

// Données de navigation basées sur le site officiel
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

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, user, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Gestion de la vidéo
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const handlePlayVideo = () => {
      if (videoRef.current) {
          if (isPlaying) {
              videoRef.current.pause();
          } else {
              videoRef.current.play();
          }
          setIsPlaying(!isPlaying);
      }
  };

  const handleNavClick = (e: React.MouseEvent, href: string) => {
      e.preventDefault();
      if (href === '#metiers') {
          onNavigate('metiers');
      } else if (href === '#expertises') {
          onNavigate('expertises');
      } else if (href === '#groupe') {
          onNavigate('groupe');
      } else if (href === '#projets') {
          onNavigate('projets');
      } else if (href === '#formations') {
          onNavigate('formations');
      } else {
          // Pour les autres liens
      }
  };

  return (
    <div className="min-h-screen w-full bg-viveris-light text-slate-900 overflow-x-hidden font-sans selection:bg-viveris-red selection:text-white">
      
      {/* Search Modal */}
      {isSearchOpen && (
          <SearchModal onClose={() => setIsSearchOpen(false)} onNavigate={onNavigate} />
      )}

      {/* Navbar Modernisée */}
      <nav className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
        ${scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/50 py-3 shadow-sm' : 'bg-transparent border-transparent py-6'}
      `}>
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group z-50 relative" onClick={() => onNavigate('landing')}>
            <ViverisLogo className="w-32 h-auto text-[#E30613] transition-colors" />
          </div>

          {/* Desktop Navigation */}
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
                            ${activeMenu === item.label ? 'text-viveris-red bg-red-50' : 'text-slate-600 hover:text-viveris-red hover:bg-white/50'}
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
                                            onNavigate('expertises');
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
                            <details className="group">
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
                                            onNavigate('expertises');
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

      {/* Hero Section */}
      <main className="pt-40 pb-24 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-red-100/50 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none"></div>
        
        <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
                <span className="inline-block py-1 px-4 rounded-full bg-red-50 border border-red-100 text-viveris-red text-xs font-bold uppercase tracking-widest mb-8">
                    Ingénierie & Conseil
                </span>
                <h1 className="text-6xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-8">
                    Innover. <span className="text-transparent bg-clip-text bg-gradient-to-r from-viveris-red to-orange-500">Simplifier.</span> Partager.
                </h1>
                <p className="text-xl md:text-2xl text-slate-500 leading-relaxed mb-10 font-light">
                    Viveris accompagne ses clients dans leur transformation digitale et le développement de systèmes embarqués critiques.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button onClick={() => onNavigate('signup')} className="h-14 px-8 rounded-full bg-slate-900 text-white font-semibold text-lg transition-all hover:scale-105 hover:bg-slate-800 flex items-center gap-3">
                        Voir nos offres
                        <div className="bg-white/20 rounded-full p-1">
                            <ArrowRightIcon className="w-4 h-4 text-white" />
                        </div>
                    </button>
                    <button onClick={() => onNavigate('groupe')} className="h-14 px-8 rounded-full bg-white text-slate-900 border border-slate-200 font-semibold text-lg transition-all hover:border-slate-400 hover:bg-slate-50">
                        Découvrir le groupe
                    </button>
                </div>
            </div>

            {/* Video Player Style Apple */}
            <div className="mt-20 relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/50 animate-slide-up group h-[300px] md:h-[600px] bg-slate-900">
                <video 
                    ref={videoRef}
                    src="https://www.viveris.fr/wp-content/uploads/2019/10/VIDEO-CHAPEAU-VIVERIS.mp4" 
                    className="w-full h-full object-cover"
                    loop
                    playsInline
                    onClick={handlePlayVideo}
                    onEnded={() => setIsPlaying(false)}
                />
                
                {/* Overlay Dégradé + Texte - Disparaît au play */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-700 pointer-events-none ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="absolute bottom-0 left-0 p-10 md:p-16 text-white max-w-xl">
                        <h3 className="text-3xl font-bold mb-4 drop-shadow-md">L'humain au cœur de la tech.</h3>
                        <p className="text-lg text-slate-300 drop-shadow-md">Découvrez comment nos 910 collaborateurs façonnent le futur de l'aéronautique, du ferroviaire et des systèmes d'information.</p>
                    </div>
                </div>

                {/* Bouton Play */}
                <div 
                    onClick={handlePlayVideo}
                    className={`
                        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 
                        bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center 
                        cursor-pointer hover:scale-110 transition-all duration-500 border border-white/30 
                        group-hover:bg-white/30 z-20
                        ${isPlaying ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'}
                    `}
                >
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1 drop-shadow-sm"></div>
                </div>
            </div>
        </div>

        {/* Bento Grid Stats */}
        <section id="chiffres" className="mt-32 max-w-[1200px] mx-auto px-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard number="910" label="Collaborateurs" delay="0" />
                <StatCard number="97 M€" label="Chiffre d'Affaires" delay="100" />
                <StatCard number="12" label="Implantations" delay="200" />
                <StatCard number="38" label="Années d'expertise" delay="300" />
             </div>
        </section>

        {/* Métiers Section - Apple Cards Style */}
        <section id="expertises" className="mt-40 max-w-[1200px] mx-auto px-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div className="max-w-xl">
                    <h2 className="text-4xl font-bold text-slate-900 mb-6">Nos Domaines d'Expertise</h2>
                    <p className="text-lg text-slate-500">
                        Une approche multidisciplinaire pour répondre aux défis technologiques les plus complexes.
                    </p>
                </div>
                <button 
                    onClick={() => onNavigate('expertises')}
                    className="text-viveris-red font-semibold hover:text-red-700 transition-colors flex items-center gap-2 group"
                >
                    Toutes nos expertises 
                    <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ExpertiseCardBig 
                    title="Systèmes d'Information" 
                    desc="Modernisation des architectures et transformation digitale."
                    image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                />
                <ExpertiseCardBig 
                    title="Systèmes Embarqués" 
                    desc="Conception de systèmes critiques et temps réel."
                    image="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"
                />
                <ExpertiseCardBig 
                    title="Informatique Technique" 
                    desc="Solutions logicielles pour l'industrie 4.0."
                    image="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
                />
                <ExpertiseCardBig 
                    title="Infrastructures & Réseaux" 
                    desc="Connectivité, cloud et cybersécurité."
                    image="https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=2070&auto=format&fit=crop"
                />
            </div>
        </section>
        
        {/* Nouvelle section de Contact */}
        <section className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-50 rounded-full blur-3xl opacity-60 translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-50 rounded-full blur-3xl opacity-60 -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
           
           <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">Un projet ? Une ambition ?</h2>
              <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                 Discutons de vos enjeux et construisons ensemble les solutions technologiques de demain.
              </p>
              <button className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-3 mx-auto">
                 Nous contacter <ArrowRightIcon className="w-4 h-4 text-white" />
              </button>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-10 px-6">
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
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all cursor-pointer">
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

const StatCard: React.FC<{ number: string; label: string; delay: string }> = ({ number, label, delay }) => (
    <div className={`p-8 bg-white rounded-3xl shadow-apple hover:shadow-apple-hover transition-all duration-500 transform hover:-translate-y-1 animate-slide-up`} style={{animationDelay: `${delay}ms`}}>
        <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-viveris-red to-red-400 mb-2">{number}</p>
        <p className="text-slate-500 font-medium text-sm tracking-wide">{label}</p>
    </div>
);

const ExpertiseCardBig: React.FC<{ title: string; desc: string; image: string }> = ({ title, desc, image }) => (
  <div className="group relative h-80 rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
    <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-300"></div>
    <div className="absolute bottom-0 left-0 p-8 transform transition-transform duration-500 group-hover:translate-y-[-10px]">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
            {desc}
        </p>
    </div>
    <div className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-[-10px] group-hover:translate-y-0">
        <ArrowRightIcon className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
    </div>
  </div>
);

export default LandingPage;
