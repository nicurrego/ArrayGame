// Seleccionar elementos del DOM
const startScreen = document.querySelector('.start-screen');
const playButton = document.querySelector('.start-screen button');

// Referencias a los elementos del manual en el DOM
const manual = document.querySelector('.manual');
const tituloManual = document.querySelector('.titulo');
const manualText = document.querySelector('.manualText');
const manualButton = document.querySelector('.manualButton');
const manualPrevButton = document.querySelector('#manualPrevButton');
const manualNextButton = document.querySelector('#manualNextButton');

const mensajes = document.querySelector('.mensajes');
const mensajeButton = document.querySelector('#mensajeButton');

const inputPlayer = document.querySelector('#inputPlayer');
const startButton = document.querySelector('#start');

const gameScreen = document.querySelector('.game-screen');
const stackContainer1 = document.querySelector('.stack-1');
const stackContainerName1 = document.querySelector('.name1');
const stackContainer2 = document.querySelector('.stack-2');
const stackContainerName2 = document.querySelector('.name2');
const frutaContainer = document.querySelector('.frutas');
const frutasSeleccionadas = [];


//Fetch de los JSON
async function fetchData(url) {
  let attempts = 0;
  const maxRetries = 3;
  while (attempts < maxRetries) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al cargar ${url}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      attempts++;
      console.error(`Fetch error (intento ${attempts} de ${maxRetries}):`, error);
      if (attempts >= maxRetries) {
        console.error('Número máximo de intentos alcanzado. No se pudo cargar los datos.');
        throw error;
      }
    }
  }
}

// Cargar las expresiones del personaje
let expresionesPersonaje = [];
fetchData('expresionesPersonaje.json')
  .then(data => {
    expresionesPersonaje = data;
  })
  .catch(error => {
    console.error('No se pudo cargar las expresiones del personaje:', error);
  });

// Cargar los mensajes por niveles
let listadoMensajes = [];
fetchData('listadoMensajes.json')
  .then(data => {
    listadoMensajes = data;
  })
  .catch(error => {
    console.error('No se pudo cargar los mensajes por niveles:', error);
  });

// Cargar los patrones por niveles
let patronesNivel = [];
fetchData('patronesNivel.json')
  .then(data => {
    patronesNivel = data;
  })
  .catch(error => {
    console.error('No se pudo cargar los patrones por niveles:', error);
  });

// Cargar los objetos juego
let objetosJuego = [];
fetchData('objetosJuego.json')
  .then(data => {
    objetosJuego = data;
  })
  .catch(error => {
    console.error('No se pudo cargar los objetos del juego:', error);
  });

// Contadores para los niveles y los pasos actuales
let indexCount = 0;
let levelCount = 0;
const miraNivel = document.querySelector('.level');
const miraIndex = document.querySelector('.indexCount');

// Función para actualizar el valor del índice actual en el DOM
function nuevoIndex(indexCount) {
  // Limpiamos el contenedor del índice
  while (miraIndex.firstChild) {
    miraIndex.removeChild(miraIndex.firstChild);
  }
  // Creamos un nuevo párrafo en el DOM
  const pNew = document.createElement('p');
  // Añadimos el valor del índice al párrafo
  pNew.textContent = 'index: ' + indexCount;
  // Insertamos el párrafo en el contenedor del índice
  miraIndex.appendChild(pNew);
}

// Función para actualizar el valor del nivel actual en el DOM
function nuevoNivel(levelCount) {
  // Limpiamos el contenedor del nivel
  while (miraNivel.firstChild) {
    miraNivel.removeChild(miraNivel.firstChild);
  }
  // Creamos un nuevo párrafo en el DOM
  const pNew = document.createElement('p');
  // Añadimos el valor del nivel al párrafo
  pNew.innerHTML = 'level: ' + levelCount;
  // Insertamos el párrafo en el contenedor del nivel
  miraNivel.appendChild(pNew);
}
let niveles = [
  {
    "nivel_0": [
      {
        "title": "Bienvenido a Array Cat!",
        "content": " Aquí aprenderás los conceptos básicos de los arrays de una forma divertida y práctica."
      },
      {
        "title": "Manual de instrucciones",
        "content": "Este manual te ayudará a comprender cómo avanzar en el juego. <br><br> -> Puedes acceder a este manual en cualquier momento por si necesitas alguna pista o te sientes perdido. "
      },
      {
        "title": "Vamos a empezar!",
        "content": "Escribe el código en el campo de entrada<br><br><span style=\"color: blue;\">el area de color azul</span>.<br>-> Haz click en los botones para proceder."
      },
      {
        "title": "Creando tu Primer Array",
        "content": "Para empezar, vamos a crear un <code>array</code> vacío.<br><br>-> Escribe el siguiente código:<br> <code>let stack = [];</code><br><br>-> Luego presiona el botón de <code>START</code> para continuar."
      }
    ]
  }
];
fetchData('niveles.json')
    .then(data => {
    niveles = data;
    actualizarManual(indexCount);
  })
  .catch(error => {
    console.error('No se pudo cargar el manual de instrucciones:', error);
  });

// Mostrar la pantalla de inicio al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  loadFrutas(); // Función para cargar las frutas
});

function actualizarExpresion(expresionNombre = null) {
  // Selecciona el contenedor donde deseas mostrar la imagen
  const contenedorImagen = document.querySelector('.character');
  // Seleccionamos la imagen
  let imgElement = contenedorImagen.querySelector('img');
  if (!imgElement) {
    // Si no existe, la creamos
    imgElement = document.createElement('img');
    contenedorImagen.appendChild(imgElement);
  }

  // Determinar la expresión a mostrar, si no, se proporciona una
  if (!expresionNombre) {
    if (!manual.classList.contains('oculto')) {
      expresionNombre = 'speaking';
    } else if (!mensajes.classList.contains('oculto')) {
      // Mostrar la expresión dependiendo del tipo de mensaje
      const mensajeTexto = document.querySelector('.mensajeTextContiner p')?.textContent;
      if (mensajeTexto && listadoMensajes.some(l => l.mensajesIncorrectos.includes(mensajeTexto))) {
        expresionNombre = 'mad';
      } else {
        expresionNombre = 'happy';
      }
    } else {
      expresionNombre = 'normal';
    }
  }

  // Encontrar la expresión en el array de expresiones del personaje
  let expresion = expresionesPersonaje.find(exp => exp.nombre === expresionNombre);
  if (!expresion) {
    console.error(`Expresión '${expresionNombre}' no encontrada.`);
    return;
  }
  // Actualizar la imagen existente
  imgElement.src = expresion.imagen;
  imgElement.alt = expresion.nombre;
}

function loadFrutas() {
  if (!frutaContainer) {
    console.error('Contenedor de frutas no encontrado.');
    return;
  }

  // Limpiamos el contenedor de frutas previamente
  frutaContainer.innerHTML = '';

  frutasSeleccionadas.forEach((frutaName) => {
    const fruta = frutas.find(f => f.name === frutaName);
    if (fruta) {
      const frutaElement = document.createElement('div');
      frutaElement.className = 'elemento';

      const frutaInner = document.createElement('div');
      frutaInner.className = 'fruta';
      frutaInner.id = fruta.name;
      frutaInner.textContent = fruta.emoji;

      frutaElement.appendChild(frutaInner);
      frutaContainer.appendChild(frutaElement);
    }
  });
}

// Función para inicializar el juego
playButton.addEventListener('click', () => {
  if (!startScreen || !manual) {
    console.error('Elementos necesarios para iniciar el tutorial no encontrados.');
    return;
  }
  // Primera expresion del gato
  actualizarExpresion('sad');

  // Ocultar la pantalla de inicio
  startScreen.classList.add('oculto');

  // Mostrar el manual después de 1 segundo
  setTimeout(() => {
    manual.classList.remove('oculto');
    indexCount = 0;
    actualizarManual(indexCount);
    actualizarExpresion('speaking');
  }, 600);
});

// Variables globales para el control del estado del manual
let nivelAlcanzado = 0; // Nivel máximo que el usuario ha logrado alcanzar
let nivelActual = niveles[levelCount]; // Nivel actual dentro de la estructura 'niveles'
let claveNivel = Object.keys(nivelActual)[0]; // Clave del nivel actual

// Función para actualizar el contenido del manual según el nivel y paso actual
function actualizarManual() {
  // 'pasoActual' se refiere al paso específico dentro del nivel actual
  const pasoActual = nivelActual[`nivel_${levelCount}`][indexCount];

  nuevoTituloManual(pasoActual.title); // Actualiza el título del manual
  nuevoContenidoManual(pasoActual.content); // Actualiza el contenido del manual utilizando innerHTML
  nuevoIndex(indexCount); // Actualiza el valor del índice actual en el DOM
  nuevoNivel(levelCount); // Actualiza el valor del nivel actual en el DOM
}

// Evento para avanzar al siguiente paso o nivel
manualNextButton.addEventListener('click', () => {
  if (indexCount < nivelActual[claveNivel].length - 1) {
    indexCount++;
  } else if (levelCount < niveles.length - 1) {
    levelCount++;
    if (levelCount > nivelAlcanzado) {
      manual.classList.add('oculto');
      actualizarExpresion('normal')
      // mostrarMensaje("Primero tienes que completar el nivel para ver la siguiente instrucción.");
      levelCount--
      return;
    }
    indexCount = 0;
    nivelActual = niveles[levelCount];
    claveNivel = Object.keys(nivelActual)[0];
  }
  actualizarManual();
});

// Evento para retroceder al paso o nivel anterior
manualPrevButton.addEventListener('click', () => {
  if (indexCount > 0) {
    indexCount--;
  } else if (levelCount > 0) {
    levelCount--;
    nivelActual = niveles[levelCount];
    claveNivel = Object.keys(nivelActual)[0];
    indexCount = nivelActual[claveNivel].length - 1;
  }

  actualizarManual();
});

// Función para mostrar un mensaje en la interfaz
function mostrarMensaje(mensaje) {
  // Aquí se podría implementar la lógica para mostrar un mensaje al usuario de manera no intrusiva
  console.log(mensaje); // Por ahora se utiliza console.log, pero se podría reemplazar por lógica de interfaz
}
// Función para actualizar el título del manual
function nuevoTituloManual(mensaje){
  // Limpiamos el contenedor del título
  while (tituloManual.firstChild) {
    tituloManual.removeChild(tituloManual.firstChild);
  }
  // Creamos un nuevo párrafo en el DOM
  const pNew = document.createElement('p');
  // Añadimos el mensaje al párrafo
  pNew.innerHTML = mensaje;
  // Insertamos el párrafo en el contenedor del título
  tituloManual.appendChild(pNew);
}

// Referencia al contenedor de contenido del manual
const contenidoManual = document.querySelector('.contenido');

// Función para actualizar el contenido del manual
function nuevoContenidoManual(mensaje){
  // Limpiamos el contenedor del contenido
  while (contenidoManual.firstChild) {
    contenidoManual.removeChild(contenidoManual.firstChild);
  }
  // Creamos un nuevo párrafo en el DOM
  const pNew = document.createElement('p');
  // Añadimos el mensaje al párrafo
  pNew.innerHTML = mensaje;
  // Insertamos el párrafo en el contenedor del contenido
  contenidoManual.appendChild(pNew);
}

// Referencia al contenedor extra del manual (posible uso futuro)
const extra = document.querySelector('.extra');

// Función para actualizar el contenido extra del manual
function nuevoExtraManual(mensaje){
  // Limpiamos el contenedor extra
  while (extra.firstChild) {
    extra.removeChild(extra.firstChild);
  }
  // Creamos un nuevo párrafo en el DOM
  const pNew = document.createElement('p');
  // Añadimos el mensaje al párrafo
  pNew.innerHTML = mensaje;
  // Insertamos el párrafo en el contenedor extra
  extra.appendChild(pNew);
}

// Función para ocultar el manual al hacer clic en el textarea
gameScreen.addEventListener('click', (e) => {
  if (!manual.contains(e.target) && e.target !== manualButton) {
    manual.classList.add('oculto');
    actualizarExpresion();
  } else if (e.target === manualButton) {
    manual.classList.remove('oculto');
    actualizarExpresion('speaking');
  }
});

mensajeButton.addEventListener('click', () => {
  mensajes.classList.add('oculto');
  actualizarExpresion();
});

function mostrarMensaje(mensajeTexto) {
  const mensajeTextContiner = document.querySelector('.mensajeTextContiner');
  if (!mensajeTextContiner) {
    console.error('Contenedor de mensaje no encontrado.');
    return;
  }

  // Limpiamos el contenido de los mensajes anteriores
 mensajeTextContiner.innerHTML = '';

  // Crear un nuevo elemento <p>
  const newMensaje = document.createElement('p');
  newMensaje.textContent = mensajeTexto;

  // Añadir el nuevo mensaje al contenedor de mensajes
 mensajeTextContiner.appendChild(newMensaje);
  
  // Mostrar el contenedor de mensajes si estaba oculto
  mensajes.classList.remove('oculto');
  actualizarExpresion();
}

let levelStage = 0; // Indicador para la secuencia de los mensajes
// Función para verificar el contenido del textarea cuando se haga click en START
startButton.addEventListener('click', () => {
  if (!inputPlayer) {
    console.error('Campo de entrada no encontrado.');
    return;
  }
  
  let userInput = inputPlayer.value.trim();
  // Normalizar el input del usuario: quitamos espacios múltiples y reemplazamos con un único espacio
  userInput = userInput.replace(/\s+/g, ' ');

  // Obtener el patrón válido actual desde el JSON de patrones
  const nivelActual = patronesNivel[levelCount];
  const claveNivel = `nivel_${levelCount}`;
  
  // Verificar que el nivel y paso existen
  if (!nivelActual || !nivelActual[claveNivel] || indexCount >= nivelActual[claveNivel].length) {
    console.error('El nivel o paso actual no es válido.');
    return;
  }

  const pasoActual = nivelActual[claveNivel][indexCount];
  
  if (!pasoActual || !pasoActual.pattern) {
    console.error('El patrón para el paso actual no está disponible.');
    return;
  }

  // Crear la expresión regular desde el patrón
  const validPattern = new RegExp(pasoActual.pattern);
  
  // Verificar si el contenido del textarea cumple con el patrón
  if (validPattern.test(userInput)) {
    // Input válido para el paso actual
    mostrarMensaje(listadoMensajes[levelCount][claveNivel][indexCount].mensajesCorrectos);
    
    // Avanzar al siguiente paso
    indexCount++;

    // Si se completaron todos los pasos del nivel, pasar al siguiente nivel
    if (indexCount >= nivelActual[claveNivel].length) {
      levelCount++;
      indexCount = 0; // Reiniciar el contador de pasos
      mostrarMensaje(`¡Felicidades! Has completado el nivel ${levelCount - 1}. Ahora pasarás al nivel ${levelCount}.`);
    }

    // Actualizar el manual y el nivel en la interfaz
    actualizarManual();
    nuevoNivel(levelCount);

  } else {
    // Input inválido
    mostrarMensaje(listadoMensajes[levelCount][claveNivel][indexCount].mensajesIncorrectos);
  }
});

