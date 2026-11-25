/* ====== DATOS: edita aquí tu información ====== */
const habilidades = [
  { nombre: "Edición de video", detalle: "Filmora y Capcut" },
  { nombre: "Streaming", detalle: "OBS y Streamlabs" },
  { nombre: "Guion", detalle: "Ideas y temas de qué hablar" },
  { nombre: "Diseño gráfico", detalle: "Miniaturas y logotipos" },
  { nombre: "Comunidad", detalle: "Moderación y eventos" },
  { nombre: "Programación", detalle: "HTML, CSS y JavaScript" }
];

// IMPORTANTE: cambia los datos marcados con TU-... por los reales.
// "imagen" = foto de perfil de ese canal. Guárdala en la carpeta "imagenes"
// con exactamente ese nombre. Si el archivo no existe, se muestra la inicial.
// Usa los mismos enlaces en los logos del footer de index.html.
const canales = [
  { plataforma: "YouTube", usuario: "@mishu716", detalle: "Videos y más", url: "https://youtube.com/@mishu716", imagen: "imagenes/youtube.jpg" },
  { plataforma: "Twitch", usuario: "mishuu716", detalle: "Directos de lunes a viernes", url: "https://www.twitch.tv/mishuu716", imagen: "imagenes/twitch.jpg" },
  { plataforma: "Kick", usuario: "mishuu716", detalle: "Directos y más", url: "https://kick.com/mishuu716", imagen: "imagenes/kick.jpg" },
  { plataforma: "TikTok", usuario: "@mishu.716", detalle: "Clips cortos", url: "https://www.tiktok.com/@mishu.716", imagen: "imagenes/tiktok.jpg" },
  { plataforma: "Instagram", usuario: "@mishuu.2008", detalle: "Fotos, historias y avisos", url: "https://instagram.com/mishuu.2008", imagen: "imagenes/instagram.jpg" },
  { plataforma: "X", usuario: "@mishu716", detalle: "Noticias y avisos", url: "https://x.com/mishu716", imagen: "imagenes/x.jpg" }
];

const productos = [
  { id: 1, nombre: "Camiseta oficial", detalle: "Algodón, estampado exclusivo.", precio: 24.99, estilo: "" },
  { id: 2, nombre: "Sudadera con capucha", detalle: "Edición limitada de la comunidad.", precio: 44.99, estilo: "v2" },
  { id: 3, nombre: "Taza gamer", detalle: "Cerámica de 350 ml.", precio: 12.5, estilo: "v3" },
  { id: 4, nombre: "Gorra bordada", detalle: "Ajustable, logo bordado.", precio: 19.99, estilo: "v2" },
  { id: 5, nombre: "Pack de stickers", detalle: "10 stickers resistentes al agua.", precio: 6, estilo: "" },
  { id: 6, nombre: "Mousepad XL", detalle: "Superficie suave, base antideslizante.", precio: 22, estilo: "v3" }
];

const CORREO = "mishu716.2008oficial@gmail.com"; // aquí llegan los pedidos y mensajes

/* ====== UTILIDADES ====== */
const $ = (id) => document.getElementById(id);
const dinero = (n) => "$" + n.toFixed(2);
const producto = (id) => productos.find(x => x.id === id);

// Carga el carrito guardado y descarta datos inválidos
// (por ejemplo, productos que ya no existen en la lista).
let carrito = [];
try {
  const guardado = JSON.parse(localStorage.getItem("carrito"));
  if (Array.isArray(guardado)) {
    carrito = guardado.filter(i => producto(i.id) && Number.isInteger(i.cant) && i.cant > 0);
  }
} catch (e) { carrito = []; }

/* ====== PINTAR LA PÁGINA ====== */
$("lista-habilidades").innerHTML = habilidades.map(h =>
  `<div class="habilidad"><h3>${h.nombre}</h3><small>${h.detalle}</small></div>`).join("");

$("lista-canales").innerHTML = canales.map(c =>
  `<article class="tarjeta canal"><div class="cuerpo">
    <div class="canal-cabeza">
      <div class="avatar" data-inicial="${c.plataforma.charAt(0)}"><img src="${c.imagen}" alt="Foto de perfil de ${c.plataforma}" loading="lazy" onerror="this.remove()"></div>
      <div><h3>${c.plataforma}</h3><small>${c.usuario}</small></div>
    </div>
    <p>${c.detalle}</p>
    <a class="boton" href="${c.url}" target="_blank" rel="noopener">Visitar canal</a>
  </div></article>`).join("");

$("lista-productos").innerHTML = productos.map(p =>
  `<article class="tarjeta">
    <div class="imagen ${p.estilo}">${p.nombre}</div>
    <div class="cuerpo"><h3>${p.nombre}</h3><p>${p.detalle}</p>
      <span class="precio">${dinero(p.precio)}</span>
      <button class="boton" type="button" data-id="${p.id}">Agregar al carrito</button>
    </div></article>`).join("");

/* ====== CARRITO ====== */
function guardar() {
  try { localStorage.setItem("carrito", JSON.stringify(carrito)); } catch (e) {}
}

function pintarCarrito() {
  const lista = $("items-carrito");
  if (carrito.length === 0) {
    lista.innerHTML = '<li class="vacio">Tu carrito está vacío. Agrega un producto de la tienda.</li>';
  } else {
    lista.innerHTML = carrito.map(i => {
      const p = producto(i.id);
      return `<li><strong>${p.nombre}</strong><span>${dinero(p.precio * i.cant)}</span>
        <div class="cantidad">
          <button type="button" data-menos="${p.id}" aria-label="Quitar uno">−</button>
          <span>${i.cant}</span>
          <button type="button" data-mas="${p.id}" aria-label="Agregar uno">+</button>
        </div></li>`;
    }).join("");
  }
  const total = carrito.reduce((s, i) => s + producto(i.id).precio * i.cant, 0);
  $("total").textContent = dinero(total);
  $("contador").textContent = carrito.reduce((s, i) => s + i.cant, 0);
  guardar();
}

function cambiar(id, delta) {
  const item = carrito.find(i => i.id === id);
  if (item) {
    item.cant += delta;
    if (item.cant <= 0) carrito = carrito.filter(i => i.id !== id);
  } else if (delta > 0) {
    carrito.push({ id, cant: 1 });
  }
  pintarCarrito();
}

// Abrir / cerrar el carrito, cuidando el foco para quien usa teclado
let focoPrevio = null;
function abrir(si) {
  const panel = $("panel-carrito");
  if (panel.classList.contains("abierto") === si) return;
  panel.classList.toggle("abierto", si);
  $("fondo").classList.toggle("abierto", si);
  if (si) {
    focoPrevio = document.activeElement;
    setTimeout(() => $("cerrar-carrito").focus(), 50);
  } else if (focoPrevio) {
    focoPrevio.focus();
    focoPrevio = null;
  }
}

$("lista-productos").addEventListener("click", (e) => {
  const b = e.target.closest("[data-id]");
  if (b) { cambiar(Number(b.dataset.id), 1); abrir(true); }
});
$("items-carrito").addEventListener("click", (e) => {
  const mas = e.target.closest("[data-mas]");
  const menos = e.target.closest("[data-menos]");
  if (mas) cambiar(Number(mas.dataset.mas), 1);
  if (menos) cambiar(Number(menos.dataset.menos), -1);
});
$("abrir-carrito").addEventListener("click", () => abrir(true));
$("cerrar-carrito").addEventListener("click", () => abrir(false));
$("fondo").addEventListener("click", () => abrir(false));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") abrir(false); });

// Al finalizar, abre un correo con el resumen del pedido.
// Para cobrar de verdad, aquí se conectaría Stripe, PayPal o Mercado Pago.
$("pagar").addEventListener("click", () => {
  if (carrito.length === 0) return;
  const lineas = carrito.map(i => {
    const p = producto(i.id);
    return `${i.cant} x ${p.nombre} (${dinero(p.precio * i.cant)})`;
  });
  const cuerpo = `Hola, quiero hacer este pedido:\n\n${lineas.join("\n")}\n\nTotal: ${$("total").textContent}`;
  location.href = `mailto:${CORREO}?subject=${encodeURIComponent("Nuevo pedido")}&body=${encodeURIComponent(cuerpo)}`;
});

/* ====== FORMULARIO DE CONTACTO ====== */
$("formulario").addEventListener("submit", (e) => {
  e.preventDefault();
  const cuerpo = `${$("f-mensaje").value}\n\n- ${$("f-nombre").value}`;
  location.href = `mailto:${CORREO}?subject=${encodeURIComponent("Mensaje desde tu web")}&body=${encodeURIComponent(cuerpo)}`;
});

/* ====== MENÚ: resalta la sección visible ====== */
const enlaces = document.querySelectorAll(".lateral nav a");
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach(en => {
    if (en.isIntersecting) {
      enlaces.forEach(a => a.classList.toggle("activo", a.getAttribute("href") === "#" + en.target.id));
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("main section").forEach(s => observador.observe(s));

pintarCarrito();
