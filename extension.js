'use strict';

const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Lang = imports.lang;

let windowTagger;

const WindowTagger = new Lang.Class({
    Name: 'WindowTagger',

    _init: function() { },

    destroy: function() { }
});



function init() { }

function enable() {
    windowTagger = new WindowTagger();
}

function disable() {
    windowTagger.destroy();
}
