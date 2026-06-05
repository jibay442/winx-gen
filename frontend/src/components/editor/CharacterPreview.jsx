import { forwardRef } from 'react'
import TintedImage from '../svg/TintedImage.jsx'
import { assetPath } from '../../utils/assetResolver.js'
import useWinxStore from '../../store/useWinxStore.js'

/**
 * Affiche le personnage en empilant les PNG niveaux de gris teintés.
 * Chaque couche est colorée par SVG feColorMatrix avec la couleur choisie.
 * Les images manquantes sont ignorées silencieusement.
 */
const CharacterPreview = forwardRef(function CharacterPreview({ character, className = '' }, ref) {
  const canvasWidth  = useWinxStore(s => s.canvasWidth)
  const canvasHeight = useWinxStore(s => s.canvasHeight)
  const {
    body,   skinColor,
    eyes,   eyeColor,
    hair,   hairColor,
    lips,   lipColor,
    top,    topColor,
    bottom, bottomColor,
    shoes,  shoesColor,
    wings,  wingsColor,
  } = character

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: `${canvasWidth} / ${canvasHeight}`,
        width: 'auto',
      }}
    >
      {/* Ordre : ailes → cheveux arrière → corps → bas → haut → chaussures → yeux → lèvres → cheveux avant */}
      {wings !== 'wings_none' && (
        <TintedImage src={assetPath('wings',  wings,  '')}      color={wingsColor}  />
      )}
      <TintedImage src={assetPath('hair',   hair,   'back')}    color={hairColor}   />
      <TintedImage src={assetPath('body',   body)}              color={skinColor}   />
      <TintedImage src={assetPath('bottom', bottom)}            color={bottomColor} />
      <TintedImage src={assetPath('top',    top)}               color={topColor}    />
      <TintedImage src={assetPath('shoes',  shoes)}             color={shoesColor}  />
      <TintedImage src={assetPath('eyes',   eyes)}              color={eyeColor}    />
      <TintedImage src={assetPath('lips',   lips)}              color={lipColor}    />
      <TintedImage src={assetPath('hair',   hair,   'front')}   color={hairColor}   />
    </div>
  )
})

export default CharacterPreview
