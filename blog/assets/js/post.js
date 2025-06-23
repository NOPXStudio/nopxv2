// assets/js/post.js

/**
 * Obtém o slug do post da URL.
 * @returns {string|null} O slug do post ou null se não encontrado.
 */
function getSlugFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('slug');
}

/**
 * Renderiza o conteúdo do post principal.
 * @param {Object} post - O objeto post a ser renderizado.
 */
function renderPostContent(post) {
    const postArticle = document.getElementById('post-article-content');
    if (!postArticle) return;

    document.title = `${post.title} - Blog NOPX`;
    document.querySelector('meta[name="description"]').setAttribute('content', post.excerpt);
    document.querySelector('meta[name="keywords"]').setAttribute('content', `tecnologia, inovação, blog, NOPX, artigo, post, ${post.category.toLowerCase()}, ${post.title.toLowerCase().replace(/ /g, ', ')}`);

    postArticle.innerHTML = `
        <h1 class="post-title">${post.title}</h1>
        <figure class="post-featured-image">
            <img src="${BASE_PATH}${post.image}" alt="Imagem destacada do post: ${post.title}"> <figcaption>${post.title}</figcaption>
        </figure>
        <span class="card__tag">${post.category}</span>
        <div class="post-meta">
            <span class="post-author">Por: ${post.author}</span>
            <span class="post-date">${formatDate(post.date)}</span>
            <button class="btn btn--icon share-btn" aria-label="Compartilhar post">
                <img src="${BASE_PATH}/assets/img/placeholder/share-network.svg" alt="Ícone de compartilhamento"> </button>
        </div>
        <div class="post-content">
            ${post.content}
        </div>
    `;
}

/**
 * Renderiza os posts relacionados (da mesma categoria).
 * @param {Array<Object>} allPosts - Todos os posts disponíveis.
 * @param {Object} currentPost - O post atualmente exibido.
 */
function renderRelatedPosts(allPosts, currentPost) {
    const relatedPostsSection = document.querySelector('.related-posts');
    const carouselContainer = document.getElementById('related-posts-carousel');
    if (!relatedPostsSection || !carouselContainer) return;

    const related = allPosts
        .filter(post => post.category === currentPost.category && post.id !== currentPost.id)
        .slice(0, 3);

    if (related.length === 0) {
        relatedPostsSection.style.display = 'none';
        return;
    }

    carouselContainer.innerHTML = '';
    related.forEach(post => {
        const card = createCardElement(post);
        carouselContainer.appendChild(card);
    });
}

// Inicialização da página de post
document.addEventListener('DOMContentLoaded', async () => {
    await fetchPosts();

    const postSlug = getSlugFromUrl();

    if (allPosts.length > 0 && postSlug) {
        const currentPost = allPosts.find(post => post.slug === postSlug);

        if (currentPost) {
            renderPostContent(currentPost);
            renderRelatedPosts(allPosts, currentPost);
        } else {
            document.querySelector('.main-content').innerHTML = `
                <div class="container" style="text-align: center; padding: 50px;">
                    <h1>Ops! Post não encontrado.</h1>
                    <p>Parece que o post que você procura não existe ou foi removido.</p>
                    <a href="${BASE_PATH}/index.html" class="btn btn--primary" style="margin-top: 20px;">Voltar para a página inicial</a>
                </div>
            `;
            console.warn(`Post com slug "${postSlug}" não encontrado.`);
        }
    } else {
        document.querySelector('.main-content').innerHTML = `
            <div class="container" style="text-align: center; padding: 50px;">
                <h1>Erro ao carregar o post.</h1>
                <p>Ocorreu um problema ou o slug não foi especificado.</p>
                <a href="${BASE_PATH}/index.html" class="btn btn--primary" style="margin-top: 20px;">Voltar para a página inicial</a>
            </div>
        `;
        console.warn('Slug não especificado na URL ou posts não carregados.');
    }
});