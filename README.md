# 🧚 Winx Gen

> 🚧 **WIP — Work In Progress** 🚧

Créateur de personnages Winx en ligne. Choisis un corps, une coiffure, des vêtements, des couleurs — et exporte ta Winx en image.

---

## Table des matières

1. [Lancer le projet](#-lancer-le-projet)
2. [Architecture technique](#-architecture-technique)
3. [Guide pour la dessinatrice](#-guide-pour-la-dessinatrice-procreate)
4. [Ajouter une nouvelle variante ou couleur](#-ajouter-une-nouvelle-variante-ou-couleur)
5. [Structure du projet](#-structure-du-projet)
6. [Arrêter / nettoyer](#-arrêter--nettoyer)

---

## 🚀 Lancer le projet

### Prérequis

- [Docker](https://www.docker.com/) + Docker Compose installés

### Production / Coolify

```bash
docker compose up --build
```

### Développement local (hot reload)

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Puis ouvre **http://localhost:5173** dans ton navigateur.

| Service | Port |
|---|---|
| Frontend (React) | 5173 |
| Backend (API) | 3000 |
| Base de données (PostgreSQL) | 5432 |

---

## 🏗 Architecture technique

### Stack

| Couche | Technologie |
|---|---|
| Frontend | React + Vite + Tailwind CSS + Zustand |
| Backend | Node.js + Fastify |
| Base de données | PostgreSQL |
| Infra | Docker Compose |

### Comment fonctionne le rendu du personnage

Le personnage est composé de **PNG empilés** dans cet ordre (de derrière vers devant) :

```
Ailes → Cheveux (arrière) → Corps → Bas → Haut → Chaussures → Yeux → Lèvres → Cheveux (avant)
```

Chaque couche est un fichier PNG avec fond transparent, positionné exactement sur le même canvas **600 × 1791 px**.

### Système de couleurs

L'utilisatrice choisit une couleur avec le **color picker**. Le site calcule automatiquement quelle variante pré-dessinée est la plus proche (distance RGB) et affiche le bon PNG. Plus il y a de variantes dessinées, plus le résultat est précis.

```
Couleur choisie (#FF5566)
        ↓
findClosestColor() — distance RGB entre toutes les variantes
        ↓
PNG le plus proche affiché (ex: hair_01_rouge.png)
```

### Sauvegarde

Les créations sont sauvegardées en base de données (PostgreSQL) avec :
- Les choix du personnage (variantes + couleurs)
- Les réglages du studio (fond, scène)
- Une miniature PNG générée automatiquement

---

## 🎨 Guide pour la dessinatrice (Procreate)

### Règle fondamentale

> **Tous les PNG doivent faire exactement 600 × 1791 px.**
> Les zones vides doivent être transparentes, pas blanches ou coupées.

Si les tailles sont différentes d'un calque à l'autre, les couches ne s'aligneront pas.

---

### Comment exporter depuis Procreate

Toutes les parties du personnage doivent être sur **un seul canvas** (600 × 1791 px), chacune sur son propre calque.

**Exporter calque par calque :**
1. Clé à molette → **Partager**
2. → **Fichiers de calques** → **PNG**

Procreate exporte chaque calque à la taille complète du canvas avec le fond transparent. ✅

> ❌ Ne pas copier-coller une partie sur un canvas séparé — la taille serait différente.  
> ❌ Ne pas rogner / recadrer avant d'exporter.

---

### Convention de nommage

```
{varianteId}_{couleurId}.png
```

Les cheveux ont un suffixe supplémentaire `_back` ou `_front` :

```
{varianteId}_{couleurId}_back.png    ← partie derrière la tête
{varianteId}_{couleurId}_front.png   ← mèches devant le visage
```

---

### Dossiers et exemples de noms

| Partie | Dossier | Exemples de fichiers |
|---|---|---|
| Corps | `assets/body/` | `body_01_peche.png` `body_01_caramel.png` `body_01_ebene.png` |
| Cheveux | `assets/hair/` | `hair_01_chatain_back.png` `hair_01_chatain_front.png` `hair_01_blond_back.png` |
| Yeux | `assets/eyes/` | `eyes_01_bleu.png` `eyes_01_vert.png` `eyes_02_marron.png` |
| Lèvres | `assets/lips/` | `lips_01_rose.png` `lips_01_rouge.png` `lips_02_nude.png` |
| Haut | `assets/top/` | `top_01_violet.png` `top_01_rose.png` `top_02_bleu.png` |
| Bas | `assets/bottom/` | `bottom_01_violet.png` `bottom_01_noir.png` `bottom_02_rose.png` |
| Chaussures | `assets/shoes/` | `shoes_01_violet.png` `shoes_01_noir.png` `shoes_02_rose.png` |
| Ailes | `assets/wings/` | `wings_01_rose.png` `wings_01_violet.png` `wings_02_bleu.png` |

---

### IDs de variantes disponibles

Ce sont les formes / silhouettes. À chaque `id` correspond plusieurs coloris.

| Partie | IDs |
|---|---|
| Corps | `body_01` `body_02` |
| Cheveux | `hair_01` `hair_02` `hair_03` |
| Yeux | `eyes_01` `eyes_02` `eyes_03` |
| Lèvres | `lips_01` `lips_02` |
| Haut | `top_01` `top_02` `top_03` |
| Bas | `bottom_01` `bottom_02` `bottom_03` |
| Chaussures | `shoes_01` `shoes_02` `shoes_03` |
| Ailes | `wings_01` `wings_02` |

---

### IDs de couleurs disponibles

Ce sont les suffixes à utiliser dans les noms de fichiers.

**Peau (`assets/body/`) :**
| ID | Couleur |
|---|---|
| `claire` | Peau très claire |
| `peche` | Peau pêche |
| `doree` | Peau dorée |
| `caramel` | Peau caramel |
| `miel` | Peau miel |
| `chocolat` | Peau chocolat |
| `ebene` | Peau ébène |

**Cheveux (`assets/hair/`) :**
| ID | Couleur |
|---|---|
| `noir` | Noir |
| `brun` | Brun |
| `chatain` | Châtain |
| `roux` | Roux |
| `blond` | Blond |
| `blanc` | Blanc / argenté |
| `rose` | Rose |
| `violet` | Violet |
| `bleu` | Bleu |
| `vert` | Vert |
| `rouge` | Rouge |
| `orange` | Orange |

**Yeux (`assets/eyes/`) :**
| ID | Couleur |
|---|---|
| `bleu` | Bleu |
| `bleu_clair` | Bleu clair / cyan |
| `vert` | Vert |
| `marron` | Marron |
| `noisette` | Noisette |
| `gris` | Gris |
| `violet` | Violet |
| `orange` | Orange / ambre |
| `noir` | Noir |

**Lèvres (`assets/lips/`) :**
| ID | Couleur |
|---|---|
| `nude` | Nude / naturel |
| `peche` | Pêche |
| `rose` | Rose |
| `framboise` | Framboise |
| `rouge` | Rouge |
| `corail` | Corail |
| `violet` | Violet |

**Haut, Bas, Chaussures (`assets/top/` `assets/bottom/` `assets/shoes/`) :**
| ID | Couleur |
|---|---|
| `violet` | Violet |
| `rose` | Rose |
| `bleu` | Bleu |
| `vert` | Vert |
| `rouge` | Rouge |
| `orange` | Orange |
| `jaune` | Jaune |
| `blanc` | Blanc |
| `noir` | Noir |
| `turquoise` | Turquoise |
| `dore` | Doré |
| `argent` | Argent |

**Ailes (`assets/wings/`) :**
| ID | Couleur |
|---|---|
| `rose` | Rose |
| `violet` | Violet |
| `bleu` | Bleu |
| `vert` | Vert |
| `jaune` | Jaune |
| `rouge` | Rouge |
| `blanc` | Blanc |
| `dore` | Doré |

---

### Étapes résumées

```
1. Canvas Procreate : 600 × 1791 px, fond transparent
2. Dessiner la partie en couleur normale
3. Partager → Fichiers de calques → PNG
4. Renommer le fichier : body_01_peche.png
5. Déposer dans frontend/public/assets/body/
6. Le personnage affiche automatiquement le bon PNG ✅
```

Les parties non encore dessinées sont simplement **invisibles** — aucune erreur.

---

## ➕ Ajouter une nouvelle variante ou couleur

### Nouvelle forme (ex: une 4ème coiffure)

1. Dessine-la et exporte les PNG (`hair_04_chatain_back.png`, etc.)
2. Dépose les fichiers dans `frontend/public/assets/hair/`
3. Ajoute une ligne dans `frontend/src/data/variants.js` :

```js
export const HAIRS = [
  { id: 'hair_01', label: 'Longs lisses' },
  { id: 'hair_02', label: 'Courts bouclés' },
  { id: 'hair_03', label: 'Queue de cheval' },
  { id: 'hair_04', label: 'Tresses' },   // ← ajouter ici
]
```

### Nouvelle couleur (ex: une teinte de peau supplémentaire)

1. Dessine le PNG et nomme-le `body_01_rose.png`
2. Dépose-le dans `frontend/public/assets/body/`
3. Ajoute une ligne dans `frontend/src/data/variants.js` :

```js
export const SKIN_COLORS = [
  // ...couleurs existantes...
  { id: 'rose', color: '#FFB6C1', label: 'Rose' },  // ← ajouter ici
]
```

Le color picker et le menu se mettent à jour automatiquement.

---

## 📁 Structure du projet

```
winx_gen/
├── docker-compose.yml          ← orchestration des 3 services
├── docker-compose.dev.yml      ← surcharge hot reload pour le dev local
├── db/
│   └── init.sql                ← schéma SQL (référence — créé auto par le backend)
├── backend/
│   ├── Dockerfile
│   └── src/
│       ├── index.js            ← serveur Fastify
│       ├── db.js               ← connexion PostgreSQL + création du schéma
│       └── routes/winx.js      ← API REST (GET/POST/PUT/DELETE /api/winx)
└── frontend/
    ├── Dockerfile
    └── src/
        ├── api/winxApi.js      ← appels API
        ├── store/              ← état global Zustand
        ├── data/variants.js    ← 📌 IDs et couleurs des variantes
        ├── utils/assetResolver.js  ← résolution couleur → PNG le plus proche
        ├── components/
        │   ├── editor/         ← éditeur (menu, color picker, aperçu)
        │   ├── studio/         ← mode studio (fonds, export PNG)
        │   └── gallery/        ← galerie des créations sauvegardées
        └── pages/
            ├── CreatePage.jsx  ← /create — éditeur principal
            ├── StudioPage.jsx  ← /studio — mode photo
            └── GalleryPage.jsx ← /gallery — mes Winx

frontend/public/assets/         ← 📌 déposer les PNG ici
    ├── body/
    ├── hair/
    ├── eyes/
    ├── lips/
    ├── top/
    ├── bottom/
    ├── shoes/
    └── wings/
```

---

## 🛑 Arrêter / nettoyer

```bash
# Arrêter les containers
docker compose down

# Arrêter et supprimer la base de données
docker compose down -v
```
