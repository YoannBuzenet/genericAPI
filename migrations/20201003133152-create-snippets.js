"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable("Snippets", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        categoryId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Categories",
            key: "id",
          },
        },
        fr: { type: Sequelize.STRING(2000), allowNull: false },
        en: { type: Sequelize.STRING(2000), allowNull: false },
        isDefault: {
          type: Sequelize.INTEGER,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .then(function () {
        queryInterface.bulkInsert("Snippets", [
          {
            categoryId: 1,
            isDefault: 1,
            fr:
              "Nom Produit : Cartes Magic\nDescription: De magnifiques cartes de jeu qui permettent de partager un bon moment entre ami à n'importe quel endroit. Conviviales, elles permettent de découvrir des moments calmes et chaleureux.\nNom Produit : Une tasse de thé\nDescription: Une magnifique tasse de thé qui ira parfaitement dans vos étagères, superbes pour la cuisine ! Solide, robuste, elle amène volupté et confort dans un espace familial de cuisine.\nNom Produit : un écran d'ordinateur\nDescription: Quoi de mieux qu'un écran 24 pouces pour voir mieux que quiconque vos films en HD ! Tout en affichant chaque pixel avec le plus grande profondeur, elle va au fond du film, et vous avec !\nNom Produit : Paire de lunettes\nDescription: Ces paires de lunettes adaptées à votre vue permettent une vision améliorée tout en donnant un confort de portée.\nNom Produit : Etagère en chêne\nDescription: Cette magnifique étagère se mariera à merveille dans votre salon. Parfaite pour ranger vos souvenirs et livres.\nNom Produit : Liquide Essuie-glace\nDescription: Lot de liquide essuie-glace pour les voitures.Parfait pour les provisions sur la durée.\nNom Produit : Pull en laine\nDescription: Laissez-vous séduire par nos pulls en laine ! Doux, chatoyants, ils vont accompagneront tout l'hiver.\nNom Produit : Chaussures en cuir\nDescription: Chaussures en cuir, parfaites pour aller travailler. Chaussures de qualité et de longue durabilité.\nNom Produit : Portant\nDescription: Idéal pour stocker les vêtements dans une pièce, le portant permet d'allier l'utile à l'agréable.\nNom Produit : Enceintes d'ordinateur\nDescription: Faites monter le son ! Ces enceintes d'ordinateur iront sur votre bureau pour vous permettre de profiter d'un son calibré.\nNom Produit :Calepins orange\nDescription: Prenez vos notes et ne les perdez plus avec ces sympathiques calins oranges.\nNom Produit : {{name}}\nDescription:",
            en:
              "Product Name: Magic Cards\nDescription: Wonderful magic cards that will give you warm time with your friend around epic strategic battles !\nProduct Name: A cup of tea\n\nDescription: This great cup of tea will give you the best moments in your kitchen. be ready to taste delightful tea in this colorful and great cup.\nProduct Name: A Computer Screen\nDescription: Did you ever try this big and great computer screen to watch your bluray movies ? It is so good !\nProduct Name: {{name}}\nDescription:",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          // allonger ces snippets de 500 characs
          // améliorer les phrases
          {
            categoryId: 1,
            isDefault: 0,
            fr:
              "Nom Produit : Cartes Magic\nAudience Cible : Passionnés\nDescription: De magnifiques cartes de jeu qui permettent de partager un bon moment entre ami à n'importe quel endroit. Conviviales, elles permettent de découvrir des moments calmes et chaleureux.\nNom Produit : Une tasse de thé\nAudience Cible : Jeunes actifs\nDescription: Wow ! Ces tasses de thé sont incroyables ! Elles iront parfaitement dans la cuisine à coté du plan de travail.\nNom Produit : un écran d'ordinateur\nAudience Cible : Personnes agées\nDescription: Lorsqu'on regarde un écran d'ordinateur, l'important est de bien voir. Avec son grand écran, notre produit vous fournit confort et plaisir pour les vidéos en famille.\nNom Produit : Paire de lunettes\nAudience Cible : Etudiants\nDescription: Pas chères les lunettes ! Comment avoir l'air cool pour un petit budget ? Avec ces belles lunettes !\nNom Produit : Liquide Essuie-glace\nAudience Cible : Tout le monde\nDescription: On a tous besoin de liquide essuie-glace pour la voiture ! Profitez d'un produit de qualité, préparé par nos experts.\nNom Produit : Pull en laine\nAudience Cible : Ménagère\nDescription: Ce pull est doux et confortable. Il vous ira à ravir.\nNom Produit : Chaussures en cuir\nAudience Cible : Jeune cadre dynamique\nDescription: Ces chaussures sont parfaitement designées pour vos journées. Gardez le rythme avec nos chaussures de qualité.\nNom Produit : {{name}}\nAudience Cible : {{targetAudience}}\nDescription:",
            en:
              "Product Name: Magic Cards\nAudience Target: Enthusiasts\nDescription: Beautiful playing cards that allows you to share a good time with friends at any place. Friendly, they allow you to discover calm and warm moments.\nProduct Name: A cup of tea\nAudience Target: Young workers\nDescription: Wow! These tea cups are amazing! They will go perfectly in the kitchen next to the worktop.\nProduct name: a computer screen\nAudience: Elderly people\nDescription: When looking at a computer screen, the important thing is to see well. With its large screen, our product provides you comfort and enjoyment for family videos.\nProduct Name: Pair of glasses\nAudience: Students\nDescription: Cheap glasses! How to look cool on a budget? With those nice glasses!\nProduct Name: Wiper Fluid\nAudience: Everyone\nDescription: We all need windshield wiper fluid for the car! Enjoy a quality product, prepared by our experts.\nProduct Name: Wool sweater\nAudience Target: Housewife\nDescription: This sweater is soft and comfortable. It will look great on you.\nProduct Name: Leather shoes\nAudience: Young dynamic boy\nDescription: These shoes are perfectly designed for your day. Keep the pace with our quality shoes.\nProduct Name: {{name}}\nAudience Target: {{targetAudience}}\nDescription:",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          // allonger ces snippets de 500 characs
          // améliorer les phrases
          {
            categoryId: 1,
            isDefault: 0,
            fr:
              "Nom Produit : Cartes Magic\nOccasion : Black Friday\nDescription: A l'occasion du Black Friday, nos cartes Magic sont en solde ! Profitez de notre stock au meilleur prix.\nNom Produit : Une tasse de thé\nOccasion : Noël\nDescription: Pour Noël, offrez-vous cette magnifique tasse de thé, qui ira à ravir dans votre cuisine.\nNom Produit : un écran d'ordinateur\nOccasion : Soldes\nDescription: Pour profiter au mieux de cette période de solde, cet écran d'ordinateur est à prix réduit.\nNom Produit : Paire de lunettes\nOccasion : Destockage\nDescription: Toutes nos lunettes sont à prix réduit pendant le grand destockage ! N'est-ce pas le moment d'essayer ?\nNom Produit : Liquide Essuie-glace\nOccasion : Promotion\nDescription: Profitez de nos promotions spéciales sur les liquide essuie-glace. C'est le moment de stocker !\nNom Produit : Pull en laine\nOccasion : Solde d'été\nDescription: Ah, l'été ! Le meilleur moment pour acheter pas chers des vêtements qui vous serviront toute l'année ! Profitez de ce beau pull en laine pour l'occasion.\nNom Produit : Chaussures en cuir\nOccasion : La Toussaint\nDescription: Ces chaussures de qualité sont à prix réduit pendant la période de la Toussaint. C'est le moment de les acheter !\nNom Produit : {{name}}\nOccasion : {{occasion}}\nDescription:",
            en:
              "Product Name: Magic Cards\nOccasion: Black Friday\nDescription: On the occasion of Black Friday, our Magic cards are on sale! Take advantage of our stock at the best price.\nProduct Name: A cup of tea\nOccasion: Christmas\nDescription: For Christmas, treat yourself to this magnificent cup of tea, which will look great in your kitchen.\nProduct Name: a display screen computer\nOccasion: Sale\nDescription: To make the most of this sale period, this computer screen is at a reduced price.\nProduct name: Pair of glasses\nOccasion: Clearance\nDescription: All our glasses are at a reduced price during the big clearance sale! Isn't it the time to try it?\nProduct Name: Wiper Fluid\nOccasion: Promotion\nDescription: Take advantage of our special promotions on wiper fluid. Time to stock up!\nProduct Name: Wool sweater\nOccasion: Summer Sale\nDescription: Ah, summer! The best time to buy cheap clothes that will serve you all year round! Take advantage of this beautiful wool sweater for the occasion.\nProduct Name: Leather shoes\nOccasion: All Saints 'Day\nDescription: These quality shoes are at a reduced price during All Saints' Day. Now's the time to buy them!\nProduct Name: {{name}}\nOccasion: {{occasion}}\nDescription:",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          // product description : target audience + occasion
          {
            categoryId: 1,
            isDefault: 0,
            fr:
              "Nom Produit : Cartes Magic\nOccasion : Black Friday\nAudience Cible : Passionnés\nDescription: Chers joueurs et joueuses, à l'occasion du Black Friday, nos cartes Magic sont en solde ! Profitez de notre stock de cartes au meilleur prix.\nNom Produit : Une tasse de thé\nOccasion : Noël\nAudience Cible : Jeunes Actifs\nDescription: Pour Noël, offrez-vous cette magnifique tasse de thé, qui ira à ravir dans votre cuisine.\nNom Produit : un écran d'ordinateur\nOccasion : Soldes\nAudience Cible : Personnes agées\nDescription: Pour profiter au mieux de cette période de solde, cet écran d'ordinateur est à prix réduit. Découvrez son écran HD afin de profiter de son confort et plaisir pour partagers les vidéos en famille.\nNom Produit : Paire de lunettes\nOccasion : Destockage\nAudience Cible : Etudiants\nDescription: Toutes nos lunettes sont à prix réduit pendant le grand destockage ! Comment avoir l'air cool pour un petit budget ? Avec ces belles lunettes !\nNom Produit : Liquide Essuie-glace\nOccasion : Promotion\nAudience Cible : Tout le monde\nDescription: On a tous besoin de liquide essuie-glace pour la voiture ! Profitez de nos promotions spéciales sur les liquide essuie-glace. C'est le moment de stocker !\nNom Produit : Pull en laine\nOccasion : Solde d'été\nAudience Cible : Ménagère\nDescription: Ah, l'été ! Le meilleur moment pour acheter pas chers des vêtements qui vous serviront toute l'année ! Profitez de ce beau pull en laine pour l'occasion. Ce pull est doux et confortable. Il vous ira à ravir.\nNom Produit : {{name}}\nOccasion : {{occasion}}\nAudience Cible :{{targetAudience}}\nDescription:",
            en:
              "Product Name: Magic Cards\nOccasion: Black Friday\nAudience Target: Enthusiasts\nDescription: Dear players, on the occasion of Black Friday, our Magic cards are on sale! Take advantage of our card stock at the best price.\nProduct Name: A Cup of Tea\nOccasion: Christmas\nAudience: Young Active\nDescription: For Christmas, treat yourself to this magnificent cup of tea, which will look great in your kitchen.\nProduct name: a computer screen\nOccasion: Sale\nAudience: Seniors\nDescription: To make the most of this sale period, this computer screen is at a reduced price. Discover its HD screen to enjoy its comfort and pleasure to share videos with the family.\nProduct name: Pair of glasses\nOccasion: Clearance\nAudience Target: Students\nDescription: All our glasses are at a reduced price during the big clearance sale! How to look cool on a budget? With these beautiful glasses!\nProduct Name: Wiper Fluid\nOccasion: Promotion\nAudience Target: Everyone\nDescription: We all need wiper fluid for the car! Take advantage of our special promotions on wiper fluids. It's time to stock up!\nProduct Name: Wool sweater\nOccasion: Summer sale\nAudience: Housewife\nDescription: Ah, summer! The best time to buy cheap clothes that will serve you all year round! Take advantage of this beautiful wool sweater for the occasion. This sweater is soft and comfortable. It will look great on you.\nProduct Name: {{name}}\nOccasion: {{occasion}}\nAudience Target: {{targetAudience}}\nDescription:",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          // value proposition generic
          {
            categoryId: 2,
            isDefault: 1,
            fr: "",
            en: "",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          // value proposition activity
          {
            categoryId: 2,
            isDefault: 0,
            fr:
              "Nom de l'entreprise: Trello\nDescription de l'entreprise: Trello est un moyen gratuit d'organiser des équipes\nValeur ajoutée: Trello est LE moyen gratuit, flexible et visuel de tout organiser avec n'importe qui\nNom de l'entreprise: TeestCo\nDescription de l'entreprise: Vendre des chaussures\nValeur ajoutée: Nous proposons plus de 2500 paires de marques classiques et contemporaines, notamment Adidas, Asics, Bape, Blazer, Converse, Creative Recreation, DC Shoes, Emerica, FILA, K-Swiss, Nike SB et Vans.\nNom de la société: Boub\nDescription de la société: permettre aux gens de se connecter ensemble\nValeur ajoutée: Connecter les gens: Boub est un réseau social construit sur l'idée de permettre aux gens de se connecter ensemble. Boub améliorera la façon dont vous communiquez avec les autres en vous permettant d’envoyer des messages qui ne peuvent être vus que lorsque vous êtes connecté.\nNom de la société: CarCo\nDescription de la société: réparation de véhicules\nValeur ajoutée: la réparation de véhicules ne doit pas être coûteuse. Nos professionnels formés sont disponibles pour réparer votre véhicule sur place. Nous réparons et améliorons des véhicules depuis plus de 20 ans. Vous appelez, nous réparons. Nous pouvons réparer n'importe quelle marque ou modèle de voiture, camion, camping-car et camping-car. Qu'il s'agisse d'une vidange d'huile, d'un entretien général, d'une mise au point ou de réparations majeures.\nNom de l'entreprise: FitByte\nDescription de l'entreprise: vente de fitness\nValeur ajoutée: Mise en avant du Fitness pour les femmes: Je propose un programme de promotion du fitness qui vous aide à vous assurer que vous êtes tirer le meilleur parti de votre formation. Je m'en fiche si vous n'êtes pas un débutant ou si vous travaillez depuis des années. Vous avez besoin d'un partenaire qui s'enregistrera et vous tiendra responsable. Qui vous rappellera qu'il est temps d'alimenter votre corps avec la meilleure nutrition possible. Vous avez besoin de quelqu'un pour être votre pom-pom girl et défendre votre succès, y compris vous pousser lorsque vous en avez le plus besoin\nNom de l'entreprise: {{value1}}\nDescription de l'entreprise: {{value2}}\nValeur ajoutée:",
            en:
              "Company Name: Trello\nCompany Description: Trello is a free way of organizing teams\nAdded Value: Trello is the free, flexible, and visual way to organize everything with anyone\nCompany Name: TeestCo\nCompany Description: Selling shoes\nAdded Value: We carry more than 2,500 pairs of classic and contemporary brands including Adidas, Asics, Bape, Blazer, Converse, Creative Recreation, DC Shoes, Emerica, FILA, K-Swiss, Nike SB and Vans.\nCompany Name: Boub\nCompany Description: allowing people to connect together\nAdded Value : Connect People: Boub is a social network built on the idea of allowing people to connect together. Boub will enhance the way you communicate with others by letting you send messages that can only be seen when you are connected.\nCompany Name: CarCo\nCompany Description: repairing vehicles\nAdded Value: Repairing vehicles  doesn’t have to be expensive. Our trained professionals are available to repair your vehicle on the spot. We have been fixing and repairing vehicles for over 20 years. You name it, we fix it. We can repair any make or model of car, truck, motorhome and RV. Whether it is an oil change, general maintenance, tune up or major repairs.\nCompany Name: FitByte\nCompany Description: selling fitness\nAdded Value: Fitness Advocacy for Women: I provide a fitness advocacy program that helps you to make sure you are getting the most out of your training. I don't care if you aren't a beginner or have been working out for years. You need a partner who will check-in and hold you accountable. Who will remind you that it's time to fuel your body with the best nutrition possible. You need someone to be your cheerleader and champion your success, including pushing you when you need it most\nCompany Name: {{value1}}\nCompany Description: {{value2}}\nAdded Value:",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          // blog title - generic
          {
            categoryId: 3,
            isDefault: 1,
            fr:
              "Sujet:e-reputation, réussir\nTitre de billet de blog:Comment construire son e-réputation brillamment ?\nSujet:carrière sans diplôme\nTitre de billet de blog:Voici comment réussir sa carrière sans diplôme\nSujet:Perte de poids\nTitre de billet de blog:Comment perdre du poids sans se priver ?\nSujet:Mieux dormir\nTitre de billet de blog:Pourquoi les grasses matinées nous font du mal ?\nSujet:Argent\nTitre de billet de blog:Arrêtez de rêver et Commencez à gagner de l’argent\nSujet:Savoir-vivre\nTitre de billet de blog:Faites-vous ces affreuses fautes de sa­voir-vivre ?\nSujet:Mémoire\nTitre de billet de blog:Un moyen sûr pour améliorer sa mémoire (résultat garantis)\nSujet:Productivité\nTitre de billet de blog:Découvrez comment travailler de façon intelligente et structurée\nSujet:Médecins\nTitre de billet de blog:Que font les médecins lorsqu’ils souffrent de maux de tête ?\nSujet:Maternité\nTitre de billet de blog:Une mère qui sait comment prendre soin de son enfant\nSujet:Internet, employé\nTitre de billet de blog:Un employé de bureau licencié découvre un nouveau métier grâce à Internet\nSujet:Amour\nTitre de billet de blog:Ce que toute le monde devrait savoir sur l’amour\nSujet:Potager\nTitre de billet de blog:Le secret bien gardé pour réussir à tous les coups son potager\nSujet:Productivité\nTitre de billet de blog:9 techniques pour rendre vos journées plus productives\nSujet:Parents\nTitre de billet de blog:Témoignage de parents désespérés\nSujet:Café\nTitre de billet de blog:Voici pourquoi vous devriez boire un café avant la sieste.\nSujet:Bonheur\nTitre de billet de blog:Qui a envie d’être plus heureux(se) ?\nSujet:Applications, Blogueur\nTitre de billet de blog:5 applications redoutables que tout blogueur devrait utiliser\nSujet:{{name}}\nTitre de billet de blog:",
            en:
              "Subject: e-reputation, succeed\nBlog Post Title: How to Build Your E-Reputation Brilliantly?\nSubject: Career Without A Degree\nBlog Post Title: Here's How To Be A Successful Career Without A Degree\nSubject: Weight Loss\nTitle Blog Post: How To Lose Weight Without Depriving Yourself?\nSubject: Sleep Better\nBlog Post Title: Why Sleepy Mornings Hurt Us?\nSubject: Money\nBlog Post Title: Stop Dreaming and Start to earn money\nSubject: Savoir-vivre\nBlog Post Title: Are You Making These Ugly Mistakes?\nSubject: Memory\nBlog Post Title: A Sure Way to Improve Your Memory (result Guaranteed)\nSubject: Productivity\nBlog Post Title: Learn How to Work Smart and Structured\nSubject: Doctors\nBlog Post Title: What Do Doctors Do When They Have Headaches?\nSubject: Maternity  Blog post title: A mother who knows how to take care of her child\nSubject: Internet, location Blog Post Title: Laid Off Office Worker Finds New Job Thanks to the Internet\nSubject: Love\nBlog Post Title: What Everyone Should Know About Love\nSubject: Vegetable Garden\nTitle Blog: The Well-Kept Secret to Every Time a Successful Vegetable Garden\nSubject: Productivity\nBlog Post Title: 9 Techniques to Make Your Days More Productive\nSubject: Parents\nBlog Post Title: Testimony of Desperate Parents\nSubject: Coffee\nBlog Post Title: Here's why you should have a coffee before nap.\nSubject: Happiness\nBlog Post Title: Who wants to be happier?\nSubject: Applications, Blogger\nBlog Post Title: 5 Awesome Apps Every Blogger Should Use\nSubject: {{name}}\nBlog Post Title:",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          // Instagram Caption - generic
          {
            categoryId: 4,
            isDefault: 1,
            fr:
              "Description: vente de remise en forme\nLégende Instagram: Cet automne, essayez de vous engager à intégrer l'un de ces 10 conseils de mise en forme dans votre routine. #ACSMfitfam 💪\nDescription: faire du vélo\nLégende Instagram: Cela n'a pas à être compliqué - la joie de faire du vélo réside dans sa simplicité.\nDescription: à la plage avec les filles!\nLégende Instagram: cette sensation quand tu penses' J'ai été ici en train de m'amuser avec les dames et vous vous détendez et profitez du coucher de soleil. C'est un jour de paix ... * sirote du vin *\nDescription: faire du sport ce week-end\nLégende Instagram: des courts de tennis aux terrains de football, il y a beaucoup à faire à SoCal ce week-end. Voyez quels jeux se déroulent à proximité 🏑🚗\nDescription: en train de cuisiner\nLégende Instagram: La vie, c'est comme cuisiner - ne vous pressez pas, la plupart des gens n'ont jamais goûté à un repas bien cuit.\nDescription: manger\nLégende Instagram: La nourriture a une valeur massive dans ma vie. Manger de la nourriture délicieuse me procure une grande joie et fait de bons souvenirs. J'ai hâte de cuisiner davantage cet été.\nDescription: jouer counter-strike\nLégende Instagram: Vous ne pouvez pas arrêter, ne vous arrêtez pas. Pas même pour une petite sieste. Vous devez continuer à bouger, atteindre un autre niveau avant de vous endormir. 👊👊👊\nDescription: je viens d'acheter de nouvelles chaussures\nLégende Instagram: Ooh, je viens de recevoir une nouvelle paire de chaussures et maintenant j'ai une excellente excuse pour sortir et faire toute la marche que je voulais faire! #grind\nDescription: j'ai un nouveau petit ami\nLégende Instagram: Soyons honnêtes, mesdames. Quand on aime vraiment quelqu'un, tout va un peu mieux! Même votre café ... 😍\nDescription: J'ai un nouvel emploi\nLégende Instagram: J'ai un nouveau travail pour faire de grandes choses - célébrons avec un gâteau #capturerethemoment\nDescription: Je me suis marié hier\nLégende Instagram: Je me suis marié hier et Je n'ai jamais été aussi heureux. C'est la plus belle lune de miel de ma vie. Puisse cet amour grandir chaque année. #ihaveathingforyou\nDescription: {{value}}\nLégende Instagram:",
            en:
              "Description: selling fitness\nInstagram Caption: This fall, try to commit to incorporating 1 of these 10 fitness tips into your routine. #ACSMfitfam 💪\nDescription: riding a bike\nInstagram Caption: It doesn’t have to be complicated—the joy of biking lies in its simplicity.\nDescription: at the beach with the girls !\nInstagram Caption: that feeling when you've been out here having fun with the ladies and you just chill and enjoy the sunset. This is a day of peace🌅... *sips some wine*\nDescription: doing sports this week-end\nInstagram Caption: From the tennis courts to the soccer fields, there’s plenty to do in SoCal this weekend. See what games are going down nearby 🏑🚗\nDescription: cooking\nInstagram Caption: Life is like cooking - don't hurry it, most people have never experienced a well-cooked meal.\nDescription: eating\nInstagram Caption: Food has a massive value in my life. Eating delicious food brings me great joy and makes for good memories. I’m looking forward to cooking more this summer. \nt’s going to be a good one!\nDescription: playing counter-strike\nInstagram Caption: You can't stop, won't stop. Not even for a power nap. You've got to keep moving, hit another level before you go to sleep. 👊👊👊\nDescription: just bought new shoes\nInstagram Caption: Ooh, I just got a new pair of shoes and now I have a great excuse to go out and do all the walking I've been meaning to do! #grind\nDescription: got a new boyfriend\nInstagram Caption: Let's be honest, ladies. When you really like someone, everything is a bit better! Even your coffee... 😍\nDescription: I have a new job\nInstagram Caption: I’ve got a new job doing great things – let’s celebrate with cake #capturethemoment\nDescription: I married yesterday\nInstagram Caption: I married yesterday and I’ve never been happier. I mean like the honeymoon level of happy. May this love grow deeper every year. #ihaveathingforyou\nDescription:{{value}}\nInstagram Caption:",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          // Instagram Caption - mood
          {
            categoryId: 4,
            isDefault: 0,
            fr: "",
            en: "",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          // Blog Intro Generic
          {
            categoryId: 5,
            isDefault: 1,
            fr: "",
            en: "",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          // Blog Intro Mood
          {
            categoryId: 5,
            isDefault: 0,
            fr: "",
            en: "",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Snippets");
  },
};
