
        const canvas = document.getElementById('lienzo');
        const ctx = canvas.getContext('2d');
        const offset = 30; // margen interior para que quepan los numeros

        // funcion para dibujar el plano cartesiano y sus numeros
        function dibujarEscalas(ctx, width, height, limite, size) {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = "black";
            ctx.font = "10px sans-serif";
            ctx.strokeStyle = "#e0e0e0";

            // calculo para evitar que los textos se amontonen si el limite es muy grande
            let pasoNum = limite > 500 ? 100 : (limite > 100 ? 50 : (limite > 50 ? 10 : (limite > 20 ? 5 : 2)));

            // lineas verticales y escala inferior
            for (let x = 0; x <= limite; x++) {
                let px = offset + x * size;
                ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, height - offset); ctx.stroke();
                if (x % pasoNum === 0) ctx.fillText(x, px - 5, height - offset + 15);
            }

            // lineas horizontales y escala lateral izquierda
            for (let y = 0; y <= limite; y++) {
                let py = (height - offset) - y * size;
                ctx.beginPath(); ctx.moveTo(offset, py); ctx.lineTo(width - offset, py); ctx.stroke();
                if (y % pasoNum === 0) ctx.fillText(y, 5, py + 4);
            }

            // ejes principales del plano
            ctx.strokeStyle = "black";
            ctx.beginPath();
            ctx.moveTo(offset, 0); ctx.lineTo(offset, height - offset);
            ctx.moveTo(offset, height - offset); ctx.lineTo(width, height - offset);
            ctx.stroke();
        }

        // funcion para pintar el pixel en el canvas
        function plot(x, y, size) {
            let px = offset + x * size;
            let py = (canvas.height - offset) - y * size;
            ctx.fillStyle = " #32CD32";
            ctx.fillRect(px - size/2, py - size/2, size, size);
        }

        // algoritmo de bresenham modificado para registrar en la tabla
        function bresenham(x0, y0, x1, y1, plotFn, tbody) {
            let dx = Math.abs(x1 - x0);
            let dy = Math.abs(y1 - y0);
            let sx = (x0 < x1) ? 1 : -1;
            let sy = (y0 < y1) ? 1 : -1;
            let err = dx - dy;
            let paso = 0;

            while (true) {
                let e2 = 2 * err;
                
                // generacion de la fila para el registro paso a paso
                let fila = `<tr>
                    <td>${paso}</td><td>${x0}</td><td>${y0}</td>
                </tr>`;
                tbody.innerHTML += fila;

                // dibujar y verificar condicion de parada
                plotFn(x0, y0);
                if (x0 === x1 && y0 === y1) break;
                
                // ajustes de ejes segun el error
                if (e2 > -dy) { err -= dy; x0 += sx; }
                if (e2 < dx) { err += dx; y0 += sy; }
                paso++;
            }
        }

        // vista inicial estandar (limite de 20 por defecto antes de dibujar nada)
        let areaInicial = canvas.width - (offset * 2);
        dibujarEscalas(ctx, canvas.width, canvas.height, 20, areaInicial/20);

        // interaccion principal
        document.getElementById('btn-dibujar').addEventListener('click', function() {
            let x0 = parseInt(document.getElementById('x0').value, 10);
            let y0 = parseInt(document.getElementById('y0').value, 10);
            let x1 = parseInt(document.getElementById('x1').value, 10);
            let y1 = parseInt(document.getElementById('y1').value, 10);
            
            // forzar limites: no menores a 0 y no mayores a 100
            x0 = Math.min(1000, Math.max(0, x0));
            y0 = Math.min(1000, Math.max(0, y0));
            x1 = Math.min(1000, Math.max(0, x1));
            y1 = Math.min(1000, Math.max(0, y1));

              // actualizar visualmente los cuadros de texto si hubo recortes
            document.getElementById('x0').value = x0;
            document.getElementById('y0').value = y0;
            document.getElementById('x1').value = x1;
            document.getElementById('y1').value = y1;

            let tbody = document.getElementById('cuerpo-tabla');
            tbody.innerHTML = '';

            // encontrar la coordenada mas grande para saber cuanto debe crecer el plano
            let maxCoord = Math.max(x0, y0, x1, y1);
            
            // definimos el limite del plano dando un margen de 2 cuadros, con un minimo de 10
            let limitePlano = Math.max(10, maxCoord + 2);
            
            // aseguramos que el tope absoluto visual del plano sea 100
            if (limitePlano > 1000) limitePlano = 1000;

            // calculamos el nuevo tamano de cada cuadro dinamicamente
            let espacioDisponible = canvas.width - (offset * 2);
            let gridSizeDinamico = espacioDisponible / limitePlano;

            // preparamos el lienzo limpio con la nueva escala
            dibujarEscalas(ctx, canvas.width, canvas.height, limitePlano, gridSizeDinamico);

            // encapsulamos el plot para inyectarle el tamano calculado
            let plotDinamico = function(x, y) {
                plot(x, y, gridSizeDinamico);
            };
            // ejecutamos
            bresenham(x0, y0, x1, y1, plotDinamico, tbody);
        });