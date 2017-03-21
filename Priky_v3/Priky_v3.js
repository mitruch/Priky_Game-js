let isEnd = false;

class Entity {

	static getDefaultSize() {
		return 20;
	}
	constructor (x, y, size) {
		this.x = x;
		this.y = y;
		this.size = size;
	}

	render (ctx){
		ctx.fillStyle = '#ffcccc';
		ctx.strokeStyle = '#9f5f9f';
		ctx.lineWidth = 3;
	}
}

class Player extends Entity {
	constructor (x, y, r){
		super(x, y, r);
		this.score = 0;
		this.v = 3;
	}	

	update(canvas, keyboard) {
		this.size = this.score * 4 + 20;

		if(keyboard.keys[keyboard.LEFT] && (this.x - this.size) > 0) {
			this.x = this.x - this.v;
		} else if (keyboard.keys[keyboard.RIGHT] && (this.x + this.size) < canvas.width ) {
			this.x = this.x + this.v;
		}
		if(keyboard.keys[keyboard.UP]  && (this.y - this.size) > 0) {
			this.y = this.y - this.v;
		} else if (keyboard.keys[keyboard.DOWN] && (this.y + this.size) < canvas.height)  {
			this.y = this.y + this.v;
		}
	}
	render(ctx) {
		super.render(ctx);
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
		ctx.fill();
		ctx.stroke();
	}
}

class Enemy extends Entity {
	constructor (x,y,a){
		super(x,y,a);
		this.isEdgeX = false;
		this.isEdgeY = false;
		this.vx = (Math.random()-.5) * 2;
		this.vy = (Math.random()-.5) * 2;
	}	

	renderRect(ctx) {
		super.render(ctx);
		ctx.fillStyle = '#ffffcc';
		ctx.strokeStyle = '#ffcc66';
		ctx.fillRect(this.x,this.y,this.size,this.size);
		ctx.strokeRect(this.x,this.y,this.size,this.size);
	}

	update (canvas, ctx, player) {
		if(isCollidingRectRect(this,player)) {
			console.log('dziala');
			//location.reload();
			isEnd = true;
		}
		if((this.x < 0 || (this.x + this.size) > canvas.width))  {
			this.vx = -this.vx;
		}
		if((this.y < 0 || (this.y + this.size) > canvas.height)) {
			this.vy = -this.vy;
		}
		this.x += this.vx * (player.score/2);
		this.y += this.vy * (player.score/2);
	}
}
	
class Friends extends Entity {
	constructor (x, y, a){
		super(x,y,a);
	}	

	renderTri(ctx) {
		super.render(ctx);
		ctx.fillStyle = '#ADEAEA';
		ctx.strokeStyle = '#236B8E';
		ctx.beginPath();
		ctx.moveTo(this.x,this.y);
		ctx.lineTo(this.x+this.size,this.y);
		ctx.lineTo(this.x+(this.size/2),this.y+((this.size*Math.sqrt(3))/2));
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}

	update (canvas, friends, player) {
		if(isCollidingRectRect(this, player)) {
			console.log('dziala');
			player.score++;
			let tempArray = [];
			randObjects(canvas, Friends, tempArray, player, 1, 200);
			let index = friends.indexOf(this);
		 	friends.splice(index, 1, tempArray[0]);
		}
	}
}

class Keyboard {
	constructor() {
		this.keys = [];
		window.onkeydown = this.handleKeyDown.bind(this);
		window.onkeyup = this.handleKeyUp.bind(this);

		this.LEFT = 37;
		this.UP = 38;
		this.RIGHT = 39;
		this.DOWN = 40;
	}

	handleKeyUp(e) {
		this.keys[e.keyCode] = false;
	}
	handleKeyDown(e) {
		// console.log(e.keyCode);
		this.keys[e.keyCode] = true;
	}
}

let clear = (canvas, ctx) => {
	ctx.fillStyle = '#e9e9e9';
	ctx.fillRect(0,0,canvas.width,canvas.height);
}
let resize = (canvas, ctx) => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	clear(canvas,ctx);
}
let isCollidingRectRect = (r1, r2) => {
	return r1.x + r1.size > r2.x &&
		   r1.x < r2.x + r2.size &&
		   r1.y + r1.size > r2.y &&
		   r1.y < r2.y + r2.size;
	}
let drawScore = (ctx, player) => {
	ctx.font = "16px Arial";
    ctx.fillStyle = "#333366";
    ctx.fillText("Score: "+player.score, 8, 20);
}
let randObjects = (canvas, Type, array, player, count, maxDistance) => {
	for(let i = 0 ; i < count; i++) {
		let a = Entity.getDefaultSize();
		let en = new Type((Math.random()*(canvas.width-a)) + .5, (Math.random()*(canvas.height-a)) + .5,a);
		let deltaX = Math.abs(player.x-en.x);
		let deltaY = Math.abs(player.y-en.y);
		let distance = Math.sqrt(deltaX*deltaX+deltaY*deltaY);
		while(distance < maxDistance){
			en = new Type(Math.random()*(canvas.width-a),Math.random()*(canvas.height-a),a);
			deltaX = Math.abs(player.x-en.x);
			deltaY = Math.abs(player.y-en.y);
			distance = Math.sqrt(deltaX*deltaX+deltaY*deltaY);
		}
		array.push(en);
	}
}

(function(){

	let canvas = document.createElement('canvas');
	let ctx = canvas.getContext('2d');

	resize(canvas,ctx);
	document.body.appendChild(canvas);

	let keyboard = new Keyboard();
	let player = new Player(canvas.width/2,canvas.height/2,20);
	let enemies = [];
	let friends = [];

	randObjects(canvas, Enemy, enemies, player, 20, 200);
	randObjects(canvas, Friends, friends, player, 1, 200);
	window.onresize = resize.bind(this,canvas,ctx);

	let update = () => {
		player.update(canvas, keyboard);
		enemies.forEach((enemy) => {enemy.update(canvas, ctx, player);});
		friends.forEach ((friend) => {friend.update(canvas, friends, player);});
	}
	let render = () => {
		clear(canvas,ctx);
		player.render(ctx);
		enemies.forEach((enemy) => {enemy.renderRect(ctx);});
		friends.forEach((friend) => {friend.renderTri(ctx);});
		drawScore(ctx,player);
	}
	let gameOver = () => {
		clear(canvas,ctx);
		ctx.fillStyle = '#191919';
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.font = "50px Arial";
	    ctx.fillStyle = 'rgb(100,30,100)';
	    let textEnd = 'GAME OVER! \n Total Score: ';
   		ctx.fillText(textEnd + player.score, 100, canvas.height/2);
}

	let loop = () => {
		if(isEnd == false){
			update();
			render();
		} 
		else {
			gameOver();
		}

		setTimeout(loop,1000/60);
	}

	loop();
})();



