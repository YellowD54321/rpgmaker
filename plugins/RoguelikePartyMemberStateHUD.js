function RoguelikePartyMemberStateHUD() {
	this.initialize.apply(this, arguments);
};

RoguelikePartyMemberStateHUD.prototype = Object.create(Window_Base.prototype);
RoguelikePartyMemberStateHUD.prototype.constructor = RoguelikePartyMemberStateHUD;

RoguelikePartyMemberStateHUD.prototype.initialize = function(x, y) {
	
	var width = 400;
	var height = 400;
	Window_Base.prototype.initialize.call(this, x, y, width, height);
	this.refresh();
	
};

RoguelikePartyMemberStateHUD.prototype.windowWidth = function() {
	return ($gameParty.members().length * (this.faceDW() + this.actorSpace())) + (this.standardPadding() * 2);
};

RoguelikePartyMemberStateHUD.prototype.windowHeight = function() {
	return height;
};

RoguelikePartyMemberStateHUD.prototype.lineHeight = function() {
    return 36;
};

RoguelikePartyMemberStateHUD.prototype.faceWidth = function() {
    return 144;
};

RoguelikePartyMemberStateHUD.prototype.faceHeight = function() {
    return 144;
};

RoguelikePartyMemberStateHUD.prototype.faceDW = function() {
    return 64;
};

RoguelikePartyMemberStateHUD.prototype.faceDH = function() {
    return 64;
};

RoguelikePartyMemberStateHUD.prototype.iconWidth = function() {
    return 32;
};

RoguelikePartyMemberStateHUD.prototype.iconHeight = function() {
    return 32;
};

RoguelikePartyMemberStateHUD.prototype.hpHeight = function() {
    return 12;
};

RoguelikePartyMemberStateHUD.prototype.actorSpace = function() {
    return 6;
};

RoguelikePartyMemberStateHUD.prototype.refresh = function() {
	this.contents.clear();
	
	//使用Window_Base裡面原有的函數來調整顏色
	var HpColor1 = this.hpGaugeColor1();
	var HpColor2 = this.hpGaugeColor2();
	// var lineHeight = this.lineHeight();
	var faceWidth = this.faceWidth();
	var faceHeight = this.faceHeight();
	var faceDH = this.faceDH();
	var faceDW = this.faceDW();
	var hpHeight = this.hpHeight();
	var actorIndex = 1;
	var actor = $gameParty.members()[actorIndex - 1];
	var x = 0;
	var y = 0;
	var actorSpace = this.actorSpace();
	const that = this;
	
	$gameParty.members().forEach(function(eachMember, index) {
		var actorIndex = eachMember._actorId;
		var actor = eachMember;//$gameParty.members()[actorIndex - 1];
		var dx = x + ((faceDW + actorSpace) * (index));
		
		if ( actor == undefined ) {
			console.log("RoguelikePartyMemberStateHUD.refresh function message");
			console.log("actor is undefined.");
			console.log("actorIndex = " + actorIndex);
		} else {
			that.drawActorFace(actor, dx, y, faceWidth, faceHeight);
			that.drawActorHp(actorIndex, dx, y + faceDH, faceDW, 0, 0, HpColor1, HpColor2);
			that.drawActorIcons(actor, dx, y + faceDH + hpHeight);
		};
	});
};

RoguelikePartyMemberStateHUD.prototype.open = function() {
	this.refresh();
	Window_Base.prototype.open.call(this);
};

//Scene_Map
var RoguelikePartyMemberState_mapStart = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
    RoguelikePartyMemberState_mapStart.call(this);
		this.creatRoguelikePartyMemberStateHUD();
};

//產生HUD的背景框架
Scene_Map.prototype.creatRoguelikePartyMemberStateHUD = function() {
	this._partyMemberStateHUD = new RoguelikePartyMemberStateHUD();
	this._partyMemberStateHUD.x = 0;
	this._partyMemberStateHUD.y = 0;
	this._partyMemberStateHUD.opacity = 0;
	this._partyMemberStateHUD.width = this._partyMemberStateHUD.windowWidth();
	this.addChild(this._partyMemberStateHUD);
	
};

var RoguelikePartyMemberState_mapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
  RoguelikePartyMemberState_mapUpdate.call(this);
	this._partyMemberStateHUD.width = this._partyMemberStateHUD.windowWidth();
	this._partyMemberStateHUD.refresh();
	
};

//改寫Window_Base.drawActorHp來自定義角色HP顯示
RoguelikePartyMemberStateHUD.prototype.drawActorHp = function(actorId, gx, gy, gw, x, y, HpColor1, HpColor2) {
	this.drawGauge(gx, gy, gw, $gameActors._data[actorId].hp / $gameActors._data[actorId].mhp, HpColor1, HpColor2);
	//血量數值
	//200是width
	// this.drawCurrentAndMax($gameActors._data[actorId].hp, $gameActors._data[actorId].mhp, x, y, 200,
                         // this.normalColor(), this.normalColor());
};

RoguelikePartyMemberStateHUD.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
    var fillW = Math.floor(width * rate);
    var gaugeY = y + 1;
    this.contents.fillRect(x, gaugeY, width, this.hpHeight(), this.gaugeBackColor());
    this.contents.gradientFillRect(x, gaugeY, fillW, this.hpHeight(), color1, color2);
};

//改寫Window_Base.drawActorIcons來自定義角色狀態顯示
RoguelikePartyMemberStateHUD.prototype.drawActorIcons = function(actor, x, y, width) {
  width = width || 600;//決定顯示的Icon數量
	var allCondition = typeof $gameSystem.partyMemberConditionContent === "object" ? $gameSystem.partyMemberConditionContent.find(o => o.actorId === actor._actorId) : [];
	var row = 0;//x
	var column = 0;//y
	var dx = 0;
	var dy = 0;
	var _nondisplayMark = "nondisplay";
	if ( allCondition === undefined || allCondition.length <= 0 ) { return false; };
	allCondition = allCondition.condition.filter( o => o.conditionId > 0 );
	allCondition = allCondition.filter( o => !$dataStates[o.conditionId].note.includes(_nondisplayMark));
	if ( allCondition === undefined || allCondition.length <= 0 ) { return false; };
  for (var i = 0; i < allCondition.length; i++) {
		row = Math.floor(i%2);
		column = Math.floor(i/2);
		dx = x + (row * this.iconWidth());
		dy = y + (column * this.iconHeight() + 2);
    this.drawIcon($dataStates[allCondition[i].conditionId].iconIndex, dx, dy);
		this.drawConditionLeftTime(allCondition[i], dx, dy);
  }
};

//改寫Window_Base.drawActorFace來自定義角色頭像顯示
RoguelikePartyMemberStateHUD.prototype.drawActorFace = function(actor, x, y, width, height) {
	var dw = this.faceDW();
	var dh = this.faceDH();
	this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height, dw, dh);
};

RoguelikePartyMemberStateHUD.prototype.drawFace = function(faceName, faceIndex, x, y, width, height, dw, dh) {
    width = width || this.faceWidth();
    height = height || this.faceHeight();
    var bitmap = ImageManager.loadFace(faceName);
    var pw = this.faceWidth();
    var ph = this.faceWidth();
    var sw = Math.min(width, pw);
    var sh = Math.min(height, ph);
    var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
    var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
    var sx = faceIndex % 4 * pw + (pw - sw) / 2;
    var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
    this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy, dw, dh);
};

//繪製剩餘時間字樣
RoguelikePartyMemberStateHUD.prototype.drawConditionLeftTime = function(conditionInformation, x, y) {
	var _timeOrTurn = conditionInformation.timeOrTurn;
	var _effectTimeLeft = conditionInformation.effectTimeLeft;
	var _effectTurnLeft = conditionInformation.effectTurnLeft;
	var _conditionLevel = conditionInformation.level;
	
	if ( _timeOrTurn === "time" ) {
		this.changeTextColor(this.textColor(14));
		this.contents.fontSize = 14;
		this.drawText(Math.ceil(_effectTimeLeft).toString(), x + 20, y + 8, 10, 'right');
		this.changeTextColor(this.normalColor());
		this.contents.fontSize = this.standardFontSize();
	} else if ( _timeOrTurn === "turn" ) {
		this.changeTextColor(this.textColor(23));
		this.contents.fontSize = 14;
		this.drawText(Math.ceil(_effectTurnLeft).toString(), x + 20, y + 8, 10, 'right');
		this.changeTextColor(this.normalColor());
		this.contents.fontSize = this.standardFontSize();
	} else {
		// console.log("RoguelikePartyMemberStateHUD.drawConditionLeftTime function error");
		// console.log("_timeOrTurn of conditionId: " + conditionInformation.conditionId + " is not time nor turn.");
	};
	if ( _conditionLevel > 1 ) {
		this.changeTextColor(this.textColor(24));
		this.contents.fontSize = 16;
		this.drawText(Math.ceil(_conditionLevel).toString(), x + 20, y - 8, 10, 'right');
		this.changeTextColor(this.normalColor());
		this.contents.fontSize = this.standardFontSize();
	} else {
		this.contents.fontSize = 16;
		this.drawText("  ", x + 20, y - 8, 10, 'right');
		this.changeTextColor(this.normalColor());
		this.contents.fontSize = this.standardFontSize();
	};
};


/*-----------------------改寫用資料區----------------------------

Window_Base.prototype.drawActorHp = function(actor, x, y, width) {
    width = width || 186;
    var color1 = this.hpGaugeColor1();
    var color2 = this.hpGaugeColor2();
    this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
    this.changeTextColor(this.systemColor()); 
    this.drawText(TextManager.hpA, x, y, 44);
    this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width,
                           this.hpColor(actor), this.normalColor());
};

Window_Base內原有函數，用來畫血條的圖形
Window_Base.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
    var fillW = Math.floor(width * rate);
    var gaugeY = y + this.lineHeight() - 8;
    this.contents.fillRect(x, gaugeY, width, 6, this.gaugeBackColor());
    this.contents.gradientFillRect(x, gaugeY, fillW, 6, color1, color2);
};

Window_Base.prototype.drawActorIcons = function(actor, x, y, width) {
    width = width || 144;
    var icons = actor.allIcons().slice(0, Math.floor(width / Window_Base._iconWidth));
    for (var i = 0; i < icons.length; i++) {
        this.drawIcon(icons[i], x + Window_Base._iconWidth * i, y + 2);
    }
};

Window_Base.prototype.drawActorFace = function(actor, x, y, width, height) {
    this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
};

Window_Base.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {
    width = width || Window_Base._faceWidth;
    height = height || Window_Base._faceHeight;
    var bitmap = ImageManager.loadFace(faceName);
    var pw = Window_Base._faceWidth;
    var ph = Window_Base._faceHeight;
    var sw = Math.min(width, pw);
    var sh = Math.min(height, ph);
    var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
    var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
    var sx = faceIndex % 4 * pw + (pw - sw) / 2;
    var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
    this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
};

-----------------------改寫用資料區----------------------------*/

