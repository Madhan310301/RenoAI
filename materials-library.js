/* ============================================================
   RenovateAI — Materials Library
   Searchable catalog of 100+ renovation materials with pricing
   ============================================================ */
const MaterialsLibrary = (function () {
    const materials = [
        // FLOORING
        { cat: 'Flooring', name: 'Red Oak Hardwood', desc: 'Classic American hardwood with warm grain patterns', priceMin: 6, priceMax: 14, durability: 9, maintenance: 'Medium', pros: ['Timeless look', 'Refinishable', 'Adds value'], cons: ['Moisture sensitive', 'Expensive'], swatch: 'linear-gradient(135deg,#B8860B,#D4A037,#C8941E)', popular: true },
        { cat: 'Flooring', name: 'White Oak Hardwood', desc: 'European-style wide plank with cool undertones', priceMin: 7, priceMax: 16, durability: 9, maintenance: 'Medium', pros: ['Water resistant', 'Modern look', 'Durable'], cons: ['Premium price'], swatch: 'linear-gradient(135deg,#C8B078,#D4BD9C,#BFA77A)' },
        { cat: 'Flooring', name: 'Bamboo', desc: 'Eco-friendly alternative that regrows in 5 years', priceMin: 3, priceMax: 8, durability: 7, maintenance: 'Low', pros: ['Sustainable', 'Affordable', 'Hard'], cons: ['Can scratch', 'Limited styles'], swatch: 'linear-gradient(135deg,#E8D5B5,#DBC8A8,#D4BD9C)' },
        { cat: 'Flooring', name: 'Luxury Vinyl Plank (LVP)', desc: 'Waterproof synthetic with realistic wood look', priceMin: 2, priceMax: 7, durability: 8, maintenance: 'Low', pros: ['Waterproof', 'DIY-friendly', 'Affordable'], cons: ['Not refinishable', 'Lower resale'], swatch: 'linear-gradient(135deg,#A0845C,#B89E72,#C8A882)', popular: true },
        { cat: 'Flooring', name: 'Porcelain Tile', desc: 'Ultra-durable ceramic fired at high temperatures', priceMin: 4, priceMax: 12, durability: 10, maintenance: 'Low', pros: ['Waterproof', 'Ultra durable', 'Many styles'], cons: ['Cold underfoot', 'Hard to install'], swatch: 'linear-gradient(135deg,#D0D0D0,#E8E8E8,#C0C0C0)' },
        { cat: 'Flooring', name: 'Marble Tile', desc: 'Luxury natural stone with unique veining', priceMin: 10, priceMax: 50, durability: 7, maintenance: 'High', pros: ['Stunning luxury', 'Unique patterns'], cons: ['Stains easily', 'Very expensive', 'Slippery'], swatch: 'linear-gradient(135deg,#F0EDE8,#E8E4DF,#D8D4CF)' },
        { cat: 'Flooring', name: 'Laminate', desc: 'Budget-friendly multi-layer synthetic with photo layer', priceMin: 1, priceMax: 5, durability: 6, maintenance: 'Low', pros: ['Very affordable', 'Easy DIY', 'Many designs'], cons: ['Not refinishable', 'Water damage risk'], swatch: 'linear-gradient(135deg,#C8A882,#B89E72,#A08060)' },
        { cat: 'Flooring', name: 'Engineered Hardwood', desc: 'Real wood veneer on plywood core for stability', priceMin: 4, priceMax: 10, durability: 8, maintenance: 'Medium', pros: ['Real wood look', 'Stable', 'Works with radiant heat'], cons: ['Limited refinishing'], swatch: 'linear-gradient(135deg,#B89070,#C8A080,#A08060)' },
        { cat: 'Flooring', name: 'Cork', desc: 'Natural bark harvest — soft, warm, and sound-absorbing', priceMin: 3, priceMax: 8, durability: 6, maintenance: 'Medium', pros: ['Soft underfoot', 'Sound absorbing', 'Eco-friendly'], cons: ['Can dent', 'Needs sealing'], swatch: 'linear-gradient(135deg,#D4A860,#C89850,#B88840)' },
        { cat: 'Flooring', name: 'Concrete (Polished)', desc: 'Industrial-style polished concrete with sealed finish', priceMin: 2, priceMax: 6, durability: 10, maintenance: 'Low', pros: ['Ultra durable', 'Modern look', 'Low maintenance'], cons: ['Cold', 'Hard', 'Can crack'], swatch: 'linear-gradient(135deg,#888,#999,#AAA)' },
        { cat: 'Flooring', name: 'Slate Tile', desc: 'Natural stone with rich dark tones and texture', priceMin: 5, priceMax: 15, durability: 9, maintenance: 'Medium', pros: ['Unique texture', 'Durable', 'Natural'], cons: ['Uneven surface', 'Heavy'], swatch: 'linear-gradient(135deg,#4A4A4A,#5A5A5A,#3A3A3A)' },
        { cat: 'Flooring', name: 'Terrazzo', desc: 'Composite material with marble chips in cement', priceMin: 15, priceMax: 40, durability: 10, maintenance: 'Low', pros: ['Stunning patterns', '75+ year lifespan'], cons: ['Very expensive', 'Needs professional install'], swatch: 'linear-gradient(135deg,#E0DDD8,#D0CDC8,#C8C5C0)' },
        // COUNTERTOPS
        { cat: 'Countertops', name: 'Quartz (Engineered)', desc: 'Non-porous engineered stone — most popular choice', priceMin: 40, priceMax: 100, durability: 9, maintenance: 'Low', pros: ['Non-porous', 'Low maintenance', 'Many colors'], cons: ['Not heat resistant', 'Seams visible'], swatch: 'linear-gradient(135deg,#E8E4E0,#F0ECE8,#D8D4D0)', popular: true },
        { cat: 'Countertops', name: 'Granite', desc: 'Natural stone with unique crystal patterns', priceMin: 35, priceMax: 85, durability: 9, maintenance: 'Medium', pros: ['Heat resistant', 'Unique', 'Adds value'], cons: ['Needs sealing', 'Can chip'], swatch: 'linear-gradient(135deg,#6B6358,#7A7068,#8B8078)' },
        { cat: 'Countertops', name: 'Marble (Carrara)', desc: 'Classic Italian marble with soft grey veining', priceMin: 50, priceMax: 150, durability: 6, maintenance: 'High', pros: ['Stunning luxury', 'Timeless', 'Cool surface'], cons: ['Stains easily', 'Expensive', 'Etches'], swatch: 'linear-gradient(135deg,#F0EDE8,#E8E4DF,#F5F2ED)' },
        { cat: 'Countertops', name: 'Butcher Block', desc: 'Solid hardwood surface — warm and functional', priceMin: 20, priceMax: 60, durability: 6, maintenance: 'High', pros: ['Warm look', 'DIY-friendly', 'Repairable'], cons: ['Scratches', 'Needs oiling', 'Bacteria risk'], swatch: 'linear-gradient(135deg,#B8860B,#C89818,#A87808)' },
        { cat: 'Countertops', name: 'Laminate', desc: 'Budget synthetic with photographic surface layer', priceMin: 10, priceMax: 30, durability: 5, maintenance: 'Low', pros: ['Very affordable', 'Many patterns', 'Easy install'], cons: ['Can chip', 'Heat damage risk', 'Low resale'], swatch: 'linear-gradient(135deg,#D0C8C0,#E0D8D0,#C8C0B8)' },
        { cat: 'Countertops', name: 'Soapstone', desc: 'Natural stone with silky matte finish that darkens with age', priceMin: 40, priceMax: 100, durability: 8, maintenance: 'Low', pros: ['Heat resistant', 'Develops patina', 'Non-porous'], cons: ['Limited colors', 'Can scratch'], swatch: 'linear-gradient(135deg,#5A5A5A,#6A6A6A,#4A4A4A)' },
        { cat: 'Countertops', name: 'Concrete', desc: 'Custom-poured concrete — industrial-modern aesthetic', priceMin: 65, priceMax: 135, durability: 7, maintenance: 'High', pros: ['Custom shapes', 'Modern look', 'Unique'], cons: ['Can crack', 'Needs sealing', 'Heavy'], swatch: 'linear-gradient(135deg,#999,#AAA,#888)' },
        { cat: 'Countertops', name: 'Porcelain Slab', desc: 'Large-format porcelain — marble look without the maintenance', priceMin: 30, priceMax: 80, durability: 10, maintenance: 'Low', pros: ['Ultra durable', 'Stain proof', 'Heat resistant'], cons: ['Brittle edges', 'Premium price'], swatch: 'linear-gradient(135deg,#E8E4E0,#F0ECE8,#E0DCD8)' },
        // PAINT
        { cat: 'Paint', name: 'Benjamin Moore Regal', desc: 'Premium interior paint with excellent coverage', priceMin: 50, priceMax: 70, durability: 8, maintenance: 'Low', pros: ['Self-leveling', 'Rich color', 'Washable'], cons: ['Premium price'], swatch: 'linear-gradient(135deg,#3498DB,#2980B9,#5DADE2)', popular: true },
        { cat: 'Paint', name: 'Sherwin-Williams Duration', desc: 'One-coat coverage interior latex', priceMin: 60, priceMax: 80, durability: 9, maintenance: 'Low', pros: ['One-coat coverage', 'Antimicrobial', 'Durable'], cons: ['Expensive', 'Limited stores'], swatch: 'linear-gradient(135deg,#27AE60,#2ECC71,#1E8449)' },
        { cat: 'Paint', name: 'Behr Premium Plus', desc: 'Great value zero-VOC interior paint', priceMin: 30, priceMax: 40, durability: 7, maintenance: 'Low', pros: ['Affordable', 'Zero VOC', 'Good coverage'], cons: ['May need 2 coats'], swatch: 'linear-gradient(135deg,#E74C3C,#C0392B,#F1948A)' },
        { cat: 'Paint', name: 'Farrow & Ball Estate', desc: 'Ultra-premium British paint with rich pigments', priceMin: 100, priceMax: 130, durability: 7, maintenance: 'Medium', pros: ['Exceptional color depth', 'Eco-friendly', 'Iconic'], cons: ['Very expensive', 'Less durable'], swatch: 'linear-gradient(135deg,#1B2A4A,#2C3E50,#34495E)' },
        { cat: 'Paint', name: 'Chalk Paint (Annie Sloan)', desc: 'Matte finish decorative paint for furniture', priceMin: 35, priceMax: 50, durability: 5, maintenance: 'Medium', pros: ['No prep needed', 'Distressed look', 'Easy'], cons: ['Needs wax seal', 'Not for walls'], swatch: 'linear-gradient(135deg,#BDC3C7,#D5DBDB,#A6ACAF)' },
        { cat: 'Paint', name: 'Lime Wash', desc: 'Ancient technique creating beautiful cloudy depth', priceMin: 40, priceMax: 70, durability: 6, maintenance: 'Medium', pros: ['Unique texture', 'Breathable', 'Natural'], cons: ['Technique needed', 'Limited colors'], swatch: 'linear-gradient(135deg,#F5F0E8,#EBE5D9,#E0D8CB)' },
        // TILES
        { cat: 'Tiles', name: 'Subway Tile (Ceramic)', desc: 'Classic 3x6 rectangular tile — timeless backsplash choice', priceMin: 1, priceMax: 5, durability: 8, maintenance: 'Low', pros: ['Timeless', 'Affordable', 'Easy to clean'], cons: ['Grout maintenance', 'Common'], swatch: 'linear-gradient(135deg,#FFF,#F5F5F5,#E8E8E8)', popular: true },
        { cat: 'Tiles', name: 'Hexagon Mosaic', desc: 'Small hexagonal tiles for floors and walls', priceMin: 5, priceMax: 15, durability: 8, maintenance: 'Medium', pros: ['Trendy', 'Versatile', 'Slip-resistant'], cons: ['Lots of grout', 'Hard to install'], swatch: 'linear-gradient(135deg,#E0E0E0,#D0D0D0,#F0F0F0)' },
        { cat: 'Tiles', name: 'Zellige (Moroccan)', desc: 'Handmade terracotta tiles with glazed imperfections', priceMin: 10, priceMax: 30, durability: 7, maintenance: 'Medium', pros: ['Artisan quality', 'Unique variations', 'Stunning'], cons: ['Expensive', 'Imperfect edges'], swatch: 'linear-gradient(135deg,#2980B9,#3498DB,#1ABC9C)' },
        { cat: 'Tiles', name: 'Terrazzo Tile', desc: 'Composite chips in cement — retro-modern pattern', priceMin: 8, priceMax: 20, durability: 9, maintenance: 'Low', pros: ['Trendy', 'Durable', 'Low maintenance'], cons: ['Pricey', 'Limited DIY'], swatch: 'linear-gradient(135deg,#F0EDE8,#E8E5E0,#E0DDD8)' },
        { cat: 'Tiles', name: 'Large Format Porcelain', desc: '24x24 or larger tiles for seamless modern look', priceMin: 5, priceMax: 15, durability: 10, maintenance: 'Low', pros: ['Less grout', 'Modern', 'Easy clean'], cons: ['Heavy', 'Needs flat surface'], swatch: 'linear-gradient(135deg,#D8D8D8,#E8E8E8,#C8C8C8)' },
        { cat: 'Tiles', name: 'Natural Stone Mosaic', desc: 'Small-cut natural stone pieces in mesh-backed sheets', priceMin: 10, priceMax: 35, durability: 8, maintenance: 'High', pros: ['Luxury look', 'Natural variations'], cons: ['Needs sealing', 'Expensive'], swatch: 'linear-gradient(135deg,#C8B078,#B8A068,#D8C088)' },
        // FIXTURES
        { cat: 'Fixtures', name: 'Matte Black Faucet', desc: 'Modern single-handle pull-down kitchen faucet', priceMin: 150, priceMax: 400, durability: 8, maintenance: 'Medium', pros: ['Trendy look', 'Fingerprint resistant'], cons: ['Shows water spots', 'Style may date'], swatch: 'linear-gradient(135deg,#1a1a1a,#333,#2a2a2a)', popular: true },
        { cat: 'Fixtures', name: 'Brushed Nickel Faucet', desc: 'Classic neutral finish that works with any style', priceMin: 100, priceMax: 350, durability: 9, maintenance: 'Low', pros: ['Versatile', 'Hides water spots', 'Durable'], cons: ['Common'], swatch: 'linear-gradient(135deg,#C0C0C0,#D0D0D0,#B0B0B0)' },
        { cat: 'Fixtures', name: 'Brass/Gold Faucet', desc: 'Warm metallic finish for luxury or vintage looks', priceMin: 200, priceMax: 600, durability: 7, maintenance: 'High', pros: ['Luxurious', 'Statement piece'], cons: ['Tarnishes', 'Expensive'], swatch: 'linear-gradient(135deg,#D4AF37,#C8A430,#E8C547)' },
        { cat: 'Fixtures', name: 'Frameless Glass Shower', desc: 'Modern walk-in shower enclosure with clear glass', priceMin: 800, priceMax: 2500, durability: 9, maintenance: 'Medium', pros: ['Opens up space', 'Modern', 'Luxury'], cons: ['Expensive', 'Shows water stains'], swatch: 'linear-gradient(135deg,#E8F4FD,#D6EAF8,#C8E0F0)' },
        { cat: 'Fixtures', name: 'Rainfall Showerhead', desc: '12-inch ceiling-mounted rainfall experience', priceMin: 80, priceMax: 300, durability: 8, maintenance: 'Low', pros: ['Relaxing', 'Modern look', 'Easy install'], cons: ['Less water pressure', 'Uses more water'], swatch: 'linear-gradient(135deg,#CCC,#DDD,#BBB)' },
        { cat: 'Fixtures', name: 'LED Vanity Mirror', desc: 'Backlit mirror with anti-fog and dimming features', priceMin: 100, priceMax: 500, durability: 8, maintenance: 'Low', pros: ['Great lighting', 'Anti-fog', 'Modern'], cons: ['Needs electrical', 'LED lifespan'], swatch: 'linear-gradient(135deg,#E8F4FD,#FFF,#E0ECF5)' },
        // HARDWARE
        { cat: 'Hardware', name: 'Cabinet Pulls (Matte Black)', desc: 'Modern T-bar pulls for kitchen/bath cabinets', priceMin: 3, priceMax: 12, durability: 9, maintenance: 'Low', pros: ['Modern look', 'Affordable update', 'Easy DIY'], cons: ['Drilling required'], swatch: 'linear-gradient(135deg,#222,#333,#444)', popular: true },
        { cat: 'Hardware', name: 'Cabinet Knobs (Brass)', desc: 'Warm gold-tone round knobs for drawers', priceMin: 4, priceMax: 15, durability: 8, maintenance: 'Medium', pros: ['Warm accent', 'Classic look'], cons: ['Can tarnish', 'Less grip'], swatch: 'linear-gradient(135deg,#D4AF37,#B8960B,#E8C547)' },
        { cat: 'Hardware', name: 'Hidden Cabinet Hinges', desc: 'Self-closing concealed hinges for clean lines', priceMin: 2, priceMax: 8, durability: 9, maintenance: 'Low', pros: ['Clean look', 'Self-closing', 'Durable'], cons: ['Adjustment needed'], swatch: 'linear-gradient(135deg,#AAA,#CCC,#999)' },
        { cat: 'Hardware', name: 'Drawer Slides (Soft-Close)', desc: 'Full-extension slides with soft-closing mechanism', priceMin: 15, priceMax: 40, durability: 9, maintenance: 'Low', pros: ['No slamming', 'Full access', 'Premium feel'], cons: ['Professional install'], swatch: 'linear-gradient(135deg,#BBB,#DDD,#999)' },
        // LIGHTING
        { cat: 'Lighting', name: 'Recessed LED Downlight', desc: '6-inch slim profile ceiling downlight (dimmable)', priceMin: 15, priceMax: 50, durability: 9, maintenance: 'Low', pros: ['Clean ceiling', 'Energy efficient', 'Dimmable'], cons: ['Installation cost', 'Less character'], swatch: 'linear-gradient(135deg,#FFF3B0,#FFE680,#FFF8D5)', popular: true },
        { cat: 'Lighting', name: 'Pendant Light (Globe)', desc: 'Glass globe pendant for kitchen islands and dining', priceMin: 50, priceMax: 200, durability: 7, maintenance: 'Medium', pros: ['Statement piece', 'Versatile'], cons: ['Cleaning glass', 'Height clearance'], swatch: 'linear-gradient(135deg,#FFF8E7,#F5EFD5,#FFF3B0)' },
        { cat: 'Lighting', name: 'LED Strip Lights', desc: 'Flexible RGB strips for under-cabinet and accent lighting', priceMin: 10, priceMax: 40, durability: 8, maintenance: 'Low', pros: ['Versatile', 'Affordable', 'Color options'], cons: ['Can look cheap', 'Adhesive fails'], swatch: 'linear-gradient(90deg,#FF0000,#00FF00,#0000FF)' },
        { cat: 'Lighting', name: 'Wall Sconce (Industrial)', desc: 'Exposed bulb wall fixture with metal cage', priceMin: 30, priceMax: 100, durability: 8, maintenance: 'Low', pros: ['Character', 'Space saving', 'Ambient'], cons: ['Wiring needed'], swatch: 'linear-gradient(135deg,#444,#666,#555)' },
        { cat: 'Lighting', name: 'Chandelier (Modern)', desc: 'Multi-arm contemporary chandelier with LED bulbs', priceMin: 150, priceMax: 800, durability: 8, maintenance: 'Medium', pros: ['Statement piece', 'Luxury feel'], cons: ['Expensive', 'Cleaning', 'Weight'], swatch: 'linear-gradient(135deg,#D4AF37,#C0C0C0,#D4AF37)' },
        { cat: 'Lighting', name: 'Smart Bulb (Philips Hue)', desc: 'WiFi-connected color-changing LED bulbs', priceMin: 12, priceMax: 50, durability: 8, maintenance: 'Low', pros: ['Color options', 'Voice control', 'Scheduling'], cons: ['Needs hub', 'Expensive per bulb'], swatch: 'linear-gradient(135deg,#FF6B6B,#FFA500,#FFD700,#48BB78,#4A9EFF,#9B59B6)' },
    ];

    function init(containerId, appState) {
        const container = document.getElementById(containerId);
        if (!container) return;
        let filtered = [...materials], searchQ = '', filterCat = 'All', sortBy = 'name';
        const categories = ['All', ...new Set(materials.map(m => m.cat))];

        function render() {
            let list = [...materials];
            if (searchQ) list = list.filter(m => (m.name + m.desc + m.cat).toLowerCase().includes(searchQ));
            if (filterCat !== 'All') list = list.filter(m => m.cat === filterCat);
            if (sortBy === 'price') list.sort((a, b) => a.priceMin - b.priceMin);
            else if (sortBy === 'durability') list.sort((a, b) => b.durability - a.durability);
            else if (sortBy === 'popular') list = list.filter(m => m.popular).concat(list.filter(m => !m.popular));
            else list.sort((a, b) => a.name.localeCompare(b.name));
            filtered = list;

            const sym = (appState && appState.symbol) || '$';
            container.innerHTML = `
        <div class="ml-header">
          <div class="ml-search-row">
            <input type="text" class="ml-search" id="mlSearch" placeholder="🔍 Search materials..." value="${searchQ}">
            <select class="ml-sort" id="mlSort">
              <option value="name" ${sortBy === 'name' ? 'selected' : ''}>Sort: Name</option>
              <option value="price" ${sortBy === 'price' ? 'selected' : ''}>Sort: Price ↑</option>
              <option value="durability" ${sortBy === 'durability' ? 'selected' : ''}>Sort: Durability ↓</option>
              <option value="popular" ${sortBy === 'popular' ? 'selected' : ''}>Sort: Popular First</option>
            </select>
          </div>
          <div class="ml-filters" id="mlFilters">
            ${categories.map(c => `<button class="ml-filter-btn ${c === filterCat ? 'active' : ''}" data-cat="${c}">${c}</button>`).join('')}
          </div>
          <div class="ml-count">${filtered.length} materials found</div>
        </div>
        <div class="ml-grid">
          ${filtered.map((m, i) => `
            <div class="ml-card ${m.popular ? 'popular' : ''}">
              <div class="ml-swatch" style="background:${m.swatch};">${m.popular ? '<span class="ml-popular-badge">⭐ Popular</span>' : ''}</div>
              <div class="ml-card-body">
                <div class="ml-card-cat">${m.cat}</div>
                <h4 class="ml-card-name">${m.name}</h4>
                <p class="ml-card-desc">${m.desc}</p>
                <div class="ml-card-meta">
                  <span class="ml-price">${sym}${m.priceMin} – ${sym}${m.priceMax}<small>/sqft</small></span>
                  <span class="ml-durability">${'★'.repeat(Math.round(m.durability / 2))}${'☆'.repeat(5 - Math.round(m.durability / 2))}</span>
                </div>
                <div class="ml-card-tags">
                  <span class="ml-tag maintenance">🔧 ${m.maintenance}</span>
                  ${m.pros.slice(0, 2).map(p => `<span class="ml-tag pro">✅ ${p}</span>`).join('')}
                </div>
                <button class="ml-compare-btn" data-idx="${i}">Compare</button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="ml-compare-modal" id="mlCompareModal" style="display:none;"></div>
      `;
            // Events
            document.getElementById('mlSearch').addEventListener('input', e => { searchQ = e.target.value.toLowerCase(); render(); });
            document.getElementById('mlSort').addEventListener('change', e => { sortBy = e.target.value; render(); });
            document.querySelectorAll('.ml-filter-btn').forEach(btn => {
                btn.addEventListener('click', () => { filterCat = btn.dataset.cat; render(); });
            });
            document.querySelectorAll('.ml-compare-btn').forEach(btn => {
                btn.addEventListener('click', () => { showCompare(parseInt(btn.dataset.idx)); });
            });
        }

        function showCompare(idx) {
            const m = filtered[idx]; if (!m) return;
            const similar = materials.filter(x => x.cat === m.cat && x.name !== m.name).slice(0, 2);
            const all = [m, ...similar];
            const sym = (appState && appState.symbol) || '$';
            const modal = document.getElementById('mlCompareModal');
            modal.style.display = 'flex';
            modal.innerHTML = `
        <div class="ml-compare-content">
          <div class="ml-compare-header"><h3>📊 Material Comparison</h3><button class="ml-compare-close" id="mlCompareClose">✕</button></div>
          <div class="ml-compare-grid">
            ${all.map(x => `
              <div class="ml-compare-col">
                <div class="ml-swatch" style="background:${x.swatch};height:60px;border-radius:8px;margin-bottom:12px;"></div>
                <h4>${x.name}</h4>
                <p style="font-size:0.85rem;color:var(--text-muted);">${x.desc}</p>
                <div class="ml-compare-row"><span>Price</span><strong>${sym}${x.priceMin}–${sym}${x.priceMax}/sqft</strong></div>
                <div class="ml-compare-row"><span>Durability</span><strong>${x.durability}/10</strong></div>
                <div class="ml-compare-row"><span>Maintenance</span><strong>${x.maintenance}</strong></div>
                <div style="margin-top:8px;">${x.pros.map(p => `<div style="color:#10B981;font-size:0.8rem;">✅ ${p}</div>`).join('')}</div>
                <div>${x.cons.map(c => `<div style="color:#EF4444;font-size:0.8rem;">❌ ${c}</div>`).join('')}</div>
              </div>
            `).join('')}
          </div>
        </div>`;
            document.getElementById('mlCompareClose').addEventListener('click', () => { modal.style.display = 'none'; });
            modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
        }

        render();
    }

    return { init, materials };
})();
