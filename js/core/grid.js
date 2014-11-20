
// Depends on: entity.js, tile.js, terrain.js, settings.js

/*
 * Grids are 2D arrays of Tiles
 *  draw(ctx): calls draw(ctx) on each contained tile
 *  update(): calls update() on each contained tile
 * Grids also contain enemy spawn locations and handle entity detection code.
 */
function makeGrid(width, height) {
    // Avoid issues with non-positive widths & heights
    width = Math.max(width, 1);
    height = Math.max(height, 1);
    // square dimensions recommended
    var tileWidth = TILE_WIDTH;
    var tileHeight = TILE_HEIGHT;
    // Initialize grid as 2d array
    var grid = new Array(width);
    for (var i = 0; i < width; i++) {
        grid[i] = new Array(height);
        // initialize tiles
        for (var j = 0; j < height; j++) {
            // terrain test
            var grassTerrain = makeTerrain(i * tileWidth, j * tileHeight, 'grass.png');
            var rockTerrain = makeTerrain(i * tileWidth, j * tileHeight, 'rock.png');
            var random = Math.random();
            var terrain = rockTerrain;
            var buildable = true;
            if (random > 0.1) {
                terrain = grassTerrain;
                buildable = true;
            } else {
                terrain = rockTerrain;
                buildable = false;
            }
            var tile = makeTile(buildable, terrain);
            // directional test
            if (random < .25) {
                random = Math.random();
                var directionNum = Math.floor(random / .24);
                var direction;
                switch (directionNum) {
                    case 0:
                    direction = {x: 0, y: 1};
                    break;
                    case 1:
                    direction = {x: 0, y: -1};
                    break;
                    case 2:
                    direction = {x: 1, y: 0};
                    break;
                    case 3:
                    direction = {x: -1, y: 0};
                    break;
                }
                tile.direction = direction;
            }
            grid[i][j] = tile;
        }
    }
    grid.width = width;
    grid.height = height;
    grid.entities = []; // used for drawing
    grid.spawnPoints = [];
    // adding functions (fake OOP)
    grid.addEntity = function(entity) {
        var tileCoords = this.graphicalToTileCoords(entity.gx, entity.gy);
        var tile = grid.getTileAtCoords(tileCoords);
        if (tile) {
            tile.addEntity(entity);
            grid.entities.push(entity);
            entity.grid = this;
            return true;
        }
        return false;
    };
    grid.removeEntityAt = function(tileCoords) {
        if (this.inBounds(tileCoords)) {
            var tile = grid.getTileAtCoords(tileCoords);
            var occupants = tile.getEntities();
            console.log(occupants);
            if (occupants.length > 0) {
                var entity = Utility.removeElementAtIndexInArray(occupants, 0);
                Utility.removeElementFromArray(this.entities, entity);
                return entity;
            }
        }
    };
    grid.removeEntity = function(entity) {
        Utility.removeElementFromArray(this.entities, entity);
        // remove from tile
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[i].length; j++) {
                var curTile = grid[i][j];
                var curOccupants = curTile.getEntities();
                Utility.removeElementFromArray(curOccupants, entity);
            }
        }
    };
    // spawn point
    grid.addSpawnPoint = function(tx, ty) {
        var tileCoords = {
            tx: tx,
            ty: ty
        };
        this.spawnPoints.push(tileCoords);
    };
    grid.spawn = function() {
        // choose a random spawner
        var chosenSpawnPoint = Utility.getRandomElementFromArray(this.spawnPoints);
        if (chosenSpawnPoint) {
            var spawnGraphicalCoords = this.tileToGraphicalCoords(chosenSpawnPoint.tx, chosenSpawnPoint.ty);
            this.spawnRandomEnemy(spawnGraphicalCoords.gx, spawnGraphicalCoords.gy);
        }
    };
    grid.spawnRandomEnemy = function(gx, gy) {
        var choice = Utility.getRandomInteger(0, 1);
        if (choice == 0) {
            this.addEntity(makeGlarefish(gx, gy));
        } else if (choice == 1) {
            this.addEntity(makeChomper(gx, gy));
        }
    };
    // tower-related
    grid.canBuildTowerAt = function(tileCoords) {
        if (this.inBounds(tileCoords)) {
            var tile = grid.getTileAtCoords(tileCoords);
            if (!tile.buildable) {
                return false;
            }
            var entities = tile.getEntities();
            for (var i = 0; i < entities.length; i++) {
                if (entities[i].building) { // is building = is tower
                    return false;
                }
            }
            return true;
        }
        return false;
    };
    grid.hasEnemy = function(gx, gy) {
        return !!this.getFirstEnemy(gx, gy); // !! = cast to boolean, true if defined
    };
    grid.getFirstEnemy = function(gx, gy) {
        var tileCoords = this.graphicalToTileCoords(gx, gy);
        if (this.inBounds(tileCoords)) {
            var tile = grid.getTileAtCoords(tileCoords);
            var entities = tile.getEntities();
            for (var i = 0; i < entities.length; i++) {
                if (entities[i].hostile) { // is hostile = is enemy
                    return entities[i];
                }
            }
        }
    };
    // draw & update just send draw & update function calls to every contained tile
    grid.draw = function(ctx) {
        // draw terrain
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[i].length; j++) {
                var curTile = grid[i][j];
                curTile.drawTerrain(ctx);
            }
        }
        // draw spawn (optional)
        if (SHOW_ENEMY_SPAWN) {
            this.spawnPoints.forEach(function(curPoint) {
                var spawnImage = Images.getImage('interface', 'start_platform.png');      
                ctx.drawImage(spawnImage, curPoint.tx * tileWidth, curPoint.ty * tileHeight, tileWidth, tileHeight);
            });
        }
        // draw grid lines (optional)
        if (SHOW_GRID) {
            for (var i = 0; i < grid.length; i++) {
                for (var j = 0; j < grid[i].length; j++) {
                    ctx.beginPath();
                    ctx.strokeStyle = "black";
                    ctx.rect(i * tileWidth, j * tileHeight, tileWidth, tileHeight);
                    ctx.stroke();
                }
            }
        }
        // draw enemy direction (optional)
        if (SHOW_ENEMY_DIRECTION) {
            for (var i = 0; i < grid.length; i++) {
                for (var j = 0; j < grid[i].length; j++) {
                    var curTile = grid[i][j];
                    if (curTile.direction) {
                        var arrowImage = Images.getImage('interface', 'arrow_right.png');                        
                        var translateX = i * tileWidth + tileWidth / 2;
                        var translateY = j * tileHeight + tileHeight / 2;
                        var angle = Math.atan2(curTile.direction.y, curTile.direction.x);
                        ctx.save();
                        ctx.translate(translateX, translateY);
                        ctx.rotate(angle);
                        ctx.translate(-translateX, -translateY);
                        ctx.drawImage(arrowImage, i * tileWidth, j * tileHeight, tileWidth, tileHeight);
                        ctx.restore();
                    }
                }
            }
        }
        // highlight tiles w/ entities (optional)
        if (HIGHLIGHT_TILES_WITH_ENTITIES) {
            for (var i = 0; i < grid.length; i++) {
                for (var j = 0; j < grid[i].length; j++) {
                    var curTile = grid[i][j];
                    if (curTile.occupants.length > 0) {
                        ctx.beginPath();
                        ctx.strokeStyle = "red";
                        ctx.rect(i * tileWidth, j * tileHeight, tileWidth, tileHeight);
                        ctx.stroke();
                    }
                }
            }
        }
        // ensure entities on multiple tiles are drawn ABOVE terrain
        for (var i = 0; i < grid.entities.length; i++) {
            grid.entities[i].draw(ctx);
        }
    };
    grid.update = function(mod) {
        // update each tile's entities
        for (var i = 0; i < grid.entities.length; i++) {
            grid.entities[i].update(mod);
        }
        // TODO handle multiple tiles?
        // now update which tile the entities belong to
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[i].length; j++) {
                var curTile = grid[i][j];
                this.updateEntitiesCoordinates(curTile);
            }
        }
        // TODO load what enemies & when to spawn from somewhere else....
        if (Utility.percentChance(5)) {
            this.spawn();
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
        var entityCenterX = entity.gx + entity.sx / 2;
        var entityCenterY = entity.gy + entity.sy / 2;
        var tileCoords = this.graphicalToTileCoords(entityCenterX, entityCenterY);
        if (this.inBounds(tileCoords)) {
            var newTile = this.getTileAtCoords(tileCoords);
            if (oldTile !== newTile) {
                // TODO this handles enemies moving offscreen, not enemies moving onscreen
                if (newTile) { // if not moving offscreen
                    oldTile.removeEntity(entity);
                    newTile.addEntity(entity);
                }
            }
        } else { // go offscreen = delete
            oldTile.removeEntity(entity);
            Utility.removeElementFromArray(this.entities, entity);
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
    // gives (gx, gy) for TOP-LEFT corner
    grid.tileToGraphicalCoords = function(tx, ty) {
        var gx = tx * TILE_WIDTH; 
        var gy = ty * TILE_HEIGHT;
        return {
            gx: gx,
            gy: gy
        };
    };
    grid.inBounds = function(tileCoords) {
        var tx = tileCoords.tx;
        var ty = tileCoords.ty;
        return tx >= 0 && tx < grid.length && ty >= 0 && ty < grid[0].length;
    };
    grid.getTileAtCoords = function(tileCoords) {
        if (this.inBounds(tileCoords)) {
            var tx = tileCoords.tx;
            var ty = tileCoords.ty;
            return grid[tx][ty];
        }
    };
    // save/load
    grid.asJsonObject = function() {
        var gridInfo = new Array(width);
        for (var i = 0; i < grid.width; i++) {
            gridInfo[i] = new Array(height);
            for (var j = 0; j < grid.height; j++) {
                gridInfo[i][j] = grid[i][j].asJsonObject();
            }
        }
        gridInfo.spawnPoints = grid.spawnPoints;
        return gridInfo;
    };
    grid.fromJsonString = function(jsonString) {
        var gridInfo = JSON.parse(jsonString);
        console.log('loading');
        grid.length = gridInfo.length;
        for (var i = 0; i < gridInfo.length; i++) {
            grid[i].length = gridInfo[i].length;
            for (var j = 0; j < gridInfo[i].length; j++) {
                var dummyTerrain = makeTerrain(0, 0, 'grass.png');
                var dummyTile = makeTile(false, dummyTerrain);
                grid[i][j] = dummyTile.fromJsonObject(gridInfo[i][j]);
            }
        }
        grid.width = gridInfo.length;
        grid.height = gridInfo[0].length;
        //grid.spawnPoints = gridInfo.spawnPoints;
        console.log(gridInfo.spawnPoints);
    };
    return grid;
}
// TODO Sheng - flip width & height for iteration performance
