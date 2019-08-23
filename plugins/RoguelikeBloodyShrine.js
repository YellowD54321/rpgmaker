function RoguelikeSacrificedMemberEquipListInitialize() {
	$gameSystem.sacrificedMemberEquipList = [];
};

//-----------------------------------------------------------------------------
//修改Window_Options來製作
//-----------------------------------------------------------------------------

function Window_ChoosePartyMemberInShrine() {
    this.initialize.apply(this, arguments);
}

Window_ChoosePartyMemberInShrine.prototype = Object.create(Window_HorzCommand.prototype);
Window_ChoosePartyMemberInShrine.prototype.constructor = Window_ChoosePartyMemberInShrine;

Window_ChoosePartyMemberInShrine.prototype.initialize = function() {
    Window_HorzCommand.prototype.initialize.call(this, 0, 0);
    this.updatePlacement();
};

Window_ChoosePartyMemberInShrine.prototype.windowWidth = function() {
    return this.partyMember().length * (this.faceDW() + this.actorSpace()) + this.standardPadding() * 2;
};

Window_ChoosePartyMemberInShrine.prototype.windowHeight = function() {
    return this.faceDH() + this.standardPadding() * 2;
};

Window_ChoosePartyMemberInShrine.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = (Graphics.boxHeight - this.height) / 2;
};

Window_ChoosePartyMemberInShrine.prototype.maxCols = function() {
    return 6;
};

Window_ChoosePartyMemberInShrine.prototype.faceHeight = function() {
    return 144;
};

Window_ChoosePartyMemberInShrine.prototype.faceWidth = function() {
    return 144;
};

Window_ChoosePartyMemberInShrine.prototype.faceDW = function() {
    return 64;
};

Window_ChoosePartyMemberInShrine.prototype.faceDH = function() {
    return 64;
};

Window_ChoosePartyMemberInShrine.prototype.actorSpace = function() {
    return this.spacing();
};

Window_ChoosePartyMemberInShrine.prototype.partyMember = function() {
		this._partyMember = $gameParty.members().filter(x => !!x && x._actorId != 1);
    return this._partyMember;
};

Window_ChoosePartyMemberInShrine.prototype.makeCommandList = function() {
    this.addPartyMemberList();
};

Window_ChoosePartyMemberInShrine.prototype.addPartyMemberList = function() {
	var partyMember = this.partyMember();
	if ( !partyMember ) { return false; };
	for ( i = 0; i < partyMember.length; i++ ) {
		this.addCommand( i+1 + "號隊友", 'chooseMember');
	};
};

Window_ChoosePartyMemberInShrine.prototype.drawItem = function(index) {
    var rect = this.itemRect(index);
    var titleWidth = this.faceDW();
		var faceWidth = this.faceWidth();
		var faceHeight = this.faceHeight();
		var faceDH = this.faceDH();
		var faceDW = this.faceDW();
		var actor = this._partyMember[index];//$gameParty.members()[actorIndex - 1];
		var actorSpace = this.actorSpace();
		var x = ((faceDW + actorSpace) * (index));
		var y = 0;
		
    this.changePaintOpacity(this.isCommandEnabled(index));
		this.drawActorFace(actor, x, y, faceWidth, faceHeight);
};

Window_ChoosePartyMemberInShrine.prototype.itemRect = function(index) {
    var rect = new Rectangle();
    var maxCols = this.maxCols();
    rect.width = this.faceDW();
    rect.height = this.faceDH();
    rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
    rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
    return rect;
};

Window_ChoosePartyMemberInShrine.prototype.itemRectForText = function(index) {
    var rect = this.itemRect(index);
    rect.x += this.textPadding();
    rect.width -= this.textPadding() * 2;
    return rect;
};

//改寫Window_Base.drawActorFace來畫出角色頭像
Window_ChoosePartyMemberInShrine.prototype.drawActorFace = function(actor, x, y, width, height) {
	var dw = this.faceDW();
	var dh = this.faceDH();
	this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height, dw, dh);
};

Window_ChoosePartyMemberInShrine.prototype.drawFace = function(faceName, faceIndex, x, y, width, height, dw, dh) {
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

//-----------------------------------------------------------------------------
// 更改Scene_Options來製作
//
// The scene class of the options screen.

function Scene_ChoosePartyMemberInShrine() {
    this.initialize.apply(this, arguments);
}

Scene_ChoosePartyMemberInShrine.prototype = Object.create(Scene_MenuBase.prototype);
Scene_ChoosePartyMemberInShrine.prototype.constructor = Scene_ChoosePartyMemberInShrine;

Scene_ChoosePartyMemberInShrine.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_ChoosePartyMemberInShrine.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createChoosePartyMemberInShrineWindow();
};

Scene_ChoosePartyMemberInShrine.prototype.createChoosePartyMemberInShrineWindow = function() {
    this._shrineWindow = new Window_ChoosePartyMemberInShrine();
    this._shrineWindow.setHandler('chooseMember',    this.commandSelected.bind(this));
    this._shrineWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._shrineWindow);
};

Scene_ChoosePartyMemberInShrine.prototype.commandSelected = function() {
	var actor = this._shrineWindow._partyMember[this._shrineWindow._index];
	var actorEvent = {};
	// console.log("this._partyMember[this._shrineWindow._index] = ");
	// console.log(this._shrineWindow._partyMember[this._shrineWindow._index]);
	if ( !!actor && !$gameSystem.sacrificedMemberEquipList.some(x => x.actorId === actor._actorId ) ) {
		$gameSystem.sacrificedMemberEquipList.push({
			actorId: actor._actorId,
			classId: actor._classId,
			equips: Object.assign([], actor._equips),
		});
	};
	console.log("$gameSystem.sacrificedMemberEquipList = ");
	console.log($gameSystem.sacrificedMemberEquipList);
	actorEvent = RoguelikeSacrificedMemberEventSetPosition(actor);
	RoguelikeSacrificedMemberJoinEnemyInformation(actor, actorEvent);
	$gameParty.removeActor(actor._actorId);
	this.popScene();
};

//設定祭壇犧牲者的事件位置
function RoguelikeSacrificedMemberEventSetPosition(actor) {
	var memberEvent = $gameSystem.bloddyShrineCharacterEvent.find(x => x.name === actor._name);
	var followerInformation = $gamePlayer.followers().follower($gameParty.members().findIndex(x => x._actorId === actor._actorId)-1);
	$gameMap.event(memberEvent.eventId()).setPosition(followerInformation.x, followerInformation.y);
	$gameMap.event(memberEvent.eventId()).setDirection(followerInformation.direction());
	$gameMap.events()[memberEvent.eventId()-1]._opacity = 255;
	return memberEvent;
};

//將祭壇犧牲者加進敵方角色名單中
function RoguelikeSacrificedMemberJoinEnemyInformation(actor, actorEvent) {
	var _enemyInformation = {};
	var _condition = [];
	var characterLV = actor.level;
	var equipList = $gameSystem.sacrificedMemberEquipList
									.find(x => !!x && x.actorId === actor._actorId)
									.equips.filter(y => !!y && y._itemId != 0);
	var item = {};
	
	_enemyInformation = {
		race: actor._name,
		enemyId: $dataEnemies.findIndex(x => !!x && x.name === actor._name),
		enemyIndex: $gameSystem.EnemyInformation.length,
		mhp: $dataClasses[actor._actorId].params[0][characterLV],
		hp: $dataClasses[actor._actorId].params[0][characterLV],
		atk: $dataClasses[actor._actorId].params[2][characterLV],
		def: $dataClasses[actor._actorId].params[3][characterLV],
		agi: $dataClasses[actor._actorId].params[6][characterLV],
		regionId: $gameSystem.currentRegion,
		faction: "enemy",
		eventId: actorEvent.eventId(),
		enemySpawnedPosition: {
			x: actorEvent.x,
			y: actorEvent.y,
			checkRepeat: true,
		},
		condition: [{
			conditionId: 0,
			conditionStyle: "",
			timeOrTurn: "",
			effectTime: 0,
			effectTimeLeft: 0,
			effectTimeCounter: 0,
			effectTimeCounting: false,
			effectTurn: 0,
			effectTurnLeft: 0,
			level: 0,
		}],
		death: false,
		level: characterLV,
	};
	$gameSystem.EnemyInformation.push(_enemyInformation);
	//附加裝備屬性的狀態
	if ( !equipList || equipList.length <= 0 ) { return false; };
	for ( i = 0; i < equipList.length; i++ ) {
		item = equipList[i]._dataClass === "weapon" ? $gameSystem.roguelikeWeapons[equipList[i]._itemId] : 
						equipList[i]._dataClass === "armor" ? $gameSystem.roguelikeArmors[equipList[i]._itemId] : 
						null;
		if ( !item ) { continue; };
		RoguelikeBloodyEquipmentNoteEffect(item, $gameSystem.EnemyInformation[$gameSystem.EnemyInformation.length-1]);
	};
};