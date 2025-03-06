import { platforms } from './platforms.js';

async function fetchResultsFromPlatform(platform, query) {
    const url = platform.api.replace('{query}', encodeURIComponent(query));

    const response = await fetch(url);
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        switch (platform.name) {
            case 'Mercado Livre':
                return data.results.map(result => ({
                    title: result.title,
                    price: result.price,
                    image: result.thumbnail,
                    link: result.permalink
                }));
            case 'Amazon':
                return data.results.map(result => ({
                    title: result.title,
                    price: result.price,
                    image: result.image,
                    link: result.link
                }));
            case 'Magalu':
                return data.products.map(product => ({
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    link: product.link
                }));
            case 'Enjoei':
                return data.results.map(result => ({
                    title: result.title,
                    price: result.price,
                    image: result.image,
                    link: result.link
                }));
            case 'Buscapé':
                return data.results.map(result => ({
                    title: result.title,
                    price: result.price,
                    image: result.image,
                    link: result.link
                }));
            case 'Lojas Americanas':
                return data.products.map(product => ({
                    title: product.name,
                    price: product.salePrice,
                    image: product.image,
                    link: product.url
                }));
            case 'OLX':
                return data.results.map(result => ({
                    title: result.title,
                    price: result.price,
                    image: result.thumbnail,
                    link: result.url
                }));
            default:
                return [];
        }
    } else {
        console.error(`Unexpected content type: ${contentType}`);
        return [];
    }
}

export async function fetchPrices() {
    const query = document.getElementById('query').value;
    const resultsDiv = document.getElementById('results');
    const calculateButton = document.getElementById('calculate-button');
    const floatingContainer = document.getElementById('floating-container');
    const selectAllCheckbox = document.getElementById('select-all');
    const noItemsSelected = document.getElementById('no-items-selected');
    resultsDiv.innerHTML = '';
    calculateButton.disabled = true;
    floatingContainer.style.display = 'none';
    noItemsSelected.style.display = 'none';

    const results = [];
    for (const platform of platforms.platforms) {
        const platformResults = await fetchResultsFromPlatform(platform, query);
        results.push(...platformResults);
    }

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

    if (results.length > 0) {
        floatingContainer.style.display = 'block';
        calculatePrices(); // Calculate prices immediately after fetching results
    }

    document.querySelectorAll('.result-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const anyChecked = document.querySelectorAll('.result-checkbox:checked').length > 0;
            calculateButton.disabled = !anyChecked;
            calculatePrices(); // Recalculate prices when selection changes
        });
    });

    selectAllCheckbox.addEventListener('change', () => {
        const isChecked = selectAllCheckbox.checked;
        document.querySelectorAll('.result-checkbox').forEach(checkbox => {
            checkbox.checked = isChecked;
        });
        const anyChecked = document.querySelectorAll('.result-checkbox:checked').length > 0;
        calculateButton.disabled = !anyChecked;
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
