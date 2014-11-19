
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
        image: Images.getImage(imageCategory, imageName),
        draw: function (ctx) {
            ctx.drawImage(this.image, this.gx, this.gy, this.sx, this.sy);
            if (HIGHLIGHT_ENTITY_HITBOXES) {
                ctx.beginPath();
                ctx.strokeStyle = "white";
                ctx.rect(this.gx, this.gy, this.sx, this.sy);
                ctx.stroke();
            }
        },
        update: function (mod) {
            // no-op, 'subclasses' can override
        },
		// helper functions
		getCurrentTileCoords: function() {
			return this.grid.graphicalToTileCoords(this.gx + this.sx / 2, this.gy + this.sy / 2);
		}
    };
    return entity;
}
