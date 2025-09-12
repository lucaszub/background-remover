# TÂCHE 8: Interface Login/Upload Conditionnelle

## Objectif

Créer UI qui change selon l'état d'authentification.

## Fichier à créer/modifier

Page principale ou `components/ImageProcessor.jsx`

## Comportement required

### Si user PAS connecté:

- Afficher bouton "Se connecter avec Google"
- Click appelle signIn('google')
- Masquer interface upload

### Si user connecté:

- Afficher nom + photo de profil user
- Bouton "Se déconnecter" -> signOut()
- Interface upload d'image visible
- Utiliser hook useAuthenticatedAPI pour appels

## UI Elements

- Bouton Google avec style correct
- Zone upload drag-and-drop
- Affichage image avant/après traitement
- Loading states

## Test de validation

- Login/logout cycle fonctionne
- Upload n'apparaît que si connecté
- Processing d'image marche avec auth

## ⚠️ STATUT: PARTIELLEMENT COMPLÉTÉE
### ✅ Fait:
- Interface auth dans Header/MobileMenu créée
- Boutons login/logout fonctionnels
- Profil utilisateur affiché

### ❌ À faire:
- Conditionner l'affichage de l'interface upload selon l'auth
- Utiliser hook useAuthenticatedAPI pour les appels
- Interface upload visible seulement si connecté
