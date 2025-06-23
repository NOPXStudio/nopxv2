// assets/js/category.js

/**
 * Obtém o parâmetro de categoria da URL.
 * @returns {string|null} O nome da categoria ou null se não encontrado.
 */
function getCategoryFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('category');
}

/**
 * Destaca a categoria ativa no menu desktop.
 * @param {string} currentCategory - A categoria atualmente ativa.
 */
function highlightActiveCategory(currentCategory) {
    const navLinks = document.querySelectorAll('.category-menu-desktop__list a, .mobile-nav__list a');
    navLinks.forEach(link => {
        // Obtenha o pathname do link (ex: /blog/category.html) e compare com a URL da página
        const linkPath = new URL(link.href).pathname;
        const currentPath = window.location.pathname;

        // Compare o slug da categoria e o caminho base
        const linkCategory = new URLSearchParams(link.href.split('?')[1]).get('category');
        
        // Verifica se o caminho base corresponde e a categoria é a mesma
        if (linkCategory && linkCategory.toLowerCase() === currentCategory.toLowerCase() && linkPath === currentPath) {
            link.classList.add('active-category');
        } else {
            link.classList.remove('active-category');
        }
    });
}

/**
 * Renderiza os posts em destaque para a categoria atual.
 * @param {Array<Object>} posts - Posts filtrados pela categoria.
 */
function renderCategoryFeaturedPosts(posts) {
    const mainCardContainer = document.getElementById('main-card-container');
    const sideCardsContainer = document.getElementById('side-cards-container');

    if (!mainCardContainer || !sideCardsContainer) {
        console.error("Contêineres de posts em destaque para categoria não encontrados.");
        return;
    }

    const mainPost = posts[0];
    const sidePosts = posts.slice(1, 3);

    const pageTitleElement = document.querySelector('.page-title');
    if (pageTitleElement) {
        pageTitleElement.textContent = `Categoria: ${mainPost ? mainPost.category : 'Nenhuma'}`;
        if (mainPost) {
            document.title = `Categoria: ${mainPost.category} - Blog NOPX`;
            document.querySelector('meta[name="description"]').setAttribute('content', `Explore os últimos posts sobre ${mainPost.category} no Blog NOPX.`);
            document.querySelector('meta[name="keywords"]').setAttribute('content', `blog, NOPX, categoria, ${mainPost.category.toLowerCase()}, posts, artigos`);
        }
    }

    mainCardContainer.innerHTML = '';
    if (mainPost) {
        const mainCardElement = createCardElement(mainPost, true);
        mainCardContainer.appendChild(mainCardElement);
    } else {
        mainCardContainer.innerHTML = '<p>Nenhum post principal para esta categoria.</p>';
    }

    sideCardsContainer.innerHTML = '';
    if (sidePosts.length > 0) {
        sidePosts.forEach(post => {
            const sideCardElement = createCardElement(post, false, true);
            sideCardsContainer.appendChild(sideCardElement);
        });
    } else {
        sideCardsContainer.innerHTML = '<p>Nenhum post lateral para esta categoria.</p>';
    }
}

/**
 * Agrupa e renderiza posts por mês e ano.
 * @param {Array<Object>} posts - Array de posts da categoria atual.
 */
function renderPostsByMonth(posts) {
    const postsByMonthSection = document.querySelector('.posts-by-month');
    if (!postsByMonthSection) return;

    postsByMonthSection.innerHTML = '';

    if (posts.length === 0) {
        postsByMonthSection.innerHTML = '<p class="container">Nenhum post encontrado nesta categoria.</p>';
        return;
    }

    const groupedPosts = posts.reduce((acc, post) => {
        const date = new Date(post.date);
        const year = date.getFullYear();
        const month = date.toLocaleString('pt-BR', { month: 'long' }).charAt(0).toUpperCase() + date.toLocaleString('pt-BR', { month: 'long' }).slice(1);
        const monthYear = `${month} ${year}`;

        if (!acc[monthYear]) {
            acc[monthYear] = [];
        }
        acc[monthYear].push(post);
        return acc;
    }, {});

    const sortedMonthYears = Object.keys(groupedPosts).sort((a, b) => {
        const [monthNameA, yearA] = a.split(' ');
        const [monthNameB, yearB] = b.split(' ');

        const monthMap = {
            "janeiro": 0, "fevereiro": 1, "março": 2, "abril": 3, "maio": 4, "junho": 5,
            "julho": 6, "agosto": 7, "setembro": 8, "outubro": 9, "novembro": 10, "dezembro": 11
        };

        const dateA = new Date(yearA, monthMap[monthNameA.toLowerCase()], 1);
        const dateB = new Date(yearB, monthMap[monthNameB.toLowerCase()], 1);
        return dateB.getTime() - dateA.getTime();
    });

    sortedMonthYears.forEach(monthYear => {
        const monthSection = document.createElement('div');
        monthSection.classList.add('month-group');
        monthSection.innerHTML = `
            <h2 class="section-heading container">${monthYear}</h2>
            <div class="post-grid container">
                </div>
        `;
        const postGrid = monthSection.querySelector('.post-grid');
        groupedPosts[monthYear].forEach(post => {
            const card = createCardElement(post);
            postGrid.appendChild(card);
        });
        postsByMonthSection.appendChild(monthSection);
    });
}

// Inicialização da página de categoria
document.addEventListener('DOMContentLoaded', async () => {
    await fetchPosts();

    const currentCategory = getCategoryFromUrl();

    if (allPosts.length > 0 && currentCategory) {
        const filteredPosts = allPosts.filter(post =>
            post.category.toLowerCase() === currentCategory.toLowerCase()
        );

        filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

        highlightActiveCategory(currentCategory);
        renderCategoryFeaturedPosts(filteredPosts);
        renderPostsByMonth(filteredPosts);
    } else {
        const pageTitleElement = document.querySelector('.page-title');
        if (pageTitleElement) {
            pageTitleElement.textContent = 'Categoria não encontrada ou posts não carregados.';
        }
        document.getElementById('main-card-container').innerHTML = '<p class="container">Nenhum post para exibir nesta categoria.</p>';
        document.getElementById('side-cards-container').innerHTML = '';
        const postsByMonthSection = document.querySelector('.posts-by-month');
        if (postsByMonthSection) {
            postsByMonthSection.innerHTML = '';
        }
        // Ajuste do link "Voltar para a página inicial" em caso de erro na categoria
        document.querySelector('.main-content').innerHTML = `
            <div class="container" style="text-align: center; padding: 50px;">
                <h1>Erro ao carregar a categoria.</h1>
                <p>Ocorreu um problema ou a categoria não foi especificada.</p>
                <a href="${BASE_PATH}/index.html" class="btn btn--primary" style="margin-top: 20px;">Voltar para a página inicial</a>
            </div>
        `;
        console.warn('Categoria não especificada na URL ou posts não carregados.');
    }
});