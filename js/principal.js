/* ═══════════════════════════════════════════════════════
   principal.js  —  Jakob Ponce Portfolio
═══════════════════════════════════════════════════════ */

const desplazador = document.getElementById('desplazador');

/* ══ CURSOR ══ */
if (window.matchMedia('(pointer: fine)').matches) {
    const punto = document.getElementById('puntero');
    const anillo = document.getElementById('anillo-puntero');
    let ratonX = 0, ratonY = 0, anilloX = 0, anilloY = 0;

    document.addEventListener('mousemove', e => { ratonX = e.clientX; ratonY = e.clientY; });

    (function animar() {
        punto.style.left = ratonX + 'px';
        punto.style.top = ratonY + 'px';
        anilloX += (ratonX - anilloX) * .13;
        anilloY += (ratonY - anilloY) * .13;
        anillo.style.left = anilloX + 'px';
        anillo.style.top = anilloY + 'px';
        requestAnimationFrame(animar);
    })();

    document.querySelectorAll('a,.boton,.boton-icono,.fila-proyecto,.btn-idioma,.boton-ver-titulo,#lightbox-cerrar,.boton-arriba').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
    });

    const elContacto = document.getElementById('contacto');
    if (elContacto) {
        new IntersectionObserver(es => {
            es.forEach(e => document.body.classList.toggle('en-contacto', e.isIntersecting));
        }, { threshold: 0.5, root: desplazador }).observe(elContacto);
    }
}

/* ══ SMOOTH SCROLL ══ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', ev => {
        const d = document.getElementById(a.getAttribute('href').slice(1));
        if (d) { ev.preventDefault(); d.scrollIntoView({ behavior: 'smooth' }); }
    });
});

/* ══ SELECTOR DE IDIOMA ══ */
let idiomaActual = 'es';

function aplicarIdioma(lang) {
    idiomaActual = lang;
    document.querySelectorAll('.btn-idioma').forEach(b => b.classList.toggle('activo', b.dataset.lang === lang));
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-es]').forEach(el => {
        const txt = el.getAttribute('data-' + lang);
        if (!txt) return;
        if (/<[a-z][\s\S]*>/i.test(txt)) el.innerHTML = txt;
        else el.textContent = txt;
    });
    document.title = lang === 'es' ? 'Jakob Ponce — Ingeniero Fullstack' : 'Jakob Ponce — Fullstack Engineer';
}

document.querySelectorAll('.btn-idioma').forEach(b => {
    b.addEventListener('click', () => { if (b.dataset.lang !== idiomaActual) aplicarIdioma(b.dataset.lang); });
});

/* ══ LIGHTBOX ══ */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const lbCaption = document.getElementById('lightbox-caption');
const lbCerrar = document.getElementById('lightbox-cerrar');

function abrirLightbox(src, caption) {
    lbImg.src = src; lbImg.alt = caption;
    lbCaption.textContent = caption;
    lightbox.classList.add('abierto');
    document.body.style.overflow = 'hidden';
}

function cerrarLightbox() {
    lightbox.classList.remove('abierto');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 320);
}

document.querySelectorAll('.boton-ver-titulo').forEach(btn => {
    btn.addEventListener('click', () => abrirLightbox(btn.dataset.src, btn.dataset.caption));
});

lbCerrar.addEventListener('click', cerrarLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) cerrarLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.classList.contains('abierto')) cerrarLightbox(); });

/* ══════════════════════════════════════
   ANIMACIONES POR SECCIÓN
   Re-disparo completo al volver
══════════════════════════════════════ */
const EFECTOS = {
    presentacion: 'efecto-presentacion',
    proceso: 'efecto-proceso',
    herramientas: 'efecto-herramientas',
    proyectos: 'efecto-proyectos',
    educacion: 'efecto-educacion',
    contacto: 'efecto-contacto',
};

new IntersectionObserver(entradas => {
    entradas.forEach(e => {
        const clase = EFECTOS[e.target.id];
        if (!clase) return;
        if (e.isIntersecting) {
            e.target.classList.add(clase);
            e.target.querySelectorAll('.aparece').forEach((el, i) => {
                el.classList.remove('visible');
                void el.offsetWidth;
                setTimeout(() => el.classList.add('visible'), 60 + i * 80);
            });
        } else {
            setTimeout(() => e.target.classList.remove(clase), 500);
        }
    });
}, { threshold: 0.45, root: desplazador }).observe
    ? (() => {
        const obs = new IntersectionObserver(entradas => {
            entradas.forEach(e => {
                const clase = EFECTOS[e.target.id];
                if (!clase) return;
                if (e.isIntersecting) {
                    e.target.classList.add(clase);
                    e.target.querySelectorAll('.aparece').forEach((el, i) => {
                        el.classList.remove('visible');
                        void el.offsetWidth;
                        setTimeout(() => el.classList.add('visible'), 60 + i * 80);
                    });
                } else {
                    setTimeout(() => e.target.classList.remove(clase), 500);
                }
            });
        }, { threshold: 0.45, root: desplazador });
        document.querySelectorAll('.seccion').forEach(s => obs.observe(s));
    })()
    : null;

// Asegurar que el observer se crea correctamente
(function () {
    const obs = new IntersectionObserver(entradas => {
        entradas.forEach(e => {
            const clase = EFECTOS[e.target.id];
            if (!clase) return;
            if (e.isIntersecting) {
                e.target.classList.add(clase);
                e.target.querySelectorAll('.aparece').forEach((el, i) => {
                    el.classList.remove('visible');
                    void el.offsetWidth;
                    setTimeout(() => el.classList.add('visible'), 60 + i * 80);
                });
            } else {
                setTimeout(() => e.target.classList.remove(clase), 500);
            }
        });
    }, { threshold: 0.45, root: desplazador });
    document.querySelectorAll('.seccion').forEach(s => obs.observe(s));
})();

/* ══ PROCESO — escalones ══ */
const secProceso = document.getElementById('proceso');
if (secProceso) {
    new IntersectionObserver(es => {
        es.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.querySelectorAll('.escalon').forEach((esc, i) => {
                esc.classList.remove('escalon-activo');
                void esc.offsetWidth;
                setTimeout(() => esc.classList.add('escalon-activo'), i * 120);
            });
        });
    }, { threshold: 0.3, root: desplazador }).observe(secProceso);
}

/* ══ PROYECTOS — números glitch ══ */
const secProyectos = document.getElementById('proyectos');
if (secProyectos) {
    new IntersectionObserver(es => {
        es.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.querySelectorAll('.numero-proyecto').forEach((num, i) => {
                const final = num.dataset.final || num.textContent.trim();
                num.dataset.final = final;
                let frame = 0;
                const chars = '0123456789';
                num.classList.add('num-glitch');
                const tick = setInterval(() => {
                    if (frame >= 12) { num.textContent = final; num.classList.remove('num-glitch'); clearInterval(tick); return; }
                    num.textContent = chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)];
                    frame++;
                }, 40 + i * 20);
            });
        });
    }, { threshold: 0.3, root: desplazador }).observe(secProyectos);
}

/* ══ HERRAMIENTAS — scan-line ══ */
const secHerramientas = document.getElementById('herramientas');
if (secHerramientas) {
    new IntersectionObserver(es => {
        es.forEach(e => e.target.classList.toggle('scan-activo', e.isIntersecting));
    }, { threshold: 0.4, root: desplazador }).observe(secHerramientas);
}

/* ══ EDUCACIÓN — tarjetas en cascada ══ */
const secEducacion = document.getElementById('educacion');
if (secEducacion) {
    new IntersectionObserver(es => {
        es.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.querySelectorAll('.card-edu').forEach((card, i) => {
                card.classList.remove('visible');
                void card.offsetWidth;
                setTimeout(() => card.classList.add('visible'), i * 140);
            });
        });
    }, { threshold: 0.25, root: desplazador }).observe(secEducacion);
}

/* ══ CONTACTO — typewriter ══ */
const secContacto = document.getElementById('contacto');
if (secContacto) {
    new IntersectionObserver(es => {
        es.forEach(e => {
            if (!e.isIntersecting) return;
            const titulo = e.target.querySelector('.titulo-contacto');
            if (!titulo) return;
            const original = titulo.dataset.textoOriginal || titulo.innerText;
            titulo.dataset.textoOriginal = original;
            titulo.innerHTML = '';
            titulo.classList.add('titulo-escribiendo');
            const chars = original.split('');
            let i = 0;
            const escribir = setInterval(() => {
                if (i >= chars.length) { clearInterval(escribir); titulo.classList.remove('titulo-escribiendo'); return; }
                titulo.innerHTML += chars[i] === '\n' ? '<br/>' : chars[i];
                i++;
            }, 38);
        });
    }, { threshold: 0.5, root: desplazador }).observe(secContacto);
}