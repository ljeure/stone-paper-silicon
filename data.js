// World History Timeline Data
// Knowledge Map Approach: Societal entities are central, with events, references, and insights linking to them

// Geographic regions for vertical layout (5 regions as per knowledge map)
const REGIONS = [
    { id: 'subsaharan-africa', name: 'Subsaharan Africa' },
    { id: 'europe-middle-east', name: 'Europe & Middle East' },
    { id: 'asia', name: 'Asia' },
    { id: 'americas', name: 'The Americas' },
    { id: 'pacific', name: 'Pacific' }
];

// Entity types for societal entities
const ENTITY_TYPES = ['religion', 'state', 'culture'];

// Sub-tags for finer categorization of events
const SUB_TAGS = [
    { id: 'war', name: 'War & Conflict', icon: 'W' },
    { id: 'art', name: 'Art & Architecture', icon: 'A' },
    { id: 'science', name: 'Science & Technology', icon: 'S' },
    { id: 'politics', name: 'Politics & Law', icon: 'P' },
    { id: 'trade', name: 'Trade & Economics', icon: 'T' },
    { id: 'religion', name: 'Religion & Philosophy', icon: 'R' },
    { id: 'exploration', name: 'Exploration', icon: 'X' },
    { id: 'disaster', name: 'Disaster & Disease', icon: 'D' }
];

// Region mapping for periods (CSV uses different names)
const PERIOD_REGION_MAP = {
    'Asia': 'asia',
    'Europe & Mediterranean': 'europe-middle-east',
    'Sub-Saharan Africa': 'subsaharan-africa',
    'Pacific': 'pacific',
    'Americas': 'americas'
};

const timelineData = {
    // Experience-based scaling: proportion of all human experience by year
    experienceScale: {
        markers: [
            { year: -300000, experience: 0.00 },
            { year: -100000, experience: 0.03 },
            { year: -50000, experience: 0.05 },
            { year: -10000, experience: 0.08 },
            { year: -6000, experience: 0.10 },
            { year: -3000, experience: 0.15 },
            { year: -1000, experience: 0.20 },
            { year: 0, experience: 0.25 },
            { year: 500, experience: 0.35 },
            { year: 1000, experience: 0.45 },
            { year: 1300, experience: 0.50 },
            { year: 1500, experience: 0.55 },
            { year: 1700, experience: 0.62 },
            { year: 1760, experience: 0.67 },
            { year: 1850, experience: 0.75 },
            { year: 1900, experience: 0.80 },
            { year: 1950, experience: 0.85 },
            { year: 2000, experience: 0.90 },
            { year: 2026, experience: 1.00 }
        ]
    },

    // ===========================================
    // SOCIETAL ENTITIES - Central concept
    // Things that persist across time and space, that knowledge attaches to
    // Types: religion, country, culture
    // ===========================================
    entities: [
        // === RELIGIONS ===
        { id: 'christianity', name: 'Christianity', type: 'religion', year: 30, endYear: 2026, region: 'europe-middle-east', description: 'Abrahamic religion based on the teachings of Jesus Christ', createdBy: 'Luke' },
        { id: 'islam', name: 'Islam', type: 'religion', year: 622, endYear: 2026, region: 'europe-middle-east', description: 'Abrahamic religion founded by Prophet Muhammad', createdBy: 'Luke' },
        { id: 'buddhism', name: 'Buddhism', type: 'religion', year: -500, endYear: 2026, region: 'asia', description: 'Religion and philosophy based on teachings of Siddhartha Gautama', createdBy: 'Luke' },
        { id: 'manichaeism', name: 'Manichaeism', type: 'religion', year: 240, endYear: 1400, region: 'europe-middle-east', description: 'Gnostic religion founded by Mani, once widespread from Rome to China', createdBy: 'Luke' },
        { id: 'bahai', name: "Bahá'í Faith", type: 'religion', year: 1863, endYear: 2026, region: 'europe-middle-east', description: "Religion founded by Bahá'u'lláh emphasizing unity of humanity", createdBy: 'Luke' },
        { id: 'confucianism', name: 'Confucianism', type: 'religion', year: -500, endYear: 2026, region: 'asia', description: 'Chinese philosophical and ethical system founded by Confucius', createdBy: 'Luke' },

        // === STATES (political entities - empires, kingdoms, nations) ===
        // Ancient Mesopotamia
        { id: 'sumer', name: 'Sumerian City-States', type: 'state', year: -3500, endYear: -2300, region: 'asia', description: 'First known civilization with writing, cities, and complex society', createdBy: 'Luke' },
        { id: 'akkad', name: 'Akkadian Empire', type: 'state', year: -2334, endYear: -2154, region: 'asia', description: 'First ancient empire of Mesopotamia, founded by Sargon', createdBy: 'Luke' },
        { id: 'babylon', name: 'Babylonian Empire', type: 'state', year: -1900, endYear: -1600, region: 'asia', description: 'Mesopotamian empire known for Hammurabi\'s Code', createdBy: 'Luke' },
        { id: 'assyria', name: 'Neo-Assyrian Empire', type: 'state', year: -911, endYear: -609, region: 'asia', description: 'Powerful Mesopotamian empire known for military prowess', createdBy: 'Luke' },

        // Persian Empires
        { id: 'achaemenid', name: 'Achaemenid Empire', type: 'state', year: -550, endYear: -330, region: 'europe-middle-east', description: 'First Persian Empire, founded by Cyrus the Great', createdBy: 'Luke' },
        { id: 'seleucid', name: 'Seleucid Empire', type: 'state', year: -312, endYear: -63, region: 'europe-middle-east', description: 'Hellenistic empire founded after Alexander\'s death', createdBy: 'Luke' },
        { id: 'parthia', name: 'Parthian Empire', type: 'state', year: -247, endYear: 224, region: 'europe-middle-east', description: 'Iranian empire and rival of Rome', createdBy: 'Luke' },
        { id: 'sasanian', name: 'Sasanian Empire', type: 'state', year: 224, endYear: 651, region: 'europe-middle-east', description: 'Last pre-Islamic Persian Empire', createdBy: 'Luke' },

        // Greek & Roman
        { id: 'ancient-greece', name: 'Ancient Greece', type: 'state', year: -800, endYear: -146, region: 'europe-middle-east', description: 'Greek city-states and classical civilization', createdBy: 'Luke' },
        { id: 'macedon', name: 'Macedonian Empire', type: 'state', year: -336, endYear: -323, region: 'europe-middle-east', description: 'Empire of Alexander the Great', createdBy: 'Luke' },
        { id: 'roman-republic', name: 'Roman Republic', type: 'state', year: -509, endYear: -27, region: 'europe-middle-east', description: 'Roman state before the emperors', createdBy: 'Luke' },
        { id: 'roman-empire', name: 'Roman Empire', type: 'state', year: -27, endYear: 476, region: 'europe-middle-east', description: 'One of the largest empires in ancient history', createdBy: 'Luke' },
        { id: 'byzantine', name: 'Byzantine Empire', type: 'state', year: 330, endYear: 1453, region: 'europe-middle-east', description: 'Eastern Roman Empire, preserved Roman and Greek culture', createdBy: 'Luke' },

        // Islamic Caliphates
        { id: 'rashidun', name: 'Rashidun Caliphate', type: 'state', year: 632, endYear: 661, region: 'europe-middle-east', description: 'First caliphate led by the Rightly Guided caliphs', createdBy: 'Luke' },
        { id: 'umayyad', name: 'Umayyad Caliphate', type: 'state', year: 661, endYear: 750, region: 'europe-middle-east', description: 'Second caliphate, expanded Islam from Spain to India', createdBy: 'Luke' },
        { id: 'abbasid', name: 'Abbasid Caliphate', type: 'state', year: 750, endYear: 1258, region: 'europe-middle-east', description: 'Islamic Golden Age, center of learning in Baghdad', createdBy: 'Luke' },
        { id: 'fatimid', name: 'Fatimid Caliphate', type: 'state', year: 909, endYear: 1171, region: 'europe-middle-east', description: 'Shia caliphate based in Egypt, founded Cairo', createdBy: 'Luke' },
        { id: 'mamluk', name: 'Mamluk Sultanate', type: 'state', year: 1250, endYear: 1517, region: 'europe-middle-east', description: 'Slave-soldier dynasty that ruled Egypt and Syria', createdBy: 'Luke' },
        { id: 'ottoman', name: 'Ottoman Empire', type: 'state', year: 1299, endYear: 1922, region: 'europe-middle-east', description: 'Major empire spanning Southeast Europe, Western Asia, and North Africa', createdBy: 'Luke' },

        // Chinese Dynasties
        { id: 'tang', name: 'Tang Dynasty', type: 'state', year: 618, endYear: 907, region: 'asia', description: 'Golden age of Chinese civilization', createdBy: 'Luke' },
        { id: 'song', name: 'Song Dynasty', type: 'state', year: 960, endYear: 1279, region: 'asia', description: 'Era of significant economic and cultural development', createdBy: 'Luke' },
        { id: 'yuan', name: 'Yuan Dynasty', type: 'state', year: 1271, endYear: 1368, region: 'asia', description: 'Mongol-led dynasty founded by Kublai Khan', createdBy: 'Luke' },
        { id: 'ming', name: 'Ming Dynasty', type: 'state', year: 1368, endYear: 1644, region: 'asia', description: 'Era known for trade expansion and iconic architecture', createdBy: 'Luke' },
        { id: 'qing', name: 'Qing Dynasty', type: 'state', year: 1644, endYear: 1912, region: 'asia', description: 'Last imperial dynasty of China', createdBy: 'Luke' },
        { id: 'roc', name: 'Republic of China', type: 'state', year: 1912, endYear: 1949, region: 'asia', description: 'Period of republican government in mainland China', createdBy: 'Luke' },
        { id: 'prc', name: "People's Republic of China", type: 'state', year: 1949, endYear: 2026, region: 'asia', description: 'Communist government established by Mao Zedong', createdBy: 'Luke' },

        // Mongol
        { id: 'mongol', name: 'Mongol Empire', type: 'state', year: 1206, endYear: 1368, region: 'asia', description: 'Largest contiguous land empire in history', createdBy: 'Luke' },

        // Tibetan
        { id: 'tibetan-empire', name: 'Tibetan Empire', type: 'state', year: 618, endYear: 848, region: 'asia', description: 'According to Tang Annals: King in 600s attempted to marry Tang princess, was rebuffed, so he attacked the Tang. Then when he retreated, his request was granted.', createdBy: 'Luke' },

        // Mughal
        { id: 'mughal-empire', name: 'Mughal Empire', type: 'state', year: 1526, endYear: 1818, region: 'asia', description: '', createdBy: 'Luke' },

        // Turkish States
        { id: 'oghuz-turks', name: 'Oghuz Yabgu State', type: 'state', year: 750, endYear: 1055, region: 'asia', description: 'First major Turkish state', createdBy: 'Luke' },
        { id: 'seljuk-empire', name: 'Seljuk Empire', type: 'state', year: 1037, endYear: 1194, region: 'asia', description: 'Turkish empire. Nomadic people, came into Anatolia and conquered. Converted Greek-speaking Christian Anatolians into Turkish speaking Muslims', createdBy: 'Luke' },
        { id: 'timurid-emirates', name: 'Timurid Empire', type: 'state', year: 1363, endYear: 1562, region: 'asia', description: "Tamerlane-founded Turkish empire. Tamerlane (Timur, Tamer the Lame) claimed to descend from Genghis Khan", createdBy: 'Luke' },

        // Iranian States
        { id: 'ilkhanate', name: 'Ilkhanate', type: 'state', year: 1256, endYear: 1335, region: 'europe-middle-east', description: 'Mongol khanate ruling Persia, founded by Hulagu Khan after sacking Baghdad', createdBy: 'Luke' },
        { id: 'qajar-dynasty', name: 'Qajar Dynasty', type: 'state', year: 1789, endYear: 1925, region: 'europe-middle-east', description: 'Iranian dynasty ruling during an era of European imperial pressure and modernization efforts', createdBy: 'Luke' },
        { id: 'pahlavi-dynasty', name: 'Pahlavi Dynasty', type: 'state', year: 1925, endYear: 1979, region: 'europe-middle-east', description: 'Last Iranian monarchy, modernized Iran before the 1979 Islamic Revolution', createdBy: 'Luke' },

        // American States
        { id: 'aztec-empire', name: 'Aztec Empire', type: 'state', year: 1428, endYear: 1521, region: 'americas', description: 'Mesoamerican empire centered on Tenochtitlan, conquered by Spanish under Cortés', createdBy: 'Luke' },
        { id: 'inca-empire', name: 'Inca Empire', type: 'state', year: 1438, endYear: 1533, region: 'americas', description: 'Largest empire in pre-Columbian Americas, spanning the Andes from Ecuador to Chile', createdBy: 'Luke' },

        // African States
        { id: 'egypt-old', name: 'Egyptian Old Kingdom', type: 'state', year: -2686, endYear: -2181, region: 'subsaharan-africa', description: 'Age of the pyramids, centralized pharaonic rule', createdBy: 'Luke' },
        { id: 'egypt-middle', name: 'Egyptian Middle Kingdom', type: 'state', year: -2055, endYear: -1650, region: 'subsaharan-africa', description: 'Reunification and cultural flourishing of Egypt', createdBy: 'Luke' },
        { id: 'egypt-new', name: 'Egyptian New Kingdom', type: 'state', year: -1550, endYear: -1070, region: 'subsaharan-africa', description: 'Egypt at its most powerful, era of Ramesses and Tutankhamun', createdBy: 'Luke' },
        { id: 'aksum', name: 'Kingdom of Aksum', type: 'state', year: 100, endYear: 940, region: 'subsaharan-africa', description: 'Major trading empire in modern-day Ethiopia and Eritrea', createdBy: 'Luke' },
        { id: 'zimbabwe', name: 'Kingdom of Zimbabwe', type: 'state', year: 1220, endYear: 1450, region: 'subsaharan-africa', description: 'Medieval kingdom known for Great Zimbabwe stone ruins', createdBy: 'Luke' },
        { id: 'kongo', name: 'Kingdom of Kongo', type: 'state', year: 1390, endYear: 1914, region: 'subsaharan-africa', description: 'Major kingdom in west-central Africa, early contact with Portugal. Defeated Portugal in Battle of Mbwila and demanded return of Kongo slaves.', createdBy: 'Luke' },
        { id: 'zulu', name: 'Zulu Kingdom', type: 'state', year: 1816, endYear: 1897, region: 'subsaharan-africa', description: 'Southern African kingdom founded by Shaka Zulu', createdBy: 'Luke' },

        // Omani Empire
        { id: 'oman', name: 'Omani Empire', type: 'state', year: 1696, endYear: 1856, region: 'subsaharan-africa', description: 'Maritime empire controlling East African coast and Indian Ocean trade', createdBy: 'Luke' },

        // European Nations (for later events)
        { id: 'england', name: 'England/Britain', type: 'state', year: 927, endYear: 2026, region: 'europe-middle-east', description: 'Kingdom of England, later Great Britain and UK', createdBy: 'Luke' },
        { id: 'france', name: 'France', type: 'state', year: 843, endYear: 2026, region: 'europe-middle-east', description: 'French nation from Carolingian division', createdBy: 'Luke' },
        { id: 'carolingian', name: 'Carolingian Dynasty', type: 'state', year: 751, endYear: 888, region: 'europe-middle-east', description: 'Frankish dynasty that ruled Western Europe', createdBy: 'Luke' },

        // Pacific
        { id: 'australian-aboriginal-hunter-gatherers', name: 'Australian aboriginal hunter-gatherers', type: 'state', year: 1823, endYear: 1823, region: 'pacific', description: '', createdBy: 'Luke' },

        // === CULTURES/ERAS (intellectual and artistic movements) ===
        // European Eras
        { id: 'paleolithic', name: 'Upper Paleolithic', type: 'culture', year: -50000, endYear: -10000, region: 'europe-middle-east', description: 'Development of art, sophisticated tools, and cultural complexity', createdBy: 'Luke' },
        { id: 'mesolithic', name: 'Mesolithic', type: 'culture', year: -10000, endYear: -5000, region: 'europe-middle-east', description: 'Middle Stone Age - transition from hunting to early farming', createdBy: 'Luke' },
        { id: 'neolithic', name: 'Neolithic', type: 'culture', year: -5000, endYear: -3000, region: 'europe-middle-east', description: 'New Stone Age - agricultural revolution, permanent settlements', createdBy: 'Luke' },
        { id: 'chalcolithic', name: 'Chalcolithic', type: 'culture', year: -3500, endYear: -2300, region: 'europe-middle-east', description: 'Copper Age - first metal tools alongside stone', createdBy: 'Luke' },
        { id: 'bronze-age', name: 'Bronze Age', type: 'culture', year: -2300, endYear: -1200, region: 'europe-middle-east', description: 'Widespread bronze tools, rise of complex societies', createdBy: 'Luke' },
        { id: 'iron-age', name: 'Iron Age', type: 'culture', year: -1200, endYear: -800, region: 'europe-middle-east', description: 'Iron replaces bronze, spread of ironworking', createdBy: 'Luke' },
        { id: 'classical-antiquity', name: 'Classical Antiquity', type: 'culture', year: -800, endYear: 500, region: 'europe-middle-east', description: 'Rise of ancient Greece and Rome, foundations of Western civilization', createdBy: 'Luke' },
        { id: 'early-middle-ages', name: 'Early Middle Ages', type: 'culture', year: 500, endYear: 1000, region: 'europe-middle-east', description: 'Period following the fall of Rome', createdBy: 'Luke' },
        { id: 'high-middle-ages', name: 'High Middle Ages', type: 'culture', year: 1000, endYear: 1300, region: 'europe-middle-east', description: 'Period of population growth, urbanization, cultural achievements', createdBy: 'Luke' },
        { id: 'renaissance', name: 'Renaissance', type: 'culture', year: 1300, endYear: 1600, region: 'europe-middle-east', description: 'Cultural rebirth in Europe, bridging Middle Ages and Modern era', createdBy: 'Luke' },
        { id: 'enlightenment', name: 'Enlightenment', type: 'culture', year: 1600, endYear: 1789, region: 'europe-middle-east', description: 'Age of Reason emphasizing science and rational thought', createdBy: 'Luke' },
        { id: 'scientific-revolution', name: 'Scientific Revolution', type: 'culture', year: 1543, endYear: 1700, region: 'europe-middle-east', description: 'Emergence of modern science from new methodology and discoveries', createdBy: 'Luke' },

        // Philosophy traditions
        { id: 'stoicism', name: 'Stoicism', type: 'culture', year: -300, endYear: 300, region: 'europe-middle-east', description: 'Hellenistic philosophy emphasizing virtue and reason', createdBy: 'Luke' },
        { id: 'greek-philosophy', name: 'Greek Philosophy', type: 'culture', year: -600, endYear: -300, region: 'europe-middle-east', description: 'Pre-Socratic through Classical Greek philosophical traditions', createdBy: 'Luke' },

        // === NORTH AMERICA & MESOAMERICA (from "Native Nations" by Kathleen DuVal) ===
        { id: 'maya-civilization', name: 'Maya Civilization', type: 'state', year: -2000, endYear: 1697, region: 'americas', description: 'Mesoamerican civilization of independent city-states (Tikal, Calakmul, Palenque) across present-day Mexico, Guatemala, and Belize. Known for writing, mathematics, and astronomy. The Classic period peaked 250-900 CE before a major collapse; the last independent Maya city, Nojpetén, fell to the Spanish in 1697.', createdBy: 'Luke' },
        { id: 'cahokia', name: 'Cahokia', type: 'state', year: 1050, endYear: 1380, region: 'americas', description: 'Mississippian city near present-day St. Louis and the largest urban center north of Mexico, peaking at 10,000-20,000 people. Famous for massive earthen pyramids including Monks Mound. Construction accelerated around 1050, just after the supernova of 1054. Abandoned by roughly 1380.', createdBy: 'Luke' },
        { id: 'moundville', name: 'Moundville', type: 'state', year: 1120, endYear: 1450, region: 'americas', description: 'Major Mississippian political and ceremonial center on the Black Warrior River in present-day Alabama, with 29 earthen mounds around a central plaza. Flourished c. 1120-1450 before being abandoned.', createdBy: 'Luke' },
        { id: 'hohokam', name: 'Hohokam', type: 'culture', year: 300, endYear: 1450, region: 'americas', description: "Culture of the Sonoran Desert (present-day Arizona) renowned for hundreds of miles of irrigation canals that supported large settlements such as Snaketown. Their towns were largely abandoned by the mid-1400s; the modern O'odham are their likely descendants.", createdBy: 'Luke' },
        { id: 'iroquois-confederacy', name: 'Haudenosaunee Confederacy (Iroquois)', type: 'state', year: 1450, endYear: 1779, region: 'americas', description: 'Alliance of the Mohawk, Oneida, Onondaga, Cayuga, and Seneca (joined by the Tuscarora in 1722 to form the Six Nations). A dominant military and diplomatic power in the Northeast who balanced Dutch, French, and English interests. Its founding is contested (oral tradition suggests as early as 1142; many scholars place it 1450-1570). Devastated by the 1779 Sullivan Expedition during the American Revolution.', createdBy: 'Luke' },
    ],

    // ===========================================
    // PERIODS - Historical eras that span regions
    // Background context for the timeline
    // ===========================================
    periods: [
        // Asia
        { id: 'asia-stone-age', name: 'Stone Age', year: -300000, endYear: -10000, region: 'asia', description: 'Prehistoric period before agriculture' },
        { id: 'asia-neolithic', name: 'Neolithic', year: -10000, endYear: -3000, region: 'asia', description: 'Agricultural revolution and early settlements' },
        { id: 'asia-bronze-age', name: 'Bronze Age', year: -3000, endYear: -1200, region: 'asia', description: 'Development of bronze tools and early civilizations' },
        { id: 'asia-classical', name: 'Classical Era', year: -1200, endYear: 220, region: 'asia', description: 'Rise of major philosophical and religious traditions' },
        { id: 'asia-post-classical', name: 'Post-Classical', year: 220, endYear: 600, region: 'asia', description: 'Period of fragmentation and transition' },
        { id: 'asia-imperial', name: 'Imperial Era', year: 600, endYear: 1800, region: 'asia', description: 'Great empires and cultural flowering' },
        { id: 'asia-modern', name: 'Modern Era', year: 1800, endYear: 2025, region: 'asia', description: 'Colonialism, independence, and modernization' },

        // Europe & Mediterranean
        { id: 'europe-stone-age', name: 'Stone Age', year: -300000, endYear: -10000, region: 'europe-middle-east', description: 'Prehistoric hunter-gatherer societies' },
        { id: 'europe-neolithic', name: 'Neolithic', year: -10000, endYear: -3200, region: 'europe-middle-east', description: 'Agricultural revolution spreads to Europe' },
        { id: 'europe-bronze-age', name: 'Bronze Age', year: -3200, endYear: -800, region: 'europe-middle-east', description: 'Bronze metallurgy and early Mediterranean civilizations' },
        { id: 'europe-antiquity', name: 'Antiquity', year: -800, endYear: 476, region: 'europe-middle-east', description: 'Classical Greece and Rome' },
        { id: 'europe-middle-ages', name: 'Middle Ages', year: 476, endYear: 1300, region: 'europe-middle-east', description: 'Medieval period after fall of Rome' },
        { id: 'europe-modern', name: 'Modern Era', year: 1789, endYear: 2025, region: 'europe-middle-east', description: 'Industrial revolution to present' },

        // Sub-Saharan Africa
        { id: 'africa-stone-age', name: 'Stone Age', year: -300000, endYear: -10000, region: 'subsaharan-africa', description: 'Origin of humanity and early development' },
        { id: 'africa-neolithic', name: 'Neolithic', year: -10000, endYear: -400, region: 'subsaharan-africa', description: 'Development of agriculture and pastoralism' },
        { id: 'africa-iron-age', name: 'Iron Age', year: -400, endYear: 1500, region: 'subsaharan-africa', description: 'Bantu expansion and African kingdoms' },
        { id: 'africa-early-global', name: 'Early Global', year: 1500, endYear: 1800, region: 'subsaharan-africa', description: 'Trans-Atlantic trade and early European contact' },
        { id: 'africa-colonial', name: 'Colonial Era', year: 1800, endYear: 1960, region: 'subsaharan-africa', description: 'European colonization of Africa' },
        { id: 'africa-modern', name: 'Modern Era', year: 1960, endYear: 2025, region: 'subsaharan-africa', description: 'Independence movements and modern states' },

        // Pacific
        { id: 'pacific-pre-human', name: 'Pre-Human', year: -300000, endYear: -70000, region: 'pacific', description: 'Before human settlement' },
        { id: 'pacific-early-settlement', name: 'Early Settlement', year: -70000, endYear: -1500, region: 'pacific', description: 'Initial human migration to Australia and Near Oceania' },
        { id: 'pacific-traditional', name: 'Traditional Societies', year: -1500, endYear: 1600, region: 'pacific', description: 'Polynesian expansion and traditional cultures' },
        { id: 'pacific-colonial', name: 'Colonial Era', year: 1600, endYear: 1945, region: 'pacific', description: 'European exploration and colonization' },
        { id: 'pacific-modern', name: 'Modern Era', year: 1945, endYear: 2025, region: 'pacific', description: 'Decolonization and independence' },

        // Americas
        { id: 'americas-pre-human', name: 'Pre-Human', year: -300000, endYear: -20000, region: 'americas', description: 'Before human arrival' },
        { id: 'americas-early-settlement', name: 'Early Settlement', year: -20000, endYear: -8000, region: 'americas', description: 'Initial human migration from Asia' },
        { id: 'americas-neolithic', name: 'Neolithic', year: -8000, endYear: -2000, region: 'americas', description: 'Development of agriculture' },
        { id: 'americas-classical', name: 'Classical Civilizations', year: -2000, endYear: 1492, region: 'americas', description: 'Maya, Aztec, Inca and other civilizations' },
        { id: 'americas-colonial', name: 'Colonial Era', year: 1492, endYear: 1800, region: 'americas', description: 'European colonization' },
        { id: 'americas-modern', name: 'Modern Era', year: 1800, endYear: 2025, region: 'americas', description: 'Independence and modern nations' },
    ],

    // ===========================================
    // EVENTS - Facts in time that link to societal entities
    // People appear as events (births, deaths, achievements)
    // ===========================================
    events: [
        // === PREHISTORIC EVENTS ===
        { id: 201, title: "Out of Africa migration", year: -70000, endYear: -50000, entityIds: [], region: "subsaharan-africa", description: "Humans migrate out of Africa to populate the world", tags: ['exploration'], createdBy: 'Luke' },
        { id: 203, title: "Last Ice Age peak", year: -26000, endYear: -19000, entityIds: ['paleolithic'], region: "europe-middle-east", description: "Last Glacial Maximum - ice sheets at their greatest extent", tags: ['disaster'], createdBy: 'Luke' },

        // === TECHNOLOGY EVENTS ===
        { id: 204, title: "Agriculture begins", year: -10000, endYear: -8000, entityIds: ['neolithic'], region: "europe-middle-east", description: "Neolithic Revolution - transition from hunting/gathering to farming", tags: ['science'], createdBy: 'Luke' },
        { id: 205, title: "Domestication of animals", year: -10000, endYear: -7000, entityIds: ['neolithic'], region: "asia", description: "Dogs, sheep, goats, and cattle domesticated", tags: ['science'], createdBy: 'Luke' },
        { id: 206, title: "First cities emerge", year: -6000, endYear: -4000, entityIds: ['neolithic'], region: "europe-middle-east", description: "Çatalhöyük, Jericho, and other early urban settlements", tags: ['science', 'trade'], createdBy: 'Luke' },
        { id: 207, title: "Writing invented", year: -3400, endYear: -3200, entityIds: ['sumer'], region: "asia", description: "Cuneiform in Mesopotamia and hieroglyphics in Egypt", tags: ['science'], createdBy: 'Luke' },
        { id: 208, title: "Bronze Age begins", year: -3300, entityIds: ['bronze-age'], region: "europe-middle-east", description: "Widespread use of bronze for tools and weapons", tags: ['science'], createdBy: 'Luke' },
        { id: 31, title: "Rice paddies & canals", year: -1000, entityIds: [], region: "asia", description: "Development of sophisticated irrigation for rice farming", tags: ['science', 'trade'], createdBy: 'Luke' },
        { id: 32, title: "Rice mechanization", year: 1850, entityIds: [], region: "asia", description: "Industrial mechanization of rice farming", tags: ['science', 'trade'], createdBy: 'Luke' },
        { id: 33, title: "Rice Green Revolution", year: 1960, entityIds: [], region: "asia", description: "High-yield rice varieties dramatically increase production", tags: ['science'], createdBy: 'Luke' },

        // === PEOPLE - Religious figures (one event per person: most prominent achievement) ===
        { id: 160, title: "Buddha achieves enlightenment", year: -528, entityIds: ['buddhism'], region: "asia", description: "Siddhartha Gautama attains nirvana under the Bodhi tree", tags: ['religion'], createdBy: 'Luke' },
        { id: 20, title: "Jesus crucified", year: 33, entityIds: ['christianity', 'roman-empire'], region: "europe-middle-east", description: "Crucifixion and resurrection, founding event of Christianity", tags: ['religion'], createdBy: 'Luke' },
        { id: 30, title: "Mani executed", year: 274, entityIds: ['manichaeism', 'sasanian'], region: "europe-middle-east", description: "Mani executed by Sasanian authorities", tags: ['religion', 'politics'], createdBy: 'Luke' },
        { id: 40, title: "Augustine writes Confessions", year: 400, entityIds: ['christianity'], region: "europe-middle-east", description: "Augustine completes his autobiographical work", tags: ['religion', 'art'], createdBy: 'Luke' },
        { id: 51, title: "Hijra to Medina", year: 622, entityIds: ['islam'], region: "europe-middle-east", description: "Muhammad's migration to Medina, start of Islamic calendar", tags: ['religion', 'politics'], createdBy: 'Luke' },
        { id: 60, title: "Aquinas writes Summa Theologica", year: 1265, endYear: 1274, entityIds: ['christianity', 'high-middle-ages'], region: "europe-middle-east", description: "Aquinas composes his masterwork of systematic theology", tags: ['religion', 'art'], createdBy: 'Luke' },
        { id: 70, title: "Bahá'u'lláh declares mission", year: 1863, entityIds: ['bahai'], region: "europe-middle-east", description: "Bahá'u'lláh declares himself the Promised One", tags: ['religion'], createdBy: 'Luke' },

        // === PEOPLE - Political leaders ===
        { id: 170, title: "Alexander conquers Persian Empire", year: -330, entityIds: ['macedon', 'achaemenid'], region: "europe-middle-east", description: "Alexander defeats Darius III, ending Achaemenid Empire", tags: ['war', 'politics'], createdBy: 'Luke' },
        { id: 80, title: "Mongol Empire founded", year: 1206, entityIds: ['mongol'], region: "asia", description: "Temüjin proclaimed Genghis Khan, unifying Mongol tribes", tags: ['war', 'politics'], createdBy: 'Luke' },

        // === PEOPLE - Philosophers and Scientists ===
        { id: 110, title: "Thales predicts solar eclipse", year: -585, entityIds: ['greek-philosophy', 'ancient-greece'], region: "europe-middle-east", description: "Thales allegedly predicts eclipse, demonstrating natural philosophy", tags: ['science'], createdBy: 'Luke' },
        { id: 12, title: "Pythagoras born", year: -570, entityIds: ['greek-philosophy', 'ancient-greece'], region: "europe-middle-east", description: "Birth of mathematician and philosopher", tags: ['science'], createdBy: 'Luke' },
        { id: 13, title: "Confucius born", year: -551, entityIds: ['confucianism'], region: "asia", description: "Birth of Chinese philosopher", tags: ['religion', 'politics'], createdBy: 'Luke' },
        { id: 140, title: "Herodotus writes Histories", year: -440, entityIds: ['ancient-greece', 'classical-antiquity'], region: "europe-middle-east", description: "Herodotus composes first great narrative history", tags: ['art'], createdBy: 'Luke' },
        { id: 150, title: "Plato founds the Academy", year: -387, entityIds: ['greek-philosophy', 'ancient-greece'], region: "europe-middle-east", description: "Plato establishes school in Athens", tags: ['science', 'art'], createdBy: 'Luke' },
        { id: 180, title: "Marcus Aurelius writes Meditations", year: 170, endYear: 180, entityIds: ['stoicism', 'roman-empire'], region: "europe-middle-east", description: "Marcus Aurelius composes personal philosophical writings", tags: ['religion', 'art', 'politics'], createdBy: 'Luke' },

        // === SCIENCE & PHILOSOPHY EVENTS ===
        { id: 10, title: "Iliad & Odyssey composed", year: -750, entityIds: ['ancient-greece', 'classical-antiquity'], region: "europe-middle-east", description: "Homer's epic poems first recorded", tags: ['art'], createdBy: 'Luke' },
        { id: 19, title: "Copernicus publishes heliocentric model", year: 1543, entityIds: ['scientific-revolution', 'renaissance'], region: "europe-middle-east", description: "Published theory that Earth revolves around the Sun", tags: ['science'], createdBy: 'Luke' },
        { id: 21, title: "Kepler publishes laws of planetary motion", year: 1609, entityIds: ['scientific-revolution'], region: "europe-middle-east", description: "Discovered that planets move in ellipses", tags: ['science'], createdBy: 'Luke' },
        { id: 22, title: "Galileo condemned by Inquisition", year: 1633, entityIds: ['scientific-revolution', 'christianity'], region: "europe-middle-east", description: "Forced to recant support for heliocentrism", tags: ['science', 'religion', 'politics'], createdBy: 'Luke' },
        { id: 23, title: "Royal Society founded", year: 1660, entityIds: ['scientific-revolution', 'england'], region: "europe-middle-east", description: "World's oldest national scientific institution established", tags: ['science', 'politics'], createdBy: 'Luke' },
        { id: 24, title: "Newton publishes Principia", year: 1687, entityIds: ['scientific-revolution', 'england'], region: "europe-middle-east", description: "Laws of motion and universal gravitation published", tags: ['science'], createdBy: 'Luke' },
        { id: 90, title: "Darwin publishes Origin of Species", year: 1859, entityIds: ['england'], region: "europe-middle-east", description: "Theory of evolution by natural selection published", tags: ['science'], createdBy: 'Luke' },

        // === RELIGIOUS/CULTURAL EVENTS ===
        { id: 111, title: "Buddhism spreads to China", year: 100, entityIds: ['buddhism'], region: "asia", description: "Buddhism begins to spread along the Silk Road into China", tags: ['religion', 'exploration', 'trade'], createdBy: 'Luke' },
        { id: 112, title: "Council of Nicaea", year: 325, entityIds: ['christianity', 'roman-empire'], region: "europe-middle-east", description: "First ecumenical council of the Christian Church", tags: ['religion', 'politics'], createdBy: 'Luke' },
        { id: 113, title: "Islam spreads to Southeast Asia", year: 700, entityIds: ['islam'], region: "asia", description: "Islamic traders and missionaries spread religion across Asia", tags: ['religion', 'exploration', 'trade'], createdBy: 'Luke' },

        // === POLITICAL EVENTS ===
        { id: 72, title: "English Civil War begins", year: 1642, entityIds: ['england'], region: "europe-middle-east", description: "War between Parliamentarians and Royalists begins", tags: ['war', 'politics'], createdBy: 'Luke' },
        { id: 73, title: "English Civil War ends", year: 1651, entityIds: ['england'], region: "europe-middle-east", description: "Parliamentary victory, Charles I executed", tags: ['war', 'politics'], createdBy: 'Luke' },
        { id: 74, title: "Great Plague of London", year: 1665, entityIds: ['england'], region: "europe-middle-east", description: "Major bubonic plague epidemic killing ~100,000 people. Part of the Second Plague Pandemic's recurring waves across Europe (1353-1720s). Plague returned every 10-20 years for nearly four centuries after the Black Death.", tags: ['disaster'], createdBy: 'Luke' },
        { id: 75, title: "Great Fire of London", year: 1666, entityIds: ['england'], region: "europe-middle-east", description: "Devastating fire destroys much of central London", tags: ['disaster'], createdBy: 'Luke' },
        { id: 82, title: "Glorious Revolution", year: 1688, entityIds: ['england'], region: "europe-middle-east", description: "Overthrow of James II, constitutional monarchy established", tags: ['politics'], createdBy: 'Luke' },
        { id: 83, title: "French Revolution begins", year: 1789, entityIds: ['france', 'enlightenment'], region: "europe-middle-east", description: "Revolutionary period transforms France and Europe", tags: ['politics', 'war'], createdBy: 'Luke' },
        { id: 84, title: "Napoleonic Wars", year: 1803, endYear: 1815, entityIds: ['france'], region: "europe-middle-east", description: "Major conflicts involving Napoleon's French Empire", tags: ['war', 'politics'], createdBy: 'Luke' },
        { id: 91, title: "Seven Years' War", year: 1756, endYear: 1763, entityIds: ['england', 'france'], region: "europe-middle-east", description: "Global conflict involving most European powers", tags: ['war', 'politics'], createdBy: 'Luke' },

        // === AFRICAN EVENTS ===
        { id: 92, title: "Foundation of Lamu", year: 1370, entityIds: [], region: "subsaharan-africa", description: "Founding of Lamu, major Swahili trading port on the Kenyan coast", tags: ['trade', 'exploration'], createdBy: 'Luke' },

        // === MORE EUROPEAN EVENTS ===
        { id: 93, title: "Thirty Years' War", year: 1618, endYear: 1648, entityIds: [], region: "europe-middle-east", description: "Devastating religious and political conflict across Central Europe", tags: ['war', 'religion'], createdBy: 'Luke' },
        { id: 94, title: "Treaty of Westphalia", year: 1648, entityIds: [], region: "europe-middle-east", description: "Peace treaties ending Thirty Years' War, established modern state sovereignty", tags: ['politics'], createdBy: 'Luke' },

        // === USER-ADDED EVENTS ===
        { id: 209, title: "The Last Supper (da Vinci)", year: 1498, entityIds: ['renaissance'], region: "europe-middle-east", description: "", tags: ['art'], createdBy: 'Luke' },
        { id: 210, title: "Black Death", year: 1346, endYear: 1353, entityIds: [], region: "europe-middle-east", description: "Initial wave of the Second Plague Pandemic. Arrived in Europe via Genoese ships from Crimea, killing 30-60% of Europe's population (75-200 million). Labor shortages empowered peasants and helped end feudalism. Also devastated the Middle East and Central Asia.", tags: ['disaster'], createdBy: 'Luke' },
        { id: 212, title: "Sahara Desertification", year: -8000, endYear: -4500, entityIds: [], region: "subsaharan-africa", description: "", tags: ['disaster'], createdBy: 'Luke' },
        { id: 213, title: "Turks become Muslim", year: 800, endYear: 1000, category: "event", entityIds: ['islam'], region: "asia", description: "Turkish slave-soldiers (mamluks/ghulams) enter Islamic armies. Muslim merchants travel in central Asia. Over time, the Turks become Muslim.", tags: ['religion', 'politics'], createdBy: 'Luke' },

        // === PANDEMICS ===
        { id: 252, title: "Neolithic Plague", year: -3000, endYear: -2000, entityIds: ['neolithic'], region: "europe-middle-east", description: "Early Yersinia pestis found in skeletal remains across Eurasia. Coincides with dramatic population collapse in Western Europe and westward expansion of steppe peoples (Yamnaya). These pre-flea-adapted strains spread pneumonically or by direct contact. Known only from ancient DNA.", tags: ['disaster'], createdBy: 'Luke' },
        { id: 253, title: "Antonine Plague", year: 165, endYear: 180, entityIds: ['roman-empire'], region: "europe-middle-east", description: "Almost certainly smallpox. Brought back by soldiers returning from Mesopotamia. Killed 5-10 million people, including Emperor Lucius Verus. Struck at the height of Roman power and is cited as one factor in the empire's long decline.", tags: ['disaster'], createdBy: 'Luke' },
        { id: 254, title: "Late Han Dynasty Epidemics", year: 150, endYear: 220, entityIds: [], region: "asia", description: "Devastating epidemics struck during the late Eastern Han Dynasty, killing millions. The physician Zhang Zhongjing (张仲景) lost two-thirds of his clan and wrote the Treatise on Cold Damage (伤寒杂病论), a foundational text of Chinese medicine. Combined with famine and political crisis, the epidemics helped trigger the fall of the Han and the Three Kingdoms period.", tags: ['disaster'], createdBy: 'Luke' },
        { id: 255, title: "Japanese Smallpox Epidemic", year: 735, endYear: 737, entityIds: ['tang'], region: "asia", description: "Smallpox brought back from Korea by a diplomatic mission killed roughly one-third of Japan's population (~1 million). All four Fujiwara brothers who dominated the imperial court died, causing a major political power shift. Known in Japanese as 天平の疫病大流行.", tags: ['disaster'], createdBy: 'Luke' },
        { id: 256, title: "Columbian Exchange Diseases", year: 1492, endYear: 1600, entityIds: ['aztec-empire', 'inca-empire'], region: "americas", description: "Smallpox, measles, influenza, typhus, and other Old World diseases devastated Indigenous peoples with no prior exposure. Population declined by 50-90% across the Americas — possibly 40-55 million deaths. Smallpox killed Aztec Emperor Cuitláhuac and Inca Emperor Huayna Capac. The labor collapse drove the Atlantic slave trade.", tags: ['disaster'], createdBy: 'Luke' },
        { id: 257, title: "Late Ming Plague (明末大瘟疫)", year: 1633, endYear: 1644, entityIds: ['ming', 'qing'], region: "asia", description: "Devastating epidemics swept northern China during the final Ming years, compounded by drought and famine. Beijing may have lost 20-40% of its population. Gutted Ming military garrisons, directly enabling Li Zicheng's rebellion and the Manchu conquest that established the Qing Dynasty. Some historians argue the epidemics were more decisive than military campaigns in ending the Ming.", tags: ['disaster'], createdBy: 'Luke' },
        { id: 258, title: "First Cholera Pandemic", year: 1817, endYear: 1824, entityIds: [], region: "asia", description: "Cholera spread from its endemic home in the Ganges Delta across South and Southeast Asia, reaching the Middle East and East Africa. The first of seven cholera pandemics. Killed hundreds of thousands and demonstrated that steamship-era trade could spread disease across oceans at unprecedented speed.", tags: ['disaster'], createdBy: 'Luke' },
        { id: 259, title: "Third Cholera Pandemic", year: 1846, endYear: 1860, entityIds: [], region: "asia", description: "The deadliest cholera pandemic, killing over 1 million. During this outbreak, John Snow traced a London epidemic to the Broad Street water pump in 1854, founding modern epidemiology before germ theory existed. Cholera drove massive public health investment in sewage systems and clean water across European and American cities.", tags: ['disaster'], createdBy: 'Luke' },
        { id: 260, title: "Seventh Cholera Pandemic", year: 1961, endYear: 2026, entityIds: [], region: "subsaharan-africa", description: "Began in Indonesia, caused by the El Tor biotype of Vibrio cholerae. Still technically ongoing — cholera remains a major killer in areas without clean water infrastructure, particularly in sub-Saharan Africa and South Asia. Modern oral rehydration therapy has dramatically reduced mortality but the disease persists wherever sanitation fails.", tags: ['disaster'], createdBy: 'Luke' },
        { id: 261, title: "Russian Flu", year: 1889, endYear: 1890, entityIds: [], region: "europe-middle-east", description: "Killed ~1 million people. One of the first pandemics to spread via global railroad and steamship networks. Recent molecular clock analysis suggests it may have been caused by coronavirus OC43 jumping from cattle to humans — potentially the first known coronavirus pandemic rather than influenza.", tags: ['disaster'], createdBy: 'Luke' },
        { id: 262, title: "Spanish Flu", year: 1918, endYear: 1920, entityIds: [], region: "europe-middle-east", description: "Influenza (H1N1). Infected ~500 million people (~1/3 of world population), killing 50-100 million. Disproportionately killed young healthy adults via cytokine storm. Name is a misnomer — Spain reported freely as a WWI neutral while combatant nations censored press. True origin debated. The deadliest pandemic of the 20th century.", tags: ['disaster'], createdBy: 'Luke' },
        { id: 263, title: "Asian Flu", year: 1957, endYear: 1958, entityIds: [], region: "asia", description: "Influenza (H2N2) originating in Guizhou, China. An avian-human reassortant virus that killed 1-2 million worldwide. Identified quickly by international surveillance networks that didn't exist in 1918. A vaccine was developed but couldn't be produced fast enough.", tags: ['disaster'], createdBy: 'Luke' },
        { id: 264, title: "Hong Kong Flu", year: 1968, endYear: 1969, entityIds: [], region: "asia", description: "Influenza (H3N2) that killed 1-4 million. Lower mortality partly because populations retained cross-immunity from the Asian Flu. The H3N2 strain continues circulating today as seasonal influenza and still causes significant annual mortality.", tags: ['disaster'], createdBy: 'Luke' },
        { id: 265, title: "HIV/AIDS Pandemic", year: 1981, endYear: 2026, entityIds: [], region: "subsaharan-africa", description: "HIV crossed from chimpanzees to humans in Central Africa, probably in the 1920s. ~40 million dead to date, ~39 million currently living with HIV. Devastated sub-Saharan Africa — some countries saw life expectancy drop 20+ years. Antiretroviral therapy (mid-1990s) transformed it from a death sentence to a manageable chronic condition.", tags: ['disaster'], createdBy: 'Luke' },
        { id: 266, title: "COVID-19 Pandemic", year: 2019, endYear: 2023, entityIds: [], region: "asia", description: "SARS-CoV-2 coronavirus originating in Wuhan, China. 7 million official deaths; 15-25 million estimated by excess mortality. Led to unprecedented global lockdowns, fastest vaccine development in history (mRNA vaccines in ~11 months), and $12+ trillion in global economic losses. The most significant pandemic since 1918.", tags: ['disaster'], createdBy: 'Luke' },

        // === NORTH AMERICA: URBANIZATION, CAHOKIA & EARLY COLONIAL (from "Native Nations" by Kathleen DuVal) ===
        { id: 267, title: "First Cities of the Old World Cores", year: -3500, endYear: -1900, entityIds: [], region: "europe-middle-east", description: "The earliest cities arose in the great river valleys: Uruk and Sumer in Mesopotamia (c. 3500 BCE), Egypt (c. 3100 BCE), the Indus Valley/South Asia (c. 2600 BCE), and the Yellow River in China (Erlitou, c. 1900 BCE). This was the first of several waves of urbanization that spread across the world over the following millennia.", tags: ['trade', 'politics'], createdBy: 'Luke' },
        { id: 268, title: "Urbanization Spreads: Mediterranean, SE Asia & the Americas", year: -800, entityIds: [], region: "americas", description: "A second wave of city-building, roughly 1000-500 BCE: the Mediterranean (Greek and Phoenician city-states), Southeast Asia, Central Mexico (the Olmec and early Oaxaca/Monte Albán), and the Andes of South America (Chavín). Cities now appeared well beyond the original Old World river-valley cores.", tags: ['trade'], createdBy: 'Luke' },
        { id: 269, title: "Urbanization Reaches W. Europe, Mongolia, N. America & the Sahel", year: 800, entityIds: [], region: "americas", description: "A third wave, around 700-900 CE: cities and towns took hold in Western Europe, the Mongolian steppe, North America north of Mexico (the Mississippian world), and the Sahel of West Africa (Jenné-jeno, early Ghana). North America's urban era was just beginning as Cahokia rose.", tags: ['trade'], createdBy: 'Luke' },
        { id: 270, title: "Supernova of 1006 (SN 1006)", year: 1006, entityIds: [], region: "americas", description: "The brightest stellar event in recorded history. Visible worldwide for months — bright enough to read by at night — and recorded by Chinese, Arab, Japanese, and European observers. Part of the burst of celestial events seen across the globe in the early 11th century.", tags: ['science'], createdBy: 'Luke' },
        { id: 271, title: "Supernova of 1054 (Crab Nebula)", year: 1054, entityIds: ['cahokia'], region: "americas", description: "A supernova bright enough to be visible in daylight for weeks, leaving behind the Crab Nebula. Recorded by Chinese and Arab astronomers and likely seen across North America. Cahokia's monumental construction accelerated in the decades that followed.", tags: ['science'], createdBy: 'Luke' },
        { id: 272, title: "Cahokia's Monumental Construction Peaks", year: 1050, endYear: 1200, entityIds: ['cahokia'], region: "americas", description: "Cahokia underwent a 'big bang' of growth around 1050, becoming the largest city north of Mexico. Monks Mound — the largest earthwork in the Americas — and dozens of other pyramids and plazas were built, supporting a population of 10,000-20,000.", tags: ['art'], createdBy: 'Luke' },
        { id: 273, title: "Mississippian & Hohokam Cities Abandoned", year: 1380, entityIds: ['cahokia', 'moundville', 'hohokam'], region: "americas", description: "Over the 1300s and 1400s, Native Americans abandoned major urban centers including Cahokia, Moundville, and the Hohokam towns of Arizona. Causes likely included climate stress from the Little Ice Age, drought, resource depletion, and political fragmentation. Populations dispersed into smaller communities.", tags: ['disaster'], createdBy: 'Luke' },
        { id: 274, title: "Little Ice Age in North America", year: 1300, endYear: 1850, entityIds: [], region: "americas", description: "A period of global cooling (felt worldwide) that brought colder winters, shorter growing seasons, and prolonged droughts to North America. It coincided with the abandonment of Mississippian and Hohokam cities and reshaped Indigenous agriculture and settlement.", tags: ['disaster'], createdBy: 'Luke' },
        { id: 275, title: "London Denser in 1580 Than Modern New York City", year: 1580, entityIds: ['england'], region: "europe-middle-east", description: "By 1580, the urban density of London was higher than that of present-day New York City — a reminder of how crowded pre-industrial cities were, packed within tight walls before mass transit let cities spread out.", tags: ['trade'], createdBy: 'Luke' },
        { id: 276, title: "Mohawks Acquire Firearms from Dutch Traders", year: 1609, endYear: 1610, entityIds: ['iroquois-confederacy'], region: "americas", description: "The Mohawks, easternmost nation of the Haudenosaunee, began obtaining firearms from Dutch traders around 1609-1610. Though early guns were costly and imperfect, they reshaped the balance of power among Native nations. Indigenous peoples learned to make ammunition and do minor repairs, but still depended on Europeans for new weapons, gunpowder, and major repairs.", tags: ['war', 'trade'], createdBy: 'Luke' },
        { id: 277, title: "Dutch-Mohawk Fur Trade at Fort Orange (New Netherland)", year: 1614, endYear: 1664, entityIds: ['iroquois-confederacy'], region: "americas", description: "At Fort Orange (present-day Albany), Dutch prosperity depended on Mohawk friendship more than the reverse. The Mohawks controlled access to interior fur networks, set prices, and played Dutch and English traders against each other. Early colonialism here was a negotiated partnership, not European domination — the Dutch were closer to price-takers than price-makers.", tags: ['trade'], createdBy: 'Luke' },
        { id: 278, title: "Mohawk-Mahican War", year: 1624, endYear: 1628, entityIds: ['iroquois-confederacy'], region: "americas", description: "The Mohawks and Mahicans fought for control of regional trade routes and access to Dutch traders at Fort Orange. The Mohawks won, securing their position as the key Native power-brokers of New Netherland. Europeans became participants in existing Indigenous rivalries rather than their creators.", tags: ['war'], createdBy: 'Luke' },
        { id: 279, title: "French and Indian War (Seven Years' War in North America)", year: 1754, endYear: 1763, entityIds: ['iroquois-confederacy'], region: "americas", description: "The North American theater of a global war between Britain and France, triggered by competition for the Ohio Valley (and a 1754 skirmish involving a young George Washington). Many Native nations favored France, whose small settler population seemed less threatening than Britain's land-hungry colonists. Britain's victory and the Treaty of Paris (1763) removed France from eastern North America, stripping Native nations of the leverage of playing rivals against each other — a turning point from negotiated colonialism toward settler domination.", tags: ['war', 'politics'], createdBy: 'Luke' },
    ],

    // ===========================================
    // REFERENCES - What you read/watch/listen to
    // Links to societal entities they cover
    // ===========================================
    references: [
        { id: 1, title: "A History of Western Philosophy", type: "book", author: "Bertrand Russell", entityIds: ['greek-philosophy', 'stoicism', 'christianity', 'enlightenment'], year: 1945, status: "completed", description: "Comprehensive survey of Western philosophy from pre-Socratics to early 20th century", createdBy: 'Luke' },
        { id: 2, title: "Meditations", type: "book", author: "Marcus Aurelius", entityIds: ['stoicism', 'roman-empire'], year: 180, status: "completed", description: "Personal writings on Stoic philosophy", createdBy: 'Luke' },
        { id: 3, title: "Confessions", type: "book", author: "St. Augustine", entityIds: ['christianity', 'roman-empire'], year: 400, status: "completed", description: "Augustine's autobiographical and theological work", createdBy: 'Luke' },
        { id: 4, title: "The Royal Society (study)", type: "book", entityIds: ['scientific-revolution', 'england'], year: 1660, status: "completed", description: "Study of the founding and history of the Royal Society of London", createdBy: 'Luke' },
        { id: 5, title: "Medieval Technology and Social Change", type: "book", author: "Lynn Townsend White Jr.", entityIds: ['early-middle-ages', 'high-middle-ages'], year: 1962, status: "completed", description: "How stirrup, plow, and other inventions transformed medieval society", createdBy: 'Luke' },
        { id: 6, title: "Two Paths to Prosperity", type: "book", author: "Avner Greif", entityIds: ['song', 'enlightenment'], year: 2025, status: "completed", description: "Comparative institutional analysis of Europe and China, 1000-2000", createdBy: 'Luke' },
        { id: 7, title: "The Iliad", type: "book", author: "Homer", entityIds: ['ancient-greece', 'classical-antiquity'], year: -800, status: "completed", description: "Ancient Greek epic poem of the Trojan War", createdBy: 'Luke' },
        { id: 8, title: "The Odyssey", type: "book", author: "Homer", entityIds: ['ancient-greece', 'classical-antiquity'], year: -800, status: "completed", description: "Ancient Greek epic of Odysseus's journey home from Troy", createdBy: 'Luke' },
        { id: 9, title: "Civilization: The West and the Rest", type: "book", author: "Niall Ferguson", entityIds: ['enlightenment', 'scientific-revolution'], year: 2011, status: "completed", description: "How Western civilization came to dominate the world", createdBy: 'Luke' },
        { id: 10, title: "The Knowledge Machine", type: "book", author: "Michael Strevens", entityIds: ['scientific-revolution'], year: 2020, status: "completed", description: "How the iron rule of explanation created modern science", createdBy: 'Luke' },
        { id: 11, title: "Genghis Khan and the Making of the Modern World", type: "book", author: "Jack Weatherford", entityIds: ['mongol'], year: 2004, status: "completed", description: "Revisionist history of the Mongol Empire's global impact", createdBy: 'Luke' },
        { id: 12, title: "Cro-Magnon", type: "book", author: "Brian M. Fagan", entityIds: ['paleolithic', 'early-humans'], year: 2010, status: "completed", description: "How the Ice Age gave birth to the first modern humans", createdBy: 'Luke' },
        { id: 13, title: "Unfabling the East", type: "book", author: "Jürgen Osterhammel", entityIds: ['enlightenment'], year: 1998, status: "completed", description: "The Enlightenment's encounter with Asia", createdBy: 'Luke' },
        { id: 14, title: "Economic And Social History of Medieval Europe", type: "book", author: "Henri Pirenne", entityIds: ['early-middle-ages', 'high-middle-ages'], year: 1933, status: "completed", description: "Classic economic history of medieval Europe", createdBy: 'Luke' },
        { id: 15, title: "Napoleon: A Concise Biography", type: "book", author: "David A. Bell", entityIds: ['france'], year: 2015, status: "completed", description: "Concise overview of Napoleon's life and legacy", createdBy: 'Luke' },
        { id: 16, title: "The Rise and Fall of the EAST", type: "book", author: "Yasheng Huang", entityIds: ['song', 'qing', 'prc', 'confucianism'], year: 2023, status: "completed", description: "How exams, autocracy, stability, and technology shaped China", createdBy: 'Luke' },
        { id: 17, title: "War and Peace", type: "book", author: "Leo Tolstoy", entityIds: ['france'], year: 1869, status: "completed", description: "Epic novel of Russian society during the Napoleonic Wars", createdBy: 'Luke' },
        { id: 18, title: "Mao: The Unknown Story", type: "book", author: "Jung Chang", entityIds: ['prc'], year: 2002, status: "completed", description: "Controversial biography of Mao Zedong", createdBy: 'Luke' },
        { id: 19, title: "The Cold War: A World History", type: "book", author: "Odd Arne Westad", entityIds: ['prc'], year: 2017, status: "completed", description: "Comprehensive global history of the Cold War", createdBy: 'Luke' },
        { id: 20, title: "The Cultural Revolution", type: "book", author: "Frank Dikötter", entityIds: ['prc'], year: 2016, status: "completed", description: "People's history of China's Cultural Revolution, 1962-1976", createdBy: 'Luke' },
        { id: 21, title: "Mao's Great Famine", type: "book", author: "Frank Dikötter", entityIds: ['prc'], year: 2010, status: "completed", description: "History of China's most devastating catastrophe, 1958-62", createdBy: 'Luke' },
        { id: 22, title: "Factory Girls", type: "book", author: "Leslie T. Chang", entityIds: ['prc'], year: 2008, status: "completed", description: "Lives of migrant factory workers in Dongguan, China", createdBy: 'Luke' },
        { id: 23, title: "The Silk Road: A New History", type: "book", author: "Valerie Hansen", entityIds: ['tang', 'buddhism'], year: 2012, status: "completed", description: "Life and trade along the ancient Silk Road", createdBy: 'Luke' },
        { id: 24, title: "Osman's Dream", type: "book", author: "Caroline Finkel", entityIds: ['ottoman'], year: 2005, status: "completed", description: "Comprehensive history of the Ottoman Empire", createdBy: 'Luke' },
        { id: 25, title: "The Ottoman Age of Exploration", type: "book", author: "Giancarlo Casale", entityIds: ['ottoman'], year: 2010, status: "completed", description: "Ottoman maritime empire and competition with Portugal", createdBy: 'Luke' },
        { id: 26, title: "Aristotle's Children", type: "book", author: "Richard E. Rubenstein", entityIds: ['islam', 'christianity', 'greek-philosophy', 'high-middle-ages'], year: 2003, status: "completed", description: "How Christians, Muslims, and Jews rediscovered ancient wisdom", createdBy: 'Luke' },
        { id: 27, title: "No God but God", type: "book", author: "Reza Aslan", entityIds: ['islam'], year: 2005, status: "completed", description: "Origins, evolution and future of Islam", createdBy: 'Luke' },
        { id: 28, title: "The House of Wisdom", type: "book", author: "Jim Al-Khalili", entityIds: ['abbasid', 'islam', 'ancient-greece'], year: 2010, status: "completed", description: "How Arabic science saved ancient knowledge and fueled the Renaissance", createdBy: 'Luke' },
        { id: 29, title: "The Alchemy of Happiness", type: "book", author: "Abu Hamid al-Ghazali", entityIds: ['islam', 'abbasid'], year: 1105, status: "completed", description: "Classic Sufi text on the soul's relationship with God", createdBy: 'Luke' },
        { id: 30, title: "Seeing Like a State", type: "book", author: "James C. Scott", entityIds: ['enlightenment'], year: 1998, status: "completed", description: "How state simplification schemes have failed", createdBy: 'Luke' },
        { id: 31, title: "Against the Grain", type: "book", author: "James C. Scott", entityIds: ['sumer', 'neolithic'], year: 2017, status: "completed", description: "Deep history of the earliest states", createdBy: 'Luke' },
        { id: 32, title: "Conquerors", type: "book", author: "Roger Crowley", entityIds: ['kongo'], year: 2015, status: "completed", description: "How Portugal forged the first global empire", createdBy: 'Luke' },
        { id: 33, title: "Merchant Kings", type: "book", author: "Stephen R. Bown", entityIds: ['england', 'france'], year: 2009, status: "completed", description: "When trading companies ruled the world, 1600-1900", createdBy: 'Luke' },
        { id: 34, title: "Owning the Earth", type: "book", author: "Andro Linklater", entityIds: ['enlightenment'], year: 2013, status: "completed", description: "Transforming history of land ownership", createdBy: 'Luke' },
        { id: 35, title: "Empire of Cotton", type: "book", author: "Sven Beckert", entityIds: ['england'], year: 2014, status: "completed", description: "Global history of cotton and capitalism", createdBy: 'Luke' },
        { id: 36, title: "A History of the Bible", type: "book", author: "John Barton", entityIds: ['christianity'], year: 2019, status: "completed", description: "Story of the world's most influential book", createdBy: 'Luke' },
        { id: 37, title: "Mengzi", type: "book", author: "Mencius", entityIds: ['confucianism'], year: -300, status: "completed", description: "Classic Confucian text with traditional commentaries", createdBy: 'Luke' },
        { id: 38, title: "The Prince", type: "book", author: "Niccolò Machiavelli", entityIds: ['renaissance'], year: 1532, status: "completed", description: "Foundational work of modern political philosophy", createdBy: 'Luke' },
        { id: 39, title: "On Liberty", type: "book", author: "John Stuart Mill", entityIds: ['enlightenment'], year: 1859, status: "completed", description: "Classic defense of individual freedom and free speech", createdBy: 'Luke' },
        { id: 40, title: "Voices from the Chinese Century", type: "book", author: "Timothy Cheek", entityIds: ['prc'], year: 2019, status: "completed", description: "Public intellectual debate from contemporary China", createdBy: 'Luke' },
        { id: 41, title: "Age of Ambition", type: "book", author: "Evan Osnos", entityIds: ['prc'], year: 2014, status: "completed", description: "Chasing fortune, truth, and faith in the new China", createdBy: 'Luke' },
        { id: 42, title: "The China Dream", type: "book", author: "Joe Studwell", entityIds: ['prc'], year: 2001, status: "completed", description: "The elusive quest for China's greatest untapped market", createdBy: 'Luke' },
        { id: 43, title: "The Great Transformation", type: "book", author: "Odd Arne Westad", entityIds: ['prc'], year: 2024, status: "completed", description: "China's road from revolution to reform", createdBy: 'Luke' },
        { id: 44, title: "Chip War", type: "book", author: "Chris Miller", entityIds: ['prc'], year: 2022, status: "completed", description: "The fight for the world's most critical technology", createdBy: 'Luke' },
        { id: 45, title: "The Subjection of Women", type: "book", author: "John Stuart Mill", entityIds: ['enlightenment'], year: 1869, status: "completed", description: "Argument for gender equality", createdBy: 'Luke' },
        { id: 46, title: "Apology", type: "book", author: "Plato", entityIds: ['greek-philosophy'], year: -399, status: "completed", description: "Socrates's defense speech at his trial", createdBy: 'Luke' },
        { id: 47, title: "To Live", type: "book", author: "Yu Hua", entityIds: ['prc'], year: 1992, status: "completed", description: "Novel spanning decades of modern Chinese history", createdBy: 'Luke' },
        { id: 48, title: "The Selected Poems of Li Po", type: "book", author: "Li Po", entityIds: ['tang'], year: 762, status: "completed", description: "Poetry from China's Tang Dynasty golden age", createdBy: 'Jia' },
        { id: 49, title: "The Horse, the Wheel, and Language", type: "book", author: "David W. Anthony", entityIds: ['bronze-age'], year: 2007, status: "completed", description: "How Bronze-Age riders from the Eurasian steppes shaped the modern world", createdBy: 'Luke' },
        { id: 50, title: "Silence", type: "book", author: "Shūsaku Endō", entityIds: ['christianity'], year: 1966, status: "completed", description: "Novel of Jesuit missionaries in 17th-century Japan", createdBy: 'Luke' },
        { id: 51, title: "The Way of Zen", type: "book", author: "Alan W. Watts", entityIds: ['buddhism'], year: 1957, status: "completed", description: "Introduction to Zen Buddhism's history and practice", createdBy: 'Luke' },
        { id: 52, title: "Utopia", type: "book", author: "Thomas More", entityIds: ['renaissance', 'england'], year: 1516, status: "completed", description: "Foundational work imagining an ideal society", createdBy: 'Luke' },
        { id: 53, title: "Laozi's Dao De Jing", type: "book", author: "Lao Tzu", entityIds: ['confucianism'], year: -350, status: "completed", description: "Classic Daoist text on the Way and its power", createdBy: 'Luke' },
        { id: 54, title: "The Worldly Philosophers", type: "book", author: "Robert L. Heilbroner", entityIds: ['enlightenment'], year: 1953, status: "completed", description: "Lives, times, and ideas of great economic thinkers", createdBy: 'Luke' },
        { id: 55, title: "Language Families of the World", type: "book", author: "John McWhorter", entityIds: ['early-humans'], year: 2019, status: "completed", description: "Comparing and contrasting all the world's language families", createdBy: 'Luke' },
        { id: 56, title: "Ancient Writing and the History of the Alphabet", type: "book", author: "John McWhorter", entityIds: ['sumer'], year: 2023, status: "completed", description: "History of writing systems from cuneiform to modern alphabets", createdBy: 'Luke' },
        { id: 57, title: "How Asia Works", type: "book", author: "Joe Studwell", entityIds: ['prc', 'song'], year: 2013, status: "completed", description: "Success and failure in the world's most dynamic region", createdBy: 'Luke' },
        { id: 58, title: "The Ottoman Empire (Great Courses)", type: "book", author: "Kenneth W. Harl", entityIds: ['ottoman'], year: 2017, status: "completed", description: "General history of the Ottoman Empire", createdBy: 'Luke' },
        { id: 59, title: "Turkey: What Everyone Needs to Know", type: "book", author: "Andrew Finkel", entityIds: ['ottoman'], year: 2012, status: "completed", description: "Concise overview of Turkish politics and history", createdBy: 'Luke' },
        { id: 60, title: "The Silk Roads: A New History of the World", type: "book", author: "Peter Frankopan", entityIds: ['tang', 'mongol', 'ottoman'], year: 2015, status: "completed", description: "World history centered on the Silk Roads", createdBy: 'Luke' },
        { id: 61, title: "Half a Lifelong Romance", type: "book", author: "Eileen Chang", entityIds: ['roc'], year: 1948, status: "completed", description: "Novel of love and loss in 1930s-40s China", createdBy: 'Luke' },
        { id: 62, title: "Love in a Fallen City", type: "book", author: "Eileen Chang", entityIds: ['roc'], year: 1943, status: "completed", description: "Short stories of Shanghai and Hong Kong in the 1940s", createdBy: 'Luke' },
        { id: 63, title: "The Arc of a Covenant", type: "book", author: "Walter Russell Mead", entityIds: ['christianity'], year: 2022, status: "completed", description: "The United States, Israel, and the fate of the Jewish people", createdBy: 'Luke' },
        { id: 64, title: "The Bourgeois Catholicism vs Capitalism in 18th Century France", type: "book", author: "Bernard Groethuysen", entityIds: ['christianity', 'france', 'enlightenment'], year: 1927, status: "completed", description: "Religion and capitalism in 18th century France", createdBy: 'Luke' },
        { id: 65, eventId: 212, title: "What Really Turned the Sahara Desert From a Green Oasis Into a Wasteland", type: "other", url: "https://www.smithsonianmag.com/science-nature/what-really-turned-sahara-desert-green-oasis-wasteland-180962668/", status: "to-read", description: "", createdBy: 'Luke' },
        { id: 66, eventId: 'entity-mughal-empire', title: "Wikipedia: Mughal Empire", type: "other", url: "https://en.wikipedia.org/wiki/Mughal_Empire", status: "in-progress", description: "", createdBy: 'Luke' },
        { id: 67, eventId: 'entity-oghuz-turks', title: "Wikipedia: Oghuz Yabgu State", type: "other", url: "https://en.wikipedia.org/wiki/Oghuz_Yabgu_State", status: "in-progress", description: "", createdBy: 'Luke' },
        { id: 68, eventId: 'entity-seljuk-empire', title: "Wikipedia: Seljuk Empire", type: "other", url: "https://en.wikipedia.org/wiki/Seljuk_Empire", status: "in-progress", description: "", createdBy: 'Luke' },
        { id: 69, eventId: 'entity-seljuk-empire', title: "History of the Muslim World", type: "book", url: "https://www.goodreads.com/book/show/150276510-a-history-of-the-muslim-world", status: "in-progress", description: "", createdBy: 'Luke' },
        { id: 70, title: "Native Nations: A Millennium in North America", type: "book", author: "Kathleen DuVal", entityIds: ['maya-civilization', 'cahokia', 'moundville', 'hohokam', 'iroquois-confederacy'], year: 2024, status: "in-progress", description: "A sweeping history of Native nations across a thousand years of North American history — from the great Mississippian cities like Cahokia through the era of negotiated colonialism with the Dutch, French, and English.", createdBy: 'Luke' },
    ],

    // ===========================================
    // INSIGHTS - Your synthesis and takeaways
    // Notes that link to societal entities
    // ===========================================
    insights: [],

    // User notes storage (eventId -> notes) - legacy support
    notes: {},

    // Row assignments for custom layout
    rowAssignments: {},

    // User takeaways
    takeaways: [],

    // Quiz history
    quizHistory: []
};

// Helper: Get entity by ID
function getEntityById(id) {
    return timelineData.entities.find(e => e.id === id);
}

// Helper: Get all entities for an event
function getEntitiesForEvent(event) {
    if (!event.entityIds) return [];
    return event.entityIds.map(id => getEntityById(id)).filter(Boolean);
}

// Helper: Get all events for an entity
function getEventsForEntity(entityId) {
    return timelineData.events.filter(e => e.entityIds && e.entityIds.includes(entityId));
}

// Helper: Get all references for an entity
function getReferencesForEntity(entityId) {
    return timelineData.references.filter(r => r.entityIds && r.entityIds.includes(entityId));
}

// Get next available ID for events
function getNextEventId() {
    const numericIds = timelineData.events.map(e => e.id).filter(id => typeof id === 'number' && !isNaN(id));
    return numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
}

// Get next available ID for references
function getNextReferenceId() {
    return Math.max(...timelineData.references.map(r => r.id)) + 1;
}

// Get next available ID for insights
function getNextInsightId() {
    if (timelineData.insights.length === 0) return 1;
    return Math.max(...timelineData.insights.map(i => i.id)) + 1;
}

// Multi-user display name
function getUsername() {
    return localStorage.getItem('sps-username') || null;
}

function setUsername(name) {
    localStorage.setItem('sps-username', name);
}

function promptForUsername() {
    let name = getUsername();
    if (!name) {
        name = prompt('Welcome to World History Timeline! Enter your display name:');
        if (name && name.trim()) {
            setUsername(name.trim());
        } else {
            setUsername('Anonymous');
        }
    }
    return getUsername();
}

// Check if running on server (vs file://)
const isServerMode = window.location.protocol !== 'file:';

// Debounce helper for auto-save
let saveTimeout = null;
function debouncedSave() {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => saveData(), 500);
}

// Save data - to server if available, otherwise localStorage
async function saveData() {
    const userData = {
        events: timelineData.events.filter(e => e.userAdded),
        entities: timelineData.entities.filter(e => e.userAdded),
        references: timelineData.references.filter(r => r.userAdded),
        insights: timelineData.insights.filter(i => i.userAdded),
        notes: timelineData.notes,
        rowAssignments: timelineData.rowAssignments || {},
        deletedIds: timelineData.deletedIds || [],
        takeaways: timelineData.takeaways || [],
        quizHistory: timelineData.quizHistory || []
    };

    if (isServerMode) {
        try {
            const response = await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            if (response.ok) {
                console.log('Data saved to server');
            } else {
                console.error('Server save failed with status:', response.status);
                localStorage.setItem('worldHistoryTimeline', JSON.stringify(userData));
            }
        } catch (err) {
            console.error('Failed to save to server, falling back to localStorage:', err);
            localStorage.setItem('worldHistoryTimeline', JSON.stringify(userData));
        }
    } else {
        localStorage.setItem('worldHistoryTimeline', JSON.stringify(userData));
    }
}

// Load data from server or localStorage
async function loadData() {
    let userData = null;

    if (isServerMode) {
        try {
            const response = await fetch('/api/data');
            if (response.ok) {
                userData = await response.json();
                console.log('Data loaded from server');
            }
        } catch (err) {
            console.error('Failed to load from server, trying localStorage:', err);
        }
    }

    // Fallback to localStorage
    if (!userData) {
        const saved = localStorage.getItem('worldHistoryTimeline');
        if (saved) {
            try {
                userData = JSON.parse(saved);
            } catch (e) {
                console.error('Error parsing localStorage data:', e);
            }
        }
    }

    // Merge user data with defaults
    if (userData) {
        if (userData.notes) timelineData.notes = userData.notes;
        if (userData.rowAssignments) timelineData.rowAssignments = userData.rowAssignments;

        // Restore deleted IDs and remove those items from defaults
        if (userData.deletedIds && userData.deletedIds.length > 0) {
            timelineData.deletedIds = userData.deletedIds;
            timelineData.events = timelineData.events.filter(e => !userData.deletedIds.includes(e.id));
            timelineData.entities = timelineData.entities.filter(e => !userData.deletedIds.includes(e.id));
        }

        // Add user entities (replace defaults if IDs match, to preserve user edits)
        if (userData.entities) {
            userData.entities.forEach(e => {
                e.userAdded = true;
                const existingIdx = timelineData.entities.findIndex(existing => existing.id === e.id);
                if (existingIdx >= 0) {
                    timelineData.entities[existingIdx] = e;
                } else {
                    timelineData.entities.push(e);
                }
            });
        }

        // Add user events (replace defaults if IDs match, to preserve user edits)
        if (userData.events) {
            userData.events.forEach(e => {
                e.userAdded = true;
                if (e.id == null) e.id = getNextEventId();
                const existingIdx = timelineData.events.findIndex(existing => existing.id === e.id);
                if (existingIdx >= 0) {
                    timelineData.events[existingIdx] = e;
                } else {
                    timelineData.events.push(e);
                }
            });
        }

        // Add user references
        if (userData.references) {
            userData.references.forEach(r => {
                r.userAdded = true;
                if (!timelineData.references.find(existing => existing.id === r.id)) {
                    timelineData.references.push(r);
                }
            });
        }

        // Add user insights
        if (userData.insights) {
            userData.insights.forEach(i => {
                i.userAdded = true;
                if (!timelineData.insights.find(existing => existing.id === i.id)) {
                    timelineData.insights.push(i);
                }
            });
        }

        // Restore takeaways
        if (userData.takeaways) {
            timelineData.takeaways = userData.takeaways;
        }

        // Restore quiz history
        if (userData.quizHistory) {
            timelineData.quizHistory = userData.quizHistory;
        }
    }
}

// Clear saved data (for debugging)
function clearSavedData() {
    if (isServerMode) {
        fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ events: [], entities: [], references: [], insights: [], notes: {}, rowAssignments: {}, deletedIds: [], takeaways: [], quizHistory: [] })
        }).then(() => location.reload());
    } else {
        localStorage.removeItem('worldHistoryTimeline');
        location.reload();
    }
}

// ===========================================
// KNOWLEDGE MAP CATEGORY SYSTEM
// Categories: state, religion, culture, period, event
// ===========================================

// Convert all entities to timeline events and add category to existing events
function initializeTimelineData() {
    // Add all entities (states, religions, cultures) as timeline events
    timelineData.entities.forEach(entity => {
        const entityEvent = {
            id: `entity-${entity.id}`,
            title: entity.name,
            year: entity.year,
            endYear: entity.endYear,
            entityIds: [entity.id],
            category: entity.type, // 'state', 'religion', or 'culture'
            entityType: entity.type,
            region: entity.region,
            description: entity.description,
            isEntity: true,
            createdBy: entity.createdBy
        };

        // Only add if not already present and not deleted by user
        const deleted = timelineData.deletedIds || [];
        if (!timelineData.events.find(e => e.id === entityEvent.id) && !deleted.includes(entityEvent.id)) {
            timelineData.events.push(entityEvent);
        }
    });

    // Add all periods as timeline events
    const deleted = timelineData.deletedIds || [];
    timelineData.periods.forEach(period => {
        const periodEvent = {
            id: `period-${period.id}`,
            title: period.name,
            year: period.year,
            endYear: period.endYear,
            entityIds: [],
            category: 'period',
            entityType: 'period',
            region: period.region,
            description: period.description,
            isPeriod: true
        };

        // Only add if not already present and not deleted by user
        if (!timelineData.events.find(e => e.id === periodEvent.id) && !deleted.includes(periodEvent.id)) {
            timelineData.events.push(periodEvent);
        }
    });

    // All regular events (non-entity, non-period) get category 'event'
    timelineData.events.forEach(event => {
        if (!event.category) {
            event.category = 'event';
        }
    });
}

// initializeTimelineData() is called by app.js after loadData() completes
