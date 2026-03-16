export const MENU_DATA = [
    {
        id: "ramen",
        title: "NOS RAMENS AUTHENTIQUES",
        description: "Nouilles de blé dans un bouillon Tonkotsu traditionnel de l'île de Kyushu.",
        items: [
            {
                id: "ramen-tonkotsu-classic",
                name: "Ramen tonkotsu classic",
                posName: "Ramen Classic",
                price: 14.00,
                description: "Bouillon porc mijoté, 3 tranches de Chashu, germes de soja, cébettes.",
                image: "https://www.sushi-aixsud.com/853-large_default/ramen-tonkotsu-classic.jpg",
                tags: ["popular"],
                availableOptions: [
                    { name: "Supplément Oeuf Mollet", price: 1.5 },
                    { name: "Supplément Chashu (2 tranches)", price: 3.0 },
                    { name: "Sans Cébettes", price: 0 },
                    { name: "Bouillon Pimenté", price: 0.5 },
                    { name: "Taille Omori (Grand)", price: 4.0 }
                ]
            },
            {
                id: "ramen-tonkotsu-chashu",
                name: "Ramen tonkotsu cha-shu",
                posName: "Ramen Cha-Shu",
                price: 15.50,
                description: "La version gourmande : 5 tranches de Chashu, œuf mollet mariné, bouillon riche.",
                image: "https://www.sushi-aixsud.com/852-large_default/ramen-tonkotsu-cha-shu.jpg",
                tags: ["chef_choice", "meat_lover"],
                availableOptions: [
                    { name: "Supplément Oeuf Mollet", price: 1.5 },
                    { name: "Sans Cébettes", price: 0 },
                    { name: "Bouillon Pimenté", price: 0.5 },
                    { name: "Taille Omori (Grand)", price: 4.0 }
                ]
            },
            {
                id: "maze-men",
                name: "Mazé men (ramen sans bouillon)",
                posName: "Mazé Men",
                price: 15.00,
                description: "Ramen sèches, émincés de poulet mijotés, œuf mollet, oignons frits.",
                image: "https://www.sushi-aixsud.com/854-large_default/maze-men-ramen-sans-bouillon.jpg",
                tags: ["original", "spicy"],
                availableOptions: [
                    { name: "Supplément Poulet", price: 2.5 },
                    { name: "Sans Oignons Frits", price: 0 },
                    { name: "Taille Omori (Grand)", price: 4.0 }
                ]
            }
        ]
    },
    {
        id: "tapas",
        title: "TAPAS & GYOZAS",
        description: "L'esprit Izakaya : petites assiettes à partager.",
        items: [
            {
                id: "gyoza-poulet",
                name: "Gyoza poulet - legumes",
                posName: "Gyoza Poulet",
                price: 6.37,
                description: "6 Raviolis grillés maison. Farce juteuse et pâte croustillante.",
                image: "https://www.sushi-aixsud.com/226-large_default/gyoza-poulet-legumes.jpg",
                qty_label: "6 pièces",
                tags: ["popular"],
                availableOptions: [
                    { name: "Sauce Piquante", price: 0.5 }
                ]
            },
            {
                id: "ebi-fried",
                name: "EBI FRIED",
                posName: "Ebi Fried",
                price: 10.40,
                description: "5 Grosses crevettes panées Panko, sauce tartare japonaise.",
                image: "https://www.sushi-aixsud.com/112-large_default/ebi-fried.jpg",
                tags: ["seafood"]
            },
            {
                id: "karaage",
                name: "KARA AGE",
                posName: "Kara Age",
                price: 10.36,
                description: "7 morceaux de poulet mariné au gingembre et soja, frit croustillant.",
                image: "https://www.sushi-aixsud.com/127-large_default/karaage.jpg",
                tags: ["popular"]
            },
            {
                id: "takoyaki",
                name: "TAKOYAKI Classique",
                posName: "Takoyaki",
                price: 7.98,
                description: "6 Boulettes de poulpe fondantes, sauce brune et mayonnaise.",
                image: "https://www.sushi-aixsud.com/103-large_default/takoyaki.jpg",
                tags: ["original"]
            }
        ]
    },
    {
        id: "plats-chauds",
        title: "PLATS CHAUDS & DONBURI",
        items: [
            {
                id: "katsu-curry",
                name: "Curry Torikatsu",
                price: 15.39,
                description: "Filet de poulet pané croustillant sur riz Bio, nappé de curry japonais doux.",
                image: "https://www.sushi-aixsud.com/549-large_default/curry-torikatsu.jpg",
                tags: ["spicy"],
                availableOptions: [
                    { name: "Extra Riz", price: 2.0 },
                    { name: "Extra Sauce Curry", price: 1.5 }
                ]
            },
            {
                id: "saumon-teriyaki",
                name: "SAUMON TERIYAKI",
                price: 17.96,
                description: "Pavé de saumon Label Rouge laqué sauce soja sucrée, légumes et riz Bio.",
                image: "https://www.sushi-aixsud.com/124-large_default/saumon-teriyaki.jpg",
                tags: ["healthy", "seafood"]
            },
            {
                id: "una-chirashi",
                name: "CHIRASHI ANGUILLE",
                price: 20.43,
                description: "Bol de riz Bio recouvert de tranches d'anguille grillée caramélisée (Unagi).",
                image: "https://www.sushi-aixsud.com/259-large_default/una-chirashi.jpg",
                tags: ["premium", "seafood"]
            }
        ]
    }
];
