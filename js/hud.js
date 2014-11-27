
/*
 * HUD displays health and money.
 */

function clearHud(ctx) {
    var sidebarGraphicalWidth = grid.width * TILE_WIDTH;
    var sidebarGraphicalHeight = HUD_HEIGHT; // one tile tall
    ctx.fillStyle = UI_BACKGROUND_COLOR;
    ctx.fillRect(0, 0, sidebarGraphicalWidth, sidebarGraphicalHeight);
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
    var minutesOnly = padZeros(Math.floor(health / 60), 2);
    var secondsOnly = padZeros(Math.floor(health % 60), 2);
    return lifetimeSymbol + ' ' + minutesOnly + ':' + secondsOnly;
}

function drawHealth(ctx) {
    var endY = TILE_HEIGHT - 10;
    ctx.font = "50px Arial";
    ctx.fillStyle = HEALTH_DISPLAY_COLOR;
    ctx.fillText(getHealthText(), 0, endY);
}

function drawMoney(ctx) {
    var startX = TILE_WIDTH * 10;
    var endY = TILE_HEIGHT - 10;
    ctx.font = "50px Arial";
    ctx.fillStyle = MONEY_DISPLAY_COLOR;
    ctx.fillText("$" + Math.floor(Game.money), startX, endY);
}

function drawHud(ctx) {
    clearHud(ctx);
    drawHealth(ctx);
    drawMoney(ctx);
}
