
/*
 * HUD displays health.
 */

// TODO HUD

function clearHud(ctx) {
    var sidebarGraphicalWidth = grid.width * TILE_WIDTH;
    var sidebarGraphicalHeight = HUD_HEIGHT; // one tile tall
    ctx.fillStyle = UI_BACKGROUND_COLOR;
    ctx.fillRect(0, 0, sidebarGraphicalWidth, sidebarGraphicalHeight);
}

function drawHud(ctx) {
    clearHud(ctx);
}
