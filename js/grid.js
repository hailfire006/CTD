
// Depends on: entity.js, tile.js, terrain.js, settings.js

/*
 * Grids are 2D arrays of Tiles
 *  draw(ctx): calls draw(ctx) on each contained tile
 *  update(): calls update() on each contained tile
 */
function makeGrid(width, height) {
    // Avoid issues with non-positive widths & heights
    width = Math.max(width, 1);
    height = Math.max(height, 1);
    // TODO tileWidth tileHeight
    var tileWidth = 50;
    var tileHeight = 50;
    // Initialize grid as 2d array
    var grid = new Array(width);
    for (var i = 0; i < width; i++) {
        grid[i] = new Array(height);
        // initialize tiles
        for (var j = 0; j < height; j++) {
            var grassTerrain = makeTerrain(i * tileWidth, j * tileHeight, 'grass.png');
            var tile = makeTile(true, grassTerrain);
            grid[i][j] = tile;
        }
    }
    // adding functions (fake OOP)
    grid.addEntity = function(entity) {
        var tileCoords = this.graphicalToTileCoords(entity.gx, entity.gy);
        if (this.inBounds(tileCoords)) {
            var tile = grid.getTileAtCoords(tileCoords);
            tile.addEntity(entity);
            return true;
        }
        return false;
    };
    // draw & update just send draw & update function calls to every contained tile
    grid.draw = function(ctx) {
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[i].length; j++) {
                var curTile = grid[i][j];
                curTile.drawTerrain(ctx);
                if (SHOW_GRID) {
                    ctx.beginPath();
                    ctx.strokeStyle = "black";
                    ctx.rect(i * tileWidth, j * tileHeight, tileWidth, tileHeight);
                    ctx.stroke();
                }
            }
        }
        // ensure entities on multiple tiles are drawn ABOVE terrain
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[i].length; j++) {
                var curTile = grid[i][j];
                curTile.drawEntities(ctx);
                if (HIGHLIGHT_TILES_WITH_ENTITIES && curTile.occupants.length > 0) {
                    ctx.beginPath();
                    ctx.strokeStyle = "red";
                    ctx.rect(i * tileWidth, j * tileHeight, tileWidth, tileHeight);
                    ctx.stroke();
                }
            }
        }
    };
    grid.update = function(mod) {
        // update each tile's entities
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[i].length; j++) {
                var curTile = grid[i][j];
                curTile.update(mod);
            }
        }
        // now update which tile the entities belong to
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[i].length; j++) {
                var curTile = grid[i][j];
                this.updateEntitiesCoordinates(curTile);
            }
        }
    };
    // move all entities in a tile
    grid.updateEntitiesCoordinates = function(tile) {
        var entities = tile.getEntities();
        entities.forEach(function(entity) {
            this.updateEntityCoordinates(tile, entity);
        }, this);
    };
    // change the tile an entity belongs to based on its current (gx, gy)
    grid.updateEntityCoordinates = function(oldTile, entity) {
        // TODO determine tile by center of entity, not top-left corner
        var tileCoords = this.graphicalToTileCoords(entity.gx, entity.gy);
        if (this.inBounds(tileCoords)) {
            var newTile = this.getTileAtCoords(tileCoords);
            if (oldTile !== newTile) {
                oldTile.removeEntity(entity);
                newTile.addEntity(entity);
            }
        } else {
            // TODO is this right? code internally w/ offscreen tiles?
            oldTile.removeEntity(entity);
        }
    };
    // graphical coordinates & tile coordinates conversions
    grid.graphicalToTileCoords = function(gx, gy) {
        var tx = Math.floor(gx / tileWidth);
        var ty = Math.floor(gy / tileHeight);
        return {
            tx: tx,
            ty: ty
        };
    };
    grid.inBounds = function(tileCoords) {
        var tx = tileCoords.tx;
        var ty = tileCoords.ty;
        return tx >= 0 && tx < grid.length && ty >= 0 && ty < grid[0].length;
    };
    grid.getTileAtCoords = function(tileCoords) {
        var tx = tileCoords.tx;
        var ty = tileCoords.ty;
        return grid[tx][ty];
    };
    return grid;
}
// TODO Sheng - flip width & height for iteration performance
