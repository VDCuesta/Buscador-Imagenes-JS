# Buscador de imágenes
El proyecto consiste de un buscador de imágenes que hace uso del servicio de Unsplash y Tailwind para la maquetación de la aplicación.

### Documentación de Unsplash
Podemos encontrar toda la documentación de la API de Unsplash en este enlace https://unsplash.com/documentation

### Funcionalidad de la aplicación
La página principal de la aplicación contiene un formulario donde el usuario puede introducir un término de búsqueda. Si la búsqueda obtiene resultados, estas se mostrarán en pantalla en páginas de 10 imágenes. 

En la primera página aparece un botón de siguiente, y en las siguiente aparece tanto un botón de anterior como de siguiente, permitiendo al usuario navegar entre páginas de resultados.

## Bloques

### Globales y listeners
La aplicación contiene tres variables globales que asisten a la búsqueda y paginación de la aplicación.

```javascript
  let paginaActual = 1;
  let terminoBusqueda = "";
  let totalPaginas = 0;
```
Además se añade una función cuando carga la ventana que añade eventos.

Añade un evento `submit` a el formulario y eventos `click` a los botones de anterior y siguiente

```javascript
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
```

### Mostrar error

Una función dedicada a mostrar los mensajes de errores por consola.

```javascript
//Muestra mensaje de error por consola
function mostrarError(mensaje) {
  console.log(mensaje);
}
```

### Traer información de la API

La función `buscarImagenes()` es una función asíncrona que realiza una búsqueda en la API de Unsplash y devuelve los resultados en formato JSON.

```javascript
//Trae de la API las imgágenes correspondientes a la búsqueda y la página actual, devuelve el resultado
async function buscarImagenes() {
  const API_KEY = "ZrJ464vFRcyMUVuMvPjgJQVU8JDvG_eEeeVbpO8vRZA";
  const URL = `https://api.unsplash.com/search/photos?query=${terminoBusqueda}&client_id=${API_KEY}&page=${paginaActual}`;

  const respuesta = await fetch(URL);
  const resultado = await respuesta.json();
  return resultado;
}
```

### Mostrar imágenes

La función `mostrarImagenes(imagenes)` recibe un array de objetos sacados del JSON obtenido con `buscarImagenes()`. Itera por cada objeto e inserta en el DOM
un elemento imagen con estilos de Tailwind por cada uno de ellos.

```javascript
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
```

### Actualizar resultados

La función asíncrona `actualizarResultados()` se encarga de actualizar los resultados de la página correspondiente en pantalla.

Dentro se hace llamada a las funciones `buscarImagenes()` para obtener el JSON, `mostrarImagenes(imagenes)` para crear las imágenes en el DOM y muestra o no los botones Anterior y Siguiente en función del número de página en la que se encuentre el usuario.

En caso de producirse algún error, se llama a la función `mostrarError(error)`.

```javascript
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
```

### Manejador del envío

Cuando el usuario introduce y envía un término de búsqueda, se llama a la función `manejadorEnvio(evt)`.

Esta función comprueba si el término de búsqueda está vacío, mostrando error en caso de ser cierto, de lo contrario restaura la página actual a la primera página y llama a `actualizarResultados()`

```javascript
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
```
