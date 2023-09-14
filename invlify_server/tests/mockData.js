/* Customer */
const SHORT_CUSTOMER_LIST = {
  1: {
    name: 'Planta Queen',
    billingAddress: '413 N Clark St, Chicago, IL 60654',
  },
  2: {
    name: 'Chicago Athletic Club',
    billingAddress: '12 South Michicagn Ave, Chicago, IL 60603',
  },
}

const FULL_CUSTOMER_LIST = {
  61: {
    name: 'Acanto Restaurant',
    email: { Address: 'Canderson@gagehospitality.com' },
  },
  62: {
    name: 'Alinea',
    email: {
      Address: 'steven.carlson@alinearestaurant.com, ap@alinearestaurant.com',
    },
  },
  63: {
    name: 'Alkaline Healing Herbs',
    email: { Address: 'info@alkalinehealingherbs.com' },
  },
  64: {
    name: 'All Meal Prep',
    email: { Address: 'joseph@allmealprep.com' },
  },
  65: { name: 'alla vita', email: { Address: 'allavitachef@gmail.com' } },
  66: {
    name: 'Alpha Baking',
    email: { Address: 'invoices@alphabaking.com' },
  },
  67: { name: 'Amaru', email: { Address: 'Blander@delalmarest.com' } },
  68: {
    name: 'Apolonia',
    email: { Address: 'jws@apoloniachicago.com, shin@smgrestaurants.com' },
  },
  69: {
    name: 'Artisan Specialty Foods Inc',
    email: { Address: 'asfaccounting@artisanspecialty.com' },
  },
  70: { name: 'Avec', email: { Address: 'dylan@avecrestaurant.com' } },
  71: {
    name: 'Avec River North',
    email: { Address: 'ross@avecrestaurant.com, kathy@oneoffhospitality.com' },
  },
  72: { name: 'Avli (Loop)', email: { Address: 'kim@avli.us' } },
  73: {
    name: 'B Gabs Goodies',
    email: { Address: 'bgabsvegankitchen@outlook.com' },
  },
  74: { name: 'bar chido', email: { Address: 'jonathan@barchido.com' } },
  75: {
    name: 'Bar Siena (Old Orchard)',
    email: { Address: 'payables.oo@barsiena.com' },
  },
  76: {
    name: 'Bar Siena (West Loop)',
    email: { Address: 'jacob@barsiena.com, payables@barsiena.com' },
  },
  77: {
    name: 'Bennett Farms Michigan',
    email: { Address: 'bennettfarmsmichigan@gmail.com' },
  },
  78: { name: 'Betsy', email: { Address: 'BNathan@pagodared.con' } },
  79: {
    name: 'Big Star Mariscos',
    email: {
      Address: 'chrismiller@oneoffhospitality.com, kathy@oneoffhospitality.com',
    },
  },
  80: {
    name: 'Big Star Wicker',
    email: {
      Address:
        'chrismiller@bigstarchicago.com, cristina@bigstarchicago.com, kathy@oneoffhospitality.com',
    },
  },
  81: {
    name: 'Big Star Wrigley',
    email: {
      Address: 'chrismiller@bigstarchicago.com, kathy@oneoffhospitality.com',
    },
  },
  82: {
    name: 'Bloom Plant Based Kitchen',
    email: { Address: 'blander@delalmarest.com' },
  },
  83: { name: 'BLT Steak' },
  84: { name: 'Boeufhaus', email: { Address: 'joseph@boeufhaus.com' } },
  85: { name: 'Boka Restaurant', email: { Address: 'office@bokagrp.com' } },
  86: {
    name: 'Brite Donuts and Baked Goods',
    email: { Address: 'sieger@enjoybrite.com' },
  },
  87: {
    name: "CAA/Cindy's Chicago Athletic Club",
    email: { Address: 'ap@chicagoathletichotel.com' },
  },
  88: {
    name: 'Cabra',
    email: {
      Address:
        'office@cabrachicago.com, Odalis@bokagrp.com, iexline@bokagrp.com',
    },
  },
  89: { name: 'Cat-Su Sando', email: { Address: 'shawn@cat-susando.com' } },
  90: { name: 'Cira', email: { Address: 'nick@cirachicago.com' } },
  91: {
    name: 'Closed Loop Farms',
    email: { Address: 'sales@closedloop.farm' },
  },
  92: {
    name: 'Conscious Plates',
    email: { Address: 'latrell@consciousplates.com' },
  },
  93: {
    name: 'Cooks Canvas',
    email: { Address: 'acookscanvas@gmail.com' },
  },
  94: { name: 'Coralee', email: { Address: 'vremblos@gmail.com' } },
  95: { name: 'DePaul', email: { Address: 'sales@windycity.com' } },
  96: {
    name: 'Dill Pickle Co Op',
    email: { Address: 'jesskmieciak@dillpickle.coop, ap@dillpickle.coop' },
  },
  97: {
    name: 'Don Bucio Taqueria',
    email: { Address: 'Kbusta@delalmarest.com, blander@delalmarest.com' },
  },
  98: {
    name: 'Doves',
    email: {
      Address: 'chrismiller@bigstarchicago.com, kathy@oneoffhospitality.com',
    },
  },
  99: {
    name: 'Duck Duck Goat',
    email: { Address: 'office@duckduckgoatchicago.com' },
  },
  100: {
    name: 'duseks',
    email: { Address: 'geofft@thaliahallchicago.com' },
  },
  101: {
    name: 'Earth Angel Mushrooms',
    email: { Address: 'EarthAngelMushrooms@gmail.com' },
  },
  102: {
    name: 'Eat Second Generation',
    email: { Address: 'morgan@eatsecondgen.com, rehan@eatsecondgen.com' },
  },
  103: { name: 'Edaphon Farm', email: { Address: 'Edaphonfarm@gmail.com' } },
  104: {
    name: 'Edgewater Produce',
    email: { Address: 'ddallasatc@gmail.com' },
  },
  105: { name: 'El Che', email: { Address: 'ameyer@elchebarchicago.com' } },
  106: {
    name: 'El Hongo Magico Tacos',
    email: { Address: 'carlos@tacoselhongomagico.com' },
  },
  107: { name: 'Entree', email: { Address: 'chris@joinentree.com' } },
  108: {
    name: 'Etta Bucktown',
    email: {
      Address:
        'J.peterson@ettacollective.com, e.abrams@ettacollective.com, e.wilson@ettacollective.com',
    },
  },
  109: {
    name: 'Etta River North',
    email: {
      Address:
        'k.dunn@ettacollective.com, c.farmer@ettacollective.com, w.schlaeger@ettacollective.com',
    },
  },
  110: { name: 'Euro USA' },
  111: { name: 'Farmers Insurance' },
  112: { name: 'Farmers Market Cash Sales' },
  113: {
    name: 'Four Star Mushroom',
    email: { Address: 'Joe@fourstarmushrooms.com' },
  },
  114: {
    name: 'Frontera Group',
    email: { Address: 'rjames@fronteragrill.net' },
  },
  115: {
    name: 'Fulton Market Kitchen',
    email: { Address: 'chris.curren@icloud.com' },
  },
  116: {
    name: 'GIrl and the Goat',
    email: { Address: 'office@girlandthegoat.com' },
  },
  117: { name: 'Green Market Link Reimbursement' },
  118: { name: 'Gretel', email: { Address: 'graham.akroyd.ga@gmail.com' } },
  119: {
    name: 'Harvest Time Foods',
    email: { Address: 'Chris@harvesttimefoods.com' },
  },
  120: {
    name: 'Heritage',
    email: { Address: 'Guy.meikle@heritage-chicago.com' },
  },
  121: {
    name: 'Homestead on The Roof',
    email: {
      Address:
        'jbadger@thefifty50.com, kbarr@thefifty50.com, Imangiameli@thefifty50.com',
    },
  },
  122: { name: 'Illinois Secretary of State' },
  123: { name: 'Jaleo', email: { Address: 'miguelIM@jaleo.com' } },
  124: { name: 'Jethro C& C Ent' },
  125: {
    name: 'Johnny Stan',
    email: { Address: 'johnny@windycitymushroom.com' },
  },
  126: { name: 'KitchFix', email: { Address: 'm.tsonton@kitchfix.com' } },
  127: { name: 'L&M Fine Foods', email: { Address: 'ian@Imfinefoods.com' } },
  128: { name: 'Liem Le', email: { Address: 'liem.le@gmail.com' } },
  129: {
    name: "Little Eddie's Pizza",
    email: { Address: 'Markkeltyjr@gmail.com' },
  },
  130: {
    name: 'Little Goat',
    email: { Address: 'office@littlegoatchicago.com, odalis@bokagrp.com' },
  },
  131: { name: 'Local Foods', email: { Address: 'sean@localfoods.com' } },
  132: {
    name: 'Maple and Ash',
    email: {
      Address:
        'aadler@mapleandash.com, maplehg@documents.resaurant365.com, Anunez@mapleanddash.com',
    },
  },
  133: {
    name: "Meek's Vegan Kitchen",
    email: { Address: 'tone@360bam.com' },
  },
  134: { name: 'Mike Rericha', email: { Address: 'rericha@msn.com' } },
  135: {
    name: 'MIke Sundstrom Profesor Pizza',
    email: { Address: 'mikesundstrom19@gmail.com' },
  },
  136: {
    name: 'Moes',
    email: { Address: 'Kristopher.Taylor@oakviewgroup.com' },
  },
  137: { name: 'Mon Ami Gabi', email: { Address: 'dkoehn@leye.com' } },
  138: {
    name: 'Mushroom Queen',
    email: { Address: 'me@daishumcgriff.com' },
  },
  139: {
    name: 'Niche Catering',
    email: { Address: 'alexfrias40@gmail.com' },
  },
  140: {
    name: 'Nico Osteria',
    email: { Address: 'jacob.verstegen@thompsonhotels.com' },
  },
  141: {
    name: 'Ocean Prime',
    email: { Address: 'chef.opchicago@cameronmitchell.com' },
  },
  142: { name: 'One North Kitchen & Bar' },
  143: {
    name: "Pete's Fresh Market",
    email: { Address: 'jflores@petesfresh.com' },
  },
  144: {
    name: 'Pizza Friendly Pizza',
    email: { Address: 'billing@16oncenterchicago.com' },
  },
  145: {
    name: 'plant chicago',
    email: { Address: 'kathleen@plantchicago.org' },
  },
  146: {
    name: 'Planta Queen',
    email: {
      Address:
        'kelsey.k@plantahq.com, prnhoh@plantahq.com, dragana@plantahq.com',
    },
  },
  147: {
    name: 'professor pizza',
    email: { Address: 'grantjohnson2455@gmail.com' },
  },
  148: {
    name: 'Publican Bread',
    email: {
      Address: 'mac@oneoffhospitality.com, kathy@oneoffhospitality.com',
    },
  },
  149: {
    name: 'Publican Quality Meats',
    email: {
      Address: 'rob@publicanqualitymeats.com, kathy@oneoffhospitality.com',
    },
  },
  150: {
    name: 'Publican Restaurant',
    email: {
      Address: 'vinny@oneoffhospitality.com, kathy@oneoffhospitality.com',
    },
  },
  151: { name: 'R & R', email: { Address: 'nick@rrcultivation.com' } },
  152: {
    name: 'Range Restaurant',
    email: { Address: 'luis.p@rangechicago.com' },
  },
  153: { name: 'RAWNRGY' },
  154: {
    name: 'Regalis Chicago LLC',
    email: { Address: 'benjamin@regalisfoods.com' },
  },
  155: {
    name: 'RFD',
    email: { Address: 'ap@grecoandsons.com, CRotramel@RFDchicago.com' },
  },
  156: {
    name: 'Open Produce',
    email: { Address: 'buyers@openproduce.org' },
  },
  157: { name: 'RPM Italian' },
  158: { name: 'RPM Seafood', email: { Address: 'bbroskey@leye.com' } },
  159: {
    name: 'RPM Steak',
    email: { Address: 'aoko@leye.com, rforsman@leye.com' },
  },
  160: { name: 'S.K.Y', email: { Address: 'fbt@skyrestaurantchicago.com' } },
  161: {
    name: 'Sienna Tavern',
    email: { Address: 'chefs@sienatavern.com' },
  },
  162: { name: 'Spira Farms', email: { Address: 'contact@spira.farm' } },
  163: {
    name: 'Spirit Elephant',
    email: { Address: 'giriarte@wildthingrestaurants.com' },
  },
  164: { name: 'Spotify' },
  165: {
    name: 'starfarms',
    email: { Address: 'starfarmchicago@gmail.com' },
  },
  166: {
    name: 'Sugar Beet Food Co-Op',
    email: { Address: 'produce@sugarbeet.coop' },
  },
  167: {
    name: 'Sweet Vegan Bakes',
    email: { Address: 'management@sweetveganbakes.com' },
  },
  168: {
    name: 'Tastes of Bri',
    email: { Address: 'tastesofbri@gmail.com' },
  },
  169: {
    name: 'The Black Vegan Restaurant',
    email: { Address: 'rcityunlimited@gmail.com' },
  },
  170: {
    name: 'The Gage',
    email: {
      Address:
        'dglimore@gagehospitality.com, jhernandez@thegagechicago.com, finance@gagehospitality.com',
    },
  },
  171: {
    name: 'The Paramount Group',
    email: { Address: 'accounting@tpgchi.com' },
  },
  172: {
    name: 'The Roof Crop',
    email: { Address: 'melanie@theroofcrop.com' },
  },
  173: { name: 'Thrive Mushroom' },
  174: {
    name: 'Tortello',
    email: { Address: 'ayse@ehsbusinesssolutions.com' },
  },
  175: {
    name: 'Tottos Market',
    email: { Address: 'matt@tottosmarket.com, bookkeeping@tottosmarket.com' },
  },
  176: {
    name: 'Urban Canopy, Inc.',
    email: { Address: 'lucsa@theurbancanopy.org' },
  },
  177: { name: 'Valhalla', email: { Address: 'jaf@Valhallachicago.com' } },
  178: {
    name: 'Via Carducci La Sorella',
    email: { Address: 'scalzo63@aol.com' },
  },
  179: {
    name: 'Vie Restaurant',
    email: { Address: 'franke.vazquez@gmail.com' },
  },
  180: {
    name: 'Village Farm Stand',
    email: { Address: 'accounting@villagefarmstand.com' },
  },
  181: {
    name: 'Violet Hour',
    email: { Address: 'cristina@bigstarchicago.com' },
  },
  182: {
    name: 'Vosges Haut-Chocolat',
    email: { Address: 'Katrina@vosgeschocolate.com' },
  },
  183: { name: 'Vu Roofttop', email: { Address: 'hseis@thefifty50.com' } },
  184: {
    name: 'Wabash Seafood',
    email: { Address: 'tservi@wabashseafood.net' },
  },
  185: { name: 'Wazwan', email: { Address: 'chris@wazwanchicago.com' } },
  186: {
    name: 'Westmoreland Country Club',
    email: { Address: 'a.ono@westmorelandcc.org' },
  },
  187: { name: 'Test Restaurant', email: { Address: 'support@lcavr.com' } },
}

/* Product */
const SHORT_PRODUCT_LIST = {
  1: { unitPrice: 10, name: 'Asian Fungitarian' },
  5: { unitPrice: 7.5, name: 'Combs Tooth' },
  7: { unitPrice: 10, name: 'Italian Fungitarian' },
}

const FULL_PRODUCT_LIST = {
  1: { unitPrice: 0, name: 'Services' },
  2: { unitPrice: 0, name: 'Hours' },
  19: { unitPrice: 7.5, name: 'Black Pearl King Trumpet' },
  20: { unitPrice: 5, name: 'Mixed Oysters' },
  21: { unitPrice: 7.5, name: 'Chestnut' },
  22: { unitPrice: 10, name: 'Maitake' },
  23: { unitPrice: 10, name: 'Asian Fungitarian' },
  24: { unitPrice: 7.5, name: 'Combs Tooth' },
  25: { unitPrice: 10, name: 'Italian Fungitarian' },
  26: { unitPrice: 10, name: 'Tinga Fungitarian' },
  27: { unitPrice: 7.5, name: 'Gourmet Blend' },
  28: { unitPrice: 7.5, name: 'Lions Mane/Combs Tooth' },
  29: { unitPrice: 10, name: 'Original Fungitarian' },
  30: { unitPrice: 10, name: 'BBQ Fungitarian' },
}

module.exports = {
  SHORT_CUSTOMER_LIST,
  FULL_CUSTOMER_LIST,
  SHORT_PRODUCT_LIST,
  FULL_PRODUCT_LIST,
}
