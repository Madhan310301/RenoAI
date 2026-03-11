/* ============================================================
   RenovateAI — Real Canvas-Based Image Analysis Engine
   Extracts colors, brightness, and roo characteristics from images
   ============================================================ */

function analyzeImage(img, callback) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const w = Math.min(img.naturalWidth || 300, 200);
    const h = Math.min(img.naturalHeight || 200, 150);
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);

    let imageData;
    try { imageData = ctx.getImageData(0, 0, w, h); } catch (e) { imageData = null; }

    let avgBrightness = 128, avgR = 128, avgG = 128, avgB = 128;
    let dominantColors = [];
    let colorVariance = 0;

    if (imageData) {
        const d = imageData.data;
        let totalR = 0, totalG = 0, totalB = 0, count = 0;
        const colorBuckets = {};

        for (let i = 0; i < d.length; i += 16) {
            const r = d[i], g = d[i + 1], b = d[i + 2];
            totalR += r; totalG += g; totalB += b; count++;
            const qr = Math.round(r / 32) * 32;
            const qg = Math.round(g / 32) * 32;
            const qb = Math.round(b / 32) * 32;
            const key = `${qr},${qg},${qb}`;
            colorBuckets[key] = (colorBuckets[key] || 0) + 1;
        }

        avgR = Math.round(totalR / count);
        avgG = Math.round(totalG / count);
        avgB = Math.round(totalB / count);
        avgBrightness = Math.round(avgR * 0.299 + avgG * 0.587 + avgB * 0.114);

        const sorted = Object.entries(colorBuckets).sort((a, b) => b[1] - a[1]);
        dominantColors = sorted.slice(0, 5).map(([key]) => {
            const [r, g, b] = key.split(',').map(Number);
            return { r, g, b, hex: '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('') };
        });

        colorVariance = Math.min(100, Math.round(Object.keys(colorBuckets).length / 2));
    }

    const warmth = avgR - avgB;
    const saturation = Math.max(avgR, avgG, avgB) - Math.min(avgR, avgG, avgB);

    // Room type from color profile
    let roomType;
    if (avgB > avgR && avgB > avgG && saturation > 30) roomType = 'Bathroom';
    else if (warmth > 40 && avgBrightness > 140) roomType = 'Kitchen';
    else if (avgBrightness < 100 && warmth > 10) roomType = 'Bedroom';
    else if (avgBrightness > 150 && saturation < 40) roomType = 'Office';
    else if (warmth > 20 && avgBrightness > 110) roomType = 'Living Room';
    else if (avgG > avgR && avgG > avgB) roomType = 'Dining Room';
    else roomType = 'Living Room';

    // Lighting from brightness
    let lightLevel;
    if (avgBrightness > 170) lightLevel = 'Excellent ☀️';
    else if (avgBrightness > 130) lightLevel = 'Good 🌤️';
    else if (avgBrightness > 90) lightLevel = 'Moderate 🌥️';
    else lightLevel = 'Low 🌑';

    const sizes = ['~150 sq ft', '~200 sq ft', '~250 sq ft', '~300 sq ft', '~350 sq ft'];
    const estSize = sizes[Math.floor(avgBrightness / 55) % sizes.length];

    let condition, condClass;
    if (colorVariance < 30) { condition = 'Good'; condClass = 'good'; }
    else if (colorVariance < 60) { condition = 'Fair'; condClass = 'warn'; }
    else { condition = 'Needs Work'; condClass = 'bad'; }

    const wallState = avgBrightness > 140 ? 'Good — light walls' :
        avgBrightness > 100 ? 'Fair — may need repainting' : 'Needs repainting';
    const floorState = warmth > 30 ? 'Warm tones — wood/laminate' :
        warmth > 0 ? 'Neutral — tile or vinyl' : 'Cool tones — stone/ceramic';

    const potential = Math.min(95, Math.max(40, 40 + colorVariance * 0.6 + (255 - avgBrightness) * 0.1));

    // Smart suggestions based on analysis
    const suggestions = [];
    if (avgBrightness < 130) suggestions.push('Improve lighting');
    if (colorVariance > 50) suggestions.push('Unify color scheme');
    if (warmth < 0) suggestions.push('Add warm accents');
    if (saturation < 30) suggestions.push('Add color focal points');
    suggestions.push('Update lighting fixtures', 'Add accent wall', 'Add indoor plants', 'Upgrade furniture', 'Install shelving');

    callback({
        roomType, lightLevel, estSize, condition, condClass,
        wallState, floorState, potential: Math.round(potential),
        dominantColors, suggestions: suggestions.slice(0, 5),
        avgBrightness, warmth, saturation, colorVariance
    });
}
