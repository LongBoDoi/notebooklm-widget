'use client'

import { useMemo, useState } from 'react'
import { BlurhashCanvas } from 'react-blurhash'
import clsx from 'clsx'
import { useInView } from 'react-intersection-observer'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { cn } from '../lib/utils'
import { AspectRatio } from '@mantine/core'
import useMeasure from 'react-use-measure'

const CDN_URL = import.meta.env.VITE_CDN_URL
const AVAILABLE_SIZES = [300, 500, 1000, 1500, 2500]

function sanitizeBlurhash(blurhash: string): string {
  return blurhash.replace(/[^a-zA-Z0-9]/g, '_')
}

function parseBlurhashWithSize(blurhashWithSize: string): {
  hash: string
  width: number
} {
  const lastUnderscore = blurhashWithSize.lastIndexOf('_')
  const hash = blurhashWithSize.substring(0, lastUnderscore)
  const width = parseInt(blurhashWithSize.substring(lastUnderscore + 1), 10)
  return { hash, width }
}

function getMaxAvailableSize(originSize: number): number | null {
  const filtered = AVAILABLE_SIZES.filter((size) => size <= originSize)
  return filtered.length > 0 ? Math.max(...filtered) : null
}

export type BlurhashImageProps = {
  blurhash: string
  ratio?: number
  objectFit?: 'cover' | 'contain' | 'fill'
  className?: string
  style?: React.CSSProperties
  alt?: string
  priority?: boolean
  fadeIn?: boolean
  allowMaxSize?: boolean
  zoomable?: boolean
  imageClass?: string
}

export function BlurhashImage({
  blurhash,
  ratio = 16 / 9,
  objectFit = 'cover',
  className = '',
  alt = '',
  priority = false,
  fadeIn = true,
  allowMaxSize = false,
  zoomable = false,
  imageClass,
  style
}: BlurhashImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [measureRef, bounds] = useMeasure()
  const { ref: inViewRef, inView: isIntersecting } = useInView({
    rootMargin: '100px',
    threshold: 0.1,
    triggerOnce: true,
  })

  const realWidth = Math.round(bounds.width)
  const { hash: blurHashOnly, width: originSize } = useMemo(
    () => parseBlurhashWithSize(blurhash),
    [blurhash],
  )

  const sanitized = useMemo(() => sanitizeBlurhash(blurhash), [blurhash])

  const displaySizes = useMemo(() => {
    const upperBound = realWidth || originSize
    const baseSizes = AVAILABLE_SIZES.filter((size) => size <= originSize && size <= upperBound)

    const maxSize = getMaxAvailableSize(originSize)

    if ((allowMaxSize || zoomable) && !baseSizes.includes(maxSize as number)) {
      return [...baseSizes, maxSize as number]
    }

    return baseSizes
  }, [originSize, realWidth, allowMaxSize, zoomable])

  const srcSetWebp = displaySizes
    .map((size) => `${CDN_URL}/images/${sanitized}/w${size}.webp ${size}w`)
    .join(', ')

  const srcSetJpg = displaySizes
    .map((size) => `${CDN_URL}/images/${sanitized}/w${size}.jpg ${size}w`)
    .join(', ')

  const sizesAttr = realWidth ? `${realWidth}px` : '100vw'

  const fallbackSrc = `${CDN_URL}/images/${sanitized}/origin.jpg`
  const isValidBlurhash = blurHashOnly.length >= 6

  // Combine refs
  const setRefs = (el: HTMLDivElement | null) => {
    inViewRef(el)
    measureRef(el)
  }

  function renderPicture() {
    return (
      <picture className="absolute top-0 left-0 w-full h-full">
        <source type="image/webp" srcSet={srcSetWebp} sizes={sizesAttr} />
        <source type="image/jpeg" srcSet={srcSetJpg} sizes={sizesAttr} />
        <img
          src={fallbackSrc}
          alt={alt}
          style={{
            objectFit,
            width: '100%',
            height: '100%',
            opacity: isLoaded ? 1 : 0,
            transition: fadeIn ? 'opacity 0.7s ease-in' : undefined,
          }}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setIsLoaded(true)}
          className={cn(`w-full h-full object-cover`, imageClass)}
        />
      </picture>
    )
  }

  return (
    <>
      <div ref={setRefs} className={clsx('relative', className)} style={style}>
        <AspectRatio ratio={ratio}>
          {!isLoaded && isValidBlurhash && (
            <BlurhashCanvas
              hash={blurHashOnly}
              width={4}
              height={4}
              punch={1}
              className="absolute top-0 left-0 w-full h-full object-cover z-0"
            />
          )}

          {!isLoaded && !isValidBlurhash && (
            <div className="absolute top-0 left-0 w-full h-full bg-gray-200" />
          )}

          {isIntersecting &&
            realWidth > 0 &&
            (zoomable ? (
              <Zoom zoomImg={{ src: fallbackSrc }}>{renderPicture()}</Zoom>
            ) : (
              renderPicture()
            ))}
        </AspectRatio>
      </div>
    </>
  )
}
