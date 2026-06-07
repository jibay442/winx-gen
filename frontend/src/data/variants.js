/**
 * Dimensions du canvas de dessin de ta copine.
 * TOUS les PNG doivent faire exactement cette taille pour que les couches s'alignent.
 */
export const CANVAS_WIDTH  = 600
export const CANVAS_HEIGHT = 1791

/**
 * Registre des variantes et couleurs disponibles.
 *
 * Chaque couleur a un `id` qui correspond au nom du fichier PNG dessiné.
 * Convention fichier : {varianteId}_{couleurId}.png
 * Exemple : body_01_peche.png / hair_01_chatain_back.png
 *
 * Pour ajouter une variante ou une couleur :
 *   1. Ajoute l'entrée dans le bon tableau ci-dessous
 *   2. Dépose le PNG dans frontend/public/assets/{partie}/
 *   3. C'est tout !
 */

// ── Variantes par défaut (utilisées si le serveur n'a pas encore de config) ──

export const DEFAULT_PARTS = {
  body:   [{ id: 'body_01', label: 'Silhouette 1' }, { id: 'body_02', label: 'Silhouette 2' }],
  hair:   [{ id: 'hair_01', label: 'Longs lisses' }, { id: 'hair_02', label: 'Courts bouclés' }, { id: 'hair_03', label: 'Queue de cheval' }],
  eyes:   [{ id: 'eyes_01', label: 'Grands yeux' }, { id: 'eyes_02', label: 'Yeux en amande' }, { id: 'eyes_03', label: 'Yeux ronds' }],
  lips:   [{ id: 'lips_01', label: 'Lèvres douces' }, { id: 'lips_02', label: 'Lèvres pleines' }],
  top:    [{ id: 'top_01', label: 'Haut 1' }, { id: 'top_02', label: 'Haut 2' }, { id: 'top_03', label: 'Haut 3' }],
  bottom: [{ id: 'bottom_01', label: 'Bas 1' }, { id: 'bottom_02', label: 'Bas 2' }, { id: 'bottom_03', label: 'Bas 3' }],
  shoes:  [{ id: 'shoes_01', label: 'Chaussures 1' }, { id: 'shoes_02', label: 'Chaussures 2' }, { id: 'shoes_03', label: 'Chaussures 3' }],
  wings:  [{ id: 'wings_01', label: 'Ailes papillon' }, { id: 'wings_02', label: 'Ailes fée' }, { id: 'wings_none', label: 'Sans ailes' }],
}

// ── Formes / silhouettes (compat) ─────────────────────────────────────────

export const BODIES = [
  { id: 'body_01', label: 'Silhouette 1' },
  { id: 'body_02', label: 'Silhouette 2' },
]

export const EYES = [
  { id: 'eyes_01', label: 'Grands yeux' },
  { id: 'eyes_02', label: 'Yeux en amande' },
  { id: 'eyes_03', label: 'Yeux ronds' },
]

export const HAIRS = [
  { id: 'hair_01', label: 'Longs lisses' },
  { id: 'hair_02', label: 'Courts bouclés' },
  { id: 'hair_03', label: 'Queue de cheval' },
]

export const LIPS = [
  { id: 'lips_01', label: 'Lèvres douces' },
  { id: 'lips_02', label: 'Lèvres pleines' },
]

export const TOPS = [
  { id: 'top_01', label: 'Haut 1' },
  { id: 'top_02', label: 'Haut 2' },
  { id: 'top_03', label: 'Haut 3' },
]

export const BOTTOMS = [
  { id: 'bottom_01', label: 'Bas 1' },
  { id: 'bottom_02', label: 'Bas 2' },
  { id: 'bottom_03', label: 'Bas 3' },
]

export const SHOES = [
  { id: 'shoes_01', label: 'Chaussures 1' },
  { id: 'shoes_02', label: 'Chaussures 2' },
  { id: 'shoes_03', label: 'Chaussures 3' },
]

export const WINGS = [
  { id: 'wings_01',   label: 'Ailes papillon' },
  { id: 'wings_02',   label: 'Ailes fée' },
  { id: 'wings_none', label: 'Sans ailes' },
]

// ── Couleurs pré-dessinées ─────────────────────────────────────────────────
// `id`    → suffixe du nom de fichier PNG  (ex: body_01_peche.png)
// `color` → couleur représentative pour le color picker
// `label` → affiché en tooltip

export const SKIN_COLORS = [
  { id: 'claire',   color: '#FDDBB4', label: 'Claire' },
  { id: 'peche',    color: '#F5C5A3', label: 'Pêche' },
  { id: 'doree',    color: '#E8A882', label: 'Dorée' },
  { id: 'caramel',  color: '#C68642', label: 'Caramel' },
  { id: 'miel',     color: '#A0693A', label: 'Miel' },
  { id: 'chocolat', color: '#8D5524', label: 'Chocolat' },
  { id: 'ebene',    color: '#4A2912', label: 'Ébène' },
]

export const HAIR_COLORS = [
  { id: 'noir',    color: '#1A0A00', label: 'Noir' },
  { id: 'brun',    color: '#3B1F0A', label: 'Brun' },
  { id: 'chatain', color: '#8B4513', label: 'Châtain' },
  { id: 'roux',    color: '#C97B3A', label: 'Roux' },
  { id: 'blond',   color: '#F4C542', label: 'Blond' },
  { id: 'blanc',   color: '#F5F5F0', label: 'Blanc' },
  { id: 'rose',    color: '#FF69B4', label: 'Rose' },
  { id: 'violet',  color: '#9B59B6', label: 'Violet' },
  { id: 'bleu',    color: '#3498DB', label: 'Bleu' },
  { id: 'vert',    color: '#2ECC71', label: 'Vert' },
  { id: 'rouge',   color: '#E74C3C', label: 'Rouge' },
  { id: 'orange',  color: '#FF6B35', label: 'Orange' },
]

export const EYE_COLORS = [
  { id: 'bleu',     color: '#4A90D9', label: 'Bleu' },
  { id: 'bleu_clair', color: '#00B4D8', label: 'Bleu clair' },
  { id: 'vert',     color: '#2ECC71', label: 'Vert' },
  { id: 'marron',   color: '#8B4513', label: 'Marron' },
  { id: 'noisette', color: '#A0785A', label: 'Noisette' },
  { id: 'gris',     color: '#95A5A6', label: 'Gris' },
  { id: 'violet',   color: '#8E44AD', label: 'Violet' },
  { id: 'orange',   color: '#E67E22', label: 'Orange' },
  { id: 'noir',     color: '#1A1A2E', label: 'Noir' },
]

export const EYE_WHITE_COLORS = [
  { id: 'blanc',    color: '#FFFFFF', label: 'Blanc' },
  { id: 'ivoire',   color: '#F5F0E6', label: 'Ivoire' },
  { id: 'rose',     color: '#FCE4EC', label: 'Rose pâle' },
  { id: 'bleu',     color: '#E3F2FD', label: 'Bleu pâle' },
  { id: 'lavande',  color: '#EDE7F6', label: 'Lavande' },
  { id: 'dore',     color: '#FFF3D6', label: 'Doré pâle' },
]

export const LIP_COLORS = [
  { id: 'nude',       color: '#FAD7A0', label: 'Nude' },
  { id: 'peche',      color: '#F1948A', label: 'Pêche' },
  { id: 'rose',       color: '#FF69B4', label: 'Rose' },
  { id: 'framboise',  color: '#E91E8C', label: 'Framboise' },
  { id: 'rouge',      color: '#C0392B', label: 'Rouge' },
  { id: 'corail',     color: '#FF6B35', label: 'Corail' },
  { id: 'violet',     color: '#8E44AD', label: 'Violet' },
]

export const OUTFIT_COLORS = [
  { id: 'violet',    color: '#9B59B6', label: 'Violet' },
  { id: 'rose',      color: '#E91E8C', label: 'Rose' },
  { id: 'bleu',      color: '#3498DB', label: 'Bleu' },
  { id: 'vert',      color: '#2ECC71', label: 'Vert' },
  { id: 'rouge',     color: '#E74C3C', label: 'Rouge' },
  { id: 'orange',    color: '#F39C12', label: 'Orange' },
  { id: 'jaune',     color: '#FFC75F', label: 'Jaune' },
  { id: 'blanc',     color: '#ECF0F1', label: 'Blanc' },
  { id: 'noir',      color: '#2C3E50', label: 'Noir' },
  { id: 'turquoise', color: '#00C9A7', label: 'Turquoise' },
  { id: 'dore',      color: '#DAA520', label: 'Doré' },
  { id: 'argent',    color: '#C0C0C0', label: 'Argent' },
]

export const WINGS_COLORS = [
  { id: 'rose',   color: '#FF9FF3', label: 'Rose' },
  { id: 'violet', color: '#9B59B6', label: 'Violet' },
  { id: 'bleu',   color: '#3498DB', label: 'Bleu' },
  { id: 'vert',   color: '#2ECC71', label: 'Vert' },
  { id: 'jaune',  color: '#F39C12', label: 'Jaune' },
  { id: 'rouge',  color: '#E74C3C', label: 'Rouge' },
  { id: 'blanc',  color: '#ECF0F1', label: 'Blanc' },
  { id: 'dore',   color: '#DAA520', label: 'Doré' },
]

// ── Valeurs par défaut ─────────────────────────────────────────────────────

export const DEFAULT_CHARACTER = {
  body:           'body_01',
  skinColor:      '#F5C5A3',
  eyes:           'eyes_01',
  eyeColor:       '#4A90D9',
  eyeWhiteColor:  '#FFFFFF',
  hairBack:       'hair_01',
  hairBackColor:  '#8B4513',
  hairFront:      'hair_01',
  hairFrontColor: '#8B4513',
  lips:           'lips_01',
  lipColor:       '#E91E8C',
  top:            'top_01',
  topColor:       '#9B59B6',
  bottom:         'bottom_01',
  bottomColor:    '#9B59B6',
  shoes:          'shoes_01',
  shoesColor:     '#9B59B6',
  wings:          'wings_01',
  wingsColor:     '#FF9FF3',
}

export const DEFAULT_STUDIO = {
  bgType:   'gradient',
  bgColor:  '#A8EDEA',
  bgColor2: '#FED6E3',
  bgScene:  null,
}

export const BG_SCENES = [
  { id: null,           label: 'Couleur / dégradé' },
  { id: 'scene_sky',    label: 'Ciel magique' },
  { id: 'scene_forest', label: 'Forêt enchantée' },
  { id: 'scene_sea',    label: 'Mer des fées' },
  { id: 'scene_stars',  label: 'Nuit étoilée' },
]
