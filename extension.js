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

    _init: function() { }
});

const WindowTaggerView = new Lang.Class({
    Name: 'WindowTaggerView',

    _init: function() { }
});

const WindowTaggerController = new Lang.Class({
    Name: 'WindowTaggerController',

    _init: function(model, view) {
        this._model = model;
        this._view = view;
    }
});

const WindowTaggerApp = new Lang.Class({
    Name: 'WindowTaggerApp',

    _init: function() { 
        Main.wm.addKeybinding(
            'start-tag',
            Convenience.getSettings(),
            Meta.KeyBindingFlags.NONE,
            Shell.ActionMode.NORMAL,
            Lang.bind(this, this._showUI)
        );
    },

    _showUI: function() {
        let panel = Main.layoutManager.panelBox;

        if (!this._label) {
            this._label = new St.Entry({style_class: 'text-label', text: "Some text"});
            Main.uiGroup.add_actor(this._label);
            global.stage.set_key_focus(this._label);
            this._label.opacity = 255;

            let mt = Main.layoutManager.primaryMonitor;
            this._label.set_position(mt.x + mt.width - this._label.width, mt.y + panel.height);

            this._label.connect('key-release-event', (o, e) => { 
                const ctrl = (e.get_state() & Clutter.ModifierType.CONTROL_MASK) !== 0;
                const shift = (e.get_state() & Clutter.ModifierType.SHIFT_MASK) !== 0;
                const sym = e.get_key_symbol();

                if (sym === Clutter.KEY_Escape) {
                    this._hideUI();
                }
            });

            //Tweener.addTween(this._label, { opacity: 0, time: 2, transition: 'easeOutQuad', onComplete: Lang.bind(this, this._hideUI) });
        }
    },

    _hideUI: function() {
        if (this._label) {
            Main.uiGroup.remove_actor(this._label);
            this._label = null;
        }
    },

    destroy: function() { 
        Main.wm.removeKeybinding('start-tag');
    }
});

function init() {} 

function enable() {
    windowTagger = new WindowTaggerApp();
}

function disable() {
    windowTagger.destroy();
}
