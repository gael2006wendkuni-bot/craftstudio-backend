require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data', 'projets.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // sert le site HTML

// ─── Initialisation base de données JSON ───────────────────────────────────
function initDB() {
  const dir = path.join(__dirname, 'data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  if (!fs.existsSync(DB_FILE)) {
    const projetsDefaut = [
      {
        id: 1,
        nom: 'AutoLuxe Showroom',
        cat: 'Concession automobile',
        tech: 'HTML · CSS · JavaScript · Node.js',
        img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=700&q=80',
        url: '#',
        date: new Date().toISOString()
      },
      {
        id: 2,
        nom: 'Le Baobab',
        cat: 'Restaurant',
        tech: 'HTML · CSS · JavaScript',
        img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&q=80',
        url: '#',
        date: new Date().toISOString()
      },
      {
        id: 3,
        nom: 'Clinique Santé Plus',
        cat: 'Santé',
        tech: 'HTML · CSS · PHP',
        img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=700&q=80',
        url: '#',
        date: new Date().toISOString()
      }
    ];
    fs.writeFileSync(DB_FILE, JSON.stringify(projetsDefaut, null, 2));
    console.log('✅ Base de données créée avec 3 projets par défaut');
  }
}

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ─── ROUTES ────────────────────────────────────────────────────────────────

// GET tous les projets
app.get('/api/projets', (req, res) => {
  try {
    const projets = readDB();
    res.json({ success: true, projets });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur lecture base de données' });
  }
});

// POST ajouter un projet
app.post('/api/projets', (req, res) => {
  const { nom, cat, tech, img, url } = req.body;
  if (!nom || !cat) {
    return res.status(400).json({ success: false, error: 'Nom et catégorie obligatoires' });
  }
  try {
    const projets = readDB();
    const newId = projets.length > 0 ? Math.max(...projets.map(p => p.id)) + 1 : 1;
    const projet = {
      id: newId,
      nom,
      cat,
      tech: tech || 'Web',
      img: img || '',
      url: url || '#',
      date: new Date().toISOString()
    };
    projets.push(projet);
    writeDB(projets);
    res.status(201).json({ success: true, projet });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur sauvegarde' });
  }
});

// DELETE supprimer un projet
app.delete('/api/projets/:id', (req, res) => {
  const id = parseInt(req.params.id);
  try {
    let projets = readDB();
    const avant = projets.length;
    projets = projets.filter(p => p.id !== id);
    if (projets.length === avant) {
      return res.status(404).json({ success: false, error: 'Projet introuvable' });
    }
    writeDB(projets);
    res.json({ success: true, message: 'Projet supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur suppression' });
  }
});

// PUT modifier un projet
app.put('/api/projets/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nom, cat, tech, img, url } = req.body;
  try {
    let projets = readDB();
    const idx = projets.findIndex(p => p.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Projet introuvable' });
    }
    projets[idx] = { ...projets[idx], nom, cat, tech, img, url };
    writeDB(projets);
    res.json({ success: true, projet: projets[idx] });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur modification' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Craft Studio API', version: '1.0.0' });
});

// ─── DÉMARRAGE ─────────────────────────────────────────────────────────────
initDB();
app.listen(PORT, () => {
  console.log(`✅ Craft Studio Backend — http://localhost:${PORT}`);
  console.log(`📁 Base de données : ${DB_FILE}`);
});
