// document.write("Cynamonowy cydr");

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
		// this.x = x;
		// this.y = y;
		// this.r = r;
	}	

	update(keyboard) {
		if(keyboard.keys[keyboard.LEFT]) {
			this.x = this.x - this.v;
		} else if (keyboard.keys[keyboard.RIGHT]) {
			this.x = this.x + this.v;
		}
		if(keyboard.keys[keyboard.UP]) {
			this.y = this.y - this.v;
		} else if (keyboard.keys[keyboard.DOWN]) {
			this.y = this.y + this.v;
		}
	}
	render(ctx) {

		super.render(ctx);
		//ctx.fillStyle = 'rgb(200,50,200)';

		// ctx.fillStyle = 'rgb(127,6,200)';
		// ctx.strokeStyle = 'rgb(255,255,255)';
		// ctx.lineWidth = 3;
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
		this.v = 1;
		// this.x = x;
		// this.y = y;
		// this.a = a;
	}	

	renderRect(ctx){
		super.render(ctx);
		ctx.fillStyle = '#ffffcc';
		ctx.strokeStyle = '#ffcc66';
		// ctx.lineWidth = 3;
		// //ctx.beginPath();
		//ctx.closePath();
		//ctx.moveTO(x,y);
		//ctx.lineTo(x,y);
		ctx.fillRect(this.x,this.y,this.size,this.size);
		ctx.strokeRect(this.x,this.y,this.size,this.size);
	}

	update (canvas, ctx, player) {
		if(isCollidingRectRect(this,player)) {
			console.log('dziala');
			//location.reload();
			isEnd = true;
		}

		this.v = 0.5 + (player.score*0.5);

		if(this.x > canvas.width - this.size){
			this.x = this.x - this.v;
			this.isEdgeX = true;
		}
		if(this.x < 0 + this.size){
			this.x = this.x + this.v;
			this.isEdgeX = false;
		}

		if (this.isEdgeX){
			this.x = this.x - this.v;
		} else {
			this.x = this.x + this.v;
		}


	//	move(canvas,this);
	}
}
	
class Friends extends Entity {
	constructor (x, y,  a){
		super(x,y,a);
		// this.x = x;
		// this.y = y;
		// this.a = a;
	}	

	renderTri(ctx){
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
		// let a = Entity.getDefaultSize();
		// let fr = new Friends(Math.random()*(canvas.width-a),Math.random()*(canvas.height-a),a);
		// let deltaX = Math.abs(player.x-fr.x);
		// let deltaY = Math.abs(player.y-fr.y);
		// let distance = Math.sqrt(deltaX*deltaX+deltaY*deltaY);
		// while(distance<200) {
		// 	fr = new Friends(Math.random()*(canvas.width-a),Math.random()*(canvas.height-a),a);
		// 	deltaX = Math.abs(player.x-fr.x);
		// 	deltaY = Math.abs(player.y-fr.y);
		// 	distance = Math.sqrt(deltaX*deltaX+deltaY*deltaY);
		// }	
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
		let en = new Type(Math.random()*(canvas.width-a),Math.random()*(canvas.height-a),a);
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

// let gameOver = (canvas, ctx) => {
// 	isEnd = true;
// 	ctx.fillStyle = 'rgb(0,0,0)';
// 	ctx.fillRect(0,0,canvas.width,canvas.height);
// 	ctx.font = "30px Arial";
//     ctx.fillStyle = "rgb(255,255,255)";
//     ctx.fillText("GAME OVER! ", (canvas.width/2), canvas.height/2);
// }

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
	
	// for(let i=0; i<20;i++){
	// 	let en = new Enemy(Math.random()*(canvas.width-a),Math.random()*(canvas.height-a),a);
	// 	let deltaX = Math.abs(player.x-en.x);
	// 	let deltaY = Math.abs(player.y-en.y);
	// 	let distance = Math.sqrt(deltaX*deltaX+deltaY*deltaY);
	// 	while(distance<200){
	// 		en = new Enemy(Math.random()*(canvas.width-a),Math.random()*(canvas.height-a),a);
	// 		deltaX = Math.abs(player.x-en.x);
	// 		deltaY = Math.abs(player.y-en.y);
	// 		distance = Math.sqrt(deltaX*deltaX+deltaY*deltaY);
	// 	}
	// 	enemies.push(en);
	// }

	randObjects(canvas, Friends, friends, player, 1, 200);

	// for(let i=0; i<20;i++){
	// 	let fr = new Friends(Math.random()*(canvas.width-a),Math.random()*(canvas.height-a),a);
	// 	let deltaX = Math.abs(player.x-fr.x);
	// 	let deltaY = Math.abs(player.y-fr.y);
	// 	let distance = Math.sqrt(deltaX*deltaX+deltaY*deltaY);
	// 	while(distance<200){
	// 		fr = new Friends(Math.random()*(canvas.width-a),Math.random()*(canvas.height-a),a);
	// 		deltaX = Math.abs(player.x-fr.x);
	// 		deltaY = Math.abs(player.y-fr.y);
	// 		distance = Math.sqrt(deltaX*deltaX+deltaY*deltaY);
	// 	}
	// 	friends.push(fr);
	// }

	window.onresize = resize.bind(this,canvas,ctx);
		// canvas.width = window.innerWidth;
		// canvas.height = window.innerHeight;
		// ctx.fillStyle = 'rgb(150,50,100)';
		// ctx.fillRect(0,0,canvas.width,canvas.height);
		// player.x = canvas.width/2;
		// player.y = canvas.height/2;
		// player.render(ctx);
		// enemy.render(ctx);

	// enemy.render(ctx);

	let update = () => {
		player.update(keyboard);
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
	//	isEnd = true;
		ctx.fillStyle = '#191919';
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.font = "50px Arial";
	    ctx.fillStyle = 'rgb(100,30,100)';
	    let textEnd = 'GAME OVER! \n Total Score: ';
   		ctx.fillText(textEnd + player.score, 100, canvas.height/2);
   	//	ctx.fillText('Press F12', 30, canvas.height/2 + 50);
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



