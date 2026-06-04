import { forwardRef } from 'react'
import { findClosestColor, assetPath } from '../../utils/assetResolver.js'
import {
  CANVAS_WIDTH, CANVAS_HEIGHT,
  SKIN_COLORS, HAIR_COLORS, EYE_COLORS,
  LIP_COLORS, OUTFIT_COLORS, WINGS_COLORS,
} from '../../data/variants.js'

const CharacterPreview = forwardRef(function CharacterPreview({ character, className = '' }, ref) {
  const {
    body, skinColor,
    eyes, eyeColor,
    hair, hairColor,
    lips, lipColor,
    outfit, outfitColor,
    wings, wingsColor,
  } = character

  const skinId   = findClosestColor(skinColor,   SKIN_COLORS).id
  const hairId   = findClosestColor(hairColor,   HAIR_COLORS).id
  const eyeId    = findClosestColor(eyeColor,    EYE_COLORS).id
  const lipId    = findClosestColor(lipColor,    LIP_COLORS).id
  const outfitId = findClosestColor(outfitColor, OUTFIT_COLORS).id
  const wingsId  = findClosestColor(wingsColor,  WINGS_COLORS).id

  const hide = (e) => { e.target.style.display = 'none' }

  // Style commun : l'image remplit exactement le container (même ratio que le canvas)
  const imgStyle = {
    position: 'absolute', top: 0, left: 0,
    width: '100%', height: '100%',
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
    >
      {/* Ordre : ailes → cheveux arrière → corps → vêtements → yeux → lèvres → cheveux avant */}
      {wings !== 'wings_none' && (
        <img style={imgStyle} src={assetPath('wings', wings, wingsId)}          alt="" onError={hide} />
      )}
      <img style={imgStyle} src={assetPath('hair',   hair,   hairId,  'back')}  alt="" onError={hide} />
      <img style={imgStyle} src={assetPath('body',   body,   skinId)}            alt="" onError={hide} />
      <img style={imgStyle} src={assetPath('outfit', outfit, outfitId)}          alt="" onError={hide} />
      <img style={imgStyle} src={assetPath('eyes',   eyes,   eyeId)}             alt="" onError={hide} />
      <img style={imgStyle} src={assetPath('lips',   lips,   lipId)}             alt="" onError={hide} />
      <img style={imgStyle} src={assetPath('hair',   hair,   hairId,  'front')}  alt="" onError={hide} />
    </div>
  )
})

export default CharacterPreview
