class Background extends Entity {

	constructor(width, height, scene, assetsManager) {
		super(width, height, 0, scene, assetsManager);

		this._levelWidth = width;
		this._levelHeight = height;

		this.initBackgroundPlane();
		this.initInvisibleFrontPlane();
	}

	initBackgroundPlane() {
		var material = new BABYLON.StandardMaterial("Mat", this._scene);
		var textureTask = this._assetsManager.addTextureTask("image task", "textures/block01.png");
		(function(levelWidth, levelHeight, mat) {
			textureTask.onSuccess = function(task) {
				mat.diffuseTexture = task.texture;
				mat.backFaceCulling = true;
				mat.diffuseTexture.uScale = (levelWidth + 9 * CONS_SCALE)
				mat.diffuseTexture.uOffset = 0.5;
				mat.diffuseTexture.vScale = (levelHeight);
			}
		}) (this._levelWidth, this._levelHeight, material);

		this._backgroundMesh = BABYLON.MeshBuilder.CreatePlane("plane", {width: (this._levelWidth + 9 * CONS_SCALE) * CONS_SCALE, height: (this._levelHeight * CONS_SCALE)}, this._scene);
		this._backgroundMesh.material = material;
		this._backgroundMesh.position.x = (this._levelWidth * CONS_SCALE) / 2;
		this._backgroundMesh.position.y = (this._levelHeight * CONS_SCALE) / 2 - 4 * CONS_SCALE;
		this._backgroundMesh.position.z = CONS_SCALE/2;
		this._backgroundMesh.receiveShadows = false;

		this._backgroundMesh.setPhysicsState(BABYLON.PhysicsEngine.PlaneImpostor, { mass: 0, restitution: CONS_RESTITUTION_PLAT, friction: 0, move: false });
	}

	initInvisibleFrontPlane() {
		var material = new BABYLON.StandardMaterial("Mat", this._scene);
		material.alpha = 0;
		this._invisibleFrontPlaneMesh = BABYLON.MeshBuilder.CreatePlane("plane", {width: (this._levelWidth + 9 * CONS_SCALE) * CONS_SCALE, height: (this._levelHeight * CONS_SCALE)}, this._scene);
		this._invisibleFrontPlaneMesh.material = material;
		this._invisibleFrontPlaneMesh.position.x = (this._levelWidth * CONS_SCALE) / 2;
		this._invisibleFrontPlaneMesh.position.y = (this._levelHeight * CONS_SCALE) / 2 - 4 * CONS_SCALE;
		this._invisibleFrontPlaneMesh.position.z = -CONS_SCALE/2;
		this._invisibleFrontPlaneMesh.setPhysicsState(BABYLON.PhysicsEngine.PlaneImpostor, { mass: 0, restitution: CONS_RESTITUTION_PLAT, friction: 0, move: false });
	}

	destroy() {
		this._backgroundMesh.dispose();
		this._invisibleFrontPlaneMesh.dispose();
	}
}
