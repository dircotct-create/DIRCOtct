// ============================================
// LENIS SMOOTH SCROLL SETUP
// ============================================
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// ============================================
// GSAP ANIMATIONS INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Página enter animation
    pageEnterAnimation();

    // Animaciones de Hero section
    gsap.to('.hero-section', {
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            markers: false
        },
        opacity: 0.8,
        filter: 'blur(5px)'
    });

    // Parallax en lottie
    parallaxElement('.hero-lottie', -100);

    // Service cards stagger animation
    staggerFadeIn('.service-card', 0.6, 0.1);

    // Testimonial cards animation
    staggerFadeIn('.testimonial-card', 0.6, 0.1);

    // Blur reveal en secciones
    blurReveal('.services-section', 1);
    blurReveal('.about-section', 1);
    blurReveal('.testimonials-section', 1);
    blurReveal('.contact-section', 1);

    // Hover effects en tarjetas
    tiltCard('.service-card');
    tiltCard('.testimonial-card');

    // About section parallax
    parallaxElement('.about-image', -50);

    // Float animation en hero lottie
    floatAnimation('.hero-lottie', 4);

    // Animaciones de reveal para títulos
    document.querySelectorAll('.section-title').forEach((el, index) => {
        gsap.fromTo(el,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: index * 0.2,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%'
                }
            }
        );
    });

    // Contact form submit animation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const submitBtn = document.getElementById('submitContactForm');
            gsap.to(submitBtn, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });
        });
    }

    // ============================================
    // SMOOTH SCROLL PARA LA NAVEGACIÓN Y BOTONES
    // ============================================
    document.querySelectorAll('a.nav-link, a.scroll-to-section').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                lenis.scrollTo(offsetPosition, {
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });

                // Cierra el menú hamburguesa
                const navMenu = document.querySelector('.nav-menu .nav-list');
                const hamburger = document.querySelector('.hamburger-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });

    // ============================================
    // MENÚ HAMBURGUESA PARA RESPONSIVE
    // ============================================
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu .nav-list');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // ============================================
    // ANIMACIONES AL SCROLL CON INTERSECTION OBSERVER
    // ============================================
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // GSAP animation para elementos con clase reveal
                if (entry.target.classList.contains('reveal')) {
                    gsap.fromTo(entry.target,
                        { opacity: 0, y: 30 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: 'power2.out'
                        }
                    );
                }
                
                // GSAP animation para elementos con clase reveal-left
                if (entry.target.classList.contains('reveal-left')) {
                    gsap.fromTo(entry.target,
                        { opacity: 0, x: -50 },
                        {
                            opacity: 1,
                            x: 0,
                            duration: 0.8,
                            ease: 'power2.out'
                        }
                    );
                }
                
                // GSAP animation para stagger items
                if (entry.target.classList.contains('stagger-item')) {
                    gsap.fromTo(entry.target,
                        { opacity: 0, y: 30 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            ease: 'power2.out'
                        }
                    );
                }

                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    animateElements.forEach(element => {
        observer.observe(element);
    });

    // ============================================
    // RESALTAR ENLACE DE NAVEGACIÓN ACTIVO AL HACER SCROLL
    // ============================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const highlightNavLink = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - document.querySelector('.header').offsetHeight;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlightNavLink);
    window.addEventListener('load', highlightNavLink);

    // ============================================
    // LÓGICA PARA ENVIAR FORMULARIO A EMAIL
    // ============================================
    const contactFormElement = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    const showMessage = (message, type) => {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        
        gsap.fromTo(formMessage,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.3 }
        );
        
        setTimeout(() => {
            gsap.to(formMessage, {
                opacity: 0,
                y: -10,
                duration: 0.3,
                onComplete: () => {
                    formMessage.textContent = '';
                    formMessage.className = '';
                }
            });
        }, 5000);
    };

    if (contactFormElement) {
        contactFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            if (!name || !email || !message) {
                showMessage('Por favor, completa todos los campos requeridos.', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Por favor, ingresa un correo electrónico válido.', 'error');
                return;
            }

            const formData = new FormData(contactFormElement);

            try {
                const response = await fetch(contactFormElement.action, {
                    method: contactFormElement.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    contactFormElement.reset();
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

    // ============================================
    // EFECTOS ADICIONALES
    // ============================================

    // Glow effect en botones primarios
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                boxShadow: '0 0 50px rgba(255, 140, 0, 0.6), 0 20px 40px rgba(255, 140, 0, 0.2)',
                duration: 0.3
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                boxShadow: '0 0 30px rgba(255, 140, 0, 0.3)',
                duration: 0.3
            });
        });
    });

    // Animación de iconos de servicios
    document.querySelectorAll('.service-icon').forEach((icon, index) => {
        gsap.fromTo(icon,
            { opacity: 0, scale: 0 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                delay: index * 0.1,
                ease: 'elastic.out(1, 0.5)',
                scrollTrigger: {
                    trigger: icon,
                    start: 'top 80%'
                }
            }
        );

        icon.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                scale: 1.2,
                rotation: 10,
                duration: 0.3
            });
        });

        icon.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                scale: 1,
                rotation: 0,
                duration: 0.3
            });
        });
    });

    // Animación de contador en hero
    gsap.registerPlugin(ScrollTrigger);
});