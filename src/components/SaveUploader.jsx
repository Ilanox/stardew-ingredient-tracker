import React from 'react';
import { extractRecipeProgress, extractPlayerName } from '../utils/stardew-checkup';
import { extractCookedRecipesFromPlayer } from '../utils/parseCooking';

export default function SaveUploader({ onUpload }) {
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    let xmlDoc;
    try {
      const parser = new DOMParser();
      xmlDoc = parser.parseFromString(text, 'application/xml');
      const parserError = xmlDoc.getElementsByTagName('parsererror');
      if (parserError.length) throw new Error('Invalid XML');
    } catch (err) {
      console.error('Error parsing save file XML:', err);
      return;
    }

    const recipeProgress = extractCookedRecipesFromPlayer(xmlDoc)

    const playerName = extractPlayerName(xmlDoc);

    // Call parent with all needed data
    onUpload(recipeProgress, playerName);
  };

  return (
    <div className="mb-6">
      <input
        type="file"
        onChange={handleFile}
        className="border rounded p-2"
      />
    </div>
  );
}
