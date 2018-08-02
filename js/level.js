class Level {

	constructor(scene, camera, resourceHandler, game) {
		this._scene = scene;
		this._resourceHandler = resourceHandler;
		this._camera = camera;
		this._game = game; 	// function to execute when player reaches finish

		this._platforms = [];
		this._boxes = [];
		this._projectiles = [];
		this._emitters = [];

		this._finishedCountdown = false; 			// will contain timestamp of win when player reaches door
		this._diedCountdown = false;					// will contain timestamp of death when player died
		this._guyExploded = false;						// true if Guy exploded
		this._firstUpdate = true;
		this._camFlyEndCallsOnResume = true;
	}

	restart() {
		var lvl = this._levelJSON;

		this._guy = new Guy(lvl.guy._posX, lvl.guy._posY, this._scene, this._resourceHandler);
		this._movablePlatform.reset(lvl.movPlatform._posX, lvl.movPlatform._posY);

		this._finish.reset();

		this._finishedCountdown = false;
		this._diedCountdown = false;
		this._guyExploded = false;

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
		this._camFlyEndCallsOnResume = true;
	}

	update() {
		if (!this._guyExploded) this._guy.update();
		this._movablePlatform.update();

		this.updateEmitters();
		this.updateProjectiles();
		this.updateCamera();

		if (this._diedCountdown) {
			if (this._diedCountdown.update()) {
				this.restart();
			}
		}

		if (this._finishedCountdown) {
		 	if (!this._diedCountdown && this._finishedCountdown.update()) {
				this._game.loadNextLevel();
			}
		}

		if (	!this._diedCountdown &&
				!this._finishedCountdown &&
				!this._firstUpdate &&
				this._finish.isIntersectingMesh(this._guy._mesh)
		) {
			this._finish.onWin();
			this._guy.onWin();
			this._finishedCountdown = new Countdown( CONS_FINISH_CELEB_TIME );
		}

		if (this.isGuyOutOfLevelBounds()) {
			this._resourceHandler.soundGuyBelowGround.play();
			this.restart();
		}

		this._firstUpdate = false;
	}

	updateEmitters() {
		for (var i = 0; i < this._emitters.length; i++) {
			this._emitters[i].update();
		}
	}

	updateProjectiles() {
		// Update projectiles and remove if necessary (when they hit something or are out of level bounds).
		// Additionally, when projectile hits guy, kill him :)
		var projs_to_remove = [];
		for (var i = 0; i < this._projectiles.length; i++) {
			if ( this._projectiles[i].update() ) { // projectile.update returns true if it hit something
				projs_to_remove.push(i);
			} else {
				// If projectile is out of level bounds it has to be removed
				if (this._projectiles[i]._mesh.getAbsolutePosition().y < (CONS_LEVEL_BOTTOM-2) * CONS_SCALE) {
					projs_to_remove.push(i);
				} else if (this._projectiles[i]._mesh.getAbsolutePosition().y > (CONS_LEVEL_TOP+2) * CONS_SCALE) {
					projs_to_remove.push(i);
				}

				// If projectile hits guy he has to die
				if (!this._diedCountdown && this._projectiles[i]._mesh.intersectsMesh(this._guy._mesh)) {
					this._guy.onDie();
					this._diedCountdown = new Countdown( CONS_DEATH_TIME_TO_RESTART );
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
	}

	updateCamera() {
		// If we are in cam fly mode, move cam
		if (this._camFly) {
			this.cameraFlightStep();
		} else { // else clip cam to movable platform.
			this._camera.position.x = this._movablePlatform._mesh.position.x;
		}
	}

	isGuyOutOfLevelBounds() {
		if (this._guy._mesh.getAbsolutePosition().y < (CONS_LEVEL_BOTTOM-2) * CONS_SCALE) {
			return true;
		}
		return false;
	}

	spawnProjectile(position, direction, material) {
		this._projectiles.push(
			new Projectile(position, direction,
								this._scene, this._resourceHandler, material)
		);
	}

	keyDown(ctrlCode) {
		if (this._camFly) return;

		//this._guy.keyDown(ctrlCode);
		this._movablePlatform.keyDown(ctrlCode);

		switch (ctrlCode) {
			case CTRL_RESTART:
				this.restart();
				return;
			case CTRL_GUY_JUMP:
				this.guyExplode();
				return;
		}
	}

	keyUp(ctrlCode) {
		this._guy.keyUp(ctrlCode);
		this._movablePlatform.keyUp(ctrlCode);
	}

	destroy() {
		for (var i = 0; i < this._platforms.length; i++) {
			this._platforms[i].destroy();
		}

		for (var i = 0; i < this._boxes.length; i++) {
			this._boxes[i].destroy();
		}

		for (var i = 0; i < this._projectiles.length; i++) {
			this._projectiles[i].destroy();
		}

		for (var i = 0; i < this._emitters.length; i++) {
			this._emitters[i].destroy();
		}

		this._background.destroy();
		this._finish.destroy();
		this._guy.destroy();
		this._movablePlatform.destroy();
	}

	guyExplode() {
		var pos = { x: this._guy._mesh.position.x, y: this._guy._mesh.position.y };

		this._guy.destroy();
		this._guyExploded = true;

		 var particleSystem = new BABYLON.ParticleSystem("particles", 10, this._scene);

		//Texture of each particle
		particleSystem.particleTexture = this._resourceHandler.texFlare;

		// Colors of all particles
		particleSystem.color1 = new BABYLON.Color4(1.0, 0.8, 0.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.8, 1.0, 0.0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(1.0, 0, 0.2, 0.0);

		// Size of each particle (random between...
		particleSystem.minSize = 0.1;
		particleSystem.maxSize = 0.5;

		// Life time of each particle (random between...
		particleSystem.minLifeTime = 0.3;
		particleSystem.maxLifeTime = 1.5;

		// Emission rate
		particleSystem.emitRate = 1500;

		// Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
		particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

		// Set the gravity of all particles
		particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

		// Direction of each particle after it has been emitted
		particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
		particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);

		// Angular speed, in radians
		particleSystem.minAngularSpeed = 0;
		particleSystem.maxAngularSpeed = Math.PI;

		// Speed
		particleSystem.minEmitPower = 1;
		particleSystem.maxEmitPower = 3;
		particleSystem.updateSpeed = 0.005;

		var balls = [];
		var textures = this._resourceHandler.getGuyBodyPartTextures();
		for (var i = 0; i < textures.length; i++) {
			var material = new BABYLON.StandardMaterial("bodypart", this._scene);
			material.diffuseTexture = textures[i];
			material.diffuseTexture.hasAlpha = true;
			material.backFaceCulling = false;

			var dir = new BABYLON.Vector3(Math.random() * 50 - 25, Math.random() * 50 - 25, 0);

			var newBall = new Ball(0.4, 0.4, pos, dir, 1, this._scene, this._resourceHandler, material)
			var newPS = particleSystem.clone('bodypartps', newBall._mesh);
			newPS.direction1 = dir;
			newPS.direction2 = dir;
			newPS.start();
			balls.push(newBall);
		}
	}

	initCameraForFinishToStartFlight() {
		this._camera.position.x = (this._levelJSON.finish._posX + 0.5)  * CONS_SCALE;
		this._camFly = new BABYLON.Vector3();
		this._camFly.x = this._camera.position.x - this._movablePlatform._mesh.getAbsolutePosition().x;
		this._camFly.y = 0;
		this._camFly.z = 0;
		this._camFly_lastDist = BABYLON.Vector3.Distance(this._camera.position, this._movablePlatform._mesh.getAbsolutePosition());
		this._camFly.scaleInPlace(0.01);
		this.onPause();
	}

	cameraFlightStep() {
		this._camera.position.subtractInPlace(this._camFly);
		var dist = BABYLON.Vector3.Distance(this._camera.position, this._movablePlatform._mesh.position);
		if (dist > this._camFly_lastDist) {
			this._camFly = false;
			if (this._camFlyEndCallsOnResume) {
				this.onResume();
			}
		} else {
			this._camFly_lastDist = dist;
		}
	}

	onPause() {
		if (this._finishedCountdown) this._finishedCountdown.onPause();
		if (this._diedCountdown) this._diedCountdown.onPause();

		this._movablePlatform.onPause();
		this._guy.onPause();
		for (var i = 0; i < this._emitters.length; i++) {
			this._emitters[i].onPause();
		}
		for (var i = 0; i < this._projectiles.length; i++) {
			this._projectiles[i].onPause();
		}
	}

	onResume() {
		if (this._finishedCountdown) this._finishedCountdown.onResume();
		if (this._diedCountdown) this._diedCountdown.onResume();

		if (this._camFly) {
			this._camFlyEndCallsOnResume = true;
			return;
		}
		this._movablePlatform.onResume();
		this._guy.onResume();
		for (var i = 0; i < this._emitters.length; i++) {
			this._emitters[i].onResume();
		}
		for (var i = 0; i < this._projectiles.length; i++) {
			this._projectiles[i].onResume();
		}
	}

}
