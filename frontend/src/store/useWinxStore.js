import { create } from 'zustand'
import { DEFAULT_CHARACTER, DEFAULT_STUDIO, DEFAULT_PARTS, CANVAS_WIDTH, CANVAS_HEIGHT } from '../data/variants.js'

const useWinxStore = create((set, get) => ({
  // ── Personnage ────────────────────────────────────────────────────────────
  character: { ...DEFAULT_CHARACTER },
  setCharacterProp: (key, value) =>
    set(s => ({ character: { ...s.character, [key]: value } })),
  resetCharacter: () => set({ character: { ...DEFAULT_CHARACTER } }),

  // ── Studio ────────────────────────────────────────────────────────────────
  studio: { ...DEFAULT_STUDIO },
  setStudioProp: (key, value) =>
    set(s => ({ studio: { ...s.studio, [key]: value } })),

  // ── Création en cours ─────────────────────────────────────────────────────
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

  // ── UI : menu actif ───────────────────────────────────────────────────────
  activeMenu: 'body',
  setActiveMenu: (menu) => set({ activeMenu: menu }),

  // ── UI : color picker flottant ────────────────────────────────────────────
  colorPicker: { visible: false, target: null, x: 0, y: 0 },
  openColorPicker: (target, x, y) =>
    set({ colorPicker: { visible: true, target, x, y } }),
  closeColorPicker: () =>
    set(s => ({ colorPicker: { ...s.colorPicker, visible: false } })),

  // ── UI : modal sauvegarde ─────────────────────────────────────────────────
  saveModalOpen: false,
  setSaveModalOpen: (v) => set({ saveModalOpen: v }),

  // ── Config serveur ────────────────────────────────────────────────────────
  canvasWidth:  CANVAS_WIDTH,
  canvasHeight: CANVAS_HEIGHT,
  parts:        { ...DEFAULT_PARTS },

  applyConfig: (config) => {
    const update = {
      canvasWidth:  config.canvas?.width  || CANVAS_WIDTH,
      canvasHeight: config.canvas?.height || CANVAS_HEIGHT,
    }
    if (config.parts) {
      // Fusionne : les tableaux non-vides du serveur remplacent les défauts,
      // les tableaux vides (variants supprimées) laissent les défauts intacts.
      const merged = { ...DEFAULT_PARTS }
      Object.entries(config.parts).forEach(([key, arr]) => {
        if (Array.isArray(arr) && arr.length > 0) merged[key] = arr
      })
      update.parts = merged
    }
    set(update)
  },

  // Retourne les variantes d'une partie (depuis le serveur ou les défauts)
  getVariants: (part) => get().parts[part] || DEFAULT_PARTS[part] || [],

  // Met à jour les variantes d'une partie et sauvegarde dans config
  setPartVariants: (part, variants) =>
    set(s => ({ parts: { ...s.parts, [part]: variants } })),
}))

export default useWinxStore
