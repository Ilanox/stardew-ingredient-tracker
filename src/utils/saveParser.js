export function parseSaveFile(xmlString) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, 'application/xml');
    
    // Get list of cooking recipes known and cooked
    const cookingItems = xml.querySelectorAll('cookingRecipes > item');
    const knownRecipes = [];
    cookingItems.forEach(item => {
      const keyNode = item.querySelector('key > string');
      if (keyNode && keyNode.textContent) {
        knownRecipes.push(keyNode.textContent);
      }
    });
  
    // Get list of crafting recipes cooked (by ID)
    // For simplicity, assume the key textContent matches recipe names
    const craftedItems = xml.querySelectorAll('recipesCooked > item');
    const craftedRecipes = [];
    craftedItems.forEach(item => {
      const keyNode = item.querySelector('key');
      if (keyNode && keyNode.textContent) {
        craftedRecipes.push(keyNode.textContent);
      }
    });
  
    // Combine and dedupe
    const allCompleted = Array.from(new Set([...knownRecipes, ...craftedRecipes]));
    return allCompleted;
  }
  