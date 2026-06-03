import { forwardRef } from 'react'
import WingsLayer  from '../svg/WingsLayer.jsx'
import BodyLayer   from '../svg/BodyLayer.jsx'
import OutfitLayer from '../svg/OutfitLayer.jsx'
import HairLayer   from '../svg/HairLayer.jsx'
import EyesLayer   from '../svg/EyesLayer.jsx'
import LipsLayer   from '../svg/LipsLayer.jsx'

const CharacterPreview = forwardRef(function CharacterPreview({ character, className = '' }, ref) {
  const {
    body, skinColor,
    eyes, eyeColor,
    hair, hairColor,
    lips, lipColor,
    outfit, outfitColor, outfitColor2,
    wings, wingsColor,
  } = character

  const cssVars = {
    '--skin-color':    skinColor,
    '--hair-color':    hairColor,
    '--eye-color':     eyeColor,
    '--lip-color':     lipColor,
    '--outfit-color':  outfitColor,
    '--outfit-color2': outfitColor2,
    '--wings-color':   wingsColor,
  }

  return (
    <div ref={ref} className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 400 700"
        xmlns="http://www.w3.org/2000/svg"
        style={cssVars}
        className="w-full h-full max-w-xs drop-shadow-2xl"
      >
        {/* Ordre de rendu : ailes → cheveux arrière → corps → vêtements → yeux → lèvres → cheveux avant */}
        <WingsLayer  variant={wings} />
        <HairLayer   variant={hair}   part="back" />
        <BodyLayer   variant={body} />
        <OutfitLayer variant={outfit} />
        <EyesLayer   variant={eyes} />
        <LipsLayer   variant={lips} />
        <HairLayer   variant={hair}   part="front" />
      </svg>
    </div>
  )
})

export default CharacterPreview
