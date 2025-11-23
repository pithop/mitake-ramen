export const MENU_DATA = [
    {
        id: "ramen",
        title: "NOS RAMENS AUTHENTIQUES",
        description: "Nouilles de blé dans un bouillon Tonkotsu traditionnel de l'île de Kyushu.",
        items: [
            {
                id: "tonkotsu-classic",
                name: "Ramen Tonkotsu Classic",
                price: 14.70,
                description: "Bouillon porc mijoté, 3 tranches de Chashu, germes de soja, cébettes.",
                image: "/assets/ramen-classic.jpg",
                tags: ["Populaire"]
            },
            {
                id: "tonkotsu-chashu",
                name: "Ramen Tonkotsu Chashu",
                price: 16.30,
                description: "La version gourmande : 5 tranches de Chashu, œuf mollet mariné, bouillon riche.",
                tags: ["Chef's Choice"]
            },
            {
                id: "maze-men",
                name: "Mazé Men (Sans Bouillon)",
                price: 15.80,
                description: "Ramen sèches, émincés de poulet mijotés, œuf mollet, oignons frits.",
                tags: ["Original"]
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
                name: "Gyoza Poulet & Légumes",
                price: 6.70,
                description: "6 Raviolis grillés maison. Farce juteuse et pâte croustillante.",
                qty_label: "6 pièces"
            },
            {
                id: "ebi-fried",
                name: "Ebi Fried",
                price: 10.90,
                description: "5 Grosses crevettes panées Panko, sauce tartare japonaise.",
            },
            {
                id: "karaage",
                name: "Karaage Maison",
                price: 10.90,
                description: "7 morceaux de poulet mariné au gingembre et soja, frit croustillant.",
            },
            {
                id: "takoyaki",
                name: "Takoyaki",
                price: 8.30,
                description: "6 Boulettes de poulpe fondantes, sauce brune et mayonnaise.",
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
                price: 16.20,
                description: "Filet de poulet pané croustillant sur riz Bio, nappé de curry japonais doux.",
            },
            {
                id: "saumon-teriyaki",
                name: "Saumon Teriyaki",
                price: 18.90,
                description: "Pavé de saumon Label Rouge laqué sauce soja sucrée, légumes et riz Bio.",
            },
            {
                id: "una-chirashi",
                name: "Una Chirashi (Anguille)",
                price: 18.40,
                description: "Bol de riz Bio recouvert de tranches d'anguille grillée caramélisée (Unagi).",
                tags: ["Premium"]
            }
        ]
    },
    {
        id: "sushi",
        title: "LE COMPTOIR SUSHI (KYO)",
        description: "Poissons Label Rouge et Riz Bio AB impact carbone minimum.",
        items: [
            {
                id: "sushi-saumon-10",
                name: "Plateau 10 Sushi Saumon",
                price: 16.90,
                description: "Saumon Label Rouge d'Écosse sur riz vinaigré Bio."
            },
            {
                id: "sushi-mix-15",
                name: "15 Sushi Mix",
                price: 25.60,
                description: "Assortiment du Chef : Thon, Saumon, Daurade, Crevette...",
            },
            {
                id: "california-mix",
                name: "18 California Mix",
                price: 18.80,
                description: "Plateau dégustation : Avocat-Saumon, Thon Cuit, Cheese...",
            },
            {
                id: "chirashi-saumon",
                name: "Chirashi Saumon",
                price: 15.90,
                description: "Tranches de saumon frais sur un grand bol de riz vinaigré.",
            }
        ]
    }
];
