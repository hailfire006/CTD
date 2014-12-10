
// Depends on: images.js, settings.js

/*
 * Entities are contained inside tiles, they are enemies, towers and trees
 * Entities are the most-used class in this game project
 *  draw(ctx): draws image specified by setImage(String,String)
 *  update(): does nothing, 'subclasses' can override to do something every game frame
 */
function makeEntity(gx, gy, imageCategory, imageName) {
    var entity = {
        // gx & gy are graphical position, where to draw on screen
        //grid: undefined,
        gx: gx,
        gy: gy,
        sx: TILE_WIDTH,
        sy: TILE_HEIGHT,
        imageCategory: imageCategory,
        imageName: imageName,
        image: Images.getImage(imageCategory, imageName),
        // Draw image
        draw: function (ctx) {
            this.preDraw(ctx);
            ctx.drawImage(this.image, this.gx, this.gy, this.sx, this.sy);
            if (HIGHLIGHT_ENTITY_HITBOXES) {
                ctx.beginPath();
                ctx.strokeStyle = "white";
                ctx.rect(this.gx, this.gy, this.sx, this.sy);
                ctx.stroke();
            }
            this.postDraw(ctx);
        },
        // Draw on bottom: no-op
        preDraw: function (ctx) {
        },
        // Draw on top: no-op
        postDraw: function (ctx) {
        },
        update: function (mod) {
            // no-op, 'subclasses' can override
        },
        // helper functions
        getCurrentTileCoords: function() {
            return this.grid.graphicalToTileCoords(this.gx + this.sx / 2, this.gy + this.sy / 2);
        },
        fullyInsideTile: function(tileCoords, vx, vy) {
            // check if 100% inside tile
            var minGraphicalX = tileCoords.tx * TILE_WIDTH;
            var minGraphicalY = tileCoords.ty * TILE_HEIGHT;
            var maxGraphicalX = (tileCoords.tx + 1) * TILE_WIDTH;
            var maxGraphicalY = (tileCoords.ty + 1) * TILE_HEIGHT;
            var movingLeft = vx < 0;
            var movingRight = vx > 0;
            var movingUp = vy < 0;
            var movingDown = vy > 0;
            if (movingLeft) {
                if (this.gx > minGraphicalX) {
                    return false;
                }
            } else if (movingRight) {
                if (this.gx + this.sx < maxGraphicalX) {
                    return false;
                }
            }
            if (movingUp) {
                if (this.gy > minGraphicalY) {
                    return false;
                }
            } else if (movingDown) {
                if (this.gy + this.sy < maxGraphicalY) {
                    return false;
                }
            }
            return true;
        }
    };
    return entity;
}
