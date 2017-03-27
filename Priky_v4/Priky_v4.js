let isEnd = false;
let lvl = 1;

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

	static getDefaultFat() {
		return 5;
	}

	constructor (x, y, r){
		super(x, y, r);
		this.score = 0;
		this.v = 3;
		this.fat = 5;
		this.calories = 0;
	}	

	update(canvas, keyboard) {
		this.size = this.calories * this.fat + Entity.getDefaultSize();

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

class Portal extends Entity {
	constructor (x, y, z){
		super(x, y, z);
		if(lvl == 1) {
			this.z = 10;
		} else if (lvl == 2) {
			this.z = 25;
		} else {
			this.z = 50;
		}
		this.size = Math.round((Math.random()*this.z + Entity.getDefaultSize() + 5));
		while (this.size%5!=0){
			this.size = Math.round((Math.random()*this.z + Entity.getDefaultSize() + 5));
			//console.log(this.size);
		}
		this.timer = 10000/2;
	}	

	update (canvas, portals, player) {
		this.timer--;
		if(isInPortal(this, player)) {
			player.calories = 0;
			let tempArray = [];
			randObjects(canvas, Portal, tempArray, player, 1, 200);
			let index = portals.indexOf(this);
		 	portals.splice(index, 1, tempArray[0]);
		 	lvl++;
		 	this.timer = (this.size *100 + 1000)/2;
		}
		if(this.timer < 0){
			isEnd = true;
		}
	}
	render(ctx) {
		super.render(ctx);
		ctx.fillStyle = 'rgb(0,5,0)';
		ctx.strokeStyle = 'rgb(0,5,0)';
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
		ctx.fill();
		ctx.stroke();
		drawTime(ctx, this);
	}
}

class Enemy extends Entity {
	constructor (x,y,a){
		super(x,y,a);
		this.vx = (Math.random()-.5) * 2;
		this.vy = (Math.random()-.5) * 2;
	}	

	renderRect (ctx) {
		super.render(ctx);
		ctx.fillStyle = '#ffffcc';
		ctx.strokeStyle = '#ffcc66';
		ctx.fillRect(this.x,this.y,this.size,this.size);
		ctx.strokeRect(this.x,this.y,this.size,this.size);
	}

	update (canvas, ctx, player) {
		if(isCollidingRectRect(this, player)) {
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

class Minion extends Entity {
	constructor (x,y,a){
		super(x,y,a);
		this.vx = (Math.random()-.5) * 2;
		this.vy = (Math.random()-.5) * 2;
	}	

	renderRect (ctx) {
		super.render(ctx);
		ctx.fillStyle = '#ffffcc';
		ctx.strokeStyle = '#9f5f9f';
		ctx.fillRect(this.x,this.y,this.size,this.size);
		ctx.strokeRect(this.x,this.y,this.size,this.size);
	}

	update (canvas, ctx, player) {
		if(isCollidingRectRect(this, player)) {
			console.log('dziala');
			//location.reload();
			player.calories = 0;
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
			player.calories++;
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
		//console.log(e.keyCode);
		this.keys[e.keyCode] = true;
	}
}


let randObjects = (canvas, Type, array, player, count, maxDistance) => {
	for(let i = 0 ; i < count; i++) {
		let a = Entity.getDefaultSize();
		let en = new Type((Math.random()*(canvas.width-6*a)) + 3*a, (Math.random()*(canvas.height-6*a))+ 3*a,a);
		let deltaX = Math.abs(player.x-en.x);
		let deltaY = Math.abs(player.y-en.y);
		let distance = Math.sqrt(deltaX*deltaX+deltaY*deltaY);
		while(distance < maxDistance || (en.x - 3*en.size) < 0 || (en.y - 3*en.size) < 0 || (en.x + 3*en.size) > canvas.weight || (en.y + 3*en.size) > en.height){
			en = new Type(Math.random()*(canvas.width-6*a) +3*a, Math.random()*(canvas.height-6*a) + 3*a,a);
			deltaX = Math.abs(player.x-en.x);
			deltaY = Math.abs(player.y-en.y);
			distance = Math.sqrt(deltaX*deltaX+deltaY*deltaY);
		}
		array.push(en);
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
	return 	r1.x + r1.size > r2.x &&
			r1.x < r2.x + r2.size &&
			r1.y + r1.size > r2.y &&
			r1.y < r2.y + r2.size;
}
let isInPortal = (portal, player) => {
	let deltaX = Math.abs(portal.x-player.x);
	let deltaY = Math.abs(portal.y-player.y);
	return  portal.size === player.size &&
			deltaX < 5 && deltaY < 5;
			// player.y === portal.y &&
}
let drawScore = (ctx, player) => {
	ctx.font = '16px Arial';
    ctx.fillStyle = '#333366';
    ctx.fillText('Score: ' + player.score, 8, 20);
}
let drawLvl = (ctx) => {
	ctx.font = '40px Arial';
    ctx.fillStyle = '#333366';
    ctx.fillText("Level: " + lvl, 8, 60);
}
let drawTime = (ctx, portal) => {
	ctx.font = '16px Arial';
    ctx.fillStyle = '#333366';
    ctx.fillText('Time: ' + portal.timer, 100, 20);
}
let drawEnd = (canvas, ctx, player) => {
	ctx.fillStyle = '#191919';
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.font = '50px Arial';
	ctx.fillStyle = 'rgb(100,100,100)';
    let textEnd = 'GAME OVER! \n';
    let textScore = 'Total Score: ';
	ctx.fillText(textEnd, 300, canvas.height/2);
	ctx.fillText(textScore + player.score, 300, 2*canvas.height/3);
}
let drawInstruction = (ctx) => {
	ctx.font = '20px Arial';
    ctx.fillStyle = "#333366";
    ctx.fillText('FILL THE GAP !', 300, 20);
}

(function(){

	let canvas = document.createElement('canvas');
	let ctx = canvas.getContext('2d');

	resize(canvas,ctx);
	document.body.appendChild(canvas);

	let keyboard = new Keyboard();
	let player = new Player(canvas.width/2, canvas.height/2, Entity.getDefaultSize());
	let enemies = [];
	let minions = [];
	let friends = [];
	let portals = [];

	randObjects(canvas, Enemy, enemies, player, 5, 200);
	randObjects(canvas, Minion, minions, player, 5, 200);
	randObjects(canvas, Friends, friends, player, 1, 200);
	randObjects(canvas, Portal, portals, player, 1, 200);

	window.onresize = resize.bind(this,canvas,ctx);

	let update = () => {
		player.update(canvas, keyboard);
		enemies.forEach((enemy) => {enemy.update(canvas, ctx, player);});
		minions.forEach((minion) => {minion.update(canvas, ctx, player);});
		friends.forEach((friend) => {friend.update(canvas, friends, player);});
		portals.forEach((portal) => {portal.update(canvas, portals, player);});
	}
	let render = () => {
		clear(canvas,ctx);
		portals.forEach((portal) => {portal.render(ctx);});
		player.render(ctx);
		enemies.forEach((enemy) => {enemy.renderRect(ctx);});
		minions.forEach((minion) => {minion.renderRect(ctx);});
		friends.forEach((friend) => {friend.renderTri(ctx);});
		drawScore(ctx, player);
		drawInstruction(ctx);
		drawLvl(ctx);
	}
	let gameOver = () => {
		clear(canvas,ctx);
		drawEnd(canvas, ctx, player);
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