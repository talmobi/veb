var VERILY = (function () {

	var loaded = false;
	var manifest = [
		{ id: "intro1", src: "apps/verily/assets/art/intro1.png" },
		{ id: "intro1_sub", src: "apps/verily/assets/art/intro1_sub.png" },
		{ id: "intro2", src: "apps/verily/assets/art/intro2.png" },
		{ id: "intromusic", src: "apps/verily/assets/art/intromusic.png" },
		{ id: "introsound", src: "apps/verily/assets/snd/verilyebintro.mp3" }
	]
	var queue = new createjs.LoadQueue(false);
	queue.installPlugin(createjs.Sound);
	queue.on("complete", function() {
		console.log("Assets loaded.");
		loaded = true;
		playintro();
	});
	queue.loadManifest( manifest );

	function load(next) {
		if (!loaded) {
			loaded = true;



		} else {
			next();
		}
	}

	function playintro(canvas) {
		console.log("Playing Intro");

		/**
			*	Initialization
			*/
		var c = createjs;
		var canvas = canvas || $('#intro_canvas')[0];

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		var ratio = window.innerHeight / window.innerWidth;

		var stage = new c.Stage(canvas);

		// border
		var shape = new c.Shape();
		shape.graphics.setStrokeStyle(3)
			.beginStroke("green")
			.rect(1, 1, canvas.width -1 , canvas.height - 1);
		stage.addChild(shape);


		c.Sound.play("introsound");
		var img = queue.getResult("intro1");
		console.log(img.width);

		var bm = new c.Bitmap(img);

		var scale =  (window.innerWidth / img.width) * 0.6;
		if (scale >= 1)
			scale = 1;

		bm.regX = img.width / 2;
		bm.regY = img.height / 2;
		bm.x = canvas.width / 2;
		bm.y = canvas.height / 2;
		bm.scaleX *= scale * 2.2;
		bm.scaleY *= scale * 2.2;
		bm.alpha = 0;

		stage.addChild(bm);

		console.log(bm);

		function tick() {
			stage.update();
		}


		/**
			* Tweening
			*/
		var tween = createjs.Tween.get(bm)
									.wait(200)
									.to({alpha:1, scaleX:scale, scaleY:scale}, 2500)

		// ticker
		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener("tick", tick);

	}


	return {
		playintro: function() {
			playintro();
		}
	}
})(); 