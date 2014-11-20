
/*
 * Provides global helper functions.
 */
var Utility = {
    // Removes an element from an array, returns true if found, false if not
    removeElementFromArray: function (array, target) {
        if (array) {
            var index = Utility.getIndexInArray(array, target);
            if (index != -1) {
                array.splice(index, 1);
                return true;
            }
        }
        return false;
    },
    // Removes an element at an index in an array, returns removed element
    removeElementAtIndexInArray: function (array, index) {
        if (array) {
            var removed = array[index];
            array.splice(index, 1);
            return removed;
        }
    },
    // Finds the index of an element in an array, or returns -1 if not found
    getIndexInArray: function (array, target) {
        if (array) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === target) { // strict reference check for objects
                    return i;
                }
            }
        }
        return -1;
    },
    // Get random integer from min to max, inclusive on both ends
    getRandomInteger: function (min, max) {
        var scatter = max - min + 1;
        return Math.floor(Math.random() * scatter) + min;
    },
    // Gets a random element from an array
    getRandomElementFromArray: function (array) {
        if (array && array.length > 0) {
            var index = Utility.getRandomInteger(0, array.length - 1);
            return array[index];
        }
    },
    // Returns true with a certain percent chance
    percentChance: function(chance) {
        return Math.random() * 100 < chance;
    }
}