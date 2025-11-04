let t = 0.0;
let vel = 0.02;
let num;
let paletteSelected;
let paletteSelected1;
let paletteSelected2;

// (不使用背景緩存，保持原始背景繪製以維持視覺不變)

// 新增：側邊選單設定
let sidebarW = 160;            
let sidebarAlpha = 220;
let menuItems = ["單元一作品", "單元一筆記", "測驗系統", "淡江大學教科系", "回到首頁"];  // 修改選單文字並新增選項
let itemH = 56;
let itemPadding = 16;
let hoveredIndex = -1;
let clickedIndex = -1;
let showHomeBox = true; // 是否顯示中間的小方框（預設首頁狀態）
let homeBoxText = "呂承諺 / 414730894";

// 新增：可收回動畫與觸發距離
let sidebarX = -sidebarW;        // 當前 X 偏移（-sidebarW 表示隱藏）
let sidebarTargetX = -sidebarW;  // 目標 X
// 使用 lerp 緩動以產生更平滑、無振盪的展開/收回
let sidebarEase = 0.32;          // 緩動參數（0 - 1，越大速度越快）
let openMargin = 220;            // 滑鼠靠左小於此值會打開（提高敏感度，改為較大範圍）
let closeMargin = 320;           // 滑出後要大於此值才會收回（避免頻繁開關）
let snapThreshold = 0.3;         // 距離小於此值就直接 snap 到目標

// （左上顯示但高度改為全螢幕）
let sidebarTopPadding = 12;
let sidebarTitleH = 28;

// 新增網站連結設定
// 對應 menuItems 的連結（index 從 0 開始）
const websites = {
    0: "https://benson960423-cloud.github.io/20251014_1/", // 單元一作品
    1: "https://hackmd.io/@dJPZyAMQQSuax1vS-NvSxA/BJhZKO13ee", // 單元一筆記
    2: "https://benson960423-cloud.github.io/111/",   // 測驗系統
    3: "https://www.et.tku.edu.tw/"                    // 淡江大學教科系
    // 4 (回到首頁) 特殊處理：關閉 iframe 並顯示中間方框
};

// 在 setup 中加入關閉按鈕事件監聽
function setup() {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(2);
    angleMode(DEGREES);
    num = random(100000);
    paletteSelected = random(palettes);
    paletteSelected1 = random(palettes);
    paletteSelected2 = random(palettes);

    // 設定關閉按鈕事件
    const closeBtn = document.getElementById('frame-close');
    closeBtn.addEventListener('click', () => {
        document.getElementById('content-frame').style.display = 'none';
        closeBtn.style.display = 'none';
        clickedIndex = -1;
        showHomeBox = false; // 關閉時也隱藏中間方框
    });
    // 初始狀態：隱藏 iframe、隱藏關閉按鈕，並顯示首頁小方框
    const iframe = document.getElementById('content-frame');
    iframe.style.display = 'none';
    closeBtn.style.display = 'none';
    showHomeBox = true;

    // 保持原始背景每幀繪製（不緩存），以維持視覺一致性
    // --- DOM 側邊選單交互設定（CSS 動畫處理開/收，避免影響 canvas 繪製）
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        const items = sidebar.querySelectorAll('li');
        items.forEach(li => {
            li.addEventListener('click', (e) => {
                const idx = parseInt(li.dataset.index, 10);
                handleMenuClick(idx);
                items.forEach(x => x.classList.remove('active'));
                li.classList.add('active');
            });
        });

        // 使用滑鼠位置控制選單 open/close（由 CSS 控制動畫）
        window.addEventListener('mousemove', (ev) => {
            if (ev.clientX < openMargin) {
                sidebar.classList.add('open');
            } else if (ev.clientX > closeMargin) {
                sidebar.classList.remove('open');
            }
        });
    }
}

function draw() {
    // 原始背景繪製（每幀），保持視覺效果一致
    randomSeed(num);
    background(bgCol());
    stroke("#355070");
    // 繪製背景圖樣（circle packing）——之前不小心移除，現在補回
    circlePacking();

    // 判斷是否在 sidebar 範圍（考慮目前 sidebarX）
    let localMouseX = mouseX - sidebarX;
    let isOverSidebar = localMouseX >= 0 && localMouseX <= sidebarW && mouseY >= 0 && mouseY <= height;

    // 使用 hysteresis：靠左小於 openMargin 開啟；離開超過 closeMargin 且不在選單內則收回
    if (mouseX < openMargin || isOverSidebar || clickedIndex !== -1) {
        sidebarTargetX = 0;
    } else if (mouseX > closeMargin) {
        sidebarTargetX = -sidebarW;
    }

    // 使用 lerp 緩動（無振盪、較平滑），並用指數轉換使其對幀率更穩定
    let dt = min(deltaTime / 1000.0, 0.05);
    // 把每幀的固定 ease 轉換成與幀率無關的等效值
    // 例如：easePerFrame = 1 - (1 - baseEase)^(dt*60)
    let easeFactor = 1 - Math.pow(1 - sidebarEase, dt * 60);
    sidebarX = lerp(sidebarX, sidebarTargetX, easeFactor);
    // 若非常接近目標則直接對齊以避免長時間微小誤差
    if (abs(sidebarTargetX - sidebarX) < snapThreshold) {
        sidebarX = sidebarTargetX;
    }

    // 若要求顯示中間方框，先畫在畫布中央（在選單之下但在背景之上）
    if (showHomeBox) drawHomeBox();
}

// 在畫面中央畫一個小方框顯示姓名與學號
function drawHomeBox() {
    push();
    let w = min(width * 0.5, 420);
    let h = 84;
    let x = width / 2 - w / 2;
    let y = height / 2 - h / 2;
    // 背景罩：半透明暗色
    fill(0, 0, 0, 120);
    rect(x - 12, y - 12, w + 24, h + 24, 12);
    // 白色方框
    fill(255);
    rect(x, y, w, h, 8);
    // 文字
    fill(30);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(homeBoxText, x + w / 2, y + h / 2);
    pop();
}

function circlePacking() {
    push();

    translate(width / 2, height / 2)
    let points = [];
    let count = 2000;
    for (let i = 0; i < count; i++) {
        let a = random(360);
        let d = random(width * 0.35);
        let s = random(200);
        let x = cos(a) * (d - s / 2);
        let y = sin(a) * (d - s / 2);
        let add = true;
        for (let j = 0; j < points.length; j++) {
            let p = points[j];
            if (dist(x, y, p.x, p.y) < (s + p.z) * 0.6) {
                add = false;
                break;
            }
        }
        if (add) points.push(createVector(x, y, s));
    }
    for (let i = 0; i < points.length; i++) {

        let p = points[i];
        let rot = random(360);
        push();
        translate(p.x, p.y);
        rotate(rot);
        blendMode(OVERLAY)
        let r = p.z - 5;
        gradient(r)
        shape(0, 0, r)
        pop();
    }
    pop();
 }

// 保留其他原有功能（gradient/shape/distortedCircle）不變

function shape(x, y, r) {
    push();
    noStroke();
    translate(x, y);
    let radius = r; //半徑
    let nums = 8
    for (let i = 0; i < 360; i += 360 / nums) {
        let ex = radius * sin(i);
        let ey = radius * cos(i);
        push();
        translate(ex,ey)
        rotate(atan2(ey, ex))
        distortedCircle(0,0,r);
    
        pop();
        stroke(randomCol())
        strokeWeight(0.5)
        line(0,0,ex,ey)
        ellipse(ex,ey,2)
    }
    pop();
}

function distortedCircle(x, y, r) {
    push();
    translate(x, y)
    //points
    let p1 = createVector(0, -r / 2);
    let p2 = createVector(r / 2, 0);
    let p3 = createVector(0, r / 2);
    let p4 = createVector(-r / 2, 0)
    //anker
    let val = 0.3;
    let random_a8_1 = random(-r * val, r * val)
    let random_a2_3 = random(-r * val, r * val)
    let random_a4_5 = random(-r * val, r * val)
    let random_a6_7 = random(-r * val, r * val)
    let ran_anker_lenA = r * random(0.2, 0.5)
    let ran_anker_lenB = r * random(0.2, 0.5)
    let a1 = createVector(ran_anker_lenA, -r / 2 + random_a8_1);
    let a2 = createVector(r / 2 + random_a2_3, -ran_anker_lenB);
    let a3 = createVector(r / 2 - random_a2_3, ran_anker_lenA);
    let a4 = createVector(ran_anker_lenB, r / 2 + random_a4_5);
    let a5 = createVector(-ran_anker_lenA, r / 2 - random_a4_5);
    let a6 = createVector(-r / 2 + random_a6_7, ran_anker_lenB);
    let a7 = createVector(-r / 2 - random_a6_7, -ran_anker_lenA);
    let a8 = createVector(-ran_anker_lenB, -r / 2 - random_a8_1);
    beginShape();
    vertex(p1.x, p1.y);
    bezierVertex(a1.x, a1.y, a2.x, a2.y, p2.x, p2.y)
    bezierVertex(a3.x, a3.y, a4.x, a4.y, p3.x, p3.y)
    bezierVertex(a5.x, a5.y, a6.x, a6.y, p4.x, p4.y)
    bezierVertex(a7.x, a7.y, a8.x, a8.y, p1.x, p1.y)
    endShape();
    pop();
}

// 新增：繪製側邊選單（全螢幕高度，寬度固定）
// 側邊選單已改用 DOM/CSS 實作 (見 index.html & style.css)，保留此空白註解以免編譯錯誤

// 新：滑鼠點擊處理（在左側 reveal 區或選單內點選）
// 將原本 mousePressed 的 revealMargin 改為 openMargin（一致）
function mousePressed() {
    // 若使用者在靠近左邊的 reveal 區域點擊，先打開選單
    if (mouseX < openMargin && sidebarTargetX !== 0) {
        sidebarTargetX = 0;
        return;
    }
    // 側邊選單點擊已由 DOM 處理；此處保留簡單的左側點擊快速開啟行為
    if (mouseX < openMargin) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.add('open');
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// DOM 端處理選單點擊行為（與原先行為一致）
function handleMenuClick(i) {
    clickedIndex = i;
    if (websites[i]) {
        const iframe = document.getElementById('content-frame');
        const closeBtn = document.getElementById('frame-close');
        iframe.src = websites[i];
        iframe.style.display = 'block';
        closeBtn.style.display = 'block';
        showHomeBox = false;
    } else if (i === 4) {
        // 回到首頁
        const iframe = document.getElementById('content-frame');
        const closeBtn = document.getElementById('frame-close');
        iframe.style.display = 'none';
        iframe.src = '';
        closeBtn.style.display = 'none';
        showHomeBox = true;
    }
}