class MovablePlatform extends Platform {

	constructor(width, height, posX, posY, scene, assetsManager) {
		super(width, height, posX, posY, scene, assetsManager);

		this._direction = new BABYLON.Vector3(0, 0, 0); // movement direction

		this._keyPressed = false;

		this._speed = 3 * CONS_SCALE;
		this._mesh.getPhysicsImpostor().setMass(CONS_MOV_PLAT_MASS);

		this._keysDown = [];

		this._light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 15, -3), this._scene);
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

		var thisPos = this._mesh.getAbsolutePosition();

		// Check if movment to certain direction is not possible (because of static obstacles):
		var ray_distance = 0.1; // distance of check ray from platform
		var corner_distance = 0.2; //

		var blocked_bottom = false;
		var blocked_top = false;
		var blocked_right = false;
		var blocked_left = false;

		// Bottom:
		var posi = this._mesh.position.clone();
		posi.x = posi.x - (this._width/2 * CONS_SCALE) + corner_distance;
		posi.y = posi.y - (this._height/2 * CONS_SCALE) - ray_distance;
		var ray = new BABYLON.Ray(posi, new BABYLON.Vector3(1, 0, 0), this._width * CONS_SCALE - corner_distance*2);
		var pickInfo = this._scene.pickWithRay(ray, function(item) { return item.isWall; });
		if (pickInfo.hit) {
			blocked_bottom = true;
		}

		// Top:
		posi.y = posi.y + (this._height * CONS_SCALE) + ray_distance*2;
		var ray = new BABYLON.Ray(posi, new BABYLON.Vector3(1, 0, 0), this._width * CONS_SCALE - corner_distance*2);
		var pickInfo = this._scene.pickWithRay(ray, function(item) { return item.isWall; });
		if (pickInfo.hit) {
			blocked_top = true;
		}

		// Left:
		posi.x = posi.x - corner_distance - ray_distance;
		posi.y = posi.y - corner_distance - ray_distance;
		var ray = new BABYLON.Ray(posi, new BABYLON.Vector3(0, -1, 0), this._height * CONS_SCALE - corner_distance*2);
		var pickInfo = this._scene.pickWithRay(ray, function(item) { return item.isWall; });
		if (pickInfo.hit) {
			blocked_left = true;
		}

		// Right:
		posi.x = posi.x + (this._width * CONS_SCALE) + ray_distance*2;
		var ray = new BABYLON.Ray(posi, new BABYLON.Vector3(0, -1, 0), this._height * CONS_SCALE - corner_distance*2);
		var pickInfo = this._scene.pickWithRay(ray, function(item) { return item.isWall; });
		if (pickInfo.hit) {
			blocked_right = true;
		}
		// END OF Block check ----------------------------------------------------

		if (this._keysDown.indexOf(CTRL_LEFT) > -1 && !blocked_left) { // left
				this._direction.x = -this._speed;
		}
		if (this._keysDown.indexOf(CTRL_RIGHT) > -1 && !blocked_right) { // right
				this._direction.x =  this._speed;
		}
		if (this._keysDown.indexOf(CTRL_UP) > -1 && !blocked_top) {
				this._direction.y = this._speed; // up
		}
		if (this._keysDown.indexOf(CTRL_DOWN) > -1 && !blocked_bottom) {
				this._direction.y = -this._speed; // down
		}

		if (this._direction.y == 0 && this._direction.x == 0) {
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

		// Clip light to movable platform.
		this._light.position.x = this._mesh.getAbsolutePosition().x;
		this._light.position.y = this._mesh.getAbsolutePosition().y;
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
