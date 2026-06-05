import { forwardRef } from 'react'
import { assetPath } from '../../utils/assetResolver.js'
import useWinxStore from '../../store/useWinxStore.js'

// GIF 1×1 transparent : remplace les PNG manquants pour éviter
// que le navigateur affiche un rectangle "image cassée" que le filtre SVG colorie.
const TRANSPARENT_GIF =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

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
    wings !== 'wings_none' && { id: 'wings',     src: assetPath('wings',  wings),             color: wingsColor      },
    { id: 'hair-back',  src: assetPath('hair',   hairBack,  'back'),  color: hairBackColor  },
    { id: 'body',       src: assetPath('body',   body),               color: skinColor      },
    { id: 'bottom',     src: assetPath('bottom', bottom),             color: bottomColor    },
    { id: 'top',        src: assetPath('top',    top),                color: topColor       },
    { id: 'shoes',      src: assetPath('shoes',  shoes),              color: shoesColor     },
    { id: 'eyes',       src: assetPath('eyes',   eyes),               color: eyeColor       },
    { id: 'lips',       src: assetPath('lips',   lips),               color: lipColor       },
    { id: 'hair-front', src: assetPath('hair',   hairFront, 'front'), color: hairFrontColor },
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
          {layers.map((layer) => (
            <filter
              key={layer.id}
              id={`f-${layer.id}`}
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
              x="0" y="0"
              width={canvasWidth}
              height={canvasHeight}
            >
              <feColorMatrix type="matrix" values={hexToMatrix(layer.color)} result="tinted" />
              {/* feComposite clip : zones transparentes du PNG restent transparentes */}
              <feComposite in="tinted" in2="SourceGraphic" operator="in" />
            </filter>
          ))}
        </defs>

        {layers.map((layer) => (
          <image
            key={layer.id}
            href={layer.src}
            x="0" y="0"
            width={canvasWidth}
            height={canvasHeight}
            preserveAspectRatio="none"
            filter={`url(#f-${layer.id})`}
            onError={(e) => {
              // PNG manquant → GIF transparent → le filtre ne colorie rien
              e.currentTarget.setAttribute('href', TRANSPARENT_GIF)
            }}
          />
        ))}
      </svg>
    </div>
  )
})

export default CharacterPreview
