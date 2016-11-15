class Game {

	constructor(scene, camera) {
		this._scene = scene;
		this._camera = camera;

		this._level = new Level("42", this._scene, this._camera);
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
