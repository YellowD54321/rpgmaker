/*




*/

//HUD視窗函式
function MinecraftHUD() {
    this.initialize.apply(this, arguments);
};

MinecraftHUD.prototype = Object.create(Window_Base.prototype);
MinecraftHUD.prototype.constructor = MinecraftHUD;

MinecraftHUD.prototype.initialize = function(x, y) {
    var width = (this.spacing() * 2) + ((this.IconWidth() + 6) * 9) + (this.IconformSpacing() * 8);
    var height = (this.spacing() * 2) + (this.IconHeight() + 6);
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
};

MinecraftHUD.prototype.windowWidth = function() {
    return this.width();
};

MinecraftHUD.prototype.windowHeight = function() {
    return this.height();
};

MinecraftHUD.prototype.IconformWidthSide = function() {
    return 3;
};

MinecraftHUD.prototype.IconformHeightSide = function() {
    return 3;
};

MinecraftHUD.prototype.spacing = function() {
    return 18;
};

MinecraftHUD.prototype.IconformSpacing = function() {
    return 5;
};

MinecraftHUD.prototype.IconWidth = function() {
    return Window_Base._iconWidth;
};

MinecraftHUD.prototype.IconHeight = function() {
    return Window_Base._iconHeight;
};

MinecraftHUD.prototype.refresh = function() {
	var iconwidth = this.IconWidth();
	var iconformWidthside = this.IconformWidthSide();
	var iconformHeightside = this.IconformHeightSide();
	var iconformspacing = this.IconformSpacing();
	
	// this.width = (this.spacing() * 2) + ((this.IconWidth() + 6) * 9) + (this.IconformSpacing() * 8);
	// this.height = (this.spacing() * 2) + (this.IconHeight() + 6);
   this.contents.clear();
	
	this.x = (Graphics.width - this.width) / 2;
	this.y = Graphics.height - this.height;
	
	for (i = 0; i < 9; i++) {
		// if ((i + 1) == $itemList_BarNowChoose){
			// this.Minecraft_drawIconform((iconwidth + (iconformWidthside * 2)  + iconformspacing) * i - 3, 0 - 3);
			// this.Minecraft_drawIconform((iconwidth + (iconformWidthside * 2)  + iconformspacing) * i - 3, 0 + 3);
			// this.Minecraft_drawIconform((iconwidth + (iconformWidthside * 2)  + iconformspacing) * i + 3, 0 - 3);
			// this.Minecraft_drawIconform((iconwidth + (iconformWidthside * 2)  + iconformspacing) * i + 3, 0 + 3);
			// this.Minecraft_drawIconform((iconwidth + (iconformWidthside * 2)  + iconformspacing) * i, 0);

		// }else {
			// this.Minecraft_drawIconform((iconwidth + (iconformWidthside * 2)  + iconformspacing) * i, 0);
		// };
		this.Minecraft_drawIconform((iconwidth + (iconformWidthside * 2)  + iconformspacing) * i, 0);
		if ($itemList_Bar[i + 1] != 0 && $itemList_Bar[i + 1] != null)
			this.Minecraft_drawIcon($dataItems[$itemList_Bar[i + 1]].iconIndex, iconformWidthside + (iconwidth + (iconformWidthside * 2) + iconformspacing) * i, 0 + iconformHeightside);
		if ((i + 1) == $itemList_BarNowChoose)
			this.Minecraft_drawIconformChoose((iconwidth + (iconformWidthside * 2)  + iconformspacing) * i, 0);
	};
};

MinecraftHUD.prototype.open = function() {
    this.refresh();
    Window_Base.prototype.open.call(this);
};


//Scene_map
var Minecraft_mapstart = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {

	Minecraft_mapstart.call(this);
	this.creatMinecraftHUD();
};

var Minecraft_callMenu = Scene_Map.prototype.callMenu;
Scene_Map.prototype.callMenu = function() {

	Minecraft_callMenu.call(this);
	this._showWin.hide();
};

Scene_Map.prototype.creatMinecraftHUD = function(){
	
	this._showWin = new MinecraftHUD();
	this._showWin.opacity = 255;
	this._showWin.x = 0;
	this._showWin.y = 0;
	this.addChild( this._showWin );
};

var Minecraft_mapupdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	Minecraft_mapupdate.call(this);
	this._showWin.opacity = 100;
	this._showWin.x = 0;
	this._showWin.y = 0;
	this._showWin.refresh();
	// console.log($itemList_Bar[1]);

};

//drawIcon
MinecraftHUD.prototype.Minecraft_drawIcon = function(iconIndex, x, y) {
   var bitmap = ImageManager.loadSystem('IconSet');
   var pw = Window_Base._iconWidth;
   var ph = Window_Base._iconHeight;
   var sx = iconIndex % 16 * pw;
   var sy = Math.floor(iconIndex / 16) * ph;

	 // bitmap._paintOpacity = 255;
	 
   bitmap.addLoadListener(function() {
		this.contents.blt(bitmap, sx, sy, pw, ph, x, y);      
   }.bind(this));
		
};

//drawIconform
MinecraftHUD.prototype.Minecraft_drawIconform = function(x, y) {
   var bitmap = ImageManager.loadPicture('Iconform');
   var pw = Window_Base._iconWidth + this.IconformWidthSide() * 2;
   var ph = Window_Base._iconHeight + this.IconformHeightSide() * 2;
	 // console.log(bitmap);
	 bitmap.opacity = 100;
	 // console.log(bitmap);
   // var sx = iconIndex % 16 * pw;
   // var sy = Math.floor(iconIndex / 16) * ph;

   bitmap.addLoadListener(function() {
		this.contents.blt(bitmap, 0, 0, pw, ph, x, y);      
   }.bind(this));
		
};

MinecraftHUD.prototype.Minecraft_drawIconformChoose = function(x, y) {
   var bitmap = ImageManager.loadPicture('Iconformchoose');
   var pw = Window_Base._iconWidth + this.IconformWidthSide() * 2;
   var ph = Window_Base._iconHeight + this.IconformHeightSide() * 2;
	 // console.log(bitmap);
	 // bitmap.opacity = 100;
	 // console.log(bitmap);
   // var sx = iconIndex % 16 * pw;
   // var sy = Math.floor(iconIndex / 16) * ph;

   bitmap.addLoadListener(function() {
		this.contents.blt(bitmap, 0, 0, pw, ph, x, y);      
   }.bind(this));
		
};

