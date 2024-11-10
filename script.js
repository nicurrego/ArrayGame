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

// Definimos el array de frutas seleccionadas por el jugador *para mas adelante*
const frutasSeleccionadas = [];

// Definimos las frutas y los stacks
const frutas = [
  { name: 'apple', emoji: '🍎' },
  { name: 'orange', emoji: '🍊' },
  { name: 'watermelon', emoji: '🍉' },
  { name: 'banana', emoji: '🍌' },
  { name: 'strawberry', emoji: '🍓' },
  { name: 'grape', emoji: '🍇' },
  { name: 'cherry', emoji: '🍒' },
  { name: 'kiwi', emoji: '🥝' },
  { name: 'pineapple', emoji: '🍍' },
  { name: 'peach', emoji: '🍑' },
  { name: 'lemon', emoji: '🍋' },
  { name: 'mango', emoji: '🥭' },
  { name: 'blueberry', emoji: '🫐' },
  { name: 'pear', emoji: '🍐' },
  { name: 'coconut', emoji: '🥥' },
  { name: 'papaya', emoji: '🍈' }
];

// expresiones del gato
const expresionesPersonaje = [
  {
    nombre: 'normal',
    imagen: 'imagenes/Cat normal.png',
  },
  {
    nombre: 'feliz',
    imagen: 'imagenes/Cat happy.png',
  },
  {
    nombre: 'hablando',
    imagen: 'imagenes/Cat open mouth.png',
  },
  {
    nombre: 'triste',
    imagen: 'imagenes/Cat sad.png',
  },
  {
    nombre: 'serio',
    imagen: 'imagenes/Cat serious.png',
  },
];

// Mostrar la pantalla de inicio al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  loadFrutas(); // Función para cargar las frutas
  loadStacks(); // Función para cargar los stacks
});

function mostrarExpresion(expresionNombre) {
  // Selecciona el contenedor donde deseas mostrar la imagen
  const contenedorImagen = document.querySelector('.character');
  // Actualizamos el src y alt
  let imgElement = contenedorImagen.querySelector('img');
  if (!imgElement) {
    // Si no existe, la creamos
    imgElement = document.createElement('img');
    contenedorImagen.appendChild(imgElement);
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

while (!manual.classList.contains('oculto'))
  mostrarExpresion('normal');

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

// Función para inicializar el tutorial
playButton.addEventListener('click', () => {
  if (!startScreen || !manual) {
    console.error('Elementos necesarios para iniciar el tutorial no encontrados.');
    return;
  }

  // Ocultar la pantalla de inicio
  startScreen.classList.add('oculto');

  // Mostrar el manual después de 1 segundo
  setTimeout(() => {
    mostrarExpresion('hablando');
    manual.classList.remove('oculto');
    currentStepIndex = 0;
    actualizarManual(currentStepIndex);
  }, 600);
});

// Cargar los pasos del manual desde un archivo JSON
let manualSteps = [];
fetch('manualSteps.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('No se pudo cargar el manual de instrucciones.');
    }
    return response.json();
  })
  .then(data => {
    manualSteps = data;
    actualizarManual(currentStepIndex);
  })
  .catch(error => {
    console.error('Error al cargar el manual:', error);
  });

let currentStepIndex = 0;

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
  } else if (currentStepIndex === manualSteps.length - 1) {
    manual.classList.add('oculto');
  }
});

manualPrevButton.addEventListener('click', () => {
  if (currentStepIndex > 0) {
    currentStepIndex--;
    actualizarManual(currentStepIndex);
  }
});

// Función para ocultar el manual al hacer clic en el textarea
gameScreen.addEventListener('click', (e) => {
  if (!manual.contains(e.target) && e.target !== manualButton) {
    mostrarExpresion('normal'); // Volver a la expresión "normal" cuando se oculta el manual
    manual.classList.add('oculto');
  } else if (e.target === manualButton) {
    mostrarExpresion('hablando'); // Cambiar la expresión a "hablando" cuando se muestra el manual
    manual.classList.remove('oculto');
  }
});

mensajeButton.addEventListener('click', () => {
  mostrarExpresion('normal'); // Volver a la expresión "normal" después de ocultar el mensaje
  mensajes.classList.add('oculto');
});

function mostrarMensaje(mensajeTexto) {
  const mensajeText = document.querySelector('.mensajeText');
  if (!mensajeText) {
    console.error('Contenedor de mensaje no encontrado.');
    return;
  }

  // Limpiamos el contenido de los mensajes anteriores
  mensajeText.innerHTML = '';

  // Crear un nuevo elemento <p>
  const newMensaje = document.createElement('p');
  newMensaje.textContent = mensajeTexto;

  // Añadir el nuevo mensaje al contenedor de mensajes
  mensajeText.appendChild(newMensaje);
  
  // Mostrar el contenedor de mensajes si estaba oculto
  mensajes.classList.remove('oculto');
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

  // Verificar si el contenido del textarea cumple con el patrón
  if (validPattern.test(userInput)) {
    // Mostrar la imagen de "feliz"
    mostrarExpresion('feliz');
    // Mostrar stack-1

    stackContainer1.classList.remove('oculto');
    stackContainerName1.classList.remove('oculto');
    mostrarMensaje('¡Bien hecho! Has creado el array. Ahora vamos a aprender cómo trabajar con él.');
  } else {
    mostrarExpresion('hablando');
    mostrarMensaje('Error: Por favor, asegúrate de escribir correctamente el código');
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
