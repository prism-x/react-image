'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

const isBrowser = typeof window !== 'undefined';
const isomorphicLayoutEffect = isBrowser ? React.useLayoutEffect : React.useEffect;
const imageCache = Object.create({});
function getImageCache(id) {
    return (!!imageCache[id] && imageCache[id][window.location.href]) || null;
}
function setImageCache(id, sizes) {
    imageCache[id] = {
        ...(imageCache[id] || {}),
        ...{ [window.location.href]: sizes },
    };
}
function getSizes(el, src) {
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
const hasNativeLazyLoadSupport = typeof HTMLImageElement !== 'undefined' && 'loading' in HTMLImageElement.prototype;
const hasIOSupport = isBrowser && window.IntersectionObserver;
function getIO(node, cb) {
    const observer = new window.IntersectionObserver(([entry]) => {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
            observer.unobserve(node);
            cb();
        }
    }, { rootMargin: '200px' });
    observer.observe(node);
    return observer;
}
const generateSources = (object) => Object.entries(object)
    .map(([size, url]) => `${url} ${size}w`)
    .join(', ');

/* eslint max-lines: "off" */
// eslint-disable-next-line complexity
function Image(props) {
    /*****************************************************************************
     * Refs
     *****************************************************************************/
    const imgRef = React.useRef(null);
    const node = React.useRef(null);
    /*****************************************************************************
     * Variables
     *****************************************************************************/
    const imgHeight = props.aspectRatio ? `${100 / props.aspectRatio}%` : props.height;
    const isCritical = props.loading === 'eager' || props.critical;
    const seenBefore = !!getImageCache(props.src);
    /*****************************************************************************
     * State
     *****************************************************************************/
    const [state, changeState] = React.useState({
        sizes: seenBefore ? getImageCache(props.src) : (props.sizes || 100),
        isVisible: seenBefore || isCritical || hasNativeLazyLoadSupport || !hasIOSupport,
        shouldFadeIn: !seenBefore || props.fadeIn,
        imgLoaded: seenBefore || false,
    });
    /*****************************************************************************
     * Functions
     *****************************************************************************/
    const setState = (value) => changeState(state => ({ ...state, ...value }));
    function handleImageLoaded() {
        if (!seenBefore) {
            setImageCache(props.src, Number(state.sizes));
            setState({ imgLoaded: true });
        }
    }
    /*****************************************************************************
     * Effects
     *****************************************************************************/
    isomorphicLayoutEffect(() => {
        if (!seenBefore) {
            setState({ sizes: props.sizes || getSizes(node.current, props.src) });
        }
        const observer = !state.isVisible && getIO(node.current, () => setState({ isVisible: true }));
        if (isCritical) {
            const img = imgRef.current;
            if (img && img.complete) {
                handleImageLoaded();
            }
        }
        return () => {
            if (observer) {
                observer.unobserve(node.current);
            }
        };
    }, []);
    /*****************************************************************************
     * Styles
     *****************************************************************************/
    const shouldReveal = !state.shouldFadeIn || state.imgLoaded;
    const defaultImageStyles = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: props.fit,
        objectPosition: props.position,
    };
    const imageStyle = {
        opacity: shouldReveal ? 1 : 0,
        transition: state.shouldFadeIn ? `opacity ${props.durationFadeIn}ms` : 'none',
        ...props.imgStyle,
    };
    const delayHideStyle = {
        transition: props.transparent && state.shouldFadeIn ? `opacity ${props.durationFadeIn}ms` : undefined,
        transitionDelay: props.transparent ? '0' : `${props.durationFadeIn}ms`,
    };
    const imagePlaceholderStyle = {
        opacity: state.imgLoaded ? 0 : 1,
        ...(state.shouldFadeIn && delayHideStyle),
        ...props.imgStyle,
        ...props.placeholderStyle,
    };
    /*****************************************************************************
     * Render
     *****************************************************************************/
    return (React__default.createElement("div", { style: { position: 'relative', overflow: 'hidden' }, className: props.className },
        React__default.createElement("div", { style: { width: '100%', paddingBottom: imgHeight, ...props.sizerStyle }, ref: node, className: props.sizerClass }),
        props.bgColor && (React__default.createElement("div", { className: props.placeholderClass, style: {
                backgroundColor: props.bgColor,
                ...defaultImageStyles,
                ...imagePlaceholderStyle,
            } })),
        !props.bgColor && props.placeholder && (React__default.createElement("img", { src: props.placeholder, alt: props.alt, className: props.placeholderClass, style: {
                ...defaultImageStyles,
                ...imagePlaceholderStyle,
            } })),
        state.isVisible && (React__default.createElement("picture", null,
            props.webpSrcSet && (React__default.createElement("source", { type: "image/webp", srcSet: generateSources(props.webpSrcSet), sizes: state.sizes ? `${state.sizes}vw` : undefined })),
            props.srcSet && (React__default.createElement("source", { srcSet: generateSources(props.srcSet), sizes: state.sizes ? `${state.sizes}vw` : undefined })),
            React__default.createElement("img", { ref: imgRef, src: props.src, className: props.imgClass, alt: props.alt, sizes: `${state.sizes}vw`, 
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                loading: isCritical ? 'eager' : props.loading, onLoad: handleImageLoaded, style: {
                    ...defaultImageStyles,
                    ...imageStyle,
                } })))));
}
Image.defaultProps = {
    loading: 'lazy',
    fadeIn: true,
    fit: 'cover',
    position: 'center',
    height: '100%',
    durationFadeIn: 500,
    alt: '',
};

exports.Image = Image;
//# sourceMappingURL=index.js.map
