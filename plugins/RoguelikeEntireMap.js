function RoguelikeEntireMap() {
	this.initialize.apply(this, arguments);
};

RoguelikeEntireMap.prototype = Object.create(Window_Base.prototype);
RoguelikeEntireMap.prototype.constructor = RoguelikeEntireMap;

RoguelikeEntireMap.prototype.initialize = function(x, y) {
	var width = this.mapRegionNumber() * this.mapRegionPictureWidth();
	var height = this.mapRegionNumber() * this.mapRegionPictureHeight();
	Window_Base.prototype.initialize.call(this, x, y, width, height);
	this.refresh();
};

RoguelikeEntireMap.prototype.windowWidth = function() {
	return (this.mapRegionNumber() * this.mapRegionPictureWidth() + (this.standardPadding() * 2));
};

RoguelikeEntireMap.prototype.windowHeight = function() {
	return (this.mapRegionNumber() * this.mapRegionPictureHeight() + (this.standardPadding() * 2));
};

RoguelikeEntireMap.prototype.mapRegionPictureWidth = function() {
	return 48;
};

RoguelikeEntireMap.prototype.mapRegionPictureHeight = function() {
	return 48;
};

RoguelikeEntireMap.prototype.mapRegionNumber = function() {
	return !!$gameSystem.allMapInformation ? $gameSystem.allMapInformation.length : 30;
};

RoguelikeEntireMap.prototype.mapRegionPictureRate = function() {
	return 0.4;
};

RoguelikeEntireMap.prototype.mapRegionTransportPictureRate = function() {
	return this.mapRegionPictureRate() * 0.2;
};

RoguelikeEntireMap.prototype.refresh = function() {
	this.contents.clear();
	
	var _allMapInformation = Object.assign([], $gameSystem.allMapInformation);
	var x = 0;
	var y = 0;
	var _mapRegionPictureWidth = this.mapRegionPictureWidth() * this.mapRegionPictureRate();
	var _mapRegionPictureHeight = this.mapRegionPictureHeight() * this.mapRegionPictureRate();
	var _mapRegionTransportPictureWidth = this.mapRegionPictureWidth() * this.mapRegionTransportPictureRate();
	var _mapRegionTransportPictureHeight = this.mapRegionPictureHeight() * this.mapRegionTransportPictureRate();
	var _regionNumber = this.mapRegionNumber();
	var _mapCoordinateX = 0;
	var _mapCoordinateY = 0;
	var _sidestRegionX = 0;
	var _sidestRegionY = 0;
	var _region = {};
	var _transportString = "transport: ";
	var _transportX = 0;
	var _transportY = 0;
	const that = this;
	
	if ( !!$gameSystem.allMapInformation ) {
		_mapCoordinateX = $gameSystem.randomMapCoordinate.length;
		_mapCoordinateY = $gameSystem.randomMapCoordinate[0].length;
		_sidestRegionX = _allMapInformation.sort((a, b) => a.positionX - b.positionX)[0].positionX;
		_sidestRegionY = _allMapInformation.sort((a, b) => a.positionY - b.positionY)[0].positionY;
		for ( i = 0; i < _mapCoordinateX; i++ ) {
			for ( j = 0; j < _mapCoordinateY; j++ ) {
				if ( $gameSystem.randomMapCoordinate[i][j] != "---" ) {
					_region = $gameSystem.allMapInformation.find(o => o.regionId === $gameSystem.randomMapCoordinate[i][j]);
					this.drawRegion(x + i * _mapRegionPictureWidth, y + j * _mapRegionPictureHeight);
					for ( _direction = 2; _direction <= 8; _direction += 2 ) {
						if ( _region.transportEvent.find(o => o.note.includes(_transportString + _direction))._open === true ) {
							_transportX = _direction === 4 ? 0 : _direction === 6 ? _mapRegionPictureWidth - _mapRegionTransportPictureWidth : (_mapRegionPictureWidth - _mapRegionTransportPictureWidth) / 2;
							_transportY = _direction === 8 ? 0 : _direction === 2 ? _mapRegionPictureHeight - _mapRegionTransportPictureHeight : (_mapRegionPictureHeight - _mapRegionTransportPictureHeight) / 2;
							this.drawRegionTransport(_transportX + i * _mapRegionPictureWidth, _transportY + j * _mapRegionPictureWidth);
						};
					};
				};
			};
		};
	};
	//置中
	// this.x = (Graphics.width / 4) - (_sidestRegionX * _mapRegionPictureWidth * this.mapRegionPictureRate());
	// this.y = (Graphics.height / 4) - (_sidestRegionY * _mapRegionPictureHeight * this.mapRegionPictureRate());
	//右上角
	this.x = (Graphics.width / 2) + (Graphics.width / 16) - (_sidestRegionX * _mapRegionPictureWidth * this.mapRegionPictureRate()) - 50;
	this.y = (Graphics.height / 4) - (Graphics.height / 2) - (_sidestRegionY * _mapRegionPictureHeight * this.mapRegionPictureRate()) + 50;

};

RoguelikeEntireMap.prototype.drawRegion = function(x, y, width, height) {
    width = width || this.mapRegionPictureWidth();
    height = height || this.mapRegionPictureHeight();
    var bitmap = ImageManager.loadPicture('MapRegion');
    var pw = this.mapRegionPictureWidth();
    var ph = this.mapRegionPictureHeight();
    var sw = Math.min(width, pw);
    var sh = Math.min(height, ph);
    var dx = x;
    var dy = y;
    var sx = 0;
    var sy = 0;
		var dw = pw * this.mapRegionPictureRate();
		var dh = ph * this.mapRegionPictureRate();
    this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy, dw, dh);
};

RoguelikeEntireMap.prototype.drawRegionTransport = function(x, y, width, height) {
    width = width || this.mapRegionPictureWidth();
    height = height || this.mapRegionPictureHeight();
    var bitmap = ImageManager.loadPicture('MapRegionTransport');
    var pw = this.mapRegionPictureWidth();
    var ph = this.mapRegionPictureHeight();
    var sw = Math.min(width, pw);
    var sh = Math.min(height, ph);
    var dx = x;
    var dy = y;
    var sx = 0;
    var sy = 0;
		var dw = pw * this.mapRegionTransportPictureRate();
		var dh = ph * this.mapRegionTransportPictureRate();
    this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy, dw, dh);
		
};

RoguelikeEntireMap.prototype.open = function() {
	this.refresh();
	Window_Base.prototype.open.call(this);
};

//Scene_Map
var RoguelikeEntireMap_mapStart = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
    RoguelikeEntireMap_mapStart.call(this);
		this.creatRoguelikeEntireMap();
};

//產生HUD的背景框架
Scene_Map.prototype.creatRoguelikeEntireMap = function() {
	this._roguelikeEntireMap = new RoguelikeEntireMap();
	this._roguelikeEntireMap.x = 0;
	this._roguelikeEntireMap.y = 0;
	this._roguelikeEntireMap.opacity = 0;
	this._roguelikeEntireMap.width = this._roguelikeEntireMap.windowWidth();
	this._roguelikeEntireMap.height = this._roguelikeEntireMap.windowHeight();
	this.addChild(this._roguelikeEntireMap);
};

var RoguelikeEntireMap_mapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
  RoguelikeEntireMap_mapUpdate.call(this);
	// this._roguelikeEntireMap.width = this._roguelikeEntireMap.width != this._roguelikeEntireMap.windowWidth() ? this._roguelikeEntireMap.windowWidth() : this._roguelikeEntireMap.width;
	// this._roguelikeEntireMap.height = this._roguelikeEntireMap.height != this._roguelikeEntireMap.windowHeight() ? this._roguelikeEntireMap.windowHeight() : this._roguelikeEntireMap.height;
	this._roguelikeEntireMap.refresh();
	// console.log("this._roguelikeEntireMap.mapRegionNumber() = ");
	// console.log(this._roguelikeEntireMap.mapRegionNumber());
};
