class Level {

	constructor(levelString, scene, camera, onFinished) {
		this._platforms = [];
		this._boxes = [];
		this._scene = scene;
		this._camera = camera;
		this._onFinished = onFinished; // function to execute when player reaches finish
		this._finished = false; // will contain timestamp of win when player reaches door
		this.loadLevel(levelString);
	}

	loadLevel(level) {
		var lvl = JSON.parse(level);

		this._levelWidth = 500;
		this._levelHeight = 20;

		// Spawn guy
		this._guy = new Guy(lvl.guy._posX, lvl.guy._posY, this._scene);

		var box = new Box(1,1, lvl.guy._posX + 3, lvl.guy._posY + 2, 2, this._guy, this._scene);
		this._boxes.push(box);

		// Set platforms
		var ps = lvl.platforms;
		this._platforms = new Array();
		for (var i = 0; i < ps.length; i++) {
			this._platforms.push( new Platform(ps[i]._width, ps[i]._height,
											ps[i]._posX, ps[i]._posY,
											this._guy, this._scene) );
		}

		// Set movable platform
		var movPlat = lvl.movPlatform;
		this._movablePlatform = new MovablePlatform(movPlat._width, movPlat._height,
										movPlat._posX, movPlat._posY,
										this._guy, this._scene);

		// Set finish
		this.initFinish(lvl.finish);

		this._light0 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 15, -3), this._scene);

		this.initBackground();

		this._levelObject = lvl;
	}

	restart() {
		var lvl = this._levelObject;
		this._finished = false;
		this._guy.reset(lvl.guy._posX, lvl.guy._posY);
		this._movablePlatform.reset(lvl.movPlatform._posX, lvl.movPlatform._posY);
	}

	initFinish(finishObject) {
		// Create invisible mesh for collision detection -------------------------
		var material = new BABYLON.StandardMaterial("finish", this._scene);
		material.alpha = 0.0;

		this._finish = BABYLON.MeshBuilder.CreatePlane("finish", {height: CONS_SCALE, width: CONS_SCALE}, this._scene);
		this._finish.material = material;
		this._finish.position.x = (finishObject._posX + 0.5)  * CONS_SCALE;
		this._finish.position.y = (finishObject._posY + 0.5) * CONS_SCALE;
		this._finish.position.z = 0;

		// Rotate plane to make it stand orthogonal to players plane
		var q = BABYLON.Quaternion.RotationYawPitchRoll(90, 0, 0);
		this._finish.rotationQuaternion = q;
		// -----------------------------------------------------------------------

		// Create plane containing the finish texture ----------------------------
		material = new BABYLON.StandardMaterial("finish", this._scene);
		material.diffuseTexture = new BABYLON.Texture("textures/door.png", this._scene);
		material.diffuseTexture.hasAlpha = true;
		material.backFaceCulling = true;

		var mesh = BABYLON.MeshBuilder.CreatePlane("finish", {height: CONS_SCALE, width: CONS_SCALE}, this._scene);
		mesh.material = material;
		mesh.position.x = (finishObject._posX + 0.5)  * CONS_SCALE;
		mesh.position.y = (finishObject._posY + 0.5) * CONS_SCALE;
		mesh.position.z = CONS_SCALE/2 - 0.001;
		// -----------------------------------------------------------------------

		this._light1 = new BABYLON.SpotLight("Spot0",
							new BABYLON.Vector3((finishObject._posX + 0.5) * CONS_SCALE, (finishObject._posY + 1) * CONS_SCALE, -2 * CONS_SCALE),
							new BABYLON.Vector3(0, 0, 1), 1.2, 30, this._scene);
		this._light1.diffuse = new BABYLON.Color3(1, 0, 0);
		this._light1.specular = new BABYLON.Color3(1, 0, 0);

		this._finish.target = finishObject.target;
	}

	initBackground() {
		var material = new BABYLON.StandardMaterial("Mat", this._scene);
		material.diffuseTexture = new BABYLON.Texture("textures/block01.png", this._scene);
		material.backFaceCulling = true;
		material.diffuseTexture.uScale = (this._levelWidth + 9 * CONS_SCALE)
		material.diffuseTexture.uOffset = 0.5;
		material.diffuseTexture.vScale = (this._levelHeight);

		// Background marks area of level
		this._background = BABYLON.MeshBuilder.CreatePlane("plane", {width: (this._levelWidth + 9 * CONS_SCALE) * CONS_SCALE, height: (this._levelHeight * CONS_SCALE)}, this._scene);
		this._background.material = material;
		this._background.position.x = (this._levelWidth * CONS_SCALE) / 2;
		this._background.position.y = (this._levelHeight * CONS_SCALE) / 2 - 4 * CONS_SCALE;
		this._background.position.z = CONS_SCALE/2;
		this._background.receiveShadows = false;

		this._background.setPhysicsState(BABYLON.PhysicsEngine.PlaneImpostor, { mass: 0, restitution: CONS_RESTITUTION_PLAT, move: false });
	}

	update() {
		var guyPos = this._guy._mesh.getAbsolutePosition();
		var movPos = this._movablePlatform._mesh.getAbsolutePosition();
		var movWidth = this._movablePlatform._width;
		var movHeight = this._movablePlatform._height;

		//for (var i = 0; i < this._boxes.length; i++) {
		//	this._boxes[i].update();
		//}

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
		this._light0.position.y = this._movablePlatform._mesh.getAbsolutePosition().y //;+ (this._movablePlatform._height/2) * CONS_SCALE;

		if (this._finished) {
			var time = new Date().getTime();
			if (time - this._finished >= CONS_FINISH_CELEB_TIME) {
				this._onFinished(this._finish.target);
			}
		} else if (this._finish.intersectsMesh(this._guy._mesh)) {
			this._light1.diffuse = new BABYLON.Color3(0, 1, 0);
			this._light1.specular = new BABYLON.Color3(0, 1, 0);
			this._guy.onWin();
			this._finished = new Date().getTime();
		}

		if (this._guy._mesh.getAbsolutePosition().y < (CONS_LEVEL_BOTTOM-2) * CONS_SCALE) {
			this.restart();
		}
	}

	keyDown(ctrlCode) {
		this._movablePlatform.keyDown(ctrlCode);

		switch (ctrlCode) {
			case CTRL_RESTART:
				this.restart();
				return;
		}
	}

	keyUp(ctrlCode) {
		this._movablePlatform.keyUp(ctrlCode);
	}

}
