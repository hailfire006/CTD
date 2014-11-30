
// Depends on: game.js

/*
 * HUD displays health and money.
 */

function clearHud(ctx) {
    var hudGraphicalWidth = grid.width * TILE_WIDTH;
    var hudGraphicalHeight = HUD_HEIGHT;
    ctx.fillStyle = UI_BACKGROUND_COLOR;
    ctx.fillRect(0, 0, hudGraphicalWidth, hudGraphicalHeight);
}

// Ex: padZeros(13, 5) returns '00013'
function padZeros(number, maxPadding) {
    var allZerosString = Array(maxPadding).join('0');
    var numberString = number + '';
    var paddingAmount = maxPadding - numberString.length;
    if (paddingAmount > 0) {
        var paddingString = allZerosString.substr(0, paddingAmount);
        return paddingString + numberString;
    }
    return numberString;
}

// Display Lifetime as "minutes:seconds", ex: 75.315 seconds becomes "01:15"
function getHealthText() {
    var lifetimeSymbol = '♥⌛'; // heart + hourglass unicode symbols
    var health = Game.lifeTimeSeconds;
    if (health <= 0) {
        health = Game.totalSeconds; // show time survived instead
        lifetimeSymbol = '☠⌛'; // skull + hourglass unicode symbols
    }
    var minutesOnly = health / 60;
    var secondsOnly = health % 60;
    minutesOnly = padZeros(Math.abs(Math.floor(minutesOnly)), 2);
    secondsOnly = padZeros(Math.abs(Math.floor(secondsOnly)), 2);
    return lifetimeSymbol + ' ' + minutesOnly + ':' + secondsOnly;
}

function drawHealth(ctx) {
    var endY = TILE_HEIGHT - 8;
    ctx.font = "50px Arial";
    if (Game.lifeTimeSeconds > HEALTH_LOW_THRESHOLD) {
        ctx.fillStyle = HEALTH_DISPLAY_COLOR;
    } else {
        ctx.fillStyle = HEALTH_LOW_DISPLAY_COLOR;
    }
    ctx.fillText(getHealthText(), 0, endY);
    // No health
    if (Game.lifeTimeSeconds <= 0) {
        var startX = TILE_WIDTH * 5;
        endY = TILE_HEIGHT - 15;
        ctx.font = "30px Arial";
        ctx.fillStyle = "black";
        ctx.fillText('OUT OF TIME', startX, endY);
    }
}

function drawMoney(ctx) {
    var startX = TILE_WIDTH * 10;
    var endY = TILE_HEIGHT - 8;
    ctx.font = "50px Arial";
    ctx.fillStyle = MONEY_DISPLAY_COLOR;
    ctx.fillText("$" + Math.floor(Game.money), startX, endY);
}

function drawHudBorder(ctx) {
    var hudGraphicalWidth = grid.width * TILE_WIDTH;
    var hudGraphicalHeight = HUD_HEIGHT;
    var oldLineWidth = ctx.lineWidth;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.rect(0, 0, hudGraphicalWidth, hudGraphicalHeight);
    ctx.stroke();
    ctx.lineWidth = oldLineWidth;
}

function drawHud(ctx) {
    clearHud(ctx);
    drawHealth(ctx);
    drawMoney(ctx);
    drawHudBorder(ctx);
}
