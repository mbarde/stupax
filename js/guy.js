class Guy extends Entity {

	constructor(posX, posY, scene) {
			var h = 0.7;
			var w = 0.2;
			var d = 0.4;
			super(h, w, d, scene);

			this._accelerationX = 0.2 * CONS_SCALE;
			this._maxSpeedX = 1.0 * CONS_SCALE;
			this._maxSpeedY = 0.1 * CONS_SCALE;
			this._direction = new BABYLON.Vector3(this._accelerationX, 0, 0); // movement direction
			this._isOnMovablePlatform = false;

			this._angle = 0.0;

			var color = {
				r: 0.7,
				g: 0.0,
				b: 0.0
			}

			this._mesh = BABYLON.MeshBuilder.CreateBox("guy", {height: h * CONS_SCALE, width: w * CONS_SCALE, depth: d * CONS_SCALE}, this._scene);
			/**var material = new BABYLON.StandardMaterial("ground", this._scene);
			material.diffuseColor = new BABYLON.Color3(color.r, color.g, color.b);
			material.specularColor = new BABYLON.Color3(color.r, color.g, color.b);
			material.emissiveColor = new BABYLON.Color3(color.r, color.g, color.b);
			this._mesh.material = material;**/

			// MATERIAL -----------------------------------------------------------
			//Define a material
		   var FrontMaterial = new BABYLON.StandardMaterial("cubeFront", scene);
		   FrontMaterial.diffuseTexture = new BABYLON.Texture("textures/guy/right.jpg", scene);

		   var BackMaterial = new BABYLON.StandardMaterial("cubeBack", scene);
		   BackMaterial.diffuseTexture = new BABYLON.Texture("textures/guy/left.jpg", scene, false, false);

		   var LeftMaterial = new BABYLON.StandardMaterial("cubeLeft", scene);
		   LeftMaterial.diffuseTexture = new BABYLON.Texture("textures/guy/back.jpg", scene, false, true);
			LeftMaterial.diffuseTexture.wAng = 90.0 * Math.PI / 180;

		   var RightMaterial = new BABYLON.StandardMaterial("cubeRight", scene);
		   RightMaterial.diffuseTexture = new BABYLON.Texture("textures/guy/front.jpg", scene);
			RightMaterial.diffuseTexture.wAng = 90.0 * Math.PI / 180;

		   var TopMaterial = new BABYLON.StandardMaterial("cubeTop", scene);
		   TopMaterial.diffuseTexture = new BABYLON.Texture("textures/guy/top.jpg", scene);

		   var BottomMaterial = new BABYLON.StandardMaterial("cubeBottom", scene);
		   BottomMaterial.diffuseTexture = new BABYLON.Texture("textures/guy/bottom.jpg", scene);

		   var cubeMultiMat = new BABYLON.MultiMaterial("cubeMulti", scene);
		   cubeMultiMat.subMaterials.push(BackMaterial);
		   cubeMultiMat.subMaterials.push(FrontMaterial);
		   cubeMultiMat.subMaterials.push(RightMaterial);
		   cubeMultiMat.subMaterials.push(LeftMaterial);
		   cubeMultiMat.subMaterials.push(TopMaterial);
		   cubeMultiMat.subMaterials.push(BottomMaterial);

		   this._mesh.subMeshes = [];
		   this._mesh.subMeshes.push(new BABYLON.SubMesh(0, 0,  4,  0, 6, this._mesh));
		   this._mesh.subMeshes.push(new BABYLON.SubMesh(1, 4,  4,  6, 6, this._mesh));
		   this._mesh.subMeshes.push(new BABYLON.SubMesh(2, 8,  4, 12, 6, this._mesh));
		   this._mesh.subMeshes.push(new BABYLON.SubMesh(3, 12, 4, 18, 6, this._mesh));
		   this._mesh.subMeshes.push(new BABYLON.SubMesh(4, 16, 4, 24, 6, this._mesh));
		   this._mesh.subMeshes.push(new BABYLON.SubMesh(5, 20, 4, 30, 6, this._mesh));

		   this._mesh.material = cubeMultiMat;
			// --------------------------------------------------------------------

			this._mesh.position.x = posX  * CONS_SCALE;
			this._mesh.position.y = posY * CONS_SCALE;
			this._mesh.position.z = 0;

			//mesh.checkCollisions = true;
         //mesh.applyGravity = true;
			this._mesh.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 8, restitution: 0.001, move: true });

			this._mesh.onCollide = function(){   console.log('I am colliding with something')}
	}

	update() {
		if (!this._isOnMovablePlatform) {
			if (this._mesh.getPhysicsImpostor().getLinearVelocity().y > this._maxSpeedY) {
				var vel = this._mesh.getPhysicsImpostor().getLinearVelocity();
				vel.y = this._maxSpeedY;
				this._mesh.getPhysicsImpostor().setLinearVelocity(vel);
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
		this._mesh.getPhysicsImpostor().applyImpulse(this._direction, this._mesh.getAbsolutePosition());

		// Prevent rotation in any way
		this._mesh.getPhysicsImpostor().setAngularVelocity(new BABYLON.Vector3(0, 0, 0));

		var q = BABYLON.Quaternion.RotationYawPitchRoll(this._angle * Math.PI/180, 0, 0);
		this._mesh.rotationQuaternion = q;

		// Always stay on the same Z coordinate
		this._mesh.position.z = 0;
	}

	keyDown(keyCode) {

	}

	keyUp(keyCode) {

	}

}
