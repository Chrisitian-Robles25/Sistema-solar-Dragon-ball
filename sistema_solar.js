// Configuración de planetas reales y DBZ
const planetas = [
    {
        nombre: "Tierra",
        color: "#3fa7d6",
        radio: 6371,
        distancia: 150,
        atmosfera: "rgba(63,167,214,0.18)",
        datos: {
            velocidad: "29.8 km/s",
            gravedad: "9.8 m/s²",
            curiosidad: "¡Aquí viven Goku y sus amigos!"
        }
    },
    {
        nombre: "Arya",
        color: "#e67e22",
        radio: 5000,
        distancia: 200,
        atmosfera: "rgba(230,126,34,0.15)",
        datos: {
            velocidad: "20 km/s",
            gravedad: "7 m/s²",
            curiosidad: "Planeta misterioso del universo DBZ."
        }
    },
    {
        nombre: "Júpiter",
        color: "#f7ca18",
        radio: 69911,
        distancia: 300,
        atmosfera: "rgba(247,202,24,0.13)",
        datos: {
            velocidad: "13.1 km/s",
            gravedad: "24.8 m/s²",
            curiosidad: "El planeta más grande del sistema solar."
        }
    },
    {
        nombre: "Sol",
        color: "#ffe066",
        radio: 696340,
        distancia: 0,
        atmosfera: "rgba(255,224,102,0.25)",
        datos: {
            velocidad: "220 km/s (alrededor de la galaxia)",
            gravedad: "274 m/s²",
            curiosidad: "¡La estrella que da vida!"
        }
    },
    {
        nombre: "Nuevo Namek",
        color: "#7ed957",
        radio: 8000,
        distancia: 400,
        atmosfera: "rgba(126,217,87,0.15)",
        datos: {
            velocidad: "15 km/s",
            gravedad: "10 m/s²",
            curiosidad: "Hogar de los nuevos namekianos."
        }
    },
    {
        nombre: "Namek",
        color: "#4ecdc4",
        radio: 6000,
        distancia: 350,
        atmosfera: "rgba(78,205,196,0.15)",
        datos: {
            velocidad: "17 km/s",
            gravedad: "8 m/s²",
            curiosidad: "Planeta de Piccolo y los namekianos."
        }
    },
    {
        nombre: "Yardrat",
        color: "#b084cc",
        radio: 7000,
        distancia: 500,
        atmosfera: "rgba(176,132,204,0.15)",
        datos: {
            velocidad: "12 km/s",
            gravedad: "6 m/s²",
            curiosidad: "¡Aquí Goku aprendió la teletransportación!"
        }
    },
    
    {
        nombre: "Vegeta",
        color: "#e74c3c",
        radio: 9000,
        distancia: 600,
        atmosfera: "rgba(231,76,60,0.15)",
        datos: {
            velocidad: "18 km/s",
            gravedad: "11 m/s²",
            curiosidad: "Planeta natal de los Saiyajin."
        }
    }
];

// Ajuste de distancias para que no estén juntos
const DISTANCIA_BASE = 180;
planetas.forEach((p, i) => {
    p.distancia = i === 3 ? 0 : DISTANCIA_BASE * (i + 1); // El Sol en el centro
});

// Estrellas y nave perdida
const estrellas = Array.from({length: 120}, () => ({
    x: Math.random(),
    y: Math.random(),
    size: Math.random() * 2 + 0.5
}));
const nave = { x: 0.8, y: 0.2, size: 30 };

let zoom = 1, offsetX = 0, offsetY = 0, dragging = false, lastX, lastY;
let sonidoDBZ;

function preload() {
    // Cargar sonido DBZ, pero si falla, continuar sin sonido
    try {
        sonidoDBZ = loadSound('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae3e2.mp3');
    } catch (e) {
        sonidoDBZ = null;
    }
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight * 0.9);
    canvas.parent('canvas-container');
    textFont('Segoe UI', 18);
}

function draw() {
    background(10, 10, 40);
    push();
    translate(width/2 + offsetX, height/2 + offsetY);
    scale(zoom);
    // Estrellas
    for (let s of estrellas) {
        noStroke();
        fill(255,255,255, 180);
        ellipse((s.x-0.5)*width*2, (s.y-0.5)*height*2, s.size);
    }
    // Nave perdida
    stroke(255, 200, 0);
    strokeWeight(2);
    fill(255,255,255,180);
    ellipse((nave.x-0.5)*width*2, (nave.y-0.5)*height*2, nave.size, nave.size*0.6);
    noStroke();
    // Órbitas y planetas
    for (let p of planetas) {
        if(p.distancia>0) {
            noFill();
            stroke(255,80);
            ellipse(0,0,p.distancia*zoom*0.8*0.7, p.distancia*zoom*0.8*0.7);
        }
    }
    // Planetas y nombres
    let t = millis()/4000;
    for (let i=0; i<planetas.length; i++) {
        let p = planetas[i];
        let ang = t + i*PI/4;
        let r = p.distancia*0.8*0.7;
        let x = r * cos(ang);
        let y = r * sin(ang);
        let size = Math.max(30, Math.log10(p.radio)*18);
        // Atmósfera
        fill(p.atmosfera);
        noStroke();
        ellipse(x, y, size*1.7, size*1.7);
        // Planeta
        fill(p.color);
        stroke(255, 255, 255, 60);
        strokeWeight(2);
        ellipse(x, y, size, size);
        // Nombre del planeta
        noStroke();
        fill('#fff');
        textAlign(CENTER, BOTTOM);
        textSize(20);
        text(p.nombre, x, y - size/1.2);
        // Hover/click para tarjeta
        if (dist(mouseX-width/2-offsetX, mouseY-height/2-offsetY, x, y) < size/2*zoom) {
            mostrarInfo(p, x, y);
        }
    }
    pop();
}

function mouseWheel(event) {
    zoom *= event.delta > 0 ? 0.9 : 1.1;
    zoom = constrain(zoom, 0.3, 3);
}

function mousePressed() {
    dragging = true;
    lastX = mouseX;
    lastY = mouseY;
    if (sonidoDBZ && typeof sonidoDBZ.play === 'function' && !sonidoDBZ.isPlaying()) {
        try { sonidoDBZ.play(); } catch (e) {}
    }
}
function mouseReleased() {
    dragging = false;
}
function mouseDragged() {
    if (dragging) {
        offsetX += mouseX - lastX;
        offsetY += mouseY - lastY;
        lastX = mouseX;
        lastY = mouseY;
    }
}

function mostrarInfo(planeta, x, y) {
    let card = document.getElementById('info-card');
    card.innerHTML = `<h2>${planeta.nombre}</h2>
        <p><b>Tamaño:</b> ${planeta.radio} km</p>
        <p><b>Velocidad orbital:</b> ${planeta.datos.velocidad}</p>
        <p><b>Gravedad:</b> ${planeta.datos.gravedad}</p>
        <p><b>Curiosidad:</b> ${planeta.datos.curiosidad}</p>`;
    card.classList.add('visible');
}
function ocultarInfo() {
    let card = document.getElementById('info-card');
    card.classList.remove('visible');
}

function mouseMoved() {
    // Oculta la tarjeta si no está sobre ningún planeta
    let t = millis()/4000;
    let sobre = false;
    for (let i=0; i<planetas.length; i++) {
        let p = planetas[i];
        let ang = t + i*PI/4;
        let r = p.distancia*0.8*0.7;
        let x = r * cos(ang);
        let y = r * sin(ang);
        let size = Math.max(30, Math.log10(p.radio)*18);
        if (dist(mouseX-width/2-offsetX, mouseY-height/2-offsetY, x, y) < size/2*zoom) {
            sobre = true;
            break;
        }
    }
    if (!sobre) ocultarInfo();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight * 0.9);
}
