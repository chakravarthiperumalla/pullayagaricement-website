/*
 * Product catalog for Pullayya Gari Cement Kottu (static data, no server).
 *
 * How to edit:
 *  - Add a brand to BRANDS, then add its products with p(...) at the bottom.
 *  - p(id, brandId, categoryId, name, shape, tint, teLine, description, features[], applications[], specs{})
 *  - `applications` use the keys in APPS (English + Telugu live there once, reused everywhere).
 *  - Later, this file can be replaced by a fetch() from an API with the same shape.
 *
 * Product facts were summarised from each manufacturer's own website (see `site` on every brand).
 * Cement has no prices on purpose: rates change daily, customers ask on WhatsApp.
 * Godrej models carry the MRP range from the Godrej price list (w.e.f. 1 July 2026); the shop negotiates below MRP.
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
    { id: 'hardware', shape: 'padlock', tint: 'ink', en: 'Locks & hardware', te: 'లాక్స్ & హార్డ్‌వేర్',
      introEn: 'Godrej padlocks, door and digital locks, handles, door fittings, and wardrobe, bed and kitchen fittings, with MRP ranges and every finish.',
      introTe: 'ఇళ్లు, షాపులు, గోడౌన్ల కోసం తాళాలు, డోర్ లాక్స్, డిజిటల్ లాక్స్, హ్యాండిల్స్.' },
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
  function gm(id, name, shape, tint, te, desc, feats, apps, specs, finishes, min, max) {
    p(id, 'godrej', 'hardware', name, shape, tint, te, desc, feats, apps, specs);
    var x = PRODUCTS[PRODUCTS.length - 1]; x.finishes = finishes; x.mrp = [min, max];
  }

  /* ===== Godrej: one model per family, from the Godrej price list (w.e.f. 1 July 2026) ===== */
  gm("godrej-advantis-iot9", "Godrej Advantis IoT9 Digital Lock", "mortise", "ink",
    "అడ్వాంటిస్ IoT9: వైఫై, యాప్‌తో పనిచేసే స్మార్ట్ డిజిటల్ మోర్టైజ్ లాక్.",
    "Connected digital door lock for main doors. Opens by fingerprint, PIN, RFID card, mechanical key and the mobile app, and is made in India. The top Godrej digital lock in this price list. Available in 7 finishes: Titanium Grey, Gunmetal Black, Roman Silver, Vegas Gold, Rose Gold, Oak Wood, Walnut.",
    ["Wi-Fi and app control", "Fingerprint, PIN, card and key", "Seven designer finishes"], ["smart", "door"], {"type": "Digital mortise lock", "variants": "7 variants in the price list"}, ["Titanium Grey", "Gunmetal Black", "Roman Silver", "Vegas Gold", "Rose Gold", "Oak Wood", "Walnut"], 69999, 70999);
  gm("godrej-neo-connect", "Godrej Neo Series Digital Locks", "mortise", "ink",
    "నియో సిరీస్: కనెక్ట్, ప్రైమ్, ప్రో-వ్యూ, అడ్వాంటేజ్ డిజిటల్ లాక్స్.",
    "Everyday digital door locks: Neo Connect, Neo Prime, Neo Pro-View (with a camera view) and Neo Advantage. Keyless entry by fingerprint, PIN or card, with a key for back-up. Available in 3 finishes: Black, Rose Gold, Titanium Grey.",
    ["Four models in one series", "Keyless entry with key back-up", "Pro-View has a camera view"], ["smart", "door"], {"type": "Digital lock", "variants": "6 variants in the price list"}, ["Black", "Rose Gold", "Titanium Grey"], 10999, 29999);
  gm("godrej-advantis-rimtronic", "Godrej Advantis Rimtronic Digital Rim Lock", "mortise", "ink",
    "అడ్వాంటిస్ రిమ్‌ట్రానిక్: పాత తలుపుకే పెట్టుకునే డిజిటల్ రిమ్ లాక్.",
    "Digital rim lock that fits on the inside face of the door, so existing doors can go digital without cutting a mortise. Available as Rimtronic, Rimtronic RF and Rimtronic Verti. Available in 1 finish: Black.",
    ["Fits existing doors", "Three variants", "For 40-50 mm doors"], ["smart", "door"], {"type": "Digital rim lock", "variants": "3 variants in the price list"}, ["Black"], 17440, 34350);
  gm("godrej-neh-21", "Godrej NEH 21 Mortise Handle Set", "mortise", "kraft",
    "NEH 21: మెయిన్ డోర్‌కు మోర్టైజ్ హ్యాండిల్ సెట్, 4 ఫినిష్‌లు.",
    "Popular mortise door handle set with a matching lock body and cylinder. Comes as 240 mm and 200 mm sets, with one or two cylinders and as a combipack. Available in 4 finishes: Satin Steel, Antique Brass, Matte Black Rose, Black Antique Copper.",
    ["Handle, lock body and cylinder", "Several sizes and cylinder options", "Four finishes"], ["door", "indoor"], {"type": "Mortise handle set", "variants": "28 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black Rose", "Black Antique Copper"], 2260, 4150);
  gm("godrej-gloria", "Godrej Gloria Mortise Handle Set", "mortise", "grey",
    "గ్లోరియా: ప్రీమియం మోర్టైజ్ హ్యాండిల్ సెట్, 5 ఫినిష్‌లు.",
    "Premium mortise handle set in five finishes, also sold with the Victor cylinder for extra key security. Available in 5 finishes: Satin Steel, Antique Brass, Matte Black Rose, Black Antique Copper, Matte Black Nickel.",
    ["Premium design", "Option with Victor cylinder", "Five finishes"], ["door", "indoor"], {"type": "Mortise handle set", "variants": "33 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black Rose", "Black Antique Copper", "Matte Black Nickel"], 2620, 5620);
  gm("godrej-essential-mortise", "Godrej Essential Mortise (EM 01 to EM 05)", "mortise", "grey",
    "ఎసెన్షియల్ మోర్టైజ్ EM 01-05: తక్కువ ధరలో మోర్టైజ్ సెట్లు.",
    "Five value mortise handle designs, EM 01 to EM 05, each with the lock body and cylinder. A good choice for room doors and rental homes. Available in 3 finishes: Satin Steel, Antique Brass, Matte Black.",
    ["Five designs", "Value range", "Three finishes"], ["indoor", "door"], {"type": "Mortise handle set", "variants": "102 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black"], 1390, 2730);
  gm("godrej-6-lever-mortise", "Godrej 6 Lever Mortise Lock Combipack (ELC)", "mortise", "kraft",
    "6 లివర్ మోర్టైజ్ లాక్ కాంబిప్యాక్ (ELC సిరీస్).",
    "Lever mortise lock sold as a combipack with handles. ELC 01, 02, 09, 10 and 19 designs, plus Stella and Gloria handle options. Available in 6 finishes: Satin Steel, Antique Brass, Rose Gold, Matte Black, Matte Black Nickel, Matte Black Rose.",
    ["Six-lever security", "Lock and handles in one pack", "Several designs"], ["door", "indoor"], {"type": "Lever mortise lock", "variants": "23 variants in the price list"}, ["Satin Steel", "Antique Brass", "Rose Gold", "Matte Black", "Matte Black Nickel", "Matte Black Rose"], 2080, 2590);
  gm("godrej-ulturo-cylinder", "Godrej Ulturo Ultra XL+ Euro Cylinder", "mortise", "grey",
    "అల్టురో అల్ట్రా XL+: డూప్లికేట్ చేయలేని కీతో యూరో సిలిండర్.",
    "High-security euro-profile cylinder for mortise locks, with the Ultra XL+ key. Sold in 60, 70 and 80 mm lengths, with one cylinder and knob (1CK) or two cylinders (2C). Available in 4 finishes: Satin Steel, Antique Brass, Matte Black, Matte Black Nickel.",
    ["Ultra XL+ key security", "60, 70 and 80 mm", "Four finishes"], ["door"], {"type": "Euro cylinder", "variants": "24 variants in the price list"}, ["Satin Steel", "Antique Brass", "Matte Black", "Matte Black Nickel"], 1650, 2050);
  gm("godrej-centaur-rim-lock", "Godrej Centaur Ultra XL+ Rim Lock", "mortise", "slate",
    "సెంటార్ అల్ట్రా XL+: మెయిన్ డోర్‌కు రిమ్ లాక్.",
    "Rim lock for main doors with the Ultra XL+ key mechanism. Latchbolt and deadbolt versions, with one or two cylinders, and a double-door model. Available in 3 finishes: Satin Nickel, Antique Brass, Antique Copper.",
    ["Latchbolt and deadbolt versions", "Double-door model", "Ultra XL+ key"], ["door"], {"type": "Rim lock", "variants": "13 variants in the price list"}, ["Satin Nickel", "Antique Brass", "Antique Copper"], 5820, 6650);
  gm("godrej-tribolt-ultra-xl", "Godrej Tribolt Ultra XL+ Rim Lock", "mortise", "slate",
    "ట్రైబోల్ట్ అల్ట్రా XL+: మూడు బోల్ట్‌ల బలమైన రిమ్ లాక్.",
    "Rim lock that throws three bolts for extra strength on the main door, with the Ultra XL+ key. Available in 4 finishes: Satin Nickel, Antique Brass, Matte Black Nickel, Rose Gold.",
    ["Three bolts", "Ultra XL+ key", "Four finishes"], ["door"], {"type": "Rim lock", "variants": "18 variants in the price list"}, ["Satin Nickel", "Antique Brass", "Matte Black Nickel", "Rose Gold"], 4310, 7140);
  gm("godrej-pentabolt-aries", "Godrej Pentabolt Aries 3KS", "mortise", "slate",
    "పెంటాబోల్ట్ ఏరీస్: ఐదు బోల్ట్‌ల ప్రీమియం మెయిన్ డోర్ లాక్.",
    "Premium main-door lock with five bolts, the strongest rim lock in the Godrej price list. Available in 2 finishes: Roman Silver, Vegas Gold.",
    ["Five bolts", "Premium finishes", "For main doors"], ["door"], {"type": "Rim lock", "variants": "6 variants in the price list"}, ["Roman Silver", "Vegas Gold"], 14400, 15230);
  gm("godrej-cylindrical-locks", "Godrej Classic Cylindrical Locks", "mortise", "grey",
    "క్లాసిక్ సిలిండ్రికల్ లాక్స్: గది, బాత్‌రూమ్ తలుపులకు నాబ్ లాక్స్.",
    "Knob locks for room doors. Keyed (entrance) and keyless (bathroom and privacy) versions. Available in 6 finishes: Brass, Stainless Steel, Wooden, Antique Brass, Rose Gold, Matte Black.",
    ["Keyed and keyless versions", "Easy to fit", "Six finishes"], ["indoor"], {"type": "Cylindrical lock", "variants": "17 variants in the price list"}, ["Brass", "Stainless Steel", "Wooden", "Antique Brass", "Rose Gold", "Matte Black"], 1130, 1570);
  gm("godrej-navtal-ultra-xl", "Godrej NavTal Ultra XL+ Padlock", "padlock", "ink",
    "నవ్‌తాల్ అల్ట్రా XL+: ఇత్తడి బాడీ, గట్టి స్టీల్ షాకిల్ ఉన్న ప్యాడ్‌లాక్.",
    "Padlock with a solid brass body and a hardened steel shackle that resists hacksaw and crowbar attacks. The Ultra XL+ key mechanism makes duplication very difficult. Comes with 4 keys. Available in 1 finish: Brass.",
    ["Brass body", "Hacksaw-resistant shackle", "Hard-to-copy key"], ["door", "shop", "box"], {"type": "Padlock", "variants": "3 variants in the price list"}, ["Brass"], 1330, 2500);
  gm("godrej-no1-padlock", "Godrej No.1 Solid Brass Padlock", "padlock", "mustard",
    "గోద్రెజ్ నంబర్ 1: ఇత్తడి పిన్ సిలిండర్ ప్యాడ్‌లాక్.",
    "Classic solid brass pin-cylinder padlock in several sizes. Godrej says its padlocks have been made since 1897. Available in 1 finish: Brass.",
    ["Solid brass", "Several sizes", "Pin cylinder"], ["door", "shop", "box"], {"type": "Padlock", "variants": "5 variants in the price list"}, ["Brass"], 670, 1510);
  gm("godrej-duralock", "Godrej Duralock Ultra XL+ Padlock", "padlock", "grey",
    "డ్యూరాలాక్ అల్ట్రా XL+: స్టెయిన్‌లెస్ స్టీల్ డిస్క్ ప్యాడ్‌లాక్.",
    "Round stainless steel padlock with a shielded shackle and the Ultra XL+ key, for shutters, gates and godowns. Available in 1 finish: Stainless Steel.",
    ["Stainless steel", "Shielded shackle", "Ultra XL+ key"], ["shop", "door"], {"type": "Padlock", "variants": "6 variants in the price list"}, ["Stainless Steel"], 1030, 5720);
  gm("godrej-shutter-lock", "Godrej Shutter Lock Ultra", "padlock", "ink",
    "షట్టర్ లాక్ అల్ట్రా: షాప్ షట్టర్లకు సెంటర్ లాక్.",
    "Centre lock for rolling shutters, so the shop can be locked without padlocks at the sides. Available in 1 finish: Black.",
    ["Made for rolling shutters", "Ultra key"], ["shop"], {"type": "Shutter lock", "variants": "4 variants in the price list"}, ["Black"], 2420, 4570);
  gm("godrej-furniture-locks", "Godrej Nuvo Drawer Lock", "mortise", "kraft",
    "నువో: డ్రాయర్, అల్మారాకు పిన్ సిలిండర్ లాక్.",
    "Pin-cylinder lock for drawers and cupboards, in four finishes to match the furniture. Available in 4 finishes: Satin Steel, Textured Brown, Textured Black, Cool Ivory.",
    ["Pin cylinder", "Four finishes"], ["cup", "box"], {"type": "Furniture lock", "variants": "16 variants in the price list"}, ["Satin Steel", "Textured Brown", "Textured Black", "Cool Ivory"], 315, 570);
  gm("godrej-curvo", "Godrej Curvo Duo Wardrobe Lock", "mortise", "grey",
    "కర్వో డ్యుయో: SS 304 వార్డ్‌రోబ్ లాక్.",
    "SS 304 stainless steel wardrobe lock for two-door wardrobes. Available in 1 finish: Stainless Steel.",
    ["SS 304 stainless steel", "For two-door wardrobes"], ["cup"], {"type": "Furniture lock", "variants": "6 variants in the price list"}, ["Stainless Steel"], 540, 770);
  gm("godrej-home-handles", "Godrej Home Decor Rose Handles (HDH)", "mortise", "orange",
    "హోమ్ డెకర్ రోజ్ హ్యాండిల్స్: నాలుగు థీమ్‌లలో డిజైనర్ హ్యాండిల్స్.",
    "Designer rose handles in four themes: Euro Modern, Urban Chic, Neo Luxury and Smart Ethnic. There are many designs, including HDH 01 to HDH 23, Ugo, Cameo, Udaan and Kalasam. Available in 10 finishes: Antique Brass, Antique Copper, Satin Steel, Matte Black, Matte Black Nickel, PVD Rose Gold, Satin Matte, Matte Antique Brass, Antique Brass Walnut, Matte Black Rose.",
    ["Four design themes", "Many designs", "Ten finishes"], ["door", "indoor"], {"type": "Door handle", "variants": "100 variants in the price list"}, ["Antique Brass", "Antique Copper", "Satin Steel", "Matte Black", "Matte Black Nickel", "PVD Rose Gold", "Satin Matte", "Matte Antique Brass", "Antique Brass Walnut", "Matte Black Rose"], 3760, 19140);
  gm("godrej-pull-handles", "Godrej Pull Handles (Anoushka, Tibo, Marin)", "mortise", "orange",
    "పుల్ హ్యాండిల్స్: అనౌష్క, టిబో, మారిన్.",
    "Long pull handles for main doors and glass or wooden double doors, in three designs. Available in 6 finishes: Brass, Satin Steel, Antique Brass, Matte Black, Matte Black Nickel, Rose Gold.",
    ["Three designs", "240 to 300 mm", "Six finishes"], ["door"], {"type": "Pull handle", "variants": "30 variants in the price list"}, ["Brass", "Satin Steel", "Antique Brass", "Matte Black", "Matte Black Nickel", "Rose Gold"], 1390, 2630);
  gm("godrej-door-closer", "Godrej Cerus Door Closer", "block", "grey",
    "సెరస్ డోర్ క్లోజర్: తలుపు దానంతట అదే నెమ్మదిగా మూసుకుంటుంది.",
    "Door closer that shuts the door gently by itself. Surface-mounted Cerus universal models and an 85 kg concealed closer. Available in 3 finishes: Silver, Matte Black, Gold.",
    ["Surface-mounted and concealed", "Gentle closing", "Three finishes"], ["door"], {"type": "Door closer", "variants": "8 variants in the price list"}, ["Silver", "Matte Black", "Gold"], 2100, 7040);
  gm("godrej-ss-hinges", "Godrej Stainless Steel Door Hinges", "block", "grey",
    "స్టెయిన్‌లెస్ స్టీల్ డోర్ హింజెస్: ప్లెయిన్, కట్, బాల్ బేరింగ్.",
    "Door hinges in plain-joint, cut and ball-bearing types, in stainless steel and SS 304. Also sold in Antique Brass and Matte Black. Available in 2 finishes: Stainless Steel, SS 304.",
    ["Plain, cut and ball-bearing", "SS and SS 304", "Many sizes"], ["door", "indoor", "cup"], {"type": "Door hinge", "variants": "17 variants in the price list"}, ["Stainless Steel", "SS 304"], 55, 455);
  gm("godrej-aldrop", "Godrej Aldrops", "block", "grey",
    "ఆల్డ్రాప్స్: తలుపులకు బయటి, లోపలి గడియలు.",
    "Aldrops (door latches) for main and room doors, in stainless steel, brass, matte black and antique brass, plus inner aldrops. Available in 3 finishes: Stainless Steel, Matte Black, Antique Brass.",
    ["Outer and inner aldrops", "Steel and brass", "Three finishes"], ["door", "shop"], {"type": "Aldrop", "variants": "11 variants in the price list"}, ["Stainless Steel", "Matte Black", "Antique Brass"], 420, 2300);
  gm("godrej-tower-bolt", "Godrej Tower Bolts", "block", "kraft",
    "టవర్ బోల్ట్స్: రెగ్యులర్, డిజైనర్.",
    "Regular stainless steel tower bolts and designer tower bolts in several lengths. Available in 4 finishes: Stainless Steel, Aluminium, Antique Brass, Matte Black.",
    ["Regular and designer", "Several lengths", "Four finishes"], ["door", "indoor"], {"type": "Tower bolt", "variants": "26 variants in the price list"}, ["Stainless Steel", "Aluminium", "Antique Brass", "Matte Black"], 125, 970);
  gm("godrej-hikido", "Godrej HIKIDO Sliding Door Systems", "block", "grey",
    "హికిడో: వార్డ్‌రోబ్ స్లైడింగ్ డోర్ సిస్టమ్స్, సాఫ్ట్ క్లోజ్.",
    "Sliding systems for wardrobes and cabinets: HIKIDO Inline, Topper, Inset and Cabinet, with soft-close rollers, dampers and tracks. Available in 2 finishes: Aluminium, Anthracite.",
    ["Soft close", "Inline, Topper, Inset and Cabinet", "Up to 80 kg doors"], ["cup"], {"type": "Wardrobe fitting", "variants": "17 variants in the price list"}, ["Aluminium", "Anthracite"], 1720, 126220);
  gm("godrej-neulift", "Godrej Neulift Bed Fittings", "block", "ink",
    "న్యూలిఫ్ట్: స్టోరేజ్ బెడ్ లిఫ్ట్ ఫిట్టింగ్స్, మర్ఫీ బెడ్.",
    "Lift-up bed fittings for storage beds: bed arms, gas springs, cross bars, bed frames with slats and a vertical Murphy bed. Available in 2 finishes: Anthracite, Nickel Plated.",
    ["Storage-bed lift", "Gas springs up to 50 kg", "Murphy bed option"], ["cup", "wood"], {"type": "Bed fitting", "variants": "28 variants in the price list"}, ["Anthracite", "Nickel Plated"], 280, 14090);
  gm("godrej-cabinet-hinges", "Godrej Soft Close Cabinet Hinges", "block", "grey",
    "సాఫ్ట్ క్లోజ్ క్యాబినెట్ హింజెస్: కిచెన్, వార్డ్‌రోబ్ షట్టర్లకు.",
    "Soft-close cabinet hinges for kitchen and wardrobe shutters: slip-on, clip-on, 3D and SS 304 types, in 2-hole and 4-hole versions. Available in 1 finish: Nickel Plated.",
    ["Soft close", "Slip-on, clip-on and 3D", "SS 304 option"], ["cup", "wood"], {"type": "Cabinet hinge", "variants": "20 variants in the price list"}, ["Nickel Plated"], 225, 1005);
  gm("godrej-drawer-channels", "Godrej Drawer Channels", "block", "grey",
    "డ్రాయర్ ఛానల్స్: 35, 45 కిలోలు, సాఫ్ట్ క్లోజ్.",
    "Telescopic drawer channels in 35 kg and 45 kg load ratings, soft-close and SS 304 versions, in many lengths. Available in 2 finishes: Zinc, Black.",
    ["35 and 45 kg ratings", "Soft-close option", "Zinc and black"], ["cup", "wood"], {"type": "Drawer channel", "variants": "44 variants in the price list"}, ["Zinc", "Black"], 285, 3070);
  gm("godrej-slim-ergo", "Godrej Slim Ergo Drawer System", "block", "ink",
    "స్లిమ్ ఎర్గో: కిచెన్ డ్రాయర్ సిస్టమ్, 4, 6, 8 అంగుళాలు.",
    "Slim-wall kitchen drawer systems, Slim Ergo and Super Slim Ergo, in 4, 6 and 8 inch heights, with rails and front fascia parts. Available in 2 finishes: Anthracite, Black.",
    ["Slim and Super Slim", "4, 6 and 8 inch heights", "Two finishes"], ["cup"], {"type": "Kitchen drawer", "variants": "78 variants in the price list"}, ["Anthracite", "Black"], 2170, 5170);
  gm("godrej-super-skido", "Godrej Super SKIDO Kitchen Systems", "block", "ink",
    "సూపర్ స్కిడో: పాంట్రీ, కార్నర్, సింక్ కింద కిచెన్ సొల్యూషన్స్.",
    "Modular kitchen units: slide-out pantry, corner solutions, swing corner, under-sink storage and grain storage. Available in 1 finish: Anthracite.",
    ["Pantry, corner and under-sink units", "Anthracite finish"], ["cup"], {"type": "Kitchen fitting", "variants": "9 variants in the price list"}, ["Anthracite"], 5659, 32520);
  gm("godrej-ss-baskets", "Godrej Stainless Steel Kitchen Baskets", "block", "grey",
    "స్టెయిన్‌లెస్ స్టీల్ కిచెన్ బాస్కెట్లు: ప్లెయిన్, కప్ & సాసర్, థాలీ, కట్లరీ.",
    "Kitchen wire baskets in stainless steel and SS 304: plain, cup and saucer, thali and perforated cutlery baskets, in many sizes. Available in 2 finishes: Stainless Steel, SS 304.",
    ["Many sizes", "SS and SS 304", "Plain, thali, cup and cutlery"], ["cup"], {"type": "Kitchen basket", "variants": "192 variants in the price list"}, ["Stainless Steel", "SS 304"], 1300, 7940);

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
  var PHOTOS = ['ambuja-buildcem','ambuja-cement','ambuja-compocem','ambuja-cool-walls','ambuja-kawach','ambuja-plus','ambuja-powercem','ambuja-purasand','ambuja-railcem','astral-bondtite-cyano','astral-bondtite-epoxy','astral-bondtite-pva','astral-fast-and-clear','astral-resibond-neutral','bharathi-opc-43','bharathi-opc-53','bharathi-ppc','bharathi-ultra-fast','birlawhite-ever-white','birlawhite-excel','birlawhite-level-plast','birlawhite-textura-roller','birlawhite-textura-trowel','birlawhite-wallcare-putty','birlawhite-wallcare-scented','birlawhite-wallseal','birlawhite-white-cement','chettinad-classic-slag','chettinad-composite','chettinad-hbc','chettinad-maxcrete','chettinad-opc-43','chettinad-opc-53','chettinad-super-grade','dalmia-cement','dalmia-dsp','dalmia-infra-pro','fevicol-ezeespray','fevicol-heatx','fevicol-hiper','fevicol-hiper-star','fevicol-marine','fevicol-mr','fevicol-plastilok','fevicol-probond','fevicol-probond-edgelok','fevicol-relam','fevicol-sh','fevicol-speedx','fevicol-sr-998','fosroc-brushbond','fosroc-conplast-wl','fosroc-nitobond-sbr','fosroc-nitoproof-100','fosroc-nitoproof-600pf','fosroc-nitoseal-pu','godrej-6-lever-mortise','godrej-advantis-iot9','godrej-advantis-rimtronic','godrej-aldrop','godrej-cabinet-hinges','godrej-centaur-rim-lock','godrej-curvo','godrej-cylindrical-locks','godrej-door-closer','godrej-drawer-channels','godrej-duralock','godrej-essential-mortise','godrej-furniture-locks','godrej-gloria','godrej-hikido','godrej-home-handles','godrej-navtal-ultra-xl','godrej-neh-21','godrej-neo-connect','godrej-neulift','godrej-no1-padlock','godrej-pentabolt-aries','godrej-pull-handles','godrej-shutter-lock','godrej-slim-ergo','godrej-ss-baskets','godrej-ss-hinges','godrej-super-skido','godrej-tower-bolt','godrej-tribolt-ultra-xl','godrej-ulturo-cylinder','hardworker-anchoring-grout','hardworker-block-fix','hardworker-bonding-epoxy','hardworker-bonding-sbr','hardworker-eco-plaster','hardworker-floor-screed','hardworker-integral-waterproofing','hardworker-micro-concrete','hardworker-tile-fix','hardworker-tile-fix-epoxy','hardworker-tile-fix-slurry','hardworker-tile-grout','hardworker-tile-grout-epoxy','hardworker-wall-putty','hardworker-waterproofing-coat','indiacements-coromandel-king','indiacements-sankar','kcp-opc-43','kcp-opc-53','kcp-opc-53s','kcp-rhpc','kcp-shreshtaa','kcp-super-shreshtaa','maha-concrete-special','maha-hd-ppc','maha-psc','maha-solid-hd','nagarjuna-irs-53s','nagarjuna-opc-43','nagarjuna-opc-53','nagarjuna-ppc','nagarjuna-visistha','penna-concrete-guard','penna-power-ppc','penna-premium-43','penna-premium-53','penna-suraksha-psc','ramco-infra-opc-43','ramco-infra-opc-53','ramco-infra-super-opc-53','ramco-karthic-super-plus','ramco-opc-43','ramco-opc-53','ramco-samudra','ramco-super-coast','ramco-super-fast','ramco-super-steel','ramco-supercrete','ramco-superfine-efc','ramco-supergrade','sagar-opc-53','sagar-ppc','shree-jungrodhak','shree-magna','shree-powermax','shree-rockstrong','shree-roofon','ultratech-bath-kit','ultratech-bath-membrane','ultratech-bitupro','ultratech-crack-filler','ultratech-epoxy-grout','ultratech-flex','ultratech-hiflex','ultratech-membranes','ultratech-opc-43','ultratech-opc-53','ultratech-ppc','ultratech-psc','ultratech-readiplast-pro','ultratech-sbr','ultratech-tilefixo','ultratech-top-shield','ultratech-top-shield-ezy','ultratech-weather-plus','ultratech-wp200'];

  window.CATALOG = { PHOTOS: PHOTOS, TINT: TINT, APPS: APPS, SPEC_LABELS: SPEC_LABELS, CATEGORIES: CATEGORIES, BRANDS: BRANDS, PRODUCTS: PRODUCTS, GUIDE: GUIDE };
})();
