
import React, { useState } from 'react';
import recipes from './data/recipes.json';
import SaveUploader from './components/SaveUploader.jsx';
import AboutSection from './components/AboutSection.jsx';

function getIngredientImgUrl(ingredient, img) {
  if (img) return img;
  const name = ingredient.replace(/ /g, '_');
  return `https://stardewvalleywiki.com/mediawiki/images/thumb/${name}.png/24px-${name}.png`;
}

function getRecipeImg(recipe) {
  if (recipe.recipeImg) return recipe.recipeImg;
  const name = recipe.name.replace(/ /g, '_');
  return `https://stardewvalleywiki.com/mediawiki/images/thumb/${name}.png/48px-${name}.png`;
}

const recipeList = Object.keys(recipes).map(name => ({ name, ...recipes[name] }));

function getIngredientTotalsWithImgs(recipeNames) {
  const totals = {};
  recipeNames.forEach(recipeName => {
    const recipe = recipes[recipeName];
    if (!recipe || !Array.isArray(recipe.ingredients)) return;
    recipe.ingredients.forEach(({ name, count, img, type }) => {
      if (!name) return;
      if (!totals[name]) {
        totals[name] = { count: 0, img, type };
      }
      totals[name].count += count || 0;
      if (img && !totals[name].img) totals[name].img = img;
      if (type && !totals[name].type) totals[name].type = type;
    });
  });
  return totals;
}

function getCookingSummary(cooked, known, totalRecipes) {
  const achievements = [
    { name: 'Cook', required: 10 },
    { name: 'Sous Chef', required: 25 },
    { name: 'Gourmet Chef', required: totalRecipes }
  ];

  return {
    cookedCount: cooked.length,
    knownCount: known.length,
    totalRecipes,
    percentage: ((cooked.length / totalRecipes) * 100).toFixed(1),
    achievements: achievements.map(a => ({
      name: a.name,
      required: a.required,
      remaining: Math.max(0, a.required - cooked.length)
    }))
  };
}

function RecipeIngredientList({ ingredients = [] }) {
  return (
    <div className="stardew-ingredients">
      {ingredients.map(({ name, count, img }) => (
        <span key={name} className="stardew-badge">
          <img
            src={getIngredientImgUrl(name, img)}
            alt={name}
            width={20}
            height={20}
            className="stardew-badge-img"
            onError={e => {
              e.target.style.opacity = 0.3;
              e.target.src = 'https://stardewvalleywiki.com/mediawiki/resources/assets/wiki.png';
            }}
          />
          <a
            href={`https://stardewvalleywiki.com/${encodeURIComponent(name.replace(/ /g, '_'))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="stardew-link"
          >
            {name}
          </a>
          <span className="ml-1"> x {count}</span>
        </span>
      ))}
    </div>
  );
}

function RecipeList({ cooked, known }) {
  const allRecipesMap = Object.fromEntries(recipeList.map(r => [r.name, r]));

  const cookedSet = new Set(cooked);
  const knownSet = new Set(known);

  const completedRecipes = recipeList.filter(r => cookedSet.has(r.name));
  const knownRecipes = recipeList.filter(r => knownSet.has(r.name) && !cookedSet.has(r.name));
  const missingRecipes = recipeList.filter(r => !cookedSet.has(r.name) && !knownSet.has(r.name));

  return (
    <div className="stardew-section">
      <h2 className="stardew-section-title">Recipes</h2>
      <div className="stardew-recipe-grid">
        {[...completedRecipes, ...knownRecipes, ...missingRecipes].map(({ name }) => {
          const recipe = allRecipesMap[name];
          let cardClass = 'stardew-card-missing';
          if (cookedSet.has(name)) cardClass = 'stardew-card-complete';
          else if (knownSet.has(name)) cardClass = 'stardew-card-known';

          return (
            <div key={name} className={`stardew-card ${cardClass}`}>
              <div className="stardew-card-head">
                <img
                  src={getRecipeImg(recipe)}
                  alt={name}
                  width={36}
                  height={36}
                  className="stardew-recipe-img"
                  onError={e => {
                    e.target.style.opacity = 0.3;
                    e.target.src = 'https://stardewvalleywiki.com/mediawiki/resources/assets/wiki.png';
                  }}
                />
                <span className="font-semibold">{name}</span>
              </div>
              <RecipeIngredientList ingredients={recipe.ingredients} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ShoppingList({ totals, cooked, known }) {
  const [sortMode, setSortMode] = useState('name'); // name → quantity → type

  const toggleSortMode = () => {
    setSortMode(prev =>
      prev === 'name' ? 'quantity' :
      prev === 'quantity' ? 'type' :
      'name'
    );
  };

  const cookedSet = new Set(cooked);
  const knownSet = new Set(known);

  const knownUncookedEntries = Object.entries(recipes).filter(
    ([name]) => knownSet.has(name) && !cookedSet.has(name)
  );

  const neededCounts = {};
  for (const [, recipe] of knownUncookedEntries) {
    for (const ingredient of recipe.ingredients) {
      neededCounts[ingredient.name] = (neededCounts[ingredient.name] || 0) + ingredient.count;
    }
  }

  const cookedIngredientCounts = {};
  for (const recipeName of cooked) {
    const recipe = recipes[recipeName];
    if (!recipe) continue;

    for (const ingredient of recipe.ingredients) {
      cookedIngredientCounts[ingredient.name] = (cookedIngredientCounts[ingredient.name] || 0) + ingredient.count;
    }
  }

  const finalNeeded = {};
  for (const [ingredient, neededCount] of Object.entries(neededCounts)) {
    const cookedCount = cookedIngredientCounts[ingredient] || 0;
    const remaining = neededCount - cookedCount;
    if (remaining > 0) finalNeeded[ingredient] = remaining;
  }

  const totalKnown = Object.entries(totals)
    .filter(([name]) => name in finalNeeded)
    .map(([name, obj]) => ({
      name,
      count: finalNeeded[name],
      img: obj.img,
      type: obj.type || 'miscellaneous'
    }));

  const sortedEntries = totalKnown.sort((a, b) => {
    if (sortMode === 'quantity') return b.count - a.count;
    if (sortMode === 'type') {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type.localeCompare(b.type);
    }
    return a.name.localeCompare(b.name); // default: name
  });

  return (
    <div className="my-6 stardew-section">
      <div className="flex items-center justify-between mb-2 stardew-section-header">
        <h2 className="stardew-section-title">Shopping List</h2>
        <button className="stardew-sort-btn" onClick={toggleSortMode}>
          Sort by {sortMode}
        </button>
      </div>

      <div className="stardew-shopping-grid">
        {sortedEntries.map(({ name, count, img, type }) => (
          <div
            key={name}
            className={`stardew-shopping-item type-${type.replace(/\s+/g, '-').toLowerCase()}`}
          >
            <img
              src={getIngredientImgUrl(name, img)}
              alt={name}
              className="shopping-img"
              onError={e => {
                e.target.style.opacity = 0.3;
                e.target.src = 'https://stardewvalleywiki.com/mediawiki/resources/assets/wiki.png';
              }}
            />
            <a
              href={`https://stardewvalleywiki.com/${encodeURIComponent(name.replace(/ /g, '_'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shopping-name"
            >
              {name}
            </a>
            <span className="shopping-count">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


export default function App() {
  const [cooked, setCooked] = useState([]);
  const [known, setKnown] = useState([]);
  const [missing, setMissing] = useState([]);
  const [playerName, setPlayerName] = useState('Player');
  const [fileLoaded, setFileLoaded] = useState(false);

  const handleUpload = (data, playerName) => {
    console.log(data)
    setCooked(data.completed);
    setKnown(data.known);
    setMissing(data.missing)
    setPlayerName(playerName);
    setFileLoaded(true);
  };

  const shoppingTotals = getIngredientTotalsWithImgs([...known, ...missing]);
  const summary = getCookingSummary(cooked, known, recipeList.length);

  return (
    <div className="stardew-panel">
      
      {/* ─── Title & About Section ─────────────────────── */}
      <div className="mb-6">
        <h1 className="stardew-title mb-2">Stardew Cooking Tracker</h1>
        <AboutSection />
      </div>
  
      {/* ─── Save Upload Section ───────────────────────── */}
      <div className="mb-6">
        <h2 className="stardew-section-title">Choose Save File</h2>
        <p className="stardew-desc mb-4">
          Upload your Stardew Valley save file to see which recipes you have cooked and what you need to gather next!
        </p>
        <SaveUploader onUpload={handleUpload} />
        {!fileLoaded && (
          <p className="stardew-muted">No save loaded yet. Please upload your save file above.</p>
        )}
      </div>
  
      {/* ─── Results Section ───────────────────────────── */}
      {fileLoaded && (
        <>
          <div className="stardew-summary stardew-card">
            <p>
              <strong>{playerName}</strong> has cooked <strong>{summary.cookedCount}</strong> recipes and knows <strong>{summary.knownCount}</strong> of {summary.totalRecipes} recipes.
            </p>
            <ul>
              {summary.achievements.map(a => (
                <li key={a.name}>
                  {a.name} ({a.name === 'Gourmet Chef' ? 'cook every recipe' : `cook ${a.required} different recipes`}) — need <strong>{a.remaining}</strong> more
                </li>
              ))}
            </ul>
          </div>
          <RecipeList cooked={cooked} known={known} />
          <ShoppingList totals={shoppingTotals} cooked={cooked} known={known}/>
        </>
      )}
    </div>
  );
}
