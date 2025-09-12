## Guide pour utiliser Claude Code efficacement avec ces tâches

### **1. Comment démarrer**

```bash
# Ouvrir votre projet dans le terminal
cd votre-projet-background-remover

# Lancer Claude Code
claude-code

# Ou si vous avez des fichiers de contexte
claude-code --context project-context.md
```

### **2. Prompts efficaces par type de tâche**

#### **Pour les tâches de configuration (1, 2, 3)**

```
"Lis le fichier task-01-google-oauth-setup.md et guide-moi étape par étape pour configurer Google OAuth. Une fois fait, confirme que les URLs sont correctement configurées."

"Implémente la configuration NextAuth.js selon task-02-nextauth-config.md. Créer le fichier [...nextauth].js avec GoogleProvider uniquement et les callbacks JWT."

"Applique task-03-session-provider.md pour wrapper l'app avec SessionProvider. Modifier _app.js et tester que useSession() fonctionne."
```

#### **Pour les tâches backend (4, 5, 6)**

```
"Implémente la configuration CORS selon task-04-cors-setup.md. Modifier main.py pour autoriser les domaines localhost:3000 et le domaine de production. Tester que les preflight requests passent."

"Crée le middleware d'authentification selon task-05-auth-middleware.md. Fichier auth.py avec verify_google_token() et dependency get_current_user(). Intégrer l'API Google userinfo."

"Protège l'endpoint /remove-background selon task-06-protect-endpoint.md. Ajouter la dependency auth et tester avec/sans token."
```

#### **Pour les tâches frontend (7, 8)**

```
"Crée le hook useAuthenticatedAPI selon task-07-auth-hook.md. Hook qui ajoute automatiquement Authorization header et gère les erreurs 401."

"Implémente l'interface UI selon task-08-login-ui.md. Interface conditionnelle : bouton Google si pas connecté, upload si connecté."
```

### **3. Techniques de guidage avancées**

#### **Donner le contexte avant la tâche**

```
"Je travaille sur un projet Next.js + FastAPI pour supprimer le fond d'images. Lis project-context.md puis implémente task-02-nextauth-config.md."
```

#### **Enchaîner les tâches logiquement**

```
"Je viens de terminer task-01-google-oauth-setup.md et j'ai mes CLIENT_ID et SECRET. Maintenant implémente task-02-nextauth-config.md en utilisant ces credentials."
```

#### **Demander validation après chaque étape**

```
"Une fois task-04-cors-setup.md terminée, crée un script de test curl pour vérifier que les appels cross-domain fonctionnent depuis localhost:3000."
```

### **4. Prompts pour debugging**

#### **Si erreur CORS**

```
"J'ai une erreur CORS malgré avoir suivi task-04-cors-setup.md. Diagnostique le problème en vérifiant :
1. Les origins autorisés
2. Les headers allow_credentials
3. Les méthodes autorisées
Puis propose la correction."
```

#### **Si problème auth**

```
"Mon token Google n'est pas accepté par FastAPI. Debug task-05-auth-middleware.md :
1. Vérifier l'appel à l'API Google
2. Contrôler le format du header Authorization
3. Logger les erreurs détaillées"
```

#### **Si interface ne marche pas**

```
"L'interface de task-08-login-ui.md ne change pas d'état. Debug :
1. useSession() retourne quoi ?
2. signIn('google') est-il appelé ?
3. Y a-t-il des erreurs console ?"
```

### **5. Workflow recommandé**

#### **Session 1 : Setup Google + NextAuth**

```
1. "Lis project-context.md puis guide-moi pour task-01-google-oauth-setup.md"
2. Une fois les credentials obtenus : "Implémente task-02-nextauth-config.md"
3. "Applique task-03-session-provider.md et teste que le login Google fonctionne"
```

#### **Session 2 : Backend Auth**

```
1. "Implémente task-04-cors-setup.md pour permettre cross-domain"
2. "Crée task-05-auth-middleware.md avec vérification token Google"
3. "Applique task-06-protect-endpoint.md à la route /remove-background"
```

#### **Session 3 : Frontend Integration**

```
1. "Crée task-07-auth-hook.md pour les appels API authentifiés"
2. "Implémente task-08-login-ui.md pour l'interface complète"
3. "Teste le flow end-to-end : login -> upload -> traitement"
```

### **6. Prompts de validation globale**

#### **Test complet**

```
"Crée un script de test qui valide :
1. Google login fonctionne (task-02, task-03)
2. CORS autorise les appels cross-domain (task-04)
3. API rejette les requêtes sans token (task-05, task-06)
4. Frontend envoie le token correctement (task-07, task-08)
5. Flow complet : login -> upload -> image traitée"
```

#### **Préparation production**

```
"Prépare la configuration production :
1. Variables d'environnement pour les domaines prod
2. CORS pour background-remover.lucaszubiarrain.com
3. Test que Google OAuth callback marche en prod"
```

### **7. Bonnes pratiques avec Claude Code**

#### **✅ À faire**

- Donner un fichier de tâche à la fois
- Demander validation après chaque étape
- Fournir le contexte projet au début
- Être spécifique sur les erreurs rencontrées

#### **❌ À éviter**

- "Implémente toute l'auth" (trop vague)
- Donner 5 tâches d'un coup
- Oublier de tester entre les étapes
- Ne pas mentionner les contraintes (cross-domain, MVP)

### **8. Si Claude Code se perd**

#### **Reset avec contexte**

```
"Reprenons depuis le début. Lis project-context.md. Je veux implémenter uniquement Google OAuth pour protéger mon API FastAPI. Commence par task-01-google-oauth-setup.md."
```

#### **Focus sur une partie**

```
"Concentre-toi uniquement sur le backend FastAPI. J'ai NextAuth qui fonctionne côté frontend. Implémente task-05-auth-middleware.md pour vérifier les tokens Google."
```

**Résumé** : Une tâche à la fois, contexte au début, validation après chaque étape, et debugging spécifique si problème.
