
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
        sx: TILE_WIDTH,
        sy: TILE_HEIGHT,
        imageCategory: 'terrain',
        imageName: imageName,
        image: Images.getImage('terrain', imageName),
        draw: function (ctx) {
            ctx.drawImage(this.image, this.gx, this.gy, this.sx, this.sy);
        },
        asJsonObject: function() {
            var terrainInfo = {
                gx: this.gx,
                gy: this.gy,
                sx: this.sx,
                sy: this.sy,
                imageCategory: this.imageCategory,
                imageName: this.imageName
            };
            return terrainInfo;
        },
        // asJsonString: function() {
            // var terrainInfo = {
                // gx: this.gx,
                // gy: this.gy,
                // sx: this.sx,
                // sy: this.sy,
                // imageCategory: this.imageCategory,
                // imageName: this.imageName
            // };
            // return JSON.stringify(terrainInfo);
        // },
        fromJsonString: function(jsonString) {
            var terrainInfo = JSON.parse(jsonString);
            this.gx = terrainInfo.gx;
            this.gy = terrainInfo.gy;
            this.sx = terrainInfo.sx;
            this.sy = terrainInfo.sy;
            this.imageCategory = terrainInfo.imageCategory;
            this.imageName = terrainInfo.imageName;
            this.image = Images.getImage(this.imageCategory, this.imageName);
        }
    };
    return entity;
}
