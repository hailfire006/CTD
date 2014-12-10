
// Depends on: entity.js, terrain.js

/*
 * Tiles contain up to 1 Entity and may or may not be built on
 *  draw(ctx): calls draw(ctx) on contained Entity, if present, also draws terrain
 */
function makeTile(buildable, terrain) {
    var tile = {
        buildable: buildable, // can towers be build on this tile?
        terrain: terrain, // purely graphical, displays below contained entity
        //direction: 
        occupants: [],
        // contained entities/occupant manipulation
        addEntity: function(entity) {
            this.occupants.push(entity);
        },
        getEntities: function() {
            return this.occupants;
        },
        removeEntity: function(targetEntity) {
            return Utility.removeElementFromArray(this.occupants, targetEntity);
        },
        // helper functions for grid
        canBuildTower: function() {
            return this.buildable && !this.hasTower();
        },
        getFirstTower: function() {
            for (var i = 0; i < this.occupants.length; i++) {
                if (this.occupants[i].building) { // is building = is tower
                    return this.occupants[i];
                }
            }
        },
        hasTower: function() {
            return !!this.getFirstTower();
        },
        // drawEntities just delegate draw to contained entity
        drawEntities: function(ctx) {
            this.occupants.forEach(function(entity) {
                entity.draw(ctx);
            });
        },
        drawTerrain: function(ctx) {
            if (this.terrain) {
                this.terrain.draw(ctx);
            }
        },
        asJsonObject: function() {
            var tileInfo = {
                buildable: this.buildable,
                terrain: this.terrain.asJsonObject(),
                direction: this.direction
            };
            return tileInfo;
        },
        fromJsonObject: function(jsonObject) {
            var tileInfo = jsonObject;
            this.buildable = tileInfo.buildable;
            this.terrain = this.terrain.fromJsonObject(tileInfo.terrain);
            this.direction = tileInfo.direction;
            return this;
        }
    };
    return tile;
}
