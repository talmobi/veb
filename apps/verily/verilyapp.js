var VERILY = (function () {

	var loaded = false;
	var manifest = [
		{ id: "intro1", src: "assets/art/intro1.png"},
		{ id: "introsound", src: "assets/snd/verilyebintro.mp3"}
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

		c.Sound.play("introsound");
		var bm = new c.Bitmap(queue.getResult("intro1"));

		stage.addChild(bm);

		var text = new c.Text("Hello World", "20px Arial", "#ff7700");
		text.textBaseline = "alphabetic";


		stage.addChild(text);

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