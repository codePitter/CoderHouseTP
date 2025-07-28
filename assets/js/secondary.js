document.addEventListener('DOMContentLoaded', function() {
    const allPages = document.querySelectorAll('.page-container');
    allPages.forEach(page => {
        page.style.display = 'block';
        page.style.opacity = '1';
        page.style.visibility = 'visible';
        page.style.transform = 'none';
        page.style.animation = 'none';
        page.style.transition = 'none';
    });
    
    const contentWrappers = document.querySelectorAll('.content-wrapper, .content-overlay');
    contentWrappers.forEach(wrapper => {
        wrapper.style.display = 'block';
        wrapper.style.opacity = '1';
        wrapper.style.visibility = 'visible';
        wrapper.style.transform = 'none';
    });
    
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        element.style.animation = 'none';
        element.style.transition = 'none';
        
        if (element.style.transform && element.style.transform.includes('translate')) {
            element.style.transform = 'none';
        }
        
        if (element.style.opacity === '0') {
            element.style.opacity = '1';
        }
        if (element.style.visibility === 'hidden') {
            element.style.visibility = 'visible';
        }
    });
    
    const slidingElements = document.querySelectorAll('.slide-up, .fade-in, .hidden');
    slidingElements.forEach(element => {
        element.classList.remove('slide-up', 'fade-in', 'hidden');
        element.style.opacity = '1';
        element.style.visibility = 'visible';
        element.style.transform = 'none';
    });
    
    console.log('Todas las páginas de Birlik visibles sin animaciones - estructura mantenida');
});

function forceShowContent() {
    document.querySelectorAll('.page-container').forEach(page => {
        page.style.display = 'block';
        page.style.opacity = '1';
        page.style.visibility = 'visible';
        page.style.animation = 'none';
        page.style.transition = 'none';
    });
}

forceShowContent();

// También ejecutar después de un delay
setTimeout(forceShowContent, 100);