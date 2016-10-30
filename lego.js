'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = true;


exports.query = function (collection) {
    var copy = collection.map(function (entry) {
        return Object.assign({}, entry);
    });
    var operators = [].slice.call(arguments, 1);
    operators.sort(sortByPriority);
    for (var i = 0; i < operators.length; i++) {
        copy = operators[i](copy);
    }

    return copy;
};

function sortByPriority(a, b) {
    var priority = ['filterIn', 'and', 'or', 'sortBy', 'select', 'limit', 'format'];

    return priority.indexOf(b.name) < priority.indexOf(a.name);
}


exports.select = function () {
    var params = [].slice.call(arguments);

    return function select(collection) {
        var copy = collection.slice();

        return copy.map(function (entry) {

            return selectByParam(params, entry);
        });
    };
};

function selectByParam(params, entry) {
    var keys = Object.keys(entry);
    var newEntry = {};
    keys.forEach(function (key) {
        if (params.indexOf(key) !== -1) {
            newEntry[key] = entry[key];
        }
    });

    return newEntry;
}

exports.filterIn = function (property, values) {
    console.info(property, values);

    return function filterIn(collection) {
        var copy = collection.slice();

        return copy.filter(function (entry) {

            return checkPropAndValues(entry, property, values);
        });
    };
};

function checkPropAndValues(entry, property, values) {
    for (var i = 0; i < values.length; i++) {
        if (entry[property] === values[i]) {
            return true;
        }
    }

    return false;
}

exports.sortBy = function (property, order) {
    console.info(property, order);

    return function sortBy(collection) {
        var copy = collection.slice();

        return copy.sort(function (entryOne, entryTwo) {
            if (order === 'asc') {

                return entryOne[property] > entryTwo[property];
            }

            return entryTwo[property] > entryOne[property];
        });
    };
};

exports.format = function (property, formatter) {
    console.info(property, formatter);

    return function format(collection) {
        var copy = collection.slice();

        return copy.map(function (entry) {
            entry[property] = formatter(entry[property]);

            return entry;
        });
    };
};

exports.limit = function (count) {
    console.info(count);

    return function limit(collection) {

        return collection.slice(0, count);
    };
};

if (exports.isStar) {

    exports.or = function () {
        var filters = [].slice.call(arguments);

        return function or(collection) {
            var copy = collection.slice();

            return copy.filter(function (item) {
                return filters.some(function (filter) {
                    return filter(copy).indexOf(item) !== -1;
                });
            });
        };
    };

    exports.and = function () {
        var filters = [].slice.call(arguments);

        return function and(collection) {
            var copy = collection.slice();
            filters.forEach(function (filter) {
                copy = filter(copy);
            });

            return copy;
        };
    };
}
