function RoguelikeRandomMapBuiding() {
	
	this.mapQuantity = 20;
	this.startRegion = "011";
	this.regionPositionEvent = [];
	this.regionIdStringAll = [];
	this.regionStarterEvent = [];
	this.spellTargetEvent = [];
	$gameSystem.partyCharacterEvent = [];
	$gameSystem.bloddyShrineCharacterEvent = [];
	$gameSystem.pullableEvent = [];
	$gameSystem.currentRegion = "---";
	this.mapLevelMark = "MapLevel: ";
	this.mapTypeBeginning = "Beginning";
	this.mapTypeEndding = "Endding";
	this.mapTypeMonster = "Monster";
	this.mapTypeTreasure = "Treasure";
	this.mapTypeShrine = "Shrine";
	this.mapTypeShop = "Shop";
	this.bossMark = "BOSS";
	this.regionForBeginning = [];
	this.regionForEndding = [];
	this.regionForMonster = [];
	this.regionForTreasure = [];
	this.regionForShrine = [];
	this.regionForShop = [];
	this.transportString = "transport: ";
	this.mapLevel = $gameMap.mapId();
	this.mapLevel = ( this.mapLevel < 100 ) ? (( this.mapLevel < 10 ) ? "00" + this.mapLevel.toString() : "0" + this.mapLevel.toString() ) : this.mapLevel.toString();//調整地圖編號為三位數的字串
	
	this.initialize();
	this.building();
	
};

RoguelikeRandomMapBuiding.prototype.initialize = function() {
	
	var eventRegionMark = "region: ";
	var _regionStarterString = "starter";
	var _spellTargetString = "SpellTarget";
	var _partyMemberString = "PartyMember";
	var _enemyString = "IsEnemy";
	var _mapType = "";
	var _mapTypeBeginning = this.mapTypeBeginning;
	var _mapTypeEndding = this.mapTypeEndding;
	var _mapTypeMonster = this.mapTypeMonster;
	var _mapTypeTreasure = this.mapTypeTreasure;
	var _mapTypeShrine = this.mapTypeShrine;
	var _mapTypeShop = this.mapTypeShop;
	var _leftTopPointEventId = 0;
	var _rightBottomPointEventId = 0;
	var _regionLTPointEvent = {};
	var _regionRBPointEvent = {};
	var _transportEvent = [];
	var _transportString = this.transportString;
	var	_spawnedPosition = [];
	var scanx = 0;
	var scany = 0;
	var _enemySpawnedPosition = [];
	var _centerPosition = {};
	var _characterPosition = [];
	var that = this;
	
	//讀取當前地圖中所有的地區標示事件
	$gameMap.events().forEach(function(eachEvent) {
		var _eventNote = $dataMap.events[eachEvent.eventId()].note;
		var _eventName = $dataMap.events[eachEvent.eventId()].name;
		if (_eventNote.includes(eventRegionMark)) {
			that.regionPositionEvent.push(eachEvent);
			_eventNote = _eventNote.split(eventRegionMark).pop();
			_eventNote = _eventNote.split("");
			_eventNote = _eventNote.slice(0, 3);
			_eventNote = _eventNote.join("");
			if (!that.regionIdStringAll.some(x => x === _eventNote)) {
				that.regionIdStringAll.push(_eventNote);
			};
		};
		//讀取所有的區域起始事件ID
		if (_eventNote.includes(_regionStarterString)) {
			that.regionStarterEvent.push(eachEvent.eventId());
		};
		//讀取所有「替身-法術定位專用」事件
		if (_eventNote.includes(_spellTargetString)) {
			that.spellTargetEvent.push({
				eventId: eachEvent.eventId(),
				called: false,
			});
		};
		//讀取所有友方角色事件
		if (_eventNote.includes(_partyMemberString)) {
			$gameSystem.partyCharacterEvent.push(eachEvent);
			$gameSystem.partyCharacterEvent[$gameSystem.partyCharacterEvent.length-1].name = _eventName;
		};
		//讀取所有被拋棄角色事件
		if (_eventNote.includes(_enemyString)) {
			if ($dataActors.some(x => !!x && x.name === _eventName)) {
				$gameSystem.bloddyShrineCharacterEvent.push(eachEvent);
				$gameSystem.bloddyShrineCharacterEvent[$gameSystem.bloddyShrineCharacterEvent.length-1].name = _eventName;
			};
		};
	});
	//儲存所有可以拉動的事件
	//友方角色事件均為可拉動
	$gameSystem.pullableEvent = Object.assign([], $gameSystem.partyCharacterEvent);
	//其他可拉動事件
	//暫時沒有
	console.log("$dataActors = ");
	console.log($dataActors);
	
	console.log("$gameSystem.bloddyShrineCharacterEvent = ");
	console.log($gameSystem.bloddyShrineCharacterEvent);
	
	this.regionIdStringAll.sort();
	
	$gameSystem.regionPositionEvent = this.regionPositionEvent;
	$gameSystem.spellTargetEvent = this.spellTargetEvent;
	
	if ( this.mapQuantity > this.regionIdStringAll.length ) { this.mapQuantity = this.regionIdStringAll.length; };
	var quantity = this.mapQuantity;
	
	//$gameSystem.randomMapCoordinate內儲存regionId的【字串】，避免javascript誤認為數字是八進制
	//regionId內同樣儲存為字串
	$gameSystem.randomMapCoordinate = [];
	// $gameSystem.randomMapInformation = [];
	$gameSystem.allMapInformation = [];
	//初始化$gameSystem.randomMapCoordinate
	for (_coordinateCounterX = 0; _coordinateCounterX < (quantity * 2); _coordinateCounterX++) {
		$gameSystem.randomMapCoordinate[_coordinateCounterX] = [];
		for (_coordinateCounterY = 0; _coordinateCounterY < (quantity * 2); _coordinateCounterY++) {
			$gameSystem.randomMapCoordinate[_coordinateCounterX][_coordinateCounterY] = "---";
		};
	};
	
	//儲存所有地圖區域的資訊
	this.regionIdStringAll.forEach(function(eachRegionId, regionIdIndex) {
		//讀取標示區域座標的左上與右下事件ID
		_regionString = eventRegionMark + eachRegionId;
		that.regionPositionEvent.forEach(function(eachEvent) {
			if ($dataMap.events[eachEvent.eventId()].note.includes(_regionString)) {
				_regionCharacter = $dataMap.events[eachEvent.eventId()].note.split(_regionString).pop();
				_regionCharacter = _regionCharacter.split("");//轉換為陣列
				_regionCharacter = _regionCharacter[0];//取陣列第一個元素，元素本身即為字串
				switch (_regionCharacter) {
					case "a":
						_leftTopPointEventId = eachEvent.eventId();
					break;
					case "b":
						_rightBottomPointEventId = eachEvent.eventId();
					break;
					default:
					break;
				};
			};
		});
		//讀取區域起始事件ID
		that.regionStarterEvent.forEach(function(eachEventId) {
			if ($gameMap.event(eachEventId) != null &&
					$gameMap.event(eachEventId).x >= $gameMap.event(_leftTopPointEventId).x && $gameMap.event(eachEventId).y >= $gameMap.event(_leftTopPointEventId).y &&
					$gameMap.event(eachEventId).x <= $gameMap.event(_rightBottomPointEventId).x && $gameMap.event(eachEventId).y <= $gameMap.event(_rightBottomPointEventId).y) {
				_starterEventId = eachEventId;
			};
		});
		//讀取MapType
		if ( $dataMap.events[_starterEventId].note.includes(_mapTypeBeginning) ) {
			_mapType = _mapTypeBeginning;
			that.startRegion = eachRegionId;
		} else if ( $dataMap.events[_starterEventId].note.includes(_mapTypeEndding) ) {
			_mapType = _mapTypeEndding;
		} else if ( $dataMap.events[_starterEventId].note.includes(_mapTypeTreasure) ) {
			_mapType = _mapTypeTreasure;
		} else if ( $dataMap.events[_starterEventId].note.includes(_mapTypeShrine) ) {
			_mapType = _mapTypeShrine;
		} else if ( $dataMap.events[_starterEventId].note.includes(_mapTypeShop) ) {
			_mapType = _mapTypeShop;
		} else if ( $dataMap.events[_starterEventId].note.includes(_mapTypeMonster) ) {
			_mapType = _mapTypeMonster;
		} else {
			_mapType = _mapTypeMonster;
		};
		//讀取四方向傳送門事件ID
		_regionLTPointEvent = $gameMap.event(_leftTopPointEventId);
		_regionRBPointEvent = $gameMap.event(_rightBottomPointEventId);
		_transportEvent = $dataMap.events.filter(o => o != null && 
																									o.x >= _regionLTPointEvent.x && 
																									o.y >= _regionLTPointEvent.y && 
																									o.x <= _regionRBPointEvent.x && 
																									o.y <= _regionRBPointEvent.y && 
																									o.note.includes(_transportString));
		//讀取敵方怪物產生位置與地圖區域中心位置
		_spawnedPosition = [];
		_characterPosition = [];
		for ( scanx = _regionLTPointEvent.x; scanx <= _regionRBPointEvent.x; scanx++ ) {
			for ( scany = _regionLTPointEvent.y; scany <= _regionRBPointEvent.y; scany++ ) {
				//怪物產生位置
				if ( $gameMap.regionId(scanx, scany) == 1 ) {
					_spawnedPosition.push({
						x: scanx,
						y: scany,
						checkRepeat: false,
					});
				//區域中心位置
				} else if ( $gameMap.regionId(scanx, scany) == 2 ) {
					_centerPosition = {
						x: scanx,
						y: scany,
					};
				} else if ( $gameMap.regionId(scanx, scany) == 3 ) {
					_characterPosition.push({
						x: scanx,
						y: scany,
						checkRepeat: false,
					});
				};
			};
		};
		_enemySpawnedPosition = Object.assign([], _spawnedPosition);
		_centerPosition = Object.assign({}, _centerPosition);
		
		$gameSystem.allMapInformation[regionIdIndex] = {
			mapId: $gameMap.mapId(),
			regionId: eachRegionId,
			leftTopPointEventId: _leftTopPointEventId,
			rightBottomPointEventId: _rightBottomPointEventId,
			starterEventId: _starterEventId,
			mapType: _mapType,
			transportEvent: _transportEvent,
			enemySpawnedPosition: _enemySpawnedPosition,
			centerPosition: Object.assign([], _centerPosition),
			characterPosition: Object.assign([], _characterPosition),
			randomDirection: undefined,	//2上8下4左6右
			sequence: undefined,
			positionX: undefined,
			positionY: undefined,
			enemyGroup: undefined,
		};
	});
	$gameSystem.currentRegion = this.startRegion;
	// console.log("$gameSystem.allMapInformation = ");
	// console.log($gameSystem.allMapInformation);
};

RoguelikeRandomMapBuiding.prototype.building = function() {

	var quantity = this.mapQuantity;
	var _positionX = quantity-1;
	var	_positionY = quantity-1;
	var _nextPositionX = 0;
	var _nextPositionY = 0;
	var _unableDirection = [];
	var _randomDirection = [0];
	var _mapType = "";
	var _mapTypeBeginning = this.mapTypeBeginning;
	var _mapTypeEndding = this.mapTypeEndding;
	var _mapTypeMonster = this.mapTypeMonster;
	var _mapTypeTreasure = this.mapTypeTreasure;
	var _mapTypeShrine = this.mapTypeShrine;
	var _mapTypeShop = this.mapTypeShop;
	var _randomSequence = 0;
	var _randomRegionNumber = 0;
	var _treasureRegionNumber = 0;
	var _monsterRegionNumber = 0;
	var that = this;
	
	/*
	設定地圖區域順序
	*/
	//設定起始區域
	$gameSystem.allMapInformation.find(x => x.mapType === _mapTypeBeginning).sequence = 0;
	//設定結尾區域
	$gameSystem.allMapInformation.find(x => x.mapType === _mapTypeEndding).sequence = quantity;
	//設定血腥祭壇區域，血腥祭壇只出現於第7~第15區域
	_randomSequence = Math.floor(Math.random()*9) + 7;
	$gameSystem.allMapInformation.find(x => x.mapType === _mapTypeShrine).sequence = _randomSequence;
	//設定商店(勤勉的撿拾者)區域，商店只出現於第5~第quantity-1區域
	do { _randomSequence = Math.floor(Math.random()*(quantity-5)) + 5; } while($gameSystem.allMapInformation.some(x => x.sequence === _randomSequence));
	$gameSystem.allMapInformation.find(x => x.mapType === _mapTypeShop).sequence = _randomSequence;
	//設定純寶箱區域，寶箱區域和怪物區域為1:4
	_randomRegionNumber = $gameSystem.allMapInformation.filter(x => x.sequence === undefined).length;
	_treasureRegionNumber = (_randomRegionNumber / 5) > 1 ? Math.floor(_randomRegionNumber / 5) : Math.floor(_randomRegionNumber / 5) + 1;
	for ( i = 0; i < _treasureRegionNumber; i++ ) {
		do { _randomSequence = Math.floor(Math.random()*(quantity)); } while($gameSystem.allMapInformation.some(x => x.sequence === _randomSequence));
		//從剩餘寶箱區域中隨機挑出一個
		$gameSystem.allMapInformation.filter(x => x.mapType === _mapTypeTreasure && x.sequence === undefined)
			[Math.floor(Math.random()*$gameSystem.allMapInformation.filter(x => x.mapType === _mapTypeTreasure && x.sequence === undefined).length)]
				.sequence = _randomSequence;
	};
	//設定怪物區域，怪物區域為剩餘所有區域
	_monsterRegionNumber = $gameSystem.allMapInformation.filter(x => x.mapType === _mapTypeMonster).length;
	for ( j = 0; j < _monsterRegionNumber; j++ ) {
		do { _randomSequence = Math.floor(Math.random()*(quantity)); } while($gameSystem.allMapInformation.some(x => x.sequence === _randomSequence));
		//從剩餘怪物區域中隨機挑出一個
		$gameSystem.allMapInformation.filter(x => x.mapType === _mapTypeMonster && x.sequence === undefined)
			[Math.floor(Math.random()*$gameSystem.allMapInformation.filter(x => x.mapType === _mapTypeMonster && x.sequence === undefined).length)]
				.sequence = _randomSequence;
	};
	
	$gameSystem.allMapInformation = $gameSystem.allMapInformation.filter(x => x.sequence != undefined);
	$gameSystem.allMapInformation.sort((a, b) => a.sequence - b.sequence);
	
	this.recordMapEnemyGroup();
	this.randomEnemyDistribute();
	this.randomUnteamCharecterDistribute();
	
	/*
	隨機擺放地圖區域
	*/
	$gameSystem.allMapInformation.forEach(function(eachRegion, regionIndex) {
		_unableDirection = [];
		do {
			//起始區域固定只能往上走
			if ( eachRegion.mapType === _mapTypeBeginning ) {
				_randomDirection[0] = 8;
				_nextPositionX = ( Math.abs(5 - _randomDirection[0]) === 1 ) ? ( _positionX - (5 - _randomDirection[0]) ) : ( _positionX + 0 );//計算$gameSystem.randomMapCoordinate的X值
				_nextPositionY = _positionY + Math.trunc( (5 - _randomDirection[0]) / 3 );//計算$gameSystem.randomMapCoordinate的Y值
			//魔王區域固定只能從下方抵達
			//如果前一張地圖無法往上移動，則將魔王區域設定在同一X軸的最上方
			} else if ($gameSystem.allMapInformation[regionIndex+1] != undefined && $gameSystem.allMapInformation[regionIndex+1].mapType === _mapTypeEndding) {
				if ( $gameSystem.randomMapCoordinate[_nextPositionX][_nextPositionY-1] === "---" ) {
					_randomDirection[0] = 8;
					_nextPositionX = ( Math.abs(5 - _randomDirection[0]) === 1 ) ? ( _positionX - (5 - _randomDirection[0]) ) : ( _positionX + 0 );//計算$gameSystem.randomMapCoordinate的X值
					_nextPositionY = _positionY + Math.trunc( (5 - _randomDirection[0]) / 3 );//計算$gameSystem.randomMapCoordinate的Y值
				} else {
					_nextPositionX = $gameSystem.allMapInformation.filter(o => o.positionX === _nextPositionX).sort((a, b) => a.positionY - b.positionY)[0].positionX;
					_nextPositionY = $gameSystem.allMapInformation.filter(o => o.positionX === _nextPositionX).sort((a, b) => a.positionY - b.positionY)[0].positionY - 1;
				};
			} else {
				_randomDirection[0] = (Math.floor(Math.random()*4) + 1) * 2;//上下左右四個方向隨機取隨機值
				_nextPositionX = ( Math.abs(5 - _randomDirection[0]) === 1 ) ? ( _positionX - (5 - _randomDirection[0]) ) : ( _positionX + 0 );//計算$gameSystem.randomMapCoordinate的X值
				_nextPositionY = _positionY + Math.trunc( (5 - _randomDirection[0]) / 3 );//計算$gameSystem.randomMapCoordinate的Y值
			};
			if ( !_unableDirection.some(x => x === _randomDirection[0]) ) { _unableDirection.push(_randomDirection[0]); };
		} while ($gameSystem.randomMapCoordinate[_nextPositionX][_nextPositionY] != "---" && _unableDirection.length < 4);//判斷出口方向是否已經存有其他地區，沒空位則重新取隨機值；若四個方位都已經無法通行，則跳過這階段。
		//儲存$gameSystem.randomMapCoordinate和$gameSystem.allMapInformation
		$gameSystem.randomMapCoordinate[_positionX][_positionY] = eachRegion.regionId;
		$gameSystem.allMapInformation[regionIndex].positionX = _positionX;
		$gameSystem.allMapInformation[regionIndex].positionY = _positionY;
		$gameSystem.allMapInformation[regionIndex].randomDirection = Object.assign([], _randomDirection),	//2上8下4左6右
		
		//下一組座標預備
		_positionX = _nextPositionX;
		_positionY = _nextPositionY;
	});
	//debug顯示上為X縱座標、Y橫座標，因此反過來顯示
	var _debugRandomMapCoordinate = [];
	for ( i = 0; i < $gameSystem.randomMapCoordinate.length; i++) {
		_debugRandomMapCoordinate[i] = [];
		for ( j = 0; j < $gameSystem.randomMapCoordinate[i].length; j++) {
			_debugRandomMapCoordinate[i][j] = $gameSystem.randomMapCoordinate[j][i];
		};
	};
	
	this.recordTransportEvent();
	
	console.log("$gameSystem.allMapInformation = ");
	console.log($gameSystem.allMapInformation);
	console.log("_debugRandomMapCoordinate = ");
	console.log(_debugRandomMapCoordinate);
};

//設定各區域各方向傳送門是否開啟
RoguelikeRandomMapBuiding.prototype.recordTransportEvent = function() {
	
	var _allMapInformation = $gameSystem.allMapInformation;
	var _positionX = 0;
	var _positionY = 0;
	var _nextRegionPositionX = 0;
	var _nextRegionPositionY = 0;
	var _transportEvent = [];
	var _transportEventWithDirection = {};
	var _transportEventIndex = 0;
	var _transportString = this.transportString;
	var _specialTransportRegion = {};
	var _specialTransportNextRegion = {};
	var _mapTypeBeginning = this.mapTypeBeginning;
	var _mapTypeEndding = this.mapTypeEndding;
	var _mapTypeMonster = this.mapTypeMonster;
	var _mapTypeTreasure = this.mapTypeTreasure;
	var _mapTypeShrine = this.mapTypeShrine;
	var _mapTypeShop = this.mapTypeShop;
	var that = this;
	
	_allMapInformation.forEach(function(eachRegion, regionIndex) {			
		_positionX = eachRegion.positionX;
		_positionY = eachRegion.positionY;							
		_transportEvent = eachRegion.transportEvent;
		for ( _direction = 2; _direction <= 8; _direction += 2 ) {
			_nextRegionPositionX = ( Math.abs(5 - _direction) === 1 ) ? ( _positionX - (5 - _direction) ) : ( _positionX + 0 );
			_nextRegionPositionY = _positionY + Math.trunc( (5 - _direction) / 3 );
			_transportEventWithDirection = _transportEvent.find( e => e.note.includes(_transportString + _direction));
			_transportEventIndex = _transportEvent.findIndex( e => e.note.includes(_transportString + _direction));
			//鄰近方向區域不存在的話，則設定傳送門事件的自用開關A為開啟。
			//自用開關使用指令：$gameSelfSwitches.setValue([$gameMap._mapId, _eventID, 'A'], true); 
			$gameSelfSwitches.setValue([$gameMap._mapId, _transportEventWithDirection.id, 'A'], ( $gameSystem.randomMapCoordinate[_nextRegionPositionX][_nextRegionPositionY] === "---" ));
			$gameSystem.allMapInformation[regionIndex].transportEvent[_transportEventIndex]._open = !( $gameSystem.randomMapCoordinate[_nextRegionPositionX][_nextRegionPositionY] === "---" );
		};
	});
	// console.log("_allMapInformation = ");
	// console.log(_allMapInformation);
	/*
	設定特定需要關閉的傳送門
	*/
	//起始區域只開啟向上通路
	_specialTransportRegion = _allMapInformation.find(x => x.mapType === _mapTypeBeginning);
	this.specialTransportEvent(_specialTransportRegion, 8, true);
	//魔王區域只開啟向下通路
	_specialTransportRegion = _allMapInformation.find(x => x.mapType === _mapTypeEndding);
	this.specialTransportEvent(_specialTransportRegion, 2, true);
};

//開關各特殊傳送門
RoguelikeRandomMapBuiding.prototype.specialTransportEvent = function(_specialTransportRegion, _specialDirection = [], _onOrOff = true) {
	var _allMapInformation = $gameSystem.allMapInformation;
	var _regionIndex = 0;
	var _positionX = 0;
	var _positionY = 0;
	var _nextRegionPositionX = 0;
	var _nextRegionPositionY = 0;
	var _transportEvent = [];
	var _transportEventIndex = 0;
	var _transportString = this.transportString;
	var _specialTransportNextRegion = {};
	var _mapTypeBeginning = this.mapTypeBeginning;
	var _mapTypeEndding = this.mapTypeEndding;
	var _mapTypeMonster = this.mapTypeMonster;
	var _mapTypeTreasure = this.mapTypeTreasure;
	var _mapTypeShrine = this.mapTypeShrine;
	var _mapTypeShop = this.mapTypeShop;
	var that = this;
	
	_positionX = _specialTransportRegion.positionX;
	_positionY = _specialTransportRegion.positionY;
	_specialDirection = Array.isArray(_specialDirection) ? _specialDirection : [_specialDirection];
	for( i = 0; i < _specialDirection.length; i++ ) {
		for( _direction = 2; _direction <= 8; _direction += 2 ) {
			if ( _direction === _specialDirection[i] ) { continue; };
			_nextRegionPositionX = ( Math.abs(5 - _direction) === 1 ) ? ( _positionX - (5 - _direction) ) : ( _positionX + 0 );
			_nextRegionPositionY = _positionY + Math.trunc( (5 - _direction) / 3 );
			if ( $gameSystem.randomMapCoordinate[_nextRegionPositionX][_nextRegionPositionY] != "---" ) {
				_regionIndex = _allMapInformation.findIndex(x => x.regionId === _specialTransportRegion.regionId);
				_transportEvent = _specialTransportRegion.transportEvent;
				_transportEventWithDirection = _transportEvent.find( e => e.note.includes(_transportString + _direction));
				_transportEventIndex = _transportEvent.findIndex( e => e.note.includes(_transportString + _direction));
				$gameSelfSwitches.setValue([$gameMap._mapId, _transportEventWithDirection.id, 'A'], _onOrOff);
				$gameSystem.allMapInformation[_regionIndex].transportEvent[_transportEventIndex]._open = !_onOrOff;
				_specialTransportNextRegion = _allMapInformation.find(x => x.regionId === $gameSystem.randomMapCoordinate[_nextRegionPositionX][_nextRegionPositionY]);
				_regionIndex = _allMapInformation.findIndex(x => x.regionId === _specialTransportNextRegion.regionId);
				_transportEventWithDirection = _specialTransportNextRegion.transportEvent.find( e => e.note.includes(_transportString + (10-_direction)));
				_transportEventIndex = _specialTransportNextRegion.transportEvent.findIndex( e => e.note.includes(_transportString + (10-_direction)));
				$gameSelfSwitches.setValue([$gameMap._mapId, _transportEventWithDirection.id, 'A'], _onOrOff);
				$gameSystem.allMapInformation[_regionIndex].transportEvent[_transportEventIndex]._open = !_onOrOff;
			};
		};
	};
};

//從$dataTroops紀錄當前地圖的所有敵方角色組合
RoguelikeRandomMapBuiding.prototype.recordMapEnemyGroup = function() {
	var _mapEnemyGroup = [];
	var _mapLevel = this.mapLevel;
	var _mapLevelMark = this.mapLevelMark;
	var _enemyGroupMapNumber = "";
	
	$dataTroops.forEach(function(eachEnemyGroup, index) {
		if ( eachEnemyGroup != null && eachEnemyGroup.name.includes(_mapLevelMark) ) {
				_enemyGroupMapNumber = eachEnemyGroup.name.split(_mapLevelMark).pop();
				_enemyGroupMapNumber = _enemyGroupMapNumber.split("").slice(0, 3).join("");//轉換為陣列並抓取前三個元素，即為MapLevel，再轉換為字串
			if ( _enemyGroupMapNumber == _mapLevel ) {
				_mapEnemyGroup.push(eachEnemyGroup);
			};
		};
	});
	this.mapEnemyGroup = _mapEnemyGroup;
};

//產生各區域之敵方角色
RoguelikeRandomMapBuiding.prototype.randomEnemyDistribute = function() {
	var mapEnemyGroup = this.mapEnemyGroup;
	var groupNumber = mapEnemyGroup.length;
	var _allMapInformation = $gameSystem.allMapInformation;
	var _enemyInformation = {};
	$gameSystem.EnemyInformation = [];
	var _enemySpawnedPosition = {};
	var _enemyPositionNumber = 0;
	var _randomGroup = {};
	var _mapTypeBeginning = this.mapTypeBeginning;
	var _mapTypeEndding = this.mapTypeEndding;
	var _mapTypeMonster = this.mapTypeMonster;
	var _mapTypeTreasure = this.mapTypeTreasure;
	var _mapTypeShrine = this.mapTypeShrine;
	var _mapTypeShop = this.mapTypeShop;
	var _bossMark = this.bossMark;
	
	_allMapInformation.forEach(function(eachRegion, index) {
		//一般怪物區域
		if ( eachRegion.mapType === _mapTypeMonster ) {
			//若區域的怪物產生點小於怪物數量，重新取隨機值
			//避開BOSS的狀況，若讀取到BOSS怪，重新取隨機值
			do{
				_randomGroup = mapEnemyGroup[(Math.floor(Math.random()*groupNumber))];
			} while(eachRegion.enemySpawnedPosition.length < _randomGroup.members.length || _randomGroup.name.includes(_bossMark));
		//終點BOSS區域
		} else if ( eachRegion.mapType === _mapTypeEndding ) {
			_randomGroup = mapEnemyGroup.filter(x => x.name.includes(_bossMark));
			_randomGroup = _randomGroup[(Math.floor(Math.random()*_randomGroup.length))];
		//寶箱區域
		} else if ( eachRegion.mapType === _mapTypeTreasure ) {
			//三分之一的機率出現怪物
			if ( Math.floor(Math.random()*3) === 1 && eachRegion.enemySpawnedPosition.length > 1 ) {
				do{
					_randomGroup = mapEnemyGroup[(Math.floor(Math.random()*groupNumber))];
				} while(eachRegion.enemySpawnedPosition.length < _randomGroup.members.length || _randomGroup.name.includes(_bossMark));
			} else {
				_randomGroup = {};
			};
		} else {
			_randomGroup = {};
		};
		// console.log("_randomGroup = ");
		// console.log(_randomGroup);
		eachRegion.enemyGroup = _randomGroup;
		if ( _randomGroup != undefined && Object.keys(_randomGroup).length > 0 ) {
			eachRegion.enemyGroup.members.forEach(function(eachEnemy) {
				do {
					_enemyPositionNumber = (Math.floor(Math.random()*eachRegion.enemySpawnedPosition.length));
				} while( eachRegion.enemySpawnedPosition[_enemyPositionNumber].checkRepeat === true && eachRegion.enemySpawnedPosition.some(x => x.checkRepeat == false) );
				eachRegion.enemySpawnedPosition[_enemyPositionNumber].checkRepeat = true;
				_enemySpawnedPosition = Object.assign({}, eachRegion.enemySpawnedPosition[_enemyPositionNumber]);
				_enemyInformation = {
					race: $dataEnemies[eachEnemy.enemyId].name,
					enemyId: eachEnemy.enemyId,
					enemyIndex: 0,
					mhp: $dataEnemies[eachEnemy.enemyId].params[0],
					hp: $dataEnemies[eachEnemy.enemyId].params[0],
					atk: $dataEnemies[eachEnemy.enemyId].params[2],
					def: $dataEnemies[eachEnemy.enemyId].params[3],
					agi: $dataEnemies[eachEnemy.enemyId].params[6],
					regionId: eachRegion.regionId,
					faction: "enemy",
					eventId: 0,
					enemySpawnedPosition: Object.assign({}, _enemySpawnedPosition),
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
				};
				$gameSystem.EnemyInformation.push(_enemyInformation);
				$gameSystem.EnemyInformation[$gameSystem.EnemyInformation.length-1].enemyIndex = $gameSystem.EnemyInformation.length - 1;
			});
		};
	});
	console.log("$gameSystem.EnemyInformation = ");
	console.log($gameSystem.EnemyInformation);
	
	//test
	// $gameSystem.EnemyInformation.forEach(function(eachEnemy) {
		// RoguelikeBattleAddCondition(eachEnemy, 16);
		// RoguelikeBattleAddCondition(eachEnemy, 4);
		// RoguelikeBattleAddCondition(eachEnemy, 4);
		// RoguelikeBattleAddCondition(eachEnemy, 4);
		// RoguelikeBattleAddCondition(eachEnemy, 26);
	// });
	
};

//產生待組隊角色
RoguelikeRandomMapBuiding.prototype.randomUnteamCharecterDistribute = function() {
	var _characterNumner = 3;//每張地圖的待組人數
	var _allMapInformation = $gameSystem.allMapInformation;
	var _allCharacterList = $dataActors.filter(x => x != null && x != undefined && x.name != "");
	var _usableCharacter = Object.assign([], _allCharacterList);
	var _characterRegion = [];
	var _characterEvent = {};
	var _characterRegionIndex = 0;
	var _characterPositionIndex = 0;
	var _regionIndex = 0;
	var _usableCharacterIndex = 0;
	
	// console.log("_allCharacterList = ");
	// console.log(_allCharacterList);
	// console.log("$gameParty.members() = ");
	// console.log($gameParty.members());
	
	
	//排除目前隊伍中成員
	$gameParty.members().forEach(function(eachPartyMember) {
		_usableCharacter = _usableCharacter.filter(x => x.name != eachPartyMember._name);
	});
	for( i = 0; i < _characterNumner; i++ ) {
		_characterRegion = _allMapInformation.filter(x => x.characterPosition != undefined && x.characterPosition.length > 0 && x.characterPosition.some(y => y.checkRepeat === false));
		if( _characterRegion.length < 1 ) { continue; };
		_characterRegionIndex = Math.floor(Math.random()*_characterRegion.length);
		_characterPositionIndex = Math.floor(Math.random()*_characterRegion[_characterRegionIndex].characterPosition.length);
		_regionIndex = _allMapInformation.findIndex(x => x.regionId === _characterRegion[_characterRegionIndex].regionId);
		_allMapInformation[_regionIndex].characterPosition[_characterPositionIndex].checkRepeat = true;
		_usableCharacterIndex = Math.floor(Math.random()*_usableCharacter.length);
		_characterEvent = $gameSystem.partyCharacterEvent.find(x => x.name === _usableCharacter[_usableCharacterIndex].name);
		$gameMap.event(_characterEvent._eventId).setPosition(_allMapInformation[_regionIndex].characterPosition[_characterPositionIndex].x, _allMapInformation[_regionIndex].characterPosition[_characterPositionIndex].y);
		$gameSelfSwitches.setValue([$gameMap._mapId, _characterEvent._eventId, 'C'], true);
		_usableCharacter = _usableCharacter.filter(x => x.name != _usableCharacter[_usableCharacterIndex].name);
	};
	_characterRegion = _allMapInformation.filter(x => x.characterPosition != undefined && x.characterPosition.length > 0 && x.characterPosition.some(y => y.checkRepeat === true));
};

//區域之間傳送
var roguelikeRandomMapTransport = Game_Interpreter.prototype.RoguelikeRandomMapTransport;
Game_Interpreter.prototype.RoguelikeRandomMapTransport = function(eventId) {
	console.log("RoguelikeRandomMapTransport START");
	if ( $gameSwitches.value(3) ) {
		console.log("Battling haven't been stopped.");
		return false;
	};
	this._eventId = eventId;
	this.directionCheck();
	this.enemyEventTransport();
	
};

Game_Interpreter.prototype.directionCheck = function() {
	var _eventId = this._eventId;
	var _transportDirection = "transport: ";
	var _directionString = "";
	var _regionPositionX = 0;
	var _regionPositionY = 0;
	var _nextRegionPositionX = 0;
	var _nextRegionPositionY = 0;
	var _currentRegion = $gameSystem.currentRegion;
	var _nextRegion = "";
	var _currentRegionInformation = {};
	var _nextRegionInformation = {};
	var _nextRegionLTPointEvent = {};//LeftTop事件資訊
	var _nextRegionRBPointEvent = {};//RightBottom事件資訊
	var _destinationEvent = {};
	var _destinationX = 0;
	var _destinationY = 0;
	var _screenScrollDistance = 0;
	
	if ($dataMap.events[_eventId].note.includes(_transportDirection)) {
		_directionString = $dataMap.events[_eventId].note.split(_transportDirection).pop();
		_directionString = _directionString.split("");//轉換為陣列
		_directionString = _directionString[0];//取陣列第一個元素，元素本身即為字串
		_currentRegionInformation = $gameSystem.allMapInformation.find(x => x.regionId === _currentRegion);
		_regionPositionX = _currentRegionInformation.positionX;
		_regionPositionY = _currentRegionInformation.positionY;
		
		_nextRegionPositionX = ( Math.abs(5 - _directionString) === 1 ) ? ( _regionPositionX - (5 - _directionString) ) : ( _regionPositionX + 0 );//計算$gameSystem.randomMapCoordinate的X值
		_nextRegionPositionY = _regionPositionY + Math.trunc( (5 - _directionString) / 3 );//計算$gameSystem.randomMapCoordinate的Y值

		if ( $gameSystem.randomMapCoordinate[_nextRegionPositionX][_nextRegionPositionY] === "---" ) {
			console.log("Function RoguelikeRandomMapTransport message");
			console.log("$gameSystem.randomMapCoordinate[_nextRegionPositionX][_nextRegionPositionY] === \"---\"");
			console.log("there is no 【" + _directionString + "】 between this region" + "***direction: 2=down, 4=left, 6=right, 8=up***");
		} else {
			_nextRegion = $gameSystem.randomMapCoordinate[_nextRegionPositionX][_nextRegionPositionY];
			
			_nextRegionInformation = $gameSystem.allMapInformation.find(x => x.regionId === _nextRegion);
			_destinationEvent = _nextRegionInformation.transportEvent.find(o => o.note.includes(_transportDirection + (10 - _directionString)));
			
			if ( _destinationEvent === undefined ) {
				console.log("Function RoguelikeRandomMapTransport error");
				console.log("_destinationEvent === undefined");
			} else {
				_destinationX = ( Math.abs(5 - _directionString) === 1 ) ? ( _destinationEvent.x - (5 - _directionString) ) : ( _destinationEvent.x + 0 );
				_destinationY = _destinationEvent.y + Math.trunc( (5 - _directionString) / 3 );
				$gameSystem.currentRegion = _nextRegion;
				this.clearEnemyEvent();
				this.enemyEventTransport();
				
				$gamePlayer.reserveTransfer($gameMap.mapId(), _destinationX, _destinationY, _directionString, 2);
				this.setWaitMode('transfer');
				$gamePlayer.center($gameSystem.allMapInformation.find(o => o.regionId === _nextRegion).centerPosition.x, $gameSystem.allMapInformation.find(o => o.regionId === _nextRegion).centerPosition.y);

				//傳送到新區域後，先執行該區域的起始事件
				$gameSelfSwitches.setValue([$gameMap._mapId, $gameSystem.allMapInformation.find(o => o.regionId === _nextRegion).starterEventId, 'A'], true);
			};
		};
	} else {
		console.log("Function RoguelikeRandomMapTransport message");
		console.log("Event note doesn't include " + _transportDirection);
	};
};

//清除所有敵方角色的事件編號資訊
Game_Interpreter.prototype.clearEnemyEvent = function() {
	$gameSystem.EnemyInformation.forEach(function(eachEnemy) {
		eachEnemy.eventId = 0;
	});
};

//設置敵方角色事件
Game_Interpreter.prototype.enemyEventTransport = function() {
	var _enemyInformation = $gameSystem.EnemyInformation;
	var _currentRegion = $gameSystem.currentRegion;
	var _currentEnemy = [];
	var _enemyEventInformation = $gameSystem.EnemyEventInformation;
	var _unableEventId = [];
	var _eventInformationCheck = {};
	
	_enemyInformation.forEach(function(eachEnemy) {
		_eventInformationCheck = _enemyEventInformation.find(x => eachEnemy.regionId === _currentRegion && 
																							 	 x.race === eachEnemy.race && 
																								 !_unableEventId.some(y => y === x.eventId));
		if ( _eventInformationCheck != -1 && _eventInformationCheck != undefined) {
			_unableEventId.push(_eventInformationCheck.eventId);
			eachEnemy.eventId = _eventInformationCheck.eventId;
			$gameMap.event(eachEnemy.eventId).setPosition(eachEnemy.enemySpawnedPosition.x, eachEnemy.enemySpawnedPosition.y);
			$gameMap.event(eachEnemy.eventId)._opacity = (eachEnemy.death === true) ? 0 : 255;
			$gameMap.event(eachEnemy.eventId)._through = eachEnemy.death;
		};
	});
};