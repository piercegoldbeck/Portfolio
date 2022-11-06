/* CLASSES: Define Ships
------------------------------------------------------------------------  */
class Ship {
  constructor(name, hull, firepower, accuracy) {
    this.name = name;
    this.hull = hull;
    this.firepower = firepower;
    this.accuracy = accuracy;
  }
  // method with a parameter of enemy and enemyName
  attack(enemy) {
    // random number between 0 and 1
    let hitChance = Math.random();
    // if random number is less than or equal to ships accuracy
    if (hitChance <= this.accuracy) {
      // subtract ships firepower from enemys hull
      enemy.hull -= this.firepower;
      log(`${enemy.name} was hit! the hull is now ${enemy.hull}`);
    } else {
      // if the random number is greater than ships accuracy
      log(`shot missed the ${enemy.name}`);
    }
  }
  checkShip() {
    // if ships hill is less than or equal to 0
    if (this.hull <= 0) {
      // returns a boolean (value) from calling this method
      return false;
    } else {
      // if ships hull is greater than 0
      // returns a boolean (value) from calling this method
      return true;
    }
  }
}

class Alien extends Ship {
  constructor(name) {
    super(name);
    this.name = name;
    this.hull = Math.floor(Math.random() * 4) + 3;
    this.firepower = Math.floor(Math.random() * 3) + 2;
    this.accuracy = (Math.floor(Math.random() * 3) + 6) / 10;
  }
}

/* Create Ships and Ship Arrays
------------------------------------------------------------------------  */
let uss;
const alienNames = [
  "Bob",
  "John",
  "Don",
  "Larry",
  "Tim",
  "Betty",
  "Karen",
  "Lisa",
];
let alienShips = [];
const numOfAliens = alienNames.length;
let currentAlien = 0;
let timer = null;

/* Create HTML Elements
------------------------------------------------------------------------  */
const battlefield = document.querySelector(".battlefield");
const ussShip = document.querySelector("#uss");
const ussHull = document.querySelector("#ussHull");
const alienHull = document.querySelector("#alienHull");
const battleAlien = document.querySelector("#battleAlien");
const aliens = document.querySelector(".aliens");
const fire = document.querySelector("#fire");
const ussImg = document.createElement("img");
const explosion = document.createElement("img");

// set explosion image source
explosion.setAttribute("src", "../Photos/explosion.png");

// add uss to page
ussImg.setAttribute("src", "../Photos/ship.png");
ussShip.append(ussImg);

/* Define Gameplay Logic
------------------------------------------------------------------------  */
function log(message) {
  const breakLine = document.createElement("br");
  const messageDiv = document.createElement("div");
  messageDiv.innerText = message;
  document.getElementById("gameLog").append(breakLine, messageDiv);
}

const startGame = () => {
  if (timer !== null) {
    return;
  }
  currentAlien = 0;
  alienShips = [];
  uss = new Ship("Black Pearl", 10, 5, 0.7);
  for (let i = 0; i < numOfAliens; i++) {
    alienShips.push(new Alien(alienNames[i]));
    const alienImg = document.createElement("img");
    alienImg.setAttribute("src", "../Photos/alien.png");
    aliens.append(alienImg);
  }

  battleAlien.append(aliens.lastChild);
  alienHull.innerText = alienShips[currentAlien].hull;
  ussHull.innerText = uss.hull;
  fire.innerText = "Fire";
  fire.onclick = gameRound;
};

const endGame = () => {
  //restart button?
  fire.onclick = startGame;
  fire.innerText = "Restart";
};

const gameRound = () => {
  if (timer !== null) {
    return;
  }
  // clear previous round messages
  document.getElementById("gameLog").innerText = "";
  //attack alien
  uss.attack(alienShips[currentAlien]);
  //check aliens hull
  const isAlienAlive = alienShips[currentAlien].checkShip();
  // if alien is alive
  if (isAlienAlive) {
    alienHull.innerText = alienShips[currentAlien].hull;
    // attack uss
    alienShips[currentAlien].attack(uss);
    // check usss hull
    const isUssAlive = uss.checkShip();
    // if uss is alive
    if (isUssAlive) {
      ussHull.innerText = uss.hull;
      // start new round with same alien
      log("fire at the alien again");
    } else {
      // end the game
      ussShip.removeChild(ussImg);
      ussHull.remove();
      ussShip.append(explosion);
      setTimeout(() => {
        ussShip.remove();
      }, 500);
      log("game over");
      endGame();
    }
    // if alien is dead
  } else {
    battleAlien.removeChild(battleAlien.lastChild);
    battleAlien.append(explosion);
    timer = setTimeout(() => {
      battleAlien.removeChild(explosion);
      battleAlien.append(aliens.lastChild);
      timer = null;
    }, 500);
    // move on to next alien
    currentAlien++;
    // if the current alien is less than the number of aliens were battling
    if (currentAlien < numOfAliens) {
      alienHull.innerText = alienShips[currentAlien].hull;
      log(`${currentAlien} alien ships destroyed`);
      log("we now battle " + alienShips[currentAlien].name);
      // start new round with next alien
      log("fire at the next alien");
    } else {
      alienHull.remove();
      // game is over
      log(`${currentAlien} alien ships destroyed. you win!`);
      endGame();
    }
  }
};

/* Execute Gameplay Logic
------------------------------------------------------------------------  */
// Initiate Game
startGame();
log(
  "time to battle the 6 aliens, first is " +
    alienShips[currentAlien].name +
    " FIRE!"
);

// Trigger a game round when "fire" button is pressed
