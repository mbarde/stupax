class Guy extends Animatable {

	constructor(posX, posY, scene) {
			super(scene);

			// Init values --------------------------------------------------------
			this._width = 0.6;
			this._height = 0.8;

			this._accelerationX = 0.2 * CONS_SCALE;
			this._maxSpeedX = 1.0 * CONS_SCALE;
			this._maxSpeedY = 0.1 * CONS_SCALE;
			this._direction = new BABYLON.Vector3(this._accelerationX, 0, 0); // movement direction
			this._standingTimestep = false;

			this._forward = true;
			this._stopOnWin = false;

			// Init geometry ------------------------------------------------------
			this._tex_uScale = 1;
			this._tex_vScale = 1;
			this._tex_uOffset = 0;
			this._tex_vOffset = 0;

			var material = new BABYLON.StandardMaterial("guy", this._scene);
			material.diffuseTexture = new BABYLON.Texture("textures/guy/obj_Idle001.png", this._scene);
			material.diffuseTexture.hasAlpha = true;
			material.diffuseTexture.uScale = this._tex_uScale;
			material.diffuseTexture.vScale = this._tex_vScale;
			material.diffuseTexture.uOffset = this._tex_uOffset;
			material.diffuseTexture.vOffset = this._tex_vOffset;
			material.backFaceCulling = false;

			this._planeMesh = BABYLON.MeshBuilder.CreatePlane("guyPlane", {height: 1.5 * CONS_SCALE, width: 1 * CONS_SCALE}, this._scene);
			this._planeMesh.material = material;

			// Impostor mesh for the physics
			var material = new BABYLON.StandardMaterial("guy", this._scene);
			material.alpha = 0.0;
			this._mesh = BABYLON.MeshBuilder.CreateBox("guy", {height: this._height * CONS_SCALE, width: this._width * CONS_SCALE, depth: CONS_SCALE}, this._scene);
			this._mesh.material = material;
			this._mesh.position.x = (posX + this._width/2) * CONS_SCALE;
			this._mesh.position.y = (posY + this._height/2) * CONS_SCALE;
			this._mesh.position.z = 0;

			// Init animations ----------------------------------------------------
			this.anim_load_animation([
				"textures/guy/obj_Run000.png",
				"textures/guy/obj_Run001.png",
				"textures/guy/obj_Run002.png",
				"textures/guy/obj_Run003.png",
				"textures/guy/obj_Run004.png",
				"textures/guy/obj_Run005.png",
				"textures/guy/obj_Run006.png",
				"textures/guy/obj_Run007.png"
			], this._tex_uScale, this._tex_vScale, this._tex_uOffset, this._tex_vOffset, 120, "run");
			this.anim_load_animation([
				"textures/guy/obj_Idle000.png",
				"textures/guy/obj_Idle001.png",
				"textures/guy/obj_Idle002.png",
				"textures/guy/obj_Idle003.png"
			], this._tex_uScale, this._tex_vScale, this._tex_uOffset, this._tex_vOffset, 120, "stand");
			this.anim_load_animation([
				"textures/guy/obj_JumpHigh000.png"
			], this._tex_uScale, this._tex_vScale, this._tex_uOffset, this._tex_vOffset, 120, "jump");
			this.anim_load_animation([
				"textures/guy/obj_Box000.png",
				"textures/guy/obj_Box001.png",
				"textures/guy/obj_Box002.png",
				"textures/guy/obj_Box003.png",
				"textures/guy/obj_Box004.png",
				"textures/guy/obj_Box005.png"
			], this._tex_uScale, this._tex_vScale, this._tex_uOffset, this._tex_vOffset, 80, "win");

			this.anim_set_animation_by_name("run");

			this._mesh.setPhysicsState(BABYLON.PhysicsEngine.PlaneImpostor, { mass: CONS_PLAYER_MASS, restitution: CONS_RESTITUTION_GUY, move: true });
	}

	// Reset guy, for example when restarting level
	reset(posX, posY) {
		this._direction = new BABYLON.Vector3(this._accelerationX, 0, 0); // movement direction
		this._forward = true;
		this._stopOnWin = false;

		this._mesh.position.x = (posX + this._width/2) * CONS_SCALE;
		this._mesh.position.y = (posY + this._height/2) * CONS_SCALE;

		var vel = this._mesh.getPhysicsImpostor().getLinearVelocity();
		vel.x = 0;
		vel.y = 0;
		this._mesh.getPhysicsImpostor().setLinearVelocity(vel);
		this._mesh.getPhysicsImpostor().setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
	}

	update() {
		this._planeMesh.position = this._mesh.getAbsolutePosition();
		this._planeMesh.position.y += 0.7;

		var vel = this._mesh.getPhysicsImpostor().getLinearVelocity();
		if (this._curMode != CONS_GM_STAND && vel.length() <= CONS_EPS) {
			if (!this._stopOnWin) this.anim_set_animation_by_name("stand");
			this._curMode = CONS_GM_STAND;
			if (!this._standingTimestep) {
				this._standingTimestep = new Date().getTime();
			}
		} else {
			// Check if guy is on any kind of walkable ground:
			// 1.) Define ray: From = guys center, direction = (0,-1,0), length = guys height / 2 + epsilon
			// 2.) Pick with ray any mesh which was marked as isWalkable = true
			// 3.) If any mesh was hit, guy is on ground
			// ~ voilá
			var posi = this._mesh.position.clone();
			var ray = new BABYLON.Ray(posi, new BABYLON.Vector3(0, -1, 0), this._height/2 * CONS_SCALE + 0.1);
			var pickInfo = scene.pickWithRay(ray, function(item) { return item.isWalkable; });
			if (pickInfo.hit) {
				if (this._curMode != CONS_GM_RUN) {
					this._standingTimestep = false;
					if (!this._stopOnWin) this.anim_set_animation_by_name("run");
					this._curMode = CONS_GM_RUN;
				}
			} else {
				if (this._curMode != CONS_GM_JUMP) {
					this._standingTimestep = false;
					if (!this._stopOnWin) this.anim_set_animation_by_name("jump");
					this._curMode = CONS_GM_JUMP;
				}
			}
		}

		// Check if guy hit a wall. Toggle direction if it is the case.
		var tolerance = 0.1;
		var corner_distance = 0.2;

		var posi = this._mesh.position.clone();
		if (this._forward) {
			posi.x = posi.x + (this._width/2 * CONS_SCALE) + tolerance;
		} else {
			posi.x = posi.x - (this._width/2 * CONS_SCALE) - tolerance;
		}
		posi.y = posi.y - (this._height/2 * CONS_SCALE) + corner_distance;

		var ray = new BABYLON.Ray(posi, new BABYLON.Vector3(0, 1, 0), this._height/2 * CONS_SCALE - corner_distance*2 );
		var pickInfo = scene.pickWithRay(ray, function(item) { return item.isWall; });
		if (pickInfo.hit) {
			this.toggleDirection();
		} else {
			// If guy stands in front of a wall higher than: this._height/2 * CONS_SCALE - corner_distance*2
			// Then the used ray is not able to detect the wall. So we additionally need a ray in x direction.
			var posi = this._mesh.position.clone();
			var x_dir = -1;
			if (this._forward) x_dir = 1;
			var ray = new BABYLON.Ray(posi, new BABYLON.Vector3(x_dir, 0, 0), this._width/2 * CONS_SCALE + tolerance );
		  	var pickInfo = scene.pickWithRay(ray, function(item) { return item.isWall; });
		  	if (pickInfo.hit) {
				this.toggleDirection();
			}
		}

		// Constrain Y velocity when guy is not on a platform
		if (this._curMode == CONS_GM_JUMP) {
			if (this._mesh.getPhysicsImpostor().getLinearVelocity().y > this._maxSpeedY) {
				var veloc = this._mesh.getPhysicsImpostor().getLinearVelocity();
				veloc.y = this._maxSpeedY;
				this._mesh.getPhysicsImpostor().setLinearVelocity(veloc);
			}
		}

		if (this._standingTimestep) {
			var time = new Date().getTime();
			if (time - this._standingTimestep >= CONS_GUY_STAND_TOGGLE_TIME) {
				this._standingTimestep = false;
				this.toggleDirection();
			}
		}

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

		// Movement
		if (this._curMode != CONS_GM_JUMP && !this._stopOnWin) this._mesh.getPhysicsImpostor().applyImpulse(this._direction, this._mesh.getAbsolutePosition());

		// Prevent rotation in any way
		this._mesh.getPhysicsImpostor().setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
		var q = BABYLON.Quaternion.RotationYawPitchRoll(0, 0, 0);
		this._mesh.rotationQuaternion = q;

		// Always stay on the same Z coordinate
		this._mesh.position.z = 0;

		if (this.anim_update()) {
			this._planeMesh.material = this.anim_get_cur_texture();
			if (!this._forward) this._planeMesh.material.diffuseTexture.uScale = -this._tex_uScale;
			else this._planeMesh.material.diffuseTexture.uScale = this._tex_uScale;
		}
	}

	// fired when player reaches door
	onWin() {
		this._stopOnWin = true;
		this.anim_set_animation_by_name("win");
	}

	toggleDirection() {
		this._direction.x = - this._direction.x;
		this._forward = !this._forward;

		if (!this._forward) {
			this._planeMesh.material.diffuseTexture.uScale = -this._tex_uScale;
			this._planeMesh.material.diffuseTexture.uOffset = -this._tex_uOffset;
		} else {
			this._planeMesh.material.diffuseTexture.uScale = this._tex_uScale;
			this._planeMesh.material.diffuseTexture.uOffset = this._tex_uOffset;
		}

		return this._forward;
	}

	keyDown(keyCode) {

	}

	keyUp(keyCode) {

	}

}
