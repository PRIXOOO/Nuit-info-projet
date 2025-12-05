
import React, { useState, useRef } from 'react';
import { XIcon } from './ui/Icons';

interface DashboardProps {
    user: { name: string; email: string };
    onLogout: () => void;
    onBack: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onBack }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [avatar, setAvatar] = useState<string | null>(null); // L'avatar actuel
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null); // Pour la prévisualisation dans la modale
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = () => {
        if (previewAvatar) {
            setAvatar(previewAvatar);
        }
        setIsEditModalOpen(false);
    };

    const handleCloseModal = () => {
        setPreviewAvatar(null); // Reset preview on close
        setIsEditModalOpen(false);
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 text-slate-800 flex items-center justify-center p-6 font-sans relative">
            
            {/* Bouton Fermer pour revenir à la page précédente */}
            <button 
                onClick={onBack}
                className="absolute top-6 right-6 z-[60] p-2.5 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-all shadow-sm"
                title="Retour"
            >
                <XIcon className="w-6 h-6" />
            </button>

            <div className="w-full max-w-5xl animate-fade-in">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Bonjour, {user.name}</h1>
                        <p className="text-slate-500">Bienvenue sur votre espace Viveris.</p>
                    </div>
                    <button 
                        onClick={onLogout}
                        className="px-6 py-2.5 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-full transition-colors font-semibold text-sm shadow-sm"
                    >
                        Se déconnecter
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Card */}
                    <div className="md:col-span-2 bg-white p-8 rounded-[2rem] shadow-apple border border-slate-100 flex flex-col justify-between h-[400px] relative overflow-hidden group">
                        <div className="relative z-10">
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold mb-4">COMPTE ACTIF</span>
                            <h2 className="text-4xl font-bold text-slate-900 mb-2">Statut du dossier</h2>
                            <p className="text-slate-500 text-lg max-w-md">Vos informations sont à jour. Aucune action n'est requise pour le moment.</p>
                        </div>
                        <div className="relative z-10 mt-8">
                            <div className="inline-flex items-center gap-3 px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-semibold text-slate-700">Systèmes opérationnels</span>
                            </div>
                        </div>
                        
                        {/* Decorative Background */}
                        <div className="absolute right-[-50px] bottom-[-50px] w-64 h-64 bg-gradient-to-br from-red-100 to-viveris-red/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-viveris-red p-8 rounded-[2rem] shadow-apple text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
                        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 text-3xl font-bold shadow-inner bg-white/20 backdrop-blur-md overflow-hidden border-2 border-white/30">
                            {avatar ? (
                                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                user.name.charAt(0)
                            )}
                        </div>
                        <h3 className="text-xl font-bold mb-1 relative z-10">{user.name}</h3>
                        <p className="text-red-200 text-sm mb-6 relative z-10">{user.email}</p>
                        <button 
                            onClick={() => setIsEditModalOpen(true)}
                            className="w-full py-3 bg-white text-viveris-red font-bold rounded-xl hover:bg-red-50 transition-colors shadow-lg relative z-10"
                        >
                            Modifier mon profil
                        </button>
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-apple border border-slate-100 hover:shadow-apple-hover transition-shadow cursor-pointer group">
                        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-viveris-red mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Mes Documents</h3>
                        <p className="text-slate-500 text-sm">Accédez à vos contrats et fiches de paie.</p>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] shadow-apple border border-slate-100 hover:shadow-apple-hover transition-shadow cursor-pointer group">
                        <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Planning</h3>
                        <p className="text-slate-500 text-sm">Consultez vos prochains entretiens.</p>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] shadow-apple border border-slate-100 hover:shadow-apple-hover transition-shadow cursor-pointer group">
                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Offres</h3>
                        <p className="text-slate-500 text-sm">Voir les opportunités internes.</p>
                    </div>
                </div>
            </div>

            {/* MODALE D'ÉDITION DE PROFIL */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
                    <div 
                        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 relative animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            onClick={handleCloseModal}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"
                        >
                            <XIcon className="w-6 h-6" />
                        </button>

                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Modifier mon profil</h2>
                        <p className="text-slate-500 text-sm mb-8">Mettez à jour votre photo de profil.</p>

                        <div className="flex flex-col items-center gap-6">
                            {/* Zone de prévisualisation */}
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-inner bg-slate-50 flex items-center justify-center relative">
                                    {(previewAvatar || avatar) ? (
                                        <img 
                                            src={previewAvatar || avatar || ''} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover" 
                                        />
                                    ) : (
                                        <span className="text-4xl font-bold text-slate-300">{user.name.charAt(0)}</span>
                                    )}
                                    
                                    {/* Overlay au survol */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                    className="hidden" 
                                    accept="image/*"
                                />
                            </div>

                            <div className="text-center">
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-viveris-red font-semibold text-sm hover:underline"
                                >
                                    Choisir une photo
                                </button>
                                <p className="text-xs text-slate-400 mt-2">Format recommandé : 50x50 pixels (JPG, PNG)</p>
                            </div>

                            <div className="w-full flex gap-3 mt-4">
                                <button 
                                    onClick={handleCloseModal}
                                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button 
                                    onClick={handleSaveProfile}
                                    className="flex-1 py-3 rounded-xl bg-viveris-red text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
