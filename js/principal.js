
const desplazador = document.getElementById('desplazador');


if (window.matchMedia('(pointer: fine)').matches) {
    const punto = document.getElementById('puntero');
    const anillo = document.getElementById('anillo-puntero');
    let ratonX = 0, ratonY = 0, anilloX = 0, anilloY = 0;

    document.addEventListener('mousemove', e => {
        ratonX = e.clientX;
        ratonY = e.clientY;
    });

    (function animar() {
        punto.style.left = ratonX + 'px';
        punto.style.top = ratonY + 'px';
        anilloX += (ratonX - anilloX) * .13;
        anilloY += (ratonY - anilloY) * .13;
        anillo.style.left = anilloX + 'px';
        anillo.style.top = anilloY + 'px';
        requestAnimationFrame(animar);
    })();


    document.querySelectorAll('a,.boton,.boton-icono,.fila-proyecto,.fila-pila').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
    });


    const seccionContacto = document.getElementById('contacto');
    const observadorContacto = new IntersectionObserver(entradas => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) document.body.classList.add('en-contacto');
            else document.body.classList.remove('en-contacto');
        });
    }, { threshold: 0.5, root: desplazador });
    observadorContacto.observe(seccionContacto);
}


document.querySelectorAll('a[href^="#"]').forEach(enlace => {
    enlace.addEventListener('click', evento => {
        const destino = document.getElementById(enlace.getAttribute('href').slice(1));
        if (destino) {
            evento.preventDefault();
            destino.scrollIntoView({ behavior: 'smooth' });
        }
    });
});


const observadorEntrada = new IntersectionObserver(entradas => {
    entradas.forEach((entrada, indice) => {
        if (entrada.isIntersecting) {
            setTimeout(() => entrada.target.classList.add('visible'), indice * 70);
            observadorEntrada.unobserve(entrada.target);
        }
    });
}, { threshold: 0.08, root: desplazador });

document.querySelectorAll('.aparece').forEach((elemento, indice) => {
    elemento.style.transitionDelay = (indice % 4) * 0.07 + 's';
    observadorEntrada.observe(elemento);
});