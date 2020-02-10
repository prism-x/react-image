import { ReactElement } from 'react';
declare type Props = {
    src: string;
    srcSet?: {
        [x: number]: string;
    };
    webpSrcSet?: {
        [x: number]: string;
    };
    sizes?: number | 'auto';
    placeholder?: string;
    loading?: 'lazy' | 'auto' | 'eager';
    aspectRatio?: number;
    height?: string | number;
    critical?: boolean;
    fadeIn?: boolean;
    durationFadeIn?: number;
    className?: string;
    imgStyle?: object;
    imgClass?: string;
    placeholderStyle?: object;
    placeholderClass?: string;
    bgColor?: string;
    alt?: string;
    fit?: 'cover' | 'contain';
    position?: string;
    transparent?: boolean;
};
export declare function Image(props: Props): ReactElement;
export declare namespace Image {
    var defaultProps: {
        loading: string;
        fadeIn: boolean;
        fit: string;
        position: string;
        height: string;
        durationFadeIn: number;
        alt: string;
    };
}
export {};
