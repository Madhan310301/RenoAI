/* ============================================================
   RenovateAI — Interactive Room Planner (2D Floor Plan)
   Canvas-based drag-and-drop furniture layout system
   ============================================================ */
const RoomPlanner = (function () {
    let canvas, ctx, container;
    let canvasW = 800, canvasH = 600, gridSize = 20;
    let roomW = 600, roomH = 400, roomX = 100, roomY = 100;
    let placedItems = [], draggingItem = null, dragOffset = { x: 0, y: 0 };
    let selectedItem = null, isDragging = false;
    let roomWidthFt = 20, roomHeightFt = 15;

    const catalog = [
        { category: 'Seating', name: 'Sofa', icon: '🛋️', w: 120, h: 40, color: '#6B4226' },
        { category: 'Seating', name: 'Armchair', icon: '💺', w: 50, h: 50, color: '#5D4E37' },
        { category: 'Seating', name: 'Dining Chair', icon: '🪑', w: 30, h: 30, color: '#8B6914' },
        { category: 'Seating', name: 'Bean Bag', icon: '🫘', w: 45, h: 45, color: '#C0392B' },
        { category: 'Seating', name: 'Ottoman', icon: '🟫', w: 40, h: 40, color: '#8B4513' },
        { category: 'Tables', name: 'Coffee Table', icon: '☕', w: 70, h: 35, color: '#D4A037' },
        { category: 'Tables', name: 'Dining Table', icon: '🍽️', w: 100, h: 60, color: '#8B6914' },
        { category: 'Tables', name: 'Side Table', icon: '🔲', w: 30, h: 30, color: '#A0522D' },
        { category: 'Tables', name: 'Desk', icon: '🖥️', w: 80, h: 40, color: '#5C3D1A' },
        { category: 'Tables', name: 'Console', icon: '📏', w: 90, h: 25, color: '#654321' },
        { category: 'Storage', name: 'Bookshelf', icon: '📚', w: 60, h: 20, color: '#5C3D1A' },
        { category: 'Storage', name: 'Wardrobe', icon: '🚪', w: 80, h: 30, color: '#4A3520' },
        { category: 'Storage', name: 'Cabinet', icon: '🗄️', w: 50, h: 25, color: '#654321' },
        { category: 'Storage', name: 'TV Stand', icon: '📺', w: 100, h: 25, color: '#333' },
        { category: 'Beds', name: 'King Bed', icon: '🛏️', w: 120, h: 100, color: '#F5F0E8' },
        { category: 'Beds', name: 'Queen Bed', icon: '🛌', w: 100, h: 85, color: '#E8D5B5' },
        { category: 'Beds', name: 'Single Bed', icon: '🛏️', w: 60, h: 85, color: '#D4C5A9' },
        { category: 'Lighting', name: 'Floor Lamp', icon: '💡', w: 20, h: 20, color: '#FFC107' },
        { category: 'Lighting', name: 'Table Lamp', icon: '🔆', w: 15, h: 15, color: '#FFD54F' },
        { category: 'Decor', name: 'Rug (Large)', icon: '🟫', w: 120, h: 80, color: '#B8860B' },
        { category: 'Decor', name: 'Rug (Small)', icon: '🟤', w: 60, h: 40, color: '#CD853F' },
        { category: 'Decor', name: 'Plant Pot', icon: '🌿', w: 20, h: 20, color: '#228B22' },
        { category: 'Decor', name: 'Large Plant', icon: '🌴', w: 30, h: 30, color: '#2D8B4E' },
        { category: 'Appliances', name: 'Refrigerator', icon: '🧊', w: 40, h: 35, color: '#C0C0C0' },
        { category: 'Appliances', name: 'Oven', icon: '♨️', w: 40, h: 35, color: '#808080' },
        { category: 'Appliances', name: 'Washer', icon: '🔄', w: 35, h: 35, color: '#DDD' },
        { category: 'Bathroom', name: 'Bathtub', icon: '🛁', w: 80, h: 45, color: '#FFF' },
        { category: 'Bathroom', name: 'Toilet', icon: '🚽', w: 30, h: 35, color: '#FFF' },
        { category: 'Bathroom', name: 'Sink', icon: '🚿', w: 35, h: 25, color: '#EEE' },
    ];

    function init(containerId) {
        container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = `
      <div class="rp-layout">
        <div class="rp-sidebar">
          <h4 class="rp-sidebar-title">📐 Furniture Catalog</h4>
          <div class="rp-search"><input type="text" id="rpSearch" placeholder="🔍 Search..." class="rp-search-input"></div>
          <div class="rp-categories" id="rpCategories"></div>
          <div class="rp-room-config">
            <h4>Room Dimensions</h4>
            <div class="rp-dim-row"><label>Width: <span id="rpRoomW">${roomWidthFt}</span> ft</label>
              <input type="range" id="rpWidthSlider" min="8" max="40" value="${roomWidthFt}" class="range-slider"></div>
            <div class="rp-dim-row"><label>Length: <span id="rpRoomH">${roomHeightFt}</span> ft</label>
              <input type="range" id="rpHeightSlider" min="8" max="30" value="${roomHeightFt}" class="range-slider"></div>
            <div class="rp-dim-row" style="margin-top:8px;"><span style="color:var(--accent-amber);font-weight:600;">Area: <span id="rpArea">${roomWidthFt * roomHeightFt}</span> sq ft</span></div>
          </div>
          <div class="rp-actions">
            <button id="rpClear" class="btn btn-outline" style="width:100%;margin-bottom:8px;">🗑️ Clear All</button>
            <button id="rpExport" class="btn btn-primary" style="width:100%;">📥 Export as Image</button>
          </div>
        </div>
        <div class="rp-canvas-wrap"><canvas id="rpCanvas"></canvas>
          <div class="rp-toolbar"><span class="rp-hint">💡 Click catalog items to place. Drag to move. Delete key to remove.</span></div>
        </div>
      </div>`;
        canvas = document.getElementById('rpCanvas');
        ctx = canvas.getContext('2d');
        setupCanvas(); renderCatalog(); setupEvents(); draw();
    }

    function setupCanvas() {
        const wrap = canvas.parentElement;
        canvasW = wrap.offsetWidth || 800;
        canvasH = Math.max(500, wrap.offsetHeight - 40);
        canvas.width = canvasW; canvas.height = canvasH;
        roomX = (canvasW - roomW) / 2; roomY = (canvasH - roomH) / 2;
    }

    function renderCatalog() {
        const catC = document.getElementById('rpCategories');
        const cats = [...new Set(catalog.map(c => c.category))];
        catC.innerHTML = cats.map(cat => `<div class="rp-cat-section"><div class="rp-cat-header">${cat}</div><div class="rp-cat-items">${catalog.filter(c => c.category === cat).map(item => `<div class="rp-catalog-item" data-name="${item.name}" data-idx="${catalog.indexOf(item)}"><span class="rp-item-icon">${item.icon}</span><span class="rp-item-name">${item.name}</span></div>`).join('')}</div></div>`).join('');
        document.getElementById('rpSearch').addEventListener('input', e => {
            const q = e.target.value.toLowerCase();
            document.querySelectorAll('.rp-catalog-item').forEach(el => { el.style.display = el.dataset.name.toLowerCase().includes(q) ? '' : 'none'; });
        });
    }

    function setupEvents() {
        document.querySelectorAll('.rp-catalog-item').forEach(item => {
            item.addEventListener('click', () => {
                const idx = parseInt(item.dataset.idx);
                const catItem = catalog[idx];
                placedItems.push({ ...catItem, x: roomX + roomW / 2 - catItem.w / 2, y: roomY + roomH / 2 - catItem.h / 2, id: Date.now() + Math.random() });
                selectedItem = placedItems[placedItems.length - 1]; draw();
            });
        });

        canvas.addEventListener('mousedown', e => {
            const rect = canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left, my = e.clientY - rect.top;
            selectedItem = null;
            for (let i = placedItems.length - 1; i >= 0; i--) {
                const it = placedItems[i];
                if (mx >= it.x && mx <= it.x + it.w && my >= it.y && my <= it.y + it.h) {
                    selectedItem = it; draggingItem = it; isDragging = true;
                    dragOffset = { x: mx - it.x, y: my - it.y };
                    placedItems.splice(i, 1); placedItems.push(it); break;
                }
            }
            draw();
        });

        canvas.addEventListener('mousemove', e => {
            if (!isDragging || !draggingItem) return;
            const rect = canvas.getBoundingClientRect();
            draggingItem.x = Math.round((e.clientX - rect.left - dragOffset.x) / gridSize) * gridSize;
            draggingItem.y = Math.round((e.clientY - rect.top - dragOffset.y) / gridSize) * gridSize;
            draw();
        });

        canvas.addEventListener('mouseup', () => { isDragging = false; draggingItem = null; });

        document.addEventListener('keydown', e => {
            if (e.key === 'Delete' && selectedItem) {
                placedItems = placedItems.filter(i => i.id !== selectedItem.id);
                selectedItem = null; draw();
            }
        });

        document.getElementById('rpWidthSlider').addEventListener('input', e => {
            roomWidthFt = parseInt(e.target.value);
            document.getElementById('rpRoomW').textContent = roomWidthFt;
            document.getElementById('rpArea').textContent = roomWidthFt * roomHeightFt;
            roomW = roomWidthFt * 30; roomX = (canvasW - roomW) / 2; draw();
        });

        document.getElementById('rpHeightSlider').addEventListener('input', e => {
            roomHeightFt = parseInt(e.target.value);
            document.getElementById('rpRoomH').textContent = roomHeightFt;
            document.getElementById('rpArea').textContent = roomWidthFt * roomHeightFt;
            roomH = roomHeightFt * 30; roomY = (canvasH - roomH) / 2; draw();
        });

        document.getElementById('rpClear').addEventListener('click', () => { placedItems = []; selectedItem = null; draw(); });
        document.getElementById('rpExport').addEventListener('click', () => {
            selectedItem = null; draw();
            const link = document.createElement('a'); link.download = 'room_plan.png'; link.href = canvas.toDataURL('image/png'); link.click();
        });
        window.addEventListener('resize', () => { setupCanvas(); draw(); });
    }

    function draw() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvasW, canvasH);
        ctx.fillStyle = '#1a1f2e'; ctx.fillRect(0, 0, canvasW, canvasH);
        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 0.5;
        for (let x = 0; x < canvasW; x += gridSize) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvasH); ctx.stroke(); }
        for (let y = 0; y < canvasH; y += gridSize) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvasW, y); ctx.stroke(); }
        // Room
        ctx.fillStyle = '#2a3040'; ctx.fillRect(roomX, roomY, roomW, roomH);
        ctx.strokeStyle = '#4a9eff'; ctx.lineWidth = 2; ctx.strokeRect(roomX, roomY, roomW, roomH);
        // Dimensions
        ctx.fillStyle = '#4a9eff'; ctx.font = '12px Inter,sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(`${roomWidthFt} ft`, roomX + roomW / 2, roomY - 8);
        ctx.save(); ctx.translate(roomX - 12, roomY + roomH / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(`${roomHeightFt} ft`, 0, 0); ctx.restore();
        // Door & Window
        ctx.fillStyle = '#4a9eff'; ctx.fillRect(roomX + roomW - 50, roomY + roomH - 2, 40, 4);
        ctx.font = '10px Inter,sans-serif'; ctx.fillText('Door', roomX + roomW - 30, roomY + roomH + 14);
        ctx.fillStyle = '#87CEEB'; ctx.fillRect(roomX + 30, roomY - 2, 60, 4); ctx.fillText('Window', roomX + 60, roomY - 8);
        // Furniture
        placedItems.forEach(item => {
            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(item.x + 3, item.y + 3, item.w, item.h);
            ctx.fillStyle = item.color; ctx.fillRect(item.x, item.y, item.w, item.h);
            ctx.strokeStyle = selectedItem === item ? '#FFD700' : 'rgba(255,255,255,0.2)';
            ctx.lineWidth = selectedItem === item ? 2 : 1; ctx.strokeRect(item.x, item.y, item.w, item.h);
            ctx.fillStyle = '#fff'; ctx.font = '11px Inter,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(item.icon + ' ' + item.name, item.x + item.w / 2, item.y + item.h / 2);
            if (selectedItem === item) {
                [[item.x, item.y], [item.x + item.w, item.y], [item.x, item.y + item.h], [item.x + item.w, item.y + item.h]].forEach(([hx, hy]) => {
                    ctx.fillStyle = '#FFD700'; ctx.fillRect(hx - 4, hy - 4, 8, 8);
                });
            }
            ctx.restore();
        });
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '11px Inter,sans-serif'; ctx.textAlign = 'left';
        ctx.fillText(`${placedItems.length} items placed`, 10, canvasH - 10);
    }

    return { init, catalog };
})();
