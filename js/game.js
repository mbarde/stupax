class Game extends Mode {

	constructor(levelString, scene, camera, assetsManager, loadLevel_function, isFirst) {
		super(scene, camera);

		this._camera.position.x = 10 * CONS_SCALE;
		this._camera.position.y = 10 * CONS_SCALE;
		this._camera.rotation.y = 0.2;

		this._level = new Level(levelString, this._scene, this._camera, assetsManager, loadLevel_function);
		if (isFirst) this._level._guy.setRunState(false);
	}

	update() {
		this._level.update();
	}

	keyDown(ctrlCode) {
		this._level.keyDown(ctrlCode);
	}

	keyUp(ctrlCode) {
		this._level.keyUp(ctrlCode);
	}

	startRunning() {
		this._level._guy.setRunState(true);
	}

}
