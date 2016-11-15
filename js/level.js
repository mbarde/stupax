class Level {

	constructor(name, scene, camera) {
		this._platforms = [];
		this._scene = scene;
		this._camera = camera;
		this.loadLevel(name);
	}

	loadLevel(name) {
		this._guy = new Guy(1, 1, this._scene);

		var clr = {r: 0.9, g: 0.9, b: 0.9};
		var p = new Platform(3, 1, 0, 0, clr, this._guy, this._scene);
		var p = new Platform(1, 1, 0, 1, clr, this._guy, this._scene);
		var p = new Platform(5, 1, 10, 5, clr, this._guy, this._scene);
		var p = new Platform(1, 5, 12, 0, clr, this._guy, this._scene);

		clr = {r: 0.9, g: 0.0, b: 0.0};
		this._movablePlatform = new MovablePlatform(2, 1, 4, 0, clr, this._guy, this._scene);
	}

	update() {
		var guyPos = this._guy._mesh.getAbsolutePosition();
		var movPos = this._movablePlatform._mesh.getAbsolutePosition();
		var movWidth = this._movablePlatform._width;
		var movHeight = this._movablePlatform._height;

		if (guyPos.x >= movPos.x - movWidth*CONS_SCALE/2 && guyPos.x <= movPos.x + movWidth*CONS_SCALE/2
			&& guyPos.y >= movPos.y && guyPos.y <= movPos.y + movHeight*CONS_SCALE/2 + this._guy._height*CONS_SCALE) {
					this._guy._isOnMovablePlatform = true;
		} else {
			this._guy._isOnMovablePlatform = false;
		}

		this._guy.update();
		this._movablePlatform.update();

		this._camera.position.x = movPos.x;
	}

	keyDown(keyCode) {
		this._movablePlatform.keyDown(keyCode);
	}

	keyUp(keyCode) {
		this._movablePlatform.keyUp(keyCode);
	}

}
