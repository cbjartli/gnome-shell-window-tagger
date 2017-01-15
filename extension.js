'use strict';

const St = imports.gi.St;
const Main = imports.ui.main;
const Meta = imports.gi.Meta;
const Tweener = imports.ui.tweener;
const Lang = imports.lang;
const Shell = imports.gi.Shell;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

var windowTagger;

const WindowTagger = new Lang.Class({
    Name: 'WindowTagger',

    _init: function() { 
        Main.wm.addKeybinding(
            'start-tag',
            Convenience.getSettings(),
            Meta.KeyBindingFlags.NONE,
            Shell.ActionMode.NORMAL,
            () => { log("RECEIVED") }
        );
    },

    destroy: function() { 
        Main.wm.removeKeybinding('start-tag');
    }
});

function init() {
}

function enable() {
    windowTagger = new WindowTagger();
}

function disable() {
    windowTagger.destroy();
}
