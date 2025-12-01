import React from 'react';
import { Helmet } from 'react-helmet-async';

const SeoHead = ({ title, description, canonicalUrl, image, keywords }) => {
    const siteName = "Mitake Ramen";
    const defaultImage = "/assets/hero-ramen.png";
    const fullImage = image || defaultImage;
    const currentUrl = canonicalUrl || window.location.href;

    // Default comprehensive keywords for SEO
    const defaultKeywords = "ramen, restaurant japonais, cuisine japonaise, aix-en-provence, marseille, bouches-du-rhône, gyoza, ramen authentique, restaurant japonais aix, ramen marseille, nouilles japonaises, tonkotsu, shoyu, miso ramen, livraison ramen, à emporter";
    const metaKeywords = keywords || defaultKeywords;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{title ? `${title} | ${siteName}` : siteName}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={metaKeywords} />
            <meta name="author" content="Mitake Ramen" />
            <link rel="canonical" href={currentUrl} />

            {/* Geographic Tags */}
            <meta name="geo.region" content="FR-13" />
            <meta name="geo.placename" content="Aix-en-Provence" />
            <meta name="geo.position" content="43.5297;5.4474" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={title || siteName} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content="fr_FR" />

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
