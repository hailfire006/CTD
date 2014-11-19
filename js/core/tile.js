
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
        }
    };
    return tile;
}
