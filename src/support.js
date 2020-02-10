const imageCache = Object.create({});
export function getImageCache(id) {
    return (!!imageCache[id] && imageCache[id][window.location.href]) || null;
}
export function setImageCache(id, sizes) {
    imageCache[id] = {
        ...(imageCache[id] || {}),
        ...{ [window.location.href]: sizes },
    };
}
export function getSizes(el, src) {
    if (getImageCache(src)) {
        return getImageCache(src) || 100;
    }
    const min = 32;
    let currentNode = el;
    if (currentNode.getBoundingClientRect().width < min) {
        currentNode = currentNode.parentNode;
        while (currentNode.tagName !== 'BODY' && currentNode.getBoundingClientRect().width <= min) {
            currentNode = currentNode.parentNode;
        }
    }
    return Math.ceil((currentNode.getBoundingClientRect().width / window.innerWidth) * 100);
}
export const hasNativeLazyLoadSupport = typeof HTMLImageElement !== 'undefined' && 'loading' in HTMLImageElement.prototype;
export const hasIOSupport = window.IntersectionObserver;
export function getIO(node, cb) {
    const observer = new window.IntersectionObserver(([entry]) => {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
            observer.unobserve(node);
            cb();
        }
    }, { rootMargin: '200px' });
    observer.observe(node);
    return observer;
}
export const generateSources = (object) => Object.entries(object)
    .map(([size, url]) => `${url} ${size}w`)
    .join(', ');
//# sourceMappingURL=support.js.map