
// Depends on: entity.js

/*
 * Terrain is located on tiles. It is purely graphical and has no gameplay effect.
 *  draw(ctx): draws terrain image
 */
function makeTerrain(gx, gy, imageName) {
	var entity = {
		// gx & gy are graphical positions
		gx: gx,
		gy: gy,
		sx: 50,
		sy: 50,
		image: Images.getImage('terrain', imageName),
		draw: function (ctx) {
			ctx.drawImage(this.image, this.gx, this.gy, this.sx, this.sy);
		}
	};
	return entity;
}
