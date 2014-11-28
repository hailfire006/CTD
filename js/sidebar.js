
/*
 * Side bar provides build menu. Switches to developer tools if SHIFT key is pressed.
 */

// Variables inside Ui variable to avoid name collisions
var Ui = {
    buttons: [],
    // currentChoice:
    makeTowerFunction: function(gx, gy) { }, // build tower function
    // highlight current moused-over tile
    curMouseX: -1,
    curMouseY: -1,
    // Button adding
    nextFreeX: 0,
    nextFreeY: 0,
    addButton: function(imageCategory, imageName, onClickFunction) {
        var sidebarWidth = 2; // TODO make constant
        var sidebarGraphicalX = (grid.width + this.nextFreeX) * TILE_WIDTH;
        var sidebarGraphicalY = this.nextFreeY * TILE_HEIGHT;
        var button = makeButton(sidebarGraphicalX, sidebarGraphicalY, imageCategory, imageName, onClickFunction);
        this.nextFreeX++;
        if (this.nextFreeX >= sidebarWidth) {
            this.nextFreeX = 0;
            this.nextFreeY++;
        }
        this.buttons.push(button);
    },
    addButtonDivider: function() {
        if (this.nextFreeX > 0) {
            this.nextFreeX = 0;
            this.nextFreeY++;
        }
    }
};
var AlternateUi = Utility.clone(Ui); // can swap back and forth w/ Ui, contains admin tools

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

function addMenuButton(sidebarTileX, sidebarTileY, imageCategory, imageName, callback) {
    var sidebarGraphicalX = (grid.width + sidebarTileX) * TILE_WIDTH;
    var sidebarGraphicalY = sidebarTileY * TILE_HEIGHT;
    var button = makeButton(sidebarGraphicalX, sidebarGraphicalY, imageCategory, imageName, callback);
    Ui.buttons.push(button);
}

// make(makeTowerFunction)Function - because local variable scoping is weird in Javascript
function makeTowerFunctionWrapper(towerFunction) {
    return function() {
        Ui.currentChoice = 'callFunction';
        Ui.makeTowerFunction = towerFunction;
    };
}

function createAdminMenu() {
    // enemy buttons
    AlternateUi.addButton('enemy', 'glarefish.png',function() {
        Ui.currentChoice = 'glarefish';
    });
    AlternateUi.addButton('enemy', 'chomper.png',function() {
        Ui.currentChoice = 'chomper';
    });
    AlternateUi.addButtonDivider();
    // delete/clear buttons
    AlternateUi.addButton('interface', 'axehammer.png',function() {
        Ui.currentChoice = 'delete';
    });
    AlternateUi.addButton('interface', 'broom.png',function() {
        Ui.currentChoice = 'clearAll';
    });
    AlternateUi.addButtonDivider();
    // terrain buttons
    AlternateUi.addButton('terrain', 'grass.png',function() {
        Ui.currentChoice = 'grass';
    });
    AlternateUi.addButton('terrain', 'rock.png',function() {
        Ui.currentChoice = 'rock';
    });
    AlternateUi.addButton('terrain', 'road_horizontal.png',function() {
        Ui.currentChoice = 'road';
    });
    AlternateUi.addButton('terrain', 'road_upright.png',function() {
        Ui.currentChoice = 'roadAngle';
    });
    AlternateUi.addButtonDivider();
    // misc. buttons
    AlternateUi.addButton('interface', 'arrow_right.png',function() {
        Ui.currentChoice = 'arrow';
    });
    AlternateUi.addButton('interface', 'axehammer.png',function() {
        Ui.currentChoice = 'deleteArrow';
    });
    AlternateUi.addButton('interface', 'start_platform.png',function() {
        Ui.currentChoice = 'spawn';
    });
    AlternateUi.addButtonDivider();
}

function addMenuButtons() {
    // add tower buttons
    for (var iconName in Towers.towerListing) {
        var curTowerFunction = makeTowerFunctionWrapper(Towers.towerListing[iconName]);
        Ui.addButton('tower', iconName, curTowerFunction);
    }
    Ui.addButtonDivider();
    createAdminMenu();
}

function clickOnGrid(mouseX, mouseY) {
    // place tower at top-left corner
    var gx = mouseX;
    var gy = mouseY;
    var tileCoords = grid.graphicalToTileCoords(gx, gy - grid.drawOffsetY);
    var graphicalCoords = grid.tileToGraphicalCoords(tileCoords.tx, tileCoords.ty);
    gx = graphicalCoords.gx;
    gy = graphicalCoords.gy;
    // console.log('Clicked at ('gx + ',' + gy + ')');
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
            resetGame();
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
        } else if (Ui.currentChoice === 'road'){
            var tile = grid.getTileAtCoords(tileCoords);
            var terrain = tile.terrain;
            tile.buildable = false;
            if (!tile.imageName)
                tile.imageName = "road_vertical.png";
            
            terrain.imageCategory = 'terrain';
            
            if (tile.imageName == "road_horizontal.png"){
                tile.imageName = "road_vertical.png";
            } else {
                tile.imageName = "road_horizontal.png";
            }
             
            terrain.imageName = tile.imageName;
            terrain.image = Images.getImage(terrain.imageCategory, terrain.imageName);
        } else if (Ui.currentChoice === 'roadAngle'){
            var tile = grid.getTileAtCoords(tileCoords);
            var terrain = tile.terrain;
            tile.buildable = false;
            if(!tile.imageName)
                tile.imageName = "road_upright.png";
            
            terrain.imageCategory = 'terrain';
            
            if (tile.imageName == "road_upright.png"){
                tile.imageName = "road_rightdown.png";
            } else if (tile.imageName == "road_rightdown.png") {
                tile.imageName = "road_rightup.png";
            } else if (tile.imageName == "road_rightup.png") {
                tile.imageName = "road_downright.png";
            } else {
                tile.imageName = "road_upright.png";
            }
             
            terrain.imageName = tile.imageName;
            terrain.image = Images.getImage(terrain.imageCategory, terrain.imageName);
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
        Ui.curMouseX = mouseX;
        Ui.curMouseY = mouseY;
    });
}

function clearSidebar(ctx) {
    var sidebarGraphicalX = grid.width * TILE_WIDTH;
    var sidebarGraphicalY = 0;
    var sidebarGraphicalWidth = canvas.width - sidebarGraphicalX;
    var sidebarGraphicalHeight = canvas.height - sidebarGraphicalY;
    ctx.fillStyle = UI_BACKGROUND_COLOR;
    ctx.fillRect(sidebarGraphicalX, sidebarGraphicalY, sidebarGraphicalWidth, sidebarGraphicalHeight);
}

function highlightSelectedTile(ctx) {
    if (Ui.curMouseX > 0 && Ui.curMouseX < grid.width * TILE_WIDTH && Ui.curMouseY > HUD_HEIGHT) {
        // Don't forget yOffset when converting mouse graphical coords to grid graphical coords
        var tileCoords = grid.graphicalToTileCoords(Ui.curMouseX, Ui.curMouseY - grid.drawOffsetY);
        var actualTile = grid.getTileAtCoords(tileCoords);
        var tileGraphicalCoords = grid.tileToGraphicalCoords(tileCoords.tx, tileCoords.ty);
        ctx.beginPath();
        if (actualTile.buildable) {
            ctx.strokeStyle = UI_SELECTED_BUILDABLE_TILE_COLOR;
        } else {
            ctx.strokeStyle = UI_SELECTED_UNBUILDABLE_TILE_COLOR;
        }
        ctx.rect(tileGraphicalCoords.gx, tileGraphicalCoords.gy + grid.drawOffsetY, TILE_WIDTH, TILE_HEIGHT);
        ctx.stroke();
    }
}

function drawSidebarBorder(ctx) {
    var sidebarGraphicalX = grid.width * TILE_WIDTH;
    var sidebarGraphicalY = 0;
    var sidebarGraphicalWidth = canvas.width - sidebarGraphicalX;
    var sidebarGraphicalHeight = canvas.height - sidebarGraphicalY;
    var oldLineWidth = ctx.lineWidth;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.rect(sidebarGraphicalX, sidebarGraphicalY, sidebarGraphicalWidth, sidebarGraphicalHeight);
    ctx.stroke();
    ctx.lineWidth = oldLineWidth;
}

function drawSidebar(ctx) {
    clearSidebar(ctx);
    Ui.buttons.forEach(function(button) {
        button.draw(ctx);
    });
    highlightSelectedTile(ctx);
    drawSidebarBorder(ctx);
}

function swapUi() {
    var savedUi = AlternateUi;
    AlternateUi = Ui;
    Ui = savedUi;
}

function sidebarKeyUp(keyCode) {
    switch(keyCode) {
        case 16: // shift
        swapUi();
        break;
    }
}

function addSidebarHotkeys() {
    window.addEventListener('keyup', function(e) {
        sidebarKeyUp(e.keyCode);
    });
}

// Call this once when game starts to initialize sidebar
function initSidebar() {
    addMenuButtons();
    addEventListeners(canvas);
    addSidebarHotkeys();
}
