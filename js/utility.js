
/*
 * Provides global helper functions.
 */
var Utility = {
    // Removes an element from an array, returns true if found, false if not
    removeElementFromArray: function (array, target) {
        var index = Utility.getIndexInArray(array, target);
        if (index != -1) {
            array.splice(index, 1);
            return true;
        }
        return false;
    },
    // Finds the index of an element in an array, or returns -1 if not found
    getIndexInArray: function (array, target) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === target) { // strict reference check for objects
                return i;
            }
        }
        return -1;
    }
}