//判斷攻擊角色面朝方向與跳躍位置
function RoguelikeAttackDirectionAndPosition(_attackerEventId) {
	var _attackEvent = $gameMap.event(_attackerEventId);
	var _targetEvent = $gameSystem.roguelikeBattleTarget[0];
	var _targetX = 0;
	var _targetY = 0;
	var _direction = 8;
	var _moverOriginalX = _attackEvent.x;
	var _moverOriginalY = _attackEvent.y;
	$gameSystem.characterBattleMoveValue = {
		targetX: 0,
		targetY: 0,
		direction: 8,
		moverOriginalX: _moverOriginalX,
		moverOriginalY: _moverOriginalY,
	};
	_direction = 
		(_attackEvent.x === _targetEvent.x && _attackEvent.y >= _targetEvent.y) ? 8 : 
		(_attackEvent.x === _targetEvent.x && _attackEvent.y <= _targetEvent.y) ? 2 : 
		(_attackEvent.x >= _targetEvent.x && _attackEvent.y === _targetEvent.y) ? 4 : 
		(_attackEvent.x <= _targetEvent.x && _attackEvent.y === _targetEvent.y) ? 6 : 
		(Math.abs(_attackEvent.x - _targetEvent.x) >= Math.abs(_attackEvent.y - _targetEvent.y)) ? 
			(_attackEvent.x >= _targetEvent.x) ? 4 : 6 : 
		(Math.abs(_attackEvent.x - _targetEvent.x) <= Math.abs(_attackEvent.y - _targetEvent.y)) ? 
			(_attackEvent.y >= _targetEvent.y) ? 8 : 2 : 
		8;
	_targetX = ( Math.abs(5 - _direction) === 1 ) ? ( _targetEvent.x - (_direction - 5) ) : ( _targetEvent.x + 0 );
	_targetY = _targetEvent.y + Math.trunc( (_direction - 5) / 3 );
	$gameSystem.characterBattleMoveValue = {
		targetX: _targetX,
		targetY: _targetY,
		direction: _direction,
		moverOriginalX: _moverOriginalX,
		moverOriginalY: _moverOriginalY,
	};
};
	
//顯示攻擊範圍
function RoguelikeAttackRangeShow(_attackerEventId) {
	var _raceOrName = "";
	var _spellTargetNumber = 0;
	var _spellerAimEventId = 0;
	var _meleeMark = "melee";
	var _singelSpellMark = "singleSpell";
	var _mutipleSpellMark = "mutipleSpell";
	var _attackStyle = "";
	var _targetEventNumber = 1;
	var _targetFaction = $gameSystem.battleMembersPriority.find(x => x.eventId === _attackerEventId).faction === "player" ? "enemy" : "player";
	_raceOrName = RoguelikeBattleActorTransferRaceOrName(_attackerEventId);
	_attackStyle = RoguelikeAttackStyle(_raceOrName);
	
	_targetEventNumber = _attackStyle[1];
	if ( _targetEventNumber === 999 ) {
		_targetEventNumber = $gameSystem.battleMembersPriority.filter(x => x.faction === _targetFaction && x.death === false).length;
	};
	
	for ( i = 0; i < _targetEventNumber; i++ ) {
		_spellTargetNumber = $gameSystem.spellTargetEvent.findIndex(x => x.called === false);
		_spellerAimEventId = _spellTargetNumber > 0 ? $gameSystem.spellTargetEvent[_spellTargetNumber].eventId : $gameSystem.spellTargetEvent[0].eventId;//讀取尚未被使用的【替身-法術定位專用】的事件編號
		$gameSystem.spellTargetEvent[_spellTargetNumber].called = true;
		if ( _attackStyle[0] != _meleeMark ) {
			//設置施法定位事件
			$gameMap.event(_spellerAimEventId).setPosition(
				$gameSystem.characterBattleMoveValue.targetX, 
				$gameSystem.characterBattleMoveValue.targetY
			);
			$gameMap.event(_spellerAimEventId).setDirection(
				$gameSystem.characterBattleMoveValue.direction
			);
		};
		$gameSystem.roguelikeAttackRangeStore.push({
			eventId: (_attackStyle[0] === _meleeMark) ?	_attackerEventId : _spellerAimEventId,
			raceOrName: _raceOrName,
			pictureContent: undefined,
		});
	};
};

//清除攻擊範圍
function RoguelikeAttackRangeClear(_attackerEventId) {
	var _index = -1;
	$gameSystem.roguelikeAttackRangeStore = [];
	
	for ( i = 0; i < $gameSystem.spellTargetEvent.length; i++ ) {
		$gameSystem.spellTargetEvent[i].called = false;
	};
};

var RoguelikeAttackRange_mapStart = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
	RoguelikeAttackRange_mapStart.call(this);
	this.pixel = 48;
	this.attackRangeAttackedMark = "O";
	this.attackRangeActorMark = "X";
	this.attackRangeNullMark = "-";
	this.attackRangeRowNumber = 5;
	$gameSystem.roguelikeAttackRangeStore = ($gameSystem.roguelikeAttackRangeStore === undefined) ? [] : $gameSystem.roguelikeAttackRangeStore;
	this.allAttackRangePicture = (this.allAttackRangePicture === undefined) ? [] : this.allAttackRangePicture;

};

var RoguelikeAttackRange_mapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	RoguelikeAttackRange_mapUpdate.call(this);
	this.roguelikeAttackRangePictureCreate();
	this.roguelikeAttackRangePictureRefresh();
};
	
Scene_Map.prototype.roguelikeAttackRangePictureCreate = function() {
	if ($gameSystem.roguelikeAttackRangeStore.length === 0 || 
			$gameSystem.roguelikeAttackRangeStore.every(x => x.pictureContent != undefined) ) { return false; };
	var attackerIndex = $gameSystem.roguelikeAttackRangeStore.findIndex(x => x.pictureContent === undefined);
	if (attackerIndex === -1) { return false; };

	var _raceOrName = $gameSystem.roguelikeAttackRangeStore[attackerIndex].raceOrName;	
	var _eventId = $gameSystem.roguelikeAttackRangeStore[attackerIndex].eventId;
	var dx = $gameMap.event(_eventId).screenX() - this.pixel / 2;
	var dy = $gameMap.event(_eventId).screenY() - this.pixel * 2;
	var _attackRange = RoguelikeAttackRangeGetRange(_raceOrName);
	var _pictureNumber = _attackRange.split("").filter(o => o === this.attackRangeAttackedMark).length;
	this.allAttackRangePicture[attackerIndex] = {
		picture: [],
		originalRange: "",
		pictureNumber: 0,
		eventId: 0,
	};
	
	for ( i = 0; i < _pictureNumber; i++ ) {
		var attackRangePicture = new Sprite();
		attackRangePicture.bitmap = ImageManager.loadPicture('AttackRange');
		attackRangePicture.x = dx;
		attackRangePicture.y = dy;
		this.addChild( attackRangePicture );
		attackRangePicture.opacity = 150;
		this.allAttackRangePicture[attackerIndex].picture.push(attackRangePicture);
	};
	this.allAttackRangePicture[attackerIndex].originalRange = _attackRange;
	this.allAttackRangePicture[attackerIndex].pictureNumber = _pictureNumber;
	this.allAttackRangePicture[attackerIndex].eventId = _eventId;
	$gameSystem.roguelikeAttackRangeStore[attackerIndex].pictureContent = Object.assign([], this.allAttackRangePicture[attackerIndex].picture);
};

Scene_Map.prototype.roguelikeAttackRangePictureRefresh = function() {
	var that = this;
	var _eventId = 0;
	var _originalRange = "";
	var _originalRangeArray = [];
	var _transformedRange = "";
	var _pictureNumber = 0;
	var _lastPictureIndex = -1;
	var _pictureX = 0;
	var _pictureY = 0;
	var _actorX = 0;
	var _actorY = 0;
	var _direction = 8;
	var _attackedMark = this.attackRangeAttackedMark;
	var _actorMark = this.attackRangeActorMark;
	var _rowNumber = this.attackRangeRowNumber;
	
	if ( this.allAttackRangePicture.length > 0 ) {
		this.allAttackRangePicture.forEach(function(eachAttacker, attackerIndex) {
			if ( eachAttacker.picture.length > 0 ) {
				_eventId = eachAttacker.eventId;
				_lastPictureIndex = -1;
				if ( $gameSystem.roguelikeAttackRangeStore.findIndex(o => o.eventId === _eventId) >= 0 ) {
					if ( _eventId > 0 ) {
						_originalRange = eachAttacker.originalRange;
						_direction = $gameSystem.characterBattleMoveValue.direction;
						_transformedRange = RoguelikeAttackRangeDirectionTransform(_rowNumber, _originalRange, _direction);
						_originalRangeArray = _transformedRange.split("");
						_pictureNumber = eachAttacker.pictureNumber;
						_actorX = _originalRangeArray.indexOf(_actorMark) % _rowNumber;
						_actorY = Math.floor(_originalRangeArray.indexOf(_actorMark) / _rowNumber);
						eachAttacker.picture.forEach(function(eachPicture, pictureIndex) {
							_pictureX = _originalRangeArray.indexOf(_attackedMark, _lastPictureIndex+1) % _rowNumber;
							_pictureY = Math.floor(_originalRangeArray.indexOf(_attackedMark, _lastPictureIndex+1) / _rowNumber);
							eachPicture.x = $gameMap.event(_eventId).screenX() - (that.pixel / 2) + ((_pictureX - _actorX) * that.pixel);
							eachPicture.y = $gameMap.event(_eventId).screenY() - that.pixel + ((_pictureY - _actorY) * that.pixel);
							eachPicture.opacity = 150;
							_lastPictureIndex = _originalRangeArray.indexOf(_attackedMark, _lastPictureIndex+1);
						});
					};
				} else {
					eachAttacker.picture.forEach(function(eachPicture, pictureIndex) {
						eachPicture.opacity = 0;
						// that.allAttackRangePicture.splice(pictureIndex, 1);
						that.allAttackRangePicture = [];
					});
				};
			};
		});
	};
};

function RoguelikeAttackRangeGetRange(raceOrName) {
	var _raceOrName = raceOrName;
	var _attackRange = "";
	
	switch (_raceOrName) {
		//-------------------------↓↓↓友方↓↓↓------------------------------
		//刺客
		case ($gameActors.actor(2)._name):
			_attackRange =
			"-----"+
			"--O--"+
			"--X--"+
			"-----"+
			"-----";
		break;
		//寒冰法師
		case ($gameActors.actor(3)._name):
			_attackRange =
			"-----"+
			"--O--"+
			"--X--"+
			"-----"+
			"-----";
		break;
		//護盾騎士
		case ($gameActors.actor(4)._name):
			_attackRange =
			"--O--"+
			"-OOO-"+
			"--X--"+
			"-----"+
			"-----";
		break;
		//膽小鬼
		case ($gameActors.actor(5)._name):
			_attackRange =
			"-----"+
			"--O--"+
			"--X--"+
			"-----"+
			"-----";
		break;
		//火焰法師
		case ($gameActors.actor(7)._name):
			_attackRange =
			"-OOO-"+
			"-OOO-"+
			"-OOO-"+
			"--X--"+
			"-----";
		break;
		//弒神者
		case ($gameActors.actor(11)._name):
			_attackRange =
			"-----"+
			"--O--"+
			"--X--"+
			"-----"+
			"-----";
		break;
		//-------------------------↑↑↑友方↑↑↑------------------------------
		//-------------------------↓↓↓敵方↓↓↓------------------------------
		//BlueBat
		case ($dataEnemies[1].name):
			_attackRange = 
			"-----"+
			"--O--"+
			"--X--"+
			"-----"+
			"-----";
		break;
		//BlueSlime
		case $dataEnemies[2].name:
			_attackRange = 
			"-----"+
			"-----"+
			"--O--"+
			"--X--"+
			"-----";
		break;
		//Pigman
		case $dataEnemies[3].name:
			_attackRange = 
			"-----"+
			"-----"+
			"-OOO-"+
			"--X--"+
			"-----";
		break;
		//DevilGhost
		case $dataEnemies[4].name:
			_attackRange = 
			"--O--"+
			"--O--"+
			"--O--"+
			"--X--"+
			"-----";
		break;
		//DragonLady
		case $dataEnemies[5].name:
			_attackRange = 
			"OOOOO"+
			"-OOO-"+
			"--O--"+
			"--X--"+
			"-----";
		break;
		//-------------------------↑↑↑敵方↑↑↑------------------------------
		default:
			_attackRange = 
			"-----"+
			"--O--"+
			"--X--"+
			"-----"+
			"-----";
		break;
	};
	return _attackRange;
};

function RoguelikeAttackStyle(raceOrName) {
	var _raceOrName = raceOrName;
	var _attackStyle = "";
	var _melee = "melee";
	var _singleSpell = "singleSpell";
	var _mutipleSpell = "mutipleSpell";
	var _targetNumber = 1;
	
	switch (_raceOrName) {
		//寒冰法師
		case ($gameActors.actor(3)._name):
			_attackStyle = _singleSpell;
		break;
		//膽小鬼
		case ($gameActors.actor(5)._name):
			_attackStyle = _singleSpell;
		break;
		//火焰法師
		case ($gameActors.actor(7)._name):
			_attackStyle = _singleSpell;
		break;
		//瘋狂科學家
		case ($gameActors.actor(9)._name):
			_attackStyle = _mutipleSpell;
			_targetNumber = 999;
		break;
		default:
			_attackStyle = _melee;
		break;
	};
	return [_attackStyle, _targetNumber];
};

function RoguelikeAttackRangeDirectionTransform(_row, _originalRange, _direction) {
	var originalRange = _originalRange;
	var row = _row;
	var column = Math.ceil(originalRange.length / row);
	var direction = _direction;
	var rangeAfterTransform = [];
	
	originalRange = originalRange.split("");
	
	switch (direction) {
		case 8:
			rangeAfterTransform = Object.assign([], originalRange);
			rangeAfterTransform = rangeAfterTransform.join("");
		break;
		case 2:
			rangeAfterTransform = Object.assign([], originalRange);
			rangeAfterTransform = rangeAfterTransform.reverse().join("");
		break;
		case 4:
			for ( var rowCounter = 1; rowCounter <= row; rowCounter++ ) {
				for ( var columnCounter = 1; columnCounter <= column; columnCounter++ ) {
					rangeAfterTransform.push( originalRange[(column - rowCounter) + ((columnCounter-1) * row)-1] );
				};
			};
			rangeAfterTransform = rangeAfterTransform.join("");
		break;
		case 6:
			for ( var rowCounter = 1; rowCounter <= row; rowCounter++ ) {
				for ( var columnCounter = 1; columnCounter <= column; columnCounter++ ) {
					rangeAfterTransform.push( originalRange[row * (column - (columnCounter-1)) - (row - rowCounter)-1] );
				};
			};
			rangeAfterTransform = rangeAfterTransform.join("");
		break;
		default:
			rangeAfterTransform = Object.assign([], originalRange);
			rangeAfterTransform = rangeAfterTransform.join("");
		break;
	};
	return rangeAfterTransform;
};