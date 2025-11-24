import React from 'react';
import { Helmet } from 'react-helmet-async';

const SeoHead = ({ title, description, canonicalUrl, image }) => {
    const siteName = "Mitake Ramen";
    const defaultImage = "/assets/hero-ramen.png";
    const fullImage = image || defaultImage;
    const currentUrl = canonicalUrl || window.location.href;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{title ? `${title} | ${siteName}` : siteName}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={title || siteName} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={title || siteName} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImage} />
        </Helmet>
    );
};

export default SeoHead;
