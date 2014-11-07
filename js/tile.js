
// Depends on: entity.js

/*
 * Tiles contain up to 1 Entity and may or may not be built on
 *  draw(ctx): calls draw(ctx) on contained Entity, if present
 *  update(): calls update() on contained Entity, if present
 */
function makeTile(buildable) {
	var tile = {
		buildable: buildable, // can towers be build on this tile?
		setEntity: function(entity) {
			this.entity = entity;
		},
		// TODO will getEntity and hasEntity be useless?
		getEntity: function() {
			return this.entity;
		},
		hasEntity: function() {
			if (this.entity) {
				return true;
			}
			return false;
		},
		// draw & update just delegate draw & update to contained entity
		draw: function(ctx) {
			if (this.entity) {
				this.entity.draw(ctx);
			}
		},
		update: function(mod) {
			if (this.entity) {
				this.entity.update(mod);
			}
		}
		// TODO deleteEntity?
	};
	return tile;
}
