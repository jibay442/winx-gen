import { forwardRef } from 'react'
import { findClosestColor, assetPath } from '../../utils/assetResolver.js'
import {
  SKIN_COLORS, HAIR_COLORS, EYE_COLORS,
  LIP_COLORS, OUTFIT_COLORS, WINGS_COLORS,
} from '../../data/variants.js'

/**
 * Affiche le personnage en empilant les PNG.
 * Chaque couleur choisie est résolue vers le PNG pré-dessiné le plus proche.
 * Les images manquantes (pas encore dessinées) sont simplement ignorées.
 */
const CharacterPreview = forwardRef(function CharacterPreview({ character, className = '' }, ref) {
  const {
    body, skinColor,
    eyes, eyeColor,
    hair, hairColor,
    lips, lipColor,
    outfit, outfitColor,
    wings, wingsColor,
  } = character

  const skinId   = findClosestColor(skinColor,  SKIN_COLORS).id
  const hairId   = findClosestColor(hairColor,  HAIR_COLORS).id
  const eyeId    = findClosestColor(eyeColor,   EYE_COLORS).id
  const lipId    = findClosestColor(lipColor,   LIP_COLORS).id
  const outfitId = findClosestColor(outfitColor, OUTFIT_COLORS).id
  const wingsId  = findClosestColor(wingsColor,  WINGS_COLORS).id

  const hide = (e) => { e.target.style.display = 'none' }
  const cls  = 'absolute inset-0 w-full h-full object-contain'

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Ordre : ailes → cheveux arrière → corps → vêtements → yeux → lèvres → cheveux avant */}
      {wings !== 'wings_none' && (
        <img className={cls} src={assetPath('wings', wings, wingsId)} alt="" onError={hide} />
      )}
      <img className={cls} src={assetPath('hair',   hair,   hairId,  'back')} alt="" onError={hide} />
      <img className={cls} src={assetPath('body',   body,   skinId)}           alt="" onError={hide} />
      <img className={cls} src={assetPath('outfit', outfit, outfitId)}         alt="" onError={hide} />
      <img className={cls} src={assetPath('eyes',   eyes,   eyeId)}            alt="" onError={hide} />
      <img className={cls} src={assetPath('lips',   lips,   lipId)}            alt="" onError={hide} />
      <img className={cls} src={assetPath('hair',   hair,   hairId,  'front')} alt="" onError={hide} />
    </div>
  )
})

export default CharacterPreview
