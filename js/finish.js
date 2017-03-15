class Finish extends Entity {

	constructor(posX, posY, scene, assetsManager) {
		super(1, 1, 0, scene, assetsManager);

		this._posX = posX;
		this._posY = posY;

		this.initCollisionMesh();
		this.initDoorMesh();
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
		textureTask.onSuccess = function(task) {
			material.diffuseTexture = task.texture;
			material.diffuseTexture.hasAlpha = true;
			material.backFaceCulling = true;
		}

		var textureTask = this._assetsManager.addTextureTask("image task", "textures/door_open.png");
		(function(lvl) {
			textureTask.onSuccess = function(task) {
				lvl._tex_doorOpen = task.texture;
			}
		}) (this);

		this._doorMesh = BABYLON.MeshBuilder.CreatePlane("finish", {height: CONS_SCALE, width: CONS_SCALE}, this._scene);
		this._doorMesh.material = material;
		this._doorMesh.position.x = (this._posX + 0.5)  * CONS_SCALE;
		this._doorMesh.position.y = (this._posY + 0.5) * CONS_SCALE;
		this._doorMesh.position.z = CONS_SCALE/2 - 0.001;
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
	}

	getSubsequentLevel() {
		return this._subsequentLevel;
	}

	destroy() {
		this._collisionMesh.dispose();
		this._doorMesh.dispose();
		this._light.dispose();
	}

}
