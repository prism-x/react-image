export declare function getImageCache(id: string): null | number;
export declare function setImageCache(id: string, sizes: number): void;
export declare function getSizes(el: any, src: any): number;
export declare const hasNativeLazyLoadSupport: boolean;
export declare const hasIOSupport: {
    new (callback: IntersectionObserverCallback, options?: IntersectionObserverInit | undefined): IntersectionObserver;
    prototype: IntersectionObserver;
};
export declare function getIO(node: any, cb: any): IntersectionObserver;
export declare const generateSources: (object: {
    [x: number]: string;
}) => string;
