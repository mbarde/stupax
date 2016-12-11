class Game extends Mode {

	constructor(levelString, scene, camera, loadLevel_function) {
		super(scene, camera);

		this._camera.position.x = 10 * CONS_SCALE;
		this._camera.position.y = 10 * CONS_SCALE;
		this._camera.rotation.y = 0.2;

		this._level = new Level(levelString, this._scene, this._camera, loadLevel_function);
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

}
