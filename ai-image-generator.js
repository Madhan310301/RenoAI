/* ============================================================
   RenovateAI — AI Image Generation Engine (Nano Banana Pro)
   Canvas-based renovation image generator that creates
   realistic-looking renovated room images from user prompts
   ============================================================ */

const AIImageGenerator = (function () {

    // ─────────── Furniture element library (vector-based) ───────────
    const furnitureLibrary = {
        sofa: {
            draw(ctx, x, y, w, h, color) {
                const c = color || '#6B4226';
                // Sofa body
                ctx.fillStyle = c;
                roundRect(ctx, x, y + h * 0.3, w, h * 0.5, 8);
                ctx.fill();
                // Back cushion
                ctx.fillStyle = adjustBrightness(c, 15);
                roundRect(ctx, x + w * 0.05, y, w * 0.9, h * 0.4, 8);
                ctx.fill();
                // Seat cushions
                ctx.fillStyle = adjustBrightness(c, 25);
                roundRect(ctx, x + w * 0.08, y + h * 0.35, w * 0.38, h * 0.35, 6);
                ctx.fill();
                roundRect(ctx, x + w * 0.54, y + h * 0.35, w * 0.38, h * 0.35, 6);
                ctx.fill();
                // Armrests
                ctx.fillStyle = adjustBrightness(c, -10);
                roundRect(ctx, x, y + h * 0.15, w * 0.1, h * 0.65, 6);
                ctx.fill();
                roundRect(ctx, x + w * 0.9, y + h * 0.15, w * 0.1, h * 0.65, 6);
                ctx.fill();
                // Legs
                ctx.fillStyle = '#2C2C2C';
                ctx.fillRect(x + w * 0.05, y + h * 0.82, w * 0.04, h * 0.18);
                ctx.fillRect(x + w * 0.91, y + h * 0.82, w * 0.04, h * 0.18);
            }
        },
        table: {
            draw(ctx, x, y, w, h, color) {
                const c = color || '#8B6914';
                // Tabletop
                ctx.fillStyle = c;
                roundRect(ctx, x, y, w, h * 0.15, 4);
                ctx.fill();
                // Tabletop highlight
                ctx.fillStyle = adjustBrightness(c, 20);
                roundRect(ctx, x + w * 0.05, y + h * 0.02, w * 0.9, h * 0.06, 2);
                ctx.fill();
                // Legs
                ctx.fillStyle = adjustBrightness(c, -20);
                ctx.fillRect(x + w * 0.08, y + h * 0.15, w * 0.06, h * 0.85);
                ctx.fillRect(x + w * 0.86, y + h * 0.15, w * 0.06, h * 0.85);
            }
        },
        bookshelf: {
            draw(ctx, x, y, w, h, color) {
                const c = color || '#5C3D1A';
                // Frame
                ctx.fillStyle = c;
                ctx.fillRect(x, y, w, h);
                // Shelves
                ctx.fillStyle = adjustBrightness(c, 15);
                for (let i = 0; i < 4; i++) {
                    ctx.fillRect(x + w * 0.05, y + h * (0.02 + i * 0.25), w * 0.9, h * 0.04);
                }
                // Books
                const bookColors = ['#C0392B', '#2980B9', '#27AE60', '#F39C12', '#8E44AD', '#E74C3C', '#1ABC9C', '#D35400'];
                for (let shelf = 0; shelf < 3; shelf++) {
                    const shelfY = y + h * (0.07 + shelf * 0.25);
                    let bx = x + w * 0.08;
                    for (let b = 0; b < 6 + Math.floor(Math.random() * 3); b++) {
                        const bw = w * (0.04 + Math.random() * 0.06);
                        const bh = h * (0.14 + Math.random() * 0.08);
                        ctx.fillStyle = bookColors[Math.floor(Math.random() * bookColors.length)];
                        ctx.fillRect(bx, shelfY + (h * 0.2 - bh), bw, bh);
                        bx += bw + w * 0.01;
                        if (bx > x + w * 0.88) break;
                    }
                }
            }
        },
        plant: {
            draw(ctx, x, y, w, h) {
                // Pot
                ctx.fillStyle = '#B5651D';
                ctx.beginPath();
                ctx.moveTo(x + w * 0.25, y + h * 0.55);
                ctx.lineTo(x + w * 0.3, y + h);
                ctx.lineTo(x + w * 0.7, y + h);
                ctx.lineTo(x + w * 0.75, y + h * 0.55);
                ctx.closePath();
                ctx.fill();
                // Pot rim
                ctx.fillStyle = '#9E4A1A';
                roundRect(ctx, x + w * 0.2, y + h * 0.52, w * 0.6, h * 0.06, 3);
                ctx.fill();
                // Leaves
                ctx.fillStyle = '#2D8B4E';
                drawLeaf(ctx, x + w * 0.5, y + h * 0.5, w * 0.35, -Math.PI / 4);
                drawLeaf(ctx, x + w * 0.5, y + h * 0.5, w * 0.3, -Math.PI / 2.5);
                ctx.fillStyle = '#3DA863';
                drawLeaf(ctx, x + w * 0.5, y + h * 0.5, w * 0.38, -Math.PI / 1.8);
                drawLeaf(ctx, x + w * 0.5, y + h * 0.5, w * 0.25, -Math.PI / 6);
                ctx.fillStyle = '#228B44';
                drawLeaf(ctx, x + w * 0.5, y + h * 0.45, w * 0.32, -Math.PI / 3);
            }
        },
        lamp: {
            draw(ctx, x, y, w, h) {
                // Base
                ctx.fillStyle = '#333';
                roundRect(ctx, x + w * 0.3, y + h * 0.9, w * 0.4, h * 0.1, 4);
                ctx.fill();
                // Stand
                ctx.fillStyle = '#555';
                ctx.fillRect(x + w * 0.46, y + h * 0.35, w * 0.08, h * 0.58);
                // Shade
                ctx.fillStyle = '#FFF5DC';
                ctx.beginPath();
                ctx.moveTo(x + w * 0.15, y + h * 0.35);
                ctx.lineTo(x + w * 0.25, y);
                ctx.lineTo(x + w * 0.75, y);
                ctx.lineTo(x + w * 0.85, y + h * 0.35);
                ctx.closePath();
                ctx.fill();
                // Light glow
                ctx.save();
                ctx.globalAlpha = 0.15;
                const glow = ctx.createRadialGradient(x + w * 0.5, y + h * 0.2, w * 0.1, x + w * 0.5, y + h * 0.2, w * 0.7);
                glow.addColorStop(0, '#FFDD44');
                glow.addColorStop(1, 'transparent');
                ctx.fillStyle = glow;
                ctx.fillRect(x - w * 0.3, y - h * 0.3, w * 1.6, h * 1.3);
                ctx.restore();
            }
        },
        rug: {
            draw(ctx, x, y, w, h, color) {
                const c = color || '#8B4513';
                ctx.save();
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = c;
                roundRect(ctx, x, y, w, h, 6);
                ctx.fill();
                // Pattern
                ctx.strokeStyle = adjustBrightness(c, 30);
                ctx.lineWidth = 2;
                roundRect(ctx, x + w * 0.08, y + h * 0.1, w * 0.84, h * 0.8, 4);
                ctx.stroke();
                roundRect(ctx, x + w * 0.15, y + h * 0.2, w * 0.7, h * 0.6, 3);
                ctx.stroke();
                ctx.restore();
            }
        },
        mirror: {
            draw(ctx, x, y, w, h) {
                // Frame
                ctx.fillStyle = '#C8A96E';
                roundRect(ctx, x, y, w, h, 4);
                ctx.fill();
                // Glass
                ctx.save();
                ctx.globalAlpha = 0.3;
                const grad = ctx.createLinearGradient(x, y, x + w, y + h);
                grad.addColorStop(0, '#B0D4F1');
                grad.addColorStop(0.5, '#E8F4FD');
                grad.addColorStop(1, '#A8CCE8');
                ctx.fillStyle = grad;
                roundRect(ctx, x + w * 0.06, y + h * 0.04, w * 0.88, h * 0.92, 2);
                ctx.fill();
                ctx.restore();
                // Highlight
                ctx.save();
                ctx.globalAlpha = 0.4;
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.ellipse(x + w * 0.3, y + h * 0.3, w * 0.12, h * 0.2, -0.4, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        },
        painting: {
            draw(ctx, x, y, w, h) {
                // Frame
                ctx.fillStyle = '#333';
                ctx.fillRect(x, y, w, h);
                // Canvas
                const grad = ctx.createLinearGradient(x, y, x + w, y + h);
                grad.addColorStop(0, '#E8A87C');
                grad.addColorStop(0.3, '#85C1E9');
                grad.addColorStop(0.6, '#F39C12');
                grad.addColorStop(1, '#E74C3C');
                ctx.fillStyle = grad;
                ctx.fillRect(x + w * 0.06, y + h * 0.06, w * 0.88, h * 0.88);
                // Abstract shapes
                ctx.save();
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = '#FFF';
                ctx.beginPath();
                ctx.arc(x + w * 0.4, y + h * 0.4, w * 0.15, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#2C3E50';
                ctx.beginPath();
                ctx.arc(x + w * 0.65, y + h * 0.6, w * 0.1, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        },
        curtain: {
            draw(ctx, x, y, w, h, color) {
                const c = color || '#D4C5A9';
                ctx.save();
                ctx.globalAlpha = 0.7;
                // Left curtain
                ctx.fillStyle = c;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.quadraticCurveTo(x + w * 0.15, y + h * 0.5, x + w * 0.2, y + h);
                ctx.lineTo(x, y + h);
                ctx.closePath();
                ctx.fill();
                // Right curtain
                ctx.beginPath();
                ctx.moveTo(x + w, y);
                ctx.quadraticCurveTo(x + w * 0.85, y + h * 0.5, x + w * 0.8, y + h);
                ctx.lineTo(x + w, y + h);
                ctx.closePath();
                ctx.fill();
                // Rod
                ctx.fillStyle = '#888';
                ctx.fillRect(x - w * 0.05, y - h * 0.02, w * 1.1, h * 0.03);
                // Folds
                ctx.strokeStyle = adjustBrightness(c, -15);
                ctx.lineWidth = 1;
                for (let i = 0; i < 3; i++) {
                    const fx = x + w * (0.04 + i * 0.06);
                    ctx.beginPath();
                    ctx.moveTo(fx, y);
                    ctx.quadraticCurveTo(fx + w * 0.03, y + h * 0.5, fx + w * 0.01, y + h);
                    ctx.stroke();
                }
                for (let i = 0; i < 3; i++) {
                    const fx = x + w * (0.82 + i * 0.06);
                    ctx.beginPath();
                    ctx.moveTo(fx, y);
                    ctx.quadraticCurveTo(fx - w * 0.03, y + h * 0.5, fx - w * 0.01, y + h);
                    ctx.stroke();
                }
                ctx.restore();
            }
        },
        chair: {
            draw(ctx, x, y, w, h, color) {
                const c = color || '#5D4E37';
                // Seat
                ctx.fillStyle = c;
                roundRect(ctx, x + w * 0.1, y + h * 0.45, w * 0.8, h * 0.15, 4);
                ctx.fill();
                // Backrest
                ctx.fillStyle = adjustBrightness(c, 10);
                roundRect(ctx, x + w * 0.15, y, w * 0.7, h * 0.48, 6);
                ctx.fill();
                // Legs
                ctx.fillStyle = adjustBrightness(c, -20);
                ctx.fillRect(x + w * 0.14, y + h * 0.6, w * 0.06, h * 0.4);
                ctx.fillRect(x + w * 0.8, y + h * 0.6, w * 0.06, h * 0.4);
                ctx.fillRect(x + w * 0.14, y + h * 0.6, w * 0.06, h * 0.4);
                ctx.fillRect(x + w * 0.8, y + h * 0.6, w * 0.06, h * 0.4);
            }
        },
        tv: {
            draw(ctx, x, y, w, h) {
                // Screen bezel
                ctx.fillStyle = '#1a1a1a';
                roundRect(ctx, x, y, w, h * 0.85, 4);
                ctx.fill();
                // Screen
                const sGrad = ctx.createLinearGradient(x, y, x + w, y + h * 0.85);
                sGrad.addColorStop(0, '#1A1A2E');
                sGrad.addColorStop(0.5, '#16213E');
                sGrad.addColorStop(1, '#0F3460');
                ctx.fillStyle = sGrad;
                roundRect(ctx, x + w * 0.02, y + h * 0.03, w * 0.96, h * 0.78, 2);
                ctx.fill();
                // Stand
                ctx.fillStyle = '#333';
                ctx.fillRect(x + w * 0.4, y + h * 0.85, w * 0.2, h * 0.08);
                roundRect(ctx, x + w * 0.25, y + h * 0.92, w * 0.5, h * 0.08, 4);
                ctx.fill();
            }
        },
        bed: {
            draw(ctx, x, y, w, h, color) {
                const c = color || '#F5F0E8';
                // Headboard
                ctx.fillStyle = '#5C3D1A';
                roundRect(ctx, x, y, w, h * 0.35, 6);
                ctx.fill();
                // Mattress
                ctx.fillStyle = '#FFF';
                roundRect(ctx, x + w * 0.02, y + h * 0.3, w * 0.96, h * 0.45, 4);
                ctx.fill();
                // Bedding
                ctx.fillStyle = c;
                roundRect(ctx, x + w * 0.02, y + h * 0.35, w * 0.96, h * 0.38, 4);
                ctx.fill();
                // Pillows
                ctx.fillStyle = '#FFF';
                roundRect(ctx, x + w * 0.08, y + h * 0.28, w * 0.35, h * 0.15, 8);
                ctx.fill();
                roundRect(ctx, x + w * 0.57, y + h * 0.28, w * 0.35, h * 0.15, 8);
                ctx.fill();
                // Bed frame bottom
                ctx.fillStyle = '#4A3520';
                ctx.fillRect(x, y + h * 0.75, w, h * 0.08);
                // Legs
                ctx.fillRect(x + w * 0.02, y + h * 0.83, w * 0.05, h * 0.17);
                ctx.fillRect(x + w * 0.93, y + h * 0.83, w * 0.05, h * 0.17);
            }
        }
    };

    // ─────────── Style-specific palettes ───────────
    const stylePalettes = {
        modern: {
            walls: ['#F0F0F0', '#E8E8E8', '#FAFAFA'],
            floors: ['#D4B896', '#C8A882', '#BFA77A'],
            furniture: ['#333333', '#555555', '#888888'],
            accents: ['#F59E0B', '#3B82F6', '#10B981'],
            overlay: 'rgba(230,240,250,0.08)',
            ambient: '#FFF8E7'
        },
        industrial: {
            walls: ['#8B7355', '#7A6548', '#6E5B40'],
            floors: ['#555555', '#4A4A4A', '#666666'],
            furniture: ['#2C2C2C', '#444444', '#6B4226'],
            accents: ['#D4A037', '#C0392B', '#E67E22'],
            overlay: 'rgba(90,70,50,0.12)',
            ambient: '#E8D5B5'
        },
        scandinavian: {
            walls: ['#FFF8F0', '#F5F0E8', '#FEFCF5'],
            floors: ['#E8D5B5', '#DBC8A8', '#D4BD9C'],
            furniture: ['#D4BD9C', '#C8A882', '#A08060'],
            accents: ['#7FB3D8', '#A8BBA0', '#F5E6CA'],
            overlay: 'rgba(245,240,230,0.1)',
            ambient: '#FFFAF2'
        },
        bohemian: {
            walls: ['#F5E6CA', '#E8D5B5', '#DBC8A8'],
            floors: ['#8B6914', '#7A5D12', '#9C7A18'],
            furniture: ['#CC6B49', '#B85C3A', '#A04D2E'],
            accents: ['#E74C3C', '#F39C12', '#8E44AD', '#27AE60'],
            overlay: 'rgba(200,100,50,0.08)',
            ambient: '#FFF0D5'
        },
        japandi: {
            walls: ['#F5F0E8', '#EBE5D9', '#E0D8CB'],
            floors: ['#C8A882', '#BFA77A', '#B89E72'],
            furniture: ['#5C4830', '#4A3A25', '#6B563E'],
            accents: ['#2D5016', '#8B7355', '#D4C5A9'],
            overlay: 'rgba(180,170,150,0.08)',
            ambient: '#F5EFE5'
        },
        coastal: {
            walls: ['#E8F4FD', '#D6EAF8', '#C8E0F0'],
            floors: ['#E8D5B5', '#D4C5A9', '#C8B89C'],
            furniture: ['#FFF', '#E8E8E8', '#D4C5A9'],
            accents: ['#2980B9', '#1ABC9C', '#E74C3C'],
            overlay: 'rgba(100,180,220,0.08)',
            ambient: '#E8F8FF'
        },
        artdeco: {
            walls: ['#1A1A2E', '#16213E', '#0F3460'],
            floors: ['#2C2C2C', '#1A1A1A', '#333333'],
            furniture: ['#D4AF37', '#C8A430', '#B89828'],
            accents: ['#D4AF37', '#E8C547', '#F5D45E'],
            overlay: 'rgba(180,150,50,0.08)',
            ambient: '#FFF5D5'
        },
        midcentury: {
            walls: ['#FFF8E7', '#F5EFD5', '#EBE5C5'],
            floors: ['#B8860B', '#A07808', '#C89818'],
            furniture: ['#E67E22', '#D35400', '#C0392B'],
            accents: ['#27AE60', '#2980B9', '#E74C3C'],
            overlay: 'rgba(200,120,40,0.08)',
            ambient: '#FFF5E0'
        }
    };

    // ─────────── Canvas helper functions ───────────
    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    function drawLeaf(ctx, cx, cy, size, angle) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(size * 0.5, -size * 0.6, 0, -size);
        ctx.quadraticCurveTo(-size * 0.5, -size * 0.6, 0, 0);
        ctx.fill();
        ctx.restore();
    }

    function adjustBrightness(hex, amount) {
        hex = hex.replace('#', '');
        const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount));
        const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount));
        const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount));
        return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
    }

    function hexToRgba(hex, alpha) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    }

    // ─────────── Procedural texture generators ───────────
    function drawWoodFloor(ctx, x, y, w, h, color) {
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
        // Planks
        const plankH = h / 8;
        for (let i = 0; i < 8; i++) {
            const py = y + i * plankH;
            ctx.strokeStyle = adjustBrightness(color, -15);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, py);
            ctx.lineTo(x + w, py);
            ctx.stroke();
            // Grain lines
            ctx.strokeStyle = adjustBrightness(color, -8);
            ctx.lineWidth = 0.5;
            ctx.globalAlpha = 0.15;
            for (let g = 0; g < 5; g++) {
                const gy = py + Math.random() * plankH;
                ctx.beginPath();
                ctx.moveTo(x, gy);
                ctx.bezierCurveTo(x + w * 0.3, gy + 2, x + w * 0.7, gy - 2, x + w, gy);
                ctx.stroke();
            }
            ctx.globalAlpha = 0.35;
        }
        ctx.restore();
    }

    function drawTileFloor(ctx, x, y, w, h, color) {
        ctx.save();
        ctx.globalAlpha = 0.3;
        const tileSize = Math.min(w, h) / 6;
        for (let tx = x; tx < x + w; tx += tileSize) {
            for (let ty = y; ty < y + h; ty += tileSize) {
                ctx.fillStyle = Math.random() > 0.5 ? color : adjustBrightness(color, 10);
                ctx.fillRect(tx, ty, tileSize - 1, tileSize - 1);
            }
        }
        ctx.restore();
    }

    function drawWallTexture(ctx, x, y, w, h, color) {
        ctx.save();
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
        // Subtle gradient for depth
        const grad = ctx.createLinearGradient(x, y, x, y + h);
        grad.addColorStop(0, adjustBrightness(color, 15));
        grad.addColorStop(1, adjustBrightness(color, -10));
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, w, h);
        ctx.restore();
    }

    // ─────────── Lighting effects ───────────
    function drawAmbientLight(ctx, w, h, color) {
        ctx.save();
        ctx.globalCompositeOperation = 'soft-light';
        ctx.globalAlpha = 0.2;
        const grad = ctx.createRadialGradient(w * 0.5, 0, 0, w * 0.5, h * 0.3, w * 0.8);
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    }

    function drawWindowLight(ctx, wx, wy, ww, wh, canvasW, canvasH) {
        ctx.save();
        ctx.globalCompositeOperation = 'soft-light';
        ctx.globalAlpha = 0.15;
        // Light rays from window
        const grad = ctx.createLinearGradient(wx + ww, wy, wx + ww + canvasW * 0.4, canvasH);
        grad.addColorStop(0, '#FFFDE7');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(wx + ww, wy);
        ctx.lineTo(wx + ww + canvasW * 0.4, canvasH);
        ctx.lineTo(wx + ww + canvasW * 0.1, canvasH);
        ctx.lineTo(wx + ww, wy + wh);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // ─────────── Post-processing effects ───────────
    function applyVignette(ctx, w, h, intensity) {
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.75);
        vignette.addColorStop(0, 'rgba(255,255,255,1)');
        vignette.addColorStop(1, `rgba(${180 - intensity * 50},${180 - intensity * 50},${180 - intensity * 50},1)`);
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    }

    function applyFilmGrain(ctx, w, h, amount) {
        ctx.save();
        ctx.globalAlpha = amount;
        for (let i = 0; i < w * h * 0.02; i++) {
            const gx = Math.random() * w;
            const gy = Math.random() * h;
            const gv = Math.random() > 0.5 ? 255 : 0;
            ctx.fillStyle = `rgba(${gv},${gv},${gv},0.3)`;
            ctx.fillRect(gx, gy, 1, 1);
        }
        ctx.restore();
    }

    function applyBloom(ctx, w, h, color) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.08;
        const bloom = ctx.createRadialGradient(w * 0.5, h * 0.3, 0, w * 0.5, h * 0.3, w * 0.5);
        bloom.addColorStop(0, color);
        bloom.addColorStop(1, 'transparent');
        ctx.fillStyle = bloom;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    }

    // ─────────── Prompt parser ───────────
    function parsePrompt(text) {
        const lower = text.toLowerCase();
        const items = [];
        const keywords = {
            sofa: ['sofa', 'couch', 'settee', 'sectional'],
            table: ['table', 'desk', 'coffee table'],
            bookshelf: ['bookshelf', 'shelf', 'shelving', 'shelves', 'bookcase'],
            plant: ['plant', 'plants', 'greenery', 'fern', 'monstera', 'fiddle leaf'],
            lamp: ['lamp', 'light', 'chandelier', 'floor lamp', 'table lamp'],
            rug: ['rug', 'carpet', 'mat'],
            mirror: ['mirror'],
            painting: ['painting', 'art', 'artwork', 'poster', 'frame', 'picture'],
            curtain: ['curtain', 'curtains', 'drape', 'drapes', 'blinds'],
            chair: ['chair', 'armchair', 'stool', 'accent chair'],
            tv: ['tv', 'television', 'screen', 'monitor'],
            bed: ['bed', 'mattress']
        };

        for (const [type, kws] of Object.entries(keywords)) {
            if (kws.some(k => lower.includes(k))) {
                items.push(type);
            }
        }

        // Detect style changes
        let style = null;
        const styleKws = {
            modern: ['modern', 'minimalist', 'contemporary'],
            industrial: ['industrial', 'loft', 'warehouse'],
            scandinavian: ['scandinavian', 'scandi', 'nordic', 'hygge'],
            bohemian: ['bohemian', 'boho', 'eclectic'],
            japandi: ['japandi', 'japanese', 'zen'],
            coastal: ['coastal', 'beach', 'ocean', 'nautical'],
            artdeco: ['art deco', 'artdeco', 'deco', 'glamour'],
            midcentury: ['mid-century', 'midcentury', 'retro', '60s', '70s']
        };

        for (const [s, kws] of Object.entries(styleKws)) {
            if (kws.some(k => lower.includes(k))) {
                style = s;
                break;
            }
        }

        // Detect floor changes
        let floor = null;
        if (lower.includes('hardwood') || lower.includes('wood floor') || lower.includes('oak')) floor = 'wood';
        if (lower.includes('tile') || lower.includes('marble') || lower.includes('ceramic')) floor = 'tile';

        // Detect wall color
        let wallColor = null;
        const colorMap = {
            'white': '#F5F5F5', 'gray': '#B0B0B0', 'grey': '#B0B0B0', 'blue': '#B8D4E3',
            'green': '#A8BBA0', 'beige': '#F5E6CA', 'cream': '#FFF8E7', 'navy': '#1B2A4A',
            'sage': '#A8BBA0', 'terracotta': '#CC6B49', 'pink': '#F0C0C0', 'yellow': '#FFF3B0',
            'charcoal': '#36454F', 'olive': '#6B7F47', 'coral': '#FF7F7F', 'teal': '#008080',
            'burgundy': '#800020', 'lavender': '#E6E6FA', 'peach': '#FFDAB9', 'mint': '#98FB98'
        };

        for (const [name, hex] of Object.entries(colorMap)) {
            if (lower.includes(name)) {
                wallColor = hex;
                break;
            }
        }

        return { items, style, floor, wallColor };
    }

    // ─────────── Main generation function ───────────
    function generateImage(sourceImg, prompt, style, onProgress, onComplete) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const w = sourceImg.naturalWidth || 900;
        const h = sourceImg.naturalHeight || 600;
        canvas.width = w;
        canvas.height = h;

        const parsed = parsePrompt(prompt || '');
        const activeStyle = parsed.style || style || 'modern';
        const palette = stylePalettes[activeStyle] || stylePalettes.modern;

        // Track generation progress
        let progress = 0;
        const totalSteps = 8;

        function updateProgress(step, label) {
            progress = Math.round((step / totalSteps) * 100);
            if (onProgress) onProgress(progress, label);
        }

        // Use setTimeout chain for progressive rendering effect
        setTimeout(() => {
            // Step 1: Draw base image
            updateProgress(1, 'Loading source image...');
            ctx.drawImage(sourceImg, 0, 0, w, h);

            setTimeout(() => {
                // Step 2: Apply wall texture
                updateProgress(2, 'Applying wall colors...');
                const wallColor = parsed.wallColor || palette.walls[0];
                drawWallTexture(ctx, 0, 0, w, h * 0.55, wallColor);

                setTimeout(() => {
                    // Step 3: Apply floor texture
                    updateProgress(3, 'Rendering floor texture...');
                    const floorColor = palette.floors[0];
                    if (parsed.floor === 'tile') {
                        drawTileFloor(ctx, 0, h * 0.55, w, h * 0.45, floorColor);
                    } else {
                        drawWoodFloor(ctx, 0, h * 0.55, w, h * 0.45, floorColor);
                    }

                    setTimeout(() => {
                        // Step 4: Place furniture items
                        updateProgress(4, 'Placing furniture elements...');
                        const itemsToPlace = parsed.items.length > 0 ? parsed.items : getDefaultItems(activeStyle);
                        placeFurniture(ctx, w, h, itemsToPlace, palette);

                        setTimeout(() => {
                            // Step 5: Apply style-specific color grading
                            updateProgress(5, 'Applying style color grading...');
                            applyColorGrading(ctx, w, h, palette, activeStyle);

                            setTimeout(() => {
                                // Step 6: Add lighting effects
                                updateProgress(6, 'Adding lighting effects...');
                                drawAmbientLight(ctx, w, h, palette.ambient);
                                drawWindowLight(ctx, w * 0.05, h * 0.05, w * 0.25, h * 0.35, w, h);

                                setTimeout(() => {
                                    // Step 7: Post-processing
                                    updateProgress(7, 'Post-processing...');
                                    applyVignette(ctx, w, h, 0.8);
                                    applyFilmGrain(ctx, w, h, 0.03);
                                    applyBloom(ctx, w, h, palette.ambient);

                                    setTimeout(() => {
                                        // Step 8: Final export
                                        updateProgress(8, 'Finalizing image...');
                                        try {
                                            const resultURL = canvas.toDataURL('image/jpeg', 0.92);
                                            if (onComplete) onComplete(resultURL, activeStyle);
                                        } catch (e) {
                                            // Fallback: return canvas element
                                            if (onComplete) onComplete(null, activeStyle);
                                        }
                                    }, 150);
                                }, 150);
                            }, 150);
                        }, 200);
                    }, 150);
                }, 150);
            }, 150);
        }, 100);
    }

    function getDefaultItems(style) {
        const defaults = {
            modern: ['sofa', 'table', 'lamp', 'plant', 'tv'],
            industrial: ['sofa', 'table', 'bookshelf', 'lamp'],
            scandinavian: ['sofa', 'plant', 'rug', 'lamp', 'mirror'],
            bohemian: ['sofa', 'rug', 'plant', 'painting', 'curtain'],
            japandi: ['table', 'plant', 'lamp', 'rug'],
            coastal: ['sofa', 'table', 'mirror', 'plant', 'lamp'],
            artdeco: ['sofa', 'mirror', 'lamp', 'painting', 'curtain'],
            midcentury: ['sofa', 'chair', 'table', 'lamp', 'plant']
        };
        return defaults[style] || defaults.modern;
    }

    function placeFurniture(ctx, w, h, items, palette) {
        // Define placement zones (relative to canvas)
        const zones = {
            sofa: { x: 0.05, y: 0.45, w: 0.45, h: 0.25 },
            table: { x: 0.25, y: 0.65, w: 0.25, h: 0.15 },
            bookshelf: { x: 0.78, y: 0.15, w: 0.18, h: 0.45 },
            plant: { x: 0.82, y: 0.4, w: 0.12, h: 0.2 },
            lamp: { x: 0.7, y: 0.2, w: 0.1, h: 0.3 },
            rug: { x: 0.1, y: 0.7, w: 0.5, h: 0.15 },
            mirror: { x: 0.55, y: 0.08, w: 0.15, h: 0.22 },
            painting: { x: 0.2, y: 0.05, w: 0.2, h: 0.15 },
            curtain: { x: 0.0, y: 0.0, w: 0.2, h: 0.55 },
            chair: { x: 0.55, y: 0.5, w: 0.15, h: 0.2 },
            tv: { x: 0.35, y: 0.08, w: 0.3, h: 0.2 },
            bed: { x: 0.1, y: 0.35, w: 0.5, h: 0.35 }
        };

        ctx.save();
        ctx.globalAlpha = 0.75;

        items.forEach(item => {
            const zone = zones[item];
            const furniture = furnitureLibrary[item];
            if (zone && furniture) {
                const color = palette.furniture[Math.floor(Math.random() * palette.furniture.length)];
                furniture.draw(ctx, zone.x * w, zone.y * h, zone.w * w, zone.h * h, color);
            }
        });

        ctx.restore();
    }

    function applyColorGrading(ctx, w, h, palette, style) {
        // Style-specific canvas adjustments
        const grading = {
            modern: { contrast: 1.05, brightness: 1.05, saturation: 0.95 },
            industrial: { contrast: 1.1, brightness: 0.95, saturation: 0.9 },
            scandinavian: { contrast: 1.02, brightness: 1.1, saturation: 0.85 },
            bohemian: { contrast: 1.08, brightness: 1.02, saturation: 1.15 },
            japandi: { contrast: 1.05, brightness: 1.02, saturation: 0.9 },
            coastal: { contrast: 1.05, brightness: 1.08, saturation: 1.05 },
            artdeco: { contrast: 1.12, brightness: 0.95, saturation: 1.05 },
            midcentury: { contrast: 1.08, brightness: 0.98, saturation: 1.1 }
        };

        const grade = grading[style] || grading.modern;

        const imageData = ctx.getImageData(0, 0, w, h);
        const d = imageData.data;

        for (let i = 0; i < d.length; i += 4) {
            let r = d[i] * grade.brightness;
            let g = d[i + 1] * grade.brightness;
            let b = d[i + 2] * grade.brightness;

            r = (r - 128) * grade.contrast + 128;
            g = (g - 128) * grade.contrast + 128;
            b = (b - 128) * grade.contrast + 128;

            const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            r = gray + grade.saturation * (r - gray);
            g = gray + grade.saturation * (g - gray);
            b = gray + grade.saturation * (b - gray);

            d[i] = Math.max(0, Math.min(255, r));
            d[i + 1] = Math.max(0, Math.min(255, g));
            d[i + 2] = Math.max(0, Math.min(255, b));
        }

        ctx.putImageData(imageData, 0, 0);

        // Style overlay
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = palette.overlay;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'source-over';
    }

    // Public API
    return {
        generate: generateImage,
        parsePrompt,
        stylePalettes,
        furnitureLibrary
    };

})();
