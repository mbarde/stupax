class Platform extends Entity {

	constructor(width, height, posX, posY, scene, resourceHandler) {
		super(width, height, 1, scene, resourceHandler);

		this.initGeometry(posX, posY);

		this.setPhysicsState();
	}

	initGeometry(posX, posY) {
		this._mesh = BABYLON.MeshBuilder.CreateBox("platform", {height: this._height * CONS_SCALE, width: this._width * CONS_SCALE, depth: CONS_SCALE}, this._scene);

		var texture = this.getTexture();

		var alpha = 1.0;

		// MATERIAL -----------------------------------------------------------
		var FrontMaterial = new BABYLON.StandardMaterial("cubeFront", this._scene);
		var BackMaterial = new BABYLON.StandardMaterial("cubeBack", this._scene);
		var LeftMaterial = new BABYLON.StandardMaterial("cubeLeft", this._scene);
		var RightMaterial = new BABYLON.StandardMaterial("cubeRight", this._scene);
		var TopMaterial = new BABYLON.StandardMaterial("cubeTop", this._scene);
		var BottomMaterial = new BABYLON.StandardMaterial("cubeBottom", this._scene);

		FrontMaterial.diffuseTexture = this.getTexture().clone();
		FrontMaterial.diffuseTexture.uScale = this._width;
		FrontMaterial.diffuseTexture.vScale = this._height;
		FrontMaterial.alpha = alpha;

		BackMaterial.diffuseTexture = this.getTexture().clone();
		BackMaterial.diffuseTexture.uScale = this._width;
		BackMaterial.diffuseTexture.vScale = this._height;
		BackMaterial.alpha = alpha;

		LeftMaterial.diffuseTexture = this.getTexture().clone();
		LeftMaterial.diffuseTexture.uScale = this._height;
		LeftMaterial.diffuseTexture.vScale = this._depth;
		LeftMaterial.alpha = alpha;

		RightMaterial.diffuseTexture = this.getTexture().clone();
		RightMaterial.diffuseTexture.uScale = this._height;
		RightMaterial.diffuseTexture.vScale = this._depth;
		RightMaterial.alpha = alpha;

		TopMaterial.diffuseTexture = this.getTexture().clone();
		TopMaterial.diffuseTexture.uScale = this._depth;
		TopMaterial.diffuseTexture.vScale = this._width;
		TopMaterial.alpha = alpha;

		BottomMaterial.diffuseTexture = this.getTexture().clone();
		BottomMaterial.diffuseTexture.uScale = this._depth;
		BottomMaterial.diffuseTexture.vScale = this._width;
		BottomMaterial.alpha = alpha;

		var cubeMultiMat = new BABYLON.MultiMaterial("cubeMulti", this._scene);
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

		this._mesh.position.x = (posX + this._width/2) * CONS_SCALE;
		this._mesh.position.y = (posY + this._height/2) * CONS_SCALE;
		this._mesh.position.z = 0;

		this._mesh.isWalkable = true;
		this._mesh.isWall = true;
		this._mesh.isWallAndNotMovable = true;
		this._mesh.projectileStopper = true;
	}

	setPhysicsState() {
		this._mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
				this._mesh, BABYLON.PhysicsEngine.BoxImpostor,
				{ mass: 0, restitution: CONS_RESTITUTION_PLAT, move: false },
				this._scene);
	}

	getTexture() {
		return this._resourceHandler.texPlatform;
	}

	destroy() {
		this._mesh.dispose();
	}

}
