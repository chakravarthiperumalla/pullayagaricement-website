/*
 * Product catalog for Sri Rama Mohana Agencies (static data, no server).
 *
 * How to edit:
 *  - Add a brand to BRANDS, then add its products with p(...) at the bottom.
 *  - p(id, brandId, categoryId, name, shape, tint, teLine, description, features[], applications[], specs{})
 *  - `applications` use the keys in APPS (English + Telugu live there once, reused everywhere).
 *  - Later, this file can be replaced by a fetch() from an API with the same shape.
 *
 * Product facts were summarised from each manufacturer's own website (see `site` on every brand).
 * Cement has no prices on purpose: rates change daily, customers ask on WhatsApp.
 * Godrej: every model from the Godrej price list (w.e.f. 1 July 2026) with its finishes and MRP range; prices are negotiable.
 */
(function () {
  'use strict';

  /* ---------- colours used by the 3D models and flat thumbnails (our own palette, not brand logos) ---------- */
  var TINT = {
    kraft: '#C9A06A', grey: '#9DA3A8', white: '#EDEDEA', slate: '#56646F',
    orange: '#F58220', teal: '#2F8079', brick: '#B4543D', mustard: '#D9A524', ink: '#2B2528',
    /* brand colours, used by the hero pallet */
    'b-ultratech': '#F7D117', 'b-ambuja': '#2A6EBB', 'b-kcp': '#D99A1E', 'b-ramco': '#1D3B7A', 'b-nagarjuna': '#E0561F',
    'b-fosroc': '#E2231A', 'b-fevicol': '#1B4F9C', 'b-godrej': '#7A1F3D', 'b-birlawhite': '#EDEDEA',
    'b-bharathi': '#E06A1B', 'b-dalmia': '#1F4FA3', 'b-chettinad': '#F2C318', 'b-shree': '#C8232C', 'b-penna': '#1D6FB8',
    'b-sagar': '#2E8B3E', 'b-maha': '#F4D21F', 'b-indiacements': '#2C4C9C'
  };

  /* ---------- where a product is used (English, Telugu) ---------- */
  var APPS = {
    found: ['Foundations', 'పునాదులు'],
    rcc: ['Slabs, beams & columns', 'స్లాబ్, బీమ్, కాలమ్'],
    plaster: ['Wall plastering', 'గోడ ప్లాస్టరింగ్'],
    masonry: ['Brick & block work', 'ఇటుక, బ్లాక్ పని'],
    floor: ['Floors & screeds', 'ఫ్లోర్, స్క్రీడ్'],
    precast: ['Precast blocks, pavers & sheets', 'ప్రీకాస్ట్ బ్లాక్స్, పేవర్స్, షీట్లు'],
    infra: ['Bridges, flyovers & tunnels', 'వంతెనలు, ఫ్లైఓవర్లు, సొరంగాలు'],
    coast: ['Coastal & salty conditions', 'తీర ప్రాంతం, ఉప్పు వాతావరణం'],
    dock: ['Ports, docks & dams', 'ఓడరేవులు, డ్యామ్‌లు'],
    rail: ['Railway sleepers', 'రైల్వే స్లీపర్లు'],
    rmc: ['High-grade & ready-mix concrete', 'హై-గ్రేడ్, రెడీ-మిక్స్ కాంక్రీట్'],
    roof: ['Roofs & terraces', 'రూఫ్, టెర్రస్'],
    wet: ['Bathrooms & wet areas', 'బాత్‌రూమ్‌లు, తడి ప్రదేశాలు'],
    extwall: ['Exterior walls', 'బయటి గోడలు'],
    damp: ['Damp-proofing foundations & basements', 'పునాది, బేస్‌మెంట్ తేమ నివారణ'],
    tank: ['Water tanks', 'నీటి ట్యాంకులు'],
    balc: ['Balconies', 'బాల్కనీలు'],
    putty: ['Wall putty & smoothing', 'వాల్ పుట్టీ, నునుపు చేయడం'],
    paintbase: ['Base for paint', 'పెయింట్ కింద బేస్'],
    texture: ['Decorative textures', 'డెకరేటివ్ టెక్స్చర్లు'],
    whitework: ['White cement work', 'వైట్ సిమెంట్ పని'],
    tile: ['Tile & stone fixing', 'టైల్స్, రాయి అతికించడం'],
    grout: ['Tile joints', 'టైల్ జాయింట్లు'],
    crack: ['Cracks & concrete repair', 'పగుళ్లు, కాంక్రీట్ మరమ్మతు'],
    bond: ['Bonding new to old concrete', 'పాత-కొత్త కాంక్రీట్ బంధం'],
    anchor: ['Machinery & bolt grouting', 'మెషినరీ, బోల్ట్ గ్రౌటింగ్'],
    wood: ['Furniture & woodwork', 'ఫర్నిచర్, చెక్క పని'],
    lam: ['Laminates & veneers', 'లామినేట్లు, వీనీర్లు'],
    plastic: ['PVC & acrylic sheets', 'PVC, యాక్రిలిక్ షీట్లు'],
    glass: ['Glass, marble & granite', 'గాజు, మార్బుల్, గ్రానైట్'],
    repair: ['Household & metal repairs', 'ఇంటి, మెటల్ మరమ్మతులు'],
    seal: ['Sealing joints & gaps', 'జాయింట్లు, ఖాళీల సీలింగ్'],
    door: ['Main doors & gates', 'మెయిన్ డోర్లు, గేట్లు'],
    shop: ['Shutters, godowns & shops', 'షట్టర్లు, గోడౌన్లు, షాపులు'],
    box: ['Boxes, trunks & lockers', 'పెట్టెలు, ట్రంక్‌లు, లాకర్లు'],
    cup: ['Cupboards & furniture', 'అల్మారాలు, ఫర్నిచర్'],
    indoor: ['Room doors', 'గది తలుపులు'],
    smart: ['Keyless & smart entry', 'డిజిటల్, కీలెస్ ఎంట్రీ'],
    cool: ['Cooler walls', 'చల్లని గోడలు'],
    sand: ['Concrete & plaster sand', 'కాంక్రీట్, ప్లాస్టర్ ఇసుక']
  };

  /* ---------- labels for the spec table ---------- */
  var SPEC_LABELS = {
    type: ['Type', 'రకం'], grade: ['Grade', 'గ్రేడ్'], std: ['Standard', 'ప్రమాణం'],
    pack: ['Pack', 'ప్యాక్'], form: ['Form', 'రూపం'], variants: ['Variants', 'రకాలు'],
    body: ['Body', 'బాడీ'], shackle: ['Shackle', 'షాకిల్'], keys: ['Keys', 'తాళాలు'], warranty: ['Warranty', 'వారంటీ']
  };

  /* ---------- categories (shown on the home page and as the first level of browsing) ---------- */
  var CATEGORIES = [
    { id: 'cement', shape: 'bag', tint: 'kraft', en: 'Cement', te: 'సిమెంట్',
      introEn: 'Grey cement for foundations, slabs, brickwork and plaster. Pick the type by the job: OPC for strength and speed, PPC for durability and plaster, slag cement where moisture or salts are a problem.',
      introTe: 'పునాదులు, స్లాబ్‌లు, ఇటుక పని, ప్లాస్టరింగ్‌కు గ్రే సిమెంట్. పనిని బట్టి రకం ఎంచుకోండి: బలం కోసం OPC, మన్నిక–ప్లాస్టర్ కోసం PPC.' },
    { id: 'white', shape: 'sack', tint: 'white', en: 'White cement & wall finishes', te: 'వైట్ సిమెంట్ & వాల్ ఫినిష్',
      introEn: 'White cement, wall putty and textures for the layer you see: a smooth base for paint, waterproof putty for wet walls and decorative finishes.',
      introTe: 'వైట్ సిమెంట్, వాల్ పుట్టీ, టెక్స్చర్లు: పెయింట్ కింద నునుపైన బేస్, తడి గోడలకు వాటర్‌ప్రూఫ్ పుట్టీ.' },
    { id: 'drymix', shape: 'sack', tint: 'grey', en: 'Plaster, tile fix & dry-mix', te: 'ప్లాస్టర్, టైల్ ఫిక్స్ & డ్రై-మిక్స్',
      introEn: 'Ready-to-mix bags for plaster, tile fixing, grouting, block work and levelling floors. Add water on site and get a consistent mix.',
      introTe: 'ప్లాస్టర్, టైల్ ఫిక్సింగ్, గ్రౌటింగ్, బ్లాక్ పని కోసం రెడీ-టు-మిక్స్ బ్యాగ్‌లు. సైట్‌లో నీరు కలిపితే చాలు.' },
    { id: 'chem', shape: 'pail', tint: 'teal', en: 'Waterproofing & repair chemicals', te: 'వాటర్‌ప్రూఫింగ్ & రిపేర్ కెమికల్స్',
      introEn: 'Roof and bathroom waterproofing, damp-proofing, bonding agents and repair products. We deal in all waterproofing work.',
      introTe: 'రూఫ్, బాత్‌రూమ్ వాటర్‌ప్రూఫింగ్, తేమ నివారణ, బాండింగ్ ఏజెంట్లు, రిపేర్ ఉత్పత్తులు. అన్ని రకాల వాటర్‌ప్రూఫింగ్ పనులు.' },
    { id: 'adhesive', shape: 'bottle', tint: 'mustard', en: 'Adhesives & sealants', te: 'అడ్హెసివ్స్ & సీలెంట్స్',
      introEn: 'Glues for wood, laminates, glass and metal, plus sealants for joints and gaps.',
      introTe: 'చెక్క, లామినేట్, గాజు, మెటల్ కోసం జిగురులు; జాయింట్లకు సీలెంట్లు.' },
    { id: 'hardware', shape: 'padlock', tint: 'ink', en: 'Locks', te: 'లాక్స్',
      introEn: 'Godrej digital, mortise, rim and cylindrical locks, padlocks and furniture locks: every model from the Godrej price list, with its finishes and MRP range.',
      introTe: 'ఇళ్లు, షాపులు, గోడౌన్ల కోసం తాళాలు, డోర్ లాక్స్, డిజిటల్ లాక్స్, హ్యాండిల్స్.' },
    { id: 'doorfit', shape: 'mortise', tint: 'orange', en: 'Door handles & fittings', te: 'డోర్ హ్యాండిల్స్ & ఫిట్టింగ్స్',
      introEn: 'Godrej home decor handles (HDH, NEH and designer rose and plate handles), pull handles, door closers, hinges, aldrops, tower bolts and door stoppers, with every finish and the MRP range.',
      introTe: 'గోద్రెజ్ డోర్ హ్యాండిల్స్, పుల్ హ్యాండిల్స్, డోర్ క్లోజర్లు, హింజెస్, ఆల్డ్రాప్స్, టవర్ బోల్ట్స్: ప్రతి మోడల్, ఫినిష్‌లు, MRP రేంజ్‌తో.' },
    { id: 'kitchen', shape: 'block', tint: 'grey', en: 'Kitchen, wardrobe & furniture fittings', te: 'కిచెన్, వార్డ్‌రోబ్ & ఫర్నిచర్ ఫిట్టింగ్స్',
      introEn: 'Godrej kitchen baskets and SKIDO systems, Slim Ergo drawers, aluminium Gola profiles, HIKIDO sliding systems, Neulift bed fittings, cabinet hinges and drawer channels.',
      introTe: 'గోద్రెజ్ కిచెన్ బాస్కెట్లు, స్కిడో, స్లిమ్ ఎర్గో డ్రాయర్లు, అల్యూమినియం ప్రొఫైల్స్, హికిడో, న్యూలిఫ్ట్ బెడ్ ఫిట్టింగ్స్, క్యాబినెట్ హింజెస్.' },
    { id: 'paint', shape: 'can', tint: 'orange', en: 'Paints', te: 'పెయింట్స్', ask: true,
      introEn: 'Interior and exterior paints for new houses and repaints. Brand list coming soon.',
      introTe: 'కొత్త ఇళ్లకు, రీపెయింట్‌కు ఇంటీరియర్, ఎక్స్‌టీరియర్ పెయింట్స్. బ్రాండ్ల జాబితా త్వరలో.' },
    { id: 'steel', shape: 'rebar', tint: 'slate', en: 'Steel & TMT bars', te: 'స్టీల్ & TMT కడ్డీలు', ask: true,
      introEn: 'TMT bars for foundations, columns and slabs. Brand list coming soon.',
      introTe: 'పునాదులు, కాలమ్‌లు, స్లాబ్‌ల కోసం TMT కడ్డీలు. బ్రాండ్ల జాబితా త్వరలో.' }
  ];

  /* ---------- brands (every brand printed on the visiting card) ---------- */
  var BRANDS = [
    { id: 'ultratech', name: 'UltraTech', te: 'అల్ట్రాటెక్', by: 'Aditya Birla Group', site: 'https://www.ultratechcement.com/for-homebuilders/products/overview',
      en: `UltraTech calls itself India's No.1 cement. Its range covers grey cement, white cement through Birla White, ready-mix concrete and building products such as waterproofing systems and ready-mix plaster. The UltraTech site also lists Super, Premium and Super Plus cements: ask us which are in stock.`,
      tel: 'అల్ట్రాటెక్ ఆదిత్య బిర్లా గ్రూప్ బ్రాండ్. గ్రే సిమెంట్‌తో పాటు వాటర్‌ప్రూఫింగ్, రెడీ-మిక్స్ ప్లాస్టర్ వంటి బిల్డింగ్ ప్రొడక్ట్స్ కూడా ఉన్నాయి.' },
    { id: 'ambuja', name: 'Ambuja', te: 'అంబుజా', by: 'Ambuja Cements (Adani Group)', site: 'https://www.ambujahelp.in/all-products',
      en: `Ambuja offers cement for everyday building and premium grades for leak-proofing, strength and lower carbon, along with Cool Walls blocks and Purasand. It works alongside ACC under the Adani group.`,
      tel: 'అంబుజా: రోజువారీ నిర్మాణానికి సిమెంట్, లీక్-ప్రూఫ్ కోసం ప్రీమియం గ్రేడ్‌లు, కూల్ వాల్స్ బ్లాక్స్, ప్యూరాసాండ్.' },
    { id: 'kcp', name: 'KCP', te: 'కేసీపీ', by: 'The KCP Limited', site: 'http://www.kcp.co.in/cement.html',
      en: `KCP makes cement at Macherla and Muktyala in Andhra Pradesh. It has supplied large projects such as the Nagarjuna Sagar and Srisailam dams and the Polavaram irrigation project, and is known for columns, beams and slabs.`,
      tel: 'కేసీపీ సిమెంట్ ఆంధ్రప్రదేశ్‌లోని మాచర్ల, ముక్త్యాలలో తయారవుతుంది. నాగార్జున సాగర్, శ్రీశైలం, పోలవరం ప్రాజెక్టులకు సరఫరా చేసింది.' },
    { id: 'ramco', name: 'Ramco', te: 'రామ్కో', by: 'The Ramco Cements', site: 'https://ramcocements.in/offering/cement',
      en: `Ramco makes OPC and blended cements for structural work, brick fixing and plastering. Its dry-mix and construction chemical range is sold under the Hard Worker brand.`,
      tel: 'రామ్కో: స్ట్రక్చరల్ పనులు, ఇటుక పని, ప్లాస్టరింగ్ కోసం OPC, బ్లెండెడ్ సిమెంట్లు. డ్రై-మిక్స్ ఉత్పత్తులు హార్డ్ వర్కర్ పేరుతో.' },
    { id: 'nagarjuna', name: 'Nagarjuna', te: 'నాగార్జున', by: 'NCL Industries', site: 'https://nagarjunacement.com/',
      en: `Nagarjuna Cement is an NCL Industries brand, established in the 1980s in Andhra Pradesh. It supplies OPC and PPC grades in 50 kg bags, plus a slag cement for coastal areas.`,
      tel: 'నాగార్జున సిమెంట్: 1980లలో ఆంధ్రప్రదేశ్‌లో ప్రారంభమైన NCL ఇండస్ట్రీస్ బ్రాండ్. 50 కిలోల బ్యాగుల్లో OPC, PPC.' },
    { id: 'bharathi', name: 'Bharathi Cement', te: 'భారతి సిమెంట్', by: 'Vicat group (Bharathi Cement Corporation)', site: 'https://www.bharathicement.com/products.php',
      en: `Bharathi Cement makes cement at Kadapa, Andhra Pradesh, with German technology, as part of the French Vicat group. It sells OPC 43, OPC 53, PPC and PSC in tamper-proof 50 kg bags across 7 states.`,
      tel: 'భారతి సిమెంట్: కడప, ఆంధ్రప్రదేశ్‌లో వికాట్ గ్రూప్ తయారీ. OPC 43, OPC 53, PPC, PSC టాంపర్-ప్రూఫ్ బ్యాగ్‌లలో.' },
    { id: 'dalmia', name: 'Dalmia Bharat', te: 'దాల్మియా భారత్', by: 'Dalmia Bharat Cement', site: 'https://www.dalmiacement.com/products-services/consumer-products',
      en: `Dalmia Bharat Cement has a plant at Kadapa, Andhra Pradesh. Its range covers PPC, PCC, PSC and OPC 43/53, plus premium DSP and Infra Pro for large projects.`,
      tel: 'దాల్మియా భారత్: కడపలో ప్లాంట్. PPC, PSC, OPC, ప్రీమియం DSP, పెద్ద ప్రాజెక్టులకు ఇన్‌ఫ్రా ప్రో.' },
    { id: 'chettinad', name: 'Chettinad Cement', te: 'చెట్టినాడ్ సిమెంట్', by: 'Chettinad Cement Corporation', site: 'https://www.chettinadcement.com/products/',
      en: `Chettinad Cement has been in the cement business for three generations and runs a plant in Andhra Pradesh. Its range includes Maxcrete premium PPC, Super Grade PPC, Hollow Block Cement, Composite, OPC 43/53 and Classic slag cement.`,
      tel: 'చెట్టినాడ్ సిమెంట్: మాక్స్‌క్రీట్, సూపర్ గ్రేడ్ PPC, హాలో బ్లాక్ సిమెంట్, కాంపోజిట్, OPC, స్లాగ్ సిమెంట్.' },
    { id: 'shree', name: 'Shree Cement (Bangur)', te: 'శ్రీ సిమెంట్ (బంగూర్)', by: 'Shree Cement Ltd', site: 'https://www.bangurcement.com/product/bangur-roofon',
      en: `Shree Cement is one of India's top three cement makers and sells under the Bangur brand: Roofon Plus, Magna, Jungrodhak, Powermax and Rockstrong.`,
      tel: 'శ్రీ సిమెంట్: బంగూర్ బ్రాండ్‌తో రూఫాన్ ప్లస్, మాగ్నా, జంగ్‌రోధక్, పవర్‌మ్యాక్స్, రాక్‌స్ట్రాంగ్.' },
    { id: 'penna', name: 'Penna Cement', te: 'పెన్నా సిమెంట్', by: 'Penna Cement Industries (Adani group)', site: 'https://immadi.net/penna-cement/',
      en: `Penna Cement runs plants in Andhra Pradesh and Telangana and is now part of the Adani group. Its range: Power PPC, Suraksha PSC, Premium OPC 43/53 and Concrete Guard for house builders.`,
      tel: 'పెన్నా సిమెంట్: ఆంధ్ర, తెలంగాణలో ప్లాంట్లు. పవర్ PPC, సురక్ష PSC, ప్రీమియం OPC, కాంక్రీట్ గార్డ్.' },
    { id: 'sagar', name: 'Sagar Cements', te: 'సాగర్ సిమెంట్స్', by: 'Sagar Cements Ltd', site: 'https://sagarcements.in/about/overview',
      en: `Sagar Cements is a cement maker in the Krishna river basin with 11 MTPA capacity. It makes OPC 53 and 43, PPC, sulphate-resisting cement, slag cement and GGBS.`,
      tel: 'సాగర్ సిమెంట్స్: కృష్ణా పరీవాహక ప్రాంతంలో తయారీ. OPC 53, 43, PPC, స్లాగ్ సిమెంట్.' },
    { id: 'maha', name: 'Maha Cement', te: 'మహా సిమెంట్', by: 'My Home Industries', site: 'https://www.mahacement.com/',
      en: `Maha Cement is made by My Home Industries, with plants in Telangana and Andhra Pradesh. Its range: Maha HD+ PPC, Solid HD+, Solid Concrete Special and slag cement.`,
      tel: 'మహా సిమెంట్ (మై హోమ్ ఇండస్ట్రీస్): మహా HD+, సాలిడ్ HD+, కాంక్రీట్ స్పెషల్, స్లాగ్ సిమెంట్.' },
    { id: 'indiacements', name: 'India Cements', te: 'ఇండియా సిమెంట్స్', by: 'The India Cements Ltd', site: 'https://en.wikipedia.org/wiki/India_Cements',
      en: `India Cements makes the Coromandel King, Sankar Super Power and Raasi Gold brands, well known across Andhra Pradesh and Tamil Nadu.`,
      tel: 'ఇండియా సిమెంట్స్: కోరమాండల్ కింగ్, శంకర్ సూపర్ పవర్, రాశి గోల్డ్ బ్రాండ్లు.' },
    { id: 'birlawhite', name: 'Birla White', te: 'బిర్లా వైట్', by: 'UltraTech', site: 'https://www.birlawhite.com/en',
      en: `Birla White makes white-cement-based products: white cement, WallCare and WallSeal putties, Level Plast, Textura wall textures and cement wash.`,
      tel: 'బిర్లా వైట్: వైట్ సిమెంట్ ఆధారిత ఉత్పత్తులు: వైట్ సిమెంట్, వాల్‌కేర్ పుట్టీ, టెక్స్చురా, సిమెంట్ వాష్.' },
    { id: 'hardworker', name: 'Hard Worker', te: 'హార్డ్ వర్కర్', by: 'The Ramco Cements', site: 'https://www.hardworker.com/',
      en: `Hard Worker is the construction-chemicals and dry-mix brand of The Ramco Cements: tile adhesives, grouts, plaster, block fix, floor screed, waterproofing and repair products for floors, walls and structures.`,
      tel: 'హార్డ్ వర్కర్: రామ్కో కన్స్ట్రక్షన్ కెమికల్స్ & డ్రై-మిక్స్ బ్రాండ్: టైల్ అడ్హెసివ్, గ్రౌట్, ప్లాస్టర్, బ్లాక్ ఫిక్స్, వాటర్‌ప్రూఫింగ్.' },
    { id: 'fosroc', name: 'Fosroc', te: 'ఫాస్రాక్', by: 'Fosroc', site: 'https://www.fosroc.com/solutions/waterproofing',
      en: `Fosroc is a construction-chemicals brand. Its waterproofing range runs from basement to roof, with coatings, membranes, sealants and repair products. Ask us which Fosroc products are on the shelf today.`,
      tel: 'ఫాస్రాక్: కన్స్ట్రక్షన్ కెమికల్స్ బ్రాండ్. బేస్‌మెంట్ నుంచి రూఫ్ వరకు వాటర్‌ప్రూఫింగ్ కోటింగ్స్, సీలెంట్లు, రిపేర్ ఉత్పత్తులు.' },
    { id: 'astral', name: 'Astral Adhesives', te: 'ఆస్ట్రల్ అడ్హెసివ్స్', by: 'Astral Limited', site: 'https://www.astraladhesives.com/',
      en: `Astral Adhesives makes adhesives, sealants, putties and construction chemicals under brands such as Bondtite and Resibond. We are distributors for Astral Adhesives.`,
      tel: 'ఆస్ట్రల్ అడ్హెసివ్స్: బాండ్‌టైట్, రెసిబాండ్ వంటి బ్రాండ్లతో జిగురులు, సీలెంట్లు. మేము ఆస్ట్రల్ అడ్హెసివ్స్ డిస్ట్రిబ్యూటర్లం.' },
    { id: 'fevicol', name: 'Fevicol', te: 'ఫెవికాల్', by: 'Pidilite', site: 'https://fevicol.in/',
      en: `Fevicol, from Pidilite, has been a trusted adhesive brand for over 50 years. There are variants for woodwork, laminates, PVC and acrylic sheets, waterproof joints and quick setting.`,
      tel: 'ఫెవికాల్ (పిడిలైట్): 50 ఏళ్లకు పైగా నమ్మకమైన జిగురు. చెక్క పని, లామినేట్, PVC, వాటర్‌ప్రూఫ్ జాయింట్లకు వేర్వేరు రకాలు.' },
    { id: 'godrej', name: 'Godrej', te: 'గోద్రెజ్', by: 'Godrej Enterprises Group', site: 'https://www.godrejenterprises.com/locks-and-security/locks',
      en: `Godrej makes locks and architectural fittings: padlocks, rim, mortise and cylindrical locks, digital locks, furniture locks and home handles. Godrej says its padlocks have been made since 1897.`,
      tel: 'గోద్రెజ్: తాళాలు, ఆర్కిటెక్చరల్ ఫిట్టింగ్స్: ప్యాడ్‌లాక్స్, మోర్టైజ్ లాక్స్, డిజిటల్ లాక్స్, హ్యాండిల్స్. 1897 నుంచి తాళాల తయారీ.' }
  ];

  /* ---------- products ---------- */
  var PRODUCTS = [];
  function p(id, brand, cat, name, shape, tint, te, desc, feats, apps, specs) {
    PRODUCTS.push({ id: id, brand: brand, cat: cat, name: name, shape: shape, tint: tint, te: te, desc: desc, feats: feats || [], apps: apps || [], specs: specs || {} });
  }
  var BAG = '50 kg bag (standard)';

  /* ===== UltraTech: cement ===== */
  p('ultratech-opc-43', 'ultratech', 'cement', 'UltraTech OPC 43 Grade', 'bag', 'grey',
    'ఇళ్ల నిర్మాణానికి ఎక్కువగా వాడే OPC 43 గ్రేడ్ సిమెంట్.',
    `Ordinary Portland Cement widely used in residential building. It balances strength and workability and suits slabs in low-rise houses.`,
    ['Balance of strength and workability', 'Suits slabs in low-height buildings', 'A common choice for house construction'],
    ['rcc', 'plaster', 'masonry', 'found'], { type: 'OPC', grade: '43', pack: BAG });
  p('ultratech-opc-53', 'ultratech', 'cement', 'UltraTech OPC 53 Grade', 'bag', 'slate',
    'స్లాబ్, బీమ్, కాలమ్ పనులకు అధిక ప్రారంభ బలం ఉన్న OPC 53.',
    `High early-strength Ordinary Portland Cement, mainly used for RCC work such as slabs, beams and columns.`,
    ['High early strength', 'Mainly for RCC work'], ['rcc', 'rmc'], { type: 'OPC', grade: '53', pack: BAG });
  p('ultratech-ppc', 'ultratech', 'cement', 'UltraTech PPC', 'bag', 'kraft',
    'ఇంటి నిర్మాణం, ప్లాస్టరింగ్‌కు మన్నికైన PPC; తేమ, తీర ప్రాంతాలకూ బాగుంటుంది.',
    `Portland Pozzolana Cement known for durability and long-term strength. Recommended for house construction and plastering, and a good fit for coastal or humid areas.`,
    ['Durability and long-term strength', 'Best for house building and plastering', 'Suits coastal and humid areas'],
    ['plaster', 'masonry', 'found', 'rcc'], { type: 'PPC', pack: BAG });
  p('ultratech-psc', 'ultratech', 'cement', 'UltraTech PSC (Portland Slag Cement)', 'bag', 'teal',
    'తేమ ఎక్కువగా ఉండే పునాదులకు PSC (స్లాగ్ సిమెంట్).',
    `Portland Slag Cement for places that need high durability, such as foundations and structures that face moisture.`,
    ['High durability', 'Suits structures exposed to moisture'], ['found', 'coast', 'damp'], { type: 'PSC', pack: BAG });
  p('ultratech-weather-plus', 'ultratech', 'cement', 'UltraTech Weather Plus', 'bag', 'teal',
    'నీటిని తిప్పికొట్టే సిమెంట్: తేమ, తుప్పు నుంచి రక్షణ.',
    `Water-repellent cement that fills the tiny holes in concrete and breaks the capillary paths that carry dampness. UltraTech suggests using it for the whole structure: roof, walls and foundation or floor.`,
    ['Better dampness prevention', 'Better protection from rusting', 'Higher durability', 'Sold in a tamper-proof bag'],
    ['roof', 'extwall', 'found', 'rcc'], { type: 'Water-repellent cement', pack: BAG });

  /* ===== UltraTech: building products ===== */
  p('ultratech-wp200', 'ultratech', 'chem', 'UltraTech WP+200', 'pail', 'teal',
    'సిమెంట్‌తో కలిపే వాటర్‌ప్రూఫింగ్ లిక్విడ్; తేమ లోపలికి రాకుండా ఆపుతుంది.',
    `Integral waterproofing liquid that is mixed with cement. It fills the capillaries so dampness cannot enter the structure.`,
    ['Mixed into concrete, plaster and mortar', 'Blocks dampness by filling capillaries'],
    ['found', 'roof', 'extwall', 'balc', 'damp', 'tank'], { type: 'Integral waterproofing liquid' });
  p('ultratech-bitupro', 'ultratech', 'chem', 'UltraTech BituPro', 'pail', 'ink',
    'పునాది మీద వేసే బిటుమెన్ ఎమల్షన్; తేమ పైకి రాకుండా ఆపుతుంది.',
    `Water-based bitumen emulsion applied directly on the foundation as a damp-proofing coat, so moisture cannot rise upward.`,
    ['Water-based', 'Applied directly on the foundation', 'Damp-proofing coat'], ['damp', 'found'], { type: 'Bitumen emulsion' });
  p('ultratech-flex', 'ultratech', 'chem', 'UltraTech Flex', 'pail', 'brick',
    'బాత్‌రూమ్ వంటి లోపలి తడి ప్రదేశాలకు 2-కాంపోనెంట్ ఫ్లెక్సిబుల్ కోటింగ్.',
    `Two-component elastomeric waterproof coating that expands and contracts with the concrete, preventing cracks and leaks in internal wet areas.`,
    ['Two-component', 'Flexes with the concrete', 'Prevents cracks and leaks'], ['wet'], { type: 'Elastomeric coating' });
  p('ultratech-hiflex', 'ultratech', 'chem', 'UltraTech Hi-Flex', 'pail', 'orange',
    'టెర్రస్, రూఫ్, బయటి గోడలకు అత్యంత ఫ్లెక్సిబుల్ 2-కాంపోనెంట్ కోటింగ్.',
    `Highly flexible two-component coating that stops cracks and water entry in external wet areas such as terraces, roofs and exterior walls.`,
    ['Two-component', 'Highly flexible', 'For outdoor wet areas'], ['roof', 'extwall'], { type: 'Flexible coating' });
  p('ultratech-top-shield', 'ultratech', 'chem', 'UltraTech Top-Shield', 'pail', 'slate',
    'రూఫ్‌ను చల్లగా ఉంచే ఎలాస్టోమెరిక్ కోటింగ్ (10°C వరకు తక్కువ).',
    `Elastomeric coating for roofs and terraces that UltraTech rates as 3X protection. Besides dampness and crack resistance, it keeps the surface up to 10°C cooler.`,
    ['Dampness and crack resistance', 'Surface up to 10°C cooler', '3X protection for roofs and terraces'], ['roof'], { type: 'Elastomeric coating' });
  p('ultratech-top-shield-ezy', 'ultratech', 'chem', 'UltraTech Top-Shield EZY', 'pail', 'mustard',
    'రూఫ్, టెర్రస్‌కు హైబ్రిడ్-PU ఫ్లెక్సిబుల్ వాటర్‌ప్రూఫ్ కోటింగ్.',
    `Hybrid-PU flexible waterproof coating for roofs and terraces, with 2X protection, crack resistance, heat reflection and algae resistance.`,
    ['2X protection', 'Crack resistant', 'Heat reflective', 'Algae resistant'], ['roof'], { type: 'Hybrid-PU coating' });
  p('ultratech-bath-kit', 'ultratech', 'chem', 'UltraTech Bathroom Waterproofing Kit', 'pail', 'teal',
    'బాత్‌రూమ్‌కు 5-కాంపోనెంట్ వాటర్‌ప్రూఫింగ్ కిట్.',
    `Five-component waterproofing solution for critical internal wet areas such as bathrooms.`,
    ['Five components in one kit', 'Made for bathrooms'], ['wet'], { type: 'Waterproofing kit' });
  p('ultratech-bath-membrane', 'ultratech', 'chem', 'UltraTech Bathroom Waterproofing Membrane', 'roll', 'ink',
    'టైల్స్ కింద వేసే, ముందే తయారైన వాటర్‌ప్రూఫ్ మెంబ్రేన్.',
    `Pre-formed water-resistant membrane laid under bathroom tiles. It forms a barrier layer that stops moisture in high-risk areas.`,
    ['Laid under tiles', 'Pre-formed sheet'], ['wet'], { type: 'Pre-formed membrane' });
  p('ultratech-membranes', 'ultratech', 'chem', 'UltraTech APP, HDPE & SBS Membranes', 'roll', 'ink',
    'APP, HDPE, SBS మెంబ్రేన్లు: బేస్‌మెంట్, రూఫ్, సొరంగాల కోసం.',
    `Pre-formed membranes for larger jobs. APP bituminous membrane is torch-applied on basement rafts, roofs and terraces. HDPE membrane suits foundations, basements and tunnels. SBS self-adhesive membrane is used on basement retaining walls. Ask us for availability.`,
    ['APP: torch-on, for basement rafts, roofs and terraces', 'HDPE: loose-laid or fixed, for foundations, basements and tunnels', 'SBS: self-adhesive, for basement retaining walls'],
    ['damp', 'roof', 'found'], { type: 'Pre-formed membranes', variants: 'APP, HDPE, SBS' });
  p('ultratech-sbr', 'ultratech', 'chem', 'UltraTech SBR', 'pail', 'grey',
    'పాలిమర్ SBR: తేమ నుంచి రక్షణ; బాండింగ్ ఏజెంట్‌గా కూడా వాడతారు.',
    `High-performance polymer that forms a dense protective layer against dampness. It can also be used as a bonding agent and a mortar modifier.`,
    ['Dense polymer layer against dampness', 'Bonding agent', 'Mortar modifier'], ['bond', 'plaster', 'damp'], { type: 'Polymer (SBR)' });
  p('ultratech-readiplast-pro', 'ultratech', 'drymix', 'UltraTech Readiplast Pro', 'sack', 'grey',
    'క్యూరింగ్ అవసరం లేని పాలిమర్ రెడీ-మిక్స్ ప్లాస్టర్.',
    `Polymer-enriched ready-mix plaster with No Curing technology, so the plaster reaches full strength without water curing. Consistent grading means faster application, less wastage and a smoother finish.`,
    ['No curing, full strength', 'Polymer enriched', 'Crack resistant'], ['plaster'], { type: 'Ready-mix plaster' });
  p('ultratech-tilefixo', 'ultratech', 'drymix', 'UltraTech Tilefixo', 'sack', 'kraft',
    'టైల్స్, మార్బుల్ అతికించే టైల్ఫిక్సో సిస్టమ్.',
    `UltraTech's tile and marble fitting system. Ask us which Tilefixo variant suits your tile and surface.`,
    ['Tile and marble fitting system'], ['tile'], { type: 'Tile & marble fixing' });
  p('ultratech-epoxy-grout', 'ultratech', 'drymix', 'UltraTech Style Epoxy Grout', 'pail', 'mustard',
    'టైల్ జాయింట్లకు ఎపాక్సీ గ్రౌట్.',
    `Epoxy grout for filling tile joints. Ask us for colours and pack sizes.`,
    ['Epoxy-based joint filler'], ['grout'], { type: 'Epoxy grout' });
  p('ultratech-crack-filler', 'ultratech', 'chem', 'UltraTech Crack Filler', 'sack', 'brick',
    'పగుళ్లు నింపే క్రాక్ ఫిల్లర్.',
    `Crack filler from the UltraTech building products range, for filling cracks before finishing.`,
    ['Fills cracks before finishing'], ['crack'], { type: 'Crack filler' });

  /* ===== Ambuja ===== */
  p('ambuja-cement', 'ambuja', 'cement', 'Ambuja Cement (OPC & PPC)', 'bag', 'slate',
    'అంబుజా సిమెంట్ (OPC & PPC): అధిక బలం, అన్ని పనులకూ ఉపయోగం.',
    `Ambuja's everyday cement, sold as Ordinary Portland Cement (OPC) and Portland Pozzolana Cement (PPC). Trusted by home builders for strength, performance and all-round use.`,
    ['High strength', 'High performance', 'Versatile: roofs, walls and foundations'], ['found', 'rcc', 'plaster', 'masonry'], { type: 'OPC / PPC', pack: BAG });
  p('ambuja-kawach', 'ambuja', 'cement', 'Ambuja Kawach', 'bag', 'teal',
    'నీరు చేరకుండా చేసే వాటర్-రిపెల్లెంట్ ప్రీమియం సిమెంట్.',
    `Premium cement with water-repellent properties. Ambuja lists no seepage, anti-efflorescence and corrosion resistance as its main benefits.`,
    ['No seepage', 'Anti-efflorescence', 'Corrosion resistant'], ['roof', 'rcc', 'plaster', 'extwall'], { type: 'Water-repellent cement', pack: BAG });
  p('ambuja-plus', 'ambuja', 'cement', 'Ambuja Plus', 'bag', 'mustard',
    'సిలికా జెల్ టెక్నాలజీతో దట్టమైన, లీక్-ప్రూఫ్ కాంక్రీట్ ఇచ్చే PPC.',
    `Premium-grade PPC that uses advanced technology to extract silica gel from the cement, giving higher strength, denser concrete and better resistance to leakage.`,
    ['Extra strong', 'Dense concrete', 'Leak-proof'], ['rcc', 'roof', 'found'], { type: 'PPC (premium)', pack: BAG });
  p('ambuja-compocem', 'ambuja', 'cement', 'Ambuja Compocem', 'bag', 'kraft',
    'ఫ్లై యాష్, స్లాగ్‌తో చేసిన పర్యావరణ హిత కాంపోజిట్ సిమెంట్; మంచి ఫినిష్.',
    `Portland Composite Cement made with S&S Technology. It uses fly ash and slag, both waste products, in place of natural materials, and gives easy workability and a clean finish.`,
    ['Impeccable finish', 'S&S Technology', 'Easy workability', 'Lower carbon footprint'], ['plaster', 'masonry', 'rcc'], { type: 'Portland Composite Cement', pack: BAG });
  p('ambuja-powercem', 'ambuja', 'cement', 'Ambuja Powercem', 'bag', 'brick',
    'భారీ నిర్మాణాలకు అధిక కంప్రెసివ్ బలం ఉన్న సిమెంట్.',
    `Cement with high compressive strength for heavy-duty construction, made with advanced technology and optimised processes.`,
    ['High strength', 'Weather-proof', 'Stable'], ['rcc', 'infra', 'rmc'], { type: 'Cement', pack: BAG });
  p('ambuja-buildcem', 'ambuja', 'cement', 'Ambuja Buildcem', 'bag', 'grey',
    'హై-రైజ్, పెద్ద నిర్మాణాలకు మన్నికైన, పర్యావరణ హిత సిమెంట్.',
    `Sustainable cement suited to high-rise buildings and large infrastructure, combining durability with easy workability.`,
    ['Sustainable', 'Weather-proof', 'Easy workability'], ['rcc', 'infra', 'rmc'], { type: 'Cement', pack: BAG });
  p('ambuja-railcem', 'ambuja', 'cement', 'Ambuja Railcem', 'bag', 'ink',
    'రైల్వే నిర్మాణాల కోసం ప్రత్యేక సిమెంట్.',
    `Cement designed for railway infrastructure, built to handle wear and tear and keep structures stable.`,
    ['High stability', 'Durable', 'Reliable'], ['rail', 'infra'], { type: 'Cement', pack: BAG });
  p('ambuja-cool-walls', 'ambuja', 'cement', 'Ambuja Cool Walls (concrete blocks)', 'block', 'white',
    'ఇంటిని 5°C వరకు చల్లగా ఉంచే కాంక్రీట్ (AAC) బ్లాక్స్.',
    `Concrete (AAC) wall blocks with a heat-barrier design that keeps the building up to 5°C cooler. An alternative to traditional brick walls.`,
    ['Up to 5°C cooler', 'Protects against shora (efflorescence)', 'Insulating', 'Extra strong'], ['masonry', 'cool'], { type: 'AAC concrete blocks' });
  p('ambuja-purasand', 'ambuja', 'cement', 'Ambuja Purasand', 'sack', 'kraft',
    'కాంక్రీట్, ప్లాస్టర్ కోసం శుభ్రమైన, ఒకే సైజు ఇసుక.',
    `Pure, uniform sand for concrete and plaster, sold by Ambuja to give a consistent mix and a quality finish.`,
    ['Uniform particle size', 'No impurities', 'Quality finish'], ['sand', 'plaster', 'rcc'], { type: 'Sand for concrete and plaster' });

  /* ===== KCP ===== */
  p('kcp-opc-53', 'kcp', 'cement', 'KCP Cement OPC 53 Grade', 'bag', 'brick',
    'KCP OPC 53: స్లాబ్, బీమ్, కాలమ్ పనులకు పేరుపొందిన "కాంక్రీట్ సిమెంట్".',
    `Grade 53 Ordinary Portland Cement to IS 269:2015, for quality construction and structures that carry greater loads. KCP says it is the preferred brand for columns, beams and slabs, which is why it is known as concrete cement.`,
    ['IS 269:2015', 'For greater loads', 'Preferred for columns, beams and slabs'], ['rcc', 'rmc', 'infra'], { type: 'OPC', grade: '53', std: 'IS 269:2015', pack: BAG });
  p('kcp-opc-43', 'kcp', 'cement', 'KCP Cement OPC 43 Grade', 'bag', 'kraft',
    'సాధారణ లోడ్‌లకు, సాధారణ కాంక్రీట్ పనులకు OPC 43.',
    `Grade 43 Ordinary Portland Cement to IS 269:2015, for general concrete construction that carries normal loads.`,
    ['IS 269:2015', 'General concrete construction'], ['rcc', 'plaster', 'masonry'], { type: 'OPC', grade: '43', std: 'IS 269:2015', pack: BAG });
  p('kcp-shreshtaa', 'kcp', 'cement', 'KCP Shreshtaa PPC', 'bag', 'grey',
    'శ్రేష్ఠ PPC (ఫ్లై యాష్ సిమెంట్): తక్కువ హీట్ ఆఫ్ హైడ్రేషన్ కావలసిన చోట్ల.',
    `Shreshtaa is KCP's Portland Pozzolana Cement (fly ash cement) to IS 1489 (Part 1) 2015, recommended where low heat of hydration is needed.`,
    ['IS 1489 (Part 1) 2015', 'Low heat of hydration'], ['rcc', 'plaster', 'masonry', 'found'], { type: 'PPC (fly ash)', std: 'IS 1489 (Part 1) 2015', pack: BAG });
  p('kcp-super-shreshtaa', 'kcp', 'cement', 'KCP Super Shreshtaa PPC', 'bag', 'mustard',
    'సూపర్ శ్రేష్ఠ PPC: త్వరగా బలం, మంచి వర్కబిలిటీ, నునుపైన ఫినిష్.',
    `Super Shreshtaa PPC for residential, commercial and industrial construction where early strength, workability, a smooth finish, corrosion resistance and low heat of hydration are needed.`,
    ['Early strength', 'Excellent workability', 'Smooth surface finish', 'Corrosion resistance'], ['rcc', 'plaster', 'masonry'], { type: 'PPC', std: 'IS 1489 (Part 1) 2015', pack: BAG });
  p('kcp-rhpc', 'kcp', 'cement', 'KCP Rapid Hardening Portland Cement', 'bag', 'orange',
    'త్వరగా గట్టిపడే సిమెంట్: ప్రీకాస్ట్, రెడీ-మిక్స్ పనులకు.',
    `Rapid Hardening Portland Cement to IS 8041:1990 for structural concrete, high-strength concrete, precast and ready-mix work where high early strength is needed.`,
    ['IS 8041:1990', 'High early strength'], ['precast', 'rmc', 'rcc'], { type: 'RHPC', std: 'IS 8041:1990', pack: BAG });
  p('kcp-opc-53s', 'kcp', 'cement', 'KCP OPC 53-S Grade', 'bag', 'ink',
    'రైల్వే స్లీపర్ల తయారీకి OPC 53-S.',
    `53-S grade Ordinary Portland Cement to IS 269:2015, used for railway sleeper manufacture and other special applications.`,
    ['IS 269:2015', 'For sleepers and special uses'], ['rail', 'precast'], { type: 'OPC', grade: '53-S', std: 'IS 269:2015', pack: BAG });

  /* ===== Ramco ===== */
  p('ramco-supercrete', 'ramco', 'cement', 'Ramco Supercrete', 'bag', 'brick',
    'సూపర్‌క్రీట్: పగుళ్లు రాని, అధిక బలం కాంక్రీట్ కోసం.',
    `Blended (PPC) cement for crack-resistant, high-strength concrete, even in critical structures. Ramco lists higher ultimate strength, low heat of hydration, good workability and M-sand compatibility.`,
    ['High early strength', 'High durability', 'Good workability'], ['rcc', 'found', 'rmc'], { type: 'PPC', pack: BAG });
  p('ramco-superfine-efc', 'ramco', 'cement', 'Ramco Superfine EFC', 'bag', 'kraft',
    'సూపర్‌ఫైన్ EFC: మంచి ఫినిష్, మన్నిక; సాధారణ కాంక్రీట్‌కు.',
    `Cement for standard concrete with a superior finish and high durability.`,
    ['Superior finish', 'High durability'], ['rcc', 'plaster'], { type: 'Cement', pack: BAG });
  p('ramco-super-steel', 'ramco', 'cement', 'Ramco Super Steel', 'bag', 'slate',
    'సూపర్ స్టీల్: తక్కువ వేడి, తుప్పు నిరోధకత; అధిక బలం కాంక్రీట్, నునుపైన ప్లాస్టర్.',
    `Cement for high-strength concrete and a smoother finish with plastering. Low heat of hydration, high early strength and corrosion resistance.`,
    ['Low heat of hydration', 'High early strength', 'Corrosion resistant'], ['rcc', 'plaster'], { type: 'Cement', pack: BAG });
  p('ramco-supergrade', 'ramco', 'cement', 'Ramco Supergrade', 'bag', 'grey',
    'సూపర్‌గ్రేడ్: క్లోరైడ్, సల్ఫేట్‌కు నిరోధకత; సాధారణ కాంక్రీట్, ప్లాస్టరింగ్.',
    `High-durability cement with high resistance to chloride and sulphate, for ordinary and standard concrete and for plastering.`,
    ['High durability', 'Resists chloride and sulphate'], ['rcc', 'plaster', 'masonry', 'coast'], { type: 'Cement', pack: BAG });
  p('ramco-super-fast', 'ramco', 'cement', 'Ramco Super Fast', 'bag', 'orange',
    'సూపర్ ఫాస్ట్: త్వరగా గట్టిపడుతుంది; పేవర్, హాలో బ్లాక్ తయారీకి.',
    `Faster-hardening cement with high early strength and a better finish, for paving blocks, hollow blocks, solid blocks and other precast products.`,
    ['Faster hardening', 'High early strength', 'Better finish'], ['precast'], { type: 'Cement', pack: BAG });
  p('ramco-samudra', 'ramco', 'cement', 'Ramco Samudra', 'bag', 'teal',
    'సముద్ర: ఉప్పునీటికి గురయ్యే నిర్మాణాలకు తుప్పు నిరోధక సిమెంట్.',
    `Corrosion-resistant cement with enhanced durability in aggressive conditions, for construction exposed to sea water and for effluent treatment plants.`,
    ['Corrosion resistant', 'Durable in aggressive conditions'], ['coast', 'dock'], { type: 'Cement', pack: BAG });
  p('ramco-super-coast', 'ramco', 'cement', 'Ramco Super Coast', 'bag', 'slate',
    'సూపర్ కోస్ట్: ఓడరేవులు, డ్యామ్‌లు; సల్ఫేట్ దాడిని తట్టుకుంటుంది.',
    `Resists sulphate attack and gains compressive strength progressively. For ports, harbours and docks, and for dams exposed to saline and polluted water.`,
    ['Resists sulphate attack', 'Progressive compressive strength'], ['dock', 'coast'], { type: 'Cement', pack: BAG });
  p('ramco-karthic-super-plus', 'ramco', 'cement', 'Ramco Karthic Super Plus', 'bag', 'mustard',
    'కార్తిక్ సూపర్ ప్లస్: మన్నిక, మంచి వర్కబిలిటీ; కాంక్రీట్, ప్లాస్టరింగ్.',
    `Cement with high durability and good workability for concrete, and a smoother finish with plastering.`,
    ['High durability', 'Good workability'], ['rcc', 'plaster'], { type: 'Cement', pack: BAG });
  p('ramco-opc-53', 'ramco', 'cement', 'Ramco OPC 53 Grade', 'bag', 'ink',
    'రామ్కో OPC 53: అధిక బలం కాంక్రీట్‌కు, త్వరగా బలం.',
    `Ordinary Portland Cement with high early strength, for high-strength concrete.`,
    ['High early strength'], ['rcc', 'rmc'], { type: 'OPC', grade: '53', pack: BAG });
  p('ramco-opc-43', 'ramco', 'cement', 'Ramco OPC 43 Grade', 'bag', 'grey',
    'రామ్కో OPC 43: త్వరగా సెట్ అవుతుంది; లేబర్ ఖర్చు తగ్గుతుంది.',
    `Quick-setting Ordinary Portland Cement with high early strength. Ramco notes lower labour and supervision cost, and it suits cement sheets.`,
    ['Quick set', 'High early strength', 'Lower labour and supervision cost'], ['plaster', 'masonry', 'precast'], { type: 'OPC', grade: '43', pack: BAG });
  p('ramco-infra-opc-53', 'ramco', 'cement', 'Ramco Infra OPC 53 Grade', 'bag', 'slate',
    'రామ్కో ఇన్‌ఫ్రా OPC 53: వంతెనలు, ఫ్లైఓవర్లు, ప్రీ-స్ట్రెస్డ్ కాంక్రీట్.',
    `High-grade concrete cement for infrastructure projects such as bridges, flyovers, tunnels and pre-stressed concrete, with high slump retention and high early strength.`,
    ['High slump retention', 'High early strength', 'For high-grade concrete'], ['infra', 'rmc'], { type: 'OPC', grade: '53 (Infra)', pack: BAG });
  p('ramco-infra-opc-43', 'ramco', 'cement', 'Ramco Infra OPC 43 Grade', 'bag', 'grey',
    'రామ్కో ఇన్‌ఫ్రా OPC 43: ప్రభుత్వ ప్రాజెక్టుల కోసం అధిక బలం కాంక్రీట్.',
    `High-strength concrete cement with high slump retention, used in government projects such as nuclear power plants.`,
    ['High-strength concrete', 'High slump retention'], ['infra'], { type: 'OPC', grade: '43 (Infra)', pack: BAG });
  p('ramco-infra-super-opc-53', 'ramco', 'cement', 'Ramco Infra Super OPC 53 Grade', 'bag', 'brick',
    'మెట్రో, ఎయిర్‌పోర్ట్ రన్‌వే వంటి ప్రాజెక్టుల కోసం ఇన్‌ఫ్రా సూపర్ OPC 53.',
    `Lets engineers replace cement with a higher share of supplementary cementitious materials (SCMs). Faster strength gain speeds construction, and workability stays high with the right admixture. For metro rail, metro tunnels and airport runways.`,
    ['Works with more SCMs', 'Faster gain of strength', 'Higher workability with optimum admixture', 'Economises cement content'], ['infra', 'rmc'], { type: 'OPC', grade: '53 Super (Infra)', pack: BAG });

  /* ===== Nagarjuna ===== */
  p('nagarjuna-opc-43', 'nagarjuna', 'cement', 'Nagarjuna OPC 43 Grade', 'bag', 'kraft',
    'సాధారణ నిర్మాణ పనులకు OPC 43.',
    `Ordinary Portland Cement, 43 grade, for general building applications. Nagarjuna cement is packed in 50 kg bags to BIS specifications.`,
    ['General applications', '50 kg bags'], ['rcc', 'plaster', 'masonry'], { type: 'OPC', grade: '43', pack: BAG });
  p('nagarjuna-opc-53', 'nagarjuna', 'cement', 'Nagarjuna OPC 53 Grade', 'bag', 'slate',
    'అధిక బలం అవసరమైన పనులకు OPC 53.',
    `Ordinary Portland Cement, 53 grade, for high-strength applications.`,
    ['High-strength applications', '50 kg bags'], ['rcc', 'rmc'], { type: 'OPC', grade: '53', pack: BAG });
  p('nagarjuna-ppc', 'nagarjuna', 'cement', 'Nagarjuna PPC', 'bag', 'grey',
    'మరింత మన్నిక కోసం PPC.',
    `Portland Pozzolana Cement for enhanced durability and eco-friendly benefits.`,
    ['Enhanced durability', 'Eco-friendly benefits'], ['plaster', 'masonry', 'found', 'rcc'], { type: 'PPC', pack: BAG });
  p('nagarjuna-visistha', 'nagarjuna', 'cement', 'Nagarjuna Visistha Premium PPC', 'bag', 'mustard',
    'విశిష్ట ప్రీమియం PPC: మంచి వర్కబిలిటీ, దీర్ఘకాలిక మన్నిక.',
    `Premium PPC designed for superior workability and long-lasting durability in high-end construction.`,
    ['Superior workability', 'Long-lasting durability'], ['rcc', 'plaster', 'masonry'], { type: 'PPC (premium)', pack: BAG });
  p('nagarjuna-steelkrete', 'nagarjuna', 'cement', 'Nagarjuna SteelKrete (PSC)', 'bag', 'teal',
    'స్టీల్‌క్రీట్: తీర ప్రాంతాల కోసం ప్రత్యేక స్లాగ్ సిమెంట్.',
    `Specialised slag cement developed for coastal regions.`,
    ['Slag cement', 'Made for coastal regions'], ['coast', 'found'], { type: 'PSC (slag cement)', pack: BAG });
  p('nagarjuna-irs-53s', 'nagarjuna', 'cement', 'Nagarjuna IRS Grade 53S', 'bag', 'ink',
    'భారతీయ రైల్వే కాంక్రీట్ స్లీపర్ల కోసం IRS 53S.',
    `Made specifically for Indian Railways to produce concrete sleepers.`,
    ['Built for Indian Railways', 'For concrete sleepers'], ['rail', 'precast'], { type: 'IRS 53S' });

  /* ===== Birla White ===== */
  p('birlawhite-white-cement', 'birlawhite', 'white', 'Birla White Cement', 'sack', 'white',
    'బిర్లా వైట్ సిమెంట్: డెకరేటివ్, ఆర్కిటెక్చరల్ పనులకు.',
    `White cement for architectural and decorative work. Sold in 1 kg, 5 kg, 25 kg and 50 kg packs.`,
    ['Decorative and architectural use', 'Four pack sizes, from 1 kg to 50 kg'], ['whitework', 'texture'], { type: 'White cement', pack: '1, 5, 25 and 50 kg' });
  p('birlawhite-wallcare-putty', 'birlawhite', 'white', 'Birla White WallCare Putty', 'sack', 'white',
    'వాల్‌కేర్ పుట్టీ: పెయింట్ కింద నునుపైన, మన్నికైన బేస్.',
    `White-cement putty used as a base coat before paint. It gives interior walls a smooth, durable base, and its water-resisting properties help stop paint flaking. Odourless and free of lead and oil.`,
    ['Smooth, durable base for interior walls', 'Water-resisting: helps stop paint flaking', 'Odourless, no lead or oil'], ['putty', 'paintbase'], { type: 'White cement putty' });
  p('birlawhite-wallcare-scented', 'birlawhite', 'white', 'Birla White WallCare Rose, Lemon & Sandalwood Putty', 'sack', 'kraft',
    'గులాబీ, నిమ్మ, చందనం సువాసనల వాల్‌కేర్ పుట్టీ.',
    `Scented versions of WallCare Putty with the same performance: Rose has a mild rose scent, Lemon a clean citrus aroma and Sandalwood a soothing woody scent.`,
    ['Same performance as WallCare', 'Three fragrances'], ['putty', 'paintbase'], { type: 'White cement putty', variants: 'Rose, Lemon, Sandalwood' });
  p('birlawhite-wallseal', 'birlawhite', 'white', 'Birla White WallSeal Waterproof Putty', 'sack', 'teal',
    'వాల్‌సీల్: 2X నీటి నిరోధకత ఉన్న వాటర్‌ప్రూఫ్ పుట్టీ.',
    `Waterproof putty with 2X water resistance that helps prevent dampness, flaking and surface damage. For bathrooms, kitchens, exterior walls and other areas that meet water.`,
    ['2X water resistance', 'Prevents dampness and flaking'], ['putty', 'wet', 'extwall'], { type: 'Waterproof putty' });
  p('birlawhite-excel', 'birlawhite', 'white', 'Birla White Excel Textured Wall Putty', 'sack', 'white',
    'ఎక్సెల్ టెక్స్చర్డ్ పుట్టీ: డిజైనర్ వాల్ ఫినిష్‌లకు.',
    `Textured wall putty with high whiteness for designer wall finishes, patterns and feature walls.`,
    ['Superior whiteness', 'Allows texturing and patterns'], ['texture', 'putty'], { type: 'Textured putty' });
  p('birlawhite-level-plast', 'birlawhite', 'white', 'Birla White Level Plast', 'sack', 'grey',
    'లెవెల్ ప్లాస్ట్: బయటి గోడల పగుళ్లు, గుంతలు నింపడానికి.',
    `Fills hairline and larger cracks on exterior walls. Also recommended for filling holes, dents and cracks before applying Textura.`,
    ['Fills hairline and larger cracks', 'Prep coat before textures'], ['crack', 'extwall'], { type: 'Crack filler / base coat' });
  p('birlawhite-textura-trowel', 'birlawhite', 'white', 'Birla White Textura Trowel Finish', 'sack', 'kraft',
    'టెక్స్చురా ట్రోవెల్ ఫినిష్: వైట్ సిమెంట్ ఆధారిత గోడ టెక్స్చర్.',
    `White-cement-based wall texture applied with a trowel. Gives patterns, strong adhesion and a long life, and is water-resistant. Sold in 20 kg and 25 kg packs.`,
    ['Stunning patterns', 'Superior adhesion', 'Water-resistant', 'Easy to apply'], ['texture', 'extwall'], { type: 'Wall texture', pack: '20 and 25 kg' });
  p('birlawhite-textura-roller', 'birlawhite', 'white', 'Birla White Textura Roller Finish', 'sack', 'orange',
    'టెక్స్చురా రోలర్ ఫినిష్: రోలర్‌తో వేసే గోడ టెక్స్చర్.',
    `White-cement-based wall texture applied with a roller. Gives patterns, strong adhesion and a long life, and is water-resistant. Sold in 20 kg and 25 kg packs.`,
    ['Beautiful designs', 'Long-lasting', 'Water-resistant'], ['texture', 'extwall'], { type: 'Wall texture', pack: '20 and 25 kg' });
  p('birlawhite-ever-white', 'birlawhite', 'white', 'Birla White Ever White Cement Wash', 'sack', 'white',
    'ఎవర్ వైట్ సిమెంట్ వాష్ (25 కిలోల ప్యాక్).',
    `White cement wash for painting walls, sold in 25 kg packs.`,
    ['25 kg pack'], ['paintbase', 'extwall'], { type: 'Cement wash', pack: '25 kg' });

  /* ===== Hard Worker (dry-mix) ===== */
  p('hardworker-tile-fix', 'hardworker', 'drymix', 'Hard Worker Tile Fix', 'sack', 'grey',
    'టైల్ ఫిక్స్: సిరామిక్, విట్రిఫైడ్, గ్రానైట్, మార్బుల్ టైల్స్ కోసం 5 రకాలు.',
    `Tile adhesive for ceramic, vitrified, granite, marble, glass, natural stone and cladding. It comes in 5 variants so you can match it to the tile type.`,
    ['5 variants for different tiles', 'Works on many tile types'], ['tile'], { type: 'Tile adhesive', variants: '5 variants' });
  p('hardworker-tile-fix-epoxy', 'hardworker', 'drymix', 'Hard Worker Tile Fix Epoxy', 'pail', 'mustard',
    'పెద్ద సైజు టైల్స్‌కు ఎపాక్సీ టైల్ అడ్హెసివ్.',
    `Epoxy tile adhesive for fixing large-format tiles on dry wall, glass, wood and metal.`,
    ['Epoxy adhesive', 'For large-format tiles'], ['tile'], { type: 'Epoxy tile adhesive' });
  p('hardworker-tile-fix-slurry', 'hardworker', 'drymix', 'Hard Worker Tile Fix Slurry', 'sack', 'kraft',
    'తాజా స్క్రీడ్ మీద టైల్స్ వెంటనే వేయడానికి స్లర్రీ.',
    `Slurry for stronger and faster tile fixing directly over fresh screed (wet-on-wet).`,
    ['Wet-on-wet fixing', 'Stronger, faster fixing'], ['tile', 'floor'], { type: 'Tile slurry' });
  p('hardworker-tile-grout', 'hardworker', 'drymix', 'Hard Worker Tile Grout', 'sack', 'white',
    'టైల్స్, మార్బుల్, గ్రానైట్ జాయింట్లు నింపడానికి గ్రౌట్.',
    `Joint filler for tiles, marble, granite and natural stone.`,
    ['Joint filling'], ['grout'], { type: 'Cement grout' });
  p('hardworker-tile-grout-epoxy', 'hardworker', 'drymix', 'Hard Worker Tile Grout Epoxy', 'pail', 'orange',
    'ప్రతి జాయింట్‌కు దీర్ఘకాల రక్షణనిచ్చే ఎపాక్సీ గ్రౌట్.',
    `Epoxy grout that gives long-term protection to every joint and tile.`,
    ['Long-term joint protection'], ['grout'], { type: 'Epoxy grout' });
  p('hardworker-floor-screed', 'hardworker', 'drymix', 'Hard Worker Floor Screed', 'sack', 'slate',
    'ఫ్లోర్ లెవెల్ చేసి టైలింగ్‌కు గట్టి బేస్ ఇచ్చే స్క్రీడ్.',
    `Levels floors and creates a strong, even base for tiling or other finishes.`,
    ['Levels floors', 'Even base for finishes'], ['floor', 'tile'], { type: 'Floor screed' });
  p('hardworker-block-fix', 'hardworker', 'drymix', 'Hard Worker Block Fix', 'sack', 'brick',
    'బ్లాక్ ఫిక్స్: ఇటుకలు, హాలో-సాలిడ్ బ్లాక్స్, AAC బ్లాక్స్ అతికించడానికి.',
    `Block-jointing mortar. Block Fix is for red bricks, laterite bricks, fly ash bricks, and hollow and solid blocks. Block Fix AAC, and Block Fix without sand, are for AAC and lightweight blocks.`,
    ['Block Fix: bricks, hollow and solid blocks', 'Block Fix AAC: AAC and lightweight blocks', 'Block Fix without sand: AAC and lightweight blocks'],
    ['masonry'], { type: 'Block jointing mortar', variants: 'Standard, AAC, without sand' });
  p('hardworker-eco-plaster', 'hardworker', 'drymix', 'Hard Worker Eco Plaster', 'sack', 'teal',
    'ఎకో ప్లాస్టర్: స్వయంగా క్యూరింగ్ అయ్యే గోడ ప్లాస్టర్.',
    `Self-curing wall plaster, so no water curing is needed.`,
    ['Self-curing', 'No water curing needed'], ['plaster'], { type: 'Wall plaster' });
  p('hardworker-wall-putty', 'hardworker', 'drymix', 'Hard Worker Wall Putty', 'sack', 'white',
    'గోడను నునుపుగా, సమంగా చేసే వాల్ పుట్టీ.',
    `Smooths and levels wall surfaces before paint.`,
    ['Smoothens and levels walls'], ['putty', 'paintbase'], { type: 'Wall putty' });

  /* ===== Hard Worker (chemicals) ===== */
  p('hardworker-integral-waterproofing', 'hardworker', 'chem', 'Hard Worker Integral Waterproofing', 'pail', 'teal',
    'కాంక్రీట్ మిక్స్‌లో కలిపే వాటర్‌ప్రూఫింగ్: పోరోసిటీ, తుప్పు తగ్గిస్తుంది.',
    `Waterproofing liquid added to concrete mixes. It reduces porosity and steel corrosion.`,
    ['Added to all concrete mixes', 'Reduces porosity', 'Reduces steel corrosion'], ['rcc', 'roof', 'found'], { type: 'Integral waterproofing' });
  p('hardworker-waterproofing-coat', 'hardworker', 'chem', 'Hard Worker Waterproofing Coat', 'pail', 'orange',
    'నీటిని మూలంలోనే ఆపే, గట్టి వాటర్‌టైట్ పొర ఇచ్చే కోట్.',
    `Waterproofing coat that forms a durable, watertight membrane and stops water at the source.`,
    ['Durable watertight membrane', 'Stops ingress at the source'], ['roof', 'wet', 'damp'], { type: 'Waterproofing coat' });
  p('hardworker-micro-concrete', 'hardworker', 'chem', 'Hard Worker Micro Concrete', 'sack', 'slate',
    'బీమ్, కాలమ్, గోడల కాంక్రీట్ రిపేర్ కోసం మైక్రో కాంక్రీట్.',
    `Repair material for damaged concrete elements such as beams, columns and walls, and for all jacketing applications.`,
    ['Repairs beams, columns and walls', 'For jacketing'], ['crack', 'rcc'], { type: 'Repair micro concrete' });
  p('hardworker-anchoring-grout', 'hardworker', 'chem', 'Hard Worker Anchoring Grout', 'sack', 'ink',
    'భారీ యంత్రాల బేస్, బోల్ట్ యాంకరింగ్ కోసం గ్రౌట్.',
    `Foundation grout for heavy machinery such as windmills and boilers, base plates, bridge bearing pads and bolt anchoring.`,
    ['Heavy machinery foundations', 'Base plates and bolts'], ['anchor'], { type: 'Anchoring grout' });
  p('hardworker-bonding-epoxy', 'hardworker', 'chem', 'Hard Worker Bonding Agent Epoxy', 'pail', 'mustard',
    'కాంక్రీట్ జాయింట్లు, రిపేర్లకు ఎపాక్సీ బాండింగ్ ఏజెంట్.',
    `Epoxy bonding agent for concrete joints and for bonding in concrete repairs.`,
    ['Epoxy bonding agent', 'For joints and repairs'], ['bond', 'crack'], { type: 'Epoxy bonding agent' });
  p('hardworker-bonding-sbr', 'hardworker', 'chem', 'Hard Worker Bonding Agent SBR', 'pail', 'grey',
    'మేసన్రీ, కాంక్రీట్ బంధానికి SBR బాండింగ్ ఏజెంట్.',
    `SBR bonding agent for masonry and concrete, also used as a performance enhancer for repair mortar.`,
    ['For masonry and concrete', 'Improves repair mortar'], ['bond', 'plaster', 'crack'], { type: 'SBR bonding agent' });

  /* ===== Fosroc ===== */
  p('fosroc-brushbond', 'fosroc', 'chem', 'Fosroc Brushbond', 'pail', 'orange',
    'బ్రష్‌బాండ్: కాంక్రీట్, ఇటుక గోడలపై వాటర్‌ప్రూఫ్ సిమెంటీషియస్ కోటింగ్.',
    `Cementitious coating for concrete and brickwork that forms a waterproof barrier and fills surface imperfections. Waterproof and non-toxic, so suitable for potable water tanks.`,
    ['Minimal surface preparation', 'Bonds to porous and non-porous surfaces', 'Breathable: lets water vapour out', 'Fills honeycombs and blowholes'],
    ['tank', 'wet', 'balc', 'damp', 'crack'], { type: 'Cementitious coating' });
  p('fosroc-nitoproof-100', 'fosroc', 'chem', 'Fosroc Nitoproof 100', 'pail', 'ink',
    'నైటోప్రూఫ్ 100: బిటుమెన్ ఫిల్మ్ కోటింగ్; తడి కాంక్రీట్‌పై కూడా వేయవచ్చు.',
    `Single-component blend of selected bitumens in solvent that dries to a tough bitumen film. Does not taint water, can be applied to damp concrete, and also works as a curing compound.`,
    ['Applied to damp concrete', 'Quick drying', 'High coverage', 'Used successfully for over 30 years'], ['damp', 'found'], { type: 'Bitumen coating' });
  p('fosroc-nitobond-sbr', 'fosroc', 'chem', 'Fosroc Nitobond SBR', 'pail', 'kraft',
    'నైటోబాండ్ SBR: స్క్రీడ్, ప్లాస్టర్, రిపేర్ మోర్టార్‌లకు బాండింగ్ లేటెక్స్.',
    `Polymer (SBR) latex added to cement mortar to improve bonding and durability in screeds, plasters and repairs. Ask us for mixing ratios.`,
    ['Bonding latex for mortar', 'For screeds, plaster and repairs'], ['bond', 'plaster', 'floor', 'crack'], { type: 'SBR latex' });
  p('fosroc-conplast-wl', 'fosroc', 'chem', 'Fosroc Conplast WL', 'pail', 'teal',
    'కాన్‌ప్లాస్ట్ WL: ఫాస్రాక్ వాటర్‌ప్రూఫింగ్ ఉత్పత్తి.',
    `Waterproofing product from the Fosroc Conplast range. Ask us for mixing and coverage details for your job.`,
    ['Waterproofing protection'], ['roof', 'wet'], { type: 'Waterproofing liquid' });
  p('fosroc-nitoproof-600pf', 'fosroc', 'chem', 'Fosroc Nitoproof 600 PF', 'pail', 'slate',
    'నైటోప్రూఫ్ 600 PF: టెర్రస్‌లకు పాలియురేథేన్ వాటర్‌ప్రూఫింగ్.',
    `Polyurethane (PU) waterproofing coating used on terraces and wet areas.`,
    ['PU protection', 'For terraces'], ['roof', 'wet'], { type: 'PU waterproofing coating' });
  p('fosroc-nitoseal-pu', 'fosroc', 'adhesive', 'Fosroc Nitoseal PU', 'cartridge', 'ink',
    'నైటోసీల్ PU: జాయింట్ల కోసం పాలియురేథేన్ సీలెంట్.',
    `Polyurethane joint sealant from the Fosroc Nitoseal range, for sealing joints and gaps.`,
    ['Polyurethane sealant'], ['seal'], { type: 'PU sealant' });

  /* ===== Astral Adhesives ===== */
  p('astral-fast-and-clear', 'astral', 'adhesive', 'Astral Bondtite Fast & Clear', 'bottle', 'mustard',
    'బాండ్‌టైట్ ఫాస్ట్ & క్లియర్: పారదర్శకమైన 5-నిమిషాల ఎపాక్సీ.',
    `A 5-minute, high-strength, two-component transparent epoxy adhesive. It bonds colourless glass to glass, fixes marble and granite, and bonds metal. It works even at low temperatures.`,
    ['Bonds even at low temperatures', 'Colourless, transparent bond line', 'Fast setting', 'Thicker formula for vertical jobs'],
    ['glass', 'repair'], { type: 'Two-component epoxy', pack: '3 g to 2 kg' });
  p('astral-bondtite-epoxy', 'astral', 'adhesive', 'Astral Bondtite Epoxy Range', 'bottle', 'orange',
    'బాండ్‌టైట్ ఎపాక్సీ: రెసిన్, హార్డ్‌నర్ సెట్లు; బలమైన బంధం.',
    `Bondtite's two-part epoxy adhesives, sold as resin and hardener sets in several sizes.`,
    ['Two-part resin and hardener', 'Strong, lasting bond'], ['repair', 'glass'], { type: 'Epoxy adhesive' });
  p('astral-bondtite-pva', 'astral', 'adhesive', 'Astral Bondtite PVA Wood Adhesives', 'bottle', 'white',
    'బాండ్‌టైట్ PVA: చెక్క పని జిగురులు.',
    `PVA adhesives for woodworking from the Bondtite range.`,
    ['PVA adhesive', 'For woodworking'], ['wood', 'lam'], { type: 'PVA adhesive' });
  p('astral-bondtite-cyano', 'astral', 'adhesive', 'Astral Bondtite Cyanoacrylate', 'bottle', 'slate',
    'బాండ్‌టైట్ సైనోఅక్రిలేట్: తక్షణం అతుక్కునే జిగురు.',
    `Instant-bond cyanoacrylate adhesives from the Bondtite range, for quick household and workshop repairs.`,
    ['Instant bonding', 'Small packs'], ['repair'], { type: 'Cyanoacrylate' });
  p('astral-resibond-neutral', 'astral', 'adhesive', 'Astral Resibond Neutral Silicone Sealant', 'cartridge', 'white',
    'రెసిబాండ్ న్యూట్రల్: సిలికాన్ సీలెంట్.',
    `Neutral-cure silicone sealant from the Resibond range of sealants, for sealing joints and gaps.`,
    ['Neutral-cure silicone', 'For joints and gaps'], ['seal', 'glass'], { type: 'Silicone sealant' });

  /* ===== Fevicol (Pidilite) ===== */
  function fev(id, name, tint, te, desc, feats, apps) {
    p(id, 'fevicol', 'adhesive', name, 'bottle', tint, te, desc, feats, apps, { type: 'Adhesive' });
  }
  fev('fevicol-sh', 'Fevicol SH', 'white', 'ఫెవికాల్ SH: చెక్క పనికి 65 ఏళ్లుగా నమ్మకమైన జిగురు.',
    `The classic Fevicol for woodworking, trusted for over 65 years. A synthetic resin adhesive for bonding wood and other porous surfaces.`,
    ['Strong wood joints', 'Trusted for over 65 years'], ['wood', 'lam']);
  fev('fevicol-mr', 'Fevicol MR', 'white', 'ఫెవికాల్ MR: ఇల్లు, ఆఫీస్, క్రాఫ్ట్ పనులకు తెల్ల జిగురు.',
    `All-purpose white adhesive for home, office and craft use, on materials such as wood, plywood, laminates, plastic, glass and stone.`,
    ['Home, office and craft use'], ['wood', 'repair']);
  fev('fevicol-marine', 'Fevicol Marine', 'teal', 'ఫెవికాల్ మెరైన్: నీటికి తట్టుకునే జిగురు.',
    `Specialised waterproof adhesive that protects furniture from debonding when it is exposed to water.`,
    ['Waterproof', 'High coverage'], ['wood']);
  fev('fevicol-hiper', 'Fevicol Hi-per', 'orange', 'ఫెవికాల్ హై-పర్: బబుల్స్ రాకుండా, వాటర్‌ప్రూఫ్.',
    `Anti-bubble and waterproof adhesive.`, ['Anti-bubble', 'Waterproof'], ['lam', 'wood']);
  fev('fevicol-hiper-star', 'Fevicol Hi-per Star', 'orange', 'ఫెవికాల్ హై-పర్ స్టార్: లామినేట్, వీనీర్ ప్లైవుడ్‌పై అతికించడానికి.',
    `Advanced white glue for bonding laminates, veneer and other materials to plywood. Waterproof, with superior coverage and the highest anti-bubble properties.`,
    ['Superior coverage', 'Highest anti-bubble properties', 'Waterproof'], ['lam', 'wood']);
  fev('fevicol-heatx', 'Fevicol Heatx', 'brick', 'ఫెవికాల్ హీట్‌ఎక్స్: వేడిని తట్టుకునే జిగురు; 10 నిమిషాల్లో బంధం.',
    `Heatproof adhesive that bonds in just 10 minutes.`, ['Heatproof', 'Bonds in 10 minutes'], ['wood', 'lam']);
  fev('fevicol-sr-998', 'Fevicol SR 998', 'kraft', 'ఫెవికాల్ SR 998: సింథటిక్ రబ్బర్ అడ్హెసివ్.',
    `Synthetic rubber adhesive.`, ['Synthetic rubber based'], ['repair', 'lam']);
  fev('fevicol-ezeespray', 'Fevicol Ezeespray', 'slate', 'ఫెవికాల్ ఈజీస్ప్రే: లామినేట్ అతికించే స్ప్రే అడ్హెసివ్.',
    `Spray adhesive for laminate pasting.`, ['Spray application', 'For laminate pasting'], ['lam']);
  fev('fevicol-relam', 'Fevicol Relam', 'mustard', 'ఫెవికాల్ రీలామ్: పాత లామినేట్ మీద కొత్తది అతికించడానికి.',
    `For hassle-free pasting of new laminate on old laminate.`, ['New laminate over old'], ['lam']);
  fev('fevicol-plastilok', 'Fevicol Plastilok', 'teal', 'ఫెవికాల్ ప్లాస్టిలోక్: WPC బోర్డ్‌పై లామినేట్ అతికించడానికి.',
    `Pastes laminate perfectly on WPC boards.`, ['For WPC boards'], ['lam', 'plastic']);
  fev('fevicol-probond', 'Fevicol Probond', 'grey', 'ఫెవికాల్ ప్రోబాండ్: PVC, యాక్రిలిక్ షీట్ల కోసం.',
    `Specially made for PVC and acrylic sheets.`, ['For PVC and acrylic'], ['plastic']);
  fev('fevicol-speedx', 'Fevicol SpeedX', 'orange', 'ఫెవికాల్ స్పీడ్‌ఎక్స్: త్వరగా సెట్ అయ్యే జిగురు.',
    `Adhesive with a quick setting time.`, ['Quick setting'], ['wood', 'lam']);
  fev('fevicol-probond-edgelok', 'Fevicol Probond Edgelok', 'ink', 'ఫెవికాల్ ప్రోబాండ్ ఎడ్జ్‌లాక్: PVC ఎడ్జ్ బ్యాండింగ్ టేప్‌ల కోసం.',
    `Fast-setting adhesive for PVC edge-banding tapes.`, ['Fast setting', 'For edge-banding'], ['lam', 'plastic']);

  /* ===== More cement brands sold in Andhra Pradesh ===== */
  p('bharathi-opc-53', 'bharathi', 'cement', 'Bharathi Cement OPC 53 Grade', 'bag', 'b-bharathi',
    'భారతి OPC 53: జర్మన్ టెక్నాలజీతో తయారైన అధిక బలం గల సిమెంట్.',
    `Ordinary Portland Cement 53 grade from Bharathi Cement (Vicat group), made at Kadapa with German technology and packed in tamper-proof bags. For high-strength concrete in slabs, beams and columns.`,
    ['High strength for RCC', 'Tamper-proof bag', 'Quality norms above BIS'], ['rcc', 'found', 'rmc'], { type: 'OPC', grade: '53', pack: BAG });
  p('bharathi-opc-43', 'bharathi', 'cement', 'Bharathi Cement OPC 43 Grade', 'bag', 'b-bharathi',
    'భారతి OPC 43: సాధారణ ఇంటి నిర్మాణానికి.',
    `Ordinary Portland Cement 43 grade for general house construction, plastering and brickwork.`,
    ['General-purpose OPC', 'Tamper-proof bag'], ['rcc', 'plaster', 'masonry'], { type: 'OPC', grade: '43', pack: BAG });
  p('bharathi-ppc', 'bharathi', 'cement', 'Bharathi Cement PPC', 'bag', 'b-bharathi',
    'భారతి PPC: మన్నికైన బ్లెండెడ్ సిమెంట్, ప్లాస్టరింగ్‌కు బాగుంటుంది.',
    `Portland Pozzolana Cement for durable house construction, plastering and brickwork, packed in tamper-proof bags.`,
    ['Durable blended cement', 'Good for plaster and brickwork'], ['plaster', 'masonry', 'found', 'rcc'], { type: 'PPC', pack: BAG });
  p('bharathi-ultra-fast', 'bharathi', 'cement', 'Bharathi Ultra Fast Cement', 'bag', 'b-bharathi',
    'భారతి అల్ట్రా ఫాస్ట్: త్వరగా సెట్ అయ్యే 53 గ్రేడ్ సిమెంట్.',
    `Fast-setting 53 grade cement for quick construction, where early strength and faster de-shuttering help.`,
    ['Fast setting', 'High early strength'], ['rcc', 'precast'], { type: 'OPC', grade: '53', pack: BAG });

  p('dalmia-cement', 'dalmia', 'cement', 'Dalmia Bharat Cement DC (PPC & OPC)', 'bag', 'b-dalmia',
    'దాల్మియా DC: రూఫ్, కాలమ్, ఫౌండేషన్ (RCF) కోసం సిమెంట్.',
    `Dalmia Bharat's everyday cement, sold as PPC, PCC and OPC 43/53 depending on the region. Dalmia markets it for the Roof, Column and Foundation (RCF) of a house.`,
    ['PPC and OPC variants', 'Made for roof, column and foundation'], ['rcc', 'found', 'plaster', 'masonry'], { type: 'PPC / OPC', pack: BAG });
  p('dalmia-dsp', 'dalmia', 'cement', 'Dalmia Bharat DSP', 'bag', 'b-dalmia',
    'దాల్మియా DSP: పునాది, కాలమ్, స్లాబ్‌లకు అధిక బలం గల ప్రత్యేక సిమెంట్.',
    `Specialised premium cement formulated for high-strength concrete in foundations, columns and slabs.`,
    ['High-strength concrete', 'Premium bag'], ['rcc', 'found', 'roof'], { type: 'Premium cement', pack: BAG });
  p('dalmia-infra-pro', 'dalmia', 'cement', 'Dalmia Bharat Infra Pro', 'bag', 'b-dalmia',
    'దాల్మియా ఇన్‌ఫ్రా ప్రో: పెద్ద ప్రాజెక్టులు, ప్రీకాస్ట్ పనులకు.',
    `Cement for large projects such as ports, jetties and power plants, known for consistent quality and high strength. Works with the admixtures used in ready-mix concrete and precast.`,
    ['Consistent quality', 'Suits admixtures', 'For large projects'], ['infra', 'rmc', 'precast'], { type: 'OPC', pack: BAG });

  p('chettinad-maxcrete', 'chettinad', 'cement', 'Chettinad Maxcrete Premium PPC', 'bag', 'b-chettinad',
    'చెట్టినాడ్ మాక్స్‌క్రీట్: హై-పర్ఫార్మెన్స్ ప్రీమియం PPC.',
    `High-performance premium Portland Pozzolana Cement conforming to IS 1489 Part 1.`,
    ['Premium PPC', 'IS 1489 (Part 1)'], ['rcc', 'found', 'plaster'], { type: 'PPC', std: 'IS 1489 (Part 1)', pack: BAG });
  p('chettinad-super-grade', 'chettinad', 'cement', 'Chettinad Super Grade PPC', 'bag', 'b-chettinad',
    'చెట్టినాడ్ సూపర్ గ్రేడ్ PPC.',
    `Superior Portland Pozzolana Cement conforming to IS 1489 Part 1, for general house construction.`,
    ['Superior PPC', 'IS 1489 (Part 1)'], ['plaster', 'masonry', 'rcc'], { type: 'PPC', std: 'IS 1489 (Part 1)', pack: BAG });
  p('chettinad-hbc', 'chettinad', 'cement', 'Chettinad Hollow Block Cement (HBC)', 'bag', 'b-chettinad',
    'చెట్టినాడ్ HBC: హాలో బ్లాక్స్, పేవర్స్ తయారీకి.',
    `Cement made for hollow blocks, solid blocks and pavers, following today's block-construction trend.`,
    ['Made for block making'], ['precast', 'masonry'], { type: 'Special cement', pack: BAG });
  p('chettinad-composite', 'chettinad', 'cement', 'Chettinad Composite Cement', 'bag', 'b-chettinad',
    'చెట్టినాడ్ కాంపోజిట్: పర్యావరణ అనుకూల 43 గ్రేడ్ బ్లెండెడ్ సిమెంట్.',
    `Eco-friendly 43 grade composite blended cement conforming to IS 16415:2015.`,
    ['Eco-friendly', 'IS 16415:2015'], ['rcc', 'plaster', 'masonry'], { type: 'Composite cement', grade: '43', std: 'IS 16415:2015', pack: BAG });
  p('chettinad-opc-53', 'chettinad', 'cement', 'Chettinad OPC 53 Grade', 'bag', 'b-chettinad',
    'చెట్టినాడ్ OPC 53: హై-గ్రేడ్ కాంక్రీట్‌కు.',
    `Ordinary Portland Cement 53 grade conforming to IS 269:2015, for high-grade concrete.`,
    ['High-grade concrete', 'IS 269:2015'], ['rcc', 'rmc', 'found'], { type: 'OPC', grade: '53', std: 'IS 269:2015', pack: BAG });
  p('chettinad-opc-43', 'chettinad', 'cement', 'Chettinad OPC 43 Grade', 'bag', 'b-chettinad',
    'చెట్టినాడ్ OPC 43.',
    `Ordinary Portland Cement 43 grade conforming to IS 269:2015.`,
    ['IS 269:2015'], ['rcc', 'plaster', 'masonry'], { type: 'OPC', grade: '43', std: 'IS 269:2015', pack: BAG });
  p('chettinad-classic-slag', 'chettinad', 'cement', 'Chettinad Classic Slag Cement', 'bag', 'b-chettinad',
    'చెట్టినాడ్ క్లాసిక్ స్లాగ్: తేమ, తీర ప్రాంతాలకు PSC.',
    `Portland Slag Cement conforming to IS 455:2015, known for versatility and reliability.`,
    ['Slag cement', 'IS 455:2015'], ['found', 'coast', 'damp'], { type: 'PSC', std: 'IS 455:2015', pack: BAG });

  p('shree-roofon', 'shree', 'cement', 'Bangur Roofon Plus', 'bag', 'b-shree',
    'బంగూర్ రూఫాన్ ప్లస్: రూఫ్ డాలాయికి కాంక్రీట్ మాస్టర్.',
    `Shree Cement's "Concrete Master" for roofs, beams and columns. Nano-sized particles give high-density concrete, with strength from the first day of curing and long-term strength gain.`,
    ['High-density concrete', 'Strong bond between layers', 'Protects TMT bars from corrosion'], ['roof', 'rcc', 'found'], { type: 'Premium cement', pack: BAG });
  p('shree-magna', 'shree', 'cement', 'Bangur Magna', 'bag', 'b-shree',
    'బంగూర్ మాగ్నా: సాలిడ్ కాంక్రీట్ కోసం.',
    `Premium Bangur cement for solid concrete work.`,
    ['For solid concrete'], ['rcc', 'found'], { type: 'Premium cement', pack: BAG });
  p('shree-jungrodhak', 'shree', 'cement', 'Bangur Shree Jungrodhak', 'bag', 'b-shree',
    'బంగూర్ శ్రీ జంగ్‌రోధక్: తుప్పు నిరోధక సిమెంట్.',
    `Corrosion-resistant cement for long-lasting slabs ("Ghar ki Dhaal, Saalon Saal").`,
    ['Corrosion resistant'], ['roof', 'rcc', 'coast'], { type: 'Cement', pack: BAG });
  p('shree-powermax', 'shree', 'cement', 'Bangur Powermax', 'bag', 'b-shree',
    'బంగూర్ పవర్‌మ్యాక్స్: పగుళ్ల నిరోధక సిమెంట్.',
    `Cement with Power Grind technology for strong crack resistance.`,
    ['Crack resistance'], ['plaster', 'masonry', 'rcc'], { type: 'Cement', pack: BAG });
  p('shree-rockstrong', 'shree', 'cement', 'Bangur Rockstrong', 'bag', 'b-shree',
    'బంగూర్ రాక్‌స్ట్రాంగ్: రాయి లాంటి బలం, మన్నిక.',
    `Cement designed for rock-like strength and durability.`,
    ['Strength and durability'], ['rcc', 'found', 'masonry'], { type: 'Cement', pack: BAG });

  p('penna-power-ppc', 'penna', 'cement', 'Penna Power PPC', 'bag', 'b-penna',
    'పెన్నా పవర్ PPC: తుప్పు నిరోధక కాంక్రీట్‌కు బ్లెండెడ్ సిమెంట్.',
    `Portland Pozzolana Cement (IS 1489) made with processed fly ash. It helps make corrosion-resistant concrete, reduces cracks, improves workability, resists sulphate attack and lowers the heat of hydration.`,
    ['Corrosion-resistant concrete', 'Fewer cracks, better workability', 'Resists sulphate attack'], ['rcc', 'plaster', 'masonry', 'found'], { type: 'PPC', std: 'IS 1489', pack: BAG });
  p('penna-suraksha-psc', 'penna', 'cement', 'Penna Suraksha PSC', 'bag', 'b-penna',
    'పెన్నా సురక్ష PSC: డ్యామ్‌లు, నీటి ట్యాంకులు, తీర నిర్మాణాలకు.',
    `Portland Slag Cement (IS 455) with high strength, sulphate resistance and low heat of hydration, for mass concrete, water-retaining structures, dams and marine work.`,
    ['Sulphate resistant', 'Low heat of hydration'], ['dock', 'tank', 'coast', 'found'], { type: 'PSC', std: 'IS 455', pack: BAG });
  p('penna-premium-53', 'penna', 'cement', 'Penna Premium OPC 53 Grade', 'bag', 'b-penna',
    'పెన్నా ప్రీమియం OPC 53: వంతెనలు, ఎత్తైన భవనాలు, ప్రీకాస్ట్‌కు.',
    `Ordinary Portland Cement 53 grade (IS 269), minimum 53 MPa at 28 days. For precast items, prestressed concrete, bridges, runways, high-rise buildings and concrete roads.`,
    ['53 MPa at 28 days', 'Optimum particle size'], ['rcc', 'precast', 'infra', 'rmc'], { type: 'OPC', grade: '53', std: 'IS 269', pack: BAG });
  p('penna-premium-43', 'penna', 'cement', 'Penna Premium OPC 43 Grade', 'bag', 'b-penna',
    'పెన్నా ప్రీమియం OPC 43: సాధారణ నిర్మాణానికి.',
    `General-purpose Ordinary Portland Cement 43 grade (IS 269) for civil work, precast blocks, pipes and tiles, plastering and flooring.`,
    ['General purpose', '43 MPa at 28 days'], ['rcc', 'plaster', 'floor', 'precast'], { type: 'OPC', grade: '43', std: 'IS 269', pack: BAG });
  p('penna-concrete-guard', 'penna', 'cement', 'Penna Concrete Guard', 'bag', 'b-penna',
    'పెన్నా కాంక్రీట్ గార్డ్: ఇంటి నిర్మాణానికి ప్రీమియం సిమెంట్.',
    `Premium re-engineered pozzolanic cement for high-performance concrete, with lower heat of hydration and better flow. Packed in tamper-proof BOPP bags for individual house builders, with technical support.`,
    ['High-performance concrete', 'Tamper-proof BOPP bag'], ['rcc', 'roof', 'found'], { type: 'Premium PPC', pack: BAG });

  p('sagar-opc-53', 'sagar', 'cement', 'Sagar Cement OPC 53 Grade', 'bag', 'b-sagar',
    'సాగర్ OPC 53: అధిక బలం గల కాంక్రీట్‌కు.',
    `Ordinary Portland Cement 53 grade for higher-strength concrete, with a minimum 28-day strength of 53 MPa as per BIS.`,
    ['53 MPa at 28 days', 'Economical'], ['rcc', 'found', 'rmc'], { type: 'OPC', grade: '53', pack: BAG });
  p('sagar-ppc', 'sagar', 'cement', 'Sagar Cement PPC (Super)', 'bag', 'b-sagar',
    'సాగర్ PPC సూపర్: ఇంటి నిర్మాణానికి.',
    `Portland Pozzolana Cement from Sagar Cements, a cement maker in the Krishna river basin. Sagar also makes OPC 43, slag cement and sulphate-resisting cement.`,
    ['Blended cement for house building'], ['plaster', 'masonry', 'rcc', 'found'], { type: 'PPC', pack: BAG });

  p('maha-hd-ppc', 'maha', 'cement', 'Maha HD+ Cement (PPC)', 'bag', 'b-maha',
    'మహా HD+: ప్రీమియం PPC, త్వరగా సెట్ అవుతుంది.',
    `Premium blended Portland Pozzolana Cement from My Home Industries, designed for faster setting.`,
    ['Premium PPC', 'Faster setting'], ['rcc', 'plaster', 'masonry'], { type: 'PPC', pack: BAG });
  p('maha-solid-hd', 'maha', 'cement', 'Maha Solid HD+ Cement', 'bag', 'b-maha',
    'మహా సాలిడ్ HD+: సూపర్ స్ట్రాంగ్ సిమెంట్.',
    `Super-strong Maha cement for structural concrete.`,
    ['Super strong'], ['rcc', 'found', 'roof'], { type: 'Cement', pack: BAG });
  p('maha-concrete-special', 'maha', 'cement', 'Maha Solid Concrete Special', 'bag', 'b-maha',
    'మహా కాంక్రీట్ స్పెషల్: కాంక్రీట్ పనులకు.',
    `Special cement made for concrete work.`,
    ['Made for concrete'], ['rcc', 'roof', 'rmc'], { type: 'Cement', pack: BAG });
  p('maha-psc', 'maha', 'cement', 'Maha Portland Slag Cement', 'bag', 'b-maha',
    'మహా PSC: తేమ, తీర ప్రాంతాలకు స్లాగ్ సిమెంట్.',
    `Portland Slag Cement from Maha for foundations and structures in moist or coastal conditions.`,
    ['Slag cement'], ['found', 'coast', 'damp'], { type: 'PSC', pack: BAG });

  p('indiacements-coromandel-king', 'indiacements', 'cement', 'Coromandel King PPC', 'bag', 'b-indiacements',
    'కోరమాండల్ కింగ్ PPC: అదనపు బలం కోసం బ్లెండెడ్ సిమెంట్.',
    `PPC blended cement from India Cements. Its amorphous silica reacts with calcium hydroxide to form extra strength and make the concrete denser.`,
    ['Extra strength over time', 'Denser concrete'], ['rcc', 'plaster', 'masonry', 'found'], { type: 'PPC', pack: BAG });
  p('indiacements-sankar', 'indiacements', 'cement', 'Sankar Super Power Cement', 'bag', 'b-indiacements',
    'శంకర్ సూపర్ పవర్: ఇండియా సిమెంట్స్ నుంచి నమ్మకమైన సిమెంట్.',
    `India Cements' well-known cement brand, sold as OPC and PPC.`,
    ['OPC and PPC variants'], ['rcc', 'plaster', 'masonry'], { type: 'OPC / PPC', pack: BAG });

  /* Godrej model: finishes[] and the MRP range (₹, incl. taxes) from the price list */
  function gm(id, name, shape, tint, cat, te, desc, feats, apps, specs, finishes, min, max) {
    p(id, 'godrej', cat, name, shape, tint, te, desc, feats, apps, specs);
    var x = PRODUCTS[PRODUCTS.length - 1]; x.finishes = finishes; x.mrp = [min, max];
  }

  /* ===== Godrej: every model from the Godrej price list (w.e.f. 1 July 2026). Finishes and sizes are in each description. ===== */
  gm("godrej-advantis-iot9", "Godrej Advantis IoT9", "mortise", "ink", "hardware",
    "గోద్రెజ్ Advantis IoT9: డిజిటల్ లాక్, 7 ఫినిష్‌లలో లభిస్తుంది.",
    "Advantis IoT9 from the Godrej digital locks range. Available in 7 finishes: Titanium Grey, Gunmetal Black, Roman Silver, Vegas Gold, Rose Gold, Oak Wood, Walnut. MRP ₹69,999 – ₹70,999 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["7 finishes available", "7 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["smart", "door"], {"type": "Digital lock", "variants": "7 variants in the price list"}, ["Titanium Grey", "Gunmetal Black", "Roman Silver", "Vegas Gold", "Rose Gold", "Oak Wood", "Walnut"], 69999, 70999);
  gm("godrej-advantis-revolution", "Godrej Advantis Revolution", "mortise", "ink", "hardware",
    "గోద్రెజ్ Advantis Revolution: డిజిటల్ లాక్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Advantis Revolution from the Godrej digital locks range. Available in 2 finishes: Black, Gold. MRP ₹61,200 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["smart", "door"], {"type": "Digital lock", "variants": "2 variants in the price list"}, ["Black", "Gold"], 61200, 61200);
  gm("godrej-advantis-gsl-d1", "Godrej Advantis GSL D1", "mortise", "ink", "hardware",
    "గోద్రెజ్ Advantis GSL D1: డిజిటల్ లాక్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Advantis GSL D1 from the Godrej digital locks range. Available in 2 finishes: Black, Rose Gold. MRP ₹22,999 – ₹23,999 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["smart", "door"], {"type": "Digital lock", "variants": "2 variants in the price list"}, ["Black", "Rose Gold"], 22999, 23999);
  gm("godrej-advantis-gsl-d1r", "Godrej Advantis GSL D1R", "mortise", "ink", "hardware",
    "గోద్రెజ్ Advantis GSL D1R: డిజిటల్ లాక్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Advantis GSL D1R from the Godrej digital locks range. Available in 2 finishes: Black, Silver. Sizes and options: Black; Silver. MRP ₹16,699 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "8 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["smart", "door"], {"type": "Digital lock", "variants": "8 variants in the price list"}, ["Black", "Silver"], 16699, 16699);
  gm("godrej-neo-pro-view", "Godrej Neo Pro-View", "mortise", "ink", "hardware",
    "గోద్రెజ్ Neo Pro-View: డిజిటల్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Neo Pro-View from the Godrej digital locks range. Available in 1 finish: Black. MRP ₹29,999 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["smart", "door"], {"type": "Digital lock", "variants": "1 variants in the price list"}, ["Black"], 29999, 29999);
  gm("godrej-neo-connect", "Godrej Neo Connect", "mortise", "ink", "hardware",
    "గోద్రెజ్ Neo Connect: డిజిటల్ లాక్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Neo Connect from the Godrej digital locks range. Available in 2 finishes: Black, Rose Gold. MRP ₹15,499 – ₹15,999 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["smart", "door"], {"type": "Digital lock", "variants": "2 variants in the price list"}, ["Black", "Rose Gold"], 15499, 15999);
  gm("godrej-neo-prime", "Godrej Neo Prime", "mortise", "ink", "hardware",
    "గోద్రెజ్ Neo Prime: డిజిటల్ లాక్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Neo Prime from the Godrej digital locks range. Available in 2 finishes: Rose Gold, Titanium Grey. MRP ₹12,999 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["smart", "door"], {"type": "Digital lock", "variants": "2 variants in the price list"}, ["Rose Gold", "Titanium Grey"], 12999, 12999);
  gm("godrej-neo-advantage", "Godrej Neo Advantage", "mortise", "ink", "hardware",
    "గోద్రెజ్ Neo Advantage: డిజిటల్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Neo Advantage from the Godrej digital locks range. Available in 1 finish: Black. MRP ₹10,999 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["smart", "door"], {"type": "Digital lock", "variants": "1 variants in the price list"}, ["Black"], 10999, 10999);
  gm("godrej-advantis-rimtronic", "Godrej Advantis Rimtronic", "mortise", "ink", "hardware",
    "గోద్రెజ్ Advantis Rimtronic: డిజిటల్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Advantis Rimtronic from the Godrej digital locks range. Available in 1 finish: Black. MRP ₹34,350 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["smart", "door"], {"type": "Digital lock", "variants": "1 variants in the price list"}, ["Black"], 34350, 34350);
  gm("godrej-advantis-rimtronic-rf", "Godrej Advantis Rimtronic RF", "mortise", "ink", "hardware",
    "గోద్రెజ్ Advantis Rimtronic RF: డిజిటల్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Advantis Rimtronic RF from the Godrej digital locks range. Available in 1 finish: Black. MRP ₹17,440 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["smart", "door"], {"type": "Digital lock", "variants": "1 variants in the price list"}, ["Black"], 17440, 17440);
  gm("godrej-advantis-rimtronic-verti", "Godrej Advantis Rimtronic Verti", "mortise", "ink", "hardware",
    "గోద్రెజ్ Advantis Rimtronic Verti: డిజిటల్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Advantis Rimtronic Verti from the Godrej digital locks range. Available in 1 finish: Black. MRP ₹20,010 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["smart", "door"], {"type": "Digital lock", "variants": "1 variants in the price list"}, ["Black"], 20010, 20010);
  gm("godrej-advantis-cabinet-lock", "Godrej Advantis Cabinet Lock", "mortise", "ink", "hardware",
    "గోద్రెజ్ Advantis Cabinet Lock: డిజిటల్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Advantis Cabinet Lock from the Godrej digital locks range. Available in 1 finish: Black. MRP ₹9,410 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["smart", "door"], {"type": "Digital lock", "variants": "1 variants in the price list"}, ["Black"], 9410, 9410);
  gm("godrej-astron-digital-cabinet-lock", "Godrej Astron Digital Cabinet Lock", "mortise", "ink", "hardware",
    "గోద్రెజ్ Astron Digital Cabinet Lock: డిజిటల్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Astron Digital Cabinet Lock from the Godrej digital locks range. Available in 1 finish: Black. MRP ₹3,799 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["smart", "door"], {"type": "Digital lock", "variants": "1 variants in the price list"}, ["Black"], 3799, 3799);
  gm("godrej-rion-digital-cabinet-lock", "Godrej Rion Digital Cabinet Lock", "mortise", "ink", "hardware",
    "గోద్రెజ్ Rion Digital Cabinet Lock: డిజిటల్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Rion Digital Cabinet Lock from the Godrej digital locks range. Available in 1 finish: Black. MRP ₹4,299 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["smart", "door"], {"type": "Digital lock", "variants": "1 variants in the price list"}, ["Black"], 4299, 4299);
  gm("godrej-advantis-remote-accessory", "Godrej Advantis Remote (accessory)", "mortise", "ink", "hardware",
    "గోద్రెజ్ Advantis Remote (accessory): డిజిటల్ లాక్.",
    "Advantis Remote (accessory) from the Godrej digital locks range. MRP ₹4,099 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["Genuine Godrej product, sold by the authorised distributor"], ["smart", "door"], {"type": "Digital lock", "variants": "1 variants in the price list"}, [], 4099, 4099);
  gm("godrej-advantis-video-door-phone-module", "Godrej Advantis Video Door Phone Module", "mortise", "ink", "hardware",
    "గోద్రెజ్ Advantis Video Door Phone Module: డిజిటల్ లాక్.",
    "Advantis Video Door Phone Module from the Godrej digital locks range. MRP ₹4,200 – ₹7,350 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["smart", "door"], {"type": "Digital lock", "variants": "3 variants in the price list"}, [], 4200, 7350);
  gm("godrej-advantis-rimtronic-pcb-accessory", "Godrej Advantis Rimtronic PCB (accessory)", "mortise", "ink", "hardware",
    "గోద్రెజ్ Advantis Rimtronic PCB (accessory): డిజిటల్ లాక్.",
    "Advantis Rimtronic PCB (accessory) from the Godrej digital locks range. MRP ₹5,099 – ₹5,789 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["smart", "door"], {"type": "Digital lock", "variants": "2 variants in the price list"}, [], 5099, 5789);
  gm("godrej-neh-06-mortise-handle-set", "Godrej NEH 06 Mortise Handle Set", "mortise", "kraft", "hardware",
    "గోద్రెజ్ NEH 06 Mortise Handle Set: మోర్టైజ్ లాక్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "NEH 06 Mortise Handle Set from the Godrej mortise locks range. Available in 4 finishes: Satin Steel, Matte Black Rose, Black Antique Copper, Matte Black Nickel. Sizes and options: 240 mm Door Handle Set 2C; 240 mm Door Handle Set 1CK; 200 mm Door Handle Set 2C; Baby Latch with Handle Set. MRP ₹3,050 – ₹6,240 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "20 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "20 variants in the price list"}, ["Satin Steel", "Matte Black Rose", "Black Antique Copper", "Matte Black Nickel"], 3050, 6240);
  gm("godrej-neh-07-mortise-handle-set", "Godrej NEH 07 Mortise Handle Set", "mortise", "kraft", "hardware",
    "గోద్రెజ్ NEH 07 Mortise Handle Set: మోర్టైజ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "NEH 07 Mortise Handle Set from the Godrej mortise locks range. Available in 1 finish: Satin Steel. Sizes and options: 240 mm Door Handle Set 2C; 240 mm Door Handle Set 1CK; 200 mm Door Handle Set 2C; Baby Latch with Handle Set. MRP ₹2,640 – ₹5,020 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "5 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "5 variants in the price list"}, ["Satin Steel"], 2640, 5020);
  gm("godrej-neh-15-low-height-design", "Godrej NEH 15 (Low Height Design)", "mortise", "kraft", "hardware",
    "గోద్రెజ్ NEH 15 (Low Height Design): మోర్టైజ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "NEH 15 (Low Height Design) from the Godrej mortise locks range. Available in 1 finish: Satin Steel. Sizes and options: 240 mm Door Handle Set 2C; 240 mm Door Handle Set 1CK; 200 mm Door Handle Set 2C; 200 mm Door Handle Set 1CK; Baby Latch with Handle Set. MRP ₹2,250 – ₹4,220 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "5 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "5 variants in the price list"}, ["Satin Steel"], 2250, 4220);
  gm("godrej-neh-16-mortise-handle-set", "Godrej NEH 16 Mortise Handle Set", "mortise", "kraft", "hardware",
    "గోద్రెజ్ NEH 16 Mortise Handle Set: మోర్టైజ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "NEH 16 Mortise Handle Set from the Godrej mortise locks range. Available in 1 finish: Satin Steel. Sizes and options: 240 mm Door Handle Set 2C; 240 mm Door Handle Set 1CK; 200 mm Door Handle Set 2C; 200 mm Door Handle Set 1CK; Baby Latch with Handle Set. MRP ₹2,250 – ₹4,220 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "5 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "5 variants in the price list"}, ["Satin Steel"], 2250, 4220);
  gm("godrej-neh-17-mortise-handle-set", "Godrej NEH 17 Mortise Handle Set", "mortise", "kraft", "hardware",
    "గోద్రెజ్ NEH 17 Mortise Handle Set: మోర్టైజ్ లాక్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "NEH 17 Mortise Handle Set from the Godrej mortise locks range. Available in 2 finishes: Satin Steel, Antique Brass. Sizes and options: 240 mm Door Handle Set 2C; 240 mm Door Handle Set 1CK; 200 mm Door Handle Set 2C; 200 mm Door Handle Set 1CK; 200 mm Door Handle Set 1CK (70 mm Cylinder); Baby Latch with Handle Set. MRP ₹2,080 – ₹4,120 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "12 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "12 variants in the price list"}, ["Satin Steel", "Antique Brass"], 2080, 4120);
  gm("godrej-neh-19-mortise-handle-set", "Godrej NEH 19 Mortise Handle Set", "mortise", "kraft", "hardware",
    "గోద్రెజ్ NEH 19 Mortise Handle Set: మోర్టైజ్ లాక్, 5 ఫినిష్‌లలో లభిస్తుంది.",
    "NEH 19 Mortise Handle Set from the Godrej mortise locks range. Available in 5 finishes: Satin Steel, Antique Brass, Matte Black Rose, Black Antique Copper, Matte Black Nickel. Sizes and options: 240 mm Door Handle Set 2C; 240 mm Door Handle Set 1CK; 200 mm Door Handle Set 2C; 200 mm Door Handle Set 1CK; 200 mm Door Handle Set 1CK (70 mm Cylinder); Baby Latch with Handle Set. MRP ₹2,290 – ₹4,300 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["5 finishes available", "32 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "32 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black Rose", "Black Antique Copper", "Matte Black Nickel"], 2290, 4300);
  gm("godrej-neh-20-mortise-handle-set", "Godrej NEH 20 Mortise Handle Set", "mortise", "kraft", "hardware",
    "గోద్రెజ్ NEH 20 Mortise Handle Set: మోర్టైజ్ లాక్, 5 ఫినిష్‌లలో లభిస్తుంది.",
    "NEH 20 Mortise Handle Set from the Godrej mortise locks range. Available in 5 finishes: Satin Steel, Antique Brass, Matte Black, Antique Copper, Matte Black Nickel. Sizes and options: 240 mm Door Handle Set 2C; 240 mm Door Handle Set 1CK; 200 mm Door Handle Set 2C; (70 mm Cylinder). MRP ₹2,290 – ₹4,300 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["5 finishes available", "32 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "32 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black", "Antique Copper", "Matte Black Nickel"], 2290, 4300);
  gm("godrej-neh-21-mortise-handle-set", "Godrej NEH 21 Mortise Handle Set", "mortise", "kraft", "hardware",
    "గోద్రెజ్ NEH 21 Mortise Handle Set: మోర్టైజ్ లాక్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "NEH 21 Mortise Handle Set from the Godrej mortise locks range. Available in 4 finishes: Satin Steel, Antique Brass, Matte Black Rose, Black Antique Copper. Sizes and options: 240 mm Door Handle Set 2C; 240 mm Door Handle Set 1CK; 200 mm Door Handle Set 2C; Baby Latch; Rosette; 200 mm Door Handle Set 1CK; Door Handle Set 1CK. MRP ₹2,260 – ₹4,150 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "28 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "28 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black Rose", "Black Antique Copper"], 2260, 4150);
  gm("godrej-neh-22-mortise-handle-set", "Godrej NEH 22 Mortise Handle Set", "mortise", "kraft", "hardware",
    "గోద్రెజ్ NEH 22 Mortise Handle Set: మోర్టైజ్ లాక్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "NEH 22 Mortise Handle Set from the Godrej mortise locks range. Available in 4 finishes: Satin Steel, Antique Brass, Matte Black Rose, Black Antique Copper. Sizes and options: 240 mm Door Handle Set 2C; Baby Latch; Rosette; (70 mm Cylinder); Door Handle Set 2C 200 mm. MRP ₹2,260 – ₹4,150 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "28 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "28 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black Rose", "Black Antique Copper"], 2260, 4150);
  gm("godrej-neh-23-mortise-handle-set", "Godrej NEH 23 Mortise Handle Set", "mortise", "kraft", "hardware",
    "గోద్రెజ్ NEH 23 Mortise Handle Set: మోర్టైజ్ లాక్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "NEH 23 Mortise Handle Set from the Godrej mortise locks range. Available in 4 finishes: Satin Steel, Antique Brass, Matte Black Rose, Black Antique Copper. Sizes and options: 240 mm Door Handle Set 2C; Baby Latch; 240 mm Rosette 1CK. MRP ₹2,210 – ₹4,100 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "28 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "28 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black Rose", "Black Antique Copper"], 2210, 4100);
  gm("godrej-neh-24-mortise-handle-set", "Godrej NEH 24 Mortise Handle Set", "mortise", "kraft", "hardware",
    "గోద్రెజ్ NEH 24 Mortise Handle Set: మోర్టైజ్ లాక్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "NEH 24 Mortise Handle Set from the Godrej mortise locks range. Available in 4 finishes: Satin Steel, Antique Brass, Matte Black Rose, Black Antique Copper. Sizes and options: 240 mm Door Handle Set 2C; Baby Latch; 240 mm Rosette 1CK; (70 mm Cylinder); 200 mm Door Handle Set 1CK (70 mm Cylinder). MRP ₹2,210 – ₹4,100 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "28 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "28 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black Rose", "Black Antique Copper"], 2210, 4100);
  gm("godrej-gloria-mortise-handle-set", "Godrej Gloria Mortise Handle Set", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Gloria Mortise Handle Set: మోర్టైజ్ లాక్, 5 ఫినిష్‌లలో లభిస్తుంది.",
    "Gloria Mortise Handle Set from the Godrej mortise locks range. Available in 5 finishes: Satin Steel, Antique Brass, Matte Black Rose, Black Antique Copper, Matte Black Nickel. Sizes and options: 240 mm Door Handle Set 2C; 240 mm Door Handle Set 1CK; 200 mm Door Handle Set 2C; 200 mm Door Handle Set 1CK; Baby Latch with Handle Set. MRP ₹2,620 – ₹5,620 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["5 finishes available", "25 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "25 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black Rose", "Black Antique Copper", "Matte Black Nickel"], 2620, 5620);
  gm("godrej-gloria-mortise-handle-set-with-victor-cylinder", "Godrej Gloria Mortise Handle Set with Victor Cylinder", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Gloria Mortise Handle Set with Victor Cylinder: మోర్టైజ్ లాక్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Gloria Mortise Handle Set with Victor Cylinder from the Godrej mortise locks range. Available in 2 finishes: Satin Steel, Antique Brass. Sizes and options: Gloria 240 mm Door Handle Set 2C; Gloria 240 mm Door Handle Set 1CK; Gloria 200 mm Door Handle Set 2C; Gloria 200 mm Door Handle Set 1CK. MRP ₹4,840 – ₹5,560 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "8 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "8 variants in the price list"}, ["Satin Steel", "Antique Brass"], 4840, 5560);
  gm("godrej-bm-01-mortise-handle-set", "Godrej BM 01 Mortise Handle Set", "mortise", "kraft", "hardware",
    "గోద్రెజ్ BM 01 Mortise Handle Set: మోర్టైజ్ లాక్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "BM 01 Mortise Handle Set from the Godrej mortise locks range. Available in 2 finishes: Satin Steel, Antique Brass. Sizes and options: 175 mm Door Handle Set 1CK; 175 mm Door Handle Set 2C. MRP ₹2,720 – ₹2,960 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "4 variants in the price list"}, ["Satin Steel", "Antique Brass"], 2720, 2960);
  gm("godrej-bm-02-mortise-handle-set", "Godrej BM 02 Mortise Handle Set", "mortise", "kraft", "hardware",
    "గోద్రెజ్ BM 02 Mortise Handle Set: మోర్టైజ్ లాక్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "BM 02 Mortise Handle Set from the Godrej mortise locks range. Available in 2 finishes: Satin Steel, Antique Brass. Sizes and options: 175 mm Door Handle Set 1CK; 175 mm Door Handle Set 2C. MRP ₹2,720 – ₹2,960 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "4 variants in the price list"}, ["Satin Steel", "Antique Brass"], 2720, 2960);
  gm("godrej-bm-09-mortise-handle-set", "Godrej BM 09 Mortise Handle Set", "mortise", "kraft", "hardware",
    "గోద్రెజ్ BM 09 Mortise Handle Set: మోర్టైజ్ లాక్, 5 ఫినిష్‌లలో లభిస్తుంది.",
    "BM 09 Mortise Handle Set from the Godrej mortise locks range. Available in 5 finishes: Satin Steel, Antique Brass, Rose Gold, Matte Black Nickel, Matte Black. Sizes and options: 175 mm Door Handle Set 1CK; 175 mm Door Handle Set 2C. MRP ₹2,610 – ₹2,910 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["5 finishes available", "10 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "10 variants in the price list"}, ["Satin Steel", "Antique Brass", "Rose Gold", "Matte Black Nickel", "Matte Black"], 2610, 2910);
  gm("godrej-bm-10-mortise-handle-set", "Godrej BM 10 Mortise Handle Set", "mortise", "kraft", "hardware",
    "గోద్రెజ్ BM 10 Mortise Handle Set: మోర్టైజ్ లాక్, 5 ఫినిష్‌లలో లభిస్తుంది.",
    "BM 10 Mortise Handle Set from the Godrej mortise locks range. Available in 5 finishes: Satin Steel, Antique Brass, Rose Gold, Matte Black Nickel, Matte Black. Sizes and options: 175 mm Door Handle Set 1CK; 175 mm Door Handle Set 2C. MRP ₹2,610 – ₹2,910 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["5 finishes available", "10 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "10 variants in the price list"}, ["Satin Steel", "Antique Brass", "Rose Gold", "Matte Black Nickel", "Matte Black"], 2610, 2910);
  gm("godrej-ss-d-type-tube-lever-combi-set", "Godrej SS D Type Tube Lever Combi Set", "mortise", "kraft", "hardware",
    "గోద్రెజ్ SS D Type Tube Lever Combi Set: మోర్టైజ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "SS D Type Tube Lever Combi Set from the Godrej mortise locks range. Available in 1 finish: Satin Steel. MRP ₹3,570 – ₹3,780 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "2 variants in the price list"}, ["Satin Steel"], 3570, 3780);
  gm("godrej-em-01-essential-mortise-handle-set", "Godrej EM 01 Essential Mortise Handle Set", "mortise", "kraft", "hardware",
    "గోద్రెజ్ EM 01 Essential Mortise Handle Set: మోర్టైజ్ లాక్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "EM 01 Essential Mortise Handle Set from the Godrej mortise locks range. Available in 3 finishes: Satin Steel, Antique Brass, Matte Black. Sizes and options: 200 mm Door Handle Set 1CK; 200 mm Door Handle Set 2C; Coverplate Baby Latch; Rosette Door Handle Set 1CK; Rosette Door Handle Set 2C; Rosette Baby Latch; 200 mm Keyless Combi Set. MRP ₹1,390 – ₹2,560 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "21 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "21 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black"], 1390, 2560);
  gm("godrej-em-02-essential-mortise-handle-set", "Godrej EM 02 Essential Mortise Handle Set", "mortise", "kraft", "hardware",
    "గోద్రెజ్ EM 02 Essential Mortise Handle Set: మోర్టైజ్ లాక్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "EM 02 Essential Mortise Handle Set from the Godrej mortise locks range. Available in 3 finishes: Satin Steel, Antique Brass, Matte Black. Sizes and options: 200 mm Door Handle Set 1CK; 200 mm Door Handle Set 2C; Coverplate Baby Latch; Rosette Door Handle Set 1CK; Rosette Door Handle Set 2C; Rosette Baby Latch; 200 mm Keyless Combi Set. MRP ₹1,390 – ₹2,560 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "21 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "21 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black"], 1390, 2560);
  gm("godrej-em-03-essential-mortise-handle-set", "Godrej EM 03 Essential Mortise Handle Set", "mortise", "kraft", "hardware",
    "గోద్రెజ్ EM 03 Essential Mortise Handle Set: మోర్టైజ్ లాక్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "EM 03 Essential Mortise Handle Set from the Godrej mortise locks range. Available in 3 finishes: Satin Steel, Antique Brass, Matte Black. Sizes and options: 200 mm Door Handle Set 1CK; 200 mm Door Handle Set 2C; Rosette Door Handle Set 1CK; Rosette Door Handle Set 2C; Rosette Baby Latch; 200 mm Keyless Combi Set. MRP ₹1,740 – ₹2,730 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "21 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "21 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black"], 1740, 2730);
  gm("godrej-em-04-essential-mortise-handle-set", "Godrej EM 04 Essential Mortise Handle Set", "mortise", "kraft", "hardware",
    "గోద్రెజ్ EM 04 Essential Mortise Handle Set: మోర్టైజ్ లాక్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "EM 04 Essential Mortise Handle Set from the Godrej mortise locks range. Available in 3 finishes: Satin Steel, Antique Brass, Matte Black. Sizes and options: 200 mm Door Handle Set 1CK; 200 mm Door Handle Set 2C; Rosette Door Handle Set 1CK; Rosette Door Handle Set 2C; Rosette Baby Latch; 200 mm Keyless Combi Set. MRP ₹1,740 – ₹2,730 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "21 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "21 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black"], 1740, 2730);
  gm("godrej-em-05-essential-mortise-handle-set", "Godrej EM 05 Essential Mortise Handle Set", "mortise", "kraft", "hardware",
    "గోద్రెజ్ EM 05 Essential Mortise Handle Set: మోర్టైజ్ లాక్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "EM 05 Essential Mortise Handle Set from the Godrej mortise locks range. Available in 3 finishes: Satin Steel, Antique Brass, Matte Black. Sizes and options: 200 mm Door Handle Set 1CK; 200 mm Door Handle Set 2C; Rosette Door Handle Set 1CK; Rosette Door Handle Set 2C; Rosette Baby Latch; 200 mm Keyless Combi Set. MRP ₹1,740 – ₹2,730 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "18 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "18 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black"], 1740, 2730);
  gm("godrej-sec-01-240-mm-euro-mortise-combipack", "Godrej SEC 01 240 mm Euro Mortise Combipack", "mortise", "kraft", "hardware",
    "గోద్రెజ్ SEC 01 240 mm Euro Mortise Combipack: మోర్టైజ్ లాక్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "SEC 01 240 mm Euro Mortise Combipack from the Godrej mortise locks range. Available in 2 finishes: Antique Brass, Satin Steel & Gold. MRP ₹8,860 – ₹10,380 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "2 variants in the price list"}, ["Antique Brass", "Satin Steel & Gold"], 8860, 10380);
  gm("godrej-sec-02-240-mm-euro-mortise-combipack", "Godrej SEC 02 240 mm Euro Mortise Combipack", "mortise", "kraft", "hardware",
    "గోద్రెజ్ SEC 02 240 mm Euro Mortise Combipack: మోర్టైజ్ లాక్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "SEC 02 240 mm Euro Mortise Combipack from the Godrej mortise locks range. Available in 2 finishes: Antique Brass, Gold. MRP ₹7,210 – ₹8,880 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "2 variants in the price list"}, ["Antique Brass", "Gold"], 7210, 8880);
  gm("godrej-sec-03-240-mm-euro-mortise-combipack", "Godrej SEC 03 240 mm Euro Mortise Combipack", "mortise", "kraft", "hardware",
    "గోద్రెజ్ SEC 03 240 mm Euro Mortise Combipack: మోర్టైజ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "SEC 03 240 mm Euro Mortise Combipack from the Godrej mortise locks range. Available in 1 finish: Antique Brass. MRP ₹7,210 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "1 variants in the price list"}, ["Antique Brass"], 7210, 7210);
  gm("godrej-aura-240-mm-euro-mortise-combipack", "Godrej Aura 240 mm Euro Mortise Combipack", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Aura 240 mm Euro Mortise Combipack: మోర్టైజ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Aura 240 mm Euro Mortise Combipack from the Godrej mortise locks range. Available in 1 finish: Brass. MRP ₹6,670 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "1 variants in the price list"}, ["Brass"], 6670, 6670);
  gm("godrej-stella-6-lever-mortise-lock-combipack", "Godrej Stella 6 Lever Mortise Lock Combipack", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Stella 6 Lever Mortise Lock Combipack: మోర్టైజ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Stella 6 Lever Mortise Lock Combipack from the Godrej mortise locks range. Available in 1 finish: Satin Steel. MRP ₹2,320 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "1 variants in the price list"}, ["Satin Steel"], 2320, 2320);
  gm("godrej-d-cor-6-lever-mortise-lock-combipack", "Godrej Décor 6 Lever Mortise Lock Combipack", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Décor 6 Lever Mortise Lock Combipack: మోర్టైజ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Décor 6 Lever Mortise Lock Combipack from the Godrej mortise locks range. Available in 1 finish: Brass. MRP ₹2,940 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "1 variants in the price list"}, ["Brass"], 2940, 2940);
  gm("godrej-venus-6-lever-mortise-lock-combipack", "Godrej Venus 6 Lever Mortise Lock Combipack", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Venus 6 Lever Mortise Lock Combipack: మోర్టైజ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Venus 6 Lever Mortise Lock Combipack from the Godrej mortise locks range. Available in 1 finish: Brass. MRP ₹2,840 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "1 variants in the price list"}, ["Brass"], 2840, 2840);
  gm("godrej-elc-01-6-lever-mortise-lock-combipack", "Godrej ELC 01 6 Lever Mortise Lock Combipack", "mortise", "kraft", "hardware",
    "గోద్రెజ్ ELC 01 6 Lever Mortise Lock Combipack: మోర్టైజ్ లాక్, 5 ఫినిష్‌లలో లభిస్తుంది.",
    "ELC 01 6 Lever Mortise Lock Combipack from the Godrej mortise locks range. Available in 5 finishes: Satin Steel, Antique Brass, Rose Gold, Matte Black, Matte Black Nickel. MRP ₹2,080 – ₹2,250 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["5 finishes available", "5 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "5 variants in the price list"}, ["Satin Steel", "Antique Brass", "Rose Gold", "Matte Black", "Matte Black Nickel"], 2080, 2250);
  gm("godrej-elc-02-6-lever-mortise-lock-combipack", "Godrej ELC 02 6 Lever Mortise Lock Combipack", "mortise", "kraft", "hardware",
    "గోద్రెజ్ ELC 02 6 Lever Mortise Lock Combipack: మోర్టైజ్ లాక్, 5 ఫినిష్‌లలో లభిస్తుంది.",
    "ELC 02 6 Lever Mortise Lock Combipack from the Godrej mortise locks range. Available in 5 finishes: Satin Steel, Antique Brass, Rose Gold, Matte Black, Matte Black Nickel. MRP ₹2,080 – ₹2,250 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["5 finishes available", "5 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "5 variants in the price list"}, ["Satin Steel", "Antique Brass", "Rose Gold", "Matte Black", "Matte Black Nickel"], 2080, 2250);
  gm("godrej-elc-09-6-lever-mortise-lock-combipack", "Godrej ELC 09 6 Lever Mortise Lock Combipack", "mortise", "kraft", "hardware",
    "గోద్రెజ్ ELC 09 6 Lever Mortise Lock Combipack: మోర్టైజ్ లాక్, 5 ఫినిష్‌లలో లభిస్తుంది.",
    "ELC 09 6 Lever Mortise Lock Combipack from the Godrej mortise locks range. Available in 5 finishes: Satin Steel, Antique Brass, Rose Gold, Matte Black, Matte Black Nickel. MRP ₹2,140 – ₹2,310 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["5 finishes available", "5 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "5 variants in the price list"}, ["Satin Steel", "Antique Brass", "Rose Gold", "Matte Black", "Matte Black Nickel"], 2140, 2310);
  gm("godrej-elc-10-6-lever-mortise-lock-combipack", "Godrej ELC 10 6 Lever Mortise Lock Combipack", "mortise", "kraft", "hardware",
    "గోద్రెజ్ ELC 10 6 Lever Mortise Lock Combipack: మోర్టైజ్ లాక్, 5 ఫినిష్‌లలో లభిస్తుంది.",
    "ELC 10 6 Lever Mortise Lock Combipack from the Godrej mortise locks range. Available in 5 finishes: Satin Steel, Antique Brass, Rose Gold, Matte Black, Matte Black Nickel. MRP ₹2,140 – ₹2,310 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["5 finishes available", "5 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "5 variants in the price list"}, ["Satin Steel", "Antique Brass", "Rose Gold", "Matte Black", "Matte Black Nickel"], 2140, 2310);
  gm("godrej-elc-19-6-lever-mortise-lock-combipack", "Godrej ELC 19 6 Lever Mortise Lock Combipack", "mortise", "kraft", "hardware",
    "గోద్రెజ్ ELC 19 6 Lever Mortise Lock Combipack: మోర్టైజ్ లాక్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "ELC 19 6 Lever Mortise Lock Combipack from the Godrej mortise locks range. Available in 3 finishes: Satin Steel, Antique Brass, Matte Black Rose. MRP ₹2,460 – ₹2,590 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "3 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black Rose"], 2460, 2590);
  gm("godrej-elc-03-6-lever-mortise-lock-combipack", "Godrej ELC 03 6 Lever Mortise Lock Combipack", "mortise", "kraft", "hardware",
    "గోద్రెజ్ ELC 03 6 Lever Mortise Lock Combipack: మోర్టైజ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "ELC 03 6 Lever Mortise Lock Combipack from the Godrej mortise locks range. Available in 1 finish: Satin Steel. MRP ₹2,080 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "1 variants in the price list"}, ["Satin Steel"], 2080, 2080);
  gm("godrej-elc-04-6-lever-mortise-lock-combipack", "Godrej ELC 04 6 Lever Mortise Lock Combipack", "mortise", "kraft", "hardware",
    "గోద్రెజ్ ELC 04 6 Lever Mortise Lock Combipack: మోర్టైజ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "ELC 04 6 Lever Mortise Lock Combipack from the Godrej mortise locks range. Available in 1 finish: Satin Steel. MRP ₹2,080 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "1 variants in the price list"}, ["Satin Steel"], 2080, 2080);
  gm("godrej-elc-05-6-lever-mortise-lock-combipack", "Godrej ELC 05 6 Lever Mortise Lock Combipack", "mortise", "kraft", "hardware",
    "గోద్రెజ్ ELC 05 6 Lever Mortise Lock Combipack: మోర్టైజ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "ELC 05 6 Lever Mortise Lock Combipack from the Godrej mortise locks range. Available in 1 finish: Satin Steel. MRP ₹2,080 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "1 variants in the price list"}, ["Satin Steel"], 2080, 2080);
  gm("godrej-elc-06-6-lever-mortise-lock-combipack", "Godrej ELC 06 6 Lever Mortise Lock Combipack", "mortise", "kraft", "hardware",
    "గోద్రెజ్ ELC 06 6 Lever Mortise Lock Combipack: మోర్టైజ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "ELC 06 6 Lever Mortise Lock Combipack from the Godrej mortise locks range. Available in 1 finish: Satin Steel. MRP ₹2,080 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "1 variants in the price list"}, ["Satin Steel"], 2080, 2080);
  gm("godrej-elc-07-6-lever-mortise-lock-combipack", "Godrej ELC 07 6 Lever Mortise Lock Combipack", "mortise", "kraft", "hardware",
    "గోద్రెజ్ ELC 07 6 Lever Mortise Lock Combipack: మోర్టైజ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "ELC 07 6 Lever Mortise Lock Combipack from the Godrej mortise locks range. Available in 1 finish: Satin Steel. MRP ₹2,080 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "1 variants in the price list"}, ["Satin Steel"], 2080, 2080);
  gm("godrej-gloria-6-lever-mortise-lock-combipack", "Godrej Gloria 6 Lever Mortise Lock Combipack", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Gloria 6 Lever Mortise Lock Combipack: మోర్టైజ్ లాక్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Gloria 6 Lever Mortise Lock Combipack from the Godrej mortise locks range. Available in 2 finishes: Satin Steel, Antique Brass. MRP ₹2,660 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "2 variants in the price list"}, ["Satin Steel", "Antique Brass"], 2660, 2660);
  gm("godrej-lever-mortise-baby-latch", "Godrej Lever Mortise Baby Latch", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Lever Mortise Baby Latch: మోర్టైజ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Lever Mortise Baby Latch from the Godrej mortise locks range. Available in 1 finish: Satin Steel. MRP ₹1,550 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "2 variants in the price list"}, ["Satin Steel"], 1550, 1550);
  gm("godrej-4-lever-narrow-stile-mortise-lock", "Godrej 4 Lever Narrow Stile Mortise Lock", "mortise", "kraft", "hardware",
    "గోద్రెజ్ 4 Lever Narrow Stile Mortise Lock: మోర్టైజ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "4 Lever Narrow Stile Mortise Lock from the Godrej mortise locks range. Available in 1 finish: Satin Steel. MRP ₹830 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "1 variants in the price list"}, ["Satin Steel"], 830, 830);
  gm("godrej-4-lever-hookbolt", "Godrej 4 Lever Hookbolt", "mortise", "kraft", "hardware",
    "గోద్రెజ్ 4 Lever Hookbolt: మోర్టైజ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "4 Lever Hookbolt from the Godrej mortise locks range. Available in 1 finish: Satin Steel. MRP ₹870 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "1 variants in the price list"}, ["Satin Steel"], 870, 870);
  gm("godrej-6-lever-mortise-2-way-deadlock", "Godrej 6 Lever Mortise 2 Way Deadlock", "mortise", "kraft", "hardware",
    "గోద్రెజ్ 6 Lever Mortise 2 Way Deadlock: మోర్టైజ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "6 Lever Mortise 2 Way Deadlock from the Godrej mortise locks range. Available in 1 finish: Satin Steel. MRP ₹730 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "1 variants in the price list"}, ["Satin Steel"], 730, 730);
  gm("godrej-7-lever-mortise-2-way-deadlock", "Godrej 7 Lever Mortise 2 Way Deadlock", "mortise", "kraft", "hardware",
    "గోద్రెజ్ 7 Lever Mortise 2 Way Deadlock: మోర్టైజ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "7 Lever Mortise 2 Way Deadlock from the Godrej mortise locks range. Available in 1 finish: Satin Steel. MRP ₹1,240 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "1 variants in the price list"}, ["Satin Steel"], 1240, 1240);
  gm("godrej-europrofile-mortise-lock-bodies", "Godrej Europrofile Mortise Lock Bodies", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Europrofile Mortise Lock Bodies: మోర్టైజ్ లాక్, 9 ఫినిష్‌లలో లభిస్తుంది.",
    "Europrofile Mortise Lock Bodies from the Godrej mortise locks range. Available in 9 finishes: Chrome, Antique Brass, Satin Steel, Matte Black, Sunset Rose Gold, Rose Gold, Matte Black Nickel, Glossy Black, Antique Copper. Sizes and options: NEH Series Keyless Latch; 176 mm Lock Body; 240 mm Lock Body; 240 mm Lock Body 60 mm BS; 180 mm Euro Narrow Stile Hookbolt; 240 mm Euro Narrow Stile Lock Body; 240 mm Eco Lock Body; 240 mm Roller Lock Body (50 mm). MRP ₹800 – ₹2,090 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["9 finishes available", "24 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "24 variants in the price list"}, ["Chrome", "Antique Brass", "Satin Steel", "Matte Black", "Sunset Rose Gold", "Rose Gold", "Matte Black Nickel", "Glossy Black", "Antique Copper"], 800, 2090);
  gm("godrej-europrofile-pin-cylinder-60-mm", "Godrej Europrofile Pin Cylinder 60 mm", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Europrofile Pin Cylinder 60 mm: మోర్టైజ్ లాక్, 8 ఫినిష్‌లలో లభిస్తుంది.",
    "Europrofile Pin Cylinder 60 mm from the Godrej mortise locks range. Available in 8 finishes: Satin Steel, Antique Brass, Matte Black, Matte Black Nickel, Rose Gold, Antique Copper, Brass, PVD Rose Gold. Sizes and options: 60 mm Eco Pin Cylinder 1CK; 60 mm Pin Cylinder 1CK; 60 mm Eco Pin Cylinder 2C; 60 mm Pin Cylinder 2C; 60 mm Pin Cylinder Keyless; 60mm KYL Eco Cylinder. MRP ₹890 – ₹2,000 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["8 finishes available", "26 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "26 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black", "Matte Black Nickel", "Rose Gold", "Antique Copper", "Brass", "PVD Rose Gold"], 890, 2000);
  gm("godrej-europrofile-pin-cylinder-70-mm", "Godrej Europrofile Pin Cylinder 70 mm", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Europrofile Pin Cylinder 70 mm: మోర్టైజ్ లాక్, 7 ఫినిష్‌లలో లభిస్తుంది.",
    "Europrofile Pin Cylinder 70 mm from the Godrej mortise locks range. Available in 7 finishes: Satin Steel, Antique Brass, Matte Black, Matte Black Nickel, Rose Gold, Antique Copper, PVD Rose Gold. Sizes and options: 70 mm Eco Pin Cylinder 1CK; 70 mm Pin Cylinder 1CK; 70 mm Eco Pin Cylinder 2C; 70 mm Pin Cylinder 2C; 70 mm Pin Cylinder Keyless; 70mm KYL Eco Cylinder. MRP ₹990 – ₹2,140 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["7 finishes available", "25 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "25 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black", "Matte Black Nickel", "Rose Gold", "Antique Copper", "PVD Rose Gold"], 990, 2140);
  gm("godrej-europrofile-pin-cylinder-80-mm", "Godrej Europrofile Pin Cylinder 80 mm", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Europrofile Pin Cylinder 80 mm: మోర్టైజ్ లాక్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "Europrofile Pin Cylinder 80 mm from the Godrej mortise locks range. Available in 3 finishes: Satin Steel, Antique Brass, Matte Black. Sizes and options: 80 mm Pin Cylinder 1CK; 80 mm Pin Cylinder 2C; 80 mm Pin Cylinder Keyless; 80mm Cylinder AB; 80mm Cylinder MB. MRP ₹1,420 – ₹1,900 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "5 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "5 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black"], 1420, 1900);
  gm("godrej-europrofile-pin-cylinder-90-mm", "Godrej Europrofile Pin Cylinder 90 mm", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Europrofile Pin Cylinder 90 mm: మోర్టైజ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Europrofile Pin Cylinder 90 mm from the Godrej mortise locks range. Available in 1 finish: Satin Steel. MRP ₹1,970 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "1 variants in the price list"}, ["Satin Steel"], 1970, 1970);
  gm("godrej-europrofile-pin-cylinder-100-mm", "Godrej Europrofile Pin Cylinder 100 mm", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Europrofile Pin Cylinder 100 mm: మోర్టైజ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Europrofile Pin Cylinder 100 mm from the Godrej mortise locks range. Available in 1 finish: Satin Steel. MRP ₹1,750 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "1 variants in the price list"}, ["Satin Steel"], 1750, 1750);
  gm("godrej-europrofile-pin-cylinder-40-mm", "Godrej Europrofile Pin Cylinder 40 mm", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Europrofile Pin Cylinder 40 mm: మోర్టైజ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Europrofile Pin Cylinder 40 mm from the Godrej mortise locks range. Available in 1 finish: Satin Steel. Sizes and options: 40 mm 1C Half Pin Cylinder; 40 mm 1K Half Pin Cylinder. MRP ₹1,270 – ₹1,330 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "2 variants in the price list"}, ["Satin Steel"], 1270, 1330);
  gm("godrej-ulturo-ultra-xl-euro-cylinder-60-mm", "Godrej Ulturo Ultra XL+ Euro Cylinder 60 mm", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Ulturo Ultra XL+ Euro Cylinder 60 mm: మోర్టైజ్ లాక్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "Ulturo Ultra XL+ Euro Cylinder 60 mm from the Godrej mortise locks range. Available in 4 finishes: Satin Steel, Antique Brass, Matte Black, Matte Black Nickel. Sizes and options: 60 mm Ulturo Cylinder 1CK; 60 mm Ulturo Cylinder 2C. MRP ₹1,650 – ₹1,850 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "8 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "8 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black", "Matte Black Nickel"], 1650, 1850);
  gm("godrej-ulturo-ultra-xl-euro-cylinder-70-mm", "Godrej Ulturo Ultra XL+ Euro Cylinder 70 mm", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Ulturo Ultra XL+ Euro Cylinder 70 mm: మోర్టైజ్ లాక్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "Ulturo Ultra XL+ Euro Cylinder 70 mm from the Godrej mortise locks range. Available in 4 finishes: Satin Steel, Antique Brass, Matte Black, Matte Black Nickel. Sizes and options: 70 mm Ulturo Cylinder 1CK; 70 mm Ulturo Cylinder 2C. MRP ₹1,820 – ₹1,960 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "8 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "8 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black", "Matte Black Nickel"], 1820, 1960);
  gm("godrej-ulturo-ultra-xl-euro-cylinder-80-mm", "Godrej Ulturo Ultra XL+ Euro Cylinder 80 mm", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Ulturo Ultra XL+ Euro Cylinder 80 mm: మోర్టైజ్ లాక్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "Ulturo Ultra XL+ Euro Cylinder 80 mm from the Godrej mortise locks range. Available in 4 finishes: Satin Steel, Antique Brass, Matte Black, Matte Black Nickel. Sizes and options: 80 mm Ulturo Cylinder 1CK; 80 mm Ulturo Cylinder 2C. MRP ₹1,950 – ₹2,050 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "8 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Mortise lock & handle", "variants": "8 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black", "Matte Black Nickel"], 1950, 2050);
  gm("godrej-pentabolt-aries-3ks", "Godrej Pentabolt Aries 3KS", "mortise", "slate", "hardware",
    "గోద్రెజ్ Pentabolt Aries 3KS: రిమ్ లాక్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Pentabolt Aries 3KS from the Godrej rim locks range. Available in 2 finishes: Roman Silver, Vegas Gold. MRP ₹14,400 – ₹15,230 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "6 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Rim lock", "variants": "6 variants in the price list"}, ["Roman Silver", "Vegas Gold"], 14400, 15230);
  gm("godrej-pentabolt-exs", "Godrej Pentabolt EXS+", "mortise", "slate", "hardware",
    "గోద్రెజ్ Pentabolt EXS+: రిమ్ లాక్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Pentabolt EXS+ from the Godrej rim locks range. Available in 2 finishes: Satin Nickel, Antique Brass. Sizes and options: 1CK 60 mm; 1CK Deadbolt 60 mm; 60 mm Pentabolt EXS+ 2C Deadbolt. MRP ₹8,250 – ₹9,140 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "7 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Rim lock", "variants": "7 variants in the price list"}, ["Satin Nickel", "Antique Brass"], 8250, 9140);
  gm("godrej-centaur-exs", "Godrej Centaur EXS+", "mortise", "slate", "hardware",
    "గోద్రెజ్ Centaur EXS+: రిమ్ లాక్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Centaur EXS+ from the Godrej rim locks range. Available in 2 finishes: Satin Nickel, Antique Brass. Sizes and options: 1CK Latchbolt 60 mm; 1CK Deadbolt 60 mm; 2C Deadbolt 60 mm. MRP ₹8,550 – ₹9,300 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "6 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Rim lock", "variants": "6 variants in the price list"}, ["Satin Nickel", "Antique Brass"], 8550, 9300);
  gm("godrej-centaur-ultra-xl", "Godrej Centaur Ultra XL+", "mortise", "slate", "hardware",
    "గోద్రెజ్ Centaur Ultra XL+: రిమ్ లాక్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "Centaur Ultra XL+ from the Godrej rim locks range. Available in 3 finishes: Satin Nickel, Antique Brass, Antique Copper. Sizes and options: 1CK Latchbolt 60 mm; 1CK Deadbolt 60 mm; 2C Deadbolt 60 mm. MRP ₹5,820 – ₹6,650 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "9 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Rim lock", "variants": "9 variants in the price list"}, ["Satin Nickel", "Antique Brass", "Antique Copper"], 5820, 6650);
  gm("godrej-centaur-ultra-xl-double-door", "Godrej Centaur Ultra XL+ Double Door", "mortise", "slate", "hardware",
    "గోద్రెజ్ Centaur Ultra XL+ Double Door: రిమ్ లాక్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Centaur Ultra XL+ Double Door from the Godrej rim locks range. Available in 2 finishes: Satin Nickel, Antique Brass. Sizes and options: XL+ 1CK Deadbolt 60 mm; XL+ 2C Deadbolt 60 mm. MRP ₹5,820 – ₹6,570 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Rim lock", "variants": "4 variants in the price list"}, ["Satin Nickel", "Antique Brass"], 5820, 6570);
  gm("godrej-tribolt-ultra-xl", "Godrej Tribolt Ultra XL+", "mortise", "slate", "hardware",
    "గోద్రెజ్ Tribolt Ultra XL+: రిమ్ లాక్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "Tribolt Ultra XL+ from the Godrej rim locks range. Available in 4 finishes: Satin Nickel, Antique Brass, Matte Black Nickel, Rose Gold. Sizes and options: 1CK Latchbolt 60 mm; 1CK Deadbolt 60 mm; 2C Deadbolt 60 mm; 1CK 60 mm; Ultra XL+ 2C Deadbolt 60 mm; Combipack 60 mm. MRP ₹4,310 – ₹7,140 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "18 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Rim lock", "variants": "18 variants in the price list"}, ["Satin Nickel", "Antique Brass", "Matte Black Nickel", "Rose Gold"], 4310, 7140);
  gm("godrej-tribolt-ultra", "Godrej Tribolt Ultra", "mortise", "slate", "hardware",
    "గోద్రెజ్ Tribolt Ultra: రిమ్ లాక్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Tribolt Ultra from the Godrej rim locks range. Available in 2 finishes: Satin Nickel, Antique Brass. Sizes and options: 1CK Latchbolt 69 mm; 1CK Deadbolt 69 mm; 2C (Inside Opening) 69 mm; 2C Deadbolt 69 mm. MRP ₹4,430 – ₹5,120 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "8 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Rim lock", "variants": "8 variants in the price list"}, ["Satin Nickel", "Antique Brass"], 4430, 5120);
  gm("godrej-twinbolt-ultra-xl", "Godrej Twinbolt Ultra XL+", "mortise", "slate", "hardware",
    "గోద్రెజ్ Twinbolt Ultra XL+: రిమ్ లాక్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "Twinbolt Ultra XL+ from the Godrej rim locks range. Available in 4 finishes: Satin Nickel, Antique Brass, Matte Black Nickel, Rose Gold. Sizes and options: 1CK Lachbolt 60 mm; 1CK Deadbolt 60 mm; 1CK Latchbolt 60 mm; 2C Deadbolt 60 mm. MRP ₹2,670 – ₹3,350 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "14 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Rim lock", "variants": "14 variants in the price list"}, ["Satin Nickel", "Antique Brass", "Matte Black Nickel", "Rose Gold"], 2670, 3350);
  gm("godrej-trishaft-ultra", "Godrej Trishaft Ultra", "mortise", "slate", "hardware",
    "గోద్రెజ్ Trishaft Ultra: రిమ్ లాక్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "Trishaft Ultra from the Godrej rim locks range. Available in 3 finishes: Satin Nickel, Antique Brass, Cool Ivory. Sizes and options: 1CK Deadbolt 60 mm; 2C Deadbolt 60 mm; Combipack 60 mm. MRP ₹3,330 – ₹6,960 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "8 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Rim lock", "variants": "8 variants in the price list"}, ["Satin Nickel", "Antique Brass", "Cool Ivory"], 3330, 6960);
  gm("godrej-vertibolt-ultra-xl", "Godrej Vertibolt Ultra XL+", "mortise", "slate", "hardware",
    "గోద్రెజ్ Vertibolt Ultra XL+: రిమ్ లాక్, 6 ఫినిష్‌లలో లభిస్తుంది.",
    "Vertibolt Ultra XL+ from the Godrej rim locks range. Available in 6 finishes: Satin Nickel, Antique Brass, Rose Gold, Matte Black Nickel, Textured Brown, Satin Steel. Sizes and options: 63 mm Vertibolt Ultra XL+ 1CK; 63 mm Vertibolt Ultra XL+ 2C. MRP ₹2,860 – ₹6,450 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["6 finishes available", "14 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Rim lock", "variants": "14 variants in the price list"}, ["Satin Nickel", "Antique Brass", "Rose Gold", "Matte Black Nickel", "Textured Brown", "Satin Steel"], 2860, 6450);
  gm("godrej-vertibolt-ultra", "Godrej Vertibolt Ultra", "mortise", "slate", "hardware",
    "గోద్రెజ్ Vertibolt Ultra: రిమ్ లాక్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "Vertibolt Ultra from the Godrej rim locks range. Available in 4 finishes: Satin Nickel, Antique Brass, Textured Brown, Cool Ivory. Sizes and options: 63 mm Vertibolt Ultra 1CK; 63 mm Vertibolt Ultra 2C. MRP ₹2,510 – ₹3,210 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "8 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Rim lock", "variants": "8 variants in the price list"}, ["Satin Nickel", "Antique Brass", "Textured Brown", "Cool Ivory"], 2510, 3210);
  gm("godrej-rim-deadbolt-ultra-xl", "Godrej Rim Deadbolt Ultra XL+", "mortise", "slate", "hardware",
    "గోద్రెజ్ Rim Deadbolt Ultra XL+: రిమ్ లాక్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "Rim Deadbolt Ultra XL+ from the Godrej rim locks range. Available in 4 finishes: Satin Nickel, Antique Brass, Matte Black Nickel, Rose Gold. Sizes and options: 1CK 60 mm; 2C 60 mm. MRP ₹2,370 – ₹2,820 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "8 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Rim lock", "variants": "8 variants in the price list"}, ["Satin Nickel", "Antique Brass", "Matte Black Nickel", "Rose Gold"], 2370, 2820);
  gm("godrej-rim-deadbolt-reversible", "Godrej Rim Deadbolt Reversible", "mortise", "slate", "hardware",
    "గోద్రెజ్ Rim Deadbolt Reversible: రిమ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Rim Deadbolt Reversible from the Godrej rim locks range. Available in 1 finish: Cool Ivory. MRP ₹1,730 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Rim lock", "variants": "1 variants in the price list"}, ["Cool Ivory"], 1730, 1730);
  gm("godrej-deadbolt-compact", "Godrej Deadbolt Compact", "mortise", "slate", "hardware",
    "గోద్రెజ్ Deadbolt Compact: రిమ్ లాక్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Deadbolt Compact from the Godrej rim locks range. Available in 2 finishes: Textured Black, Textured Brown. MRP ₹1,190 – ₹1,240 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Rim lock", "variants": "4 variants in the price list"}, ["Textured Black", "Textured Brown"], 1190, 1240);
  gm("godrej-twinbolt-compact", "Godrej Twinbolt Compact", "mortise", "slate", "hardware",
    "గోద్రెజ్ Twinbolt Compact: రిమ్ లాక్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Twinbolt Compact from the Godrej rim locks range. Available in 2 finishes: Textured Black, Textured Brown. MRP ₹1,430 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Rim lock", "variants": "4 variants in the price list"}, ["Textured Black", "Textured Brown"], 1430, 1430);
  gm("godrej-tribolt-compact", "Godrej Tribolt Compact", "mortise", "slate", "hardware",
    "గోద్రెజ్ Tribolt Compact: రిమ్ లాక్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "Tribolt Compact from the Godrej rim locks range. Available in 3 finishes: Textured Black, Textured Brown, Cool Ivory. MRP ₹1,780 – ₹1,850 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "9 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Rim lock", "variants": "9 variants in the price list"}, ["Textured Black", "Textured Brown", "Cool Ivory"], 1780, 1850);
  gm("godrej-pin-cylinder-premium-night-latch", "Godrej Pin Cylinder Premium Night Latch", "mortise", "slate", "hardware",
    "గోద్రెజ్ Pin Cylinder Premium Night Latch: రిమ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Pin Cylinder Premium Night Latch from the Godrej rim locks range. Available in 1 finish: Brushed Steel. MRP ₹1,970 – ₹1,990 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Rim lock", "variants": "2 variants in the price list"}, ["Brushed Steel"], 1970, 1990);
  gm("godrej-7-lever-super-night-latch", "Godrej 7 Lever Super Night Latch", "mortise", "slate", "hardware",
    "గోద్రెజ్ 7 Lever Super Night Latch: రిమ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "7 Lever Super Night Latch from the Godrej rim locks range. Available in 1 finish: Textured Brown. MRP ₹1,870 – ₹1,880 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Rim lock", "variants": "2 variants in the price list"}, ["Textured Brown"], 1870, 1880);
  gm("godrej-7-lever-night-latch", "Godrej 7 Lever Night Latch", "mortise", "slate", "hardware",
    "గోద్రెజ్ 7 Lever Night Latch: రిమ్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "7 Lever Night Latch from the Godrej rim locks range. Available in 1 finish: Textured Brown. MRP ₹1,860 – ₹1,870 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Rim lock", "variants": "2 variants in the price list"}, ["Textured Brown"], 1860, 1870);
  gm("godrej-pin-cylinder-rim-lock", "Godrej Pin Cylinder Rim Lock", "mortise", "slate", "hardware",
    "గోద్రెజ్ Pin Cylinder Rim Lock: రిమ్ లాక్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Pin Cylinder Rim Lock from the Godrej rim locks range. Available in 2 finishes: Beige Brown, Metallic Satin. MRP ₹2,220 – ₹2,570 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Rim lock", "variants": "4 variants in the price list"}, ["Beige Brown", "Metallic Satin"], 2220, 2570);
  gm("godrej-khatakhat-lock-ultra-xl", "Godrej Khatakhat Lock Ultra XL+", "mortise", "slate", "hardware",
    "గోద్రెజ్ Khatakhat Lock Ultra XL+: రిమ్ లాక్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Khatakhat Lock Ultra XL+ from the Godrej rim locks range. Available in 2 finishes: Cherry Brown, Silver Grey. MRP ₹2,240 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Rim lock", "variants": "2 variants in the price list"}, ["Cherry Brown", "Silver Grey"], 2240, 2240);
  gm("godrej-ultra-retrofit-adaptor", "Godrej Ultra Retrofit Adaptor", "mortise", "slate", "hardware",
    "గోద్రెజ్ Ultra Retrofit Adaptor: రిమ్ లాక్.",
    "Ultra Retrofit Adaptor from the Godrej rim locks range. Sizes and options: Type A; Type B; Type C. MRP ₹300 – ₹320 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Rim lock", "variants": "3 variants in the price list"}, [], 300, 320);
  gm("godrej-premium-cylindrical-locks-keyed-entrance", "Godrej Premium Cylindrical Locks - Keyed (Entrance)", "mortise", "grey", "hardware",
    "గోద్రెజ్ Premium Cylindrical Locks - Keyed (Entrance): సిలిండ్రికల్ లాక్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Premium Cylindrical Locks - Keyed (Entrance) from the Godrej cylindrical locks range. Available in 2 finishes: Polished Brass, Stainless Steel. MRP ₹1,630 – ₹1,800 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["indoor"], {"type": "Cylindrical lock", "variants": "2 variants in the price list"}, ["Polished Brass", "Stainless Steel"], 1630, 1800);
  gm("godrej-classic-cylindrical-locks-keyed-entrance", "Godrej Classic Cylindrical Locks - Keyed (Entrance)", "mortise", "grey", "hardware",
    "గోద్రెజ్ Classic Cylindrical Locks - Keyed (Entrance): సిలిండ్రికల్ లాక్, 6 ఫినిష్‌లలో లభిస్తుంది.",
    "Classic Cylindrical Locks - Keyed (Entrance) from the Godrej cylindrical locks range. Available in 6 finishes: Brass, Stainless Steel, Wooden, Antique Brass, Rose Gold, Matte Black. Sizes and options: Lock Pin 60 mm; Lock Pin 70 mm. MRP ₹1,270 – ₹1,570 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["6 finishes available", "9 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["indoor"], {"type": "Cylindrical lock", "variants": "9 variants in the price list"}, ["Brass", "Stainless Steel", "Wooden", "Antique Brass", "Rose Gold", "Matte Black"], 1270, 1570);
  gm("godrej-premium-cylindrical-locks-keyless-bathroom", "Godrej Premium Cylindrical Locks - Keyless (Bathroom)", "mortise", "grey", "hardware",
    "గోద్రెజ్ Premium Cylindrical Locks - Keyless (Bathroom): సిలిండ్రికల్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Premium Cylindrical Locks - Keyless (Bathroom) from the Godrej cylindrical locks range. Available in 1 finish: Stainless Steel. MRP ₹1,430 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["indoor"], {"type": "Cylindrical lock", "variants": "1 variants in the price list"}, ["Stainless Steel"], 1430, 1430);
  gm("godrej-classic-cylindrical-locks-keyless-bathroom", "Godrej Classic Cylindrical Locks - Keyless (Bathroom)", "mortise", "grey", "hardware",
    "గోద్రెజ్ Classic Cylindrical Locks - Keyless (Bathroom): సిలిండ్రికల్ లాక్, 5 ఫినిష్‌లలో లభిస్తుంది.",
    "Classic Cylindrical Locks - Keyless (Bathroom) from the Godrej cylindrical locks range. Available in 5 finishes: Brass, Stainless Steel, Antique Brass, Rose Gold, Matte Black. Sizes and options: Lock Pin 60 mm Cylinder - Keyless; Lock Pin 70 mm Cylinder - Keyless. MRP ₹1,130 – ₹1,400 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["5 finishes available", "8 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["indoor"], {"type": "Cylindrical lock", "variants": "8 variants in the price list"}, ["Brass", "Stainless Steel", "Antique Brass", "Rose Gold", "Matte Black"], 1130, 1400);
  gm("godrej-navtal-ultra-xl-padlock", "Godrej NavTal Ultra XL+ Padlock", "padlock", "ink", "hardware",
    "గోద్రెజ్ NavTal Ultra XL+ Padlock: ప్యాడ్‌లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "NavTal Ultra XL+ Padlock from the Godrej padlocks range. Available in 1 finish: Brass. Sizes and options: (4 Keys); (4 Keys - Blister); (4 Keys - Pack of 2). MRP ₹1,330 – ₹2,500 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "shop", "box"], {"type": "Padlock", "variants": "3 variants in the price list"}, ["Brass"], 1330, 2500);
  gm("godrej-navtal-padlock", "Godrej NavTal Padlock", "padlock", "ink", "hardware",
    "గోద్రెజ్ NavTal Padlock: ప్యాడ్‌లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "NavTal Padlock from the Godrej padlocks range. Available in 1 finish: Brass. Sizes and options: 5 Lever (2 keys); 5 Lever (3 keys); 6 Lever (2 keys); 6 Lever (3 keys); 6 Lever (3 Keys - Blister); 6 Lever Long Shackle (3 keys); 6 Lever Pack of 2 with; 6 Lever Pack of 4 with; 7 Lever Hardened (2 keys); 7 Lever Hardened (4 keys); 7 Lever Shut Height 30 mm; 7 Lever Shut Height 50 mm; 7 Lever Pack of 2 with; 7 Lever Pack of 4 with; and more. MRP ₹490 – ₹3,750 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "17 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "shop", "box"], {"type": "Padlock", "variants": "17 variants in the price list"}, ["Brass"], 490, 3750);
  gm("godrej-no-1-solid-brass-padlock", "Godrej No. 1 Solid Brass Padlock", "padlock", "ink", "hardware",
    "గోద్రెజ్ No. 1 Solid Brass Padlock: ప్యాడ్‌లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "No. 1 Solid Brass Padlock from the Godrej padlocks range. Available in 1 finish: Brass. MRP ₹670 – ₹1,510 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "5 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "shop", "box"], {"type": "Padlock", "variants": "5 variants in the price list"}, ["Brass"], 670, 1510);
  gm("godrej-sherlock-solid-brass-padlock", "Godrej Sherlock Solid Brass Padlock", "padlock", "ink", "hardware",
    "గోద్రెజ్ Sherlock Solid Brass Padlock: ప్యాడ్‌లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Sherlock Solid Brass Padlock from the Godrej padlocks range. Available in 1 finish: Brass. MRP ₹3,170 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "shop", "box"], {"type": "Padlock", "variants": "1 variants in the price list"}, ["Brass"], 3170, 3170);
  gm("godrej-duralock-ultra-xl-padlock", "Godrej Duralock Ultra XL+ Padlock", "padlock", "ink", "hardware",
    "గోద్రెజ్ Duralock Ultra XL+ Padlock: ప్యాడ్‌లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Duralock Ultra XL+ Padlock from the Godrej padlocks range. Available in 1 finish: Stainless Steel. Sizes and options: 70 mm (3 Keys); 90 mm (3 Keys). MRP ₹1,030 – ₹5,720 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "6 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "shop", "box"], {"type": "Padlock", "variants": "6 variants in the price list"}, ["Stainless Steel"], 1030, 5720);
  gm("godrej-shutter-locks-ultra", "Godrej Shutter Locks Ultra", "padlock", "ink", "hardware",
    "గోద్రెజ్ Shutter Locks Ultra: ప్యాడ్‌లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Shutter Locks Ultra from the Godrej padlocks range. Available in 1 finish: Black. Sizes and options: Shutter Centre Lock Ultra; Shutter Side Lock Ultra; Shutter Side Lock Ultra 1CK. MRP ₹2,420 – ₹4,570 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "shop", "box"], {"type": "Padlock", "variants": "4 variants in the price list"}, ["Black"], 2420, 4570);
  gm("godrej-scorpio-ultra-padlock", "Godrej Scorpio Ultra Padlock", "padlock", "ink", "hardware",
    "గోద్రెజ్ Scorpio Ultra Padlock: ప్యాడ్‌లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Scorpio Ultra Padlock from the Godrej padlocks range. Available in 1 finish: Satin Steel. MRP ₹2,160 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "shop", "box"], {"type": "Padlock", "variants": "1 variants in the price list"}, ["Satin Steel"], 2160, 2160);
  gm("godrej-herculoc-plus-3ks-padlock", "Godrej Herculoc Plus 3KS Padlock", "padlock", "ink", "hardware",
    "గోద్రెజ్ Herculoc Plus 3KS Padlock: ప్యాడ్‌లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Herculoc Plus 3KS Padlock from the Godrej padlocks range. Available in 1 finish: Satin Steel. MRP ₹8,960 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "shop", "box"], {"type": "Padlock", "variants": "1 variants in the price list"}, ["Satin Steel"], 8960, 8960);
  gm("godrej-ace-pro-ss-304-padlock", "Godrej Ace Pro SS 304 Padlock", "padlock", "ink", "hardware",
    "గోద్రెజ్ Ace Pro SS 304 Padlock: ప్యాడ్‌లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Ace Pro SS 304 Padlock from the Godrej padlocks range. Available in 1 finish: Satin Steel. Sizes and options: 5 Levers SS 304 (3 Keys); 6 Levers SS 304 (3 Keys); 7 Levers SS 304 (3 Keys). MRP ₹305 – ₹600 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "shop", "box"], {"type": "Padlock", "variants": "3 variants in the price list"}, ["Satin Steel"], 305, 600);
  gm("godrej-round-padlock", "Godrej Round Padlock", "padlock", "ink", "hardware",
    "గోద్రెజ్ Round Padlock: ప్యాడ్‌లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Round Padlock from the Godrej padlocks range. Available in 1 finish: Satin Steel. Sizes and options: 5 Levers (3 Keys); 6 Levers (3 Keys); 7 Levers (3 Keys); 10 Levers (3 Keys). MRP ₹265 – ₹870 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "shop", "box"], {"type": "Padlock", "variants": "4 variants in the price list"}, ["Satin Steel"], 265, 870);
  gm("godrej-square-padlock", "Godrej Square Padlock", "padlock", "ink", "hardware",
    "గోద్రెజ్ Square Padlock: ప్యాడ్‌లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Square Padlock from the Godrej padlocks range. Available in 1 finish: Satin Steel. Sizes and options: 6 Levers (4 Keys); 7 Levers (4 Keys); 8 Levers (4 Keys). MRP ₹475 – ₹905 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "shop", "box"], {"type": "Padlock", "variants": "3 variants in the price list"}, ["Satin Steel"], 475, 905);
  gm("godrej-freedom-padlock", "Godrej Freedom Padlock", "padlock", "ink", "hardware",
    "గోద్రెజ్ Freedom Padlock: ప్యాడ్‌లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Freedom Padlock from the Godrej padlocks range. Available in 1 finish: Matte Steel. Sizes and options: 5 Levers (2 keys); 6 Levers (2 keys); 7 Levers (3 keys). MRP ₹340 – ₹570 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "shop", "box"], {"type": "Padlock", "variants": "3 variants in the price list"}, ["Matte Steel"], 340, 570);
  gm("godrej-kaditala-6-lever-lock", "Godrej Kaditala 6 Lever Lock", "padlock", "ink", "hardware",
    "గోద్రెజ్ Kaditala 6 Lever Lock: ప్యాడ్‌లాక్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Kaditala 6 Lever Lock from the Godrej padlocks range. Available in 2 finishes: Textured Brown, Chrome plated. Sizes and options: Levers 200 mm (3 Keys); Levers 275 mm (3 Keys). MRP ₹1,320 – ₹1,620 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "shop", "box"], {"type": "Padlock", "variants": "4 variants in the price list"}, ["Textured Brown", "Chrome plated"], 1320, 1620);
  gm("godrej-mylock-candy-luggage-lock", "Godrej MyLock Candy Luggage Lock", "padlock", "ink", "hardware",
    "గోద్రెజ్ MyLock Candy Luggage Lock: ప్యాడ్‌లాక్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "MyLock Candy Luggage Lock from the Godrej padlocks range. Available in 4 finishes: Turmeric Yellow, Citrus Green, Tangerine Tango, Blue Grey. MRP ₹245 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "shop", "box"], {"type": "Padlock", "variants": "1 variants in the price list"}, ["Turmeric Yellow", "Citrus Green", "Tangerine Tango", "Blue Grey"], 245, 245);
  gm("godrej-curvo-duo-ss-304-furniture-lock", "Godrej Curvo Duo SS 304 Furniture Lock", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Curvo Duo SS 304 Furniture Lock: ఫర్నిచర్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Curvo Duo SS 304 Furniture Lock from the Godrej furniture locks range. Available in 1 finish: Stainless Steel. Sizes and options: SS 304 Wardrobe Lock 25 mm; SS 304 Wardrobe Lock 32 mm; SS 304 Drawer Lock 20 mm; SS 304 Drawer Lock 25 mm. MRP ₹540 – ₹770 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "6 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "box"], {"type": "Furniture lock", "variants": "6 variants in the price list"}, ["Stainless Steel"], 540, 770);
  gm("godrej-nuvo-pin-cylinder-furniture-lock", "Godrej Nuvo Pin Cylinder Furniture Lock", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Nuvo Pin Cylinder Furniture Lock: ఫర్నిచర్ లాక్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "Nuvo Pin Cylinder Furniture Lock from the Godrej furniture locks range. Available in 4 finishes: Satin Steel, Textured Brown, Textured Black, Cool Ivory. Sizes and options: Cylinder Drawer Lock 20 mm; Cylinder Drawer Lock 25 mm; Cylinder Wardrobe Lock 25 mm; Cylinder Wardrobe Lock 32 mm. MRP ₹315 – ₹570 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "16 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "box"], {"type": "Furniture lock", "variants": "16 variants in the price list"}, ["Satin Steel", "Textured Brown", "Textured Black", "Cool Ivory"], 315, 570);
  gm("godrej-supernova-ultra-wardrobe-lock", "Godrej Supernova Ultra Wardrobe Lock", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Supernova Ultra Wardrobe Lock: ఫర్నిచర్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Supernova Ultra Wardrobe Lock from the Godrej furniture locks range. Available in 1 finish: Satin Steel. Sizes and options: 9 Pins Up to 35 mm Wardrobe lock; 9 Pins Up to 35 mm Wardrobe lock with Common Key. MRP ₹765 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "box"], {"type": "Furniture lock", "variants": "2 variants in the price list"}, ["Satin Steel"], 765, 765);
  gm("godrej-wardrobe-lock-for-sliding-door", "Godrej Wardrobe Lock for Sliding Door", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Wardrobe Lock for Sliding Door: ఫర్నిచర్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Wardrobe Lock for Sliding Door from the Godrej furniture locks range. Available in 1 finish: Black Finish. Sizes and options: 25 mm; 32 mm; 19 mm. MRP ₹555 – ₹1,670 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "7 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "box"], {"type": "Furniture lock", "variants": "7 variants in the price list"}, ["Black Finish"], 555, 1670);
  gm("godrej-almirah-lock", "Godrej Almirah Lock", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Almirah Lock: ఫర్నిచర్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Almirah Lock from the Godrej furniture locks range. Available in 1 finish: Nickel plated. MRP ₹630 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "box"], {"type": "Furniture lock", "variants": "1 variants in the price list"}, ["Nickel plated"], 630, 630);
  gm("godrej-10-lever-push-button-lock", "Godrej 10 Lever Push Button Lock", "mortise", "kraft", "hardware",
    "గోద్రెజ్ 10 Lever Push Button Lock: ఫర్నిచర్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "10 Lever Push Button Lock from the Godrej furniture locks range. Available in 1 finish: Nickel plated. MRP ₹980 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "box"], {"type": "Furniture lock", "variants": "1 variants in the price list"}, ["Nickel plated"], 980, 980);
  gm("godrej-cam-lock", "Godrej Cam Lock", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Cam Lock: ఫర్నిచర్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Cam Lock from the Godrej furniture locks range. Available in 1 finish: Nickel plated. Sizes and options: 5 Lever 12 mm; 10 Lever Pedestal 12 mm; 10 Lever Straight 12 mm; 10 Lever Long 12 mm. MRP ₹315 – ₹430 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "box"], {"type": "Furniture lock", "variants": "4 variants in the price list"}, ["Nickel plated"], 315, 430);
  gm("godrej-wafer-tumbler-multipurpose-lock", "Godrej Wafer Tumbler Multipurpose Lock", "mortise", "kraft", "hardware",
    "గోద్రెజ్ Wafer Tumbler Multipurpose Lock: ఫర్నిచర్ లాక్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "Wafer Tumbler Multipurpose Lock from the Godrej furniture locks range. Available in 3 finishes: Nickel plated, Textured Black, Chrome plated. Sizes and options: Popular 20 mm; 32 mm Popular 32 mm; New Multipurpose 25 mm; Multipurpose 25 mm; Multipurpose 21 mm. MRP ₹160 – ₹330 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "6 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "box"], {"type": "Furniture lock", "variants": "6 variants in the price list"}, ["Nickel plated", "Textured Black", "Chrome plated"], 160, 330);
  gm("godrej-6-lever-universal-drawer-lock", "Godrej 6 Lever Universal Drawer Lock", "mortise", "kraft", "hardware",
    "గోద్రెజ్ 6 Lever Universal Drawer Lock: ఫర్నిచర్ లాక్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "6 Lever Universal Drawer Lock from the Godrej furniture locks range. Available in 1 finish: Nickel plated. MRP ₹540 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "box"], {"type": "Furniture lock", "variants": "1 variants in the price list"}, ["Nickel plated"], 540, 540);
  gm("godrej-cameo-rose-handle", "Godrej Cameo Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Cameo Rose Handle: డోర్ హ్యాండిల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "Cameo Rose Handle from the Godrej home decor handles range. Available in 4 finishes: Satin Steel, Antique Brass, Sunset Rose Gold, Matte Black Nickel. MRP ₹4,530 – ₹4,890 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "4 variants in the price list"}, ["Satin Steel", "Antique Brass", "Sunset Rose Gold", "Matte Black Nickel"], 4530, 4890);
  gm("godrej-cameo-plate-handle", "Godrej Cameo Plate Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Cameo Plate Handle: డోర్ హ్యాండిల్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "Cameo Plate Handle from the Godrej home decor handles range. Available in 3 finishes: Satin Steel, Antique Brass, Sunset Rose Gold. MRP ₹5,470 – ₹5,790 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "3 variants in the price list"}, ["Satin Steel", "Antique Brass", "Sunset Rose Gold"], 5470, 5790);
  gm("godrej-ugo-rose-handle", "Godrej Ugo Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Ugo Rose Handle: డోర్ హ్యాండిల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "Ugo Rose Handle from the Godrej home decor handles range. Available in 4 finishes: Satin Steel, Antique Brass, Sunset Rose Gold, Matte Black Nickel. MRP ₹4,530 – ₹4,890 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "4 variants in the price list"}, ["Satin Steel", "Antique Brass", "Sunset Rose Gold", "Matte Black Nickel"], 4530, 4890);
  gm("godrej-ugo-plate-handle", "Godrej Ugo Plate Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Ugo Plate Handle: డోర్ హ్యాండిల్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "Ugo Plate Handle from the Godrej home decor handles range. Available in 3 finishes: Satin Steel, Antique Brass, Sunset Rose Gold. MRP ₹5,470 – ₹5,620 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "3 variants in the price list"}, ["Satin Steel", "Antique Brass", "Sunset Rose Gold"], 5470, 5620);
  gm("godrej-twist-rose-handle", "Godrej Twist Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Twist Rose Handle: డోర్ హ్యాండిల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "Twist Rose Handle from the Godrej home decor handles range. Available in 4 finishes: Satin Steel, Antique Brass, Sunset Rose Gold, Matte Black Nickel. MRP ₹5,360 – ₹5,710 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "4 variants in the price list"}, ["Satin Steel", "Antique Brass", "Sunset Rose Gold", "Matte Black Nickel"], 5360, 5710);
  gm("godrej-ecstacy-rose-handle", "Godrej Ecstacy Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Ecstacy Rose Handle: డోర్ హ్యాండిల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "Ecstacy Rose Handle from the Godrej home decor handles range. Available in 4 finishes: Satin Steel, Antique Brass, Sunset Rose Gold, Matte Black Nickel. MRP ₹4,410 – ₹4,760 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "4 variants in the price list"}, ["Satin Steel", "Antique Brass", "Sunset Rose Gold", "Matte Black Nickel"], 4410, 4760);
  gm("godrej-orso-rose-handle", "Godrej Orso Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Orso Rose Handle: డోర్ హ్యాండిల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "Orso Rose Handle from the Godrej home decor handles range. Available in 4 finishes: Satin Steel, Antique Brass, Sunset Rose Gold, Matte Black Nickel. MRP ₹4,890 – ₹5,230 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "4 variants in the price list"}, ["Satin Steel", "Antique Brass", "Sunset Rose Gold", "Matte Black Nickel"], 4890, 5230);
  gm("godrej-remo-rose-handle", "Godrej Remo Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Remo Rose Handle: డోర్ హ్యాండిల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "Remo Rose Handle from the Godrej home decor handles range. Available in 4 finishes: Satin Steel, Antique Brass, Sunset Rose Gold, Matte Black Nickel. MRP ₹3,940 – ₹4,290 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "4 variants in the price list"}, ["Satin Steel", "Antique Brass", "Sunset Rose Gold", "Matte Black Nickel"], 3940, 4290);
  gm("godrej-smooth-rose-handle", "Godrej Smooth Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Smooth Rose Handle: డోర్ హ్యాండిల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "Smooth Rose Handle from the Godrej home decor handles range. Available in 4 finishes: Satin Steel, Antique Brass, Sunset Rose Gold, Matte Black Nickel. MRP ₹4,640 – ₹5,000 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "4 variants in the price list"}, ["Satin Steel", "Antique Brass", "Sunset Rose Gold", "Matte Black Nickel"], 4640, 5000);
  gm("godrej-calla-rose-handle", "Godrej Calla Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Calla Rose Handle: డోర్ హ్యాండిల్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "Calla Rose Handle from the Godrej home decor handles range. Available in 3 finishes: Satin Steel, Sunset Rose Gold, Matte Black Nickel. MRP ₹4,290 – ₹4,640 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "3 variants in the price list"}, ["Satin Steel", "Sunset Rose Gold", "Matte Black Nickel"], 4290, 4640);
  gm("godrej-alpine-rose-handle", "Godrej Alpine Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Alpine Rose Handle: డోర్ హ్యాండిల్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Alpine Rose Handle from the Godrej home decor handles range. Available in 2 finishes: Satin Steel, Antique Brass. MRP ₹4,040 – ₹4,170 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "2 variants in the price list"}, ["Satin Steel", "Antique Brass"], 4040, 4170);
  gm("godrej-chris-rose-handle", "Godrej Chris Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Chris Rose Handle: డోర్ హ్యాండిల్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Chris Rose Handle from the Godrej home decor handles range. Available in 2 finishes: Satin Steel, Antique Brass. MRP ₹4,290 – ₹4,410 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "2 variants in the price list"}, ["Satin Steel", "Antique Brass"], 4290, 4410);
  gm("godrej-evolve-rose-handle", "Godrej Evolve Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Evolve Rose Handle: డోర్ హ్యాండిల్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Evolve Rose Handle from the Godrej home decor handles range. Available in 2 finishes: Satin Steel, Antique Brass. MRP ₹5,110 – ₹5,220 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "2 variants in the price list"}, ["Satin Steel", "Antique Brass"], 5110, 5220);
  gm("godrej-seh-03-plate-handle", "Godrej SEH 03 - Plate Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ SEH 03 - Plate Handle: డోర్ హ్యాండిల్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "SEH 03 - Plate Handle from the Godrej home decor handles range. Available in 1 finish: Antique Brass. MRP ₹5,360 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "1 variants in the price list"}, ["Antique Brass"], 5360, 5360);
  gm("godrej-udaan-rose-handle", "Godrej Udaan Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Udaan Rose Handle: డోర్ హ్యాండిల్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Udaan Rose Handle from the Godrej home decor handles range. Available in 1 finish: Antique Brass. MRP ₹13,560 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "1 variants in the price list"}, ["Antique Brass"], 13560, 13560);
  gm("godrej-udaan-plate-handle", "Godrej Udaan Plate Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Udaan Plate Handle: డోర్ హ్యాండిల్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Udaan Plate Handle from the Godrej home decor handles range. Available in 2 finishes: Antique Brass, Antique Copper. MRP ₹21,060 – ₹21,500 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "2 variants in the price list"}, ["Antique Brass", "Antique Copper"], 21060, 21500);
  gm("godrej-kalasam-rose-handle", "Godrej Kalasam Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Kalasam Rose Handle: డోర్ హ్యాండిల్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Kalasam Rose Handle from the Godrej home decor handles range. Available in 1 finish: Antique Brass. MRP ₹12,310 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "1 variants in the price list"}, ["Antique Brass"], 12310, 12310);
  gm("godrej-kalasam-plate-handle", "Godrej Kalasam Plate Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Kalasam Plate Handle: డోర్ హ్యాండిల్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Kalasam Plate Handle from the Godrej home decor handles range. Available in 2 finishes: Antique Brass, Antique Copper. MRP ₹22,080 – ₹22,270 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "2 variants in the price list"}, ["Antique Brass", "Antique Copper"], 22080, 22270);
  gm("godrej-bel-rose-handle", "Godrej Bel Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Bel Rose Handle: డోర్ హ్యాండిల్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Bel Rose Handle from the Godrej home decor handles range. Available in 1 finish: Antique Brass. MRP ₹12,310 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "1 variants in the price list"}, ["Antique Brass"], 12310, 12310);
  gm("godrej-bel-plate-handle", "Godrej Bel Plate Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Bel Plate Handle: డోర్ హ్యాండిల్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Bel Plate Handle from the Godrej home decor handles range. Available in 2 finishes: Antique Brass, Antique Copper. MRP ₹17,150 – ₹18,090 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "2 variants in the price list"}, ["Antique Brass", "Antique Copper"], 17150, 18090);
  gm("godrej-mor-rose-handle", "Godrej Mor Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Mor Rose Handle: డోర్ హ్యాండిల్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Mor Rose Handle from the Godrej home decor handles range. Available in 1 finish: Antique Brass. MRP ₹12,310 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "1 variants in the price list"}, ["Antique Brass"], 12310, 12310);
  gm("godrej-mor-plate-handle", "Godrej Mor Plate Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Mor Plate Handle: డోర్ హ్యాండిల్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Mor Plate Handle from the Godrej home decor handles range. Available in 2 finishes: Antique Brass, Antique Copper. MRP ₹19,120 – ₹19,140 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "2 variants in the price list"}, ["Antique Brass", "Antique Copper"], 19120, 19140);
  gm("godrej-hdh-01-rose-handle", "Godrej HDH 01 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ HDH 01 Rose Handle: డోర్ హ్యాండిల్, 5 ఫినిష్‌లలో లభిస్తుంది.",
    "HDH 01 Rose Handle from the Godrej home decor handles range. Available in 5 finishes: Satin Steel, Antique Brass, Matte Black, Matte Black Nickel, PVD Rose Gold. MRP ₹4,890 – ₹6,080 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["5 finishes available", "5 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "5 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black", "Matte Black Nickel", "PVD Rose Gold"], 4890, 6080);
  gm("godrej-hdh-02-rose-handle", "Godrej HDH 02 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ HDH 02 Rose Handle: డోర్ హ్యాండిల్, 5 ఫినిష్‌లలో లభిస్తుంది.",
    "HDH 02 Rose Handle from the Godrej home decor handles range. Available in 5 finishes: Satin Steel, Antique Brass, Matte Black, Matte Black Nickel, PVD Rose Gold. MRP ₹4,290 – ₹5,480 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["5 finishes available", "5 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "5 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black", "Matte Black Nickel", "PVD Rose Gold"], 4290, 5480);
  gm("godrej-hdh-03-rose-handle", "Godrej HDH 03 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ HDH 03 Rose Handle: డోర్ హ్యాండిల్, 5 ఫినిష్‌లలో లభిస్తుంది.",
    "HDH 03 Rose Handle from the Godrej home decor handles range. Available in 5 finishes: Satin Steel, Antique Brass, Matte Black, Matte Black Nickel, PVD Rose Gold. MRP ₹4,530 – ₹5,710 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["5 finishes available", "5 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "5 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black", "Matte Black Nickel", "PVD Rose Gold"], 4530, 5710);
  gm("godrej-hdh-04-rose-handle", "Godrej HDH 04 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ HDH 04 Rose Handle: డోర్ హ్యాండిల్, 5 ఫినిష్‌లలో లభిస్తుంది.",
    "HDH 04 Rose Handle from the Godrej home decor handles range. Available in 5 finishes: Satin Steel, Antique Brass, Matte Black, Matte Black Nickel, PVD Rose Gold. MRP ₹4,290 – ₹5,480 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["5 finishes available", "5 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "5 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black", "Matte Black Nickel", "PVD Rose Gold"], 4290, 5480);
  gm("godrej-hdh-05-rose-handle", "Godrej HDH 05 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ HDH 05 Rose Handle: డోర్ హ్యాండిల్, 5 ఫినిష్‌లలో లభిస్తుంది.",
    "HDH 05 Rose Handle from the Godrej home decor handles range. Available in 5 finishes: Satin Matte, Matte Antique Brass, Matte Black, Matte Black Nickel, PVD Rose Gold. MRP ₹3,760 – ₹4,940 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["5 finishes available", "5 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "5 variants in the price list"}, ["Satin Matte", "Matte Antique Brass", "Matte Black", "Matte Black Nickel", "PVD Rose Gold"], 3760, 4940);
  gm("godrej-hdh-06-rose-handle", "Godrej HDH 06 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ HDH 06 Rose Handle: డోర్ హ్యాండిల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "HDH 06 Rose Handle from the Godrej home decor handles range. Available in 4 finishes: Antique Brass Walnut, Matte Black Rose, Matte Black Nickel, PVD Rose Gold. MRP ₹4,340 – ₹5,410 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "4 variants in the price list"}, ["Antique Brass Walnut", "Matte Black Rose", "Matte Black Nickel", "PVD Rose Gold"], 4340, 5410);
  gm("godrej-hdh-07-rose-handle", "Godrej HDH 07 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ HDH 07 Rose Handle: డోర్ హ్యాండిల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "HDH 07 Rose Handle from the Godrej home decor handles range. Available in 4 finishes: Antique Brass Walnut, Matte Black Rose, Matte Black Nickel, PVD Rose Gold. MRP ₹4,340 – ₹5,410 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "4 variants in the price list"}, ["Antique Brass Walnut", "Matte Black Rose", "Matte Black Nickel", "PVD Rose Gold"], 4340, 5410);
  gm("godrej-hdh-08-rose-handle", "Godrej HDH 08 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ HDH 08 Rose Handle: డోర్ హ్యాండిల్, 5 ఫినిష్‌లలో లభిస్తుంది.",
    "HDH 08 Rose Handle from the Godrej home decor handles range. Available in 5 finishes: Satin Matte, Matte Antique Brass, Matte Black, Matte Black Nickel, PVD Rose Gold. MRP ₹4,740 – ₹5,930 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["5 finishes available", "5 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "5 variants in the price list"}, ["Satin Matte", "Matte Antique Brass", "Matte Black", "Matte Black Nickel", "PVD Rose Gold"], 4740, 5930);
  gm("godrej-hdh-09-rose-handle", "Godrej HDH 09 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ HDH 09 Rose Handle: డోర్ హ్యాండిల్, 5 ఫినిష్‌లలో లభిస్తుంది.",
    "HDH 09 Rose Handle from the Godrej home decor handles range. Available in 5 finishes: Satin Matte, Matte Antique Brass, Matte Black, Matte Black Nickel, PVD Rose Gold. MRP ₹6,730 – ₹7,990 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["5 finishes available", "5 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "5 variants in the price list"}, ["Satin Matte", "Matte Antique Brass", "Matte Black", "Matte Black Nickel", "PVD Rose Gold"], 6730, 7990);
  gm("godrej-hdh-10-rose-handle", "Godrej HDH 10 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ HDH 10 Rose Handle: డోర్ హ్యాండిల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "HDH 10 Rose Handle from the Godrej home decor handles range. Available in 4 finishes: Matte Antique Brass, Matte Black, Matte Black Nickel, PVD Rose Gold. MRP ₹7,740 – ₹8,810 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "4 variants in the price list"}, ["Matte Antique Brass", "Matte Black", "Matte Black Nickel", "PVD Rose Gold"], 7740, 8810);
  gm("godrej-hdh-11-rose-handle", "Godrej HDH 11 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ HDH 11 Rose Handle: డోర్ హ్యాండిల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "HDH 11 Rose Handle from the Godrej home decor handles range. Available in 4 finishes: Satin Matte, Antique Brass, Matte Black, PVD Rose Gold. MRP ₹6,290 – ₹7,550 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "4 variants in the price list"}, ["Satin Matte", "Antique Brass", "Matte Black", "PVD Rose Gold"], 6290, 7550);
  gm("godrej-hdh-12-rose-handle", "Godrej HDH 12 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ HDH 12 Rose Handle: డోర్ హ్యాండిల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "HDH 12 Rose Handle from the Godrej home decor handles range. Available in 4 finishes: Satin Matte, Antique Brass, Matte Black, PVD Rose Gold. MRP ₹6,290 – ₹7,550 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "4 variants in the price list"}, ["Satin Matte", "Antique Brass", "Matte Black", "PVD Rose Gold"], 6290, 7550);
  gm("godrej-hdh-13-rose-handle", "Godrej HDH 13 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ HDH 13 Rose Handle: డోర్ హ్యాండిల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "HDH 13 Rose Handle from the Godrej home decor handles range. Available in 4 finishes: Satin Matte, Antique Brass, Matte Black, PVD Rose Gold. MRP ₹5,660 – ₹6,920 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "4 variants in the price list"}, ["Satin Matte", "Antique Brass", "Matte Black", "PVD Rose Gold"], 5660, 6920);
  gm("godrej-hdh-14-rose-handle", "Godrej HDH 14 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ HDH 14 Rose Handle: డోర్ హ్యాండిల్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "HDH 14 Rose Handle from the Godrej home decor handles range. Available in 3 finishes: Antique Brass Walnut, Matte Black Rose, PVD Rose Gold. MRP ₹4,470 – ₹5,540 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "3 variants in the price list"}, ["Antique Brass Walnut", "Matte Black Rose", "PVD Rose Gold"], 4470, 5540);
  gm("godrej-hdh-15-rose-handle", "Godrej HDH 15 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ HDH 15 Rose Handle: డోర్ హ్యాండిల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "HDH 15 Rose Handle from the Godrej home decor handles range. Available in 4 finishes: Satin Steel, Antique Brass, Matte Black, PVD Rose Gold. MRP ₹6,290 – ₹7,550 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "4 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black", "PVD Rose Gold"], 6290, 7550);
  gm("godrej-hdh-16-rose-handle", "Godrej HDH 16 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ HDH 16 Rose Handle: డోర్ హ్యాండిల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "HDH 16 Rose Handle from the Godrej home decor handles range. Available in 4 finishes: Satin Steel, Antique Brass, Matte Black, PVD Rose Gold. MRP ₹6,290 – ₹7,550 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "4 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black", "PVD Rose Gold"], 6290, 7550);
  gm("godrej-hdh-17-rose-handle", "Godrej HDH 17 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ HDH 17 Rose Handle: డోర్ హ్యాండిల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "HDH 17 Rose Handle from the Godrej home decor handles range. Available in 4 finishes: Satin Steel, Antique Brass, Matte Black, PVD Rose Gold. MRP ₹5,800 – ₹7,050 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "4 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black", "PVD Rose Gold"], 5800, 7050);
  gm("godrej-hdh-18-rose-handle", "Godrej HDH 18 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ HDH 18 Rose Handle: డోర్ హ్యాండిల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "HDH 18 Rose Handle from the Godrej home decor handles range. Available in 4 finishes: Satin Steel, Antique Brass, Matte Black, PVD Rose Gold. MRP ₹6,290 – ₹7,550 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "4 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black", "PVD Rose Gold"], 6290, 7550);
  gm("godrej-hdh-19-rose-handle", "Godrej HDH 19 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ HDH 19 Rose Handle: డోర్ హ్యాండిల్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "HDH 19 Rose Handle from the Godrej home decor handles range. Available in 3 finishes: Antique Brass Walnut, Matte Black Rose, PVD Rose Gold. MRP ₹4,640 – ₹5,830 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "3 variants in the price list"}, ["Antique Brass Walnut", "Matte Black Rose", "PVD Rose Gold"], 4640, 5830);
  gm("godrej-hdh-20-rose-handle", "Godrej HDH 20 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ HDH 20 Rose Handle: డోర్ హ్యాండిల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "HDH 20 Rose Handle from the Godrej home decor handles range. Available in 4 finishes: Satin Steel, Antique Brass Walnut, Matte Black Rose, PVD Rose Gold. MRP ₹6,920 – ₹8,190 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "4 variants in the price list"}, ["Satin Steel", "Antique Brass Walnut", "Matte Black Rose", "PVD Rose Gold"], 6920, 8190);
  gm("godrej-hdh-21-rose-handle", "Godrej HDH 21 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ HDH 21 Rose Handle: డోర్ హ్యాండిల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "HDH 21 Rose Handle from the Godrej home decor handles range. Available in 4 finishes: Satin Steel, Antique Brass Walnut, Matte Black Rose, PVD Rose Gold. MRP ₹6,160 – ₹7,430 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "4 variants in the price list"}, ["Satin Steel", "Antique Brass Walnut", "Matte Black Rose", "PVD Rose Gold"], 6160, 7430);
  gm("godrej-hdh-22-rose-handle", "Godrej HDH 22 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ HDH 22 Rose Handle: డోర్ హ్యాండిల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "HDH 22 Rose Handle from the Godrej home decor handles range. Available in 4 finishes: Satin Steel, Antique Brass Walnut, Matte Black Rose, PVD Rose Gold. MRP ₹6,550 – ₹7,800 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "4 variants in the price list"}, ["Satin Steel", "Antique Brass Walnut", "Matte Black Rose", "PVD Rose Gold"], 6550, 7800);
  gm("godrej-hdh-23-rose-handle", "Godrej HDH 23 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ HDH 23 Rose Handle: డోర్ హ్యాండిల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "HDH 23 Rose Handle from the Godrej home decor handles range. Available in 4 finishes: Satin Steel, Antique Brass Walnut, Matte Black Rose, PVD Rose Gold. MRP ₹6,160 – ₹7,430 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "4 variants in the price list"}, ["Satin Steel", "Antique Brass Walnut", "Matte Black Rose", "PVD Rose Gold"], 6160, 7430);
  gm("godrej-neh-19-rose-handle", "Godrej NEH 19 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ NEH 19 Rose Handle: డోర్ హ్యాండిల్, 5 ఫినిష్‌లలో లభిస్తుంది.",
    "NEH 19 Rose Handle from the Godrej home decor handles range. Available in 5 finishes: Satin Steel, Antique Brass, Matte Black Rose, Black Antique Copper, Matte Black Nickel. MRP ₹2,330 – ₹2,530 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["5 finishes available", "5 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "5 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black Rose", "Black Antique Copper", "Matte Black Nickel"], 2330, 2530);
  gm("godrej-neh-20-rose-handle", "Godrej NEH 20 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ NEH 20 Rose Handle: డోర్ హ్యాండిల్, 5 ఫినిష్‌లలో లభిస్తుంది.",
    "NEH 20 Rose Handle from the Godrej home decor handles range. Available in 5 finishes: Satin Steel, Antique Brass, Matte Black, Antique Copper, Matte Black Nickel. MRP ₹2,330 – ₹2,530 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["5 finishes available", "5 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "5 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black", "Antique Copper", "Matte Black Nickel"], 2330, 2530);
  gm("godrej-neh-21-rose-handle", "Godrej NEH 21 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ NEH 21 Rose Handle: డోర్ హ్యాండిల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "NEH 21 Rose Handle from the Godrej home decor handles range. Available in 4 finishes: Satin Steel, Antique Brass, Matte Black Rose, Black Antique Copper. MRP ₹2,160 – ₹2,330 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "4 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black Rose", "Black Antique Copper"], 2160, 2330);
  gm("godrej-neh-22-rose-handle", "Godrej NEH 22 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ NEH 22 Rose Handle: డోర్ హ్యాండిల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "NEH 22 Rose Handle from the Godrej home decor handles range. Available in 4 finishes: Satin Steel, Antique Brass, Matte Black Rose, Black Antique Copper. MRP ₹2,160 – ₹2,330 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "4 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black Rose", "Black Antique Copper"], 2160, 2330);
  gm("godrej-gloria-rose-handle", "Godrej Gloria Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Gloria Rose Handle: డోర్ హ్యాండిల్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "Gloria Rose Handle from the Godrej home decor handles range. Available in 3 finishes: Satin Steel, Antique Brass, Matte Black Rose. MRP ₹2,960 – ₹3,160 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "3 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black Rose"], 2960, 3160);
  gm("godrej-neh-06-rose-handle", "Godrej NEH 06 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ NEH 06 Rose Handle: డోర్ హ్యాండిల్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "NEH 06 Rose Handle from the Godrej home decor handles range. Available in 3 finishes: Satin Steel, Matte Black Rose, Matte Black Nickel. MRP ₹3,110 – ₹3,160 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "3 variants in the price list"}, ["Satin Steel", "Matte Black Rose", "Matte Black Nickel"], 3110, 3160);
  gm("godrej-neh-17-rose-handle", "Godrej NEH 17 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ NEH 17 Rose Handle: డోర్ హ్యాండిల్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "NEH 17 Rose Handle from the Godrej home decor handles range. Available in 2 finishes: Satin Steel, Antique Brass. MRP ₹2,110 – ₹2,300 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "2 variants in the price list"}, ["Satin Steel", "Antique Brass"], 2110, 2300);
  gm("godrej-neh-07-rose-handle", "Godrej NEH 07 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ NEH 07 Rose Handle: డోర్ హ్యాండిల్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "NEH 07 Rose Handle from the Godrej home decor handles range. Available in 1 finish: Satin Steel. MRP ₹2,710 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "1 variants in the price list"}, ["Satin Steel"], 2710, 2710);
  gm("godrej-neh-16-rose-handle", "Godrej NEH 16 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ NEH 16 Rose Handle: డోర్ హ్యాండిల్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "NEH 16 Rose Handle from the Godrej home decor handles range. Available in 1 finish: Satin Steel. MRP ₹2,270 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "1 variants in the price list"}, ["Satin Steel"], 2270, 2270);
  gm("godrej-neh-15-rose-handle", "Godrej NEH 15 Rose Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ NEH 15 Rose Handle: డోర్ హ్యాండిల్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "NEH 15 Rose Handle from the Godrej home decor handles range. Available in 1 finish: Satin Steel. MRP ₹2,270 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "1 variants in the price list"}, ["Satin Steel"], 2270, 2270);
  gm("godrej-anoushka-pull-handle", "Godrej Anoushka Pull Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Anoushka Pull Handle: డోర్ హ్యాండిల్, 6 ఫినిష్‌లలో లభిస్తుంది.",
    "Anoushka Pull Handle from the Godrej home decor handles range. Available in 6 finishes: Brass, Satin Steel, Antique Brass, Matte Black, Matte Black Nickel, Rose Gold. Sizes and options: 250 mm; Anoushka Mini Pull Handle 200 mm. MRP ₹1,390 – ₹1,580 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["6 finishes available", "11 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "11 variants in the price list"}, ["Brass", "Satin Steel", "Antique Brass", "Matte Black", "Matte Black Nickel", "Rose Gold"], 1390, 1580);
  gm("godrej-tibo-pull-handle", "Godrej Tibo Pull Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Tibo Pull Handle: డోర్ హ్యాండిల్, 5 ఫినిష్‌లలో లభిస్తుంది.",
    "Tibo Pull Handle from the Godrej home decor handles range. Available in 5 finishes: Antique Brass, Satin Steel, Matte Black, Matte Black Nickel, Rose Gold. Sizes and options: 300 mm; 240 mm. MRP ₹2,180 – ₹2,630 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["5 finishes available", "9 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "9 variants in the price list"}, ["Antique Brass", "Satin Steel", "Matte Black", "Matte Black Nickel", "Rose Gold"], 2180, 2630);
  gm("godrej-marin-pull-handle", "Godrej Marin Pull Handle", "mortise", "orange", "doorfit",
    "గోద్రెజ్ Marin Pull Handle: డోర్ హ్యాండిల్, 5 ఫినిష్‌లలో లభిస్తుంది.",
    "Marin Pull Handle from the Godrej home decor handles range. Available in 5 finishes: Antique Brass, Satin Steel, Matte Black, Matte Black Nickel, Rose Gold. Sizes and options: 240 mm; Marin Mini Pull Handle 200 mm. MRP ₹1,630 – ₹1,840 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["5 finishes available", "10 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door handle", "variants": "10 variants in the price list"}, ["Antique Brass", "Satin Steel", "Matte Black", "Matte Black Nickel", "Rose Gold"], 1630, 1840);
  gm("godrej-cerus-universal-door-closer", "Godrej Cerus Universal Door Closer", "block", "grey", "doorfit",
    "గోద్రెజ్ Cerus Universal Door Closer: డోర్ క్లోజర్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "Cerus Universal Door Closer from the Godrej door controls range. Available in 3 finishes: Silver, Matte Black, Gold. Sizes and options: Door Closer; Cerus Pelmet Arm Universal. MRP ₹2,420 – ₹3,660 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Door closer", "variants": "4 variants in the price list"}, ["Silver", "Matte Black", "Gold"], 2420, 3660);
  gm("godrej-hercules-door-closer", "Godrej Hercules Door Closer", "block", "grey", "doorfit",
    "గోద్రెజ్ Hercules Door Closer: డోర్ క్లోజర్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "Hercules Door Closer from the Godrej door controls range. Available in 3 finishes: Silver, Matte Black, Gold. Sizes and options: Closer; Hercules Incrust. MRP ₹2,100 – ₹2,220 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Door closer", "variants": "3 variants in the price list"}, ["Silver", "Matte Black", "Gold"], 2100, 2220);
  gm("godrej-concealed-door-closer-85-kg", "Godrej Concealed Door Closer 85 kg", "block", "grey", "doorfit",
    "గోద్రెజ్ Concealed Door Closer 85 kg: డోర్ క్లోజర్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Concealed Door Closer 85 kg from the Godrej door controls range. Available in 1 finish: Silver. MRP ₹7,040 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["door"], {"type": "Door closer", "variants": "1 variants in the price list"}, ["Silver"], 7040, 7040);
  gm("godrej-ss-plain-joint-hinges", "Godrej SS Plain Joint Hinges", "block", "grey", "doorfit",
    "గోద్రెజ్ SS Plain Joint Hinges: డోర్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "SS Plain Joint Hinges from the Godrej door fittings range. Available in 1 finish: Stainless Steel. Sizes and options: Door Hinge Plain Joint (3 x 16); Door Hinge Plain Joint (3 x 14); Door Hinge Plain Joint (4 x 14); Door Hinge Plain Joint (5 x 14); Door Hinge Plain Joint (3 x 12); Door Hinge Plain Joint (4 x 12); Door Hinge Plain Joint (5 x 12); Door Hinge Plain Joint (6 x 12). MRP ₹55 – ₹255 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "8 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door fitting", "variants": "8 variants in the price list"}, ["Stainless Steel"], 55, 255);
  gm("godrej-ss-cut-hinges", "Godrej SS Cut Hinges", "block", "grey", "doorfit",
    "గోద్రెజ్ SS Cut Hinges: డోర్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "SS Cut Hinges from the Godrej door fittings range. Available in 1 finish: Stainless Steel. Sizes and options: Door Hinge Cut Hinge (3 x 1/2 x 3/4); Door Hinge Cut Hinge (3 x 3/8 x 1). MRP ₹60 – ₹67 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door fitting", "variants": "2 variants in the price list"}, ["Stainless Steel"], 60, 67);
  gm("godrej-ss-ball-bearing-hinges", "Godrej SS Ball Bearing Hinges", "block", "grey", "doorfit",
    "గోద్రెజ్ SS Ball Bearing Hinges: డోర్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "SS Ball Bearing Hinges from the Godrej door fittings range. Available in 1 finish: SS 304. Sizes and options: Door Hinge 2 Ball Bearing (5 x 10); Door Hinge 2 Ball Bearing (4 x 10); Door Hinge 2 Ball Bearing (5 x 12). MRP ₹355 – ₹455 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door fitting", "variants": "4 variants in the price list"}, ["SS 304"], 355, 455);
  gm("godrej-ss-304-plain-joint-hinges", "Godrej SS 304 Plain Joint Hinges", "block", "grey", "doorfit",
    "గోద్రెజ్ SS 304 Plain Joint Hinges: డోర్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "SS 304 Plain Joint Hinges from the Godrej door fittings range. Available in 1 finish: SS 304. Sizes and options: Door Hinge Plain Joint (5 x 10); Door Hinge Plain Joint (4 x 10); Door Hinge Plain Joint (5 x 12). MRP ₹360 – ₹410 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door fitting", "variants": "3 variants in the price list"}, ["SS 304"], 360, 410);
  gm("godrej-incrust-plain-joint-hinges", "Godrej Incrust Plain Joint Hinges", "block", "grey", "doorfit",
    "గోద్రెజ్ Incrust Plain Joint Hinges: డోర్ ఫిట్టింగ్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Incrust Plain Joint Hinges from the Godrej door fittings range. Available in 2 finishes: Antique Brass, Matte Black. Sizes and options: Door Hinge Plain Joint (3 x 16); Door Hinge Plain Joint (3 x 14); Door Hinge Plain Joint (4 x 14); Door Hinge Plain Joint (5 x 14); Door Hinge Plain Joint (3 x 12); Door Hinge Plain Joint (4 x 12); Door Hinge Plain Joint (5 x 12); Door Hinge Plain Joint (6 x 12); Door Hinge 2 Ball Bearing (5 x 10); Door Hinge 2 Ball Bearing (4 x 10); Door Hinge 2 Ball Bearing (5 x 12). MRP ₹80 – ₹440 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "24 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door fitting", "variants": "24 variants in the price list"}, ["Antique Brass", "Matte Black"], 80, 440);
  gm("godrej-aldrop", "Godrej Aldrop", "block", "grey", "doorfit",
    "గోద్రెజ్ Aldrop: డోర్ ఫిట్టింగ్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "Aldrop from the Godrej door fittings range. Available in 3 finishes: Stainless Steel, Matte Black, Antique Brass. MRP ₹590 – ₹680 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "6 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door fitting", "variants": "6 variants in the price list"}, ["Stainless Steel", "Matte Black", "Antique Brass"], 590, 680);
  gm("godrej-inner-aldrop", "Godrej Inner Aldrop", "block", "grey", "doorfit",
    "గోద్రెజ్ Inner Aldrop: డోర్ ఫిట్టింగ్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "Inner Aldrop from the Godrej door fittings range. Available in 3 finishes: Stainless Steel, Matte Black, Antique Brass. MRP ₹420 – ₹460 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door fitting", "variants": "3 variants in the price list"}, ["Stainless Steel", "Matte Black", "Antique Brass"], 420, 460);
  gm("godrej-aldrop-brass", "Godrej Aldrop Brass", "block", "grey", "doorfit",
    "గోద్రెజ్ Aldrop Brass: డోర్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Aldrop Brass from the Godrej door fittings range. Available in 1 finish: Stainless Steel. MRP ₹1,390 – ₹2,300 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door fitting", "variants": "2 variants in the price list"}, ["Stainless Steel"], 1390, 2300);
  gm("godrej-door-stopper", "Godrej Door Stopper", "block", "grey", "doorfit",
    "గోద్రెజ్ Door Stopper: డోర్ ఫిట్టింగ్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "Door Stopper from the Godrej door fittings range. Available in 3 finishes: Satin Steel, Antique Brass, Matte Black. MRP ₹145 – ₹175 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door fitting", "variants": "3 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black"], 145, 175);
  gm("godrej-tower-bolt-regular", "Godrej Tower Bolt - Regular", "block", "grey", "doorfit",
    "గోద్రెజ్ Tower Bolt - Regular: డోర్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Tower Bolt - Regular from the Godrej door fittings range. Available in 1 finish: Stainless Steel. MRP ₹125 – ₹330 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "5 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door fitting", "variants": "5 variants in the price list"}, ["Stainless Steel"], 125, 330);
  gm("godrej-tower-bolt-designer", "Godrej Tower Bolt - Designer", "block", "grey", "doorfit",
    "గోద్రెజ్ Tower Bolt - Designer: డోర్ ఫిట్టింగ్, 3 ఫినిష్‌లలో లభిస్తుంది.",
    "Tower Bolt - Designer from the Godrej door fittings range. Available in 3 finishes: Aluminium, Antique Brass, Matte Black. MRP ₹185 – ₹970 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["3 finishes available", "21 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["door", "indoor"], {"type": "Door fitting", "variants": "21 variants in the price list"}, ["Aluminium", "Antique Brass", "Matte Black"], 185, 970);
  gm("godrej-hikido-inline", "Godrej HIKIDO Inline", "block", "grey", "kitchen",
    "గోద్రెజ్ HIKIDO Inline: వార్డ్‌రోబ్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "HIKIDO Inline from the Godrej wardrobe fittings range. Available in 1 finish: Aluminium. Sizes and options: 1750 mm; 1950 mm; 2150 mm; 2350 mm; 2950 mm. MRP ₹97,900 – ₹1,26,220 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "5 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Wardrobe fitting", "variants": "5 variants in the price list"}, ["Aluminium"], 97900, 126220);
  gm("godrej-hikido-topper-rollers-dampers", "Godrej HIKIDO Topper (Rollers & Dampers)", "block", "grey", "kitchen",
    "గోద్రెజ్ HIKIDO Topper (Rollers & Dampers): వార్డ్‌రోబ్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "HIKIDO Topper (Rollers & Dampers) from the Godrej wardrobe fittings range. Available in 1 finish: Anthracite. Sizes and options: 2 Door 80 Kg Soft Close (Rollers + Dampers Set); 3 Door 80 Kg Soft Close (Rollers + Dampers Set). MRP ₹10,580 – ₹13,320 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Wardrobe fitting", "variants": "2 variants in the price list"}, ["Anthracite"], 10580, 13320);
  gm("godrej-hikido-topper-track-top-bottom", "Godrej HIKIDO Topper Track (Top & Bottom)", "block", "grey", "kitchen",
    "గోద్రెజ్ HIKIDO Topper Track (Top & Bottom): వార్డ్‌రోబ్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "HIKIDO Topper Track (Top & Bottom) from the Godrej wardrobe fittings range. Available in 1 finish: Aluminium. MRP ₹5,240 – ₹8,290 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Wardrobe fitting", "variants": "2 variants in the price list"}, ["Aluminium"], 5240, 8290);
  gm("godrej-hikido-inset-rollers-dampers", "Godrej HIKIDO Inset Rollers & Dampers", "block", "grey", "kitchen",
    "గోద్రెజ్ HIKIDO Inset Rollers & Dampers: వార్డ్‌రోబ్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "HIKIDO Inset Rollers & Dampers from the Godrej wardrobe fittings range. Available in 1 finish: Aluminium. MRP ₹3,790 – ₹5,060 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Wardrobe fitting", "variants": "2 variants in the price list"}, ["Aluminium"], 3790, 5060);
  gm("godrej-hikido-inset-track-recess", "Godrej HIKIDO Inset Track - Recess", "block", "grey", "kitchen",
    "గోద్రెజ్ HIKIDO Inset Track - Recess: వార్డ్‌రోబ్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "HIKIDO Inset Track - Recess from the Godrej wardrobe fittings range. Available in 1 finish: Aluminium. MRP ₹2,700 – ₹4,220 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Wardrobe fitting", "variants": "2 variants in the price list"}, ["Aluminium"], 2700, 4220);
  gm("godrej-hikido-inset-track-surface-mounted", "Godrej HIKIDO Inset Track - Surface Mounted", "block", "grey", "kitchen",
    "గోద్రెజ్ HIKIDO Inset Track - Surface Mounted: వార్డ్‌రోబ్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "HIKIDO Inset Track - Surface Mounted from the Godrej wardrobe fittings range. Available in 1 finish: Aluminium. MRP ₹3,230 – ₹4,850 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Wardrobe fitting", "variants": "2 variants in the price list"}, ["Aluminium"], 3230, 4850);
  gm("godrej-hikido-cabinet-rollers-dampers", "Godrej HIKIDO Cabinet Rollers & Dampers", "block", "grey", "kitchen",
    "గోద్రెజ్ HIKIDO Cabinet Rollers & Dampers: వార్డ్‌రోబ్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "HIKIDO Cabinet Rollers & Dampers from the Godrej wardrobe fittings range. Available in 1 finish: Aluminium. MRP ₹2,910 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Wardrobe fitting", "variants": "1 variants in the price list"}, ["Aluminium"], 2910, 2910);
  gm("godrej-hikido-cabinet-track", "Godrej HIKIDO Cabinet Track", "block", "grey", "kitchen",
    "గోద్రెజ్ HIKIDO Cabinet Track: వార్డ్‌రోబ్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "HIKIDO Cabinet Track from the Godrej wardrobe fittings range. Available in 1 finish: Aluminium. MRP ₹1,720 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Wardrobe fitting", "variants": "1 variants in the price list"}, ["Aluminium"], 1720, 1720);
  gm("godrej-neulift-bed-arms", "Godrej Neulift Bed Arms", "block", "ink", "kitchen",
    "గోద్రెజ్ Neulift Bed Arms: బెడ్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Neulift Bed Arms from the Godrej bed fittings range. Available in 1 finish: Anthracite. Sizes and options: Neulift Normal Arm - 500 mm; Neulift Regular Bed Arm -1100 mm; Neulift Extended Arm - 1500 mm; Neulift Heavy Duty. MRP ₹1,960 – ₹3,900 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "8 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Bed fitting", "variants": "8 variants in the price list"}, ["Anthracite"], 1960, 3900);
  gm("godrej-neulift-vertical-murphy-bed", "Godrej Neulift Vertical Murphy Bed", "block", "ink", "kitchen",
    "గోద్రెజ్ Neulift Vertical Murphy Bed: బెడ్ ఫిట్టింగ్.",
    "Neulift Vertical Murphy Bed from the Godrej bed fittings range. MRP ₹3,770 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Bed fitting", "variants": "1 variants in the price list"}, [], 3770, 3770);
  gm("godrej-neulift-horizontal-murphy-bed", "Godrej Neulift Horizontal Murphy Bed", "block", "ink", "kitchen",
    "గోద్రెజ్ Neulift Horizontal Murphy Bed: బెడ్ ఫిట్టింగ్.",
    "Neulift Horizontal Murphy Bed from the Godrej bed fittings range. MRP ₹4,190 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Bed fitting", "variants": "1 variants in the price list"}, [], 4190, 4190);
  gm("godrej-neulift-murphy-bed-folding-leg", "Godrej Neulift Murphy Bed Folding Leg", "block", "ink", "kitchen",
    "గోద్రెజ్ Neulift Murphy Bed Folding Leg: బెడ్ ఫిట్టింగ్.",
    "Neulift Murphy Bed Folding Leg from the Godrej bed fittings range. MRP ₹380 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Bed fitting", "variants": "1 variants in the price list"}, [], 380, 380);
  gm("godrej-neulift-flat-bed", "Godrej Neulift Flat Bed", "block", "ink", "kitchen",
    "గోద్రెజ్ Neulift Flat Bed: బెడ్ ఫిట్టింగ్.",
    "Neulift Flat Bed from the Godrej bed fittings range. MRP ₹8,650 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Bed fitting", "variants": "1 variants in the price list"}, [], 8650, 8650);
  gm("godrej-neulift-digital-bed", "Godrej Neulift Digital Bed", "block", "ink", "kitchen",
    "గోద్రెజ్ Neulift Digital Bed: బెడ్ ఫిట్టింగ్.",
    "Neulift Digital Bed from the Godrej bed fittings range. MRP ₹19,980 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Bed fitting", "variants": "1 variants in the price list"}, [], 19980, 19980);
  gm("godrej-neulift-bed-frames", "Godrej Neulift Bed Frames", "block", "ink", "kitchen",
    "గోద్రెజ్ Neulift Bed Frames: బెడ్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Neulift Bed Frames from the Godrej bed fittings range. Available in 1 finish: Anthracite. MRP ₹12,460 – ₹14,090 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Bed fitting", "variants": "2 variants in the price list"}, ["Anthracite"], 12460, 14090);
  gm("godrej-neulift-telescopic-cross-bar", "Godrej Neulift Telescopic Cross Bar", "block", "ink", "kitchen",
    "గోద్రెజ్ Neulift Telescopic Cross Bar: బెడ్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Neulift Telescopic Cross Bar from the Godrej bed fittings range. Available in 1 finish: Anthracite. MRP ₹1,240 – ₹2,020 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Bed fitting", "variants": "2 variants in the price list"}, ["Anthracite"], 1240, 2020);
  gm("godrej-neulift-cross-bar-clamps", "Godrej Neulift Cross Bar Clamps", "block", "ink", "kitchen",
    "గోద్రెజ్ Neulift Cross Bar Clamps: బెడ్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Neulift Cross Bar Clamps from the Godrej bed fittings range. Available in 1 finish: Nickel Plated. MRP ₹280 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Bed fitting", "variants": "1 variants in the price list"}, ["Nickel Plated"], 280, 280);
  gm("godrej-neulift-gas-spring", "Godrej Neulift Gas Spring", "block", "ink", "kitchen",
    "గోద్రెజ్ Neulift Gas Spring: బెడ్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Neulift Gas Spring from the Godrej bed fittings range. Available in 1 finish: Anthracite. Sizes and options: 500N (50 kg); 750N (75 kg); 1000N (100 kg); 1200N (120 kg); 1500N (150 kg); 1750N (175 kg); 2000N (200 kg); 2250N (225 kg); 2500N (250 kg). MRP ₹910 – ₹1,430 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "15 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Bed fitting", "variants": "15 variants in the price list"}, ["Anthracite"], 910, 1430);
  gm("godrej-slip-on-cabinet-hinges-regular", "Godrej Slip On Cabinet Hinges Regular", "block", "grey", "kitchen",
    "గోద్రెజ్ Slip On Cabinet Hinges Regular: ఫర్నిచర్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Slip On Cabinet Hinges Regular from the Godrej furniture fittings range. Available in 1 finish: Nickel Plated. MRP ₹110 – ₹130 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "6 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Furniture fitting", "variants": "6 variants in the price list"}, ["Nickel Plated"], 110, 130);
  gm("godrej-clip-on-cabinet-hinges-regular", "Godrej Clip On Cabinet Hinges Regular", "block", "grey", "kitchen",
    "గోద్రెజ్ Clip On Cabinet Hinges Regular: ఫర్నిచర్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Clip On Cabinet Hinges Regular from the Godrej furniture fittings range. Available in 1 finish: Nickel Plated. MRP ₹140 – ₹150 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Furniture fitting", "variants": "3 variants in the price list"}, ["Nickel Plated"], 140, 150);
  gm("godrej-special-cabinet-hinges-regular-2-hole", "Godrej Special Cabinet Hinges - Regular - 2 Hole", "block", "grey", "kitchen",
    "గోద్రెజ్ Special Cabinet Hinges - Regular - 2 Hole: ఫర్నిచర్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Special Cabinet Hinges - Regular - 2 Hole from the Godrej furniture fittings range. Available in 1 finish: Nickel Plated. MRP ₹355 – ₹650 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Furniture fitting", "variants": "3 variants in the price list"}, ["Nickel Plated"], 355, 650);
  gm("godrej-slip-on-cabinet-hinges-soft-close", "Godrej Slip On Cabinet Hinges Soft Close", "block", "grey", "kitchen",
    "గోద్రెజ్ Slip On Cabinet Hinges Soft Close: ఫర్నిచర్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Slip On Cabinet Hinges Soft Close from the Godrej furniture fittings range. Available in 1 finish: Nickel Plated. MRP ₹225 – ₹235 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "6 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Furniture fitting", "variants": "6 variants in the price list"}, ["Nickel Plated"], 225, 235);
  gm("godrej-clip-on-cabinet-hinges-soft-close", "Godrej Clip On Cabinet Hinges Soft Close", "block", "grey", "kitchen",
    "గోద్రెజ్ Clip On Cabinet Hinges Soft Close: ఫర్నిచర్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Clip On Cabinet Hinges Soft Close from the Godrej furniture fittings range. Available in 1 finish: Nickel Plated. MRP ₹285 – ₹325 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "6 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Furniture fitting", "variants": "6 variants in the price list"}, ["Nickel Plated"], 285, 325);
  gm("godrej-ss-304-clip-on-cabinet-hinges-soft-close-4-hole", "Godrej SS 304 Clip On Cabinet Hinges - Soft Close - 4 Hole", "block", "grey", "kitchen",
    "గోద్రెజ్ SS 304 Clip On Cabinet Hinges - Soft Close - 4 Hole: ఫర్నిచర్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "SS 304 Clip On Cabinet Hinges - Soft Close - 4 Hole from the Godrej furniture fittings range. Available in 1 finish: Nickel Plated. MRP ₹540 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Furniture fitting", "variants": "3 variants in the price list"}, ["Nickel Plated"], 540, 540);
  gm("godrej-3d-cabinet-hinges-soft-close-4-hole", "Godrej 3D Cabinet Hinges - Soft Close - 4 Hole", "block", "grey", "kitchen",
    "గోద్రెజ్ 3D Cabinet Hinges - Soft Close - 4 Hole: ఫర్నిచర్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "3D Cabinet Hinges - Soft Close - 4 Hole from the Godrej furniture fittings range. Available in 1 finish: Nickel Plated. MRP ₹370 – ₹390 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Furniture fitting", "variants": "3 variants in the price list"}, ["Nickel Plated"], 370, 390);
  gm("godrej-special-cabinet-hinges-soft-close", "Godrej Special Cabinet Hinges - Soft Close", "block", "grey", "kitchen",
    "గోద్రెజ్ Special Cabinet Hinges - Soft Close: ఫర్నిచర్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Special Cabinet Hinges - Soft Close from the Godrej furniture fittings range. Available in 1 finish: Nickel Plated. Sizes and options: Hinge 165°; Hinge Zero Protrusion. MRP ₹670 – ₹1,005 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Furniture fitting", "variants": "2 variants in the price list"}, ["Nickel Plated"], 670, 1005);
  gm("godrej-regular-drawer-channels-35-kg", "Godrej Regular Drawer Channels 35 kg", "block", "grey", "kitchen",
    "గోద్రెజ్ Regular Drawer Channels 35 kg: ఫర్నిచర్ ఫిట్టింగ్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Regular Drawer Channels 35 kg from the Godrej furniture fittings range. Available in 2 finishes: Zinc, Black. Sizes and options: 35 kg Drawer Channel - 250 mm; 35 kg Drawer Channel - 300 mm; 35 kg Drawer Channel - 350 mm; 35 kg Drawer Channel - 400 mm; 35 kg Drawer Channel - 450 mm; 35 kg Drawer Channel - 500 mm; 35 kg Drawer Channel - 550 mm; 35 kg Drawer Channel - 600 mm. MRP ₹285 – ₹680 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "16 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Furniture fitting", "variants": "16 variants in the price list"}, ["Zinc", "Black"], 285, 680);
  gm("godrej-regular-drawer-channels-45-kg", "Godrej Regular Drawer Channels 45 kg", "block", "grey", "kitchen",
    "గోద్రెజ్ Regular Drawer Channels 45 kg: ఫర్నిచర్ ఫిట్టింగ్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Regular Drawer Channels 45 kg from the Godrej furniture fittings range. Available in 2 finishes: Zinc, Black. MRP ₹340 – ₹795 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "16 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Furniture fitting", "variants": "16 variants in the price list"}, ["Zinc", "Black"], 340, 795);
  gm("godrej-ss-304-regular-drawer-channel-45-kg-zinc-finish", "Godrej SS 304 Regular Drawer Channel 45 kg Zinc Finish", "block", "grey", "kitchen",
    "గోద్రెజ్ SS 304 Regular Drawer Channel 45 kg Zinc Finish: ఫర్నిచర్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "SS 304 Regular Drawer Channel 45 kg Zinc Finish from the Godrej furniture fittings range. Available in 1 finish: Zinc. MRP ₹2,285 – ₹3,070 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "5 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Furniture fitting", "variants": "5 variants in the price list"}, ["Zinc"], 2285, 3070);
  gm("godrej-soft-close-drawer-channels", "Godrej Soft Close Drawer Channels", "block", "grey", "kitchen",
    "గోద్రెజ్ Soft Close Drawer Channels: ఫర్నిచర్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Soft Close Drawer Channels from the Godrej furniture fittings range. Available in 1 finish: Zinc. Sizes and options: 35 kg Drawer Channel; 35 kg Drawer Channel Soft Close - 500 mm; 35 kg Drawer Channel Soft Close - 550 mm; 35 kg Drawer Channel Soft Close - 600 mm. MRP ₹870 – ₹1,370 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "7 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Furniture fitting", "variants": "7 variants in the price list"}, ["Zinc"], 870, 1370);
  gm("godrej-minifix-connectors", "Godrej MiniFix Connectors", "block", "grey", "kitchen",
    "గోద్రెజ్ MiniFix Connectors: ఫర్నిచర్ ఫిట్టింగ్.",
    "MiniFix Connectors from the Godrej furniture fittings range. Sizes and options: MiniFix Zinc Plated Solid Connector; MiniFix Rotor Connector; MiniFix Eco Connector; MiniFix Cam Housing; MiniFix Wooden Dowel; MiniFix Plastic Dowel; MiniFix Cam Housing 16 mm. MRP ₹243 – ₹1,778 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["9 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Furniture fitting", "variants": "9 variants in the price list"}, [], 243, 1778);
  gm("godrej-minifix-folding-table-bracket", "Godrej MiniFix Folding Table Bracket", "block", "grey", "kitchen",
    "గోద్రెజ్ MiniFix Folding Table Bracket: ఫర్నిచర్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "MiniFix Folding Table Bracket from the Godrej furniture fittings range. Available in 1 finish: Anthracite. Sizes and options: 300 mm; 400 mm; 500 mm; 600 mm. MRP ₹840 – ₹1,740 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup", "wood"], {"type": "Furniture fitting", "variants": "4 variants in the price list"}, ["Anthracite"], 840, 1740);
  gm("godrej-45-mm-frame-aluminium-profile", "Godrej 45 mm Frame Aluminium Profile", "block", "grey", "kitchen",
    "గోద్రెజ్ 45 mm Frame Aluminium Profile: అల్యూమినియం ప్రొఫైల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "45 mm Frame Aluminium Profile from the Godrej aluminium profiles range. Available in 4 finishes: Anodised Silver, Matte Black, Graphite Grey, Rose Gold. MRP ₹1,742 – ₹2,925 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "8 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Aluminium profile", "variants": "8 variants in the price list"}, ["Anodised Silver", "Matte Black", "Graphite Grey", "Rose Gold"], 1742, 2925);
  gm("godrej-glass-shutter-slimline-profile", "Godrej Glass Shutter Slimline Profile", "block", "grey", "kitchen",
    "గోద్రెజ్ Glass Shutter Slimline Profile: అల్యూమినియం ప్రొఫైల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "Glass Shutter Slimline Profile from the Godrej aluminium profiles range. Available in 4 finishes: Anodised Silver, Matte Black, Graphite Grey, Rose Gold. Sizes and options: Slimline; Slimline Aluminium. MRP ₹2,360 – ₹3,725 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "8 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Aluminium profile", "variants": "8 variants in the price list"}, ["Anodised Silver", "Matte Black", "Graphite Grey", "Rose Gold"], 2360, 3725);
  gm("godrej-stick-on-frame-aluminium-profile", "Godrej Stick On Frame Aluminium Profile", "block", "grey", "kitchen",
    "గోద్రెజ్ Stick On Frame Aluminium Profile: అల్యూమినియం ప్రొఫైల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "Stick On Frame Aluminium Profile from the Godrej aluminium profiles range. Available in 4 finishes: Anodised Silver, Matte Black, Graphite Grey, Rose Gold. MRP ₹1,410 – ₹1,630 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Aluminium profile", "variants": "4 variants in the price list"}, ["Anodised Silver", "Matte Black", "Graphite Grey", "Rose Gold"], 1410, 1630);
  gm("godrej-stick-on-g-handle-profile", "Godrej Stick On G Handle Profile", "block", "grey", "kitchen",
    "గోద్రెజ్ Stick On G Handle Profile: అల్యూమినియం ప్రొఫైల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "Stick On G Handle Profile from the Godrej aluminium profiles range. Available in 4 finishes: Anodised Silver, Matte Black, Graphite Grey, Rose Gold. MRP ₹1,865 – ₹2,225 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Aluminium profile", "variants": "4 variants in the price list"}, ["Anodised Silver", "Matte Black", "Graphite Grey", "Rose Gold"], 1865, 2225);
  gm("godrej-j-gola-aluminium-profile", "Godrej J Gola Aluminium Profile", "block", "grey", "kitchen",
    "గోద్రెజ్ J Gola Aluminium Profile: అల్యూమినియం ప్రొఫైల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "J Gola Aluminium Profile from the Godrej aluminium profiles range. Available in 4 finishes: Anodised Silver, Matte Black, Graphite Grey, Rose Gold. Sizes and options: L Connector’ 76 X 76 X 16mm; Gola Aluminium Profiles J Type; Aluminium; Profile End Cap. Accessories: J Gola Aluminium, J Gola Profile End Cap, L Connector’ 76 X 76 X 16mm. MRP ₹1,280 – ₹1,480 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "9 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Aluminium profile", "variants": "9 variants in the price list"}, ["Anodised Silver", "Matte Black", "Graphite Grey", "Rose Gold"], 1280, 1480);
  gm("godrej-edge-aluminium-profile", "Godrej Edge Aluminium Profile", "block", "grey", "kitchen",
    "గోద్రెజ్ Edge Aluminium Profile: అల్యూమినియం ప్రొఫైల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "Edge Aluminium Profile from the Godrej aluminium profiles range. Available in 4 finishes: Anodised Silver, Matte Black, Graphite Grey, Rose Gold. MRP ₹345 – ₹570 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "12 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Aluminium profile", "variants": "12 variants in the price list"}, ["Anodised Silver", "Matte Black", "Graphite Grey", "Rose Gold"], 345, 570);
  gm("godrej-c-gola-aluminium-profile", "Godrej C Gola Aluminium Profile", "block", "grey", "kitchen",
    "గోద్రెజ్ C Gola Aluminium Profile: అల్యూమినియం ప్రొఫైల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "C Gola Aluminium Profile from the Godrej aluminium profiles range. Available in 4 finishes: Anodised Silver, Matte Black, Graphite Grey, Rose Gold. Sizes and options: Gola Aluminium Profiles C Type; s End Cap; Aluminium Profiles Gola Connector. Accessories: Aluminium Profiles Gola Connector, C Gola Aluminium Profiles End Cap. MRP ₹1,610 – ₹1,810 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "9 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Aluminium profile", "variants": "9 variants in the price list"}, ["Anodised Silver", "Matte Black", "Graphite Grey", "Rose Gold"], 1610, 1810);
  gm("godrej-y-gola-handle-profile", "Godrej Y Gola Handle Profile", "block", "grey", "kitchen",
    "గోద్రెజ్ Y Gola Handle Profile: అల్యూమినియం ప్రొఫైల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "Y Gola Handle Profile from the Godrej aluminium profiles range. Available in 4 finishes: Anodised Silver, Matte Black, Graphite Grey, Rose Gold. Sizes and options: Aluminium Profiles Handle Y Top; Aluminium Profiles Handle; Aluminium Profiles Handle Y Bottom. Accessories: Aluminium Profiles Handle. MRP ₹725 – ₹1,245 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "16 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Aluminium profile", "variants": "16 variants in the price list"}, ["Anodised Silver", "Matte Black", "Graphite Grey", "Rose Gold"], 725, 1245);
  gm("godrej-m-gola-handle-profile", "Godrej M Gola Handle Profile", "block", "grey", "kitchen",
    "గోద్రెజ్ M Gola Handle Profile: అల్యూమినియం ప్రొఫైల్, 4 ఫినిష్‌లలో లభిస్తుంది.",
    "M Gola Handle Profile from the Godrej aluminium profiles range. Available in 4 finishes: Anodised Silver, Matte Black, Graphite Grey, Rose Gold. Sizes and options: Aluminium Profiles Handle M Top; Aluminium Profiles Handle; Aluminium Profiles Handle M Bottom. Accessories: Aluminium Profiles Handle. MRP ₹580 – ₹960 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["4 finishes available", "16 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Aluminium profile", "variants": "16 variants in the price list"}, ["Anodised Silver", "Matte Black", "Graphite Grey", "Rose Gold"], 580, 960);
  gm("godrej-skido-wire-baskets", "Godrej SKIDO Wire Baskets", "block", "grey", "kitchen",
    "గోద్రెజ్ SKIDO Wire Baskets: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "SKIDO Wire Baskets from the Godrej kitchen fittings range. Available in 1 finish: Stainless Steel +. MRP ₹2,200 – ₹4,080 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "12 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "12 variants in the price list"}, ["Stainless Steel +"], 2200, 4080);
  gm("godrej-skido-cutlery-wire-organiser", "Godrej SKIDO Cutlery Wire Organiser", "block", "grey", "kitchen",
    "గోద్రెజ్ SKIDO Cutlery Wire Organiser: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "SKIDO Cutlery Wire Organiser from the Godrej kitchen fittings range. Available in 1 finish: Stainless Steel +. MRP ₹680 – ₹2,230 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "3 variants in the price list"}, ["Stainless Steel +"], 680, 2230);
  gm("godrej-skido-cup-saucer-wire-organiser", "Godrej SKIDO Cup & Saucer Wire Organiser", "block", "grey", "kitchen",
    "గోద్రెజ్ SKIDO Cup & Saucer Wire Organiser: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "SKIDO Cup & Saucer Wire Organiser from the Godrej kitchen fittings range. Available in 1 finish: Stainless Steel +. MRP ₹1,740 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "1 variants in the price list"}, ["Stainless Steel +"], 1740, 1740);
  gm("godrej-skido-jars-bottles-wire-organiser", "Godrej SKIDO Jars & Bottles Wire Organiser", "block", "grey", "kitchen",
    "గోద్రెజ్ SKIDO Jars & Bottles Wire Organiser: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "SKIDO Jars & Bottles Wire Organiser from the Godrej kitchen fittings range. Available in 1 finish: Stainless Steel +. MRP ₹760 – ₹960 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "4 variants in the price list"}, ["Stainless Steel +"], 760, 960);
  gm("godrej-skido-thali-wire-organiser", "Godrej SKIDO Thali Wire Organiser", "block", "grey", "kitchen",
    "గోద్రెజ్ SKIDO Thali Wire Organiser: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "SKIDO Thali Wire Organiser from the Godrej kitchen fittings range. Available in 1 finish: Stainless Steel +. MRP ₹2,340 – ₹2,660 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "2 variants in the price list"}, ["Stainless Steel +"], 2340, 2660);
  gm("godrej-skido-wok-kadhai-wire-organiser", "Godrej SKIDO Wok & Kadhai Wire Organiser", "block", "grey", "kitchen",
    "గోద్రెజ్ SKIDO Wok & Kadhai Wire Organiser: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "SKIDO Wok & Kadhai Wire Organiser from the Godrej kitchen fittings range. Available in 1 finish: Stainless Steel +. MRP ₹330 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "1 variants in the price list"}, ["Stainless Steel +"], 330, 330);
  gm("godrej-skido-container-wire-organiser", "Godrej SKIDO Container Wire Organiser", "block", "grey", "kitchen",
    "గోద్రెజ్ SKIDO Container Wire Organiser: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "SKIDO Container Wire Organiser from the Godrej kitchen fittings range. Available in 1 finish: Stainless Steel +. MRP ₹2,000 – ₹2,200 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "4 variants in the price list"}, ["Stainless Steel +"], 2000, 2200);
  gm("godrej-universal-skido-cup-saucer-organiser", "Godrej Universal SKIDO Cup & Saucer Organiser", "block", "grey", "kitchen",
    "గోద్రెజ్ Universal SKIDO Cup & Saucer Organiser: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Universal SKIDO Cup & Saucer Organiser from the Godrej kitchen fittings range. Available in 1 finish: Anthracite. MRP ₹2,450 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "1 variants in the price list"}, ["Anthracite"], 2450, 2450);
  gm("godrej-universal-skido-jars-bottles-organiser", "Godrej Universal SKIDO Jars & Bottles Organiser", "block", "grey", "kitchen",
    "గోద్రెజ్ Universal SKIDO Jars & Bottles Organiser: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Universal SKIDO Jars & Bottles Organiser from the Godrej kitchen fittings range. Available in 1 finish: Anthracite. MRP ₹3,090 – ₹4,140 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "3 variants in the price list"}, ["Anthracite"], 3090, 4140);
  gm("godrej-universal-skido-thali-organiser", "Godrej Universal SKIDO Thali Organiser", "block", "grey", "kitchen",
    "గోద్రెజ్ Universal SKIDO Thali Organiser: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Universal SKIDO Thali Organiser from the Godrej kitchen fittings range. Available in 1 finish: Anthracite. MRP ₹3,080 – ₹3,580 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "2 variants in the price list"}, ["Anthracite"], 3080, 3580);
  gm("godrej-universal-skido-fry-pan-organiser", "Godrej Universal SKIDO Fry Pan Organiser", "block", "grey", "kitchen",
    "గోద్రెజ్ Universal SKIDO Fry Pan Organiser: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Universal SKIDO Fry Pan Organiser from the Godrej kitchen fittings range. Available in 1 finish: Anthracite. MRP ₹1,220 – ₹1,290 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "2 variants in the price list"}, ["Anthracite"], 1220, 1290);
  gm("godrej-universal-skido-wok-kadhai-organiser", "Godrej Universal SKIDO Wok & Kadhai Organiser", "block", "grey", "kitchen",
    "గోద్రెజ్ Universal SKIDO Wok & Kadhai Organiser: కిచెన్ ఫిట్టింగ్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Universal SKIDO Wok & Kadhai Organiser from the Godrej kitchen fittings range. Available in 2 finishes: Anthracite, Matte Grey. Sizes and options: Organiser; SKIDO Wok Organiser. MRP ₹499 – ₹1,610 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "2 variants in the price list"}, ["Anthracite", "Matte Grey"], 499, 1610);
  gm("godrej-universal-skido-container-organiser", "Godrej Universal SKIDO Container Organiser", "block", "grey", "kitchen",
    "గోద్రెజ్ Universal SKIDO Container Organiser: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Universal SKIDO Container Organiser from the Godrej kitchen fittings range. Available in 1 finish: Anthracite. MRP ₹3,460 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "1 variants in the price list"}, ["Anthracite"], 3460, 3460);
  gm("godrej-super-skido-slide-out-pantry", "Godrej Super SKIDO Slide Out Pantry", "block", "grey", "kitchen",
    "గోద్రెజ్ Super SKIDO Slide Out Pantry: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Super SKIDO Slide Out Pantry from the Godrej kitchen fittings range. Available in 1 finish: Anthracite. MRP ₹11,330 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "1 variants in the price list"}, ["Anthracite"], 11330, 11330);
  gm("godrej-super-skido-corner-solution", "Godrej Super SKIDO Corner Solution", "block", "grey", "kitchen",
    "గోద్రెజ్ Super SKIDO Corner Solution: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Super SKIDO Corner Solution from the Godrej kitchen fittings range. Available in 1 finish: Anthracite. MRP ₹6,812 – ₹19,412 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "3 variants in the price list"}, ["Anthracite"], 6812, 19412);
  gm("godrej-super-skido-swing-corner", "Godrej Super SKIDO Swing Corner", "block", "grey", "kitchen",
    "గోద్రెజ్ Super SKIDO Swing Corner: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Super SKIDO Swing Corner from the Godrej kitchen fittings range. Available in 1 finish: Anthracite. MRP ₹32,520 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "1 variants in the price list"}, ["Anthracite"], 32520, 32520);
  gm("godrej-super-skido-undersink-solution", "Godrej Super SKIDO Undersink Solution", "block", "grey", "kitchen",
    "గోద్రెజ్ Super SKIDO Undersink Solution: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Super SKIDO Undersink Solution from the Godrej kitchen fittings range. Available in 1 finish: Anthracite. MRP ₹5,659 – ₹9,535 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "3 variants in the price list"}, ["Anthracite"], 5659, 9535);
  gm("godrej-super-skido-perfect-grain-storage", "Godrej Super SKIDO Perfect Grain Storage", "block", "grey", "kitchen",
    "గోద్రెజ్ Super SKIDO Perfect Grain Storage: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Super SKIDO Perfect Grain Storage from the Godrej kitchen fittings range. Available in 1 finish: Anthracite. MRP ₹8,511 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "1 variants in the price list"}, ["Anthracite"], 8511, 8511);
  gm("godrej-corner-solution-swing-tray", "Godrej Corner Solution - Swing Tray", "block", "grey", "kitchen",
    "గోద్రెజ్ Corner Solution - Swing Tray: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Corner Solution - Swing Tray from the Godrej kitchen fittings range. Available in 1 finish: Chrome. Sizes and options: Swing Tray Left*; Swing Tray Right*. MRP ₹27,367 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "2 variants in the price list"}, ["Chrome"], 27367, 27367);
  gm("godrej-corner-solution-magic-corner", "Godrej Corner Solution - Magic Corner", "block", "grey", "kitchen",
    "గోద్రెజ్ Corner Solution - Magic Corner: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Corner Solution - Magic Corner from the Godrej kitchen fittings range. Available in 1 finish: Chrome. Sizes and options: Magic Corner Left*; Magic Corner Right*. MRP ₹33,012 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "2 variants in the price list"}, ["Chrome"], 33012, 33012);
  gm("godrej-corner-solution-d-tray", "Godrej Corner Solution - D Tray", "block", "grey", "kitchen",
    "గోద్రెజ్ Corner Solution - D Tray: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Corner Solution - D Tray from the Godrej kitchen fittings range. Available in 1 finish: Stainless Steel. MRP ₹4,220 – ₹5,080 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "2 variants in the price list"}, ["Stainless Steel"], 4220, 5080);
  gm("godrej-slim-ergo-drawer-system", "Godrej Slim Ergo Drawer System", "block", "grey", "kitchen",
    "గోద్రెజ్ Slim Ergo Drawer System: కిచెన్ ఫిట్టింగ్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Slim Ergo Drawer System from the Godrej kitchen fittings range. Available in 2 finishes: Anthracite, Black. MRP ₹3,010 – ₹5,170 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "36 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "36 variants in the price list"}, ["Anthracite", "Black"], 3010, 5170);
  gm("godrej-slim-ergo-square-rail", "Godrej Slim Ergo Square Rail", "block", "grey", "kitchen",
    "గోద్రెజ్ Slim Ergo Square Rail: కిచెన్ ఫిట్టింగ్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Slim Ergo Square Rail from the Godrej kitchen fittings range. Available in 2 finishes: Anthracite, Black. MRP ₹385 – ₹540 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "12 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "12 variants in the price list"}, ["Anthracite", "Black"], 385, 540);
  gm("godrej-slim-ergo-front-fascia", "Godrej Slim Ergo Front Fascia", "block", "grey", "kitchen",
    "గోద్రెజ్ Slim Ergo Front Fascia: కిచెన్ ఫిట్టింగ్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Slim Ergo Front Fascia from the Godrej kitchen fittings range. Available in 2 finishes: Anthracite, Black. MRP ₹1,820 – ₹2,690 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "4 variants in the price list"}, ["Anthracite", "Black"], 1820, 2690);
  gm("godrej-slim-ergo-front-fascia-rail", "Godrej Slim Ergo Front Fascia Rail", "block", "grey", "kitchen",
    "గోద్రెజ్ Slim Ergo Front Fascia Rail: కిచెన్ ఫిట్టింగ్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Slim Ergo Front Fascia Rail from the Godrej kitchen fittings range. Available in 2 finishes: Anthracite, Black. MRP ₹1,190 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "2 variants in the price list"}, ["Anthracite", "Black"], 1190, 1190);
  gm("godrej-slim-ergo-front-fascia-clip", "Godrej Slim Ergo Front Fascia Clip", "block", "grey", "kitchen",
    "గోద్రెజ్ Slim Ergo Front Fascia Clip: కిచెన్ ఫిట్టింగ్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Slim Ergo Front Fascia Clip from the Godrej kitchen fittings range. Available in 2 finishes: Anthracite, Black. MRP ₹245 – ₹310 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "12 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "12 variants in the price list"}, ["Anthracite", "Black"], 245, 310);
  gm("godrej-super-slim-ergo-drawer-system", "Godrej Super Slim Ergo Drawer System", "block", "grey", "kitchen",
    "గోద్రెజ్ Super Slim Ergo Drawer System: కిచెన్ ఫిట్టింగ్, 2 ఫినిష్‌లలో లభిస్తుంది.",
    "Super Slim Ergo Drawer System from the Godrej kitchen fittings range. Available in 2 finishes: Anthracite, Black. MRP ₹2,170 – ₹3,720 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["2 finishes available", "42 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "42 variants in the price list"}, ["Anthracite", "Black"], 2170, 3720);
  gm("godrej-pantry-unit", "Godrej Pantry Unit", "block", "grey", "kitchen",
    "గోద్రెజ్ Pantry Unit: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Pantry Unit from the Godrej kitchen fittings range. Available in 1 finish: Anthracite. Sizes and options: 450 mm; 600 mm. MRP ₹32,800 – ₹38,260 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "2 variants in the price list"}, ["Anthracite"], 32800, 38260);
  gm("godrej-bottle-pull-out-system", "Godrej Bottle Pull-out System", "block", "grey", "kitchen",
    "గోద్రెజ్ Bottle Pull-out System: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Bottle Pull-out System from the Godrej kitchen fittings range. Available in 1 finish: Anthracite. MRP ₹4,982 – ₹5,605 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "3 variants in the price list"}, ["Anthracite"], 4982, 5605);
  gm("godrej-lift-up-flap-system", "Godrej Lift Up Flap System", "block", "grey", "kitchen",
    "గోద్రెజ్ Lift Up Flap System: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Lift Up Flap System from the Godrej kitchen fittings range. Available in 1 finish: Anthracite. MRP ₹3,052 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "2 variants in the price list"}, ["Anthracite"], 3052, 3052);
  gm("godrej-lift-up-bi-fold-system", "Godrej Lift Up Bi-Fold System", "block", "grey", "kitchen",
    "గోద్రెజ్ Lift Up Bi-Fold System: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Lift Up Bi-Fold System from the Godrej kitchen fittings range. Available in 1 finish: Anthracite. MRP ₹4,122 – ₹4,197 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "4 variants in the price list"}, ["Anthracite"], 4122, 4197);
  gm("godrej-expandable-wooden-cutlery-organiser", "Godrej Expandable Wooden Cutlery Organiser", "block", "grey", "kitchen",
    "గోద్రెజ్ Expandable Wooden Cutlery Organiser: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Expandable Wooden Cutlery Organiser from the Godrej kitchen fittings range. Available in 1 finish: Dark Walnut. MRP ₹2,536 – ₹4,778 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "3 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "3 variants in the price list"}, ["Dark Walnut"], 2536, 4778);
  gm("godrej-wire-plain-basket-ss", "Godrej Wire Plain Basket SS", "block", "grey", "kitchen",
    "గోద్రెజ్ Wire Plain Basket SS: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Wire Plain Basket SS from the Godrej kitchen fittings range. Available in 1 finish: Stainless Steel. MRP ₹1,300 – ₹4,360 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "72 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "72 variants in the price list"}, ["Stainless Steel"], 1300, 4360);
  gm("godrej-wire-plain-basket-ss-304", "Godrej Wire Plain Basket SS 304", "block", "grey", "kitchen",
    "గోద్రెజ్ Wire Plain Basket SS 304: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Wire Plain Basket SS 304 from the Godrej kitchen fittings range. Available in 1 finish: SS 304. MRP ₹2,730 – ₹4,730 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "12 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "12 variants in the price list"}, ["SS 304"], 2730, 4730);
  gm("godrej-cup-saucer-basket-ss", "Godrej Cup & Saucer Basket SS", "block", "grey", "kitchen",
    "గోద్రెజ్ Cup & Saucer Basket SS: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Cup & Saucer Basket SS from the Godrej kitchen fittings range. Available in 1 finish: Stainless Steel. MRP ₹1,600 – ₹3,720 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "23 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "23 variants in the price list"}, ["Stainless Steel"], 1600, 3720);
  gm("godrej-cup-saucer-basket-ss-304", "Godrej Cup & Saucer Basket SS 304", "block", "grey", "kitchen",
    "గోద్రెజ్ Cup & Saucer Basket SS 304: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Cup & Saucer Basket SS 304 from the Godrej kitchen fittings range. Available in 1 finish: SS 304. MRP ₹3,150 – ₹3,870 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "4 variants in the price list"}, ["SS 304"], 3150, 3870);
  gm("godrej-perforated-cutlery-basket-ss", "Godrej Perforated Cutlery Basket SS", "block", "grey", "kitchen",
    "గోద్రెజ్ Perforated Cutlery Basket SS: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Perforated Cutlery Basket SS from the Godrej kitchen fittings range. Available in 1 finish: Stainless Steel. MRP ₹2,920 – ₹7,940 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "23 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "23 variants in the price list"}, ["Stainless Steel"], 2920, 7940);
  gm("godrej-perforated-cutlery-basket-ss-304", "Godrej Perforated Cutlery Basket SS 304", "block", "grey", "kitchen",
    "గోద్రెజ్ Perforated Cutlery Basket SS 304: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Perforated Cutlery Basket SS 304 from the Godrej kitchen fittings range. Available in 1 finish: SS 304. MRP ₹4,810 – ₹5,770 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "4 variants in the price list"}, ["SS 304"], 4810, 5770);
  gm("godrej-wire-basket-thali-ss", "Godrej Wire Basket - Thali SS", "block", "grey", "kitchen",
    "గోద్రెజ్ Wire Basket - Thali SS: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Wire Basket - Thali SS from the Godrej kitchen fittings range. Available in 1 finish: Stainless Steel. MRP ₹1,770 – ₹4,400 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "46 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "46 variants in the price list"}, ["Stainless Steel"], 1770, 4400);
  gm("godrej-wire-basket-thali-ss-304", "Godrej Wire Basket - Thali SS 304", "block", "grey", "kitchen",
    "గోద్రెజ్ Wire Basket - Thali SS 304: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Wire Basket - Thali SS 304 from the Godrej kitchen fittings range. Available in 1 finish: SS 304. MRP ₹3,070 – ₹4,600 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "8 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "8 variants in the price list"}, ["SS 304"], 3070, 4600);
  gm("godrej-pull-out-ss", "Godrej Pull Out SS", "block", "grey", "kitchen",
    "గోద్రెజ్ Pull Out SS: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Pull Out SS from the Godrej kitchen fittings range. Available in 1 finish: Stainless Steel. Sizes and options: Two Shelf Pull Out; Three Shelf Pull Out. MRP ₹3,400 – ₹5,630 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "8 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "8 variants in the price list"}, ["Stainless Steel"], 3400, 5630);
  gm("godrej-pull-out-ss-304", "Godrej Pull Out SS 304", "block", "grey", "kitchen",
    "గోద్రెజ్ Pull Out SS 304: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Pull Out SS 304 from the Godrej kitchen fittings range. Available in 1 finish: SS 304. Sizes and options: Two Shelf Pull Out; Three Shelf Pull Out. MRP ₹4,590 – ₹6,780 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "4 variants in the price list"}, ["SS 304"], 4590, 6780);
  gm("godrej-grain-trolley-ss", "Godrej Grain Trolley SS", "block", "grey", "kitchen",
    "గోద్రెజ్ Grain Trolley SS: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Grain Trolley SS from the Godrej kitchen fittings range. Available in 1 finish: Stainless Steel. MRP ₹4,840 – ₹6,420 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "4 variants in the price list"}, ["Stainless Steel"], 4840, 6420);
  gm("godrej-grain-trolley-ss-304", "Godrej Grain Trolley SS 304", "block", "grey", "kitchen",
    "గోద్రెజ్ Grain Trolley SS 304: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Grain Trolley SS 304 from the Godrej kitchen fittings range. Available in 1 finish: SS 304. MRP ₹8,190 – ₹9,350 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "4 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "4 variants in the price list"}, ["SS 304"], 8190, 9350);
  gm("godrej-movino-undermount-drawer-channel", "Godrej Movino Undermount Drawer Channel", "block", "grey", "kitchen",
    "గోద్రెజ్ Movino Undermount Drawer Channel: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Movino Undermount Drawer Channel from the Godrej kitchen fittings range. Available in 1 finish: Zinc. Sizes and options: Undermount Channel; Undermount. MRP ₹1,420 – ₹2,010 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "11 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "11 variants in the price list"}, ["Zinc"], 1420, 2010);
  gm("godrej-regular-gas-spring", "Godrej Regular Gas Spring", "block", "grey", "kitchen",
    "గోద్రెజ్ Regular Gas Spring: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Regular Gas Spring from the Godrej kitchen fittings range. Available in 1 finish: Mild Steel. Sizes and options: Gas Spring Regular 60 N (6 kg); Gas Spring Regular 80 N (8 kg); Gas Spring Regular 100 N (10 Kg); Gas Spring Regular 120 N (12 kg); Gas Spring Regular 150 N (15 kg); Gas Spring Regular 200 N (20 kg); Gas Spring Regular 250 N (25 kg). MRP ₹415 – ₹530 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "7 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "7 variants in the price list"}, ["Mild Steel"], 415, 530);
  gm("godrej-cylinder-trolley", "Godrej Cylinder Trolley", "block", "grey", "kitchen",
    "గోద్రెజ్ Cylinder Trolley: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Cylinder Trolley from the Godrej kitchen fittings range. Available in 1 finish: Stainless Steel. MRP ₹2,080 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "1 variants in the price list"}, ["Stainless Steel"], 2080, 2080);
  gm("godrej-glass-plate-tray", "Godrej Glass Plate Tray", "block", "grey", "kitchen",
    "గోద్రెజ్ Glass Plate Tray: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Glass Plate Tray from the Godrej kitchen fittings range. Available in 1 finish: Glass. Sizes and options: Plate Tray 535 mm; Plate Tray 610 mm. MRP ₹6,460 – ₹7,070 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "2 variants in the price list"}, ["Glass"], 6460, 7070);
  gm("godrej-skid-free-mat", "Godrej Skid Free Mat", "block", "grey", "kitchen",
    "గోద్రెజ్ Skid Free Mat: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Skid Free Mat from the Godrej kitchen fittings range. Available in 1 finish: Grey. MRP ₹1,930 – ₹2,220 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "2 variants in the price list"}, ["Grey"], 1930, 2220);
  gm("godrej-waste-bin-14-l", "Godrej Waste Bin 14 L", "block", "grey", "kitchen",
    "గోద్రెజ్ Waste Bin 14 L: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Waste Bin 14 L from the Godrej kitchen fittings range. Available in 1 finish: Black Stainless Steel. MRP ₹3,400 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "1 variants in the price list"}, ["Black Stainless Steel"], 3400, 3400);
  gm("godrej-waste-bin-holder-shutter", "Godrej Waste Bin Holder & Shutter", "block", "grey", "kitchen",
    "గోద్రెజ్ Waste Bin Holder & Shutter: కిచెన్ ఫిట్టింగ్, 1 ఫినిష్‌లలో లభిస్తుంది.",
    "Waste Bin Holder & Shutter from the Godrej kitchen fittings range. Available in 1 finish: Stainless Steel. Sizes and options: Holder; Shutter. MRP ₹1,410 – ₹2,230 including taxes, as per the Godrej price list effective 1 July 2026. Price is negotiable with us, the distributor.",
    ["1 finish available", "2 variants in the price list", "Genuine Godrej product, sold by the authorised distributor"], ["cup"], {"type": "Kitchen fitting", "variants": "2 variants in the price list"}, ["Stainless Steel"], 1410, 2230);

  /* ---------- "which cement for which job" (used on the home page) ---------- */
  var GUIDE = [
    { en: 'Slabs, beams and columns', te: 'స్లాబ్, బీమ్, కాలమ్', pick: 'OPC 53 or a strong PPC', ids: ['ultratech-opc-53', 'kcp-opc-53', 'ramco-supercrete'] },
    { en: 'House building and plastering', te: 'ఇంటి నిర్మాణం, ప్లాస్టరింగ్', pick: 'PPC', ids: ['ultratech-ppc', 'kcp-shreshtaa', 'nagarjuna-ppc'] },
    { en: 'Terrace and damp walls', te: 'టెర్రస్, తేమ గోడలు', pick: 'Water-repellent cement, then a roof coating', ids: ['ultratech-weather-plus', 'ambuja-kawach', 'ultratech-hiflex'] },
    { en: 'Near the coast or salty water', te: 'తీర ప్రాంతం, ఉప్పునీరు', pick: 'Slag or sulphate-resisting cement', ids: ['nagarjuna-steelkrete', 'ramco-samudra', 'ultratech-psc'] },
    { en: 'Blocks, pavers and precast', te: 'బ్లాక్స్, పేవర్స్, ప్రీకాస్ట్', pick: 'Fast-hardening cement', ids: ['ramco-super-fast', 'kcp-rhpc'] },
    { en: 'Smooth walls before paint', te: 'పెయింట్ ముందు నునుపైన గోడలు', pick: 'White-cement putty', ids: ['birlawhite-wallcare-putty', 'birlawhite-wallseal'] }
  ];

  /* products with a pack photo in assets/img/products/<id>.png */
  var PHOTOS = ['ambuja-buildcem','ambuja-cement','ambuja-compocem','ambuja-cool-walls','ambuja-kawach','ambuja-plus','ambuja-powercem','ambuja-purasand','ambuja-railcem','astral-bondtite-cyano','astral-bondtite-epoxy','astral-bondtite-pva','astral-fast-and-clear','astral-resibond-neutral','bharathi-opc-43','bharathi-opc-53','bharathi-ppc','bharathi-ultra-fast','birlawhite-ever-white','birlawhite-excel','birlawhite-level-plast','birlawhite-textura-roller','birlawhite-textura-trowel','birlawhite-wallcare-putty','birlawhite-wallcare-scented','birlawhite-wallseal','birlawhite-white-cement','chettinad-classic-slag','chettinad-composite','chettinad-hbc','chettinad-maxcrete','chettinad-opc-43','chettinad-opc-53','chettinad-super-grade','dalmia-cement','dalmia-dsp','dalmia-infra-pro','fevicol-ezeespray','fevicol-heatx','fevicol-hiper','fevicol-hiper-star','fevicol-marine','fevicol-mr','fevicol-plastilok','fevicol-probond','fevicol-probond-edgelok','fevicol-relam','fevicol-sh','fevicol-speedx','fevicol-sr-998','fosroc-brushbond','fosroc-conplast-wl','fosroc-nitobond-sbr','fosroc-nitoproof-100','fosroc-nitoproof-600pf','fosroc-nitoseal-pu','godrej-10-lever-push-button-lock','godrej-3d-cabinet-hinges-soft-close-4-hole','godrej-4-lever-hookbolt','godrej-4-lever-narrow-stile-mortise-lock','godrej-45-mm-frame-aluminium-profile','godrej-6-lever-mortise-2-way-deadlock','godrej-6-lever-universal-drawer-lock','godrej-7-lever-mortise-2-way-deadlock','godrej-7-lever-night-latch','godrej-7-lever-super-night-latch','godrej-ace-pro-ss-304-padlock','godrej-advantis-cabinet-lock','godrej-advantis-gsl-d1','godrej-advantis-gsl-d1r','godrej-advantis-iot9','godrej-advantis-remote-accessory','godrej-advantis-revolution','godrej-advantis-rimtronic','godrej-advantis-rimtronic-pcb-accessory','godrej-advantis-rimtronic-rf','godrej-advantis-rimtronic-verti','godrej-advantis-video-door-phone-module','godrej-aldrop','godrej-aldrop-brass','godrej-almirah-lock','godrej-alpine-rose-handle','godrej-anoushka-pull-handle','godrej-astron-digital-cabinet-lock','godrej-aura-240-mm-euro-mortise-combipack','godrej-bel-plate-handle','godrej-bel-rose-handle','godrej-bm-01-mortise-handle-set','godrej-bm-02-mortise-handle-set','godrej-bm-09-mortise-handle-set','godrej-bm-10-mortise-handle-set','godrej-bottle-pull-out-system','godrej-c-gola-aluminium-profile','godrej-calla-rose-handle','godrej-cam-lock','godrej-cameo-plate-handle','godrej-cameo-rose-handle','godrej-centaur-exs','godrej-centaur-ultra-xl','godrej-centaur-ultra-xl-double-door','godrej-cerus-universal-door-closer','godrej-chris-rose-handle','godrej-classic-cylindrical-locks-keyed-entrance','godrej-classic-cylindrical-locks-keyless-bathroom','godrej-clip-on-cabinet-hinges-regular','godrej-clip-on-cabinet-hinges-soft-close','godrej-concealed-door-closer-85-kg','godrej-corner-solution-d-tray','godrej-corner-solution-magic-corner','godrej-corner-solution-swing-tray','godrej-cup-saucer-basket-ss','godrej-cup-saucer-basket-ss-304','godrej-curvo-duo-ss-304-furniture-lock','godrej-cylinder-trolley','godrej-d-cor-6-lever-mortise-lock-combipack','godrej-deadbolt-compact','godrej-door-stopper','godrej-duralock-ultra-xl-padlock','godrej-ecstacy-rose-handle','godrej-edge-aluminium-profile','godrej-elc-01-6-lever-mortise-lock-combipack','godrej-elc-02-6-lever-mortise-lock-combipack','godrej-elc-03-6-lever-mortise-lock-combipack','godrej-elc-04-6-lever-mortise-lock-combipack','godrej-elc-05-6-lever-mortise-lock-combipack','godrej-elc-06-6-lever-mortise-lock-combipack','godrej-elc-07-6-lever-mortise-lock-combipack','godrej-elc-09-6-lever-mortise-lock-combipack','godrej-elc-10-6-lever-mortise-lock-combipack','godrej-elc-19-6-lever-mortise-lock-combipack','godrej-em-01-essential-mortise-handle-set','godrej-em-02-essential-mortise-handle-set','godrej-em-03-essential-mortise-handle-set','godrej-em-04-essential-mortise-handle-set','godrej-em-05-essential-mortise-handle-set','godrej-europrofile-mortise-lock-bodies','godrej-europrofile-pin-cylinder-100-mm','godrej-europrofile-pin-cylinder-40-mm','godrej-europrofile-pin-cylinder-60-mm','godrej-europrofile-pin-cylinder-70-mm','godrej-europrofile-pin-cylinder-80-mm','godrej-europrofile-pin-cylinder-90-mm','godrej-evolve-rose-handle','godrej-expandable-wooden-cutlery-organiser','godrej-freedom-padlock','godrej-glass-plate-tray','godrej-glass-shutter-slimline-profile','godrej-gloria-6-lever-mortise-lock-combipack','godrej-gloria-mortise-handle-set','godrej-gloria-mortise-handle-set-with-victor-cylinder','godrej-gloria-rose-handle','godrej-grain-trolley-ss','godrej-grain-trolley-ss-304','godrej-hdh-01-rose-handle','godrej-hdh-02-rose-handle','godrej-hdh-03-rose-handle','godrej-hdh-04-rose-handle','godrej-hdh-05-rose-handle','godrej-hdh-06-rose-handle','godrej-hdh-07-rose-handle','godrej-hdh-08-rose-handle','godrej-hdh-09-rose-handle','godrej-hdh-10-rose-handle','godrej-hdh-11-rose-handle','godrej-hdh-12-rose-handle','godrej-hdh-13-rose-handle','godrej-hdh-14-rose-handle','godrej-hdh-15-rose-handle','godrej-hdh-16-rose-handle','godrej-hdh-17-rose-handle','godrej-hdh-18-rose-handle','godrej-hdh-19-rose-handle','godrej-hdh-20-rose-handle','godrej-hdh-21-rose-handle','godrej-hdh-22-rose-handle','godrej-hdh-23-rose-handle','godrej-hercules-door-closer','godrej-herculoc-plus-3ks-padlock','godrej-hikido-cabinet-rollers-dampers','godrej-hikido-cabinet-track','godrej-hikido-inline','godrej-hikido-inset-rollers-dampers','godrej-hikido-inset-track-recess','godrej-hikido-inset-track-surface-mounted','godrej-hikido-topper-rollers-dampers','godrej-hikido-topper-track-top-bottom','godrej-incrust-plain-joint-hinges','godrej-inner-aldrop','godrej-j-gola-aluminium-profile','godrej-kaditala-6-lever-lock','godrej-kalasam-plate-handle','godrej-kalasam-rose-handle','godrej-khatakhat-lock-ultra-xl','godrej-lever-mortise-baby-latch','godrej-lift-up-bi-fold-system','godrej-lift-up-flap-system','godrej-m-gola-handle-profile','godrej-marin-pull-handle','godrej-minifix-connectors','godrej-minifix-folding-table-bracket','godrej-mor-plate-handle','godrej-mor-rose-handle','godrej-movino-undermount-drawer-channel','godrej-mylock-candy-luggage-lock','godrej-navtal-padlock','godrej-navtal-ultra-xl-padlock','godrej-neh-06-mortise-handle-set','godrej-neh-06-rose-handle','godrej-neh-07-mortise-handle-set','godrej-neh-07-rose-handle','godrej-neh-15-low-height-design','godrej-neh-15-rose-handle','godrej-neh-16-mortise-handle-set','godrej-neh-16-rose-handle','godrej-neh-17-mortise-handle-set','godrej-neh-17-rose-handle','godrej-neh-19-mortise-handle-set','godrej-neh-19-rose-handle','godrej-neh-20-mortise-handle-set','godrej-neh-20-rose-handle','godrej-neh-21-mortise-handle-set','godrej-neh-21-rose-handle','godrej-neh-22-mortise-handle-set','godrej-neh-22-rose-handle','godrej-neh-23-mortise-handle-set','godrej-neh-24-mortise-handle-set','godrej-neo-advantage','godrej-neo-connect','godrej-neo-prime','godrej-neo-pro-view','godrej-neulift-bed-arms','godrej-neulift-bed-frames','godrej-neulift-cross-bar-clamps','godrej-neulift-digital-bed','godrej-neulift-flat-bed','godrej-neulift-gas-spring','godrej-neulift-horizontal-murphy-bed','godrej-neulift-murphy-bed-folding-leg','godrej-neulift-telescopic-cross-bar','godrej-neulift-vertical-murphy-bed','godrej-no-1-solid-brass-padlock','godrej-nuvo-pin-cylinder-furniture-lock','godrej-orso-rose-handle','godrej-pantry-unit','godrej-pentabolt-aries-3ks','godrej-pentabolt-exs','godrej-perforated-cutlery-basket-ss','godrej-perforated-cutlery-basket-ss-304','godrej-pin-cylinder-premium-night-latch','godrej-pin-cylinder-rim-lock','godrej-premium-cylindrical-locks-keyed-entrance','godrej-premium-cylindrical-locks-keyless-bathroom','godrej-pull-out-ss','godrej-pull-out-ss-304','godrej-regular-drawer-channels-35-kg','godrej-regular-drawer-channels-45-kg','godrej-regular-gas-spring','godrej-remo-rose-handle','godrej-rim-deadbolt-reversible','godrej-rim-deadbolt-ultra-xl','godrej-rion-digital-cabinet-lock','godrej-round-padlock','godrej-scorpio-ultra-padlock','godrej-sec-01-240-mm-euro-mortise-combipack','godrej-sec-02-240-mm-euro-mortise-combipack','godrej-sec-03-240-mm-euro-mortise-combipack','godrej-seh-03-plate-handle','godrej-sherlock-solid-brass-padlock','godrej-shutter-locks-ultra','godrej-skid-free-mat','godrej-skido-container-wire-organiser','godrej-skido-cup-saucer-wire-organiser','godrej-skido-cutlery-wire-organiser','godrej-skido-jars-bottles-wire-organiser','godrej-skido-thali-wire-organiser','godrej-skido-wire-baskets','godrej-skido-wok-kadhai-wire-organiser','godrej-slim-ergo-drawer-system','godrej-slim-ergo-front-fascia','godrej-slim-ergo-front-fascia-clip','godrej-slim-ergo-front-fascia-rail','godrej-slim-ergo-square-rail','godrej-slip-on-cabinet-hinges-regular','godrej-slip-on-cabinet-hinges-soft-close','godrej-smooth-rose-handle','godrej-soft-close-drawer-channels','godrej-special-cabinet-hinges-regular-2-hole','godrej-special-cabinet-hinges-soft-close','godrej-square-padlock','godrej-ss-304-clip-on-cabinet-hinges-soft-close-4-hole','godrej-ss-304-plain-joint-hinges','godrej-ss-304-regular-drawer-channel-45-kg-zinc-finish','godrej-ss-ball-bearing-hinges','godrej-ss-cut-hinges','godrej-ss-d-type-tube-lever-combi-set','godrej-ss-plain-joint-hinges','godrej-stella-6-lever-mortise-lock-combipack','godrej-stick-on-frame-aluminium-profile','godrej-stick-on-g-handle-profile','godrej-super-skido-corner-solution','godrej-super-skido-perfect-grain-storage','godrej-super-skido-slide-out-pantry','godrej-super-skido-swing-corner','godrej-super-skido-undersink-solution','godrej-super-slim-ergo-drawer-system','godrej-supernova-ultra-wardrobe-lock','godrej-tibo-pull-handle','godrej-tower-bolt-designer','godrej-tower-bolt-regular','godrej-tribolt-compact','godrej-tribolt-ultra','godrej-tribolt-ultra-xl','godrej-trishaft-ultra','godrej-twinbolt-compact','godrej-twinbolt-ultra-xl','godrej-twist-rose-handle','godrej-udaan-plate-handle','godrej-udaan-rose-handle','godrej-ugo-plate-handle','godrej-ugo-rose-handle','godrej-ultra-retrofit-adaptor','godrej-ulturo-ultra-xl-euro-cylinder-60-mm','godrej-ulturo-ultra-xl-euro-cylinder-70-mm','godrej-ulturo-ultra-xl-euro-cylinder-80-mm','godrej-universal-skido-container-organiser','godrej-universal-skido-cup-saucer-organiser','godrej-universal-skido-fry-pan-organiser','godrej-universal-skido-jars-bottles-organiser','godrej-universal-skido-thali-organiser','godrej-universal-skido-wok-kadhai-organiser','godrej-venus-6-lever-mortise-lock-combipack','godrej-vertibolt-ultra','godrej-vertibolt-ultra-xl','godrej-wafer-tumbler-multipurpose-lock','godrej-wardrobe-lock-for-sliding-door','godrej-waste-bin-14-l','godrej-waste-bin-holder-shutter','godrej-wire-basket-thali-ss','godrej-wire-basket-thali-ss-304','godrej-wire-plain-basket-ss','godrej-wire-plain-basket-ss-304','godrej-y-gola-handle-profile','hardworker-anchoring-grout','hardworker-block-fix','hardworker-bonding-epoxy','hardworker-bonding-sbr','hardworker-eco-plaster','hardworker-floor-screed','hardworker-integral-waterproofing','hardworker-micro-concrete','hardworker-tile-fix','hardworker-tile-fix-epoxy','hardworker-tile-fix-slurry','hardworker-tile-grout','hardworker-tile-grout-epoxy','hardworker-wall-putty','hardworker-waterproofing-coat','indiacements-coromandel-king','indiacements-sankar','kcp-opc-43','kcp-opc-53','kcp-opc-53s','kcp-rhpc','kcp-shreshtaa','kcp-super-shreshtaa','maha-concrete-special','maha-hd-ppc','maha-psc','maha-solid-hd','nagarjuna-irs-53s','nagarjuna-opc-43','nagarjuna-opc-53','nagarjuna-ppc','nagarjuna-visistha','penna-concrete-guard','penna-power-ppc','penna-premium-43','penna-premium-53','penna-suraksha-psc','ramco-infra-opc-43','ramco-infra-opc-53','ramco-infra-super-opc-53','ramco-karthic-super-plus','ramco-opc-43','ramco-opc-53','ramco-samudra','ramco-super-coast','ramco-super-fast','ramco-super-steel','ramco-supercrete','ramco-superfine-efc','ramco-supergrade','sagar-opc-53','sagar-ppc','shree-jungrodhak','shree-magna','shree-powermax','shree-rockstrong','shree-roofon','ultratech-bath-kit','ultratech-bath-membrane','ultratech-bitupro','ultratech-crack-filler','ultratech-epoxy-grout','ultratech-flex','ultratech-hiflex','ultratech-membranes','ultratech-opc-43','ultratech-opc-53','ultratech-ppc','ultratech-psc','ultratech-readiplast-pro','ultratech-sbr','ultratech-tilefixo','ultratech-top-shield','ultratech-top-shield-ezy','ultratech-weather-plus','ultratech-wp200'];

  /* ---------- shop details and page text (editable in /admin when Supabase is set up) ---------- */
  var SETTINGS = {
    phones: [
      { num: '918179951999', show: '81799 51999', name: 'Perumalla Ramu' },
      { num: '919394234081', show: '93942 34081', name: '' }
    ],
    whatsapp: '918179951999',
    address: '18-10-3, Simhadri Appanna Temple Street,\nOld VRL Transport Premises,\nGunupudi, Bhimavaram 534201',
    hours: '7:30 AM – 7:30 PM',
    heroTitleEn: '', heroTitleTe: '', heroLeadEn: '', heroLeadTe: '',
    about: { titleEn: '', titleTe: '', introEn: '', introTe: '' }
  };
  var ABOUT = [];

  window.CATALOG = { SETTINGS: SETTINGS, ABOUT: ABOUT, PHOTOS: PHOTOS, TINT: TINT, APPS: APPS, SPEC_LABELS: SPEC_LABELS, CATEGORIES: CATEGORIES, BRANDS: BRANDS, PRODUCTS: PRODUCTS, GUIDE: GUIDE };
})();
