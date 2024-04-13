const canvas = document.getElementById('appCanvas');
const ctx = canvas.getContext('2d');
const detectionCanvas = document.createElement('canvas');
const detectionCtx = detectionCanvas.getContext('2d');

detectionCanvas.width = canvas.width;
detectionCanvas.height = canvas.height;

// Configura las rutas a las imágenes principales y de superposición para cada paso
const steps = [
    {
        mainImage: 'imagen1.png',
        overlayImage: 'imagen_superposicion1.png',
        detectionImage: 'imagen_superposicion1_no_transparente.png'  // Asegúrate de tener esta versión
    },
    {
        mainImage: 'imagen2.png',
        overlayImage: 'imagen_superposicion2.png',
        detectionImage: 'imagen_superposicion2_no_transparente.png'  // Asegúrate de tener esta versión
    },
    {
        mainImage: 'imagen3.png',
        overlayImage: 'imagen_superposicion3.png',
        detectionImage: 'imagen_superposicion3_no_transparente.png'  // Asegúrate de tener esta versión
    },
    {
        mainImage: 'imagen4.png',
        overlayImage: 'imagen_superposicion4.png',
        detectionImage: 'imagen_superposicion4_no_transparente.png'  // Asegúrate de tener esta versión
    },
    {
        mainImage: 'imagen5.png',
        overlayImage: 'imagen_superposicion5.png',
        detectionImage: 'imagen_superposicion5_no_transparente.png'  // Asegúrate de tener esta versión
    },
    {
        mainImage: 'imagen6.png',
        overlayImage: 'imagen_superposicion6.png',
        detectionImage: 'imagen_superposicion6_no_transparente.png'  // Asegúrate de tener esta versión
    }
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
    const detectionImage = await loadImage(step.detectionImage);  // Carga para detección

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mainImage, 0, 0);

    // Dibuja la imagen de superposición con opacidad baja para visualización
    ctx.globalAlpha = 0.0;
    ctx.drawImage(overlayImage, 0, 0);
    ctx.globalAlpha = 1.0;

    // Prepara el canvas de detección sin mostrarlo
    detectionCtx.clearRect(0, 0, detectionCanvas.width, detectionCanvas.height);
    detectionCtx.drawImage(detectionImage, 0, 0);  // Imagen no transparente para la lógica
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
