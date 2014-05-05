var VERILY = (function () {

	function playintro(canvas) {
		console.log("Playing Intro");

		/**
			*	Initialization
			*/
		var c = createjs;
		var canvas = canvas || $('#intro_canvas')[0];
		var stage = new c.Stage(canvas);



	}


	return {
		playintro: function() {
			playintro();
		}
	}
})(); 