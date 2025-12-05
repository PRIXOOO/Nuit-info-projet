
import React, { useState, useRef, useEffect } from 'react';
import { BotIcon, SendIcon, XIcon, MessageCircleIcon, UserIcon, MoreVerticalIcon, InfoIcon, ChevronDownIcon } from './ui/Icons';

interface ChatWidgetProps {
    user?: { name: string; email: string };
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    isNew?: boolean; // Pour cibler l'animation
}

const ROBOT_NORMAL_SRC = "https://i.ibb.co/WNykg0Kd/normal.png"; 
const ROBOT_BRUTI_SRC = "https://i.ibb.co/KcHR0Qgn/abruti.png";

const ChatWidget: React.FC<ChatWidgetProps> = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Bonjour ! Je suis l'assistant Viveris. Je suis là pour répondre à toutes vos questions.",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    
    // Etats pour l'animation
    const [isSending, setIsSending] = useState(false); 
    const [tempInput, setTempInput] = useState('');

    // États pour le menu et la modale "À propos"
    const [showMenu, setShowMenu] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);

    // État pour le copyright déroulant
    const [isCopyrightOpen, setIsCopyrightOpen] = useState(false);

    // État pour le mode "Chat'Bruti"
    const [isBrutiMode, setIsBrutiMode] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (isOpen) {
            // Reset states when closing
            setShowMenu(false);
            setShowAboutModal(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isSending, isTyping, isCopyrightOpen]);

    // Fonction pour le LLM par défaut (Local/Ngrok)
    const sendMessageToLocalLLM = async (text: string) => {
        try {
            // URL de votre LLM local via ngrok
            const apiURL = 'https://multiarticular-annett-pseudoimpartially.ngrok-free.dev/int'; 

            const response = await fetch(apiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // INDISPENSABLE pour ngrok gratuit, sinon tu auras une erreur de parsing JSON
                    'ngrok-skip-browser-warning': 'true', 
                },
                body: JSON.stringify({ text: text }),
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error("Erreur lors de la communication avec l'IA:", error);
            throw error;
        }
    };

    // Fonction pour le LLM "Chat'Bruti"
    const sendMessageToBrutiLLM = async (text: string) => {
        try {
            console.log("Basculement vers Chat'Bruti...");
            
            const apiURL = 'https://multiarticular-annett-pseudoimpartially.ngrok-free.dev/stup'; 
            const response = await fetch(apiURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text }),
            });
            const data = await response.json();
            return data.response;


        } catch (error) {
            console.error("Erreur Bruti LLM:", error);
            throw error;
        }
    };

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isSending) return;

        const textToSend = input;
        
        // Détection du mode Bruti : Activé uniquement si le message contient le mot-clé
        // Si le mot-clé n'est pas là, on repasse en mode normal (false)
        const isBrutiTrigger = textToSend.toLowerCase().includes("chat'bruti") || textToSend.toLowerCase().includes("chat bruti");
        setIsBrutiMode(isBrutiTrigger);

        // 1. Déclenchement de l'animation d'envoi
        setTempInput(textToSend); 
        setIsSending(true); 
        
        // 2. Délai animation (Correspond à la durée CSS ~1.5s pour l'effet "lent")
        await new Promise(resolve => setTimeout(resolve, 1400));

        // 3. Ajout réel du message (Poussière inverse s'assemble)
        const userMsg: Message = {
            id: Date.now().toString(),
            text: textToSend,
            sender: 'user',
            timestamp: new Date(),
            isNew: true // Marqueur pour l'animation d'assemblage
        };

        setMessages(prev => [...prev, userMsg]);
        setInput(''); 
        setTempInput('');
        setIsSending(false); 
        setIsTyping(true);
        setIsCopyrightOpen(false); // Fermer le copyright si l'utilisateur envoie un message

        setTimeout(() => {
             setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, isNew: false } : m));
        }, 1000);

        try {
            let responseText;

            // Décision d'appel API basée sur le trigger détecté pour CE message
            if (isBrutiTrigger) {
                responseText = await sendMessageToBrutiLLM(userMsg.text);
            } else {
                responseText = await sendMessageToLocalLLM(userMsg.text);
            }
            
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Erreur LLM:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "Désolé, je suis momentanément indisponible.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    };

    // Sous-fonction pour gérer le Gras et l'Italique à l'intérieur d'une ligne
    const formatInlineStyles = (text: string) => {
        const parts = text.split(/\*\*((?:.|\n)*?)\*\*/g);
        return parts.map((part, index) => {
            if (index % 2 === 1) return <strong key={index} className="font-bold">{part}</strong>;
            
            const subParts = part.split(/\*(?!\s)((?:.|\n)*?)\*/g);
            if (subParts.length === 1) return part;
            return (
                <span key={index}>
                    {subParts.map((subPart, subIndex) => {
                        if (subIndex % 2 === 1) return <em key={subIndex} className="italic">{subPart}</em>;
                        return subPart;
                    })}
                </span>
            );
        });
    };

    // Fonction principale de formatage (Gère les lignes et les listes)
    const formatMessage = (text: string) => {
        // Découpe par saut de ligne pour traiter la structure
        const lines = text.split('\n');

        return lines.map((line, i) => {
            // Détection de liste : commence par "* " ou "- " (avec espaces optionnels avant)
            const listMatch = line.match(/^\s*[\*\-]\s+(.*)/);

            if (listMatch) {
                // C'est un élément de liste
                const content = listMatch[1];
                return (
                    <div key={i} className="flex items-start gap-2 ml-1 my-1">
                        {/* La puce */}
                        <span className="text-[10px] mt-[6px] opacity-70">•</span>
                        {/* Le contenu formaté */}
                        <span className="flex-1">{formatInlineStyles(content)}</span>
                    </div>
                );
            }

            // Ligne standard
            // Si la ligne est vide, on met un petit espace pour conserver la structure visuelle
            if (!line.trim()) return <div key={i} className="h-2" />;

            return (
                <div key={i} className="whitespace-pre-wrap">
                    {formatInlineStyles(line)}
                </div>
            );
        });
    };

    const sparks = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        rotateDeg: Math.random() * 360,
        radius: 32 + Math.random() * 10 + 'px',
        delay: Math.random() * 2 + 's',
        duration: 1.5 + Math.random() + 's'
    }));

    // Vérifie si l'utilisateur n'a pas encore envoyé de message
    const hasUserSentMessage = messages.some(m => m.sender === 'user');

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end pointer-events-auto font-sans">
            
            {/* Fenêtre de Chat */}
            <div 
                className={`
                    bg-white/90 backdrop-blur-2xl md:border border-white/50 shadow-apple-hover overflow-hidden transition-all duration-500 origin-bottom-right
                    flex flex-col
                    ${isOpen 
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
                        : 'opacity-0 scale-90 translate-y-10 pointer-events-none absolute bottom-0 right-0'}

                    /* Mobile: Plein écran, fixe, z-index élevé */
                    fixed inset-0 w-full h-[100dvh] z-[100] rounded-none

                    /* Desktop: Bulle flottante */
                    md:relative md:inset-auto md:w-[380px] md:h-[600px] md:max-h-[calc(100vh-120px)] md:rounded-[2rem] md:mb-6 md:z-auto
                `}
            >
                {/* Modale À Propos (Superposée à l'intérieur du Chat) */}
                {showAboutModal && (
                    <div className="absolute inset-0 z-[100] bg-slate-900/10 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
                         <div className="bg-white w-full shadow-2xl rounded-3xl p-6 border border-slate-100 relative transform transition-all animate-scale-in">
                             <button 
                                onClick={() => setShowAboutModal(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-full"
                             >
                                 <XIcon className="w-5 h-5" />
                             </button>

                             <div className="flex items-center gap-3 text-viveris-red mb-5">
                                 <div className="p-2 bg-red-50 rounded-xl">
                                    <InfoIcon className="w-6 h-6" />
                                 </div>
                                 <h3 className="font-bold text-xl text-slate-900">À propos</h3>
                             </div>
                             
                             <div className="space-y-4">
                                 <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                     <strong className="text-slate-900 block mb-1">Avertissement IA</strong>
                                     L'intelligence artificielle peut commettre des erreurs. Veuillez vérifier les informations importantes, en particulier celles liées aux procédures internes et aux données sensibles.
                                 </p>

                                 <div className="pt-2">
                                     <p className="text-[10px] text-slate-400 leading-tight text-center">
                                        <span className="font-semibold block mb-1">Mentions Légales</span>
                                        © Google DeepMind – Gemma Team, 2025<br/>Licensed under the Apache License, Version 2.0
                                     </p>
                                 </div>
                             </div>

                             <button 
                                onClick={() => setShowAboutModal(false)}
                                className="w-full mt-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors text-sm"
                             >
                                Compris
                             </button>
                         </div>
                    </div>
                )}

                {/* Header */}
                <div className={`p-5 flex justify-between items-center shadow-lg relative overflow-visible z-20 shrink-0 transition-colors duration-500 ${isBrutiMode ? 'bg-gradient-to-r from-slate-800 to-slate-900' : 'bg-gradient-to-r from-viveris-red to-red-600'}`}>
                    <div className="absolute inset-0 bg-white/10 opacity-30 pointer-events-none"></div>
                    
                    <div className="flex items-center gap-3 relative z-10 flex-1">
                        {/* Menu 3 points */}
                        <div className="relative">
                            <button 
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-2 hover:bg-white/20 rounded-full text-white/90 hover:text-white transition-all focus:outline-none"
                            >
                                <MoreVerticalIcon className="w-5 h-5" />
                            </button>

                            {/* Dropdown Menu */}
                            {showMenu && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-2 animate-scale-in origin-top-left z-50">
                                    <button 
                                        onClick={() => {
                                            setShowAboutModal(true);
                                            setShowMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-viveris-red transition-colors flex items-center gap-3"
                                    >
                                        <InfoIcon className="w-4 h-4" />
                                        <span className="font-medium">À propos</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Avatar Header - SANS cadre carré blanc */}
                        <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center filter drop-shadow-md">
                             <img 
                                src={isBrutiMode ? ROBOT_BRUTI_SRC : ROBOT_NORMAL_SRC} 
                                alt="Avatar Assistant" 
                                className="w-full h-full object-contain"
                             />
                        </div>
                        
                        <div className="overflow-hidden">
                            <h3 className="text-white font-bold text-lg leading-tight truncate">
                                {isBrutiMode ? "Chat'Bruti" : "Assistant Viveris"}
                            </h3>
                            <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full animate-pulse flex-shrink-0 ${isBrutiMode ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]'}`}></span>
                                <span className="text-red-100 text-xs font-medium tracking-wide truncate">
                                    {isBrutiMode ? "Mode délire activé" : "Toujours disponible"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={toggleChat}
                        className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full relative z-10 flex-shrink-0"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50 scroll-smooth relative flex flex-col">
                    <div className="space-y-6 flex-grow pb-4">
                        {messages.map((msg) => (
                            <div 
                                key={msg.id} 
                                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} ${msg.isNew ? 'message-container-appear' : ''}`}
                            >
                                <div className={`flex max-w-[85%] gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar Message - Utilise aussi le PNG */}
                                    <div className={`
                                        w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-sm mt-auto overflow-hidden
                                        ${msg.sender === 'user' 
                                            ? 'bg-viveris-red text-white' 
                                            : 'bg-transparent'} 
                                    `}>
                                        {msg.sender === 'user' ? (
                                            user ? getInitials(user.name) : <UserIcon className="w-4 h-4" />
                                        ) : (
                                            <img 
                                                src={isBrutiMode ? ROBOT_BRUTI_SRC : ROBOT_NORMAL_SRC} 
                                                alt="Bot" 
                                                className="w-full h-full object-contain"
                                            />
                                        )}
                                    </div>

                                    {/* Bulle de message */}
                                    <div className={`
                                        p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm overflow-hidden break-words
                                        ${msg.sender === 'user' 
                                            ? 'bg-viveris-red text-white rounded-br-none shadow-red-500/20' 
                                            : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none shadow-slate-200/50'}
                                    `}>
                                        {/* Application de l'effet "Poussière inverse qui s'assemble" */}
                                        <div className={msg.isNew && msg.sender === 'user' ? 'dust-assembly-effect' : ''}>
                                            {formatMessage(msg.text)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Placeholder espace pour que l'avion ait de la place visuellement si le chat est vide */}
                        {isSending && <div className="h-10 w-full"></div>}

                        {isTyping && (
                            <div className="flex justify-start w-full message-container-appear">
                                <div className="flex items-center gap-2 bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-none ml-11 shadow-sm">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Copyright Collapsible (Visible seulement si pas de message user) */}
                    {!hasUserSentMessage && !isSending && (
                        <div className="mt-4 mb-2 animate-fade-in shrink-0">
                            <button 
                                onClick={() => setIsCopyrightOpen(!isCopyrightOpen)}
                                className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-slate-500 transition-colors text-[11px] font-medium uppercase tracking-wider"
                            >
                                Copyright & Condition d'utilisation
                                <ChevronDownIcon className={`w-3 h-3 transition-transform duration-300 ${isCopyrightOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isCopyrightOpen ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                <p className="text-[10px] text-slate-400 text-center px-4 leading-tight">
                                    © Google DeepMind – Gemma Team, 2025 - Licensed under the Apache License, Version 2.0
                                </p>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100 w-full backdrop-blur-xl bg-white/80 z-20 shrink-0">
                    <form 
                        onSubmit={handleSend}
                        className="flex items-center gap-3 bg-slate-100 border border-slate-200 rounded-full px-4 py-3 focus-within:ring-2 focus-within:ring-viveris-red/20 focus-within:border-viveris-red focus-within:bg-white transition-all duration-300 shadow-inner relative"
                    >
                        {/* Zone d'input : soit le vrai, soit l'animation de poussière */}
                        <div className="flex-1 relative h-6 overflow-visible">
                            {isSending ? (
                                <span className="absolute top-0 left-0 w-full h-full text-sm text-slate-800 font-medium dust-effect pointer-events-none">
                                    {tempInput}
                                </span>
                            ) : (
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Posez une question..."
                                    className="absolute top-0 left-0 w-full h-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
                                    autoFocus
                                />
                            )}
                        </div>

                        <button 
                            type="submit"
                            disabled={!input.trim() || isSending || isTyping}
                            className={`
                                p-2 rounded-full transition-all duration-300 transform relative z-50
                                ${(!input.trim() && !isSending)
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                                    : 'bg-viveris-red hover:bg-red-700 text-white shadow-md hover:scale-110'}
                            `}
                        >
                            {/* L'avion utilise maintenant une classe dynamique fly-takeoff */}
                            <div className={`relative ${isSending ? `fly-takeoff` : ''}`}>
                                <SendIcon className="w-4 h-4" />
                            </div>
                        </button>
                    </form>
                </div>
            </div>

            {/* Bouton Launcher */}
            <div className="relative group flex items-center justify-center">
                {/* Paillettes - seulement au survol (group-hover) */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    {!isOpen && sparks.map((spark) => (
                        <div
                            key={spark.id}
                            className="spark"
                            style={{
                                // @ts-ignore
                                '--rotate-deg': `${spark.rotateDeg}deg`,
                                '--radius': spark.radius,
                                animationDelay: spark.delay,
                                animationDuration: spark.duration
                            }}
                        ></div>
                    ))}
                </div>

                <button
                    onClick={toggleChat}
                    className={`
                        relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 transform hover:scale-110 hover:-translate-y-1
                        ${isOpen 
                            ? 'bg-slate-800 text-white rotate-90 shadow-lg' 
                            : isBrutiMode 
                                ? 'bg-gradient-to-br from-yellow-400 via-orange-300 to-red-400 text-white shadow-neon border-2 border-white/50 animate-pulse'
                                : 'bg-gradient-to-br from-red-400 via-orange-200 to-white text-viveris-red shadow-neon border-2 border-white/50'}
                    `}
                >
                    {isOpen ? (
                        <XIcon className="w-8 h-8" />
                    ) : (
                        <>
                            {isBrutiMode ? (
                                // Icone simplifiée pour le bouton fermé en mode bruti
                                <svg viewBox="0 0 24 24" className="w-8 h-8 text-white drop-shadow-sm group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M8 9l2 2m0-2l-2 2" />
                                    <path d="M14 9l2 2m0-2l-2 2" />
                                    <path d="M9 16c1 1 2 2 3 2s2-1 3-2" />
                                </svg>
                            ) : (
                                <MessageCircleIcon className="w-8 h-8 text-viveris-red drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
                            )}
                            
                            <span className="absolute top-0 right-0 flex h-4 w-4">
                              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isBrutiMode ? 'bg-yellow-400' : 'bg-red-400'}`}></span>
                              <span className={`relative inline-flex rounded-full h-4 w-4 border-2 border-white ${isBrutiMode ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                            </span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ChatWidget;
