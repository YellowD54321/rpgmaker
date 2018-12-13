function Minecraft_HUDitemset() {
	
	this.initialize.apply(this, arguments);

};

//快捷鍵確認視窗
Minecraft_HUDitemset.prototype = Object.create(Window_Command.prototype);
Minecraft_HUDitemset.prototype.constructor = Minecraft_HUDitemset;

Minecraft_HUDitemset.prototype.initialize = function(x, y) {
    Window_Command.prototype.initialize.call(this, x, y);
};

Minecraft_HUDitemset._lastCommandSymbol = null;

Minecraft_HUDitemset.initCommandPosition = function() {
    this._lastCommandSymbol = null;
};

Minecraft_HUDitemset.prototype.windowWidth = function() {
    return 150;
};

Minecraft_HUDitemset.prototype.numVisibleRows = function() {
    return 3;
};

Minecraft_HUDitemset.prototype.makeCommandList = function() {
    this.addMainCommands();
};

Minecraft_HUDitemset.prototype.addMainCommands = function() {
    var enabled = this.areItemsetEnable();
		this.addCommand("使用道具", 'item', enabled);
		this.addCommand("設定快捷鍵", 'itemhotkeyset', enabled);
		this.addCommand("取消", 'cancel', enabled);
};

Minecraft_HUDitemset.prototype.areItemsetEnable = function() {
    // return $gameParty.exists();
};


//快捷鍵設定視窗
function Minecraft_HUDitemSetNumberWindow() {
    this.initialize.apply(this, arguments);
};

Minecraft_HUDitemSetNumberWindow.prototype = Object.create(Window_HorzCommand.prototype);
Minecraft_HUDitemSetNumberWindow.prototype.constructor = Minecraft_HUDitemSetNumberWindow;

Minecraft_HUDitemSetNumberWindow.prototype.initialize = function() {
    Window_HorzCommand.prototype.initialize.call(this, 0, 0);
};

Minecraft_HUDitemSetNumberWindow.prototype.windowWidth = function() {
    return (this.ConetensSpacing() * 2) + (this.itemWidth() * 9) + (this.IconformSpacing() * 8);
};

Minecraft_HUDitemSetNumberWindow.prototype.windowHeight = function() {
    return (this.ConetensSpacing() * 2) + this.itemHeight();
};

Minecraft_HUDitemSetNumberWindow.prototype.itemWidth = function() {
    return Window_Base._iconWidth + (this.IconformWidthSide() * 2);
};

Minecraft_HUDitemSetNumberWindow.prototype.itemHeight = function() {
    return Window_Base._iconHeight + (this.IconformHeightSide() * 2);
};

Minecraft_HUDitemSetNumberWindow.prototype.maxCols = function() {
    return 9;
};

Minecraft_HUDitemSetNumberWindow.prototype.IconformWidthSide = function() {
    return 3;
};

Minecraft_HUDitemSetNumberWindow.prototype.IconformHeightSide = function() {
    return 3;
};

Minecraft_HUDitemSetNumberWindow.prototype.ConetensSpacing = function() {
    return 18;
};

Minecraft_HUDitemSetNumberWindow.prototype.spacing = function() {
    return 5;
};

Minecraft_HUDitemSetNumberWindow.prototype.IconformSpacing = function() {
    return 5;
};

Minecraft_HUDitemSetNumberWindow.prototype.IconWidth = function() {
    return Window_Base._iconWidth;
};

Minecraft_HUDitemSetNumberWindow.prototype.IconHeight = function() {
    return Window_Base._iconHeight;
};

Minecraft_HUDitemSetNumberWindow.prototype.update = function() {
    Window_HorzCommand.prototype.update.call(this);
		this.refresh();
		// Window_Base.prototype.update.call(this);
		
		// this.updateArrows();
    // this.processCursorMove();
    // this.processHandling();
    // this.processWheel();
    // this.processTouch();
    // this._stayCount++;
};

Minecraft_HUDitemSetNumberWindow.prototype.makeCommandList = function() {
	for (i = 0; i < 9; i++) {
		
		this.addCommand("", 'itemSetNumber' + String(i + 1));
	};
    // this.addCommand("1", 'itemSetNumber1');
    // this.addCommand("2", 'itemSetNumber2');
    // this.addCommand("3", 'itemSetNumber3');
    // this.addCommand("4", 'itemSetNumber4');
		// this.addCommand("5", 'itemSetNumber5');
		// this.addCommand("6", 'itemSetNumber6');
		// this.addCommand("7", 'itemSetNumber7');
		// this.addCommand("8", 'itemSetNumber8');
		// this.addCommand("9", 'itemSetNumber9');
};

Minecraft_HUDitemSetNumberWindow.prototype.Minecraft_drawcontents = function(itemsetnumber) {
	var iconwidth = this.IconWidth();
	var iconformWidthside = this.IconformWidthSide();
	var iconformHeightside = this.IconformHeightSide();
	var iconformspacing = this.IconformSpacing();
	
	// this.Minecraft_drawIconform((iconwidth + (iconformWidthside * 2)  + iconformspacing) * itemsetnumber, 0);
	if ($itemList_Bar[itemsetnumber + 1] != 0 && $itemList_Bar[itemsetnumber + 1] != null)
		this.Minecraft_drawIcon($dataItems[$itemList_Bar[itemsetnumber + 1]].iconIndex, iconformWidthside + (iconwidth + (iconformWidthside * 2) + iconformspacing) * itemsetnumber, 0 + iconformHeightside);
		// console.log($dataItems[$itemList_Bar[itemsetnumber + 1]].iconIndex);
};

//drawIcon
Minecraft_HUDitemSetNumberWindow.prototype.Minecraft_drawIcon = function(iconIndex, x, y) {
   var bitmap = ImageManager.loadSystem('IconSet');
   var pw = this.IconWidth();
   var ph = this.IconHeight();
   var sx = iconIndex % 16 * pw;
   var sy = Math.floor(iconIndex / 16) * ph;

   bitmap.addLoadListener(function() {
		this.contents.blt(bitmap, sx, sy, pw, ph, x, y);      
   }.bind(this));
		
};

//drawIconform
Minecraft_HUDitemSetNumberWindow.prototype.Minecraft_drawIconform = function(x, y) {
   var bitmap = ImageManager.loadPicture('Iconform');
   var pw = this.IconWidth() + this.IconformWidthSide() * 2;
   var ph = this.IconHeight() + this.IconformHeightSide() * 2;
	 
   bitmap.addLoadListener(function() {
		this.contents.blt(bitmap, 0, 0, pw, ph, x, y);      
   }.bind(this));
		
};

// Minecraft_HUDitemSetNumberWindow.prototype.drawItem = function(index) {
    // var item = $dataItems[$itemList_Bar[index]];
		// console.log(item);
    // if (item) {
        // var numberWidth = this.numberWidth();
        // var rect = this.itemRect(index);
        // rect.width -= this.textPadding();
        // this.changePaintOpacity(this.isEnabled(item));
        // this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
        // this.drawItemNumber(item, rect.x, rect.y, rect.width);
				// this.changePaintOpacity(255);
				// this.Minecraft_drawcontents(index);
        // this.changePaintOpacity(1);
    // }
// };

Minecraft_HUDitemSetNumberWindow.prototype.refresh = function() {
	
		Window_HorzCommand.prototype.refresh.call(this);
		for (i = 0; i < 9; i++) {
			this.Minecraft_drawcontents(i);
		};
    // this.makeItemList();
		
    // this.createContents();
		
    // this.drawAllItems();
};



//Scene_Item中設定快捷鍵確認視窗
Scene_Item.prototype.create = function() {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createCategoryWindow();
    this.createItemWindow();
    this.createActorWindow();
		this.createitemsetWindow();
		this.createitemSetNumberWindow();
		this._itemsetWindow.deactivate();
		this._itemsetWindow.hide();
		this._itemsetWindow.close();
		this._itemSetNumberWindow.deactivate();
		this._itemSetNumberWindow.hide();
};

Scene_Item.prototype.createitemsetWindow = function() {
    this._itemsetWindow = new Minecraft_HUDitemset(0, 0);
		this._itemsetWindow.x = (Graphics.width / 2 - this._itemsetWindow.width / 2);
		this._itemsetWindow.y = (Graphics.height / 2 - this._itemsetWindow.height / 2);
    this._itemsetWindow.setHandler('item',      this.onItemsetOk.bind(this));
    this._itemsetWindow.setHandler('itemhotkeyset',     this.commanditemhotkeyset.bind(this));
    this._itemsetWindow.setHandler('cancel',     this.onItemsetCancel.bind(this));
    this.addWindow(this._itemsetWindow);
};

Scene_Item.prototype.onItemOk = function() {
    $gameParty.setLastItem(this.item());
		this._itemsetWindow.activate();
		this._itemsetWindow.show();
		this._itemsetWindow.open();
		// this.createitemsetWindow();
};

Scene_Item.prototype.onItemsetOk = function() {
	this._itemsetWindow.close();
	// this._itemsetWindow.deactivate();
	// this._itemsetWindow.hide();
	this.determineItem();
};

Scene_Item.prototype.commanditemhotkeyset = function() {
	// this._itemsetWindow.deselect();
	// this._itemsetWindow.hide();
	this._itemsetWindow.close();
	this._itemSetNumberWindow.activate();
	this._itemSetNumberWindow.show();
	// this.createitemSetNumberWindow();
};

Scene_Item.prototype.onItemsetCancel = function() {
	// this._itemsetWindow.active = false;
	this._itemsetWindow.close();
	// this._itemsetWindow.deselect();
	// this._itemsetWindow.hide();
	this._itemWindow.activate();
};

Scene_Item.prototype.onItemSetNumberCancel = function() {
	this._itemSetNumberWindow.deactivate();
	this._itemSetNumberWindow.hide();
	this._itemWindow.activate();
};

Scene_Item.prototype.onItemSetNumberOk = function() {
	this._itemSetNumberWindow.activate();
	var itemsetnumber = this._itemSetNumberWindow.index();
	$itemList_Bar[itemsetnumber + 1] = this.item().id;
	// console.log($itemList_Bar[1]);
	// this._itemSetNumberWindow.refresh();
	// this._itemSetNumberWindow.hide();
	// this._itemSetNumberWindow.deselect();
	// this._itemWindow.activate();
};



Scene_Item.prototype.update = function() {
    Scene_ItemBase.prototype.update.call(this);
    if (this._categoryWindow.active !== true && this._itemWindow.active !== true && this._itemsetWindow.active !== true && this._actorWindow.active !== true && this._itemSetNumberWindow.active !== true) {
        this._categoryWindow.activate();
    }
};


// Scene_Item中設定快捷鍵設定視窗
Scene_Item.prototype.createitemSetNumberWindow = function() {
    this._itemSetNumberWindow = new Minecraft_HUDitemSetNumberWindow(0, 0);//(Graphics.width / 2, Graphics.height / 2);
		this._itemSetNumberWindow.x = (Graphics.width - this._itemSetNumberWindow.width) / 2;
		this._itemSetNumberWindow.y = Graphics.height - this._itemSetNumberWindow.height;
		for (i = 1; i <=9; i++) {
			this._itemSetNumberWindow.setHandler('itemSetNumber' + String(i),      this.onItemSetNumberOk.bind(this));
		};
		
		this._itemSetNumberWindow.setHandler('cancel',      this.onItemSetNumberCancel.bind(this));
    this.addWindow(this._itemSetNumberWindow);
};







Scene_Menu.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_MenuCommand(0, 0);
    this._commandWindow.setHandler('item',      this.commandItem.bind(this));
    this._commandWindow.setHandler('skill',     this.commandPersonal.bind(this));
    // this._commandWindow.setHandler('equip',     this.commandPersonal.bind(this));
    // this._commandWindow.setHandler('status',    this.commandPersonal.bind(this));
    // this._commandWindow.setHandler('formation', this.commandFormation.bind(this));
    this._commandWindow.setHandler('options',   this.commandOptions.bind(this));
    this._commandWindow.setHandler('save',      this.commandSave.bind(this));
    this._commandWindow.setHandler('gameEnd',   this.commandGameEnd.bind(this));
    this._commandWindow.setHandler('cancel',    this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Window_MenuCommand.prototype.needsCommand = function(name) {
    var flags = $dataSystem.menuCommands;
    if (flags) {
        switch (name) {
        case 'item':
            return flags[0];
        case 'skill':
            return flags[1];
        // case 'equip':
            // return flags[2];
        // case 'status':
            // return flags[3];
        // case 'formation':
            // return flags[4];
        case 'save':
            return flags[5];
        }
    }
    return true;
};

Window_MenuCommand.prototype.addMainCommands = function() {
    var enabled = this.areMainCommandsEnabled();
    if (this.needsCommand('item')) {
        this.addCommand(TextManager.item, 'item', enabled);
    }
    if (this.needsCommand('skill')) {
        this.addCommand(TextManager.skill, 'skill', enabled);
    }
    // if (this.needsCommand('equip')) {
        // this.addCommand(TextManager.equip, 'equip', enabled);
    // }
    // if (this.needsCommand('status')) {
        // this.addCommand(TextManager.status, 'status', enabled);
    // }
};

Window_MenuCommand.prototype.addFormationCommand = function() {
    // if (this.needsCommand('formation')) {
        // var enabled = this.isFormationEnabled();
        // this.addCommand(TextManager.formation, 'formation', enabled);
    // }
};

