
import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, XIcon, ArrowRightIcon } from './ui/Icons';

interface SearchModalProps {
    onClose: () => void;
    onNavigate: (view: any) => void;
}

// Index des données pour la recherche
const searchIndex = [
    // Pages Principales
    { id: 'p1', title: 'Accueil', type: 'Page', view: 'landing' },
    { id: 'p2', title: 'Notre Groupe', type: 'Page', view: 'groupe' },
    { id: 'p3', title: 'Nos Métiers', type: 'Page', view: 'metiers' },
    { id: 'p4', title: 'Nos Expertises', type: 'Page', view: 'expertises' },
    { id: 'p5', title: 'Nos Projets', type: 'Page', view: 'projets' },
    { id: 'p6', title: 'Nos Formations', type: 'Page', view: 'formations' },
    { id: 'p7', title: 'Connexion Espace Candidat', type: 'Page', view: 'login' },
    
    // Expertises (Redirigent vers la page expertises)
    { id: 'e1', title: 'Agilité & Scrum', type: 'Expertise', view: 'expertises' },
    { id: 'e2', title: 'Systèmes Embarqués', type: 'Expertise', view: 'expertises' },
    { id: 'e3', title: 'Cybersécurité', type: 'Expertise', view: 'expertises' },
    { id: 'e4', title: 'Data Science & IA', type: 'Expertise', view: 'expertises' },
    { id: 'e5', title: 'IoT & Objets Connectés', type: 'Expertise', view: 'expertises' },
    { id: 'e6', title: 'Réseaux & Télécommunications', type: 'Expertise', view: 'expertises' },
    { id: 'e7', title: 'Sûreté de fonctionnement', type: 'Expertise', view: 'expertises' },
    { id: 'e8', title: 'Développement Mobile', type: 'Expertise', view: 'expertises' },
    { id: 'e9', title: 'E-commerce B2B', type: 'Expertise', view: 'expertises' },
    
    // Projets (Redirigent vers la page projets)
    { id: 'pr1', title: 'Systèmes de Transports Intelligents (ITS)', type: 'Projet', view: 'projets' },
    { id: 'pr2', title: 'Rear Lock - Sécurité Vélo', type: 'Projet', view: 'projets' },
    { id: 'pr3', title: 'Métro Automatique Lyon (SQV)', type: 'Projet', view: 'projets' },
    { id: 'pr4', title: 'Véhicule Autonome GMSL', type: 'Projet', view: 'projets' },
    { id: 'pr5', title: 'Santé Connectée PhysioDom', type: 'Projet', view: 'projets' },
    
    // Formations (Redirigent vers la page formations)
    { id: 'f1', title: 'Formation Android / iOS', type: 'Formation', view: 'formations' },
    { id: 'f2', title: 'Formation QT / QML', type: 'Formation', view: 'formations' },
    { id: 'f3', title: 'Formation Scrum Master', type: 'Formation', view: 'formations' },
    { id: 'f4', title: 'Formation Machine Learning', type: 'Formation', view: 'formations' },
    { id: 'f5', title: 'Formation Cybersécurité', type: 'Formation', view: 'formations' },
];

const SearchModal: React.FC<SearchModalProps> = ({ onClose, onNavigate }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<typeof searchIndex>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Focus input on mount
        if (inputRef.current) {
            inputRef.current.focus();
        }
        // Disable body scroll
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
        } else {
            const lowerQuery = query.toLowerCase();
            const filtered = searchIndex.filter(item => 
                item.title.toLowerCase().includes(lowerQuery) || 
                item.type.toLowerCase().includes(lowerQuery)
            );
            setResults(filtered);
        }
    }, [query]);

    const handleSelect = (view: any) => {
        onNavigate(view);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div 
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[80vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header / Input */}
                <div className="flex items-center gap-4 p-4 border-b border-slate-100">
                    <SearchIcon className="w-6 h-6 text-slate-400" />
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Rechercher une page, une expertise, un projet..."
                        className="flex-1 text-lg outline-none text-slate-800 placeholder-slate-400 font-medium bg-transparent"
                    />
                    <button 
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                    >
                        <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded-md mr-2">ESC</kbd>
                        <XIcon className="w-5 h-5 inline-block" />
                    </button>
                </div>

                {/* Results Area */}
                <div className="overflow-y-auto p-2 bg-slate-50 min-h-[100px]">
                    {query === '' ? (
                        <div className="p-8 text-center text-slate-400">
                            <p className="text-sm font-medium">Commencez à taper pour rechercher...</p>
                            <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs cursor-pointer hover:border-viveris-red hover:text-viveris-red transition-colors" onClick={() => setQuery("Expertises")}>Expertises</span>
                                <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs cursor-pointer hover:border-viveris-red hover:text-viveris-red transition-colors" onClick={() => setQuery("Projets")}>Projets</span>
                                <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs cursor-pointer hover:border-viveris-red hover:text-viveris-red transition-colors" onClick={() => setQuery("Formations")}>Formations</span>
                            </div>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="space-y-1">
                            {results.map((item) => (
                                <button 
                                    key={item.id}
                                    onClick={() => handleSelect(item.view)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all group text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`
                                            w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold uppercase
                                            ${item.type === 'Page' ? 'bg-slate-100 text-slate-600' : ''}
                                            ${item.type === 'Expertise' ? 'bg-red-50 text-viveris-red' : ''}
                                            ${item.type === 'Projet' ? 'bg-orange-50 text-orange-600' : ''}
                                            ${item.type === 'Formation' ? 'bg-blue-50 text-blue-600' : ''}
                                        `}>
                                            {item.type.substring(0, 2)}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-800 group-hover:text-viveris-red transition-colors">{item.title}</h4>
                                            <p className="text-xs text-slate-400">{item.type}</p>
                                        </div>
                                    </div>
                                    <ArrowRightIcon className="w-4 h-4 text-slate-300 group-hover:text-viveris-red transition-colors" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-400">
                            <p>Aucun résultat trouvé pour "{query}"</p>
                        </div>
                    )}
                </div>
                
                {/* Footer */}
                <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-400">
                    <span><strong>Viveris</strong> Search</span>
                    <span>Navigateur rapide</span>
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
