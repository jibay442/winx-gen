import { create } from 'zustand'
import { DEFAULT_CHARACTER, DEFAULT_STUDIO, CANVAS_WIDTH, CANVAS_HEIGHT } from '../data/variants.js'

const useWinxStore = create((set, get) => ({
  // ── Personnage ──────────────────────────────────────────────────────────
  character: { ...DEFAULT_CHARACTER },
  setCharacterProp: (key, value) =>
    set(s => ({ character: { ...s.character, [key]: value } })),
  resetCharacter: () => set({ character: { ...DEFAULT_CHARACTER } }),

  // ── Studio ──────────────────────────────────────────────────────────────
  studio: { ...DEFAULT_STUDIO },
  setStudioProp: (key, value) =>
    set(s => ({ studio: { ...s.studio, [key]: value } })),

  // ── Création en cours d'édition (null = nouvelle) ───────────────────────
  currentId: null,
  currentName: 'Ma Winx',
  setCurrentId: (id) => set({ currentId: id }),
  setCurrentName: (name) => set({ currentName: name }),

  loadCreation: (creation) => set({
    currentId:   creation.id,
    currentName: creation.name,
    character:   { ...DEFAULT_CHARACTER, ...creation.character_data },
    studio:      { ...DEFAULT_STUDIO,    ...creation.studio_data },
  }),

  newCreation: () => set({
    currentId:   null,
    currentName: 'Ma Winx',
    character:   { ...DEFAULT_CHARACTER },
    studio:      { ...DEFAULT_STUDIO },
  }),

  // ── UI : menu actif ──────────────────────────────────────────────────────
  activeMenu: 'body',
  setActiveMenu: (menu) => set({ activeMenu: menu }),

  // ── UI : color picker flottant ───────────────────────────────────────────
  colorPicker: { visible: false, target: null, x: 0, y: 0 },
  openColorPicker: (target, x, y) =>
    set({ colorPicker: { visible: true, target, x, y } }),
  closeColorPicker: () =>
    set(s => ({ colorPicker: { ...s.colorPicker, visible: false } })),

  // ── UI : modal sauvegarde ────────────────────────────────────────────────
  saveModalOpen: false,
  setSaveModalOpen: (v) => set({ saveModalOpen: v }),

  // ── Config serveur (canvas + labels) ─────────────────────────────────────
  canvasWidth:   CANVAS_WIDTH,
  canvasHeight:  CANVAS_HEIGHT,
  variantLabels: {},

  applyConfig: (config) => set({
    canvasWidth:   config.canvas?.width  || CANVAS_WIDTH,
    canvasHeight:  config.canvas?.height || CANVAS_HEIGHT,
    variantLabels: config.variantLabels  || {},
  }),

  getLabel: (id, defaultLabel) => get().variantLabels[id] || defaultLabel,
}))

export default useWinxStore
