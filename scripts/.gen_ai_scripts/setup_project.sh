#!/bin/bash

# Diretório do projeto
PROJECT_DIR="$HOME/dev/brickss"

# Criando diretório do projeto
mkdir -p "$PROJECT_DIR/scripts"

# Criando arquivos básicos
touch "$PROJECT_DIR/index.html"
touch "$PROJECT_DIR/style.css"
touch "$PROJECT_DIR/manifest.json"
touch "$PROJECT_DIR/service-worker.js"
touch "$PROJECT_DIR/scripts/fetchPrices.js"
touch "$PROJECT_DIR/scripts/platforms.js"

# Adicionando conteúdo inicial aos arquivos

cat > "$PROJECT_DIR/scripts/fetchPrices.js" << 'EOL'
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
EOL

cat > "$PROJECT_DIR/scripts/platforms.js" << 'EOL'
export const platforms = [
    { name: 'Mercado Livre', url: 'https://www.mercadolivre.com.br/jm/search?as_word={query}' },
    { name: 'Shopee', url: 'https://shopee.com.br/search?keyword={query}' },
    { name: 'Amazon', url: 'https://www.amazon.com.br/s?k={query}' },
    { name: 'Magalu', url: 'https://www.magazineluiza.com.br/busca/{query}/' },
    { name: 'Enjoei', url: 'https://www.enjoei.com.br/search?q={query}' },
    { name: 'Buscapé', url: 'https://www.buscape.com.br/search?q={query}' },
    { name: 'Lojas Americanas', url: 'https://www.americanas.com.br/busca/{query}' },
    { name: 'OLX (Exemplo)', url: 'https://www.olx.com.br/ano?search={query}' }
];
EOL

# Mensagem de finalização
echo "Estrutura do projeto criada em $PROJECT_DIR"