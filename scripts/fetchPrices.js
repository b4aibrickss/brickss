import { platforms } from './platforms.js';

export function fetchPrices() {
    const query = document.getElementById('query').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    platforms.forEach(platform => {
        const link = platform.url.replace('{query}', encodeURIComponent(query));
        const resultItem = document.createElement('div');
        resultItem.innerHTML = `<a href="${link}" target="_blank">${platform.name}</a>`;
        resultsDiv.appendChild(resultItem);
    });
}
