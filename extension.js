'use strict';

const St = imports.gi.St;
const Main = imports.ui.main;
const Meta = imports.gi.Meta;
const Tweener = imports.ui.tweener;
const Lang = imports.lang;
const Shell = imports.gi.Shell;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const Clutter = imports.gi.Clutter;

var windowTagger;

const WindowTaggerModel = new Lang.Class({
    Name: 'WindowTaggerModel',

    _init: function() {},

    destroy: function() {}
});

const WindowTaggerView = new Lang.Class({
    Name: 'WindowTaggerView',

    _init: function() { 
        this._hidden = true;
        this._entry = new St.Entry({style_class: 'text-label', text: "Some text"});
        this._entry.opacity = 255;
    },

    getEntry: function() {
        return this._entry;
    },

    show: function() {
        if (this._hidden) {
            this._hidden = false;
            let panel = Main.layoutManager.panelBox;
            let mt = Main.layoutManager.primaryMonitor;

            Main.uiGroup.add_actor(this._entry);

            this._entry.set_position(mt.x + mt.width - this._entry.width, mt.y + panel.height);
            global.stage.set_key_focus(this._entry);
        }
    },

    hide: function() {
        if (!this._hidden) {
            this._hidden = true;
            Main.uiGroup.remove_actor(this._entry);
        }
    },

    destroy: function () {
        this.hide()
    }
});

const WindowTaggerController = new Lang.Class({
    Name: 'WindowTaggerController',

    _init: function(model, view) {
        this._model = model;
        this._view = view;

        Main.wm.addKeybinding(
            'start-tag',
            Convenience.getSettings(),
            Meta.KeyBindingFlags.NONE,
            Shell.ActionMode.NORMAL,
            Lang.bind(view, view.show)
        );

        view.getEntry().connect('key-release-event', (o, e) => { 
            const ctrl = (e.get_state() & Clutter.ModifierType.CONTROL_MASK) !== 0;
            const shift = (e.get_state() & Clutter.ModifierType.SHIFT_MASK) !== 0;
            const sym = e.get_key_symbol();

            if (sym === Clutter.KEY_Escape) {
                view.hide();
            }
        });
    },

    destroy: function() {
        Main.wm.removeKeybinding('start-tag');
    }
});

const WindowTaggerApp = new Lang.Class({
    Name: 'WindowTaggerApp',

    _init: function() { 
        this._model = new WindowTaggerModel();
        this._view = new WindowTaggerView();
        this._controller = new WindowTaggerController(this._model, this._view);
    },

    destroy: function() { 
        this._controller.destroy();
        this._view.destroy();
        this._model.destroy();
    }
});

function init() {} 

function enable() {
    windowTagger = new WindowTaggerApp();
}

function disable() {
    windowTagger.destroy();
}
