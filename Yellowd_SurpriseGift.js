function SurpriseGift() {
	var closest_eventId = 0;
	var distance_1st = 0;
	var distance_2nd = 0;
	
	this._gift_thismap = [];
		
	for (i = 0; i < $SurpriseGift_information.length; i++) {
		if ($SurpriseGift_information[i][0] == $gameMap.mapId()) {
			this._gift_thismap.push($SurpriseGift_information[i]);
		};
	};
	// console.log(this._gift_thismap);
	
	for (j = 0; j < this._gift_thismap.length; j++)	{
		if ($gameMap.event(this._gift_thismap[j][1]).x >= $gamePlayer.x)	{
			if (closest_eventId === 0)	{
				closest_eventId = this._gift_thismap[j][1];
			}	else	{
				distance_1st = $gameMap.event(closest_eventId).x - $gamePlayer.x;
				// distance_1st = Math.abs(distance_1st);
				distance_2nd = $gameMap.event(this._gift_thismap[j][1]).x - $gamePlayer.x;
				// distance_2nd = Math.abs(distance_2nd);
				closest_eventId = (distance_1st < distance_2nd) ? closest_eventId : this._gift_thismap[j][1];
			};
		};
		
	};
/*
變數106、107、108、109為驚喜禮物暫存用，其他地方請勿使用。
*/
	
	switch ($gameVariables.value(109)) {
    case 0:
			$gameVariables.setValue(106, closest_eventId);
			$gameVariables.setValue(109, 1);
			break;
    case 1:
			$gameVariables.setValue(107, closest_eventId);
			$gameVariables.setValue(109, 2);
			break;
    case 2:
			$gameVariables.setValue(108, closest_eventId);
			$gameVariables.setValue(109, 0);
			break;
    default:
			$gameVariables.setValue(109, 0);
			break;
	};
	
	for (j = 0; j < this._gift_thismap.length; j++)	{
		if (this._gift_thismap[j][1] != $gameVariables.value(106))	{
			if (this._gift_thismap[j][1] != $gameVariables.value(107))	{
				if (this._gift_thismap[j][1] != $gameVariables.value(108))	{
					$gameSelfSwitches.setValue([$gameMap._mapId, this._gift_thismap[j][1], 'A'], false); 
				};
			};
		};
	};
	
	$gameSelfSwitches.setValue([$gameMap._mapId, closest_eventId, 'A'], true); 
	// console.log(closest_eventId);
};

