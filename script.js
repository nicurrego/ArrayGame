// Seleccionar elementos del DOM
const startScreen = document.querySelector('.start-screen');
const playButton = document.querySelector('.start-screen button');
const manualButton = document.querySelector('.manualButton')

// Referencias a los elementos del manual en el DOM
const manual = document.querySelector('.manual');
const manualTitle = document.querySelector('.manualTitle');
const manualContent = document.querySelector('.manualContent');
const manualBottom = document.querySelector('.manual_bottom');
const manualPrevButton = document.querySelector('#manualPrevButton');
const levelSpan = document.querySelector('.level span');
const stepSpan = document.querySelector('.stepSpan span');
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
let levels = [];
fetchData('levels.json')
  .then(data => {
    levels = data;
  })
  .catch(error => {
    console.error('No se pudo cargar los niveles:', error);
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



// Función para actualizar el valor del índice actual en el DOM
function showNewStep(stepCount) {
  stepSpan.innerHTML = stepCount
}

// Función para actualizar el valor del nivel actual en el DOM
function nuevoNivel(levelCount) {
 levelSpan.innerHTML = levelCount
}

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
    actualizarManual(stepCount);
    actualizarExpresion('speaking');
  }, 600);
});


// Función para actualizar el contenido del manual según el nivel y paso actual
// Contadores para los niveles y los pasos actuales
let actualLevel;
let actualStep;
let levelCount = 0;
let stepCount = 0;
let hintCount = 0
let reachedLevel = 0; // Nivel máximo que el usuario ha logrado alcanzar

function actualizarManual(stepCount) {
  actualLevel = levels[levelCount]; 
  actualStep = actualLevel.steps[stepCount]
  // 'pasoActual' se refiere al paso específico dentro del nivel actual
  nuevoTituloManual(actualStep.title); // Actualiza el título del manual
  nuevoContenidoManual(actualStep.content); // Actualiza el contenido del manual utilizando innerHTML
  showNewStep(stepCount); // Actualiza el valor del índice actual en el DOM
  nuevoNivel(levelCount); // Actualiza el valor del nivel actual en el DOM
}

manualNextButton.addEventListener('click', () => {
  if (stepCount < actualLevel.steps.length - 1) {
    stepCount++;
  } else if (levelCount < reachedLevel) {
    levelCount++;
    stepCount = 0;
  } else {
    mostrarMensaje("Completa el nivel actual para desbloquear el siguiente.");
    return;
  }

  actualizarManual(stepCount);
});

manualPrevButton.addEventListener('click', () => {
  if (stepCount > 0) {
    stepCount--;
  } else if (levelCount > 0) {
    levelCount--;
    stepCount = levels[levelCount].steps.length - 1;
  } else {
    mostrarMensaje("Ya estás en el primer nivel.");
    return;
  }

  actualizarManual(stepCount);
});


// Función para mostrar un mensaje en la interfaz
function mostrarMensaje(mensaje) {
  console.log(mensaje); // Por ahora se utiliza console.log, pero se podría reemplazar por lógica de interfaz
}
// Función para actualizar el título del manual
function nuevoTituloManual(mensaje){  
  manualTitle.innerHTML = mensaje;
}
// Función para actualizar el contenido del manual
function nuevoContenidoManual(mensaje){
  manualContent.innerHTML = mensaje;
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
  const patronNivelActual = patronesNivel.nivel_levelCount;
  const claveNivel = `nivel_${levelCount}`;
  
  // Verificar que el nivel y paso existen
  if (!patronNivelActual || !patronNivelActual[claveNivel] || indexCount >= patronNivelActual[claveNivel].length) {
    console.error('El nivel o paso actual no es válido.');
    return;
  }

  const pasoActual = patronNivelActual[claveNivel][indexCount];
  
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
    if (indexCount >= patronNivelActual[claveNivel].length) {
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

