
/*
 * HUD displays score and menu options.
 */

// Variables inside Ui variable to avoid name collisions
var Ui = {
    buttons: [],
    // currentChoice:
    makeTowerFunction: function(gx, gy) { } // build tower function
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

function addMenuButton(hudTileX, hudTileY, imageCategory, imageName, callback) {
    var hudGraphicalX = (grid.width + hudTileX) * TILE_WIDTH;
    var hudGraphicalY = hudTileY * TILE_HEIGHT;
    var button = makeButton(hudGraphicalX, hudGraphicalY, imageCategory, imageName, callback);
    Ui.buttons.push(button);
}

// make(makeTowerFunction)Function - because local variable scoping is weird in Javascript
function makeTowerFunctionWrapper(towerFunction) {
    return function() {
        Ui.currentChoice = 'callFunction';
        Ui.makeTowerFunction = towerFunction;
    };
}

function addMenuButtons() {
    var curMenuX = 0;
    var curMenuY = 0;
    var HUD_WIDTH = 2;
    for (var iconName in Towers.towerListing) {
        var curTowerFunction = Towers.towerListing[iconName];
        addMenuButton(curMenuX, curMenuY, 'tower', iconName, makeTowerFunctionWrapper(curTowerFunction));
        curMenuX++;
        if (curMenuX >= HUD_WIDTH) {
            curMenuX = 0;
            curMenuY++;
        }
    }
    // TODO less hardcoding
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
    addMenuButton(0, 8, 'terrain', 'grass.png',function() {
        Ui.currentChoice = 'grass';
    });
    addMenuButton(1, 8, 'terrain', 'rock.png',function() {
        Ui.currentChoice = 'rock';
    });
    addMenuButton(0, 9, 'interface', 'arrow_right.png',function() {
        Ui.currentChoice = 'arrow';
    });
    addMenuButton(1, 9, 'interface', 'axehammer.png',function() {
        Ui.currentChoice = 'deleteArrow';
    });
    addMenuButton(0, 10, 'interface', 'start_platform.png',function() {
        Ui.currentChoice = 'spawn';
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
        if (Ui.currentChoice === 'callFunction') {
            if (grid.canBuildTowerAt(tileCoords)) {
                grid.addEntity(Ui.makeTowerFunction(gx, gy));
            }
        } else if (Ui.currentChoice === 'glarefish') {
            grid.addEntity(makeGlarefish(gx, gy));
        } else if (Ui.currentChoice === 'chomper') {
            grid.addEntity(makeChomper(gx, gy));    
        } else if (Ui.currentChoice === 'delete') {
            grid.removeEntityAt(tileCoords);
        } else if (Ui.currentChoice === 'clearAll') {
            grid = makeGrid(grid.width, grid.height);
            grid.generateRandomMap();
        } else if (Ui.currentChoice === 'grass') {
            var tile = grid.getTileAtCoords(tileCoords);
            tile.buildable = true;
            var terrain = tile.terrain;
            terrain.imageCategory = 'terrain';
            terrain.imageName = 'grass.png';
            terrain.image = Images.getImage(terrain.imageCategory, terrain.imageName);
        } else if (Ui.currentChoice === 'rock') {
            var tile = grid.getTileAtCoords(tileCoords);
            tile.buildable = false;
            var terrain = tile.terrain;
            terrain.imageCategory = 'terrain';
            terrain.imageName = 'rock.png';
            terrain.image = Images.getImage(terrain.imageCategory, terrain.imageName);
        } else if (Ui.currentChoice === 'arrow') {
            var tile = grid.getTileAtCoords(tileCoords);
            var directionNum = -1;
            if (tile.direction) {
                directionNum = Math.floor(Math.atan2(tile.direction.y, tile.direction.x) / Math.PI * 2 + .01);
            }
            directionNum++;
            var direction;
            switch (directionNum) {
                case 0:
                direction = {x: 1, y: 0};
                break;
                case 1:
                direction = {x: 0, y: 1};
                break;
                case 2:
                direction = {x: -1, y: 0};
                break;
                case 3:
                direction = {x: 0, y: -1};
                break;
            }
            tile.direction = direction;
            grid.calculatePathDistances();
        } else if (Ui.currentChoice === 'deleteArrow') {
            var tile = grid.getTileAtCoords(tileCoords);
            delete tile.direction;
        } else if (Ui.currentChoice === 'spawn') {
            grid.addSpawnPoint(tileCoords.tx, tileCoords.ty);
        } else if (Ui.currentChoice) {
            console.log('No handling for Ui choice: ' + Ui.currentChoice);
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

function clearHud(ctx) {
    var hudGraphicalX = grid.width * TILE_WIDTH;
    var hudGraphicalY = 0;
    var hudGraphicalWidth = canvas.width - hudGraphicalX;
    var hudGraphicalHeight = canvas.height - hudGraphicalY;
    ctx.fillStyle = HUD_BACKGROUND_COLOR;
    ctx.fillRect(hudGraphicalX, hudGraphicalY, hudGraphicalWidth, hudGraphicalHeight);
}

function drawHudBorder(ctx) {
    var hudGraphicalX = grid.width * TILE_WIDTH;
    var hudGraphicalY = 0;
    var hudGraphicalWidth = canvas.width - hudGraphicalX;
    var hudGraphicalHeight = canvas.height - hudGraphicalY;
    var oldLineWidth = ctx.lineWidth;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    ctx.rect(hudGraphicalX, hudGraphicalY, hudGraphicalWidth, hudGraphicalHeight);
    ctx.stroke();
    ctx.lineWidth = oldLineWidth;
}

function drawHud(ctx) {
    clearHud(ctx);
    Ui.buttons.forEach(function(button) {
        button.draw(ctx);
    });
    drawHudBorder(ctx);
}

// Call this once when game starts to initialize hud
function initHud() {
    addMenuButtons();
    addEventListeners(canvas);
}
