import recipes from '../data/recipes.json';

/**
 * Given a parsed XML Document of a Stardew save, returns an array of unique recipe names
 * that the player knows or has cooked.
 * 
 * @param {Document} xmlDoc - The XML Document parsed via DOMParser
 * @returns {string[]} - List of completed recipe names
 */
export function extractCookedRecipes(xmlDoc) {
  const done = new Set();

  // Known cooking recipes
  xmlDoc.querySelectorAll('cookingRecipes > item').forEach(item => {
    const key = item.querySelector('key > string');
    if (key?.textContent) done.add(key.textContent);
  });

  // Cooked recipes by ID
  xmlDoc.querySelectorAll('recipesCooked > item').forEach(item => {
    const key = item.querySelector('key');
    if (key?.textContent) done.add(key.textContent);
  });

  return Array.from(done);
}

/**
 * Extracts the player's name from a Stardew Valley save XML Document.
 * 
 * @param {Document} xmlDoc - The parsed XML Document from the save file
 * @returns {string} - The player's name (e.g., "Ilan(ox) Levy")
 */
export function extractPlayerName(xmlDoc) {
  const name = xmlDoc.querySelector('SaveGame > player > name')?.textContent || 'Player';
  const farmName = xmlDoc.querySelector('SaveGame > player > farmName')?.textContent;
  return farmName ? `${name}` : name;
}

/**
 * Extracts completed, known, and missing recipes.
 * 
 * @param {Document} xmlDoc - The parsed XML Document from the save file
 * @returns {{ completed: string[], known: string[], missing: string[] }}
 */
export function extractRecipeProgress(xmlDoc) {
  const known = new Set();
  const completed = new Set();

  // Known cooking recipes
  xmlDoc.querySelectorAll('cookingRecipes > item').forEach(item => {
    const key = item.querySelector('key > string');
    if (key?.textContent) known.add(key.textContent);
  });

  // Cooked recipes by ID
  xmlDoc.querySelectorAll('recipesCooked > item').forEach(item => {
    const key = item.querySelector('key');
    if (key?.textContent) completed.add(key.textContent);
  });


  const allRecipes = Object.keys(recipes).map(name => ({ name, ...recipes[name] }));

  const allRecipesMap = Object.fromEntries(allRecipes.map(r => [r.name, r]));

  const knownNotCompleted = [...known].filter(name => !completed.has(name));
  const missing = allRecipes.filter(name => !known.has(name) && !completed.has(name));

  return {
    completed: [...completed],
    known: knownNotCompleted,
    missing
  };
}
