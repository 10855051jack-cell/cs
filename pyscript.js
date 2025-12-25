const canvas = document.getElementById('pygame-canvas');
const ctx = canvas.getContext('2d');
const GRID_SIZE = 5;
const WIDTH = 600;
const HEIGHT = 600;
const CELL_SIZE = WIDTH / GRID_SIZE;

let numbers = [];
let nextNumbers = [];
let currentNumber = 1;
let startTime = null;
let gameOver = false;
let elapsedTime = 0;
let timerInterval = null; // 用來儲存計時器實體
function resetGame() {
    // 停止之前的計時器
    if (timerInterval) clearInterval(timerInterval); 
    
    // 重置 HTML 顯示
    document.getElementById('timer-display').innerText = "時間：0.00 秒";
    
    numbers = Array.from({length: 25}, (_, i) => i + 1);
    nextNumbers = Array.from({length: 25}, (_, i) => i + 26);
    numbers.sort(() => Math.random() - 0.5);
    nextNumbers.sort(() => Math.random() - 0.5);
    
    currentNumber = 1;
    startTime = null;
    gameOver = false;
    draw();
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    drawGrid();
}

function drawGrid() {
    ctx.font = "bold 50px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const index = i * GRID_SIZE + j;
            const num = numbers[index];

            if (num !== 0) {
                // 格子顏色：後 25 號顏色稍微深一點區分
                ctx.fillStyle = num <= 25 ? "#ecf0f1" : "#bdc3c7";
                ctx.fillRect(j * CELL_SIZE + 2, i * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);

                ctx.fillStyle = "#2c3e50";
                ctx.fillText(num, j * CELL_SIZE + CELL_SIZE / 2, i * CELL_SIZE + CELL_SIZE / 2);
            }
        }
    }
}

function handleInput(clientX, clientY) {
    if (gameOver) return;

    // ... (省略中間座標計算邏輯) ...

    if (numbers[index] === currentNumber) {
        if (currentNumber === 1) {
            startTime = Date.now();
            // 啟動每 10 毫秒更新一次畫面的計時器
            timerInterval = setInterval(() => {
                const now = Date.now();
                const diff = ((now - startTime) / 1000).toFixed(2);
                document.getElementById('timer-display').innerText = `時間：${diff} 秒`;
            }, 10);
        }

        numbers[index] = nextNumbers.length > 0 ? nextNumbers.shift() : 0;
        currentNumber++;

        if (currentNumber > 50) {
            clearInterval(timerInterval); // 停止計時
            elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
            gameOver = true;
            showEndScreen();
        }
        draw();
    }
}
function showEndScreen() {
    document.querySelector('.game-area').style.display = 'none';
    const screen = document.getElementById('game-over-screen');
    const text = document.getElementById('result-text');
    screen.style.display = 'flex';
    text.innerText = `完成挑戰！總耗時：${elapsedTime} 秒`;
}

// 監聽事件
canvas.addEventListener('mousedown', (e) => handleInput(e.clientX, e.clientY));
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleInput(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });

window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'r') resetGame();

});


