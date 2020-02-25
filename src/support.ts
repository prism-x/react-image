import { useEffect, useLayoutEffect } from 'react'

export const isBrowser = typeof window !== 'undefined'

export const isomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect

const imageCache = Object.create({})

export function getImageCache(id: string): null | number {
  return (!!imageCache[id] && imageCache[id][window.location.href]) || null
}

export function setImageCache(id: string, sizes: number): void {
  imageCache[id] = {
    ...(imageCache[id] || {}),
    ...{ [window.location.href]: sizes },
  }
}

export function getSizes(el: any, src): number {
  if (getImageCache(src)) {
    return getImageCache(src) || 100
  }

  const min = 32
  let currentNode = el
  if (currentNode.getBoundingClientRect().width < min) {
    currentNode = currentNode.parentNode

    while (currentNode.tagName !== 'BODY' && currentNode.getBoundingClientRect().width <= min) {
      currentNode = currentNode.parentNode
    }
  }

  return Math.ceil((currentNode.getBoundingClientRect().width / window.innerWidth) * 100)
}

export const hasNativeLazyLoadSupport =
  typeof HTMLImageElement !== 'undefined' && 'loading' in HTMLImageElement.prototype

export const hasIOSupport = isBrowser && window.IntersectionObserver

export function getIO(node, cb): IntersectionObserver {
  const observer = new window.IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        observer.unobserve(node)
        cb()
      }
    },
    { rootMargin: '200px' },
  )
  observer.observe(node)
  return observer
}

export const generateSources = (object: { [x: number]: string }): string =>
  Object.entries(object)
    .map(([size, url]) => `${url} ${size}w`)
    .join(', ')
