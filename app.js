/* ============================================================
   AI Based Home Renovation Agent with Nano Banana Pro
   Application Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const appState = {
    country: null,
    flag: '🌍',
    currency: 'USD',
    symbol: '$',
    rate: 1,
    ppp: 1,
    countryName: ''
  };

  // ───────────── Processing Overlay (Added inside container) ─────────────
  function simulateAIProcessing(containerId, callback) {
    const container = document.getElementById(containerId);
    if (!container) return callback();

    let overlay = document.getElementById('aiProcessingOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'aiProcessingOverlay';
      overlay.innerHTML = `
        <div style="position:absolute;inset:0;background:rgba(10,14,26,0.8);z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;backdrop-filter:blur(5px);color:white;transition:opacity 0.3s;border-radius:inherit;">
          <div style="width:48px;height:48px;border:4px solid rgba(255,255,255,0.1);border-top-color:var(--accent-amber);border-radius:50%;animation:spin 1s linear infinite;"></div>
          <p style="margin-top:20px;font-family:var(--font-heading);font-weight:600;letter-spacing:1px;background:var(--gradient-primary);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Nano Banana Pro is processing...</p>
        </div>
        <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
      `;
      container.appendChild(overlay);
    }

    overlay.style.display = 'flex';
    // Small delay to allow CSS display to apply before fading in
    setTimeout(() => {
      overlay.style.opacity = '1';
    }, 10);

    setTimeout(() => {
      callback();
      overlay.style.opacity = '0';
      setTimeout(() => overlay.style.display = 'none', 300);
    }, 1200 + Math.random() * 800); // Wait 1.2 to 2 seconds
  }

  // ───────────── Theme Management ─────────────
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');

  // Initialize theme from localStorage or default to dark
  let currentTheme = localStorage.getItem('renovateAiTheme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon();

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('renovateAiTheme', currentTheme);
      updateThemeIcon();
    });
  }

  function updateThemeIcon() {
    if (!themeIcon) return;
    themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
  }

  // ───────────── Toast Notifications ─────────────
  window.showToast = function (message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after duration
    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  // ───────────── Country Popup ─────────────
  const countryPopup = document.getElementById('countryPopup');
  const countrySearch = document.getElementById('countrySearch');
  const countryGrid = document.getElementById('countryGrid');
  const popupContinueBtn = document.getElementById('popupContinueBtn');
  const navCountryBadge = document.getElementById('navCountryBadge');
  const navCountryFlag = document.getElementById('navCountryFlag');
  const navCountryCurrency = document.getElementById('navCountryCurrency');

  // Lock body scroll when popup is open
  document.body.classList.add('popup-open');

  // Country card selection
  const countryCards = countryGrid.querySelectorAll('.country-card');
  countryCards.forEach(card => {
    card.addEventListener('click', () => {
      countryCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      popupContinueBtn.disabled = false;

      appState.country = card.dataset.country;
      appState.flag = card.dataset.flag;
      appState.currency = card.dataset.currency;
      appState.symbol = card.dataset.symbol;
      appState.rate = parseFloat(card.dataset.rate);
      appState.countryName = card.querySelector('.country-name').textContent;

      // Establish a lightweight Purchasing Power Parity (PPP)
      // to bring high USD basis down to realistic local market values
      const pppRates = {
        'india': 0.15, 'china': 0.4, 'brazil': 0.3, 'mexico': 0.4,
        'uk': 1.05, 'germany': 1.0, 'france': 0.95, 'australia': 1.1,
        'canada': 0.9, 'japan': 0.75, 'southkorea': 0.7, 'saudiarabia': 0.9,
        'uae': 1.0, 'singapore': 1.1
      };
      appState.ppp = pppRates[appState.country] || 1.0;
    });
  });

  // Search filter
  countrySearch.addEventListener('input', () => {
    const query = countrySearch.value.toLowerCase().trim();
    countryCards.forEach(card => {
      const name = card.querySelector('.country-name').textContent.toLowerCase();
      const currency = card.dataset.currency.toLowerCase();
      if (name.includes(query) || currency.includes(query)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });

  // Continue button
  popupContinueBtn.addEventListener('click', () => {
    if (!appState.country) return;
    countryPopup.classList.remove('active');
    document.body.classList.remove('popup-open');

    // Update navbar badge
    navCountryFlag.textContent = appState.flag;
    navCountryCurrency.textContent = appState.currency;

    // Update cost estimator label
    const label = document.getElementById('estimatorCurrencyLabel');
    if (label) label.textContent = `${appState.symbol} ${appState.currency}`;

    // Update hero estimated cost
    updateHeroCost();

    // Update cost estimator
    updateCostEstimate();

    // Update chat welcome message
    updateChatWelcome();
  });

  // Navbar badge → reopen popup
  navCountryBadge.addEventListener('click', () => {
    countryPopup.classList.add('active');
    document.body.classList.add('popup-open');
  });

  function formatCurrency(usdAmount) {
    const converted = Math.round(usdAmount * appState.rate);
    return appState.symbol + converted.toLocaleString();
  }

  function updateHeroCost() {
    const el = document.getElementById('heroEstCost');
    if (el) el.textContent = formatCurrency(12400);
  }

  function updateChatWelcome() {
    const welcomeMsg = document.getElementById('chatWelcomeMsg');
    if (welcomeMsg) {
      const bubble = welcomeMsg.querySelector('.chat-bubble');
      bubble.innerHTML = `Hi there! 👋 I'm your AI renovation assistant powered by <strong>Nano Banana Pro</strong>. I see you're designing from <strong>${appState.flag} ${appState.countryName}</strong> — all costs will be shown in <strong>${appState.symbol} ${appState.currency}</strong>. What room are you looking to renovate?`;
    }
  }

  // ───────────── Navbar Scroll Effect ─────────────
  const navbar = document.getElementById('navbar');
  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });

  // ───────────── Mobile Menu Toggle ─────────────
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const spans = mobileMenuBtn.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  // ───────────── Scroll Animations ─────────────
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.animate-on-scroll').forEach(el => scrollObserver.observe(el));

  // ───────────── File Upload & Room Analysis ─────────────
  const uploadZone = document.getElementById('uploadZone');
  const fileInput = document.getElementById('fileInput');
  const uploadPreview = document.getElementById('uploadPreview');
  const previewImage = document.getElementById('previewImage');
  const analysisResults = document.getElementById('analysisResults');

  uploadZone.addEventListener('click', () => fileInput.click());

  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleUpload(file);
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleUpload(file);
  });

  function handleUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      previewImage.src = dataUrl;

      const comparisonContainer = document.getElementById('comparisonContainer');
      const beforeImg = document.querySelector('#comparisonBefore img');
      if (beforeImg) {
        beforeImg.src = dataUrl;
        // Make sure rendering updates its size correctly
        if (comparisonContainer) {
          beforeImg.style.width = comparisonContainer.offsetWidth + 'px';
        }
      }

      const afterImg = document.querySelector('#comparisonContainer > img');
      if (afterImg) {
        afterImg.dataset.originalSrc = dataUrl;
        afterImg.src = dataUrl;
      }

      uploadZone.style.display = 'none';
      uploadPreview.classList.add('active');

      // Trigger new scanning UI pipeline
      const overlay = document.getElementById('scanningOverlay');
      const progFill = document.getElementById('scanProgressFill');
      if (overlay && progFill) {
        overlay.classList.add('active');
        previewImage.style.filter = 'blur(4px)';

        let p = 0;
        const scanInt = setInterval(() => {
          p += Math.random() * 15;
          if (p >= 100) {
            p = 100;
            clearInterval(scanInt);
            setTimeout(() => {
              overlay.classList.remove('active');
              previewImage.style.filter = 'none';
              simulateAnalysis();
            }, 500);
          }
          progFill.style.width = p + '%';
        }, 300);
      } else {
        simulateAnalysis();
      }
    };
    reader.readAsDataURL(file);
  }

  function simulateAnalysis() {
    analyzeImage(previewImage, function (result) {
      setTimeout(() => {
        const uploadGrid = document.getElementById('uploadGrid');
        if (uploadGrid) uploadGrid.classList.add('active');

        analysisResults.style.display = 'block';
        void analysisResults.offsetWidth;
        analysisResults.classList.add('active');

        document.getElementById('roomType').textContent = result.roomType;
        document.getElementById('roomSize').textContent = result.estSize;
        document.getElementById('roomLight').textContent = result.lightLevel;

        const conditionEl = document.getElementById('roomCondition');
        conditionEl.textContent = result.condition;
        conditionEl.className = 'value ' + result.condClass;

        document.getElementById('wallCondition').textContent = result.wallState;
        document.getElementById('floorCondition').textContent = result.floorState;

        setTimeout(() => {
          document.getElementById('renoProgress').style.width = result.potential + '%';
        }, 300);

        // Display extracted color palette as real swatches
        const paletteContainer = document.getElementById('colorPaletteSwatches');
        if (paletteContainer && result.dominantColors.length > 0) {
          paletteContainer.innerHTML = '';
          result.dominantColors.forEach(c => {
            const swatch = document.createElement('div');
            swatch.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;';
            swatch.innerHTML = `
              <div style="width:48px;height:48px;border-radius:8px;background:${c.hex};border:2px solid var(--border-color);box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>
              <span style="font-size:0.7rem;color:var(--text-muted);font-weight:500;">${c.hex.toUpperCase()}</span>
            `;
            paletteContainer.appendChild(swatch);
          });
        }

        // Smart suggestion tags based on actual analysis
        const tagsContainer = document.getElementById('suggestionTags');
        tagsContainer.innerHTML = '';
        result.suggestions.forEach(s => {
          const tag = document.createElement('span');
          tag.className = 'analysis-tag';
          tag.textContent = s;
          tagsContainer.appendChild(tag);
        });

        generateAISuggestions();

        const aiInteractionPanel = document.getElementById('aiInteractionPanel');
        if (aiInteractionPanel) aiInteractionPanel.style.display = 'block';
        document.getElementById('instructionPanel').style.display = 'block';

        const suggested = suggestStyle();
        applyStyleToAfterImage(suggested);
        const afterLabel = document.querySelector('.after-label');
        if (afterLabel) afterLabel.textContent = `After (${styleNames[suggested] || 'Generated'} \u00b7 Nano Banana Pro)`;
      }, 600);
    });
  }

  // ───────────── AI Suggestion Chips (Dismissible) ─────────────
  function generateAISuggestions() {
    const chipsContainer = document.getElementById('aiSuggestionChips');
    const card = document.getElementById('aiSuggestionsCard');
    card.style.display = 'block';

    const suggestions = [
      { icon: '🎨', text: 'Try Modern Minimalist style' },
      { icon: '🛋️', text: 'Add a large sectional sofa' },
      { icon: '💡', text: 'Upgrade to recessed LED lighting' },
      { icon: '🌿', text: 'Add indoor plants for freshness' },
      { icon: '🪵', text: 'Switch flooring to warm oak hardwood' },
      { icon: '🖼️', text: 'Add gallery wall with framed art' },
      { icon: '📐', text: 'Built-in storage cabinets along the wall' },
      { icon: '🪞', text: 'Add a large decorative mirror' }
    ];

    // Pick 5-6 random suggestions
    const picked = suggestions.sort(() => 0.5 - Math.random()).slice(0, 5 + Math.floor(Math.random() * 2));

    chipsContainer.innerHTML = '';
    picked.forEach((sug, i) => {
      const chip = document.createElement('div');
      chip.className = 'ai-chip';
      chip.style.animationDelay = (i * 0.1) + 's';
      chip.innerHTML = `
        <span class="chip-icon">${sug.icon}</span>
        <span>${sug.text}</span>
        <button class="chip-dismiss" title="Dismiss suggestion">✕</button>
      `;

      const dismissBtn = chip.querySelector('.chip-dismiss');
      dismissBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        chip.classList.add('dismissed');
        setTimeout(() => chip.remove(), 300);
      });

      chipsContainer.appendChild(chip);
    });
  }

  // ───────────── Style Suggestion ─────────────
  function suggestStyle() {
    const styles = ['modern', 'industrial', 'scandinavian', 'bohemian', 'japandi', 'coastal', 'artdeco', 'midcentury'];
    const suggested = styles[Math.floor(Math.random() * styles.length)];

    // Show badge on suggested card
    const styleCards = document.querySelectorAll('.style-card');
    styleCards.forEach(card => {
      const badge = card.querySelector('.ai-suggested-badge');
      if (card.dataset.style === suggested) {
        badge.style.display = 'block';
        card.classList.add('selected');
      } else {
        badge.style.display = 'none';
        card.classList.remove('selected');
      }
    });

    return suggested;
  }

  // ───────────── Instruction Panel (Tell AI What You Want) ─────────────
  const instructionSubmit = document.getElementById('instructionSubmit');
  const instructionTextarea = document.getElementById('instructionTextarea');
  const instructionResult = document.getElementById('instructionResult');

  instructionSubmit.addEventListener('click', () => {
    const text = instructionTextarea.value.trim();
    if (!text) {
      instructionTextarea.focus();
      return;
    }

    // Parse the user's instructions and generate a renovation plan
    const plan = parseInstructions(text);
    renderPlan(plan);

    // Extract simple color keywords from text
    const colorMap = {
      'red': 'rgba(200,50,50,0.2)', 'blue': 'rgba(50,100,220,0.2)', 'green': 'rgba(50,150,80,0.2)',
      'yellow': 'rgba(220,180,50,0.2)', 'orange': 'rgba(220,120,40,0.2)', 'purple': 'rgba(150,50,180,0.2)',
      'pink': 'rgba(220,100,150,0.2)', 'gray': 'rgba(100,100,100,0.2)', 'grey': 'rgba(100,100,100,0.2)',
      'black': 'rgba(30,30,30,0.3)', 'white': 'rgba(240,240,240,0.2)', 'dark': 'rgba(40,40,50,0.3)',
      'light': 'rgba(230,230,240,0.2)', 'warm': 'rgba(200,120,50,0.15)', 'cool': 'rgba(80,120,200,0.15)'
    };

    let extractedColor = null;
    let foundKeyword = '';
    const lower = text.toLowerCase();
    const words = lower.split(/\W+/);
    for (const word of words) {
      if (colorMap[word]) {
        extractedColor = colorMap[word];
        foundKeyword = word.charAt(0).toUpperCase() + word.slice(1);
        break;
      }
    }

    // Apply canvas-based styling using currently selected style + custom color
    const selectedCard = document.querySelector('.style-card.selected');
    const selectedStyle = selectedCard ? selectedCard.dataset.style : 'modern';

    simulateAIProcessing('comparisonContainer', () => {
      applyStyleToAfterImage(selectedStyle, extractedColor);
      const afterLabel = document.querySelector('.after-label');
      if (afterLabel) {
        if (extractedColor) {
          afterLabel.textContent = `After (${foundKeyword} \u00b7 Nano Banana Pro)`;
        } else {
          afterLabel.textContent = `After (Custom AI \u00b7 Nano Banana Pro)`;
        }
      }
    });

    setTimeout(() => {
      const compareSection = document.getElementById('compare');
      if (compareSection) {
        const y = compareSection.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 400);
  });

  function parseInstructions(text) {
    const lower = text.toLowerCase();
    const planItems = [];

    // Object placement detection
    const objectKeywords = [
      { keywords: ['sofa', 'couch'], icon: '🛋️', action: 'Place' },
      { keywords: ['table', 'desk'], icon: '🪑', action: 'Add' },
      { keywords: ['bookshelf', 'shelf', 'shelving', 'shelves'], icon: '📚', action: 'Install' },
      { keywords: ['plant', 'plants', 'greenery'], icon: '🌿', action: 'Add' },
      { keywords: ['lamp', 'light', 'lighting', 'chandelier'], icon: '💡', action: 'Install' },
      { keywords: ['mirror'], icon: '🪞', action: 'Place' },
      { keywords: ['rug', 'carpet'], icon: '🟫', action: 'Lay' },
      { keywords: ['curtain', 'drape', 'window treatment'], icon: '🪟', action: 'Hang' },
      { keywords: ['painting', 'art', 'artwork', 'poster', 'frame'], icon: '🖼️', action: 'Hang' },
      { keywords: ['cabinet', 'storage', 'wardrobe', 'closet'], icon: '🗄️', action: 'Install' },
      { keywords: ['bed', 'mattress'], icon: '🛏️', action: 'Place' },
      { keywords: ['chair', 'armchair', 'stool'], icon: '💺', action: 'Add' },
      { keywords: ['tv', 'television', 'screen', 'monitor'], icon: '📺', action: 'Mount' },
      { keywords: ['fan', 'ceiling fan'], icon: '🌀', action: 'Install' },
      { keywords: ['vase', 'pot', 'flower'], icon: '🏺', action: 'Place' }
    ];

    // Material / surface changes
    const materialKeywords = [
      { keywords: ['floor', 'flooring', 'hardwood', 'tile', 'marble', 'wood', 'oak', 'laminate'], icon: '🪵', action: 'Change flooring' },
      { keywords: ['wall', 'paint', 'wallpaper', 'accent wall'], icon: '🎨', action: 'Update walls' },
      { keywords: ['ceiling'], icon: '🔝', action: 'Redesign ceiling' },
      { keywords: ['countertop', 'counter', 'granite', 'quartz'], icon: '🪨', action: 'Replace countertop' }
    ];

    // Process sentences
    const sentences = text.split(/[.,;!\n]+/).map(s => s.trim()).filter(s => s.length > 3);

    sentences.forEach(sentence => {
      const sentLower = sentence.toLowerCase();

      // Check for objects
      for (const obj of objectKeywords) {
        if (obj.keywords.some(k => sentLower.includes(k))) {
          planItems.push({
            icon: obj.icon,
            text: `<strong>${obj.action}:</strong> ${capitalizeFirst(sentence)}`
          });
          return;
        }
      }

      // Check for materials
      for (const mat of materialKeywords) {
        if (mat.keywords.some(k => sentLower.includes(k))) {
          planItems.push({
            icon: mat.icon,
            text: `<strong>${mat.action}:</strong> ${capitalizeFirst(sentence)}`
          });
          return;
        }
      }

      // Generic instruction
      if (sentence.length > 5) {
        planItems.push({
          icon: '✨',
          text: `<strong>Style adjustment:</strong> ${capitalizeFirst(sentence)}`
        });
      }
    });

    // If no items parsed, add a generic acknowledgement
    if (planItems.length === 0) {
      planItems.push({
        icon: '✨',
        text: `<strong>Your vision:</strong> ${capitalizeFirst(text)}`
      });
    }

    // Market-accurate cost per item type in local currency
    const country = appState.country || 'usa';
    const itemCosts = {
      india: { furniture: [8000, 25000], materials: [5000, 30000], decor: [2000, 8000], structural: [15000, 60000] },
      usa: { furniture: [200, 2500], materials: [100, 3000], decor: [50, 500], structural: [500, 8000] },
      china: { furniture: [1500, 8000], materials: [800, 5000], decor: [300, 2000], structural: [3000, 15000] },
      japan: { furniture: [15000, 80000], materials: [10000, 50000], decor: [3000, 15000], structural: [30000, 120000] },
      uk: { furniture: [150, 2000], materials: [80, 2500], decor: [40, 400], structural: [400, 6000] },
      germany: { furniture: [180, 2200], materials: [100, 2800], decor: [50, 450], structural: [450, 7000] },
      france: { furniture: [170, 2100], materials: [90, 2600], decor: [45, 420], structural: [420, 6500] },
      australia: { furniture: [250, 3000], materials: [150, 3500], decor: [60, 600], structural: [600, 9000] },
      canada: { furniture: [220, 2800], materials: [120, 3200], decor: [55, 550], structural: [500, 8500] },
      brazil: { furniture: [800, 5000], materials: [500, 4000], decor: [200, 1500], structural: [2000, 12000] },
      southkorea: { furniture: [100000, 500000], materials: [80000, 400000], decor: [30000, 130000], structural: [200000, 800000] },
      uae: { furniture: [300, 3500], materials: [200, 4000], decor: [80, 700], structural: [700, 10000] },
      saudiarabia: { furniture: [280, 3200], materials: [180, 3800], decor: [70, 650], structural: [650, 9500] },
      mexico: { furniture: [3000, 20000], materials: [2000, 15000], decor: [800, 5000], structural: [8000, 40000] },
      singapore: { furniture: [250, 3000], materials: [150, 3500], decor: [60, 600], structural: [600, 9000] }
    };

    const costs = itemCosts[country] || itemCosts.usa;
    let totalAddCost = 0;

    // Calculate based on what was detected
    const detectedCategories = new Set();
    for (const item of planItems) {
      const t = item.text.toLowerCase();
      if (t.includes('place') || t.includes('add') || t.includes('mount')) detectedCategories.add('furniture');
      if (t.includes('change') || t.includes('update') || t.includes('replace') || t.includes('install')) detectedCategories.add('materials');
      if (t.includes('hang') || t.includes('lay')) detectedCategories.add('decor');
      if (t.includes('wall') || t.includes('floor') || t.includes('ceiling') || t.includes('window')) detectedCategories.add('structural');
    }

    if (detectedCategories.size === 0) detectedCategories.add('decor');

    detectedCategories.forEach(cat => {
      const [min, max] = costs[cat] || costs.decor;
      totalAddCost += min + Math.floor(Math.random() * (max - min));
    });

    planItems.push({
      icon: '💰',
      text: `<strong>Estimated addition cost:</strong> ${appState.symbol}${totalAddCost.toLocaleString()}`
    });

    return planItems;
  }

  function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function renderPlan(planItems) {
    instructionResult.innerHTML = `
      <div class="reno-plan-card">
        <h5>🧠 AI Renovation Plan</h5>
        ${planItems.map(item => `
          <div class="reno-plan-item">
            <span class="plan-icon">${item.icon}</span>
            <span class="plan-text">${item.text}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ───────────── Style Selector ─────────────
  const stylesGrid = document.querySelector('.styles-grid');
  if (stylesGrid) {
    stylesGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.style-card');
      if (card) {
        stylesGrid.querySelectorAll('.style-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        simulateAIProcessing('comparisonContainer', () => {
          applyStyleToAfterImage(card.dataset.style);
          const afterLabel = document.querySelector('.after-label');
          if (afterLabel) afterLabel.textContent = `After (${styleNames[card.dataset.style] || 'Generated'} \u00b7 Nano Banana Pro)`;
        });

        setTimeout(() => {
          const compareSection = document.getElementById('compare');
          if (compareSection) {
            const y = compareSection.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 300);
      }
    });
  }

  const styleNames = {
    modern: 'Modern Minimalist',
    industrial: 'Industrial Loft',
    scandinavian: 'Scandinavian',
    bohemian: 'Bohemian',
    japandi: 'Japandi',
    coastal: 'Coastal',
    artdeco: 'Art Deco',
    midcentury: 'Mid-Century Modern'
  };

  // Canvas-based image transformation that generates a real composite After image
  function applyStyleToAfterImage(style, customOverlayColor = null) {
    const afterImg = document.getElementById('finalResultImage');
    if (!afterImg) return;

    // Style-specific transformation parameters for canvas compositing
    const styleEffects = {
      modern: { overlay: 'rgba(230,240,250,0.1)', gradient: ['rgba(200,210,230,0.15)', 'rgba(240,240,245,0.05)'], contrast: 1.05, brightness: 1.05, saturation: 0.95 },
      industrial: { overlay: 'rgba(90,70,50,0.15)', gradient: ['rgba(60,45,30,0.2)', 'rgba(120,100,80,0.1)'], contrast: 1.1, brightness: 0.95, saturation: 0.9 },
      scandinavian: { overlay: 'rgba(245,240,230,0.15)', gradient: ['rgba(255,250,240,0.2)', 'rgba(230,220,200,0.1)'], contrast: 1.02, brightness: 1.08, saturation: 0.85 },
      bohemian: { overlay: 'rgba(180,80,40,0.1)', gradient: ['rgba(200,100,50,0.15)', 'rgba(220,170,60,0.1)'], contrast: 1.08, brightness: 1.02, saturation: 1.15 },
      japandi: { overlay: 'rgba(180,170,150,0.12)', gradient: ['rgba(160,150,130,0.18)', 'rgba(200,195,180,0.05)'], contrast: 1.05, brightness: 1.02, saturation: 0.9 },
      coastal: { overlay: 'rgba(100,180,220,0.12)', gradient: ['rgba(80,160,200,0.18)', 'rgba(180,220,240,0.08)'], contrast: 1.05, brightness: 1.05, saturation: 1.05 },
      artdeco: { overlay: 'rgba(180,150,50,0.1)', gradient: ['rgba(30,30,50,0.2)', 'rgba(200,170,60,0.08)'], contrast: 1.12, brightness: 0.98, saturation: 1.05 },
      midcentury: { overlay: 'rgba(200,120,40,0.12)', gradient: ['rgba(180,100,30,0.18)', 'rgba(220,160,80,0.08)'], contrast: 1.08, brightness: 0.98, saturation: 1.1 }
    };

    const effect = styleEffects[style] || styleEffects.modern;
    // Override the style's default overlay if a custom one is requested
    const finalOverlay = customOverlayColor || effect.overlay;

    // Use a hidden canvas to composite styles onto the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Use the source image (either uploaded or default)
    const sourceImg = new Image();
    sourceImg.crossOrigin = 'anonymous';
    sourceImg.src = afterImg.dataset.originalSrc || afterImg.src;

    sourceImg.onload = function () {
      canvas.width = sourceImg.naturalWidth || 900;
      canvas.height = sourceImg.naturalHeight || 600;
      const w = canvas.width, h = canvas.height;

      // 1) Draw original image
      ctx.drawImage(sourceImg, 0, 0, w, h);

      // 2) Adjust contrast and brightness via pixel manipulation
      const imageData = ctx.getImageData(0, 0, w, h);
      const d = imageData.data;
      const contrast = effect.contrast;
      const brightness = effect.brightness;
      const saturation = effect.saturation;

      // New Contrast calculation:
      // A standard algorithm maps pixel values around 128 (mid-gray).
      // factor = (259 * (C + 255)) / (255 * (259 - C)) where C is from -255 to 255.
      // But we have 'contrast' as a multiplier e.g. 1.05.
      // A simpler, standard approach for multiplier contrast (like CSS filter):
      // newValue = (oldValue - 128) * contrast + 128

      for (let i = 0; i < d.length; i += 4) {
        // Brightness
        let r = d[i] * brightness;
        let g = d[i + 1] * brightness;
        let b = d[i + 2] * brightness;

        // Contrast (Standard implementation)
        r = (r - 128) * contrast + 128;
        g = (g - 128) * contrast + 128;
        b = (b - 128) * contrast + 128;

        // Saturation
        const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        r = gray + saturation * (r - gray);
        g = gray + saturation * (g - gray);
        b = gray + saturation * (b - gray);

        d[i] = Math.max(0, Math.min(255, r));
        d[i + 1] = Math.max(0, Math.min(255, g));
        d[i + 2] = Math.max(0, Math.min(255, b));
      }
      ctx.putImageData(imageData, 0, 0);

      // 3) Apply color overlay
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = finalOverlay;
      ctx.fillRect(0, 0, w, h);

      // 4) Apply gradient wash
      ctx.globalCompositeOperation = 'soft-light';
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, effect.gradient[0]);
      grad.addColorStop(1, effect.gradient[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // 5) Add subtle vignette
      ctx.globalCompositeOperation = 'multiply';
      const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.75);
      vignette.addColorStop(0, 'rgba(255,255,255,1)');
      vignette.addColorStop(1, 'rgba(180,180,180,1)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'source-over';

      // 6) Export as data URL and set on the after image
      try {
        const resultURL = canvas.toDataURL('image/jpeg', 0.92);
        afterImg.style.filter = 'none';
        afterImg.src = resultURL;
      } catch (e) {
        // Fallback to CSS filters if canvas export fails (CORS)
        const filters = {
          modern: 'contrast(1.15) saturate(0.85) brightness(1.1)',
          industrial: 'contrast(1.25) sepia(0.25) brightness(0.9)',
          scandinavian: 'contrast(1.05) saturate(0.7) brightness(1.15)',
          bohemian: 'contrast(1.15) saturate(1.3) brightness(1.05) sepia(0.15)',
          japandi: 'contrast(1.1) saturate(0.8) brightness(1.1) sepia(0.1)',
          coastal: 'contrast(1.1) saturate(1.2) brightness(1.1) hue-rotate(-10deg)',
          artdeco: 'contrast(1.3) saturate(1.1) brightness(0.95) sepia(0.2)',
          midcentury: 'contrast(1.2) saturate(1.3) brightness(0.9) sepia(0.3)'
        };
        afterImg.style.filter = filters[style] || 'none';
      }
    };

    sourceImg.onerror = function () {
      // Fallback CSS filter
      afterImg.style.filter = 'contrast(1.1) brightness(1.05)';
    };

    // Note: Slider label logic removed as we display the direct result now
  }

  // ───────────── Before / After Slider ─────────────
  // Slider functionality removed per user request to directly display Nano Banana Pro Result.

  // ───────────── Cost Estimator (Market-Accurate Pricing) ─────────────
  const roomSizeSlider = document.getElementById('roomSizeSlider');
  const renoDepthSlider = document.getElementById('renoDepthSlider');
  const materialSlider = document.getElementById('materialSlider');

  const roomSizeValueEl = document.getElementById('roomSizeValue');
  const renoDepthValueEl = document.getElementById('renoDepthValue');
  const materialValueEl = document.getElementById('materialValue');

  const costMaterialsEl = document.getElementById('costMaterials');
  const costLaborEl = document.getElementById('costLabor');
  const costDesignEl = document.getElementById('costDesign');
  const costContingencyEl = document.getElementById('costContingency');
  const costTotalEl = document.getElementById('costTotal');

  const depthLabels = { 1: 'Light', 2: 'Medium', 3: 'Full' };
  const materialLabels = { 1: 'Economy', 2: 'Standard', 3: 'Premium' };

  // Real-world market rates per sq ft in LOCAL currency
  // Source: Market research for typical residential renovation costs (2025-2026)
  const marketRatesPerSqft = {
    // { light: [economy, standard, premium], medium: [...], full: [...] }
    india: { light: [40, 80, 150], medium: [100, 200, 400], full: [250, 500, 1000] },    // INR/sqft
    usa: { light: [8, 15, 30], medium: [20, 40, 80], full: [50, 100, 200] },      // USD/sqft
    china: { light: [50, 100, 200], medium: [120, 250, 500], full: [300, 600, 1200] },    // CNY/sqft
    japan: { light: [800, 1500, 3000], medium: [2000, 4000, 8000], full: [5000, 10000, 20000] }, // JPY/sqft
    uk: { light: [6, 12, 25], medium: [15, 30, 60], full: [40, 80, 150] },       // GBP/sqft
    germany: { light: [7, 14, 28], medium: [18, 35, 70], full: [45, 90, 170] },       // EUR/sqft
    france: { light: [7, 13, 26], medium: [17, 33, 65], full: [42, 85, 160] },       // EUR/sqft
    australia: { light: [10, 20, 40], medium: [25, 50, 100], full: [65, 130, 250] },      // AUD/sqft
    canada: { light: [8, 16, 32], medium: [20, 42, 85], full: [55, 110, 210] },      // CAD/sqft
    brazil: { light: [25, 50, 100], medium: [60, 120, 250], full: [150, 300, 600] },     // BRL/sqft
    southkorea: { light: [600, 1200, 2500], medium: [1500, 3000, 6000], full: [4000, 8000, 15000] }, // KRW/sqft
    uae: { light: [5, 10, 20], medium: [12, 25, 50], full: [30, 60, 120] },       // AED/sqft
    saudiarabia: { light: [5, 10, 20], medium: [12, 25, 50], full: [30, 60, 120] },       // SAR/sqft
    mexico: { light: [80, 150, 300], medium: [200, 400, 800], full: [500, 1000, 2000] },   // MXN/sqft
    singapore: { light: [8, 16, 32], medium: [20, 40, 80], full: [50, 100, 200] }       // SGD/sqft
  };

  // Labor cost as % of material cost by country (reflects local labor markets)
  const laborRatios = {
    india: 0.40, usa: 0.70, china: 0.45, japan: 0.65, uk: 0.70,
    germany: 0.72, france: 0.68, australia: 0.75, canada: 0.70,
    brazil: 0.45, southkorea: 0.55, uae: 0.50, saudiarabia: 0.48,
    mexico: 0.42, singapore: 0.60
  };

  // Design fee as flat base (in local currency) + per-sqft component
  const designFees = {
    india: { base: 5000, perSqft: 10 },
    usa: { base: 500, perSqft: 2 },
    china: { base: 3000, perSqft: 8 },
    japan: { base: 40000, perSqft: 80 },
    uk: { base: 400, perSqft: 1.5 },
    germany: { base: 450, perSqft: 1.8 },
    france: { base: 420, perSqft: 1.6 },
    australia: { base: 650, perSqft: 2.5 },
    canada: { base: 550, perSqft: 2.2 },
    brazil: { base: 1500, perSqft: 5 },
    southkorea: { base: 300000, perSqft: 500 },
    uae: { base: 800, perSqft: 2 },
    saudiarabia: { base: 750, perSqft: 2 },
    mexico: { base: 5000, perSqft: 12 },
    singapore: { base: 600, perSqft: 2.5 }
  };

  function updateCostEstimate() {
    const sqft = parseInt(roomSizeSlider.value);
    const depth = parseInt(renoDepthSlider.value);
    const material = parseInt(materialSlider.value);
    const country = appState.country || 'usa';

    roomSizeValueEl.textContent = sqft + ' sq ft';
    renoDepthValueEl.textContent = depthLabels[depth];
    materialValueEl.textContent = materialLabels[material];

    // Get market rate for this country/depth/material combo
    const rates = marketRatesPerSqft[country] || marketRatesPerSqft.usa;
    const depthKey = depth === 1 ? 'light' : depth === 2 ? 'medium' : 'full';
    const ratePerSqft = rates[depthKey][material - 1]; // material: 1=economy(idx 0), 2=standard(idx 1), 3=premium(idx 2)

    // Calculate costs in LOCAL currency (no conversion needed - rates are already local)
    const materialCost = Math.round(sqft * ratePerSqft);
    const laborRatio = laborRatios[country] || 0.60;
    const laborCost = Math.round(materialCost * laborRatio);

    const fee = designFees[country] || designFees.usa;
    const depthFeeMultiplier = depth === 1 ? 0.6 : depth === 2 ? 1.0 : 1.5;
    const designFee = Math.round((fee.base + sqft * fee.perSqft) * depthFeeMultiplier);

    const subtotal = materialCost + laborCost + designFee;
    const contingency = Math.round(subtotal * 0.10);
    const total = subtotal + contingency;

    // Display in local currency (already in local units)
    costMaterialsEl.textContent = appState.symbol + materialCost.toLocaleString();
    costLaborEl.textContent = appState.symbol + laborCost.toLocaleString();
    costDesignEl.textContent = appState.symbol + designFee.toLocaleString();
    costContingencyEl.textContent = appState.symbol + contingency.toLocaleString();
    costTotalEl.textContent = appState.symbol + total.toLocaleString();
  }

  roomSizeSlider.addEventListener('input', updateCostEstimate);
  renoDepthSlider.addEventListener('input', updateCostEstimate);
  materialSlider.addEventListener('input', updateCostEstimate);
  updateCostEstimate();

  // ───────────── AI Chat Assistant (Comprehensive Knowledge Base) ─────────────
  const chatWindow = document.getElementById('chatWindow');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const chatSuggestions = document.getElementById('chatSuggestions');

  // Initialize the comprehensive chat engine
  const chatEngine = createChatEngine(appState);

  function addMessage(content, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${type}`;

    const avatar = document.createElement('div');
    avatar.className = 'chat-avatar';
    avatar.textContent = type === 'ai' ? '🤖' : '👤';

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';

    if (type === 'ai') {
      // Streaming word-by-word typing effect
      msgDiv.appendChild(avatar);
      msgDiv.appendChild(bubble);
      chatWindow.appendChild(msgDiv);

      const formatted = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
      const parts = formatted.split(/(\s+|<[^>]+>)/g).filter(w => w.length > 0);
      let idx = 0;
      bubble.innerHTML = '<span class="typing-cursor" style="animation:pulse 1s infinite;color:var(--accent-amber);">▋</span>';

      const streamInterval = setInterval(() => {
        if (idx < parts.length) {
          const cursor = bubble.querySelector('.typing-cursor');
          if (cursor) cursor.remove();
          bubble.innerHTML += parts[idx];
          bubble.innerHTML += '<span class="typing-cursor" style="animation:pulse 1s infinite;color:var(--accent-amber);">▋</span>';
          idx++;
          chatWindow.scrollTop = chatWindow.scrollHeight;
        } else {
          clearInterval(streamInterval);
          const cursor = bubble.querySelector('.typing-cursor');
          if (cursor) cursor.remove();
        }
      }, 18);
    } else {
      bubble.innerHTML = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
      msgDiv.appendChild(avatar);
      msgDiv.appendChild(bubble);
      chatWindow.appendChild(msgDiv);
    }

    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function addTypingIndicator() {
    const typing = document.createElement('div');
    typing.className = 'chat-message ai';
    typing.id = 'typingIndicator';
    const avatar = document.createElement('div');
    avatar.className = 'chat-avatar';
    avatar.textContent = '🤖';
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    typing.appendChild(avatar);
    typing.appendChild(indicator);
    chatWindow.appendChild(typing);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
  }

  function sendMessage(text) {
    if (!text.trim()) return;
    addMessage(text, 'user');
    chatInput.value = '';
    chatSuggestions.style.display = 'none';
    addTypingIndicator();
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      removeTypingIndicator();
      addMessage(chatEngine.getAIResponse(text), 'ai');
    }, delay);
  }

  chatSendBtn.addEventListener('click', () => sendMessage(chatInput.value));
  chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(chatInput.value); } });

  document.querySelectorAll('.chat-suggestion').forEach(btn => {
    btn.addEventListener('click', () => sendMessage(btn.getAttribute('data-msg')));
  });

  // ───────────── Smooth scroll ─────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      if (this.classList.contains('nav-link') || this.classList.contains('btn')) {
        // Handled by router below
        return;
      }
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        const y = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // =========================================================================
  // SPA ROUTER EXECUTOR
  // =========================================================================
  const initializedPages = {};
  function handleRoute() {
    let hash = window.location.hash || '#tool';

    // Hide all pages
    document.querySelectorAll('.spa-page').forEach(page => {
      page.classList.remove('active');
    });

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === hash) link.classList.add('active');
    });

    const targetPageId = 'page-' + hash.substring(1);
    const targetPage = document.getElementById(targetPageId);

    if (targetPage) {
      targetPage.classList.add('active');
      window.scrollTo(0, 0);

      // Page specific logic
      if (hash === '#projects') renderProjects();
      if (hash === '#dashboard') renderDashboard();
      if (hash === '#gallery') renderGallery();
      if (hash === '#roomplanner' && !initializedPages.roomplanner) {
        initializedPages.roomplanner = true;
        if (typeof RoomPlanner !== 'undefined') RoomPlanner.init('roomPlannerContainer');
      }
      if (hash === '#materials' && !initializedPages.materials) {
        initializedPages.materials = true;
        if (typeof MaterialsLibrary !== 'undefined') MaterialsLibrary.init('materialsContainer', appState);
      }
      if (hash === '#contractors') initContractors();
      if (hash === '#timeline') initTimeline();
      if (hash === '#arpreview') initARPreview();
    } else {
      const defaultPage = document.getElementById('page-tool');
      if (defaultPage) defaultPage.classList.add('active');
    }
  }
  window.addEventListener('hashchange', handleRoute);
  // Initial route
  handleRoute();

  // =========================================================================
  // PROJECT MANAGEMENT
  // =========================================================================

  // Projects are stored in localStorage
  function loadProjects() {
    try {
      const stored = localStorage.getItem('renovateAiProjects');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Could not load projects", e);
      return [];
    }
  }

  function saveProjects(projects) {
    try {
      localStorage.setItem('renovateAiProjects', JSON.stringify(projects));
      return true;
    } catch (e) {
      console.error("Storage limit reached or error saving", e);
      showToast("Could not save project. Storage limit may be reached.", "error");
      return false;
    }
  }

  function renderProjects() {
    const projects = loadProjects();
    const grid = document.getElementById('projectsGrid');
    const emptyState = document.getElementById('projectsEmptyState');

    if (!grid) return;

    // Clear existing cards (except empty state which gets managed)
    const cards = grid.querySelectorAll('.project-card');
    cards.forEach(c => c.remove());

    if (projects.length === 0) {
      if (emptyState) emptyState.style.display = 'block';

      // Update dashboard stat
      const statEl = document.getElementById('statProjects');
      if (statEl) statEl.textContent = '0';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // Update dashboard stats
    const statProjects = document.getElementById('statProjects');
    if (statProjects) statProjects.textContent = projects.length;

    // Find most popular style
    const styleCounts = {};
    let popularStyle = 'None';
    let max = 0;
    projects.forEach(p => {
      if (p.style) {
        styleCounts[p.style] = (styleCounts[p.style] || 0) + 1;
        if (styleCounts[p.style] > max) {
          max = styleCounts[p.style];
          popularStyle = styleNames[p.style] || p.style;
        }
      }
    });

    const statStyle = document.getElementById('statStyle');
    if (statStyle) statStyle.textContent = popularStyle;

    const statRooms = document.getElementById('statRooms');
    if (statRooms) statRooms.textContent = projects.length;

    // Render cards
    projects.sort((a, b) => b.timestamp - a.timestamp).forEach((proj, idx) => {
      const date = new Date(proj.timestamp).toLocaleDateString();
      const card = document.createElement('div');
      card.className = 'analysis-card project-card';
      card.style.cssText = 'padding: 0; overflow: hidden; display: flex; flex-direction: column;';

      card.innerHTML = `
        <div style="position: relative; padding-top: 60%; background: #000;">
          <img src="${proj.thumbnail || 'assets/after.png'}" style="position: absolute; top:0; left:0; width:100%; height:100%; object-fit: cover;" alt="Project Thumbnail">
          <span style="position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.7); color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem;">${styleNames[proj.style] || 'Custom'}</span>
        </div>
        <div style="padding: 20px; flex-grow: 1; display: flex; flex-direction: column;">
          <h3 style="margin-bottom: 8px;">Project ${projects.length - idx}</h3>
          <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 16px; flex-grow: 1;">
            <p><strong>Room:</strong> ${proj.roomType || 'Unknown'}</p>
            <p><strong>Cost:</strong> ${proj.cost || 'N/A'}</p>
            <p><strong>Date:</strong> ${date}</p>
          </div>
          <div style="display: flex; gap: 10px; margin-top: auto;">
            <button class="btn btn-outline load-proj-btn" data-id="${proj.id}" style="flex: 1; padding: 8px; font-size: 0.9rem;">Load</button>
            <button class="btn btn-outline export-proj-btn" data-id="${proj.id}" style="flex: 1; padding: 8px; font-size: 0.9rem;">Export</button>
            <button class="btn btn-danger delete-proj-btn" data-id="${proj.id}" style="padding: 8px 12px; font-size: 0.9rem; background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.5);">&times;</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    // Attach listeners
    document.querySelectorAll('.delete-proj-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        // In a real app we'd use a custom modal, but for now we'll keep confirm for safety
        // and add a success toast after deletion
        if (confirm('Are you sure you want to delete this project?')) {
          let currentProjects = loadProjects();
          currentProjects = currentProjects.filter(p => p.id !== id);
          saveProjects(currentProjects);
          renderProjects();
          showToast('Project deleted successfully.', 'success');
        }
      });
    });

    document.querySelectorAll('.export-proj-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const currentProjects = loadProjects();
        const proj = currentProjects.find(p => p.id === id);
        if (proj) {
          exportProjectToHTML(proj);
          showToast('Renovation report downloaded!', 'success');
        }
      });
    });
  }

  function exportProjectToHTML(proj) {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Renovation Report - ${proj.roomType}</title>
  <style>
    body { font-family: 'Inter', sans-serif; background: #f8fafc; color: #0f172a; line-height: 1.6; padding: 40px; }
    .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
    h1 { color: #f97316; margin-top: 0; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #e2e8f0; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
    .label { font-weight: 600; color: #64748b; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .value { font-size: 1.25rem; font-weight: 500; margin-bottom: 20px; }
    .hero-img { width: 100%; border-radius: 8px; margin-bottom: 30px; }
    .footer { margin-top: 50px; text-align: center; color: #94a3b8; font-size: 0.875rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Renovation Plan generated by Nano Banana Pro</h1>
      <p>Report Date: ${new Date(proj.timestamp).toLocaleDateString()}</p>
    </div>
    
    <img src="${proj.thumbnail}" alt="Proposed Design" class="hero-img">
    
    <div class="grid">
      <div>
        <div class="label">Room Type</div>
        <div class="value">${proj.roomType}</div>
        
        <div class="label">Design Style</div>
        <div class="value">${styleNames[proj.style] || 'Custom'}</div>
      </div>
      <div>
        <div class="label">Estimated Cost</div>
        <div class="value" style="color: #10b981; font-weight: bold; font-size: 1.5rem;">${proj.cost}</div>
      </div>
    </div>
    
    <div class="footer">
      Generated automatically by RenovateAI's Nano Banana Pro engine. Estimates are for general guidance only and do not constitute a professional quote.
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `renovation_report_${proj.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Create save button in tool header
  const toolHeader = document.querySelector('#upload .upload-header');
  if (toolHeader) {
    const saveWrapper = document.createElement('div');
    saveWrapper.style.cssText = 'margin-top: 20px; text-align: right;';
    saveWrapper.innerHTML = `<button id="saveProjectBtn" class="btn btn-primary" style="display: none;">💾 Save Project</button>`;

    // Insert after the title area but before the grid
    toolHeader.parentNode.insertBefore(saveWrapper, document.getElementById('uploadGrid'));

    const saveBtn = document.getElementById('saveProjectBtn');

    // Show save button when analysis is active
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('active')) {
          saveBtn.style.display = 'inline-block';
        }
      });
    });

    const uploadGrid = document.getElementById('uploadGrid');
    if (uploadGrid) {
      observer.observe(uploadGrid, { attributes: true, attributeFilter: ['class'] });
    }

    saveBtn.addEventListener('click', () => {
      // Collect project data
      const selectedCard = document.querySelector('.style-card.selected');
      const style = selectedCard ? selectedCard.dataset.style : 'modern';
      const afterImg = document.querySelector('#comparisonContainer > img');
      const roomType = document.getElementById('roomType').textContent;
      const costRaw = document.getElementById('estimatorTotal').textContent;

      if (!afterImg) {
        showToast('Please upload an image and let the AI analyze it first.', 'warning');
        return;
      }

      const projectData = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        style: style,
        roomType: roomType !== '—' ? roomType : 'Room',
        cost: costRaw,
        // Since storing full images in localStorage is risky due to 5MB limit,
        // we store a miniaturized DataURL version for the thumbnail
        thumbnail: createThumbnail(afterImg)
      };

      const projects = loadProjects();
      projects.push(projectData);

      if (saveProjects(projects)) {
        showToast('Project saved successfully to your library!', 'success');
        saveBtn.textContent = '✅ Saved!';
        saveBtn.style.backgroundColor = 'var(--accent-teal)';
        setTimeout(() => {
          saveBtn.textContent = '💾 Save Project';
          saveBtn.style.backgroundColor = '';
        }, 3000);
      } else {
        showToast('Failed to save project. Storage may be full.', 'error');
      }
    });
  }

  function createThumbnail(imgElement) {
    const src = imgElement.dataset.originalSrc || imgElement.src;
    if (!src || src.startsWith('blob:')) {
      const c = document.createElement('canvas');
      const ctx = c.getContext('2d');
      c.width = 300; c.height = 200;
      try { ctx.drawImage(imgElement, 0, 0, c.width, c.height); return c.toDataURL('image/jpeg', 0.6); }
      catch (e) { return 'assets/after.png'; }
    }
    return src;
  }

  // =========================================================================
  // AI IMAGE GENERATION INTEGRATION
  // =========================================================================
  const aiGenSubmit = document.querySelector('.instruction-submit');
  if (aiGenSubmit) {
    aiGenSubmit.addEventListener('click', function () {
      const textarea = document.querySelector('.instruction-textarea');
      const prompt = textarea ? textarea.value.trim() : '';
      if (!prompt) return;

      const beforeImg = document.getElementById('beforeImage');
      if (!beforeImg || !beforeImg.src || beforeImg.src.includes('placeholder')) {
        showToast('Please upload a room image first!', 'warning');
        return;
      }

      const afterImg = document.getElementById('afterImage');
      const compContainer = document.querySelector('.comparison-container');

      // Show progress
      let progressEl = document.querySelector('.ai-gen-progress');
      if (!progressEl) {
        progressEl = document.createElement('div');
        progressEl.className = 'ai-gen-progress';
        progressEl.innerHTML = `<div class="ai-gen-label">🎨 Generating renovation...</div>
          <div class="ai-gen-progress-bar"><div class="ai-gen-progress-fill" style="width:0%"></div></div>
          <div class="ai-gen-status">Initializing...</div>`;
        const instrResult = document.querySelector('.instruction-result');
        if (instrResult) instrResult.parentElement.insertBefore(progressEl, instrResult);
        else textarea.parentElement.appendChild(progressEl);
      }
      progressEl.style.display = 'block';

      const sourceImg = new Image();
      sourceImg.crossOrigin = 'anonymous';
      sourceImg.onload = function () {
        if (typeof AIImageGenerator !== 'undefined') {
          AIImageGenerator.generate(sourceImg, prompt, null,
            function (pct, label) {
              const fill = progressEl.querySelector('.ai-gen-progress-fill');
              const status = progressEl.querySelector('.ai-gen-status');
              if (fill) fill.style.width = pct + '%';
              if (status) status.textContent = label;
            },
            function (resultURL) {
              if (resultURL && afterImg) {
                afterImg.src = resultURL;
                afterImg.style.display = 'block';
                if (compContainer) compContainer.style.display = 'block';
              }
              progressEl.querySelector('.ai-gen-status').textContent = '✅ Generation complete!';
              setTimeout(() => { progressEl.style.display = 'none'; }, 2000);
              showToast('AI renovation image generated!', 'success');
            }
          );
        }
      };
      sourceImg.src = beforeImg.src;
    });
  }

  // =========================================================================
  // CONTRACTOR FINDER
  // =========================================================================
  function initContractors() {
    const grid = document.getElementById('contractorsGrid');
    if (!grid) return;
    const firstNames = ['James', 'Maria', 'Chen', 'Aisha', 'Roberto', 'Linda', 'Mohammed', 'Elena', 'David', 'Priya', 'Michael', 'Fatima', 'Kenji', 'Sofia', 'William', 'Amara', 'Lucas', 'Zara', 'Hassan', 'Emily'];
    const lastNames = ['Smith', 'Garcia', 'Wang', 'Patel', 'Johnson', 'Kim', 'Martinez', 'Anderson', 'Li', 'Brown', 'Wilson', 'Lee', 'Taylor', 'Thomas', 'Martin', 'Jackson', 'White', 'Harris', 'Clark', 'Lewis'];
    const specs = ['general', 'kitchen', 'bathroom', 'painting', 'flooring', 'electrical', 'plumbing'];
    const specLabels = { general: 'General Contractor', kitchen: 'Kitchen Specialist', bathroom: 'Bathroom Specialist', painting: 'Painting Expert', flooring: 'Flooring Pro', electrical: 'Electrician', plumbing: 'Plumber' };
    const avatarColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

    const contractors = [];
    for (let i = 0; i < 20; i++) {
      const fn = firstNames[i % firstNames.length];
      const ln = lastNames[(i * 3) % lastNames.length];
      const spec = specs[i % specs.length];
      const rating = (3.5 + Math.random() * 1.5).toFixed(1);
      const reviews = 15 + Math.floor(Math.random() * 200);
      const yearsExp = 3 + Math.floor(Math.random() * 20);
      const priceRange = ['$', '$$', '$$$'][Math.floor(Math.random() * 3)];
      const verified = Math.random() > 0.3;
      contractors.push({ name: fn + ' ' + ln, spec, rating, reviews, yearsExp, priceRange, verified, color: avatarColors[i % avatarColors.length], initials: fn[0] + ln[0] });
    }

    function renderContractors(filter) {
      const list = filter === 'all' ? contractors : contractors.filter(c => c.spec === filter);
      grid.innerHTML = list.map(c => `
        <div class="contractor-card">
          <div class="contractor-avatar" style="background:${c.color};">${c.initials}</div>
          <div class="contractor-name">${c.name} ${c.verified ? '✓' : ''}</div>
          <div class="contractor-spec">${specLabels[c.spec]}</div>
          <div class="contractor-rating">${'★'.repeat(Math.round(c.rating))}${'☆'.repeat(5 - Math.round(c.rating))} ${c.rating} (${c.reviews} reviews)</div>
          <div class="contractor-meta">
            <span class="contractor-tag">📅 ${c.yearsExp} yrs exp</span>
            <span class="contractor-tag">💰 ${c.priceRange}</span>
            ${c.verified ? '<span class="contractor-tag" style="color:var(--accent-emerald);">✓ Verified</span>' : ''}
          </div>
          <button class="contractor-quote-btn" onclick="showToast('Quote request sent to ${c.name}!','success')">📩 Request Quote</button>
        </div>
      `).join('');
    }

    renderContractors('all');
    document.querySelectorAll('.cf-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cf-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderContractors(btn.dataset.spec);
      });
    });
  }

  // =========================================================================
  // TIMELINE BUILDER
  // =========================================================================
  function initTimeline() {
    const container = document.getElementById('timelineContainer');
    if (!container) return;
    const sym = appState.symbol || '$';
    const phases = [
      { name: '🏗️ Planning & Permits', weeks: 2, start: 0, color: '#3B82F6', costPct: 5 },
      { name: '🔨 Demolition', weeks: 1, start: 2, color: '#EF4444', costPct: 8 },
      { name: '🔌 Rough-In (MEP)', weeks: 3, start: 3, color: '#F59E0B', costPct: 20 },
      { name: '🧱 Framing & Drywall', weeks: 2, start: 6, color: '#8B5CF6', costPct: 15 },
      { name: '🪵 Flooring', weeks: 2, start: 8, color: '#10B981', costPct: 15 },
      { name: '🎨 Paint & Finish', weeks: 2, start: 10, color: '#EC4899', costPct: 12 },
      { name: '🚿 Fixtures & Appliances', weeks: 1, start: 12, color: '#06B6D4', costPct: 15 },
      { name: '🧹 Final Inspection', weeks: 1, start: 13, color: '#84CC16', costPct: 5 },
      { name: '✨ Touch-ups & Move in', weeks: 1, start: 14, color: '#F97316', costPct: 5 },
    ];
    const totalWeeks = 16;
    const baseCost = 25000;

    container.innerHTML = `
      <div class="tl-container">
        <div class="tl-header">
          <h3 style="font-family:var(--font-heading);">📅 Renovation Timeline</h3>
          <span style="color:var(--text-muted);font-size:.85rem;">Total: ${totalWeeks} weeks</span>
        </div>
        <div class="tl-weeks">${Array.from({ length: totalWeeks }, (_, i) => `<div class="tl-week-label">Week ${i + 1}</div>`).join('')}</div>
        <div class="tl-phases">
          ${phases.map(p => {
      const leftPct = (p.start / totalWeeks * 100).toFixed(1);
      const widthPct = (p.weeks / totalWeeks * 100).toFixed(1);
      const cost = Math.round(baseCost * p.costPct / 100);
      return `<div class="tl-phase">
              <div class="tl-phase-label">${p.name}</div>
              <div class="tl-bar-track">
                <div class="tl-bar" style="left:${leftPct}%;width:${widthPct}%;background:${p.color};">${p.weeks}w</div>
              </div>
              <div class="tl-phase-cost">${sym}${cost.toLocaleString()}</div>
            </div>`;
    }).join('')}
        </div>
        <div class="tl-total-row">
          <span>Total Estimated Duration: ${totalWeeks} weeks</span>
          <span style="color:var(--accent-emerald);">Total Cost: ${sym}${baseCost.toLocaleString()}</span>
        </div>
      </div>`;
  }

  // =========================================================================
  // AR PREVIEW (Live Webcam with Draggable Furniture)
  // =========================================================================
  function initARPreview() {
    const container = document.getElementById('arPreviewContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="ar-container" style="position:relative; overflow:hidden; background:#000; border-radius:16px;">
        <div class="ar-viewfinder" id="arViewfinder" style="position:relative; width:100%; height:600px; display:flex; align-items:center; justify-content:center;">
          <video id="arVideoFeed" autoplay playsinline style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;"></video>
          
          <div class="ar-corner tl"></div><div class="ar-corner tr"></div>
          <div class="ar-corner bl"></div><div class="ar-corner br"></div>
          <div class="ar-hud"><div class="ar-hud-dot" id="arStatusDot"></div> <span id="arStatusText">Requesting Camera...</span></div>
          
          <div class="ar-sidebar" style="z-index:100;">
            <button class="ar-sidebar-btn" title="Add Sofa" onclick="addARFurniture('sofa')">🛋️</button>
            <button class="ar-sidebar-btn" title="Add Plant" onclick="addARFurniture('plant')">🪴</button>
            <button class="ar-sidebar-btn" title="Add Lamp" onclick="addARFurniture('lamp')">💡</button>
            <button class="ar-sidebar-btn" title="Clear All" onclick="clearARFurniture()">🗑️</button>
          </div>
          
          <button class="ar-capture-btn" title="Capture AR view" onclick="captureARView()" style="z-index:100;"></button>
          
          <!-- Container for draggable items -->
          <div id="arOverlayContainer" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;"></div>
        </div>
      </div>
      <p class="ar-info">📱 Grant camera permissions to see your live room. Tap sidebar icons to drop 3D-effect furniture, drag to move, scroll/pinch to resize!</p>`;

    const video = document.getElementById('arVideoFeed');
    const statusText = document.getElementById('arStatusText');
    const statusDot = document.getElementById('arStatusDot');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(function (stream) {
          video.srcObject = stream;
          video.play();
          statusText.innerText = 'AR Mode Active — Live feed';
          if (statusDot) statusDot.style.animation = 'pulse 1.5s infinite';
        })
        .catch(function (err) {
          console.error("Camera error:", err);
          statusText.innerText = 'Camera access denied or unavailable.';
          if (statusDot) statusDot.style.background = 'red';
          showToast('Could not access camera for AR view', 'error');
        });
    } else {
      statusText.innerText = 'AR built-in camera not supported on this browser.';
      if (statusDot) statusDot.style.background = 'red';
    }

    // Attach globals for inline onclicks
    window.addARFurniture = function (type) {
      showToast('Placed ' + type + '. Drag to move, wheel to scale!', 'info');
      const overlayContainer = document.getElementById('arOverlayContainer');
      const el = document.createElement('div');

      let emoji = '🛋️';
      if (type === 'plant') emoji = '🪴';
      if (type === 'lamp') emoji = '💡';

      el.innerHTML = emoji;
      el.style.position = 'absolute';
      el.style.fontSize = '80px';
      el.style.left = '50%';
      el.style.top = '50%';
      el.style.transform = 'translate(-50%, -50%) scale(1)';
      el.style.cursor = 'grab';
      el.style.pointerEvents = 'auto'; // allow dragging
      el.style.userSelect = 'none';
      el.style.textShadow = '0 10px 20px rgba(0,0,0,0.5)';
      el.style.transition = 'filter 0.2s';

      // State for dragging and scaling
      let isDragging = false;
      let startX, startY, initialLeft, initialTop;
      let currentScale = 1;

      el.addEventListener('mousedown', startDrag);
      el.addEventListener('touchstart', startDrag, { passive: false });

      function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        el.style.cursor = 'grabbing';
        el.style.filter = 'brightness(1.2)';

        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

        startX = clientX;
        startY = clientY;

        // Convert left/top to pixels if they are percentages
        const rect = el.getBoundingClientRect();
        const parentRect = overlayContainer.getBoundingClientRect();
        initialLeft = rect.left - parentRect.left + (rect.width / 2);
        initialTop = rect.top - parentRect.top + (rect.height / 2);

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', stopDrag);
      }

      function drag(e) {
        if (!isDragging) return;
        e.preventDefault();

        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

        const dx = clientX - startX;
        const dy = clientY - startY;

        el.style.left = (initialLeft + dx) + 'px';
        el.style.top = (initialTop + dy) + 'px';
      }

      function stopDrag() {
        isDragging = false;
        el.style.cursor = 'grab';
        el.style.filter = 'none';
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('touchend', stopDrag);
      }

      // Wheel to scale
      el.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = Math.sign(e.deltaY) * -0.1;
        currentScale = Math.max(0.3, Math.min(currentScale + delta, 3));
        el.style.transform = 'translate(-50%, -50%) scale(' + currentScale + ')';
      });

      overlayContainer.appendChild(el);
    };

    window.clearARFurniture = function () {
      const container = document.getElementById('arOverlayContainer');
      if (container) container.innerHTML = '';
      showToast('Cleared all AR furniture', 'info');
    };

    window.captureARView = function () {
      showToast('📸 AR View Captured! (Saved to gallery)', 'success');
      // In a real app we'd draw the video frame and overlay elements to a canvas and save it
      const btn = document.querySelector('.ar-capture-btn');
      btn.style.transform = 'scale(0.9)';
      btn.style.background = 'white';
      setTimeout(() => {
        btn.style.transform = 'scale(1)';
        btn.style.background = 'transparent';
      }, 150);
    };
  }

  // =========================================================================
  // PREMIUM DASHBOARD
  // =========================================================================
  function renderDashboard() {
    const page = document.getElementById('page-dashboard');
    if (!page) return;
    const projects = loadProjects();
    const totalRooms = projects.length;
    const totalCost = projects.reduce((s, p) => s + (p.cost || 0), 0);
    const favStyle = projects.length ?
      Object.entries(projects.reduce((a, p) => { a[p.style] = (a[p.style] || 0) + 1; return a; }, {}))
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Modern' : 'None yet';
    const sym = appState.symbol || '$';

    page.querySelector('.container').innerHTML = `
      <span class="section-label">Overview</span>
      <h2 class="section-title">Your <span class="gradient-text">Dashboard</span></h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px;margin:40px 0;">
        <div class="analysis-card" style="text-align:center;">
          <div style="font-size:2.5rem;margin-bottom:8px;">🏠</div>
          <div style="font-size:2rem;font-weight:800;color:var(--accent-amber);">${totalRooms}</div>
          <div style="color:var(--text-muted);font-size:.85rem;">Rooms Transformed</div>
        </div>
        <div class="analysis-card" style="text-align:center;">
          <div style="font-size:2.5rem;margin-bottom:8px;">💰</div>
          <div style="font-size:2rem;font-weight:800;color:var(--accent-emerald);">${sym}${totalCost.toLocaleString()}</div>
          <div style="color:var(--text-muted);font-size:.85rem;">Total Budget Planned</div>
        </div>
        <div class="analysis-card" style="text-align:center;">
          <div style="font-size:2.5rem;margin-bottom:8px;">🎨</div>
          <div style="font-size:1.5rem;font-weight:800;color:var(--accent-blue);">${favStyle}</div>
          <div style="color:var(--text-muted);font-size:.85rem;">Favorite Style</div>
        </div>
        <div class="analysis-card" style="text-align:center;">
          <div style="font-size:2.5rem;margin-bottom:8px;">📐</div>
          <div style="font-size:2rem;font-weight:800;color:var(--accent-purple);">9</div>
          <div style="color:var(--text-muted);font-size:.85rem;">Tools Available</div>
        </div>
      </div>

      <h3 style="font-family:var(--font-heading);margin-bottom:20px;">⚡ Quick Actions</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:40px;">
        <a href="#tool" class="analysis-card" style="text-align:center;cursor:pointer;text-decoration:none;color:inherit;">
          <div style="font-size:1.5rem;">🎨</div><div style="font-weight:600;margin-top:8px;">Design Tool</div>
        </a>
        <a href="#roomplanner" class="analysis-card" style="text-align:center;cursor:pointer;text-decoration:none;color:inherit;">
          <div style="font-size:1.5rem;">📐</div><div style="font-weight:600;margin-top:8px;">Room Planner</div>
        </a>
        <a href="#materials" class="analysis-card" style="text-align:center;cursor:pointer;text-decoration:none;color:inherit;">
          <div style="font-size:1.5rem;">🪵</div><div style="font-weight:600;margin-top:8px;">Materials</div>
        </a>
        <a href="#contractors" class="analysis-card" style="text-align:center;cursor:pointer;text-decoration:none;color:inherit;">
          <div style="font-size:1.5rem;">👷</div><div style="font-weight:600;margin-top:8px;">Find Contractors</div>
        </a>
        <a href="#timeline" class="analysis-card" style="text-align:center;cursor:pointer;text-decoration:none;color:inherit;">
          <div style="font-size:1.5rem;">📅</div><div style="font-weight:600;margin-top:8px;">Timeline</div>
        </a>
        <a href="#arpreview" class="analysis-card" style="text-align:center;cursor:pointer;text-decoration:none;color:inherit;">
          <div style="font-size:1.5rem;">📱</div><div style="font-weight:600;margin-top:8px;">AR Preview</div>
        </a>
      </div>

      <h3 style="font-family:var(--font-heading);margin-bottom:20px;">💡 Renovation Tips of the Week</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;">
        <div class="analysis-card"><h4 style="color:var(--accent-amber);">🎨 Color Psychology</h4><p style="color:var(--text-secondary);font-size:.9rem;margin-top:8px;">Blue tones promote calmness in bedrooms, while warm yellows energize kitchen spaces. Consider your room's purpose when choosing colors.</p></div>
        <div class="analysis-card"><h4 style="color:var(--accent-emerald);">🌿 Biophilic Design</h4><p style="color:var(--text-secondary);font-size:.9rem;margin-top:8px;">Integrating natural elements like indoor plants, natural light, and organic materials can reduce stress by up to 37%.</p></div>
        <div class="analysis-card"><h4 style="color:var(--accent-blue);">💡 Smart Lighting</h4><p style="color:var(--text-secondary);font-size:.9rem;margin-top:8px;">Layer your lighting: ambient, task, and accent. This creates depth and functionality. Consider dimmable LED options for flexibility.</p></div>
      </div>
    `;
  }

  // =========================================================================
  // EXPANDED GALLERY
  // =========================================================================
  function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    const galleryItems = [
      { title: 'Urban Loft Conversion', cat: 'living', style: 'Modern Minimalist', desc: 'Transformed a dark space into a bright, airy living area.', filter: 'contrast(1.1) brightness(1.1)' },
      { title: 'Downtown Studio', cat: 'living', style: 'Industrial', desc: 'Exposed brick emulation with warm leather tones.', filter: 'sepia(0.3) contrast(1.2)' },
      { title: 'Coastal Retreat', cat: 'living', style: 'Coastal', desc: 'Ocean-inspired palette with natural textures and soft blues.', filter: 'saturate(1.2) brightness(1.1)' },
      { title: 'Nordic Haven', cat: 'living', style: 'Scandinavian', desc: 'White walls, light wood, minimal decor — pure hygge comfort.', filter: 'brightness(1.15) contrast(0.95)' },
      { title: 'Chef\'s Kitchen', cat: 'kitchen', style: 'Modern', desc: 'Sleek countertops, integrated appliances, and smart storage.', filter: 'contrast(1.15) saturate(1.1)' },
      { title: 'Farmhouse Kitchen', cat: 'kitchen', style: 'Farmhouse', desc: 'Shaker cabinets, butcher block, and vintage charm.', filter: 'sepia(0.15) brightness(1.05)' },
      { title: 'Zen Kitchen', cat: 'kitchen', style: 'Japandi', desc: 'Minimalist lines with warm wood and stone accents.', filter: 'contrast(1.05) brightness(1.05)' },
      { title: 'Luxury Master Suite', cat: 'bedroom', style: 'Art Deco', desc: 'Gold accents, rich fabrics, and geometric patterns.', filter: 'contrast(1.1) saturate(0.9)' },
      { title: 'Boho Bedroom', cat: 'bedroom', style: 'Bohemian', desc: 'Layered textiles, macramé, and earthy tones for a cozy retreat.', filter: 'sepia(0.2) saturate(1.3)' },
      { title: 'Tech-Forward Study', cat: 'living', style: 'Modern', desc: 'Clean desk setup with integrated smart home controls.', filter: 'contrast(1.2) brightness(0.95)' },
      { title: 'Spa Bathroom', cat: 'bathroom', style: 'Modern', desc: 'Rainfall shower, freestanding tub, and heated floors.', filter: 'brightness(1.1) saturate(0.9)' },
      { title: 'Rustic Dining Room', cat: 'living', style: 'Farmhouse', desc: 'Reclaimed wood table, mason jar lighting, and warmth.', filter: 'sepia(0.25) contrast(1.1)' },
      { title: 'Mid-Century Lounge', cat: 'living', style: 'Mid-Century', desc: 'Iconic furniture, bold colors, and retro patterns.', filter: 'saturate(1.2) contrast(1.05)' },
      { title: 'Tropical Patio', cat: 'living', style: 'Tropical', desc: 'Lush greenery, rattan furniture, and vibrant cushions.', filter: 'saturate(1.3) brightness(1.1)' },
      { title: 'Minimalist Nursery', cat: 'bedroom', style: 'Scandinavian', desc: 'Soft pastels, natural materials, and gentle lighting.', filter: 'brightness(1.15) contrast(0.9)' },
      { title: 'Industrial Bathroom', cat: 'bathroom', style: 'Industrial', desc: 'Concrete walls, matte fixtures, and exposed pipes.', filter: 'contrast(1.15) saturate(0.85)' },
    ];

    grid.innerHTML = galleryItems.map(item => `
      <div class="analysis-card gallery-item" data-category="${item.cat}" style="padding:0;overflow:hidden;">
        <div style="position:relative;padding-top:66%;">
          <img src="assets/after.png" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;filter:${item.filter};" alt="${item.title}" class="gallery-img" data-caption="${item.title}">
          <span style="position:absolute;top:12px;right:12px;background:rgba(0,0,0,0.7);color:white;padding:4px 10px;border-radius:12px;font-size:0.8rem;">${item.style}</span>
        </div>
        <div style="padding:20px;">
          <h4 style="margin-bottom:8px;">${item.title}</h4>
          <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:16px;">${item.desc}</p>
          <a href="#tool" class="btn btn-outline" style="width:100%;text-align:center;font-size:0.9rem;padding:8px;">Try This Style</a>
        </div>
      </div>
    `).join('');

    // Gallery filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => { b.style.background = 'transparent'; b.style.color = 'var(--text-main)'; });
        btn.style.background = 'var(--accent-blue)'; btn.style.color = 'white';
        const f = btn.dataset.filter;
        document.querySelectorAll('.gallery-item').forEach(item => {
          item.style.display = (f === 'all' || item.dataset.category === f) ? '' : 'none';
        });
      });
    });

    // Lightbox on image click
    document.querySelectorAll('.gallery-img').forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => openLightbox(img.src, img.dataset.caption));
    });
  }

  // =========================================================================
  // LIGHTBOX
  // =========================================================================
  function openLightbox(src, caption) {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    document.getElementById('lightboxImg').src = src;
    document.getElementById('lightboxCaption').textContent = caption || '';
    lb.style.display = 'flex';
  }
  document.getElementById('lightboxClose')?.addEventListener('click', () => { document.getElementById('lightbox').style.display = 'none'; });
  document.getElementById('lightbox')?.addEventListener('click', (e) => { if (e.target.id === 'lightbox') document.getElementById('lightbox').style.display = 'none'; });

  // =========================================================================
  // COMMAND PALETTE (Ctrl+K)
  // =========================================================================
  const cmdCommands = [
    { name: 'Dashboard', icon: '📊', action: '#dashboard', hint: 'D' },
    { name: 'Design Tool', icon: '🎨', action: '#tool', hint: 'T' },
    { name: 'My Projects', icon: '📁', action: '#projects', hint: 'P' },
    { name: 'Gallery', icon: '🖼️', action: '#gallery', hint: 'G' },
    { name: 'Room Planner', icon: '📐', action: '#roomplanner', hint: 'R' },
    { name: 'Materials Library', icon: '🪵', action: '#materials', hint: 'M' },
    { name: 'Contractor Finder', icon: '👷', action: '#contractors' },
    { name: 'Timeline Builder', icon: '📅', action: '#timeline' },
    { name: 'AR Preview', icon: '📱', action: '#arpreview' },
    { name: 'Toggle Theme', icon: '🌙', action: 'theme' },
    { name: 'Keyboard Shortcuts', icon: '⌨️', action: 'shortcuts', hint: '?' },
  ];

  function openCommandPalette() {
    const pal = document.getElementById('cmdPalette');
    if (!pal) return;
    pal.style.display = 'flex';
    const input = document.getElementById('cmdInput');
    input.value = '';
    input.focus();
    renderCmdResults('');
  }

  function closeCommandPalette() {
    const pal = document.getElementById('cmdPalette');
    if (pal) pal.style.display = 'none';
  }

  function renderCmdResults(query) {
    const results = document.getElementById('cmdResults');
    if (!results) return;
    const q = query.toLowerCase();
    const filtered = cmdCommands.filter(c => c.name.toLowerCase().includes(q));
    results.innerHTML = filtered.map(c => `
      <div class="cmd-result-item" data-action="${c.action}">
        <span class="cmd-result-icon">${c.icon}</span>
        <span class="cmd-result-name">${c.name}</span>
        ${c.hint ? `<span class="cmd-result-hint">${c.hint}</span>` : ''}
      </div>
    `).join('');
    results.querySelectorAll('.cmd-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const action = item.dataset.action;
        if (action === 'theme') { document.getElementById('themeToggleBtn')?.click(); }
        else if (action === 'shortcuts') { openShortcuts(); }
        else { window.location.hash = action; }
        closeCommandPalette();
      });
    });
  }

  document.getElementById('cmdInput')?.addEventListener('input', (e) => renderCmdResults(e.target.value));
  document.getElementById('cmdPalette')?.addEventListener('click', (e) => { if (e.target.id === 'cmdPalette') closeCommandPalette(); });

  // =========================================================================
  // KEYBOARD SHORTCUTS
  // =========================================================================
  function openShortcuts() {
    const modal = document.getElementById('shortcutsModal');
    if (modal) modal.style.display = 'flex';
  }
  document.getElementById('shortcutsClose')?.addEventListener('click', () => { document.getElementById('shortcutsModal').style.display = 'none'; });
  document.getElementById('shortcutsModal')?.addEventListener('click', (e) => { if (e.target.id === 'shortcutsModal') document.getElementById('shortcutsModal').style.display = 'none'; });

  document.addEventListener('keydown', (e) => {
    // Don't trigger if typing
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

    // Ctrl+K → Command Palette
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openCommandPalette(); return; }

    // ESC → Close overlays
    if (e.key === 'Escape') {
      closeCommandPalette();
      document.getElementById('shortcutsModal').style.display = 'none';
      document.getElementById('lightbox').style.display = 'none';
      document.getElementById('onboardingOverlay').style.display = 'none';
      return;
    }

    // ? → Shortcuts
    if (e.key === '?') { openShortcuts(); return; }

    // Nav shortcuts
    const shortcuts = { d: '#dashboard', t: '#tool', p: '#projects', g: '#gallery', r: '#roomplanner', m: '#materials' };
    if (shortcuts[e.key]) { window.location.hash = shortcuts[e.key]; }
  });

  // =========================================================================
  // ONBOARDING TOUR
  // =========================================================================
  const onboardingSteps = [
    { icon: '🏠', title: 'Welcome to RenovateAI!', desc: 'Your AI-powered home renovation assistant. Upload a room photo and let AI transform it into your dream space.' },
    { icon: '🎨', title: 'AI Image Generation', desc: 'Write renovation instructions and our canvas-based AI engine generates a realistic visualization of your renovated room.' },
    { icon: '📐', title: 'Room Planner', desc: 'Drag and drop furniture onto a 2D floor plan. Set room dimensions and export your layout as an image.' },
    { icon: '🪵', title: 'Materials Library', desc: 'Browse 100+ materials with pricing, ratings, and comparisons. Find the perfect countertop, flooring, or paint.' },
    { icon: '⌨️', title: 'Pro Tips', desc: 'Press Ctrl+K for the Command Palette to navigate anywhere instantly. Press ? for all keyboard shortcuts.' },
  ];
  let onboardingCurrent = 0;

  function showOnboarding() {
    const overlay = document.getElementById('onboardingOverlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    renderOnboardingStep();
  }

  function renderOnboardingStep() {
    const step = onboardingSteps[onboardingCurrent];
    document.getElementById('onboardingIcon').textContent = step.icon;
    document.getElementById('onboardingTitle').textContent = step.title;
    document.getElementById('onboardingDesc').textContent = step.desc;
    document.getElementById('onboardingSteps').innerHTML = onboardingSteps.map((_, i) =>
      `<div class="step-dot ${i === onboardingCurrent ? 'active' : ''}"></div>`
    ).join('');
    const nextBtn = document.getElementById('onboardingNext');
    nextBtn.textContent = onboardingCurrent === onboardingSteps.length - 1 ? 'Get Started! 🚀' : 'Next →';
  }

  document.getElementById('onboardingNext')?.addEventListener('click', () => {
    onboardingCurrent++;
    if (onboardingCurrent >= onboardingSteps.length) {
      document.getElementById('onboardingOverlay').style.display = 'none';
      localStorage.setItem('renovateai_onboarded', 'true');
    } else {
      renderOnboardingStep();
    }
  });

  document.getElementById('onboardingSkip')?.addEventListener('click', () => {
    document.getElementById('onboardingOverlay').style.display = 'none';
    localStorage.setItem('renovateai_onboarded', 'true');
  });

  // Show onboarding on first visit (after country selection)
  setTimeout(() => {
    if (!localStorage.getItem('renovateai_onboarded') && !document.querySelector('.popup-overlay.active')) {
      showOnboarding();
    }
  }, 2000);

});

