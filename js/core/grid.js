
// Depends on: entity.js, tile.js, terrain.js, settings.js

/*
 * Grids are 2D arrays of Tiles
 *  draw(ctx): calls draw(ctx) on each contained tile
 *  update(): calls update() on each contained tile
 * Grids also contain enemy spawn locations and handle entity detection code.
 * Grid coordinates involve both (gx, gy) graphical coordinates, which are mostly mapped to canvas coords, except for a yOffset
 *                           and (tx, ty) tile coordinates, which are mapped to the 2D tile array
 */
function makeGrid(width, height) {
    // Avoid issues with non-positive widths & heights
    width = Math.max(width, 1);
    height = Math.max(height, 1);
    // square dimensions recommended
    var tileWidth = TILE_WIDTH;
    var tileHeight = TILE_HEIGHT;
    // Initialize grid as 2d array
    var grid = Utility.make2DArray(width, height);
    // initialize tiles
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            var grassTerrain = makeTerrain(i * tileWidth, j * tileHeight, 'grass.png');
            grid[i][j] = makeTile(true, grassTerrain);
        }
    }
    // offset draw for hud bar at top
    grid.drawOffsetY = HUD_HEIGHT;
    grid.width = width;
    grid.height = height;
    grid.entities = []; // used for drawing
    grid.enemyPower = 0; // bonus multiplier for enemy stats
    grid.spawnChance = STARTING_SPAWN_RATE;
    grid.spawnPoints = [];
    grid.pathDistMap = Utility.make2DArray(width, height); // 2D array of how far each tile is from end of path
    // adding functions (fake OOP)
    grid.generateBlankMap = function() {
        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                // terrain test
                var grassTerrain = makeTerrain(i * tileWidth, j * tileHeight, 'grass.png');
                var terrain = grassTerrain;
                var tile = makeTile(true, terrain);
                grid[i][j] = tile;
            }
        }
    };
    grid.generateRandomMap = function() {
        for (var i = 0; i < width; i++) {
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
                if (Utility.percentChance(25)) {
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
        for (var y = Utility.getRandomInteger(1, 3); y < grid.height - 1; y++) {
            grid.addSpawnPoint(0, y);
        }
    };
    // entity-related
    grid.addEntity = function(entity) {
        var tileCoords = this.graphicalToTileCoords(entity.gx, entity.gy);
        var tile = grid.getTileAtCoords(tileCoords);
        if (tile) {
            if (entity.hostile) { // buff enemies when they are added to the grid
                if (Utility.percentChance(BOSS_CHANCE)) {
                    entity.makeBoss(this.enemyPower);
                } else {
                    entity.buffDifficulty(this.enemyPower);
                }
            }
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
        this.calculatePathDistances();
    };
    grid.removeSpawnPoint = function(tx, ty) {
        var tileCoords = {
            tx: tx,
            ty: ty
        };
        var removed = false;
        for (var i = 0; i < this.spawnPoints.length; i++) {
            var spawnPoint = this.spawnPoints[i];
            if (spawnPoint.tx == tileCoords.tx && spawnPoint.ty == tileCoords.ty) {
                this.spawnPoints.splice(i, 1);
                removed = true;
                this.calculatePathDistances();
            }
        }
        return removed;
    };
    grid.spawn = function(numTimes) {
        for (var i = 0; i < numTimes; i++) {
            // choose a random spawner
            var chosenSpawnPoint = Utility.getRandomElementFromArray(this.spawnPoints);
            if (chosenSpawnPoint) {
                var spawnGraphicalCoords = this.tileToGraphicalCoords(chosenSpawnPoint.tx, chosenSpawnPoint.ty);
                this.spawnRandomEnemy(spawnGraphicalCoords.gx, spawnGraphicalCoords.gy);
            }
        }
    };
    grid.spawnRandomEnemy = function(gx, gy) {
        this.addEntity(makeRandomEnemy(gx, gy));
    };
    // Calculates how far each tile is from end of path, perform whenever a spawn/direction changed
    grid.calculatePathDistances = function() {
        for (var i = 0; i < this.pathDistMap.length; i++) {
            for (var j = 0; j < this.pathDistMap[i].length; j++) {
                this.calculatePathDistance(i, j);
            }
        }
    };
    // Calculates how far a tile is from end of path
    grid.calculatePathDistance = function(tx, ty) {
        // just follow the path, with a small check for infinite loops
        var distance = 0;
        var curCoords = {
            tx: tx,
            ty: ty
        };
        var curDirection = {
            dx: 1,
            dy: 0
        };
        var maxDist = this.width * this.height; // infinite loop catcher
        while (this.inBounds(curCoords)) {
            var curTile = this.getTileAtCoords(curCoords);
            if (curTile && curTile.direction) {
                curDirection.dx = curTile.direction.x;
                curDirection.dy = curTile.direction.y;
            }
            curCoords.tx += curDirection.dx;
            curCoords.ty += curDirection.dy;
            distance++;
            // if distance > maximum possible non-loop distance, it's a loop
            if (distance > maxDist) {
                // console.log('loop! for ' + curCoords.tx + ',' + curCoords.ty);
                distance = Number.POSITIVE_INFINITY;
                return;
            }
        }
        // console.log(distance);
        this.pathDistMap[tx][ty] = distance;
    };
    // tower-related
    grid.canBuildTowerAt = function(tileCoords) {
        if (this.inBounds(tileCoords)) {
            var tile = grid.getTileAtCoords(tileCoords);
            return tile.canBuildTower();
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
    grid.getAllEnemies = function(gx, gy) {
        var tileCoords = this.graphicalToTileCoords(gx, gy);
        if (this.inBounds(tileCoords)) {
            var tile = grid.getTileAtCoords(tileCoords);
            var entities = tile.getEntities();
            var isEnemy = function(entity) {
                return entity.hostile; // is hostile = is enemy
            };
            var enemies = entities.filter(isEnemy);
            return enemies;
        }
    };
    // get distance to end of path, how close an enemy on this tile is to finishing path
    // not completely accurate since distance isn't factored in
    grid.getDistToEnd = function(gx, gy) {
        var tileCoords = this.graphicalToTileCoords(gx, gy);
        return this.pathDistMap[tileCoords.tx][tileCoords.ty];
    };
    // draw & update just send draw & update function calls to every contained tile
    grid.draw = function(ctx) {
        ctx.translate(0, this.drawOffsetY);
        // draw terrain
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[i].length; j++) {
                var curTile = grid[i][j];
                curTile.drawTerrain(ctx);
            }
        }
        grid.drawDebug(ctx);
        // ensure entities on multiple tiles are drawn ABOVE terrain
        for (var i = 0; i < grid.entities.length; i++) {
            grid.entities[i].draw(ctx);
        }
        ctx.translate(0, -this.drawOffsetY);
    };
    // Draw debug text, grid lines, squares for entities, etc.
    grid.drawDebug = function(ctx) {
        // draw distance (optional)
        if (SHOW_PATH_DIST) {
            for (var i = 0; i < grid.length; i++) {
                for (var j = 0; j < grid[i].length; j++) {
                    var distText = this.pathDistMap[i][j];
                    if (!distText) {
                        distText = "???";
                    }
                    ctx.fillStyle = "black";
                    ctx.font = "20px Arial";
                    ctx.fillText(distText, i*tileWidth, (j+.5)*tileHeight);
                }
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
    };
    grid.update = function(mod) {
        // update each tile's entities
        for (var i = 0; i < grid.entities.length; i++) {
            grid.entities[i].update(mod);
        }
        // TODO handle multiple tile spanning entities?
        // now update which tile the entities belong to
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[i].length; j++) {
                var curTile = grid[i][j];
                this.updateEntitiesCoordinates(curTile);
            }
        }
        // spawn enemies
        // TODO is this the correct way to modify chance? 50% per second split into 5 frames = 10% per frame?
        var modifiedChance = mod * this.spawnChance;
        var numSpawns = Math.floor(modifiedChance / 100); // if chance >= 100, can cause multiple spawns
        modifiedChance %= 100;
        if (Utility.percentChance(modifiedChance)) {
            numSpawns++;
        }
        this.spawn(numSpawns);
    };
    // move all entities in a tile
    grid.updateEntitiesCoordinates = function(tile) {
        var entities = tile.getEntities();
        entities.forEach(function(entity) {
            this.updateEntityCoordinates(tile, entity);
        }, this);
    };
    // change the tile an entity belongs to based on its current center (gx+sx/2, gy+sy/2)
    grid.updateEntityCoordinates = function(oldTile, entity) {
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
            if (entity.hostile) { // enemies escape, dealing damage
                entity.escape();
            }
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
        var gridObject = new Array(width);
        for (var i = 0; i < grid.width; i++) {
            gridObject[i] = new Array(height);
            for (var j = 0; j < grid.height; j++) {
                gridObject[i][j] = grid[i][j].asJsonObject();
            }
        }
        var gridInfo = {
            grid: gridObject,
            spawnPoints: this.spawnPoints
        };
        return gridInfo;
    };
    grid.fromJsonString = function(jsonString) {
        var gridInfo = JSON.parse(jsonString);
        grid.length = gridInfo.grid.length;
        for (var i = 0; i < gridInfo.grid.length; i++) {
            grid[i].length = gridInfo.grid[i].length;
            for (var j = 0; j < gridInfo.grid[i].length; j++) {
                var dummyTerrain = makeTerrain(0, 0, 'grass.png');
                var dummyTile = makeTile(false, dummyTerrain);
                grid[i][j] = dummyTile.fromJsonObject(gridInfo.grid[i][j]);
            }
        }
        grid.width = gridInfo.grid.length;
        grid.height = gridInfo.grid[0].length;
        grid.spawnPoints = gridInfo.spawnPoints;
        grid.calculatePathDistances();
    };
    return grid;
}
