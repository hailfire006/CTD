
/*
 * HUD displays score and menu options.
 */

// Variables inside Ui variable to avoid name collisions
var Ui = {
    buttons: []
    // currentChoice:
};

function makeButton(x, y, imageCategory, imageName, onClickFunction) {
    var button = {
        x: x,
        y: y,
        width: 50,
        height: 50,
        image: Images.getImage(imageCategory, imageName),
        hovered: false, // whether mouse is hovering over this
        selected: false, // whether mouse clicked this
        tryMouseOver: function(mouseX, mouseY) {
            this.hovered = this.isInButton(mouseX, mouseY);
        },
        tryClick: function(mouseX, mouseY) {
            this.selected = this.isInButton(mouseX, mouseY);
            if (this.selected) {
                onClickFunction();
            }
        },
        isInButton: function(mouseX, mouseY) {
            return mouseX >= this.x && mouseX <= this.x + this.width
                && mouseY >= this.y && mouseY <= this.y + this.height;
        },
        draw: function(ctx) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            if (this.selected) {
                var oldLineWidth = ctx.lineWidth;
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "orange";
                var off = ctx.lineWidth / 2;
                ctx.rect(this.x + off, this.y + off, this.width - off*2, this.height - off*2);
                ctx.stroke();
                ctx.lineWidth = oldLineWidth;
            } else if (this.hovered) {
                ctx.beginPath();
                ctx.strokeStyle = "yellow";
                ctx.rect(this.x, this.y, this.width, this.height);
                ctx.stroke();
            }
        }
    };
    return button;
}

function clearHud(ctx) {
    var hudGraphicalX = grid.width * TILE_WIDTH;
    var hudGraphicalY = 0;
    ctx.fillStyle = HUD_BACKGROUND_COLOR;
    ctx.fillRect(hudGraphicalX, hudGraphicalY, canvas.width, canvas.height);
}

function drawHud(ctx) {
    clearHud(ctx);
    Ui.buttons.forEach(function(button) {
        button.draw(ctx);
    });
}

function addMenuButton(hudTileX, hudTileY, imageCategory, imageName, callback) {
    var hudGraphicalX = (grid.width + hudTileX) * TILE_WIDTH;
    var hudGraphicalY = hudTileY * TILE_HEIGHT;
    var button = makeButton(hudGraphicalX, hudGraphicalY, imageCategory, imageName, callback);
    Ui.buttons.push(button);
}

function addMenuButtons() {
    var hudX = grid.width * TILE_WIDTH;
    // TODO less hardcoding
    addMenuButton(0, 0, 'tower', 'fireball.png',function() {
        Ui.currentChoice = 'fireball';
    });
    addMenuButton(1, 0, 'tower', 'bluefire.png',function() {
        Ui.currentChoice = 'bluefire';
    });

    addMenuButton(0, 1, 'tower', 'lightningbolt.png', function() {
        Ui.currentChoice = 'lightningbolt'; 
    });
    addMenuButton(1, 1, 'tower', 'magicTower.png', function() {
        Ui.currentChoice = 'magic'; 
    });
    addMenuButton(0, 2, 'tower', 'kingTower.png', function() {
        Ui.currentChoice = 'king'; 
    });
    addMenuButton(1, 2, 'tower', 'spikyGemTower.png', function() {
        Ui.currentChoice = 'spiky'; 
    });
    addMenuButton(0, 3, 'tower', 'spookyTower.png', function() {
        Ui.currentChoice = 'spooky'; 
    });
    addMenuButton(0, 4, 'enemy', 'glarefish.png',function() {
        Ui.currentChoice = 'glarefish';
    });
    addMenuButton(1, 4, 'enemy', 'chomper.png',function() {
        Ui.currentChoice = 'chomper';
    });
    addMenuButton(0, 5, 'interface', 'axehammer.png',function() {
        Ui.currentChoice = 'delete';
    });
    addMenuButton(0, 6, 'interface', 'broom.png',function() {
        Ui.currentChoice = 'clearAll';
    });
}

function clickOnGrid(mouseX, mouseY) {
    // place tower at top-left corner
    var gx = mouseX;
    var gy = mouseY;
    var tileCoords = grid.graphicalToTileCoords(gx, gy);
    var graphicalCoords = grid.tileToGraphicalCoords(tileCoords.tx, tileCoords.ty);
    gx = graphicalCoords.gx;
    gy = graphicalCoords.gy;
    if (Ui.currentChoice) {
        if (Ui.currentChoice === 'fireball') {
            if (grid.canBuildTowerAt(tileCoords)) {
                grid.addEntity(makeFireTower(gx, gy));
            }
        } else if (Ui.currentChoice === 'bluefire') {
            if (grid.canBuildTowerAt(tileCoords)) {
                grid.addEntity(makeWaterTower(gx, gy));
            }
        } else if (Ui.currentChoice === 'lightningbolt') {
            if (grid.canBuildTowerAt(tileCoords)) {
                grid.addEntity(makeLightningTower(gx, gy));     
            }   
        } else if (Ui.currentChoice === 'spiky') {
            if (grid.canBuildTowerAt(tileCoords)) {
                grid.addEntity(makeSpikyGemTower(gx, gy));     
            }   
        } else if (Ui.currentChoice === 'spooky') {
            if (grid.canBuildTowerAt(tileCoords)) {
                grid.addEntity(makeSpookyTower(gx, gy));     
            }   
        } else if (Ui.currentChoice === 'king') {
            if (grid.canBuildTowerAt(tileCoords)) {
                grid.addEntity(makeKingTower(gx, gy));     
            }   
        } else if (Ui.currentChoice === 'magic') {
            if (grid.canBuildTowerAt(tileCoords)) {
                grid.addEntity(makeMagicTower(gx, gy));     
            }   
        } else if (Ui.currentChoice === 'glarefish') {
            grid.addEntity(makeGlarefish(gx, gy));
        } else if (Ui.currentChoice === 'chomper') {
            grid.addEntity(makeChomper(gx, gy));    
        } else if (Ui.currentChoice === 'delete') {
            grid.removeEntityAt(tileCoords);
        } else if (Ui.currentChoice === 'clearAll') {
            grid = makeGrid(grid.width, grid.height);
        }
    }
}

// TODO prevent multiselect/multiclick
function addEventListeners(canvas) {
    canvas.addEventListener('click', function(event) {
        var mouseX = event.pageX - canvas.offsetLeft;
        var mouseY = event.pageY - canvas.offsetTop;
        if (mouseX > grid.width * TILE_WIDTH) {
            delete Ui.currentChoice;
            Ui.buttons.forEach(function(button) {
                button.tryClick(mouseX, mouseY);
            });
        } else {
            clickOnGrid(mouseX, mouseY);
        }
    });
    canvas.addEventListener('mousemove', function(event) {
        var mouseX = event.pageX - canvas.offsetLeft;
        var mouseY = event.pageY - canvas.offsetTop;
        Ui.buttons.forEach(function(button) {
            button.tryMouseOver(mouseX, mouseY);
        });
        // TODO highlight current tile in grid if tower selected
    });
}

// Call this once when game starts to initialize hud
function initHud() {
    addMenuButtons();
    addEventListeners(canvas);
}
