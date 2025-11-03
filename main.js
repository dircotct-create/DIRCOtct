document.addEventListener('DOMContentLoaded', () => {
    // --- Smooth Scroll para la navegación y botones ---
    document.querySelectorAll('a.nav-link, a.scroll-to-section').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Previene el comportamiento por defecto del enlace

            const targetId = this.getAttribute('href'); // Obtiene el ID del destino (ej. #services)
            const targetElement = document.querySelector(targetId); // Selecciona el elemento destino

            if (targetElement) {
                // Calcula la posición a la que hacer scroll, ajustando para el header fijo
                const headerOffset = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth' // Habilita el scroll suave
                });

                // Cierra el menú hamburguesa si está abierto después de hacer clic en un enlace
                const navMenu = document.querySelector('.nav-menu .nav-list');
                const hamburger = document.querySelector('.hamburger-menu');
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active'); // También quita la clase activa del icono hamburguesa
                }
            }
        });
    });

    // --- Menú Hamburguesa para Responsive ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu .nav-list');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active'); // Alterna la clase 'active' para mostrar/ocultar el menú
        hamburger.classList.toggle('active'); // Opcional: para animar el icono hamburguesa
    });

    // --- Animaciones al Scroll con Intersection Observer ---
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    // Opciones para el Intersection Observer
    const observerOptions = {
        root: null, // El viewport es el elemento raíz
        rootMargin: '0px', // Sin margen extra
        threshold: 0.1 // El 10% del elemento debe ser visible para activar
    };

    // Callback que se ejecuta cuando los elementos observados entran/salen del viewport
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Si el elemento es visible, añade la clase 'is-visible'
                entry.target.classList.add('is-visible');
                // Deja de observar el elemento una vez que se ha animado
                observer.unobserve(entry.target);
            }
        });
    };

    // Crea una nueva instancia del Intersection Observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observa cada elemento con la clase 'animate-on-scroll'
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // --- Resaltar enlace de navegación activo al hacer scroll ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const highlightNavLink = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - document.querySelector('.header').offsetHeight; // Ajusta por la altura del header
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Asegúrate de que el href del enlace coincide con el ID de la sección actual
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    };

    // Ejecuta la función al cargar y al hacer scroll
    window.addEventListener('scroll', highlightNavLink);
    window.addEventListener('load', highlightNavLink); // Para asegurar que el enlace inicial esté activo

    // --- Lógica para enviar formulario a Email (vía Formspree) ---
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    // Función para mostrar mensajes de confirmación
    const showMessage = (message, type) => {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`; // Añade clase 'success' o 'error'
        setTimeout(() => {
            formMessage.classList.remove(type); // Oculta el mensaje después de un tiempo
            formMessage.textContent = '';
        }, 5000); // Mensaje visible por 5 segundos
    };

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita el envío tradicional del formulario

            // Validar campos requeridos
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            if (!name || !email || !message) {
                showMessage('Por favor, completa todos los campos requeridos.', 'error');
                return;
            }

            // Validar formato de email básico
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Por favor, ingresa un correo electrónico válido.', 'error');
                return;
            }

            // Crear objeto FormData para enviar los datos
            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Importante para Formspree
                    }
                });

                if (response.ok) {
                    contactForm.reset(); // Limpiar el formulario
                    showMessage('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.', 'success');
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        showMessage(data.errors.map(error => error.message).join(', '), 'error');
                    } else {
                        showMessage('Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.', 'error');
                    }
                }
            } catch (error) {
                console.error('Error al enviar el formulario:', error);
                showMessage('Hubo un error de conexión. Por favor, inténtalo más tarde.', 'error');
            }
        });
    }
});
// --- Código para el botón de volver arriba ---
const backToTopButton = document.getElementById('backToTop');       