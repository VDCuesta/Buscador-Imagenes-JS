//Globales
let paginaActual = 1;
let terminoBusqueda = "";
let totalPaginas = 0;

//Cuando cargue
window.onload = () => {
  const formulario = document.getElementById("formulario");

  //Añade el evento subit al formulario, que llamará a manejadorEnvio
  formulario.addEventListener("submit", manejadorEnvio);

  //Añade al botón evento click, que cambia el número de la página actual y actualiza resultados
  document.querySelector("#paginaAnterior").addEventListener("click", () => {
    paginaActual -= 1;

    actualizarResultados();
  });

  //Añade al botón evento click, que cambia el número de la página actual y actualiza resultados
  document.querySelector("#paginaSiguiente").addEventListener("click", () => {
    paginaActual += 1;
    actualizarResultados();
  });
};

//Muestra mensaje de error por consola
function mostrarError(mensaje) {
  console.log(mensaje);
}

//Trae de la API las imgágenes correspondientes a la búsqueda y la página actual, devuelve el resultado
async function buscarImagenes() {
  const API_KEY = "ZrJ464vFRcyMUVuMvPjgJQVU8JDvG_eEeeVbpO8vRZA";
  const URL = `https://api.unsplash.com/search/photos?query=${terminoBusqueda}&client_id=${API_KEY}&page=${paginaActual}`;

  const respuesta = await fetch(URL);
  const resultado = await respuesta.json();
  return resultado;
}

//Genera una img por cada resultado y la añade al div resultado
function mostrarImagenes(imagenes) {
  const contenedorResultados = document.getElementById("resultado");

  contenedorResultados.innerHTML = "";

  //Itera
  for (const imagen of imagenes) {
    const elementoImagen = document.createElement("img");
    //Añade el atributo urls.full del objecto al src del elemento img
    elementoImagen.src = imagen.urls.full;
    //Añade clases de tailwind
    elementoImagen.classList = "rounded-md aspect-square object-cover max-h-80";
    //Lo añade al div
    contenedorResultados.appendChild(elementoImagen);
  }
}

//Actualiza los resultados en pantalla
async function actualizarResultados() {
  try {
    // Busca imágenes y las devuelve
    const respuesta = await buscarImagenes();

    //Guarda el total de páginas de la búsqueda
    totalPaginas = respuesta.total_pages;

    //Muestra los resultados
    mostrarImagenes(respuesta.results);

    //Si la página es la primera, oculta el botón de anterior
    if (paginaActual === 1) {
      document.querySelector("#paginaAnterior").classList.add("hidden");
    } else {
      document.querySelector("#paginaAnterior").classList.remove("hidden");
    }

    //Si la página es la última, oculta el botón de siguiente
    if (paginaActual === totalPaginas) {
      document.querySelector("#paginaSiguiente").classList.add("hidden");
    } else {
      document.querySelector("#paginaSiguiente").classList.remove("hidden");
    }
  } catch (err) {
    mostrarError(err.message);
  }
}

//Controla los datos del formulario
function manejadorEnvio(evt) {
  evt.preventDefault();
  const formulario = evt.target;

  //Guarda el término de búsqueda
  terminoBusqueda = formulario.busqueda.value;

  //Si está vacío, sale
  if (terminoBusqueda.length === 0)
    return mostrarError("El término de búsqueda está vacío");

  //Si continúa la ejecución, vuelve a poner la página actual a 1
  //antes de actualizar resultados
  paginaActual = 1;

  actualizarResultados();
}
