/*

*/

//Scene_Map
var RoguelikeEnemy_mapStart = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
  RoguelikeEnemy_mapStart.call(this);
	
	// RoguelikeEnemyInitialize();
	// console.log($gameSystem.EnemyInformation);
	
	if ($gameSystem.EnemyInformation != undefined && $gameSystem.EnemyInformation.some(x => x.death === false)) {	//避免地圖中沒有敵方角色出現錯誤
		this.creatRoguelikeEnemyStateHUD();
	};
};

//儲存當前地圖所有怪物事件初始值
function RoguelikeEnemyInitialize() {
	
	$gameSystem.EnemyEventInformation = [];
	$gameMap.events().forEach(function(eachEvent) {
		_eventId = eachEvent.eventId();
		// $gameSystem.EnemyEventInformation[_eventId] = {};
		if ($dataMap.events[_eventId].meta.IsEnemy) {
			for (_enemyNumber = 1; _enemyNumber < $dataEnemies.length; _enemyNumber++) {
				_enemyName = $dataEnemies[_enemyNumber].name;
				if (_enemyName != "" && $dataMap.events[_eventId].note.includes(_enemyName)) {
					$gameSystem.EnemyEventInformation.push({
						name: $dataMap.events[_eventId].name,
						race: $dataEnemies[_enemyNumber].name,
						eventId: _eventId,
					});
				};
			};
		};
	});
	console.log($gameSystem.EnemyEventInformation);
};


function RoguelikeEnemyStateHUD() {
	this.initialize.apply(this, arguments);
};

RoguelikeEnemyStateHUD.prototype = Object.create(Window_Base.prototype);
RoguelikeEnemyStateHUD.prototype.constructor = RoguelikeEnemyStateHUD;

RoguelikeEnemyStateHUD.prototype.initialize = function(x, y) {
	
	var width = 100;
	var height = 600;
	Window_Base.prototype.initialize.call(this, x, y, width, height);
	this.setCurrentEnemyIndex(0);
	this._windowHeight = height;
	this.refresh();
	
};

RoguelikeEnemyStateHUD.prototype.windowWidth = function() {
	return 100;
};

RoguelikeEnemyStateHUD.prototype.windowHeight = function() {
	return this._windowHeight;	
};

RoguelikeEnemyStateHUD.prototype.setWindowHeight = function(height) {
	this._windowHeight = height;
};

RoguelikeEnemyStateHUD.prototype.iconWidth = function() {
    return 32;
};

RoguelikeEnemyStateHUD.prototype.iconHeight = function() {
    return 32;
};

RoguelikeEnemyStateHUD.prototype.hpHeight = function() {
    return 12;
};

RoguelikeEnemyStateHUD.prototype.hpWidth = function() {
    return 64;
};

RoguelikeEnemyStateHUD.prototype.currentRegion = function() {
    return $gameSystem.currentRegion;
};

RoguelikeEnemyStateHUD.prototype.getCurrentEnemyIndex = function() {
    return this.currentEnemyIndex;
};

RoguelikeEnemyStateHUD.prototype.setCurrentEnemyIndex = function(enemyIndex) {
    this.currentEnemyIndex = enemyIndex;
};

RoguelikeEnemyStateHUD.prototype.hpSpace = function() {
    return 3;
};

RoguelikeEnemyStateHUD.prototype.refresh = function() {
	this.contents.clear();
	
	//使用Window_Base裡面原有的函數來調整顏色
	var HpColor1 = this.hpGaugeColor1();
	var HpColor2 = this.hpGaugeColor2();
	var hpHeight = this.hpHeight();
	var windowHeight = this.windowHeight();
	var enemyIndex = this.currentEnemyIndex;
	// var _enemyInCurrentRegion = $gameSystem.EnemyInformation.filter(x => x.regionId === _currentRegion);
	var enemy = $gameSystem.EnemyInformation[enemyIndex];
	var iconTotalHeight = 0;
	var x = 0;
	var y = 0;
	const that = this;

	if (enemy === {} || enemy === undefined) {
		// console.log("Function RoguelikeEnemyStateHUD error");
		// console.log("enemyIndex = " + enemyIndex);
		// console.log("enemy is empty.");
	} else {
		iconTotalHeight = this.iconHeight() * Math.round(enemy.condition.length / 2);
		y = iconTotalHeight;
		this.drawEnemyHp(enemyIndex, x, y, HpColor1, HpColor2);
		this.drawEnemyIcons(enemy, 0, 0);
	};
};

RoguelikeEnemyStateHUD.prototype.open = function() {
	this.refresh();
	Window_Base.prototype.open.call(this);
};

//產生HUD的背景框架
Scene_Map.prototype.creatRoguelikeEnemyStateHUD = function() {
	
	var windowX = 0;
	var windowY = 0;
	var _currentRegion = $gameSystem.currentRegion;
	// var _enemyInCurrentRegion = $gameSystem.EnemyInformation.filter(x => x.regionId === _currentRegion);
	const _pixel = 48;
	const that = this;
	this._enemyStateHUD = [];
	$gameSystem.EnemyInformation.forEach(function(eachEnemy, enemyIndex) {
		if (Object.keys(eachEnemy).length === 0) {
			// console.log("Function creatRoguelikeEnemyStateHUD error");
			// console.log("enemyIndex = " + enemyIndex);
			// console.log("eachEnemy is empty.");
		} else {
			if ( eachEnemy.regionId === _currentRegion && (eachEnemy.eventId) > 0 ) {
				windowX = $gameMap.event(eachEnemy.eventId).screenX() - (_pixel / 2);
				windowY = $gameMap.event(eachEnemy.eventId).screenY() - _pixel;
				that._enemyStateHUD[enemyIndex] = new RoguelikeEnemyStateHUD();
				that._enemyStateHUD[enemyIndex].setCurrentEnemyIndex(enemyIndex);
				that._enemyStateHUD[enemyIndex].x = windowX - (that._enemyStateHUD[enemyIndex].windowWidth() - _pixel) / 2;
				that._enemyStateHUD[enemyIndex].y = windowY - that._enemyStateHUD[enemyIndex].windowHeight() + that._enemyStateHUD[enemyIndex].standardPadding();
				that._enemyStateHUD[enemyIndex].opacity = 0;
				that._enemyStateHUD[enemyIndex].width = that._enemyStateHUD[enemyIndex].windowWidth();
				that._enemyStateHUD[enemyIndex].height = that._enemyStateHUD[enemyIndex].windowHeight();
				that.addChild(that._enemyStateHUD[enemyIndex]);
			};
		};
	});
};

var RoguelikeEnemyState_mapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
  RoguelikeEnemyState_mapUpdate.call(this);
	var windowX = 0;
	var windowY = 0;
	const _pixel = 48;
	const that = this;
	
	if (this._enemyStateHUD === undefined) {
		// console.log("Function RoguelikeEnemyState_mapUpdate error");
		// console.log("this._enemyStateHUD is undefined.");
	} else {
		// console.log("this._enemyStateHUD.length = ");
		// console.log(this._enemyStateHUD.length);
		this._enemyStateHUD.forEach(function(eachEnemy, enemyIndex) {
			if (Object.keys(eachEnemy).length === 0) {
				// console.log("Function RoguelikeEnemyState_mapUpdate error");
				// console.log("enemyIndex = " + enemyIndex);
				// console.log("eachEnemy is empty.");
			} else {
				if ( $gameSystem.EnemyInformation[enemyIndex].eventId <= 0 ) {
					// console.log("Function RoguelikeEnemyState_mapUpdate error");
					// console.log("$gameSystem.EnemyInformation[enemyIndex].eventId = " + $gameSystem.EnemyInformation[enemyIndex].eventId);
					// console.log("$gameSystem.EnemyInformation[enemyIndex] = ");
					// console.log($gameSystem.EnemyInformation[enemyIndex]);
				} else {
					windowX = $gameMap.event($gameSystem.EnemyInformation[enemyIndex].eventId).screenX() - (_pixel / 2);
					windowY = $gameMap.event($gameSystem.EnemyInformation[enemyIndex].eventId).screenY() - _pixel;
					that._enemyStateHUD[enemyIndex].setCurrentEnemyIndex(enemyIndex);
					that._enemyStateHUD[enemyIndex].x = windowX - (that._enemyStateHUD[enemyIndex].windowWidth() - _pixel) / 2;
					that._enemyStateHUD[enemyIndex].y = windowY - that._enemyStateHUD[enemyIndex].windowHeight() + that._enemyStateHUD[enemyIndex].standardPadding();
					that._enemyStateHUD[enemyIndex].setWindowHeight(that._enemyStateHUD[enemyIndex].hpHeight() + that._enemyStateHUD[enemyIndex].hpSpace() + (that._enemyStateHUD[enemyIndex].standardPadding() * 2) + (that._enemyStateHUD[enemyIndex].iconHeight() * Math.round($gameSystem.EnemyInformation[enemyIndex].condition.length / 2)));
					that._enemyStateHUD[enemyIndex].height = that._enemyStateHUD[enemyIndex].windowHeight();
					if ($gameSystem.EnemyInformation[enemyIndex].death === true) {
						that._enemyStateHUD[enemyIndex].opacity = 0;
						that._enemyStateHUD[enemyIndex].contents.clear();
					} else {
						that._enemyStateHUD[enemyIndex].opacity = 0;
						that._enemyStateHUD[enemyIndex].refresh();
					};
				};
			};
		});
	};
};

//改寫Window_Base.drawEnemyHp來自定義角色HP顯示
RoguelikeEnemyStateHUD.prototype.drawEnemyHp = function(enemyIndex, gx, gy, HpColor1, HpColor2) {
	var width = this.windowWidth() - this.standardPadding() * 2;
	this.drawGauge(gx, gy, width, $gameSystem.EnemyInformation[enemyIndex].hp / $gameSystem.EnemyInformation[enemyIndex].mhp, HpColor1, HpColor2);
	//血量數值
	//200是width
	// this.drawCurrentAndMax($gameActors._data[actorId].hp, $gameActors._data[actorId].mhp, x, y, 200,
                         // this.normalColor(), this.normalColor());
};

RoguelikeEnemyStateHUD.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
    var fillW = Math.floor(width * rate);
    var gaugeY = y + this.hpSpace();
    this.contents.fillRect(x, gaugeY, width, this.hpHeight(), this.gaugeBackColor());
    this.contents.gradientFillRect(x, gaugeY, fillW, this.hpHeight(), color1, color2);
};

//改寫Window_Base.drawActorIcons來自定義敵方角色狀態顯示
RoguelikeEnemyStateHUD.prototype.drawEnemyIcons = function(enemy, x, y, width) {
  width = width || 600;//決定顯示的Icon數量
	var allCondition = enemy.condition;
	// var allCondition = typeof $gameSystem.partyMemberConditionContent === "object" ? $gameSystem.partyMemberConditionContent.find(o => o.actorId === actor._actorId) : [];
	var row = 0;//x
	var column = 0;//y
	var dx = 0;
	var dy = 0;
	var iconIndex = 0;
	var iconTotalHeight = 0;
	var _nondisplayMark = "nondisplay";
	iconTotalHeight = this.iconHeight() * Math.round(allCondition.length / 2);
	y = iconTotalHeight;
	if ( allCondition === undefined || allCondition.length <= 0 ) { return false; };
	allCondition = allCondition.filter( o => o.conditionId > 0 ); 
	allCondition = allCondition.filter( o => !$dataStates[o.conditionId].note.includes(_nondisplayMark));
	if ( allCondition === undefined || allCondition.length <= 0 ) { return false; };
	for (var i = 0; i < allCondition.length; i++) {
		row = Math.floor(i%2);
		column = Math.floor(i/2);
		dx = x + (row * this.iconWidth());
		dy = y - (column * this.iconHeight()) - this.iconHeight();
		iconIndex = $dataStates[allCondition[i].conditionId].iconIndex;
		this.drawIcon(iconIndex, dx, dy);
		this.drawConditionLeftTime(allCondition[i], dx, dy);
	};
};

RoguelikeEnemyStateHUD.prototype.drawConditionLeftTime = function(conditionInformation, x, y) {
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

Window_Base.prototype.drawEnemyHp = function(actor, x, y, width) {
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

-----------------------改寫用資料區----------------------------*/

