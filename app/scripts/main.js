var VERILY = (function() {
	// private fields
	var root, mobile, img, audioclip, fps = 60, playing;

	/**
		*	Init App
		*/
	function init() {
		root = $('#appRoot');
		mobile = false;
		if (window.innerWidth < 480) { // assume it's a mobile
			mobile = true;
			fps = 30;
		}

		audioclip = $('#audioclip')[0];

		img = document.createElement('img');
		img.src = 'images/w_img.png'; // welcome image
		root.append($(img));

		if (mobile) {
			root.click( function() {
				playintro();
			});
		} else {
			root.mouseover( function() {
				playintro();
			});
		} // if mobile


		/**
		*	Initialise the widget
		*/
		var manifest = [
			{ id: "intro1", src: "images/intro1.png" },
			{ id: "intro1_sub", src: "images/intro1_sub.png" },
			{ id: "intro2", src: "images/intro2.png" },
			{ id: "intromusic", src: "images/intromusic.png" }
		];
		var queue = new createjs.LoadQueue(false);


	}

	function playintro() {
		// Preload audio fix on mobiles.
		if (mobile) {
			audioclip.muted = true;
			audioclip.play();
		}

		$(img).fadeOut(1000).promise().done( function() {

			// init the widget

			audioclip.pause();
			audioclip.currentTime = 0;
			audioclip.muted = false;
			audioclip.play();
		});

	}

	return {
		init: function() {
			init();
		}
	}

})();