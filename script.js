// Seleccionar elementos del DOM
const startScreen = document.querySelector('.start-screen');
const playButton = document.querySelector('.start-screen button');
const manual = document.querySelector('.manual');
const manualText = document.querySelector('.manualText');
const manualButton = document.querySelector('.manualButton');
const manualPrevButton = document.querySelector('#manualPrevButton');
const manualNextButton = document.querySelector('#manualNextButton');
const mensajes = document.querySelector('.mensajes');
const mensajeButton = document.querySelector('#mensajeButton');
const inputPlayer = document.querySelector('#inputPlayer');
const gameScreen = document.querySelector('.game-screen');
const stackContainer1 = document.querySelector('.stack-1');
const stackContainer2 = document.querySelector('.stack-2');
const stackContainerName1 = document.querySelector('.name1');
const stackContainerName2 = document.querySelector('.name2');
const startButton = document.querySelector('#start');
const frutaContainer = document.querySelector('.frutas');
const frutasSeleccionadas = [];

//Fetch de los JSON
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al cargar ${url}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
let expresionesPersonaje = [];
let listadoMensajes = [];
let manualSteps = [];
let currentStepIndex = 0;
let objetosJuego = [];

// Cargar las expresiones del personaje
fetchData('expresionesPersonaje.json')
  .then(data => {
    expresionesPersonaje = data;
  })
  .catch(error => {
    console.error('No se pudo cargar las expresiones del personaje:', error);
  });

// Cargar los mensajes por niveles
fetchData('listadoMensajes.json')
  .then(data => {
    listadoMensajes = data;
  })
  .catch(error => {
    console.error('No se pudo cargar los mensajes por niveles:', error);
  });

// Cargar los pasos del manual
fetchData('manualSteps.json')
  .then(data => {
    manualSteps = data;
    actualizarManual(currentStepIndex);
  })
  .catch(error => {
    console.error('No se pudo cargar el manual de instrucciones:', error);
  });

// Cargar los objetos juego
fetchData('objetosJuego.json')
  .then(data => {
    objetosJuego = data;
  })
  .catch(error => {
    console.error('No se pudo cargar los objetos del juego:', error);
  });




// Mostrar la pantalla de inicio al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  loadFrutas(); // Función para cargar las frutas
  loadStacks(); // Función para cargar los stacks
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
    currentStepIndex = 0;
    actualizarManual(currentStepIndex);
    actualizarExpresion('speaking');
  }, 600);
});

// Función para actualizar el contenido del manual
function actualizarManual(stepIndex) {
  if (!manualText) {
    console.error('Contenedor del manual no encontrado.');
    return;
  }
  const step = manualSteps[stepIndex];
  if (step) {
    manualText.innerHTML = `<p><strong>${step.title}</strong></p><p>${step.content}</p>`;
  }
}

// Función para mostrar el siguiente paso del manual
manualNextButton.addEventListener('click', () => {
  if (currentStepIndex < manualSteps.length - 1) {
    currentStepIndex++;
    actualizarManual(currentStepIndex);
    actualizarExpresion('speaking');
  } else if (currentStepIndex === manualSteps.length - 1) {
    manual.classList.add('oculto');
    actualizarExpresion();
  }
});

manualPrevButton.addEventListener('click', () => {
  if (currentStepIndex > 0) {
    currentStepIndex--;
    actualizarManual(currentStepIndex);
    actualizarExpresion('speaking');
  }
});

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
  const mensajeTextContiner = document.querySelector('.mensajeText');
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
  // Crear una expresión regular que acepte diferentes variantes del código válido
  const validPattern = /^let\s+stack\s*=\s*\[\s*\];$/;

  
  const nivel = 0; // Nivel actual, puedes cambiarlo según el progreso del juego
  // Verificar si el contenido del textarea cumple con el patrón
  if (validPattern.test(userInput)) {
    // Mostrar stack-1
    stackContainer1.classList.remove('oculto');
    stackContainerName1.classList.remove('oculto');
      setTimeout(() => {
        mostrarMensaje(listadoMensajes[nivel].mensajesCorrectos[Math.floor(Math.random() * listadoMensajes[nivel].mensajesCorrectos.length)]);
      }, 1000);
  } else {
    mostrarMensaje(listadoMensajes[nivel].mensajesIncorrectos[Math.floor(Math.random() * listadoMensajes[nivel].mensajesIncorrectos.length)]);
  }
});

// Función para actualizar los stacks desde el localStorage
function loadStacks() {
  if (!stackContainer1 || !stackContainer2) {
    console.error('Contenedores de stacks no encontrados.');
    return;
  }
  const stack1 = JSON.parse(localStorage.getItem('stack1')) || [];
  const stack2 = JSON.parse(localStorage.getItem('stack2')) || [];

  // Limpiamos los stacks antes de añadir los elementos
  stackContainer1.innerHTML = '';
  stackContainer2.innerHTML = '';

  // Añadimos los elementos del stack1
  stack1.forEach((frutaName) => {
    const fruta = frutas.find(f => f.name === frutaName);
    if (fruta) {
      const frutaElement = document.createElement('p');
      frutaElement.className = 'box';
      frutaElement.textContent = fruta.emoji;
      stackContainer1.appendChild(frutaElement);
    }
  });

  // Añadimos los elementos del stack2
  stack2.forEach((frutaName) => {
    const fruta = frutas.find(f => f.name === frutaName);
    if (fruta) {
      const frutaElement = document.createElement('p');
      frutaElement.className = 'box';
      frutaElement.textContent = fruta.emoji;
      stackContainer2.appendChild(frutaElement);
    }
  });
}
