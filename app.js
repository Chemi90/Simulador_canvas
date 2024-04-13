const canvas = document.getElementById('appCanvas');
const ctx = canvas.getContext('2d');
const detectionCanvas = document.createElement('canvas');
const detectionCtx = detectionCanvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
detectionCanvas.width = window.innerWidth;
detectionCanvas.height = window.innerHeight;

// Configura las rutas a las imágenes principales y de superposición para cada paso
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
    // Agrega más pasos según sea necesario
];

let currentStep = 0;

// Función para cargar una imagen
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

// Función para dibujar el paso actual
async function drawStep(stepIndex) {
    const step = steps[stepIndex];
    const mainImage = await loadImage(step.mainImage);
    const overlayImage = await loadImage(step.overlayImage);
    const detectionImage = await loadImage(step.detectionImage);

    // Calcular el factor de escala para mantener la proporción
    const scaleFactor = Math.min(canvas.width / mainImage.width, canvas.height / mainImage.height);
    const scaledWidth = mainImage.width * scaleFactor;
    const scaledHeight = mainImage.height * scaleFactor;

    // Calcular el centro para las imágenes escaladas
    const centerX = (canvas.width - scaledWidth) / 2;
    const centerY = (canvas.height - scaledHeight) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mainImage, centerX, centerY, scaledWidth, scaledHeight);
    ctx.globalAlpha = 0.0; // Opacidad cero para la imagen de superposición
    ctx.drawImage(overlayImage, centerX, centerY, scaledWidth, scaledHeight);
    ctx.globalAlpha = 1.0;

    detectionCtx.clearRect(0, 0, detectionCanvas.width, detectionCanvas.height);
    detectionCtx.drawImage(detectionImage, centerX, centerY, scaledWidth, scaledHeight);
}

function handleInteraction(event) {
    event.preventDefault(); // Prevenir acciones por defecto
    let x, y;

    if (event.type.includes('touch')) {
        x = event.touches[0].clientX - canvas.offsetLeft;
        y = event.touches[0].clientY - canvas.offsetTop;
    } else {
        x = event.clientX - canvas.offsetLeft;
        y = event.clientY - canvas.offsetTop;
    }

    const pixelData = detectionCtx.getImageData(x, y, 1, 1).data;
    console.log(`Color en el punto de interacción: R=${pixelData[0]}, G=${pixelData[1]}, B=${pixelData[2]}, A=${pixelData[3]}`);

    if (pixelData[0] > 100 && pixelData[1] < 50 && pixelData[2] < 50) {
        currentStep = (currentStep + 1) % steps.length;
        drawStep(currentStep);
    }
}

canvas.addEventListener('click', handleInteraction);
canvas.addEventListener('touchstart', handleInteraction);

// Inicia mostrando el primer paso
drawStep(currentStep);

// Función para ajustar el tamaño del canvas cuando cambia el tamaño de la ventana
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    detectionCanvas.width = window.innerWidth;
    detectionCanvas.height = window.innerHeight;
    drawStep(currentStep); // Redibujar el contenido del canvas
}

window.addEventListener('resize', resizeCanvas);
