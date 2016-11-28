class Game extends Mode {

	constructor(levelString, scene, camera) {
		super(scene, camera);

		this._camera.position.x = 10 * CONS_SCALE;
		this._camera.position.y = 10 * CONS_SCALE;
		this._camera.rotation.y = 0.2;

		this._level = new Level(levelString, this._scene, this._camera);
	}

	update() {
		this._level.update();
	}

	keyDown(keyCode) {
		this._level.keyDown(keyCode);
	}

	keyUp(keyCode) {
		this._level.keyUp(keyCode);
	}

}
