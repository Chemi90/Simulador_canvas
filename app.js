const canvas = document.getElementById('appCanvas');
const ctx = canvas.getContext('2d');
const detectionCanvas = document.createElement('canvas');
const detectionCtx = detectionCanvas.getContext('2d');

// Asegúrate de que el canvas de detección tenga las mismas dimensiones que el principal
detectionCanvas.width = window.innerWidth;
detectionCanvas.height = window.innerHeight;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Configura las rutas a las imágenes principales y de superposición para cada paso
const steps = [
    {
        mainImage: 'imagen1.png',
        overlayImage: 'imagen_superposicion1.png',
        detectionImage: 'imagen_superposicion1_no_transparente.png'
    },
    {
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
    },
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

    // Establece opacidad cero para la imagen de superposición mientras se dibuja
    ctx.globalAlpha = 0.0;
    ctx.drawImage(overlayImage, centerX, centerY, scaledWidth, scaledHeight);
    ctx.globalAlpha = 1.0;

    // Preparar el canvas de detección sin mostrarlo
    detectionCtx.clearRect(0, 0, detectionCanvas.width, detectionCanvas.height);
    detectionCtx.drawImage(detectionImage, centerX, centerY, scaledWidth, scaledHeight);
}

// Evento de clic en el canvas
canvas.addEventListener('click', async (event) => {
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;

    // Obtener datos del color en el canvas de detección
    const pixelData = detectionCtx.getImageData(x, y, 1, 1).data;

    console.log(`Color en el punto de clic: R=${pixelData[0]}, G=${pixelData[1]}, B=${pixelData[2]}, A=${pixelData[3]}`);

    // Comprobar si el color es rojo
    if (pixelData[0] > 100 && pixelData[1] < 50 && pixelData[2] < 50) {
        currentStep = (currentStep + 1) % steps.length;
        await drawStep(currentStep);
    }
});

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
