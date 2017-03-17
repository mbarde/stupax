class MovablePlatform extends Platform {

	constructor(width, height, posX, posY, scene, assetsManager) {
		super(width, height, posX, posY, scene, assetsManager);

		this._collisionHelper = new CollisionHelper(
					this._scene, this._width, this._height, this._mesh,
					CONS_MOV_PLAT_TOLERANCE_DIVE, CONS_MOV_PLAT_TOLERANCE_CORNER);

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

		this._collisionHelper.resetBlockStatus();

		this._mesh.position.x = (posX + this._width/2) * CONS_SCALE;
		this._mesh.position.y = (posY + this._height/2) * CONS_SCALE;

		var vel = this._mesh.getPhysicsImpostor().getLinearVelocity();
		vel.x = 0;
		vel.y = 0;
		this._mesh.getPhysicsImpostor().setLinearVelocity(vel);
		this._mesh.getPhysicsImpostor().setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
	}

	update() {
		this._collisionHelper.updateBlockStatus();

		this.executeMovement();

		this.checkForGuyHitAndApplyPenalties();

		this.checkPhysicConstraints();
	}

	executeMovement() {
		this._direction.x = 0;
		this._direction.y = 0;

		var blockStatus = this._collisionHelper.getBlockStatus();

		if (this._keysDown.indexOf(CTRL_LEFT) > -1 && !blockStatus.blocked_left) { // left
				this._direction.x = -this._speed;
		}
		if (this._keysDown.indexOf(CTRL_RIGHT) > -1 && !blockStatus.blocked_right) { // right
				this._direction.x =  this._speed;
		}
		if (this._keysDown.indexOf(CTRL_UP) > -1 && !blockStatus.blocked_top) {
				this._direction.y = this._speed; // up
		}
		if (this._keysDown.indexOf(CTRL_DOWN) > -1 && !blockStatus.blocked_bottom) {
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

	checkForGuyHitAndApplyPenalties() {
		var ray = this._collisionHelper.getCollisionRayLeft();
		var pickInfo = this._scene.pickWithRay(ray, function(item) { return item.isGuy; });
		if (pickInfo.hit) {
			pickInfo.pickedMesh.getPhysicsImpostor().applyImpulse(new BABYLON.Vector3(-CONS_RESTITUTION_PENALTY_GUY_MOV_PLAT, 0, 0), pickInfo.pickedMesh.getAbsolutePosition());
		}

		var ray = this._collisionHelper.getCollisionRayRight();
		var pickInfo = this._scene.pickWithRay(ray, function(item) { return item.isGuy; });
		if (pickInfo.hit) {
			pickInfo.pickedMesh.getPhysicsImpostor().applyImpulse(new BABYLON.Vector3(CONS_RESTITUTION_PENALTY_GUY_MOV_PLAT, 0, 0), pickInfo.pickedMesh.getAbsolutePosition());
		}
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
