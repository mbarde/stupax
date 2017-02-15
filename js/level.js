class Level {

	constructor(levelString, scene, camera, assetsManager, onFinished) {
		this._platforms = [];
		this._boxes = [];
		this._projectiles = [];
		this._emitters = [];
		this._scene = scene;
		this._assetsManager = assetsManager;
		this._camera = camera;
		this._onFinished = onFinished; 	// function to execute when player reaches finish
		this._finished = false; 			// will contain timestamp of win when player reaches door
		this._died = false;					// will contain timestamp of death when player died
		this.loadLevel(levelString);

		this._block_guy = false;			// block guy from running

		this._firstUpdate = true;
	}

	loadLevel(level) {
		var lvl = JSON.parse(level);

		this._levelWidth = 500;
		this._levelHeight = 20;

		// Spawn guy
		this._guy = new Guy(lvl.guy._posX, lvl.guy._posY, this._scene, this._assetsManager);

		// Set platforms
		var ps = lvl.platforms;
		this._platforms = new Array();
		for (var i = 0; i < ps.length; i++) {
			this._platforms.push( new Platform(ps[i]._width, ps[i]._height,
											ps[i]._posX, ps[i]._posY,
											this._guy, this._scene, this._assetsManager) );
		}

		// Set movable platform
		var movPlat = lvl.movPlatform;
		this._movablePlatform = new MovablePlatform(movPlat._width, movPlat._height,
										movPlat._posX, movPlat._posY,
										this._guy, this._scene, this._assetsManager);

		// Set boxes
		this._boxes = new Array();
		if (lvl.boxes) {
			for (var i = 0; i < lvl.boxes.length; i++) {
				var box = lvl.boxes[i];
				this._boxes.push( new Box(box._width, box._height, box._posX, box._posY, CONS_BOX_DEFAULT_MASS, this._guy, this._scene, this._assetsManager));
			}
		}

		// Set emitters
		this._emitters = new Array();
		if (lvl.emitters) {
			for (var i = 0; i < lvl.emitters.length; i++) {
				var emitter = lvl.emitters[i];
				this._emitters.push(
					new Emitter(emitter._posX, emitter._posY,
						emitter.directions, emitter.interval, emitter.offset,
						this._guy, this._scene, this._assetsManager, this)
				);
			}
		}

		// Set finish
		this.initFinish(lvl.finish);

		// Set light
		this._light0 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 15, -3), this._scene);

		// Init background
		this.initBackground();

		this._levelObject = lvl;

		// Init cam for cam fly from finish to movablePlatform
		this._camera.position.x = (lvl.finish._posX + 0.5)  * CONS_SCALE;
		this._cam_fly = new BABYLON.Vector3();
		this._cam_fly.x = this._camera.position.x - this._movablePlatform._mesh.getAbsolutePosition().x;
		this._cam_fly.y = 0;
		this._cam_fly.z = 0;
		this._cam_fly_last_dist = BABYLON.Vector3.Distance(this._camera.position, this._movablePlatform._mesh.getAbsolutePosition());
		this._cam_fly.scaleInPlace(0.01);
		this._guy.setRunState(false);
	}

	restart() {
		var lvl = this._levelObject;
		this._guy.reset(lvl.guy._posX, lvl.guy._posY);
		this._movablePlatform.reset(lvl.movPlatform._posX, lvl.movPlatform._posY);

		this._finished = false;
		this._died = false;

		for (var i = 0; i < this._boxes.length; i++) {
			this._boxes[i].reset();
		}

		for (var i = 0; i < this._projectiles.length; i++) {
			this._projectiles[i].destroy();
		}
		this._projectiles = [];

		for (var i = 0; i < this._emitters.length; i++) {
			this._emitters[i].reset();
		}

		this._firstUpdate = true;
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
		var textureTask = assetsManager.addTextureTask("image task", "textures/door.png");
		textureTask.onSuccess = function(task) {
			material.diffuseTexture = task.texture;
			material.diffuseTexture.hasAlpha = true;
			material.backFaceCulling = true;
		}

		var textureTask = assetsManager.addTextureTask("image task", "textures/door_open.png");
		(function(lvl) {
			textureTask.onSuccess = function(task) {
				lvl._tex_doorOpen = task.texture;
			}
		}) (this);

		this._doorMesh = BABYLON.MeshBuilder.CreatePlane("finish", {height: CONS_SCALE, width: CONS_SCALE}, this._scene);
		this._doorMesh.material = material;
		this._doorMesh.position.x = (finishObject._posX + 0.5)  * CONS_SCALE;
		this._doorMesh.position.y = (finishObject._posY + 0.5) * CONS_SCALE;
		this._doorMesh.position.z = CONS_SCALE/2 - 0.001;
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
		var textureTask = this._assetsManager.addTextureTask("image task", "textures/block01.png");
		(function(levelWidth, levelHeight, mat) {
			textureTask.onSuccess = function(task) {
				mat.diffuseTexture = task.texture;
				mat.backFaceCulling = true;
				mat.diffuseTexture.uScale = (levelWidth + 9 * CONS_SCALE)
				mat.diffuseTexture.uOffset = 0.5;
				mat.diffuseTexture.vScale = (levelHeight);
			}
		}) (this._levelWidth, this._levelHeight, material);

		// Background marks area of level
		this._background = BABYLON.MeshBuilder.CreatePlane("plane", {width: (this._levelWidth + 9 * CONS_SCALE) * CONS_SCALE, height: (this._levelHeight * CONS_SCALE)}, this._scene);
		this._background.material = material;
		this._background.position.x = (this._levelWidth * CONS_SCALE) / 2;
		this._background.position.y = (this._levelHeight * CONS_SCALE) / 2 - 4 * CONS_SCALE;
		this._background.position.z = CONS_SCALE/2;
		this._background.receiveShadows = false;

		this._background.setPhysicsState(BABYLON.PhysicsEngine.PlaneImpostor, { mass: 0, restitution: CONS_RESTITUTION_PLAT, friction: 0, move: false });

		// Init plane in front of the level
		var material = new BABYLON.StandardMaterial("Mat", this._scene);
		material.alpha = 0;
		var mesh = BABYLON.MeshBuilder.CreatePlane("plane", {width: (this._levelWidth + 9 * CONS_SCALE) * CONS_SCALE, height: (this._levelHeight * CONS_SCALE)}, this._scene);
		mesh.material = material;
		mesh.position.x = (this._levelWidth * CONS_SCALE) / 2;
		mesh.position.y = (this._levelHeight * CONS_SCALE) / 2 - 4 * CONS_SCALE;
		mesh.position.z = -CONS_SCALE/2;
		mesh.setPhysicsState(BABYLON.PhysicsEngine.PlaneImpostor, { mass: 0, restitution: CONS_RESTITUTION_PLAT, friction: 0, move: false });
	}

	update() {
		var guyPos = this._guy._mesh.getAbsolutePosition();
		var movPos = this._movablePlatform._mesh.getAbsolutePosition();
		var movWidth = this._movablePlatform._width;
		var movHeight = this._movablePlatform._height;

		this._guy.update();
		this._movablePlatform.update();

		// Update emitters
		for (var i = 0; i < this._emitters.length; i++) {
			this._emitters[i].update(this._guy._doRun);
		}

		// Update projectiles and remove if necessary (when they hit something).
		// Additionally, when projectile hits guy, kill him :)
		var projs_to_remove = [];
		for (var i = 0; i < this._projectiles.length; i++) {
			if ( this._projectiles[i].update() ) { // projectile.update returns true if it hit something
				projs_to_remove.push(i);
			} else {
				// If projectile hits guy he has to die
				if (this._projectiles[i]._mesh.intersectsMesh(this._guy._mesh)) {
					this._guy.onDie();
					this._died = new Date().getTime();
					projs_to_remove.push(i);
				}
			}
		}
		var c = 0;
		for (var i = 0; i < projs_to_remove.length; i++) {
			var index = projs_to_remove[i] - c;
			this._projectiles[index].destroy();
			this._projectiles.splice(index, 1);
			c = c + 1;
		}

		// If we are in cam fly mode, move cam [...]
		if (this._cam_fly) {
			this._camera.position.subtractInPlace(this._cam_fly);
			var dist = BABYLON.Vector3.Distance(this._camera.position, movPos);
			if (dist > this._cam_fly_last_dist) {
				this._cam_fly = false;
				if (!this._block_guy) this._guy.setRunState(true);
			} else {
				this._cam_fly_last_dist = dist;
			}
		} else { // [...], else clip cam to movable platform.
			this._camera.position.x = movPos.x;
		}

		// Clip light to movable platform.
		this._light0.position.x = this._movablePlatform._mesh.getAbsolutePosition().x;
		this._light0.position.y = this._movablePlatform._mesh.getAbsolutePosition().y //;+ (this._movablePlatform._height/2) * CONS_SCALE;

		if (this._died) {
			// If player is dead for certain amount of time, then restart level.
			var time = new Date().getTime();
			if (time - this._died >= CONS_DEATH_TIME_TO_RESTART) {
				this.restart();
			}
		} else if (this._finished) {
			// Check whether guy's celebration time is over.
			// If so, fire this._onFinished event.
			var time = new Date().getTime();
			if (time - this._finished >= CONS_FINISH_CELEB_TIME) {
				this._onFinished(this._finish.target);
			}
		} else if (!this._firstUpdate && this._finish.intersectsMesh(this._guy._mesh)) {
			// What happens when player reaches finish.
			this._doorMesh.material.diffuseTexture = this._tex_doorOpen;
			this._doorMesh.material.diffuseTexture.hasAlpha = true;
			this._light1.diffuse = new BABYLON.Color3(0, 1, 0);
			this._light1.specular = new BABYLON.Color3(0, 1, 0);
			this._guy.onWin();
			this._finished = new Date().getTime();
		}

		// If guy falls out of the level, restart it.
		if (this._guy._mesh.getAbsolutePosition().y < (CONS_LEVEL_BOTTOM-2) * CONS_SCALE) {
			this.restart();
		}

		this._firstUpdate = false;
	}

	spawnProjectile(position, direction, material) {
		this._projectiles.push(
			new Projectile(position, direction,
								this._scene, this._assetsManager, material)
		);
	}

	keyDown(ctrlCode) {
		this._guy.keyDown(ctrlCode);
		this._movablePlatform.keyDown(ctrlCode);

		switch (ctrlCode) {
			case CTRL_RESTART:
				this.restart();
				return;
			case CTRL_NEXT_LEVEL:
				this._onFinished(this._finish.target);
				return;
		}
	}

	keyUp(ctrlCode) {
		this._guy.keyUp(ctrlCode);
		this._movablePlatform.keyUp(ctrlCode);
	}

	// Setter to allow guy to run or not.
	setGuyRunState(state) {
		if (state && this._cam_fly) {

		} else {
			this._guy.setRunState(state);
		}
	}

}
