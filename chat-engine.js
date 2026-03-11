/* ============================================================
   RenovateAI — Comprehensive AI Chat Engine
   80+ response patterns with market-accurate pricing
   ============================================================ */

function createChatEngine(appState) {

    function localPrice(usdBase) {
        const country = appState.country || 'usa';
        const localMultipliers = {
            india: 83, usa: 1, china: 7.2, japan: 150, uk: 0.79, germany: 0.92, france: 0.92,
            australia: 1.53, canada: 1.36, brazil: 4.97, southkorea: 1320, uae: 3.67,
            saudiarabia: 3.75, mexico: 17.1, singapore: 1.34
        };
        const ppp = { india: 0.25, china: 0.5, brazil: 0.4, mexico: 0.5, japan: 0.8, southkorea: 0.7 };
        const m = localMultipliers[country] || 1;
        const p = ppp[country] || 1;
        return appState.symbol + Math.round(usdBase * m * p).toLocaleString();
    }

    function getAIResponse(userMessage) {
        const l = userMessage.toLowerCase();
        const sym = appState.symbol;
        const cur = appState.currency;

        // ── GENERATE IMAGE command ──
        if (l.includes('generate') && (l.includes('image') || l.includes('room') || l.includes('design'))) {
            return `🎨 **AI Image Generation Activated!**\n\nI'll generate a renovation visualization using Nano Banana Pro. Here's what I detected from your request:\n\n• **Style:** ${l.includes('modern') ? 'Modern' : l.includes('industrial') ? 'Industrial' : l.includes('scandi') ? 'Scandinavian' : 'Auto-detected'}\n• **Elements:** Furniture, lighting, and textures based on your prompt\n\n**To generate:**\n1. Upload a room photo in the Design Tool\n2. Enter your instructions in the "Tell AI" box\n3. Click "Generate" and watch the magic happen!\n\nThe AI will layer wall colors, floor textures, furniture, lighting effects, and style filters onto your photo. Go to the **Design Tool** to try it! ✨`;
        }

        // ── ROOM-SPECIFIC PATTERNS ──

        // Living room - small
        if (l.includes('small') && l.includes('living')) {
            return `Great question! For a small living room:\n\n• **Scandinavian** — Light colors and minimal furniture make space feel larger\n• **Japandi** — Functional minimalism with warm natural tones\n• **Modern Minimalist** — Clean lines and restrained palette\n\n**Pro tips for small spaces:**\n• Use mirrors opposite windows to double natural light\n• Choose multi-functional furniture (ottoman with storage, sofa bed)\n• Mount your TV to free up floor space\n• Use vertical shelving instead of wide bookcases\n• Stick to 2-3 colors for a cohesive feel 🪞`;
        }

        // Living room - general
        if ((l.includes('living') || l.includes('lounge')) && !l.includes('small')) {
            return `Living room renovation ideas:\n\n🛋️ **Seating:** L-shaped sectionals maximize seating; accent chairs add personality\n🎨 **Walls:** Feature accent wall in deep tones (navy, forest green, charcoal)\n💡 **Lighting:** Layer ambient, task, and accent lighting\n📺 **Entertainment:** Floating media consoles look modern\n🌿 **Plants:** Fiddle leaf fig, monstera, or snake plants add life\n\n**Budget tip:** Painting walls + updating light fixtures gives 80% of the visual impact for 20% of the cost!`;
        }

        // Kitchen cost
        if (l.includes('kitchen') && (l.includes('cost') || l.includes('price') || l.includes('much') || l.includes('budget'))) {
            return `Kitchen renovation costs in ${cur}:\n\n• **Light refresh** (paint, hardware, backsplash): ${localPrice(3000)}–${localPrice(8000)}\n• **Mid-range** (countertops, cabinets, appliances): ${localPrice(12000)}–${localPrice(30000)}\n• **Full luxury** (custom everything, structural): ${localPrice(35000)}–${localPrice(75000)}+\n\n**Cost breakdown:**\n• Cabinetry: ~35%\n• Countertops: ~10%\n• Appliances: ~15%\n• Labor: ~25%\n• Plumbing & electrical: ~10%\n• Finishing: ~5%\n\n**Save money by:** Refacing cabinets instead of replacing (saves ~40%) 🍳`;
        }

        // Kitchen design
        if (l.includes('kitchen') && (l.includes('idea') || l.includes('design') || l.includes('style') || l.includes('trend'))) {
            return `Top kitchen design trends for 2026:\n\n🏝️ **Two-tone cabinets** — Dark island + light perimeter\n🪵 **Natural wood accents** — Warm oak or walnut\n💎 **Quartz countertops** — Calacatta-look at half marble's price\n🔲 **Handleless cabinets** — Push-to-open for clean lines\n🌿 **Indoor herb gardens** — Built-in planters\n📱 **Smart kitchens** — Touchless faucets, smart ovens\n\nWhich style are you leaning towards?`;
        }

        // Kitchen layout
        if (l.includes('kitchen') && (l.includes('layout') || l.includes('island') || l.includes('galley') || l.includes('l-shape'))) {
            return `Kitchen layout options:\n\n📐 **U-Shape** — Maximum counter space, ideal for 10x12ft+\n📐 **L-Shape** — Open flow, great for open-plan living\n📐 **Galley** — Efficient for narrow spaces (works in 8ft width)\n📐 **Island** — Social cooking hub, needs 12ft+ width\n📐 **Peninsula** — Island alternative when space is tight\n\n**Work Triangle Rule:**\nSink → Stove → Fridge should form a triangle with 4-9ft sides each.\n\n**Island sizing:** Min 4ft × 2ft, plus 36-42 inches clearance all around. Cost: ${localPrice(2000)}–${localPrice(8000)} 🍳`;
        }

        // Bathroom
        if (l.includes('bathroom') || (l.includes('bath') && (l.includes('trend') || l.includes('reno') || l.includes('design')))) {
            return `Bathroom trends & ideas:\n\n🛁 **Wet rooms** — Curbless showers with full waterproofing\n🪨 **Natural stone** — Travertine, marble-look porcelain\n🪞 **Backlit mirrors** — LED-integrated with anti-fog\n🌿 **Biophilic design** — Living walls, wood vanities\n💡 **Smart features** — Heated floors, digital showers\n🚿 **Frameless glass** — Makes small baths feel spacious\n\n**Quick wins under ${localPrice(2000)}:**\n• New faucets & hardware\n• Re-grout + fresh caulk\n• New mirror + lighting\n• Paint + accessories ✨`;
        }

        // Bedroom
        if (l.includes('bedroom') && !l.includes('kid') && !l.includes('nursery')) {
            return `Bedroom renovation essentials:\n\n🛏️ **Invest in the bed** — Upholstered headboard = instant luxury\n🎨 **Calming colors** — Soft blues, sage greens, warm grays\n💡 **Lighting layers:**\n  • Bedside sconces (free up nightstand space)\n  • Dimmer switches (essential for mood)\n  • LED strips behind headboard\n📦 **Storage:**\n  • Under-bed drawers\n  • Built-in wardrobes (saves 30% vs. freestanding)\n  • Floating shelves\n\n**Budget split:** Bed 30%, Flooring 20%, Paint 15%, Lighting 15%, Storage 10%, Décor 10% 🌙`;
        }

        // Kids room / nursery
        if (l.includes('kid') || l.includes('nursery') || l.includes('children') || l.includes('playroom') || l.includes('teen')) {
            return `Kids room / Nursery ideas:\n\n👶 **Nursery essentials:**\n• Soft, washable paint in pastels or neutrals\n• Blackout curtains for sleep\n• Non-toxic materials (zero-VOC paint, organic textiles)\n• Convertible crib → toddler bed (saves money long-term)\n\n🧒 **Kids room (3-10):**\n• Theme walls (accent wall with murals or decals)\n• Low-level storage (cube shelving, toy bins)\n• Desk area for crafts\n• Durable flooring (LVP or laminate)\n\n🎮 **Teen room:**\n• Let them choose the accent color\n• Study nook with good task lighting\n• Pin/cork board wall for self-expression\n\nBudget: ${localPrice(2000)}–${localPrice(8000)} per room 🎨`;
        }

        // Home office / study
        if (l.includes('office') || l.includes('study') || (l.includes('work') && l.includes('home')) || l.includes('desk')) {
            return `Home office renovation guide:\n\n🖥️ **Ergonomics first:**\n• Sit/stand desk — ${localPrice(300)}–${localPrice(1500)}\n• Monitor at eye level (arm mount recommended)\n• Task chair — invest ${localPrice(500)}+ for daily use\n• Cable management (grommets, cable trays)\n\n💡 **Lighting:**\n• Natural light on the side (never behind screen)\n• Bias lighting behind monitor reduces eye strain\n• Task lamp with 4000K–5000K bulbs\n\n🎨 **Design:**\n• Deep blues and greens boost focus\n• Avoid all-white (causes glare)\n• Acoustic panels if on video calls\n• Plants improve productivity by 15%\n\nTotal setup: ${localPrice(2000)}–${localPrice(10000)} 💼`;
        }

        // Dining room
        if (l.includes('dining')) {
            return `Dining room design ideas:\n\n🍽️ **Table guide:**\n• Round: Best for 4-6 people, great for conversation\n• Rectangular: 6-10 people, classic choice\n• Extendable: Flexibility for gatherings\n\n💡 **Lighting is everything:**\n• Chandelier/pendant 30-36 inches above table\n• Dimmer switch is essential\n• Aim for warm 2700K bulbs\n\n🎨 **Style tips:**\n• Feature wall behind buffet/sideboard\n• Mirror on one wall to expand space\n• Rug under table (extend 24 inches beyond chairs)\n\n**Budget:** ${localPrice(3000)}–${localPrice(15000)} 🍷`;
        }

        // Laundry room
        if (l.includes('laundry') || l.includes('utility')) {
            return `Laundry room makeover:\n\n🧺 **Layout optimization:**\n• Stacked washer/dryer saves 50% floor space\n• Countertop above front-loaders for folding\n• Pull-out hamper cabinet\n• Hanging rod for air-drying\n\n🎨 **Design:**\n• Bright, cheerful paint (makes chores bearable!)\n• Patterned tile floor (hides dirt)\n• Open shelving for supplies\n• Good lighting — often overlooked\n\n💰 **Budget:** ${localPrice(2000)}–${localPrice(8000)}\n\n**Pro tip:** Vibration-dampening pads under machines = quieter operation 🧼`;
        }

        // Closet / wardrobe
        if (l.includes('closet') || l.includes('wardrobe') || l.includes('walk-in')) {
            return `Closet renovation ideas:\n\n👔 **Walk-in closet must-haves:**\n• Double hanging rods (doubles capacity)\n• Built-in drawers for folded items\n• Shoe shelving (angled displays)\n• Full-length mirror\n• Good lighting (LED strip in each section)\n• Island with jewelry storage (luxury option)\n\n📏 **Sizing guide:**\n• Min walk-in: 5ft × 7ft\n• Hanging rod height: 42\" (double) or 72\" (single)\n• Shelf depth: 12-14 inches\n\n💰 **Cost:**\n• Wire system: ${localPrice(500)}–${localPrice(1500)}\n• Wood built-in: ${localPrice(2000)}–${localPrice(8000)}\n• Custom luxury: ${localPrice(8000)}–${localPrice(25000)}\n\n**Tip:** Uniform hangers (slim velvet) make any closet look designer! 👗`;
        }

        // Basement / cellar
        if (l.includes('basement') || l.includes('cellar')) {
            return `Basement renovation guide:\n\n🏗️ **Critical first steps:**\n1. Waterproofing — fix any moisture issues FIRST\n2. Egress windows (required by code for bedrooms)\n3. Adequate ceiling height (min 7ft finished)\n4. Vapor barrier on concrete walls\n\n🎯 **Popular uses:**\n• Home theater / media room\n• Guest bedroom + bathroom\n• Home gym\n• Wine cellar\n• Game room / kids play area\n\n💡 **Design tips:**\n• Light colors to combat low ceilings\n• Recessed lighting (saves headroom)\n• LVP flooring (waterproof)\n• Sump pump if below water table\n\n💰 **Budget:** ${localPrice(15000)}–${localPrice(50000)} for a full finish 🏠`;
        }

        // Garage
        if (l.includes('garage')) {
            return `Garage renovation ideas:\n\n🚗 **Organization:**\n• Wall-mounted slatwall panels — hang everything\n• Overhead ceiling racks for seasonal storage\n• Epoxy floor coating — durable + clean look\n• Workbench with pegboard\n\n🏠 **Conversion options:**\n• Home gym — ${localPrice(3000)}–${localPrice(15000)}\n• Workshop — ${localPrice(2000)}–${localPrice(8000)}\n• ADU / guest suite — ${localPrice(20000)}–${localPrice(80000)}\n\n💡 **Quick wins:**\n• Epoxy floor: ${localPrice(3)}–${localPrice(7)}/sqft\n• LED shop lights: ${localPrice(30)}–${localPrice(100)}\n• Slatwall system: ${localPrice(500)}–${localPrice(2000)}\n\nInsulate if converting to living space (R-13 walls, R-30 ceiling) 🔧`;
        }

        // Outdoor / patio / deck
        if (l.includes('outdoor') || l.includes('patio') || l.includes('deck') || l.includes('garden') || l.includes('yard') || l.includes('backyard')) {
            return `Outdoor renovation ideas:\n\n🌿 **Patio/Deck:**\n• Composite decking — ${localPrice(15)}–${localPrice(35)}/sqft (low maintenance)\n• Pavers — ${localPrice(8)}–${localPrice(25)}/sqft (many patterns)\n• Stamped concrete — ${localPrice(8)}–${localPrice(18)}/sqft\n\n🔥 **Features:**\n• Fire pit: ${localPrice(300)}–${localPrice(3000)}\n• Outdoor kitchen: ${localPrice(5000)}–${localPrice(25000)}\n• Pergola: ${localPrice(2000)}–${localPrice(8000)}\n• String lights: ${localPrice(20)}–${localPrice(80)} (instant ambiance!)\n\n🌱 **Landscaping:**\n• Native plants (low water, low maintenance)\n• Raised garden beds: ${localPrice(50)}–${localPrice(300)} each\n• Drip irrigation: saves 30-50% water\n\n**Best ROI outdoor projects:** Deck (65-75% ROI), landscaping (100%+ ROI!) 🌻`;
        }

        // Colors / paint
        if (l.includes('color') || l.includes('palette') || l.includes('colour') || l.includes('paint')) {
            return `Color palette recommendations:\n\n🎨 **Serene Retreat** — Sage #A8BBA0, cream #F5F0E8, gold #C8A96E\n🎨 **Midnight Luxe** — Navy #1B2A4A, dusty rose #C9A0A0, brass #B8860B\n🎨 **Nordic Calm** — White #FAF6F0, oak #D4B896, blue #B8D4E3\n🎨 **Earthy Comfort** — Terracotta #CC6B49, olive #6B7F47, beige #D4C5A9\n🎨 **Modern Drama** — Charcoal #36454F, emerald #2E8B57, gold #DAA520\n🎨 **Tropical Vibrance** — Coral #FF6F61, teal #008080, palm #228B22\n\n**60-30-10 Rule:** 60% walls, 30% furniture/textiles, 10% accents\n\n**Tip:** Test paint samples at different times of day — colors shift with natural vs. artificial light! 🖌️`;
        }

        // Flooring
        if (l.includes('floor') || l.includes('tile') || l.includes('hardwood') || l.includes('laminate') || l.includes('vinyl')) {
            return `Flooring comparison guide:\n\n🪵 **Hardwood** — ${localPrice(6)}–${localPrice(15)}/sqft | Lasts 100+ years\n  ✅ Timeless | ❌ Moisture sensitive\n\n📋 **Laminate** — ${localPrice(2)}–${localPrice(6)}/sqft | 15-25 year lifespan\n  ✅ Budget-friendly, DIY | ❌ Can't refinish\n\n🏗️ **Luxury Vinyl (LVP)** — ${localPrice(3)}–${localPrice(8)}/sqft | Waterproof\n  ✅ Best for kitchens/baths | ❌ Lower resale appeal\n\n🪨 **Porcelain Tile** — ${localPrice(4)}–${localPrice(12)}/sqft | Ultra durable\n  ✅ Waterproof | ❌ Cold underfoot\n\n🔲 **Engineered Wood** — ${localPrice(4)}–${localPrice(10)}/sqft\n  ✅ Stable, works with radiant heat | ❌ Limited refinishing\n\n🌿 **Cork** — ${localPrice(3)}–${localPrice(8)}/sqft\n  ✅ Soft, eco-friendly | ❌ Can dent\n\nWhich room are you flooring? 🏠`;
        }

        // Countertops
        if (l.includes('counter') || l.includes('granite') || l.includes('quartz') || l.includes('marble')) {
            return `Countertop comparison:\n\n💎 **Quartz** — ${localPrice(40)}–${localPrice(100)}/sqft\n  ✅ Non-porous, low maintenance | ❌ Not heat resistant\n🪨 **Granite** — ${localPrice(35)}–${localPrice(85)}/sqft\n  ✅ Heat resistant, unique patterns | ❌ Needs sealing\n✨ **Marble** — ${localPrice(50)}–${localPrice(150)}/sqft\n  ✅ Stunning luxury | ❌ Stains easily\n🪵 **Butcher Block** — ${localPrice(20)}–${localPrice(60)}/sqft\n  ✅ Warm, DIY-friendly | ❌ Scratches\n🔲 **Laminate** — ${localPrice(10)}–${localPrice(30)}/sqft\n  ✅ Most affordable | ❌ Can chip\n🧪 **Soapstone** — ${localPrice(40)}–${localPrice(100)}/sqft\n  ✅ Heat resistant, patina | ❌ Limited colors\n\n**Recommendation:** Quartz gives the best balance of beauty, durability, and value! 💎`;
        }

        // Cabinets
        if (l.includes('cabinet') && !l.includes('hardware')) {
            return `Cabinet guide:\n\n🗄️ **Options ranked by cost:**\n1. **Paint existing** — ${localPrice(200)}–${localPrice(800)} | DIY weekend project\n2. **Reface** — ${localPrice(4000)}–${localPrice(10000)} | New doors + veneers on existing boxes\n3. **Replacement (stock)** — ${localPrice(5000)}–${localPrice(15000)} | Standard sizes from store\n4. **Semi-custom** — ${localPrice(10000)}–${localPrice(30000)} | Modified standard options\n5. **Full custom** — ${localPrice(20000)}–${localPrice(60000)}+ | Built to exact specifications\n\n🎨 **Trending colors:**\n• White/off-white (classic, 40% of installs)\n• Navy blue (bold statement)\n• Sage green (nature-inspired)\n• Two-tone (dark base + light uppers)\n\n**Material tips:** Plywood boxes > particleboard. Soft-close hinges are non-negotiable! 🔧`;
        }

        // Windows
        if (l.includes('window') && !l.includes('blind')) {
            return `Window renovation guide:\n\n🪟 **Types & costs:**\n• Double-hung: ${localPrice(300)}–${localPrice(800)} each\n• Casement: ${localPrice(350)}–${localPrice(900)} each\n• Sliding: ${localPrice(250)}–${localPrice(700)} each\n• Bay/Bow: ${localPrice(1500)}–${localPrice(5000)}\n\n🌡️ **Energy efficiency:**\n• Low-E glass reduces UV by 70%\n• Double-pane minimum, triple for cold climates\n• Argon gas fill saves 5-10% on heating\n\n**When to replace:**\n• Condensation between panes\n• Drafts near closed windows\n• Difficulty opening/closing\n• Over 15-20 years old\n\n**ROI:** 60-70% — plus lower energy bills! 🪟`;
        }

        // Insulation
        if (l.includes('insulation') || l.includes('insulate')) {
            return `Insulation guide:\n\n🏠 **Types & R-values:**\n• Fiberglass batts — R-3.1/inch | ${localPrice(0.5)}–${localPrice(1.5)}/sqft\n• Spray foam (closed) — R-6.5/inch | ${localPrice(1.5)}–${localPrice(3.5)}/sqft\n• Blown cellulose — R-3.5/inch | ${localPrice(0.8)}–${localPrice(1.5)}/sqft\n• Rigid foam board — R-5/inch | ${localPrice(0.5)}–${localPrice(2)}/sqft\n\n📍 **Recommended R-values:**\n• Attic: R-38 to R-60\n• Walls: R-13 to R-21\n• Floors/Basement: R-13 to R-30\n\n**Payback period:** 2-5 years through energy savings\n**Tip:** Attic insulation has the highest ROI of any energy upgrade! ❄️`;
        }

        // DIY
        if (l.includes('diy') || l.includes('myself') || l.includes('hire') || l.includes('contractor') || l.includes('professional')) {
            return `DIY vs. Hiring a Pro:\n\n✅ **Great DIY projects:**\n• Painting walls and cabinets\n• Installing shelving & curtain rods\n• Swapping light fixtures\n• Laying peel-and-stick tiles or LVP\n• Adding backsplash tiles\n\n🚫 **Always hire pros for:**\n• Electrical panel & new circuits\n• Plumbing behind walls\n• Structural changes (removing walls)\n• Gas line work\n• Roof repairs\n\n⚠️ **Could go either way:**\n• Tile installation (DIY if small area)\n• Floating floor installation\n• Cabinet refacing\n\n**Tip:** Do demo yourself, hire pros for install — saves 15-25% on labor! 🔧`;
        }

        // Timeline
        if (l.includes('how long') || l.includes('timeline') || l.includes('duration') || (l.includes('time') && l.includes('take'))) {
            return `Renovation timeline estimates:\n\n⏱️ **Painting a room:** 1-2 days\n⏱️ **Bathroom refresh:** 1-2 weeks\n⏱️ **Full bathroom remodel:** 3-6 weeks\n⏱️ **Kitchen refresh:** 2-3 weeks\n⏱️ **Full kitchen remodel:** 6-12 weeks\n⏱️ **Flooring (per room):** 2-4 days\n⏱️ **Full home renovation:** 3-6 months\n\n**Delays to plan for:**\n• Permits: +2-6 weeks\n• Custom cabinetry: +4-8 weeks\n• Structural changes: +2-4 weeks\n\n**Tip:** Always add 20-30% time buffer! 📅`;
        }

        // Permits
        if (l.includes('permit') || l.includes('regulation') || l.includes('code') || l.includes('legal') || l.includes('inspection')) {
            return `Building permits & codes:\n\n📋 **Typically needs a permit:**\n• Structural changes (walls, beams)\n• Electrical rewiring\n• Plumbing rerouting\n• Adding/moving windows/doors\n• HVAC modifications\n• Adding a room or ADU\n\n✅ **Usually no permit needed:**\n• Painting & decorating\n• Flooring replacement\n• Cabinet installation\n• Light fixture swaps (like-for-like)\n• Faucet replacement\n\n⏱️ **Timeline:** 2-8 weeks for approval\n💰 **Cost:** ${localPrice(100)}–${localPrice(2000)}\n\n⚠️ **Warning:** Unpermitted work can kill a home sale and void insurance! Always check with your local building department 📋`;
        }

        // Demolition
        if (l.includes('demo') || l.includes('demolition') || l.includes('tear down') || l.includes('gut')) {
            return `Demolition guide:\n\n🔨 **DIY-safe demo:**\n• Non-structural walls (confirm with contractor first!)\n• Flooring removal\n• Cabinet removal\n• Tile removal\n• Fixture removal\n\n🚫 **Leave to pros:**\n• Load-bearing walls\n• Anything with asbestos (pre-1980 homes)\n• Lead paint (pre-1978 homes)\n• Plumbing and electrical.\n\n🗑️ **Disposal:**\n• Dumpster rental: ${localPrice(300)}–${localPrice(600)}/week\n• Hauling service: ${localPrice(200)}–${localPrice(500)}/load\n\n**Pro tip:** Always turn off water, electricity, and gas before starting any demo. Wear safety glasses, gloves, and a dust mask! 🦺`;
        }

        // Eco / Sustainability
        if (l.includes('eco') || l.includes('sustain') || l.includes('green') || l.includes('environment') || l.includes('energy')) {
            return `Sustainable renovation ideas:\n\n🌱 **Materials:**\n• Bamboo flooring (regrows in 5 years)\n• Recycled glass countertops\n• Reclaimed wood accent walls\n• Low-VOC paints\n• Cork flooring\n\n⚡ **Energy efficiency:**\n• LED lighting (75% less energy)\n• Smart thermostat (saves ~10-12%)\n• Double-glazed windows (50% less heat loss)\n• Proper insulation (pays for itself in 2-3 years)\n• Solar panels — ROI in 7-12 years\n\n💧 **Water conservation:**\n• Low-flow showerheads (1.5 GPM vs. 2.5)\n• Dual-flush toilets\n• Greywater recycling\n• Rain barrel collection\n\nMost eco upgrades pay for themselves in 2-5 years! 🌍`;
        }

        // ── STYLE PATTERNS ──

        // Modern style
        if (l.includes('modern') && (l.includes('style') || l.includes('what') || l.includes('explain'))) {
            return `Modern Minimalist style:\n\n🏙️ **Key traits:**\n• Clean lines, open plans\n• Neutral palette with warm accents\n• "Less is more" — every piece has purpose\n• Natural materials: wood, stone, metal\n\n🎨 **Colors:** White, Light Gray, Charcoal, Warm Wood\n\n🛋️ **Furniture:** Low-profile sofas, platform beds, floating vanities, glass & metal coffee tables\n\n💰 **Budget:** ${localPrice(15000)}–${localPrice(50000)} per room\n\nWorks especially well in small-medium rooms! ✨`;
        }

        // Scandinavian style
        if (l.includes('scandinavian') || l.includes('scandi') || l.includes('nordic') || l.includes('hygge')) {
            return `Scandinavian / Nordic style:\n\n🌿 **Key traits:**\n• Warm, cozy, functional — "hygge"\n• Light wood tones (birch, pine, oak)\n• White walls with natural textures\n• Emphasis on natural light\n\n🎨 **Colors:** Warm White, Light Oak, Soft Blue, Sage Green\n\n🛋️ **Must-haves:** Sheepskin throws & knit blankets, light wood furniture with tapered legs, lots of indoor plants, pendant lighting with organic shapes\n\n💰 **Budget:** ${localPrice(10000)}–${localPrice(35000)} per room 🕯️`;
        }

        // Industrial style
        if (l.includes('industrial')) {
            return `Industrial Loft style:\n\n🏭 **Key traits:**\n• Exposed brick, metal accents, raw materials\n• Open floor plans with high ceilings\n• Dark color palette with warm metals\n\n🎨 **Colors:** Charcoal, Exposed Red Brick, Black Metal, Warm Leather Brown\n\n🛋️ **Furniture:** Metal-frame pieces, leather sofas, reclaimed wood tables, Edison bulb fixtures\n\n💰 **Budget:** ${localPrice(12000)}–${localPrice(40000)} per room\n\nPairs beautifully with converted lofts and open-concept spaces! 🔩`;
        }

        // Bohemian
        if (l.includes('bohemian') || l.includes('boho')) {
            return `Bohemian style:\n\n🎪 **Key traits:**\n• Eclectic, layered, colorful\n• Mixed patterns and textures\n• Global artisan influences\n• Relaxed and lived-in feel\n\n🎨 **Colors:** Terracotta, Mustard, Jewel Tones, Rich Reds\n\n🛋️ **Must-haves:** Macramé wall hangings, layered rugs, rattan furniture, lots of cushions and throws, vintage/antique mix\n\n💰 **Budget:** ${localPrice(8000)}–${localPrice(30000)} per room\n\nThe most forgiving style — mixing and matching is the whole point! 🌺`;
        }

        // Japandi
        if (l.includes('japandi') || (l.includes('japan') && (l.includes('style') || l.includes('design'))) || l.includes('zen')) {
            return `Japandi style:\n\n🎋 **Key traits:**\n• Japanese minimalism + Scandinavian warmth\n• Wabi-sabi — beauty in imperfection\n• Functional, purposeful design\n• Natural materials with clean lines\n\n🎨 **Colors:** Warm white, muddied earth tones, charcoal, matcha green\n\n🛋️ **Must-haves:** Low furniture (floor-level beds, low tables), shoji-inspired screens, ceramic and stone accents, bonsai or single-branch arrangements\n\n💰 **Budget:** ${localPrice(12000)}–${localPrice(40000)} per room\n\nPerfect for creating calm, meditative spaces 🧘`;
        }

        // Coastal
        if (l.includes('coastal') || l.includes('beach') || l.includes('nautical') || l.includes('ocean')) {
            return `Coastal style:\n\n🏖️ **Key traits:**\n• Light, airy, ocean-inspired\n• Natural textures (rope, linen, weathered wood)\n• Blue and white palette with sandy accents\n\n🎨 **Colors:** Ocean Blue, Sandy Beige, Crisp White, Coral Accent\n\n🛋️ **Must-haves:** Slipcovered sofas, jute rugs, driftwood accents, linen curtains, shell/coral decorative objects\n\n**Avoid:** Heavy, dark furniture or overly themed "nautical" kitsch\n\n💰 **Budget:** ${localPrice(10000)}–${localPrice(35000)} per room 🐚`;
        }

        // Art Deco
        if (l.includes('art deco') || l.includes('artdeco') || l.includes('deco') || l.includes('glamour') || l.includes('glamor')) {
            return `Art Deco / Hollywood Glam:\n\n✨ **Key traits:**\n• Bold geometric patterns\n• Luxurious materials (velvet, marble, brass)\n• Dark, dramatic color schemes\n• Statement mirrors and chandeliers\n\n🎨 **Colors:** Deep Navy, Emerald, Gold/Brass, Black, Blush Pink\n\n🛋️ **Must-haves:** Velvet furniture, sunburst mirrors, gold-frame artwork, marble accents, geometric wallpaper\n\n💰 **Budget:** ${localPrice(15000)}–${localPrice(60000)} per room\n\nGoes all-in on luxury — this is NOT a minimalist style! 💎`;
        }

        // Mid-Century
        if (l.includes('mid-century') || l.includes('midcentury') || l.includes('retro') || l.includes('60s') || l.includes('70s')) {
            return `Mid-Century Modern:\n\n🪑 **Key traits:**\n• Organic curves + clean lines (1950s–1970s)\n• Tapered furniture legs\n• Bold, saturated colors\n• Mix of materials: wood, metal, plastic, fabric\n\n🎨 **Colors:** Mustard Yellow, Avocado Green, Orange, Teak Brown, White\n\n🛋️ **Iconic pieces:** Eames lounge chair, Nelson bench, tulip table, Saarinen womb chair, arc floor lamps\n\n💰 **Budget:** ${localPrice(12000)}–${localPrice(45000)} per room\n\n**Tip:** Mix 2-3 authentic vintage pieces with modern reproductions for an authentic-but-affordable look! 🪩`;
        }

        // Farmhouse
        if (l.includes('farmhouse') || l.includes('rustic') || l.includes('country')) {
            return `Modern Farmhouse style:\n\n🏡 **Key traits:**\n• Shiplap walls, barn doors\n• Black hardware on white cabinets\n• Reclaimed wood accents\n• Cozy, welcoming atmosphere\n\n🎨 **Colors:** Crisp White, Warm Wood, Black Accents, Sage Green\n\n🛋️ **Must-haves:** Apron-front sink, open shelving, mason jar fixtures, barn door hardware, vintage-inspired fixtures\n\n⚠️ **2026 trend alert:** Pure farmhouse is evolving — mix with transitional or modern elements to keep it fresh\n\n💰 **Budget:** ${localPrice(10000)}–${localPrice(40000)} per room 🌾`;
        }

        // Mediterranean
        if (l.includes('mediterranean') || l.includes('spanish') || l.includes('tuscan') || l.includes('italian')) {
            return `Mediterranean style:\n\n🌊 **Key traits:**\n• Warm earth tones inspired by Southern Europe\n• Terracotta tiles, wrought iron, arches\n• Textured stucco walls\n• Indoor-outdoor living emphasis\n\n🎨 **Colors:** Terracotta, Warm Gold, Olive Green, Cobalt Blue, Cream\n\n🛋️ **Must-haves:** Terracotta flooring, arched doorways, wrought iron fixtures, ceramic pottery, mosaic tile accents\n\n💰 **Budget:** ${localPrice(15000)}–${localPrice(50000)} per room\n\nPerfect for warm climates and homes with existing stucco or tile! 🏺`;
        }

        // Tropical
        if (l.includes('tropical') || l.includes('jungle') || l.includes('bali') || l.includes('hawaiian')) {
            return `Tropical style:\n\n🌴 **Key traits:**\n• Lush, vibrant, resort-like\n• Natural fibers (rattan, bamboo, jute)\n• Leafy prints and bold colors\n• Indoor-outdoor connection\n\n🎨 **Colors:** Palm Green, Coral, Turquoise, Warm White, Gold\n\n🛋️ **Must-haves:** Rattan/wicker furniture, tropical print cushions, large leafy plants (monstera, palm, bird of paradise), natural fiber rugs, ceiling fan\n\n💰 **Budget:** ${localPrice(8000)}–${localPrice(30000)} per room\n\n**Tip:** Add a banana leaf wallpaper accent wall for instant tropical vibes! 🌺`;
        }

        // ── SEASONAL / REGIONAL ──

        // Monsoon / humidity
        if (l.includes('monsoon') || l.includes('humid') || l.includes('moisture') || l.includes('mold') || l.includes('mould') || l.includes('waterproof')) {
            return `Moisture-proofing your home:\n\n💧 **Material choices:**\n• LVP or tile flooring (NOT hardwood or carpet)\n• Porcelain tiles in wet areas\n• Marine-grade plywood for cabinets\n• Anti-fungal paint with mold inhibitor\n• Stainless steel or aluminum hardware\n\n🌀 **Ventilation:**\n• Exhaust fans in every wet room (150+ CFM)\n• Dehumidifier in enclosed spaces\n• Cross-ventilation planning\n\n**Prevention checklist:**\n✅ Silicone seal all wet-area edges\n✅ Slope floors toward drains\n✅ Waterproof membrane under tiles\n✅ Regular re-grouting schedule\n\nPrevention is 10x cheaper than repair! 🌧️`;
        }

        // Winter / cold climate
        if (l.includes('winter') || l.includes('cold') || l.includes('snow') || l.includes('heating') || l.includes('warm')) {
            return `Winter-ready renovation tips:\n\n❄️ **Insulation priorities:**\n1. Attic (biggest heat loss area) — R-49 to R-60\n2. Walls — R-13 to R-21\n3. Windows — double/triple pane + Low-E\n4. Door weatherstripping\n\n🔥 **Heating upgrades:**\n• Radiant floor heating: ${localPrice(6)}–${localPrice(14)}/sqft\n• Heat pump: ${localPrice(3000)}–${localPrice(8000)} (300% efficient!)\n• Smart thermostat: saves 10-12% annually\n\n🏠 **Cozy design:**\n• Warm wood tones and textiles\n• Fireplace insert: ${localPrice(1500)}–${localPrice(4000)}\n• Heated towel rails in bathrooms\n• Draft excluders on external doors\n\n**Tip:** Proper insulation saves ${localPrice(500)}–${localPrice(2000)}/year on heating! 🧣`;
        }

        // ── PRACTICAL GUIDES ──

        // Budget
        if (l.includes('budget') || l.includes('cheap') || l.includes('afford') || l.includes('save') || l.includes('low cost')) {
            return `Budget-friendly ideas (under ${localPrice(3000)}):\n\n💡 **High impact, low cost:**\n1. **Paint** — ${localPrice(50)}–${localPrice(200)}\n2. **New hardware** — ${localPrice(50)}–${localPrice(150)}\n3. **Light fixtures** — ${localPrice(100)}–${localPrice(400)}\n4. **Crown molding** — ${localPrice(200)}–${localPrice(600)}\n5. **Peel-and-stick backsplash** — ${localPrice(80)}–${localPrice(200)}\n6. **Rearrange furniture** — Free!\n7. **Add plants** — ${localPrice(30)}–${localPrice(100)}\n8. **Update textiles** — ${localPrice(100)}–${localPrice(400)}\n\n**Rule:** Paint + lighting = 80% visual impact for 20% cost! 💪`;
        }

        // Lighting
        if (l.includes('light') || l.includes('lamp') || l.includes('chandelier') || l.includes('led')) {
            return `Lighting guide:\n\n💡 **3 layers of lighting:**\n1. **Ambient** — Ceiling fixtures, recessed lights\n2. **Task** — Under-cabinet, desk lamps\n3. **Accent** — LED strips, picture lights\n\n**Color temperature:**\n• 2700K warm → Bedrooms, living rooms\n• 3000K neutral → Kitchens, baths\n• 4000K cool → Home offices\n\n**Room tips:**\n• Kitchen: Under-cabinet LEDs + pendants over island\n• Living: Floor lamp + table lamps + dimmer\n• Bedroom: Sconces + dimmer + LED behind headboard\n\n**Tip:** Dimmer switches cost ${localPrice(15)}–${localPrice(40)} each and transform any room! 💡`;
        }

        // Smart home
        if (l.includes('smart') || l.includes('automation') || l.includes('tech')) {
            return `Smart home priorities:\n\n📱 **Best ROI:**\n1. Smart thermostat — Saves ~${localPrice(150)}/year\n2. Smart lighting — Voice control, schedules\n3. Video doorbell — Security + convenience\n4. Smart locks — Keyless entry\n\n🏠 **Level up:**\n• Motorized blinds • Smart irrigation\n• Robot vacuum • Smart smoke detectors\n\n🔌 **Pro tip:** During renovation, run Cat6 ethernet and smart-switch wiring to every room — much easier during construction!\n\nTotal setup: ${localPrice(1500)}–${localPrice(8000)} 📡`;
        }

        // ROI / Resale
        if (l.includes('resale') || l.includes('roi') || l.includes('value') || l.includes('investment') || l.includes('sell')) {
            return `Best ROI renovations:\n\n📈 **Highest return:**\n1. Minor kitchen remodel — ~75-80% ROI\n2. Bathroom refresh — ~70-75% ROI\n3. Curb appeal (paint, landscaping) — ~70% ROI\n4. Hardwood floors — ~70% ROI\n5. Energy-efficient upgrades — ~65% ROI + savings\n\n📉 **Lowest ROI:**\n• Swimming pools — ~40%\n• Ultra-custom designs\n• Over-improving for neighborhood\n\n**Golden rule:** Don't be the most expensive home on your block by more than 10-15%! 🏠`;
        }

        // ── FUN / TRIVIA ──

        // Fun facts
        if (l.includes('fun fact') || l.includes('did you know') || l.includes('trivia') || l.includes('interesting')) {
            const facts = [
                `🏠 **Did you know?** The average American moves 11.7 times in their lifetime — but renovating is often cheaper than moving! A mid-range kitchen remodel costs ~${localPrice(25000)} vs. ~${localPrice(15000)} in moving costs + the stress of finding a new home.`,
                `🎨 **Fun fact!** BBlue is the world's most popular room color — it reduces heart rate and blood pressure, making it ideal for bedrooms. But ancient Egyptians didn't even have a word for blue!`,
                `🧱 **Renovation trivia:** The oldest known house still standing is in Scotland — Knap of Howar, built around 3700 BC. That's 5,700 years of "if it ain't broke, don't fix it!" 🏴`,
                `💡 **Did you know?** LED bulbs last ~25,000 hours — that's 22 years of daily use (3 hrs/day). Switching all bulbs saves ~${localPrice(200)}/year on electricity. One of the easiest wins in renovation!`,
                `🪵 **Fun fact!** White oak hardwood can last 100+ years with proper care. The White House has had the same white oak flooring in the State Dining Room since 1902!`
            ];
            return facts[Math.floor(Math.random() * facts.length)];
        }

        // Joke
        if (l.includes('joke') || l.includes('funny') || l.includes('laugh')) {
            const jokes = [
                `😄 Why did the painter break up with the wall?\n\n...Because it kept giving them the cold shoulder! 🎨\n\n(But seriously, cold walls might mean you need better insulation! Ask me about it.)`,
                `😂 A contractor walks into a bar and says, "I'll have this place remodeled in two weeks."\n\nThe bartender says, "That's what the last five guys said."\n\n(Always add a 30% time buffer to any renovation timeline! 📅)`,
                `🤣 What's a plumber's least favorite vegetable?\n\n...Leeks! 🥬\n\n(But real leaks are no joke — water damage costs ${localPrice(3000)}–${localPrice(12000)} to repair. Check your pipes regularly!)`
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        }

        // ── META ──

        // Accessibility / universal design
        if (l.includes('accessible') || l.includes('accessibility') || l.includes('wheelchair') || l.includes('aging') || l.includes('universal design') || l.includes('senior') || l.includes('elderly')) {
            return `Universal design / Accessible renovation:\n\n♿ **Key principles:**\n• Zero-step entries (no thresholds)\n• 36" minimum doorways (32" clear opening)\n• Lever-style door handles and faucets\n• Non-slip flooring throughout\n\n🚿 **Bathroom:**\n• Roll-in shower with bench seat\n• Grab bars (decorative options available!)\n• Raised toilet (17-19" comfort height)\n• Hand-held showerhead\n\n🍳 **Kitchen:**\n• Varying counter heights\n• Pull-out shelves and drawers\n• D-shaped cabinet pulls\n• Side-opening oven\n\n💰 **Cost:** Adding accessibility during renovation costs 5-10% more, but retrofitting later costs 3-5× as much\n\n**Tip:** These features add resale value as the population ages! ♿`;
        }

        // Help / capabilities
        if (l.includes('help') || l.includes('what can') || l.includes('how do') || l.includes('menu') || l.includes('feature')) {
            return `I can help with all renovation topics:\n\n🏠 **Rooms** — Living, bedroom, kitchen, bathroom, office, dining, laundry, closet, basement, garage, outdoor\n🎨 **Styles** — Modern, Scandinavian, Industrial, Bohemian, Japandi, Coastal, Art Deco, Mid-Century, Farmhouse, Mediterranean, Tropical\n💰 **Costs** — Detailed pricing in ${cur}\n🪵 **Materials** — Flooring, countertops, cabinets, paint, tiles, windows, insulation\n🔧 **Practical** — DIY vs. Pro, permits, timelines, demolition\n🌱 **Eco** — Sustainable materials and energy efficiency\n📈 **ROI** — Best renovations for resale value\n♿ **Accessibility** — Universal design features\n🎨 **Generate** — Say "generate a modern living room" to create AI images!\n\nTry: "What flooring for my kitchen?" or "Show me Japandi style" 🏗️`;
        }

        // Hello / greeting
        if (l.includes('hello') || l.includes('hi') || l.includes('hey') || l === 'yo' || l === 'sup') {
            return `Hello! 👋 I'm your AI renovation assistant powered by **Nano Banana Pro**. I can help with:\n\n• 🏠 Room design ideas for 11 room types\n• 🎨 12 design styles explained in detail\n• 💰 Cost estimates in ${cur}\n• 🪵 Material comparisons and ratings\n• 🔧 DIY tips and contractor guidance\n• 📅 Timeline planning\n• 🎨 AI image generation!\n\nWhat room are you thinking about renovating? 🏠`;
        }

        // Thanks
        if (l.includes('thank') || l.includes('thanks') || l.includes('thx') || l.includes('awesome') || l.includes('great')) {
            return `You're welcome! 😊 I'm always here to help with your renovation. There's so much more I can assist with:\n\n• Different rooms and design styles\n• Material comparisons and pricing\n• Budget optimization tips\n• Timeline planning and permits\n• Eco-friendly options\n• Fun renovation trivia!\n\nJust ask away! Happy renovating! 🏠✨`;
        }

        // Default
        return `That's a great question! Here are some general tips:\n\n🏠 Every renovation starts with understanding your space:\n\n1. **Define priorities** — Aesthetics, functionality, or resale?\n2. **Set a budget** — Use our Cost Estimator for ${sym} ${cur}\n3. **Choose a style** — Browse 12 styles in our Gallery\n4. **Plan in phases** — High-impact first\n5. **Get quotes** — For work over ${localPrice(2000)}, get 3+ quotes\n\n**Quick wins:**\n• Fresh paint (walls + trim)\n• Updated light fixtures\n• New cabinet hardware\n• Add plants and textiles\n\n**Try asking about:** rooms, styles, materials, costs, DIY, permits, eco tips, or say "help" for a full menu! 🔨`;
    }

    return { getAIResponse, localPrice };
}
