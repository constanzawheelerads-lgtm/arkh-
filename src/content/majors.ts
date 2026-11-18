import type { MajorArcanum } from './types';

/**
 * The 22 major arcana of the Rider-Waite-Smith deck (1909).
 *
 * - `visual`: what the illustration shows (no interpretation).
 * - `waite` / `waiteReversed`: a selection, paraphrased, of the divinatory
 *   meanings listed in A. E. Waite, The Pictorial Key to the Tarot (1910).
 * - `goldenDawn`: astrological/elemental attribution and Hebrew letter of the
 *   Hermetic Order of the Golden Dawn (late 19th century). These belong to that
 *   school, not to the historical tarot.
 */
export const MAJORS: MajorArcanum[] = [
  {
    n: 0, roman: '0',
    name: { es: 'El Loco', en: 'The Fool' },
    marseille: 'Le Mat (sin número)',
    visual: {
      es: 'Un joven con ropas coloridas camina hacia el borde de un precipicio, con una rosa blanca en una mano y un hatillo al hombro. Un perro blanco salta a su lado bajo un cielo amarillo.',
      en: 'A young man in colourful clothes walks towards the edge of a cliff, a white rose in one hand and a bundle over his shoulder. A white dog leaps beside him under a yellow sky.',
    },
    waite: { es: 'Locura, manía, extravagancia, embriaguez, delirio, frenesí.', en: 'Folly, mania, extravagance, intoxication, delirium, frenzy.' },
    waiteReversed: { es: 'Negligencia, ausencia, descuido, apatía, nulidad, vanidad.', en: 'Negligence, absence, carelessness, apathy, nullity, vanity.' },
    goldenDawn: { attribution: { es: 'Aire', en: 'Air' }, hebrewLetter: 'Aleph' },
    note: {
      es: 'En el Tarot de Marsella, Le Mat no lleva número. Su ubicación al comienzo de la serie como 0 es una convención posterior.',
      en: 'In the Tarot de Marseille, Le Mat is unnumbered. Placing it at the start of the sequence as 0 is a later convention.',
    },
  },
  {
    n: 1, roman: 'I',
    name: { es: 'El Mago', en: 'The Magician' },
    marseille: 'Le Bateleur',
    visual: {
      es: 'Una figura de túnica blanca y manto rojo alza una vara con la mano derecha y señala la tierra con la izquierda. Sobre su cabeza, un ocho horizontal; en la mesa, una copa, una espada, un pentáculo y una vara. Rosas y lirios enmarcan la escena.',
      en: 'A figure in a white robe and red mantle raises a wand with the right hand and points to the earth with the left. Above the head, a horizontal eight; on the table, a cup, a sword, a pentacle and a wand. Roses and lilies frame the scene.',
    },
    waite: { es: 'Habilidad, diplomacia, destreza, sutileza; confianza en uno mismo, voluntad.', en: 'Skill, diplomacy, address, subtlety; self-confidence, will.' },
    waiteReversed: { es: 'Médico, mago, enfermedad mental, deshonra, inquietud.', en: 'Physician, Magus, mental disease, disgrace, disquiet.' },
    goldenDawn: { attribution: { es: 'Mercurio', en: 'Mercury' }, hebrewLetter: 'Beth' },
    note: {
      es: 'En los tarots italianos y de Marsella es un prestidigitador callejero. Waite y Smith lo convierten en un mago ceremonial.',
      en: 'In Italian and Marseille tarots he is a street conjurer. Waite and Smith turn him into a ceremonial magician.',
    },
  },
  {
    n: 2, roman: 'II',
    name: { es: 'La Sacerdotisa', en: 'The High Priestess' },
    marseille: 'La Papesse',
    visual: {
      es: 'Una mujer sentada entre dos columnas, una negra con la letra B y otra blanca con la J. Sostiene un rollo con la inscripción TORA, lleva una corona lunar y tiene una luna creciente a sus pies. Detrás, un velo con granadas.',
      en: 'A woman seated between two pillars, a black one marked B and a white one marked J. She holds a scroll inscribed TORA, wears a lunar crown and has a crescent moon at her feet. Behind her, a veil with pomegranates.',
    },
    waite: { es: 'Secretos, misterio, el futuro aún no revelado; silencio, tenacidad; sabiduría, ciencia.', en: 'Secrets, mystery, the future as yet unrevealed; silence, tenacity; wisdom, science.' },
    waiteReversed: { es: 'Pasión, ardor moral o físico, presunción, conocimiento superficial.', en: 'Passion, moral or physical ardour, conceit, surface knowledge.' },
    goldenDawn: { attribution: { es: 'Luna', en: 'Moon' }, hebrewLetter: 'Gimel' },
    note: {
      es: 'En el Tarot de Marsella es La Papesse (la Papisa). Waite la rebautiza y la rodea de símbolos del Templo de Salomón.',
      en: 'In the Tarot de Marseille she is La Papesse (the Popess). Waite renames her and surrounds her with symbols of Solomon’s Temple.',
    },
  },
  {
    n: 3, roman: 'III',
    name: { es: 'La Emperatriz', en: 'The Empress' },
    marseille: "L'Impératrice",
    visual: {
      es: 'Una mujer coronada de doce estrellas descansa sobre cojines en un campo de trigo, junto a un bosque y un arroyo. Sostiene un cetro; a su lado, un escudo en forma de corazón con el símbolo de Venus.',
      en: 'A woman crowned with twelve stars rests on cushions in a field of wheat, by a forest and a stream. She holds a sceptre; beside her, a heart-shaped shield bearing the symbol of Venus.',
    },
    waite: { es: 'Fecundidad, acción, iniciativa, larga vida; lo desconocido, lo clandestino.', en: 'Fruitfulness, action, initiative, length of days; the unknown, clandestine.' },
    waiteReversed: { es: 'Luz, verdad, desenredo de asuntos complicados, regocijo público; vacilación.', en: 'Light, truth, the unravelling of involved matters, public rejoicings; vacillation.' },
    goldenDawn: { attribution: { es: 'Venus', en: 'Venus' }, hebrewLetter: 'Daleth' },
  },
  {
    n: 4, roman: 'IV',
    name: { es: 'El Emperador', en: 'The Emperor' },
    marseille: "L'Empereur",
    visual: {
      es: 'Un hombre barbado, con armadura bajo la túnica roja, sentado en un trono de piedra adornado con cabezas de carnero. Sostiene un cetro en forma de ankh y un orbe; detrás, montañas áridas.',
      en: 'A bearded man, armour beneath his red robe, seated on a stone throne decorated with rams’ heads. He holds an ankh-shaped sceptre and an orb; behind him, barren mountains.',
    },
    waite: { es: 'Estabilidad, poder, protección, realización; ayuda, razón, convicción; autoridad y voluntad.', en: 'Stability, power, protection, realization; aid, reason, conviction; authority and will.' },
    waiteReversed: { es: 'Benevolencia, compasión, crédito; obstrucción, inmadurez.', en: 'Benevolence, compassion, credit; obstruction, immaturity.' },
    goldenDawn: { attribution: { es: 'Aries', en: 'Aries' }, hebrewLetter: 'Heh' },
  },
  {
    n: 5, roman: 'V',
    name: { es: 'El Hierofante', en: 'The Hierophant' },
    marseille: 'Le Pape',
    visual: {
      es: 'Una figura religiosa con triple corona, sentada entre dos columnas, bendice con la mano derecha y sostiene un báculo de triple cruz. A sus pies, dos llaves cruzadas y dos clérigos tonsurados.',
      en: 'A religious figure with a triple crown, seated between two pillars, blesses with the right hand and holds a triple-cross staff. At his feet, two crossed keys and two tonsured clerics.',
    },
    waite: { es: 'Alianza matrimonial, cautiverio, servidumbre; misericordia y bondad; inspiración.', en: 'Marriage alliance, captivity, servitude; mercy and goodness; inspiration.' },
    waiteReversed: { es: 'Sociedad, buen entendimiento, concordia, exceso de amabilidad, debilidad.', en: 'Society, good understanding, concord, overkindness, weakness.' },
    goldenDawn: { attribution: { es: 'Tauro', en: 'Taurus' }, hebrewLetter: 'Vav' },
    note: {
      es: 'En el Tarot de Marsella es Le Pape (el Papa).',
      en: 'In the Tarot de Marseille he is Le Pape (the Pope).',
    },
  },
  {
    n: 6, roman: 'VI',
    name: { es: 'Los Enamorados', en: 'The Lovers' },
    marseille: "L'Amoureux",
    visual: {
      es: 'Un hombre y una mujer desnudos bajo un ángel con alas y un sol radiante. Detrás de la mujer, un árbol con una serpiente enroscada; detrás del hombre, un árbol con llamas. Una montaña se alza entre ambos.',
      en: 'A naked man and woman beneath a winged angel and a radiant sun. Behind the woman, a tree with a coiled serpent; behind the man, a tree bearing flames. A mountain rises between them.',
    },
    waite: { es: 'Atracción, amor, belleza, pruebas superadas.', en: 'Attraction, love, beauty, trials overcome.' },
    waiteReversed: { es: 'Fracaso, planes insensatos.', en: 'Failure, foolish designs.' },
    goldenDawn: { attribution: { es: 'Géminis', en: 'Gemini' }, hebrewLetter: 'Zayin' },
    note: {
      es: 'En el Tarot de Marsella, L’Amoureux muestra a un joven entre dos mujeres bajo un Cupido. Waite reemplaza la escena por una pareja inspirada en el Edén.',
      en: 'In the Tarot de Marseille, L’Amoureux shows a young man between two women beneath a Cupid. Waite replaces the scene with an Eden-like couple.',
    },
  },
  {
    n: 7, roman: 'VII',
    name: { es: 'El Carro', en: 'The Chariot' },
    marseille: 'Le Chariot',
    visual: {
      es: 'Un auriga coronado, con armadura y una vara, de pie en un carro con dosel de estrellas, tirado por dos esfinges: una negra y otra blanca. Detrás, una ciudad amurallada y un río.',
      en: 'A crowned charioteer in armour, holding a wand, stands in a chariot under a starry canopy, drawn by two sphinxes, one black and one white. Behind, a walled city and a river.',
    },
    waite: { es: 'Socorro, providencia; también guerra, triunfo, presunción, venganza, problemas.', en: 'Succour, providence; also war, triumph, presumption, vengeance, trouble.' },
    waiteReversed: { es: 'Disturbio, pelea, disputa, litigio, derrota.', en: 'Riot, quarrel, dispute, litigation, defeat.' },
    goldenDawn: { attribution: { es: 'Cáncer', en: 'Cancer' }, hebrewLetter: 'Cheth' },
  },
  {
    n: 8, roman: 'VIII',
    name: { es: 'La Fuerza', en: 'Strength' },
    marseille: 'La Force (XI)',
    visual: {
      es: 'Una mujer vestida de blanco, coronada de flores, sujeta con suavidad las fauces de un león. Sobre su cabeza flota el ocho horizontal.',
      en: 'A woman in white, crowned with flowers, gently holds the jaws of a lion. The horizontal eight floats above her head.',
    },
    waite: { es: 'Poder, energía, acción, coraje, magnanimidad; éxito completo y honores.', en: 'Power, energy, action, courage, magnanimity; complete success and honours.' },
    waiteReversed: { es: 'Despotismo, abuso de poder, debilidad, discordia.', en: 'Despotism, abuse of power, weakness, discord.' },
    goldenDawn: { attribution: { es: 'Leo', en: 'Leo' }, hebrewLetter: 'Teth' },
    note: {
      es: 'En el Tarot de Marsella la Fuerza es la XI y la Justicia la VIII. Waite las intercambió para ajustarlas a las correspondencias de la Golden Dawn.',
      en: 'In the Tarot de Marseille Strength is XI and Justice VIII. Waite swapped them to fit the Golden Dawn correspondences.',
    },
  },
  {
    n: 9, roman: 'IX',
    name: { es: 'El Ermitaño', en: 'The Hermit' },
    marseille: "L'Hermite",
    visual: {
      es: 'Un anciano con capa gris, de pie en una cumbre nevada, sostiene en alto una linterna con una estrella de seis puntas y se apoya en un bastón.',
      en: 'An old man in a grey cloak, standing on a snowy peak, holds up a lantern containing a six-pointed star and leans on a staff.',
    },
    waite: { es: 'Prudencia, circunspección; también traición, disimulo, picardía, corrupción.', en: 'Prudence, circumspection; also treason, dissimulation, roguery, corruption.' },
    waiteReversed: { es: 'Ocultamiento, disfraz, política, miedo, cautela irracional.', en: 'Concealment, disguise, policy, fear, unreasoned caution.' },
    goldenDawn: { attribution: { es: 'Virgo', en: 'Virgo' }, hebrewLetter: 'Yod' },
  },
  {
    n: 10, roman: 'X',
    name: { es: 'La Rueda de la Fortuna', en: 'Wheel of Fortune' },
    marseille: 'La Roue de Fortune',
    visual: {
      es: 'Una rueda con las letras T A R O alternadas con letras hebreas y signos alquímicos. Arriba, una esfinge con espada; a un lado, una serpiente; abajo, una figura con cabeza de chacal. En las esquinas, cuatro criaturas aladas leen libros.',
      en: 'A wheel bearing the letters T A R O alternating with Hebrew letters and alchemical signs. On top, a sphinx with a sword; to one side, a serpent; below, a jackal-headed figure. In the corners, four winged creatures read books.',
    },
    waite: { es: 'Destino, fortuna, éxito, elevación, suerte, felicidad.', en: 'Destiny, fortune, success, elevation, luck, felicity.' },
    waiteReversed: { es: 'Aumento, abundancia, exceso.', en: 'Increase, abundance, superfluity.' },
    goldenDawn: { attribution: { es: 'Júpiter', en: 'Jupiter' }, hebrewLetter: 'Kaph' },
  },
  {
    n: 11, roman: 'XI',
    name: { es: 'La Justicia', en: 'Justice' },
    marseille: 'La Justice (VIII)',
    visual: {
      es: 'Una figura coronada, vestida de rojo, sentada entre dos columnas. Alza una espada con la mano derecha y sostiene una balanza con la izquierda.',
      en: 'A crowned figure in red, seated between two pillars, raises a sword in the right hand and holds scales in the left.',
    },
    waite: { es: 'Equidad, rectitud, probidad; triunfo de la parte que lo merece en un juicio.', en: 'Equity, rightness, probity; triumph of the deserving side in law.' },
    waiteReversed: { es: 'La ley en todas sus ramas, complicaciones legales, prejuicio, severidad excesiva.', en: 'Law in all its departments, legal complications, bias, excessive severity.' },
    goldenDawn: { attribution: { es: 'Libra', en: 'Libra' }, hebrewLetter: 'Lamed' },
    note: {
      es: 'En el Tarot de Marsella la Justicia es la VIII; en el RWS pasa a ser la XI.',
      en: 'In the Tarot de Marseille Justice is VIII; in the RWS it becomes XI.',
    },
  },
  {
    n: 12, roman: 'XII',
    name: { es: 'El Colgado', en: 'The Hanged Man' },
    marseille: 'Le Pendu',
    visual: {
      es: 'Un hombre suspendido cabeza abajo de un árbol en forma de T, atado por un pie, con la otra pierna cruzada detrás. Tiene las manos a la espalda y un halo alrededor de la cabeza.',
      en: 'A man hangs upside down from a T-shaped tree, tied by one foot, the other leg crossed behind. His hands are behind his back and a halo surrounds his head.',
    },
    waite: { es: 'Sabiduría, circunspección, discernimiento, pruebas, sacrificio, intuición, profecía.', en: 'Wisdom, circumspection, discernment, trials, sacrifice, intuition, prophecy.' },
    waiteReversed: { es: 'Egoísmo, la multitud, el cuerpo político.', en: 'Selfishness, the crowd, body politic.' },
    goldenDawn: { attribution: { es: 'Agua', en: 'Water' }, hebrewLetter: 'Mem' },
  },
  {
    n: 13, roman: 'XIII',
    name: { es: 'La Muerte', en: 'Death' },
    marseille: 'XIII (tradicionalmente sin nombre)',
    visual: {
      es: 'Un esqueleto con armadura monta un caballo blanco y lleva un estandarte negro con una rosa blanca. Un rey yace caído; un obispo, una doncella y un niño están ante él. Al fondo, un sol entre dos torres.',
      en: 'An armoured skeleton rides a white horse and carries a black banner with a white rose. A king lies fallen; a bishop, a maiden and a child stand before him. In the distance, a sun between two towers.',
    },
    waite: { es: 'Fin, mortalidad, destrucción, corrupción.', en: 'End, mortality, destruction, corruption.' },
    waiteReversed: { es: 'Inercia, sueño, letargo, petrificación; esperanza destruida.', en: 'Inertia, sleep, lethargy, petrifaction; hope destroyed.' },
    goldenDawn: { attribution: { es: 'Escorpio', en: 'Scorpio' }, hebrewLetter: 'Nun' },
    note: {
      es: 'En muchos tarots de Marsella la carta XIII no lleva nombre impreso.',
      en: 'In many Marseille tarots card XIII bears no printed name.',
    },
  },
  {
    n: 14, roman: 'XIV',
    name: { es: 'La Templanza', en: 'Temperance' },
    marseille: 'Tempérance',
    visual: {
      es: 'Un ángel alado, con un triángulo dentro de un cuadrado en el pecho, vierte agua de una copa a otra. Tiene un pie en el agua y otro en tierra; al fondo, un camino lleva a unas montañas bajo una corona luminosa.',
      en: 'A winged angel, a triangle within a square on the breast, pours water from one cup into another. One foot is in the water, the other on land; behind, a path leads to mountains beneath a shining crown.',
    },
    waite: { es: 'Economía, moderación, frugalidad, administración, acomodo.', en: 'Economy, moderation, frugality, management, accommodation.' },
    waiteReversed: { es: 'Asuntos de iglesias y sectas; desunión, combinaciones desafortunadas, intereses en pugna.', en: 'Things connected with churches and sects; disunion, unfortunate combinations, competing interests.' },
    goldenDawn: { attribution: { es: 'Sagitario', en: 'Sagittarius' }, hebrewLetter: 'Samekh' },
  },
  {
    n: 15, roman: 'XV',
    name: { es: 'El Diablo', en: 'The Devil' },
    marseille: 'Le Diable',
    visual: {
      es: 'Una figura con cuernos de macho cabrío y alas de murciélago, con un pentagrama invertido sobre la frente, se posa sobre un pedestal. Un hombre y una mujer con cuernos y colas están encadenados a él con cadenas holgadas.',
      en: 'A figure with goat horns and bat wings, an inverted pentagram on the brow, perches on a pedestal. A horned and tailed man and woman are chained to it with loose chains.',
    },
    waite: { es: 'Devastación, violencia, vehemencia, esfuerzos extraordinarios, fuerza, fatalidad.', en: 'Ravage, violence, vehemence, extraordinary efforts, force, fatality.' },
    waiteReversed: { es: 'Fatalidad maligna, debilidad, mezquindad, ceguera.', en: 'Evil fatality, weakness, pettiness, blindness.' },
    goldenDawn: { attribution: { es: 'Capricornio', en: 'Capricorn' }, hebrewLetter: 'Ayin' },
  },
  {
    n: 16, roman: 'XVI',
    name: { es: 'La Torre', en: 'The Tower' },
    marseille: 'La Maison Dieu',
    visual: {
      es: 'Un rayo alcanza una torre sobre un peñasco; la corona de su cima se desprende. Dos figuras caen al vacío entre llamas y gotas de fuego.',
      en: 'Lightning strikes a tower on a crag; the crown at its top is knocked off. Two figures fall headlong amid flames and drops of fire.',
    },
    waite: { es: 'Miseria, angustia, adversidad, calamidad, deshonra, engaño, ruina; catástrofe imprevista.', en: 'Misery, distress, adversity, calamity, disgrace, deception, ruin; unforeseen catastrophe.' },
    waiteReversed: { es: 'Lo mismo en menor grado; también opresión, encarcelamiento, tiranía.', en: 'The same in a lesser degree; also oppression, imprisonment, tyranny.' },
    goldenDawn: { attribution: { es: 'Marte', en: 'Mars' }, hebrewLetter: 'Peh' },
    note: {
      es: 'En el Tarot de Marsella se llama La Maison Dieu (la Casa de Dios).',
      en: 'In the Tarot de Marseille it is called La Maison Dieu (the House of God).',
    },
  },
  {
    n: 17, roman: 'XVII',
    name: { es: 'La Estrella', en: 'The Star' },
    marseille: "L'Étoile",
    visual: {
      es: 'Una mujer desnuda, arrodillada junto a un estanque, vierte agua de dos jarras: una sobre el agua y otra sobre la tierra. Arriba brillan una gran estrella de ocho puntas y siete más pequeñas; un pájaro se posa en un árbol.',
      en: 'A naked woman kneeling by a pool pours water from two jugs, one onto the water and one onto the land. Above shine a great eight-pointed star and seven smaller ones; a bird perches in a tree.',
    },
    waite: { es: 'Pérdida, robo, privación, abandono; según otra lectura, esperanza y buenas perspectivas.', en: 'Loss, theft, privation, abandonment; another reading says hope and bright prospects.' },
    waiteReversed: { es: 'Arrogancia, altivez, impotencia.', en: 'Arrogance, haughtiness, impotence.' },
    goldenDawn: { attribution: { es: 'Acuario', en: 'Aquarius' }, hebrewLetter: 'Tzaddi' },
  },
  {
    n: 18, roman: 'XVIII',
    name: { es: 'La Luna', en: 'The Moon' },
    marseille: 'La Lune',
    visual: {
      es: 'Una luna con rostro brilla entre dos torres. Abajo, un perro y un lobo le aúllan y un cangrejo de río sale de un estanque; un sendero serpentea hacia las montañas.',
      en: 'A moon with a face shines between two towers. Below, a dog and a wolf howl at it and a crayfish emerges from a pool; a path winds towards the mountains.',
    },
    waite: { es: 'Enemigos ocultos, peligro, calumnia, oscuridad, terror, engaño, error.', en: 'Hidden enemies, danger, calumny, darkness, terror, deception, error.' },
    waiteReversed: { es: 'Inestabilidad, inconstancia, silencio, engaño y error en menor grado.', en: 'Instability, inconstancy, silence, lesser degrees of deception and error.' },
    goldenDawn: { attribution: { es: 'Piscis', en: 'Pisces' }, hebrewLetter: 'Qoph' },
  },
  {
    n: 19, roman: 'XIX',
    name: { es: 'El Sol', en: 'The Sun' },
    marseille: 'Le Soleil',
    visual: {
      es: 'Un niño desnudo, coronado de flores, monta un caballo blanco y sostiene un estandarte rojo. Detrás, un muro con girasoles; arriba, un gran sol con rostro.',
      en: 'A naked child crowned with flowers rides a white horse and holds a red banner. Behind, a wall with sunflowers; above, a great sun with a face.',
    },
    waite: { es: 'Felicidad material, matrimonio afortunado, satisfacción.', en: 'Material happiness, fortunate marriage, contentment.' },
    waiteReversed: { es: 'Lo mismo en menor medida.', en: 'The same in a lesser sense.' },
    goldenDawn: { attribution: { es: 'Sol', en: 'Sun' }, hebrewLetter: 'Resh' },
    note: {
      es: 'Muchos tarots de Marsella muestran a dos niños bajo el sol; el jinete solitario es una invención del RWS.',
      en: 'Many Marseille tarots show two children beneath the sun; the lone rider is an RWS innovation.',
    },
  },
  {
    n: 20, roman: 'XX',
    name: { es: 'El Juicio', en: 'Judgement' },
    marseille: 'Le Jugement',
    visual: {
      es: 'Un ángel toca una trompeta de la que cuelga un estandarte con una cruz. Abajo, hombres, mujeres y niños se levantan de sus ataúdes con los brazos abiertos; al fondo, montañas nevadas.',
      en: 'An angel blows a trumpet hung with a banner bearing a cross. Below, men, women and children rise from their coffins with open arms; behind, snowy mountains.',
    },
    waite: { es: 'Cambio de posición, renovación, desenlace.', en: 'Change of position, renewal, outcome.' },
    waiteReversed: { es: 'Debilidad, pusilanimidad, simpleza; también deliberación, decisión, sentencia.', en: 'Weakness, pusillanimity, simplicity; also deliberation, decision, sentence.' },
    goldenDawn: { attribution: { es: 'Fuego', en: 'Fire' }, hebrewLetter: 'Shin' },
  },
  {
    n: 21, roman: 'XXI',
    name: { es: 'El Mundo', en: 'The World' },
    marseille: 'Le Monde',
    visual: {
      es: 'Una figura danzante, envuelta en un manto, sostiene dos varas dentro de una guirnalda ovalada atada con cintas rojas. En las esquinas, un ángel, un águila, un toro y un león.',
      en: 'A dancing figure wrapped in a sash holds two wands within an oval wreath tied with red ribbons. In the corners, an angel, an eagle, a bull and a lion.',
    },
    waite: { es: 'Éxito asegurado, recompensa, viaje, ruta, emigración, cambio de lugar.', en: 'Assured success, recompense, voyage, route, emigration, change of place.' },
    waiteReversed: { es: 'Inercia, fijeza, estancamiento, permanencia.', en: 'Inertia, fixity, stagnation, permanence.' },
    goldenDawn: { attribution: { es: 'Saturno', en: 'Saturn' }, hebrewLetter: 'Tav' },
  },
];

export function cardImage(n: number, large = false): string {
  const id = `m${String(n).padStart(2, '0')}`;
  return `${import.meta.env.BASE_URL}cards/${id}${large ? '_lg' : ''}.jpg`;
}

export function getMajor(n: number): MajorArcanum | undefined {
  return MAJORS.find((m) => m.n === n);
}
