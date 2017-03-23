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

		this._finished = false; 			// will contain timestamp of win when player reaches door
		this._died = false;					// will contain timestamp of death when player died
		this._firstUpdate = true;			//
		this._camFlyEndCallsOnResume = true;
	}

	restart() {
		var lvl = this._levelJSON;

		this._guy.reset(lvl.guy._posX, lvl.guy._posY);
		this._movablePlatform.reset(lvl.movPlatform._posX, lvl.movPlatform._posY);

		this._finish.reset();

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
		this._camFlyEndCallsOnResume = true;
	}

	update() {
		this._guy.update();
		this._movablePlatform.update();

		this.updateEmitters();
		this.updateProjectiles();
		this.updateCamera();

		if (this._died && this.isGuyDeadLongEnough()) {
			this.restart();
		}

	 	if (!this._died && this._finished && this.isGuyCelebratingLongEnough()) {
			this._game.loadNextLevel();
		}

		if (	!this._died &&
				!this._finished &&
				!this._firstUpdate &&
				this._finish.isIntersectingMesh(this._guy._mesh)
		) {
			this._finish.onWin();
			this._guy.onWin();
			this._finished = new Date().getTime();
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
				if (!this._died && this._projectiles[i]._mesh.intersectsMesh(this._guy._mesh)) {
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
	}

	updateCamera() {
		// If we are in cam fly mode, move cam
		if (this._camFly) {
			this.cameraFlightStep();
		} else { // else clip cam to movable platform.
			this._camera.position.x = this._movablePlatform._mesh.position.x;
		}
	}

	isGuyDeadLongEnough() {
		var time = new Date().getTime();
		if (time - this._died >= CONS_DEATH_TIME_TO_RESTART) {
			return true;
		}
		return false;
	}

	isGuyCelebratingLongEnough() {
		var time = new Date().getTime();
		if (time - this._finished >= CONS_FINISH_CELEB_TIME) {
			return true;
		}
		return false;
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
		this._guy.keyDown(ctrlCode);
		this._movablePlatform.keyDown(ctrlCode);

		switch (ctrlCode) {
			case CTRL_RESTART:
				this.restart();
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
