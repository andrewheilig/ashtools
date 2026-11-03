// ============================================================
// translations.js
//
// Language Defender course data.
//
// Usage:
//   <script src="translations.js"></script>
//
// Then:
//   TRANSLATIONS.spanish
//   TRANSLATIONS.french
//   TRANSLATIONS.japanese
//
// Every row has:
// [
//   English prompt,
//   target-language answer,
//   unit number,
//   optional metadata
// ]
// ============================================================


const TRANSLATIONS = {};


// ============================================================
// HELPERS
// ============================================================

function makeCourse() {
  return [];
}


function add(course, unit, english, target, info = {}) {
  course.push([
    english,
    target,
    unit,
    info
  ]);
}


function addMany(course, unit, rows) {
  for (const row of rows) {
    add(
      course,
      unit,
      row[0],
      row[1],
      row[2] || {}
    );
  }
}


function addUnique(
  course,
  unit,
  english,
  target,
  info = {}
) {
  const exists = course.some(
    row =>
      row[0] === english &&
      row[1] === target
  );

  if (!exists) {
    add(
      course,
      unit,
      english,
      target,
      info
    );
  }
}


// ============================================================
// SPANISH
// ============================================================
//
// Put your existing full Spanish list here.
//
// The newer material begins below so it remains easy to edit.
//
// ============================================================

const spanish = makeCourse();


// ------------------------------------------------------------
// UNIT 1
// ------------------------------------------------------------

addMany(spanish, 1, [
  ["woman", "mujer", {
    noun: true,
    gender: "f"
  }],

  ["the (masculine)", "el"],

  ["a/an (masculine)", "un"],

  ["girl", "niña", {
    noun: true,
    gender: "f",
    pair: "niño"
  }],

  ["the (feminine)", "la"],

  ["I", "yo"],

  ["a/an (feminine)", "una"],

  ["man", "hombre", {
    noun: true,
    gender: "m"
  }],

  ["boy", "niño", {
    noun: true,
    gender: "m",
    pair: "niña"
  }],

  ["I am", "soy"],
  ["apple", "manzana"],
  ["he/she eats", "come"],
  ["you", "tú"],
  ["he", "él"],
  ["you are", "eres"],
  ["she", "ella"],
  ["he/she is", "es"],
  ["you eat", "comes"],
  ["he/she drinks", "bebe"],
  ["bread", "pan"],
  ["milk", "leche"],
  ["I drink", "bebo"],
  ["I eat", "como"],
  ["water", "agua"],
  ["you drink", "bebes"]
]);


// ------------------------------------------------------------
// UNIT 2
// ------------------------------------------------------------

addMany(spanish, 2, [
  ["good night", "buenas noches"],
  ["hello", "hola"],
  ["thank you", "gracias"],
  ["good morning", "buenos días"],
  ["nice to meet you", "mucho gusto"],
  ["goodbye", "adiós"],
  ["I'm sorry", "lo siento"],
  ["pardon", "perdón"],
  ["you're welcome", "de nada"],
  ["please", "por favor"],
  ["yes", "sí"],
  ["no", "no"],

  ["English", "inglés"],
  ["Spanish", "español"],

  ["you speak", "hablas"],
  ["I speak", "hablo"],

  ["taxi", "taxi"],
  ["I need", "necesito"],
  ["telephone", "teléfono"],
  ["my", "mi"],
  ["passport", "pasaporte"],
  ["suitcase", "maleta"],
  ["hotel", "hotel"],
  ["here", "aquí"],
  ["I have", "tengo"],
  ["reservation", "reserva"],
  ["where", "dónde"],
  ["money", "dinero"],
  ["ticket", "boleto"],
  ["airport", "aeropuerto"],
  ["bus", "autobús"],
  ["train", "tren"],
  ["museum", "museo"],
  ["hospital", "hospital"],
  ["bathroom", "baño"],
  ["street", "calle"],
  ["bank", "banco"],
  ["supermarket", "supermercado"],
  ["restaurant", "restaurante"],

  ["table", "mesa"],
  ["hamburger", "hamburguesa"],
  ["sandwich", "sándwich"],
  ["fish", "pescado"],
  ["cheese", "queso"],
  ["meat", "carne"],
  ["sugar", "azúcar"],
  ["juice", "jugo"],
  ["glass", "vaso"],
  ["coffee", "café"],
  ["orange", "naranja"],
  ["cup", "taza"],
  ["salt", "sal"],
  ["bill", "cuenta"],

  ["I want", "quiero"],
  ["tomato", "tomate"],
  ["salad", "ensalada"],
  ["to pay", "pagar"],

  ["one", "uno"],
  ["two", "dos"],
  ["three", "tres"],
  ["four", "cuatro"],
  ["five", "cinco"],
  ["six", "seis"],
  ["seven", "siete"],
  ["eight", "ocho"],
  ["nine", "nueve"],
  ["ten", "diez"],

  ["mother", "madre"],
  ["father", "padre"],
  ["sister", "hermana"],
  ["brother", "hermano"],
  ["cat", "gato"],
  ["dog", "perro"],
  ["family", "familia"],
  ["grandfather", "abuelo"],
  ["grandmother", "abuela"],
  ["daughter", "hija"],
  ["son", "hijo"],

  ["car", "carro"],
  ["house", "casa"],
  ["bicycle", "bicicleta"],

  ["green", "verde"],
  ["blue", "azul"],
  ["big", "grande"],
  ["intelligent", "inteligente"],
  ["interesting", "interesante"],
  ["very", "muy"],
  ["red", "rojo"],
  ["pretty", "bonito"],

  ["school", "escuela"],
  ["book", "libro"],
  ["pen", "bolígrafo"],
  ["exam", "examen"],
  ["class", "clase"],
  ["student", "estudiante"],
  ["teacher", "maestro"],
  ["computer", "computadora"],
  ["university", "universidad"],
  ["question", "pregunta"],

  ["to study", "estudiar"],
  ["to read", "leer"],
  ["to write", "escribir"],

  ["I study", "estudio"],
  ["you study", "estudias"],
  ["I read", "leo"],
  ["you read", "lees"],
  ["I write", "escribo"],
  ["you write", "escribes"]
]);


// ============================================================
// The rest of your existing Spanish curriculum
// ============================================================
//
// Keep your already-written Units 3–21 here.
//
// Then add the newest material:
// ============================================================


// ------------------------------------------------------------
// UNIT 22 — 3.15
// ------------------------------------------------------------

addMany(spanish, 22, [
  ["box", "caja"],

  ["you bring", "traes"],

  ["that (feminine)", "esa"],

  ["you help us", "nos ayudas"],

  ["you open the", "abres la"],

  ["you take / pick up", "coges"],

  ["sure / safe", "seguro"],

  ["grass / lawn", "césped"],

  ["wall", "pared"],

  ["floor", "piso"],

  ["farm", "granja"],

  ["I bring", "traigo"],

  ["I close the", "cierro la"],

  ["shower", "ducha"],

  ["rooms", "cuartos"],

  ["to sit down", "sentarse"],

  ["get up! (informal)", "levántate"],

  ["get up! (formal)", "levántese"],

  ["I look / watch", "miro"],

  ["here", "acá"],

  ["sit down! (formal)", "siéntese"],

  ["sit down! (informal)", "siéntate"],

  ["wash yourself! (informal)", "lávate"],

  ["wash yourself! (formal)", "lávese"],

  ["over there", "allá"],

  ["beautiful", "hermoso"]
]);


// ------------------------------------------------------------
// UNIT 23 — 3.16
// ------------------------------------------------------------

addMany(spanish, 23, [
  ["to him / her / you formal", "le"],

  ["to give", "dar"],

  ["I give", "doy"],

  ["I make / do for him/her", "le hago"],

  ["you give", "das"],

  ["to send", "mandar"],

  ["to them / you all", "les"],

  ["I say / tell", "digo"],

  ["waiter", "mesero"],

  ["I send", "mando"],

  ["you say / tell", "dices"],

  ["I ask", "pregunto"],

  ["nothing is", "nada es"],

  ["to ask", "preguntar"],

  ["we say / tell", "decimos"],

  ["nothing", "nada"]
]);


// ============================================================
// FRENCH
// ============================================================

const french = makeCourse();


// ------------------------------------------------------------
// FRENCH UNIT 1 — BASICS
// ------------------------------------------------------------

addMany(french, 1, [
  ["hello", "bonjour"],
  ["hi", "salut"],
  ["goodbye", "au revoir"],
  ["please", "s'il vous plaît"],
  ["thank you", "merci"],
  ["yes", "oui"],
  ["no", "non"],
  ["sorry", "désolé"],
  ["excuse me", "excusez-moi"],

  ["I", "je"],
  ["you", "tu"],
  ["he", "il"],
  ["she", "elle"],
  ["we", "nous"],
  ["you all / formal you", "vous"],
  ["they", "ils"],
  ["they (feminine)", "elles"],

  ["man", "homme"],
  ["woman", "femme"],
  ["boy", "garçon"],
  ["girl", "fille"],
  ["child", "enfant"],
  ["friend", "ami"],
  ["friend (female)", "amie"],

  ["the (masculine)", "le"],
  ["the (feminine)", "la"],
  ["the (plural)", "les"],

  ["a/an (masculine)", "un"],
  ["a/an (feminine)", "une"],

  ["to be", "être"],
  ["to have", "avoir"],
  ["to go", "aller"],
  ["to do / make", "faire"],

  ["I am", "je suis"],
  ["you are", "tu es"],
  ["he/she is", "il est"],
  ["we are", "nous sommes"],
  ["you all are", "vous êtes"],
  ["they are", "ils sont"],

  ["I have", "j'ai"],
  ["you have", "tu as"],
  ["he/she has", "il a"],
  ["we have", "nous avons"],
  ["you all have", "vous avez"],
  ["they have", "ils ont"]
]);


// ------------------------------------------------------------
// FRENCH UNIT 2 — FOOD
// ------------------------------------------------------------

addMany(french, 2, [
  ["water", "eau"],
  ["bread", "pain"],
  ["milk", "lait"],
  ["coffee", "café"],
  ["tea", "thé"],
  ["juice", "jus"],

  ["apple", "pomme"],
  ["orange", "orange"],
  ["banana", "banane"],

  ["cheese", "fromage"],
  ["meat", "viande"],
  ["fish", "poisson"],
  ["chicken", "poulet"],
  ["rice", "riz"],
  ["soup", "soupe"],
  ["salad", "salade"],
  ["cake", "gâteau"],
  ["sugar", "sucre"],
  ["salt", "sel"],

  ["to eat", "manger"],
  ["to drink", "boire"],

  ["I eat", "je mange"],
  ["you eat", "tu manges"],
  ["he/she eats", "il mange"],
  ["we eat", "nous mangeons"],
  ["you all eat", "vous mangez"],
  ["they eat", "ils mangent"],

  ["I drink", "je bois"],
  ["you drink", "tu bois"],
  ["he/she drinks", "il boit"],
  ["we drink", "nous buvons"],
  ["you all drink", "vous buvez"],
  ["they drink", "ils boivent"]
]);


// ------------------------------------------------------------
// FRENCH UNIT 3 — FAMILY / HOME
// ------------------------------------------------------------

addMany(french, 3, [
  ["mother", "mère"],
  ["father", "père"],
  ["brother", "frère"],
  ["sister", "sœur"],
  ["son", "fils"],
  ["daughter", "fille"],
  ["grandmother", "grand-mère"],
  ["grandfather", "grand-père"],
  ["family", "famille"],

  ["house", "maison"],
  ["room", "chambre"],
  ["kitchen", "cuisine"],
  ["bathroom", "salle de bains"],
  ["door", "porte"],
  ["window", "fenêtre"],
  ["table", "table"],
  ["chair", "chaise"],
  ["bed", "lit"],
  ["garden", "jardin"]
]);


// ------------------------------------------------------------
// FRENCH UNIT 4 — SCHOOL
// ------------------------------------------------------------

addMany(french, 4, [
  ["school", "école"],
  ["class", "classe"],
  ["student", "élève"],
  ["teacher", "professeur"],

  ["book", "livre"],
  ["notebook", "cahier"],
  ["pen", "stylo"],
  ["pencil", "crayon"],
  ["dictionary", "dictionnaire"],

  ["question", "question"],
  ["answer", "réponse"],
  ["lesson", "leçon"],
  ["homework", "devoirs"],
  ["exam", "examen"],

  ["to study", "étudier"],
  ["to learn", "apprendre"],
  ["to read", "lire"],
  ["to write", "écrire"],
  ["to understand", "comprendre"],
  ["to know", "savoir"],
  ["to speak", "parler"],
  ["to listen", "écouter"]
]);


// ------------------------------------------------------------
// FRENCH NUMBERS
// ------------------------------------------------------------

addMany(french, 5, [
  ["zero", "zéro"],
  ["one", "un"],
  ["two", "deux"],
  ["three", "trois"],
  ["four", "quatre"],
  ["five", "cinq"],
  ["six", "six"],
  ["seven", "sept"],
  ["eight", "huit"],
  ["nine", "neuf"],
  ["ten", "dix"],
  ["eleven", "onze"],
  ["twelve", "douze"],
  ["thirteen", "treize"],
  ["fourteen", "quatorze"],
  ["fifteen", "quinze"],
  ["sixteen", "seize"],
  ["seventeen", "dix-sept"],
  ["eighteen", "dix-huit"],
  ["nineteen", "dix-neuf"],
  ["twenty", "vingt"],
  ["thirty", "trente"],
  ["forty", "quarante"],
  ["fifty", "cinquante"],
  ["sixty", "soixante"],
  ["seventy", "soixante-dix"],
  ["eighty", "quatre-vingts"],
  ["ninety", "quatre-vingt-dix"],
  ["one hundred", "cent"],
  ["one thousand", "mille"]
]);


// ------------------------------------------------------------
// FRENCH DATES / TIME
// ------------------------------------------------------------

addMany(french, 6, [
  ["Monday", "lundi"],
  ["Tuesday", "mardi"],
  ["Wednesday", "mercredi"],
  ["Thursday", "jeudi"],
  ["Friday", "vendredi"],
  ["Saturday", "samedi"],
  ["Sunday", "dimanche"],

  ["January", "janvier"],
  ["February", "février"],
  ["March", "mars"],
  ["April", "avril"],
  ["May", "mai"],
  ["June", "juin"],
  ["July", "juillet"],
  ["August", "août"],
  ["September", "septembre"],
  ["October", "octobre"],
  ["November", "novembre"],
  ["December", "décembre"],

  ["today", "aujourd'hui"],
  ["tomorrow", "demain"],
  ["yesterday", "hier"],
  ["morning", "matin"],
  ["afternoon", "après-midi"],
  ["evening", "soir"],
  ["night", "nuit"]
]);


// ------------------------------------------------------------
// FRENCH ADJECTIVES
// ------------------------------------------------------------

addMany(french, 7, [
  ["red", "rouge"],
  ["blue", "bleu"],
  ["green", "vert"],
  ["yellow", "jaune"],
  ["black", "noir"],
  ["white", "blanc"],
  ["pink", "rose"],
  ["purple", "violet"],
  ["brown", "marron"],
  ["gray", "gris"],

  ["big", "grand"],
  ["small", "petit"],
  ["good", "bon"],
  ["bad", "mauvais"],
  ["beautiful", "beau"],
  ["pretty", "joli"],
  ["young", "jeune"],
  ["old", "vieux"],
  ["new", "nouveau"],
  ["happy", "heureux"],
  ["sad", "triste"],
  ["tired", "fatigué"],
  ["busy", "occupé"],
  ["easy", "facile"],
  ["difficult", "difficile"],
  ["interesting", "intéressant"],
  ["important", "important"],
  ["fast", "rapide"],
  ["slow", "lent"]
]);


// ------------------------------------------------------------
// FRENCH TRAVEL
// ------------------------------------------------------------

addMany(french, 8, [
  ["city", "ville"],
  ["town", "village"],
  ["country", "pays"],
  ["street", "rue"],
  ["station", "gare"],
  ["airport", "aéroport"],
  ["hotel", "hôtel"],
  ["restaurant", "restaurant"],
  ["museum", "musée"],
  ["hospital", "hôpital"],
  ["bank", "banque"],
  ["store", "magasin"],
  ["park", "parc"],
  ["beach", "plage"],

  ["car", "voiture"],
  ["bus", "bus"],
  ["train", "train"],
  ["airplane", "avion"],
  ["bicycle", "vélo"],
  ["taxi", "taxi"],

  ["to travel", "voyager"],
  ["to arrive", "arriver"],
  ["to leave", "partir"],
  ["to return", "revenir"],
  ["to visit", "visiter"]
]);


// ============================================================
// GENERATED FRENCH PRESENT-TENSE FORMS
// ============================================================

const frenchERVerbs = [
  ["speak", "parler"],
  ["work", "travailler"],
  ["study", "étudier"],
  ["listen", "écouter"],
  ["look", "regarder"],
  ["love", "aimer"],
  ["live", "habiter"],
  ["ask", "demander"],
  ["give", "donner"],
  ["find", "trouver"],
  ["think", "penser"],
  ["carry", "porter"],
  ["arrive", "arriver"],
  ["enter", "entrer"],
  ["stay", "rester"],
  ["play", "jouer"],
  ["walk", "marcher"],
  ["sing", "chanter"],
  ["dance", "danser"],
  ["swim", "nager"],
  ["cook", "cuisiner"],
  ["wash", "laver"],
  ["close", "fermer"],
  ["show", "montrer"],
  ["visit", "visiter"],
  ["travel", "voyager"]
];


const frenchPersons = [
  ["I", "je", "e"],
  ["you", "tu", "es"],
  ["he/she", "il", "e"],
  ["we", "nous", "ons"],
  ["you all", "vous", "ez"],
  ["they", "ils", "ent"]
];


for (const [meaning, infinitive] of frenchERVerbs) {
  const stem =
    infinitive.slice(0, -2);

  for (
    const [
      personMeaning,
      pronoun,
      ending
    ] of frenchPersons
  ) {
    addUnique(
      french,
      12,
      `${personMeaning} ${meaning}`,
      `${pronoun} ${stem}${ending}`,
      {
        generated: true,
        grammar: "present-er"
      }
    );
  }
}


// ============================================================
// FRENCH MODALS
// ============================================================

const frenchActions = [
  ["eat", "manger"],
  ["drink", "boire"],
  ["study", "étudier"],
  ["work", "travailler"],
  ["read", "lire"],
  ["write", "écrire"],
  ["travel", "voyager"],
  ["sleep", "dormir"],
  ["play", "jouer"],
  ["swim", "nager"],
  ["cook", "cuisiner"],
  ["learn", "apprendre"],
  ["speak", "parler"],
  ["visit", "visiter"],
  ["buy", "acheter"],
  ["listen", "écouter"],
  ["walk", "marcher"],
  ["sing", "chanter"],
  ["dance", "danser"],
  ["wait", "attendre"]
];


const frenchFrames = [
  ["I want to", "je veux"],
  ["you want to", "tu veux"],
  ["he/she wants to", "il veut"],
  ["we want to", "nous voulons"],
  ["they want to", "ils veulent"],

  ["I can", "je peux"],
  ["you can", "tu peux"],
  ["he/she can", "il peut"],
  ["we can", "nous pouvons"],
  ["they can", "ils peuvent"],

  ["I am going to", "je vais"],
  ["you are going to", "tu vas"],
  ["he/she is going to", "il va"],
  ["we are going to", "nous allons"],
  ["they are going to", "ils vont"]
];


for (const [meaning, infinitive] of frenchActions) {
  for (
    const [
      frameEnglish,
      frameFrench
    ] of frenchFrames
  ) {
    addUnique(
      french,
      14,
      `${frameEnglish} ${meaning}`,
      `${frameFrench} ${infinitive}`,
      {
        generated: true,
        grammar: "modal-infinitive"
      }
    );
  }
}


// ============================================================
// JAPANESE
// ============================================================

const japanese = makeCourse();


// ------------------------------------------------------------
// JAPANESE UNIT 1
// ------------------------------------------------------------

addMany(japanese, 1, [
  ["hello", "こんにちは"],
  ["good morning", "おはよう"],
  ["good evening", "こんばんは"],
  ["goodbye", "さようなら"],
  ["thank you", "ありがとう"],
  ["please", "お願いします"],
  ["yes", "はい"],
  ["no", "いいえ"],

  ["I / me", "私"],
  ["you", "あなた"],

  ["person", "人"],
  ["man", "男"],
  ["woman", "女"],
  ["boy", "男の子"],
  ["girl", "女の子"],
  ["child", "子供"],
  ["friend", "友達"],

  ["this", "これ"],
  ["that", "それ"],
  ["that over there", "あれ"],

  ["what", "何"],
  ["who", "誰"],
  ["where", "どこ"],
  ["when", "いつ"],
  ["why", "なぜ"],
  ["how", "どう"]
]);


// ------------------------------------------------------------
// JAPANESE FOOD
// ------------------------------------------------------------

addMany(japanese, 2, [
  ["water", "水"],
  ["tea", "お茶"],
  ["coffee", "コーヒー"],
  ["milk", "牛乳"],
  ["juice", "ジュース"],

  ["rice / meal", "ご飯"],
  ["bread", "パン"],
  ["meat", "肉"],
  ["fish", "魚"],
  ["vegetable", "野菜"],
  ["fruit", "果物"],
  ["apple", "りんご"],
  ["orange", "オレンジ"],
  ["banana", "バナナ"],
  ["egg", "卵"],
  ["chicken", "鶏肉"],
  ["soup", "スープ"],

  ["to eat", "食べる"],
  ["to drink", "飲む"],
  ["to cook", "料理する"]
]);


// ------------------------------------------------------------
// JAPANESE FAMILY / HOME
// ------------------------------------------------------------

addMany(japanese, 3, [
  ["mother", "母"],
  ["father", "父"],
  ["older brother", "兄"],
  ["older sister", "姉"],
  ["younger brother", "弟"],
  ["younger sister", "妹"],
  ["family", "家族"],
  ["grandmother", "祖母"],
  ["grandfather", "祖父"],

  ["house", "家"],
  ["room", "部屋"],
  ["kitchen", "台所"],
  ["bathroom", "浴室"],
  ["door", "ドア"],
  ["window", "窓"],
  ["table", "テーブル"],
  ["chair", "椅子"],
  ["bed", "ベッド"],
  ["garden", "庭"]
]);


// ------------------------------------------------------------
// JAPANESE SCHOOL
// ------------------------------------------------------------

addMany(japanese, 4, [
  ["school", "学校"],
  ["classroom", "教室"],
  ["student", "学生"],
  ["teacher", "先生"],

  ["book", "本"],
  ["notebook", "ノート"],
  ["pen", "ペン"],
  ["pencil", "鉛筆"],
  ["dictionary", "辞書"],

  ["question", "質問"],
  ["answer", "答え"],
  ["lesson", "授業"],
  ["homework", "宿題"],
  ["test", "テスト"],

  ["to study", "勉強する"],
  ["to learn", "習う"],
  ["to read", "読む"],
  ["to write", "書く"],
  ["to listen", "聞く"],
  ["to speak", "話す"],
  ["to understand", "分かる"],
  ["to teach", "教える"]
]);


// ------------------------------------------------------------
// JAPANESE NUMBERS / DAYS
// ------------------------------------------------------------

addMany(japanese, 5, [
  ["one", "一"],
  ["two", "二"],
  ["three", "三"],
  ["four", "四"],
  ["five", "五"],
  ["six", "六"],
  ["seven", "七"],
  ["eight", "八"],
  ["nine", "九"],
  ["ten", "十"],
  ["hundred", "百"],
  ["thousand", "千"],
  ["ten thousand", "万"],

  ["Monday", "月曜日"],
  ["Tuesday", "火曜日"],
  ["Wednesday", "水曜日"],
  ["Thursday", "木曜日"],
  ["Friday", "金曜日"],
  ["Saturday", "土曜日"],
  ["Sunday", "日曜日"],

  ["today", "今日"],
  ["tomorrow", "明日"],
  ["yesterday", "昨日"],

  ["morning", "朝"],
  ["afternoon", "午後"],
  ["evening", "夕方"],
  ["night", "夜"]
]);


// ------------------------------------------------------------
// JAPANESE ADJECTIVES
// ------------------------------------------------------------

addMany(japanese, 6, [
  ["red", "赤"],
  ["blue", "青"],
  ["green", "緑"],
  ["yellow", "黄色"],
  ["black", "黒"],
  ["white", "白"],

  ["big", "大きい"],
  ["small", "小さい"],
  ["new", "新しい"],
  ["old", "古い"],
  ["good", "いい"],
  ["bad", "悪い"],
  ["hot", "暑い"],
  ["cold", "寒い"],
  ["interesting", "面白い"],
  ["difficult", "難しい"],
  ["easy", "易しい"],
  ["fast", "速い"],
  ["slow", "遅い"]
]);


// ------------------------------------------------------------
// JAPANESE TRAVEL
// ------------------------------------------------------------

addMany(japanese, 7, [
  ["city", "市"],
  ["town", "町"],
  ["country", "国"],
  ["road", "道"],
  ["station", "駅"],
  ["airport", "空港"],
  ["hotel", "ホテル"],
  ["restaurant", "レストラン"],
  ["hospital", "病院"],
  ["store", "店"],
  ["park", "公園"],
  ["beach", "海岸"],

  ["car", "車"],
  ["bus", "バス"],
  ["train", "電車"],
  ["airplane", "飛行機"],
  ["bicycle", "自転車"],
  ["taxi", "タクシー"],

  ["to go", "行く"],
  ["to come", "来る"],
  ["to return", "帰る"],
  ["to travel", "旅行する"],
  ["to arrive", "着く"]
]);


// ------------------------------------------------------------
// JAPANESE BODY
// ------------------------------------------------------------

addMany(japanese, 8, [
  ["head", "頭"],
  ["face", "顔"],
  ["eye", "目"],
  ["ear", "耳"],
  ["nose", "鼻"],
  ["mouth", "口"],
  ["tooth", "歯"],
  ["hair", "髪"],
  ["hand", "手"],
  ["arm", "腕"],
  ["leg / foot", "足"],
  ["heart", "心"],

  ["to wash", "洗う"],
  ["to get up", "起きる"],
  ["to sleep", "寝る"],
  ["to sit", "座る"],
  ["to stand", "立つ"]
]);


// ============================================================
// JAPANESE VERB FORMS
// ============================================================

const japaneseVerbs = [
  [
    "eat",
    "食べる",
    "食べます",
    "食べません",
    "食べました"
  ],

  [
    "drink",
    "飲む",
    "飲みます",
    "飲みません",
    "飲みました"
  ],

  [
    "read",
    "読む",
    "読みます",
    "読みません",
    "読みました"
  ],

  [
    "write",
    "書く",
    "書きます",
    "書きません",
    "書きました"
  ],

  [
    "speak",
    "話す",
    "話します",
    "話しません",
    "話しました"
  ],

  [
    "listen",
    "聞く",
    "聞きます",
    "聞きません",
    "聞きました"
  ],

  [
    "go",
    "行く",
    "行きます",
    "行きません",
    "行きました"
  ],

  [
    "come",
    "来る",
    "来ます",
    "来ません",
    "来ました"
  ],

  [
    "return",
    "帰る",
    "帰ります",
    "帰りません",
    "帰りました"
  ],

  [
    "see",
    "見る",
    "見ます",
    "見ません",
    "見ました"
  ],

  [
    "buy",
    "買う",
    "買います",
    "買いません",
    "買いました"
  ],

  [
    "wait",
    "待つ",
    "待ちます",
    "待ちません",
    "待ちました"
  ],

  [
    "meet",
    "会う",
    "会います",
    "会いません",
    "会いました"
  ],

  [
    "play",
    "遊ぶ",
    "遊びます",
    "遊びません",
    "遊びました"
  ],

  [
    "swim",
    "泳ぐ",
    "泳ぎます",
    "泳ぎません",
    "泳ぎました"
  ],

  [
    "walk",
    "歩く",
    "歩きます",
    "歩きません",
    "歩きました"
  ],

  [
    "run",
    "走る",
    "走ります",
    "走りません",
    "走りました"
  ],

  [
    "sleep",
    "寝る",
    "寝ます",
    "寝ません",
    "寝ました"
  ],

  [
    "get up",
    "起きる",
    "起きます",
    "起きません",
    "起きました"
  ],

  [
    "teach",
    "教える",
    "教えます",
    "教えません",
    "教えました"
  ],

  [
    "learn",
    "習う",
    "習います",
    "習いません",
    "習いました"
  ],

  [
    "make",
    "作る",
    "作ります",
    "作りません",
    "作りました"
  ]
];


for (
  const [
    meaning,
    dictionary,
    polite,
    negative,
    past
  ] of japaneseVerbs
) {
  addUnique(
    japanese,
    10,
    `to ${meaning}`,
    dictionary,
    {
      generated: true,
      grammar: "dictionary"
    }
  );

  addUnique(
    japanese,
    10,
    `${meaning} / does ${meaning}`,
    polite,
    {
      generated: true,
      grammar: "masu"
    }
  );

  addUnique(
    japanese,
    11,
    `do not ${meaning}`,
    negative,
    {
      generated: true,
      grammar: "negative"
    }
  );

  addUnique(
    japanese,
    11,
    `${meaning}ed / did ${meaning}`,
    past,
    {
      generated: true,
      grammar: "past"
    }
  );
}


// ============================================================
// JAPANESE PARTICLES
// ============================================================

const japanesePlaces = [
  ["school", "学校"],
  ["home", "家"],
  ["park", "公園"],
  ["store", "店"],
  ["station", "駅"],
  ["restaurant", "レストラン"],
  ["hospital", "病院"],
  ["airport", "空港"],
  ["hotel", "ホテル"],
  ["library", "図書館"],
  ["classroom", "教室"],
  ["city", "町"]
];


for (
  const [
    english,
    target
  ] of japanesePlaces
) {
  addUnique(
    japanese,
    12,
    `at/in ${english}`,
    `${target}で`,
    {
      generated: true,
      particle: "で"
    }
  );

  addUnique(
    japanese,
    12,
    `to ${english}`,
    `${target}に`,
    {
      generated: true,
      particle: "に"
    }
  );

  addUnique(
    japanese,
    12,
    `${english} (topic)`,
    `${target}は`,
    {
      generated: true,
      particle: "は"
    }
  );

  addUnique(
    japanese,
    12,
    `from ${english}`,
    `${target}から`,
    {
      generated: true,
      particle: "から"
    }
  );
}


// ============================================================
// JAPANESE SENTENCES
// ============================================================

const japaneseObjects = [
  ["rice", "ご飯"],
  ["water", "水"],
  ["tea", "お茶"],
  ["coffee", "コーヒー"],
  ["a book", "本"],
  ["music", "音楽"],
  ["Japanese", "日本語"],
  ["English", "英語"],
  ["fruit", "果物"],
  ["an apple", "りんご"],
  ["fish", "魚"],
  ["meat", "肉"],
  ["vegetables", "野菜"]
];


const japaneseActions = [
  ["eat", "食べます"],
  ["drink", "飲みます"],
  ["read", "読みます"],
  ["write", "書きます"],
  ["buy", "買います"],
  ["see", "見ます"],
  ["study", "勉強します"],
  ["listen to", "聞きます"]
];


for (
  const [
    objectEnglish,
    objectJapanese
  ] of japaneseObjects
) {
  for (
    const [
      verbEnglish,
      verbJapanese
    ] of japaneseActions
  ) {
    addUnique(
      japanese,
      13,

      `I ${verbEnglish} ${objectEnglish}`,

      `私は${objectJapanese}を${verbJapanese}`,

      {
        generated: true,
        grammar: "object-sentence"
      }
    );
  }
}


// ============================================================
// EXPAND COURSES TO MATCH SPANISH SIZE
// ============================================================
//
// These generated combinations are useful review material,
// not filler random strings.
// ============================================================

function expandFrench(targetCount) {
  const subjects = [
    ["I", "je", "veux", "peux", "vais"],
    ["you", "tu", "veux", "peux", "vas"],
    ["he", "il", "veut", "peut", "va"],
    ["she", "elle", "veut", "peut", "va"],
    ["we", "nous", "voulons", "pouvons", "allons"],
    ["they", "ils", "veulent", "peuvent", "vont"]
  ];


  const actions = [
    ["eat", "manger"],
    ["drink", "boire"],
    ["study", "étudier"],
    ["work", "travailler"],
    ["read", "lire"],
    ["write", "écrire"],
    ["travel", "voyager"],
    ["sleep", "dormir"],
    ["play", "jouer"],
    ["swim", "nager"],
    ["cook", "cuisiner"],
    ["learn", "apprendre"],
    ["speak", "parler"],
    ["visit", "visiter"],
    ["buy", "acheter"],
    ["listen", "écouter"],
    ["walk", "marcher"],
    ["sing", "chanter"],
    ["dance", "danser"],
    ["wait", "attendre"]
  ];


  for (const subject of subjects) {
    for (const action of actions) {

      addUnique(
        french,
        15,

        `${subject[0]} want to ${action[0]}`,

        `${subject[1]} ${subject[2]} ${action[1]}`,

        {
          generated: true
        }
      );


      if (french.length >= targetCount) {
        return;
      }


      addUnique(
        french,
        15,

        `${subject[0]} can ${action[0]}`,

        `${subject[1]} ${subject[3]} ${action[1]}`,

        {
          generated: true
        }
      );


      if (french.length >= targetCount) {
        return;
      }


      let goingEnglish;

      if (subject[0] === "I") {
        goingEnglish =
          `I am going to ${action[0]}`;
      }

      else if (
        subject[0] === "he" ||
        subject[0] === "she"
      ) {
        goingEnglish =
          `${subject[0]} is going to ${action[0]}`;
      }

      else {
        goingEnglish =
          `${subject[0]} are going to ${action[0]}`;
      }


      addUnique(
        french,
        15,

        goingEnglish,

        `${subject[1]} ${subject[4]} ${action[1]}`,

        {
          generated: true
        }
      );


      if (french.length >= targetCount) {
        return;
      }
    }
  }


  const places = [
    ["school", "à l'école"],
    ["the park", "au parc"],
    ["the store", "au magasin"],
    ["the restaurant", "au restaurant"],
    ["the station", "à la gare"],
    ["the hotel", "à l'hôtel"],
    ["the museum", "au musée"],
    ["the beach", "à la plage"],
    ["the bank", "à la banque"]
  ];


  let cycle = 0;

  while (
    french.length <
    targetCount
  ) {
    const subject =
      subjects[
        cycle %
        subjects.length
      ];

    const action =
      actions[
        Math.floor(
          cycle /
          subjects.length
        ) %
        actions.length
      ];

    const place =
      places[
        Math.floor(
          cycle /
          (
            subjects.length *
            actions.length
          )
        ) %
        places.length
      ];


    addUnique(
      french,
      16,

      `${subject[0]} ${action[0]} at ${place[0]}`,

      `${subject[1]} ${action[1]} ${place[1]}`,

      {
        generated: true,
        reviewCombination: true
      }
    );


    cycle++;


    // Safety valve.
    if (cycle > 100000) {
      break;
    }
  }
}


function expandJapanese(targetCount) {
  const subjects = [
    ["I", "私は"],
    ["you", "あなたは"],
    ["he", "彼は"],
    ["she", "彼女は"],
    ["we", "私たちは"],
    ["they", "彼らは"]
  ];


  const objects = [
    ["rice", "ご飯"],
    ["water", "水"],
    ["tea", "お茶"],
    ["coffee", "コーヒー"],
    ["a book", "本"],
    ["music", "音楽"],
    ["Japanese", "日本語"],
    ["English", "英語"],
    ["fruit", "果物"],
    ["an apple", "りんご"],
    ["fish", "魚"],
    ["meat", "肉"],
    ["vegetables", "野菜"]
  ];


  const actions = [
    ["eat", "食べます"],
    ["drink", "飲みます"],
    ["read", "読みます"],
    ["write", "書きます"],
    ["buy", "買います"],
    ["see", "見ます"],
    ["study", "勉強します"],
    ["listen to", "聞きます"]
  ];


  for (const subject of subjects) {
    for (const object of objects) {
      for (const action of actions) {

        addUnique(
          japanese,
          15,

          `${subject[0]} ${action[0]} ${object[0]}`,

          `${subject[1]}${object[1]}を${action[1]}`,

          {
            generated: true,
            grammar: "subject-object-verb"
          }
        );


        if (
          japanese.length >=
          targetCount
        ) {
          return;
        }
      }
    }
  }


  const places = [
    ["school", "学校"],
    ["home", "家"],
    ["the park", "公園"],
    ["the store", "店"],
    ["the station", "駅"],
    ["the restaurant", "レストラン"],
    ["the hospital", "病院"],
    ["the airport", "空港"],
    ["the hotel", "ホテル"],
    ["the library", "図書館"]
  ];


  const movement = [
    ["go", "行きます"],
    ["come", "来ます"],
    ["return", "帰ります"],
    ["walk", "歩きます"]
  ];


  let cycle = 0;


  while (
    japanese.length <
    targetCount
  ) {
    const subject =
      subjects[
        cycle %
        subjects.length
      ];

    const place =
      places[
        Math.floor(
          cycle /
          subjects.length
        ) %
        places.length
      ];

    const action =
      movement[
        Math.floor(
          cycle /
          (
            subjects.length *
            places.length
          )
        ) %
        movement.length
      ];


    addUnique(
      japanese,
      16,

      `${subject[0]} ${action[0]} to ${place[0]}`,

      `${subject[1]}${place[1]}に${action[1]}`,

      {
        generated: true,
        grammar: "movement"
      }
    );


    cycle++;


    if (cycle > 100000) {
      break;
    }
  }
}


// ============================================================
// COURSE SIZE
// ============================================================
//
// Set this to your actual Spanish word count if the Spanish
// list is stored elsewhere.
//
// Your previous Spanish course had about 1088 entries.
// ============================================================

const TARGET_COURSE_SIZE =
  Math.max(
    spanish.length,
    1088
  );


expandFrench(
  TARGET_COURSE_SIZE
);


expandJapanese(
  TARGET_COURSE_SIZE
);


// ============================================================
// EXPORT
// ============================================================

TRANSLATIONS.spanish =
  spanish;

TRANSLATIONS.french =
  french.slice(
    0,
    TARGET_COURSE_SIZE
  );

TRANSLATIONS.japanese =
  japanese.slice(
    0,
    TARGET_COURSE_SIZE
  );


// Browser
if (
  typeof window !==
  "undefined"
) {
  window.TRANSLATIONS =
    TRANSLATIONS;
}


// Node / testing
if (
  typeof module !==
    "undefined" &&
  module.exports
) {
  module.exports =
    TRANSLATIONS;
}