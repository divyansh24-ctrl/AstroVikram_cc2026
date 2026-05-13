// ==========================================
// CHANDRAYAAN-3 COMPLETE MISSION
// FULL FIXED CODE WITH
// VELOCITY + SPEED DISPLAY
// ==========================================

let phase = 0;

// ==========================================
// PHASE 1 VARIABLES
// ==========================================

let launched = false;
let rocketY = 0;
let smoke = [];
let missionStage = 0;
let debrisParts = [];

// SPEED + VELOCITY
let prevRocketY = 0;
let velocity = 0;
let speedValue = 0;

// ==========================================
// PHASE 2 VARIABLES
// ==========================================

let stars = [];
let trail = [];
const trailMax = 60;

let orbitStartTime;
const totalDuration = 14000;

const earthX = 280;
const earthY = 500;

const moonX = 700;
const moonY = 200;

const ANGLE_OFFSET = 360;

let prevOrbitX = 0;
let prevOrbitY = 0;

let orbitVelocityX = 0;
let orbitVelocityY = 0;
let orbitSpeed = 0;

// ==========================================
// PHASE 3 VARIABLES
// ==========================================

let rocketX = 80;
let rocketLandY = 50;
let landed = false;

let landerVelocityX = 0;
let landerVelocityY = 0;
let landerSpeed = 0;

// ==========================================

function setup() {

  createCanvas(900, 800);

  angleMode(DEGREES);

  rectMode(CORNER);

  for (let i = 0; i < 200; i++) {

    stars.push({
      x: random(width),
      y: random(height),
      r: random(0.3, 1.8),
      offset: random(360)
    });
  }
}

// ==========================================

function draw() {

  if (phase == 0) {

    drawLaunchScene();
  }

  else if (phase == 1) {

    drawOrbitMission();
  }

  else if (phase == 2) {

    drawLandingScene();
  }
}

// ==========================================
// LAUNCH SCENE
// ==========================================

function drawLaunchScene() {

  // SKY
  for (let y = 0; y < height; y++) {

    let inter = map(y, 0, height, 0, 1);

    let c = lerpColor(
      color(60, 80, 120),
      color(130, 150, 190),
      inter
    );

    stroke(c);

    line(0, y, width, y);
  }

  noStroke();

  let cameraOffset = 0;

  if (launched && rocketY < -120) {

    cameraOffset = rocketY + 120;
  }

  push();

  translate(0, -cameraOffset);

  // GROUND
  fill(55);
  rect(0, 700, width, 100);

  // PLATFORM
  fill(100);
  rect(220, 500, 460, 25);

  // TOWERS
  drawTower(170);
  drawTower(670);

  fill(120);

  rect(230, 300, 440, 15);
  rect(230, 430, 440, 15);

  // SMOKE
  for (let i = smoke.length - 1; i >= 0; i--) {

    smoke[i].update();
    smoke[i].show();

    if (smoke[i].alpha <= 0) {

      smoke.splice(i, 1);
    }
  }

  // ROCKET MOVEMENT
  if (launched) {

    rocketY -= 2.8;

    // VELOCITY + SPEED
    velocity = rocketY - prevRocketY;

    speedValue = abs(velocity);

    prevRocketY = rocketY;

    if (missionStage == 0) {

      for (let i = 0; i < 15; i++) {

        smoke.push(
          new Smoke(
            width / 2 + random(-80, 80),
            610 + rocketY
          )
        );
      }
    }
  }

  // FIRE
  if (launched && missionStage == 0) {

    drawFire();
  }

  // ROCKET
  drawRocket(width / 2, 420 + rocketY);

  // DEBRIS
  updateDebris();

  pop();

  // SPEED DISPLAY
  fill(255);

  textSize(20);

  textAlign(LEFT);

  text(
    "Velocity : " + nf(velocity,1,2),
    20,
    40
  );

  text(
    "Speed : " + nf(speedValue,1,2),
    20,
    70
  );

  // BUTTON
  if (!launched) {

    drawButton();
  }

  // NEXT PHASE
  if (missionStage == 3 && rocketY < -1800) {

    phase = 1;

    orbitStartTime = millis();
  }
}

// ==========================================
// FIRE
// ==========================================

function drawFire() {

  noStroke();

  fill(255, 120, 0);

  rect(400, 570 + rocketY, 80, 140, 30);

  ellipse(450, 710 + rocketY, 50, 70);
  ellipse(450, 730 + rocketY, 90, 130);
  ellipse(470, 710 + rocketY, 50, 70);

  fill(255, 220, 0);

  rect(420, 590 + rocketY, 40, 110, 20);

  ellipse(440, 710 + rocketY, 55, 90);
}

// ==========================================
// ROCKET
// ==========================================

function drawRocket(x, y) {

  push();

  translate(x, y);

  noStroke();

  // BOOSTERS
  if (missionStage < 1) {

    fill(230);

    rect(-70, -20, 40, 170, 20);
    rect(30, -20, 40, 170, 20);

    rect(-75, 140, 50, 15, 10);
    rect(25, 140, 50, 15, 10);

    fill(0);

    textAlign(CENTER);

    textSize(16);

    text("ISRO", -50, 70);
    text("ISRO", 50, 70);
  }

  // BODY
  if (missionStage < 2) {

    fill(245);

    rect(-35, -120, 70, 270, 25);

    fill(70, 180, 255);

    ellipse(0, -50, 24);

    fill(255, 140, 0);
    rect(-15, -85, 30, 5);

    fill(255);
    rect(-15, -80, 30, 5);

    fill(0, 180, 0);
    rect(-15, -75, 30, 5);

    fill(0);

    push();

    rotate(90);

    textSize(14);

    text("CHANDRAYAAN-3", 20, 5);

    pop();
  }

  // NOSE
  if (missionStage < 3) {

    fill(220);

    arc(0, -120, 70, 90, 180, 360);
  }

  // SATELLITE
  if (missionStage >= 3) {

    fill(180);

    rect(-20, -140, 40, 40, 8);

    fill(120);

    rect(-70, -130, 40, 10);
    rect(30, -130, 40, 10);

    fill(255, 220, 0);

    circle(0, -120, 10);
  }

  pop();
}

// ==========================================
// DEBRIS
// ==========================================

function updateDebris() {

  for (let d of debrisParts) {

    d.update();
    d.show();
  }
}

// ==========================================

class Debris {

  constructor(x, y, type) {

    this.x = x;
    this.y = y;

    this.type = type;

    this.vx = random(-4, 4);
    this.vy = random(2, 7);

    this.alpha = 255;
  }

  update() {

    this.x += this.vx;
    this.y += this.vy;

    this.alpha -= 2;
  }

  show() {

    push();

    translate(this.x, this.y);

    noStroke();

    fill(230, this.alpha);

    if (this.type == "booster") {

      rect(0, 0, 40, 170, 20);
    }

    if (this.type == "body") {

      rect(0, 0, 70, 220, 20);
    }

    if (this.type == "nose") {

      arc(0, 0, 70, 90, 180, 360);
    }

    pop();
  }
}

// ==========================================
// ORBIT MISSION
// ==========================================

function drawOrbitMission() {

  background(0);

  drawStars();
  drawOrbits();
  drawEarth();
  drawMoon();

  let elapsed =
    (millis() - orbitStartTime);

  if (elapsed < totalDuration) {

    let pos = getSatPos(elapsed);

    // VELOCITY
    orbitVelocityX = pos.x - prevOrbitX;

    orbitVelocityY = pos.y - prevOrbitY;

    orbitSpeed = sqrt(
      orbitVelocityX * orbitVelocityX +
      orbitVelocityY * orbitVelocityY
    );

    prevOrbitX = pos.x;
    prevOrbitY = pos.y;

    trail.push({
      x: pos.x,
      y: pos.y
    });

    if (trail.length > trailMax) {

      trail.splice(0, 1);
    }

    drawTrail();

    drawSatellite(pos);

    drawLabel(elapsed);

    // DISPLAY
    fill(255);

    textSize(18);

    textAlign(LEFT);

    text(
      "Velocity X : " +
      nf(orbitVelocityX,1,2),
      20,
      70
    );

    text(
      "Velocity Y : " +
      nf(orbitVelocityY,1,2),
      20,
      100
    );

    text(
      "Speed : " +
      nf(orbitSpeed,1,2),
      20,
      130
    );
  }

  else {

    phase = 2;
  }
}

// ==========================================
// STARS
// ==========================================

function drawStars() {

  noStroke();

  for (let s of stars) {

    let twinkle =
      0.4 +
      0.6 *
      (0.5 +
      0.5 *
      sin(frameCount * 1.5 + s.offset));

    fill(255, twinkle * 255);

    ellipse(s.x, s.y, s.r * 2);
  }
}

// ==========================================

function drawOrbits() {

  push();

  translate(earthX, earthY);

  noFill();

  stroke(150, 150, 150, 100);

  drawingContext.setLineDash([4, 4]);

  ellipse(0, 0, 440, 340);

  drawingContext.setLineDash([]);

  pop();

  push();

  translate(moonX, moonY);

  noFill();

  stroke(150, 150, 150, 100);

  drawingContext.setLineDash([4, 4]);

  ellipse(0, 0, 260, 180);

  drawingContext.setLineDash([]);

  pop();
}

// ==========================================

function drawEarth() {

  noStroke();

  fill(0, 204, 204);

  circle(earthX, earthY, 150);

  fill(255, 255, 255, 40);

  ellipse(earthX - 18, earthY - 18, 55, 40);
}

// ==========================================

function drawMoon() {

  noStroke();

  fill(220);

  circle(moonX, moonY, 100);
}

// ==========================================

function getSatPos(elapsed) {

  let p = constrain(
    elapsed / totalDuration,
    0,
    1
  );

  if (p < 0.5) {

    let angle = ANGLE_OFFSET - p * 720;

    return {
      x:
        earthX +
        220 * cos(angle),

      y:
        earthY +
        170 * sin(angle)
    };
  }

  else {

    let angle = 180 + (p - 0.5) * 720;

    return {
      x:
        moonX +
        130 * cos(angle),

      y:
        moonY +
        90 * sin(angle)
    };
  }
}

// ==========================================

function drawTrail() {

  noFill();

  for (let i = 1; i < trail.length; i++) {

    let alpha =
      map(i, 0, trail.length, 0, 130);

    stroke(255, 220, 80, alpha);

    line(
      trail[i - 1].x,
      trail[i - 1].y,
      trail[i].x,
      trail[i].y
    );
  }
}

// ==========================================

function drawSatellite(pos) {

  push();

  translate(pos.x, pos.y);

  rectMode(CENTER);

  fill(180);

  rect(0, 0, 12, 8);

  fill(55, 138, 221);

  rect(-12, 0, 10, 5);
  rect(12, 0, 10, 5);

  pop();

  rectMode(CORNER);
}

// ==========================================

function drawLabel(elapsed) {

  fill(255);

  textSize(16);

  textAlign(LEFT);

  if (elapsed < totalDuration * 0.5) {

    text(
      "EARTH ORBIT",
      20,
      35
    );
  }

  else {

    text(
      "MOON ORBIT",
      20,
      35
    );
  }
}

// ==========================================
// LANDING
// ==========================================

function drawLandingScene() {

  background(20);

  // SURFACE
  fill(160);

  rect(0, 650, 900, 200);

  // CRATERS
  fill(210);

  ellipse(200, 710, 100, 50);
  ellipse(390, 730, 100, 50);
  ellipse(590, 700, 100, 50);
  ellipse(800, 710, 100, 50);

  // STARS
  fill(255);

  for (let s of stars) {

    ellipse(s.x, s.y, 2);
  }

  let landingY = 470;

  if (!landed) {

    if (rocketLandY < landingY) {

      rocketX += 2.2;

      rocketLandY += 1.8;

      landerVelocityX = 2.2;

      landerVelocityY = 1.8;

      landerSpeed = sqrt(
        landerVelocityX * landerVelocityX +
        landerVelocityY * landerVelocityY
      );
    }

    else {

      landed = true;
    }
  }

  let angle = 7;

  if (rocketLandY > 350) {

    angle =
      map(
        rocketLandY,
        350,
        landingY,
        7,
        1
      );
  }

  drawLander(
    rocketX,
    rocketLandY,
    angle
  );

  // DISPLAY
  fill(255);

  textSize(18);

  textAlign(LEFT);

  text(
    "Velocity X : " +
    nf(landerVelocityX,1,2),
    20,
    40
  );

  text(
    "Velocity Y : " +
    nf(landerVelocityY,1,2),
    20,
    70
  );

  text(
    "Speed : " +
    nf(landerSpeed,1,2),
    20,
    100
  );

  textSize(22);

  textAlign(CENTER);

  if (landed) {

    text(
      "CHANDRAYAAN-3 SUCCESSFULLY LANDED ON MOON",
      width / 2,
      80
    );
  }
}

// ==========================================
// LANDER
// ==========================================

function drawLander(x, y, angle) {

  push();

  translate(x, y);

  rotate(angle);

  noStroke();

  fill(188, 193, 26);

  rect(0, 0, 150, 110, 10);

  fill(220);

  rect(30, -35, 90, 35, 8);

  fill(100, 200, 255);

  ellipse(75, 45, 35);

  fill(120);

  rect(-60, 20, 60, 20);
  rect(150, 20, 60, 20);

  drawLeg(25, 110, 30);
  drawLeg(55, 110, 10);
  drawLeg(95, 110, -10);
  drawLeg(125, 110, -30);

  pop();
}

// ==========================================

function drawLeg(x, y, angleValue) {

  push();

  translate(x, y);

  rotate(angleValue);

  fill(180);

  rect(0, 0, 10, 70, 5);

  pop();
}

// ==========================================
// TOWER
// ==========================================

function drawTower(x) {

  fill(90);

  rect(x, 120, 60, 580);

  stroke(160);

  for (let i = 0; i < 580; i += 25) {

    line(x, 120 + i, x + 60, 145 + i);

    line(x + 60, 120 + i, x, 145 + i);
  }

  noStroke();
}

// ==========================================
// BUTTON
// ==========================================

function drawButton() {

  fill(220, 40, 40);

  rect(350, 730, 200, 50, 15);

  fill(255);

  textSize(28);

  textAlign(CENTER, CENTER);

  text("LAUNCH", 450, 755);
}

// ==========================================
// MOUSE CLICK
// ==========================================

function mousePressed() {

  // LAUNCH
  if (
    !launched &&
    mouseX > 350 &&
    mouseX < 550 &&
    mouseY > 730 &&
    mouseY < 780
  ) {

    launched = true;
  }

  // BOOSTERS
  else if (missionStage == 0) {

    missionStage = 1;

    debrisParts.push(
      new Debris(
        width / 2 - 80,
        420 + rocketY,
        "booster"
      )
    );

    debrisParts.push(
      new Debris(
        width / 2 + 50,
        420 + rocketY,
        "booster"
      )
    );
  }

  // BODY
  else if (missionStage == 1) {

    missionStage = 2;

    debrisParts.push(
      new Debris(
        width / 2,
        420 + rocketY,
        "body"
      )
    );
  }

  // NOSE
  else if (missionStage == 2) {

    missionStage = 3;

    debrisParts.push(
      new Debris(
        width / 2,
        280 + rocketY,
        "nose"
      )
    );
  }
}

// ==========================================
// SMOKE
// ==========================================

class Smoke {

  constructor(x, y) {

    this.x = x;
    this.y = y;

    this.size = random(50, 140);

    this.alpha = 200;

    this.speedX = random(-4, 4);
    this.speedY = random(2, 6);
  }

  update() {

    this.x += this.speedX;

    this.y += this.speedY;

    this.size += 0.6;

    this.alpha -= 2;
  }

  show() {

    noStroke();

    fill(210, this.alpha);

    ellipse(
      this.x,
      this.y,
      this.size
    );
  }
}