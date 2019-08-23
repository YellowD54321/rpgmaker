function RoguelikeBloodyEquipmentInitialize() {
	$gameSystem.roguelikeWeapons = $dataWeapons;
	$gameSystem.roguelikeArmors = $dataArmors;
	$gameSystem.roguelikeWeaponsOriginal = Object.assign([], $dataWeapons.filter(x => !!x && x.name != ""));
	$gameSystem.roguelikeArmorsOriginal = Object.assign([], $dataArmors.filter(x => !!x && x.name != ""));
	$gameSystem.roguelikeAffixes = [];
	$dataClasses.forEach(function(eachClass, classIndex) {
		if ( eachClass != null && eachClass != undefined && eachClass.name != "" ) {
			$gameSystem.roguelikeAffixes.push({
				name: eachClass.name,
				classId: classIndex,
			});
		};
	});
	
	RoguelikeBloodyEquipmentExcludeAffix();

	console.log("$gameSystem.roguelikeWeapons = ");
	console.log($gameSystem.roguelikeWeapons);
	console.log("$gameSystem.roguelikeArmors = ");
	console.log($gameSystem.roguelikeArmors);
	console.log("$gameSystem.roguelikeAffixes = ");
	console.log($gameSystem.roguelikeAffixes);
		
	for ( var i = 2; i <= 12; i++ ) {
		var bloodyEquip = RoguelikeBloodyEquipmentCreatItem(i, "weapon", 11);
		RoguelikeBloodyEquipmentGainItem(bloodyEquip);
		var bloodyEquip = RoguelikeBloodyEquipmentCreatItem(i, "armor", 11);
		RoguelikeBloodyEquipmentGainItem(bloodyEquip);
	};
	
		var bloodyEquip = RoguelikeBloodyEquipmentCreatItem(5, "weapon", 21);
		RoguelikeBloodyEquipmentGainItem(bloodyEquip);
};

/*
actorClassId = 9999為隨機詞綴
*/
function RoguelikeBloodyEquipmentCreatItem(actorClassId, basicEquipStyle, basicEquipId) {
	RoguelikeBloodyEquipmentExcludeAffix();
	var _actorClassId = actorClassId;
	var _basicItemInformation = !!basicEquipId ? basicEquipStyle === "weapon" ? 
															$gameSystem.roguelikeWeaponsOriginal.find(x => x.id === basicEquipId) : 
															$gameSystem.roguelikeArmorsOriginal.find(x => x.id === basicEquipId) : 
															RoguelikeBloodyEquipmentRandomEquip(basicEquipStyle);
	var _equipmentStyle = !!basicEquipStyle ? basicEquipStyle : 
												RoguelikeBloodyEquipmentIsWeapon(_basicItemInformation) ? "weapon" : 
												RoguelikeBloodyEquipmentIsArmor(_basicItemInformation) ? "armor" : "unknow";
	console.log("_basicItemInformation = ");
	console.log(_basicItemInformation);
	console.log("_equipmentStyle = ");
	console.log(_equipmentStyle);
	var _newItemInformation = Object.assign({}, _basicItemInformation);
	var _affix = !!_actorClassId && _actorClassId != 9999 ? Object.assign([], $gameSystem.roguelikeAffixes.find(x => x.classId === _actorClassId)) : 
																Object.assign([], $gameSystem.roguelikeAffixes[Math.floor(Math.random()*$gameSystem.roguelikeAffixes.length)]);

	console.log("$gameSystem.roguelikeAffixes = ");
	console.log($gameSystem.roguelikeAffixes);
	console.log("_affix = ");
	console.log(_affix);
	_newItemInformation.originalId = _newItemInformation.id;
	_newItemInformation.id = _equipmentStyle === "weapon" ? 
													$gameSystem.roguelikeWeapons.length : 
													$gameSystem.roguelikeArmors.length;
	_newItemInformation.name = _affix.name + _newItemInformation.name;
	_newItemInformation.description += RoguelikeBloodyEquipmentDescriptionList(_affix.classId, _equipmentStyle);
	_newItemInformation.note += RoguelikeBloodyEquipmentNoteList(_affix.classId, _equipmentStyle, _newItemInformation.wtypeId);
	
	if ( _equipmentStyle === "weapon" ) {
		$gameSystem.roguelikeWeapons.push(_newItemInformation);
		return $gameSystem.roguelikeWeapons[$gameSystem.roguelikeWeapons.length-1];
	} else {
		$gameSystem.roguelikeArmors.push(_newItemInformation);
		return $gameSystem.roguelikeArmors[$gameSystem.roguelikeArmors.length-1];
	};
};

function RoguelikeBloodyEquipmentIsWeapon(item) {
	return item && $dataWeapons.contains(item);
};

function RoguelikeBloodyEquipmentIsArmor(item) {
	return item && $dataArmors.contains(item);
};

function RoguelikeBloodyEquipmentRandomEquip(randomStyle = "random") {
	var _randomStyle = randomStyle != "random" ? 
											randomStyle : 
											Math.floor(Math.random()*2) >= 1 ? "weapon" : "armor";
	var randomEquip = _randomStyle === "weapon" ? 
										$gameSystem.roguelikeWeaponsOriginal[Math.floor(Math.random()*$gameSystem.roguelikeWeaponsOriginal.length)] : 
										$gameSystem.roguelikeArmorsOriginal[Math.floor(Math.random()*$gameSystem.roguelikeArmorsOriginal.length)];
	return randomEquip;
};

function RoguelikeBloodyEquipmentExcludeAffix() {
	var _currentPartyMember = $gameParty.members();
	$gameSystem.roguelikeAffixes = [];
	$dataClasses.forEach(function(eachClass, classIndex) {
		if ( !!eachClass && eachClass.name != "" ) {
			$gameSystem.roguelikeAffixes.push({
				name: eachClass.name,
				classId: classIndex,
			});
		};
	});
	_currentPartyMember.forEach(function(eachMember) {
		if ( $gameSystem.roguelikeAffixes.some(x => x.classId === eachMember._classId) ) {
			$gameSystem.roguelikeAffixes.splice($gameSystem.roguelikeAffixes.findIndex(x => x.classId === eachMember._classId), 1);
		// } else if ( !$gameSystem.roguelikeAffixes.some(x => x.classId === eachMember._classId) ) {
			// $gameSystem.roguelikeAffixes.push({
				// name: $dataClasses[eachMember._classId].name,
				// classId: eachMember._classId,
			// });
		};
	});
};

function RoguelikeBloodyEquipmentGainItem(item) {
	$gameParty.gainItem(item, 1);
};

function RoguelikeBloodyEquipmentNoteEffect(item, actor) {
	if ( !item ) { return false; };
	var _note = item.note;
	var _actor = actor;
	var _getConditionMark = "getCondition: ";
	var _noteSearcher = /<(?:getCondition.+?)>/g;
	var _conditionId = 0;
	
	if ( _note === null || _note === undefined || _note === "" ) { return false; };

	if ( _note.includes(_getConditionMark) ) {
		for ( i = 0; i < _note.match(_noteSearcher).length; i++) {
			//取得狀態編號
			_conditionId = _note.match(_noteSearcher)[i].split(_getConditionMark).pop().split(" ")[0];
			//去尾(去掉後方的括號【>】)
			_conditionId = _conditionId.split("");
			_conditionId.pop();
			//轉為數值
			_conditionId = parseInt(_conditionId.join(""));
			console.log("RoguelikeBloodyEquipmentNoteEffect");
			console.log("_actor = ");
			console.log(_actor);
			// console.log("_conditionId = ");
			// console.log(_conditionId);
			RoguelikeBattleAddCondition(_actor, _conditionId);
		};
	};
};

function RoguelikeBloodyEquipmentRemoveCondition(item, actor) {
	if ( !item ) { return false; };
	var _equipmentStyle = item._dataClass;
	var _actor = $gameSystem.partyMemberConditionContent.find(x => x.actorId === actor._actorId);
	var weaponMark = "weapon";
	var aromorMark = "armor";
	var _equipment = {};
	var _note = "";
	var _getConditionMark = "getCondition: ";
	var _noteSearcher = /<(?:getCondition.+?)>/g;
	var _conditionId = 0;
	
	if ( _equipmentStyle === weaponMark ) {
		_equipment = $dataWeapons[item._itemId];
	} else if ( _equipmentStyle === aromorMark ) {
		_equipment = $dataArmors[item._itemId];
	};
	if ( !_equipment ) { return false; };
	_note = _equipment.note;
	if ( _note === null || _note === undefined || _note === "" ) { return false; };

	if ( _note.includes(_getConditionMark) ) {
		for ( i = 0; i < _note.match(_noteSearcher).length; i++) {
			//取得狀態編號
			_conditionId = _note.match(_noteSearcher)[i].split(_getConditionMark).pop().split(" ")[0];
			//去尾(去掉後方的括號【>】)
			_conditionId = _conditionId.split("");
			_conditionId.pop();
			//轉為數值
			_conditionId = parseInt(_conditionId.join(""));
			RoguelikeBattleRemoveCondition(_actor, _conditionId);
		};
	};
	
};

function RoguelikeBloodyEquipmentDescriptionList(classId, equipmentStyle) {
	var _classId = classId;
	var _equipmentStyle = equipmentStyle;
	var _description = "";
	var weaponMark = "weapon";
	var aromorMark = "armor";
	var _characterName = "";
	
	if ( _equipmentStyle != weaponMark && _equipmentStyle != aromorMark ) { return ""; };
	
	//通常情況下actorId與classId相同
	_characterName = $gameActors.actor(_classId)._nickname;
	
	switch(_classId) {
		//擴散毒性的
		case 2:
			_description = 
				_equipmentStyle === weaponMark ?
				"染上了" + _characterName + "的血，攻擊命中時對被攻擊者施放狀態「虛弱毒性」。\n虛弱毒性：角色防禦歸零。持續3回合。受到攻擊時解除狀態。"
				 : _equipmentStyle === aromorMark ? 
				"染上了" + _characterName + "的血，被攻擊時令裝備者獲得狀態「憤怒毒性」。\n憤怒毒性：角色下次基本攻擊力增加5。攻擊時解除毒性效果。(可疊加最多3層)"
				 : "";
		break;
		//凍齡的
		case 3:
			_description = 
				_equipmentStyle === weaponMark ?
				"染上了" + _characterName + "的血，攻擊時對被攻擊者施放狀態「寒風過境」。\n寒風過境：角色agi-5，持續兩回合。(可疊加最多兩層)"
				: _equipmentStyle === aromorMark ? 
				"染上了" + _characterName + "的血，被攻擊時對攻擊者施放狀態「寒冷氣息」。\n寒冷氣息：角色agi-3，持續兩回合。(可疊加最多6層)"
				: "";
		break;
		//為好友舉盾的
		case 4:
			_description = 
				_equipmentStyle === weaponMark ?
				"染上了" + _characterName + "的血，行動時角色獲得「守護之力」狀態。\n守護之力：挑釁並且def+5。持續5回合。受到攻擊時解除狀態效果。\n挑釁：具有此效果的角色將會不限距離優先被攻擊。"
				: _equipmentStyle === aromorMark ? 
				"染上了" + _characterName + "的血，使裝備者def+3。(可疊加)"
				: "";
		break;
		//緊張兮兮的
		case 5:
			_description = 
				_equipmentStyle === weaponMark ?
				"染上了" + _characterName + "的血，若武器為劍或斧：\n使裝備者攻擊距離增加2。\n若武器為弓或權杖：\n使裝備者agi+10。"
				: _equipmentStyle === aromorMark ? 
				"染上了" + _characterName + "的血，攻擊時使攻擊者獲得「信心漸增」狀態。\n信心漸增：角色agi+2，持續兩回合。戰鬥結束後消除狀態。(可疊加)"
				: "";
		break;
		//斬碎岩石的
		case 6:
			_description = 
				_equipmentStyle === weaponMark ?
				"染上了" + _characterName + "的血，使此把武器atk*2"
				: _equipmentStyle === aromorMark ? 
				"染上了" + _characterName + "的血，使裝備者atk+4。(可疊加)"
				: "";
		break;
		//超過30歲的
		case 7:
			_description = 
				_equipmentStyle === weaponMark ?
				"染上了" + _characterName + "的血，攻擊時附加「殘餘火焰」狀態，層數為該次攻擊傷害的一半。\n殘餘火焰：角色行動時受到傷害。傷害為此狀態的層數。"
				: _equipmentStyle === aromorMark ? 
				"染上了" + _characterName + "的血，被攻擊時使攻擊者受到3點傷害。(可疊加)"
				: "";
		break;
		//忠誠的
		case 8:
			_description = 
				_equipmentStyle === weaponMark ?
				"染上了" + _characterName + "的血，使裝備者atk+3、def+2，攻擊時攻擊者hp+3。"
				: _equipmentStyle === aromorMark ? 
				"染上了" + _characterName + "的血，進入戰鬥時獲得「聖光護體」狀態。\n聖光護體：開始行動時hp+7，持續兩回合。戰鬥結束後消除狀態。(可疊加)"
				: "";
		break;
		//沉迷研究的
		case 9:
			_description = 
				_equipmentStyle === weaponMark ?
				"染上了" + _characterName + "的血，裝備者獲得「偽裝血液」狀態。\n偽裝血液：角色被攻擊時並不會立即計算傷害，而是等到角色行動時才計算。"
				: _equipmentStyle === aromorMark ? 
				"染上了" + _characterName + "的血，裝備者獲得「迷霧之蛇」狀態。\n迷霧之蛇：角色攻擊前會在角色位置3x3範圍內釋放蒸氣。蒸氣範圍內友方角色遭到攻擊時，會有20%閃過攻擊。(可疊加，疊加時增加蒸氣範圍。)"
				: "";
		break;
		//有決心的
		case 10:
			_description = 
				_equipmentStyle === weaponMark ?
				"染上了" + _characterName + "的血，裝備者獲得「團結革命」狀態。\n團結革命：使角色atk+4、def+2、agi-1。(可疊加。除了裝備者以外，隊伍中每兩位隊員使狀態增加一層。)"
				: _equipmentStyle === aromorMark ? 
				"染上了" + _characterName + "的血，使裝備者獲得「堅持到底」狀態。\n堅持到底：若角色行動後仍有剩餘步數，角色會接著攻擊而不需等待下回合。"
				: "";
		break;
		//瘋瘋癲癲的
		case 11:
			_description = 
				_equipmentStyle === weaponMark ?
				"染上了" + _characterName + "的血，攻擊命中被攻擊者時，使被攻擊者直接死亡。（對BOSS無效）\n但有50%機率攻擊友方角色。"
				: _equipmentStyle === aromorMark ? 
				"染上了" + _characterName + "的血，進入戰鬥時依照機率獲得下列詛咒狀態：\n虛弱詛咒：角色def歸零。\n狂暴詛咒：角色atk+10，每次攻擊時hp-3。\n若有裝備與此相同詞墜的其他裝備，每一件使「虛弱詛咒」的獲得機率降低10%。"
				: "";
		break;
		//喜歡嘗鮮的
		case 12:
			_description = 
				_equipmentStyle === weaponMark ?
				"染上了" + _characterName + "的血，攻擊時攻擊者hp+5。"
				: _equipmentStyle === aromorMark ? 
				"染上了" + _characterName + "的血，被攻擊時在地上隨機位置掉落「新鮮血液」。玩家取得時可回復全隊hp+2。"
				: "";
		break;
		default:
		break;
	};
	// console.log("_description = ");
	// console.log(_description);
	return _description;
};

function RoguelikeBloodyEquipmentNoteList(classId, equipmentStyle, weaponTypeId) {
	var _classId = classId;
	var _equipmentStyle = equipmentStyle;
	var _note = "";
	var weaponMark = "weapon";
	var aromorMark = "armor";
	var _weaponTypeId = weaponTypeId;
	// var _characterName = "";
	
	if ( _equipmentStyle != weaponMark && _equipmentStyle != aromorMark ) { return ""; };
	
	//通常情況下actorId與classId相同
	// _characterName = $gameActors.actor(_classId)._nickname;
	
	switch(_classId) {
		//擴散毒性的
		case 2:
			_note = 
				_equipmentStyle === weaponMark ? "<getCondition: 27>" : 
				_equipmentStyle === aromorMark ? "<getCondition: 28>" : "";
		break;
		//凍齡的
		case 3:
			_note = 
				_equipmentStyle === weaponMark ? "<getCondition: 29>" : 
				_equipmentStyle === aromorMark ? "<getCondition: 30>" : "";
		break;
		//為好友舉盾的
		case 4:
			_note = 
				_equipmentStyle === weaponMark ? "<getCondition: 31>" : 
				_equipmentStyle === aromorMark ? "<getCondition: 32>" : "";
		break;
		//緊張兮兮的
		//武器類型為劍或斧獲得狀態45
		//武器類型為弓或杖獲得狀態60
		case 5:
			_note = 
				_equipmentStyle === weaponMark ? 
					( _weaponTypeId === 2 || _weaponTypeId === 4 ) ? "<getCondition: 45>" : 
					( _weaponTypeId === 6 || _weaponTypeId === 7 ) ? "<getCondition: 60>" : 
					"<getCondition: 45>" : 
				_equipmentStyle === aromorMark ? "<getCondition: 46>" : "";
		break;
		//斬碎岩石的
		case 6:
			_note = 
				_equipmentStyle === weaponMark ? "<getCondition: 37>" : 
				_equipmentStyle === aromorMark ? "<getCondition: 38>" : "";
		break;
		//超過30歲的
		case 7:
			_note = 
				_equipmentStyle === weaponMark ? "<getCondition: 43>" : 
				_equipmentStyle === aromorMark ? "<getCondition: 44>" : "";
		break;
		//忠誠的
		case 8:
			_note = 
				_equipmentStyle === weaponMark ? "<getCondition: 39>" : 
				_equipmentStyle === aromorMark ? "<getCondition: 40>" : "";
		break;
		//沉迷研究的
		case 9:
			_note = 
				_equipmentStyle === weaponMark ? "<getCondition: 41>" : 
				_equipmentStyle === aromorMark ? "<getCondition: 42>" : "";
		break;
		//有決心的
		case 10:
			_note = 
				_equipmentStyle === weaponMark ? "<getCondition: 47>" : 
				_equipmentStyle === aromorMark ? "<getCondition: 48>" : "";
		break;
		//瘋瘋癲癲的
		case 11:
			_note = 
				_equipmentStyle === weaponMark ? "<getCondition: 35>" : 
				_equipmentStyle === aromorMark ? "<getCondition: 36>" : "";
		break;
		//喜歡嘗鮮的
		case 12:
			_note = 
				_equipmentStyle === weaponMark ? "<getCondition: 33>" : 
				_equipmentStyle === aromorMark ? "<getCondition: 34>" : "";
		break;
		default:
		break;
	};
	// console.log("_note = ");
	// console.log(_note);
	return _note;
};