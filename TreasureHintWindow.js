function TreasureHintWindow() {
    this.initialize.apply(this, arguments);
};

TreasureHintWindow.prototype = Object.create(Window_Base.prototype);
TreasureHintWindow.prototype.constructor = TreasureHintWindow;

TreasureHintWindow.prototype.initialize = function(x, y) {
		this._text = $TreasureBaloonText;
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
		
		var widthHeight = this.TreasureTextWidthHeight();
		
		this.width = this.textWidth(widthHeight[0]) + this.standardPadding() * 2;
		this.height = (this.contents.fontSize + 8) * widthHeight[1] + this.standardPadding() * 2;
		this.timeCounting = 0;
    this.refresh();
};

TreasureHintWindow.prototype.windowWidth = function() {
    return Graphics.width;
};

TreasureHintWindow.prototype.windowHeight = function() {
		return Graphics.height;
};

TreasureHintWindow.prototype.refresh = function() {
    this.contents.clear();
		this.drawTextEx(this._text, 0, 0);
};

TreasureHintWindow.prototype.TreasureTextWidthHeight = function() {
	var text = this._text;
	var textLine = 0;
	var width_counting = 0;
	var longestText = text;
	var lastEnd = 0;
	var widthHeight = [];

	for (i = 0; i <= text.length; i++)	{
		if ((text.charAt(i) == '\n'))	{
			textLine++;
			longestText = (i - lastEnd) > width_counting ? text.slice(lastEnd, i) : longestText;
			width_counting = (i - lastEnd) > width_counting ? (i - lastEnd) : width_counting;
			lastEnd = i;
		};
	};
		
	console.log(longestText);
	widthHeight[0] = longestText;
	widthHeight[1] = textLine;
	
	return widthHeight;

};

TreasureHintWindow.prototype.open = function() {
    this.refresh();
    Window_Base.prototype.open.call(this);
};

Scene_Base.prototype.createTreasureHintScene = function() {};

//TreasureHintScene
function TreasureHintScene() {
    this.initialize.apply(this, arguments);
}

TreasureHintScene.prototype = Object.create(Scene_Map.prototype);
TreasureHintScene.prototype.constructor = TreasureHintScene;

TreasureHintScene.prototype.initialize = function() {
    Scene_Map.prototype.initialize.call(this);
};

TreasureHintScene.prototype.create = function() {
    Scene_Map.prototype.create.call(this);
};

Scene_Map.prototype.createTreasureHintScene = function() {
	if (this._createTreasureHintWindow != null){
		this._createTreasureHintWindow.contentsOpacity = 0;
		this._createTreasureHintWindow.opacity = 0;
		this._createTreasureHintWindow.close();
	};
	var aa = new TreasureHintWindow(0, 0);
	this._createTreasureHintWindow = aa;
	this.triggerX = $gameMap.event($TreasureBaloonEventID).screenX();
	this.triggerY = $gameMap.event($TreasureBaloonEventID).screenY() - 48;
	this._createTreasureHintWindow.x = this.triggerX - (this._createTreasureHintWindow.width / 2) + 24;
	this._createTreasureHintWindow.y = this.triggerY - (this._createTreasureHintWindow.height);
	this.addWindow( this._createTreasureHintWindow );
	
	this.timeCounting = 0;
};

TreasureHintScene.prototype.start = function() {
    Scene_Map.prototype.start.call(this);

};

TreasureHintScene.Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
  TreasureHintScene.Scene_Map_update.call(this);
	if (this._createTreasureHintWindow != null) {
		//執行下面這行會變LAG
		// this._createTreasureHintWindow.refresh();
		this.triggerX = $gameMap.event($TreasureBaloonEventID).screenX();
		this.triggerY = $gameMap.event($TreasureBaloonEventID).screenY() - 48;
		this._createTreasureHintWindow.move(this.triggerX - (this._createTreasureHintWindow.width / 2) + 24, this.triggerY - (this._createTreasureHintWindow.height), this._createTreasureHintWindow.width, this._createTreasureHintWindow.height);
		this.timeCounter();
		if (this.timeCounting >= 180) {
			this._createTreasureHintWindow.contentsOpacity -= 2;
			this._createTreasureHintWindow.opacity -= 2;
			if (this._createTreasureHintWindow.opacity <= 0){
				this._createTreasureHintWindow.close;
			};
		};
	};

};

Scene_Map.prototype.timeCounter = function() {
	if (this.timeCounting < 180)
		this.timeCounting++;	
};