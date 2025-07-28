// JavaScript para mostrar todas las páginas sin animaciones - manteniendo estructura original
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar TODAS las páginas (.page-container) pero mantener su estructura
    const allPages = document.querySelectorAll('.page-container');
    allPages.forEach(page => {
        page.style.display = 'block';
        page.style.opacity = '1';
        page.style.visibility = 'visible';
        page.style.transform = 'none';
        page.style.animation = 'none';
        page.style.transition = 'none';
        // NO cambiar position - mantener la estructura original
    });
    
    // Mostrar todos los content-wrapper y content-overlay
    const contentWrappers = document.querySelectorAll('.content-wrapper, .content-overlay');
    contentWrappers.forEach(wrapper => {
        wrapper.style.display = 'block';
        wrapper.style.opacity = '1';
        wrapper.style.visibility = 'visible';
        wrapper.style.transform = 'none';
    });
    
    // Desactivar SOLO animaciones y transiciones, mantener layout original
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        // Remover animaciones y transiciones
        element.style.animation = 'none';
        element.style.transition = 'none';
        
        // Resetear transformaciones que puedan ocultar contenido
        if (element.style.transform && element.style.transform.includes('translate')) {
            element.style.transform = 'none';
        }
        
        // Solo hacer visible si está explícitamente oculto
        if (element.style.opacity === '0') {
            element.style.opacity = '1';
        }
        if (element.style.visibility === 'hidden') {
            element.style.visibility = 'visible';
        }
    });
    
    // Hacer visible cualquier elemento con clases de animación
    const slidingElements = document.querySelectorAll('.slide-up, .fade-in, .hidden');
    slidingElements.forEach(element => {
        element.classList.remove('slide-up', 'fade-in', 'hidden');
        element.style.opacity = '1';
        element.style.visibility = 'visible';
        element.style.transform = 'none';
    });
    
    console.log('Todas las páginas de Birlik visibles sin animaciones - estructura mantenida');
});

// Función de respaldo más conservadora
function forceShowContent() {
    document.querySelectorAll('.page-container').forEach(page => {
        page.style.display = 'block';
        page.style.opacity = '1';
        page.style.visibility = 'visible';
        page.style.animation = 'none';
        page.style.transition = 'none';
    });
}

// Ejecutar inmediatamente
forceShowContent();

// También ejecutar después de un delay
setTimeout(forceShowContent, 100);