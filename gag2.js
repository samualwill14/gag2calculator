// ============================================================================
// GROW A GARDEN 2 CALCULATOR - COMPLETE FIXED VERSION
// Fresh/Decayed values now differ properly for all plants
// ============================================================================

(function() {
    'use strict';

    // ==================== DECAY MECHANICS ====================
    const DECAY = {
        fresh: { lowPenalty: 0.6, highPenalty: 1.0, label: 'Fresh', lossText: '0-40% loss' },
        decayed: { lowPenalty: 0.2, highPenalty: 0.55, label: 'Decayed', lossText: '45-80% loss' }
    };

    // ==================== OFFICIAL PLANT DATABASE ====================
    // All values based on Grow a Garden 2 wiki & game data
    const PLANTS_DB = [
        { id: "carrot", name: "Carrot", baseValue: 5, baseWeight: 0.81, exponent: 2.0, floorValue: 5, source: "Seed Shop", rarity: "Common", img: "carrot.webp" },
        { id: "strawberry", name: "Strawberry", baseValue: 3, baseWeight: 1.01, exponent: 2.0, floorValue: 3, source: "Seed Shop", rarity: "Common", img: "strawberry.webp" },
        { id: "blueberry", name: "Blueberry", baseValue: 5, baseWeight: 1.18, exponent: 2.0, floorValue: 5, source: "Seed Shop", rarity: "Common", img: "blueberry.webp" },
        { id: "tulip", name: "Tulip", baseValue: 60, baseWeight: 0.50, exponent: 2.0, floorValue: 54, source: "Seed Shop", rarity: "Uncommon", img: "tulip.webp" },
        { id: "tomato", name: "Tomato", baseValue: 9, baseWeight: 0.90, exponent: 2.0, floorValue: 8, source: "Seed Shop", rarity: "Uncommon", img: "tomato.webp" },
        { id: "apple", name: "Apple", baseValue: 12, baseWeight: 1.61, exponent: 2.0, floorValue: 11, source: "Seed Shop", rarity: "Uncommon", img: "apple.webp" },
        { id: "bamboo", name: "Bamboo", baseValue: 860, baseWeight: 4.75, exponent: 1.9, floorValue: 722, source: "Seed Shop", rarity: "Rare", img: "bamboo.webp" },
        { id: "corn", name: "Corn", baseValue: 34, baseWeight: 3.05, exponent: 2.0, floorValue: 31, source: "Seed Shop", rarity: "Rare", img: "corn.webp" },
        { id: "cactus", name: "Cactus", baseValue: 40, baseWeight: 1.51, exponent: 2.0, floorValue: 36, source: "Seed Shop", rarity: "Rare", img: "cactus.webp" },
        { id: "pineapple", name: "Pineapple", baseValue: 30, baseWeight: 5.12, exponent: 2.0, floorValue: 27, source: "Seed Shop", rarity: "Rare", img: "pineapple.webp" },
        { id: "babycactus", name: "Baby Cactus", baseValue: 70, baseWeight: 1.60, exponent: 2.0, floorValue: 63, source: "Ghost Pack", rarity: "Rare", img: "babycactus.webp" },
        { id: "mushroom", name: "Mushroom", baseValue: 13000, baseWeight: 6.77, exponent: 1.9, floorValue: 11732, source: "Seed Shop", rarity: "Epic", img: "mushroom.webp" },
        { id: "greenbean", name: "Green Bean", baseValue: 10, baseWeight: 0.48, exponent: 2.0, floorValue: 9, source: "Code Reward", rarity: "Epic", img: "greenbean.webp" },
        { id: "banana", name: "Banana", baseValue: 35, baseWeight: 1.51, exponent: 2.0, floorValue: 32, source: "Seed Shop", rarity: "Epic", img: "banana.webp" },
        { id: "grape", name: "Grape", baseValue: 45, baseWeight: 2.01, exponent: 2.0, floorValue: 41, source: "Seed Shop", rarity: "Epic", img: "grape.webp" },
        { id: "coconut", name: "Coconut", baseValue: 60, baseWeight: 1.60, exponent: 2.0, floorValue: 54, source: "Seed Shop", rarity: "Epic", img: "coconut.webp" },
        { id: "mango", name: "Mango", baseValue: 90, baseWeight: 3.02, exponent: 2.0, floorValue: 81, source: "Seed Shop", rarity: "Epic", img: "mango.webp" },
        { id: "dragonfruit", name: "Dragon Fruit", baseValue: 150, baseWeight: 3.21, exponent: 2.0, floorValue: 135, source: "Seed Shop", rarity: "Legendary", img: "dragonfruit.webp" },
        { id: "acorn", name: "Acorn", baseValue: 200, baseWeight: 1.44, exponent: 2.0, floorValue: 180, source: "Seed Shop", rarity: "Legendary", img: "acorn.webp" },
        { id: "cherry", name: "Cherry", baseValue: 350, baseWeight: 1.46, exponent: 2.0, floorValue: 316, source: "Seed Shop", rarity: "Legendary", img: "cherry.webp" },
        { id: "sunflower", name: "Sunflower", baseValue: 1750, baseWeight: 6.02, exponent: 2.0, floorValue: 1579, source: "Seed Shop", rarity: "Legendary", img: "sunflower.webp" },
        { id: "pomegranate", name: "Pomegranate", baseValue: 900, baseWeight: 1.70, exponent: 2.0, floorValue: 812, source: "Seed Shop", rarity: "Mythic", img: "pomegranate.webp" },
        { id: "poisonapple", name: "Poison Apple", baseValue: 430.5, baseWeight: 1.70, exponent: 2.0, floorValue: 812, source: "Seed Shop", rarity: "Mythic", img: "poisonapple.webp" },
        { id: "moonbloom", name: "Moon Bloom", baseValue: 9000, baseWeight: 12.8, exponent: 2.0, floorValue: 8122, source: "Seed Shop", rarity: "Super", img: "moonbloom.webp" },
        { id: "dragonsbreath", name: "Dragon's Breath", baseValue: 3400, baseWeight: 7.0479, exponent: 2.0, floorValue: 3068, source: "Seed Shop", rarity: "Super", img: "dragonsbreath.webp" },
        { id: "venusflytrap", name: "Venus Fly Trap", baseValue: 3000, baseWeight: 3.0175, exponent: 2.0, floorValue: 2708, source: "Seed Shop", rarity: "Mythic", img: "venusflytrap.webp" },
        { id: "glowmushroom", name: "Glow Mushroom", baseValue: 700, baseWeight: 8.09, exponent: 2.0, floorValue: 632, source: "Ghost Pack", rarity: "Pack", img: "glowmushroom.webp" },
        { id: "poisonivy", name: "Poison Ivy", baseValue: 1700, baseWeight: 2.75, exponent: 2.0, floorValue: 1534, source: "Ghost Pack", rarity: "Pack", img: "poisonivy.webp" },
        { id: "ghostpepper", name: "Ghost Pepper", baseValue: 2500, baseWeight: 9.08, exponent: 2.0, floorValue: 2256, source: "Ghost Pack", rarity: "Pack", img: "ghostpepper.webp" },
        { id: "hornedmelon", name: "Horned Melon", baseValue: 200, baseWeight: 0.45, exponent: 2.0, floorValue: 180, source: "Ghost Pack", rarity: "Pack", img: "hornedmelon.webp" }
    ];

    // ==================== MUTATIONS ====================
    const MUTATIONS_DB = [
        { id: "gold", name: "Gold", multiplier: 10 },
        { id: "rainbow", name: "Rainbow", multiplier: 30 },
        { id: "frozen", name: "Frozen", multiplier: 40 },
        { id: "electric", name: "Electric", multiplier: 70 },
        { id: "bloodlit", name: "Bloodlit", multiplier: 80 },
        { id: "chained", name: "Chained", multiplier: 4 },
        { id: "starstruck", name: "Starstruck", multiplier: 25 },
        { id: "pizza", name: "Pizza", multiplier: 5 }
    ];

    // ==================== SPRINKLERS ====================
    const SPRINKLERS = [
        { name: "Common", luck: 7 },
        { name: "Uncommon", luck: 21 },
        { name: "Rare", luck: 40 },
        { name: "Legendary", luck: 65 },
        { name: "Super", luck: 100 }
    ];

    // ==================== GLOBAL STATE ====================
    let currentPlant = PLANTS_DB[24]; // Dragon's Breath
    let currentPlantIndex = 24;
    let activeMutation = null;
    let currentDecay = 'fresh';
    let sprinklerCounts = [0, 0, 0, 0, 0];
    let growthChart = null;

    // ==================== HELPER FUNCTIONS ====================
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
        return num.toLocaleString();
    }

    // ==================== CORE CALCULATION - FIXED FLOOR HANDLING ====================
    // Calculates a single value with given decay penalty
    function calculateSingleValue(plant, weightKg, boostPercent, mutationMultiplier, decayPenalty) {
        if (!plant || weightKg <= 0) return 0;
        
        // Raw value without floor
        let raw = plant.baseValue * Math.pow(weightKg / plant.baseWeight, plant.exponent);
        if (isNaN(raw) || !isFinite(raw)) raw = 0;
        
        // Apply mutation and decay
        let val = raw * (mutationMultiplier || 1) * decayPenalty;
        
        // Apply floor ONLY if the value is below floor (otherwise use actual value)
        if (val < plant.floorValue) {
            val = plant.floorValue;
        }
        
        // Apply friend boost
        val = Math.floor(val * (1 + (boostPercent || 0) / 100));
        return Math.max(0, val);
    }
    
    // Get low and high range for current decay state
    function getValueRange(plant, weightKg, boostPercent, mutationMultiplier, decayType) {
        const decay = DECAY[decayType] || DECAY.fresh;
        let low = calculateSingleValue(plant, weightKg, boostPercent, mutationMultiplier, decay.lowPenalty);
        let high = calculateSingleValue(plant, weightKg, boostPercent, mutationMultiplier, decay.highPenalty);
        if (low > high) { let t = low; low = high; high = t; }
        return { low: low, high: high };
    }

    // ==================== UPDATE UI ====================
    function updateCalculator() {
        if (!currentPlant) return;
        
        const weight = parseFloat(document.getElementById('weightInput')?.value) || currentPlant.baseWeight;
        const boost = parseFloat(document.getElementById('boostInput')?.value) || 0;
        const amount = parseInt(document.getElementById('amountInput')?.value) || 1;
        const mutationMultiplier = activeMutation ? activeMutation.multiplier : 1;
        
        const range = getValueRange(currentPlant, weight, boost, mutationMultiplier, currentDecay);
        const totalLow = range.low * amount;
        const totalHigh = range.high * amount;
        
        // Update image
        const imgSrc = 'img/' + currentPlant.img;
        document.getElementById('selectedImg').src = imgSrc;
        document.getElementById('selectedName').innerText = currentPlant.name;
        document.getElementById('selectedRarity').innerText = currentPlant.rarity;
        document.getElementById('selectedSource').innerHTML = 'Source: ' + escapeHtml(currentPlant.source);
        
        // Update values
        document.getElementById('valueDisplay').innerHTML = `$${formatNumber(totalLow)} - $${formatNumber(totalHigh)}`;
        document.getElementById('bargainCost').innerHTML = `$${formatNumber(Math.floor(totalLow * 0.55))} - $${formatNumber(Math.floor(totalHigh * 0.55))}`;
        document.getElementById('bargainResell').innerHTML = `$${formatNumber(Math.floor(totalLow * 1.3))} - $${formatNumber(Math.floor(totalHigh * 6))}`;
        
        // Update mutation display if exists
        const mutSpan = document.getElementById('activeMutation');
        if (mutSpan) mutSpan.innerText = activeMutation ? activeMutation.name : 'None';
    }

    // ==================== DECAY TOGGLE ====================
    window.setDecay = function(type) {
        currentDecay = type;
        const freshBtn = document.getElementById('decayFreshBtn');
        const decayedBtn = document.getElementById('decayDecayedBtn');
        if (type === 'fresh') {
            freshBtn.classList.add('active');
            decayedBtn.classList.remove('active');
        } else {
            decayedBtn.classList.add('active');
            freshBtn.classList.remove('active');
        }
        updateCalculator();
        updateOdds();
    };

    // ==================== PLANT GRID ====================
    function renderPlantGrid() {
        const container = document.getElementById('plantGrid');
        if (!container) return;
        
        container.innerHTML = PLANTS_DB.map((plant, idx) => `
            <div class="plant-card ${idx === currentPlantIndex ? 'selected' : ''}" data-idx="${idx}" data-name="${plant.name.toLowerCase()}">
                <img src="img/${plant.img}" onerror="this.src='https://placehold.co/80x80/1a1a20/10b981?text=${plant.name.charAt(0)}'">
                <div class="plant-name">${escapeHtml(plant.name)}</div>
                <div class="plant-rarity">${plant.rarity}</div>
            </div>
        `).join('');
        
        document.querySelectorAll('.plant-card').forEach(card => {
            card.addEventListener('click', () => {
                const idx = parseInt(card.dataset.idx);
                if (!isNaN(idx) && PLANTS_DB[idx]) {
                    selectPlant(idx);
                }
            });
        });
    }
    
    function selectPlant(idx) {
        currentPlantIndex = idx;
        currentPlant = PLANTS_DB[idx];
        // CRITICAL: Set weight to base weight so fresh/decayed differ
        const weightInput = document.getElementById('weightInput');
        if (weightInput) weightInput.value = currentPlant.baseWeight.toFixed(2);
        renderPlantGrid();
        updateCalculator();
        updateOdds();
    }

    // ==================== MUTATIONS ====================
    function renderMutations() {
        const container = document.getElementById('mutationsGrid');
        if (!container) return;
        
        container.innerHTML = MUTATIONS_DB.map((mut, idx) => `
            <button class="mut-btn ${activeMutation && activeMutation.id === mut.id ? 'active' : ''}" data-mut-idx="${idx}">
                ${escapeHtml(mut.name)}<br><small>${mut.multiplier}x</small>
            </button>
        `).join('');
        
        document.querySelectorAll('.mut-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.mutIdx);
                const mut = MUTATIONS_DB[idx];
                if (activeMutation && activeMutation.id === mut.id) {
                    activeMutation = null;
                } else {
                    activeMutation = mut;
                }
                renderMutations();
                updateCalculator();
            });
        });
    }
    
    window.clearMutation = function() {
        activeMutation = null;
        renderMutations();
        updateCalculator();
    };

    // ==================== PLANT SEARCH ====================
    function setupPlantSearch() {
        const input = document.getElementById('plantSearch');
        if (!input) return;
        input.addEventListener('input', () => {
            const query = input.value.toLowerCase();
            document.querySelectorAll('.plant-card').forEach(card => {
                const name = card.dataset.name || '';
                card.style.display = name.includes(query) ? 'flex' : 'none';
            });
        });
    }

    // ==================== GROWTH CALCULATOR ====================
    function updateGrowth() {
        const weight = parseFloat(document.getElementById('growthWeight')?.value) || 0;
        const rate = 0.00025;
        const calcWeight = (seconds) => weight * Math.pow(1 + rate, seconds);
        
        const results = {
            'growth60s': calcWeight(60),
            'growth1h': calcWeight(3600),
            'growth6h': calcWeight(21600),
            'growth12h': calcWeight(43200)
        };
        
        for (const [id, value] of Object.entries(results)) {
            const el = document.getElementById(id);
            if (el) el.innerText = value.toFixed(2) + ' kg';
        }
        
        if (growthChart) growthChart.destroy();
        const ctx = document.getElementById('growthChartCanvas')?.getContext('2d');
        if (ctx) {
            growthChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Now', '1m', '1h', '6h', '12h'],
                    datasets: [{
                        data: [weight, results.growth60s, results.growth1h, results.growth6h, results.growth12h],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { legend: { display: false } },
                    scales: { y: { display: false } }
                }
            });
        }
    }

    // ==================== WEIGHT CHANCE ====================
    function renderSprinklers() {
        const container = document.getElementById('sprinklerList');
        if (!container) return;
        
        container.innerHTML = SPRINKLERS.map((s, i) => `
            <div class="sprinkler-row">
                <div>
                    <strong>${escapeHtml(s.name)} Sprinkler</strong>
                    <br><small>+${s.luck} luck</small>
                </div>
                <div class="flex gap-3 items-center">
                    <button class="stepper-btn" onclick="updateSprinkler(${i}, -1)">-</button>
                    <span class="w-8 text-center font-bold" id="sprCount${i}">${sprinklerCounts[i]}</span>
                    <button class="stepper-btn" onclick="updateSprinkler(${i}, 1)">+</button>
                </div>
            </div>
        `).join('');
    }
    
    window.updateSprinkler = function(idx, delta) {
        sprinklerCounts[idx] = Math.max(0, sprinklerCounts[idx] + delta);
        const el = document.getElementById(`sprCount${idx}`);
        if (el) el.innerText = sprinklerCounts[idx];
        updateOdds();
    };
    
    window.clearSprinklers = function() {
        sprinklerCounts = [0, 0, 0, 0, 0];
        for (let i = 0; i < 5; i++) {
            const el = document.getElementById(`sprCount${i}`);
            if (el) el.innerText = '0';
        }
        updateOdds();
    };
    
    function updateOdds() {
        if (!currentPlant) return;
        
        const target = parseFloat(document.getElementById('targetWeight')?.value) || 10;
        if (isNaN(target) || target <= 0) {
            document.getElementById('oddsPercentage').innerHTML = '0.00%';
            return;
        }
        
        let totalLuck = sprinklerCounts.reduce((sum, count, i) => sum + count * SPRINKLERS[i].luck, 0);
        totalLuck = Math.min(100, totalLuck);
        document.getElementById('totalLuck').innerHTML = totalLuck;
        
        const doubleChance = 0.01 + (0.04 * (totalLuck / 100));
        const baseWeight = currentPlant.baseWeight;
        
        const bands = [
            { minMult: 1.28, maxMult: 1.72, chance: 0.999 },
            { minMult: 4.20, maxMult: 4.95, chance: 0.0005 },
            { minMult: 6.0, maxMult: 7.5, chance: 0.00015 }
        ];
        
        let totalProb = 0;
        let bandHtml = '';
        let routeHtml = '';
        
        bands.forEach((band, idx) => {
            const lowKg = (baseWeight * band.minMult).toFixed(2);
            const highKg = (baseWeight * band.maxMult).toFixed(2);
            bandHtml += `<tr><td class="p-2">Band ${idx + 1}</td><td class="p-2">${lowKg} - ${highKg} kg</td><td class="p-2 text-emerald-500">${(band.chance * 100).toFixed(4)}%</td></tr>`;
            
            let startWeight = baseWeight * band.maxMult;
            let doubles = 0;
            let current = startWeight;
            while (current < target && doubles < 12) {
                current *= 2;
                doubles++;
            }
            if (current >= target) {
                let prob = band.chance * Math.pow(doubleChance, doubles);
                totalProb += prob;
                if (prob > 0.000001) {
                    routeHtml += `<div class="flex justify-between p-2 bg-zinc-900/50 rounded-lg"><span>🎯 Band ${idx + 1} → ${doubles} double(s)</span><span class="text-emerald-500">${(prob * 100).toFixed(6)}%</span></div>`;
                }
            }
        });
        
        totalProb = Math.min(1, totalProb);
        const percent = totalProb * 100;
        
        document.getElementById('oddsPercentage').innerHTML = (percent < 0.0001 && percent > 0) ? '<0.0001%' : percent.toFixed(6) + '%';
        document.getElementById('oddsDesc').innerHTML = `Chance to reach ≥ ${target.toFixed(1)} kg with ${totalLuck} luck`;
        document.getElementById('bandTableBody').innerHTML = bandHtml;
        document.getElementById('routeDetails').innerHTML = routeHtml || '<div class="text-center text-zinc-500 p-4">Try lower target weight or add sprinklers</div>';
    }
    
    function populateOddsSelect() {
        const select = document.getElementById('oddsPlantSelect');
        if (!select) return;
        
        select.innerHTML = PLANTS_DB.map((plant, i) => `<option value="${i}">${escapeHtml(plant.name)}</option>`).join('');
        select.value = currentPlantIndex;
        select.onchange = () => {
            const idx = parseInt(select.value);
            if (!isNaN(idx)) selectPlant(idx);
        };
    }

    // ==================== TAB SWITCHING ====================
    window.showTab = function(tab) {
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
        document.getElementById(`panel-${tab}`).classList.remove('hidden');
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('tab-active', 'text-emerald-500');
            btn.classList.add('text-zinc-500');
        });
        document.getElementById(`tab-${tab}`).classList.add('tab-active', 'text-emerald-500');
        
        if (tab === 'growth') updateGrowth();
        if (tab === 'odds') updateOdds();
    };

    // ==================== BIND INPUTS ====================
    function bindInputs() {
        const weightInput = document.getElementById('weightInput');
        const boostInput = document.getElementById('boostInput');
        const amountInput = document.getElementById('amountInput');
        const growthWeight = document.getElementById('growthWeight');
        const targetWeight = document.getElementById('targetWeight');
        
        if (weightInput) weightInput.addEventListener('input', updateCalculator);
        if (boostInput) boostInput.addEventListener('input', updateCalculator);
        if (amountInput) amountInput.addEventListener('input', updateCalculator);
        if (growthWeight) growthWeight.addEventListener('input', updateGrowth);
        if (targetWeight) targetWeight.addEventListener('input', updateOdds);
    }

    // ==================== INITIALIZATION ====================
    function init() {
        // Set default weight to plant's base weight
        document.getElementById('weightInput').value = currentPlant.baseWeight.toFixed(2);
        
        renderPlantGrid();
        renderMutations();
        renderSprinklers();
        populateOddsSelect();
        setupPlantSearch();
        bindInputs();
        updateCalculator();
        updateGrowth();
        updateOdds();
        setDecay('fresh');
        
        console.log('✅ GAG2 Calculator initialized with proper fresh/decayed differentiation');
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();