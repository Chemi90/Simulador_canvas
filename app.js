const canvas = document.getElementById('appCanvas');
const ctx = canvas.getContext('2d');
const detectionCanvas = document.createElement('canvas');
const detectionCtx = detectionCanvas.getContext('2d');

const steps = [
    {
        mainImage: 'imagen1.png',
        overlayImage: 'imagen_superposicion1.png',
        detectionImage: 'imagen_superposicion1_no_transparente.png'
    },{
        mainImage: 'imagen2.png',
        overlayImage: 'imagen_superposicion2.png',
        detectionImage: 'imagen_superposicion2_no_transparente.png'
    },
    {
        mainImage: 'imagen3.png',
        overlayImage: 'imagen_superposicion3.png',
        detectionImage: 'imagen_superposicion3_no_transparente.png'
    },
    {
        mainImage: 'imagen4.png',
        overlayImage: 'imagen_superposicion4.png',
        detectionImage: 'imagen_superposicion4_no_transparente.png'
    },
    {
        mainImage: 'imagen5.png',
        overlayImage: 'imagen_superposicion5.png',
        detectionImage: 'imagen_superposicion5_no_transparente.png'
    },
    {
        mainImage: 'imagen6.png',
        overlayImage: 'imagen_superposicion6.png',
        detectionImage: 'imagen_superposicion6_no_transparente.png'
    }
];

let currentStep = 0;

function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    canvas.width = displayWidth * ratio;
    canvas.height = displayHeight * ratio;
    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';

    detectionCanvas.width = canvas.width;
    detectionCanvas.height = canvas.height;

    drawStep(currentStep); // Redibujar el contenido del canvas
}

// Coloca esta llamada después de la inicialización de currentStep
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function drawStep(stepIndex) {
    const step = steps[stepIndex];
    const mainImage = await loadImage(step.mainImage);
    const overlayImage = await loadImage(step.overlayImage);
    const detectionImage = await loadImage(step.detectionImage);

    const scaleFactor = Math.min(canvas.width / mainImage.width, canvas.height / mainImage.height);
    const scaledWidth = mainImage.width * scaleFactor;
    const scaledHeight = mainImage.height * scaleFactor;

    const centerX = (canvas.width - scaledWidth) / 2;
    const centerY = (canvas.height - scaledHeight) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mainImage, centerX, centerY, scaledWidth, scaledHeight);
    ctx.globalAlpha = 0.0;
    ctx.drawImage(overlayImage, centerX, centerY, scaledWidth, scaledHeight);
    ctx.globalAlpha = 1.0;

    detectionCtx.clearRect(0, 0, detectionCanvas.width, detectionCanvas.height);
    detectionCtx.drawImage(detectionImage, centerX, centerY, scaledWidth, scaledHeight);
}

function getCanvasCoords(event) {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    let x, y;
    if (event.type.includes('touch')) {
        x = (event.touches[0].clientX - rect.left) * ratio;
        y = (event.touches[0].clientY - rect.top) * ratio;
    } else {
        x = (event.clientX - rect.left) * ratio;
        y = (event.clientY - rect.top) * ratio;
    }
    return { x, y };
}

function handleInteraction(event) {
    const { x, y } = getCanvasCoords(event);
    const pixelData = detectionCtx.getImageData(x, y, 1, 1).data;

    console.log(`Color en el punto de interacción: R=${pixelData[0]}, G=${pixelData[1]}, B=${pixelData[2]}, A=${pixelData[3]}`);

    if (pixelData[0] > 100 && pixelData[1] < 50 && pixelData[2] < 50) { // Detecta rojo
        currentStep = (currentStep + 1) % steps.length;
        drawStep(currentStep);
    } else if (pixelData[0] < 50 && pixelData[1] < 50 && pixelData[2] < 50) { // Detecta negro
        currentStep = (currentStep - 1 + steps.length) % steps.length; // Retrocede una imagen, usando módulo para evitar índices negativos
        drawStep(currentStep);
    }
}

canvas.addEventListener('click', handleInteraction);
canvas.addEventListener('touchstart', handleInteraction);

drawStep(currentStep);  // Inicia mostrando el primer paso
