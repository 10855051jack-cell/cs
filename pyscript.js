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
let timerInterval = null;

function resetGame() {
    // 1. 停止舊的計時器並重置顯示
    if (timerInterval) clearInterval(timerInterval);
    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) timerDisplay.innerText = "時間：0.00 秒";

    // 2. 初始化數字：1-25 號在畫面上，26-50 號待命
    numbers = Array.from({length: 25}, (_, i) => i + 1);
    nextNumbers = Array.from({length: 25}, (_, i) => i + 26);
    
    // 洗牌
    numbers.sort(() => Math.random() - 0.5);
    nextNumbers.sort(() => Math.random() - 0.5);
    
    currentNumber = 1;
    startTime = null;
    gameOver = false;
    
    // 確保介面正確顯示
    document.getElementById('game-over-screen').style.display = 'none';
    document.querySelector('.game-area').style.display = 'flex';
    
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
                // 格子顏色：1-25 淺色，26-50 稍微深一點
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

    // 座標轉換邏輯：將螢幕點擊位置轉換為 Canvas 內部的 600x600 座標
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);
    const index = row * GRID_SIZE + col;

    // 檢查點擊是否正確
    if (numbers[index] === currentNumber) {
        // 點擊第一個數字時開始計時
        if (currentNumber === 1) {
            startTime = Date.now();
            timerInterval = setInterval(() => {
                const now = Date.now();
                const diff = ((now - startTime) / 1000).toFixed(2);
                const display = document.getElementById('timer-display');
                if (display) display.innerText = `時間：${diff} 秒`;
            }, 10);
        }

        // 補上後備數字 (26-50)，若無則設為 0 (空位)
        numbers[index] = nextNumbers.length > 0 ? nextNumbers.shift() : 0;
        currentNumber++;

        // 檢查是否完成 50 個數字
        if (currentNumber > 50) {
            clearInterval(timerInterval);
            elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
            gameOver = true;
            setTimeout(showEndScreen, 100); // 稍微延遲讓最後一個數字消失的畫面能渲染出來
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

// 事件監聽
canvas.addEventListener('mousedown', (e) => handleInput(e.clientX, e.clientY));
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // 防止手機縮放或滾動
    handleInput(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });

window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'r') resetGame();
});
