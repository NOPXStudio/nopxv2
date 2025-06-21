// Mapeamento de nomes de redes sociais para classes de ícones Font Awesome
const socialIconMap = {
    'Instagram': 'fa-instagram',
    'Facebook': 'fa-facebook',
    'Twitter': 'fa-twitter',
    'LinkedIn': 'fa-linkedin',
    'YouTube': 'fa-youtube',
    'TikTok': 'fa-tiktok',
    'GitHub': 'fa-github',
    'WhatsApp': 'fa-whatsapp',
    'Email': 'fa-envelope',
    'Website': 'fa-globe'
};

// Seletores de elementos do DOM
const editorPanel = document.getElementById('editor-panel');
const profilePicUpload = document.getElementById('profile-pic-upload');
const editorProfilePicPreview = document.getElementById('editor-profile-pic-preview');
const miniBio = document.getElementById('mini-bio');
const bioCharCount = document.getElementById('bio-char-count');
const addLinkBtn = document.getElementById('add-link-btn');
const linksContainer = document.getElementById('links-container');
const addSocialBtn = document.getElementById('add-social-btn');
const socialIconsContainer = document.getElementById('social-icons-container');
const iconStyleRadios = document.querySelectorAll('input[name="icon-style"]');
const bgColorPicker = document.getElementById('bg-color-picker');
const btnBgColorPicker = document.getElementById('btn-bg-color-picker');
const btnTextColorPicker = document.getElementById('btn-text-color-picker');
const iconBgColorPicker = document.getElementById('icon-bg-color-picker');
const iconColorPicker = document.getElementById('icon-color-picker');

const profileCardPreview = document.getElementById('profile-card-preview');
const previewProfilePic = document.getElementById('preview-profile-pic');
const previewMiniBio = document.getElementById('preview-mini-bio');
const previewLinksContainer = document.getElementById('preview-links-container');
const previewSocialIconsContainer = document.getElementById('preview-social-icons-container');

// Referência ao elemento root para definir variáveis CSS
const rootElement = document.documentElement;

// Função para atualizar a pré-visualização em tempo real
function updatePreview() {
    // Atualiza a mini bio
    previewMiniBio.textContent = miniBio.value || 'Sua mini bio aparecerá aqui.';
    bioCharCount.textContent = miniBio.value.length;

    // Atualiza cores das variáveis CSS
    rootElement.style.setProperty('--card-background-color', bgColorPicker.value);
    rootElement.style.setProperty('--button-background-color', btnBgColorPicker.value);
    rootElement.style.setProperty('--button-text-color', btnTextColorPicker.value);
    rootElement.style.setProperty('--icon-background-color', iconBgColorPicker.value);
    rootElement.style.setProperty('--icon-color', iconColorPicker.value);

    // Limpa e recria links na pré-visualização
    previewLinksContainer.innerHTML = '';
    linksContainer.querySelectorAll('.link-item').forEach(linkItem => {
        const text = linkItem.querySelector('.link-text-input').value;
        const url = linkItem.querySelector('.link-url-input').value;
        if (text && url) {
            const linkElement = document.createElement('a');
            linkElement.href = url;
            linkElement.target = "_blank";
            linkElement.textContent = text;
            linkElement.className = 'profile-link-button'; // Classe para estilização CSS pura
            // As cores já são aplicadas via variáveis CSS no CSS, não precisa de estilo inline aqui
            previewLinksContainer.appendChild(linkElement);
        }
    });

    // Limpa e recria ícones sociais na pré-visualização
    previewSocialIconsContainer.innerHTML = '';
    const selectedIconStyle = document.querySelector('input[name="icon-style"]:checked').value;
    socialIconsContainer.querySelectorAll('.social-icon-item').forEach(iconItem => {
        const platform = iconItem.querySelector('.social-platform-select').value;
        const url = iconItem.querySelector('.social-url-input').value;

        if (platform !== 'default' && url) {
            const iconClass = socialIconMap[platform];
            if (iconClass) {
                const iconElement = document.createElement('a');
                iconElement.href = url;
                iconElement.target = "_blank";
                iconElement.className = `profile-social-icon ${selectedIconStyle === 'circle' ? 'rounded-full' : 'rounded-lg'}`; // Classes para estilização CSS pura
                // As cores já são aplicadas via variáveis CSS no CSS, não precisa de estilo inline aqui
                iconElement.innerHTML = `<i class="fab ${iconClass}"></i>`;
                previewSocialIconsContainer.appendChild(iconElement);
            }
        }
    });
}

// Função para adicionar um novo campo de link
function addLink() {
    const linkItem = document.createElement('div');
    linkItem.className = 'link-item';
    linkItem.innerHTML = `
        <input type="text" class="link-text-input" placeholder="Texto do Botão (ex: 'Ligue agora')">
        <input type="url" class="link-url-input" placeholder="URL (ex: https://meusite.com)">
        <button class="remove-link-btn" aria-label="Remover Link">
            <i class="fas fa-times"></i>
        </button>
    `;
    linksContainer.appendChild(linkItem);

    // Adiciona listeners para os novos inputs e botão de remover
    linkItem.querySelector('.link-text-input').addEventListener('input', updatePreview);
    linkItem.querySelector('.link-url-input').addEventListener('input', updatePreview);
    linkItem.querySelector('.remove-link-btn').addEventListener('click', () => {
        linkItem.remove();
        updatePreview();
    });

    updatePreview(); // Atualiza a prévia imediatamente após adicionar um link
}

// Função para adicionar um novo campo de ícone social
function addSocialIcon() {
    const socialIconItem = document.createElement('div');
    socialIconItem.className = 'social-icon-item';

    const selectOptions = Object.keys(socialIconMap).map(platform => `<option value="${platform}">${platform}</option>`).join('');

    socialIconItem.innerHTML = `
        <select class="social-platform-select">
            <option value="default">Selecione a Plataforma</option>
            ${selectOptions}
        </select>
        <input type="url" class="social-url-input" placeholder="URL do Perfil (ex: https://instagram.com/seuuser)">
        <button class="remove-social-btn" aria-label="Remover Ícone">
            <i class="fas fa-times"></i>
        </button>
    `;
    socialIconsContainer.appendChild(socialIconItem);

    // Adiciona listeners para os novos inputs e botão de remover
    socialIconItem.querySelector('.social-platform-select').addEventListener('change', updatePreview);
    socialIconItem.querySelector('.social-url-input').addEventListener('input', updatePreview);
    socialIconItem.querySelector('.remove-social-btn').addEventListener('click', () => {
        socialIconItem.remove();
        updatePreview();
    });

    updatePreview(); // Atualiza a prévia imediatamente após adicionar um ícone
}

// Event Listeners
profilePicUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewProfilePic.src = e.target.result;
            editorProfilePicPreview.src = e.target.result; // Atualiza a prévia no editor também
        };
        reader.readAsDataURL(file);
    } else {
        previewProfilePic.src = "https://placehold.co/100x100/A0A0A0/FFFFFF?text=Seu+Avatar";
        editorProfilePicPreview.src = "https://placehold.co/100x100/A0A0A0/FFFFFF?text=Preview";
    }
});

miniBio.addEventListener('input', updatePreview);
addLinkBtn.addEventListener('click', addLink);
addSocialBtn.addEventListener('click', addSocialIcon);

iconStyleRadios.forEach(radio => {
    radio.addEventListener('change', updatePreview);
});

// Event listeners para os seletores de cor - Agora atualizam as variáveis CSS
bgColorPicker.addEventListener('input', updatePreview);
btnBgColorPicker.addEventListener('input', updatePreview);
btnTextColorPicker.addEventListener('input', updatePreview);
iconBgColorPicker.addEventListener('input', updatePreview);
iconColorPicker.addEventListener('input', updatePreview);

// Inicializa com alguns exemplos e a pré-visualização inicial
document.addEventListener('DOMContentLoaded', () => {
    // Adiciona alguns links e ícones iniciais para demonstrar
    addLink();
    const firstLink = linksContainer.querySelector('.link-item:first-child');
    if (firstLink) {
        firstLink.querySelector('.link-text-input').value = 'Visite Meu Portfólio';
        firstLink.querySelector('.link-url-input').value = 'https://seusite.com';
    }

    addLink();
    const secondLink = linksContainer.querySelector('.link-item:last-child');
    if (secondLink) {
        secondLink.querySelector('.link-text-input').value = 'Me Ligue Agora';
        secondLink.querySelector('.link-url-input').value = 'tel:+5511999999999';
    }

    addSocialIcon();
    const firstSocial = socialIconsContainer.querySelector('.social-icon-item:first-child');
    if (firstSocial) {
        firstSocial.querySelector('.social-platform-select').value = 'Instagram';
        firstSocial.querySelector('.social-url-input').value = 'https://instagram.com/seuuser';
    }

    addSocialIcon();
    const secondSocial = socialIconsContainer.querySelector('.social-icon-item:last-child');
    if (secondSocial) {
        secondSocial.querySelector('.social-platform-select').value = 'LinkedIn';
        secondSocial.querySelector('.social-url-input').value = 'https://linkedin.com/in/seuuser';
    }

    
    updatePreview(); // Chama a pré-visualização inicial
});
