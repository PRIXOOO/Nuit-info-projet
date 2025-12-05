
import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, UserIcon, LogOutIcon, ViverisLogo, ChevronDownIcon, MenuIcon, XIcon, CheckIcon, SearchIcon } from './ui/Icons';
import SearchModal from './SearchModal';

interface GroupePageProps {
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

const sectorsList = [
    { title: "Automobile", image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop", clients: "Renault, PSA, Volvo Truck, IVECO, Valeo..." },
    { title: "Énergie", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop", clients: "EDF, Enedis, ENGIE, Schneider, ABB..." },
    { title: "Transport", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop", clients: "RATP, SNCF, Alstom, Thales, Bombardier..." },
    { title: "Santé", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop", clients: "Essilor, Merck, Lilly, ANSM, CNOP..." },
    { title: "Aéronautique & Défense", image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?q=80&w=2070&auto=format&fit=crop", clients: "CNES, Airbus, Thales, Safran, MBDA..." },
    { title: "Télécom", image: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=2071&auto=format&fit=crop", clients: "Bouygues Telecom, SFR, Orange..." },
    { title: "Distribution", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop", clients: "Auchan, Kiabi, Monoprix, Decathlon..." },
    { title: "Banques & Assurances", image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2071&auto=format&fit=crop", clients: "BPCE, Crédit Agricole, AXA, MAIF..." }
];

const methodSlides = [
    {
        title: "Innover",
        subtitle: "Notre méthode",
        description: "L’innovation est au cœur de la stratégie de développement du groupe. Elle s’appuie sur des écosystèmes regroupant industriels et laboratoires pour des solutions avant-gardistes.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
        color: "from-viveris-red to-orange-500",
        bgLight: "bg-red-50 text-viveris-red"
    },
    {
        title: "Simplifier",
        subtitle: "Notre méthode",
        description: "Simplifier est devenu culturel. Simplifier les échanges, les relations clients et les solutions mises en œuvre par l’anticipation, la maîtrise et l’expertise.",
        image: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?q=80&w=2074&auto=format&fit=crop",
        color: "from-blue-500 to-indigo-600",
        bgLight: "bg-blue-50 text-blue-600"
    },
    {
        title: "Partager",
        subtitle: "Notre méthode",
        description: "Pas de passion sans partage. Transmettre nos savoirs aux étudiants, accompagner nos collaborateurs et comprendre les enjeux de nos clients pour construire ensemble.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
        color: "from-emerald-500 to-green-600",
        bgLight: "bg-emerald-50 text-emerald-600"
    }
];

const GroupePage: React.FC<GroupePageProps> = ({ onNavigate, user, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-slide effect
  useEffect(() => {
    let interval: any;
    if (isAutoPlaying) {
        interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % methodSlides.length);
        }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
      e.preventDefault();
      if (href === '#groupe') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (href === '#expertises') {
          onNavigate('expertises');
      } else if (href === '#metiers') {
          onNavigate('metiers');
      } else if (href === '#projets') {
          onNavigate('projets');
      } else if (href === '#formations') {
          onNavigate('formations');
      } else {
          onNavigate('landing');
      }
  };

  const nextSlide = () => {
      setIsAutoPlaying(false);
      setCurrentSlide((prev) => (prev + 1) % methodSlides.length);
  };

  const prevSlide = () => {
      setIsAutoPlaying(false);
      setCurrentSlide((prev) => (prev - 1 + methodSlides.length) % methodSlides.length);
  };

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
                            ${activeMenu === item.label || (item.href === '#groupe') ? 'text-viveris-red bg-red-50' : 'text-slate-600 hover:text-viveris-red hover:bg-white/50'}
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
      <div className="pt-32 pb-16 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          <div className="max-w-[1200px] mx-auto px-6 relative z-10">
              <span className="inline-block py-1 px-4 rounded-full bg-red-50 border border-red-100 text-viveris-red text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
                  Présentation
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 animate-slide-up leading-tight max-w-4xl">
                  Viveris est un groupe de <span className="text-transparent bg-clip-text bg-gradient-to-r from-viveris-red to-orange-600">conseil et d’ingénierie</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-3xl leading-relaxed animate-slide-up" style={{animationDelay: '100ms'}}>
                  Nous accompagnons la transformation numérique des entreprises et de leurs produits. 910 personnalités, 910 passionnés engagés à 100% dans la réussite de leurs projets.
              </p>
          </div>
      </div>

      {/* Key Figures */}
      <div className="bg-slate-50 py-20">
          <div className="max-w-[1200px] mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-10 rounded-[2rem] shadow-apple hover:shadow-apple-hover transition-all duration-500 hover:-translate-y-1">
                      <h3 className="text-viveris-red font-extrabold text-5xl mb-4">4</h3>
                      <p className="text-slate-400 font-bold uppercase tracking-wider mb-2">Activités</p>
                      <h4 className="text-slate-900 font-bold text-xl">Métiers</h4>
                      <button onClick={() => onNavigate('metiers')} className="mt-6 text-sm font-semibold text-viveris-red flex items-center gap-2 hover:gap-3 transition-all">Découvrir nos métiers <ArrowRightIcon className="w-4 h-4" /></button>
                  </div>
                  <div className="bg-white p-10 rounded-[2rem] shadow-apple hover:shadow-apple-hover transition-all duration-500 hover:-translate-y-1">
                      <h3 className="text-viveris-red font-extrabold text-5xl mb-4">910+</h3>
                      <p className="text-slate-400 font-bold uppercase tracking-wider mb-2">Équipe</p>
                      <h4 className="text-slate-900 font-bold text-xl">Collaborateurs</h4>
                      <button onClick={() => onNavigate('signup')} className="mt-6 text-sm font-semibold text-viveris-red flex items-center gap-2 hover:gap-3 transition-all">Rejoindre l'équipe <ArrowRightIcon className="w-4 h-4" /></button>
                  </div>
                  <div className="bg-white p-10 rounded-[2rem] shadow-apple hover:shadow-apple-hover transition-all duration-500 hover:-translate-y-1">
                      <h3 className="text-viveris-red font-extrabold text-5xl mb-4">12</h3>
                      <p className="text-slate-400 font-bold uppercase tracking-wider mb-2">Implantations</p>
                      <h4 className="text-slate-900 font-bold text-xl">10 en France, 1 en Belgique, 1 au Maroc</h4>
                      <button className="mt-6 text-sm font-semibold text-viveris-red flex items-center gap-2 hover:gap-3 transition-all">Nous trouver <ArrowRightIcon className="w-4 h-4" /></button>
                  </div>
              </div>
          </div>
      </div>

      {/* Ce en quoi nous croyons */}
      <div className="py-24 bg-white relative">
        <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-16 items-start">
                <div className="w-full md:w-1/3 sticky top-32">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Nos Valeurs</h2>
                    <h3 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">Ce en quoi nous croyons</h3>
                    <p className="text-lg text-slate-500 leading-relaxed">
                        Nous pensons qu’en tant qu’experts, nous nous devons d’être <strong className="text-viveris-red">utiles</strong>, <strong className="text-viveris-red">accessibles</strong> et <strong className="text-viveris-red">ambitieux</strong>.
                    </p>
                </div>
                <div className="w-full md:w-2/3 flex flex-col gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
                        <h4 className="text-2xl font-bold text-slate-900 mb-4">Utiles</h4>
                        <p className="text-slate-600 text-lg">Pour apporter à nos clients la satisfaction d’une solution efficace et bien pensée.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
                        <h4 className="text-2xl font-bold text-slate-900 mb-4">Accessibles</h4>
                        <p className="text-slate-600 text-lg">Pour garantir proximité et transparence tant dans les opérations que lorsqu’il s’agit d’échanger.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
                        <h4 className="text-2xl font-bold text-slate-900 mb-4">Ambitieux</h4>
                        <p className="text-slate-600 text-lg">Pour accompagner les chantiers stratégiques d’aujourd’hui et anticiper les innovations de demain.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Notre Méthode - Slider Interactif */}
      <div className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-viveris-red rounded-full blur-[150px] opacity-20 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">Notre Méthode</h2>
                <h3 className="text-4xl md:text-5xl font-bold mb-6">Innover. Simplifier. Partager.</h3>
            </div>

            {/* Slider Container */}
            <div className="relative">
                <div className="overflow-hidden rounded-[2.5rem] bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl relative" style={{ minHeight: '500px' }}>
                    
                    {/* Slides */}
                    {methodSlides.map((slide, index) => (
                        <div 
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex flex-col lg:flex-row ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        >
                            {/* Text Content */}
                            <div className="w-full lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center relative z-20 bg-slate-900/50 backdrop-blur-sm lg:bg-transparent">
                                <span className={`inline-block py-1 px-4 rounded-full text-xs font-bold uppercase tracking-widest mb-6 w-fit ${slide.bgLight}`}>
                                    {slide.subtitle}
                                </span>
                                <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-white leading-tight">
                                    {slide.title}
                                </h2>
                                <p className="text-lg lg:text-xl text-slate-300 leading-relaxed max-w-lg">
                                    {slide.description}
                                </p>
                                <div className="mt-8 flex gap-2">
                                    <div className="text-6xl font-bold text-white/10 select-none">0{index + 1}</div>
                                </div>
                            </div>

                            {/* Image Background for Mobile / Side Image for Desktop */}
                            <div className="w-full lg:w-1/2 h-full absolute lg:relative inset-0 lg:inset-auto z-0 lg:z-auto">
                                <img 
                                    src={slide.image} 
                                    alt={slide.title} 
                                    className="w-full h-full object-cover opacity-40 lg:opacity-100 transition-transform duration-[10s] ease-linear scale-110"
                                    style={{ transform: index === currentSlide ? 'scale(1.0)' : 'scale(1.1)' }}
                                />
                                <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-40 mix-blend-overlay`}></div>
                                {/* Gradient fade for mobile text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent lg:hidden"></div>
                            </div>
                        </div>
                    ))}

                    {/* Controls */}
                    <div className="absolute bottom-8 right-8 z-30 flex gap-4">
                        <button 
                            onClick={prevSlide}
                            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition-all hover:scale-110"
                        >
                            <ArrowRightIcon className="w-5 h-5 rotate-180" />
                        </button>
                        <button 
                            onClick={nextSlide}
                            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition-all hover:scale-110"
                        >
                            <ArrowRightIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Pagination Dots */}
                    <div className="absolute bottom-8 left-10 lg:left-16 z-30 flex gap-3">
                        {methodSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setIsAutoPlaying(false);
                                    setCurrentSlide(index);
                                }}
                                className={`h-1 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-white' : 'w-4 bg-white/30 hover:bg-white/50'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Secteurs d'activité */}
      <div className="py-24 bg-slate-50">
          <div className="max-w-[1400px] mx-auto px-6">
              <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Nos secteurs d’activité</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {sectorsList.map((sector, index) => (
                      <div key={index} className="group relative h-64 rounded-[2rem] overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500">
                          <img src={sector.image} alt={sector.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity"></div>
                          <div className="absolute bottom-0 left-0 p-6 w-full">
                              <h3 className="text-xl font-bold text-white mb-2">{sector.title}</h3>
                              <p className="text-white/80 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75">
                                  {sector.clients}
                              </p>
                          </div>
                      </div>
                  ))}
              </div>
              <div className="text-center mt-16">
                 <button onClick={() => onNavigate('projets')} className="px-8 py-4 bg-viveris-red hover:bg-red-700 text-white font-bold rounded-full transition-all shadow-lg shadow-red-500/30 hover:-translate-y-1">
                     Découvrez nos projets
                 </button>
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

export default GroupePage;
