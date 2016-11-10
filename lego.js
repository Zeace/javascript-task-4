'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = true;


exports.query = function (collection) {
    var copyOfCollection = collection.map(function (entry) {
        return Object.assign({}, entry);
    });
    var operators = [].slice.call(arguments, 1);
    operators.sort(sortByPriority);
    copyOfCollection = operators.reduce(function (collect, opepator) {
        return opepator(collect);
    }, copyOfCollection);

    return copyOfCollection;
};

function sortByPriority(a, b) {
    var priority = ['filterIn', 'and', 'or', 'sortBy', 'select', 'limit', 'format'];

    return priority.indexOf(b.name) < priority.indexOf(a.name);
}


exports.select = function () {
    var params = [].slice.call(arguments);

    return function select(collection) {
        var copyOfCollection = collection.slice();

        return copyOfCollection.map(function (entry) {
            return selectByParam(params, entry);
        });
    };
};

function selectByParam(params, entry) {
    var newEntry = {};
    params.forEach(function (param) {
        newEntry[param] = entry[param];
    });

    return newEntry;
}

exports.filterIn = function (property, values) {
    console.info(property, values);

    return function filterIn(collection) {
        var copyOfCollection = collection.slice();

        return copyOfCollection.filter(function (entry) {
            return values.some(function (value) {
                return entry[property] === value;
            });
        });
    };
};


exports.sortBy = function (property, order) {
    console.info(property, order);

    return function sortBy(collection) {
        var copyOfCollection = collection.slice();

        return copyOfCollection.sort(function (entryOne, entryTwo) {
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
        var copyOfCollection = collection.slice();

        return copyOfCollection.map(function (entry) {
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
            var copyOfCollection = collection.slice();

            return copyOfCollection.filter(function (item) {
                return filters.some(function (filter) {
                    return filter(copyOfCollection).indexOf(item) !== -1;
                });
            });
        };
    };

    exports.and = function () {
        var filters = [].slice.call(arguments);

        return function and(collection) {
            var copyOfCollection = collection.slice();
            filters.forEach(function (filter) {
                copyOfCollection = filter(copyOfCollection);
            });

            return copyOfCollection;
        };
    };
}
