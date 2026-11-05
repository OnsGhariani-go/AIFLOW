const S1_TARGET = ["I", "N", "T"];
const NODE_RADIUS = 25;

// Position des nœuds (Tu peux ajuster X et Y selon ton envie)
let nodesS1 = [
  { id: 'I', x: 60, y: 290 },  { id: 'N', x: 160, y: 140 }, { id: 'T', x: 280, y: 220 },
  { id: 'O', x: 80, y: 600 }, { id: 'R', x: 240, y: 60 }, { id: 'K', x: 260, y: 140 },
  { id: 'B', x: 280, y: 400 }, { id: 'F', x: 50,  y: 180 },
  { id: 'S', x: 200, y: 390 }, { id: 'W', x: 50, y: 380  }
];

// --- VARIABLES D'ÉTAT ---
let currentConnection = [];
let isDragging = false;
let mouseX = 0, mouseY = 0;

// Éléments HTML
const graphArea = document.getElementById('graph-dijkstra');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const boxes = document.querySelectorAll('#grid1 .letter-box');
const feedback = document.getElementById('feedback1');

// --- INITIALISATION ---
function init() {
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Événements Souris
  canvas.addEventListener('mousedown', startConnect);
  window.addEventListener('mousemove', drawMove);
  window.addEventListener('mouseup', endConnect);

  // Événements Tactiles (Mobile)
  canvas.addEventListener('touchstart', (e) => { startConnect(e); e.preventDefault(); }, {passive: false});
  window.addEventListener('touchmove', (e) => { drawMove(e); e.preventDefault(); }, {passive: false});
  window.addEventListener('touchend', endConnect);

  drawStep1();
}

// --- LOGIQUE DE CONNEXION ---

function startConnect(e) {
  const pos = getMousePos(e);
  const node = getNodeAt(pos.x, pos.y);
  
  if (node) {
    isDragging = true;
    currentConnection = [node]; 
    resetGridDisplay();
    updateGrid(node.id, 0);
    drawStep1();
  }
}

function drawMove(e) {
  if (!isDragging) return;

  const pos = getMousePos(e);
  mouseX = pos.x;
  mouseY = pos.y;

  const hoverNode = getNodeAt(pos.x, pos.y);
  
  // Si on survole un nouveau nœud qui suit l'ordre logique
  if (hoverNode && !currentConnection.includes(hoverNode)) {
    const nextIndex = currentConnection.length;
    if (hoverNode.id === S1_TARGET[nextIndex]) {
      currentConnection.push(hoverNode);
      updateGrid(hoverNode.id, nextIndex);
    }
  }
  drawStep1();
}

function endConnect() {
  if (!isDragging) return;
  isDragging = false;

  if (currentConnection.length === 3) {
    validateResult(true);
  } else {
    validateResult(false);
  }
  drawStep1();
}

// --- DESSIN SUR CANVAS ---

function drawStep1() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Dessin de la ligne (Style Pudding Pop)
  if (currentConnection.length > 0) {
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#39ff14"; // Vert Néon
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    currentConnection.forEach((node, i) => {
      if (i === 0) ctx.moveTo(node.x, node.y);
      else ctx.lineTo(node.x, node.y);
    });

    // Ligne élastique vers la souris
    if (isDragging && currentConnection.length < 3) {
      const last = currentConnection[currentConnection.length - 1];
      ctx.lineTo(mouseX, mouseY);
    }
    ctx.stroke();
  }

  // 2. Dessin des Nœuds
  nodesS1.forEach(node => {
    const isActive = currentConnection.includes(node);
    
    ctx.beginPath();
    ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
    
    // Style du cercle
    ctx.fillStyle = isActive ? "#39ff14" : "#1a1a1a";
    ctx.shadowBlur = isActive ? 15 : 0;
    ctx.shadowColor = "#39ff14";
    ctx.fill();
    
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Style du texte
    ctx.shadowBlur = 0;
    ctx.fillStyle = isActive ? "black" : "white";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.id, node.x, node.y);
  });
}

// --- UTILITAIRES ---

function validateResult(isCorrect) {
    if (isCorrect) {
        feedback.innerText = "PATH SECURED - STEP 1 COMPLETE";
        feedback.style.color = "#39ff14";
        boxes.forEach(b => b.classList.add('success'));
        
        // --- LA CORRECTION EST ICI ---
        const s2 = document.getElementById('step2');
        s2.classList.remove('locked'); // Enlève le flou CSS
        
        setTimeout(() => {
            initStep2(); // Lance le dessin du deuxième graphique
        }, 100); 
    } else {
        feedback.innerText = "SEQUENCE INTERRUPTED - RETRY";
        feedback.style.color = "#ff3131";
        boxes.forEach(b => {
            if(b.innerText !== "") b.classList.add('error');
        });

        setTimeout(() => {
            currentConnection = [];
            resetGridDisplay();
            drawStep1();
        }, 1200);
    
    

    // Reset automatique après erreur
    setTimeout(() => {
      currentConnection = [];
      resetGridDisplay();
      drawStep1();
    }, 1200);
  }
}

function updateGrid(letter, index) {
  if (boxes[index]) boxes[index].innerText = letter;
}

function resetGridDisplay() {
  boxes.forEach(b => {
    b.innerText = "";
    b.className = 'letter-box';
  });
  feedback.innerText = "";
}

function getMousePos(e, targetCanvas) {
    // Si targetCanvas n'est pas fourni, on utilise le premier par défaut
    const activeCanvas = targetCanvas || canvas; 
    const rect = activeCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

function getNodeAt(x, y) {
  return nodesS1.find(node => {
    const dist = Math.hypot(node.x - x, node.y - y);
    return dist < NODE_RADIUS + 5;
  });
}

function resizeCanvas() {
  const container = document.getElementById('graph-dijkstra');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  drawStep1();
}

// Lancement au chargement de la page
window.onload = init;





const S2_TARGET = ["E", "L", "L", "I", "G"];
let currentS2 = [];
let isDraggingS2 = false;
let totalHeuristicCost = 0;

// Grille plus complexe pour l'Heuristique
let nodesS2 = [
    { id: 'E', x: 40,  y: 50,  h: 10 }, 
    { id: 'L', x: 280, y: 40,  h: 23 }, 
    { id: 'L', x: 160, y: 100, h: 6 }, 
    { id: 'S', x: 40,  y: 380, h: 42 }, 
    { id: 'G', x: 220, y: 260, h: 5  },  
    { id: 'C', x: 150, y: 180, h: 14 },
    { id: 'E', x: 60,  y: 260, h: 19 },
    { id: 'B', x: 320, y: 200, h: 36 },
    { id: 'I', x: 280, y: 130, h: 20 }, 
    { id: 'W', x: 360, y: 380,  h: 15 }  

];

function initStep2() {
  const container = document.getElementById('graph-heuristic');
  const canvasH = document.getElementById('canvas-h2');
  canvasH.width = container.clientWidth;
  canvasH.height = container.clientHeight;

  // Événements pour le Step 2
  canvasH.addEventListener('mousedown', (e) => startConnectS2(e, canvasH));
  window.addEventListener('mousemove', (e) => drawMoveS2(e, canvasH));
  window.addEventListener('mouseup', () => endConnectS2(canvasH));

  drawStep2(canvasH);
}

function startConnectS2(e, canvas) {
  const pos = getMousePos(e, canvas);
  const node = getNodeAtS2(pos.x, pos.y);
  if (node && node.id === S2_TARGET[0]) {
    isDraggingS2 = true;
    currentS2 = [node];
    updateGridS2(node.id, 0);
    updateCostDisplay(); // <--- AJOUT
    drawStep2(canvas);
  }
}

function drawMoveS2(e, canvas) {
  if (!isDraggingS2) return;
  const pos = getMousePos(e, canvas);
  mouseX = pos.x; mouseY = pos.y;

  const hoverNode = getNodeAtS2(pos.x, pos.y);
  if (hoverNode && !currentS2.includes(hoverNode)) {
    const nextIdx = currentS2.length;
    if (hoverNode.id === S2_TARGET[nextIdx]) {
      currentS2.push(hoverNode);
      updateGridS2(hoverNode.id, nextIdx);
      updateCostDisplay(); // <--- AJOUT
    } else {
            isDraggingS2 = false;
            // On peut aussi ajouter le coût du mauvais nœud avant de reset !
            validateStep2(false); 
        }
    }
  drawStep2(canvas);
}

function endConnectS2(canvas) {
    if (!isDraggingS2) return;
    isDraggingS2 = false;

    // Calcul du total actuel
    const currentTotal = currentS2.reduce((sum, node) => sum + node.h, 0);

    // CONDITION : Toutes les lettres ET total == 60
    if (currentS2.length === S2_TARGET.length && currentTotal === 64) {
        document.getElementById('feedback2').innerText = "OPTIMAL COST REACHED (64) ✅";
        document.getElementById('feedback2').style.color = "#00d4ff";
        document.querySelectorAll('#grid2 .letter-box').forEach(b => b.classList.add('success'));
        
        // Débloquer Step 3
        document.getElementById('step3').classList.remove('locked');
        setTimeout(() => { initStep3(); }, 100);
    } else {
        // Message d'erreur spécifique si le coût n'est pas bon
        const msg = currentTotal !== 64 ? `COST IS ${currentTotal}/64 - RETRY` : "INCOMPLETE PATH";
        document.getElementById('feedback2').innerText = msg;
        document.getElementById('feedback2').style.color = "#ff3131";
        
        setTimeout(() => { resetStep2(canvas); }, 1200);
    }
}

function drawStep2(canvas) {
  const ctxH = canvas.getContext('2d');
  ctxH.clearRect(0, 0, canvas.width, canvas.height);

  // Ligne bleue
  if (currentS2.length > 0) {
    ctxH.beginPath();
    ctxH.lineWidth = 10;
    ctxH.strokeStyle = "#00d4ff";
    ctxH.lineCap = "round";
    ctxH.lineJoin = "round";
    currentS2.forEach((n, i) => {
      if (i === 0) ctxH.moveTo(n.x, n.y);
      else ctxH.lineTo(n.x, n.y);
    });
    if (isDraggingS2 && currentS2.length < S2_TARGET.length) ctxH.lineTo(mouseX, mouseY);
    ctxH.stroke();
  }

  // Nœuds
  nodesS2.forEach(node => {
    const active = currentS2.includes(node);
    ctxH.beginPath();
    ctxH.arc(node.x, node.y, 25, 0, Math.PI * 2);
    ctxH.fillStyle = active ? "#00d4ff" : "#1a1a1a";
    ctxH.fill();
    ctxH.strokeStyle = "white";
    ctxH.stroke();
    ctxH.fillStyle = active ? "black" : "white";
    ctxH.textAlign = "center";
    ctxH.fillText(node.id, node.x, node.y);
  });
}

// Fonctions utilitaires spécifiques S2
function getNodeAtS2(x, y) {
  return nodesS2.find(n => Math.hypot(n.x - x, n.y - y) < 40);
}

function updateGridS2(letter, index) {
  const boxesS2 = document.querySelectorAll('#grid2 .letter-box');
  if (boxesS2[index]) boxesS2[index].innerText = letter;
}

function resetStep2(canvas) {
  currentS2 = [];
  totalHeuristicCost = 0; // <--- RESET LE COÛT
  document.getElementById('total-cost').innerText = "0";
  document.querySelectorAll('#grid2 .letter-box').forEach(b => b.innerText = "");
  drawStep2(canvas);
} 


function updateCostDisplay() {
    // On additionne les h de tous les nœuds dans currentS2
    totalHeuristicCost = currentS2.reduce((sum, node) => sum + node.h, 0);
    document.getElementById('total-cost').innerText = totalHeuristicCost;
}
// --- PARTIE 3 : BFS (FINAL) ---

const S3_TARGET = ["E", "N", "C", "E"];
let currentS3 = [];
let isDraggingS3 = false;

// Graphe désordonné pour le BFS
let nodesS3 = [
    { id: 'E', x: 50,  y: 50  }, { id: 'N', x: 250, y: 70  }, 
    { id: 'C', x: 150, y: 150 }, { id: 'E', x: 100, y: 250 }, 
    { id: 'B', x: 280, y: 230 }, { id: 'F', x: 50,  y: 180 },
    { id: 'S', x: 200, y: 270 }, { id: 'W', x: 200, y: 30  }
];

function initStep3() {
    const container = document.getElementById('graph-bfs');
    const canvasS3 = document.getElementById('canvas-s3');
    if (!canvasS3) return;

    canvasS3.width = container.clientWidth;
    canvasS3.height = container.clientHeight;

    // Événements pour le Step 3
    canvasS3.addEventListener('mousedown', (e) => startConnectS3(e, canvasS3));
    window.addEventListener('mousemove', (e) => drawMoveS3(e, canvasS3));
    window.addEventListener('mouseup', () => endConnectS3(canvasS3));

    drawStep3(canvasS3);
}

function startConnectS3(e, canvas) {
    const pos = getMousePos(e, canvas);
    const node = getNodeAtS3(pos.x, pos.y);
    if (node && node.id === S3_TARGET[0]) {
        isDraggingS3 = true;
        currentS3 = [node];
        updateGridS3(node.id, 0);
        drawStep3(canvas);
    }
}

function drawMoveS3(e, canvas) {
    if (!isDraggingS3) return;
    const pos = getMousePos(e, canvas);
    mouseX = pos.x; mouseY = pos.y;

    const hoverNode = getNodeAtS3(pos.x, pos.y);
    if (hoverNode && !currentS3.includes(hoverNode)) {
        const nextIdx = currentS3.length;
        if (hoverNode.id === S3_TARGET[nextIdx]) {
            currentS3.push(hoverNode);
            updateGridS3(hoverNode.id, nextIdx);
        } else {
            // Détection d'erreur immédiate (élastique rouge)
            isDraggingS3 = false;
            validateStep3(false);
        }
    }
    drawStep3(canvas);
}

function endConnectS3(canvas) {
    if (!isDraggingS3) return;
    isDraggingS3 = false;

    // Ici, la condition est d'avoir trouvé le chemin optimal "ENCE"
    // défini dans S3_TARGET sans déviation.
    if (currentS3.length === S3_TARGET.length) {
        document.getElementById('feedback3').innerText = "BFS OPTIMAL PATH FOUND ✅";
        document.getElementById('feedback3').style.color = "#bc13fe";
        document.querySelectorAll('#grid3 .letter-box').forEach(b => b.classList.add('success'));
        
        // Effet final de victoire
        alert("Félicitations ! Vous avez reconstitué l'INTELLIGENCE via les algorithmes.");
    } else {
        document.getElementById('feedback3').innerText = "PATH TOO LONG OR INCOMPLETE";
        document.getElementById('feedback3').style.color = "#ff3131";
        setTimeout(() => { 
            currentS3 = [];
            resetStep3();
            drawStep3(canvas);
        }, 1200);
    }
}
function validateStep3(isCorrect) {
    const fb = document.getElementById('feedback3');
    if (isCorrect) {
        fb.innerText = "MISSION ACCOMPLISHED: INTELLIGENCE COMPLETE ✅";
        fb.style.color = "#bc13fe";
        document.querySelectorAll('#grid3 .letter-box').forEach(b => b.classList.add('success'));
    } else {
        fb.innerText = "WRONG PATH - RETRY";
        fb.style.color = "#ff3131";
        setTimeout(() => {
            currentS3 = [];
            resetStep3();
            drawStep3(document.getElementById('canvas-s3'));
        }, 800);
    }
}

function drawStep3(canvas) {
    const ctxS3 = canvas.getContext('2d');
    ctxS3.clearRect(0, 0, canvas.width, canvas.height);

    const colorViolet = "#bc13fe";

    // Ligne violette
    if (currentS3.length > 0) {
        ctxS3.beginPath();
        ctxS3.lineWidth = 10;
        ctxS3.strokeStyle = colorViolet;
        ctxS3.lineCap = "round";
        ctxS3.lineJoin = "round";
        currentS3.forEach((n, i) => {
            if (i === 0) ctxS3.moveTo(n.x, n.y);
            else ctxS3.lineTo(n.x, n.y);
        });
        if (isDraggingS3 && currentS3.length < S3_TARGET.length) ctxS3.lineTo(mouseX, mouseY);
        ctxS3.stroke();
    }

    // Nœuds
    nodesS3.forEach(node => {
        const active = currentS3.includes(node);
        ctxS3.beginPath();
        ctxS3.arc(node.x, node.y, 25, 0, Math.PI * 2);
        ctxS3.fillStyle = active ? colorViolet : "#1a1a1a";
        ctxS3.shadowBlur = active ? 15 : 0;
        ctxS3.shadowColor = colorViolet;
        ctxS3.fill();
        ctxS3.strokeStyle = "white";
        ctxS3.stroke();
        ctxS3.fillStyle = active ? "black" : "white";
        ctxS3.textAlign = "center";
        ctxS3.textBaseline = "middle";
        ctxS3.fillText(node.id, node.x, node.y);
    });
}

function getNodeAtS3(x, y) {
    return nodesS3.find(n => Math.hypot(n.x - x, n.y - y) < 40);
}

function updateGridS3(letter, index) {
    const boxesS3 = document.querySelectorAll('#grid3 .letter-box');
    if (boxesS3[index]) boxesS3[index].innerText = letter;
}

function resetStep3() {
    document.querySelectorAll('#grid3 .letter-box').forEach(b => {
        b.innerText = "";
        b.className = 'letter-box';
    });
}