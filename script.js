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
const levelSpan = document.querySelector('.levelSpan span');
const manualCloseButton = document.querySelector('#manualCloseButton')
const stepSpan = document.querySelector('.stepSpan span');
const manualNextButton = document.querySelector('#manualNextButton');

const map = document.querySelector('.map')
const mapCloseButton = document.querySelector('#mapCloseButton')
const mapButton = document.querySelector('.mapButton')

const speechBubble = document.querySelector('.speechBubble')
const speechBubbleCloseButton = document.querySelector('#speechBubbleCloseButton')
const speechBubbleText = document.querySelector('.speechBubbleText')


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

// Cargar el contenido de los niveles
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

// Función para actualizar el valor del índice actual en el DOM
function showNewStep(stepCount) {
  stepSpan.innerHTML = stepCount
}
// Función para actualizar el valor del nivel actual en el DOM
function nuevoNivel(levelCount) {
 levelSpan.innerHTML = levelCount
}

// Función para actualizar el contenido del manual según el nivel y paso actual
// Contadores para los niveles y los pasos actuales
let actualLevel;
let actualStep;
let levelCount = 0;
let stepCount = 0;
let hintCount = 0;
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
    manual.classList.add('oculto')
    actualizarExpresion('normal')
    return;
  }

  actualizarManual(stepCount);
});
manualCloseButton.addEventListener('click', () => {
  manual.classList.add('oculto')
  actualizarExpresion('normal')
})
//Para cerrar el speechBubble
speechBubbleCloseButton.addEventListener('click', () => {
  speechBubble.classList.add('oculto')
  actualizarExpresion('normal')
})
manualPrevButton.addEventListener('click', () => {
  if (stepCount > 0) {
    stepCount--;
  } else if (levelCount > 0) {
    levelCount--;
    stepCount = levels[levelCount].steps.length - 1;
  } else {
    return;
  }

  actualizarManual(stepCount);
});

// Función para actualizar el título del manual
function nuevoTituloManual(mensaje){  
  manualTitle.innerHTML = mensaje;
}
// Función para actualizar el contenido del manual
function nuevoContenidoManual(mensaje){
  manualContent.innerHTML = mensaje;
}

let userInput
let userAtemps = 0
// Función para verificar el contenido del textarea cuando se haga click en START
startButton.addEventListener('click', () => {
  
  if (!inputPlayer) {
    console.error('Campo de entrada no encontrado.');
    return;
  }

  userInput = inputPlayer.value.trim().replace(/\s+/g, ' ');

  // Obtener el patrón válido actual desde el JSON de patrones
  let levelPattern = levels[levelCount]?.pattern;
  if (!levelPattern) {
    console.error('Patrón no encontrado para el nivel actual.');
    return;
  }
  // Crear Regex dinámico
  try {
    levelPattern = new RegExp(levelPattern);
  } catch (error) {
    console.error('Error al crear el patrón Regex:', error);
    return;
  }
  // Verificar si el contenido del textarea cumple con el patrón
  if (levelPattern.test(userInput)) {

    userAtemps = 0
    reachedLevel++
    speechBubble.classList.add('oculto')
    actualizarExpresion('happy');
    switch (levelCount) {
      case 0:
        stackContainer1.classList.remove('oculto');
        stackContainerName1.classList.remove('oculto');
        break;
      case 1:
        let apple = newBox('Frutas', 0);
        stackContainer1.appendChild(apple);
        break;
      case 2:
        stackContainer1.lastChild.remove()
        break;
      case 3:
        stackContainer2.classList.remove('oculto')
        stackContainerName2.classList.remove('oculto')
        break;
      case 4:
        let kiwi = newBox('Frutas', 6)
        stackContainer2.appendChild(kiwi)
        actualizarExpresion('crazy')
        alert('この後はまっだ整理中です！ここまでお疲れ様です。')
        return;
    }
    setTimeout(() => {
      actualizarExpresion('speaking');
      manual.classList.remove('oculto');
      nuevoNivel(levelCount);
      inputPlayer.value = '';
    }, 1500);
  } else {
    console.log(userAtemps);
    
    if (userAtemps != 2|| userAtemps != 4 || userAtemps != 9) {
      actualizarExpresion('verySad');
    }

    userAtemps++
    switch (userAtemps) {
      case 3:
        let hint1 = levels[levelCount].hints[0]
          actualizarExpresion('speaking')
          speechBubble.classList.remove('oculto')
          speechBubbleText.innerHTML = hint1
          stopTalking();
        break;
      case 5:
        let hint2 = levels[levelCount].hints[1]
          actualizarExpresion('speaking')
          speechBubble.classList.remove('oculto')
          speechBubbleText.innerHTML = hint2
          stopTalking()
        break;
      case 10:
         let hint3 = levels[levelCount].hints[2]
          actualizarExpresion('speaking')
          speechBubble.classList.remove('oculto')
          speechBubbleText.innerHTML = hint3
          stopTalking();
          userAtemps = 0;
        break;
    
      default:
        setTimeout(() => {
          actualizarExpresion('normal');
        }, 1500);
        break;
      }
      return
  }

  levelCount++;
  stepCount = 0;
  actualizarManual(stepCount);
});
function stopTalking() {
  setTimeout(() => {
  actualizarExpresion('normal')
  }, 1500);
}
// Escuchar el evento "keydown" en el inputPlayer
inputPlayer.addEventListener('keydown', (event) => {
  // Detectar si la tecla presionada es "Enter"
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevenir el comportamiento por defecto de Enter (como un salto de línea)
    startButton.click(); // Simular un clic en el botón de start
  }
});

manualButton.addEventListener('click', () =>{
  manual.classList.remove('oculto')
  actualizarExpresion('speaking')
})
mapButton.addEventListener('click', () =>{
  map.classList.remove('oculto')
  actualizarExpresion('mad')
})
mapCloseButton.addEventListener('click', () =>{
  map.classList.add('oculto')
  actualizarExpresion('normal')
})
// Inicializar los niveles del mapa
function initializeLevelMenu() {
  const levels = document.querySelectorAll('.level');

  levels.forEach((level, index) => {
    const levelNumber = index + 1;

    // Desbloquear niveles según el progreso
    if (levelNumber <= reachedLevel) {
      level.classList.add('unlocked');
      level.classList.remove('locked');

      // Agregar tooltip con el comando enseñado
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = getLevelCommand(levelNumber);
      level.appendChild(tooltip);

      // Manejar clic en niveles desbloqueados
      level.addEventListener('click', () => {
        changeLevel(levelNumber - 1);
      });
    } else {
      level.classList.add('locked');
      level.classList.remove('unlocked');
    }
  });
}

// Obtener el comando enseñado en un nivel
function getLevelCommand(levelNumber) {
  const commands = {
    1: "let stack = [];",
    2: "stack.push(apple);",
    3: "stack.pop();",
    4: "let stack2 = [];",
    5: "stack2.push(kiwi);",
    6: "let fruta = frutas[1];",
    7: "frutas.length;",
    8: "frutas.slice(1,3);",
    9: "frutas.map(f => f.toUpperCase());",
    10: "frutas.filter(f => f !== 'manzana');"
  };
  return commands[levelNumber] || "Comando no disponible.";
}

// Cambiar de nivel
function changeLevel(levelIndex) {
  levelCount = levelIndex;
  stepCount = 0;
  actualizarManual(stepCount); // Actualizar el manual del nivel
  map.classList.add('oculto'); // Cerrar el menú del mapa
}

function newBox(tipo, number) {
  const box = document.createElement('div')
  box.classList.add('elemento')
  box.textContent = objetosJuego[tipo][number].emoji
  return box
}
class Fruit {
  constructor(name) {
    this.name = name
  }
}
