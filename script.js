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

// Definimos el array de frutas seleccionadas que queremos mostrar en el HTML
const frutasSeleccionadas = ['apple', 'orange', 'banana', 'mango', 'cherry', 'lemon', 'pear', 'blueberry', 'coconut'];

// Definimos los stacks iniciales
let stack1 = ['apple', 'banana', 'cherry'];
let stack2 = ['kiwi', 'lemon', 'mango'];

// Guardamos los stacks en localStorage
localStorage.setItem('stack1', JSON.stringify(stack1));
localStorage.setItem('stack2', JSON.stringify(stack2));

// Seleccionamos el contenedor de frutas en el HTML
const frutaContainer = document.querySelector('.frutas');

// Ocultar los stacks inicialmente
document.querySelector('#stack-1').style.display = 'none';
document.querySelector('#stack-2').style.display = 'none';

// Seleccionar elementos del DOM
const startScreen = document.querySelector('.start-screen');
const startButton = document.querySelector('.start-screen button');
const manual = document.querySelector('#oculto');
const inputPlayer = document.querySelector('#inputPlayer');
const gameScreen = document.querySelector('.game-screen');
const startGameButton = document.querySelector('#start');
const manualButton = document.querySelector('.buttons .btn-61:nth-child(1)');

// Ajustar el mapa (game-screen) para que esté centrado y sea display absolute
gameScreen.style.position = 'absolute';
gameScreen.style.top = '50%';
gameScreen.style.left = '50%';
gameScreen.style.transform = 'translate(-50%, -50%)';

gameScreen.style.display = 'none'; // Ocultar inicialmente la pantalla del juego

// Función para inicializar el tutorial
startButton.addEventListener('click', () => {
  // Ocultar la pantalla de inicio y mostrar la pantalla del juego
  startScreen.style.display = 'none';
  gameScreen.style.display = 'flex';

  // Mostrar el manual después de 1 segundo
  setTimeout(() => {
    manual.style.display = 'block';
    manual.innerHTML = `
      <strong>Bienvenido a Array Cat!</strong><br><br>
      Este es un juego interactivo en el que te puedes familiarizar con el funcionamiento de los arrays.<br>
      Primero necesitamos crear un <code>array</code> para poder insertar elementos en él.<br><br>
      -> En esta sección tienes que escribir el código: <code>let stack = [];</code><br><br>
      -> Una vez esté todo listo haz click en el botón de <code>START</code>.
    `;
  }, 1000);
});

// Función para ocultar el manual al hacer clic en el textarea
inputPlayer.addEventListener('focus', () => {
  manual.style.display = 'none';
});

// Función para verificar el contenido del textarea cuando se haga click en START
startGameButton.addEventListener('click', () => {
  const userInput = inputPlayer.value.trim();

  // Verificar si el contenido del textarea es el correcto
  if (userInput === 'let stack = [];') {
    // Mostrar stack-1 y stack-2
    document.querySelector('#stack-1').style.display = 'grid';
    document.querySelector('#stack-2').style.display = 'grid';

    // Aquí podría agregar lógica para continuar el juego
    alert('¡Bien hecho! Has creado el array. Ahora vamos a aprender cómo trabajar con él.');
  } else {
    alert('Error: Por favor, asegúrate de escribir exactamente "let stack = [];"');
  }
});

// Función para mostrar el manual al hacer clic en el botón de manual
manualButton.addEventListener('click', () => {
  manual.style.display = 'block';
  manual.innerHTML = `
    <strong>Manual de Instrucciones</strong><br><br>
    Hola!<br>
    Esta es la guía que te ayudará a completar las tareas en cada nivel.<br>
    Entonces, empecemos!<br><br>
    -> Escribe el código requerido en el campo de entrada.<br>
    -> Haz click en los botones correspondientes para avanzar en el juego.
  `;
});

// Mostrar la pantalla de inicio al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  startScreen.style.display = 'flex';
  gameScreen.style.display = 'none';

  // Inyectamos dinámicamente las frutas seleccionadas dentro del contenedor
  frutasSeleccionadas.forEach((frutaName) => {
    const fruta = frutas.find(f => f.name === frutaName);
    if (fruta) {
      const frutaElement = document.createElement('div');
      frutaElement.className = 'elemento';

      // Añadimos el elemento fruta dentro de cada contenedor 'elemento'
      const frutaInner = document.createElement('div');
      frutaInner.className = 'fruta';
      frutaInner.id = fruta.name; // ID único para cada fruta basado en su nombre
      frutaInner.textContent = fruta.emoji;

      frutaElement.appendChild(frutaInner);
      frutaContainer.appendChild(frutaElement);
    }
  });

  // Cargamos los stacks al iniciar
  loadStacks();
});

// Función para actualizar los stacks desde el localStorage
function loadStacks() {
  stack1 = JSON.parse(localStorage.getItem('stack1')) || [];
  stack2 = JSON.parse(localStorage.getItem('stack2')) || [];

  const stack1Container = document.querySelector('#stack-1');
  const stack2Container = document.querySelector('#stack-2');

  // Limpiamos los stacks antes de añadir los elementos
  stack1Container.innerHTML = '';
  stack2Container.innerHTML = '';

  // Añadimos los elementos del stack1
  stack1.forEach((frutaName) => {
    const fruta = frutas.find(f => f.name === frutaName);
    if (fruta) {
      const frutaElement = document.createElement('p');
      frutaElement.className = 'box';
      frutaElement.textContent = fruta.emoji;
      stack1Container.appendChild(frutaElement);
    }
  });

  // Añadimos los elementos del stack2
  stack2.forEach((frutaName) => {
    const fruta = frutas.find(f => f.name === frutaName);
    if (fruta) {
      const frutaElement = document.createElement('p');
      frutaElement.className = 'box';
      frutaElement.textContent = fruta.emoji;
      stack2Container.appendChild(frutaElement);
    }
  });
}

// Función para ejecutar la lógica del botón "- START -"
document.querySelector('#start').addEventListener('click', () => {
  const query = document.querySelector('#inputPlayer').value.trim();

  // Lógica para interpretar y ejecutar el comando ingresado por el usuario
  if (query === 'move apple to stack2') { // Ejemplo de comando
    const index = stack1.indexOf('apple');
    if (index > -1) {
      stack1.splice(index, 1);
      stack2.push('apple');

      // Actualizamos los stacks en localStorage
      localStorage.setItem('stack1', JSON.stringify(stack1));
      localStorage.setItem('stack2', JSON.stringify(stack2));

      // Recargamos los stacks en el HTML
      loadStacks();
    } else {
      alert('Error: La fruta no se encuentra en el stack1');
    }
  } else {
    alert('Comando no reconocido. Por favor, intente nuevamente.');
  }
});
