// Obtener canvas y contexto
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
/**
 * Implementación del algoritmo de líneas de Bresenham.
 * @param {number} x0 - Coordenada X inicial.
 * @param {number} y0 - Coordenada Y inicial.
 * @param {number} x1 - Coordenada X final.
 * @param {number} y1 - Coordenada Y final.
 * @param {Function} plot - Función para dibujar el píxel (x, y).
 */

/**
 * Implementación del algoritmo de líneas de Bresenham.
 * Ahora también almacena los pasos para mostrarlos en tabla.
 */
function bresenham(x0, y0, x1, y1, plot) {
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    let pasos = []; // se guarda los datos
    let paso = 0;

    while (true) {
        let e2 = 2 * err;

        // Guardar datos antes de modificar
        pasos.push({
            paso: paso,
            x: x0,
            y: y0,
            err: err,
            e2: e2
        });

        plot(x0, y0);

        if (x0 === x1 && y0 === y1) break;

        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }

        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }

        paso++;
    }
    return pasos; 
}
/**
 * Dibuja un píxel en el canvas.
 * @param {number} x - Coordenada X
 * @param {number} y - Coordenada Y
 */
function dibujarPixel(x, y) {
    const escala = 20; // tamaño de cada "pixel visible"

    ctx.fillStyle = "black";

    // Convertir coordenadas matemáticas a canvas
    let canvasX = x * escala;
    let canvasY = canvas.height - (y * escala); // invertir eje Y

    ctx.fillRect(canvasX, canvasY, escala, escala);
}
/**
 * Llena la tabla con los datos del algoritmo.
 * @param {Array} pasos 
 */
function llenarTabla(pasos) {
    
    };

// Función principal que se ejecuta al presionar el botón.

function dibujar() {
    
    // Obtener valores de los inputs
    let x0 = parseInt(document.getElementById("x0").value);
    let y0 = parseInt(document.getElementById("y0").value);
    let x1 = parseInt(document.getElementById("x1").value);
    let y1 = parseInt(document.getElementById("y1").value);

    console.log("Valores ingresados:", x0, y0, x1, y1);

    // Función plot que ahora dibuja en el canva
    function plot(x, y) {
        dibujarPixel(x, y);
    }

    // Llamar al algoritmo
    bresenham(x0, y0, x1, y1, plot);
}