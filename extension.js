'use strict';
// http://mathematicalcoffee.blogspot.no/2012/09/developing-gnome-shell-extensions.html
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Lang = imports.lang;

let windowTagger;


const WindowMap = new Lang.Class ({
    Name: 'WindowMap',

    _init: function() {
        this.windowToKeyMap = {};
        this.keyToWindowMap = {};
    },

    rv: Object.freeze({
        Success: 1,
        ErrWindowExists: 2,
        ErrKeyExists: 3
    }),

    add: function(window, key) {
        if (this.windowToKeyMap[window] !== undefined) {
            return this.rv.ErrWindowExists;
        }

        if (this.keyToWindowMap[key] !== undefined) {
            return this.rv.ErrKeyExists;
        }

        this.windowToKeyMap[window] = key;
        this.keyToWindowMap[key] = window;

        return this.rv.Success;
    },

    window: function(key) {
        return this.keyToWindowMap[key] || null;
    },

    key: function(window) {
        return this.windowToKeyMap[window] || null;
    },

    remove_window: function(window) {
        let key = this.windowToKeyMap[window];
        delete this.windowToKeyMap[window];
        delete this.keyToWindowMap[key];
    },

    remove_key: function(key) {
        let window = this.keyToWindowMap[key];
        delete this.keyToWindowMap[key];
        delete this.windowToKeyMap[window];
    }
});

const WindowTagger = new Lang.Class({
    Name: 'WindowTagger',

    _init: function() { 
        this.windowMap = new WindowMap();
    },

    destroy: function() { }
});



function init() { }

function enable() {
    windowTagger = new WindowTagger();
}

function disable() {
    windowTagger.destroy();
}
