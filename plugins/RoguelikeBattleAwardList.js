//戰鬥獎勵列表
function RoguelikeBattleAwardList(enemyRaceOrName) {
	var _enemy = enemyRaceOrName;
	var award = [];
	var dropList = [];//itemNumber = 9999，為隨機物品
	var _itemNumber = 0;
	var bloodtEquipRate = 0;
	var partyMemberEquip = {};
	//test
	var isBloodEquip = false;

	
	switch(_enemy) {
	//-------------------------↓↓↓敵方↓↓↓------------------------------
		//BlueBat
		case $dataEnemies[1].name:
			bloodtEquipRate = 5;
			dropList = [{itemStyle: "item", itemNumber: 6, dropNumber: 1, droprate: 100,}, 
									{itemStyle: "weapon", itemNumber: 9999, dropNumber: 1, droprate: 100,}, 
									{itemStyle: "armor", itemNumber: 9999, dropNumber: 1, droprate: 100,}];
			for ( i = 0; i < dropList.length; i++ ) {
				if ( dropList[i].itemNumber <= 0 ) { continue; };
				if ( (Math.floor(Math.random()*100)) < dropList[i].droprate ) {
					_itemNumber = dropList[i].itemNumber != 9999 ? dropList[i].itemNumber : 
												RoguelikeBattleAwardRandomItem(dropList[i].itemStyle, bloodtEquipRate);
					award.push({itemStyle: dropList[i].itemStyle, itemNumber: _itemNumber, dropNumber: dropList[i].dropNumber});
				};
			};
		break;
		//BlueSlime
		case $dataEnemies[2].name:
			bloodtEquipRate = 5;
			dropList = [{itemStyle: "item", itemNumber: 7, dropNumber: 1, droprate: 100,}, 
									{itemStyle: "weapon", itemNumber: 9999, dropNumber: 1, droprate: 100,}, 
									{itemStyle: "armor", itemNumber: 9999, dropNumber: 1, droprate: 100,}];
			for ( i = 0; i < dropList.length; i++ ) {
				if ( dropList[i].itemNumber <= 0 ) { continue; };
				if ( (Math.floor(Math.random()*100)) < dropList[i].droprate ) {
					_itemNumber = dropList[i].itemNumber != 9999 ? dropList[i].itemNumber : 
												RoguelikeBattleAwardRandomItem(dropList[i].itemStyle, bloodtEquipRate);
					award.push({itemStyle: dropList[i].itemStyle, itemNumber: _itemNumber, dropNumber: dropList[i].dropNumber});
				};
			};
		break;
		//Pigman
		case $dataEnemies[3].name:
			bloodtEquipRate = 5;
			dropList = [{itemStyle: "item", itemNumber: 8, dropNumber: 1, droprate: 100,}, 
									{itemStyle: "weapon", itemNumber: 9999, dropNumber: 1, droprate: 100,}, 
									{itemStyle: "armor", itemNumber: 9999, dropNumber: 1, droprate: 100,}];
			for ( i = 0; i < dropList.length; i++ ) {
				if ( dropList[i].itemNumber <= 0 ) { continue; };
				if ( (Math.floor(Math.random()*100)) < dropList[i].droprate ) {
					_itemNumber = dropList[i].itemNumber != 9999 ? dropList[i].itemNumber : 
												RoguelikeBattleAwardRandomItem(dropList[i].itemStyle, bloodtEquipRate);
					award.push({itemStyle: dropList[i].itemStyle, itemNumber: _itemNumber, dropNumber: dropList[i].dropNumber});
				};
			};
		break;
		//DevilGhost
		case $dataEnemies[4].name:
			bloodtEquipRate = 5;
			dropList = [{itemStyle: "item", itemNumber: 9, dropNumber: 1, droprate: 100,}, 
									{itemStyle: "weapon", itemNumber: 9999, dropNumber: 1, droprate: 100,}, 
									{itemStyle: "armor", itemNumber: 9999, dropNumber: 1, droprate: 100,}];
			for ( i = 0; i < dropList.length; i++ ) {
				if ( dropList[i].itemNumber <= 0 ) { continue; };
				if ( (Math.floor(Math.random()*100)) < dropList[i].droprate ) {
					_itemNumber = dropList[i].itemNumber != 9999 ? dropList[i].itemNumber : 
												RoguelikeBattleAwardRandomItem(dropList[i].itemStyle, bloodtEquipRate);
					award.push({itemStyle: dropList[i].itemStyle, itemNumber: _itemNumber, dropNumber: dropList[i].dropNumber});
				};
			};
		break;
		//DragonLady
		case $dataEnemies[5].name:
			bloodtEquipRate = 5;
			dropList = [{itemStyle: "item", itemNumber: 10, dropNumber: 1, droprate: 100,}, 
									{itemStyle: "weapon", itemNumber: 9999, dropNumber: 1, droprate: 100,}, 
									{itemStyle: "armor", itemNumber: 9999, dropNumber: 1, droprate: 100,}];
			for ( i = 0; i < dropList.length; i++ ) {
				if ( dropList[i].itemNumber <= 0 ) { continue; };
				if ( (Math.floor(Math.random()*100)) < dropList[i].droprate ) {
					_itemNumber = dropList[i].itemNumber != 9999 ? dropList[i].itemNumber : 
												RoguelikeBattleAwardRandomItem(dropList[i].itemStyle, bloodtEquipRate);
					award.push({itemStyle: dropList[i].itemStyle, itemNumber: _itemNumber, dropNumber: dropList[i].dropNumber});
				};
			};
		break;
		//-------------------------↑↑↑敵方↑↑↑------------------------------
		//-------------------------↓↓↓祭壇↓↓↓------------------------------
		//刺客
		case $dataEnemies[102].name:
			bloodtEquipRate = 5;
			dropList = [{itemStyle: "item", itemNumber: 102, dropNumber: 1, droprate: 100,}];
			partyMemberEquip = $gameSystem.sacrificedMemberEquipList.find(x => x.actorId === 2);
			partyMemberEquip.equips = partyMemberEquip.equips.filter(x => x._itemId != 0);
			partyMemberEquip.equips.forEach(function(eachEquip) {
				dropList.push({
					itemStyle: eachEquip._dataClass,
					itemNumber: eachEquip._itemId,
					dropNumber: 1,
					droprate: 100,
				});
			});
			award = RoguelikeBattleAwardBloodyCharacterItem(dropList, partyMemberEquip, bloodtEquipRate);
		break;
		//寒冰法師
		case $dataEnemies[103].name:
			bloodtEquipRate = 5;
			dropList = [{itemStyle: "item", itemNumber: 103, dropNumber: 1, droprate: 100,}];
			partyMemberEquip = $gameSystem.sacrificedMemberEquipList.find(x => x.actorId === 3);
			partyMemberEquip.equips = partyMemberEquip.equips.filter(x => x._itemId != 0);
			partyMemberEquip.equips.forEach(function(eachEquip) {
				dropList.push({
					itemStyle: eachEquip._dataClass,
					itemNumber: eachEquip._itemId,
					dropNumber: 1,
					droprate: 100,
				});
			});
			award = RoguelikeBattleAwardBloodyCharacterItem(dropList, partyMemberEquip, bloodtEquipRate);
		break;
		//護盾騎士
		case $dataEnemies[104].name:
			bloodtEquipRate = 5;
			dropList = [{itemStyle: "item", itemNumber: 104, dropNumber: 1, droprate: 100,}];
			partyMemberEquip = $gameSystem.sacrificedMemberEquipList.find(x => x.actorId === 4);
			partyMemberEquip.equips = partyMemberEquip.equips.filter(x => x._itemId != 0);
			partyMemberEquip.equips.forEach(function(eachEquip) {
				dropList.push({
					itemStyle: eachEquip._dataClass,
					itemNumber: eachEquip._itemId,
					dropNumber: 1,
					droprate: 100,
				});
			});
			award = RoguelikeBattleAwardBloodyCharacterItem(dropList, partyMemberEquip, bloodtEquipRate);
		break;
		//膽小鬼
		case $dataEnemies[105].name:
			bloodtEquipRate = 5;
			dropList = [{itemStyle: "item", itemNumber: 105, dropNumber: 1, droprate: 100,}];
			partyMemberEquip = $gameSystem.sacrificedMemberEquipList.find(x => x.actorId === 5);
			partyMemberEquip.equips = partyMemberEquip.equips.filter(x => x._itemId != 0);
			partyMemberEquip.equips.forEach(function(eachEquip) {
				dropList.push({
					itemStyle: eachEquip._dataClass,
					itemNumber: eachEquip._itemId,
					dropNumber: 1,
					droprate: 100,
				});
			});
			award = RoguelikeBattleAwardBloodyCharacterItem(dropList, partyMemberEquip, bloodtEquipRate);
		break;
		//巨劍士
		case $dataEnemies[106].name:
			bloodtEquipRate = 5;
			dropList = [{itemStyle: "item", itemNumber: 106, dropNumber: 1, droprate: 100,}];
			partyMemberEquip = $gameSystem.sacrificedMemberEquipList.find(x => x.actorId === 6);
			partyMemberEquip.equips = partyMemberEquip.equips.filter(x => x._itemId != 0);
			partyMemberEquip.equips.forEach(function(eachEquip) {
				dropList.push({
					itemStyle: eachEquip._dataClass,
					itemNumber: eachEquip._itemId,
					dropNumber: 1,
					droprate: 100,
				});
			});
			award = RoguelikeBattleAwardBloodyCharacterItem(dropList, partyMemberEquip, bloodtEquipRate);
		break;
		//火焰法師
		case $dataEnemies[107].name:
			bloodtEquipRate = 5;
			dropList = [{itemStyle: "item", itemNumber: 107, dropNumber: 1, droprate: 100,}];
			partyMemberEquip = $gameSystem.sacrificedMemberEquipList.find(x => x.actorId === 7);
			partyMemberEquip.equips = partyMemberEquip.equips.filter(x => x._itemId != 0);
			partyMemberEquip.equips.forEach(function(eachEquip) {
				dropList.push({
					itemStyle: eachEquip._dataClass,
					itemNumber: eachEquip._itemId,
					dropNumber: 1,
					droprate: 100,
				});
			});
			award = RoguelikeBattleAwardBloodyCharacterItem(dropList, partyMemberEquip, bloodtEquipRate);
		break;
		//聖騎士
		case $dataEnemies[108].name:
			bloodtEquipRate = 5;
			dropList = [{itemStyle: "item", itemNumber: 108, dropNumber: 1, droprate: 100,}];
			partyMemberEquip = $gameSystem.sacrificedMemberEquipList.find(x => x.actorId === 8);
			partyMemberEquip.equips = partyMemberEquip.equips.filter(x => x._itemId != 0);
			partyMemberEquip.equips.forEach(function(eachEquip) {
				dropList.push({
					itemStyle: eachEquip._dataClass,
					itemNumber: eachEquip._itemId,
					dropNumber: 1,
					droprate: 100,
				});
			});
			award = RoguelikeBattleAwardBloodyCharacterItem(dropList, partyMemberEquip, bloodtEquipRate);
		break;
		//瘋狂科學家
		case $dataEnemies[109].name:
			bloodtEquipRate = 5;
			dropList = [{itemStyle: "item", itemNumber: 109, dropNumber: 1, droprate: 100,}];
			partyMemberEquip = $gameSystem.sacrificedMemberEquipList.find(x => x.actorId === 9);
			partyMemberEquip.equips = partyMemberEquip.equips.filter(x => x._itemId != 0);
			partyMemberEquip.equips.forEach(function(eachEquip) {
				dropList.push({
					itemStyle: eachEquip._dataClass,
					itemNumber: eachEquip._itemId,
					dropNumber: 1,
					droprate: 100,
				});
			});
			award = RoguelikeBattleAwardBloodyCharacterItem(dropList, partyMemberEquip, bloodtEquipRate);
		break;
		//革命家
		case $dataEnemies[110].name:
			bloodtEquipRate = 5;
			dropList = [{itemStyle: "item", itemNumber: 110, dropNumber: 1, droprate: 100,}];
			partyMemberEquip = $gameSystem.sacrificedMemberEquipList.find(x => x.actorId === 10);
			partyMemberEquip.equips = partyMemberEquip.equips.filter(x => x._itemId != 0);
			partyMemberEquip.equips.forEach(function(eachEquip) {
				dropList.push({
					itemStyle: eachEquip._dataClass,
					itemNumber: eachEquip._itemId,
					dropNumber: 1,
					droprate: 100,
				});
			});
			award = RoguelikeBattleAwardBloodyCharacterItem(dropList, partyMemberEquip, bloodtEquipRate);
		break;
		//弒神者
		case $dataEnemies[111].name:
			bloodtEquipRate = 5;
			dropList = [{itemStyle: "item", itemNumber: 111, dropNumber: 1, droprate: 100,}];
			partyMemberEquip = $gameSystem.sacrificedMemberEquipList.find(x => x.actorId === 11);
			partyMemberEquip.equips = partyMemberEquip.equips.filter(x => x._itemId != 0);
			partyMemberEquip.equips.forEach(function(eachEquip) {
				dropList.push({
					itemStyle: eachEquip._dataClass,
					itemNumber: eachEquip._itemId,
					dropNumber: 1,
					droprate: 100,
				});
			});
			award = RoguelikeBattleAwardBloodyCharacterItem(dropList, partyMemberEquip, bloodtEquipRate);
		break;
		//吸血鬼
		case $dataEnemies[112].name:
			bloodtEquipRate = 5;
			dropList = [{itemStyle: "item", itemNumber: 112, dropNumber: 1, droprate: 100,}];
			partyMemberEquip = $gameSystem.sacrificedMemberEquipList.find(x => x.actorId === 12);
			partyMemberEquip.equips = partyMemberEquip.equips.filter(x => x._itemId != 0);
			partyMemberEquip.equips.forEach(function(eachEquip) {
				dropList.push({
					itemStyle: eachEquip._dataClass,
					itemNumber: eachEquip._itemId,
					dropNumber: 1,
					droprate: 100,
				});
			});
			award = RoguelikeBattleAwardBloodyCharacterItem(dropList, partyMemberEquip, bloodtEquipRate);
		break;
	//-------------------------↑↑↑祭壇↑↑↑------------------------------
		default:
			console.log("function RoguelikeBattleAwardList error");
			console.log("_enemy is unknow");
		break;
	};
	console.log("award = ");
	console.log(award);
	return award;
};

function RoguelikeBattleAwardRandomItem(itemStyle, bloodtEquipRate) {
	var weaponDataBase = Object.assign([], $gameSystem.roguelikeWeaponsOriginal.filter(x => !!x && x.name != ""));
	var armorDataBase = Object.assign([], $gameSystem.roguelikeArmorsOriginal.filter(x => !!x && x.name != ""));
	var itemDataBase = Object.assign([], $dataItems.filter(x => !!x && x.name != ""));
	var _bloodtEquipRate = bloodtEquipRate;
	var _bloodyEquip = {};
	var _randomIndex = 0;
	var itemIndex = 0;
	
	if ( itemStyle === "weapon" ) {
		if ( (Math.floor(Math.random()*100)) < _bloodtEquipRate ) {
			_bloodyEquip = RoguelikeBloodyEquipmentCreatItem(9999, itemStyle);
			itemIndex = _bloodyEquip.id;
		} else {
			_randomIndex = (Math.floor(Math.random()*weaponDataBase.length));
			itemIndex = weaponDataBase[_randomIndex].id;
		};
	} else if ( itemStyle === "armor" ) {
		if ( (Math.floor(Math.random()*100)) < _bloodtEquipRate ) {
			_bloodyEquip = RoguelikeBloodyEquipmentCreatItem(9999, itemStyle);
			itemIndex = _bloodyEquip.id;
		} else {
			_randomIndex = (Math.floor(Math.random()*armorDataBase.length));
			itemIndex = armorDataBase[_randomIndex].id;
		};
	} else {
		_randomIndex = (Math.floor(Math.random()*itemDataBase.length));
		itemIndex = itemDataBase[_randomIndex].id;
	};
	return itemIndex;
};

//計算友方角色掉落物、並決定裝備是否Bloody
function RoguelikeBattleAwardBloodyCharacterItem(dropList, partyMemberEquip, bloodtEquipRate) {
	var award = [];
	for ( i = 0; i < dropList.length; i++ ) {
		if ( dropList[i].itemNumber <= 0 ) { continue; };
		if ( (Math.floor(Math.random()*100)) < dropList[i].droprate ) {
			isBloodEquip = dropList[i].itemStyle === "weapon" ? 
											!$gameSystem.roguelikeWeaponsOriginal.some(x => !!x && x.id === dropList[i].itemNumber) : 
											dropList[i].itemStyle === "armor" ? 
											!$gameSystem.roguelikeArmorsOriginal.some(x => !!x && x.id === dropList[i].itemNumber) : 
											false;
			_itemNumber = dropList[i].itemNumber != 9999 ? 
										dropList[i].itemStyle === "item" ? dropList[i].itemNumber : 
										isBloodEquip ? 
											RoguelikeBloodyEquipmentCreatItem(partyMemberEquip.classId, dropList[i].itemStyle, 
												dropList[i].itemStyle === "weapon" ? $gameSystem.roguelikeWeapons[dropList[i].itemNumber].originalId : 
												dropList[i].itemStyle === "armor" ? $gameSystem.roguelikeArmors[dropList[i].itemNumber].originalId : 
												dropList[i].itemNumber
											).id : 
										RoguelikeBloodyEquipmentCreatItem(partyMemberEquip.classId, dropList[i].itemStyle, dropList[i].itemNumber).id : 
										RoguelikeBattleAwardRandomItem(dropList[i].itemStyle, bloodtEquipRate);
			award.push({itemStyle: dropList[i].itemStyle, itemNumber: _itemNumber, dropNumber: dropList[i].dropNumber});
		};
	};
	return award;
};