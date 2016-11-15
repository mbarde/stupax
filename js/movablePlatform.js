class MovablePlatform extends Platform {

	constructor(width, height, posX, posY, color, guy, scene) {
		super(width, height, posX, posY, color, guy, scene);
		this._guy = guy;

		this._direction = new BABYLON.Vector3(0, 0, 0); // movement direction

		this._keyPressed = false;

		this._speed = 6 * CONS_SCALE;
		this._mesh.getPhysicsImpostor().setMass(1);

		this._keysDown = [];
	}

	update() {
		this._direction.x = 0;
		this._direction.y = 0;

		if (this._keysDown.indexOf(37) > -1) { // left
			this._direction.x = -this._speed;
		}
		if (this._keysDown.indexOf(39) > -1) { // right
			this._direction.x =  this._speed;
		}
		if (this._keysDown.indexOf(38) > -1) {
			this._direction.y = this._speed; // up
		}
		if (this._keysDown.indexOf(40) > -1) {
			this._direction.y = -this._speed; // down
		}
		//if (this._direction.length > 0) {
		this._mesh.getPhysicsImpostor().setLinearVelocity(this._direction);
		this._mesh.getPhysicsImpostor().setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
		var q = BABYLON.Quaternion.RotationYawPitchRoll(0, 0, 0);
		this._mesh.rotationQuaternion = q;

		if (this._guy._isOnMovablePlatform) {
			var imp = this._direction;
			imp.y = 0;
			this._guy._mesh.getPhysicsImpostor().applyImpulse(imp, this._guy._mesh.getAbsolutePosition());
		}

		//var q = BABYLON.Quaternion.RotationYawPitchRoll(0, 0, 0);
		//target.rotationQuaternion = q.multiply(mq);
		//this._mesh.getPhysicsImpostor().setQuaternion(this._mesh.getPhysicsImpostor().rotationQuaternion);

		//this._mesh.getPhysicsImpostor().applyImpulse(this._direction, this._mesh.getAbsolutePosition());
		//}
	}

	keyDown(keyCode) {
		var index = this._keysDown.indexOf(keyCode);
		if (index === -1) {
			this._keysDown.push(keyCode);
		}
	}

	keyUp(keyCode) {
		var index = this._keysDown.indexOf(keyCode);
		if (index > -1) {
			this._keysDown.splice(index, 1);
		}
	}

}
