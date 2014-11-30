
// Depends on: uielement.js, game.js, grid.js, tower.js, enemy.js

/*
 * Side bar provides build menu. Switches to developer tools if SHIFT key is pressed.
 */

// Variables inside Ui variable to avoid name collisions
var Ui = {
    buttons: [],
    // currentChoice:
    makeEntityFunction: function(gx, gy) { }, // build tower/add enemy function
    // Button adding
    nextFreeX: 0,
    nextFreeY: 0,
    addButton: function(imageCategory, imageName, onClickFunction) {
        var sidebarTileWidth = SIDEBAR_WIDTH / TILE_WIDTH;
        var sidebarGraphicalX = (grid.width + this.nextFreeX) * TILE_WIDTH;
        var sidebarGraphicalY = this.nextFreeY * TILE_HEIGHT;
        var button = makeButton(sidebarGraphicalX, sidebarGraphicalY, imageCategory, imageName, onClickFunction);
        this.nextFreeX++;
        if (this.nextFreeX >= sidebarTileWidth) {
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
// Some values shared between both Ui
var SharedUi = {
    // When arrow/spawn is selected, override show arrow/spawn setting & save in here
    savedSettings: {},
    showToolOverlay: function() {
        var arrowSelected = Ui.currentChoice === 'arrow' || Ui.currentChoice === 'deleteArrow';
        if (arrowSelected) { // save setting & override to true
            if (!('arrow' in this.savedSettings)) {
                this.savedSettings['arrow'] = SHOW_ENEMY_DIRECTION;
                SHOW_ENEMY_DIRECTION = true;
            }
        } else { // load setting, removing override
            if ('arrow' in this.savedSettings) {
                SHOW_ENEMY_DIRECTION = this.savedSettings['arrow'];
                delete this.savedSettings['arrow'];
            }
        }
        // also save/load setting on spawn tool selection
        var spawnSelected = Ui.currentChoice === 'spawn' || Ui.currentChoice === 'deleteSpawn';
        if (spawnSelected) {
            if (!('spawn' in this.savedSettings)) {
                this.savedSettings['spawn'] = SHOW_ENEMY_SPAWN;
                SHOW_ENEMY_SPAWN = true;
            }
        } else {
            if ('spawn' in this.savedSettings) {
                SHOW_ENEMY_SPAWN = this.savedSettings['spawn'];
                delete this.savedSettings['spawn'];
            }
        }
    },
    onSidebarClick: function() {
        this.showToolOverlay();
        // deselect current tower if tool selected
        if (Ui.currentChoice && this.selectedTower) {
            delete this.selectedTower;
        }
    },
    onSwapUi: function() {
        // turn off/on tool overlay based on current selection
        this.onSidebarClick();
    },
    // draw text overlay
    textComponents: [],
    //towerInfoComponent: // name, stats, description
    init: function() {
        var fontSize = 20; //  TODO make constants
        var fontName = 'Arial';
        // tower info
        var startX = grid.width * TILE_WIDTH + 5;
        var endY = (grid.height / 2) * TILE_HEIGHT;
        this.towerInfoComponent = makeTextComponent(startX, endY, '', fontSize, fontName, UI_TOWER_INFO_TEXT_COLOR);
        // add to list
        this.textComponents.push(this.towerInfoComponent);
    },
    draw: function(ctx) {
        if (!this.towerInfoComponent) {
            this.init();
        }
        if (this.selectedTower) {
            var towerInfoText = this.selectedTower.name + '\n'
                + this.selectedTower.damage + ' dmg\n'
                + 'per ' + this.selectedTower.coolDown + ' s';
            this.towerInfoComponent.text = towerInfoText;
        } else {
            this.towerInfoComponent.text = '';
        }
        this.textComponents.forEach(function (component) {
            component.draw(ctx);
        });
    },
    // highlight current moused-over tile
    curMouseX: -1,
    curMouseY: -1,
    // select a tile without a selected tool to show tower info, deselected if tool selected
    //selectedTower: 
};

function addMenuButton(sidebarTileX, sidebarTileY, imageCategory, imageName, callback) {
    var sidebarGraphicalX = (grid.width + sidebarTileX) * TILE_WIDTH;
    var sidebarGraphicalY = sidebarTileY * TILE_HEIGHT;
    var button = makeButton(sidebarGraphicalX, sidebarGraphicalY, imageCategory, imageName, callback);
    Ui.buttons.push(button);
}

// make(makeEntityFunction)Function - because local variable scoping is weird in Javascript
function makeEntityFunctionWrapper(entityFunction) {
    return function() {
        Ui.currentChoice = 'callFunction';
        Ui.makeEntityFunction = entityFunction;
    };
}

function createAdminMenu() {
    // enemy buttons
    for (var iconName in Enemies.enemyListing) {
        var curEntityFunction = makeEntityFunctionWrapper(Enemies.enemyListing[iconName]);
        AlternateUi.addButton('enemy', iconName, curEntityFunction);
    }
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
    AlternateUi.addButton('interface', 'axehammer.png',function() {
        Ui.currentChoice = 'deleteSpawn';
    });
    AlternateUi.addButtonDivider();
}

function addMenuButtons() {
    // tower buttons
    for (var iconName in Towers.towerListing) {
        var curEntityFunction = makeEntityFunctionWrapper(Towers.towerListing[iconName]);
        Ui.addButton('tower', iconName, curEntityFunction);
    }
    Ui.addButtonDivider();
    // also create admin buttons accessible by switching UIs
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
    // console.log('Clicked at (' +gx + ',' + gy + ')');
    if (Ui.currentChoice) {
        if (Ui.currentChoice === 'callFunction') {
            var entity = Ui.makeEntityFunction(gx, gy);
            if (entity.building && grid.canBuildTowerAt(tileCoords)) { // build tower
                if (Game.money >= TOWER_COST) {
                    Game.money -= TOWER_COST;
                    grid.addEntity(entity);
                }
            } else if (!entity.building) { // add enemy
                grid.addEntity(entity);
            }
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
        } else if (Ui.currentChoice === 'deleteSpawn') {
            grid.removeSpawnPoint(tileCoords.tx, tileCoords.ty);
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
    } else { // select tower in tile
        var curTower = grid.getFirstTowerAtTile(tileCoords);
        SharedUi.selectedTower = curTower;
    }
}

// handle mouse over & clicks, preventing multi-select & multi-click
function addEventListeners(canvas) {
    canvas.addEventListener('click', function(event) {
        var mouseX = event.pageX - canvas.offsetLeft;
        var mouseY = event.pageY - canvas.offsetTop;
        if (mouseX > grid.width * TILE_WIDTH) {
            delete Ui.currentChoice;
            Ui.buttons.forEach(function(button) {
                // after one button is clicked, don't click other buttons
                if (button.tryClick(mouseX, mouseY)) {
                    mouseX = -1;
                    mouseY = -1;
                }
            });
            SharedUi.onSidebarClick();
        } else if (mouseY > HUD_HEIGHT) {
            clickOnGrid(mouseX, mouseY);
        }
    });
    canvas.addEventListener('mousemove', function(event) {
        var mouseX = event.pageX - canvas.offsetLeft;
        var mouseY = event.pageY - canvas.offsetTop;
        Ui.buttons.forEach(function(button) {
            // after one button is moused over, don't mouse over other buttons
            if (button.tryHover(mouseX, mouseY)) {
                mouseX = -1;
                mouseY = -1;
            }
        });
        SharedUi.curMouseX = mouseX;
        SharedUi.curMouseY = mouseY;
    });
}

function clearSidebar(ctx) {
    var sidebarGraphicalX = grid.width * TILE_WIDTH;
    var sidebarGraphicalY = 0;
    var sidebarGraphicalWidth = Game.canvas.width - sidebarGraphicalX;
    var sidebarGraphicalHeight = Game.canvas.height - sidebarGraphicalY;
    ctx.fillStyle = UI_BACKGROUND_COLOR;
    ctx.fillRect(sidebarGraphicalX, sidebarGraphicalY, sidebarGraphicalWidth, sidebarGraphicalHeight);
}

function drawSelectedTowerInfo(ctx) {
    // TODO show tower info
    if (SharedUi.selectedTower) {
        var fontSize = 20;
        var font = fontSize + "px Arial";
        // draw name
        // var startX = grid.width * TILE_WIDTH + 5;
        // var endY = (grid.height / 2) * TILE_HEIGHT;
        // ctx.font = font;
        // ctx.fillStyle = UI_TOWER_INFO_TEXT_COLOR;
        // ctx.fillText(SharedUi.selectedTower.name, startX, endY);
        // draw damage stat
        // startX = grid.width * TILE_WIDTH + 5;
        // endY = (grid.height / 2) * TILE_HEIGHT + fontSize*1;
        // ctx.font = font;
        // ctx.fillStyle = UI_TOWER_INFO_TEXT_COLOR;
        // ctx.fillText(SharedUi.selectedTower.damage + ' dmg', startX, endY);
        // draw cooldown stat
        // startX = grid.width * TILE_WIDTH + 5;
        // endY = (grid.height / 2) * TILE_HEIGHT + fontSize*2;
        // ctx.font = font;
        // ctx.fillStyle = UI_TOWER_INFO_TEXT_COLOR;
        // ctx.fillText('per ' + SharedUi.selectedTower.coolDown + ' s', startX, endY);
        // draw range stat
        // startX = grid.width * TILE_WIDTH + 5;
        // endY = (grid.height / 2) * TILE_HEIGHT + fontSize*3;
        // ctx.font = font;
        // ctx.fillStyle = UI_TOWER_INFO_TEXT_COLOR;
        // ctx.fillText('range: ' + SharedUi.selectedTower.range, startX, endY);
   }
}

// draw a colored rectangle around a tile
function highlightTile(ctx, tileCoords, strokeStyle) {
    var tileGraphicalCoords = grid.tileToGraphicalCoords(tileCoords.tx, tileCoords.ty);
    ctx.beginPath();
    ctx.strokeStyle = strokeStyle;
    ctx.rect(tileGraphicalCoords.gx, tileGraphicalCoords.gy + grid.drawOffsetY, TILE_WIDTH, TILE_HEIGHT);
    ctx.stroke();
}

function highlightSelectedTowerTile(ctx) {
    if (SharedUi.selectedTower) {
        var towerTileCoords = SharedUi.selectedTower.getCurrentTileCoords();
        highlightTile(ctx, towerTileCoords, UI_SELECTED_TOWER_COLOR);
    }
}

function highlightHoveredTile(ctx) {
    if (SharedUi.curMouseX > 0 && SharedUi.curMouseX < grid.width * TILE_WIDTH && SharedUi.curMouseY > HUD_HEIGHT) {
        // Don't forget yOffset when converting mouse graphical coords to grid graphical coords
        var tileCoords = grid.graphicalToTileCoords(SharedUi.curMouseX, SharedUi.curMouseY - grid.drawOffsetY);
        var actualTile = grid.getTileAtCoords(tileCoords);
        var tileGraphicalCoords = grid.tileToGraphicalCoords(tileCoords.tx, tileCoords.ty);
        var strokeStyle;
        if (actualTile && actualTile.buildable) {
            strokeStyle = UI_SELECTED_BUILDABLE_TILE_COLOR;
        } else {
            strokeStyle = UI_SELECTED_UNBUILDABLE_TILE_COLOR;
        }
        highlightTile(ctx, tileCoords, strokeStyle);
    }
}

function drawSidebarBorder(ctx) {
    var sidebarGraphicalX = grid.width * TILE_WIDTH;
    var sidebarGraphicalY = 0;
    var sidebarGraphicalWidth = Game.canvas.width - sidebarGraphicalX;
    var sidebarGraphicalHeight = Game.canvas.height - sidebarGraphicalY;
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
    highlightSelectedTowerTile(ctx);
    drawSelectedTowerInfo(ctx);
    highlightHoveredTile(ctx);
    drawSidebarBorder(ctx);
    SharedUi.draw(ctx);
}

function swapUi() {
    // swap current and alternate ui
    var savedUi = AlternateUi;
    AlternateUi = Ui;
    Ui = savedUi;
    // also deselect any tool
    SharedUi.onSwapUi();
    // TODO add mouseover?
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
    addEventListeners(Game.canvas);
    addSidebarHotkeys();
    SharedUi.init();
}