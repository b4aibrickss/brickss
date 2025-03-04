import { platforms } from './platforms.js';

export async function fetchPrices() {
    const query = document.getElementById('query').value;
    const resultsDiv = document.getElementById('results');
    const calculateButton = document.getElementById('calculate-button');
    resultsDiv.innerHTML = '';
    calculateButton.style.display = 'none';
    calculateButton.disabled = true;

    const results = await Promise.all(platforms.map(platform => fetchResultsFromPlatform(platform, query)));

    results.flat().forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `
            <input type="checkbox" class="result-checkbox" data-price="${result.price}">
            <img src="${result.image}" alt="${result.title}">
            <a href="${result.link}" target="_blank">${result.title}</a>
            <span>${result.price}</span>
        `;
        resultsDiv.appendChild(resultItem);
    });

    if (results.flat().length > 0) {
        calculateButton.style.display = 'block';
    }

    document.querySelectorAll('.result-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const anyChecked = document.querySelectorAll('.result-checkbox:checked').length > 0;
            calculateButton.disabled = !anyChecked;
        });
    });
}

export function calculatePrices() {
    const checkboxes = document.querySelectorAll('.result-checkbox:checked');
    const prices = Array.from(checkboxes).map(checkbox => parseFloat(checkbox.dataset.price));

    if (prices.length === 0) {
        alert('Nenhum resultado selecionado.');
        return;
    }

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

    const priceSummaryDiv = document.getElementById('price-summary');
    priceSummaryDiv.innerHTML = `
        <p>Menor Preço: ${minPrice}</p>
        <p>Maior Preço: ${maxPrice}</p>
        <p>Preço Médio: ${avgPrice.toFixed(2)}</p>
    `;
}

async function fetchResultsFromPlatform(platform, query) {
    const url = platform.url.replace('{query}', encodeURIComponent(query));

    const response = await fetch(url);
    const data = await response.json();

    switch (platform.name) {
        case 'Mercado Livre':
            return data.results.map(result => ({
                title: result.title,
                price: result.price,
                image: result.thumbnail,
                link: result.permalink
            }));
        case 'Shopee':
            return data.items.map(item => ({
                title: item.name,
                price: item.price / 100000, // Shopee retorna o preço em centavos
                image: item.image,
                link: `https://shopee.com.br/product/${item.shopid}/${item.itemid}`
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
}
