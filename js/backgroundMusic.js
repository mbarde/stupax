/*
*	This class takes care of the background music.
* 	A special class has been created since the background music should not be
*	loaded synchronously with the other resources (increases loading time before
*	the game starts).
*/
class BackgroundMusic {

	constructor(filePath, scene) {
		this.playMusicWhenLoaded = true;

		(function(thisObject) {
			thisObject.music = new BABYLON.Sound("Music", filePath, scene,
				function() {
					if (thisObject.playMusicWhenLoaded) {
						thisObject.music.play();
					}
				}, { loop: true }
			);
		}) (this);
	}

	pause() {
		if (this.music && this.music.isPlaying) {
			this.music.pause();
		}
		this.playMusicWhenLoaded = false;
	}

	play() {
		if (this.music && !this.music.isPlaying) {
			this.music.play();
		}
		this.playMusicWhenLoaded = true;
	}

}
