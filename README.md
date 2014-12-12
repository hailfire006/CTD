CTD - Countdown Tower Defense
=============================

Tower defense game w/ currently undecided countdown mechanic

Coded in Javascript

Made during Game Developer's Club

Started November 6th

Developers
==========

Alex Busch

James Kim

Shiliang Zhang

Project Structure
=================

##game.html
Open this in a browser to run the game.

##Image Files (/images/...)
Contains all graphics for the game:  
/images/enemy for enemy graphics
/images/tower for tower graphics
/images/terrain for terrain graphics

##Javascript Files (/js/...)
The game's logic is in here.

####game.js
Game is the View & Controller of the game, it contains a grid representing the game state.  
Constantly steps through the game logic and redraws the game state every game frame (ex: 20 FPS).
Main methods: update(), draw()

####grid.js
Grids are the Model of the game and contain nested models of tiles which contain entities.  
Main methods: update(), draw()

####tile.js
Tiles contain entities, have terrain, and may/may not be built upon.  
Main methods: drawTerrain() + drawEntities()

####entity.js
Base entity code, game entities act and are redrawn with update() and draw() every game frame.  
Main methods: update(), draw()
####enemy.js
Special entities that are enemies. Enemies run along the path.  
Main methods: update(), draw()
####projectile.js
Special entities that are projectiles. Projectiles are fired by towers and have special collision handling.  
Main methods: update(), draw()
####tower.js
Special entities that are towers. Towers attack enemies by firing projectiles.  
Main methods: update(), draw()
####terrain.js
Not quite entities, terrain are purely graphical flavor shown at the bottom of tiles.  
Main methods: draw()

####images.js
Image loading/caching code.
####settings.js
Game constants
####utility.js
Utility functions

Grid Coordinates vs Graphical Coordinates
=========================================

The code references both **(gx, gy)** and **(tx, ty)** as coordinates. **(gx, gy)** refer to graphical coordinates, where on the canvas an entity is drawn. **(tx, ty)** refer to tile coordinates within a grid, where logically an entity exists in a grid.

**(gx, gy)** is updated by **individual entities** as they move.

**(tx, ty)** is updated **automatically by grids** as contained entities move. It is used to determine whether an entity is on-screen and whether an enemy is in attack range of a tower.

The **(gx, gy)** ==> **(tx, ty)** conversion is done automatically by a grid with the **grid.graphicalToTileCoords(gx, gy)** function, and is used by the **grid.inBounds(tileCoords)** and **grid.getTileAtCoords(tileCoords)** functions.

Screenshot Explanation
======================
![Image of a 800x600 green rectangle, representing the canvas](/readme-images/game.png?raw=true)
The game draws onto the canvas.

![Image of a 800x600 green rectangle, with grass tiles and grid outline](/readme-images/grid.png?raw=true)
The game contains a grid, which contain tiles with terrain. Each tile is at a particular set of coordinates (tx, ty) and all are the same width and height.

![Image of a 800x600 green rectangle, with grass tiles and grid outline](/readme-images/enemy.png?raw=true)
The tiles also contain entities, such as this glarefish enemy. Entities have their own coordinates (gx, gy) representing their top-left corner.  
An entity's (gx, gy) coordinates are mapped to a (tx, ty) by the grid, in this case, the red border indicates the tile the entity belongs to.

Game Screenshots
======================
![Screenshot of game with a few towers placed and enemies spawned, showcasing basic interface.](/readme-images/countdown-td_1.png?raw=true)
![Screenshot of game with maximum towers placed and all towers upgraded several levels, and enemies filling up all paths.](/readme-images/countdown-td_2.png?raw=true)
