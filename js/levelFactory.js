/*
* LevelFactory class to be able to outsource the loading process from level class
*/
class LevelFactory {

	constructor(scene, camera, assetsManager, onFinished) {
		this._scene = scene;
		this._camera = camera;
		this._assetsManager = assetsManager;
		this._onFinished = onFinished;
	}

	stringToLevelObject(levelString) {
		var levelObject = new Level(this._scene, this._camera, this._assetsManager, this._onFinished);

		var levelJSON = JSON.parse(levelString);
		levelObject._levelJSON = levelJSON;

		// Level values
		if (levelJSON.name) {
			levelObject._levelName = levelJSON.name;
		} else {
			levelObject._levelName = "level";
		}
		levelObject._levelWidth = 500;
		levelObject._levelHeight = 20;
		levelObject._subsequentLevel = levelJSON.finish.target;

		// Spawn guy
		levelObject._guy = new Guy(levelJSON.guy._posX, levelJSON.guy._posY, levelObject._scene, levelObject._assetsManager);

		// Set platforms
		var ps = levelJSON.platforms;
		levelObject._platforms = new Array();
		for (var i = 0; i < ps.length; i++) {
			levelObject._platforms.push( new Platform(ps[i]._width, ps[i]._height,
											ps[i]._posX, ps[i]._posY,
											levelObject._scene, levelObject._assetsManager) );
		}

		// Set movable platform
		var movPlat = levelJSON.movPlatform;
		levelObject._movablePlatform = new MovablePlatform(movPlat._width, movPlat._height,
										movPlat._posX, movPlat._posY,
										levelObject._scene, levelObject._assetsManager);

		// Set boxes
		levelObject._boxes = new Array();
		if (levelJSON.boxes) {
			for (var i = 0; i < levelJSON.boxes.length; i++) {
				var box = levelJSON.boxes[i];
				levelObject._boxes.push( new Box(box._width, box._height, box._posX, box._posY, CONS_BOX_DEFAULT_MASS, levelObject._scene, levelObject._assetsManager));
			}
		}

		// Set emitters
		levelObject._emitters = new Array();
		if (levelJSON.emitters) {
			for (var i = 0; i < levelJSON.emitters.length; i++) {
				var emitter = levelJSON.emitters[i];
				levelObject._emitters.push(
					new Emitter(emitter._posX, emitter._posY,
						emitter.directions, emitter.interval, emitter.offset,
						levelObject._scene, levelObject._assetsManager, levelObject)
				);
			}
		}

		// Set finish
		levelObject._finish = new Finish(levelJSON.finish._posX, levelJSON.finish._posY, levelObject._scene, levelObject._assetsManager);

		// Set background
		levelObject._background = new Background(levelObject._levelWidth, levelObject._levelHeight, levelObject._scene, levelObject._assetsManager);

		levelObject.initCameraForFinishToStartFlight();

		return levelObject;
	}

}
