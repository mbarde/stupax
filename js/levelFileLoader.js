class LevelFileLoader {

	constructor() {
		this._levelNames = [	"level01", "level02", "level03", "level04", "level05",
									"level06", "level07", "level08", "level09", "level10",
									"level11", "level12", "level13", "level14", "level15",
									"level16", "level17", "level18", "level19", "funnyboxes",
								 	"threeblocks", "learntojump01", "learntojump02", "learntojump03"];
	}

	loadLevelFilesIntoArray(callbackFunction) {
		var result = new Array();
		var counter = 0;
		var levelNamesLength = this._levelNames.length;

		for (var i = 0; i < levelNamesLength; i++) {
			jQuery.get("levels/" + this._levelNames[i] + ".txt", function(data) {
				result.push(data);
				counter++;
				if (counter >= levelNamesLength) {
					callbackFunction(result);
				}
			});
		}
	}
}
