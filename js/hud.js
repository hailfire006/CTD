
/*
 * HUD displays score and menu options.
 */

// Variables inside Ui variable to avoid name collisions
var Ui = {
    buttons: []
};

// TODO get HUD working

function makeButton(x, y, imageCategory, imageName) {
    var button = {
        x: x,
        y: y,
        image: Images.getImage(imageCategory, imageName),
        checkClicked: function(mouseX, mouseY) {
            return mouseX >= this.x && mouseX <= this.x + this.width
                && mouseY >= this.y && mouseY <= this.y + this.height;
        },
        draw: function(ctx) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    };
    button.width = button.image.width;
    button.height = button.image.height;
    return button;
}

function drawHud(ctx) {
    Ui.buttons.forEach(function(button) {
        button.draw(ctx);
    });
}

function initHud() {
    Ui.buttons.push(makeButton(14 * TILE_WIDTH, 0, 'tower', 'fireball.png'));
}
