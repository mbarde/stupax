function MyLoadingScreen( /* variables needed, for example:*/ text) {
  //init the loader
  this.loadingUIText = text;
}
MyLoadingScreen.prototype.displayLoadingUI = function() {
  alert(this.loadingUIText);
  console.log(this.loadingUIText);
};
MyLoadingScreen.prototype.hideLoadingUI = function() {
  alert("Loaded!");
};
