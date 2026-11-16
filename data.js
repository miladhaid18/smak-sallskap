const CATEGORIES = [
  { id: "forratter", label: "Förrätter", singular: "Förrätt" },
  { id: "huvudratter", label: "Huvudrätter", singular: "Huvudrätt" },
  { id: "efterratter", label: "Efterrätter", singular: "Efterrätt" },
  { id: "saser", label: "Såser", singular: "Sås" },
  { id: "drycker", label: "Drycker", singular: "Dryck" }
];

const MENU = [
  {
    id: "vitloksbrod",
    name: "Vitlöksbröd med örtolja",
    category: "forratter",
    price: 89,
    rating: 4.6,
    short: "Rostat surdegsbröd med vitlökssmör, persilja och flingsalt.",
    description:
      "Nybakat surdegsbröd som rostas gyllene och penslas med vitlökssmör, färsk persilja och en skvätt kallpressad olivolja. Serveras med en liten skål örtolja att doppa i.",
    ingredients: ["Surdegsbröd", "Vitlökssmör", "Persilja", "Olivolja", "Flingsalt"],
    allergens: ["Gluten", "Mjölk"],
    tags: ["Vegetarisk"],
    img: "garlic,bread",
    lock: 101
  },
  {
    id: "bruschetta",
    name: "Bruschetta al Pomodoro",
    category: "forratter",
    price: 95,
    rating: 4.7,
    badge: "Populär",
    short: "Krispigt bröd, solmogna tomater, basilika och balsamico.",
    description:
      "Rostat surdegsbröd med solmogna tomater, färsk basilika, vitlök och en droppe balsamvinäger. Enkelt, fräscht och alltid lika uppskattat.",
    ingredients: ["Surdegsbröd", "Tomater", "Basilika", "Vitlök", "Olivolja", "Balsamvinäger"],
    allergens: ["Gluten"],
    tags: ["Vegetarisk"],
    img: "bruschetta,tomato",
    lock: 102
  },
  {
    id: "toast-skagen",
    name: "Toast Skagen",
    category: "forratter",
    price: 145,
    rating: 4.8,
    short: "Räkor, löjrom och dill på rostat bröd.",
    description:
      "Vår version av klassikern: handskalade räkor i krämig majonnäs med dill och citron på rostat bröd, toppat med löjrom och en klyfta citron.",
    ingredients: ["Toastbröd", "Räkor", "Majonnäs", "Dill", "Citron", "Löjrom"],
    allergens: ["Gluten", "Ägg", "Skaldjur", "Mjölk"],
    tags: [],
    img: "shrimp,toast",
    lock: 103
  },
  {
    id: "halloumi-honung",
    name: "Krispig halloumi med honung",
    category: "forratter",
    price: 115,
    rating: 4.6,
    short: "Panerad halloumi med honung, chili och mynta.",
    description:
      "Panerad halloumi som steks krispig och ringlas med flytande honung, chili och färsk mynta. Serveras med lime och en svalkande yoghurt.",
    ingredients: ["Halloumi", "Panko", "Honung", "Chili", "Mynta", "Lime", "Yoghurt"],
    allergens: ["Mjölk", "Gluten"],
    tags: ["Vegetarisk"],
    img: "halloumi,cheese",
    lock: 104
  },
  {
    id: "tomatsoppa",
    name: "Rostad tomatsoppa",
    category: "forratter",
    price: 105,
    rating: 4.5,
    short: "Rostad tomat, basilika och gräddig sötma.",
    description:
      "En fyllig soppa på rostad tomat och basilika, serverad med en klick grädde, basilikaolja och rostat surdegsbröd. Perfekt att värma sig med.",
    ingredients: ["Rostade tomater", "Grönsaksbuljong", "Grädde", "Basilika", "Surdegsbröd", "Olivolja"],
    allergens: ["Mjölk", "Gluten"],
    tags: ["Vegetarisk"],
    img: "tomato,soup",
    lock: 105
  },
  {
    id: "pasta-carbonara",
    name: "Pasta Carbonara",
    category: "huvudratter",
    price: 185,
    rating: 4.9,
    badge: "Populär",
    short: "Spaghetti, guanciale och pecorino – utan grädde.",
    description:
      "Klassisk carbonara med spaghetti, knaperstekt guanciale, äggula och rejält med pecorino romano. Svartpeppar och inget annat – precis som den ska vara.",
    ingredients: ["Spaghetti", "Guanciale", "Äggula", "Pecorino romano", "Svartpeppar"],
    allergens: ["Gluten", "Ägg", "Mjölk"],
    tags: [],
    img: "carbonara,pasta",
    lock: 106
  },
  {
    id: "grillad-lax",
    name: "Grillad lax med dillsås",
    category: "huvudratter",
    price: 225,
    rating: 4.8,
    short: "Grillad lax med dillsås, sparris och pressad potatis.",
    description:
      "Svensk laxfilé som grillas med citron och serveras med krämig dillsås, pressad potatis och grön sparris. Lätt, fräscht och glutenfritt.",
    ingredients: ["Laxfilé", "Dillsås", "Pressad potatis", "Grön sparris", "Citron", "Smör"],
    allergens: ["Fisk", "Mjölk"],
    tags: ["Glutenfri"],
    img: "salmon,dill",
    lock: 107
  },
  {
    id: "kottbullar",
    name: "Köttbullar med gräddsås",
    category: "huvudratter",
    price: 195,
    rating: 4.8,
    badge: "Populär",
    short: "Hemgjorda köttbullar med gräddsås och lingon.",
    description:
      "Saftiga köttbullar på nötfärs, gräddsås på sky, hemgjort potatismos, lingonsylt och pressgurka. Husmansklassikern när den är som bäst.",
    ingredients: ["Nötfärs", "Gräddsås", "Potatismos", "Lingon", "Pressgurka"],
    allergens: ["Mjölk", "Gluten", "Ägg"],
    tags: [],
    img: "meatballs,potato",
    lock: 108
  },
  {
    id: "pizza-margherita",
    name: "Pizza Margherita",
    category: "huvudratter",
    price: 165,
    rating: 4.7,
    short: "Surdeg, San Marzano, fior di latte och basilika.",
    description:
      "Pizza med 48 timmar kalljäst surdegsbotten, San Marzano-tomater, fior di latte och färsk basilika. Gräddas i stenugn och serveras med olivolja.",
    ingredients: ["Surdegspizza", "San Marzano-tomater", "Fior di latte", "Basilika", "Olivolja"],
    allergens: ["Gluten", "Mjölk"],
    tags: ["Vegetarisk"],
    img: "pizza,margherita",
    lock: 109
  },
  {
    id: "biff-rydberg",
    name: "Biff Rydberg",
    category: "huvudratter",
    price: 265,
    rating: 4.7,
    short: "Oxfilé, tärnad potatis, lök och äggula.",
    description:
      "Tärnad oxfilé, gyllene potatistärningar och stekt lök, serverat med dijonsenapskräm, rå äggula och riven pepparrot. En riktig svensk favorit.",
    ingredients: ["Oxfilé", "Tärnad potatis", "Stekt lök", "Dijonsenap", "Äggula", "Pepparrot"],
    allergens: ["Ägg", "Mjölk", "Senap"],
    tags: [],
    img: "beef,potato",
    lock: 110
  },
  {
    id: "kikarts-curry",
    name: "Kryddstark kikärtscurry",
    category: "huvudratter",
    price: 175,
    rating: 4.5,
    short: "Kikärter, kokos, spenat och varm naan.",
    description:
      "Kryddstark curry på kikärter, kokosmjölk, tomat och spenat. Serveras med basmatiris, varm naan och färsk koriander.",
    ingredients: ["Kikärter", "Kokosmjölk", "Tomat", "Spenat", "Currykrydda", "Naan"],
    allergens: ["Gluten", "Mjölk"],
    tags: ["Vegetarisk", "Stark"],
    img: "chickpea,curry",
    lock: 111
  },
  {
    id: "kyckling-alfredo",
    name: "Kyckling Alfredo",
    category: "huvudratter",
    price: 195,
    rating: 4.6,
    short: "Fettuccine, kyckling och krämig parmesansås.",
    description:
      "Fettuccine i krämig sås på grädde och parmesan med stekt kycklingfilé, vitlök och persilja. Rejält, krämigt och omöjligt att motstå.",
    ingredients: ["Fettuccine", "Kyckling", "Grädde", "Parmesan", "Vitlök", "Persilja"],
    allergens: ["Gluten", "Mjölk"],
    tags: [],
    img: "chicken,pasta",
    lock: 112
  },
  {
    id: "rakmacka",
    name: "Räkmacka deluxe",
    category: "huvudratter",
    price: 155,
    rating: 4.6,
    short: "Rustikt bröd, räkor, ägg och dill.",
    description:
      "Rustikt bröd med handskalade räkor, krämig majonnäs, kokt ägg, dill och picklad rödlök. Serveras med citron och en salladskrans.",
    ingredients: ["Rustikt bröd", "Räkor", "Ägg", "Majonnäs", "Dill", "Picklad rödlök"],
    allergens: ["Gluten", "Ägg", "Skaldjur"],
    tags: [],
    img: "shrimp,sandwich",
    lock: 113
  },
  {
    id: "falafelwrap",
    name: "Falafelwrap med tahini",
    category: "huvudratter",
    price: 149,
    rating: 4.5,
    badge: "Nyhet",
    short: "Falafel, tahini och picklade grönsaker.",
    description:
      "Krispig falafel i libabröd med krämig tahini, tomat, gurka och picklad lök. Vegansk, mättande och perfekt att ta med.",
    ingredients: ["Falafel", "Libabröd", "Tahini", "Tomat", "Gurka", "Picklad lök"],
    allergens: ["Gluten", "Sesam"],
    tags: ["Vegansk"],
    img: "falafel,wrap",
    lock: 114
  },
  {
    id: "kladdkaka",
    name: "Kladdkaka med grädde",
    category: "efterratter",
    price: 75,
    rating: 4.8,
    badge: "Populär",
    short: "Varm kladdkaka med lättvispad grädde.",
    description:
      "Vår klassiska kladdkaka med krispig yta och ljuvligt kladdig kärna. Serveras ljummen med lättvispad grädde och färska hallon.",
    ingredients: ["Kladdkaka", "Vispgrädde", "Kakaopulver", "Hallon"],
    allergens: ["Gluten", "Ägg", "Mjölk"],
    tags: [],
    img: "chocolate,cake",
    lock: 115
  },
  {
    id: "creme-brulee",
    name: "Crème brûlée",
    category: "efterratter",
    price: 85,
    rating: 4.9,
    short: "Krämig vanilj under knäckigt sockertäcke.",
    description:
      "Silkeslen vaniljkräm under ett knäckigt lager karamelliserat socker. Serveras med färska bär och en gnutta flingsalt.",
    ingredients: ["Vaniljstång", "Grädde", "Äggula", "Råsocker", "Bär"],
    allergens: ["Mjölk", "Ägg"],
    tags: ["Glutenfri"],
    img: "creme,brulee",
    lock: 116
  },
  {
    id: "appelkaka",
    name: "Äppelkaka med vaniljsås",
    category: "efterratter",
    price: 79,
    rating: 4.6,
    short: "Varm äppelkaka med kanel och vaniljsås.",
    description:
      "Saftig äppelkaka med kanel och kardemumma, serverad ljummen med hemmagjord vaniljsås. Som en kram i dessertform.",
    ingredients: ["Äpple", "Kanel", "Kardemumma", "Vaniljsås", "Smör"],
    allergens: ["Gluten", "Ägg", "Mjölk"],
    tags: [],
    img: "apple,cake",
    lock: 117
  },
  {
    id: "chokladfondant",
    name: "Chokladfondant",
    category: "efterratter",
    price: 89,
    rating: 4.8,
    badge: "Populär",
    short: "Varm chokladfondant med flytande kärna.",
    description:
      "En varm fondant på mörk choklad med flytande kärna, serverad med vaniljglass och hallon. För dig som älskar choklad utan kompromisser.",
    ingredients: ["Mörk choklad", "Smör", "Ägg", "Socker", "Vaniljglass", "Hallon"],
    allergens: ["Gluten", "Ägg", "Mjölk"],
    tags: [],
    img: "chocolate,fondant",
    lock: 118
  },
  {
    id: "pannacotta",
    name: "Pannacotta med bär",
    category: "efterratter",
    price: 85,
    rating: 4.7,
    short: "Silkeslen pannacotta med säsongens bär.",
    description:
      "Pannacotta på grädde och vanilj, toppad med säsongens bär och färsk mynta. Lätt, fräsch och glutenfri.",
    ingredients: ["Grädde", "Vanilj", "Socker", "Säsongens bär", "Mynta"],
    allergens: ["Mjölk"],
    tags: ["Glutenfri"],
    img: "pannacotta,berries",
    lock: 119
  },
  {
    id: "glass-saltkaramell",
    name: "Glass med saltkolasås",
    category: "efterratter",
    price: 69,
    rating: 4.7,
    short: "Vaniljglass med saltkolasås och rostad mandel.",
    description:
      "Krämig vaniljglass med saltkolasås, rostad mandel och flingsalt. En liten dessert som tar plats.",
    ingredients: ["Vaniljglass", "Saltkolasås", "Rostad mandel", "Flingsalt"],
    allergens: ["Mjölk", "Mandel"],
    tags: ["Glutenfri"],
    img: "icecream,caramel",
    lock: 120
  },
  {
    id: "graddsas",
    name: "Gräddsås",
    category: "saser",
    price: 35,
    rating: 4.7,
    short: "Klassisk gräddsås på sky och timjan.",
    description:
      "Fyllig gräddsås på kalvsky, grädde och färsk timjan. Passar till köttbullar, biff och allt som behöver lite extra omtanke.",
    ingredients: ["Grädde", "Kalvsky", "Soja", "Timjan", "Svartpeppar"],
    allergens: ["Mjölk"],
    tags: [],
    img: "cream,sauce",
    lock: 121
  },
  {
    id: "bearnaisesas",
    name: "Bearnaisesås",
    category: "saser",
    price: 39,
    rating: 4.6,
    short: "Krämig bearnaise med dragon och schalotten.",
    description:
      "Hemgjord bearnaise på smör, äggula, dragon och schalottenlök. Syrlig, krämig och given till grillat.",
    ingredients: ["Smör", "Äggula", "Dragon", "Schalottenlök", "Vitvinsvinäger"],
    allergens: ["Ägg", "Mjölk"],
    tags: [],
    img: "bearnaise,sauce",
    lock: 122
  },
  {
    id: "dillsas",
    name: "Dillsås",
    category: "saser",
    price: 35,
    rating: 4.5,
    short: "Krämig dillsås med citron och senap.",
    description:
      "Krämig dillsås med färsk dill, citron och en nypa senap. Given till lax, potatis och fiskrätter.",
    ingredients: ["Grädde", "Färsk dill", "Senap", "Citron", "Peppar"],
    allergens: ["Mjölk", "Senap"],
    tags: [],
    img: "dill,sauce",
    lock: 123
  },
  {
    id: "vitlokssas",
    name: "Vitlökssås",
    category: "saser",
    price: 29,
    rating: 4.5,
    short: "Krämig vitlökssås med citron och gräslök.",
    description:
      "Svalkande vitlökssås på crème fraîche och majonnäs med citron och gräslök. Passar till pizza, pommes och grillat.",
    ingredients: ["Crème fraîche", "Majonnäs", "Vitlök", "Citron", "Gräslök"],
    allergens: ["Mjölk", "Ägg"],
    tags: [],
    img: "garlic,sauce",
    lock: 124
  },
  {
    id: "chimichurri",
    name: "Chimichurri",
    category: "saser",
    price: 35,
    rating: 4.4,
    short: "Frisk argentinsk örtsås med chili och lime.",
    description:
      "Färsk chimichurri på persilja, koriander, vitlök, chili och lime. Syrlig, grön och fantastisk till grillat.",
    ingredients: ["Persilja", "Koriander", "Vitlök", "Chili", "Lime", "Olivolja"],
    allergens: [],
    tags: ["Vegansk", "Glutenfri"],
    img: "chimichurri,sauce",
    lock: 125
  },
  {
    id: "pepparsas",
    name: "Pepparsås",
    category: "saser",
    price: 39,
    rating: 4.6,
    short: "Mustig pepparsås med konjak och grädde.",
    description:
      "Mustig pepparsås på grädde, krossad svartpeppar och en skvätt konjak. Passar perfekt till biff och oxfilé.",
    ingredients: ["Grädde", "Svartpeppar", "Konjak", "Kalvbuljong", "Smör"],
    allergens: ["Mjölk"],
    tags: [],
    img: "peppercorn,sauce",
    lock: 126
  },
  {
    id: "apelsinjuice",
    name: "Färskpressad apelsinjuice",
    category: "drycker",
    price: 49,
    rating: 4.7,
    short: "Färskpressad apelsin, inget annat.",
    description:
      "Färskpressad apelsinjuice på solmogna apelsiner, serverad iskall med en skiva apelsin. C-vitamin så det räcker.",
    ingredients: ["Apelsiner", "Is", "Apelsinskiva"],
    allergens: [],
    tags: ["Vegansk", "Glutenfri"],
    img: "orange,juice",
    lock: 127
  },
  {
    id: "citronlemonad",
    name: "Hemgjord citronlemonad",
    category: "drycker",
    price: 55,
    rating: 4.8,
    badge: "Nyhet",
    short: "Hemgjord lemonad med citron och mynta.",
    description:
      "Syrlig och söt lemonad på färskpressad citron, mynta och soda. Blandas på beställning och serveras rejält iskall.",
    ingredients: ["Citron", "Socker", "Mynta", "Soda", "Is"],
    allergens: [],
    tags: ["Vegansk", "Glutenfri"],
    img: "lemonade,mint",
    lock: 128
  },
  {
    id: "aperol-spritz",
    name: "Aperol Spritz",
    category: "drycker",
    price: 115,
    rating: 4.8,
    badge: "Populär",
    short: "Aperol, prosecco och apelsin.",
    description:
      "Sommarens mest älskade drink: Aperol, prosecco, soda och apelsin över is. Lätt, bitter och förfriskande.",
    ingredients: ["Aperol", "Prosecco", "Soda", "Apelsin", "Is"],
    allergens: ["Sulfiter"],
    tags: ["18+"],
    img: "aperol,spritz",
    lock: 129
  },
  {
    id: "mojito",
    name: "Mojito",
    category: "drycker",
    price: 110,
    rating: 4.7,
    short: "Vit rom, lime, mynta och soda.",
    description:
      "Klassisk mojito med vit rom, färsk lime, mynta och soda. Rörs på beställning och serveras med krossad is.",
    ingredients: ["Vit rom", "Lime", "Mynta", "Socker", "Soda", "Is"],
    allergens: ["Sulfiter"],
    tags: ["18+"],
    img: "mojito,cocktail",
    lock: 130
  },
  {
    id: "rodvin",
    name: "Rödvin, husets",
    category: "drycker",
    price: 95,
    rating: 4.6,
    short: "Tempranillo, 15 cl – fyllig och rund.",
    description:
      "Husets röda: en fyllig Tempranillo med ton av körsbär, plommon och ekfat. Serveras vid 16 grader, glas eller flaska.",
    ingredients: ["Tempranillo", "Körsbär", "Plommon", "Ekfat"],
    allergens: ["Sulfiter"],
    tags: ["18+"],
    img: "red,wine,glass",
    lock: 131
  },
  {
    id: "hantverksol",
    name: "Lokal IPA, 33 cl",
    category: "drycker",
    price: 79,
    rating: 4.5,
    short: "Lokal IPA – frisk och humlad.",
    description:
      "Lokal hantverksöl av typen IPA med citrus, tallbarr och en rejäl humlebeska. Serveras kall i glas.",
    ingredients: ["Vatten", "Kornmalt", "Humle", "Jäst"],
    allergens: ["Gluten"],
    tags: ["18+"],
    img: "craft,beer",
    lock: 132
  },
  {
    id: "islatte",
    name: "Islatte",
    category: "drycker",
    price: 55,
    rating: 4.6,
    short: "Espresso, mjölk och is.",
    description:
      "Dubbel espresso skakad med mjölk och is, toppad med en aning vaniljsocker. Kaffekick när du behöver den som mest.",
    ingredients: ["Espresso", "Mjölk", "Is", "Vaniljsocker"],
    allergens: ["Mjölk"],
    tags: ["Vegetarisk"],
    img: "iced,latte",
    lock: 133
  },
  {
    id: "mineralvatten",
    name: "Mineralvatten med citron",
    category: "drycker",
    price: 35,
    rating: 4.4,
    short: "Kolsyrat mineralvatten med citron.",
    description:
      "Kylskåpskallt kolsyrat mineralvatten med en klyfta citron. Enkelt, fräscht och alltid rätt.",
    ingredients: ["Mineralvatten", "Kolsyra", "Citron"],
    allergens: [],
    tags: ["Vegansk", "Glutenfri"],
    img: "sparkling,water",
    lock: 134
  }
];
