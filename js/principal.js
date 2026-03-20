/* ═══════════════════════════════════════════════════════
   principal.js  —  Jakob Ponce Portfolio
═══════════════════════════════════════════════════════ */

const desplazador = document.getElementById('desplazador');

/* ══ CURSOR — nativo, sin custom cursor ══ */
if (window.matchMedia('(pointer: fine)').matches) {

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
        // Saltar el titulo-contacto — lo maneja el typewriter por separado
        if (el.classList.contains('titulo-contacto')) return;
        const txt = el.getAttribute('data-' + lang);
        if (!txt) return;
        if (/<[a-z][\s\S]*>/i.test(txt)) el.innerHTML = txt;
        else el.textContent = txt;
    });
    // Actualizar el titulo-contacto respetando el typewriter
    const tituloContacto = document.querySelector('.titulo-contacto');
    if (tituloContacto) {
        const nuevoTexto = tituloContacto.getAttribute('data-' + lang);
        if (nuevoTexto) {
            // Guardar el nuevo texto para cuando el typewriter se vuelva a disparar
            tituloContacto.dataset.textoOriginal = nuevoTexto.replace(/\\n/g, '\n');
            // Si la sección contacto es visible, actualizar el texto directamente
            const secC = document.getElementById('contacto');
            if (secC && secC.classList.contains('efecto-contacto')) {
                tituloContacto.innerHTML = nuevoTexto.replace(/\n/g, '<br/>');
            }
        }
    }
    document.title = lang === 'es' ? 'Jakob Ponce — Ingeniero Fullstack' : 'Jakob Ponce — Fullstack Engineer';
    // Actualizar tooltip de nav dots según idioma
    document.querySelectorAll('.nav-dot').forEach(dot => {
        const txt = dot.getAttribute('data-' + lang);
        if (txt) {
            dot.title = txt;
            // CSS attr() solo lee data-es; para EN usamos un pseudo-elemento via CSS var
            dot.style.setProperty('--dot-label', '"' + txt + '"');
        }
    });
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


/* ══ NAV DOTS ══ */
(function () {
    const dots = document.querySelectorAll('.nav-dot');
    const secciones = document.querySelectorAll('.seccion');

    // Clic en dot → scroll a sección
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const sec = document.getElementById(dot.dataset.seccion);
            if (sec) sec.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Observer — activa el dot de la sección visible
    const obsDots = new IntersectionObserver(entradas => {
        entradas.forEach(e => {
            if (!e.isIntersecting) return;
            dots.forEach(d => d.classList.remove('activo'));
            const dot = document.querySelector('.nav-dot[data-seccion="' + e.target.id + '"]');
            if (dot) dot.classList.add('activo');

            // Clase en-contacto para invertir colores en sección oscura
            if (e.target.id === 'contacto') document.body.classList.add('en-contacto');
            else document.body.classList.remove('en-contacto');
        });
    }, { threshold: 0.5, root: desplazador });

    secciones.forEach(s => obsDots.observe(s));

    // Actualizar tooltips al cambiar idioma
    const aplicarIdiomaOriginal = window._aplicarIdiomaNav;
})();

/* ══ ANIMACIONES POR SECCIÓN (re-disparo al volver) ══ */
const EFECTOS = {
    presentacion: 'efecto-presentacion',
    proceso: 'efecto-proceso',
    herramientas: 'efecto-herramientas',
    proyectos: 'efecto-proyectos',
    educacion: 'efecto-educacion',
    contacto: 'efecto-contacto',
};

const obsSecciones = new IntersectionObserver(entradas => {
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

document.querySelectorAll('.seccion').forEach(s => obsSecciones.observe(s));

/* ══ PROCESO — escalones en cascada ══ */
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
            e.target.querySelectorAll(".card-proyecto-num").forEach((num, i) => {
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
            // Usa el texto del idioma actual (guardado en textoOriginal por aplicarIdioma)
            const attrTexto = titulo.getAttribute('data-' + idiomaActual);
            const original = attrTexto
                ? attrTexto.replace(/\\n/g, '\n')
                : (titulo.dataset.textoOriginal || titulo.innerText);
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