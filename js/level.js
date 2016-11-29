class Level {

	constructor(levelString, scene, camera) {
		this._platforms = [];
		this._scene = scene;
		this._camera = camera;
		this.loadLevel(levelString);
	}

	loadLevel(level) {
		var lvl = JSON.parse(level);

		this._levelWidth = 500;
		this._levelHeight = 20;

		// Spawn guy
		this._guy = new Guy(lvl.guy._posX, lvl.guy._posY, this._scene);

		// Set platforms
		var ps = lvl.platforms;
		this._platforms = new Array();
		for (var i = 0; i < ps.length; i++) {
			this._platforms.push( new Platform(ps[i]._width, ps[i]._height,
											ps[i]._posX, ps[i]._posY,
											this._guy, this._scene) );
		}

		var movPlat = lvl.movPlatform;
		this._movablePlatform = new MovablePlatform(movPlat._width, movPlat._height,
										movPlat._posX, movPlat._posY,
										this._guy, this._scene);

		this._light0 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 15, -3), this._scene);

		this.initBackground();
	}

	initBackground() {
		var material = new BABYLON.StandardMaterial("Mat", this._scene);
		material.diffuseTexture = new BABYLON.Texture("textures/block01.png", this._scene);
		material.backFaceCulling = false;
		material.diffuseTexture.uScale = (this._levelWidth + 9 * CONS_SCALE)
		material.diffuseTexture.uOffset = 0.5;
		material.diffuseTexture.vScale = (this._levelHeight)

		// Background marks area of level
		var background = BABYLON.MeshBuilder.CreatePlane("plane", {width: (this._levelWidth + 9 * CONS_SCALE) * CONS_SCALE, height: (this._levelHeight * CONS_SCALE)}, this._scene);
		background.material = material;
		background.position.x = (this._levelWidth * CONS_SCALE) / 2;
		background.position.y = (this._levelHeight * CONS_SCALE) / 2 - 4 * CONS_SCALE;
		background.position.z = CONS_SCALE/2;
		background.receiveShadows = false;
	}

	update() {
		var guyPos = this._guy._mesh.getAbsolutePosition();
		var movPos = this._movablePlatform._mesh.getAbsolutePosition();
		var movWidth = this._movablePlatform._width;
		var movHeight = this._movablePlatform._height;

		if (guyPos.x > movPos.x - movWidth*CONS_SCALE/2 && guyPos.x < movPos.x + movWidth*CONS_SCALE/2
			&& guyPos.y > movPos.y && guyPos.y < movPos.y + movHeight*CONS_SCALE/2 + this._guy._height*CONS_SCALE + 0.5) {
					this._guy._isOnMovablePlatform = true;
		} else {
			this._guy._isOnMovablePlatform = false;
		}

		this._guy.update();
		this._movablePlatform.update();

		this._camera.position.x = movPos.x;

		this._light0.position.x = this._movablePlatform._mesh.getAbsolutePosition().x;
		this._light0.position.y = this._movablePlatform._mesh.getAbsolutePosition().y;
	}

	keyDown(keyCode) {
		this._movablePlatform.keyDown(keyCode);
	}

	keyUp(keyCode) {
		this._movablePlatform.keyUp(keyCode);
	}

}
