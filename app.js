/**
 * Music Preference Similarity Analyzer
 * Course: Design and Analysis of Algorithms (DAA)
 * Algorithm: Counting Inversions using Divide and Conquer (Merge Sort)
 * Time Complexity: O(n log n)
 */

// 5 Sample Songs
const SONGS = [
  { id: 1, title: 'Bohemian Rhapsody', artist: 'Queen' },
  { id: 2, title: 'Blinding Lights', artist: 'The Weeknd' },
  { id: 3, title: 'Shape of You', artist: 'Ed Sheeran' },
  { id: 4, title: 'Lose Yourself', artist: 'Eminem' },
  { id: 5, title: 'Starboy', artist: 'The Weeknd' }
];

// User A is the reference baseline [1, 2, 3, 4, 5]
const userAList = [...SONGS];

// User B's current ranking (initially similar)
let userBList = [
  SONGS[0], // 1
  SONGS[2], // 3
  SONGS[1], // 2
  SONGS[4], // 5
  SONGS[3]  // 4
];

document.addEventListener('DOMContentLoaded', () => {
  renderUserA();
  renderUserB();
  calculateSimilarity();
  setupEventListeners();
});

// -------------------------------------------------------------------------
// 1. Render Lists in UI
// -------------------------------------------------------------------------
function renderUserA() {
  const container = document.getElementById('list-user-a');
  container.innerHTML = '';
  userAList.forEach((song, idx) => {
    const li = document.createElement('li');
    li.className = 'song-item';
    li.innerHTML = `
      <div class="song-info">
        <span class="song-rank">#${idx + 1}</span>
        <div>
          <div class="song-title">${song.title}</div>
          <div class="song-artist">${song.artist}</div>
        </div>
      </div>
    `;
    container.appendChild(li);
  });
}

function renderUserB() {
  const container = document.getElementById('list-user-b');
  container.innerHTML = '';
  userBList.forEach((song, idx) => {
    const li = document.createElement('li');
    li.className = 'song-item';
    li.innerHTML = `
      <div class="song-info">
        <span class="song-rank">#${idx + 1}</span>
        <div>
          <div class="song-title">${song.title}</div>
          <div class="song-artist">${song.artist}</div>
        </div>
      </div>
      <div class="order-controls">
        <button class="btn-order" ${idx === 0 ? 'disabled' : ''} onclick="moveSong(${idx}, -1)">▲</button>
        <button class="btn-order" ${idx === userBList.length - 1 ? 'disabled' : ''} onclick="moveSong(${idx}, 1)">▼</button>
      </div>
    `;
    container.appendChild(li);
  });
}

function moveSong(index, direction) {
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= userBList.length) return;
  const temp = userBList[index];
  userBList[index] = userBList[targetIndex];
  userBList[targetIndex] = temp;
  renderUserB();
  calculateSimilarity();
}

// -------------------------------------------------------------------------
// 2. DAA Algorithm: Divide and Conquer (Merge Sort Inversion Counting)
// -------------------------------------------------------------------------
function mergeAndCount(arr, temp, left, mid, right) {
  let i = left;     // Pointer for left subarray
  let j = mid + 1;  // Pointer for right subarray
  let k = left;     // Pointer for merged array
  let invCount = 0;

  while (i <= mid && j <= right) {
    if (arr[i] <= arr[j]) {
      temp[k++] = arr[i++];
    } else {
      // Cross-inversion: arr[i] > arr[j] means arr[j] is smaller than
      // ALL remaining elements in the left sorted subarray!
      invCount += (mid - i + 1);
      temp[k++] = arr[j++];
    }
  }

  while (i <= mid) temp[k++] = arr[i++];
  while (j <= right) temp[k++] = arr[j++];

  for (let idx = left; idx <= right; idx++) {
    arr[idx] = temp[idx];
  }

  return invCount;
}

function mergeSortAndCount(arr, temp, left, right) {
  let invCount = 0;
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    invCount += mergeSortAndCount(arr, temp, left, mid);
    invCount += mergeSortAndCount(arr, temp, mid + 1, right);
    invCount += mergeAndCount(arr, temp, left, mid, right);
  }
  return invCount;
}

// -------------------------------------------------------------------------
// 3. Similarity Calculation & UI Update
// -------------------------------------------------------------------------
function calculateSimilarity() {
  const n = userAList.length; // n = 5

  // Map Person B's items to Person A's rank indices (1 to 5)
  const rankMap = {};
  userAList.forEach((song, idx) => {
    rankMap[song.id] = idx + 1;
  });

  const mappedRanks = userBList.map(song => rankMap[song.id]);

  // Run Divide & Conquer on mapped array
  const temp = new Array(n).fill(0);
  const copyArr = [...mappedRanks];
  const totalInversions = mergeSortAndCount(copyArr, temp, 0, n - 1);

  // Maximum possible inversions for n items: n * (n - 1) / 2 = 10
  const maxInversions = (n * (n - 1)) / 2;

  // Similarity percentage: ((max - inv) / max) * 100
  const scorePercent = Math.round(((maxInversions - totalInversions) / maxInversions) * 100);

  // Update DOM
  document.getElementById('stat-inversions').textContent = totalInversions;
  document.getElementById('score-val').textContent = `${scorePercent}%`;
  
  const fill = document.getElementById('progress-fill');
  fill.style.width = `${scorePercent}%`;

  const level = document.getElementById('match-level');
  if (scorePercent >= 75) {
    level.textContent = 'High Compatibility';
    level.style.color = '#16a34a';
    fill.style.backgroundColor = '#16a34a';
  } else if (scorePercent >= 40) {
    level.textContent = 'Moderate Match';
    level.style.color = '#d97706';
    fill.style.backgroundColor = '#d97706';
  } else {
    level.textContent = 'Opposite Taste';
    level.style.color = '#dc2626';
    fill.style.backgroundColor = '#dc2626';
  }

  // Find exact inverted pairs for explanation
  const invertedPairs = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (mappedRanks[i] > mappedRanks[j]) {
        invertedPairs.push(`(${userBList[i].title} ⇄ ${userBList[j].title})`);
      }
    }
  }

  const pairsContainer = document.getElementById('inversion-pairs-list');
  pairsContainer.innerHTML = '';
  if (invertedPairs.length === 0) {
    pairsContainer.innerHTML = '<span style="color:#16a34a;">None! Both users ranked all songs in identical order.</span>';
  } else {
    invertedPairs.forEach(pair => {
      const span = document.createElement('span');
      span.className = 'pair-badge';
      span.textContent = pair;
      pairsContainer.appendChild(span);
    });
  }

  // Simple recommendation
  const recText = document.getElementById('recommendation-text');
  recText.innerHTML = `Since Person B's top pick is <strong>${userBList[0].title}</strong>, recommend it to Person A!`;

  // Update Bar Chart Visualizer if currently set to song ranks
  if (window.barVisualizer && window.barVisualizer.isUsingSongRanks) {
    window.barVisualizer.loadSongRanks();
  }
}

// -------------------------------------------------------------------------
// 4. Preset Event Listeners
// -------------------------------------------------------------------------
function setupEventListeners() {
  document.getElementById('btn-calculate').addEventListener('click', calculateSimilarity);

  document.getElementById('preset-identical').addEventListener('click', () => {
    userBList = [...SONGS];
    renderUserB();
    calculateSimilarity();
  });

  document.getElementById('preset-high').addEventListener('click', () => {
    userBList = [SONGS[0], SONGS[2], SONGS[1], SONGS[4], SONGS[3]];
    renderUserB();
    calculateSimilarity();
  });

  document.getElementById('preset-moderate').addEventListener('click', () => {
    userBList = [SONGS[2], SONGS[4], SONGS[0], SONGS[3], SONGS[1]];
    renderUserB();
    calculateSimilarity();
  });

  document.getElementById('preset-opposite').addEventListener('click', () => {
    userBList = [...SONGS].reverse();
    renderUserB();
    calculateSimilarity();
  });
}

// -------------------------------------------------------------------------
// 5. Merge Sort Increasing Bar Chart Visualizer Engine
// -------------------------------------------------------------------------
class MergeSortBarVisualizer {
  constructor() {
    this.array = [];
    this.steps = [];
    this.currentStep = 0;
    this.timer = null;
    this.isPlaying = false;
    this.isUsingSongRanks = false;

    this.dom = {
      sizeSlider: document.getElementById('bar-size-slider'),
      sizeVal: document.getElementById('bar-size-val'),
      speedSlider: document.getElementById('bar-speed-slider'),
      speedVal: document.getElementById('bar-speed-val'),
      btnPlay: document.getElementById('btn-bar-play'),
      btnStep: document.getElementById('btn-bar-step'),
      btnRandomize: document.getElementById('btn-bar-randomize'),
      btnSongRanks: document.getElementById('btn-bar-song-ranks'),
      btnReset: document.getElementById('btn-bar-reset'),
      statComparisons: document.getElementById('bar-stat-comparisons'),
      statInversions: document.getElementById('bar-stat-inversions'),
      statSize: document.getElementById('bar-stat-size'),
      phaseBadge: document.getElementById('bar-phase-badge'),
      actionMsg: document.getElementById('bar-action-msg'),
      barsContainer: document.getElementById('bars-container')
    };

    this.speedLabels = {
      1: 'Very Slow (0.3x)',
      2: 'Slow (0.6x)',
      3: 'Normal (1x)',
      4: 'Fast (2.5x)',
      5: 'Blazing Fast (5x)'
    };

    this.speedDelays = {
      1: 650,
      2: 380,
      3: 160,
      4: 60,
      5: 20
    };

    this.init();
  }

  init() {
    if (!this.dom.barsContainer) return;
    this.bindEvents();
    // Default: initialize with 15 random bars
    this.generateRandomArray(parseInt(this.dom.sizeSlider.value, 10) || 15);
  }

  bindEvents() {
    this.dom.sizeSlider.addEventListener('input', (e) => {
      const size = parseInt(e.target.value, 10);
      this.dom.sizeVal.textContent = `${size} bars`;
      this.isUsingSongRanks = false;
      this.generateRandomArray(size);
    });

    this.dom.speedSlider.addEventListener('input', (e) => {
      const speedLevel = parseInt(e.target.value, 10);
      this.dom.speedVal.textContent = this.speedLabels[speedLevel] || 'Normal';
      if (this.isPlaying) {
        this.pause();
        this.play();
      }
    });

    this.dom.btnPlay.addEventListener('click', () => this.togglePlay());
    this.dom.btnStep.addEventListener('click', () => this.step());
    this.dom.btnRandomize.addEventListener('click', () => {
      this.isUsingSongRanks = false;
      const size = parseInt(this.dom.sizeSlider.value, 10) || 15;
      this.generateRandomArray(size);
    });
    this.dom.btnSongRanks.addEventListener('click', () => {
      this.loadSongRanks();
    });
    this.dom.btnReset.addEventListener('click', () => this.reset());
  }

  loadSongRanks() {
    this.pause();
    this.isUsingSongRanks = true;
    this.dom.sizeSlider.value = 5;
    this.dom.sizeVal.textContent = '5 bars (Song Ranks)';

    // Map Person B's items to Person A's rank indices (1 to 5)
    const rankMap = {};
    userAList.forEach((song, idx) => {
      rankMap[song.id] = idx + 1;
    });

    const items = userBList.map((song) => ({
      val: rankMap[song.id],
      label: song.title.split(' ')[0] // e.g. "Bohemian", "Blinding"
    }));

    this.setArray(items);
  }

  generateRandomArray(size) {
    this.pause();
    const items = [];
    for (let i = 0; i < size; i++) {
      items.push({
        val: Math.floor(Math.random() * 88) + 12,
        label: ''
      });
    }
    this.setArray(items);
  }

  setArray(items) {
    this.array = items.map((it) => ({ ...it }));
    this.steps = this.generateMergeSortSteps(this.array);
    this.currentStep = 0;
    this.renderCurrentStep();
  }

  generateMergeSortSteps(initialArr) {
    const steps = [];
    const a = initialArr.map((it) => ({ ...it }));
    const n = a.length;
    let comparisons = 0;
    let inversions = 0;

    // Initial snapshot
    steps.push({
      array: a.map((x) => ({ ...x })),
      highlights: {},
      phase: 'Ready',
      msg: `Loaded ${n} bars. Click "Start Sort" to watch Merge Sort arrange bars in increasing order.`,
      comparisons: 0,
      inversions: 0
    });

    function merge(l, mid, r) {
      const leftPart = a.slice(l, mid + 1);
      const rightPart = a.slice(mid + 1, r + 1);

      let i = 0;
      let j = 0;
      let k = l;

      // Highlight left and right subarrays
      const subHighlights = {};
      for (let x = l; x <= mid; x++) subHighlights[x] = 'left';
      for (let x = mid + 1; x <= r; x++) subHighlights[x] = 'right';

      steps.push({
        array: a.map((x) => ({ ...x })),
        highlights: { ...subHighlights },
        phase: 'Dividing Subarrays',
        msg: `Merging Left [${l}..${mid}] (blue) and Right [${mid + 1}..${r}] (purple).`,
        comparisons,
        inversions
      });

      while (i < leftPart.length && j < rightPart.length) {
        comparisons++;
        const leftIdx = l + i;
        const rightIdx = mid + 1 + j;

        const compareHighlights = { ...subHighlights };
        compareHighlights[leftIdx] = 'comparing';
        compareHighlights[rightIdx] = 'comparing';

        if (leftPart[i].val <= rightPart[j].val) {
          steps.push({
            array: a.map((x) => ({ ...x })),
            highlights: compareHighlights,
            phase: 'Comparing',
            msg: `Comparing bar #${leftPart[i].val} ≤ bar #${rightPart[j].val}. Left is smaller.`,
            comparisons,
            inversions
          });

          a[k] = { ...leftPart[i] };
          const placedHighlights = { ...subHighlights };
          placedHighlights[k] = 'sorted';

          steps.push({
            array: a.map((x) => ({ ...x })),
            highlights: placedHighlights,
            phase: 'Placing',
            msg: `Placed bar #${leftPart[i].val} into sorted position ${k}.`,
            comparisons,
            inversions
          });
          i++;
        } else {
          const invGain = leftPart.length - i;
          inversions += invGain;

          compareHighlights[leftIdx] = 'inversion';
          compareHighlights[rightIdx] = 'inversion';

          steps.push({
            array: a.map((x) => ({ ...x })),
            highlights: compareHighlights,
            phase: '⚡ Inversion',
            msg: `⚡ Inversion! Bar #${leftPart[i].val} > bar #${rightPart[j].val}. Added ${invGain} cross-inversion(s).`,
            comparisons,
            inversions
          });

          a[k] = { ...rightPart[j] };
          const placedHighlights = { ...subHighlights };
          placedHighlights[k] = 'sorted';

          steps.push({
            array: a.map((x) => ({ ...x })),
            highlights: placedHighlights,
            phase: 'Placing',
            msg: `Placed smaller bar #${rightPart[j].val} into sorted position ${k}.`,
            comparisons,
            inversions
          });
          j++;
        }
        k++;
      }

      while (i < leftPart.length) {
        a[k] = { ...leftPart[i] };
        const flushHighlights = { ...subHighlights };
        flushHighlights[k] = 'sorted';

        steps.push({
          array: a.map((x) => ({ ...x })),
          highlights: flushHighlights,
          phase: 'Flushing Left',
          msg: `Copying remaining Left bar #${leftPart[i].val} into position ${k}.`,
          comparisons,
          inversions
        });
        i++;
        k++;
      }

      while (j < rightPart.length) {
        a[k] = { ...rightPart[j] };
        const flushHighlights = { ...subHighlights };
        flushHighlights[k] = 'sorted';

        steps.push({
          array: a.map((x) => ({ ...x })),
          highlights: flushHighlights,
          phase: 'Flushing Right',
          msg: `Copying remaining Right bar #${rightPart[j].val} into position ${k}.`,
          comparisons,
          inversions
        });
        j++;
        k++;
      }

      // Range [l..r] sorted
      const doneHighlights = {};
      for (let x = l; x <= r; x++) doneHighlights[x] = 'sorted';

      steps.push({
        array: a.map((x) => ({ ...x })),
        highlights: doneHighlights,
        phase: 'Subarray Sorted',
        msg: `Range [${l}..${r}] is now merged in increasing order.`,
        comparisons,
        inversions
      });
    }

    function sort(l, r) {
      if (l >= r) return;
      const mid = Math.floor((l + r) / 2);
      sort(l, mid);
      sort(mid + 1, r);
      merge(l, mid, r);
    }

    sort(0, n - 1);

    // Final celebration
    const allSorted = {};
    for (let x = 0; x < n; x++) allSorted[x] = 'sorted';
    steps.push({
      array: a.map((x) => ({ ...x })),
      highlights: allSorted,
      phase: 'Completed ✓',
      msg: `Merge Sort Complete! All ${n} bars are organized in increasing order. Total Comparisons: ${comparisons}, Total Inversions: ${inversions}.`,
      comparisons,
      inversions
    });

    return steps;
  }

  renderCurrentStep() {
    if (!this.steps || this.steps.length === 0) return;
    const step = this.steps[this.currentStep];

    // Telemetry stats
    this.dom.statComparisons.textContent = step.comparisons;
    this.dom.statInversions.textContent = step.inversions;
    this.dom.statSize.textContent = step.array.length;
    this.dom.phaseBadge.textContent = step.phase;
    this.dom.actionMsg.textContent = step.msg;

    // Render bars
    const maxVal = Math.max(...step.array.map((x) => x.val), 1);
    const container = this.dom.barsContainer;
    container.innerHTML = '';

    const showValues = step.array.length <= 25;
    const showLabels = step.array.length <= 7;

    step.array.forEach((item, idx) => {
      const barItem = document.createElement('div');
      barItem.className = 'bar-item';

      const state = step.highlights[idx];
      if (state) {
        barItem.classList.add(`state-${state}`);
      }

      const heightPercent = Math.max(10, Math.round((item.val / maxVal) * 92));

      // Bar number label at top
      if (showValues) {
        const valText = document.createElement('div');
        valText.className = 'bar-val-text';
        valText.textContent = item.val;
        barItem.appendChild(valText);
      }

      // Bar fill column
      const barFill = document.createElement('div');
      barFill.className = 'bar-fill';
      barFill.style.height = `${heightPercent}%`;
      barItem.appendChild(barFill);

      // Sub label (for song titles)
      if (showLabels && item.label) {
        const subLabel = document.createElement('div');
        subLabel.className = 'bar-sub-label';
        subLabel.textContent = item.label;
        barItem.appendChild(subLabel);
      }

      container.appendChild(barItem);
    });
  }

  step() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.renderCurrentStep();
    } else {
      this.pause();
    }
  }

  reset() {
    this.pause();
    this.currentStep = 0;
    this.renderCurrentStep();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (this.currentStep >= this.steps.length - 1) {
      this.currentStep = 0;
    }
    this.isPlaying = true;
    this.dom.btnPlay.textContent = '⏸ Pause';
    this.dom.btnPlay.classList.add('is-paused');

    const speedLevel = parseInt(this.dom.speedSlider.value, 10) || 3;
    const delay = this.speedDelays[speedLevel] || 160;

    this.timer = setInterval(() => {
      if (this.currentStep < this.steps.length - 1) {
        this.step();
      } else {
        this.pause();
      }
    }, delay);
  }

  pause() {
    this.isPlaying = false;
    this.dom.btnPlay.textContent = '▶ Start Sort';
    this.dom.btnPlay.classList.remove('is-paused');
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

// Instantiate on Page Load
document.addEventListener('DOMContentLoaded', () => {
  window.barVisualizer = new MergeSortBarVisualizer();
});

