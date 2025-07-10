import React from 'react';

export default function AboutSection() {
  return (
    <div className="stardew-about">
      <h2 className="stardew-section-title">About</h2>
      <p>
        <strong>Stardew Cooking Tracker</strong> is a web app that analyzes your Stardew Valley save file to show your cooking progress.
        It displays which recipes you've already cooked, which ones you know but haven’t made yet, and which ones are still missing.
        It also generates a smart shopping list with all the ingredients you need to complete the remaining recipes.
      </p>
      <p>
        The tracker supports all versions of Stardew Valley, including the 1.6 update. Newer content is only shown if your save includes it,
        so spoilers are minimized unless you're already playing the latest version. Everything runs entirely in your browser,
        your save file is never uploaded or stored.
      </p>
      <h3 className="mt-4 mb-1 font-semibold">Credits</h3>
      <ul className="list-disc pl-1">
        <li>Recipe data and images sourced from the <a href="https://stardewvalleywiki.com" target="_blank" rel="noopener noreferrer" className="stardew-link">Stardew Valley Wiki</a>.</li>
        <li>Parsing logic and inspiration based in part on <a href="https://github.com/MouseyPounds/stardew-checkup" target="_blank" rel="noopener noreferrer" className="stardew-link">stardew-checkup</a> by <a href="https://github.com/MouseyPounds" target="_blank" rel="noopener noreferrer" className="stardew-link">MouseyPounds</a>.</li>
      </ul>
      <h3 className="mt-4 mb-1 font-semibold">Tech & Contact</h3>
      <p>
        This project was built using React and JavaScript, and it's hosted on GitHub Pages.
        You can <a href="https://github.com/Ilanox/stardew-ingredient-tracker" target="_blank" rel="noopener noreferrer" className="stardew-link">view the source code on GitHub</a>.
        If you have any feedback, suggestions, or find a bug, feel free to <a href="https://github.com/Ilanox/stardew-ingredient-tracker/issues" target="_blank" rel="noopener noreferrer" className="stardew-link">open an issue</a> - or just DM me on Discord at <strong><span className="at-symbol">@</span>ilanox</strong>. I’d love to hear from you!
      </p>
    </div>
  );
}
