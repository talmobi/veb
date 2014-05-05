var VERILY = (function () {

	var loaded = false;
	var manifest = [
		{ id: "intro1", src: "apps/verily/assets/art/intro1.png" },
		{ id: "introsound", src: "apps/verily/assets/snd/verilyebintro.mp3" }
	]
	var queue = new createjs.LoadQueue();
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

		var stage = new c.Stage(canvas);

		console.log(queue);
		console.log(queue.getResult("intro1"));

		var shape = new c.Shape();
		shape.graphics.setStrokeStyle(3)
			.beginStroke("green")
			.rect(1, 1, canvas.width -1 , canvas.height - 1);
		stage.addChild(shape);

		c.Sound.play("introsound");
		var bm = new c.Bitmap(queue.getResult("intro1"));
		bm.regX = 50;
		bm.regY = 50;
		stage.addChild(bm);

		function tick() {
			stage.update();
		}

		// ticker
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick", tick);

	}


	return {
		playintro: function() {
			playintro();
		}
	}
})(); 