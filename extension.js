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

    _init: function() {
        this._windowMap = {};
        this._tagMap = {};
    },

    getTag: function(window) {
        if (!(window in this._tagMap)) {
            return "";
        }

        return this._tagMap[window];
    },

    getWindow: function(tag) {
        if (!(tag in this._windowMap)) {
            return null;
        }

        return this._windowMap[tag];
    },

    deleteTag: function(tag) {
        if (tag in this._windowMap) {
            let window = this._windowMap[tag];
            delete this._windowMap[tag];
            delete this._tagMap[window];
        }
    },

    deleteWindow: function(window) {
        if (window in this._tagMap) {
            let tag = this._tagMap[window];
            delete this._tagMap[window];
            delete this._windowMap[tag];
        }
    },

    tagWindow: function(window, tag) {
        this.deleteTag(tag);
        this.deleteWindow(window);
        this._windowMap[tag] = window;
        this._tagMap[window] = tag;
    },

    tagActiveWindow: function(tag) {
        let window = global.display.get_focus_window();
        if (window) {
            this.tagWindow(window, tag);
        }
    },

    destroy: function() {}
});

const WindowTaggerView = new Lang.Class({
    Name: 'WindowTaggerView',

    _createEntry: function() {
        let pm = Main.layoutManager.primaryMonitor;
        let entry = new St.Entry({style_class: 'text-label'});
        entry.set_width(Math.floor(pm.width / 6));
        return entry;
    },

    _createBoxLayout: function(entry) {
        let boxLayout = new St.BoxLayout({style_class: 'box-layout'});
        boxLayout.set_vertical(true);
        boxLayout.insert_child_at_index(entry, 0);
        return boxLayout;
    },

    _createContainer: function(boxLayout) {
        let pm = Main.layoutManager.primaryMonitor;
        let container = new St.Bin({reactive: true});
        container.set_width(Math.floor(pm.width / 6));
        container.set_alignment(St.Align.MIDDLE, St.Align.START);
        container.add_actor(boxLayout);
        return container;
    },

    _init: function() { 
        this._hidden = true;
        this._entry = this._createEntry();
        this._boxLayout = this._createBoxLayout(this._entry);
        this._container = this._createContainer(this._boxLayout);
    },

    getEntry: function() {
        return this._entry;
    },

    getEntryText: function() {
        return this._entry.get_text();
    },

    getContainer: function() {
        return this._container;
    },

    show: function() {
        if (!this._hidden) return;
        this._hidden = false;
        let panel = Main.layoutManager.panelBox;
        let mt = Main.layoutManager.primaryMonitor;
        Main.uiGroup.add_actor(this._container);
        this._container.set_position(mt.x + mt.width - this._container.width, mt.y + panel.height);
        global.stage.set_key_focus(this._entry);
    },

    hide: function() {
        if (this._hidden) return;
        this._hidden = true;
        Main.uiGroup.remove_actor(this._container);
    },

    reset: function() {
        this._entry.set_text("");
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
            () => {view.show();
        // TODO: remove
        model.tagActiveWindow("test");
            }
        );

        this._keyReleaseHander = view.getEntry().connect('key-release-event', (o, e) => { 
            const ctrl = (e.get_state() & Clutter.ModifierType.CONTROL_MASK) !== 0;
            const shift = (e.get_state() & Clutter.ModifierType.SHIFT_MASK) !== 0;
            const sym = e.get_key_symbol();

            if (sym === Clutter.KEY_Escape || sym === Clutter.KEY_Return) {
                let win = this._model.getWindow("test");
                if (win) { Main.activateWindow(win); }
                this._view.reset();
                this._view.hide();
            }
        });

        
    },

    destroy: function() {
        Main.wm.removeKeybinding('start-tag');
        this._view.getEntry().disconnect(this._keyReleaseHander);
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
