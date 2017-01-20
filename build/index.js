"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.init = init;
exports.openList = openList;
exports.promiseUpload = promiseUpload;
exports.promiseList = promiseList;
exports.promiseListRange = promiseListRange;
exports.promiseSaveItem = promiseSaveItem;
exports.promiseRemoveItem = promiseRemoveItem;
exports.promiseMoveItem = promiseMoveItem;

var _deepEqual = require("deep-equal");

var _deepEqual2 = _interopRequireDefault(_deepEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Copyright 2017 Paul Brewer, Economic and Financial Technology Consulting LLC */
/* This file is open source software.  The MIT License applies to this software. */

/*
 * store should be set to window.localStorage or window.sessionStorage with init(_)
 *
 */

var store = null;

function init(obj) {
    store = obj;
}

function openList(name) {
    var defaultValue = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    if (defaultValue && !store.getItem(name)) {
        store.setItem(name, JSON.stringify(defaultValue));
    }
    return name;
}

function promiseUpload() {
    throw new Error("upload unavailable when using local storage");
}

function promiseList(list) {
    return new Promise(function (resolve, reject) {
        var S = store;
        var data = S.getItem(list);
        setTimeout(function () {
            if (data) return resolve(JSON.parse(data));
            reject("storage for  " + list + " does not exist locally");
        }, 0);
    });
}

function promiseListRange(list, iFrom, iTo) {
    return promiseList(list).then(function (data) {
        return data.slice(iFrom, iTo);
    });
}

function promiseSaveItem(item, list) {
    return promiseList(list).then(function (data) {
        data.unshift(item);
        store.setItem(list, JSON.stringify(data));
    });
}

function promiseRemoveItem(item, list) {
    return promiseList(list).then(function (data) {
        var newData = data.filter(function (x) {
            return !(0, _deepEqual2.default)(x, item, true);
        });
        store.setItem(list, JSON.stringify(newData));
    });
}

function promiseMoveItem(item, list1, list2) {
    return Promise.all([promiseSaveItem(item, list2), promiseRemoveItem(item, list1)]);
}
