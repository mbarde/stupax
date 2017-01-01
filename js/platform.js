class Platform extends Entity {

	constructor(width, height, posX, posY, guy, scene, assetsManager) {
		super(width, height, 1, scene, assetsManager);

		this.initGeometry(posX, posY);
		this.initPhysics(guy);
	}

	initGeometry(posX, posY) {
		this._mesh = BABYLON.MeshBuilder.CreateBox("platform", {height: this._height * CONS_SCALE, width: this._width * CONS_SCALE, depth: CONS_SCALE}, this._scene);

		var texture = this.getTextureName();

		var alpha = 1.0;

		// MATERIAL -----------------------------------------------------------
		var FrontMaterial = new BABYLON.StandardMaterial("cubeFront", this._scene);
		var BackMaterial = new BABYLON.StandardMaterial("cubeBack", this._scene);
		var LeftMaterial = new BABYLON.StandardMaterial("cubeLeft", this._scene);
		var RightMaterial = new BABYLON.StandardMaterial("cubeRight", this._scene);
		var TopMaterial = new BABYLON.StandardMaterial("cubeTop", this._scene);
		var BottomMaterial = new BABYLON.StandardMaterial("cubeBottom", this._scene);

		var textureTask = this._assetsManager.addTextureTask("image task", texture);
		(function(thisWidth, thisHeight, thisDepth) {
			textureTask.onSuccess = function(task) {
				FrontMaterial.diffuseTexture = task.texture;
				FrontMaterial.diffuseTexture.uScale = thisWidth;
				FrontMaterial.diffuseTexture.vScale = thisHeight;
				FrontMaterial.alpha = alpha;
			}
		}) (this._width, this._height, this._depth);

		var textureTask = this._assetsManager.addTextureTask("image task", texture);
		(function(thisWidth, thisHeight, thisDepth) {
			textureTask.onSuccess = function(task) {
				BackMaterial.diffuseTexture = task.texture;
				BackMaterial.diffuseTexture.uScale = thisWidth;
				BackMaterial.diffuseTexture.vScale = thisHeight;
				BackMaterial.alpha = alpha;
			}
		}) (this._width, this._height, this._depth);

		var textureTask = this._assetsManager.addTextureTask("image task", texture);
		(function(thisWidth, thisHeight, thisDepth) {
			textureTask.onSuccess = function(task) {
				LeftMaterial.diffuseTexture = task.texture;
				LeftMaterial.diffuseTexture.uScale = thisHeight;
				LeftMaterial.diffuseTexture.vScale = thisDepth;
				LeftMaterial.alpha = alpha;
			}
		}) (this._width, this._height, this._depth);

		var textureTask = this._assetsManager.addTextureTask("image task", texture);
		(function(thisWidth, thisHeight, thisDepth) {
			textureTask.onSuccess = function(task) {
				RightMaterial.diffuseTexture = task.texture;
				RightMaterial.diffuseTexture.uScale = thisHeight;
				RightMaterial.diffuseTexture.vScale = thisDepth;
				RightMaterial.alpha = alpha;
			}
		}) (this._width, this._height, this._depth);

		var textureTask = this._assetsManager.addTextureTask("image task", texture);
		(function(thisWidth, thisHeight, thisDepth) {
			textureTask.onSuccess = function(task) {
				TopMaterial.diffuseTexture = task.texture;
				TopMaterial.diffuseTexture.uScale = thisDepth;
				TopMaterial.diffuseTexture.vScale = thisWidth;
				TopMaterial.alpha = alpha;
			}
		}) (this._width, this._height, this._depth);

		var textureTask = this._assetsManager.addTextureTask("image task", texture);
		(function(thisWidth, thisHeight, thisDepth) {
			textureTask.onSuccess = function(task) {
				BottomMaterial.diffuseTexture = task.texture;
				BottomMaterial.diffuseTexture.uScale = thisDepth;
				BottomMaterial.diffuseTexture.vScale = thisWidth;
				BottomMaterial.alpha = alpha;
			}
		}) (this._width, this._height, this._depth);

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
