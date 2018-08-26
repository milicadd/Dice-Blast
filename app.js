
//Velicina kockice
var diceSize = 60;

//Tabla za igru
var board = [];

//Niz kolona na tabli

board[0] = [6, 4, 6, 1, 5, 1, 3, 3];
board[1] = [1, 6, 2, 2, 7, 5, 2, 6];
board[2] = [2, 4, 2, 6, 5, 7, 1, 3];
board[3] = [2, 4, 5, 4, 1, 1, 5, 7];
board[4] = [5, 3, 7, 3, 4, 3, 5, 5];
board[5] = [1, 7, 7, 4, 1, 6, 6, 4];
board[6] = [1, 4, 2, 7, 4, 5, 2, 1];
board[7] = [2, 5, 2, 3, 3, 1, 1, 6];
/*
board[0] = [5, 3, 5, 0, 4, 0, 2, 2];
board[1] = [0, 5, 1, 1, 6, 4, 1, 5];
board[2] = [1, 3, 1, 5, 4, 6, 0, 2];
board[3] = [1, 3, 4, 3, 0, 0, 4, 6];
board[4] = [4, 2, 6, 2, 3, 2, 4, 4];
board[5] = [0, 6, 6, 3, 0, 5, 5, 3];
board[6] = [0, 3, 1, 6, 3, 4, 1, 0];
board[7] = [1, 4, 1, 2, 2, 0, 0, 5];
*/
// Tamnije kockice 
//var dark = new Array('#1D86D9', '#85C64E', '#EB662D', '#DDC139', '#DA3A44', '#C632A2', '#303030');
var dark = ['#1D86D9', '#85C64E', '#EB662D', '#DDC139', '#DA3A44', '#C632A2', '#303030'];

//Svetlije kockice (nijansa kada je kockica selektovana)
//var light = new Array('#6FB6EB', '#BADF9B', '#F4AA8A', '#EDDD92', '#EA9096', '#DF81C8', '#808080');
var light = ['#6FB6EB', '#BADF9B', '#F4AA8A', '#EDDD92', '#EA9096', '#DF81C8', '#808080'];

//Selektovana kockica
var selected = null;

//Rezultat
var score = 0;
var topScore = 0;

//Povlacenje kockica
var remove = [];
var gameIsOver = false;
var clickDisabled;

//Random f-ja za mesanje kockica na tabli
function random(minValue, maxValue) {
	return Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
}

//Unapred zadajemo potrebne property-e
function SelectedObj() {
	this.div;
	this.x;
	this.y;
	this.n;
}

// Pristupanje elementu(kockici) 
function xy2element(x, y) {
	var p = x * board.length + y;
	return document.getElementById('p_' + p);
}

//Podesiti tablu za igru
function setBoard(x, y, n) {
	board[x][y] = n;

	with (xy2element(x, y).style) {
		if (n == 0) display = 'none';
		else {
			backgroundColor = dark[n - 1];
			display = 'block';
		}
	}
}
//Podesavanje kursora misa
function setCursor(x, y, cur) {
	xy2element(x, y).style.cursor = cur;
}
//Kursor misa na celoj tabli
function setCursorAll(cur) {
	//i i j petlja (horizontalno i vertikalno)
	for (var i = 0; i < board.length; i++)
		for (var j = 0; j < board[i].length; j++)
			setCursor(i, j, cur);

}
//Selektovanje
function select(element, x, y, n) {
	//Preko konstruktora SelectedObj() dodeljujemo vrednost objektu za sel kockicu
	selected = new SelectedObj();
	selected.div = element;
	selected.x = x;
	selected.y = y;
	selected.n = n;
	//Pretrazujemo ceo selektovani div(style HTML)  
	with (selected.div.style) {
		//u HTML-u style backroundcolor i cursor
		backgroundColor = light[n - 1];
		cursor = 'pointer';
	}
	if (x > 1) setCursor(x - 1, y, 'pointer');
	if (y > 1) setCursor(x, y - 1, 'pointer');
	if (x < board.length - 1) setCursor(x + 1, y, 'pointer');
	if (y < board[x].length - 1) setCursor(x, y + 1, 'pointer');
}

function unselect() {
	if (selected) {
		with (selected.div.style) {
			backgroundColor = dark[selected.n - 1];
		}
		selected = null;
	}
	setCursorAll('pointer');
}

// Klikom na kockicu
function clickMe(element) {
	if (gameIsOver) return;
	if (clickDisabled) return;

	var x = Math.floor(parseInt(element.style.left) / diceSize);
	var y = Math.floor(parseInt(element.style.top) / diceSize);
	var n = board[x][y];

	if (!selected) {
		setCursorAll('default');
		select(element, x, y, n);
	}
	else {
		if (selected.div == element) {
			unselect();
		}
		else {
			if ((((selected.x == x) && ((selected.y == y + 1) || (selected.y == y - 1)))
				|| (selected.y == y) && ((selected.x == x + 1) || (selected.x == x - 1)))) {
				dice = false;
				switchSelected(element, x, y, n);
			}
		}
	}
}

var dice = false;

//zamena pozicije dve kockice
var elements = [];

//Povlacenje elemenata
function move_elements() {
	var cont = false;

	var i = 0;
	var n = elements.length;
	while (i < n) {
		var element = elements[i];
		if ((element.x != element.dx) || (element.y != element.dy)) {
			var diceX = (element.x - element.dx);
			var moveX = Math.round(diceX / 3);
			if (diceX < 0) {
				if (moveX == 0) moveX = -1;
			} else if (diceX > 0) {
				if (moveX == 0) moveX = 1;
			} else moveX = 0;
             
			var diceY = (element.y - element.dy);
			var moveY = Math.round(diceY / 3);
			if (diceY < 0) {
				if (moveY == 0) moveY = -1;
			} else if (diceY > 0) {
				if (moveY == 0) moveY = 1;
			} else moveY = 0;

			element.x -= moveX;
			element.y -= moveY;

			element.element.style.left = element.x + 'px';
			element.element.style.top = element.y + 'px';

			cont = true;
		}
		i++;
	}
   
	if (cont) setTimeout('move_elements()', 30);
	else {

		elements[0].element.style.backgroundColor = dark[elements[1].n - 1];
		elements[1].element.style.backgroundColor = dark[elements[0].n - 1];

		elements[0].element.style.left = elements[1].dx + 'px';
		elements[1].element.style.left = elements[0].dx + 'px';
		elements[0].element.style.top = elements[1].dy + 'px';
		elements[1].element.style.top = elements[0].dy + 'px';
        
		if (dice) return;
		dice = true;

		remove = [];
		checkSameFrom(elements[1].bx, elements[1].by);
		checkSameFrom(elements[0].bx, elements[0].by);
		if (remove.length == 0) {
			select(elements[0].element, elements[0].bx, elements[0].by, elements[1].n);
			switchSelected(elements[1].element, elements[1].bx, elements[1].by, elements[0].n);
		}
		else {
			clickDisabled = true;
			removeSame();
		}
	}
}

//Zamena kockice sa...
function switchSelected(element, x, y, n) {
	//Pomp flasa
	var tempt = board[x][y];
	board[x][y] = board[selected.x][selected.y];
	board[selected.x][selected.y] = tempt;

	elements.length = 0;
   
	//Kreiramo novi objekat sa svojstvima(properties)
	var obj = new Object();
	obj.element = selected.div;
	obj.x = selected.div.offsetLeft;
	obj.y = selected.div.offsetTop;
	obj.dx = element.offsetLeft;
	obj.dy = element.offsetTop;
	obj.bx = selected.x;
	obj.by = selected.y;
	obj.n = selected.n;
	//ubacujemo ga u niz
	elements.push(obj);

	//treba ubaciti i drugu kockicu(koja se menja) u niz
	var obj = new Object();
	obj.element = element;
	obj.x = element.offsetLeft;
	obj.y = element.offsetTop;
	obj.dx = selected.div.offsetLeft;
	obj.dy = selected.div.offsetTop;
	obj.bx = x;
	obj.by = y;
	obj.n = n;
	elements.push(obj);
	
	//praznimo objekat
	selected = null;
    //povlacimo kockice
	move_elements();

}


//Proveri da li su sve iste
function checkAllSame() {
	remove = [];
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			checkSameFrom(i, j);
		}
	}
	if (remove.length > 0) removeSame();
	else {
		clickDisabled = false;
		setCursorAll('pointer');
	}
}


//Provera kockica po x i y
function checkSameFrom(x, y) {
	var n = board[x][y];
	var removeX = [];
	var i = x + 1;
	while ((i < board.length) && (board[i][y] == n)) {
		//Guranje objekata u niz
		removeX.push({ x: i, y: y });
		i++;
	}
	removeX.push({ x: x, y: y });
	i = x - 1;
	while ((i >= 0) && (board[i][y] == n)) {
		removeX.push({ x: i, y: y });
		i--;
	}
	//remove.concat(removeX) ubacivanje niza po x u remove niz
	if (removeX.length >= 3) {
		for (var i = 0; i < removeX.length; i++)
			remove.push({ x: removeX[i].x, y: removeX[i].y });
	}

	var removeY = [];
	var j = y + 1;
	while ((j < board[x].length) && (board[x][j] == n)) {
		removeY.push({ x: x, y: j });
		j++;
	}
	removeY.push({ x: x, y: y });
	j = y - 1;
	while ((j >= 0) && (board[x][j] == n)) {
		removeY.push({ x: x, y: j });
		j--;
	}
	//remove.concat(removeY);
	if (removeY.length >= 3) {
		for (var j = 0; j < removeY.length; j++)
			remove.push({ x: removeY[j].x, y: removeY[j].y });
	}
}

//Uklanjanje istih kockica
function removeSame() {
	for (var i = 0; i < remove.length; i++) {
		xy2element(remove[i].x, remove[i].y).style.backgroundColor = light[board[remove[i].x][remove[i].y] - 1];
	}
	setTimeout("doRemoveSame()", 400);
}

//Funkcija za izracunavanje scora kockica
function sqr(val) {
	return val * val;
}

//Brisanje kockica sa table i uvecavanje scora
function doRemoveSame() {
	//Za koliko se val uvecava 
	var tmpscore = 2;
	for (var i = 0; i < remove.length; i++) {
		if (board[remove[i].x][remove[i].y] != 0) {
			setBoard(remove[i].x, remove[i].y, 0);
			tmpscore++;
		}
	}
	score = score + sqr(tmpscore);
	setScore();
	moveCounter();
	setTimeout("dropDown()", 200);
}

//Padanje kockica
function dropDown() {
	var maxj = -1;
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			if (board[i][j] == 0) {
				if (j < 1) setBoard(i, j, random(1, 7));
				else {
					setBoard(i, j, board[i][j - 1]);
					setBoard(i, j - 1, 0);
					if (maxj < j) maxj = j;
				}
			}
		}
	}
	if (maxj > -1) setTimeout("dropDown()", 250 / (maxj + 2));
	else {
		setTimeout("checkAllSame()", 300);
	};
}

// Zakucavanje scora
function setScore() {
	document.getElementById('score').innerHTML = score;
	// Ako je score > od ... izracunaj vreme i poteze
	if (score >= 500) {
		clearInterval(interval);
		finalTime = timer.innerHTML;
		document.getElementById("totalTime").innerHTML = finalTime;
		document.getElementById("finalMove").innerHTML = moves;
		congratulations();

		//console.log("Winner")
	}

}
//Ucitavanje nove igre
function newGame() {
	window.location.reload();
	moveCounter();
}

var moves = 0;
var counter = document.getElementById("moves");

// Brojac poteza
function moveCounter() {
	moves++;
	counter.innerHTML = moves;

	if (moves == 1) {
		second = 0;
		minute = 0;
		hour = 0;
		startTimer();
	}

}

var second = 0, minute = 0; hour = 0;
var timer = document.getElementById("time");
var interval;

//Startovanje tajmera
function startTimer() {
	interval = setInterval(function () {

		timer.innerHTML = "Time: " + minute + "mins " + second + "secs";
		second++;
		if (second == 60) {
			minute++;
			second = 0;
		}
		if (minute == 60) {
			hour++;
			minute = 0;
		}
	}, 1000);
}

// Pop-up za pobednika
function congratulations() {
	document.getElementById("overlay").style.visibility = "visible";
	document.getElementById("overlay").style.opacity = 1;
	closeModal();
}

// x iconica
function closeModal() {
	var closeIcon = document.querySelector(".close");
	closeIcon.addEventListener("click", function (e) {
		closeIcon.remove("show");
		newGame();
	});

}
// Game over
function gameOver() {
	document.getElementById("overlay2").style.visibility = "visible";
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			if (board.length <= 0) {
				gameIsOver = true;
			}
		}
	}

	closeModal();
}




