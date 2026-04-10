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
function bresenham(x0, y0, x1, y1, plot) {
    // Cálculo de diferenciales y dirección del paso
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        // Dibujar el punto actual
        plot(x0, y0);

        // Condición de finalización
        if (x0 === x1 && y0 === y1) break;

        let e2 = 2 * err;

        // Ajuste en el eje X
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }

        // Ajuste en el eje Y
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
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