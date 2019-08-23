//戰鬥開始前，友方事件就定位
function RoguelikeBattleEventSetPosition() {
	var memberEvent = {};
	var followerInformation = {};
	$gameParty.members().forEach(function(eachMember, memberIndex) {
		if ( $gameSystem.partyCharacterEvent.some(x => x.name === eachMember._name) ) {
			followerInformation = $gamePlayer.followers().follower(memberIndex-1);
			memberEvent = $gameSystem.partyCharacterEvent.find(x => x.name === eachMember._name);
			$gameMap.event(memberEvent.eventId()).setPosition(followerInformation.x, followerInformation.y);
			$gameMap.event(memberEvent.eventId()).setDirection(followerInformation.direction());
			$gameMap.event(memberEvent.eventId()).setThrough(false);
			$gameMap.event(memberEvent.eventId()).setDirectionFix(true);
			$gameMap.events()[memberEvent.eventId()-1]._opacity = 255;
			$gameSelfSwitches.setValue([$gameMap._mapId, memberEvent.eventId(), 'A'], false);
			$gameSelfSwitches.setValue([$gameMap._mapId, memberEvent.eventId(), 'B'], false);
			$gameSelfSwitches.setValue([$gameMap._mapId, memberEvent.eventId(), 'C'], false);
			$gameSelfSwitches.setValue([$gameMap._mapId, memberEvent.eventId(), 'D'], false);
		};
	});
};

//戰鬥結束後，友方追隨者就定位、友方事件丟到畫面外與透明化
function RoguelikeBattleFollowerSetPosition() {
	var memberEvent = {};
	var followerInformation = {};
	$gameParty.members().forEach(function(eachMember, memberIndex) {
		if ( $gameSystem.partyCharacterEvent.some(x => x.name === eachMember._name) ) {
			followerInformation = $gamePlayer.followers().follower(memberIndex-1);
			memberEvent = $gameSystem.partyCharacterEvent.find(x => x.name === eachMember._name);
			followerInformation.setPosition($gameMap.event(memberEvent.eventId()).x, $gameMap.event(memberEvent.eventId()).y);
			followerInformation.setDirection($gameMap.event(memberEvent.eventId()).direction());
		};
	});
	$gameParty.members().forEach(function(eachMember, memberIndex) {
		if ( $gameSystem.partyCharacterEvent.some(x => x.name === eachMember._name) ) {
			followerInformation = $gamePlayer.followers().follower(memberIndex-1);
			memberEvent = $gameSystem.partyCharacterEvent.find(x => x.name === eachMember._name);
			$gameMap.event(memberEvent.eventId()).setPosition(0, 0);
			$gameMap.event(memberEvent.eventId()).setDirection(8);
			$gameMap.event(memberEvent.eventId()).setThrough(true);
			$gameMap.event(memberEvent.eventId()).setDirectionFix(false);
			$gameMap.events()[memberEvent.eventId()-1]._opacity = 0;
			$gameSelfSwitches.setValue([$gameMap._mapId, memberEvent.eventId(), 'A'], false);
			$gameSelfSwitches.setValue([$gameMap._mapId, memberEvent.eventId(), 'B'], false);
			$gameSelfSwitches.setValue([$gameMap._mapId, memberEvent.eventId(), 'C'], false);
			$gameSelfSwitches.setValue([$gameMap._mapId, memberEvent.eventId(), 'D'], false);
		};
	});
};

//加入所有戰鬥角色
function RoguelikeBattleSetting() {
	
	var _currentRegion = $gameSystem.currentRegion;
	var _partyMemberEventId = 0;
	$gameSystem.battleMembersPriority = [];
	$gameSystem.BattleMembers = [];
	
	//抓取目前隊伍成員
	for (partyMember = 0; partyMember < $gameParty.members().length; partyMember++) {
		if ( $gameSystem.partyCharacterEvent.some(x => x.name === $gameParty.members()[partyMember]._name) ) {
			_partyMemberEventId = $gameSystem.partyCharacterEvent.find(x => x.name === $gameParty.members()[partyMember]._name).eventId();
		} else {
			_partyMemberEventId = 999;
		};
		$gameSystem.BattleMembers[partyMember] = {
			name: $gameParty.members()[partyMember]._name,
			mhp: $gameParty.members()[partyMember].mhp,
			leftHp: $gameParty.members()[partyMember]._hp,
			atk: $gameParty.members()[partyMember].atk,
			def: $gameParty.members()[partyMember].def,
			agi: $gameParty.members()[partyMember].agi,
			actorId: $gameParty.members()[partyMember]._actorId,
			eventId: _partyMemberEventId,
			enemyIndex: -1,
			faction: "player",
			moved: false,
			movable: true,
			movedStep: 0,
			death: ($gameParty.members()[partyMember]._hp > 0) ? false : true,
		};
	};

	//抓取當前區域中敵方角色
	$gameSystem.EnemyInformation.forEach(function(eachEnemy, _enemyIndex) {
		if (eachEnemy === undefined || eachEnemy === {}) {
			console.log("Function RoguelikeBattleSetting message");
			console.log("$gameSystem.EnemyInformation[_enemyIndex] === undefined || $gameSystem.EnemyInformation[_enemyIndex] === {}");
			console.log("_enemyIndex = " + _enemyIndex);
		} else if (eachEnemy.eventID <= 0 ) {
			console.log("Function RoguelikeBattleSetting message");
			console.log("$gameSystem.EnemyInformation[_enemyIndex].eventID = " + $gameSystem.EnemyInformation[_enemyIndex].eventID);
			console.log("_enemyIndex = " + _enemyIndex);
		} else {
			if (eachEnemy.regionId == _currentRegion) {
				$gameSystem.BattleMembers.push({
					name: $dataMap.events[$gameSystem.EnemyInformation[_enemyIndex].eventId].name,
					race: $gameSystem.EnemyInformation[_enemyIndex].race,
					mhp: $gameSystem.EnemyInformation[_enemyIndex].mhp,
					leftHp: $gameSystem.EnemyInformation[_enemyIndex].hp,
					atk: $gameSystem.EnemyInformation[_enemyIndex].atk,
					def: $gameSystem.EnemyInformation[_enemyIndex].def,
					agi: $gameSystem.EnemyInformation[_enemyIndex].agi,
					actorId: -1,
					eventId: $gameSystem.EnemyInformation[_enemyIndex].eventId,
					enemyIndex: _enemyIndex,
					faction: "enemy",
					moved: false,
					movable: true,
					movedStep: 0,
					death: ($gameSystem.EnemyInformation[_enemyIndex].hp > 0) ? false : true,
				});
			};
		};
	});
	
	//抓取血腥祭壇區域中的被拋棄角色
	$gameSystem.sacrificedMemberEquipList.forEach(function(eachMember) {
		console.log("eachMember = ");
		console.log(eachMember);
		
		
	});
	
	//行動者排序
	$gameSystem.battleMembersPriority = $gameSystem.BattleMembers;
	$gameSystem.battleMembersPriority = Object.assign([], $gameSystem.BattleMembers);
	$gameSystem.battleMembersPriority.sort((a, b) => a.agi < b.agi);
	
	console.log("$gameSystem.battleMembersPriority = ");
	console.log($gameSystem.battleMembersPriority);
	
	//BS階段
	RoguelikeBattleStartCheckCondition();
	RoguelikeBattling();

};

//戰鬥開始，檢查是否有狀態需要進行動作
function RoguelikeBattleStartCheckCondition() {
	var _actorCondition = [];
	var conditionEffectBSList = [];
	var _conditionNote = "";
	var _EWBSMark = "EWBS: ";
	
	//儲存所有EWBS的狀態
	$dataStates.forEach(function(eachState) {
		if (eachState) {
			_conditionNote = eachState.note;
			if ( _conditionNote.includes(_EWBSMark) ) {
				conditionEffectBSList.push(eachState.id);
			};
		};
	});
	//檢查是否有角色身上有EWBS的狀態
	$gameSystem.battleMembersPriority.forEach(function(eachActor) {
		if ( eachActor.faction === "player" ) {
			_actorCondition = $gameSystem.partyMemberConditionContent.find(x => x.name === eachActor.name);
		} else if ( eachActor.faction === "enemy" ) {
			_actorCondition = $gameSystem.EnemyInformation[eachActor.enemyIndex];
		};
		if ( _actorCondition != undefined && _actorCondition.toString().length > 0 ) {
			_actorCondition.condition.forEach(function(eachCondition) {
				if ( conditionEffectBSList.includes(eachCondition.conditionId) ) {
					RoguelikeSpecialConditionEffect(eachActor, "BS");
					// RoguelikeEWBSConditionEffect(eachActor, eachCondition.conditionId);
				};
			});
		};
	});
};

//戰鬥順序計算
function RoguelikeBattling() {
	
	var mover = $gameSystem.battleMembersPriority.findIndex(x => x.moved === false);

	$gameSwitches.setValue(1, true);//戰鬥腳本進行中
	$gameSwitches.setValue(3, true);//戰鬥開始
	
	if (mover === -1) {
		$gameTemp.reserveCommonEvent(4);
	} else {
		if ( !RoguelikeBattleCheckOpponentExist($gameSystem.battleMembersPriority[mover].faction) ) {
			$gameTemp.reserveCommonEvent(4);
		} else {
			while( $gameSystem.battleMembersPriority[mover].death === true )	{
				$gameSystem.battleMembersPriority[mover].moved = true;
				mover++;
				if (mover > $gameSystem.battleMembersPriority.length-1) { break; };
			};
			if ($gameSystem.battleMembersPriority[mover] === null || $gameSystem.battleMembersPriority[mover] === undefined) {
				$gameTemp.reserveCommonEvent(4);
			} else if (!RoguelikeBattleCheckOpponentExist($gameSystem.battleMembersPriority[mover].faction)){
				$gameTemp.reserveCommonEvent(4);
			} else {
				//AS階段
				console.log("$gameSystem.battleMembersPriority[mover] = ");
				console.log($gameSystem.battleMembersPriority[mover]);
				$gameSystem.battleMembersPriority[mover].movable = true;
				TurnStyleConditionCalculating($gameSystem.battleMembersPriority[mover]);
				_movable = $gameSystem.battleMembersPriority[mover].movable;
				console.log("_movable in RoguelikeBattling = ");
				console.log(_movable);
				if ($gameSystem.battleMembersPriority[mover].name === $gameParty.members()[0]._name) {
					// 主角移動階段
					if ( $gameSystem.battleMembersPriority[mover].movable ) { 
						console.log("換主角行動了");
						$gameSwitches.setValue(2, true);
						$gameTemp.reserveCommonEvent(1);
					} else {
						console.log("角色無法行動");
						$gameSwitches.setValue(1, false);
						$gameSwitches.setValue(2, false);
					};
				} else {
					// 各事件移動階段
					$gameSwitches.setValue(2, true);
					$gameSwitches.setValue(11, false);//強制取消進行中的推拉行動
					$gameMap.event($gameSystem.battleMembersPriority[mover].eventId).setDirectionFix(false);
					$gameSystem.battleMembersPriority[mover].movedStep = 0;
					$gameSelfSwitches.setValue([$gameMap._mapId, $gameSystem.battleMembersPriority[mover].eventId, 'A'], true);
				};
			};
		};
	};
};

//確認是否仍有敵方角色存活
function RoguelikeBattleCheckOpponentExist(faction) {
	var _faction = faction;
	var targetFaction = (_faction === "player") ? "enemy" : "player";
	// console.log("RoguelikeBattleCheckOpponentExist");
	// console.log("Current faction = " + _faction);
	// console.log($gameSystem.battleMembersPriority.filter(x => x.faction === targetFaction && x.death === false));
	
	// console.log("$gameSystem.battleMembersPriority = ");
	// console.log($gameSystem.battleMembersPriority);
	return $gameSystem.battleMembersPriority.filter(x => x.faction === targetFaction && x.death === false).length > 0;
};

//戰鬥距離計算
function RoguelikeBattleDistance(moverEventId, battleStyle = 1) {
	var _moverEventId = moverEventId;
	//檢查當前行動角色陣營為玩家方或怪物方
	var moverIndex = $gameSystem.battleMembersPriority.findIndex(x => x.moved === false);
	var actor = {};
	var faction = $gameSystem.battleMembersPriority[moverIndex].faction;
	var targetFaction = (faction === "player") ? "enemy" : "player";
	var targetInformation = Object.assign([], $gameSystem.battleMembersPriority);
	var targetCondition = [];
	var _newTargetInformation = [];
	var _targetIndex = 0;
	var nonTargetIndex = 0;
	var deltaX = 0;
	var deltaY = 0;
	var distance = 0;
	var _raceOrName = "";
	var _PATargetIndex = -1;//Priority Attack Target
	
	//挑出敵方陣營角色
	targetInformation = targetInformation.filter(x => x.faction === targetFaction);
	//挑出尚未死亡的角色
	targetInformation = targetInformation.filter(x => x.death === false);
	//讀取對象陣營角色位置資訊
	targetInformation.forEach(function(eachTarget, Index) {
		eachTarget.x = 0;
		eachTarget.y = 0;
		if ( eachTarget.eventId <= 0 ) {
			console.log("Function RoguelikeBattleDistance error");
			console.log("targetInformation.eventId <= 0");
			console.log("targetInformation = ");
			console.log(targetInformation);
		//對象為主角時
		} else if (eachTarget.eventId === 999) {
			eachTarget.x = $gamePlayer.x;
			eachTarget.y = $gamePlayer.y;
		//對象為其他隊友或敵方角色時
		} else {
			eachTarget.x = $gameMap.event(eachTarget.eventId).x;
			eachTarget.y = $gameMap.event(eachTarget.eventId).y;
		};
	});
	
	//判斷行動者是否有狀態更改攻擊目標
	if ( faction === "player" ) {
		actor = $gameSystem.partyMemberConditionContent.find(x => x.actorId === $gameSystem.battleMembersPriority[moverIndex].actorId);
		// targetInfoWithCondition = $gameSystem.EnemyInformation.filter(x => x.regionId === $gameSystem.currentRegion);
	} else if ( faction === "enemy" ) {
		actor = $gameSystem.EnemyInformation.find(x => x.enemyIndex === $gameSystem.battleMembersPriority[moverIndex].enemyIndex);
		// targetInfoWithCondition = $gameSystem.partyMemberConditionContent;
	};
	_PATargetIndex = RoguelikeCheckProvocative(targetInformation);
	//[21神智不清]
	if ( actor != null && actor.condition.some(x => x.conditionId === 21) ) {
		battleStyle = 2;
	//[20挑釁](被挑釁)
	} else if ( _PATargetIndex != -1 ) {
		battleStyle = 3;
	} else {
		battleStyle = 1;
	};

	for (_targetIndex = 0; _targetIndex < targetInformation.length; _targetIndex++) {
		deltaX = Math.abs(targetInformation[_targetIndex].x - $gameMap.event(_moverEventId).x);
		deltaY = Math.abs(targetInformation[_targetIndex].y - $gameMap.event(_moverEventId).y);
		distance = deltaX + deltaY;
		targetInformation[_targetIndex].deltaX = deltaX;
		targetInformation[_targetIndex].deltaY = deltaY;
		targetInformation[_targetIndex].distance = distance;
	};
	switch (battleStyle) {
		// 攻擊最近的敵方對象
		case 1:
			targetInformation.sort((a, b) => a.distance > b.distance);
			break;
		//隨機攻擊敵方對象
		case 2:
			while ( targetInformation.length > 0 ) {
				_targetIndex = Math.floor(Math.random()*targetInformation.length);
				_newTargetInformation.push(targetInformation[_targetIndex]);
				targetInformation.splice(_targetIndex, 1);
			};
			targetInformation = _newTargetInformation;
		break;
		//優先攻擊挑釁的敵方對象
		case 3:
			targetInformation.unshift(targetInformation[_PATargetIndex]);
			targetInformation.splice(_PATargetIndex+1, 1);
		break;
		default:
			break;
	};
	$gameSystem.roguelikeBattleTarget = targetInformation;
	// console.log("$gameSystem.roguelikeBattleTarget = ");
	// console.log($gameSystem.roguelikeBattleTarget);
	
	//BM階段
	//檢查BM階段是否有狀態需要觸發
	RoguelikeSpecialConditionEffect($gameSystem.battleMembersPriority[moverIndex], "BM");
	// return RoguelikeBattleActorMoving($gameSystem.battleMembersPriority[moverIndex].eventId, "BM");
};

//檢查攻擊對象中是否有角色有「挑釁」狀態
function RoguelikeCheckProvocative(target) {
	var provocativerIndex = -1;
	var _targetWithCondition = {};
	var _conditionNumber = 20;

	target.forEach(function(eachTarget, targetIndex) {
		if ( provocativerIndex === -1 ) {
			if ( eachTarget.faction === "player" ) {	
				_targetWithCondition = $gameSystem.partyMemberConditionContent.find(x => x.name === eachTarget.name);
				if ( _targetWithCondition.condition.some(x => x.conditionId === _conditionNumber ) ) {
					provocativerIndex = targetIndex;
				};
			} else if ( eachTarget.faction === "enemy" ) {
				_targetWithCondition = $gameSystem.EnemyInformation.find(x => x.enemyIndex === eachTarget.enemyIndex);
				if ( _targetWithCondition.condition.some(x => x.conditionId === _conditionNumber ) ) {
					provocativerIndex = targetIndex;
				};
			};
		};
	});
	return provocativerIndex;
};

//戰鬥行走路徑判斷
//如不需要行走，則return false
function RoguelikeBattleMoving(moverEventId) {
	var _moverEventId = moverEventId;
	var moverEvent = $gameMap.event(_moverEventId);
	var nearestTarget = Object.assign({}, $gameSystem.roguelikeBattleTarget[0]);
	var attackRadius = 1;
	var _testValue = Object.assign([], $gameSystem.roguelikeBattleTarget);
	var deltaX = 0;
	var deltaY = 0;
	var distance = 0;
	
	_raceOrName = RoguelikeBattleActorTransferRaceOrName(_moverEventId);
	attackRadius = RoguelikeBattleAttackRadius(_moverEventId);
	
	deltaX = Math.abs(nearestTarget.x - moverEvent.x);
	deltaY = Math.abs(nearestTarget.y - moverEvent.y);
	distance = Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2));
	if ( distance <= attackRadius ) { 
		return false;
	} else {
		moveDirection = moverEvent.findDirectionTo(nearestTarget.x, nearestTarget.y);
		$gameSwitches.setValue(1, false);
		return moveDirection;
	};
};

//戰鬥傷害計算
function RoguelikeBattleDamage(moverEventId) {
	
	var _moverEventId = moverEventId;
	var _moverName = $dataMap.events[_moverEventId].name;
	var _moverDirection = 0;
	var targetEnemyNumber = -1;
	var _target = [];
	var _targetPosition = [];
	var damage = 0;
	var _raceOrName = "";
	var _attackRangeArray = "";
	var _actorX = 0;
	var _actorY = 0;
	var _attackedX = 0;
	var _attackedY = 0;
	var _attackedMark = "O";
	var _actorMark = "X";
	var _rowNumber = 5;
	var _originalRange = "";
	var _attackStyle = "";
	var _aimEventId = 0;
	var _aimEventInformation = [];

	_raceOrName = RoguelikeBattleActorTransferRaceOrName(_moverEventId);
	
	//AM階段 - 待新增
	
	_aimEventInformation = $gameSystem.roguelikeAttackRangeStore.filter(x => x.raceOrName === _raceOrName);
	
	for ( i = 0; i < _aimEventInformation.length; i++ ) {
		//判斷行動者為近戰或遠程
		_aimEventId = _aimEventInformation[i].eventId;
		_moverDirection = $gameSystem.characterBattleMoveValue.direction;
		//讀取行動者攻擊範圍
		_originalRange = RoguelikeAttackRangeGetRange(_raceOrName);
		_transformedRange = RoguelikeAttackRangeDirectionTransform(_rowNumber, _originalRange, _moverDirection);
		_attackRangeArray = _transformedRange.split("");
		
		_actorX = _attackRangeArray.indexOf(_actorMark) % _rowNumber;
		_actorY = Math.floor(_attackRangeArray.indexOf(_actorMark) / _rowNumber);
		_attackRangeArray.forEach(function(eachMark, markIndex) {
			if (eachMark === _attackedMark) {
				_attackedX = markIndex % _rowNumber;
				_attackedY = Math.floor(markIndex / _rowNumber);
				_targetPosition.push({
					x: ($gameMap.event(_aimEventId).x + (_attackedX - _actorX)),
					y: ($gameMap.event(_aimEventId).y + (_attackedY - _actorY)),
					// x: ($gameMap.event(_aimEventId).x + (Math.sign(5-_moverDirection) * (_actorX - _attackedX))),
					// y: ($gameMap.event(_aimEventId).y + (Math.sign(((_moverDirection/2)%2)-0.5) * (_actorY - _attackedY))),
				});
			};
		});
	};
	
	console.log("_targetPosition = ");
	console.log(_targetPosition);
	
	//讀取範圍內遭到攻擊的目標
	$gameSystem.roguelikeBattleTarget.forEach(function(eachTarget) {
		//對象為玩家的情況
		if ( eachTarget.eventId === 999 ) {
			if ( _targetPosition.some(o => o.x === $gamePlayer.x &&
																o.y === $gamePlayer.y) ) {
				_target.push(eachTarget);
			};
		//對象為一般事件的情況
		} else if ( _targetPosition.some(	o => o.x === $gameMap.event(eachTarget.eventId).x &&
																			o.y === $gameMap.event(eachTarget.eventId).y) ) {
			_target.push(eachTarget);
		};
	});
	if ( _target && _target.length <= 0 ) {
		$gameSwitches.setValue(1, false);
		return console.log("RoguelikeBattleDamage message.\n there is no target.");
	};
		//DC階段
	_target.forEach(function(eachTarget) {
		damage = RoguelikeBattleActorMoving(_moverEventId, "DC", eachTarget);
	});
	
	while ( _target != undefined && _target.length > 0 ) {
		RoguelikeBattleDead( _target.shift(), _target );
		// RoguelikeBattleDead( ((_target.length > 1) ? _target.shift() : _target[0]), _target );
		// RoguelikeBattleDead( _target[i], _target );
	};
};

//戰鬥後檢查被攻擊的角色是否死亡
function RoguelikeBattleDead(targetInformation, leftTarget) {
	var _targetInformation = targetInformation;
	var targetActorEventId = 0;
	var targetEnemyNumber = 0;
	var targetPriorityNumber = $gameSystem.battleMembersPriority.findIndex(x => x.name === _targetInformation.name);;
	var _battleScriptRunning = !!leftTarget.length >= 1;
	
	if (_targetInformation.faction === "player") {
		console.log("RoguelikeBattleCheckDead function information");
		console.log("This target is in Playerparty");
		targetActorEventId = _targetInformation.eventId;
		if ($gameParty.deadMembers().some(x => x._name === _targetInformation.name)) {
			$gameSystem.battleMembersPriority[targetPriorityNumber].death = true;
			if (targetActorEventId != 999) {
				$gameMap.event(targetActorEventId)._opacity = 0;
				$gameMap.event(targetActorEventId)._through = true;
				$gameTemp.reserveCommonEvent(5);
			} else {
				$gameSwitches.setValue(1, _battleScriptRunning);
				console.log("This target is player");
			};
			console.log("This target is dead");
		} else {
			$gameSwitches.setValue(1, _battleScriptRunning);
			console.log("This target is alive");
		};
	} else if(_targetInformation.faction === "enemy") {
		console.log("This target is an enemy");
		targetEnemyNumber = _targetInformation.enemyIndex;
		if ($gameSystem.EnemyInformation[targetEnemyNumber].hp <= 0) {
			$gameSystem.EnemyInformation[targetEnemyNumber].death = true;
			$gameSystem.battleMembersPriority[targetPriorityNumber].death = true;
			$gameSystem.EnemyInformation[targetEnemyNumber].hp = 0;
		};
		if ($gameSystem.EnemyInformation[targetEnemyNumber].death) {
			$gameMap.event(_targetInformation.eventId)._opacity = 0;
			$gameMap.event(_targetInformation.eventId)._through = true;
			console.log("This target is dead");
			// console.log("$gameSystem.EnemyInformation[targetEnemyNumber] = ");
			// console.log($gameSystem.EnemyInformation[targetEnemyNumber]);
			// console.log("$gameSystem.battleMembersPriority[targetPriorityNumber] = ");
			// console.log($gameSystem.battleMembersPriority[targetPriorityNumber]);
		} else {
			console.log("This target is alive");
		};
		$gameSwitches.setValue(1, _battleScriptRunning);
	} else {
		console.log("RoguelikeBattleCheckDead function error");
		console.log("I don't know who is this target");
	};
};

//檢查敵方角色是否死亡
function RoguelikeEnemyNotDeathCheck(enemyIndex) {
	var _enemyIndex = enemyIndex;
	console.log("RoguelikeEnemyNotDeathCheck, enemyIndex = " + enemyIndex);
	if ($gameSystem.EnemyInformation[_enemyIndex] === null || $gameSystem.EnemyInformation[_enemyIndex] === undefined) {
		console.log("RoguelikeEnemyDeathCheck function error");
		console.log("This enemy is not exist");
		return false;
	} else {
		return !$gameSystem.EnemyInformation[_enemyIndex].death;
	};
};

//戰鬥結束後，獲得戰鬥獎勵
function RoguelikeBattleFinishedGainAward() {
	$gameSystem.battleReward = [];
	var _enemyList = $gameSystem.battleMembersPriority.filter(x => x.faction === "enemy" && x.death === true);
	var _raceOrName = "";
	var battleAward = [];
	var award = [];
	
	if ( !_enemyList || _enemyList.length <= 0 ) { return false; };
	
	for ( _enemyIndex = 0; _enemyIndex < _enemyList.length; _enemyIndex++ ) {
		_raceOrName = RoguelikeBattleActorTransferRaceOrName(_enemyList[_enemyIndex].eventId);
		award = RoguelikeBattleAwardList(_raceOrName);
		if ( !award || award.length <= 0 ) { continue; };
		for ( _awardIndex = 0; _awardIndex < award.length; _awardIndex++ ) {
			if ( battleAward.some(x => !!x && x.itemStyle === award[_awardIndex].itemStyle && x.itemNumber === award[_awardIndex].itemNumber) ) {
				battleAward[battleAward.findIndex(x => x.itemStyle === award[_awardIndex].itemStyle && x.itemNumber === award[_awardIndex].itemNumber)].dropNumber++;
			} else {
				battleAward.push(award[_awardIndex]);
			};
		};
	};
	$gameSystem.battleReward = Object.assign([], battleAward);
	return $gameSystem.battleReward;
};

/*
BS = Battle Start
AS = Action Start
BM = Before Moving
EM = End Moving
DC = Damage Calaulating
DBC = Damage Before Calaulating
DAC = Damage After Calaulating
*/
function RoguelikeBattleActorMoving(actorEventId, phase, target={}) {
	var _raceOrName = RoguelikeBattleActorTransferRaceOrName(actorEventId);
	var _targetEventId = target.eventId;
	var _skill = 0;
	var _conditionLevel = 0;
	var damage = 0;
	var _enemyNumber = target.faction === "enemy" ? 
				$gameSystem.EnemyInformation.findIndex(x => x.eventId === target.eventId) : 
				$gameSystem.EnemyInformation.findIndex(x => x.eventId === actorEventId);
	var _actorNumber = target.faction === "player" ? 
				$gameParty.members().find(x => x._name === target.name).actorId() : -1;
	var mover = $gameSystem.battleMembersPriority.find(x => x.moved === false);
	
	//-------------------------↓↓↓友方↓↓↓------------------------------
	switch (_raceOrName) {
		//主角
		case $gameActors.actor(1)._name:
			console.log("Mow Cole Ling appear");
		break;
		//刺客
		case $gameActors.actor(2)._name:
			switch (phase) {
				case "DC":
					damage = RoguelikeBattleDamageStyle(1, mover, target);
					// if ( damage != "MISS" ) { $gameSystem.EnemyInformation[_enemyNumber].hp -= damage; };
					// RoguelikeBattleAddCondition(target, 4);//中毒
				break;
				default:
				break;
			};
		break;
		//寒冰法師
		case $gameActors.actor(3)._name:
			switch (phase) {
				case "DC":
					damage = RoguelikeBattleDamageStyle(1, mover, target);
					// if ( damage != "MISS" ) { $gameSystem.EnemyInformation[_enemyNumber].hp -= damage; };
					RoguelikeBattleAddCondition(target, 16);//緩速
				break;
				default:
				break;
			};
		break;
		//護盾騎士
		case $gameActors.actor(4)._name:
			switch (phase) {
				case "DC":
					damage = RoguelikeBattleDamageStyle(1, mover, target);
					// if ( damage != "MISS" ) { $gameSystem.EnemyInformation[_enemyNumber].hp -= damage; };
				break;
				default:
				break;
			};
		break;
		//膽小鬼
		case $gameActors.actor(5)._name:
			switch (phase) {
				case "BM":
					_skill = ( $gameSystem.roguelikeBattleTarget[0].distance > 3 ) ? 1 : 2;
					return _skill;
				break;
				case "DC":
					damage = RoguelikeBattleDamageStyle(1, mover, target);
					// if ( damage != "MISS" ) { $gameSystem.EnemyInformation[_enemyNumber].hp -= damage; };
				break;
				default:
				break;
			};
		break;
		//巨劍士
		case $gameActors.actor(6)._name:
			switch (phase) {
				case "DC":
					damage = RoguelikeBattleDamageStyle(1, mover, target);
					if ( damage != "MISS" ) { 
						// $gameSystem.EnemyInformation[_enemyNumber].hp -= damage;
						//50%機率使敵人暈眩
						if (Math.floor(Math.random()*100) >= 50 ) {
							RoguelikeBattleAddCondition(target, 19);
						};
					};
				break;
				default:
				break;
			};
		break;
		//火焰法師
		case $gameActors.actor(7)._name:
			switch (phase) {
				case "DC":
					damage = RoguelikeBattleDamageStyle(1, mover, target);
					// if ( damage != "MISS" ) { $gameSystem.EnemyInformation[_enemyNumber].hp -= damage; };
				break;
				default:
				break;
			};
		break;
		//聖騎士
		case $gameActors.actor(8)._name:
			switch (phase) {
				case "DC":
					damage = RoguelikeBattleDamageStyle(1, mover, target);
					// if ( damage != "MISS" ) { $gameSystem.EnemyInformation[_enemyNumber].hp -= damage; };
					RoguelikeBattleAddCondition($gameSystem.battleMembersPriority.find(x => x.eventId === actorEventId), 20);//挑釁
				break;
				default:
				break;
			};
		break;
		//瘋狂科學家
		case $gameActors.actor(9)._name:
			switch (phase) {
				case "DC":
					damage = RoguelikeBattleDamageStyle(1, mover, target);
					if ( damage != "MISS" ) {
						// $gameSystem.EnemyInformation[_enemyNumber].hp -= damage;
						RoguelikeBattleMadScientistAttack(target);
					};
				break;
				default:
				break;
			};
		break;
		//革命家
		case $gameActors.actor(10)._name:
			switch (phase) {
				case "BM":
					_conditionLevel = $gameSystem.partyMemberConditionContent.find(x => x.actorId === 10) != undefined ? 
														$gameSystem.partyMemberConditionContent.find(x => x.actorId === 10).condition.find(y => y.conditionId === 23) != undefined ? 
														$gameSystem.partyMemberConditionContent.find(x => x.actorId === 10).condition.find(y => y.conditionId === 23).level :
														0 : 0;
					_skill = ( _conditionLevel < 4 ) ? 1 : 2;
					return _skill;
				break;
				case "DC":
					_skill = RoguelikeBattleActorMoving(actorEventId, "BM");
					damage = RoguelikeBattleDamageStyle(1, mover, target);
					if ( damage != "MISS" ) {
						if ( _skill === 2 ) {
							damage *= 3;
							RoguelikeBattleRemoveCondition($gameSystem.partyMemberConditionContent.find(x => x.actorId === 10), 23);
						};
						// $gameSystem.EnemyInformation[_enemyNumber].hp -= damage;
						RoguelikeBattleAddCondition($gameSystem.battleMembersPriority.find(x => x.eventId === actorEventId), 23);//伺機行動
					};
				break;
				default:
				break;
			};
		break;
		//弒神者
		case $gameActors.actor(11)._name:
			switch (phase) {
				case "DC":
					damage = RoguelikeBattleDamageStyle(1, mover, target);
					// if ( damage != "MISS" ) { $gameSystem.EnemyInformation[_enemyNumber].hp -= damage; };
				break;
				default:
				break;
			};
		break;
		//吸血鬼
		case $gameActors.actor(12)._name:
			switch (phase) {
				case "DC":
					damage = RoguelikeBattleDamageStyle(1, mover, target);
					if ( damage != "MISS" ) { 
						// $gameSystem.EnemyInformation[_enemyNumber].hp -= damage;
						RoguelikeBattleVanpireAttack(target, 5, 2, 3);
					};
				break;
				default:
				break;
			};
		break;
	//-------------------------↑↑↑友方↑↑↑------------------------------
	//-------------------------↓↓↓敵方↓↓↓------------------------------
		//BlueBat
		case $dataEnemies[1].name:
			switch (phase) {
				case "DC":
					damage = RoguelikeBattleDamageStyle(1, mover, target);
					// if ( damage != "MISS" ) { $gameActors.actor(_actorNumber).gainHp(-damage); };
				break;
				default:
				break;
			};
		break;
		//BlueSlime
		case $dataEnemies[2].name:
			switch (phase) {
				case "DC":
					damage = RoguelikeBattleDamageStyle(1, mover, target);
					// if ( damage != "MISS" ) { $gameActors.actor(_actorNumber).gainHp(-damage); };
				break;
				default:
				break;
			};
		break;
		//Pigman
		case $dataEnemies[3].name:
			switch (phase) {
				case "DC":
					damage = RoguelikeBattleDamageStyle(1, mover, target);
					// if ( damage != "MISS" ) { $gameActors.actor(_actorNumber).gainHp(-damage); };
				break;
				default:
				break;
			};
		break;
		//DevilGhost
		case $dataEnemies[4].name:
			switch (phase) {
				case "DC":
					damage = RoguelikeBattleDamageStyle(1, mover, target);
					// if ( damage != "MISS" ) { $gameActors.actor(_actorNumber).gainHp(-damage); };
				break;
				default:
				break;
			};
		break;
		//DragonLady
		case $dataEnemies[5].name:
			switch (phase) {
				case "DC":
					damage = RoguelikeBattleDamageStyle(1, mover, target);
					// if ( damage != "MISS" ) { $gameActors.actor(_actorNumber).gainHp(-damage); };
				break;
				default:
				break;
			};
		break;
		default:
			console.log("RoguelikeBattleActorMoving function error");
			console.log("I don't know who is this mover. actorEventId = \n" + actorEventId);
		break;
	//-------------------------↑↑↑敵方↑↑↑------------------------------
	};
	//查看是否有特殊狀態效果需要執行
	damage = RoguelikeSpecialConditionEffect(mover, phase, target, damage);
	// console.log("damage = ");
	// console.log(damage);
	//結算傷害
	if ( damage != "MISS" ) {
		if ( mover.faction === "player" ) {
			$gameSystem.EnemyInformation[_enemyNumber].hp -= damage;
		} else if ( mover.faction === "enemy" ) {
			$gameActors.actor(_actorNumber).gainHp(-damage);
		};
	};
	//顯示傷害數值
	damage = typeof(damage) == "number" ? parseInt(-damage) : damage;
	if ( phase === "DC" ) {	RoguelikeDamageRestore(_targetEventId, damage); };
};

//事件編號轉換(敵方種族/我方名稱)專用函式
function RoguelikeBattleActorTransferRaceOrName(actorEventId) {
	var _partyMemberMark = "PartyMember";
	var _enemyMark = "IsEnemy";
	var _raceOrName = "";
	var _actorName = (actorEventId > 0 && actorEventId != 999 ) ? $dataMap.events[actorEventId].name : "";
	var _eventNote = (actorEventId > 0 && actorEventId != 999 ) ? $dataMap.events[actorEventId].note : "";
	if ( _eventNote.includes(_partyMemberMark) ) {
		_raceOrName = _actorName;
	} else if ( _eventNote.includes(_enemyMark) ) {
		for (_enemyNumber = 1; _enemyNumber < $dataEnemies.length; _enemyNumber++) {
			if ( $dataEnemies[_enemyNumber].name != "" && _eventNote.includes($dataEnemies[_enemyNumber].name) ) {
				_raceOrName = $dataEnemies[_enemyNumber].name;
			} else {
				continue;
			};
		};
	} else {
		console.log("Function RoguelikeBattleActorTransferRaceOrName error");
		console.log("_eventNote is not IsEnemy nor partyMember");
	};
	return _raceOrName;
};

//傷害計算類別
function RoguelikeBattleDamageStyle(damageStyle=1, attacker, target) {
	var _damageStyle = damageStyle;
	var _atk = attacker.faction === "player" ? 
							$gameParty.members().find(x => x._name === attacker.name).atk : 
							$gameSystem.EnemyInformation[attacker.enemyIndex].atk;
	var _def = target.faction === "player" ? 
							$gameParty.members().find(x => x._name === target.name).def : 
							$gameSystem.EnemyInformation[target.enemyIndex].def;
	var damage = 0;
	var _targetCondition = target.faction === "player" ? 
				$gameSystem.partyMemberConditionContent.findIndex(x => x.name === target.name) >= 0 ?  
				$gameSystem.partyMemberConditionContent.find(x => x.name === target.name).condition : 
				[] : 
				$gameSystem.EnemyInformation.find(x => x.eventId === target.eventId).condition;
	var _perfectAvoid = false;
	
	//判斷特殊狀態造成迴避
	//[17 抱頭鼠竄]
	_perfectAvoid = _targetCondition.some(x => x.conditionId === 17) ? true : false;
	//[61 迷霧之蛇]
	_perfectAvoid = _targetCondition.some(x => x.conditionId === 61) ? 
										Math.floor(Math.random()*100) <= 20 ? 
										true : false : false;
	
		
	switch (_damageStyle) {
		case 1:
			damage = _atk - _def;
		break;
		default:
			damage = _atk - _def;
		break;
	};
	damage = (_perfectAvoid) ? "MISS" : (damage < 0) ? 0 : damage;
	return damage;
};

//角色可攻擊範圍
function RoguelikeBattleAttackRadius(eventId) {
	var attackRadius = 1;
	var characterRaceOrName = RoguelikeBattleActorTransferRaceOrName(eventId);
	var faction = !!$gameParty.members().find(x => x._name === characterRaceOrName) ? "player" : "enemy";
	
	switch (characterRaceOrName) {
	//-------------------------↓↓↓友方↓↓↓------------------------------
		//刺客
		case $gameActors.actor(2)._name:
			attackRadius = 2;
		break;
		//寒冰法師
		case $gameActors.actor(3)._name:
			attackRadius = 5;
		break;
		//護盾騎士
		case $gameActors.actor(4)._name:
			attackRadius = 2;
		break;
		//膽小鬼
		case $gameActors.actor(5)._name:
			attackRadius = 3;
		break;
		//巨劍士
		case $gameActors.actor(6)._name:
			attackRadius = 2;
		break;
		//火焰法師
		case $gameActors.actor(7)._name:
			attackRadius = 5;
		break;
		//聖騎士
		case $gameActors.actor(8)._name:
			attackRadius = 2;
		break;
		//瘋狂科學家
		case $gameActors.actor(9)._name:
			attackRadius = 4;
		break;
		//革命家
		case $gameActors.actor(10)._name:
			attackRadius = 2;
		break;
		//弒神者
		case $gameActors.actor(11)._name:
			attackRadius = 2;
		break;
		//吸血鬼
		case $gameActors.actor(12)._name:
			attackRadius = 2;
		break;
	//-------------------------↑↑↑友方↑↑↑------------------------------
	//-------------------------↓↓↓敵方↓↓↓------------------------------
		//BlueBat
		case $dataEnemies[1].name:
			attackRadius = 2;
		break;
		//BlueSlime
		case $dataEnemies[2].name:
			attackRadius = 1;
		break;
		//Pigman
		case $dataEnemies[3].name:
			attackRadius = 2;
		break;
		//DevilGhost
		case $dataEnemies[4].name:
			attackRadius = 3;
		break;
		//DragonLady
		case $dataEnemies[5].name:
			attackRadius = 5;
		break;
	//-------------------------↑↑↑敵方↑↑↑------------------------------
		default:
			attackRadius = 1;
		break;
	};
	attackRadius += 
		faction === "player" ? $gameParty.members().find(x => x._name === characterRaceOrName).attackRange : 
		faction === "enemy" ? $gameSystem.EnemyInformation.find
			(x => x.enemyIndex === 
			$gameSystem.battleMembersPriority.find(y => y.eventId === eventId).enemyIndex
			).attackRange : 
		0;
	return attackRadius;
};

//角色移動步數
//基本都只走一步，下面只列出特例
function RoguelikeBattleMoveStep(eventId) {
	var moveStep = 1;
	var characterRaceOrName = RoguelikeBattleActorTransferRaceOrName(eventId);
	var faction = !!$gameParty.members().find(x => x._name === characterRaceOrName) ? "player" : "enemy";
	
	switch (characterRaceOrName) {
	//-------------------------↓↓↓友方↓↓↓------------------------------
		//刺客
		case $gameActors.actor(2)._name:
			moveStep = 2;
		break;
		//革命家
		case $gameActors.actor(10)._name:
			moveStep = 2;
		break;
		//弒神者
		case $gameActors.actor(11)._name:
			moveStep = 2;
		break;
	//-------------------------↑↑↑友方↑↑↑------------------------------
	//-------------------------↓↓↓敵方↓↓↓------------------------------
		//BlueBat
		case $dataEnemies[1].name:
			moveStep = 2;
		break;
		//DevilGhost
		case $dataEnemies[4].name:
			moveStep = 2;
		break;
		//DragonLady
		case $dataEnemies[5].name:
			moveStep = 3;
		break;
	//-------------------------↑↑↑敵方↑↑↑------------------------------
		default:
			moveStep = 1;
		break;
	};
	moveStep += 
		faction === "player" ? $gameParty.members().find(x => x._name === characterRaceOrName).stepNumber : 
		faction === "enemy" ? $gameSystem.EnemyInformation.find
			(x => x.enemyIndex === 
			$gameSystem.battleMembersPriority.find(y => y.eventId === eventId).enemyIndex
			).stepNumber : 
		0;
	return moveStep;
};

function RoguelikeBattleMoveStepCondition(eventId) {
	
	
	
};

//吸血鬼專用噴血函式
function RoguelikeBattleVanpireAttack(target, hpValue=1, bloodTotalNumber=1, bloodRange=3) {
	var _target = target;
	var _targetEventId = _target.eventId;
	var _targetScreenX = $gameMap.event(_targetEventId).screenX();
	var _targetScreenY = $gameMap.event(_targetEventId).screenY();
	var _targetX = Math.floor(_targetScreenX / 48);
	var _targetY = Math.floor(_targetScreenY / 48);
	// var bloodRange = 3;//鮮血只會出現在敵方角色周圍3x3=9格內
	var _bloodShowX = 0;
	var _bloodShowY = 0;
	var _randomX = 0;
	var _randomY = 0;
	var _vampireBlood = $gameSystem.vampireBlood;
	var _someEmpty = false;
	var _timeLimit = 10;//鮮血持續10秒
	var _bloodTimeCounter = 0;
	var _hpValue = hpValue;
	
	//放置鮮血
	for ( bloodNumber = 0; bloodNumber < bloodTotalNumber; bloodNumber++ ) {
		// 檢查目標範圍內是否還有空位可以放血
		if ( _vampireBlood != undefined ) {
			for ( i = 0; i < bloodRange; i++ ) {
				for ( j = 0; j < bloodRange; j++ ) {
					_bloodShowX = _targetX + i - Math.floor(bloodRange/2);
					_bloodShowY = _targetY + j - Math.floor(bloodRange/2);
					if ( _bloodShowX === _targetX && _bloodShowY === _targetY ) { continue; };
					if ( _vampireBlood.some(o => o.x === _bloodShowX && o.y === _bloodShowY) ) {
						continue;
					} else { 
						_someEmpty = true;
					};
				};
			};
		};
		if ( _someEmpty === false ) { return false; };
		do{
			_randomX = Math.floor(Math.random()*bloodRange) - Math.floor(bloodRange/2);
			_randomY = Math.floor(Math.random()*bloodRange) - Math.floor(bloodRange/2);
			_bloodShowX = _targetX + _randomX;
			_bloodShowY = _targetY + _randomY;
		} while(_vampireBlood.some(o => o.x === _bloodShowX && o.y === _bloodShowY));
		
		$gameSystem.vampireBlood.push({
			x: _target.x + _randomX,
			y: _target.y + _randomY,
			_showX: _bloodShowX,
			_showY: _bloodShowY,
			_screenX: _targetScreenX,
			_screenY: _targetScreenY,
			timeLimit: _timeLimit,
			timeCounter: _bloodTimeCounter,
			picture: undefined,
			hpValue: _hpValue,
		});
	};
	console.log("$gameSystem.vampireBlood = ");
	console.log($gameSystem.vampireBlood);
};

/*
創建與更新吸血鬼鮮血圖片
roguelikeVampireBloodPictureCreate創建
roguelikeVampireBloodPictureRefresh更新
*/
var RoguelikeVampireBlood_mapStart = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
	RoguelikeVampireBlood_mapStart.call(this);
	$gameSystem.vampireBlood = ($gameSystem.vampireBlood === undefined) ? [] : $gameSystem.vampireBlood;
		// console.log("$gameSystem.vampireBlood = ");
	// console.log($gameSystem.vampireBlood);
};

var RoguelikeVampireBlood_mapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	RoguelikeVampireBlood_mapUpdate.call(this);
	this.roguelikeVampireBloodPictureCreate();
	this.roguelikeVampireBloodPictureRefresh();
};

Scene_Map.prototype.roguelikeVampireBloodPictureCreate = function() {
	if ($gameSystem.vampireBlood.length === 0 || 
			$gameSystem.vampireBlood.every(x => x.picture != undefined) ) { return false; };
	var bloodIndex = $gameSystem.vampireBlood.findIndex(x => x.picture === undefined);
	if (bloodIndex === -1) { return false; };

	var dx = $gameSystem.vampireBlood[bloodIndex]._showX;
	var dy = $gameSystem.vampireBlood[bloodIndex]._showY;
	var bloodPicture = new Sprite();
	bloodPicture.bitmap = ImageManager.loadPicture('VampireBlood');
	bloodPicture.x = dx;
	bloodPicture.y = dy;
	this.addChild( bloodPicture );
	bloodPicture.opacity = 50;
	$gameSystem.vampireBlood[bloodIndex].picture = bloodPicture;
	// console.log("$gameSystem.vampireBlood = ");
	// console.log($gameSystem.vampireBlood);
};

Scene_Map.prototype.roguelikeVampireBloodPictureRefresh = function() {
	var _vampireBlood = $gameSystem.vampireBlood;
	var vampireActorId = 12;
	var vampireConditionNumber = 22;//狀態「新鮮血液」編號
	var _pixel = this.pixel;
	if ( _vampireBlood === undefined || _vampireBlood.length <= 0 ) { return false; };
	_vampireBlood.forEach(function(eachBlood, bloodIndex) {
		if ( eachBlood.picture != undefined ) {
			if ( eachBlood.x === $gamePlayer.x && eachBlood.y === $gamePlayer.y ) {
				eachBlood.picture.opacity = 0;
				$gameSystem.vampireBlood.splice(bloodIndex, 1);
				$gameTemp.reserveCommonEvent(8);
				//全隊回血
				$gameParty.members().forEach(function(eachMember) {
					eachMember._hp += eachBlood.hpValue;
				});
				//吸血鬼角色獲得Buff
				if ( $gameParty.members().some(x => x._actorId === vampireActorId) ) {
					var vampireActor = $gameSystem.partyMemberConditionContent.find(x => x.actorId === vampireActorId);
					RoguelikeBattleAddCondition(vampireActor, vampireConditionNumber);
				};
			} else if ( Math.floor(eachBlood.timeCounter / 6) < eachBlood.timeLimit * 10 ) {
				eachBlood.timeCounter++;
				eachBlood.picture.x = eachBlood._showX * _pixel;
				eachBlood.picture.y = eachBlood._showY * _pixel;
				eachBlood.picture.opacity = 50;
			} else {
				eachBlood.picture.opacity = 0;
				$gameSystem.vampireBlood.splice(bloodIndex, 1);
			};
		};
	});
};

//瘋狂科學家專用Debuff回合數增加函式
function RoguelikeBattleMadScientistAttack(target) {
	var _target = target;
	var _enemyIndex = $gameSystem.EnemyInformation.findIndex(x => x.eventId === target.eventId);
	var _enemyInformation = $gameSystem.EnemyInformation.find(x => x.eventId === target.eventId);
	var _allCondition = _enemyInformation.condition;
	var debuffMark = "debuff";
	var turnMark = "turn";
	
	if ( _allCondition === [] || _allCondition.length <= 0 ) { return false; };
	_allCondition.forEach(function(eachCondition) {
		if ( eachCondition.conditionStyle === debuffMark && eachCondition.timeOrTurn === turnMark ) {
			// console.log("RoguelikeBattleMadScientistAttack message");
			// console.log("This condition " + eachCondition.conditionId + " is a debuff");
			RoguelikeBattleConditionTurnControl($gameSystem.EnemyInformation[_enemyIndex], eachCondition.conditionId, +1);
		};
	});
};

//沉迷研究的防具特效專用函式
function RoguelikeBattleMadScientistMistSnake(target, mistSnakeRange=3) {
	var _target = target;
	var _targetEventId = _target.eventId;
	var _targetScreenX = $gameMap.event(_targetEventId).screenX();
	var _targetScreenY = $gameMap.event(_targetEventId).screenY();
	var _targetX = Math.floor(_targetScreenX / 48);
	var _targetY = Math.floor(_targetScreenY / 48);
	var _mistSnakeShowX = 0;
	var _mistSnakeShowY = 0;
	var _mistSnake = $gameSystem.mistSnake;
	var _timeLimit = 10;//持續10秒
	var _mistSnakeTimeCounter = 0;
	
	//放置迷霧之蛇
	for ( mistSnakeNumber = 0; mistSnakeNumber < (mistSnakeRange * mistSnakeRange); mistSnakeNumber++ ) {
		if ( _mistSnake != undefined ) {
			_mistSnakeShowX = _targetX + Math.floor(mistSnakeNumber%mistSnakeRange) - Math.floor(mistSnakeRange/2);
			_mistSnakeShowY = _targetY + Math.floor(mistSnakeNumber/mistSnakeRange) - Math.floor(mistSnakeRange/2);
			$gameSystem.mistSnake.push({
				x: $gameMap.event(_targetEventId).x + Math.floor(mistSnakeNumber%mistSnakeRange) - Math.floor(mistSnakeRange/2),
				y: $gameMap.event(_targetEventId).y + Math.floor(mistSnakeNumber/mistSnakeRange) - Math.floor(mistSnakeRange/2),
				_showX: _mistSnakeShowX,
				_showY: _mistSnakeShowY,
				_screenX: _targetScreenX,
				_screenY: _targetScreenY,
				timeLimit: _timeLimit,
				timeCounter: _mistSnakeTimeCounter,
				picture: undefined,
			});
		};
	};
};

/*
創建與更新沉迷研究的防具特效圖片
roguelikeMadScientistMistSnakePictureCreate
roguelikeMadScientistMistSnakePictureRefresh
*/
var RoguelikeMadScientistMistSnake_mapStart = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
	RoguelikeMadScientistMistSnake_mapStart.call(this);
	$gameSystem.mistSnake = ($gameSystem.mistSnake === undefined) ? [] : $gameSystem.mistSnake;
};

var RoguelikeMadScientistMistSnake_mapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	RoguelikeMadScientistMistSnake_mapUpdate.call(this);
	this.roguelikeMadScientistMistSnakePictureCreate();
	this.roguelikeMadScientistMistSnakePictureRefresh();
};

Scene_Map.prototype.roguelikeMadScientistMistSnakePictureCreate = function() {
	if ($gameSystem.mistSnake.length === 0 || 
			$gameSystem.mistSnake.every(x => x.picture != undefined) ) { return false; };
	var mistSnakeIndex = $gameSystem.mistSnake.findIndex(x => x.picture === undefined);
	if (mistSnakeIndex === -1) { return false; };

	var dx = $gameSystem.mistSnake[mistSnakeIndex]._showX;
	var dy = $gameSystem.mistSnake[mistSnakeIndex]._showY;
	
	var mistSnakePicture = new Sprite();
	mistSnakePicture.bitmap = ImageManager.loadPicture('MistSnake');
	mistSnakePicture.x = dx;
	mistSnakePicture.y = dy;
	this.addChild( mistSnakePicture );
	mistSnakePicture.opacity = 50;
	$gameSystem.mistSnake[mistSnakeIndex].picture = mistSnakePicture;
};

Scene_Map.prototype.roguelikeMadScientistMistSnakePictureRefresh = function() {
	var _mistSnake = $gameSystem.mistSnake;
	var mistSnakeConditionNumber = 61;//狀態「迷霧之蛇」編號
	var _pixel = this.pixel;
	
	if ( _mistSnake === undefined || _mistSnake.length <= 0 ) { return false; };

	//判斷所有隊友位置
	$gameParty.members().forEach(function(eachMember) {
		if ( eachMember._actorId != 1 ) {
			var currentActor = $gameSystem.partyMemberConditionContent.find(x => x.actorId === eachMember._actorId);
			var actorEventId = $gameSystem.battleMembersPriority.find(x => x.actorId === eachMember._actorId).eventId;
			var actorX = $gameMap.event(actorEventId).x;
			var actorY = $gameMap.event(actorEventId).y;
			var inMistSnakeRange = false;
			if ( !!currentActor ) {
				_mistSnake.forEach(function(eachmistSnake, mistSnakeIndex) {
					if ( eachmistSnake.picture != undefined && inMistSnakeRange == false ) {
						if ( eachmistSnake.x === actorX && eachmistSnake.y === actorY ) {
							inMistSnakeRange = true;
						};
					};
				});
				if ( inMistSnakeRange == true ) {
					//判斷隊友是否已經有迷霧之蛇狀態
					if ( !currentActor.condition.some(x => x.conditionId === mistSnakeConditionNumber) ) {
						RoguelikeBattleAddCondition(currentActor, mistSnakeConditionNumber);
					};
				} else if ( inMistSnakeRange == false ) {
					RoguelikeBattleRemoveCondition(currentActor, mistSnakeConditionNumber);
				};
			};
		};
	});
	//更新秒數
	_mistSnake.forEach(function(eachmistSnake, mistSnakeIndex) {
		if ( eachmistSnake.picture != undefined ) {
			if ( Math.floor(eachmistSnake.timeCounter / 6) < eachmistSnake.timeLimit * 10 ) {
				eachmistSnake.timeCounter++;
				eachmistSnake.picture.x = eachmistSnake._showX * _pixel;
				eachmistSnake.picture.y = eachmistSnake._showY * _pixel;
				eachmistSnake.picture.opacity = 50;
			} else {
				eachmistSnake.picture.opacity = 0;
				$gameSystem.mistSnake.splice(mistSnakeIndex, 1);
			};
		};
	});
};