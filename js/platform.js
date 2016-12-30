class Platform extends Entity {

	constructor(width, height, posX, posY, guy, scene) {
		super(width, height, 1, scene);

		this.initGeometry(posX, posY);
		this.initPhysics(guy);
	}

	initGeometry(posX, posY) {
		this._mesh = BABYLON.MeshBuilder.CreateBox("platform", {height: this._height * CONS_SCALE, width: this._width * CONS_SCALE, depth: CONS_SCALE}, this._scene);

		var material = new BABYLON.StandardMaterial("Mat", this._scene);
		var texture = this.getTextureName();
		var alpha = 1.0;

		// MATERIAL -----------------------------------------------------------
		//Define a material
		var FrontMaterial = new BABYLON.StandardMaterial("cubeFront", this._scene);
		FrontMaterial.diffuseTexture = new BABYLON.Texture(texture, this._scene);
		FrontMaterial.diffuseTexture.uScale = this._width;
		FrontMaterial.diffuseTexture.vScale = this._height;
		FrontMaterial.alpha = alpha;

		var BackMaterial = new BABYLON.StandardMaterial("cubeBack", this._scene);
		BackMaterial.diffuseTexture = new BABYLON.Texture(texture, this._scene);
		BackMaterial.diffuseTexture.uScale = this._width;
		BackMaterial.diffuseTexture.vScale = this._height;
		BackMaterial.alpha = alpha;

		var LeftMaterial = new BABYLON.StandardMaterial("cubeLeft", this._scene);
		LeftMaterial.diffuseTexture = new BABYLON.Texture(texture, this._scene);
		LeftMaterial.diffuseTexture.uScale = this._height;
		LeftMaterial.diffuseTexture.vScale = this._depth;
		LeftMaterial.alpha = alpha;

		var RightMaterial = new BABYLON.StandardMaterial("cubeRight", this._scene);
		RightMaterial.diffuseTexture = new BABYLON.Texture(texture, this._scene);
		RightMaterial.diffuseTexture.uScale = this._height;
		RightMaterial.diffuseTexture.vScale = this._depth;
		RightMaterial.alpha = alpha;

		var TopMaterial = new BABYLON.StandardMaterial("cubeTop", this._scene);
		TopMaterial.diffuseTexture = new BABYLON.Texture(texture, this._scene);
		TopMaterial.diffuseTexture.uScale = this._depth;
		TopMaterial.diffuseTexture.vScale = this._width;
		TopMaterial.alpha = alpha;

		var BottomMaterial = new BABYLON.StandardMaterial("cubeBottom", this._scene);
		BottomMaterial.diffuseTexture = new BABYLON.Texture(texture, this._scene);
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
		// --------------------------------------------------------------------

		this._mesh.position.x = (posX + this._width/2) * CONS_SCALE;
		this._mesh.position.y = (posY + this._height/2) * CONS_SCALE;
		this._mesh.position.z = 0;

		this._mesh.isWalkable = true;
		this._mesh.isWall = true;
	}

	setPhysicsState() {
		this._mesh.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 0, restitution: CONS_RESTITUTION_PLAT, move: false });
	}

	getTextureName() {
		return "textures/block04.png";
	}

	initPhysics(guy) {
		var platform = this._mesh;
		this.setPhysicsState();
		var impostor = platform.getPhysicsImpostor();

		// What happens we the guy hits this platform?
		// If he hits a "wall" he changes direction.
		impostor.registerOnPhysicsCollide(guy._mesh.getPhysicsImpostor(), function(main, collided) {
			 var ray = new BABYLON.Ray(guy._mesh.position, platform.position.subtract(guy._mesh.position));
          var pickInfo = scene.pickWithRay(ray, function (item) { return item == platform });

			 var hit = false;
          if (pickInfo.hit) {
      			var normal = pickInfo.getNormal(false, true);
					if (guy._direction.x > 0) {
              		hit = normal.x < 1.0 && Math.abs(normal.y) < 0.1;
				 	} else if (guy._direction.x < 0) {
              		hit = normal.x > 0.5 && Math.abs(normal.y) < 0.1;
					}
          }
          if (hit) {
				//guy.toggleDirection();
			 }
		});
	}

}
