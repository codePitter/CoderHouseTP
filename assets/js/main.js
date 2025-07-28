// script.js - Birlik Presentation Enhanced

// Función para detectar cuando un elemento entra en el viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
    
// Función para detectar cuando un elemento está parcialmente visible
function isElementPartiallyVisible(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.top <= windowHeight &&
        rect.left <= windowWidth
    );
}

// Función para animar las páginas cuando entran en vista
function animatePages() {
    const pages = document.querySelectorAll('.page-container');
    
    pages.forEach((page, index) => {
        if (isElementPartiallyVisible(page) && !page.classList.contains('visible')) {
            // Agregar un pequeño delay basado en el índice para efecto escalonado
            setTimeout(() => {
                page.classList.add('visible');
                page.classList.add('animate'); // Agregar clase animate para compatibilidad
            }, index * 100);
        }
    });
}

// Función para animar elementos internos de las páginas
function animatePageElements() {
    const animatedElements = document.querySelectorAll('.info-card, .strategy-card, .metric-card, .persona-card, .journey-step, .technique-card, .platform-card, .investment-card, .card');
    
    animatedElements.forEach((element, index) => {
        if (isElementPartiallyVisible(element) && !element.classList.contains('animated')) {
            element.classList.add('animated');
            element.style.animationDelay = `${(index % 4) * 0.1}s`;
            
            // Aplicar animación específica sin afectar títulos
            if (!element.classList.contains('page-title') && !element.querySelector('.page-title')) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        }
    });
}

// Función para scroll suave entre páginas
function smoothScrollToPage(pageIndex) {
    const pages = document.querySelectorAll('.page-container');
    if (pages[pageIndex]) {
        pages[pageIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Función para detectar scroll y activar animaciones
function handleScroll() {
    requestAnimationFrame(() => {
        animatePages();
        animatePageElements();
    });
}

// Función para crear navegación por teclado
function handleKeyNavigation(e) {
    const pages = document.querySelectorAll('.page-container');
    const currentPage = Array.from(pages).findIndex(page => {
        const rect = page.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
    });
    
    switch(e.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ': // Espaciador
            e.preventDefault();
            if (currentPage < pages.length - 1) {
                smoothScrollToPage(currentPage + 1);
            }
            break;
        case 'ArrowUp':
        case 'PageUp':
            e.preventDefault();
            if (currentPage > 0) {
                smoothScrollToPage(currentPage - 1);
            }
            break;
        case 'Home':
            e.preventDefault();
            smoothScrollToPage(0);
            break;
        case 'End':
            e.preventDefault();
            smoothScrollToPage(pages.length - 1);
            break;
    }
}

// Función para crear indicador de progreso
function createProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #4CAF50, #2E7D32);
        z-index: 9999;
        transition: width 0.3s ease;
        box-shadow: 0 2px 10px rgba(76, 175, 80, 0.3);
    `;
    document.body.appendChild(progressBar);
    
    return progressBar;
}

// Función para actualizar el progreso de scroll
function updateScrollProgress() {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const progress = (scrollTop / documentHeight) * 100;
        
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
}

// Función para crear navegación por puntos
function createDotNavigation() {
    const pages = document.querySelectorAll('.page-container');
    if (pages.length <= 1) return null; // No crear navegación si hay una sola página
    
    const nav = document.createElement('nav');
    nav.id = 'dot-navigation';
    nav.style.cssText = `
        position: fixed;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding: 20px 10px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 25px;
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    pages.forEach((page, index) => {
        const dot = document.createElement('button');
        dot.className = 'nav-dot';
        dot.setAttribute('aria-label', `Ir a página ${index + 1}`);
        dot.style.cssText = `
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid #4CAF50;
            background: transparent;
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: 0.6;
            outline: none;
            margin: -5px;
        `;
        
        dot.addEventListener('click', () => smoothScrollToPage(index));
        dot.addEventListener('mouseenter', () => {
            dot.style.transform = 'scale(1.3)';
            dot.style.opacity = '1';
            dot.style.boxShadow = '0 0 15px rgba(76, 175, 80, 0.5)';
        });
        dot.addEventListener('mouseleave', () => {
            dot.style.transform = 'scale(1)';
            dot.style.boxShadow = 'none';
            if (!dot.classList.contains('active')) {
                dot.style.opacity = '0.6';
            }
        });
        
        nav.appendChild(dot);
    });
    
    document.body.appendChild(nav);
    return nav;
}

// Función para actualizar navegación por puntos
function updateDotNavigation() {
    const pages = document.querySelectorAll('.page-container');
    const dots = document.querySelectorAll('.nav-dot');
    
    let activeIndex = 0;
    pages.forEach((page, index) => {
        const rect = page.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            activeIndex = index;
        }
    });
    
    dots.forEach((dot, index) => {
        if (index === activeIndex) {
            dot.classList.add('active');
            dot.style.background = '#4CAF50';
            dot.style.opacity = '1';
            dot.style.transform = 'scale(1.2)';
        } else {
            dot.classList.remove('active');
            dot.style.background = 'transparent';
            dot.style.opacity = '0.6';
            dot.style.transform = 'scale(1)';
        }
    });
}

// Función para manejar intersección de elementos (CORREGIDA)
function createIntersectionObserver() {
    const options = {
        root: null,
        rootMargin: '-50px 0px -50px 0px', // Margen ajustado para mejor detección
        threshold: 0.15 // Umbral más alto para activación
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.add('animate');
                
                // Animar elementos hijos con delay, EXCLUYENDO títulos principales
                const children = entry.target.querySelectorAll('.card, .table, h3, h4, h5, h6, .info-card, .strategy-card, .metric-card, .persona-card, .journey-step, .technique-card');
                children.forEach((child, index) => {
                    // Verificar que no sea un título principal
                    if (!child.classList.contains('page-title') && 
                        !child.classList.contains('display-1') && 
                        !child.classList.contains('display-2') && 
                        !child.classList.contains('display-3') && 
                        !child.classList.contains('display-4')) {
                        
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, index * 100);
                    }
                });

                // Manejar títulos principales por separado (SIN TRANSFORMACIÓN)
                const pageTitles = entry.target.querySelectorAll('.page-title, .display-1, .display-2, .display-3, .display-4, h1, h2');
                pageTitles.forEach(title => {
                    title.style.opacity = '1';
                    title.style.transform = 'none'; // FORZAR sin transformación
                    title.classList.add('no-transform'); // Agregar clase de seguridad
                });
            }
        });
    }, options);
    
    const pages = document.querySelectorAll('.page-container');
    pages.forEach(page => {
        observer.observe(page);
        
        // Preparar elementos para animación (CORREGIDO)
        const childElements = page.querySelectorAll('.card, .table, h3, h4, h5, h6');
        childElements.forEach(child => {
            child.style.opacity = '0';
            // Solo aplicar translateY a elementos que NO sean títulos principales
            if (!child.classList.contains('page-title') && 
                !child.classList.contains('display-1') && 
                !child.classList.contains('display-2') && 
                !child.classList.contains('display-3') && 
                !child.classList.contains('display-4')) {
                child.style.transform = 'translateY(30px)';
            }
            child.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });

        // Preparar títulos principales SIN transformación
        const pageTitles = page.querySelectorAll('.page-title, .display-1, .display-2, .display-3, .display-4, h1, h2');
        pageTitles.forEach(title => {
            title.style.opacity = '0';
            title.style.transform = 'none';
            title.style.transition = 'opacity 0.6s ease';
            title.classList.add('no-transform');
        });
    });
    
    return observer;
}

// Función para efectos de parallax suave (MEJORADA)
function handleParallax() {
    const scrolled = window.pageYOffset;
    const pages = document.querySelectorAll('.page-container');
    
    pages.forEach((page, index) => {
        const rate = scrolled * -0.05; // Reducido para efecto más sutil
        
        // Aplicar parallax SOLO a elementos específicos que NO sean títulos principales
        const parallaxElements = page.querySelectorAll('.card, .table');
        parallaxElements.forEach((element, idx) => {
            // Efecto parallax muy sutil solo para cards
            if (element.classList.contains('card')) {
                const offset = rate * (0.1 + idx * 0.02);
                element.style.transform = `translateY(${offset}px)`;
            }
        });
    });
}

// Función para optimizar performance en mobile (NUEVA)
function optimizeForMobile() {
    const isMobile = window.innerWidth <= 768;
    const pages = document.querySelectorAll('.page-container');
    
    if (isMobile) {
        // Desactivar parallax en mobile
        pages.forEach(page => {
            page.style.backgroundAttachment = 'scroll';
            const parallaxElements = page.querySelectorAll('.card, .table');
            parallaxElements.forEach(element => {
                element.style.transform = 'none';
            });
        });
    } else {
        // Reactivar efectos en desktop
        pages.forEach(page => {
            page.style.backgroundAttachment = 'fixed';
        });
    }
}

// Función para crear tooltips en navegación por puntos (NUEVA)
function addTooltipsToNavigation() {
    const dots = document.querySelectorAll('.nav-dot');
    const pages = document.querySelectorAll('.page-container');
    
    dots.forEach((dot, index) => {
        const tooltip = document.createElement('div');
        const pageTitle = pages[index].querySelector('h1, h2, .display-1, .display-2, .display-3, .display-4');
        const title = pageTitle ? pageTitle.textContent.substring(0, 30) + '...' : `Página ${index + 1}`;
        
        tooltip.textContent = title;
        tooltip.style.cssText = `
            position: absolute;
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            margin-right: 10px;
        `;
        
        dot.style.position = 'relative';
        dot.appendChild(tooltip);
        
        dot.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
        });
        
        dot.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });
}

// Función para inicializar todas las funcionalidades (MEJORADA)
function init() {
    console.log('🚀 Inicializando Birlik Presentation...');
    
    // Crear elementos de navegación
    const progressBar = createProgressIndicator();
    const dotNav = createDotNavigation();
    
    // Crear observer para intersecciones
    const observer = createIntersectionObserver();
    
    // Optimizar para mobile al inicio
    optimizeForMobile();
    
    // Event listeners
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                updateScrollProgress();
                updateDotNavigation();
                if (window.innerWidth > 768) { // Solo parallax en desktop
                    handleParallax();
                }
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Navegación por teclado
    document.addEventListener('keydown', handleKeyNavigation);
    
    // Animación inicial
    setTimeout(() => {
        animatePages();
        animatePageElements();
        updateDotNavigation();
        if (dotNav) {
            addTooltipsToNavigation();
        }
    }, 300); // Delay aumentado para mejor sincronización
    
    // Smooth scroll para enlaces internos
    document.addEventListener('click', (e) => {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
    
    // Manejar clics en cards con efectos mejorados
    addCardInteractions();
    
    console.log('✅ Birlik Presentation initialized successfully!');
}

// Función para manejar clics en cards (MEJORADA)
function addCardInteractions() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) { // Solo en desktop
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Función para precargar imágenes (si hubiera)
function preloadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Función para optimizar performance (MEJORADA)
function optimizePerformance() {
    // Lazy loading para elementos pesados
    const heavyElements = document.querySelectorAll('.heavy-content');
    
    if (heavyElements.length === 0) return;
    
    const contentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    heavyElements.forEach(el => contentObserver.observe(el));
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        init();
        preloadImages();
        optimizePerformance();
    });
} else {
    init();
    preloadImages();
    optimizePerformance();
}

// Manejar redimensionamiento de ventana (MEJORADO)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Optimizar para el nuevo tamaño
        optimizeForMobile();
        
        // Recalcular posiciones después del resize
        updateDotNavigation();
        animatePages();
        
        // Reagregar interacciones de cards
        addCardInteractions();
        
        console.log('🔄 Presentation adapted to new screen size');
    }, 250);
});

// Funciones de utilidad exportables (AMPLIADAS)
window.BirlikPresentation = {
    goToPage: smoothScrollToPage,
    getCurrentPage: () => {
        const pages = document.querySelectorAll('.page-container');
        return Array.from(pages).findIndex(page => {
            const rect = page.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
        });
    },
    getTotalPages: () => document.querySelectorAll('.page-container').length,
    nextPage: () => {
        const current = window.BirlikPresentation.getCurrentPage();
        const total = window.BirlikPresentation.getTotalPages();
        if (current < total - 1) {
            smoothScrollToPage(current + 1);
        }
    },
    prevPage: () => {
        const current = window.BirlikPresentation.getCurrentPage();
        if (current > 0) {
            smoothScrollToPage(current - 1);
        }
    },
    goToStart: () => smoothScrollToPage(0),
    goToEnd: () => {
        const total = window.BirlikPresentation.getTotalPages();
        smoothScrollToPage(total - 1);
    }
};