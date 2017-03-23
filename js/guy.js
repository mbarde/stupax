class Guy extends Animatable {

	constructor(posX, posY, scene, resourceHandler) {
			super(scene);

			this._resourceHandler = resourceHandler;

			this.initConstants();

			this.initGeometry();

			this.initAnimations();

			this._collisionHelper = new CollisionHelper(
						this._scene, this._width, this._height, this._mesh,
						0.4, 0.2);

			this.reset(posX, posY);
	}

	initConstants() {
		this._width = 0.6;
		this._height = 0.8;

		this._accelerationX = 0.2 * CONS_SCALE;
		this._maxSpeedX = 1.0 * CONS_SCALE;
		this._maxSpeedY = 0.1 * CONS_SCALE;
	}

	initGeometry() {
		this._tex_uScale = 1;
		this._tex_vScale = 1;
		this._tex_uOffset = 0;
		this._tex_vOffset = 0;

		var material = new BABYLON.StandardMaterial("guy", this._scene);

		// Texture mesh
		this._planeMesh = BABYLON.MeshBuilder.CreatePlane("guyPlane", {height: 1.5 * CONS_SCALE, width: 1 * CONS_SCALE}, this._scene);
		this._planeMesh.material = material;

		// Impostor mesh for the physics
		var material = new BABYLON.StandardMaterial("guy", this._scene);
		material.alpha = 0.0;
		this._mesh = BABYLON.MeshBuilder.CreateBox("guy", {height: this._height * CONS_SCALE, width: this._width * CONS_SCALE, depth: CONS_SCALE}, this._scene);
		this._mesh.material = material;
		this._mesh.isGuy = true;
		this._resourceHandler.soundGuyRun.attachToMesh(this._mesh);

		this._mesh.setPhysicsState(BABYLON.PhysicsEngine.PlaneImpostor, { mass: CONS_GUY_MASS, restitution: CONS_RESTITUTION_GUY, move: true });
	}

	initAnimations() {
		this.anim_loadAnimation([
			this._resourceHandler.texGuyRun00,
			this._resourceHandler.texGuyRun01,
			this._resourceHandler.texGuyRun02,
			this._resourceHandler.texGuyRun03,
			this._resourceHandler.texGuyRun04,
			this._resourceHandler.texGuyRun05,
			this._resourceHandler.texGuyRun06,
			this._resourceHandler.texGuyRun07
		], this._tex_uScale, this._tex_vScale, this._tex_uOffset, this._tex_vOffset, 120, "run");
		this.anim_loadAnimation([
			this._resourceHandler.texGuyIdle00,
			this._resourceHandler.texGuyIdle01,
			this._resourceHandler.texGuyIdle02,
			this._resourceHandler.texGuyIdle03
		], this._tex_uScale, this._tex_vScale, this._tex_uOffset, this._tex_vOffset, 120, "stand");
		this.anim_loadAnimation([
			this._resourceHandler.texGuyJump
		], this._tex_uScale, this._tex_vScale, this._tex_uOffset, this._tex_vOffset, 120, "jump");
		this.anim_loadAnimation([
			this._resourceHandler.texGuyWin00,
			this._resourceHandler.texGuyWin01,
			this._resourceHandler.texGuyWin02,
			this._resourceHandler.texGuyWin03,
			this._resourceHandler.texGuyWin04,
			this._resourceHandler.texGuyWin04
		], this._tex_uScale, this._tex_vScale, this._tex_uOffset, this._tex_vOffset, 80, "win");
		this.anim_loadAnimation([
			this._resourceHandler.texGuyDie00,
			this._resourceHandler.texGuyDie01,
			this._resourceHandler.texGuyDie02
		], this._tex_uScale, this._tex_vScale, this._tex_uOffset, this._tex_vOffset, 120, "die", false);

		this.anim_setAnimationByName("run");
	}

	// Reset guy, for example when restarting level.
	reset(posX, posY) {
		this._mesh.position.x = (posX + this._width/2) * CONS_SCALE;
		this._mesh.position.y = (posY + this._height/2) * CONS_SCALE;
		this._mesh.position.z = 0;

		this._direction = new BABYLON.Vector3(this._accelerationX, 0, 0); // movement direction

		this._collisionHelper.resetBlockStatus();

		this._forward = true;
		this._standingTimestamp = false; 	// time since guy is standing (not moving)
		this._lastDirectionToggleTimestamp = false;
		this._fixAnimation = false; 		// if true animation loop can not be changed anymore
		this._doRun = true;					// is guy allowed to run?

		this._mesh.getPhysicsImpostor().setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
		this._mesh.getPhysicsImpostor().setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
	}

	update() {
		this.updateAnimationAndGuyMode();

		this.updateSounds();

		var isDiving = this.isDivingIntoGround();
		if (!isDiving) {
			var wallHit = this.checkForWallHit();
			if (wallHit) {
				this.toggleDirection();
			}
		}

		var standingTooLong = this.isStandingTooLong();
		if (standingTooLong) {
			this.toggleDirection();
		}

		this.executeMovement();

		this.checkPhysicConstraints();

		this._collisionHelper.updateBlockStatus();
	}

	executeMovement() {
		if (this._doRun && this._curMode != CONS_GM_JUMP && !this._fixAnimation) {
			this._mesh.getPhysicsImpostor().applyImpulse(this._direction, this._mesh.getAbsolutePosition());
		}
	}

	checkForWallHit() {
		// 1.)
		// Create vertical ray in front of the guy.
		// When this ray intersects a wall, guy should turn around.
		var posi = this._mesh.position.clone();
		if (this._forward) {
			posi.x = posi.x + (this._width/2 * CONS_SCALE) + CONS_GUY_TOLERANCE_VERTICAL_DIVE;
		} else {
			posi.x = posi.x - (this._width/2 * CONS_SCALE) - CONS_GUY_TOLERANCE_VERTICAL_DIVE;
		}
		posi.y = posi.y - (this._height/2 * CONS_SCALE) + CONS_GUY_TOLERANCE_HORIZONTAL_DIVE;

		var ray = new BABYLON.Ray(posi, new BABYLON.Vector3(0, 1, 0), this._height/2 * CONS_SCALE - CONS_GUY_TOLERANCE_HORIZONTAL_DIVE*2 );
		var pickInfo = this._scene.pickWithRay(ray, function(item) { return item.isWalkable; });
		if (pickInfo.hit) {
			return true;
		} else {
			// 2.)
			// If guy stands in front of a wall higher than: this._height/2 * CONS_SCALE - CONS_GUY_TOLERANCE_HORIZONTAL_DIVE*2
			// then the used ray is not able to detect the wall. So we additionally need a ray in x direction.
			var posi = this._mesh.position.clone();
			var x_dir = -1;
			if (this._forward) x_dir = 1;
			var ray = new BABYLON.Ray(posi, new BABYLON.Vector3(x_dir, 0, 0), this._width/2 * CONS_SCALE + CONS_GUY_TOLERANCE_VERTICAL_DIVE );
			var pickInfo = this._scene.pickWithRay(ray, function(item) { return item.isWalkable; });
			if (pickInfo.hit) {
				return true;
			}
		}

		return false;
	}

	isDivingIntoGround() {
		// Check if guy is diving into the ground.
		// This can happen when he jumps from high places.
		// It can cause false positive toggle direction, we need to prevent this.
		var ray = new BABYLON.Ray(this._mesh.position, new BABYLON.Vector3(0, -1, 0), this._height/2 * CONS_SCALE - CONS_GUY_TOLERANCE_HORIZONTAL_DIVE );
		var pickInfo = this._scene.pickWithRay(ray, function(item) { return item.isWalkable; });
		return pickInfo.hit;
	}

	isStandingTooLong() {
		if (this._standingTimestamp) {
			var time = new Date().getTime();
			if (time - this._standingTimestamp >= CONS_GUY_STAND_TOGGLE_TIME) {
				this._standingTimestamp = false;
				return true;
			}
		}
		return false;
	}

	checkPhysicConstraints() {
		// Constrain speed to _maxSpeed property
		if (this._mesh.getPhysicsImpostor().getLinearVelocity().x > this._maxSpeedX) {
			var vel = this._mesh.getPhysicsImpostor().getLinearVelocity();
			vel.x = this._maxSpeedX;
			this._mesh.getPhysicsImpostor().setLinearVelocity(vel);
		} else
		if (this._mesh.getPhysicsImpostor().getLinearVelocity().x < -this._maxSpeedX) {
			var vel = this._mesh.getPhysicsImpostor().getLinearVelocity();
			vel.x = -this._maxSpeedX;
			this._mesh.getPhysicsImpostor().setLinearVelocity(vel);
		}

		// Constrain Y velocity when guy is not on a platform
		if (this._curMode == CONS_GM_JUMP) {
			if (this._mesh.getPhysicsImpostor().getLinearVelocity().y > this._maxSpeedY) {
				var veloc = this._mesh.getPhysicsImpostor().getLinearVelocity();
				veloc.y = this._maxSpeedY;
				this._mesh.getPhysicsImpostor().setLinearVelocity(veloc);
			}
		}

		// Prevent rotation in any way
		this._mesh.getPhysicsImpostor().setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
		var q = BABYLON.Quaternion.RotationYawPitchRoll(0, 0, 0);
		this._mesh.rotationQuaternion = q;

		// Always stay on the same Z coordinate
		this._mesh.position.z = 0;

		// Clip mesh containing texture of the guy to it´s physics object.
		this._planeMesh.position = this._mesh.getAbsolutePosition();
		this._planeMesh.position.y += 0.7;
	}

	updateAnimationAndGuyMode() {
		// Check which animation loop (and corresponding GuyMode) should be active
		var vel = this._mesh.getPhysicsImpostor().getLinearVelocity();
		if (vel.length() <= 2) {
			if (this._curMode != CONS_GM_STAND) {
				if (!this._fixAnimation) this.anim_setAnimationByName("stand");
				this._curMode = CONS_GM_STAND;
				if (!this._standing && this._doRun) {
					this._standingTimestamp = new Date().getTime();
				}
			}
		} else {
			var isOnWalkableGround = this.isOnWalkableGround();
			if (isOnWalkableGround) {
				if (this._curMode != CONS_GM_RUN) {
					this._standingTimestamp = false;
					if (!this._fixAnimation) this.anim_setAnimationByName("run");
					this._curMode = CONS_GM_RUN;
				}
			} else {
				if (this._curMode != CONS_GM_JUMP) {
					this._standingTimestamp = false;
					if (!this._fixAnimation) this.anim_setAnimationByName("jump");
					this._curMode = CONS_GM_JUMP;
				}
			}
		}

		// If new frame is necessary, bind it to texture mesh.
		if (this.anim_update()) {
			this._planeMesh.material.diffuseTexture = this.anim_getCurTexture();
			if (!this._forward) this._planeMesh.material.diffuseTexture.uScale = -this._tex_uScale;
			else this._planeMesh.material.diffuseTexture.uScale = this._tex_uScale;
		}
	}

	updateSounds() {
		if (this._resourceHandler.soundGuyRun) {
			if (this._curMode == CONS_GM_RUN && !this._resourceHandler.soundGuyRun.isPlaying) {
				this._resourceHandler.soundGuyRun.play();
			}
			if (this._curMode != CONS_GM_RUN && this._resourceHandler.soundGuyRun.isPlaying) {
				this._resourceHandler.soundGuyRun.stop();
			}
		}
	}

	isOnWalkableGround() {
		// Check if guy is on any kind of walkable ground:
		// 1.) Define ray: From = guys center, direction = (0,-1,0), length = guys height / 2 + epsilon
		// 2.) Pick with ray any mesh which was marked as isWalkable = true
		// 3.) If any mesh was hit, guy is on ground
		// ~ voilá
		var posi = this._mesh.position.clone();
		var ray = new BABYLON.Ray(posi, new BABYLON.Vector3(0, -1, 0), this._height/2 * CONS_SCALE + 0.1);
		var pickInfo = this._scene.pickWithRay(ray, function(item) { return item.isWalkable; });
		return pickInfo.hit;
	}

	// Fired when player reaches door.
	onWin() {
		this._fixAnimation = true;
		this.anim_setAnimationByName("win");
	}

	onDie() {
		this._fixAnimation = true;
		this.anim_setAnimationByName("die");
		this._resourceHandler.soundGuyDie.play();
	}

	// Toggle direction in which guy is running.
	toggleDirection() {
		var time = new Date().getTime();
		if (!this._lastDirectionToggleTimestamp
			|| time - this._lastDirectionToggleTimestamp >= CONS_GUY_MIN_TIME_BETWEEN_DIR_TOGGLES) {
			this._direction.x = - this._direction.x;
			this._forward = !this._forward;

			if (!this._forward) {
				this._planeMesh.material.diffuseTexture.uScale = -this._tex_uScale;
				this._planeMesh.material.diffuseTexture.uOffset = -this._tex_uOffset;
			} else {
				this._planeMesh.material.diffuseTexture.uScale = this._tex_uScale;
				this._planeMesh.material.diffuseTexture.uOffset = this._tex_uOffset;
			}

			this._lastDirectionToggleTimestamp = time;
		}

		return this._forward;
	}

	keyDown(keyCode) {
		if (keyCode == CTRL_GUY_JUMP) {
			console.log(this._mesh.blockStatus);
		}
	}

	keyUp(keyCode) {

	}

	destroy() {
		this._planeMesh.dispose();
		this._mesh.dispose();
		this._resourceHandler.soundGuyRun.stop();
	}

	onPause() {
		if (this._resourceHandler.soundGuyRun) {
			if (this._resourceHandler.soundGuyRun.isPlaying) this._resourceHandler.soundGuyRun.pause();
		}
		this._doRun = false;
	}

	onResume() {
		this._doRun = true;
	}

}
