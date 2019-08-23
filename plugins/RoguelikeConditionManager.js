function RoguelikeConditionManager() {
	this.initialize.apply(this, arguments);

};

//Scene_Map initialize
var RoguelikeConditionManager_mapStart = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
  RoguelikeConditionManager_mapStart.call(this);
	this._conditionNoteCharacterValue = "character value: ";
	this._conditionNoteEffectTime = "effect time: ";
	this._conditionNoteEffectTurn = "effect turn: ";
	this._conditionNoteBuff = "buff";
	this._conditionNoteDebuff = "debuff";
	// this._conditionNoteEffectTime = "effect time: ";
	
	var effectTimeMark = this._conditionNoteEffectTime;
	
	if ( $gameSystem.partyMemberConditionContent === undefined || $gameSystem.partyMemberConditionContent === null ) {
		$gameSystem.partyMemberConditionContent = [{
			actorId: $gameParty.members()[0]._actorId,
			name: $gameParty.members()[0]._name,
			faction: "player",
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
		}];
	};
};

//Scene_Map.update
var RoguelikeConditionManager_mapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
  RoguelikeConditionManager_mapUpdate.call(this);
	
	this.RoguelikeConditionPartyTimeCounter();
	this.PartyConditionCalculate();
	this.EnemyConditionCalculate();
	
};

//計算隊伍中的狀態作用
Scene_Map.prototype.PartyConditionCalculate = function() {
	var that = this;
	var _conditionNoteCharacterValue = this._conditionNoteCharacterValue;
	var effectTimeMark = this._conditionNoteEffectTime;
	var characterLV = 0;
	var _conditionNote = "";
	var _conditionNoteState = "";
	var _conditionNoteValue = "";
	var _conditionNoteMath = "";
	var _conditionNoteSearcher = /<(?:EA.+?)>/g;
	var _EASearcher = "EA: ";
	var _currentCondition = [];
	var _conditionLevel = 0;
	var characterCurrentValue = {
		mhp: 0,
		atk: 0,
		agi: 0,
		def: 0,
		stepNumber: 0,
		attackRange: 0,
		condition: [],
	};
	
	$gameParty.members().forEach(function(eachPartyMember) {
		var _allEquipments = [];
		var _equipMhp = 0;
		var _equipAtk = 0;
		var _equipDef = 0;
		var _equipAgi = 0;
		characterLV = eachPartyMember.level;
		_allEquipments = eachPartyMember._equips;
		eachPartyMember.stepNumber = 0;
		eachPartyMember.attackRange = 0;
		//紀錄裝備數值
		for( i = 0; i < _allEquipments.length; i++ ) {
			if ( !_allEquipments[i] ) { continue; };
			if ( _allEquipments[i]._dataClass === "weapon") {
				_equipMhp += _allEquipments[i]._itemId != 0 ? $dataWeapons[_allEquipments[i]._itemId].params[0] : 0;
				_equipAtk += _allEquipments[i]._itemId != 0 ? $dataWeapons[_allEquipments[i]._itemId].params[2] : 0;
				_equipDef += _allEquipments[i]._itemId != 0 ? $dataWeapons[_allEquipments[i]._itemId].params[3] : 0;
				_equipAgi += _allEquipments[i]._itemId != 0 ? $dataWeapons[_allEquipments[i]._itemId].params[6] : 0;
			} else if ( _allEquipments[i]._dataClass === "armor") {
				_equipMhp += _allEquipments[i]._itemId != 0 ? $dataArmors[_allEquipments[i]._itemId].params[0] : 0;
				_equipAtk += _allEquipments[i]._itemId != 0 ? $dataArmors[_allEquipments[i]._itemId].params[2] : 0;
				_equipDef += _allEquipments[i]._itemId != 0 ? $dataArmors[_allEquipments[i]._itemId].params[3] : 0;
				_equipAgi += _allEquipments[i]._itemId != 0 ? $dataArmors[_allEquipments[i]._itemId].params[6] : 0;
			};
		};
		_currentCondition = $gameSystem.partyMemberConditionContent.find(x => x.actorId === eachPartyMember._actorId).condition;
		//判斷狀態[37 斬碎岩石的武器特效]的例外
		if ( _currentCondition.some(x => x.conditionId === 37 ) ) {	_equipAtk *= 2; };
		//紀錄角色數值
		characterCurrentValue = {
			mhp: $dataClasses[eachPartyMember._actorId].params[0][characterLV] + _equipMhp,
			atk: $dataClasses[eachPartyMember._actorId].params[2][characterLV] + _equipAtk,
			def: $dataClasses[eachPartyMember._actorId].params[3][characterLV] + _equipDef,
			agi: $dataClasses[eachPartyMember._actorId].params[6][characterLV] + _equipAgi,
			stepNumber: 0,
			attackRange: 0,
			condition: eachPartyMember._states,
		};
		if ( characterCurrentValue.condition === undefined || characterCurrentValue.condition === null ) {
		} else {
			_currentCondition = _currentCondition.filter(x => x.conditionId != 0);
			_currentCondition.forEach(function(eachCondition) {
						// console.log("eachCondition = ");
						// console.log(eachCondition);
				_conditionLevel = eachCondition.level;
				_conditionNote = $dataStates[eachCondition.conditionId].note;
				if ( /\S/.test(_conditionNote) && _conditionNote.includes(_EASearcher) ) {
					for ( i = 0; i < _conditionNote.match(_conditionNoteSearcher).length; i++) {
						if ( !_conditionNote.match(_conditionNoteSearcher)[i].includes(_conditionNoteCharacterValue) ) { continue; };
						//取得要作用的能力值項目
						_conditionNoteState = _conditionNote.match(_conditionNoteSearcher)[i].split(_conditionNoteCharacterValue).pop().split(" ")[0];
						//取得數學運算元
						_conditionNoteMath = _conditionNote.match(_conditionNoteSearcher)[i].split(_conditionNoteCharacterValue).pop().split(" ")[1].split("")[0];
						//取得數值
						_conditionNoteValue = _conditionNote.match(_conditionNoteSearcher)[i].split(_conditionNoteCharacterValue).pop().split(" ")[1].split("");
						//去頭(去掉數學運算元)
						_conditionNoteValue.shift();
						//去尾(去掉後方的括號【>】)
						_conditionNoteValue.pop();
						//重新轉為字串、轉為浮點數
						_conditionNoteValue = parseFloat(_conditionNoteValue.join(""));
						if ( _conditionNote.match(_conditionNoteSearcher)[i].includes("%") ) { _conditionNoteValue = _conditionNoteValue / 100; };
						//計算層數
						_conditionNoteValue = _conditionNoteValue * _conditionLevel;
						switch ( _conditionNoteMath ) {
							case ("+"):
								characterCurrentValue[_conditionNoteState] += _conditionNoteValue;
								break;
							case ("-"):
								characterCurrentValue[_conditionNoteState] -= _conditionNoteValue;
								break;
							case ("*"):
								characterCurrentValue[_conditionNoteState] *= _conditionNoteValue;
								break;
							case ("/"):
								characterCurrentValue[_conditionNoteState] -= _conditionNoteValue;
								break;
							default:
								characterCurrentValue[_conditionNoteState] += _conditionNoteValue;
								break;
						};
					};
				};
			});
		};
		eachPartyMember.addParam(0, characterCurrentValue.mhp - eachPartyMember.mhp);
		eachPartyMember.addParam(2, characterCurrentValue.atk - eachPartyMember.atk);
		eachPartyMember.addParam(3, characterCurrentValue.def - eachPartyMember.def);
		eachPartyMember.addParam(6, characterCurrentValue.agi - eachPartyMember.agi);
		eachPartyMember.stepNumber = characterCurrentValue.stepNumber - eachPartyMember.stepNumber;
		eachPartyMember.attackRange = characterCurrentValue.attackRange - eachPartyMember.attackRange;
	});
};

//計算敵方角色的狀態作用
Scene_Map.prototype.EnemyConditionCalculate = function() {
	var that = this;
	var _conditionNoteCharacterValue = this._conditionNoteCharacterValue;
	var effectTimeMark = this._conditionNoteEffectTime;
	var _conditionNote = "";
	var _conditionNoteState = "";
	var _conditionNoteValue = "";
	var _conditionNoteMath = "";
	var _conditionNoteSearcher = /<(?:EA.+?)>/g;
	var _EASearcher = "EA: ";
	var _isSacrificedMember = {};
	var enemyInCurrentRegion = [];
	var _enemyIndex = 0;
	var characterCurrentValue = {
		mhp: 0,
		atk: 0,
		agi: 0,
		def: 0,
		stepNumber: 0,
		attackRange: 0,
		condition: [],
	};
	
	if ( $gameSystem.EnemyInformation != undefined && $gameSystem.EnemyInformation != null ) {
		enemyInCurrentRegion = $gameSystem.EnemyInformation.filter(x => x.regionId === $gameSystem.currentRegion);
	} else {
		return false;
	};
	
	enemyInCurrentRegion.forEach(function(eachEnemy) {
		_enemyIndex = eachEnemy.enemyIndex;
		_isSacrificedMember = $dataActors.find(x => !!x && x.name === eachEnemy.race);
		eachEnemy.stepNumber = 0;
		eachEnemy.attackRange = 0;
		if ( !_isSacrificedMember ) {
			characterCurrentValue = {
				mhp: $dataEnemies[eachEnemy.enemyId].params[0],
				atk: $dataEnemies[eachEnemy.enemyId].params[2],
				def: $dataEnemies[eachEnemy.enemyId].params[3],
				agi: $dataEnemies[eachEnemy.enemyId].params[6],
				stepNumber: 0,
				attackRange: 0,
				condition: eachEnemy.condition,
			};
		} else {
			// console.log("_isSacrificedMember = ");
			// console.log(_isSacrificedMember);
			characterCurrentValue = {
				mhp: $dataClasses[_isSacrificedMember.classId].params[0][eachEnemy.level],
				atk: $dataClasses[_isSacrificedMember.classId].params[2][eachEnemy.level],
				def: $dataClasses[_isSacrificedMember.classId].params[3][eachEnemy.level],
				agi: $dataClasses[_isSacrificedMember.classId].params[6][eachEnemy.level],
				stepNumber: 0,
				attackRange: 0,
				condition: eachEnemy.condition,
			};
		};
		if ( characterCurrentValue.condition === undefined || characterCurrentValue.condition === null || !characterCurrentValue.condition.some(x => x.conditionId != 0) ) {
		} else {
			characterCurrentValue.condition.forEach(function(eachCondition) {
				if ( eachCondition.conditionId <= 0 ) {
				} else {
					_conditionNote = $dataStates[eachCondition.conditionId].note;
					if ( /\S/.test(_conditionNote) && _conditionNote.includes(_EASearcher) ) {
						for ( i = 0; i < _conditionNote.match(_conditionNoteSearcher).length; i++) {
							if ( !_conditionNote.match(_conditionNoteSearcher)[i].includes(_conditionNoteCharacterValue) ) { continue; };
							//取得要作用的能力值項目
							_conditionNoteState = _conditionNote.match(_conditionNoteSearcher)[i].split(_conditionNoteCharacterValue).pop().split(" ")[0];
							//取得數學運算元
							_conditionNoteMath = _conditionNote.match(_conditionNoteSearcher)[i].split(_conditionNoteCharacterValue).pop().split(" ")[1].split("")[0];
							//取得數值
							_conditionNoteValue = _conditionNote.match(_conditionNoteSearcher)[i].split(_conditionNoteCharacterValue).pop().split(" ")[1].split("");
							//去頭(去掉數學運算元)
							_conditionNoteValue.shift();
							//去尾(去掉後方的括號【>】)
							_conditionNoteValue.pop();
							//重新轉為字串、轉為浮點數
							_conditionNoteValue = parseFloat(_conditionNoteValue.join(""));
							if ( _conditionNote.match(_conditionNoteSearcher)[i].includes("%") ) { _conditionNoteValue = _conditionNoteValue / 100; };
							switch ( _conditionNoteMath ) {
								case ("+"):
									characterCurrentValue[_conditionNoteState] += _conditionNoteValue;
									break;
								case ("-"):
									characterCurrentValue[_conditionNoteState] -= _conditionNoteValue;
									break;
								case ("*"):
									characterCurrentValue[_conditionNoteState] *= _conditionNoteValue;
									break;
								case ("/"):
									characterCurrentValue[_conditionNoteState] -= _conditionNoteValue;
									break;
								default:
									characterCurrentValue[_conditionNoteState] += _conditionNoteValue;
									break;
							};
							// console.log("_conditionNoteValue = ");
							// console.log(_conditionNoteValue);
							// console.log("_conditionNote.match(_conditionNoteSearcher) = ");
							// console.log(_conditionNote.match(_conditionNoteSearcher));
						};
					};
				};
			});
		};
		$gameSystem.EnemyInformation[_enemyIndex].mhp += (characterCurrentValue.mhp - eachEnemy.mhp);
		$gameSystem.EnemyInformation[_enemyIndex].atk += (characterCurrentValue.atk - eachEnemy.atk);
		$gameSystem.EnemyInformation[_enemyIndex].def += (characterCurrentValue.def - eachEnemy.def);
		$gameSystem.EnemyInformation[_enemyIndex].agi += (characterCurrentValue.agi - eachEnemy.agi);
		$gameSystem.EnemyInformation[_enemyIndex].stepNumber = characterCurrentValue.stepNumber - eachEnemy.stepNumber;
		$gameSystem.EnemyInformation[_enemyIndex].attackRange = characterCurrentValue.attackRange - eachEnemy.attackRange;
	});
};

Scene_Map.prototype.RoguelikeConditionPartyTimeCounter = function() {
	var that = this;
	var _memberConditionIndex = 0;
	var _currentCondition = {};
	var conditionId = 0;
	var effectTimeMark = this._conditionNoteEffectTime;
	var _conditionNote = "";
	var effectTurnMark = this._conditionNoteEffectTurn;
	var buffMark = this._conditionNoteBuff;
	var debuffMark = this._conditionNoteDebuff;
	
	RoguelikePartymemberConditionRecord();
	
	//掃描每一個隊伍成員
	$gameParty.members().forEach(function(eachPartyMember, memberIndex) {
		_memberConditionIndex = $gameSystem.partyMemberConditionContent.findIndex(x => x.actorId === eachPartyMember._actorId);
		//掃描隊伍成員的每一個狀態
		$gameSystem.partyMemberConditionContent[_memberConditionIndex].condition.forEach(function(eachCondition) {
			// console.log("eachCondition");
			// console.log(eachCondition);
			if ( !!eachCondition && eachCondition.conditionId > 0 ) {
				conditionId = eachCondition.conditionId;
				_conditionNote = $dataStates[conditionId].note;
				// _currentCondition = $gameSystem.partyMemberConditionContent[_memberConditionIndex].condition.find(x => x.conditionId === eachConditionIndex);
				if ( eachCondition.timeOrTurn === "time" ) {
					//如果狀態還沒開始計時，設置狀態計時開始
					if ( eachCondition.effectTimeCounting === false && eachCondition.effectTime != 999 ) {
						eachCondition.effectTimeCounting = true;
						eachCondition.effectTimeLeft = eachCondition.effectTime;
					//狀態計時
					} else if ( eachCondition.effectTime != 999 ) {
						eachCondition.effectTimeCounter += 1;
						if ( Math.floor(eachCondition.effectTimeCounter / 6) > eachCondition.effectTime * 10 ) {
							$gameActors.actor(eachPartyMember._actorId).removeState(eachCondition.conditionId);
							eachCondition.effectTimeCounter = 0;
							$gameSystem.partyMemberConditionContent[_memberConditionIndex].condition.splice($gameSystem.partyMemberConditionContent[_memberConditionIndex].condition.findIndex(x => x.conditionId === eachCondition.conditionId), 1);
							console.log("remove conditionId = " + eachCondition.conditionId + ". from actorId = " + eachPartyMember._actorId);
						} else {
							eachCondition.effectTimeLeft = eachCondition.effectTime - Math.floor(eachCondition.effectTimeCounter / 6) / 10.0;
						};
					};
				};
			};
		});
	});
};

function RoguelikePartymemberConditionRecord() {
	var that = this;
	var _memberConditionIndex = 0;
	var _currentCondition = {};
	var effectTimeMark = this._conditionNoteEffectTime;
	var _conditionNote = "";
	var effectTurnMark = this._conditionNoteEffectTurn;
	var buffMark = this._conditionNoteBuff;
	var debuffMark = this._conditionNoteDebuff;
	
	//掃描每一個隊伍成員
	$gameParty.members().forEach(function(eachPartyMember, memberIndex) {
		//若角色還沒記錄到$gameSystem.partyMemberConditionContent裡面，紀錄之。
		if ( $gameSystem.partyMemberConditionContent.findIndex(x => x.actorId === eachPartyMember._actorId) === -1 ) {
			$gameSystem.partyMemberConditionContent.push({
				actorId: eachPartyMember._actorId,
				name: eachPartyMember._name,
				faction: "player",
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
			});
		};
		//掃描隊伍成員的每一個狀態
		eachPartyMember._states.forEach(function(eachConditionIndex) {
			_conditionNote = $dataStates[eachConditionIndex].note;
			_memberConditionIndex = $gameSystem.partyMemberConditionContent.findIndex(x => x.actorId === eachPartyMember._actorId);
			//如果角色身上有尚未紀錄的狀態，紀錄之
			if ( !$gameSystem.partyMemberConditionContent[_memberConditionIndex].condition.some(x => x.conditionId != 0) && !$gameSystem.partyMemberConditionContent[_memberConditionIndex].condition.some(x => x.conditionId === eachConditionIndex) ) {
				console.log("eachConditionIndex = ");
				console.log(eachConditionIndex);
				$gameSystem.partyMemberConditionContent[_memberConditionIndex].condition.push({
					conditionId: eachConditionIndex,
					conditionStyle: _conditionNote.includes(debuffMark) ? "debuff" : _conditionNote.includes(buffMark) ? "buff" : "unknow",
					timeOrTurn: _conditionNote.includes(effectTimeMark) ? "time" : _conditionNote.includes(effectTurnMark) ? "turn" : "unknow",
					effectTime: _conditionNote.includes(effectTimeMark) ? parseFloat(_conditionNote.split(effectTimeMark).pop().split(" ")) : 999,
					effectTimeLeft: 0,
					effectTimeCounter: 0,
					effectTimeCounting: false,
					effectTurn: _conditionNote.includes(effectTurnMark) ? parseInt(_conditionNote.split(effectTurnMark).pop().split(" ")) : 999,
					effectTurnLeft: _conditionNote.includes(effectTurnMark) ? parseInt(_conditionNote.split(effectTurnMark).pop().split(" ")) : 999,
					level: 1,
				});
			};
		});
	});
};

function RoguelikeEWBSConditionEffect(actor, conditionId) {
	var _actor = actor;
	var _faction = _actor.faction;
	
	switch (conditionId) {
		//弒神詛咒
		case 18:
			var _allCurseConditionId = [4, 19, 20, 21];//[4中毒][19暈眩][20挑釁][21神智不清]
			var _curseConditionId = _allCurseConditionId[Math.floor(Math.random()*_allCurseConditionId.length)];
			// var _curseConditionId = 20;
			if (_faction === "player") {
				// $gameActors.actor(_actor.actorId).addState(_curseConditionId);
				RoguelikeBattleAddCondition(_actor, _curseConditionId);
			} else if (_faction === "enemy"){
				RoguelikeBattleAddCondition(_actor, _curseConditionId);
			};
		break;
		default:
		break;
	};
};

function RoguelikeSpecialConditionEffect(mover, phase, target = {}, damage = "MISS") {
	
	var moverConditionAlll = mover.faction === "player" ? 
				$gameSystem.partyMemberConditionContent.findIndex(x => x.name === mover.name) >= 0 ?  
				$gameSystem.partyMemberConditionContent.find(x => x.name === mover.name).condition : 
				[] : mover.faction === "enemy" ? 
				$gameSystem.EnemyInformation[mover.enemyIndex].condition : [];
	var targetConditionAll = target.faction === "player" ? 
				$gameSystem.partyMemberConditionContent.findIndex(x => x.name === target.name) >= 0 ?  
				$gameSystem.partyMemberConditionContent.find(x => x.name === target.name).condition : 
				[] : target.faction === "enemy" ? 
				$gameSystem.EnemyInformation[target.enemyIndex].condition : [];
	var moverInformation = mover.faction === "player" ? 
				$gameParty.members().find(x => x._actorId === mover.actorId) : 
				$gameSystem.EnemyInformation[mover.enemyIndex];
	var conditionId = 0;
	var conditionLevel = 0;
	// var DBC = "DBC";
	var Equiping = "Equiping";
	var BM = "BM";
	var BS = "BS";
	var DC = "DC";
	
	console.log("RoguelikeSpecialConditionEffect checking");
	console.log("phase = ");
	console.log(phase);
	console.log("mover = ");
	console.log(mover);
				
	//判定被攻擊目標身上所有特殊狀態
	if ( !!targetConditionAll ) {
		targetConditionAll.forEach(function(eachCondition) {
			conditionId = eachCondition.conditionId;
			conditionLevel = eachCondition.level;
			switch (conditionId) {
				//擴散毒性的防具特效
				case 28:
					switch (phase) {
						case DC:
						//condition 50 = 憤怒毒性
							if ( damage != "MISS" ) { RoguelikeBattleAddCondition(target, 50); };
						break;
						default:
						break;
					};
				break;
				//凍齡的武器特效
				case 30:
					switch (phase) {
						case DC:
							//condition 52 = 寒風過境
							if ( damage != "MISS" && !!target && target != {} ) { RoguelikeBattleAddCondition(mover, 52); };
						break;
						default:
						break;
					};
				break;
				//喜歡嘗鮮的防具特效
				case 34:
					switch (phase) {
						case DC:
							if ( damage != "MISS" ) { RoguelikeBattleVanpireAttack(target, 2, conditionLevel, 3); };
						break;
						default:
						break;
					};
				break;
				//沉迷研究的武器特效
				case 41:
					switch (phase) {
						case DC:
							//condition 57 = 偽裝血液
							if ( damage != "MISS" && !!target && target != {} ) {
								for ( var i = 0; i < damage; i++ ) {
									RoguelikeBattleAddCondition(target, 57);
								};
								damage = 0;
								return damage;
							};
						break;
						default:
						break;
					};
				break;
				//超過30歲的防具特效
				case 44:
					switch (phase) {
						case DC:
							if ( damage != "MISS" ) {
								if ( mover.faction === "player" ) {
									moverInformation._hp -= (3 * conditionLevel);
								} else {
									moverInformation.hp -= (3 * conditionLevel);
								};
								RoguelikeDamageRestore(mover.eventId, (3 * conditionLevel));
							};
						break;
						default:
						break;
					};
				break;
				//虛弱毒性
				case 49:
					switch (phase) {
						case DC:
							if ( damage != "MISS" ) { RoguelikeBattleRemoveCondition(target, 49); };
						break;
						default:
						break;
					};
				break;
				default:
				break;
			};
		});
	};
	
	//判定行動者身上所有特殊狀態
	moverConditionAlll.forEach(function(eachCondition) {
		conditionId = eachCondition.conditionId;
		conditionLevel = eachCondition.level;
		switch (conditionId) {
			//弒神詛咒
			case 18:
				switch (phase) {
					case BS:
						var _allCurseConditionId = [4, 19, 20, 21];//[4中毒][19暈眩][20挑釁][21神智不清]
						var _curseConditionId = _allCurseConditionId[Math.floor(Math.random()*_allCurseConditionId.length)];
						if (_faction === "player") {
							RoguelikeBattleAddCondition(_actor, _curseConditionId);
						} else if (_faction === "enemy"){
							RoguelikeBattleAddCondition(_actor, _curseConditionId);
						};
					break;
					default:
					break;
				};
			break;
			//擴散毒性的武器特效
			case 27:
				switch (phase) {
					case DC:
						//condition 49 = 虛弱毒性
						if ( damage != "MISS" && !!target && target != {} ) { RoguelikeBattleAddCondition(target, 49); };
					break;
					default:
					break;
				};
			break;
			//凍齡的武器特效
			case 29:
				switch (phase) {
					case DC:
						//condition 51 = 寒風過境
						if ( damage != "MISS" && !!target && target != {} ) { RoguelikeBattleAddCondition(target, 51); };
					break;
					default:
					break;
				};
			break;
			//為好友舉盾的武器特效
			case 31:
				switch (phase) {
					case BS:
						//condition 53 = 守護之力
						RoguelikeBattleAddCondition(mover, 53);
					break;
					default:
					break;
				};
			break;
			//喜歡嘗鮮的武器特效
			case 33:
				switch (phase) {
					case DC:
						if ( damage != "MISS" && !!moverInformation ) {
							if ( mover.faction === "player" ) {
								moverInformation._hp += 5;
							} else {
								moverInformation.hp += 5;
							};
							RoguelikeDamageRestore(mover.eventId, 5);
						};
					break;
					default:
					break;
				};
			break;
			//瘋瘋癲癲的防具特效
			case 36:
				switch (phase) {
					case BS:
						var _allCurseConditionId = [54, 55];//[54 虛弱詛咒][55 狂暴詛咒]
						var conditionRate = 60 - (conditionLevel * 10);
						var _curseConditionId = Math.floor(Math.random()*100) >= conditionRate ? 
									_allCurseConditionId[0] : _allCurseConditionId[1];
						RoguelikeBattleAddCondition(mover, _curseConditionId);
					break;
					default:
					break;
				};
			break;
			//忠誠的武器特效
			case 39:
				switch (phase) {
					case DC:
						if ( damage != "MISS" && !!moverInformation ) {
							console.log("moverInformation = ");
							console.log(moverInformation);
							if ( mover.faction === "player" ) {
								moverInformation._hp += 3;
							} else {
								moverInformation.hp += 3;
							};
							RoguelikeDamageRestore(mover.eventId, 3);
						};
					break;
					default:
					break;
				};
			break;
			//忠誠的防具特效
			case 40:
				switch (phase) {
					case BS:
						//condition 56 = 聖光護體
						RoguelikeBattleAddCondition(mover, 56);
					break;
					default:
					break;
				};
			break;
			//沉迷研究的防具特效
			case 42:
				switch (phase) {
					case BM:
						console.log("123");
						RoguelikeBattleMadScientistMistSnake(mover, 3 + conditionLevel-1);
					break;
					default:
					break;
				};
			break;
			//超過30歲的武器特效
			case 43:
				switch (phase) {
					case DC:
						//condition 58 = 殘餘火焰
						if ( damage != "MISS" && !!target && target != {} ) {
							for (var i = 0; i < Math.floor(damage / 2); i++ ) {
								RoguelikeBattleAddCondition(target, 58);
							};
						};
					break;
					default:
					break;
				};
			break;
			//緊張兮兮的防具特效
			case 46:
				switch (phase) {
					case DC:
						//condition 59 = 信心漸增
						RoguelikeBattleAddCondition(mover, 59);
					break;
					default:
					break;
				};
			break;
			//有決心的武器特效
			case 47:
				switch (phase) {
					case Equiping:
						//condition 62 = 團結革命
						RoguelikeBattleRemoveCondition(mover, 62);
						for ( var i = 0; i < Math.floor($gameParty.members().length/2); i++ ) {
							RoguelikeBattleAddCondition(mover, 62);
						};
					break;
					default:
					break;
				};
			break;
			//憤怒毒性
			case 50:
				switch (phase) {
					case DC:
						if ( damage != "MISS" ) { RoguelikeBattleRemoveCondition(mover, 50); };
					break;
					default:
					break;
				};
			break;
			//狂暴詛咒
			case 55:
				switch (phase) {
					case DC:
						if ( damage != "MISS" && !!moverInformation ) {
							if ( mover.faction === "player" ) {
								moverInformation._hp -= 5;
							} else {
								moverInformation.hp -= 5;
							};
							RoguelikeDamageRestore(mover.eventId, -5);
						};
					break;
					default:
					break;
				};
			break;
			//團結革命
			case 62:
				switch (phase) {
					case Equiping:
						//condition 47 = 有決心的武器特效
						//穿戴裝備時若角色身上沒有condition 47，則移除此狀態。
						console.log("moverConditionAlll = ");
						console.log(moverConditionAlll);
						if ( !moverConditionAlll.some(x => x.conditionId === 47) ) {
							RoguelikeBattleRemoveCondition(mover, 62);
						};
					break;
					default:
					break;
				};
			break;
			default:
			break;
		};
	});
	return damage;
};

//角色行動前，狀態作用計算
function TurnStyleConditionCalculating(actor) {
	var _actor = actor;
	var _actorConditionIndex = 0;
	var _conditionNote = [];
	var _enemyInCurrentRegion = [];
	var _conditionRemoveList = [];
	
	//角色為玩家的情況下，計算每一個狀態的回合數
	if ( _actor.faction === "player" ) {
		_conditionContent = $gameSystem.partyMemberConditionContent.find(x => x.name === _actor.name);
		_actorConditionIndex = $gameSystem.partyMemberConditionContent.findIndex(x => x.name === _actor.name);
		if ( _conditionContent != -1 && _conditionContent != undefined && _conditionContent != null ) {
			_conditionContent.condition.forEach(function(eachCondition) {
				if ( eachCondition.timeOrTurn === "turn" ) {
					if ( eachCondition.effectTurnLeft > 0 ) {
						eachCondition.effectTurnLeft -= 1;
						_conditionNote = TurnStyleConditionNote(eachCondition.conditionId);
						TurnStyleConditionEffect(_actor.faction, _conditionContent.actorId, _conditionNote, eachCondition);
					};
					if ( eachCondition.effectTurnLeft <= 0 ) {
						_conditionRemoveList.push([$gameSystem.partyMemberConditionContent[_actorConditionIndex], eachCondition.conditionId]);
						// console.log("eachCondition.effectTurnLeft <= 0, _conditionContent.conditionId = " + eachCondition.conditionId);
						// $gameActors.actor(_conditionContent.actorId).removeState(eachCondition.conditionId);
						// $gameSystem.partyMemberConditionContent[_actorConditionIndex].condition.splice($gameSystem.partyMemberConditionContent[_actorConditionIndex].condition.findIndex(x => x.conditionId === eachCondition.conditionId), 1);
					};
				};
			});
			for ( i = 0; i < _conditionRemoveList.length; i++) {
				RoguelikeBattleRemoveCondition(_conditionRemoveList[i][0], _conditionRemoveList[i][1]);
			};
		};
	//角色為敵方的情況下，計算每一個狀態的回合數
	} else if ( _actor.faction === "enemy" ) {
		if ( $gameSystem.EnemyInformation != undefined && $gameSystem.EnemyInformation != null ) {
			_enemyInCurrentRegion = $gameSystem.EnemyInformation.filter(x => x.regionId === $gameSystem.currentRegion);
		} else {
			return false;
		};
		_conditionContent = $gameSystem.EnemyInformation.find(x => x.enemyIndex === _actor.enemyIndex);
		_actorConditionIndex = $gameSystem.EnemyInformation.findIndex(x => x.enemyIndex === _actor.enemyIndex);
		if ( _conditionContent != -1 && _conditionContent != undefined && _conditionContent != null ) {
			_conditionContent.condition.forEach(function(eachCondition) {
				if ( eachCondition.timeOrTurn === "turn" ) {
					if ( eachCondition.effectTurnLeft > 0 ) {
						eachCondition.effectTurnLeft -= 1;
						_conditionNote = TurnStyleConditionNote(eachCondition.conditionId);
						TurnStyleConditionEffect(_actor.faction, _actorConditionIndex, _conditionNote, eachCondition);
					};
					if ( eachCondition.effectTurnLeft <= 0 ) {
						_conditionRemoveList.push([$gameSystem.EnemyInformation[_actorConditionIndex], eachCondition.conditionId]);
						// RoguelikeBattleRemoveCondition($gameSystem.EnemyInformation[_actorConditionIndex], eachCondition.conditionId);
					};
				};
			});
			for ( i = 0; i < _conditionRemoveList.length; i++) {
				RoguelikeBattleRemoveCondition(_conditionRemoveList[i][0], _conditionRemoveList[i][1]);
			};
		};
	} else {
		console.log("RoguelikeBattling.conditionCalculating function error");
		console.log("faction of actor is not player nor enemy");
	};
};

//讀取回合制狀態內容
function TurnStyleConditionNote(conditionIndex) {
	var effectTurnMark = "effect turn: ";
	var _EWMSearcher = /<(?:EWM.+?)>/g;
	
	_conditionNote = $dataStates[conditionIndex].note;
	if ( /\S/.test(_conditionNote) && _conditionNote.includes(effectTurnMark) ) {
		
		return _conditionNote.match(_EWMSearcher);
	};
	console.log("function TurnStyleConditionNote message.\n _conditionNote doesn't includes any turnStyle effect.");
	return [];
};

//回合制狀態數值計算
function TurnStyleConditionEffect(faction, actorId, conditionNote, conditionContent) {
	var _conditionNote = conditionNote;
	var _faction = faction;
	var _actorId = actorId;
	var _priorityIndex = 0;
	var _conditionNoteCharacterValue = "character value: ";
	var _conditionNoteNoMove = "noMove";
	var _conditionNoteState = "";
	var _conditionNoteMath = "";
	var _conditionNoteValue = "";
	var _actor = {};
	var _conditionLevel = conditionContent.level;
	var actorCurrentValue = {
		hp: 0,
		mhp: 0,
		atk: 0,
		agi: 0,
		def: 0,
		movable: true,
	};
	// console.log("_conditionNote = ");
	// console.log(_conditionNote);
	if ( typeof _conditionNote != "object" || _conditionNote === null || _conditionNote === undefined )	{ return console.log("function TurnStyleConditionEffect error.\n _conditionNote is not object"); };
	for ( i = 0; i < _conditionNote.length; i++) {
		// if ( !_conditionNote[i].includes(_conditionNoteCharacterValue) || !_conditionNote[i].includes(_EWMSearcher) ) { continue; };
		//若狀態效果是增加角色數值，執行之
		if ( _conditionNote[i].includes(_conditionNoteCharacterValue) ) {
			//取得要作用的能力值項目
			_conditionNoteState = _conditionNote[i].split(_conditionNoteCharacterValue).pop().split(" ")[0];
			//取得數學運算元
			_conditionNoteMath = _conditionNote[i].split(_conditionNoteCharacterValue).pop().split(" ")[1].split("")[0];
			//取得數值
			_conditionNoteValue = _conditionNote[i].split(_conditionNoteCharacterValue).pop().split(" ")[1].split("");
			//去頭(去掉數學運算元)
			_conditionNoteValue.shift();
			//去尾(去掉後方的括號【>】)
			_conditionNoteValue.pop();
			//重新轉為字串、轉為浮點數
			_conditionNoteValue = parseFloat(_conditionNoteValue.join(""));
			//計算層數
			_conditionNoteValue = _conditionNoteValue * _conditionLevel;
			switch ( _conditionNoteMath ) {
				case ("+"):
					actorCurrentValue[_conditionNoteState] += _conditionNoteValue;
					break;
				case ("-"):
					actorCurrentValue[_conditionNoteState] -= _conditionNoteValue;
					break;
				case ("*"):
					actorCurrentValue[_conditionNoteState] *= _conditionNoteValue;
					break;
				case ("/"):
					actorCurrentValue[_conditionNoteState] -= _conditionNoteValue;
					break;
				default:
					actorCurrentValue[_conditionNoteState] += _conditionNoteValue;
					break;
			};
		//其他特殊效果
		} else {
			actorCurrentValue.movable = _conditionNote[i].includes(_conditionNoteNoMove) ? false : actorCurrentValue.movable;
		};
	};
	if ( _faction === "player" ) {
		_actor = $gameParty.members()[$gameParty.members().findIndex(x => x._actorId === _actorId)];
		_eventId = $gameSystem.battleMembersPriority.find(x => x.name === _actor._name).eventId;
		_priorityIndex = $gameSystem.battleMembersPriority.findIndex(x => x.name === _actor._name);
		_actor._hp += actorCurrentValue.hp;
	} else if ( _faction === "enemy" ) {
		_actor = $gameSystem.EnemyInformation[_actorId];
		_eventId = $gameSystem.EnemyInformation[_actorId].eventId;
		_priorityIndex = $gameSystem.battleMembersPriority.findIndex(x => x.eventId === _eventId);
		// RoguelikeDamageRestore(_eventId, parseInt(actorCurrentValue.hp));
	};
	// console.log("actorCurrentValue.hp = ");
	// console.log(actorCurrentValue.hp);
	//顯示血量增減
	if (actorCurrentValue.hp != 0) { RoguelikeDamageRestore(_eventId, parseInt(actorCurrentValue.hp)); };
	//紀錄角色本回合是否可以行動
	$gameSystem.battleMembersPriority[_priorityIndex].movable = actorCurrentValue.movable;
};

//附加狀態
function RoguelikeBattleAddCondition(actor, _conditionId) {
	var faction = actor.faction;
	var targetActorId = 0;
	var targetEnemyNumber = 0;
	var _repeatCheck = -1;
	var _conditionNote = $dataStates[_conditionId].note;
	var effectTimeMark = "effect time: ";
	var effectTurnMark = "effect turn: ";
	var buffMark = "buff";
	var debuffMark = "debuff";
	var stackableMark = "stackable";
	
	
	if ( faction === "player" ) {
		targetActorId = $gameSystem.partyMemberConditionContent.findIndex(x => x.actorId === actor.actorId);
		if ( targetActorId < 0 ) { return false; };
		_repeatCheck = $gameSystem.partyMemberConditionContent[targetActorId].condition.findIndex(x => x.conditionId === _conditionId);

		console.log("RoguelikeBattleAddCondition");
		console.log("actor = ");
		console.log(actor);
		console.log("_conditionId = ");
		console.log(_conditionId);
		console.log("_repeatCheck = ");
		console.log(_repeatCheck);
		console.log("conditionStyle = ");
		console.log(_conditionNote.includes(debuffMark) ? "debuff" : _conditionNote.includes(buffMark) ? "buff" : "unknow");
		if ( _repeatCheck === -1 ) {
			// $gameActors.actor(actor.actorId).addState(_conditionId);
			$gameSystem.partyMemberConditionContent[targetActorId].condition.push({
				conditionId: _conditionId,
				conditionStyle: _conditionNote.includes(debuffMark) ? "debuff" : _conditionNote.includes(buffMark) ? "buff" : "unknow",
				timeOrTurn: _conditionNote.includes(effectTimeMark) ? "time" : _conditionNote.includes(effectTurnMark) ? "turn" : "unknow",
				effectTime: _conditionNote.includes(effectTimeMark) ? parseFloat(_conditionNote.split(effectTimeMark).pop().split(" ")) : 999,
				effectTimeLeft: 0,
				effectTimeCounter: 0,
				effectTimeCounting: false,
				effectTurn: _conditionNote.includes(effectTurnMark) ? parseInt(_conditionNote.split(effectTurnMark).pop().split(" ")) : 999,
				effectTurnLeft: _conditionNote.includes(effectTurnMark) ? parseInt(_conditionNote.split(effectTurnMark).pop().split(" ")) : 999,
				level: 1,
			});
		} else {
			if ( _conditionNote.includes(effectTimeMark) ) {
				$gameSystem.partyMemberConditionContent[targetActorId].condition[_repeatCheck].effectTimeLeft = 0;
				$gameSystem.partyMemberConditionContent[targetActorId].condition[_repeatCheck].effectTimeCounter = 0;
				$gameSystem.partyMemberConditionContent[targetActorId].condition[_repeatCheck].effectTimeCounting = false;
			} else if ( _conditionNote.includes(effectTurnMark) ) {
				$gameSystem.partyMemberConditionContent[targetActorId].condition[_repeatCheck].effectTurnLeft = parseInt(_conditionNote.split(effectTurnMark).pop().split(" "));
			} else {
				// console.log("RoguelikeBattleAddCondition function message");
				// console.log("Condition is unknow about timeOrTurn");
			};
			if ( _conditionNote.includes(stackableMark) ) {
				$gameSystem.partyMemberConditionContent[targetActorId].condition[_repeatCheck].level++;
			};
		};
	} else if ( faction === "enemy" ) {
		targetEnemyNumber = $gameSystem.EnemyInformation.findIndex(x => x.enemyIndex === actor.enemyIndex);
		_repeatCheck = $gameSystem.EnemyInformation[targetEnemyNumber].condition.findIndex(x => x.conditionId === _conditionId);
		if ( _repeatCheck === -1 ) {
			$gameSystem.EnemyInformation[targetEnemyNumber].condition.push({
				conditionId: _conditionId,
				conditionStyle: _conditionNote.includes(debuffMark) ? "debuff" : _conditionNote.includes(buffMark) ? "buff" : "unknow",
				timeOrTurn: _conditionNote.includes(effectTimeMark) ? "time" : _conditionNote.includes(effectTurnMark) ? "turn" : "unknow",
				effectTime: _conditionNote.includes(effectTimeMark) ? parseFloat(_conditionNote.split(effectTimeMark).pop().split(" ")) : 999,
				effectTimeLeft: 0,
				effectTimeCounter: 0,
				effectTimeCounting: false,
				effectTurn: _conditionNote.includes(effectTurnMark) ? parseInt(_conditionNote.split(effectTurnMark).pop().split(" ")) : 999,
				effectTurnLeft: _conditionNote.includes(effectTurnMark) ? parseInt(_conditionNote.split(effectTurnMark).pop().split(" ")) : 999,
				level: 1,
			});
		} else {
			if ( _conditionNote.includes(effectTimeMark) ) {
				$gameSystem.EnemyInformation[targetEnemyNumber].condition[_repeatCheck].effectTimeLeft = 0;
				$gameSystem.EnemyInformation[targetEnemyNumber].condition[_repeatCheck].effectTimeCounter = 0;
				$gameSystem.EnemyInformation[targetEnemyNumber].condition[_repeatCheck].effectTimeCounting = false;
			} else if ( _conditionNote.includes(effectTurnMark) ) {
				$gameSystem.EnemyInformation[targetEnemyNumber].condition[_repeatCheck].effectTurnLeft = parseInt(_conditionNote.split(effectTurnMark).pop().split(" "));
			} else {
				console.log("RoguelikeBattleAddCondition function message");
				console.log("Condition is unknow about timeOrTurn");
			};
			if ( _conditionNote.includes(stackableMark) ) {
				$gameSystem.EnemyInformation[targetEnemyNumber].condition[_repeatCheck].level++;
			};
		};
		// console.log("$gameSystem.EnemyInformation = ");
		// console.log($gameSystem.EnemyInformation);
	} else {
		console.log("RoguelikeBattleAddCondition function error");
		console.log("faction of actor is not player nor enemy");
	};
};

//移除狀態
function RoguelikeBattleRemoveCondition(actor, _conditionId) {
	var _actor = {};
	var targetEnemy = {};
	var faction = actor.faction
	var _conditionNote = $dataStates[_conditionId].note;
	var effectTimeMark = "effect time: ";
	var effectTurnMark = "effect turn: ";
	var buffMark = "buff";
	var debuffMark = "debuff";
	var _conditionIndex = -1;

	if ( faction === "player" ) {
		_actor = $gameSystem.partyMemberConditionContent.find(x => x.actorId === actor.actorId);
		_conditionIndex = _actor.condition.findIndex(x => x.conditionId === _conditionId);
		console.log("RoguelikeBattleRemoveCondition");
		console.log("_actor = ");
		console.log(_actor);
		for ( var i = 0; i < _actor.condition.length; i++ ) {
			console.log("i = ");
			console.log(i);
			console.log("_actor.condition[i] = ");
			console.log(_actor.condition[i]);
		};
		console.log("_conditionId = ");
		console.log(_conditionId);
		console.log("_conditionIndex = ");
		console.log(_conditionIndex);
		// $gameActors.actor(_actor.actorId).removeState(_conditionId);
		if ( _conditionIndex !== -1 ) {
			_actor.condition.splice(_conditionIndex, 1);
		};
	} else if ( faction === "enemy" ) {
		targetEnemy = $gameSystem.EnemyInformation.find(x => x.enemyIndex === actor.enemyIndex);
		_conditionIndex = targetEnemy.condition.findIndex(x => x.conditionId === _conditionId);
		if ( _conditionIndex !== -1 ) {
			targetEnemy.condition.splice(_conditionIndex, 1);
		};
	} else {
		console.log("RoguelikeBattleRemoveCondition function error");
		console.log("faction of actor is not player nor enemy");
	};
};

//狀態回合數增減
function RoguelikeBattleConditionTurnControl(actor, conditionId, turnValue) {
	var faction = actor.faction;
	var _conditionIndex = 0;
	
	if ( faction === "player" ) {
	} else if ( faction === "enemy" ) {
		_conditionIndex = actor.condition.findIndex(x => x.conditionId === conditionId);
		actor.condition[_conditionIndex].effectTurnLeft += turnValue;
	};
};