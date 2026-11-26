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

// HORARIO DE DIRECTOS: edita aquí tus días, horas y temas.
// hora: formato 24 h en hora de Venezuela (ejemplo "20:00" = 8:00 PM). Usa null si ese día no hay directo.
// dia: 0 = domingo, 1 = lunes ... 6 = sábado.
const UTC_VENEZUELA = -4; // Venezuela no cambia de horario en verano
const horario = [
  { nombre: "Lunes", dia: 1, hora: "17:00", tema: "Pokemon", plataforma: "Twitch" },
  { nombre: "Martes", dia: 2, hora: "19:00", tema: "Roblox", plataforma: "Twitch" },
  { nombre: "Miércoles", dia: 3, hora: "17:00", tema: "Videoreacciones", plataforma: "Twitch" },
  { nombre: "Jueves", dia: 4, hora: "19:00", tema: "Pokemon", plataforma: "Twitch" },
  { nombre: "Viernes", dia: 5, hora: "17:00", tema: "Tarde con viewrs", plataforma: "Twitch" },
  { nombre: "Sábado", dia: 6, hora: null, tema: "Día de descanso", plataforma: "" },
  { nombre: "Domingo", dia: 0, hora: null, tema: "Día de descanso", plataforma: "" }
];

const CORREO = "mishu716.2008oficial@gmail.com"; // aquí llegan los mensajes del formulario

/* ====== UTILIDADES ====== */
const $ = (id) => document.getElementById(id);

// "20:00" -> "8:00 PM"
function hora12(texto) {
  const [h, m] = texto.split(":").map(Number);
  return ((h % 12) || 12) + ":" + String(m).padStart(2, "0") + (h < 12 ? " AM" : " PM");
}

// Fecha real de la próxima vez que ocurre ese día y hora (en hora de Venezuela)
function proxima(dia, texto, ahoraVE) {
  const [h, m] = texto.split(":").map(Number);
  const diff = (dia - ahoraVE.getUTCDay() + 7) % 7;
  return new Date(Date.UTC(ahoraVE.getUTCFullYear(), ahoraVE.getUTCMonth(), ahoraVE.getUTCDate() + diff, h - UTC_VENEZUELA, m));
}

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

// Horario: marca el día de hoy y, si el visitante está en otra zona horaria, muestra su hora local
const ahoraVE = new Date(Date.now() + UTC_VENEZUELA * 3600000);
$("lista-horario").innerHTML = horario.map(d => {
  const hoy = d.dia === ahoraVE.getUTCDay();
  const etiqueta = hoy ? '<span class="etiqueta-hoy">Hoy</span>' : "";
  if (!d.hora) {
    return `<article class="tarjeta dia descanso${hoy ? " es-hoy" : ""}"><h3>${d.nombre}${etiqueta}</h3>
      <span class="hora">Sin directo</span><p class="tema">${d.tema}</p></article>`;
  }
  const f = proxima(d.dia, d.hora, ahoraVE);
  let local = "";
  if (f.getTimezoneOffset() !== -UTC_VENEZUELA * 60) {
    const dia = f.getDay() !== d.dia ? f.toLocaleDateString("es", { weekday: "long" }) + " " : "";
    local = `<span class="local">Tu hora: ${dia}${f.toLocaleTimeString("es", { hour: "numeric", minute: "2-digit" })}</span>`;
  }
  return `<article class="tarjeta dia${hoy ? " es-hoy" : ""}"><h3>${d.nombre}${etiqueta}</h3>
    <span class="hora">${hora12(d.hora)}</span>${local}
    <p class="tema">${d.tema}</p><small class="plataforma">${d.plataforma}</small></article>`;
}).join("");

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
