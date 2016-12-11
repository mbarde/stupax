class MovablePlatform extends Platform {

	constructor(width, height, posX, posY, guy, scene) {
		super(width, height, posX, posY, guy, scene);
		this._guy = guy;

		this._direction = new BABYLON.Vector3(0, 0, 0); // movement direction

		this._keyPressed = false;

		this._speed = 3 * CONS_SCALE;
		//this._mesh.getPhysicsImpostor().setRestitution(0.8);
		this._mesh.getPhysicsImpostor().setMass(1);

		this._keysDown = [];
		this._mesh.platform = this;
	}

	update() {
		this._direction.x = 0;
		this._direction.y = 0;

		var coll = this._mesh.intersectsMesh(this._guy._mesh);
		var guyPos = this._guy._mesh.getAbsolutePosition();
		var thisPos = this._mesh.getAbsolutePosition();

		if (this._keysDown.indexOf(37) > -1) { // left
			if (!(coll && guyPos.x < thisPos.x)) {
				this._direction.x = -this._speed;
			}
		}
		if (this._keysDown.indexOf(39) > -1) { // right
			if (!(coll && guyPos.x > thisPos.x)) {
				this._direction.x =  this._speed;
			}
		}
		if (this._keysDown.indexOf(38) > -1) {
			if (!(coll && guyPos.y > thisPos.y) || this._guy._isOnMovablePlatform) {
				this._direction.y = this._speed; // up
			}
		}
		if (this._keysDown.indexOf(40) > -1) {
			if (!(coll && guyPos.y < thisPos.y)) {
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
