// assets/js/index.js

// Importante: Não declare 'allPosts' aqui novamente, ela já é global em main.js

/**
 * Renderiza a seção de posts em destaque (main-card e side-cards).
 * @param {Array<Object>} posts - O array de posts disponíveis.
 */
function renderFeaturedPosts(posts) {
    const mainCardContainer = document.getElementById('main-card-container');
    const sideCardsContainer = document.getElementById('side-cards-container');

    if (!mainCardContainer || !sideCardsContainer) {
        console.error("Contêineres de posts em destaque não encontrados.");
        return;
    }

    const mainPost = posts[0];
    const sidePosts = posts.slice(1, 3);

    mainCardContainer.innerHTML = '';
    if (mainPost) {
        const mainCardElement = createCardElement(mainPost, true);
        mainCardContainer.appendChild(mainCardElement);
    } else {
        mainCardContainer.innerHTML = '<p>Nenhum post principal para exibir.</p>';
    }

    sideCardsContainer.innerHTML = '';
    if (sidePosts.length > 0) {
        sidePosts.forEach(post => {
            const sideCardElement = createCardElement(post, false, true);
            sideCardsContainer.appendChild(sideCardElement);
        });
    } else {
        sideCardsContainer.innerHTML = '<p>Nenhum post lateral para exibir.</p>';
    }
}

/**
 * Renderiza as seções de categoria com carrosséis.
 * @param {Array<Object>} posts - O array de posts disponíveis.
 */
function renderCategorySections(posts) {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    document.querySelectorAll('.main-content > .category-section').forEach(section => section.remove());

    const categories = [...new Set(posts.map(post => post.category))];

    categories.forEach(category => {
        const postsInCategory = posts.filter(post => post.category === category)
                                    .sort((a, b) => new Date(b.date) - new Date(a.date));

        const section = document.createElement('section');
        section.classList.add('category-section');
        section.innerHTML = `
            <div class="container category-section__header">
                <h2 class="category-section__title">${category}</h2>
                <a href="${BASE_PATH}/category.html?category=${encodeURIComponent(category)}" class="btn btn--text desktop-only">Ver tudo</a>
            </div>
            <div class="carousel-container container">
                <div class="carousel">
                    </div>
                    </div>
                    <a href="${BASE_PATH}/category.html?category=${encodeURIComponent(category)}" class="btn btn--text mobile-only category-section__mobile-ver-tudo">Ver tudo</a>
        `;

        const carousel = section.querySelector('.carousel');
        postsInCategory.slice(0, 5).forEach(post => {
            const card = createCardElement(post);
            carousel.appendChild(card);
        });

        mainContent.appendChild(section);
    });
}


// Inicialização da página inicial
document.addEventListener('DOMContentLoaded', async () => {
    await fetchPosts();

    if (allPosts.length > 0) {
        renderFeaturedPosts(allPosts);
        renderCategorySections(allPosts);
    } else {
        console.warn('Posts ainda não carregados após nova tentativa, ou JSON vazio.');
        document.querySelector('.main-content').innerHTML = '<p class="container" style="text-align: center; margin-top: 50px;">Não foi possível carregar os posts do blog.</p>';
    }
});