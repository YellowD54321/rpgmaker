function Yellowd_SightRange() {
    this.initialize.apply(this, arguments);
};

Yellowd_SightRange.prototype = Object.create(Scene_Map);
Yellowd_SightRange.prototype.constructor = Yellowd_SightRange;

Yellowd_SightRange.prototype.initialize = function() {
		
    Scene_Map.prototype.initialize.call(this);
		
};

var Yellowd_SightRange_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
	Yellowd_SightRange_start.call(this);
	
	$gameSwitches.setValue(5, true);
	
	$watchman_information[0] = [2, 2, 5];
	$watchman_information[1] = [2, 6, 7];
	
	$watchman_information[2] = [7, 1, 5];
	$watchman_information[3] = [7, 2, 3];
	$watchman_information[4] = [7, 3, 4];
	$watchman_information[5] = [7, 4, 1];
	$watchman_information[6] = [7, 6, 5];
	
	$barrier_information[0] = [2, 3];
	$barrier_information[1] = [2, 4];
	$barrier_information[2] = [2, 5];

	$barrier_information[3] = [7, 1];
	$barrier_information[4] = [7, 2];
	$barrier_information[5] = [7, 3];
	$barrier_information[6] = [7, 4];
	$barrier_information[7] = [7, 6];
	
	$barrier_information[8] = [2, 7];
	
	//直線偵測設定用，暫存
	$gameVariables.setValue(13, $watchman_information.length);
	$gameVariables.setValue(12, $barrier_information.length);
	
	this.loadImages();
};

var Yellowd_SightRange_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	Yellowd_SightRange_update.call(this);
	this.imagesRefresh();
};
	
Scene_Map.prototype.loadImages = function() {
	this._loadImg = new Array;
	for (i = 0; i < $watchman_information.length; i++) {
		if ($watchman_information[i][0] == $gameMap.mapId())	{
			this._loadImg[i] = new Array;
			for (j = 0; j < $watchman_information[i][2]; j++)	{
				this._loadImg[i][j] = new Sprite();
				this._loadImg[i][j].bitmap = ImageManager.loadPicture('SightRange');
				this._loadImg[i][j].x = j * 50;
				this._loadImg[i][j].y = i * 50;
				this.addChild( this._loadImg[i][j] );
				this._loadImg[i][j].opacity = 100;				
			};
		};
	};
};
	
Scene_Map.prototype.imagesRefresh = function() {
	var single_pixel = 48;
	this._hasBarrier = false;
	
	if ($gameSwitches.value(5, true))	{
		for (i = 0; i < this._loadImg.length; i++)	{
			for (j = 0; j < this._loadImg[i].length; j++)	{
				if (this._loadImg[i][j] != null)	{
					switch ($gameMap.event($watchman_information[i][1]).direction()) {
						case 8:
							this._loadImg[i][j].x = $gameMap.event($watchman_information[i][1]).screenX();
							this._loadImg[i][j].y = $gameMap.event($watchman_information[i][1]).screenY() - (single_pixel * (j + 1));
							this.checkBarrier(i, j)
							if (this._hasBarrier)	{
								this._loadImg[i][j].opacity = 0;
							} else	{	this._loadImg[i][j].opacity = 100;	};
							//圖片XY位置補正
							this._loadImg[i][j].x = ($gameMap.event($watchman_information[i][1]).screenX() - (single_pixel / 2));
							this._loadImg[i][j].y = ($gameMap.event($watchman_information[i][1]).screenY() - single_pixel) - (single_pixel * (j + 1));
							break;
						case 2:
							this._loadImg[i][j].x = $gameMap.event($watchman_information[i][1]).screenX();
							this._loadImg[i][j].y = $gameMap.event($watchman_information[i][1]).screenY() + (single_pixel * (j + 1));
							this.checkBarrier(i, j)
							if (this._hasBarrier)	{
								this._loadImg[i][j].opacity = 0;
							} else	{	this._loadImg[i][j].opacity = 100;	};
							//圖片XY位置補正
							this._loadImg[i][j].x = ($gameMap.event($watchman_information[i][1]).screenX() - (single_pixel / 2));
							this._loadImg[i][j].y = ($gameMap.event($watchman_information[i][1]).screenY() - single_pixel) + (single_pixel * (j + 1));
							break;
						case 4:
							this._loadImg[i][j].x = $gameMap.event($watchman_information[i][1]).screenX()- (single_pixel * (j + 1));
							this._loadImg[i][j].y = $gameMap.event($watchman_information[i][1]).screenY();
							this.checkBarrier(i, j)
							if (this._hasBarrier)	{
								this._loadImg[i][j].opacity = 0;
							} else	{	this._loadImg[i][j].opacity = 100;	};
							//圖片XY位置補正
							this._loadImg[i][j].x = ($gameMap.event($watchman_information[i][1]).screenX() - (single_pixel / 2)) - (single_pixel * (j + 1));
							this._loadImg[i][j].y = ($gameMap.event($watchman_information[i][1]).screenY() - single_pixel);
							break;
						case 6:
							this._loadImg[i][j].x = $gameMap.event($watchman_information[i][1]).screenX()+ (single_pixel * (j + 1));
							this._loadImg[i][j].y = $gameMap.event($watchman_information[i][1]).screenY();
							this.checkBarrier(i, j)
							if (this._hasBarrier)	{
								this._loadImg[i][j].opacity = 0;
							} else	{	this._loadImg[i][j].opacity = 100;	};
							//圖片XY位置補正
							this._loadImg[i][j].x = ($gameMap.event($watchman_information[i][1]).screenX() - (single_pixel / 2)) + (single_pixel * (j + 1));
							this._loadImg[i][j].y = ($gameMap.event($watchman_information[i][1]).screenY() - single_pixel);
							break;
						default:
							this._loadImg[i][j].x = ($gameMap.event($watchman_information[i][1]).screenX() - (single_pixel / 2));
							this._loadImg[i][j].y = ($gameMap.event($watchman_information[i][1]).screenY() - single_pixel);
							break;
					};
				};
			};
		};
	};
};
	
Scene_Map.prototype.checkBarrier = function(i, j) {
	var single_pixel = 48;
	var barrierEvent = 0;
	
	for (n = 0; n < $barrier_information.length; n++)	{
		if ($barrier_information[n][0] == $gameMap.mapId())	{
			barrierEvent = $gameMap.event($barrier_information[n][1]);
			
			//this._loadImg[i][j]需要加上6，誤差值，不知道為毛！
			switch ($gameMap.event($watchman_information[i][1]).direction()) {
				case 8:
					if ($gameMap.event($watchman_information[i][1]).y <= barrierEvent.y)	{
						// this._hasBarrier = false;
						break;
					};
					// if (this._loadImg[i][j].x == barrierEvent.screenX() && (this._loadImg[i][j].y + 6) <= barrierEvent.screenY())	{
					if ($gameMap.event($watchman_information[i][1]).x == barrierEvent.x && (this._loadImg[i][j].y) <= barrierEvent.screenY())	{
						this._hasBarrier = true;
						return;
					}	else	{this._hasBarrier = false;};
					break;
				case 2:
					if ($gameMap.event($watchman_information[i][1]).y >= barrierEvent.y)	{
						// this._hasBarrier = false;
						break;
					};
					// if (this._loadImg[i][j].x == barrierEvent.screenX() && (this._loadImg[i][j].y + 6) >= barrierEvent.screenY())	{
					if ($gameMap.event($watchman_information[i][1]).x == barrierEvent.x && (this._loadImg[i][j].y + 6) >= barrierEvent.screenY())	{
						this._hasBarrier = true;
						return;
					}	else	{this._hasBarrier = false;};
					break;
				case 4:
					if ($gameMap.event($watchman_information[i][1]).x <= barrierEvent.x)	{
						// this._hasBarrier = false;
						break;
					};
					// if ((this._loadImg[i][j].x) <= barrierEvent.screenX() && (this._loadImg[i][j].y) == barrierEvent.screenY())	{
					if ((this._loadImg[i][j].x) <= barrierEvent.screenX() && ($gameMap.event($watchman_information[i][1]).y) == barrierEvent.y)	{
						this._hasBarrier = true;
						return;
					}	else	{this._hasBarrier = false;};
					break;
				case 6:
					if ($gameMap.event($watchman_information[i][1]).x >= barrierEvent.x)	{
						// this._hasBarrier = false;
						break;
					};
					// if ((this._loadImg[i][j].x) >= barrierEvent.screenX() && (this._loadImg[i][j].y + 6) == barrierEvent.screenY())	{
					if ((this._loadImg[i][j].x) >= barrierEvent.screenX() && $gameMap.event($watchman_information[i][1]).y == barrierEvent.y)	{
						this._hasBarrier = true;
						return;
					}	else	{this._hasBarrier = false;};
					break;
				default:
					break;
			};
		};
	};
};
	
	
	
	
	