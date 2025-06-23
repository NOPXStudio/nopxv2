// assets/js/main.js

// Variável global para armazenar os posts
let allPosts = [];

// Defina a base URL do seu blog.
// Isso é crucial para que os caminhos funcionem corretamente em subpastas ou na raiz.
// Exemplo: se seu site principal é 'meusite.com.br' e o blog está em 'meusite.com.br/blog',
// o BASE_PATH será '/blog'. Caso contrário, será ''.
// A detecção window.location.pathname.startsWith('/blog') é um exemplo,
// ajuste 'blog' para o nome da sua subpasta real.
const BASE_PATH = window.location.pathname.startsWith('/blog') ? '/blog' : '';

/**
 * Carrega os dados dos posts do arquivo JSON.
 * @returns {Promise<Array>} Uma Promise que resolve com um array de posts.
 */
async function fetchPosts() {
    try {
        // Use BASE_PATH para prefixar o caminho do JSON
        const response = await fetch(`${BASE_PATH}/assets/js/data/posts.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        console.log("Dados recebidos do JSON:", data);

        if (Array.isArray(data)) {
            allPosts = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else {
            console.error("Erro: O JSON não retornou um array válido.", data);
            allPosts = [];
        }
        return allPosts;
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
        return [];
    }
}

/**
 * Formata uma data para o formato "Dia de Mês de Ano".
 * @param {string} dateString - A data no formato "YYYY-MM-DD".
 * @returns {string} A data formatada.
 */
// assets/js/main.js

// ... (código existente) ...

/**
 * Formata uma data para o formato "Dia de Mês de Ano".
 * Trata fusos horários para evitar o problema de "um dia a menos".
 * @param {string} dateString - A data no formato "YYYY-MM-DD".
 * @returns {string} A data formatada (ex: "23 de junho de 2025").
 */
function formatDate(dateString) {
    // Divide a string "YYYY-MM-DD" em componentes numéricos.
    const parts = dateString.split('-').map(Number);
    const year = parts[0];
    // Meses em JavaScript são baseados em zero (0 para Janeiro, 11 para Dezembro).
    const month = parts[1] - 1; 
    const day = parts[2];

    // Cria um objeto Date usando os componentes (ano, mês, dia).
    // Isso faz com que a data seja interpretada no fuso horário local.
    const date = new Date(year, month, day);

    // Opções de formatação para o local 'pt-BR' (Português do Brasil)
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    // Retorna a data formatada
    return date.toLocaleDateString('pt-BR', options);
}

// ... (restante do código) ...

/**
 * Cria um elemento de card de post.
 * @param {Object} post - O objeto post com as propriedades id, slug, title, category, date, excerpt, image.
 * @param {boolean} isMainCard - Se é um card principal (para aplicar estilos e exibir excerpt).
 * @param {boolean} isSmallCard - Se é um card pequeno (para aplicar estilos específicos de side-cards).
 * @returns {HTMLElement} O elemento HTML do card.
 */
function createCardElement(post, isMainCard = false, isSmallCard = false) {
    const card = document.createElement('article');
    card.classList.add('card');
    if (isMainCard) {
        card.classList.add('main-card');
    }
    if (isSmallCard) {
        card.classList.add('card--small');
    }

    // A URL da imagem do post (já vem com /assets/... do JSON)
    // Prefixe com BASE_PATH para que seja resolvida corretamente
    const imageUrl = `${BASE_PATH}${post.image}`; 

    card.innerHTML = `
        <a href="${BASE_PATH}/post.html?slug=${post.slug}">
            <img src="${imageUrl}" alt="Capa do post: ${post.title}" class="card__image">
            <div class="card__content">
                <span class="card__tag">${post.category}</span>
                <span class="card__date">${formatDate(post.date)}</span>
                <h3 class="card__title">${post.title}</h3>
                ${isMainCard ? `<p class="main-card__excerpt">${post.excerpt}</p>` : ''}
                <button class="btn btn--primary">Ver mais</button>
            </div>
        </a>
    `;
    return card;
}

/**
 * Renderiza uma lista de posts em um contêiner. (Esta função não é mais usada diretamente pelos scripts específicos, mas mantida para reuso geral)
 * @param {HTMLElement} container - O elemento onde os cards serão renderizados.
 * @param {Array<Object>} postsToRender - Array de objetos post.
 * @param {boolean} isCarousel - Se os posts devem ser renderizados como parte de um carrossel.
 */
function renderPosts(container, postsToRender, isCarousel = false) {
    container.innerHTML = ''; // Limpa o contêiner
    postsToRender.forEach(post => {
        const card = createCardElement(post, false, isCarousel && container.classList.contains('side-cards'));
        container.appendChild(card);
    });
}

/**
 * Lógica comum do menu hambúrguer e barra de pesquisa (autocomplete).
 */
function setupCommonUI() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNav = document.getElementById('mobile-nav');
    const closeMobileNavBtn = document.querySelector('.mobile-nav__close-btn');

    if (hamburgerMenu && mobileNav && closeMobileNavBtn) {
        hamburgerMenu.addEventListener('click', () => {
            const isCurrentlyExpanded = hamburgerMenu.getAttribute('aria-expanded') === 'true';
            const shouldExpand = !isCurrentlyExpanded; 

            hamburgerMenu.setAttribute('aria-expanded', shouldExpand);
            mobileNav.setAttribute('aria-hidden', !shouldExpand);
            document.body.classList.toggle('no-scroll', shouldExpand);
        });

        closeMobileNavBtn.addEventListener('click', () => {
            hamburgerMenu.setAttribute('aria-expanded', 'false');
            mobileNav.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
        });

        // Fechar sidebar ao clicar fora
        document.addEventListener('click', (event) => {
            if (mobileNav.getAttribute('aria-hidden') === 'false' &&
                !mobileNav.contains(event.target) &&
                !hamburgerMenu.contains(event.target)) {
                hamburgerMenu.setAttribute('aria-expanded', 'false');
                mobileNav.setAttribute('aria-hidden', 'true');
                document.body.classList.remove('no-scroll');
            }
        });

        // Fechar sidebar na tecla Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && mobileNav.getAttribute('aria-hidden') === 'false') {
                hamburgerMenu.setAttribute('aria-expanded', 'false');
                mobileNav.setAttribute('aria-hidden', 'true');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // Lógica da barra de pesquisa com autocomplete
    const searchInputs = document.querySelectorAll('.search-bar input[type="search"]');
    searchInputs.forEach(input => {
        let datalist = document.createElement('datalist');
        datalist.id = 'post-titles-autocomplete';
        input.setAttribute('list', datalist.id);
        document.body.appendChild(datalist);

        input.addEventListener('input', () => {
            const searchTerm = input.value.toLowerCase();
            datalist.innerHTML = '';

            if (searchTerm.length > 0) {
                const filteredTitles = allPosts
                    .filter(post => post.title.toLowerCase().includes(searchTerm))
                    .map(post => post.title);

                filteredTitles.forEach(title => {
                    const option = document.createElement('option');
                    option.value = title;
                    datalist.appendChild(option);
                });
            }
        });

        input.addEventListener('change', () => { // Lida com a seleção de uma sugestão
            const selectedTitle = input.value;
            const foundPost = allPosts.find(post => post.title === selectedTitle);
            if (foundPost) {
                window.location.href = `${BASE_PATH}/post.html?slug=${foundPost.slug}`; // Prefixa com BASE_PATH
            }
        });

        // Lógica do botão de pesquisa (ainda pode ser útil se não usar autocomplete)
        const searchButton = input.nextElementSibling;
        if (searchButton && searchButton.tagName === 'BUTTON') {
            // Prefixa src da imagem do botão de pesquisa
            searchButton.innerHTML = `<img src="${BASE_PATH}/assets/img/placeholder/magnifying-glass.svg" alt="Ícone de pesquisa">`; 
            searchButton.addEventListener('click', (event) => {
                event.preventDefault();
                const searchTerm = input.value.trim();
                if (searchTerm) {
                    const foundPost = allPosts.find(post => post.title.toLowerCase() === searchTerm.toLowerCase());
                    if (foundPost) {
                        window.location.href = `${BASE_PATH}/post.html?slug=${foundPost.slug}`; // Prefixa com BASE_PATH
                    } else {
                        alert(`Nenhum post encontrado com o título "${searchTerm}".`);
                    }
                }
            });
        }
    });

    // Share button functionality
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const pageTitle = document.title;
            // pageUrl será a URL completa (já inclui a subpasta, se houver)
            const pageUrl = window.location.href; 

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: pageTitle,
                        url: pageUrl
                    });
                    console.log('Conteúdo compartilhado com sucesso!');
                } catch (error) {
                    console.error('Erro ao compartilhar:', error);
                }
            } else {
                alert('Recurso de compartilhamento não suportado neste navegador. Você pode copiar o link da página.');
                navigator.clipboard.writeText(pageUrl)
                    .then(() => console.log('URL copiada para a área de transferência!'))
                    .catch(err => console.error('Falha ao copiar URL: ', err));
            }
        });
    });
}


/**
 * Popula os menus de categoria (mobile e desktop) dinamicamente.
 */
function populateCategoryMenus() {
    if (allPosts.length === 0) {
        console.warn("Nenhum post carregado para popular os menus de categoria.");
        return;
    }

    const categories = [...new Set(allPosts.map(post => post.category))].sort();
    const mobileNavList = document.querySelector('.mobile-nav__list');
    const desktopCategoryList = document.querySelector('.category-menu-desktop__list');
    // Seletor para a lista de categorias do footer
    const footerCategoryList = document.querySelector('.footer__list.footer__category-list'); 

    // Limpa listas existentes
    if (mobileNavList) mobileNavList.innerHTML = '';
    if (desktopCategoryList) desktopCategoryList.innerHTML = '';
    if (footerCategoryList) footerCategoryList.innerHTML = '';

    categories.forEach(category => {
        const mobileListItem = document.createElement('li');
        mobileListItem.innerHTML = `<a href="${BASE_PATH}/category.html?category=${encodeURIComponent(category)}">${category}</a>`; // Prefixa com BASE_PATH
        if (mobileNavList) mobileNavList.appendChild(mobileListItem);

        const desktopListItem = document.createElement('li');
        desktopListItem.innerHTML = `<a href="${BASE_PATH}/category.html?category=${encodeURIComponent(category)}">${category}</a>`; // Prefixa com BASE_PATH
        if (desktopCategoryList) desktopCategoryList.appendChild(desktopListItem);

        const footerListItem = document.createElement('li');
        footerListItem.innerHTML = `<a href="${BASE_PATH}/category.html?category=${encodeURIComponent(category)}">${category}</a>`; // Prefixa com BASE_PATH
        if (footerCategoryList) footerCategoryList.appendChild(footerListItem);
    });
}


// Inicialização Principal - Deve haver apenas UM document.addEventListener('DOMContentLoaded')
document.addEventListener('DOMContentLoaded', async () => {
    await fetchPosts(); 
    setupCommonUI();
    populateCategoryMenus();
});