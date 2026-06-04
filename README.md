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

## 🎨 Ajouter de vrais dessins SVG

### Principe général

Le personnage est composé de **6 couches SVG empilées**, chacune dans un fichier dédié. Toutes partagent le même repère : `viewBox="0 0 400 700"`.

Ordre de rendu (de derrière vers devant) :

```
WingsLayer  →  HairLayer(back)  →  BodyLayer  →  OutfitLayer  →  EyesLayer  →  LipsLayer  →  HairLayer(front)
```

### Variables de couleur disponibles

Les couleurs sélectionnées par l'utilisateur sont injectées automatiquement via des **variables CSS** sur le SVG parent. Utilise-les dans les `fill` de tes éléments :

| Variable CSS | Correspond à |
|---|---|
| `var(--skin-color)` | Couleur de peau |
| `var(--hair-color)` | Couleur des cheveux |
| `var(--eye-color)` | Couleur des yeux (iris) |
| `var(--lip-color)` | Couleur des lèvres |
| `var(--outfit-color)` | Couleur principale du vêtement |
| `var(--outfit-color2)` | Couleur accent/détails du vêtement |
| `var(--wings-color)` | Couleur des ailes |

### Étapes pour ajouter une variante

**1. Ouvre le fichier de la couche concernée** dans `frontend/src/components/svg/` :

| Fichier | Couche |
|---|---|
| `BodyLayer.jsx` | Corps / silhouette (peau) |
| `HairLayer.jsx` | Cheveux (arrière + avant) |
| `EyesLayer.jsx` | Yeux |
| `LipsLayer.jsx` | Lèvres |
| `OutfitLayer.jsx` | Vêtements |
| `WingsLayer.jsx` | Ailes |

**2. Ajoute un bloc `if` avec ton SVG**, en remplaçant les couleurs fixes par des variables CSS :

```jsx
// Exemple dans HairLayer.jsx
export default function HairLayer({ variant, part }) {

  if (variant === 'hair_01') {
    if (part === 'back') return (
      <g>
        <path d="M ..." fill="var(--hair-color)" />
        {/* colle ici le SVG de la partie arrière */}
      </g>
    )
    if (part === 'front') return (
      <g>
        <path d="M ..." fill="var(--hair-color)" />
        {/* colle ici le SVG de la partie avant (mèches) */}
      </g>
    )
  }

  return null
}
```

**3. Enregistre la variante** dans `frontend/src/data/variants.js` :

```js
export const HAIRS = [
  { id: 'hair_01', label: 'Longs lisses' },  // ← ajoute ta ligne ici
]
```

C'est tout ! La variante apparaît automatiquement dans le menu, avec le color picker fonctionnel.

### Conseils pour préparer les SVG

- Dessine chaque partie dans un repère **400 × 700 px**
- Supprime les `fill` codés en dur dans ton SVG et remplace-les par `fill="var(--couleur)"` (voir tableau ci-dessus)
- Pour les zones avec dégradé de peau ou d'ombre, utilise `opacity` plutôt qu'une couleur fixe
- Teste directement dans le navigateur en modifiant le fichier — Vite recharge instantanément

---

## 🛑 Arrêter

```bash
docker compose down
```

Pour tout supprimer (base de données incluse) :

```bash
docker compose down -v
```
