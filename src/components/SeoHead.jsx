import React from 'react';
import { Helmet } from 'react-helmet-async';

const SeoHead = ({ title, description, canonicalUrl, image }) => {
    const defaultTitle = "Mitake Ramen | Le Vrai Ramen à Aix-en-Provence (Sur Place & Livraison)";
    const defaultDescription = "Dégustez les meilleurs Ramen d'Aix-en-Provence chez Mitake. Bouillon maison Tonkotsu & Miso, nouilles fraîches et Gyoza. Livraison rapide ou à emporter.";
    const siteName = "Mitake Ramen";
    const defaultImage = "/assets/hero-ramen.png";
    const fullImage = image || defaultImage;

    // Ensure canonical URL has consistent trailing slash to avoid duplicate content
    const normalizeUrl = (url) => {
        if (!url) return window.location.href;
        return url.endsWith('/') ? url : `${url}/`;
    };
    const currentUrl = normalizeUrl(canonicalUrl);

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{title || defaultTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="author" content="Mitake Ramen" />
            <link rel="canonical" href={currentUrl} />

            {/* Geographic Tags */}
            <meta name="geo.region" content="FR-13" />
            <meta name="geo.placename" content="Aix-en-Provence" />
            <meta name="geo.position" content="43.5263;5.4454" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={title || defaultTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content="fr_FR" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={title || defaultTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={fullImage} />
        </Helmet>
    );
};

export default SeoHead;
