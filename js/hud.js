
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
    var sign = health >= 0 ? ' ' : '-';
    var minutesOnly = health / 60;
    if (health < 0) {
        minutesOnly++; // Math.floor causes -1 if negative
    }
    minutesOnly = padZeros(Math.abs(Math.floor(minutesOnly)), 2);
    var secondsOnly = health % 60;
    secondsOnly = padZeros(Math.abs(Math.floor(secondsOnly)), 2);
    return lifetimeSymbol + sign + minutesOnly + ':' + secondsOnly;
}

function drawHealth(ctx) {
    var endY = TILE_HEIGHT - 10;
    ctx.font = "50px Arial";
    if (Game.lifeTimeSeconds > HEALTH_LOW_THRESHOLD) {
        ctx.fillStyle = HEALTH_DISPLAY_COLOR;
    } else {
        ctx.fillStyle = HEALTH_LOW_DISPLAY_COLOR;
    }
    ctx.fillText(getHealthText(), 0, endY);
    // Negative health
    if (Game.lifeTimeSeconds < 0) {
        var startX = TILE_WIDTH * 4;
        endY = TILE_HEIGHT - 15;
        ctx.font = "30px Arial";
        ctx.fillStyle = "black";
        ctx.fillText('BORROWED TIME', startX, endY);
    }
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
