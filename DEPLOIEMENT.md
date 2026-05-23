# 🚀 Déploiement Craft Studio Backend

## Étape 1 — Mettre le code sur GitHub

```bash
git init
git add .
git commit -m "Craft Studio backend v1"
# Créez un repo sur github.com/new nommé "craftstudio-backend"
git remote add origin https://github.com/VOTRE_NOM/craftstudio-backend.git
git push -u origin main
```

## Étape 2 — Déployer sur Railway (gratuit)

1. Allez sur https://railway.app
2. Connectez-vous avec GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Sélectionnez "craftstudio-backend"
5. Railway détecte Node.js et lance `npm start` automatiquement

## Étape 3 — Récupérer votre URL

Railway vous donne une URL du type :
`https://craftstudio-backend-production.up.railway.app`

## Étape 4 — Connecter le frontend

Dans public/index.html, ligne :
```javascript
const API = ''; // changer par votre URL Railway
```
Remplacer par :
```javascript
const API = 'https://craftstudio-backend-production.up.railway.app';
```

## Étape 5 — Vérifier

Ouvrez : https://votre-url.railway.app/health
Vous devez voir : {"status":"ok","service":"Craft Studio API"}

## Routes disponibles

- GET  /api/projets        → liste tous les projets
- POST /api/projets        → ajouter un projet
- PUT  /api/projets/:id    → modifier un projet
- DELETE /api/projets/:id  → supprimer un projet

---
Coût : GRATUIT (Railway 500h/mois)
