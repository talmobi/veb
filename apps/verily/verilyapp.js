var VERILY = (function () {

	/**
		*	Preload Assets
		*/
	var manifest = [
		{ id: "intro1", src: "apps/verily/assets/art/intro1.png" },
		{ id: "intro1_sub", src: "apps/verily/assets/art/intro1_sub.png" },
		{ id: "intro2", src: "apps/verily/assets/art/intro2.png" },
		{ id: "intromusic", src: "apps/verily/assets/art/intromusic.png" },
		{ id: "emailicon", src: "apps/verily/assets/art/emailicon.png" },
		{ id: "introsound", src: "apps/verily/assets/snd/verilyebintro.mp3" }
	]
	var queue = new createjs.LoadQueue(false);
	queue.installPlugin(createjs.Sound);
	queue.on("complete", function() {
		console.log("Assets loaded.");
		playintro();
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
	createjs.Ticker.setFPS(50);
	createjs.Ticker.addEventListener('tick', tick);
	function tick() {
		stage.update();
	}

	function playintro() {
		console.log("Playing Intro");

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

		var eiconScale = 1.5;
		eicon = createImage( queue.getResult("emailicon"), eiconScale);
		eicon.x = window.innerWidth / 6;
		eicon.y = window.innerHeight;
		stage.addChild(eicon);

		var hit = new createjs.Shape()
		var es = eiconScale;
		hit.graphics.beginFill("#000")
				.drawRect(-eicon.width / 2, -eicon.height / 2, eicon.width * es, eicon.height * es);
		eicon.hitArea = hit;

		eicon.addEventListener('mouseover', function() {
			//console.log("OVER");
			createjs.Tween.get(eicon)
									.to({scaleX: g_scale * eiconScale * 1.5, scaleY: g_scale * eiconScale * 1.5}, 500, createjs.Ease.bounceOut);
		});

		eicon.addEventListener('mouseout', function() {
			//console.log("OUT");
			createjs.Tween.get(eicon)
									.to({scaleX: g_scale * eiconScale, scaleY: g_scale * eiconScale}, 500, createjs.Ease.bounceOut);
		});

		eicon.addEventListener("click", function() {
			$('#emaillink')[0].click();
		});


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
			
			createjs.Tween.get(eicon).wait(3000)
									.to({alpha:1}, 2000);

			createjs.Tween.get(eicon).wait(3000)
									.to({y:info.y + eicon.height * 3 * g_scale}, 2000, createjs.Ease.bounceOut);
		}

		/**
			* Start the animations
			*/
		phaseThree();
		c.Sound.play("introsound");
	}


	return {
		playintro: function() {
			playintro();
		}
	}
})(); 