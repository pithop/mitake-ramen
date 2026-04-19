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
                longDescription: "Notre bouillon Tonkotsu est mijoté pendant plus de 12 heures à partir d'os de porc soigneusement sélectionnés, pour obtenir cette texture crémeuse et ce goût profond caractéristique des ramen de Kyushu. Servi avec 3 tranches de poitrine de porc Chashu fondante, des germes de soja croquants et des cébettes fraîches sur un lit de nouilles de blé artisanales.",
                allergens: ["Gluten", "Soja", "Sésame"],
                image: "https://www.sushi-aixsud.com/853-large_default/ramen-tonkotsu-classic.jpg",
                tags: ["popular"],
                availableOptions: [
                    { name: "Supplément Oeuf Mollet", price: 1.5, allowMultiple: true },
                    { name: "Supplément Spicy", price: 1.0 },
                    { name: "Taille Omori (Grand)", price: 4.0 }
                ]
            },
            {
                id: "ramen-tonkotsu-chashu",
                name: "Ramen tonkotsu cha-shu",
                posName: "Ramen Cha-Shu",
                price: 15.50,
                description: "La version gourmande : 5 tranches de Chashu, œuf mollet mariné, bouillon riche.",
                longDescription: "La version ultime pour les amateurs de viande. Notre bouillon Tonkotsu signature est accompagné de 5 généreuses tranches de Chashu — poitrine de porc braisée lentement dans un mélange de sauce soja, mirin et saké — couronnées d'un œuf mollet mariné au soja dont le jaune reste délicieusement coulant. Une expérience riche et réconfortante.",
                allergens: ["Gluten", "Soja", "Œuf", "Sésame"],
                image: "https://www.sushi-aixsud.com/852-large_default/ramen-tonkotsu-cha-shu.jpg",
                tags: ["chef_choice", "meat_lover"],
                availableOptions: [
                    { name: "Supplément Oeuf Mollet", price: 1.5, allowMultiple: true },
                    { name: "Supplément Spicy", price: 1.0 },
                    { name: "Taille Omori (Grand)", price: 4.0 }
                ]
            },
            {
                id: "maze-men",
                name: "Mazé men (ramen sans bouillon)",
                posName: "Mazé Men",
                price: 15.00,
                description: "Ramen sèches, émincés de poulet mijotés, œuf mollet, oignons frits.",
                longDescription: "Un style de ramen unique, sans bouillon, originaire de Nagoya. Les nouilles épaisses sont nappées d'une sauce concentrée à base de soja et de sésame, mélangées à des émincés de poulet mijotés dans une sauce maison, un œuf mollet mariné et des oignons frits croustillants. Mélangez le tout avant de déguster pour libérer tous les arômes. Une explosion de textures et de saveurs.",
                allergens: ["Gluten", "Soja", "Œuf", "Sésame"],
                image: "https://www.sushi-aixsud.com/854-large_default/maze-men-ramen-sans-bouillon.jpg",
                tags: ["original", "spicy"],
                availableOptions: [
                    { name: "Supplément Oeuf Mollet", price: 1.5, allowMultiple: true },
                    { name: "Supplément Spicy", price: 1.0 },
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
                price: 6.40,
                description: "6 Raviolis grillés maison. Farce juteuse et pâte croustillante.",
                longDescription: "Nos gyoza sont préparés à la main chaque jour. La farce, un mélange savoureux de poulet haché et de légumes croquants assaisonnés au gingembre et à l'ail, est enveloppée dans une fine pâte de blé grillée à la perfection — dorée et croustillante en dessous, tendre et moelleuse au-dessus. Servis avec notre sauce ponzu maison.",
                allergens: ["Gluten", "Soja", "Sésame"],
                image: "https://www.sushi-aixsud.com/226-large_default/gyoza-poulet-legumes.jpg",
                qty_label: "6 pièces",
                tags: ["popular"],
                availableOptions: [
                    { name: "Sauce Piquante", price: 0.5 },
                    { name: "Supplément Spicy", price: 1.0 }
                ]
            },
            {
                id: "gyoza-crevettes",
                name: "Gyoza crevettes",
                posName: "Gyoza crevettes",
                price: 8.65,
                description: "6 Raviolis grillés maison à la crevette.",
                longDescription: "Nos gyoza aux crevettes sont préparés avec une farce généreuse de crevettes et de légumes. Grillés à la perfection, croustillants en dessous et moelleux au-dessus.",
                allergens: ["Crustacés", "Gluten", "Soja", "Sésame"],
                image: "https://www.sushi-aixsud.com/227-large_default/gyoza-crevettes.jpg",
                qty_label: "6 pièces",
                tags: ["seafood"],
                availableOptions: [
                    { name: "Sauce Piquante", price: 0.5 }
                ]
            },
            {
                id: "gyoza-mixte",
                name: "GYOZA PAR 6 poulet, crevettes, legumes",
                posName: "GYOZA PAR 6 poulet, crevettes, legumes",
                price: 7.50,
                description: "Gyoza mixte : 2 poulet, 2 crevettes, 2 légumes.",
                longDescription: "Idéal pour tout goûter ! Un assortiment de 6 de nos gyozas faits maison, pour un mélange parfait de saveurs.",
                allergens: ["Crustacés", "Gluten", "Soja", "Sésame"],
                image: "https://www.sushi-aixsud.com/111-large_default/gyoza-par-6-poulet-crevettes-legumes.jpg",
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
                longDescription: "Cinq crevettes géantes soigneusement panées dans une chapelure Panko japonaise ultra-légère et croustillante, frites à température précise pour un extérieur doré et un cœur tendre et juteux. Accompagnées de notre sauce tartare japonaise maison, légèrement citronnée. Un classique des izakayas de Tokyo.",
                allergens: ["Crustacés", "Gluten", "Œuf"],
                image: "https://www.sushi-aixsud.com/112-large_default/ebi-fried.jpg",
                tags: ["seafood"]
            },
            {
                id: "karaage",
                name: "KARA AGE",
                posName: "Kara Age",
                price: 10.40,
                description: "7 morceaux de poulet mariné au gingembre et soja, frit croustillant.",
                longDescription: "Le poulet frit japonais par excellence. 7 morceaux de cuisse de poulet marinés pendant 24 heures dans un mélange de sauce soja, gingembre frais, ail et saké, puis enrobés d'une fine couche de fécule de pomme de terre et frits à haute température. Le résultat : une croûte incroyablement croustillante qui enveloppe une chair juteuse et parfumée. Servi avec une tranche de citron.",
                allergens: ["Soja", "Gluten"],
                image: "https://www.sushi-aixsud.com/127-large_default/karaage.jpg",
                tags: ["popular"]
            },
            {
                id: "takoyaki",
                name: "TAKOYAKI Classique",
                posName: "Takoyaki",
                price: 7.90,
                description: "6 Boulettes de poulpe fondantes, sauce brune et mayonnaise.",
                longDescription: "Le street food emblématique d'Osaka. 6 boulettes parfaitement rondes, dorées à l'extérieur et fondantes à l'intérieur, avec un cœur de poulpe tendre. Nappées de sauce Takoyaki (sauce brune sucrée-salée), mayonnaise japonaise Kewpie, flocons de bonite dansants (katsuobushi) et algue aonori. Un voyage culinaire direct au cœur du Japon.",
                allergens: ["Mollusques", "Gluten", "Œuf", "Soja"],
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
                price: 15.40,
                description: "Filet de poulet pané croustillant sur riz Bio, nappé de curry japonais doux.",
                longDescription: "Un filet de poulet fermier pané dans une chapelure Panko dorée et croustillante, posé sur un lit de riz Bio japonais à grain court, le tout nappé d'une sauce curry maison douce et parfumée, mijotée avec des légumes fondants. Le curry japonais est plus doux et plus aromatique que ses cousins indiens ou thaïlandais — un véritable comfort food.",
                allergens: ["Gluten", "Œuf", "Soja"],
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
                price: 18.00,
                description: "Pavé de saumon Label Rouge laqué sauce soja sucrée, légumes et riz Bio.",
                longDescription: "Un généreux pavé de saumon Label Rouge, grillé à la flamme et laqué d'une sauce Teriyaki maison — un glaçage caramélisé à base de sauce soja, mirin, sucre et saké. Servi sur un lit de riz Bio accompagné de légumes de saison sautés au wok. La qualité premium du saumon Label Rouge garantit une chair fondante et riche en saveurs.",
                allergens: ["Poisson", "Soja", "Gluten"],
                image: "https://www.sushi-aixsud.com/124-large_default/saumon-teriyaki.jpg",
                tags: ["healthy", "seafood"]
            }
        ]
    }
];
