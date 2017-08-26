/*
* This class takes care of loading all resources (images, sounds, etc.)
* and keeps references to every file.
*/
class ResourceHandler {

	constructor(scene, assetsManager) {
		this._scene = scene;
		this._assetsManager = assetsManager;

		this.loadSounds();
		this.loadTextures();
		this.loadGuyAnimationTextures();
	}

	loadSounds() {
		// MovablePlatform
		var soundName = "SoundMovPlatEngine";
		var binaryTask = this._assetsManager.addBinaryFileTask(soundName + " task", "sounds/engine.ogg");
		(function(thisObject) {
			binaryTask.onSuccess = function (task) {
			   thisObject.soundMovablePlatform = new BABYLON.Sound(soundName, task.data, thisObject._scene, null, { volume: 0.1, loop: true });
			}
		}) (this);

		// Guy run
		var soundName = "SoundGuyRun";
		var binaryTask = this._assetsManager.addBinaryFileTask(soundName + " task", "sounds/steps.ogg");
		(function(thisObject) {
			binaryTask.onSuccess = function (task) {
			   thisObject.soundGuyRun = new BABYLON.Sound(soundName, task.data, thisObject._scene, null, { volume: 0.8, playbackRate: 0.8, loop: true });
			}
		}) (this);

		// Door open
		var soundName = "SoundDoorOpen";
		var binaryTask = this._assetsManager.addBinaryFileTask(soundName + " task", "sounds/door.ogg");
		(function(thisObject) {
			binaryTask.onSuccess = function (task) {
			   thisObject.soundDoorOpen = new BABYLON.Sound(soundName, task.data, thisObject._scene, null, { loop: false });
			}
		}) (this);

		// Guy below ground
		var soundName = "SoundGuyBelowGround";
		var binaryTask = this._assetsManager.addBinaryFileTask(soundName + " task", "sounds/spaceTrash4.mp3");
		(function(thisObject) {
			binaryTask.onSuccess = function (task) {
			   thisObject.soundGuyBelowGround = new BABYLON.Sound(soundName, task.data, thisObject._scene, null, { loop: false });
			}
		}) (this);

		// Guy die
		var soundName = "SoundGuyDie";
		var binaryTask = this._assetsManager.addBinaryFileTask(soundName + " task", "sounds/die.ogg");
		(function(thisObject) {
			binaryTask.onSuccess = function (task) {
			   thisObject.soundGuyDie = new BABYLON.Sound(soundName, task.data, thisObject._scene, null, { loop: false });
			}
		}) (this);

		// Emitter shot
		var soundName = "SoundEmitterShot";
		var binaryTask = this._assetsManager.addBinaryFileTask(soundName + " task", "sounds/shoot.mp3");
		(function(thisObject) {
			binaryTask.onSuccess = function (task) {
			   thisObject.soundEmitterShot = new BABYLON.Sound(soundName, task.data, thisObject._scene, null, { volume: 0.9, loop: false });
			}
		}) (this);

		// Projectile hit
		var soundName = "SoundProjectileHit";
		var binaryTask = this._assetsManager.addBinaryFileTask(soundName + " task", "sounds/explode.ogg");
		(function(thisObject) {
			binaryTask.onSuccess = function (task) {
			   thisObject.soundProjectileHit = new BABYLON.Sound(soundName, task.data, thisObject._scene, null, { volume: 0.3, loop: false });
			}
		}) (this);

		// Background music (do not add to assetsManager since we want it to load async)
		this.soundBackgroundMusic = new BackgroundMusic("sounds/through_space.ogg", this._scene);
	}

	loadTextures() {
		// Platform
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/block04.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texPlatform = task.texture;
			}
		}) (this);

		// Movable Platform
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/block03.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texMovablePlatform = task.texture;
			}
		}) (this);

		// Box
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/block02.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texBox = task.texture;
			}
		}) (this);

		// Emitter
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/emitter.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texEmitter = task.texture;
			}
		}) (this);

		// Fireball
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/fireball.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
			 	thisObject.texFireball = task.texture;
				thisObject.texFireball.hasAlpha = true;
			}
		} )(this);

		// Finish door closed
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/door.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texDoorClosed = task.texture;
				thisObject.texDoorClosed.hasAlpha = true;
			}
		}) (this);

		// Finish door open
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/door_open.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texDoorOpen = task.texture;
				thisObject.texDoorOpen.hasAlpha = true;
			}
		}) (this);

		// Background
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/block01.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texBackground = task.texture;
			}
		}) (this);
	}

	loadGuyAnimationTextures() {
		// Run
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/guy/obj_Run000.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texGuyRun00 = task.texture;
				thisObject.texGuyRun00.hasAlpha = true;
			}
		}) (this);
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/guy/obj_Run001.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texGuyRun01 = task.texture;
				thisObject.texGuyRun01.hasAlpha = true;
			}
		}) (this);
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/guy/obj_Run002.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texGuyRun02 = task.texture;
				thisObject.texGuyRun02.hasAlpha = true;
			}
		}) (this);
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/guy/obj_Run003.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texGuyRun03 = task.texture;
				thisObject.texGuyRun03.hasAlpha = true;
			}
		}) (this);
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/guy/obj_Run004.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texGuyRun04 = task.texture;
				thisObject.texGuyRun04.hasAlpha = true;
			}
		}) (this);
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/guy/obj_Run005.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texGuyRun05 = task.texture;
				thisObject.texGuyRun05.hasAlpha = true;
			}
		}) (this);
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/guy/obj_Run006.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texGuyRun06 = task.texture;
				thisObject.texGuyRun06.hasAlpha = true;
			}
		}) (this);
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/guy/obj_Run007.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texGuyRun07 = task.texture;
				thisObject.texGuyRun07.hasAlpha = true;
			}
		}) (this);

		// Idle
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/guy/obj_Idle000.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texGuyIdle00 = task.texture;
				thisObject.texGuyIdle00.hasAlpha = true;
			}
		}) (this);
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/guy/obj_Idle001.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texGuyIdle01 = task.texture;
				thisObject.texGuyIdle01.hasAlpha = true;
			}
		}) (this);
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/guy/obj_Idle002.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texGuyIdle02 = task.texture;
				thisObject.texGuyIdle02.hasAlpha = true;
			}
		}) (this);
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/guy/obj_Idle003.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texGuyIdle03 = task.texture;
				thisObject.texGuyIdle03.hasAlpha = true;
			}
		}) (this);

		// Jump
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/guy/obj_JumpHigh000.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texGuyJump = task.texture;
				thisObject.texGuyJump.hasAlpha = true;
			}
		}) (this);

		// Win
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/guy/obj_Box000.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texGuyWin00 = task.texture;
				thisObject.texGuyWin00.hasAlpha = true;
			}
		}) (this);
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/guy/obj_Box001.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texGuyWin01 = task.texture;
				thisObject.texGuyWin01.hasAlpha = true;
			}
		}) (this);
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/guy/obj_Box002.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texGuyWin02 = task.texture;
				thisObject.texGuyWin02.hasAlpha = true;
			}
		}) (this);
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/guy/obj_Box003.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texGuyWin03 = task.texture;
				thisObject.texGuyWin03.hasAlpha = true;
			}
		}) (this);
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/guy/obj_Box004.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texGuyWin04 = task.texture;
				thisObject.texGuyWin04.hasAlpha = true;
			}
		}) (this);
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/guy/obj_Box005.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texGuyWin05 = task.texture;
				thisObject.texGuyWin05.hasAlpha = true;
			}
		}) (this);

		// Die
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/guy/obj_Flying001.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texGuyDie00 = task.texture;
				thisObject.texGuyDie00.hasAlpha = true;
			}
		}) (this);
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/guy/obj_Flying000.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texGuyDie01 = task.texture;
				thisObject.texGuyDie01.hasAlpha = true;
			}
		}) (this);
		var textureTask = this._assetsManager.addTextureTask("texture task", "textures/guy/obj_Flat000.png");
		(function(thisObject) {
			textureTask.onSuccess = function(task) {
				thisObject.texGuyDie02 = task.texture;
				thisObject.texGuyDie02.hasAlpha = true;
			}
		}) (this);
	}

}
