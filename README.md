# 🧚 Winx Gen

> 🚧 **WIP — Work In Progress** 🚧

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

---

## 🎨 Ajouter les dessins (Procreate / Photoshop)

### Comment ça marche

Le personnage est composé de **PNG empilés** dans cet ordre (de derrière vers devant) :

```
Ailes → Cheveux (arrière) → Corps → Vêtements → Yeux → Lèvres → Cheveux (avant)
```

L'utilisatrice choisit une couleur avec le color picker → le site trouve automatiquement **le PNG le plus proche** parmi les variantes dessinées.

---

### Convention de nommage des fichiers

Tous les PNG vont dans `frontend/public/assets/` et suivent cette convention :

```
{varianteId}_{couleurId}.png
```

Les cheveux ont en plus un suffixe `_back` ou `_front` :
```
{varianteId}_{couleurId}_back.png
{varianteId}_{couleurId}_front.png
```

**Exemples complets :**

| Partie | Fichier | Dossier |
|---|---|---|
| Corps peau pêche | `body_01_peche.png` | `assets/body/` |
| Corps peau ébène | `body_01_ebene.png` | `assets/body/` |
| Cheveux longs châtain (arrière) | `hair_01_chatain_back.png` | `assets/hair/` |
| Cheveux longs châtain (avant) | `hair_01_chatain_front.png` | `assets/hair/` |
| Yeux grands bleus | `eyes_01_bleu.png` | `assets/eyes/` |
| Lèvres rose | `lips_01_rose.png` | `assets/lips/` |
| Robe fée violette | `outfit_01_violet.png` | `assets/outfit/` |
| Ailes papillon roses | `wings_01_rose.png` | `assets/wings/` |

---

### IDs disponibles

**Variantes (formes) :**

| Partie | IDs disponibles |
|---|---|
| Corps | `body_01`, `body_02` |
| Yeux | `eyes_01`, `eyes_02`, `eyes_03` |
| Cheveux | `hair_01`, `hair_02`, `hair_03` |
| Lèvres | `lips_01`, `lips_02` |
| Vêtements | `outfit_01`, `outfit_02`, `outfit_03` |
| Ailes | `wings_01`, `wings_02` |

**Couleurs (suffixes) :**

| Peau | Cheveux | Yeux | Lèvres | Vêtements | Ailes |
|---|---|---|---|---|---|
| `claire` | `noir` | `bleu` | `nude` | `violet` | `rose` |
| `peche` | `brun` | `bleu_clair` | `peche` | `rose` | `violet` |
| `doree` | `chatain` | `vert` | `rose` | `bleu` | `bleu` |
| `caramel` | `roux` | `marron` | `framboise` | `vert` | `vert` |
| `miel` | `blond` | `noisette` | `rouge` | `rouge` | `jaune` |
| `chocolat` | `blanc` | `gris` | `corail` | `orange` | `rouge` |
| `ebene` | `rose` | `violet` | `violet` | `jaune` | `blanc` |
| | `violet` | `orange` | | `blanc` | `dore` |
| | `bleu` | `noir` | | `noir` | |
| | `vert` | | | `turquoise` | |
| | `rouge` | | | `dore` | |
| | `orange` | | | `argent` | |

---

### Étapes pour dessiner et ajouter un PNG

1. **Canvas Procreate : 400 × 700 px** (fond transparent)
2. Dessine la partie en couleur normale — pas besoin de niveaux de gris
3. **Exporte en PNG** avec fond transparent
4. **Nomme le fichier** selon la convention ci-dessus
5. **Dépose-le** dans le bon dossier `frontend/public/assets/{partie}/`
6. Si la variante ou la couleur n'existe pas encore dans `variants.js`, ajoute-la dans `frontend/src/data/variants.js`

Les parties non encore dessinées sont simplement **invisibles** — pas d'erreur.

---

## 🛑 Arrêter

```bash
docker compose down
```

Pour tout supprimer (base de données incluse) :

```bash
docker compose down -v
```
