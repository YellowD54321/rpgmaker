var RoguelikeEventPull_mapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
  RoguelikeEventPull_mapUpdate.call(this);
	if ( Input.isPressed('A') ) {
		var eventPulling = new RoguelikeEventPull();
	} else {
		if ( !$gameSwitches.value(11) ) {
			var eventPullingUntriggered = new RoguelikeEventPullUntriggered();
		};
	};
};

function RoguelikeEventPull() {
	//拉動方向紀錄，與玩家面向方向相反。8=往上拉、2=往下拉、4=往左拉、6=往右拉。
	$gameSystem.roguelikeEventPullDirection = 0;
	if ( !$gameSystem.pullableEvent || $gameSystem.pullableEvent.length <= 0 ) { return false; };
	$gameSystem.pullableEvent.forEach(function(eachEvent) {
		switch ($gamePlayer.direction()) {
			//玩家面朝上的情況
			case 8:
				if ( (eachEvent.x === $gamePlayer.x) && ($gamePlayer.y - eachEvent.y === 1) ) {
					$gameSystem.roguelikeEventPullDirection = 10 - $gamePlayer.direction();
					$gameSelfSwitches.setValue([$gameMap._mapId, eachEvent.eventId(), 'B'], true);
				};
			break;
			//玩家面朝下的情況
			case 2:
				if ( (eachEvent.x === $gamePlayer.x) && ($gamePlayer.y - eachEvent.y === -1) ) {
					$gameSystem.roguelikeEventPullDirection = 10 - $gamePlayer.direction();
					$gameSelfSwitches.setValue([$gameMap._mapId, eachEvent.eventId(), 'B'], true);
				};
			break;
			//玩家面朝左的情況
			case 4:
				if ( ($gamePlayer.y === eachEvent.y) && ($gamePlayer.x - eachEvent.x === 1) ) {
					$gameSystem.roguelikeEventPullDirection = 10 - $gamePlayer.direction();
					$gameSelfSwitches.setValue([$gameMap._mapId, eachEvent.eventId(), 'B'], true);
				};
			break;
			//玩家面朝右的情況
			case 6:
				if ( ($gamePlayer.y === eachEvent.y) && ($gamePlayer.x - eachEvent.x === -1) ) {
					$gameSystem.roguelikeEventPullDirection = 10 - $gamePlayer.direction();
					$gameSelfSwitches.setValue([$gameMap._mapId, eachEvent.eventId(), 'B'], true);
				};
			break;
			default:
			break;
		};
	});
};

function RoguelikeEventPullUntriggered() {
	$gameSystem.roguelikeEventPullDirection = 0;
	if ( !$gameSystem.pullableEvent || $gameSystem.pullableEvent.length <= 0 ) { return false; };
	$gameSystem.pullableEvent.forEach(function(eachEvent) {
		$gameSelfSwitches.setValue([$gameMap._mapId, eachEvent.eventId(), 'B'], false);
	});
};