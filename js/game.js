class Game extends Mode {

	constructor(scene, camera, assetsManager, loadLevel_function) {
		super(scene, camera);

		this._camera.position.x = 10 * CONS_SCALE;
		this._camera.position.y = 10 * CONS_SCALE;
		this._camera.rotation.y = 0.2;

		this._levelFactory = new LevelFactory(this._scene, this._camera, assetsManager, loadLevel_function);

		this._level = false;
	}

	loadLevel(levelString) {
		var isFirstLevel = true;
		if (this._level) {
			isFirstLevel = false;
			this._level.destroy();
		}
		this._level = this._levelFactory.stringToLevelObject(levelString);

		if (isFirstLevel) {
			this._level.setGuyRunState(false);
			this._level._blockGuy = true;
		}
	}

	update() {
		this._level.update();
	}

	keyDown(ctrlCode) {
		if (!this._level._camFly) this._level.keyDown(ctrlCode);
	}

	keyUp(ctrlCode) {
		if (!this._level._camFly) this._level.keyUp(ctrlCode);
	}

	startRunning() {
		this._level.setGuyRunState(true);
		this._level._blockGuy = false;
	}

	onPause() {
		if (this._level)
			this._level.onPause();
	}

}
