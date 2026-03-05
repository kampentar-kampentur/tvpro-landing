import React from 'react';
import styles from './ImageWrapper.module.css';

const ImageWrapper = ({ media, className, defaultAlt, width, height, sizes, priority }) => {
    if (!media) return null;

    const url = media.url || media.attributes?.url || '';
    const alt = media.alternativeText || media.attributes?.alternativeText || defaultAlt || '';

    return (
        <div className={`${styles.imageWrapper || ''} ${className || ''}`}>
            <img
                src={url}
                alt={alt}
                width={width}
                height={height}
                sizes={sizes}
                loading={priority ? 'eager' : 'lazy'}
                style={{ width: '100%', height: 'auto', display: 'block' }}
            />
        </div>
    );
};

export default ImageWrapper;
