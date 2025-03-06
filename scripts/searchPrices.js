import { getSearchUrl } from './googleCustomSearch.js';
import { platforms } from './platforms.js';

const { platforms: sitePlatforms } = platforms;

async function searchProducts(query) {
    const url = getSearchUrl(query);

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.items) {
            return data.items.map(item => ({
                title: item.title,
                link: item.link,
                price: extractPrice(item.snippet),
                image: item.pagemap?.cse_image?.[0]?.src || ''
            }));
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        return [];
    }
}

function extractPrice(snippet) {
    const priceMatch = snippet.match(/R\$[\s]*([\d.,]+)/);
    return priceMatch ? parseFloat(priceMatch[1].replace('.', '').replace(',', '.')) : 0;
}

export async function searchAndDisplay() {
    const query = document.getElementById('query').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const sites = sitePlatforms.map(platform => platform.site);
    const searchQuery = `${query} ${sites.map(site => `site:${site}`).join(' OR ')}`;
    const results = await searchProducts(searchQuery);

    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `
            <input type="checkbox" class="result-checkbox" data-price="${result.price}" checked>
            <img src="${result.image}" alt="${result.title}">
            <a href="${result.link}" target="_blank">${result.title}</a>
            <span>R$ ${result.price.toFixed(2)}</span>
        `;
        resultsDiv.appendChild(resultItem);
    });

    if (results.length === 0) {
        resultsDiv.innerHTML = "<p>Nenhum resultado encontrado.</p>";
    }

    if (results.length > 0) {
        document.getElementById('floating-container').style.display = 'block';
        calculatePrices(); // Calculate prices immediately after fetching results
    }

    document.querySelectorAll('.result-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const anyChecked = document.querySelectorAll('.result-checkbox:checked').length > 0;
            document.getElementById('calculate-button').disabled = !anyChecked;
            calculatePrices(); // Recalculate prices when selection changes
        });
    });

    document.getElementById('select-all').addEventListener('change', () => {
        const isChecked = document.getElementById('select-all').checked;
        document.querySelectorAll('.result-checkbox').forEach(checkbox => {
            checkbox.checked = isChecked;
        });
        const anyChecked = document.querySelectorAll('.result-checkbox:checked').length > 0;
        document.getElementById('calculate-button').disabled = !anyChecked;
        calculatePrices(); // Recalculate prices when select all changes
    });
}

export function calculatePrices() {
    const checkboxes = document.querySelectorAll('.result-checkbox:checked');
    const prices = Array.from(checkboxes).map(checkbox => parseFloat(checkbox.dataset.price));
    const noItemsSelected = document.getElementById('no-items-selected');

    if (prices.length === 0) {
        noItemsSelected.style.display = 'block';
        document.getElementById('min-price').textContent = '';
        document.getElementById('max-price').textContent = '';
        document.getElementById('avg-price').textContent = '';
        return;
    } else {
        noItemsSelected.style.display = 'none';
    }

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

    document.getElementById('min-price').textContent = `R$ ${minPrice.toFixed(2)}`;
    document.getElementById('max-price').textContent = `R$ ${maxPrice.toFixed(2)}`;
    document.getElementById('avg-price').textContent = `R$ ${avgPrice.toFixed(2)}`;
}
