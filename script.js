
  const toggleButton = document.getElementById('menuToggle');
  const navMenu = document.getElementById('menu');

  toggleButton.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    toggleButton.classList.toggle('is-active'); // isso ativa a animação do ícone (hamburgers.css)
  });

  const links = document.querySelectorAll('#menu a');

links.forEach(link => {
  link.addEventListener('click', () => {
    toggleButton.classList.remove('is-active');
    navMenu.classList.remove('active');
  });
});

//POP-UP
function showPopup(event) {
  event.preventDefault();

  const form = event.target;
  const data = new FormData(form);

  // ✅ Adiciona o form-name manualmente
  data.append("form-name", form.getAttribute("name"));

  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(data).toString()
  })
  .then(() => {
    document.getElementById("popup").style.display = "flex";
    form.reset();
  })
  .catch((error) => alert("Erro ao enviar formulário: " + error));
}



//FAQ
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const answer = item.querySelector('.faq-answer');

            // Fecha todos os outros
            faqItems.forEach(el => {
                if (el !== item) {
                    el.classList.remove('active');
                    el.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Toggle o item clicado
            item.classList.toggle('active');

            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = null;
            }
        });
    });
});

ScrollReveal().reveal('.reveal', {
        origin: 'bottom',
        distance: '50px',
        duration: 800,
        easing: 'ease-out',
        reset: false
});

ScrollReveal().reveal('.faq-reveal', {
        origin: 'left',
        distance: '50px',
        duration: 800,
        interval: 100,
        easing: 'ease-out',
        reset: false
});

ScrollReveal().reveal('.bio-reveal', {
        origin: 'left',
        distance: '50px',
        duration: 800,
        interval: 100,
        easing: 'ease-out',
        reset: false
});