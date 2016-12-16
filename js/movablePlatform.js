class MovablePlatform extends Platform {

	constructor(width, height, posX, posY, guy, scene) {
		super(width, height, posX, posY, guy, scene);
		this._guy = guy;

		this._direction = new BABYLON.Vector3(0, 0, 0); // movement direction

		this._keyPressed = false;

		this._speed = 3 * CONS_SCALE;
		this._mesh.getPhysicsImpostor().setMass(CONS_MASS_MOV_PLAT);

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
				this._direction.x = -this._speed;
		}
		if (this._keysDown.indexOf(CTRL_RIGHT) > -1) { // right
				this._direction.x =  this._speed;
		}
		if (this._keysDown.indexOf(CTRL_UP) > -1) {
				this._direction.y = this._speed; // up
		}
		if (this._keysDown.indexOf(CTRL_DOWN) > -1) {
				this._direction.y = -this._speed; // down
		}

		if (this._keysDown.length == 0) {
			this._direction.x = 0;
			this._direction.y = CONS_MOV_PLAT_UPLIFT; // avoid gravity
			this._mesh.getPhysicsImpostor().setLinearVelocity(this._direction);
		} else {
			// Apply impulse at every corner of every 1-unit-block of the platform
			/**
			var imp = this._direction;
			imp.x = imp.x / (this._width+1) * (this._height+1);
			imp.y = imp.y / (this._width+1) * (this._height+1);
			for (var x = 0; x <= this._width; x++) {
				for (var y = 0; y <= this._height; y++) {
					var pos = this._mesh.getAbsolutePosition().clone();
					pos.x = pos.x + ( (-this._width/2 + x) * CONS_SCALE );
					pos.y = pos.y + ( (-this._height/2 + y) * CONS_SCALE );
					console.log(pos);
					this._mesh.getPhysicsImpostor().applyImpulse(imp, pos);
				}
			}**/
			this._mesh.getPhysicsImpostor().applyImpulse(this._direction, this._mesh.getAbsolutePosition());
		}

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

}
