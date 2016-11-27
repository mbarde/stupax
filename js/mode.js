/**
* This class represents an abstract game mode
* (concrete game modes can be: editor, game)
**/
class Mode {

	constructor(scene, camera) {
		this._scene = scene;
		this._camera = camera;
	}

	update() {
	}

	keyDown(keyCode) {
	}

	keyUp(keyCode) {
	}

}
