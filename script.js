const asteroidCount = 30;
const maxAsteroidSize = 30;
const projectileVelocity = 4;
let animationID = null;
const asterioids = [];
const deadAsteroids = [];

// const colors = ['lightgreen', 'lightblue', 'yellow', 'lightpink', 'lightgray', 'lightcoral', 'lightskyblue', 'lightcyan'];
// const colors = ['lightpink', 'lightgray', 'D7E0E4', 'lightyellow', 'lightskyblue', 'lightgreen', 'medkit'];
const colors = ['medkit', 'lightgreen', 'lightgray'];

function randomColor(colors) {
  const index = Math.floor(Math.random()*colors.length)
  return colors[index]
}

const body = document.querySelector('.scene');

const ship = document.querySelector('.space-ship');
const spShipContainer = document.querySelector('.spship-container');
ship.draggable = false; // ship.setAttribute('draggable', false);
spShipContainer.draggable = false;

const asteroid = document.querySelector('.asteroid');

const button = document.querySelector('button');

button.addEventListener('click', (e) => {
  e.stopPropagation();
  if (animationID) {
    animationID = cancelAnimationFrame(animationID);
    e.target.textContent = 'Start';
  } else {
    animationID = requestAnimationFrame(gameCycle);
    e.target.textContent = 'Pause';
  }
});

body.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    // fire();
  }
});

// body.addEventListener('click', (e) => {
//   p.fire();
// });

// let angle = 0;
// const center = {
//   x: (window.innerWidth / 2) - 0,
//   y: (window.innerHeight / 2) - 0
// };
// // center.x = document.documentElement.clientWidth / 2;
// // center.y = document.documentElement.clientHeight / 2;

// body.addEventListener('click', (e) => {
//   spaceShip.angle =  Math.atan2(e.clientX - center.x, e.clientY - center.y) * (180 / Math.PI);

//   ship.style.setProperty(
//     'transform',
//     `translate(${center.x - 50}px, ${center.y - 50}px) rotate(-${
//       spaceShip.angle + 180
//     }deg)`
//   );
//   p.shot = true;
// });

const center = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};
// center.x = document.documentElement.clientWidth / 2;
// center.y = document.documentElement.clientHeight / 2;
let delta = 0.1;
// let prevAngle = 0;
body.addEventListener('click', (e) => {
  spaceShip.angle =
    90 -
    Math.atan2(center.y - e.clientY, e.clientX - center.x) * (180 / Math.PI);
// prevAngle = spaceShip.angle
  ship.style.setProperty(
    'transform',
    // `translate(${center.x - 50}px, ${center.y - 50}px) rotate(${spaceShip.angle}deg)`
    `rotate(${spaceShip.angle + delta}deg)`
  );
  p.shot = true;
  delta = -delta;
});

// window.addEventListener('load', (e) => {
//   ship.style.setProperty(
//     'transform',
//     `translate(${center.x - 50}px, ${center.y - 50}px)`
//   );
// });

////////////////// class GameObject //////////////////

class GameObject {
  div;
  radius;
  collision = false;
  velocity = { x: 0, y: 0 };
  position = { x: 0, y: 0 };

  addTo(container) {
    container.appendChild(this.div);
  }

  detectFrameCollision(position = this.position, velocity = this.velocity, radius = this.radius) {
    if (position.x + radius > window.innerWidth) {
      velocity.x = -Math.abs(velocity.x);
    }
    if (position.x - radius < 0) {
      velocity.x = Math.abs(velocity.x);
    }
    if (position.y + radius > window.innerHeight) {
      velocity.y = -Math.abs(velocity.y);
    }
    if (position.y - radius < 0) {
      velocity.y = Math.abs(velocity.y);
    }
  }
}

/////////////////// class Asteriod ///////////////////

class Asteroid extends GameObject {
  // deadAsteroids;
  animationID;
  medkit = false;
  radius = (Math.random() * maxAsteroidSize) + 10;
  velocity = { x: Math.random() * -4 + 2, y: Math.random() * -4 + 2 };
  // velocity = { x: Math.random() * -0.6 + 0.3, y: Math.random() * -0.6 + 0.3 };

  velocityAfterCollision = { x: 0, y: 0 };
  // position = {
  //   x: Math.random() * (window.innerWidth+400 - this.radius * 2) + this.radius,
  //   y: Math.random() * (window.innerHeight+400 - this.radius * 2) + this.radius,
  // };

  position = (() => {
    const rectA = { x: -200, y: -200, width: window.innerWidth + 400, height: window.innerHeight + 400 };
    const rectB = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };

    return  this.getRandomCoord(rectA, rectB);
  })();

  getRandomCoord(rectA, rectB) {
    const zones = [];
  
    // Define each exclusion zone
    if (rectB.y > rectA.y) {
      zones.push('top');
    }
    if (rectB.y + rectB.height < rectA.y + rectA.height) {
      zones.push('bottom');
    }
    if (rectB.x > rectA.x) {
      zones.push('left');
    }
    if (rectB.x + rectB.width < rectA.x + rectA.width) {
      zones.push('right');
    }
  
    while (true) {
      const zone = zones[Math.floor(Math.random() * zones.length)];
      let x, y;
  
      switch (zone) {
        case 'top':
          x = Math.random() * rectA.width + rectA.x;
          y = Math.random() * (rectB.y - rectA.y) + rectA.y;
          break;
        case 'bottom':
          x = Math.random() * rectA.width + rectA.x;
          y = Math.random() * ((rectA.y + rectA.height) - (rectB.y + rectB.height)) + rectB.y + rectB.height;
          break;
        case 'left':
          x = Math.random() * (rectB.x - rectA.x) + rectA.x;
          y = Math.random() * rectA.height + rectA.y;
          break;
        case 'right':
          x = Math.random() * ((rectA.x + rectA.width) - (rectB.x + rectB.width)) + rectB.x + rectB.width;
          y = Math.random() * rectA.height + rectA.y;
          break;
      }
  
      return { x, y };
    }
  }
  
  // constructor(velocity, position) {
  constructor() {
    super();
    // this.velocity.x = velocity.x;
    // this.velocity.y = velocity.y;
    // this.position.x = position.x;
    // this.position.y = position.y
    this.div = document.createElement('div');
    this.div.classList.add('asteroid');
    const cssClass = randomColor(colors);
    if (cssClass === 'medkit') {
      this.medkit = true
      this.div.style.width = 30 + "px";
      this.div.style.height = 30 + "px";
      this.radius = 15;
    } else {
      this.div.style.width = this.radius * 2 + "px";
      this.div.style.height = this.radius * 2 + "px";
    }

    
    this.div.classList.add(cssClass);
  }

  move() {
    if (this.collision) {
      this.collision = false;
      this.velocity.x = this.velocityAfterCollision.x;
      this.velocity.y = this.velocityAfterCollision.y;
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // console.log(getComputedStyle(this.div).top, getComputedStyle(this.div).left);
    requestAnimationFrame(() => {
      // this.div.style.transform = `translate(
        // ${0}px,
        // ${0}px)`;
      this.div.style.transform = `translate(
          ${this.position.x - this.radius}px,
          ${this.position.y - this.radius}px)`;
      // this.div.style.transform = `translate(
      //   ${this.position.x}px,
      //   ${this.position.y}px)`;
    });
  }
  
  moveDead() {
    // this.position.x += this.velocity.x;
    // this.position.y += this.velocity.y;

    // console.log(getComputedStyle(this.div).top, getComputedStyle(this.div).left);
    // requestAnimationFrame(() => {
    //   this.velocity.x *= 0.98;
    //   this.velocity.y *= 0.98;
    //   this.div.style.transform = `translate(
    //       ${this.position.x - this.radius}px,
    //       ${this.position.y - this.radius}px)`;
    //   this.moveDead();
    // });
  }

  detectCollisionWith(obj = null) {
    let dy = this.position.y - obj.position.y;
    let dx = this.position.x - obj.position.x;

    const dist = Math.hypot(dx, dy);

    if (dist < this.radius + obj.radius + 0) {
      // obj.div.remove();

      let angle = Math.atan2(dy, dx);
      let sin = Math.sin(angle);
      let cos = Math.cos(angle);

      // circle1 perpendicular velocities
      let vx1 = this.velocity.x * cos + this.velocity.y * sin;
      let vy1 = this.velocity.y * cos - this.velocity.x * sin;

      // circle2 perpendicular velocities
      let vx2 = obj.velocity.x * cos + obj.velocity.y * sin;
      let vy2 = obj.velocity.y * cos - obj.velocity.x * sin;

      // swapping the x velocity (y is parallel so doesn't matter)
      // and rotating back the adjusted perpendicular velocities
      this.velocityAfterCollision.x = vx2 * cos - vy1 * sin;
      this.velocityAfterCollision.y = vy1 * cos + vx2 * sin;
      obj.velocityAfterCollision.x = vx1 * cos - vy2 * sin;
      obj.velocityAfterCollision.y = vy2 * cos + vx1 * sin;

      this.collision = true;
      obj.collision = true;
      // if(this.radius > obj.radius) {
      //   obj.div.remove();
      // } else {
      //   this.div.remove();
      // }
    }
  }
}

//////////////////////////////////////////////////////

class Ship extends GameObject {
  timeID;
  angle = 0;
  radius = 50;
  velocity = { x: 0, y: 0 };
  collision = false;
  constructor(position) {
    super();
    // this.position = {x: getComputedStyle(ship).left, y: getComputedStyle(ship).top};
    this.position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    this.div = ship;
    // this.div.classList.add('space-ship');
  }

  detectCollisionWith(obj) {
    let dy = this.position.y - obj.position.y;
    let dx = this.position.x - obj.position.x;

    const dist = Math.hypot(dx, dy);

    if (dist < this.radius + obj.radius + 0) {
      if (obj.medkit) {
        obj.div.classList.add("medkitdead");
        spShipContainer.classList.add("medkithit");
        if (this.timeID) {
          clearTimeout(this.timeID);

          // spShipContainer.classList.remove("medkithit"); // Resets class animation on the run
          // void spShipContainer.offsetWidth;
          // _ = spShipContainer.offsetWidth;
          // spShipContainer.classList.add('medkithit');

          spShipContainer.classList.remove("medkithit"); // Resets class animation as soon as possible
          setTimeout(() => {
            spShipContainer.classList.add("medkithit");
          });
          this.timeID = setTimeout(() => {
            spShipContainer.classList.remove("medkithit");
            this.timeID = 0;
          }, 300);
        } else {
          this.timeID = setTimeout(() => {
            spShipContainer.classList.remove("medkithit");
            this.timeID = 0;
          }, 300);
        }
      } else {
        obj.div.classList.add("deadred");
      }

      obj.move = obj.moveDead;
      deadAsteroids.push(obj);
    }
  }
}

//////////////////////////////////////////////////////

class Projectile extends GameObject {
  shot = false;
  spaceShip;
  angle;
  cos;
  sin;
  rect;
  dots = [];
  dead = false;
  counter = 0;
  externalCoords = { x: 0, y: 0 };

  constructor(spaceShip) {
    super();
    this.spaceShip = spaceShip;
    this.velocity.x = projectileVelocity;
    this.velocity.y = projectileVelocity;
    this.radius = 10;
    this.div = document.createElement('div');
    // let img = this.div.appendChild(document.createElement('img'));
    // img.src = 'img/arrow.svg';
    // img.classList.add('projectile-angle');
    this.div.classList.add('projectile');
    // this.callback = this.imTired.bind(this);
    this.callback = () => {
      if (this.shot) {
        this.spaceShip.div.removeEventListener('transitionend', this.callback);
        this.shot = false;
        this.angle = (this.spaceShip.angle - 90) * (Math.PI / 180); //
        // this.angle = 0;
        this.cos =  Math.cos(this.angle);
        this.sin =  Math.sin(this.angle);
        this.fire();
        p = new Projectile(spaceShip);
        p.addTo(spShipContainer);
      }
    };
    // this.spaceShip.div.addEventListener('transitionend', projectileListener);
    this.spaceShip.div.addEventListener('transitionend', this.callback);
  }

  fire() {
    // const bodyRect = body.getBoundingClientRect();
    // Dependency 001
    this.div.style.transform = `rotate(${(-this.angle * 180) / Math.PI}deg)`;
    // this.div.style.transform = 'rotate(0deg)';

    this.rect = this.div.getBoundingClientRect();
    // this.div.style.transform = `translate(${proj.left - bodyRect.left}px, ${proj.right - bodyRect.top}px)) rotate(${this.spaceShip.angle}deg)`;
    this.position.x = this.rect.x;
    this.position.y = this.rect.y;
    body.appendChild(this.div);
    this.shot = false;
    setTimeout(() => {
      this.dead = true;
      this.div.remove();
      this.detectCollisionWith = ()=>{};
      this.move = ()=>{};
    }, 5000);
    this.move();
  }

  move() {
    // if (this.collision) {
    //   this.collision = false;
    //   // this.velocity.x = this.velocityAfterCollision.x;
    //   // this.velocity.y = this.velocityAfterCollision.y;
    // }

    for (let i = 0; i < asterioids.length; i++) {
      this.detectCollisionWith(asterioids[i]);
    }

    this.position.x += this.velocity.x * this.cos;
    this.position.y += this.velocity.y * this.sin;

    if(this.counter > 4) {
      this.counter = 0;
      const dot = document.createElement('div');
      this.dots.push(dot);
      dot.classList.add('dot');
      dot.style.left = this.position.x+12 + 'px';
      dot.style.top = this.position.y+12 + 'px';
      document.body.appendChild(dot);
      setTimeout(() => {
        dot.classList.add('grow');
      });
      setTimeout(() => {
        if(this.dead) {
          // if(true) {
          // dot.remove();
          this.dots.forEach(dot => {
            dot.remove();
          })
        } else {
          dot.remove();
        }
      }, 200);
    }
    ++this.counter;
    // const dot = document.createElement('div');
    // dot.classList.add('dot');
    // dot.style.left = this.position.x+11.5 + 'px';
    // dot.style.top = this.position.y+11.5 + 'px';
    // document.body.appendChild(dot);
    // setTimeout(() => {
    //   dot.remove();
    // }, 500);
    

    requestAnimationFrame(() => {
      // Dependency 001
      this.div.style.transform = `translate(
          ${this.position.x}px,
          ${this.position.y}px) rotate(${
        (this.angle * 180) / Math.PI + 90
      }deg)`;

      // this.div.style.transform = `translate(
      //   ${this.position.x}px,
      //   ${this.position.y}px)
      //   rotate(0deg)`;
      requestAnimationFrame(() => this.move());
    });
  }

  detectCollisionWith(obj = null) {
    let dy = (this.position.y + this.rect.height/2) - (obj.position.y);
    let dx = (this.position.x + this.rect.width/2) - (obj.position.x);

    const dist = Math.hypot(dx, dy);

    if (dist < (this.radius + obj.radius)) {
      // obj.div.remove();
      // obj.div.style.backgroundColor = 'red';
      obj.div.classList.add('dead');
      this.div.classList.add('dead-proj');
      this.dead = true;
      this.detectCollisionWith = ()=>{};
      this.move = ()=>{};
      // obj.velocity.x = 1;
      // obj.velocity.y = 1;
      obj.move = obj.moveDead
      deadAsteroids.push(obj);
      // console.log('collision');
    }
  }
}

//////////////////////////////////////////////////////
const spaceShip = new Ship(0, 0);
let p = new Projectile(spaceShip);
p.addTo(spShipContainer);


// asterioids.push(new Asteroid({x: 0.5, y: -0.5}, {x: 300, y: 300}));
// asterioids.push(new Asteroid({x: -0.45, y: -0.45}, {x: 400, y: 320}));
// asterioids.push(new Asteroid({x: 0.3, y: -0.25}, {x: 200, y: 400}));
for (let n = 0; n < asteroidCount; n++) {
  asterioids.push(new Asteroid());
}

asterioids.forEach((asteroid) => {
  asteroid.addTo(body);
});

function gameCycle() {
  if(asterioids.length < asteroidCount) { // Add a new asteroid when the number of asteroids is below the set limit
    const asteroid = new Asteroid();
    asterioids.push(asteroid);
    asteroid.addTo(body);
  }
  for (let asteroid of asterioids) {
    asteroid.move();
    asteroid.detectFrameCollision();
  }
  for (let i = 0; i < asterioids.length - 1; i++) {
    for (let j = i + 1; j < asterioids.length; j++) {
      asterioids[i].detectCollisionWith(asterioids[j]);
    }
  }
  for (let i = 0; i < asterioids.length; i++) {
    spaceShip.detectCollisionWith(asterioids[i]);
  }
  for (let asteroid of deadAsteroids) { // Removing asteroids marked as dead from asteroids array
    asterioids.splice(asterioids.indexOf(asteroid), 1, asterioids[asterioids.length - 1]);
    asterioids.pop();
    setTimeout(() => { // It's for animaion of dying asteroid before it's complitely removed
      asteroid.div.remove();
    }, 5000); // 0ms no css animation
  }
  deadAsteroids.length = 0; // just cleaning the deadAsteroids array at a time
  animationID = requestAnimationFrame(gameCycle);
}

animationID = requestAnimationFrame(gameCycle);
