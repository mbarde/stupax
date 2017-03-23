class Game extends Mode {

	constructor(scene, camera, resourceHandler, levelStrings, onBeforeLoadingNextLevel, onAfterLoadingNextLevel) {
		super(scene, camera);

		this._resourceHandler = resourceHandler;
		this._onBeforeLoadingNextLevel = onBeforeLoadingNextLevel;
		this._onAfterLoadingNextLevel = onAfterLoadingNextLevel;

		this._camera.position.x = 10 * CONS_SCALE;
		this._camera.position.y = 10 * CONS_SCALE;
		this._camera.rotation.y = 0.2;

		this._levelStrings = levelStrings;
		this._currentLevelID = 0;

		this._levelFactory = new LevelFactory(this._scene, this._camera, resourceHandler, this);

		this._level = false;
	}

	loadFirstLevel() {
		this._currentLevelID = 0;
		this.loadLevelFromString( this._levelStrings[this._currentLevelID] );
	}

	loadNextLevel() {
		if (this._levelStrings.length == 0) {
			this._level.restart();
		} else {
			this._onBeforeLoadingNextLevel();
			this._currentLevelID++;
			if (this._currentLevelID >= this._levelStrings.length) {
				this._currentLevelID = 0;
			}
			this.loadLevelFromString( this._levelStrings[this._currentLevelID] );
			this._onAfterLoadingNextLevel();
		}
	}

	loadRandomLevel() {
		this._onBeforeLoadingNextLevel();
		this._currentLevelID = Math.floor(Math.random()*this._levelStrings.length);
		this.loadLevelFromString( this._levelStrings[this._currentLevelID] );
		this._onAfterLoadingNextLevel();
	}

	loadLevelFromString(levelString) {
		var isFirstLevel = true;
		if (this._level) {
			isFirstLevel = false;
			this._level.destroy();
		}
		this._level = this._levelFactory.stringToLevelObject(levelString);
		if (isFirstLevel) {
			this._level._camFlyEndCallsOnResume = false;
		}
	}

	update() {
		this._level.update();
	}

	keyDown(ctrlCode) {
		if (ctrlCode == CTRL_RANDOM_LEVEL) {
			this.loadRandomLevel();
			return;
		}
		if (ctrlCode == CTRL_NEXT_LEVEL) {
			this.loadNextLevel();
			return;
		}
		if (!this._level._camFly) this._level.keyDown(ctrlCode);
	}

	keyUp(ctrlCode) {
		if (!this._level._camFly) this._level.keyUp(ctrlCode);
	}

	onPause() {
		if (this._level) {
			this._level.onPause();
		}
		if (this._resourceHandler.soundBackgroundMusic.isPlaying) {
			this._resourceHandler.soundBackgroundMusic.pause();
		}
	}

	onResume() {
		if (this._level) {
			this._level.onResume();
		}
		if (!this._resourceHandler.soundBackgroundMusic.isPlaying) {
			this._resourceHandler.soundBackgroundMusic.play();
		}
	}

}
