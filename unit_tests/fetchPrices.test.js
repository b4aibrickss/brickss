import { fetchPrices, calculatePrices } from '../scripts/fetchPrices.js';
import { platforms } from '../scripts/platforms.js';

jest.mock('../scripts/platforms.js', () => ({
    platforms: [
        { name: 'Mercado Livre', url: 'https://api.mercadolibre.com/sites/MLB/search?q={query}' }
    ]
}));

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({
            results: [
                { title: 'Produto 1', price: 100, thumbnail: 'image1.jpg', permalink: 'link1' },
                { title: 'Produto 2', price: 200, thumbnail: 'image2.jpg', permalink: 'link2' }
            ]
        })
    })
);

describe('fetchPrices', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <input type="text" id="query" value="test">
            <div id="results"></div>
            <div id="floating-container" style="display: none;">
                <input type="checkbox" id="select-all" checked>
                <label for="select-all">Selecionar/Deselecionar Todos</label>
                <button type="button" id="calculate-button" disabled>Calcular Preços</button>
                <div id="price-summary">
                    <table>
                        <tr>
                            <td>Menor Preço:</td>
                            <td id="min-price"></td>
                        </tr>
                        <tr>
                            <td>Maior Preço:</td>
                            <td id="max-price"></td>
                        </tr>
                        <tr>
                            <td>Preço Médio:</td>
                            <td id="avg-price"></td>
                        </tr>
                    </table>
                    <p id="no-items-selected" style="display: none; color: red;">Nenhum item selecionado.</p>
                </div>
            </div>
        `;
    });

    it('should fetch and display results', async () => {
        await fetchPrices();

        const resultsDiv = document.getElementById('results');
        expect(resultsDiv.children.length).toBe(2);

        const firstResult = resultsDiv.children[0];
        expect(firstResult.querySelector('a').textContent).toBe('Produto 1');
        expect(firstResult.querySelector('span').textContent).toBe('R$ 100');
    });

    it('should calculate prices correctly', async () => {
        await fetchPrices();
        calculatePrices();

        expect(document.getElementById('min-price').textContent).toBe('R$ 100.00');
        expect(document.getElementById('max-price').textContent).toBe('R$ 200.00');
        expect(document.getElementById('avg-price').textContent).toBe('R$ 150.00');
    });

    it('should show no items selected message when no items are selected', async () => {
        await fetchPrices();

        document.querySelectorAll('.result-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });

        calculatePrices();

        expect(document.getElementById('no-items-selected').style.display).toBe('block');
    });
});