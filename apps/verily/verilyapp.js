var VERILY = (function () {
	var initialized = false;
	var playing = false;

	/**
		*	Preload Assets
		*/
	var manifest = [
		{ id: "intro1", src: "apps/verily/assets/art/intro1.png" },
		{ id: "intro1_sub", src: "apps/verily/assets/art/intro1_sub.png" },
		{ id: "intro2", src: "apps/verily/assets/art/intro2.png" },
		{ id: "intromusic", src: "apps/verily/assets/art/intromusic.png" }
	]
	var queue = new createjs.LoadQueue(false);
	queue.installPlugin(createjs.Sound);

	/**
		* Display the welcome message
		*/
	var w_div = $(".welcomeDiv")
	var w_img = $('#welcome_image');
	w_div.fadeIn(1600);

	/**
		*	Asset loading complete
		*/
	var audioclip = document.getElementById('audioclip');
	queue.on("complete", function() {
		initialized = true;

		console.log("Assets loaded.");
		if (initialized) {

			if (!mobile) {
				var msg = document.getElementById('enter_message');
				document.getElementById('wDivId').addEventListener('mouseover', function() {
					if (!playing) {
						playing = true;


						function begin() {
							audioclip.play();
							playintro();
						}

						var d = $('.welcomeDiv');
						d.fadeOut(1000);
						d.promise().done(begin);
					}
				});

			} else {
				var msg = document.getElementById('enter_message')
				msg.innerHTML = "[Mobile] Touch to Enter"

				document.getElementById('wDivId').addEventListener('click', function() {
					if (!playing) {
						playing = true;

						function begin() {
							audioclip.play();
							playintro();
						}

						var d = $('.welcomeDiv');
						d.fadeOut(1000);
						d.promise().done(begin);

						audioclip.muted = true;
						audioclip.play();
						audioclip.pause();
						audioclip.muted = false;
					}

				}, false);

			}

		}
	});

	queue.loadManifest( manifest );

	/**
		* Initialize the Stage
		*/
	var c = createjs;
	var canvas = $('#intro_canvas')[0];

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	var ratio = window.innerHeight / window.innerWidth;

	var stage = new c.Stage(canvas);
	var mobile = false;
	var fps = 40;
	if (window.innerWidth < (480 * 2) || window.innerHeight < 480) { // assume it's a mobile
		fps = 20;
		mobile = true;
	}
	createjs.Ticker.setFPS(fps);
	createjs.Ticker.addEventListener('tick', stage);

	function init() {
	}

	function playintro() {
		console.log("Playing Intro");

		/**
			* reset the stage
			*/
		createjs.Tween.removeAllTweens();
		stage.removeAllChildren();
		stage.update();

		// border
		/*var shape = new c.Shape();
		shape.graphics.setStrokeStyle(3)
			.beginStroke("black")
			.rect(1, 1, canvas.width -1 , canvas.height - 1);
		stage.addChild(shape);*/

		var image = queue.getResult("intro1");

		/**
			*	Calculate approapriate global scale according to verilyeb.com page
			*/
		var g_scale =  (window.innerWidth / image.width) * 0.6;
		if (g_scale >= 1)
			g_scale = 1;

		/**
			*	Configure VERILY, EB logos
			*/
		var veb, veb_sub, info, kave, eicon;

		function createImage(src, scale) {
			var img = new createjs.Bitmap(src);

			// confgiure image dimensions (based on verilyeb.com video and homepage)
			img.regX = src.width / 2;
			img.regY = src.height / 2;
			img.x = canvas.width / 2;
			img.y = canvas.height / 2;
			img.width = src.width;
			img.height = src.height;
			img.scaleX *= g_scale * (scale || 2.2);
			img.scaleY *= g_scale * (scale || 2.2);
			img.alpha = 0;

			return img;
		}

		veb = createImage( queue.getResult("intro1") );
		stage.addChild(veb);

		veb_sub = createImage( queue.getResult("intro1_sub"), 1 );
		stage.addChild(veb_sub);

		info = createImage( queue.getResult("intro2"), 1 );
		stage.addChild(info);

		kave = createImage( queue.getResult("intromusic"), 1 );
		kave.x = window.innerWidth - kave.width * g_scale;
		kave.y = window.innerHeight - kave.height * g_scale;
		stage.addChild(kave);

		var footer = $('#Footer');
		footer.hide();

		/**
			* Tweening
			*/
		function phaseOne() {
			createjs.Tween.get(veb).wait(200)
										.to({alpha:1, scaleX:g_scale, scaleY:g_scale}, 2500).wait(3100).call(phaseTwo);
			createjs.Tween.get(veb_sub).wait(200).wait(1900)
										.to({alpha:1, scaleX:g_scale, scaleY:g_scale}, 300);
		}

		function phaseTwo() {
			createjs.Tween.get(veb).wait(100)
									.to({alpha:0}, 2200).call(phaseThree);
			createjs.Tween.get(veb_sub).wait(100)
									.to({alpha:0}, 2200);
		}

		function phaseThree() {
			stage.enableMouseOver();
			createjs.Tween.get(info).wait(100)
									.to({alpha:1}, 2200);
			createjs.Tween.get(kave).wait(100)
									.to({alpha:1}, 2200);
			
			
			var xx = window.innerWidth / 6;
			var yy = info.y + window.innerHeight / 10;

			footer.delay(2000).fadeIn(2000).css({
				position: 'absolute',
				marginLeft: 0, marginTop: 0,
				top: yy, left: xx
			}).appendTo('body');

		}

		/**
			* Start the animations
			*/
		phaseOne();
		//c.Sound.play("introsound");
	}

	return {
		playintro: function() {
			playintro();
		},

		init: function() {
			init();
		}
	}
})(); 