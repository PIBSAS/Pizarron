const mainCanvas = document.getElementById("main-canvas");
const context = mainCanvas.getContext("2d");
const colorMenu = document.getElementById("color-menu");
const sizeMenu = document.getElementById("size-menu");
const lineMenu = document.getElementById("line-menu");

let isDrawingLine = false;
let initialX;
let initialY;
let color = "#000000"; // Color inicial
let lineWidth = 10; // Tamaño de trazo inicial
let lines = [];
let currentLine = null; // Línea en progreso

const lineElement = document.createElement("div");
lineElement.className = "line";
lineMenu.appendChild(lineElement);


const dibujarCuadricula = () => {
    const stepMillimeter = 10; // Distancia entre líneas de la cuadrícula milimetrada
    const stepCentimeter = 100; // Distancia entre líneas de la cuadrícula centrada

    context.clearRect(0, 0, mainCanvas.width, mainCanvas.height); // Limpiar el lienzo
    context.strokeStyle = "rgba(200, 200, 200, 0.5)"; // Color de la cuadrícula
    context.lineWidth = 0.5; // Grosor de las líneas de la cuadrícula

    // Dibujar líneas verticales para la cuadrícula milimetrada
    for (let x = 0; x < mainCanvas.width; x += stepMillimeter) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, mainCanvas.height);
        context.stroke();
    }
	
// Dibujar líneas horizontales para la cuadrícula milimetrada
    for (let y = 0; y < mainCanvas.height; y += stepMillimeter) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(mainCanvas.width, y);
        context.stroke();
    }
	
	// Cuadrícula centrada (más visible)
    context.strokeStyle = "rgba(150, 150, 150, 0.8)"; // Color menos tenue para la cuadrícula centrada
    context.lineWidth = 1; // Grosor de las líneas de la cuadrícula centrada

    // Dibujar líneas verticales para la cuadrícula centrada
    for (let x = 0; x < mainCanvas.width; x += stepCentimeter) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, mainCanvas.height);
        context.stroke();
    }
	
	// Dibujar líneas horizontales para la cuadrícula centrada
    for (let y = 0; y < mainCanvas.height; y += stepCentimeter) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(mainCanvas.width, y);
        context.stroke();
    }
};

// Ajustar el tamaño del lienzo al tamaño de la ventana
const resizeCanvas = () => {
    mainCanvas.width = window.innerWidth; // Ancho del lienzo
    mainCanvas.height = window.innerHeight; // Alto del lienzo
	dibujarCuadricula();
};

// Llamar a la función de redimensionamiento al cargar la página y al cambiar el tamaño de la ventana
window.addEventListener("load", () => {
    resizeCanvas();
    dibujarCuadricula(); // Dibujar la cuadrícula al cargar
});
window.addEventListener("resize", resizeCanvas);

// Función para dibujar
const dibujar = (cursorX, cursorY) => {
    context.beginPath();
    context.moveTo(initialX, initialY);
    context.lineWidth = lineWidth;
    context.strokeStyle = color;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineTo(cursorX, cursorY);
    context.stroke();
	
	// Limpiar el lienzo y redibujar cuadrícula
    //context.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    dibujarCuadricula();
    
    initialX = cursorX;
    initialY = cursorY;
};

// Funciones de eventos de mouse
const mouseDown = (evt) => {
    initialX = evt.offsetX;
    initialY = evt.offsetY;
    dibujar(initialX, initialY);
	mainCanvas.addEventListener("mousemove", mouseMoving);
};

const mouseMoving = (evt) => {
    dibujar(evt.offsetX, evt.offsetY);
};

const mouseUp = () => {
    mainCanvas.removeEventListener("mousemove", mouseMoving);
};

// Funciones de eventos táctiles
const touchStart = (evt) => {
    const touch = evt.touches[0];
    initialX = touch.clientX - mainCanvas.offsetLeft;
    initialY = touch.clientY - mainCanvas.offsetTop;
    dibujar(initialX, initialY);
    mainCanvas.addEventListener("touchmove", touchMoving);
};

const touchMoving = (evt) => {
    evt.preventDefault(); // Evita el desplazamiento en pantallas táctiles
    const touch = evt.touches[0];
    const touchX = touch.clientX - mainCanvas.offsetLeft;
    const touchY = touch.clientY - mainCanvas.offsetTop;
    dibujar(touchX, touchY);
};

const touchEnd = () => {
    mainCanvas.removeEventListener("touchmove", touchMoving);
};

// Función para activar el modo de línea recta
const toggleLineMode = () => {
    isDrawingLine = !isDrawingLine; // Cambia el estado del modo de línea recta
    lineMenu.style.backgroundColor = isDrawingLine ? "#bbb" : "#ddd"; // Cambia el color del círculo cuando está activo
	//lineMenu.textContent = isDrawingLine ? "Dibujo Libre" : "Línea Recta"; // Cambia el texto del div
};

// Asignar los eventos
mainCanvas.addEventListener("touchstart", touchStart);
mainCanvas.addEventListener("touchend", touchEnd);
mainCanvas.addEventListener("mousedown", mouseDown);
mainCanvas.addEventListener("mouseup", mouseUp);
//lineMenu.addEventListener("click", toggleLineMode);

// Manejar el click en el menú de color
colorMenu.addEventListener("click", () => {
    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.value = color;
    colorPicker.style.display = "none";
    document.body.appendChild(colorPicker);

    colorPicker.addEventListener("input", (event) => {
        color = event.target.value;
        colorMenu.style.backgroundColor = color;
        document.body.removeChild(colorPicker);
    });

    colorPicker.click();
});

sizeMenu.textContent = lineWidth;
// Manejar el click en el menú de tamaño
sizeMenu.addEventListener("click", () => {
    const sizePicker = document.createElement("input");
    sizePicker.type = "range";
    sizePicker.min = "1";
    sizePicker.max = "50"; // Rango para el tamaño del trazo
    sizePicker.value = lineWidth;
    sizePicker.style.position = "absolute";
    sizePicker.style.top = "60px";  // Ajusta la posición del control deslizante para que sea visible
    sizePicker.style.left = "10px";  // Asegúrate de que no se superponga con otros elementos
    document.body.appendChild(sizePicker);
	
	// Hacer visible el control deslizante
    sizePicker.style.display = "block";

    sizePicker.addEventListener("input", (event) => {
        lineWidth = event.target.value;
        sizeMenu.textContent = lineWidth; // Muestra el tamaño del trazo en el círculo
    });

    // Remover el control deslizante después de ajustar el tamaño
    sizePicker.addEventListener("change", () => {
        document.body.removeChild(sizePicker);
    });
});