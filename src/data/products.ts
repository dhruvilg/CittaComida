export type Category = "Breads & Breakfast" | "Cakes & Bakes" | "Cookies" | "Pantry";

export interface Product {
  slug: string;
  name: string;
  category: Category;
  tagline: string;
  description: string;
  price: string; // display price
  options?: string[];
  tags: string[]; // dietary badges
  ingredients?: string;
  allergens?: string;
  image: string;
  imageAlt?: string;
  accent: string; // section accent colour
}

const CDN = "https://cdn.shopify.com/s/files/1/0780/8968/3251/files/";
const img = (file: string, w = 1400) => `${CDN}${file}?width=${w}`;

export const products: Product[] = [
  {
    slug: "korean-garlic-bun",
    name: "Korean Garlic Buns",
    category: "Breads & Breakfast",
    tagline: "Soft. Creamy. Unapologetically garlicky.",
    description:
      "South Korea's favourite street bake, reimagined in our kitchen on a whole-wheat base. Pillowy buns filled with cream cheese, roasted garlic butter and a bite of green chilli for an Indian twist. You will not stop at one.",
    price: "from ₹393",
    options: ["Buy 1 Get 1 Free", "Buy 4 Get 1 Free"],
    tags: ["Whole Wheat", "Eggless", "Bestseller"],
    ingredients: "Whole wheat flour, garlic, parmesan, cream cheese, dairy butter, fresh yeast, herbs, green chilli",
    allergens: "Wheat (gluten), dairy",
    image: img("KoreanGarlicBun1_1.jpg"),
    imageAlt: img("KoreanGarlicBun2_2.jpg"),
    accent: "#B8862B",
  },
  {
    slug: "black-dark-forest",
    name: "Dark Forest Cake",
    category: "Cakes & Bakes",
    tagline: "The classic your mum secretly loved too.",
    description:
      "Sour-cherry compote, vanilla chantilly and couverture ganache layered between our 'infinite' chocolate sponge — the recipe we cracked after an eternity of trials. Richer, darker and just the right amount of soft.",
    price: "from ₹389",
    options: ["Mini", "500g", "1 kg"],
    tags: ["Whole Wheat", "Eggless", "Celebration"],
    ingredients: "Whole wheat flour, cocoa, flax seed, sour cherry, vanilla bean, dairy cream, couverture chocolate",
    allergens: "Wheat (gluten), dairy",
    image: img("Black_Dark_Forest1_1.jpg"),
    imageAlt: img("Black_Dark_Forest2_2.jpg"),
    accent: "#5C0E0E",
  },
  {
    slug: "chocolate-cheesecake",
    name: "Chocolate Cheesecake",
    category: "Cakes & Bakes",
    tagline: "Our everlasting flavour, for the chocolate devoted.",
    description:
      "Dark couverture chocolate folded into a velvet cheesecake, crowned with our housemade hazelnut spread for the oomph we always chase. Set on a chocolate biscuit crust.",
    price: "from ₹375",
    options: ["Mini", "500g", "1 kg"],
    tags: ["Eggless", "Hazelnut", "Celebration"],
    ingredients: "Cream cheese, fresh cream, cocoa, chocolate, whole wheat flour, yogurt, chocolate biscuit crust",
    allergens: "Nuts, dairy, wheat (gluten)",
    image: img("image_7c6c3c15-c747-4e2b-922d-f962da2254ae.jpg"),
    imageAlt: img("ChocolateCheesecake1.jpg"),
    accent: "#3B2418",
  },
  {
    slug: "lemon-raspberry-cheesecake",
    name: "Lemon Berry Cheesecake",
    category: "Cakes & Bakes",
    tagline: "A little zing for the perfect balance of happiness.",
    description:
      "Refreshingly tangy lemon cheesecake on a thick, crunchy biscuit layer, topped with a glossy raspberry or blueberry compote. The dessert that converts chocolate loyalists.",
    price: "from ₹345",
    options: ["Mini", "500g", "1 kg", "Raspberry / Blueberry"],
    tags: ["Eggless", "Fruit Forward"],
    ingredients: "Cream cheese, whole wheat flour, lemon, unrefined raw sugar, vanilla, berries",
    allergens: "Nuts, wheat (gluten), dairy",
    image: img("LemonRaspberryCheesecake1_2.jpg"),
    imageAlt: img("LemonRaspberryCheesecake2_2.jpg"),
    accent: "#C4344F",
  },
  {
    slug: "lemon-blueberry-cheesecake",
    name: "Lemon Berry Pastry",
    category: "Cakes & Bakes",
    tagline: "The cheesecake, in a single perfect slice.",
    description:
      "Everything you love about our lemon berry cheesecake, portioned for one. Bright citrus, soft cream cheese, a berry compote that stains your fork purple.",
    price: "₹206",
    options: ["Blueberry", "Raspberry"],
    tags: ["Eggless", "Single Serve"],
    allergens: "Nuts, wheat (gluten), dairy",
    image: img("LemonRaspberryBB1.jpg"),
    imageAlt: img("LemonBlueberryRB3_1.jpg"),
    accent: "#6B4C9A",
  },
  {
    slug: "mocha-almond",
    name: "Mocha Almond Cake",
    category: "Cakes & Bakes",
    tagline: "Intoxicated by coffee? This is your cake.",
    description:
      "A tribute to our very first coffee ganache cake. Layers of dark cocoa sponge, almond meal and a coffee-kissed ganache that stays on your palate long after the last bite.",
    price: "from ₹438",
    options: ["Mini", "500g", "1 kg"],
    tags: ["Eggless", "Coffee", "Almond"],
    allergens: "Nuts, wheat (gluten), dairy",
    image: img("image_109f9402-335f-4647-baa9-5887f42d3c02.jpg"),
    accent: "#6F4A2E",
  },
  {
    slug: "chocolate-raspberry-cake",
    name: "Chocolate Raspberry Cake",
    category: "Cakes & Bakes",
    tagline: "Vegan. Gluten-free. Decadent anyway.",
    description:
      "Pure couverture chocolate and layers of our in-house gluten-free sponge, stacked on sweet-sour raspberry compote and finished with a mirror-glossy ganache. For lovers of tart fruit and dark cocoa.",
    price: "from ₹520",
    options: ["Mini", "500g", "1 kg"],
    tags: ["Vegan", "Gluten Free", "Celebration"],
    ingredients: "In-house gluten-free flour blend, cocoa, coconut milk, raw unrefined sugar, vanilla",
    allergens: "Contains nuts",
    image: img("IMG-4222.jpg"),
    accent: "#8E1B1B",
  },
  {
    slug: "tiramisu",
    name: "Tiramisu",
    category: "Cakes & Bakes",
    tagline: "A burst of flavour, in a jar.",
    description:
      "Espresso-soaked sponge, mascarpone cream and a dusting of cocoa, layered in a jar for every spoonful to hit right. Go sober, or opt for the one with rum.",
    price: "₹369",
    options: ["Without Rum", "With Rum"],
    tags: ["Eggless", "Coffee", "In a Jar"],
    image: img("image_8fd6d9be-01ed-45be-b14f-469dbce40fd4.jpg"),
    accent: "#4A3327",
  },
  {
    slug: "brownie",
    name: "Brownies",
    category: "Cakes & Bakes",
    tagline: "As mouth-melting as our garlic buns. Odd comparison, true story.",
    description:
      "Dense, fudgy and made with almond meal and whole wheat. Take them plain, crowned with ganache, or in a vegan & gluten-free walnut edition. Pack of three — sharing optional.",
    price: "from ₹280",
    options: ["Plain", "With Ganache", "Vegan & GF Walnut"],
    tags: ["Eggless", "Vegan Option", "Pack of 3"],
    allergens: "Nuts, wheat (gluten), dairy",
    image: img("image_70ecc31a-2407-4278-9b7e-1659b4ca31bf.jpg"),
    imageAlt: img("SKP04913.jpg"),
    accent: "#2A1A14",
  },
  {
    slug: "babka",
    name: "Chocolate Babka",
    category: "Breads & Breakfast",
    tagline: "Braided, buttery, ribboned with dark chocolate.",
    description:
      "An enriched bread swirled with dark chocolate ganache and baked until the edges caramelise. Tear it, toast it, or eat it standing at the counter — we won't tell.",
    price: "from ₹210",
    options: ["Pack of 3", "Pack of 6"],
    tags: ["Eggless", "Enriched Bread"],
    image: img("image.jpg"),
    accent: "#5A3A2A",
  },
  {
    slug: "pesto-pinwheels",
    name: "Pesto Pinwheels",
    category: "Breads & Breakfast",
    tagline: "Stretch, pull, repeat.",
    description:
      "Fluffy whole-wheat dough rolled around freshly ground basil-walnut pesto and a blend of mozzarella and cheddar. Reheats beautifully, though we doubt they'll last that long.",
    price: "from ₹249",
    options: ["Pack of 2", "Pack of 4"],
    tags: ["Whole Wheat", "Savoury", "Eggless"],
    ingredients: "Whole wheat flour, basil, walnut, olive oil, butter, milk, fresh yeast",
    allergens: "Dairy, gluten, nuts",
    image: img("9BD2D929-19DA-47A0-9BF7-955D495FD40E.jpg"),
    imageAlt: img("4C397CB2-4031-4CCB-A5D5-1DA952F2DA1E.jpg"),
    accent: "#4F6B3A",
  },
  {
    slug: "quiche",
    name: "Quiche",
    category: "Breads & Breakfast",
    tagline: "Our take on the buttery French classic.",
    description:
      "Golden-topped whole-wheat pastry filled with fresh vegetables and cheddar. Corn & Cheese is the all-time favourite; Mushroom Jalapeño brings the sour-spice.",
    price: "from ₹180",
    options: ["Corn & Cheese", "Mushroom Jalapeño", "Pack of 2 / 5"],
    tags: ["Savoury", "Whole Wheat"],
    allergens: "Dairy, gluten",
    image: img("IMG-4213.jpg"),
    imageAlt: img("IMG-4214.jpg"),
    accent: "#C98A2B",
  },
  {
    slug: "baked-vada-pav",
    name: "Baked Vada Pav",
    category: "Breads & Breakfast",
    tagline: "Mumbai's street icon, with a baker's twist.",
    description:
      "Spiced potato vada tucked inside a soft whole-wheat bun and baked, not fried. Brushed with curry-leaf oil and served with our green chutney. Mumbai in one bite.",
    price: "from ₹150",
    tags: ["Baked Not Fried", "Whole Wheat", "Mumbai Special"],
    image: img("315E3FA2-A72E-4A55-8D98-923C7CA549A7.jpg"),
    imageAlt: img("E07B904D-50FF-4F08-AF37-6B93EE4C370D.jpg"),
    accent: "#B5551F",
  },
  {
    slug: "sandwich-loaf",
    name: "Sandwich Loaf",
    category: "Breads & Breakfast",
    tagline: "Pure whole wheat. No artificial colour. Enough said.",
    description:
      "A hearty, nutty loaf made with just whole wheat flour, fresh yeast, water, salt and butter. Best served toasted. Subscribe and have it land at your door every 3, 7 or 15 days.",
    price: "from ₹105",
    options: ["One-time", "Every 3 / 7 / 15 days"],
    tags: ["100% Whole Wheat", "Subscription", "Eggless"],
    allergens: "Dairy, gluten",
    image: img("CD00D9FF-3856-45C4-A134-94612C47C3D5.jpg"),
    accent: "#A67C52",
  },
  {
    slug: "ladi-pav-pack-of-6",
    name: "Ladi Pav",
    category: "Breads & Breakfast",
    tagline: "The bun that built Mumbai.",
    description:
      "Soft, pull-apart pav baked in a ladi of six — the way it should be. For your pav bhaji nights, misal mornings and everything in between.",
    price: "₹99",
    options: ["Pack of 6"],
    tags: ["Fresh Daily", "Eggless"],
    image: img("E77CDA1D-3EA7-415A-9C31-0FC5568A151E.jpg"),
    accent: "#D9A35A",
  },
  {
    slug: "banana-walnut-tea-cake",
    name: "Banana Walnut Tea Cake",
    category: "Cakes & Bakes",
    tagline: "The loaf that makes a Tuesday feel like Sunday.",
    description:
      "Ripe bananas, toasted walnuts and warm spice in a moist whole-wheat loaf. No refined sugar, no refined flour, all comfort. Slice thick, pair with chai.",
    price: "₹620",
    options: ["Loaf"],
    tags: ["No Refined Sugar", "Whole Wheat", "Tea Time"],
    image: img("image.heic") + "&format=jpg",
    accent: "#8C6A3D",
  },
  {
    slug: "cupcakes",
    name: "Cupcakes",
    category: "Cakes & Bakes",
    tagline: "A little sunny sin, four at a time.",
    description:
      "Four brand-new flavours in one box: Red Velvet, Vanilla Crumble, Chocolate Ganache and Lemon Blueberry. Pick a favourite or go assorted. Part of our #SinfulEdit — yes, this one has table sugar.",
    price: "₹413",
    options: ["Red Velvet", "Vanilla Crumble", "Chocolate Ganache", "Lemon Blueberry", "Assorted"],
    tags: ["Pack of 4", "#SinfulEdit"],
    image: img("IMG-0183.jpg"),
    accent: "#C9506A",
  },
  {
    slug: "cake-truffels",
    name: "Cake Truffles",
    category: "Cakes & Bakes",
    tagline: "Bite-sized celebrations.",
    description:
      "Cake, crumbled and rolled with ganache, then enrobed in chocolate. Strawberry, almond, coffee — or an assortment when you can't decide (you can't).",
    price: "from ₹369",
    options: ["Pack of 6", "Pack of 12", "Strawberry / Almond / Coffee / Assorted"],
    tags: ["Eggless", "Gifting"],
    image: img("IMG-4927.jpg"),
    accent: "#7A2E3F",
  },
  {
    slug: "see-salt-cookies",
    name: "Sea Salt Chocolate Cookies",
    category: "Cookies",
    tagline: "Classic firsts. Easily the first thing to try.",
    description:
      "Crunchy edges, soft centre, pools of dark couverture and a flake of sea salt on top. Whole wheat, unrefined raw sugar, and available vegan. Pack of six.",
    price: "₹420",
    options: ["Vegan", "Non Vegan"],
    tags: ["Whole Wheat", "Vegan Option", "Bestseller"],
    ingredients: "Whole wheat flour, unrefined raw sugar, couverture dark chocolate, butter, vanilla",
    allergens: "Wheat (gluten), dairy",
    image: img("image_33704d4b-1a8b-4696-a8f2-93047c0263b1.jpg"),
    accent: "#3C2A21",
  },
  {
    slug: "nutter-butter-cookies",
    name: "Nutter Butter Cookies",
    category: "Cookies",
    tagline: "What delicious dreams are made of.",
    description:
      "Smooth housemade hazelnut spread wrapped in gluten-free flours with a vegan structure and shards of dark chocolate. Pack of six, entirely guilt-free.",
    price: "₹420",
    tags: ["Vegan", "Gluten Free", "Hazelnut"],
    image: img("image_ee07a5f0-74f6-43e1-9cbf-bb95af4111f7.jpg"),
    imageAlt: img("image_24713d8a-55be-4f4c-ac5b-36ecc9a22b99.jpg"),
    accent: "#8A5A2B",
  },
  {
    slug: "cookies-pack-of-5",
    name: "Cookie Box",
    category: "Cookies",
    tagline: "Six cookies. Zero refined anything.",
    description:
      "Choose Sea Salt, Nutter Butter, Double Chocolate — or mix them. Whole wheat flour, unrefined raw sugar, couverture dark chocolate and dairy butter, baked in small batches.",
    price: "₹420",
    options: ["Sea Salt", "Nutter Butter", "Double Chocolate", "Mixed"],
    tags: ["Pack of 6", "Whole Wheat", "Gifting"],
    allergens: "Wheat (gluten), dairy",
    image: img("image_24713d8a-55be-4f4c-ac5b-36ecc9a22b99.jpg"),
    accent: "#6B3F2A",
  },
  {
    slug: "drop-cookies",
    name: "Button Cookies · Sweet",
    category: "Cookies",
    tagline: "Cute as a button. Dangerously addictive.",
    description:
      "Crunchy little butter cookies on a whole-wheat base with unrefined raw sugar, in Vanilla, Chocolate and Coffee. Order a jar for post-meal munching. We couldn't keep our hands off either.",
    price: "₹180",
    options: ["Vanilla", "Chocolate", "Coffee", "Mixed"],
    tags: ["Whole Wheat", "80g Jar"],
    allergens: "Wheat (gluten), dairy",
    image: img("image_9a37dbc5-c9a4-4eb5-a484-e8039d12eb02.jpg"),
    accent: "#B07E3E",
  },
  {
    slug: "button-cookies-savoury",
    name: "Button Cookies · Savoury",
    category: "Cookies",
    tagline: "Old-school flavours for your cup of chai.",
    description:
      "Bite-sized butter cookies with a savoury twist — Oregano Chilli and Turmeric Cumin. The crunch you'll forever want beside a cup of tea, at work or at home.",
    price: "₹180",
    options: ["Turmeric Cumin", "Oregano Chilli", "Mixed"],
    tags: ["Savoury", "80g Jar", "Cheddar"],
    allergens: "Wheat (gluten), dairy",
    image: img("C40C0C86-47CC-4C07-AF9A-F8352816EB1D.jpg"),
    accent: "#C9822B",
  },
  {
    slug: "button-cookies-pack-of-3",
    name: "Button Cookie Trio",
    category: "Cookies",
    tagline: "Three jars. Every mood covered.",
    description:
      "A gift-ready set of three button cookie jars in curated combinations — coffee, chocolate, vanilla, oregano and turmeric. The prettiest thing to land on a desk.",
    price: "₹529",
    options: ["Coffee · Chocolate · Vanilla", "Oregano · Chocolate · Coffee", "Oregano · Turmeric · Coffee"],
    tags: ["Gifting", "3 Jars", "Save ₹470"],
    image: img("image_9a37dbc5-c9a4-4eb5-a484-e8039d12eb02.webp"),
    imageAlt: img("C40C0C86-47CC-4C07-AF9A-F8352816EB1D.webp"),
    accent: "#9E6B2F",
  },
  {
    slug: "granola",
    name: "Almond Cranberry Granola",
    category: "Pantry",
    tagline: "Started as an experiment. Turned out right.",
    description:
      "Mostly almonds, with rolled oats, cranberries, coconut and vanilla — clusters that satisfy the sweet-sour craving and keep you full for hours. Eat it by the handful or over cold vegan milk.",
    price: "from ₹480",
    options: ["250g", "500g"],
    tags: ["Vegan", "No Refined Sugar", "Breakfast"],
    ingredients: "Almonds, rolled oats, cranberry, vanilla, desiccated coconut, unrefined raw sugar",
    allergens: "Contains nuts",
    image: img("A0735FBA-35A4-410E-A4B5-65865F0C6292.jpg"),
    imageAlt: img("70B1ACD6-277E-4C03-A8D5-DC7AFE9BFD91.jpg"),
    accent: "#A8452F",
  },
  {
    slug: "hazelnut-spread-jar",
    name: "Hazelnut Spread",
    category: "Pantry",
    tagline: "Nut butter in its purest form. No oil.",
    description:
      "Pure roasted hazelnuts and couverture chocolate, nothing else. A guilt-free alternative to store-bought spreads — the same jar we swirl onto our cheesecakes and cookies. 180g.",
    price: "₹599",
    tags: ["No Oil", "Vegan", "180g Jar"],
    allergens: "Contains nuts",
    image: img("IMG_7225.jpg"),
    accent: "#4E2E1E",
  },
];

export const categories: Category[] = ["Breads & Breakfast", "Cakes & Bakes", "Cookies", "Pantry"];

export const testimonials = [
  {
    name: "Tulsi C.",
    text: "Finally a bakery that takes ingredients as seriously as taste. The Korean garlic buns disappeared within minutes of arriving.",
  },
  {
    name: "Umesh W.",
    text: "Ordered the Dark Forest for my mother's birthday. No refined sugar and she couldn't tell — that's the highest compliment.",
  },
  {
    name: "Sourav D.",
    text: "The sea salt cookies are dangerous. Customer service is warm, delivery was on time, packaging was gorgeous.",
  },
];
