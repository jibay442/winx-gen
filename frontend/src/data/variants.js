/**
 * Registre des variantes disponibles pour chaque partie du personnage.
 *
 * Pour ajouter une nouvelle variante :
 *   1. Ajoute un SVG dans le composant correspondant (ex: BodyLayer.jsx)
 *      en ajoutant un nouveau `case` dans le switch de la variante.
 *   2. Ajoute l'entrée ici avec un `id` unique, un `label` et un `preview`.
 *   3. C'est tout !
 *
 * Le `preview` est une description courte utilisée dans les miniatures du menu.
 */

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

export const OUTFITS = [
  { id: 'outfit_01', label: 'Robe fée' },
  { id: 'outfit_02', label: 'Tenue étoile' },
  { id: 'outfit_03', label: 'Robe papillon' },
]

export const WINGS = [
  { id: 'wings_01', label: 'Ailes papillon' },
  { id: 'wings_02', label: 'Ailes fée' },
  { id: 'wings_none', label: 'Sans ailes' },
]

export const SKIN_COLORS = [
  '#FDDBB4', '#F5C5A3', '#E8A882', '#C68642',
  '#8D5524', '#4A2912', '#FFDBAC', '#F1C27D',
]

export const HAIR_COLORS = [
  '#1A0A00', '#3B1F0A', '#6B3A2A', '#A0522D',
  '#C97B3A', '#F4C542', '#FFEE99', '#E8E8E8',
  '#CC0000', '#FF6B8A', '#9B59B6', '#3498DB',
  '#00B4D8', '#2ECC71', '#FF6B35', '#FF69B4',
]

export const EYE_COLORS = [
  '#4A90D9', '#2ECC71', '#E67E22', '#8E44AD',
  '#1ABC9C', '#E74C3C', '#2C3E50', '#95A5A6',
  '#F39C12', '#16A085', '#8B4513', '#708090',
]

export const OUTFIT_COLORS = [
  '#9B59B6', '#E91E8C', '#3498DB', '#2ECC71',
  '#E74C3C', '#F39C12', '#1ABC9C', '#ECF0F1',
  '#FF6B8A', '#845EC2', '#00C9A7', '#FFC75F',
]

export const LIP_COLORS = [
  '#E91E8C', '#C0392B', '#E74C3C', '#FF69B4',
  '#FF6B8A', '#922B21', '#F1948A', '#FAD7A0',
]

export const WINGS_COLORS = [
  '#FF9FF3', '#FF69B4', '#9B59B6', '#3498DB',
  '#2ECC71', '#F39C12', '#E74C3C', '#ECF0F1',
]

export const DEFAULT_CHARACTER = {
  body:           'body_01',
  skinColor:      '#F5C5A3',
  eyes:           'eyes_01',
  eyeColor:       '#4A90D9',
  hair:           'hair_01',
  hairColor:      '#C97B3A',
  lips:           'lips_01',
  lipColor:       '#E91E8C',
  outfit:         'outfit_01',
  outfitColor:    '#9B59B6',
  outfitColor2:   '#C39BD3',
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
  { id: null,          label: 'Couleur / dégradé' },
  { id: 'scene_sky',   label: 'Ciel magique' },
  { id: 'scene_forest',label: 'Forêt enchantée' },
  { id: 'scene_sea',   label: 'Mer des fées' },
  { id: 'scene_stars', label: 'Nuit étoilée' },
]
