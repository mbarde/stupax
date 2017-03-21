class Finish extends Entity {

	constructor(posX, posY, scene, assetsManager) {
		super(1, 1, 0, scene, assetsManager);

		this._posX = posX;
		this._posY = posY;

		this.initCollisionMesh();
		this.initDoorMesh();
		this.initSound();
		this.initLight();
	}

	initCollisionMesh() {
		// Create invisible mesh for collision detection
		var material = new BABYLON.StandardMaterial("finish", this._scene);
		material.alpha = 0.0;

		this._collisionMesh = BABYLON.MeshBuilder.CreatePlane("finish", {height: CONS_SCALE, width: CONS_SCALE}, this._scene);
		this._collisionMesh.material = material;
		this._collisionMesh.position.x = (this._posX + 0.5)  * CONS_SCALE;
		this._collisionMesh.position.y = (this._posY + 0.5) * CONS_SCALE;
		this._collisionMesh.position.z = 0;

		// Rotate plane to make it stand orthogonal to players plane
		var q = BABYLON.Quaternion.RotationYawPitchRoll(90, 0, 0);
		this._collisionMesh.rotationQuaternion = q;
	}

	initDoorMesh() {
		// Create plane containing the finish texture
		var material = new BABYLON.StandardMaterial("finish", this._scene);
		var textureTask = this._assetsManager.addTextureTask("image task", "textures/door.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				material.diffuseTexture = task.texture;
				material.diffuseTexture.hasAlpha = true;
				material.backFaceCulling = true;
				thisObject._tex_doorClosed = task.texture;
			}
		}) (this);

		var textureTask = this._assetsManager.addTextureTask("image task", "textures/door_open.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject._tex_doorOpen = task.texture;
			}
		}) (this);

		this._doorMesh = BABYLON.MeshBuilder.CreatePlane("finish", {height: CONS_SCALE, width: CONS_SCALE}, this._scene);
		this._doorMesh.material = material;
		this._doorMesh.position.x = (this._posX + 0.5)  * CONS_SCALE;
		this._doorMesh.position.y = (this._posY + 0.5) * CONS_SCALE;
		this._doorMesh.position.z = CONS_SCALE/2 - 0.001;
	}

	initSound() {
		var binaryTask = this._assetsManager.addBinaryFileTask("SoundDoorOpen task", "sounds/door.ogg");
		(function(thisObject) {
			binaryTask.onSuccess = function (task) {
			   thisObject._soundDoorOpen = new BABYLON.Sound("SoundDoorOpen", task.data, thisObject._scene, null, { loop: false });
			}
		}) (this);
	}

	initLight() {
		this._light = new BABYLON.SpotLight("Spot0",
							new BABYLON.Vector3((this._posX + 0.5) * CONS_SCALE, (this._posY + 1) * CONS_SCALE, -2 * CONS_SCALE),
							new BABYLON.Vector3(0, 0, 1), 1.2, 30, this._scene);
		this._light.diffuse = new BABYLON.Color3(1, 0, 0);
		this._light.specular = new BABYLON.Color3(1, 0, 0);
	}

	isIntersectingMesh(mesh) {
		return this._collisionMesh.intersectsMesh(mesh);
	}

	onWin() {
		this._doorMesh.material.diffuseTexture = this._tex_doorOpen;
		this._doorMesh.material.diffuseTexture.hasAlpha = true;
		this._light.diffuse = new BABYLON.Color3(0, 1, 0);
		this._light.specular = new BABYLON.Color3(0, 1, 0);
		this._soundDoorOpen.play();
	}

	getSubsequentLevel() {
		return this._subsequentLevel;
	}

	reset() { // reverts all effects done by onWin() [needed for level restart after win]
		this._doorMesh.material.diffuseTexture = this._tex_doorClosed;
		this._doorMesh.material.diffuseTexture.hasAlpha = true;
		this._light.diffuse = new BABYLON.Color3(1, 0, 0);
		this._light.specular = new BABYLON.Color3(1, 0, 0);
	}

	destroy() {
		this._collisionMesh.dispose();
		this._doorMesh.dispose();
		this._light.dispose();
	}

}
