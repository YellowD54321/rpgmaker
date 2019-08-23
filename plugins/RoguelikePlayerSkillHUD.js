function RoguelikePlayerSkillHUD() {
	this.initialize.apply(this, arguments);
};

RoguelikePlayerSkillHUD.prototype = Object.create(Window_Base.prototype);
RoguelikePlayerSkillHUD.prototype.constructor = RoguelikePlayerSkillHUD;

RoguelikePlayerSkillHUD.prototype.initialize = function(x, y) {
	
	var width = 400;
	var height = 400;
	var actor = $gameParty.members().find(o => o._name === $gameActors.actor(1)._name);
	this._CDCoverPicture = [];
	Window_Base.prototype.initialize.call(this, x, y, width, height);
	// this.createSkillCDCoverPicture(actor);
	this.refresh();
};

RoguelikePlayerSkillHUD.prototype.windowWidth = function() {
	return (this.iconWidth() * 4) + (this.skillSpace() * 3) + (this.standardPadding() * 2) + this.skillButtonSpace();
};

RoguelikePlayerSkillHUD.prototype.windowHeight = function() {
	return this.iconHeight() + (this.standardPadding() * 2) + (this.skillButtonSpace() * 2);
};

RoguelikePlayerSkillHUD.prototype.iconWidth = function() {
    return 32;
};

RoguelikePlayerSkillHUD.prototype.iconHeight = function() {
    return 32;
};
RoguelikePlayerSkillHUD.prototype.skillSpace = function() {
    return 15;
};

RoguelikePlayerSkillHUD.prototype.skillButtonSpace = function() {
    return 10;
};

RoguelikePlayerSkillHUD.prototype.refresh = function() {
	this.contents.clear();

	var actor = $gameParty.members().find(o => o._name === $gameActors.actor(1)._name);
	var x = 100;
	var y = 100;
	if ( actor === -1 || actor === undefined || actor === null ) {
		console.log("RoguelikePlayerSkillHUD.refresh function message");
		console.log("actor is undefined.");
	} else {
		if ( RoguelikeCheckDifferenceBetweenPlayerAndHUD() ) {
			RoguelikeInitializePlayerSkillContent();
		};
		this.drawSkillIcons(actor);
		this.drawSkillButton();
	};
};

RoguelikePlayerSkillHUD.prototype.open = function() {
	this.refresh();
	Window_Base.prototype.open.call(this);
};

//Scene_Map
var RoguelikePlayerSkillHUD_mapStart = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
  RoguelikePlayerSkillHUD_mapStart.call(this);
	this._oneSecondCounter = 0;
		
	if ( $gameSystem.playerSkillContent === undefined || $gameSystem.playerSkillContent.some(x => x.timeCounter === undefined) || $gameSystem.playerSkillContent.some(x => x.timeCounter === null) ) {
		RoguelikeInitializePlayerSkillContent();
		// console.log("$gameSystem.playerSkillContent = ");
		// console.log($gameSystem.playerSkillContent);
	};
	this.creatRoguelikePlayerSkillHUD();
};

//產生HUD的背景框架
Scene_Map.prototype.creatRoguelikePlayerSkillHUD = function() {
	this._playerSkillHUD = new RoguelikePlayerSkillHUD();
	this._playerSkillHUD.opacity = 255;
	this._playerSkillHUD.width = this._playerSkillHUD.windowWidth();
	this._playerSkillHUD.height = this._playerSkillHUD.windowHeight();
	this._playerSkillHUD.x = 100;
	this._playerSkillHUD.y = Graphics.height - this._playerSkillHUD.height;
	this.addChild(this._playerSkillHUD);
};

//更新HUD
var RoguelikePlayerSkillHUD_mapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
  RoguelikePlayerSkillHUD_mapUpdate.call(this);
	var that = this;
	
	if ( this._oneSecondCounter++ >= 60 ) {
		if ( RoguelikeCheckDifferenceBetweenPlayerAndHUD() ) {
			RoguelikeInitializePlayerSkillContent();
		};
		this._oneSecondCounter = 0;
	};
	
	this._playerSkillHUD.width = this._playerSkillHUD.windowWidth();
	this._playerSkillHUD.refresh();
	
	this.refreshCD();
};

//初始化技能儲存變數$gameSystem.playerSkillContent
function RoguelikeInitializePlayerSkillContent() {
	var that = this;
	var _cdMark = "Cooldown: ";
	var _originalCD = 99.99;
	var actor = $gameParty.members().find(o => o._name === $gameActors.actor(1)._name);
	
	$gameSystem.playerSkillContent = [];
	if ( actor === -1 || actor === undefined ) {
	} else {
		actor.skills().forEach(function(eachSkill, index) {
			if ( !eachSkill.note.includes(_cdMark) ) {
				_originalCD = 0;
			} else {
				_originalCD = parseFloat(eachSkill.note.split(_cdMark).pop().split("").slice(0, 2).join(""));//讀取技能原始CD時間
			};
			$gameSystem.playerSkillContent[index] = {
				skillId: eachSkill.id,
				iconIndex: eachSkill.iconIndex,
				actorId: RoguelikePlayerSkillIsActorSkill(eachSkill.id),
				type: "",
				originalCD: _originalCD,
				leftCD: 0.0,
				timeCounter: 0.0,
				condition: {
					unused: true,
					using: false,
					cd: false,
				},
			};
		});
		RoguelikePlayerSkillContentSort();
	};
};

function RoguelikePlayerSkillContentSort() {
	var skills = $gameSystem.playerSkillContent;
	var _newSkills = [];
	var mainCharacterActorId = 1;
	var partyMemberActorSort = $gameParty.members().map(x => x._actorId).filter(y => !!y && y != mainCharacterActorId);
	
	skills.forEach(function(eachSkill, skillIndex) {
		for ( actorIndex = 0; actorIndex < partyMemberActorSort.length; actorIndex++ ) {
			if ( eachSkill.actorId != partyMemberActorSort[actorIndex] ) { continue; };
			_newSkills[actorIndex] = Object.assign({}, eachSkill);
		};
	});
	// console.log("_newSkills = ");
	// console.log(_newSkills);
	$gameSystem.playerSkillContent = Object.assign([], _newSkills);
};

function RoguelikePlayerSkillIsActorSkill(skillId) {
	var skill = $dataSkills[skillId];
	var _note = "";
	var _actorIdMark = "ActorId: ";
	var _noteSearcher = /<(?:ActorId.+?)>/g;
	var _actorId = 0;
	
	if ( !skill ) { return false; };
	_note = skill.note;
	if ( !_note || _note === "" ) { return false; };
	
	if ( _note.includes(_actorIdMark) ) {
		for ( i = 0; i < _note.match(_noteSearcher).length; i++) {
			//取得狀態編號
			_actorId = _note.match(_noteSearcher)[i].split(_actorIdMark).pop().split(" ")[0];
			//去尾(去掉後方的括號【>】)
			_actorId = _actorId.split("");
			_actorId.pop();
			//轉為數值
			_actorId = parseInt(_actorId.join(""));
			return _actorId;
		};
	};
	return false;
};
	
Scene_Map.prototype.refreshCD = function() {
	if ( !$gameSystem.playerSkillContent ) { return false; };
	$gameSystem.playerSkillContent.forEach(function(eachSkill, index) {
		if ( eachSkill.condition.cd === true ) {
			eachSkill.timeCounter += 1;
			if ( Math.floor(eachSkill.timeCounter / 6) > eachSkill.originalCD * 10 ) {
				eachSkill.condition.unused = true,
				eachSkill.condition.using = false,
				eachSkill.condition.cd = false;
				eachSkill.timeCounter = 0;
			} else {
				eachSkill.leftCD = eachSkill.originalCD - Math.floor(eachSkill.timeCounter / 6) / 10.0;
			};
		} else {
			eachSkill.timeCounter = 0;
		};
	});
};

function RoguelikeCheckDifferenceBetweenPlayerAndHUD() {
	var mainCharacterActorId = 1;
	var actor = $gameParty.members().find(o => o._name === $gameActors.actor(mainCharacterActorId)._name);
	var actorSkillActorSort = $gameSystem.playerSkillContent.map(x => x.actorId).filter(y => !!y && y != mainCharacterActorId);
	var partyMemberActorSort = $gameParty.members().map(x => x._actorId).filter(y => !!y && y != mainCharacterActorId);
	var _differencePlayerAndHUD = false;
	
	if ( !!actor.skills() && !!$gameSystem.playerSkillContent ) {
		//有新技能的情況
		actor.skills().forEach(function(eachSkill) {
			if ( !$gameSystem.playerSkillContent.some(x => x.skillId === eachSkill.id) ) {
				_differencePlayerAndHUD = true;
			};
		});
		//有舊技能需要移除的情況
		$gameSystem.playerSkillContent.forEach(function(eachSkill) {
			if ( !!actor.skills() && !actor.skills().some(x => x.id === eachSkill.skillId) ) {
				_differencePlayerAndHUD = true;
			};
		});
		//技能順序沒有依照隊伍順序排列的情況
		if ( actorSkillActorSort.toString() !== partyMemberActorSort.toString() ) { 
			_differencePlayerAndHUD = true;
		};
	};
	
	return _differencePlayerAndHUD;
};

//改寫Window_Base.drawActorIcons來自定義角色狀態顯示
RoguelikePlayerSkillHUD.prototype.drawSkillIcons = function(actor, width) {
  width = width || 600;//決定顯示的Icon數量
  var icons = [];
	var dx = 0;
	var dy = 0;
	var basicSkillNumber = 4;
	if ( !$gameSystem.playerSkillContent ) { return false; };
	$gameSystem.playerSkillContent.forEach(function(eachSkill) {
		icons.push(eachSkill.iconIndex);
	});
  for (var i = 0; i < icons.length; i++) {
		dx = i * (this.iconWidth() + this.skillSpace()) + this.skillButtonSpace();
		dy = this.skillButtonSpace() * 2;
		this.drawIcon(icons[i], dx, dy);
		this.drawleftCD(i, dx, dy);
		this.createSkillCDCoverPicture(actor);
		this.adjustSkillCDCoverPicture(i, dx, dy);
  };
	for ( var j = 0; j < (basicSkillNumber - icons.length); j++ ) {
		this.clearSpecificContent(basicSkillNumber - 1 - j);
	};
};

//繪製按鍵提示字樣
RoguelikePlayerSkillHUD.prototype.drawSkillButton = function(actor, width) {
	this.drawText("Q", (this.iconWidth() + this.skillSpace()) * 0, 0, 20, 'right');
	this.drawText("W", (this.iconWidth() + this.skillSpace()) * 1, 0, 20, 'right');
	this.drawText("E", (this.iconWidth() + this.skillSpace()) * 2, 0, 20, 'right');
	this.drawText("R", (this.iconWidth() + this.skillSpace()) * 3, 0, 20, 'right');
};

//繪製剩餘CD時間字樣
RoguelikePlayerSkillHUD.prototype.drawleftCD = function(number, x, y) {
	_leftCD = $gameSystem.playerSkillContent[number].leftCD;
	if ( _leftCD > 0.1 ) {
		this.changeTextColor(this.deathColor());
		this.drawText(Math.ceil(_leftCD).toString(), x + (this.skillButtonSpace() / 2), y, 20, 'center');
		this.changeTextColor(this.normalColor());
	};
};

//產生技能CD時遮蔽用的灰影圖片
RoguelikePlayerSkillHUD.prototype.createSkillCDCoverPicture = function(actor) {
	for (var i = 0; i < actor.skills().length; i++) {
		if ( !!this._CDCoverPicture[i] ) { continue; };
		this._CDCoverPicture[i] = new Sprite();
		this._CDCoverPicture[i].bitmap = ImageManager.loadPicture('SkillCDPicture');
		this._CDCoverPicture[i].x = 0;
		this._CDCoverPicture[i].y = 0;
		this._CDCoverPicture[i].opacity = 0;
		this.addChild( this._CDCoverPicture[i] );
	};
};

//更新技能CD時遮蔽用的灰影圖片
RoguelikePlayerSkillHUD.prototype.adjustSkillCDCoverPicture = function(number, x, y) {
	if ( this._CDCoverPicture[number] === undefined || this._CDCoverPicture[number] === null ) {
	} else {
		this._CDCoverPicture[number].x = x + this.skillSpace() + 3;
		this._CDCoverPicture[number].y = y + this.skillSpace() + 3;
		this._CDCoverPicture[number].opacity = $gameSystem.playerSkillContent[number].condition.cd === true ? 100 : 0;
	};
};

//清除特定技能位置的內容
RoguelikePlayerSkillHUD.prototype.clearSpecificContent = function(number) {
	if ( !this._CDCoverPicture[number] ) { return false; };
	this._CDCoverPicture[number].opacity = 0;
};

//使用技能時依據按下的按鍵與技能對應的actorId來啟動個別角色的公共事件
function RoguelikePlayerSkillUse(_button) {
	var skillNumber = _button === "Q" ? 0 : _button === "W" ? 1 : _button === "E" ? 2 : _button === "R" ? 3 : 0;
	var commonEventId = 0;
	var commonEventIdBasicNumber = 20;
	
	if ( !$gameSystem.playerSkillContent[skillNumber] ) { return false; };
	
	//若有技能using狀態為true，則無法使用所有技能
	if ( $gameSystem.playerSkillContent[skillNumber].condition.unused === true && !$gameSystem.playerSkillContent.some(x => x.condition.using === true) ) {
		$gameSystem.playerSkillContent[skillNumber].condition.unused = false;
		$gameSystem.playerSkillContent[skillNumber].condition.using = true;
		$gameSystem.playerSkillContent[skillNumber].condition.cd = true;
		
		commonEventId = $gameSystem.playerSkillContent[skillNumber].actorId + commonEventIdBasicNumber;
		$gameTemp.reserveCommonEvent(commonEventId);
	};
};

//在技能使用結束後，清除所有技能的using狀態
function RoguelikePlayerSkillUsingFinished() {
	if ( !$gameSystem.playerSkillContent ) { return false; };
	
	for ( i = 0; i < $gameSystem.playerSkillContent.length; i++ ) {
		if ( !$gameSystem.playerSkillContent[i] ) { continue; };
		$gameSystem.playerSkillContent[i].condition.using = false;
	};
};