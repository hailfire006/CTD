
/*
 * A UI component is a button or text displayed by the HUD or Sidebar.
 */

// TODO implement
// TODO make sidebar & HUD both use these objects

function makeUiComponent(x, y, width, height) {
    var component = {
        x: x,
        y: y,
        width: width,
        height: height,
        hovered: false, // whether mouse is hovering over this
        selected: false, // whether mouse clicked this
        draw: function(ctx) {
            // no-op, should override
        },
        // mouseover/hover & click handling
        containsPoint: function(mouseX, mouseY) {
            if (!this.width || !this.height) { // if no specified height or width, can't be interacted with
                return false;
            }
            return mouseX >= this.x && mouseX <= this.x + this.width
                && mouseY >= this.y && mouseY <= this.y + this.height;
        },
        onClickFunction: function() {
            // called when clicked
        },
        tryHover: function(mouseX, mouseY) {
            this.hovered = this.containsPoint(mouseX, mouseY);
            return this.hovered;
        },
        tryClick: function(mouseX, mouseY) {
            this.selected = this.containsPoint(mouseX, mouseY);
            if (this.selected) {
                this.onClickFunction();
            }
            return this.selected;
        },
    };
    return component;
}

// Canvas draw text wrap w/ multiline code from: http://stackoverflow.com/a/17777674/364154
function fillMultilineText(ctx, text, x, y, maxWidth, lineHeight) {
    var lines = text.split("\n");
    for (var i = 0; i < lines.length; i++) {
        var words = lines[i].split(' ');
        var line = '';
        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = ctx.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
        y += lineHeight;
    }
}

function makeTextComponent(x, y, text, fontSize, fontName, style) {
    var textComponent = makeUiComponent(x, y); // width & height irrelevant, doesn't handle click/mouseover
    textComponent.text = text;
    textComponent.style = style;
    textComponent.draw = function(ctx) {
        // draw name
        var maxWidth = SIDEBAR_WIDTH; // TODO constant?
        var font = fontSize + 'px ' + fontName; // Ex: (20, 'Arial') -> '20px Arial'
        ctx.font = font;
        ctx.fillStyle = this.style;
        fillMultilineText(ctx, this.text, this.x, this.y, maxWidth, fontSize);
    };
    return textComponent;
}

function makeButton(x, y, imageCategory, imageName, onClickFunction) {
    var button = makeUiComponent(x, y, TILE_WIDTH, TILE_HEIGHT);
    button.image = Images.getImage(imageCategory, imageName);
    button.draw = function(ctx) {
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
    };
    button.onClickFunction = onClickFunction;
    return button;
}
