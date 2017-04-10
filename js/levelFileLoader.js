class LevelFileLoader {

	constructor() {
		this._levelNames = [	"level01", "level02", "level03", "level04", "level05",
									"level06", "level07", "level08", "level09", "level10",
									"level11", "level12", "level13", "level14", "level15",
									"level16", "level17", "level18", "level19", "funnyboxes",
								 	"threeblocks", "learntojump01", "learntojump02", "learntojump03"];
	}

	// Load content (strings) of levels files, specified in this._levelNames, into an array.
	// When all files are loaded successfully callbackFunction will be called
	// with this array as argument.
	// Order defined by this._levelNames will be preserved.
	loadLevelFilesIntoArray(callbackFunction) {
		var counter = 0;
		var levelNames = this._levelNames;
		var levelNamesLength = this._levelNames.length;
		var result = new Array(levelNamesLength);

		for (var i = 0; i < levelNamesLength; i++) {
			(function(index) {
				jQuery.get("levels/" + levelNames[index] + ".txt", function(data) {
					result[index] = data;
					counter++;
					if (counter >= levelNamesLength) {
						callbackFunction(result);
					}
				});
			}) (i);
		}
	}
}
