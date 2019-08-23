//-----------------------------------------------------------------------------
//修改Window_ChoiceList來製作
// The window used for the event command [Show Choices].

function Window_ChoosePartyMemberInShrine() {
    this.initialize.apply(this, arguments);
}

Window_ChoosePartyMemberInShrine.prototype = Object.create(Window_HorzCommand.prototype);
Window_ChoosePartyMemberInShrine.prototype.constructor = Window_ChoosePartyMemberInShrine;

Window_ChoosePartyMemberInShrine.prototype.initialize = function(messageWindow) {
    this._messageWindow = messageWindow;
    Window_HorzCommand.prototype.initialize.call(this, 0, 0);
    this.openness = 0;
    this.deactivate();
    this._background = 0;
};

Window_ChoosePartyMemberInShrine.prototype.start = function() {
    this.updatePlacement();
    this.updateBackground();
    this.refresh();
    this.selectDefault();
    this.open();
    this.activate();
};

Window_ChoosePartyMemberInShrine.prototype.selectDefault = function() {
    this.select($gameMessage.shrineChoiceDefaultType());
};

Window_ChoosePartyMemberInShrine.prototype.updatePlacement = function() {
    var positionType = $gameMessage.shrineChoicePositionType();
    var messageY = this._messageWindow.y;
    this.width = this.windowWidth();
    this.height = this.windowHeight();
    switch (positionType) {
    case 0:
        this.x = 0;
        break;
    case 1:
				//Edited by YellowD
        // this.x = (Graphics.boxWidth - this.width) / 2;
				this.x = 50;
        break;
    case 2:
        this.x = Graphics.boxWidth - this.width;
        break;
    }
    if (messageY >= Graphics.boxHeight / 2) {
        this.y = messageY - this.height;
    } else {
        this.y = messageY + this._messageWindow.height;
    }
};

Window_ChoosePartyMemberInShrine.prototype.updateBackground = function() {
    this._background = $gameMessage.shrineChoiceBackground();
    this.setBackgroundType(this._background);
};

Window_ChoosePartyMemberInShrine.prototype.windowWidth = function() {
    var width = this.maxChoiceWidth() + this.padding * 2;
    return Math.min(width, Graphics.boxWidth);
};

Window_ChoosePartyMemberInShrine.prototype.numVisibleRows = function() {
    var messageY = this._messageWindow.y;
    var messageHeight = this._messageWindow.height;
    var centerY = Graphics.boxHeight / 2;
    var choices = $gameMessage.shrineChoices();
    var numLines = choices.length;
    var maxLines = 8;
    if (messageY < centerY && messageY + messageHeight > centerY) {
        maxLines = 4;
    }
    if (numLines > maxLines) {
        numLines = maxLines;
    }
    return numLines;
};

Window_ChoosePartyMemberInShrine.prototype.maxChoiceWidth = function() {
    var maxWidth = 96;
    var choices = $gameMessage.shrineChoices();
    for (var i = 0; i < choices.length; i++) {
        var choiceWidth = this.textWidthEx(choices[i]) + this.textPadding() * 2;
        if (maxWidth < choiceWidth) {
            maxWidth = choiceWidth;
        }
    }
    return maxWidth;
};

Window_ChoosePartyMemberInShrine.prototype.textWidthEx = function(text) {
    return this.drawTextEx(text, 0, this.contents.height);
};

Window_ChoosePartyMemberInShrine.prototype.contentsHeight = function() {
    return this.maxItems() * this.itemHeight();
};

Window_ChoosePartyMemberInShrine.prototype.makeCommandList = function() {
    var choices = $gameMessage.shrineChoices();
    for (var i = 0; i < choices.length; i++) {
        this.addCommand(choices[i], 'choice');
    }
};

Window_ChoosePartyMemberInShrine.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    this.drawTextEx(this.commandName(index), rect.x, rect.y);
};

Window_ChoosePartyMemberInShrine.prototype.isCancelEnabled = function() {
    return $gameMessage.shrineChoiceCancelType() !== -1;
};

Window_ChoosePartyMemberInShrine.prototype.isOkTriggered = function() {
    return Input.isTriggered('ok');
};

Window_ChoosePartyMemberInShrine.prototype.callOkHandler = function() {
    $gameMessage.onShrineChoice(this.index());
    this._messageWindow.terminateMessage();
    this.close();
};

Window_ChoosePartyMemberInShrine.prototype.callCancelHandler = function() {
    $gameMessage.onShrineChoice($gameMessage.shrineChoiceCancelType());
    this._messageWindow.terminateMessage();
    this.close();
};

//改寫Game_Interpreter.setupChoices來啟動視窗
function RoguelikeSetupShrineChoices() {
// Game_Interpreter.prototype.setupShrineChoices = function(params) {
    // var choices = params[0].clone();
    // var cancelType = params[1];
    // var defaultType = params.length > 2 ? params[2] : 0;
    // var positionType = params.length > 3 ? params[3] : 2;
    // var background = params.length > 4 ? params[4] : 0;
    // if (cancelType >= choices.length) {
        // cancelType = -2;
    // }
		var choices = ["123", "456"];
    var cancelType = 0;
    var defaultType = 0;
    var positionType = 2;
    var background = 0;
    if (cancelType >= choices.length) {
        cancelType = -2;
    }
    $gameMessage.setShrineChoices(choices, defaultType, cancelType);
    $gameMessage.setShrineChoiceBackground(background);
    $gameMessage.setShrineChoicePositionType(positionType);
    $gameMessage.setShrineChoiceCallback(function(n) {
        this._branch[this._indent] = n;
    }.bind(this));
};

//改寫Game_Message中的設定
var RoguelikeChoosePartyMemberInShrine_Game_Message_clear = Game_Message.prototype.clear;
Game_Message.prototype.clear = function() {
    RoguelikeChoosePartyMemberInShrine_Game_Message_clear.call(this);
    this._shrineChoices = [];
    this._shrineChoiceDefaultType = 0;
    this._shrineChoiceCancelType = 0;
    this._shrineChoiceBackground = 0;
    this._shrineChoicePositionType = 2;
    this._shrineChoiceCallback = null;
};

Game_Message.prototype.shrineChoiceDefaultType = function() {
    return this._shrineChoiceDefaultType;
};

Game_Message.prototype.shrineChoiceCancelType = function() {
    return this._shrineChoiceCancelType;
};

Game_Message.prototype.shrineChoiceBackground = function() {
    return this._shrineChoiceBackground;
};

Game_Message.prototype.shrineChoicePositionType = function() {
    return this._shrineChoicePositionType;
};

Game_Message.prototype.shrineChoices = function() {
    return this._shrineChoices;
};

Game_Message.prototype.isShrineChoice = function() {
    return this._shrineChoices.length > 0;
};

Game_Message.prototype.setShrineChoices = function(choices, defaultType, cancelType) {
    this._shrineChoices = choices;
    this._shrineChoiceDefaultType = defaultType;
    this._shrineChoiceCancelType = cancelType;
};

Game_Message.prototype.setShrineChoiceBackground = function(background) {
    this._shrineChoiceBackground = background;
};

Game_Message.prototype.setShrineChoicePositionType = function(positionType) {
    this._shrineChoicePositionType = positionType;
};

Game_Message.prototype.setShrineChoiceCallback = function(callback) {
    this._shrineChoiceCallback = callback;
};

Game_Message.prototype.onShrineChoice = function(n) {
    if (this._shrineChoiceCallback) {
        this._shrineChoiceCallback(n);
        this._shrineChoiceCallback = null;
    }
};

//改寫Window_Message中的設定
Window_Message.prototype.startInput = function() {
    if ($gameMessage.isChoice()) {
        this._choiceWindow.start();
        return true;
    } else if ($gameMessage.isShrineChoice()) {
        this._shrineWindow.start();
        return true;
    } else if ($gameMessage.isNumberInput()) {
        this._numberWindow.start();
        return true;
    } else if ($gameMessage.isItemChoice()) {
        this._itemWindow.start();
        return true;
    } else {
        return false;
    }
};

Window_Message.prototype.subWindows = function() {
    return [this._goldWindow, this._choiceWindow, this._shrineWindow,
            this._numberWindow, this._itemWindow];
};

Window_Message.prototype.createSubWindows = function() {
    this._goldWindow = new Window_Gold(0, 0);
    this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
    this._goldWindow.openness = 0;
    this._choiceWindow = new Window_ChoiceList(this);
    this._shrineWindow = new Window_ChoosePartyMemberInShrine(this);
    this._numberWindow = new Window_NumberInput(this);
    this._itemWindow = new Window_EventItem(this);
};

Window_Message.prototype.isAnySubWindowActive = function() {
    return (this._choiceWindow.active ||
						this._shrineWindow.active ||
            this._numberWindow.active ||
            this._itemWindow.active);
};