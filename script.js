/* The following functions are all the connections to UI inputs */
function onWidthSiderInput(widthSliderInput) {
    let widthPercent = widthSliderInput.value;
    let newWidth = Math.round(widthPercent / 100 * maxWidth);
    let wholeThingContainer = document.getElementById("wholeThingContainer");
    wholeThingContainer.style.width = newWidth + "px";
    width = newWidth;
    canvas.width = width;
    currentSpeedCenter.x = width / 2;
    topRightLogoCenter.x = width - 187;
    lastPathRenderTimeMillis = 0;
}

function onCurrentSpeedInput() {
    let input = document.getElementById("currentSpeedInput");
    let output = document.getElementById("currentSpeedTop");
    output.innerText = input.value;
    
    let currentSpeedDigits = input.value.toString().length;
    if (currentSpeedDigits <= 2) {
        radiusAroundCurrentSpeed = twoDigitRadius;
    } else {
        radiusAroundCurrentSpeed = threeDigitRadius;
    }
}

function onMaxSpeedInput() {
    let input = document.getElementById("maxSpeedInput");
    let output = document.getElementById("maxSpeedBottom");
    output.innerText = input.value;
}

function onSpeedLimitInput() {
    let input = document.getElementById("speedLimitInput");
    let output = document.getElementById("speedLimitBottom");
    output.innerText = input.value;
}

function onPreviousArrangementClicked() {
    generalArrangementIndex--;
    if (generalArrangementIndex < 0) {
        generalArrangementIndex = 4;
    }
    let output = document.getElementById("generalArrangement");
    output.innerText = generalArrangementIndex + 1;

    // Handle crossing between left/right and top/bottom styles
    if (generalArrangementIndex === 4 && leftRightStylesList.indexOf(generalStyle) > 2) {
        generalStyle = TopBottomStyles.STRAIGHT;
        output = document.getElementById("generalStyle");
        output.innerText = generalStyle;
    }
}

function onNextArrangementClicked() {
    generalArrangementIndex = (generalArrangementIndex + 1) % 5;
    let output = document.getElementById("generalArrangement");
    output.innerText = generalArrangementIndex + 1;

    // Handle crossing between left/right and top/bottom styles
    if (generalArrangementIndex === 3 && leftRightStylesList.indexOf(generalStyle) > 2) {
        generalStyle = TopBottomStyles.STRAIGHT;
        output = document.getElementById("generalStyle");
        output.innerText = generalStyle;
    }
}

function onPreviousStyleClicked() {
    let styleList;
    let listLength;
    if (generalArrangementIndex <= 2) {
        styleList = leftRightStylesList;
        listLength = leftRightStylesList.length;
    } else {
        styleList = topBottomStylesList;
        listLength = topBottomStylesList.length - 1;
    }

    let currentStyleIndex = styleList.indexOf(generalStyle);
    currentStyleIndex--;
    if (currentStyleIndex < 0) {
        currentStyleIndex = listLength - 1;
    }
    let currentStyle = styleList[currentStyleIndex];
    generalStyle = currentStyle;

    let output = document.getElementById("generalStyle");
    output.innerText = currentStyle;
}

function onNextStyleClicked() {
    let styleList;
    let listLength;
    if (generalArrangementIndex <= 2) {
        styleList = leftRightStylesList;
        listLength = leftRightStylesList.length;
    } else {
        styleList = topBottomStylesList;
        listLength = topBottomStylesList.length - 1;
    }

    let currentStyleIndex = styleList.indexOf(generalStyle);
    currentStyleIndex = (currentStyleIndex + 1) % listLength;
    let currentStyle = styleList[currentStyleIndex];
    generalStyle = currentStyle;

    let output = document.getElementById("generalStyle");
    output.innerText = currentStyle;
}

let LeftRightStyles = {
    STRAIGHT: "Straight",
    STRAIGHT_ROUNDED: "Straight Rounded",
    STRAIGHT_SEGMENTED: "Straight Segmented",
    CIRCULAR: "Circular",
    CIRCULAR_ROUNDED: "Circular Rounded",
    CIRCULAR_SEGMENTED: "Circular Segmented",
};
let leftRightStylesList = [
    LeftRightStyles.STRAIGHT,
    LeftRightStyles.STRAIGHT_ROUNDED,
    LeftRightStyles.STRAIGHT_SEGMENTED,
    LeftRightStyles.CIRCULAR,
    LeftRightStyles.CIRCULAR_ROUNDED,
    LeftRightStyles.CIRCULAR_SEGMENTED,
];
let left1Style = LeftRightStyles.CIRCULAR_ROUNDED;
let left2Style = LeftRightStyles.CIRCULAR_ROUNDED;
let right1Style = LeftRightStyles.CIRCULAR_ROUNDED;
let right2Style = LeftRightStyles.CIRCULAR_ROUNDED;
let leftRightStyle = LeftRightStyles.CIRCULAR_ROUNDED;

let TopBottomStyles = {
    STRAIGHT: "Straight",
    STRAIGHT_ROUNDED: "Straight Rounded",
    STRAIGHT_SEGMENTED: "Straight Segmented",
    STEERING: "Steering",
};
let topBottomStylesList = [
    TopBottomStyles.STRAIGHT,
    TopBottomStyles.STRAIGHT_ROUNDED,
    TopBottomStyles.STRAIGHT_SEGMENTED,
    TopBottomStyles.STEERING,
];
let top1Style = LeftRightStyles.STRAIGHT_ROUNDED;
let top2Style = LeftRightStyles.STRAIGHT_ROUNDED;
let bottom1Style = LeftRightStyles.STRAIGHT_ROUNDED;
let bottom2Style = LeftRightStyles.STRAIGHT_ROUNDED;
let topBottomStyle = TopBottomStyles.STRAIGHT_ROUNDED;

let generalArrangementIndex = 0;
let generalStyle = LeftRightStyles.STRAIGHT_ROUNDED;

let brakeFill = "rgb(255, 120, 120)";
let throttleFill = "rgb(80, 255, 120)"
let steeringFill = "rgb(150, 150, 255)"

let maxWidth = 2160;
let width = 2160;
let height = 1080;
let canvas = document.getElementById("theCanvas");
let ctx = canvas.getContext("2d");

let sourceCanvas = document.createElement("canvas");
sourceCanvas.id = "sourceCanvas";
sourceCanvas.width = 1000;
sourceCanvas.height = 1000;
let stx = sourceCanvas.getContext("2d");

let destinationCanvas = document.createElement("canvas");
destinationCanvas.id = "destinationCanvas";
destinationCanvas.width = 1000;
destinationCanvas.height = 1000;
let dtx = destinationCanvas.getContext("2d");

let lastPathRenderTimeMillis = 0;
let pathRenderIntervalMillis = 80;

let pathTopLeft = {x: 0, y: 0, xMin: 0, xMax: 0, yMin: 0, yMax: 0};
let pathTopRight = {x: 0, y: 0, xMin: 0, xMax: 0, yMin: 0, yMax: 0};
let pathBottomLeft = {x: 0, y: 0, xMin: 0, xMax: 0, yMin: 0, yMax: 0};
let pathBottomRight = {x: 0, y: 0, xMin: 0, xMax: 0, yMin: 0, yMax: 0};

let cpY;
let leftCpX;
let rightCpX;
let weight;

let pathGradient = ctx.createLinearGradient(0, height, 0, height / 2);
pathGradient.addColorStop(0, "rgba(80, 188, 80, 0.70)");
pathGradient.addColorStop(1, "rgba(70, 110, 70, 0.70)");

let currentSpeedCenter = {x: width / 2, y: 204};
let twoDigitRadius = 146;
let threeDigitRadius = 178;
let radiusAroundCurrentSpeed = 146;
let topRightLogoCenter = {x: width - 187, y: 189};
let radiusAroundTopRightLogo = 126;

let imagesLoaded = false;

// Load steering wheel image
let steeringWheelCanvas = document.createElement("canvas");
steeringWheelCanvas.width = 32;
steeringWheelCanvas.height = 32;
let wheelCtx = steeringWheelCanvas.getContext("2d");
let steeringWheelImage = new Image(32, 32);
steeringWheelImage.onload = () => {
    wheelCtx.drawImage(steeringWheelImage, 0, 0);
    imagesLoaded = true;
    console.log("loaded");
};
steeringWheelImage.src = "steering_wheel_icon.png";

let mouseX = 0;
let mouseY = 0;
document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// let previousTimeMillis = 0;
window.requestAnimationFrame(draw);

function renderPath(currentTimeMillis) {
    pathTopLeft.x = width / 2 - 40;
    pathTopLeft.y = height / 2 + 50;
    pathTopRight.x = width / 2 + 40;
    pathTopRight.y = height / 2 + 50;
    pathBottomLeft.x = width / 2 - 350;
    pathBottomLeft.y = height;
    pathBottomRight.x = width / 2 + 350;
    pathBottomRight.y = height;

    // Perturb the path in several ways
    weight = 0.45
    weight += 0.04 * (2 * Math.random() - 1);

    let topShift = getRandomInt(-5, 5);
    pathTopLeft.x += topShift;
    pathTopRight.x += topShift;

    let bottomShift = getRandomInt(-10, 10);
    pathBottomLeft.x += bottomShift;
    pathBottomRight.x += bottomShift;
    
    cpY = (pathBottomLeft.y + pathTopLeft.y) / 2;
    cpY += getRandomInt(-8, 8);

    let cpXShift = getRandomInt(-10, 10);
    leftCpX = weight * pathBottomLeft.x + (1 - weight) * pathTopLeft.x;
    leftCpX += cpXShift;
    rightCpX = weight * pathBottomRight.x + (1 - weight) * pathTopRight.x;
    rightCpX += cpXShift;

    lastPathRenderTimeMillis = currentTimeMillis;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

function draw(currentTimeMillis) {
    ctx.save();
    stx.save();
    dtx.save();

    ctx.clearRect(0, 0, width, height);
    stx.clearRect(0, 0, 1000, 1000);
    dtx.clearRect(0, 0, 1000, 1000);

    if (currentTimeMillis - lastPathRenderTimeMillis > pathRenderIntervalMillis) {
        renderPath(currentTimeMillis);
    }

    // Draw path
    ctx.fillStyle = pathGradient;
    ctx.beginPath();
    ctx.moveTo(pathTopRight.x, pathTopRight.y);
    ctx.lineTo(pathTopLeft.x, pathTopLeft.y);
    ctx.quadraticCurveTo(leftCpX, cpY, pathBottomLeft.x, pathBottomLeft.y);
    ctx.lineTo(pathBottomRight.x, pathBottomRight.y);
    ctx.quadraticCurveTo(rightCpX, cpY, pathTopRight.x, pathTopRight.y);
    ctx.fill();

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    let fillRatio = Math.cos(currentTimeMillis / 2000);
    let fillRatioAbs = Math.abs(fillRatio);

    // ctx.beginPath();
    // ctx.arc(currentSpeedCenter.x, currentSpeedCenter.y, radiusAroundCurrentSpeed, 0, 2 * Math.PI);
    // ctx.stroke();

    // ctx.beginPath();
    // ctx.arc(topRightLogoCenter.x, topRightLogoCenter.y, radiusAroundTopRightLogo, 0, 2 * Math.PI);
    // ctx.stroke();

    drawTopRightLogoBar(28, 160, topRightLogoCenter.x, topRightLogoCenter.y, fillRatioAbs, radiusAroundTopRightLogo, "white");

    let h = 180;
    let w = 28;
    let left1Location = {w: w, h: h, leftX: currentSpeedCenter.x - radiusAroundCurrentSpeed - w, topY: currentSpeedCenter.y - h / 2, centerX: currentSpeedCenter.x, centerY: currentSpeedCenter.y};
    let left2Location = {w: w, h: h, leftX: currentSpeedCenter.x - radiusAroundCurrentSpeed - w - w - w / 2, topY: currentSpeedCenter.y - h / 2, centerX: currentSpeedCenter.x - w - w / 2, centerY: currentSpeedCenter.y};
    let right1Location = {w: w, h: h, leftX: currentSpeedCenter.x + radiusAroundCurrentSpeed, topY: currentSpeedCenter.y - h / 2, centerX: currentSpeedCenter.x, centerY: currentSpeedCenter.y};
    let right2Location = {w: w, h: h, leftX: currentSpeedCenter.x + radiusAroundCurrentSpeed + w + w / 2, topY: currentSpeedCenter.y - h / 2, centerX: currentSpeedCenter.x + w + w / 2, centerY: currentSpeedCenter.y};

    w = 280;
    h = 24;
    let top1Location = {w: w, h: h, centerX: currentSpeedCenter.x, topY: currentSpeedCenter.y - 130};
    let top2Location = {w: w, h: h, centerX: currentSpeedCenter.x, topY: currentSpeedCenter.y - 130 - h - h / 2};
    let bottom1Location = {w: w, h: h, centerX: currentSpeedCenter.x, topY: currentSpeedCenter.y + radiusAroundCurrentSpeed + 14};
    let bottom2Location = {w: w, h: h, centerX: currentSpeedCenter.x, topY: currentSpeedCenter.y + radiusAroundCurrentSpeed + h + h / 2 + 14};

    switch (generalArrangementIndex) {
        case 0:
            // two on the left
            drawTopBottomUIElement(fillRatioAbs, top1Location, TopBottomStyles.STEERING, steeringFill);
            drawLeftRightUIElement(fillRatioAbs, left1Location, generalStyle, true, throttleFill);
            drawLeftRightUIElement(fillRatioAbs, left2Location, generalStyle, true, brakeFill);
            break;
        case 1:
            // one on each side
            drawTopBottomUIElement(fillRatioAbs, top1Location, TopBottomStyles.STEERING, steeringFill);
            drawLeftRightUIElement(fillRatioAbs, left1Location, generalStyle, true, brakeFill);
            drawLeftRightUIElement(fillRatioAbs, right1Location, generalStyle, false, throttleFill);
            break;
        case 2:
            // two on the right
            drawTopBottomUIElement(fillRatioAbs, top1Location, TopBottomStyles.STEERING, steeringFill);
            drawLeftRightUIElement(fillRatioAbs, right1Location, generalStyle, false, brakeFill);
            drawLeftRightUIElement(fillRatioAbs, right2Location, generalStyle, false, throttleFill);
            break;
        case 3:
            // two on the top
            drawTopBottomUIElement(fillRatioAbs, top1Location, generalStyle, brakeFill);
            drawTopBottomUIElement(fillRatioAbs, top2Location, generalStyle, throttleFill);
            drawTopBottomUIElement(fillRatioAbs, bottom1Location, TopBottomStyles.STEERING, steeringFill);
            break;
        case 4:
            // one on top, one on bottom
            drawTopBottomUIElement(fillRatioAbs, top1Location, TopBottomStyles.STEERING, steeringFill);
            drawTopBottomUIElement(fillRatioAbs, bottom1Location, generalStyle, throttleFill);
            drawTopBottomUIElement(fillRatioAbs, bottom2Location, generalStyle, brakeFill);
            break;
    }
    
    dtx.restore();
    stx.restore();
    ctx.restore();


    window.requestAnimationFrame(draw);
}

function drawLeftRightUIElement(fillRatio, location, style, left, fill) {
    switch (style) {
        case LeftRightStyles.STRAIGHT:
            drawVerticalBar(
                location.w,
                location.h,
                fillRatio,
                location.leftX,
                location.topY,
                fill,
            );
            break;
        case LeftRightStyles.STRAIGHT_ROUNDED:
            drawRoundedVerticalBar(
                location.w,
                location.h,
                fillRatio,
                location.leftX,
                location.topY,
                fill,
            );
            break;
        case LeftRightStyles.STRAIGHT_SEGMENTED:
            drawVerticalSegmentedBar(
                location.w,
                location.h,
                fillRatio,
                location.leftX,
                location.topY,
                fill,
            );
            break;
        case LeftRightStyles.CIRCULAR:
            if (left) {
                drawLeftCircularBar(
                    location.w,
                    location.h,
                    location.centerX,
                    location.centerY,
                    fillRatio,
                    radiusAroundCurrentSpeed,
                    fill,
                );
            } else {
                drawRightCircularBar(
                    location.w,
                    location.h,
                    location.centerX,
                    location.centerY,
                    fillRatio,
                    radiusAroundCurrentSpeed,
                    fill,
                );
            }
            break;
        case LeftRightStyles.CIRCULAR_ROUNDED:
            if (left) {
                drawLeftCircularRoundedBar(
                    location.w,
                    location.h,
                    location.centerX,
                    location.centerY,
                    fillRatio,
                    radiusAroundCurrentSpeed,
                    fill,
                );
            } else {
                drawRightCircularRoundedBar(
                    location.w,
                    location.h,
                    location.centerX,
                    location.centerY,
                    fillRatio,
                    radiusAroundCurrentSpeed,
                    fill,
                );
            }
            break;
        case LeftRightStyles.CIRCULAR_SEGMENTED:
            if (left) {
                drawLeftCircularSegmentedBar(
                    location.w,
                    location.h,
                    location.centerX,
                    location.centerY,
                    fillRatio,
                    radiusAroundCurrentSpeed,
                    fill,
                );
            } else {
                drawRightCircularSegmentedBar(
                    location.w,
                    location.h,
                    location.centerX,
                    location.centerY,
                    fillRatio,
                    radiusAroundCurrentSpeed,
                    fill,
                );
            }
            break;
    }
}

function drawTopBottomUIElement(fillRatio, location, style, fill) {
    switch (style) {
        case TopBottomStyles.STRAIGHT:
            drawHorizontalBar(
                location.w,
                location.h,
                fillRatio,
                location.centerX,
                location.topY,
                fill,
            );
            break;
        case TopBottomStyles.STRAIGHT_ROUNDED:
            drawHorizontalRoundedBar(
                location.w,
                location.h,
                fillRatio,
                location.centerX,
                location.topY,
                fill,
            );
            break;
        case TopBottomStyles.STRAIGHT_SEGMENTED:
            drawHorizontalSegmentedBar(
                location.w,
                location.h,
                fillRatio,
                location.centerX,
                location.topY,
                fill,
            );
            break;
        case TopBottomStyles.STEERING:
            drawHorizontalSteeringBar(
                fillRatio,
                location.w,
                location.h,
                location.centerX,
                location.topY,
                fill,
            );
            break;
    }
}

function drawVerticalBar(
    w,
    h,
    fillRatio,
    leftX,
    topY,
    fill,
) {
    // Background
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(
        leftX,
        topY,
        w,
        h,
    );

    // Actual bar
    let barSize = 0.4*w;
    let innerBottomY = topY + h - (w - barSize)/2;
    ctx.strokeStyle = fill;
    ctx.lineWidth = barSize;
    ctx.lineCap = "butt";
    ctx.beginPath();
    ctx.moveTo(leftX + w/2, innerBottomY);
    ctx.lineTo(leftX + w/2, innerBottomY - fillRatio * (h - (w - barSize)));
    ctx.stroke();

    // Outline draw area
    // ctx.strokeStyle = "white";
    // ctx.lineWidth = 2;
    // ctx.strokeRect(
    //     topLeftX,
    //     topY,
    //     w,
    //     h,
    // );
};

function drawRoundedVerticalBar(
    w,
    h,
    fillRatio,
    leftX,
    topY,
    fill,
) {
    let innerWidth = 0.4*w;
    let innerHeight = h - w + innerWidth;

    // Background
    ctx.lineWidth = w;
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"
    ctx.beginPath();
    ctx.moveTo(leftX + w/2, topY + h - w/2);
    ctx.lineTo(leftX + w/2, topY + w/2);
    ctx.stroke();

    // Background mask
    stx.globalCompositeOperation = "source-over";
    stx.fillStyle = "grey";
    stx.fillRect(0, 0, w, h);

    // Cut out the inner rounded bar
    stx.globalCompositeOperation = "destination-out";
    stx.strokeStyle = "grey";
    stx.lineWidth = innerWidth;
    stx.lineCap = "round";
    stx.beginPath();
    stx.moveTo(w/2, w/2);
    stx.lineTo(w/2, w/2 + innerHeight - innerWidth);
    stx.stroke();

    // Actual displayed bar
    dtx.globalCompositeOperation = "source-over";
    dtx.fillStyle = fill;
    dtx.fillRect(
        w/2 - innerWidth/2,
        w/2 - innerWidth/2 + (1 - fillRatio) * innerHeight,
        innerWidth,
        innerHeight * fillRatio,
    );

    // Remove everything but the rounded inner bar
    dtx.globalCompositeOperation = "destination-out";
    dtx.drawImage(sourceCanvas, 0, 0);

    ctx.drawImage(destinationCanvas, leftX, topY);

    // Outline the draw area
    // ctx.lineWidth = 2;
    // ctx.strokeStyle = "white";
    // ctx.strokeRect(leftX, topY, w, h);

    // Clear the helper canvases so other draw methods can reuse it
    dtx.globalCompositeOperation = "source-over";
    dtx.clearRect(0, 0, 1000, 1000);
    stx.globalCompositeOperation = "source-over";
    stx.clearRect(0, 0, 1000, 1000);
};

function drawVerticalSegmentedBar(
    w,
    h,
    fillRatio,
    leftX,
    topY,
    fill,
) {
    let b = 4; // bar height
    let g = 4; // gap height
    let n = Math.round(h / (b + g)) - 1; // number of bars
    let actualHeight = (n + 1)*b + n*g;
    let barWidth = 0.7*w;
    topY += (h - actualHeight) / 2;

    // Background
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.lineWidth = w;
    ctx.lineCap = "butt";
    ctx.beginPath();
    ctx.moveTo(leftX + w/2, topY);
    ctx.lineTo(leftX + w/2, topY + actualHeight);
    ctx.stroke();
    
    // Background mask
    stx.globalCompositeOperation = "source-over";
    stx.fillStyle = "gray";
    stx.fillRect(0, 0, w, actualHeight);
    
    // Cut out bars
    stx.globalCompositeOperation = "destination-out";
    let y = g/2 + b/2;
    for (let i = 0; i < n; i++) {
        stx.beginPath();
        stx.roundRect(
            (w - barWidth) / 2,
            Math.floor(y),
            barWidth,
            b,
            b / 2,
        );
        stx.fill();
        stx.closePath();
        y += b + g;
    }

    // Actual displayed bar
    dtx.globalCompositeOperation = "source-over";
    dtx.fillStyle = fill;
    dtx.fillRect(
        0,
        actualHeight - fillRatio * actualHeight,
        w,
        fillRatio * actualHeight,
    );
    
    // Remove everything but the cut out bar sections
    dtx.globalCompositeOperation = "destination-out";
    dtx.drawImage(
        sourceCanvas,
        0,
        0,
        w,
        actualHeight,
        0,
        0,
        w,
        actualHeight,
    );

    // Outline the draw area
    // ctx.strokeStyle = "white";
    // ctx.lineWidth = 2;
    // ctx.strokeRect(
    //     leftX,
    //     topY,
    //     w,
    //     actualHeight,
    // );

    ctx.drawImage(destinationCanvas, leftX, topY);

    // Clear the helper canvases so other draw methods can reuse it
    dtx.globalCompositeOperation = "source-over";
    dtx.clearRect(0, 0, 1000, 1000);
    stx.globalCompositeOperation = "source-over";
    stx.clearRect(0, 0, 1000, 1000);
};

function drawHorizontalBar(
    w,
    h,
    fillRatio,
    centerX,
    topY,
    fill,
) {
    // Background
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(
        centerX - w / 2,
        topY,
        w,
        h,
    );
    
    // Actual bar
    let barSize = 0.4*h;
    ctx.fillStyle = fill;
    ctx.fillRect(
        centerX - w/2 + (h - barSize)/2,
        topY + (h - barSize)/2,
        fillRatio * (w - (h - barSize)),
        barSize,
    );

    // Outline draw area
    // ctx.strokeStyle = "white";
    // ctx.lineWidth = 2;
    // ctx.strokeRect(
    //     centerX - w / 2,
    //     topY,
    //     w,
    //     h,
    // );
};

function drawHorizontalRoundedBar(
    w,
    h,
    fillRatio,
    centerX,
    topY,
    fill,
) {
    let innerHeight = 0.4*h;
    let innerWidth = w - h + innerHeight;
    let centerY = topY + h/2;
    
    // Background
    ctx.lineWidth = h;
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"
    ctx.beginPath();
    ctx.moveTo(centerX - w/2 + h/2, centerY);
    ctx.lineTo(centerX + w/2 - h/2, centerY);
    ctx.stroke();
    
    // Background mask
    stx.globalCompositeOperation = "source-over";
    stx.fillStyle = "grey";
    stx.fillRect(0, 0, w, h);

    // Cut out the inner rounded bar
    stx.globalCompositeOperation = "destination-out";
    stx.strokeStyle = "grey";
    stx.lineWidth = innerHeight;
    stx.lineCap = "round";
    stx.beginPath();
    stx.moveTo(h/2, h/2);
    stx.lineTo(h/2 + innerWidth - innerHeight, h/2);
    stx.stroke();
    
    // Actual displayed bar
    dtx.globalCompositeOperation = "source-over";
    dtx.fillStyle = fill;
    dtx.fillRect(h/2 - innerHeight/2, h/2 - innerHeight/2, innerWidth * fillRatio, innerHeight);

    // Remove everything but the rounded inner bar
    dtx.globalCompositeOperation = "destination-out";
    dtx.drawImage(sourceCanvas, 0, 0);

    ctx.drawImage(destinationCanvas, centerX - w/2, centerY - h/2);

    // Outline the draw area
    // ctx.lineWidth = 2;
    // ctx.strokeStyle = "white";
    // ctx.strokeRect(centerX - w/2, centerY - h/2, w, h);

    // Clear the helper canvases so other draw methods can reuse it
    dtx.globalCompositeOperation = "source-over";
    dtx.clearRect(0, 0, 1000, 1000);
    stx.globalCompositeOperation = "source-over";
    stx.clearRect(0, 0, 1000, 1000);
};

function drawSteeringSplitBar(
    steerRatio,
    w,
    h,
    centerX,
    topY,
) {
    let gap = 48;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(
        centerX - w / 2,
        topY,
        w / 2 - gap / 2,
        h,
    );
    ctx.strokeRect(
        centerX + gap / 2,
        topY,
        w / 2 - gap / 2,
        h,
    );
    ctx.fillStyle = "white";
    if (steerRatio > 0) {
        ctx.fillRect(
            centerX + gap / 2,
            topY,
            steerRatio * (w / 2 - gap / 2),
            h,
        );
    } else if (steerRatio < 0) {
        ctx.fillRect(
            centerX - gap / 2 + steerRatio * (w / 2 - gap / 2),
            topY,
            -steerRatio * (w / 2 - gap / 2),
            h,
        );
    }

    if (imagesLoaded) {
        ctx.drawImage(
            steeringWheelCanvas,
            centerX - 16,
            topY - 4,
        );
    }
}

function drawHorizontalSteeringBar(
    fillRatio,
    w,
    h,
    centerX,
    topY,
    fill,
) {
    if (imagesLoaded) {
        ctx.drawImage(
            steeringWheelCanvas,
            centerX - w/2,
            topY - 4,
        );
    }

    let steeringWheelSpace = steeringWheelCanvas.width + 14;
    drawHorizontalBar(
        w - steeringWheelSpace,
        h,
        fillRatio,
        centerX + steeringWheelSpace / 2,
        topY,
        fill,
    );
}

function drawHorizontalSegmentedBar(
    w,
    h,
    fillRatio,
    centerX,
    topY,
    fill,
) {
    let b = 5; // bar width
    let g = 7; // gap width
    let n = Math.round(w / (b + g)) - 1; // number of bars
    let actualWidth = (n + 1)*b + n*g;
    let leftX = centerX - actualWidth / 2;

    // Background
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.lineWidth = h;
    ctx.lineCap = "butt";
    ctx.beginPath();
    ctx.moveTo(leftX, topY + h/2);
    ctx.lineTo(leftX + actualWidth, topY + h/2);
    ctx.stroke();
    
    // Background mask
    stx.globalCompositeOperation = "source-over";
    stx.fillStyle = "gray";
    stx.fillRect(0, 0, actualWidth, h);
    
    // Cut out bars
    stx.globalCompositeOperation = "destination-out";
    let x = g/2 + b/2;
    for (let i = 0; i < n; i++) {
        stx.beginPath();
        stx.roundRect(
            Math.floor(x),
            0.1 * h,
            b,
            0.8 * h,
            b / 2,
        );
        stx.fill();
        stx.closePath();
        x += b + g;
    }

    // Actual displayed bar
    // let throttleGradient = ctx.createLinearGradient(
    //     centerX - actualWidth / 2, 0,
    //     centerX + actualWidth / 2, 0,
    // );
    // throttleGradient.addColorStop(0, 'mediumseagreen');
    // throttleGradient.addColorStop(1, 'darkgreen');
    // ctx.fillStyle = throttleGradient;
    dtx.fillStyle = fill;
    dtx.fillRect(
        0,
        0,
        fillRatio * actualWidth,
        h,
    );
    
    // Remove everything but the cut out bar sections
    dtx.globalCompositeOperation = "destination-out";
    dtx.drawImage(
        sourceCanvas,
        0,
        0,
        actualWidth,
        h,
        0,
        0,
        actualWidth,
        h,
    );

    // Outline the draw area
    // ctx.strokeStyle = "white";
    // ctx.lineWidth = 2;
    // ctx.strokeRect(
    //     leftX,
    //     topY,
    //     actualWidth,
    //     h,
    // );

    ctx.drawImage(destinationCanvas, leftX, topY);

    // Clear the helper canvases so other draw methods can reuse it
    dtx.globalCompositeOperation = "source-over";
    dtx.clearRect(0, 0, 1000, 1000);
    stx.globalCompositeOperation = "source-over";
    stx.clearRect(0, 0, 1000, 1000);
};

function drawLeftCircularBar(
    w,
    h,
    centerX,
    centerY,
    fillRatio,
    radius,
    fill,
) {
    let padding = 0.25 * w;
    let innerAngle = Math.asin(((h - 2*padding) / 2) / radius);
    let outerAngle = Math.asin((h / 2) / radius);

    // Background
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.arc(
        centerX,
        centerY,
        radius,
        -outerAngle + Math.PI,
        outerAngle + Math.PI,
    );
    ctx.arc(
        centerX - w,
        centerY,
        radius,
        outerAngle + Math.PI,
        -outerAngle + Math.PI,
        true,
    );
    ctx.closePath();
    ctx.fill();

    // Inner bar
    ctx.fillStyle = fill;
    let bottomAngle = Math.PI - innerAngle;
    ctx.beginPath();
    ctx.arc(
        centerX - padding,
        centerY,
        radius,
        bottomAngle,
        bottomAngle + fillRatio * 2 * innerAngle,
    );
    ctx.arc(
        centerX - w + padding,
        centerY,
        radius,
        bottomAngle + fillRatio * 2 * innerAngle,
        bottomAngle,
        true,
    );
    ctx.closePath();
    ctx.fill();

    // Outline the draw area
    // ctx.strokeStyle = "white";
    // ctx.lineWidth = 2;
    // ctx.beginPath();
    // ctx.arc(
    //     centerX,
    //     centerY,
    //     radius,
    //     -outerAngle + Math.PI,
    //     outerAngle + Math.PI,
    // );
    // ctx.arc(
    //     centerX - w,
    //     centerY,
    //     radius,
    //     outerAngle + Math.PI,
    //     -outerAngle + Math.PI,
    //     true,
    // );
    // ctx.closePath();
    // ctx.stroke();
}

function drawLeftCircularSegmentedBar(
    w,
    h,
    centerX,
    centerY,
    fillRatio,
    radius,
    fill,
) {
    let padding = 0.1 * w;
    let innerH = h - 2*padding;

    let b = 5; // bar height
    let g = 6; // gap height
    let n = Math.round(innerH / (b + g)) - 1; // number of bars
    let actualHeight = (n+1)*b + n*g;
    let barWidth = w - 2*padding;
    
    let innerAngle = Math.asin((actualHeight - 2*padding) / 2 / radius);
    let outerAngle = Math.asin(actualHeight / 2 / radius);

    // Background
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.arc(
        centerX,
        centerY,
        radius,
        -outerAngle + Math.PI,
        outerAngle + Math.PI,
    );
    ctx.arc(
        centerX - w,
        centerY,
        radius,
        outerAngle + Math.PI,
        -outerAngle + Math.PI,
        true,
    );
    ctx.closePath();
    ctx.fill();

    // Background mask
    stx.globalCompositeOperation = "source-over";
    stx.fillStyle = "gray";
    // let bWidth = 2 * w + 2;
    let bWidth = 1000;
    let bHeight = actualHeight + 4;
    stx.fillRect(0, 0, bWidth, bHeight);

    // Cut out bars
    stx.globalCompositeOperation = "destination-out";
    let xOffset = radius;
    let rSquared = radius * radius;
    let dy = -actualHeight/2 + g/2 + b/2;
    for (let i = 0; i < n; i++) {
        let barCenterY = dy + b/2;
        let dx = Math.sqrt(rSquared - barCenterY * barCenterY);
        stx.beginPath();
        stx.roundRect(
            -dx + (w - barWidth)/2 + xOffset,
            Math.floor(dy + actualHeight/2),
            barWidth,
            b,
            b / 2,
        );
        stx.fill();
        stx.closePath();
        dy += b + g;
    }

    // Actual displayed bar
    let relCenterX = radius + w;
    let relCenterY = actualHeight / 2;
    let bottomAngle = Math.PI - innerAngle;
    dtx.globalCompositeOperation = "source-over";
    dtx.fillStyle = fill;
    dtx.beginPath();
    dtx.arc(
        relCenterX,
        relCenterY,
        radius,
        bottomAngle,
        bottomAngle + fillRatio * 2 * innerAngle,
    );
    dtx.arc(
        relCenterX - w,
        relCenterY,
        radius,
        bottomAngle + fillRatio * 2 * innerAngle,
        bottomAngle,
        true,
    );
    dtx.closePath();
    dtx.fill();

    // Remove everything but the cut out bar sections
    dtx.globalCompositeOperation = "destination-out";
    dtx.drawImage(
        sourceCanvas,
        0,
        0,
        bWidth,
        bHeight,
        0,
        0,
        bWidth,
        bHeight,
    );

    let leftX = centerX - radius - w;
    let topY = centerY + radius * Math.sin(-outerAngle);
    ctx.drawImage(destinationCanvas, leftX, topY);

    // Outline the draw area
    // ctx.strokeStyle = "white";
    // ctx.lineWidth = 2;
    // ctx.beginPath();
    // ctx.arc(
    //     centerX,
    //     centerY,
    //     radius,
    //     -outerAngle + Math.PI,
    //     outerAngle + Math.PI,
    // );
    // ctx.arc(
    //     centerX - w,
    //     centerY,
    //     radius,
    //     outerAngle + Math.PI,
    //     -outerAngle + Math.PI,
    //     true,
    // );
    // ctx.closePath();
    // ctx.stroke();
    
    // Clear the helper canvases so other draw methods can reuse it
    dtx.globalCompositeOperation = "source-over";
    dtx.clearRect(0, 0, 1000, 1000);
    stx.globalCompositeOperation = "source-over";
    stx.clearRect(0, 0, 1000, 1000);
}

function drawLeftCircularRoundedBar(
    w,
    h,
    centerX,
    centerY,
    fillRatio,
    radius,
    fill,
) {
    let innerAngle = Math.asin(h / 2 / radius);
    let outerAngle = Math.asin((h - w) / 2 / radius);
    
    let leftX = centerX - radius - w;
    let topY = centerY + radius * Math.sin(-innerAngle);
    let innerLineWidth = 0.4*w;

    // Background
    ctx.lineWidth = w;
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"
    ctx.beginPath();
    ctx.arc(
        centerX - w/2,
        centerY,
        radius,
        -outerAngle + Math.PI,
        outerAngle + Math.PI,
    );
    ctx.stroke();

    // Background mask
    stx.globalCompositeOperation = "source-over";
    stx.fillStyle = "gray";
    // let bWidth = 2 * w + 2;
    let bWidth = 1000;
    let bHeight = h + 4;
    stx.fillRect(0, 0, bWidth, bHeight);

    // Cut out the inner rounded bar
    stx.globalCompositeOperation = "destination-out";
    stx.strokeStyle = "grey";
    stx.lineWidth = innerLineWidth;
    stx.lineCap = "round";
    stx.beginPath();
    stx.arc(
        centerX - leftX - w/2,
        centerY - topY,
        radius,
        -outerAngle + Math.PI,
        outerAngle + Math.PI,
    );
    stx.stroke();

    // Actual displayed bar
    // Note: this part doesn't work for larger values of innerLineWidth
    let anotherAngle = Math.asin((h - w + 0.4*w) / 2 / radius);
    let bottomAngle = -anotherAngle + Math.PI;
    dtx.globalCompositeOperation = "source-over";
    dtx.lineWidth = innerLineWidth;
    dtx.strokeStyle = fill;
    dtx.beginPath();
    dtx.arc(
        centerX - leftX - w/2,
        centerY - topY,
        radius,
        bottomAngle,
        bottomAngle + fillRatio * 2 * anotherAngle,
    );
    dtx.stroke();

    // Remove everything but the cut out bar sections
    dtx.globalCompositeOperation = "destination-out";
    dtx.drawImage(
        sourceCanvas,
        0,
        0,
        bWidth,
        bHeight,
        0,
        0,
        bWidth,
        bHeight,
    );

    // Outline the draw area
    // ctx.strokeStyle = "white";
    // ctx.lineWidth = 2;
    // ctx.beginPath();
    // ctx.arc(
    //     centerX,
    //     centerY,
    //     radius,
    //     -innerAngle + Math.PI,
    //     innerAngle + Math.PI,
    // );
    // ctx.arc(
    //     centerX - w,
    //     centerY,
    //     radius,
    //     innerAngle + Math.PI,
    //     -innerAngle + Math.PI,
    //     true,
    // );
    // ctx.closePath();
    // ctx.stroke();

    ctx.drawImage(destinationCanvas, leftX, topY);

    // Clear the helper canvases so other draw methods can reuse it
    dtx.globalCompositeOperation = "source-over";
    dtx.clearRect(0, 0, 1000, 1000);
    stx.globalCompositeOperation = "source-over";
    stx.clearRect(0, 0, 1000, 1000);
}

function drawRightCircularBar(
    w,
    h,
    centerX,
    centerY,
    fillRatio,
    radius,
    fill,
) {
    let padding = 0.25 * w;
    let innerAngle = Math.asin(((h - 2*padding) / 2) / radius);
    let outerAngle = Math.asin((h / 2) / radius);

    // Background
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.arc(
        centerX,
        centerY,
        radius,
        -outerAngle,
        outerAngle,
    );
    ctx.arc(
        centerX + w,
        centerY,
        radius,
        outerAngle,
        -outerAngle,
        true,
    );
    ctx.closePath();
    ctx.fill();

    // Inner bar
    ctx.fillStyle = fill;
    let bottomAngle = innerAngle;
    ctx.beginPath();
    ctx.arc(
        centerX + padding,
        centerY,
        radius,
        bottomAngle,
        bottomAngle - fillRatio * 2 * innerAngle,
        true,
    );
    ctx.arc(
        centerX + w - padding,
        centerY,
        radius,
        bottomAngle - fillRatio * 2 * innerAngle,
        bottomAngle,
    );
    ctx.closePath();
    ctx.fill();

    // Outline draw area
    // ctx.strokeStyle = "white";
    // ctx.lineWidth = 2;
    // ctx.beginPath();
    // ctx.arc(
    //     currentSpeedCenter.x,
    //     currentSpeedCenter.y,
    //     radius,
    //     -outerAngle,
    //     outerAngle,
    // );
    // ctx.arc(
    //     currentSpeedCenter.x + w,
    //     currentSpeedCenter.y,
    //     radius,
    //     outerAngle,
    //     -outerAngle,
    //     true,
    // );
    // ctx.closePath();
    // ctx.stroke();
}

function drawRightCircularSegmentedBar(
    w,
    h,
    centerX,
    centerY,
    fillRatio,
    radius,
    fill,
) {
    let padding = 0.1 * w;
    let innerH = h - 2*padding;

    let b = 5; // bar height
    let g = 6; // gap height
    let n = Math.round(innerH / (b + g)) - 1; // number of bars
    let actualHeight = (n+1)*b + n*g;
    let barWidth = w - 2*padding;

    let innerAngle = Math.asin((actualHeight - 2*padding) / 2 / radius);
    let outerAngle = Math.asin(actualHeight / 2 / radius);

    // Background
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.arc(
        centerX,
        centerY,
        radius,
        -outerAngle,
        outerAngle,
    );
    ctx.arc(
        centerX + w,
        centerY,
        radius,
        outerAngle,
        -outerAngle,
        true,
    );
    ctx.closePath();
    ctx.fill();

    // Background mask
    stx.globalCompositeOperation = "source-over";
    stx.fillStyle = "gray";
    let bWidth = 2 * w + 2;
    let bHeight = actualHeight;
    stx.fillRect(0, 0, bWidth, bHeight);

    // Cut out bars
    stx.globalCompositeOperation = "destination-out";
    let topLeftXOffset = radius * Math.cos(-innerAngle);
    let rSquared = radius * radius;
    let dy = -actualHeight/2 + g/2 + b/2;
    for (let i = 0; i < n; i++) {
        let barCenterY = dy + b/2;
        let dx = Math.sqrt(rSquared - barCenterY * barCenterY);
        stx.beginPath();
        stx.roundRect(
            dx + (w - barWidth)/2 - topLeftXOffset,
            Math.floor(dy + actualHeight/2),
            barWidth,
            b,
            b / 2,
        );
        stx.fill();
        stx.closePath();
        dy += b + g;
    }

    // Actual displayed bar
    let relCenterX = -radius * Math.cos(-innerAngle);
    let relCenterY = actualHeight / 2;
    let bottomAngle = innerAngle;
    dtx.globalCompositeOperation = "source-over";
    dtx.fillStyle = fill;
    dtx.beginPath();
    dtx.arc(
        relCenterX,
        relCenterY,
        radius,
        bottomAngle,
        bottomAngle - fillRatio * 2 * innerAngle,
        true,
    );
    dtx.arc(
        relCenterX + w,
        relCenterY,
        radius,
        bottomAngle - fillRatio * 2 * innerAngle,
        bottomAngle,
    );
    dtx.closePath();
    dtx.fill();

    // Remove everything but the cut out bar sections
    dtx.globalCompositeOperation = "destination-out";
    dtx.drawImage(
        sourceCanvas,
        0,
        0,
        bWidth,
        bHeight,
        0,
        0,
        bWidth,
        bHeight,
    );

    let leftX = centerX + radius * Math.cos(-innerAngle);
    let topY = centerY + radius * Math.sin(-outerAngle);
    ctx.drawImage(destinationCanvas, leftX, topY);

    // Outline the draw area
    // ctx.lineWidth = 2;
    // ctx.strokeStyle = "white";
    // ctx.beginPath();
    // ctx.arc(
    //     centerX,
    //     centerY,
    //     radius,
    //     -outerAngle,
    //     outerAngle,
    // );
    // ctx.arc(
    //     centerX + w,
    //     centerY,
    //     radius,
    //     outerAngle,
    //     -outerAngle,
    //     true,
    // );
    // ctx.closePath();
    // ctx.stroke();
    
    // Clear the helper canvases so other draw methods can reuse it
    dtx.globalCompositeOperation = "source-over";
    dtx.clearRect(0, 0, 1000, 1000);
    stx.globalCompositeOperation = "source-over";
    stx.clearRect(0, 0, 1000, 1000);
};

function drawRightCircularRoundedBar(
    w,
    h,
    centerX,
    centerY,
    fillRatio,
    radius,
    fill,
) {
    let innerAngle = Math.asin(h / 2 / radius);
    let outerAngle = Math.asin((h - w) / 2 / radius);

    let leftX = centerX + radius * Math.cos(-innerAngle);
    let topY = centerY + radius * Math.sin(-innerAngle);
    let innerLineWidth = 0.4*w;

    // Background
    ctx.lineWidth = w;
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"
    ctx.beginPath();
    ctx.arc(
        centerX + w/2,
        centerY,
        radius,
        -outerAngle,
        outerAngle,
    );
    ctx.stroke();

    // Background mask
    stx.globalCompositeOperation = "source-over";
    stx.fillStyle = "gray";
    let bWidth = 2 * w + 2;
    let bHeight = h + 4;
    stx.fillRect(0, 0, bWidth, bHeight);

    // Cut out the inner rounded bar
    stx.globalCompositeOperation = "destination-out";
    stx.strokeStyle = "grey";
    stx.lineWidth = innerLineWidth;
    stx.lineCap = "round";
    stx.beginPath();
    stx.arc(
        centerX - leftX + w/2,
        centerY - topY,
        radius,
        -outerAngle,
        outerAngle,
    );
    stx.stroke();

    // Actual displayed bar
    // Note: this part doesn't work for larger values of innerLineWidth
    let anotherAngle = Math.asin((h - w + 0.4*w) / 2 / radius);
    dtx.globalCompositeOperation = "source-over";
    dtx.strokeStyle = fill;
    dtx.lineWidth = innerLineWidth;
    dtx.beginPath();
    dtx.arc(
        centerX - leftX + w/2,
        centerY - topY,
        radius,
        anotherAngle - fillRatio * 2 * anotherAngle,
        anotherAngle,
    );
    dtx.stroke();

    // Remove everything but the cut out bar sections
    dtx.globalCompositeOperation = "destination-out";
    dtx.drawImage(
        sourceCanvas,
        0,
        0,
        bWidth,
        bHeight,
        0,
        0,
        bWidth,
        bHeight,
    );

    // Outline the draw area
    // ctx.strokeStyle = "white";
    // ctx.lineWidth = 2;
    // ctx.beginPath();
    // ctx.arc(
    //     centerX,
    //     centerY,
    //     radius,
    //     -innerAngle,
    //     innerAngle,
    // );
    // ctx.arc(
    //     centerX + w,
    //     centerY,
    //     radius,
    //     innerAngle,
    //     -innerAngle,
    //     true,
    // );
    // ctx.closePath();
    // ctx.stroke();

    ctx.drawImage(destinationCanvas, leftX, topY);
    
    // Clear the helper canvases so other draw methods can reuse it
    dtx.globalCompositeOperation = "source-over";
    dtx.clearRect(0, 0, 1000, 1000);
    stx.globalCompositeOperation = "source-over";
    stx.clearRect(0, 0, 1000, 1000);
};

function drawTopRightLogoBar(
    w,
    h,
    centerX,
    centerY,
    fillRatio,
    radius,
    fill,
) {
    let innerLineWidth = 0.4*w;
    let leftX = centerX - innerLineWidth;
    let topY = centerY - radius - innerLineWidth;

    // Background
    ctx.lineWidth = w;
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"
    ctx.beginPath();
    ctx.arc(
        centerX,
        centerY,
        radius,
        -Math.PI/2,
        0,
    );
    ctx.stroke();

    // Background mask
    stx.globalCompositeOperation = "source-over";
    stx.fillStyle = "gray";
    let maskSize = radius + 2*innerLineWidth;
    stx.fillRect(0, 0, maskSize, maskSize);

    // Cut out the inner rounded bar
    stx.globalCompositeOperation = "destination-out";
    stx.strokeStyle = "grey";
    stx.lineWidth = innerLineWidth;
    stx.lineCap = "round";
    stx.beginPath();
    stx.arc(
        innerLineWidth,
        radius + innerLineWidth,
        radius,
        -Math.PI/2,
        0,
    );
    stx.stroke();

    // Actual displayed bar
    // Note: this part doesn't work for larger values of innerLineWidth
    dtx.globalCompositeOperation = "source-over";
    dtx.fillStyle = fill;
    dtx.lineWidth = innerLineWidth;
    dtx.beginPath();
    dtx.moveTo(innerLineWidth/2, radius + innerLineWidth + innerLineWidth/2);
    dtx.arc(
        innerLineWidth/2,
        radius + innerLineWidth + innerLineWidth/2,
        radius + innerLineWidth + innerLineWidth/2,
        -Math.PI/2 * fillRatio,
        0,
    );
    dtx.fill();

    // Remove everything but the cut out bar sections
    dtx.globalCompositeOperation = "destination-out";
    dtx.drawImage(
        sourceCanvas,
        0,
        0,
        maskSize,
        maskSize,
        0,
        0,
        maskSize,
        maskSize,
    );

    // Outline the draw area
    // ctx.strokeStyle = "white";
    // ctx.lineWidth = 2;
    // ctx.strokeRect(leftX, topY, radius + 2*innerLineWidth, radius + 2*innerLineWidth);

    ctx.drawImage(destinationCanvas, leftX, topY);
    
    // Clear the helper canvases so other draw methods can reuse it
    dtx.globalCompositeOperation = "source-over";
    dtx.clearRect(0, 0, 1000, 1000);
    stx.globalCompositeOperation = "source-over";
    stx.clearRect(0, 0, 1000, 1000);
};
