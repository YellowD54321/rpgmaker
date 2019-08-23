//顯示傷害數值與狀態數值
function RoguelikeDamageRestore(_targetEventId, _value) {
	$gameSystem.roguelikeDamageRestore.push({
		targetEventId: _targetEventId,
		value: _value,
		windowContent: undefined,
		positionGroup: $gameSystem.roguelikeDamageRestore.filter(x => x.targetEventId === _targetEventId).length + 1,
	});
};

function RoguelikeDamageWindow() {
    this.initialize.apply(this, arguments);
}

RoguelikeDamageWindow.prototype = Object.create(Window_Base.prototype);
RoguelikeDamageWindow.prototype.constructor = RoguelikeDamageWindow;

RoguelikeDamageWindow.prototype.initialize = function(x, y) {
	var width = 600;
	var height = 600;
	Window_Base.prototype.initialize.call(this, x, y, width, height);
  this._duration = 90;
	this._movingY = 0;
	this._positionAdjust = 0;
  this._damageBitmap = ImageManager.loadSystem('Damage');
  // this._flashColor = [0, 0, 0, 0];
  // this._flashDuration = 0;
};

RoguelikeDamageWindow.prototype.createDigits = function(baseRow, value) {
	var string = Math.abs(value).toString();
  var row = baseRow + (value <= 0 ? 0 : 1);
	var zoomInRate = this.zoomInRate();
	var styleRate = this.styleRate();
  var sw = this.digitWidth();
  var sh = this.digitHeight();
  var sx = 0;
  var sy = 0;
  var dw = 0;
  var dh = 0;
	var dx = 0;
  var dy = 0;
	for ( i = 0; i < string.length; i++ ) {
		sx = string[i] * sw;
		sy = row * sh;
		dx = i * (sw * zoomInRate);
		dy = sh * styleRate * ((i+1)%2);//i+1為第一個數字在下，改為i則第一個數字在上
		dw = sw * zoomInRate;
		dh = sh * zoomInRate;
		this.contents.blt(this._damageBitmap, sx, sy, sw, sh, dx, dy, dw, dh);
	};
};

RoguelikeDamageWindow.prototype.createMiss = function() {
	var zoomInRate = this.zoomInRate();
	var styleRate = this.styleRate();
  var sw = this.digitWidth();
  var sh = this.digitHeight();
	var dw = 3 * sw * zoomInRate;
  var dh = sh * zoomInRate;	
	this.contents.blt(this._damageBitmap, 0, 4 * sh, 3.5 * sw, sh, sw / 2, sh * styleRate, dw, dh);
};

// RoguelikeDamageWindow.prototype.setupCriticalEffect = function() {
    // this._flashColor = [255, 0, 0, 160];
    // this._flashDuration = 60;
// };

RoguelikeDamageWindow.prototype.digitWidth = function() {
    return this._damageBitmap ? this._damageBitmap.width / 10 : 0;
};

RoguelikeDamageWindow.prototype.digitHeight = function() {
    return this._damageBitmap ? this._damageBitmap.height / 5 : 0;
};

RoguelikeDamageWindow.prototype.zoomInRate = function() {
    return 0.7;
};

//數字上下偏移的差距
RoguelikeDamageWindow.prototype.styleRate = function() {
    return 0.05;
};

RoguelikeDamageWindow.prototype.getValue = function() {
	return this._value ? this._value : 0;
};

RoguelikeDamageWindow.prototype.setValue = function(value) {
	return this._value = value;
};

RoguelikeDamageWindow.prototype.getEventId = function() {
	return this._EventId ? this._EventId : 0;
};

RoguelikeDamageWindow.prototype.setEventId = function(EventId) {
	return this._EventId = EventId;
};

RoguelikeDamageWindow.prototype.refresh = function() {
	const _pixel = 48;
	var _eventId = this.getEventId();
	this.contents.clear();
	if ( this.getValue() == "MISS" ) {
		this.createMiss();
	} else {
		this.createDigits(0, this.getValue());
	};
  if (this._duration > 0) {
    this._duration--;
	};
	if ( _eventId != 0 && this._movingY < _pixel ) {
		this._movingY++;
		this.x = _eventId != 999 ? ($gameMap.event(_eventId).screenX() - (this.width / 2)) : ($gamePlayer.screenX() - (this.width / 2));
		this.x += this._positionAdjust;
		this.y = _eventId != 999 ? ($gameMap.event(_eventId).screenY() - this.height - this._movingY) : ($gamePlayer.screenY() - this.height - this._movingY);
		this.y += this._positionAdjust;
	};
  // this.updateFlash();
  this.updateOpacity();
};

// RoguelikeDamageWindow.prototype.updateFlash = function() {
    // if (this._flashDuration > 0) {
        // var d = this._flashDuration--;
        // this._flashColor[3] *= (d - 1) / d;
    // }
// };

RoguelikeDamageWindow.prototype.updateOpacity = function() {
    if (this._duration < 10) {
        this.opacity = 255 * this._duration / 10;
    }
};

RoguelikeDamageWindow.prototype.isPlaying = function() {
    return this._duration > 0;
};

var RoguelikeDamageWindow_mapStart = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
  RoguelikeDamageWindow_mapStart.call(this);
	$gameSystem.roguelikeDamageRestore = ($gameSystem.roguelikeDamageRestore === undefined) ? [] : $gameSystem.roguelikeDamageRestore;
	this.allDamageWindow = (this.allDamageWindow === undefined) ? [] : this.allDamageWindow;
};

var RoguelikeDamageWindow_mapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
  RoguelikeDamageWindow_mapUpdate.call(this);
	
	this.roguelikeDamageWindowCheckAndAdd();
	this.roguelikeDamageWindowRefresh();
};

Scene_Map.prototype.roguelikeDamageWindowCheckAndAdd = function() {
	var _positionAdjust = 10;
	if ($gameSystem.roguelikeDamageRestore.length === 0 || 
			$gameSystem.roguelikeDamageRestore.every(x => x.windowContent != undefined) ) { return false; };
	var damageWindowIndex = $gameSystem.roguelikeDamageRestore.findIndex(x => x.windowContent === undefined);
	if (damageWindowIndex === -1) { return false; };
	var _value = $gameSystem.roguelikeDamageRestore[damageWindowIndex].value;
	var _targetEventId = $gameSystem.roguelikeDamageRestore[damageWindowIndex].targetEventId;
	var _positionGroup = $gameSystem.roguelikeDamageRestore[damageWindowIndex].positionGroup;
	var damageWindow = new RoguelikeDamageWindow();
	damageWindow.setValue(_value);
	damageWindow.setEventId(_targetEventId);
	damageWindow._positionAdjust = _positionAdjust * ((_positionGroup - 1) % 3);
	damageWindow.width = _value == "MISS" ? 
		damageWindow.digitWidth() * damageWindow.zoomInRate() * 4 + damageWindow.standardPadding() * 2 : 
		damageWindow.digitWidth() * damageWindow.zoomInRate() * Math.abs(_value).toString().length + damageWindow.standardPadding() * 2;
	damageWindow.height = damageWindow.digitHeight() * damageWindow.zoomInRate() + damageWindow.standardPadding() * 2 + damageWindow.digitHeight() * damageWindow.styleRate();
	damageWindow.x = _targetEventId != 999 ? ($gameMap.event(_targetEventId).screenX() - (damageWindow.width / 2)) : ($gamePlayer.screenX() - (damageWindow.width / 2));
	damageWindow.x += _positionAdjust * ((_positionGroup - 1) % 3);
	damageWindow.y = _targetEventId != 999 ? ($gameMap.event(_targetEventId).screenY() - damageWindow.height) : ($gamePlayer.screenY() - damageWindow.height);
	damageWindow.y += _positionAdjust * ((_positionGroup - 1) % 3);
	damageWindow.opacity = 0;
	this.addChild(damageWindow);
	this.allDamageWindow[damageWindowIndex] = damageWindow;
	$gameSystem.roguelikeDamageRestore[damageWindowIndex].windowContent = damageWindow;
};

Scene_Map.prototype.roguelikeDamageWindowRefresh = function() {
	var that = this;
	if ( this.allDamageWindow.length > 0 ) {
		this.allDamageWindow.forEach(function(eachDamageWindow, windowIndex) {
			eachDamageWindow.refresh();
			eachDamageWindow.opacity = 0;
			if ( eachDamageWindow._duration <= 0 ) {
				eachDamageWindow.hide();
				that.roguelikeDamageWindowRemove(windowIndex);
			};
		});
	};
};

Scene_Map.prototype.roguelikeDamageWindowRemove = function(windowIndex) {
	this.allDamageWindow.splice(windowIndex, 1);
	$gameSystem.roguelikeDamageRestore.splice(windowIndex, 1);
};
