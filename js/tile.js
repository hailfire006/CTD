
// Depends on: entity.js, terrain.js

/*
 * Tiles contain up to 1 Entity and may or may not be built on
 *  draw(ctx): calls draw(ctx) on contained Entity, if present, also draws terrain
 *  update(): calls update() on contained Entity, if present
 */
 // TODO actually use tiles in game logic
function makeTile(buildable, terrain) {
    var tile = {
        buildable: buildable, // can towers be build on this tile?
        terrain: terrain, // purely graphical, displays below contained entity
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
        // drawEntities & update just delegate draw & update to contained entity
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
        update: function(mod) {
            this.occupants.forEach(function(entity) {
                entity.update(mod);
            });
        }
    };
    return tile;
}
