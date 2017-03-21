class AnimatableAndSoundable extends Animatable {

	constructor(scene, assetsManager) {
		super(scene, assetsManager);
	}

	loadSound(soundReference, soundFileName, soundName, loop) {
		var binaryTask = this._assetsManager.addBinaryFileTask(soundName + " task", "sounds/" + soundFileName);
		(function(sound, scene) {
			binaryTask.onSuccess = function (task) {
			   sound = new BABYLON.Sound(soundName, task.data, scene, null, { loop: loop });
			}
		}) (soundReference, this._scene);
	}
}
