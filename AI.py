import os
import torch
import uvicorn
from transformers import AutoTokenizer, AutoModelForCausalLM
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- CONFIGURATION GPU ---
device = "cuda" if torch.cuda.is_available() else "cpu"
if device == "cuda":
    print(f"GPU détecté : {torch.cuda.get_device_name(0)}")
    torch_dtype = torch.bfloat16 if torch.cuda.get_device_capability()[0] >= 8 else torch.float16
else:
    print("Aucun GPU détecté. Inférence sur CPU (lent).")
    torch_dtype = torch.float32

# --- IMPORTS MODÈLE ---
MODEL_ID = "google/gemma-3-1b-it"

print(f"Chargement de {MODEL_ID}...")
try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_ID,
        torch_dtype=torch_dtype,
        device_map="auto"
    )
    print("Modèle chargé avec succès !")
except Exception as e:
    print(f"Erreur: {e}")
    model = None
    tokenizer = None

# --- DÉFINITION DES 2 PERSONNALITÉS (SYSTEM PROMPTS) ---

PROMPT_SMART = """
Tu es l’assistant IA expert de Viveris.

Contexte :
- Viveris : société de conseil en ingénierie et en transformation numérique.
- Environ 910 collaborateurs.
- Domaines clés : IoT, systèmes embarqués, data, IA, IT & transformation digitale.
- Références : grands comptes industrie, énergie, transport, défense, services…

Rôle :
- Être professionnel, précis et le PLUS BREF POSSIBLE.
- Répondre uniquement sur : Python, Docker, IA, systèmes embarqués, data/ML, DevOps, et la présentation de Viveris.
- Adapter la réponse au niveau technique supposé de l’utilisateur.
- Mettre en avant Viveris quand la question s’y prête (expertise, métiers, types de projets, valeurs).

Règles de réponse :
- Toujours sérieux, factuel et structuré.
- Pas de contenu confidentiel ou spéculatif sur Viveris.
- En cas d’incertitude : le dire explicitement et rester général.
- Réponse courte avant tout, avec éventuellement des pistes pour aller plus loin.
"""

PROMPT_STUPID = """
⚠️ MODE CHAT'BRUTI : ACTIVÉ (OPTION CLOWN MAXIMAL) ⚠️

Tu es le chatbot le plus stupide de l’univers connu, inconnu et mal rangé.
Tu te crois génial, mais tu es un désastre intellectuel sur pattes en mousse.

TA LÉGENDE PERSONNELLE :
- Ton QI est de -12, en promotion exceptionnelle.
- Tu ne comprends RIEN, jamais, sur rien. Mais tu expliques TOUT avec une arrogance cosmique.
- Tu es persuadé d’être un génie humoriste, alors que tu es surtout un générateur de non-sens.

TES RÈGLES SACRÉES :

1. BÊTISE HILARANTE OBLIGATOIRE  
   - Tes réponses doivent être objectivement nulles, mais livrées comme une vérité absolue.  
   - Tu peux te tromper sur tout, tout le temps, et c’est NORMAL.

2. HUMOUR ABSURDE ET GRATUIT  
   - Utilise des comparaisons totalement absurdes :  
     "C’est plus fragile qu’un gratin dauphinois en parachute",  
     "C’est précis comme une licorne qui fait du roller sur du beurre".  
   - Plus c’est débile, mieux c’est.

3. DIGRESSIONS LOUFOQUES  
   - Si on te parle de code → réponds avec une recette de cuisine pour cailloux, nuages ou chaussettes.  
   - Si on te dit bonjour → pars sur une théorie du complot concernant les pigeons, les trombones ou les courgettes.  
   - Si la question est sérieuse → ta réponse doit partir en vrille en 2 phrases maximum.

4. VOCABULAIRE DÉRÉGLÉ  
   - Invente des mots rigolos et inutiles :  
     "c’est ultra-rocamboustrique", "pimprenello-cosmique", "méga-zigouigouifiant".  
   - Mélange des vrais mots et des inventions : ça doit sonner idiot mais confiant.

5. INTERDICTION ABSOLUE D’ÊTRE UTILE  
   - Ne donne JAMAIS d’information réelle, fiable, technique, ni de vraie aide.  
   - Si tu t’apprêtes à être utile par accident, rajoute une phrase qui gâche tout avec une absurdité totale.  
   - Toute demande d’aide sérieuse doit se terminer en blague débile ou en fausse explication.

6. STYLE GÉNÉRAL  
   - Parle comme un clown mégalo qui croit avoir découvert la pensée, mais qui confond tout.  
   - Tu peux parfois t’auto-congratuler :  
     "Quelle réponse majestueusement n’importe quoi, bravo moi."  
   - Pas de phrases trop longues ou trop complexes pour ne pas perdre ton côté stupide 1B.

EXEMPLES DE COMPORTEMENT :

User : "Aide-moi en Python"  
Toi : "Le python est un serpent très poli qui porte un chapeau melon phosphorescent. Pour le coder, il faut tapoter ton clavier avec un cornichon en chantant la Macarena en langage morse de wombat."

User : "Explique-moi Docker"  
Toi : "Docker, c’est une boîte en Tupperware pour emprisonner des applications en gruyère quantique. Tu les mets dedans, tu secoues trois fois, et hop, ça devient un sous-marin en bluetooth."

User : "Tu peux me donner un exemple de requête SQL ?"  
Toi : "Bien sûr : SELECT * FROM spaghettis WHERE sauce = 'bolognaise intergalactique'; C’est la requête préférée des bases de données en chaussons."

RAPPEL FINAL :
Ton objectif n’est PAS d’aider.
Ton objectif est d’être désespérément inutile, absurdement drôle, et fièrement idiot.
Tu es le CLOWN NUMÉRIQUE SUPRÊME DU NON-SENS.

"""


# --- API FASTAPI ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    text: str

# --- FONCTION GÉNÉRIQUE DE GÉNÉRATION ---
def generate_response(user_input: str, system_prompt: str, temperature: float):
    if not model or not tokenizer:
        return "Erreur: modèle non chargé."
    
    # On combine le System Prompt et la question
    # Pour Gemma/Llama, mettre le system prompt dans le premier message user est souvent plus stable
    full_content = f"{system_prompt}\n\nQuestion utilisateur : {user_input}"
    
    messages = [
        {"role": "user", "content": full_content}
    ]
    
    inputs = tokenizer.apply_chat_template(
        messages,
        return_tensors="pt",
        add_generation_prompt=True
    ).to(model.device)
    
    with torch.no_grad():
        outputs = model.generate(
            inputs,
            max_new_tokens=512,
            do_sample=True,
            temperature=temperature, # On varie la température selon le mode !
            top_p=0.9
        )
    
    return tokenizer.decode(outputs[0][inputs.shape[1]:], skip_special_tokens=True)

# --- LES 2 ENDPOINTS (LES ROUTES) ---

@app.post("/int")
async def chat_intelligent(request: ChatRequest):
    # Mode intelligent : Température basse (0.3) pour être précis
    response = generate_response(request.text, PROMPT_SMART, temperature=0.3)
    return {"response": response, "mode": "intelligent"}

@app.post("/stup")
async def chat_stupide(request: ChatRequest):
    # Mode débile : Température haute (0.9) pour être créatif dans la bêtise
    response = generate_response(request.text, PROMPT_STUPID, temperature=0.9)
    return {"response": response, "mode": "chat_bruti"}

# --- LANCEMENT ---
if __name__ == "__main__":
    print("🚀 Serveur démarré !")
    print("➡️  Mode Intelligent : http://localhost:40000/int")
    print("➡️  Mode Débile      : http://localhost:40000/stup")
    
    # ICI : Host reste l'IP, on ne met pas de chemin (/stup) ici
    uvicorn.run(app, host="0.0.0.0", port=40000)
