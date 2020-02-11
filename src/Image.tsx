/* eslint max-lines: "off" */
import React, { CSSProperties, ReactElement, useEffect, useRef, useState } from 'react'

import {
  getSizes,
  getIO,
  generateSources,
  hasNativeLazyLoadSupport,
  hasIOSupport,
  setImageCache,
  getImageCache,
} from './support'

type Props = {
  src: string
  srcSet?: { [x: number]: string }
  webpSrcSet?: { [x: number]: string }
  sizes?: number | 'auto'
  placeholder?: string
  loading?: 'lazy' | 'auto' | 'eager'
  aspectRatio?: number
  height?: string | number
  critical?: boolean
  fadeIn?: boolean
  durationFadeIn?: number
  className?: string
  imgStyle?: object
  imgClass?: string
  placeholderStyle?: object
  placeholderClass?: string
  sizerStyle?: object
  sizerClass?: string
  bgColor?: string
  alt?: string
  fit?: 'cover' | 'contain'
  position?: string
  transparent?: boolean
}

// eslint-disable-next-line complexity
export function Image(props: Props): ReactElement {
  /*****************************************************************************
   * Refs
   *****************************************************************************/
  const imgRef = useRef(null)
  const node: any = useRef(null)

  /*****************************************************************************
   * Variables
   *****************************************************************************/
  const imgHeight = props.aspectRatio ? `${100 / props.aspectRatio}%` : props.height
  const isCritical = props.loading === 'eager' || props.critical
  const seenBefore = !!getImageCache(props.src)

  /*****************************************************************************
   * State
   *****************************************************************************/
  const [state, changeState] = useState({
    sizes: seenBefore ? getImageCache(props.src) : props.sizes,
    isVisible: seenBefore || isCritical || hasNativeLazyLoadSupport || !hasIOSupport,
    shouldFadeIn: !seenBefore || props.fadeIn,
    imgLoaded: seenBefore || false,
  })

  /*****************************************************************************
   * Functions
   *****************************************************************************/
  const setState = (value: any): void => changeState(state => ({ ...state, ...value }))

  function handleImageLoaded(): void {
    if (!seenBefore) {
      setImageCache(props.src, Number(state.sizes))
      setState({ imgLoaded: true })
    }
  }

  /*****************************************************************************
   * Effects
   *****************************************************************************/
  useEffect(() => {
    if (!seenBefore) {
      setState({ sizes: props.sizes || getSizes(node.current, props.src) })
    }
    const observer = !state.isVisible && getIO(node.current, () => setState({ isVisible: true }))

    if (isCritical) {
      const img: any = imgRef.current
      if (img && img.complete) {
        handleImageLoaded()
      }
    }

    return () => {
      if (observer) {
        observer.unobserve(node.current)
      }
    }
  }, [])

  /*****************************************************************************
   * Styles
   *****************************************************************************/
  const shouldReveal = !state.shouldFadeIn || state.imgLoaded

  const defaultImageStyles: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: props.fit,
    objectPosition: props.position,
  }

  const imageStyle: CSSProperties = {
    opacity: shouldReveal ? 1 : 0,
    transition: state.shouldFadeIn ? `opacity ${props.durationFadeIn}ms` : 'none',
    ...props.imgStyle,
  }
  const delayHideStyle: CSSProperties = {
    transition: props.transparent && state.shouldFadeIn ? `opacity ${props.durationFadeIn}ms` : undefined,
    transitionDelay: props.transparent ? '0' : `${props.durationFadeIn}ms`,
  }
  const imagePlaceholderStyle: CSSProperties = {
    opacity: state.imgLoaded ? 0 : 1,
    ...(state.shouldFadeIn && delayHideStyle),
    ...props.imgStyle,
    ...props.placeholderStyle,
  }

  /*****************************************************************************
   * Render
   *****************************************************************************/
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }} className={props.className}>
      <div style={{ width: '100%', paddingBottom: imgHeight, ...props.sizerStyle }} ref={node} className={props.sizerClass} />

      {props.bgColor && (
        <div
          className={props.placeholderClass}
          style={{
            backgroundColor: props.bgColor,
            ...defaultImageStyles,
            ...imagePlaceholderStyle,
          }}
        />
      )}

      {!props.bgColor && props.placeholder && (
        <img
          src={props.placeholder}
          alt={props.alt}
          className={props.placeholderClass}
          style={{
            ...defaultImageStyles,
            ...imagePlaceholderStyle,
          }}
        />
      )}

      {state.isVisible && (
        <picture>
          {props.webpSrcSet && (
            <source
              type="image/webp"
              srcSet={generateSources(props.webpSrcSet)}
              sizes={state.sizes ? `${state.sizes}vw` : undefined}
            />
          )}
          {props.srcSet && (
            <source
              srcSet={generateSources(props.srcSet)}
              sizes={state.sizes ? `${state.sizes}vw` : undefined}
            />
          )}

          <img
            ref={imgRef}
            src={props.src}
            className={props.imgClass}
            alt={props.alt}
            sizes={`${state.sizes}vw`}
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            loading={isCritical ? 'eager' : props.loading}
            onLoad={handleImageLoaded}
            style={{
              ...defaultImageStyles,
              ...imageStyle,
            }}
          />
        </picture>
      )}
    </div>
  )
}

Image.defaultProps = {
  loading: 'lazy',
  fadeIn: true,
  fit: 'cover',
  position: 'center',
  height: '100%',
  durationFadeIn: 500,
  alt: '',
}
