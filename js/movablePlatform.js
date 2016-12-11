class MovablePlatform extends Platform {

	constructor(width, height, posX, posY, guy, scene) {
		super(width, height, posX, posY, guy, scene);
		this._guy = guy;

		this._direction = new BABYLON.Vector3(0, 0, 0); // movement direction

		this._keyPressed = false;

		this._speed = 3 * CONS_SCALE;
		this._mesh.getPhysicsImpostor().setMass(1);

		this._keysDown = [];
		this._mesh.platform = this;
	}

	// Reset movable platform, for example when level restart
	reset(posX, posY) {
		this._keyPressed = false;
		this._keysDown = [];
		this._direction = new BABYLON.Vector3(0, 0, 0);

		this._mesh.position.x = (posX + this._width/2) * CONS_SCALE;
		this._mesh.position.y = (posY + this._height/2) * CONS_SCALE;

		var vel = this._mesh.getPhysicsImpostor().getLinearVelocity();
		vel.x = 0;
		vel.y = 0;
		this._mesh.getPhysicsImpostor().setLinearVelocity(vel);
		this._mesh.getPhysicsImpostor().setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
	}

	update() {
		this._direction.x = 0;
		this._direction.y = 0;

		var coll = this._mesh.intersectsMesh(this._guy._mesh);
		var guyPos = this._guy._mesh.getAbsolutePosition();
		var thisPos = this._mesh.getAbsolutePosition();

		if (this._keysDown.indexOf(CTRL_LEFT) > -1) { // left
			if (!(coll && guyPos.x < thisPos.x)) {
				this._direction.x = -this._speed;
			}
		}
		if (this._keysDown.indexOf(CTRL_RIGHT) > -1) { // right
			if (!(coll && guyPos.x > thisPos.x)) {
				this._direction.x =  this._speed;
			}
		}
		if (this._keysDown.indexOf(CTRL_UP) > -1) {
			if ( (!(coll && guyPos.y > thisPos.y) || this._guy._isOnMovablePlatform)
					&& thisPos.y < CONS_LEVEL_TOP * CONS_SCALE) {
				this._direction.y = this._speed; // up
			}
		}
		if (this._keysDown.indexOf(CTRL_DOWN) > -1) {
			if (!(coll && guyPos.y < thisPos.y) && thisPos.y > CONS_LEVEL_BOTTOM * CONS_SCALE) {
				this._direction.y = -this._speed; // down
			}
		}
		//if (this._direction.length > 0) {
		this._mesh.getPhysicsImpostor().setLinearVelocity(this._direction);
		//this._mesh.getPhysicsImpostor().applyImpulse(this._direction, this._mesh.getAbsolutePosition());
		this._mesh.getPhysicsImpostor().setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
		var q = BABYLON.Quaternion.RotationYawPitchRoll(0, 0, 0);
		this._mesh.rotationQuaternion = q;

		if (this._guy._isOnMovablePlatform) {
			var imp = this._direction;
			imp.y = 0;
			//this._guy._mesh.getPhysicsImpostor().applyImpulse(imp, this._guy._mesh.getAbsolutePosition());
		}
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

}
