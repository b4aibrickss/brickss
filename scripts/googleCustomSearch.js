export const SEARCH_ENGINE_ID = 'YOUR_SEARCH_ENGINE_ID';
export const API_KEY = 'YOUR_API_KEY';

export function getSearchUrl(query) {
    return `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${SEARCH_ENGINE_ID}&key=${API_KEY}`;
}