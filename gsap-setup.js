// ============================================
// GSAP Setup y Configuración Global
// ============================================

// Registrar plugins de GSAP
gsap.registerPlugin(ScrollTrigger);

// Configuración de ScrollTrigger
ScrollTrigger.config({
    autoRefresh: true,
    ignoreMobileResize: true
});

// ============================================
// Animaciones Globales
// ============================================

// Animación de entrada de página
function pageEnterAnimation() {
    gsap.fromTo('body', 
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
}

// Animación de fade-in con stagger para elementos
function staggerFadeIn(selector, duration = 0.8, stagger = 0.15) {
    gsap.fromTo(selector,
        {
            opacity: 0,
            y: 30
        },
        {
            opacity: 1,
            y: 0,
            duration: duration,
            stagger: stagger,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: selector,
                start: 'top 80%',
                end: 'top 20%',
                toggleActions: 'play none none reverse'
            }
        }
    );
}

// Animación de parallax
function parallaxElement(selector, movement = -50) {
    gsap.to(selector, {
        y: movement,
        scrollTrigger: {
            trigger: selector,
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
            markers: false
        }
    });
}

// Animación de reveal con clipPath
function clipPathReveal(selector, duration = 1.2) {
    gsap.fromTo(selector,
        {
            clipPath: 'inset(0 100% 0 0)'
        },
        {
            clipPath: 'inset(0 0% 0 0)',
            duration: duration,
            ease: 'power3.inOut',
            scrollTrigger: {
                trigger: selector,
                start: 'top 75%'
            }
        }
    );
}

// Animación de float (flotación suave)
function floatAnimation(selector, duration = 3) {
    gsap.to(selector, {
        y: -20,
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}

// Animación de glow (brillo)
function glowEffect(selector) {
    gsap.to(selector, {
        boxShadow: `0 0 20px 0 rgba(255, 140, 0, 0.6)`,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}

// Animación de rotación 3D en hover
function rotation3DOnHover(selector) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(el, {
                rotationY: 5,
                rotationX: -5,
                duration: 0.6,
                ease: 'power2.out'
            });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                rotationY: 0,
                rotationX: 0,
                duration: 0.6,
                ease: 'power2.out'
            });
        });
    });
}

// Animación de línea que se dibuja
function drawLine(selector, duration = 1.5) {
    gsap.fromTo(selector,
        {
            strokeDashoffset: 1000
        },
        {
            strokeDashoffset: 0,
            duration: duration,
            ease: 'power2.inOut',
            scrollTrigger: {
                trigger: selector,
                start: 'top 75%'
            }
        }
    );
}

// Animación de número contador
function countUp(selector, targetValue, duration = 2) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(el => {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 75%',
            onEnter: () => {
                gsap.to(el, {
                    textContent: targetValue,
                    duration: duration,
                    snap: { textContent: 1 },
                    ease: 'power2.out',
                    onUpdate: function() {
                        el.textContent = Math.floor(this.targets()[0].textContent);
                    }
                });
            }
        });
    });
}

// Animación de scroll reveal con blur
function blurReveal(selector, duration = 1) {
    gsap.fromTo(selector,
        {
            opacity: 0,
            filter: 'blur(10px)'
        },
        {
            opacity: 1,
            filter: 'blur(0px)',
            duration: duration,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: selector,
                start: 'top 80%'
            }
        }
    );
}

// Animación de scale con bounce
function scaleBounce(selector, targetScale = 1.05) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(el, {
                scale: targetScale,
                duration: 0.6,
                ease: 'elastic.out(1, 0.5)'
            });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                scale: 1,
                duration: 0.6,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

// Animación de tilt (inclinación de tarjeta)
function tiltCard(selector) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            gsap.to(el, {
                rotationX: rotateX,
                rotationY: rotateY,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.6,
                ease: 'power2.out'
            });
        });
    });
}

// Animación de texto character by character
function charByCharReveal(selector, duration = 1.5) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        
        const chars = text.split('');
        chars.forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.opacity = '0';
            el.appendChild(span);
        });
        
        const spans = el.querySelectorAll('span');
        gsap.to(spans,
            {
                opacity: 1,
                duration: duration,
                stagger: 0.05,
                ease: 'power1.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 75%'
                }
            }
        );
    });
}

// Animación de scroll horizontal
function horizontalScroll(selector, duration = 3) {
    gsap.to(selector, {
        x: -100,
        duration: duration,
        repeat: -1,
        ease: 'none'
    });
}

// Exportar funciones si usas módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        pageEnterAnimation,
        staggerFadeIn,
        parallaxElement,
        clipPathReveal,
        floatAnimation,
        glowEffect,
        rotation3DOnHover,
        drawLine,
        countUp,
        blurReveal,
        scaleBounce,
        tiltCard,
        charByCharReveal,
        horizontalScroll
    };
}
