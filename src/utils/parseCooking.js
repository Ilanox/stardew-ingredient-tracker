import recipes from '../data/recipes.json';

const allRecipes = Object.keys(recipes).map(name => ({ name, ...recipes[name] }));


// Recipe translations: Stardew save quirks
const RECIPE_TRANSLATIONS = {
    "Cheese Cauli.": "Cheese Cauliflower",
    "Vegetable Stew": "Vegetable Medley",
    "Eggplant Parm.": "Eggplant Parmesan",
    "Cookies": "Cookie",
    "Cran. Sauce": "Cranberry Sauce",
    "Dish o' The Sea": "Dish O' The Sea"
  };
  
  const RECIPE_IDS = {
    194: "Fried Egg",
    195: "Omelet",
    196: "Salad",
    197: "Cheese Cauliflower",
    198: "Baked Fish",
    199: "Parsnip Soup",
    200: "Vegetable Medley",
    201: "Complete Breakfast",
    202: "Fried Calamari",
    203: "Strange Bun",
    204: "Lucky Lunch",
    205: "Fried Mushroom",
    206: "Pizza",
    207: "Bean Hotpot",
    208: "Glazed Yams",
    209: "Carp Surprise",
    210: "Hashbrowns",
    211: "Pancakes",
    212: "Salmon Dinner",
    213: "Fish Taco",
    214: "Crispy Bass",
    215: "Pepper Poppers",
    216: "Bread",
    218: "Tom Kha Soup",
    219: "Trout Soup",
    220: "Chocolate Cake",
    221: "Pink Cake",
    222: "Rhubarb Pie",
    223: "Cookie",
    224: "Spaghetti",
    225: "Fried Eel",
    226: "Spicy Eel",
    227: "Sashimi",
    228: "Maki Roll",
    229: "Tortilla",
    230: "Red Plate",
    231: "Eggplant Parmesan",
    232: "Rice Pudding",
    233: "Ice Cream",
    234: "Blueberry Tart",
    235: "Autumn's Bounty",
    236: "Pumpkin Soup",
    237: "Super Meal",
    238: "Cranberry Sauce",
    239: "Stuffing",
    240: "Farmer's Lunch",
    241: "Survival Burger",
    242: "Dish O' The Sea",
    243: "Miner's Treat",
    244: "Roots Platter",
    456: "Algae Soup",
    457: "Pale Broth",
    604: "Plum Pudding",
    605: "Artichoke Dip",
    606: "Stir Fry",
    607: "Roasted Hazelnuts",
    608: "Pumpkin Pie",
    609: "Radish Salad",
    610: "Fruit Salad",
    611: "Blackberry Cobbler",
    612: "Cranberry Candy",
    618: "Bruschetta",
    648: "Coleslaw",
    649: "Fiddlehead Risotto",
    651: "Poppyseed Muffin",
    727: "Chowder",
    728: "Fish Stew",
    729: "Escargot",
    730: "Lobster Bisque",
    731: "Maple Bar",
    732: "Crab Cakes",
    // Add more as needed (for expansions)
  };
  
  function normalizeRecipeName(name) {
    return RECIPE_TRANSLATIONS[name] || name;
  }
  
  export function extractCookedRecipesFromPlayer(playerElem) {
    const cooked = [];
    const known = [];
  
    // Find recipesCooked inside <player>
    const recipesCooked = playerElem.getElementsByTagName('recipesCooked')[0];
    const cookingRecipes = playerElem.getElementsByTagName('cookingRecipes')[0];
    if (!recipesCooked) return [];
    if (!cookingRecipes) return [];
  

    // Each item has a key (recipe ID) and value (number cooked)
    for (const item of recipesCooked.getElementsByTagName('item')) {
      // <key><int>123</int></key>
      const keyElem = item.getElementsByTagName('key')[0];
      let recipeId = null;
      if (keyElem) {
        // Some use <int>, some use <string>
        const intElem = keyElem.getElementsByTagName('int')[0];
        if (intElem) recipeId = intElem.textContent;
        else {
          // Some modded saves may use <string>
          const strElem = keyElem.getElementsByTagName('string')[0];
          if (strElem) recipeId = strElem.textContent;
        }
      }
      // <value><int>1</int></value>
      const valElem = item.getElementsByTagName('value')[0];
      const count = valElem ? Number(valElem.textContent) : 0;
      if (count > 0 && recipeId && RECIPE_IDS[recipeId]) {
        let rname = RECIPE_IDS[recipeId];
        rname = normalizeRecipeName(rname);
        cooked.push(rname);
      }
    }

    for (const item of cookingRecipes.getElementsByTagName('item')) {
        // <key><int>123</int></key>
        const keyElem = item.getElementsByTagName('key')[0];
        let recipeName = null;
        if (keyElem) {
          // Some use <int>, some use <string>
          const intElem = keyElem.getElementsByTagName('int')[0];
          if (intElem) recipeName = intElem.textContent;
          else {
            // Some modded saves may use <string>
            const strElem = keyElem.getElementsByTagName('string')[0];
            if (strElem) recipeName = strElem.textContent;
          }
        }
        // <value><int>1</int></value>
        const valElem = item.getElementsByTagName('value')[0];
        const count = valElem ? Number(valElem.textContent) : 0;
        if (count == 0 && recipeName) {
          recipeName = normalizeRecipeName(recipeName);
          known.push(recipeName);
        }
    }

    const missing = allRecipes.filter(item => !known.includes(item.name) && !cooked.includes(item));
  
    // Optionally dedupe
    return {
        completed: [...cooked],
        known: known,
        missing: missing
      };
  }
  