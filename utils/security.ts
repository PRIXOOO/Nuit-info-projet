// Simulation d'un service d'authentification sécurisé (SHA-256 client-side simulation)

export interface AuthResponse {
  success: boolean;
  user?: { name: string; email: string };
  message?: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Validation simple pour la démo
    if (email && password.length >= 6) {
      // Dans une vraie app, le hashage se ferait ici ou côté serveur
      return { 
        success: true, 
        user: { 
          name: email.split('@')[0], // Génère un nom basé sur l'email
          email: email 
        } 
      };
    }
    return { success: false, message: "Identifiants invalides (le mot de passe doit faire 6+ caractères)" };
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!name || !email || password.length < 6) {
        return { success: false, message: "Données invalides" };
    }
    
    return { success: true };
  }
};