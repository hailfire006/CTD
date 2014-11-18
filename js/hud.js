
/*
 * HUD displays score and menu options.
 */

// Variables inside Ui variable to avoid name collisions
var Ui = {
    buttons: []
    // currentChoice:
};

// TODO get HUD working

// TODO allow clicking on grid - don't deselect menu if click on grid
// TODO don't collision check if not in hud area

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

function drawHud(ctx) {
    Ui.buttons.forEach(function(button) {
        button.draw(ctx);
    });
}

function addMenuButton(hudTileX, hudTileY, imageCategory, imageName, callback) {
    var hudGraphicalX = (grid.width + hudTileX) * TILE_WIDTH;
    var hudGraphicalY = hudTileY * TILE_WIDTH;
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
    addMenuButton(0, 3, 'enemy', 'glarefish.png',function() {
        Ui.currentChoice = 'glarefish';
    });
    addMenuButton(0, 5, 'interface', 'axehammer.png',function() {
        Ui.currentChoice = 'delete';
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
            grid.addEntity(makeTestFireTower(gx, gy));
        } else if (Ui.currentChoice === 'bluefire') {
            grid.addEntity(makeTestSprayTower(gx, gy));
        } else if (Ui.currentChoice === 'lightningbolt') {
            grid.addEntity(makeTestLightningTower(gx, gy));        
        } else if (Ui.currentChoice === 'glarefish') {
            grid.addEntity(makeGlarefish(gx, gy));
        } else if (Ui.currentChoice === 'delete') {
            grid.removeEntityAt(tileCoords);
            // TODO delete tower
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