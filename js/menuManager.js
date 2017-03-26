class MenuManager {

	constructor(divOverlay, startFunction, activateRenderingFunction) {
		this._divOverlay = divOverlay;
		this._startFunction = startFunction;
		this._levelCount = 0;
		this._game = false;
		this._activateRenderingFunction = activateRenderingFunction;
	}

	loadMenuMain() {
		this.loadPartialToOverlay("menu.main",
			function(thisObject) {
				$('#btnStart').click( function() { thisObject._startFunction(); } );
				$('#btnChooseLevel').click( function() { thisObject.loadMenuChooseLevel(); } );
				//$('#btnSettings').click( function() { thisObject.loadMenuSettings(); } );
				$('#btnHelp').click( function() { thisObject.loadMenuHelp(); } );
			}
		);
	}

	loadMenuChooseLevel() {
		this.loadPartialToOverlay("menu.chooseLevel",
			function(thisObject) {
				var levelCount = thisObject._game.getLevelCount();
				for (var i = 0; i < levelCount; i++) {
					$('#divLevels').append('<button class="button button-level" levelid="' + i + '">' + i + '</button>');
				}
				$('.button-level').click( function() {
					thisObject._game.loadLevelByID( $(this).attr('levelid') );
					thisObject._activateRenderingFunction();
				});
				$('#btnBack').click( function() { thisObject.loadMenuMain(); } );
			}
		);
	}

	loadMenuSettings() {
		this.loadPartialToOverlay("menu.settings",
			function(thisObject) {
				$('#btnBack').click( function() { thisObject.loadMenuMain(); } );
			}
		);
	}

	loadMenuHelp() {
		this.loadPartialToOverlay("menu.help",
			function(thisObject) {
				$('#btnBack').click( function() { thisObject.loadMenuMain(); } );
			}
		);
	}

	loadPartialToOverlay(partialName, callbackFunction) {
		(function(thisObject) {
			jQuery.get("partials/" + partialName + ".html", function(data) {
				thisObject._divOverlay.html(data);
				callbackFunction(thisObject);
			});
		}) (this);
	}

	hideMenuOverlay() {
		this._divOverlay.hide();
	}

	showMenuOverlay() {
		this._divOverlay.show();
	}

	setLevelCount(levelCount) {
		this._levelCount = levelCount;
	}

	setGame(game) {
		this._game = game;
	}

}
