class MovablePlatform extends Platform {

	constructor(width, height, posX, posY, scene, assetsManager) {
		super(width, height, posX, posY, scene, assetsManager);

		this.reset(posX, posY);

		this._speed = 3 * CONS_SCALE;
		this._mesh.getPhysicsImpostor().setMass(CONS_MOV_PLAT_MASS);
		this._light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 15, -3), this._scene);
	}

	// Reset movable platform, for example when level restart
	reset(posX, posY) {
		this._keyPressed = false;
		this._keysDown = [];
		this._direction = new BABYLON.Vector3(0, 0, 0);

		this._blockStatus = {};
		this._blockStatus.blocked_bottom = false;
		this._blockStatus.blocked_top = false;
		this._blockStatus.blocked_right = false;
		this._blockStatus.blocked_left = false;

		this._mesh.position.x = (posX + this._width/2) * CONS_SCALE;
		this._mesh.position.y = (posY + this._height/2) * CONS_SCALE;

		var vel = this._mesh.getPhysicsImpostor().getLinearVelocity();
		vel.x = 0;
		vel.y = 0;
		this._mesh.getPhysicsImpostor().setLinearVelocity(vel);
		this._mesh.getPhysicsImpostor().setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
	}

	update() {
		this.updateBlockStatus();

		this.executeMovement();

		this.checkForGuyHitAndApplyPenalties();

		this.checkPhysicConstraints();
	}

	executeMovement() {
		this._direction.x = 0;
		this._direction.y = 0;

		if (this._keysDown.indexOf(CTRL_LEFT) > -1 && !this._blockStatus.blocked_left) { // left
				this._direction.x = -this._speed;
		}
		if (this._keysDown.indexOf(CTRL_RIGHT) > -1 && !this._blockStatus.blocked_right) { // right
				this._direction.x =  this._speed;
		}
		if (this._keysDown.indexOf(CTRL_UP) > -1 && !this._blockStatus.blocked_top) {
				this._direction.y = this._speed; // up
		}
		if (this._keysDown.indexOf(CTRL_DOWN) > -1 && !this._blockStatus.blocked_bottom) {
				this._direction.y = -this._speed; // down
		}

		if (this._direction.y == 0 && this._direction.x == 0) {
			this._direction.x = 0;
			this._direction.y = CONS_MOV_PLAT_UPLIFT; // avoid gravity
			this._mesh.getPhysicsImpostor().setLinearVelocity(this._direction);
		} else {
			this._mesh.getPhysicsImpostor().applyImpulse(this._direction, this._mesh.getAbsolutePosition());
		}

		// Clip light to movable platform.
		this._light.position.x = this._mesh.getAbsolutePosition().x;
		this._light.position.y = this._mesh.getAbsolutePosition().y;
	}

	checkPhysicConstraints() {
		// Constrain speed to _maxSpeed property
		if (this._mesh.getPhysicsImpostor().getLinearVelocity().x > this._speed) {
			var vel = this._mesh.getPhysicsImpostor().getLinearVelocity();
			vel.x = this._speed;
			this._mesh.getPhysicsImpostor().setLinearVelocity(vel);
		} else
		if (this._mesh.getPhysicsImpostor().getLinearVelocity().x < -this._speed) {
			var vel = this._mesh.getPhysicsImpostor().getLinearVelocity();
			vel.x = -this._speed;
			this._mesh.getPhysicsImpostor().setLinearVelocity(vel);
		}
		if (this._mesh.getPhysicsImpostor().getLinearVelocity().y > this._speed) {
			var vel = this._mesh.getPhysicsImpostor().getLinearVelocity();
			vel.y = this._speed;
			this._mesh.getPhysicsImpostor().setLinearVelocity(vel);
		} else
		if (this._mesh.getPhysicsImpostor().getLinearVelocity().y < -this._speed) {
			var vel = this._mesh.getPhysicsImpostor().getLinearVelocity();
			vel.y = -this._speed;
			this._mesh.getPhysicsImpostor().setLinearVelocity(vel);
		}

		// Avoid rotation
		this._mesh.getPhysicsImpostor().setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
		var q = BABYLON.Quaternion.RotationYawPitchRoll(0, 0, 0);
		this._mesh.rotationQuaternion = q;
		this._mesh.position.z = 0;
	}

	// Returns object containing information if which of the four sides of the platform are blocked
	updateBlockStatus() {
		this._blockStatus.blocked_bottom = false;
		this._blockStatus.blocked_top = false;
		this._blockStatus.blocked_right = false;
		this._blockStatus.blocked_left = false;

		var ray = this.getCollisionRayBottom();
		var pickInfo = this._scene.pickWithRay(ray, function(item) { return item.isWall || item.isGuy; });
		if (pickInfo.hit) {
			this._blockStatus.blocked_bottom = true;
		}

		var ray = this.getCollisionRayTop();
		var pickInfo = this._scene.pickWithRay(ray, function(item) { return item.isWall; });
		if (pickInfo.hit) {
			this._blockStatus.blocked_top = true;
		}

		var ray = this.getCollisionRayLeft();
		var pickInfo = this._scene.pickWithRay(ray, function(item) { return item.isWall; });
		if (pickInfo.hit) {
			this._blockStatus.blocked_left = true;
		}

		var ray = this.getCollisionRayRight();
		var pickInfo = this._scene.pickWithRay(ray, function(item) { return item.isWall; });
		if (pickInfo.hit) {
			this._blockStatus.blocked_right = true;
		}
	}

	checkForGuyHitAndApplyPenalties() {
		var ray = this.getCollisionRayLeft();
		var pickInfo = this._scene.pickWithRay(ray, function(item) { return item.isGuy; });
		if (pickInfo.hit) {
			pickInfo.pickedMesh.getPhysicsImpostor().applyImpulse(new BABYLON.Vector3(-CONS_RESTITUTION_PENALTY_GUY_MOV_PLAT, 0, 0), pickInfo.pickedMesh.getAbsolutePosition());
		}

		var ray = this.getCollisionRayRight();
		var pickInfo = this._scene.pickWithRay(ray, function(item) { return item.isGuy; });
		if (pickInfo.hit) {
			pickInfo.pickedMesh.getPhysicsImpostor().applyImpulse(new BABYLON.Vector3(CONS_RESTITUTION_PENALTY_GUY_MOV_PLAT, 0, 0), pickInfo.pickedMesh.getAbsolutePosition());
		}
	}

	getCollisionRayLeft() {
		var posi = this._mesh.position.clone();
		posi.x = posi.x - (this._width/2 * CONS_SCALE) - CONS_MOV_PLAT_TOLERANCE_DIVE;
		posi.y = posi.y + (this._height/2 * CONS_SCALE) - CONS_MOV_PLAT_TOLERANCE_CORNER;
		return new BABYLON.Ray(posi, new BABYLON.Vector3(0, -1, 0), this._height * CONS_SCALE - CONS_MOV_PLAT_TOLERANCE_CORNER*2);
	}

	getCollisionRayRight() {
		var posi = this._mesh.position.clone();
		posi.x = posi.x + (this._width/2 * CONS_SCALE) + CONS_MOV_PLAT_TOLERANCE_DIVE;
		posi.y = posi.y + (this._height/2 * CONS_SCALE) - CONS_MOV_PLAT_TOLERANCE_DIVE;
		return new BABYLON.Ray(posi, new BABYLON.Vector3(0, -1, 0), this._height * CONS_SCALE - CONS_MOV_PLAT_TOLERANCE_CORNER*2);
	}

	getCollisionRayTop() {
		var posi = this._mesh.position.clone();
		posi.x = posi.x - (this._width/2 * CONS_SCALE) + CONS_MOV_PLAT_TOLERANCE_CORNER;
		posi.y = posi.y + (this._height/2 * CONS_SCALE) + CONS_MOV_PLAT_TOLERANCE_DIVE;
		return new BABYLON.Ray(posi, new BABYLON.Vector3(1, 0, 0), this._width * CONS_SCALE - CONS_MOV_PLAT_TOLERANCE_CORNER*2);
	}

	getCollisionRayBottom() {
		var posi = this._mesh.position.clone();
		posi.x = posi.x - (this._width/2 * CONS_SCALE) + CONS_MOV_PLAT_TOLERANCE_CORNER;
		posi.y = posi.y - (this._height/2 * CONS_SCALE) - CONS_MOV_PLAT_TOLERANCE_DIVE;
		return new BABYLON.Ray(posi, new BABYLON.Vector3(1, 0, 0), this._width * CONS_SCALE - CONS_MOV_PLAT_TOLERANCE_CORNER*2);
	}

	setPhysicsState() {
		this._mesh.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 0, restitution: CONS_RESTITUTION_PLAT, move: true });
	}

	getTextureName() {
		return "textures/block03.png";
	}

	keyDown(ctrlCode) {
		var index = this._keysDown.indexOf(ctrlCode);
		if (index === -1) {
			this._keysDown.push(ctrlCode);
		}
	}

	keyUp(ctrlCode) {
		var index = this._keysDown.indexOf(ctrlCode);
		if (index > -1) {
			this._keysDown.splice(index, 1);
		}
	}

	onPause() {
		this._keysDown = [];
	}

	destroy() {
		super.destroy();
		this._light.dispose();
	}

}
