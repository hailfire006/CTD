function makeTower(x, y, imageName) {
    var imageCategory = 'tower';
    var tower = makeEntity(x, y, imageCategory, imageName);
        tower.upgrade = function () {
                    tower.imageName = "grass.png";
                }
    return tower;
}
function makeTestTower() {
    var tower = makeTower(50,200,"glarefish.png");
    tower.update = function (mod) {
        this.gx += 40 * mod;
        this.gy += 20 * mod;
    }
    tower.sx = 60
    tower.sy = 60
    return tower;
}
// Depends on: entity.js

/*
 * Tower entities go here.
 */

// TODO towers
