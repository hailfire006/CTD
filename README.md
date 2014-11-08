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
Main methods: update(), drawTerrain() + drawEntities()

####entity.js
Base entity code, game entities act and are redrawn with update() and draw() every game frame.  
Main methods: update(), draw()
####enemy.js
Special entities that are enemies. Enemies run along the path.  
Main methods: update(), draw()
####tower.js
Special entities that are towers. Towers attack enemies.  
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
