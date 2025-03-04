import { platforms } from './platforms.js';

async function fetchPrices() {
    const query = document.getElementById('search').value;
    if (!query) return;
    
    let resultsHTML = '';
    platforms.forEach(platform => {
        const searchUrl = platform.url.replace('{query}', encodeURIComponent(query));
        resultsHTML += `<p><a href="${searchUrl}" target="_blank">${platform.name}</a></p>`;
    });
    
    document.getElementById('results').innerHTML = resultsHTML;
}
window.fetchPrices = fetchPrices;
