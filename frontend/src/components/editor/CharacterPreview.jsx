import { forwardRef } from 'react'
import { assetPath } from '../../utils/assetResolver.js'
import useWinxStore from '../../store/useWinxStore.js'

function hexToMatrix(hex = '#ffffff') {
  const h = (hex || '#ffffff').replace('#', '').padEnd(6, '0')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  return `${r} 0 0 0 0  0 ${g} 0 0 0  0 0 ${b} 0 0  0 0 0 1 0`
}

const CharacterPreview = forwardRef(function CharacterPreview({ character, className = '' }, ref) {
  const canvasWidth  = useWinxStore(s => s.canvasWidth)
  const canvasHeight = useWinxStore(s => s.canvasHeight)

  const {
    body,      skinColor,
    eyes,      eyeColor,
    hairBack,  hairBackColor,
    hairFront, hairFrontColor,
    lips,      lipColor,
    top,       topColor,
    bottom,    bottomColor,
    shoes,     shoesColor,
    wings,     wingsColor,
  } = character

  const layers = [
    wings !== 'wings_none' && { src: assetPath('wings',  wings),             color: wingsColor      },
    { src: assetPath('hair',   hairBack,  'back'),  color: hairBackColor  },
    { src: assetPath('body',   body),               color: skinColor      },
    { src: assetPath('bottom', bottom),             color: bottomColor    },
    { src: assetPath('top',    top),                color: topColor       },
    { src: assetPath('shoes',  shoes),              color: shoesColor     },
    { src: assetPath('eyes',   eyes),               color: eyeColor       },
    { src: assetPath('lips',   lips),               color: lipColor       },
    { src: assetPath('hair',   hairFront, 'front'), color: hairFrontColor },
  ].filter(Boolean)

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{ aspectRatio: `${canvasWidth} / ${canvasHeight}`, width: 'auto' }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
        width="100%"
        height="100%"
        style={{ display: 'block' }}
      >
        <defs>
          {layers.map((layer, i) => (
            <filter key={i} id={`f${i}`} colorInterpolationFilters="sRGB"
              x="0" y="0" width="100%" height="100%">
              <feColorMatrix type="matrix" values={hexToMatrix(layer.color)} />
            </filter>
          ))}
        </defs>
        {layers.map((layer, i) => (
          <image key={i} href={layer.src}
            x="0" y="0" width={canvasWidth} height={canvasHeight}
            preserveAspectRatio="none" filter={`url(#f${i})`} />
        ))}
      </svg>
    </div>
  )
})

export default CharacterPreview
