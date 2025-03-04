# Pesquisa de Preços - PWA

Este projeto é um **Progressive Web App (PWA)** que permite pesquisar preços de produtos em diferentes marketplaces, incluindo **Mercado Livre, Shopee, Amazon, Magalu, Enjoei, Buscapé, Lojas Americanas e OLX**.

## 📂 Estrutura do Projeto

O projeto segue a seguinte estrutura de diretórios:

```
brickss/
│── index.html             # Página principal do PWA
│── style.css              # Arquivo de estilos
│── manifest.json          # Configuração do PWA
│── service-worker.js      # Permite o funcionamento offline
│── scripts/
│   ├── fetchPrices.js     # Script para realizar buscas nos marketplaces
│   ├── platforms.js       # Lista de marketplaces suportados
│── setup_project.sh       # Script para criar a estrutura automaticamente
```

## 📜 Explicação dos Arquivos

- **index.html** → Página principal contendo o formulário de busca e os resultados.
- **style.css** → Arquivo de estilos para personalizar a interface (vazio por padrão, pode ser editado).
- **manifest.json** → Arquivo de configuração do PWA, permitindo que o app seja instalado em dispositivos móveis.
- **service-worker.js** → Script para adicionar suporte offline ao PWA.
- **scripts/fetchPrices.js** → Código que processa a pesquisa e gera links para os marketplaces.
- **scripts/platforms.js** → Lista de plataformas de busca, podendo ser editada para incluir ou remover marketplaces.
- **setup_project.sh** → Script Bash que cria automaticamente a estrutura do projeto no Linux Mint.

## 🚀 Como Instalar e Rodar

1. Clone ou baixe este repositório.
2. Dê permissão de execução ao script de configuração:
   ```bash
   chmod +x setup_project.sh
   ```
3. Execute o script para criar a estrutura do projeto:
   ```bash
   ./setup_project.sh
   ```
4. Abra o arquivo `index.html` no navegador e comece a pesquisar preços.

## 🔧 Como Adicionar/Remover Marketplaces

Para adicionar ou remover marketplaces, edite o arquivo **scripts/platforms.js** e modifique a lista:

```js
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
```

Basta remover ou adicionar um novo objeto JSON com a URL do marketplace correspondente.

---

Agora você tem um PWA funcional e flexível para pesquisar preços em múltiplos marketplaces! 🚀

