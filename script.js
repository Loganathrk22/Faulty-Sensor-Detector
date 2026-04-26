/* ═══════════════════════════════════════════════
   FAULTY SENSOR DETECTOR — script.js
   Algorithm: Brute Force O(n²) comparison
   Author: DAA Project
═══════════════════════════════════════════════ */

/* ── Load a preset value into the input ── */
function loadPreset(value) {
  document.getElementById('sensorInput').value = value;
  document.getElementById('sensorInput').focus();
}

/* ── Main analysis function ── */
function analyze() {
  // 1. Read and parse input
  const raw = document.getElementById('sensorInput').value.trim();

  if (!raw) {
    alert('Please enter sensor readings first.');
    return;
  }

  // Split by comma, trim whitespace, convert to numbers
  const parts = raw.split(',').map(s => s.trim());
  const sensors = parts.map(Number);

  // Validate
  for (let i = 0; i < sensors.length; i++) {
    if (isNaN(sensors[i])) {
      alert(`"${parts[i]}" is not a valid number. Please fix your input.`);
      return;
    }
  }

  if (sensors.length < 3) {
    alert('Please enter at least 3 sensor readings.');
    return;
  }

  const n = sensors.length;

  // ────────────────────────────────────────────
  // 2. BRUTE FORCE ALGORITHM
  //    Compare every sensor[i] with every sensor[j]
  //    Count how many sensors agree with sensor[i]
  // ────────────────────────────────────────────

  // matchCount[i] = number of sensors that equal sensors[i]
  const matchCount = new Array(n).fill(0);

  // Store every comparison step for visualization
  const steps = [];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        const isMatch = (sensors[i] === sensors[j]);
        if (isMatch) {
          matchCount[i]++;
        }
        steps.push({
          i, j,
          vi: sensors[i],
          vj: sensors[j],
          match: isMatch
        });
      }
    }
  }

  // 3. Find the faulty sensor (minimum match count)
  let faultyIndex = 0;
  let minMatches = matchCount[0];

  for (let i = 1; i < n; i++) {
    if (matchCount[i] < minMatches) {
      minMatches = matchCount[i];
      faultyIndex = i;
    }
  }

  const faultyReading = sensors[faultyIndex];
  const totalComparisons = n * (n - 1);

  // ────────────────────────────────────────────
  // 4. Render results
  // ────────────────────────────────────────────

  renderSensorChips(sensors, faultyIndex);
  renderMatchTable(sensors, matchCount, faultyIndex);
  renderResultBanner(faultyIndex, faultyReading, minMatches);
  renderStepVisualization(steps);
  renderComplexity(n, totalComparisons);

  // Show output section with animation
  const out = document.getElementById('outputSection');
  out.classList.remove('hidden');
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Render sensor chips (pill display) ── */
function renderSensorChips(sensors, faultyIndex) {
  const container = document.getElementById('sensorDisplay');
  container.innerHTML = '';

  sensors.forEach((val, i) => {
    const chip = document.createElement('div');
    chip.className = 'sensor-chip' + (i === faultyIndex ? ' faulty' : '');
    chip.style.animationDelay = `${i * 0.06}s`;

    chip.innerHTML = `
      <span class="chip-index">S[${i}]</span>
      <span class="chip-value">${val}</span>
      ${i === faultyIndex ? '<span class="chip-tag">⚠ FAULTY</span>' : ''}
    `;
    container.appendChild(chip);
  });
}

/* ── Render match count table ── */
function renderMatchTable(sensors, matchCount, faultyIndex) {
  const tbody = document.getElementById('matchTableBody');
  tbody.innerHTML = '';

  sensors.forEach((val, i) => {
    const isFaulty = (i === faultyIndex);
    const tr = document.createElement('tr');
    if (isFaulty) tr.className = 'faulty-row';

    tr.innerHTML = `
      <td>${i} ${isFaulty ? '⚠' : ''}</td>
      <td class="mono">${val}</td>
      <td class="mono">${matchCount[i]}</td>
      <td class="${isFaulty ? 'status-fault' : 'status-ok'}">
        ${isFaulty ? '✘ FAULTY' : '✔ NORMAL'}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* ── Render result banner ── */
function renderResultBanner(faultyIndex, faultyReading, minMatches) {
  document.getElementById('faultyIndex').textContent = faultyIndex;
  document.getElementById('faultyReading').textContent = faultyReading;
  document.getElementById('faultyMatches').textContent = minMatches;
  document.getElementById('complexityDisplay').textContent = 'O(n²)';
}

/* ── Render step-by-step visualization ── */
function renderStepVisualization(steps) {
  const container = document.getElementById('stepViz');
  container.innerHTML = '';

  steps.forEach((step, idx) => {
    const row = document.createElement('div');
    row.className = 'step-row';
    row.style.animationDelay = `${Math.min(idx * 0.015, 1)}s`;

    row.innerHTML = `
      <span class="step-pair">S[${step.i}] vs S[${step.j}]</span>
      <span class="step-vals">${step.vi} &nbsp;↔&nbsp; ${step.vj}</span>
      <span class="step-result ${step.match ? 'match' : 'mismatch'}">
        ${step.match ? '✔' : '✘'}
      </span>
    `;
    container.appendChild(row);
  });
}

/* ── Render complexity section ── */
function renderComplexity(n, totalComparisons) {
  document.getElementById('totalComparisons').textContent = totalComparisons;
  document.getElementById('nCount').textContent = n;
  document.getElementById('nSquared').textContent = `${n}×${n - 1} = ${totalComparisons}`;
}

/* ── Allow pressing Enter to analyze ── */
document.getElementById('sensorInput').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') analyze();
});
