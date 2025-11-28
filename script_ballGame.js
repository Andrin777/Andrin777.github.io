let ball;
let holes = [];
let currentVolume = 0;
let lastHitIndex = -1;
let isDragging = false;
let dragStart;
let showSuccess = false;
let successTimer = 0;
let particles = [];
let resetTimer = 0;
let stars = [];

const GRAVITY = 0.7;
const FRICTION = 0.99; 
const BOUNCE = 0.6;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  
  ball = {
    x: width / 2,
    y: height - 60,
    vx: 0,
    vy: 0,
    radius: 18,
    baseY: height - 60
  };
  
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      twinkle: random(TWO_PI)
    });
  }
  
  createHoles();
}

function createHoles() {
  holes = [];
  
  let volumeLevels = [0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100];
  
  let topMargin = 100;
  let bottomMargin = 120;
  let availableHeight = height - topMargin - bottomMargin;
  
  for (let i = 0; i < volumeLevels.length; i++) {
    let normalizedPos = volumeLevels[i] / 100;
    let baseY = height - bottomMargin - (normalizedPos * availableHeight);
    
    let holeRadius = map(volumeLevels[i], 0, 100, 32, 20);
    
    let attempts = 0;
    let maxAttempts = 100;
    let validPosition = false;
    let xPos, yPos;
    
    while (!validPosition && attempts < maxAttempts) {
      let xOffset = random(-width * 0.35, width * 0.35);
      xPos = constrain(width / 2 + xOffset, 50, width - 50);
      yPos = baseY + random(-30, 30);
      
      validPosition = true;
      for (let existingHole of holes) {
        let d = dist(xPos, yPos, existingHole.x, existingHole.y);
        let minDist = holeRadius + existingHole.radius + 15;
        if (d < minDist) {
          validPosition = false;
          break;
        }
      }
      attempts++;
    }
    
    let hue = map(volumeLevels[i], 0, 100, 180, 320);
    
    holes.push({
      x: xPos,
      y: yPos,
      radius: holeRadius,
      volume: volumeLevels[i],
      hue: hue,
      pulsePhase: random(TWO_PI)
    });
  }
}

function resetBall() {
  ball.x = width / 2;
  ball.y = ball.baseY;
  ball.vx = 0;
  ball.vy = 0;
}

function drawBackground() {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(260, 80, 15), color(220, 90, 8), inter);
    stroke(c);
    line(0, y, width, y);
  }
  
  noStroke();
  for (let star of stars) {
    let twinkle = sin(frameCount * 0.05 + star.twinkle) * 0.5 + 0.5;
    fill(random(60), 20, 100, twinkle * 80);
    ellipse(star.x, star.y, star.size * twinkle + 0.5);
  }
}

function draw() {
  drawBackground();
  
  fill(0, 0, 100);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(25);
  textStyle(BOLD);
  text("Mühsamer Lautstärkeregler", width / 2, 8);
  textStyle(NORMAL);
  textSize(16);
  fill(0, 0, 60);
  text("Ziehe den Ball nach unten und lass los!", width / 2, 40);
  
  if (resetTimer > 0) {
    resetTimer--;
    if (resetTimer === 0) {
      resetBall();
    }
  }
  
  for (let i = 0; i < holes.length; i++) {
    drawHole(holes[i], i);
  }
  
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
  
  if (!isDragging && resetTimer === 0) {
    ball.vy += GRAVITY;
    ball.vx *= FRICTION;
    ball.vy *= FRICTION;
    
    ball.x += ball.vx;
    ball.y += ball.vy;
    
    if (ball.x < ball.radius) {
      ball.x = ball.radius;
      ball.vx *= -BOUNCE;
    }
    if (ball.x > width - ball.radius) {
      ball.x = width - ball.radius;
      ball.vx *= -BOUNCE;
    }
    
    if (ball.y > ball.baseY) {
      ball.y = ball.baseY;
      ball.vy *= -BOUNCE;
      if (abs(ball.vy) < 1) {
        ball.vy = 0;
        // Ball bleibt wo er ist, geht nicht mehr zur Mitte
      }
    }
    
    if (ball.y < ball.radius + 50) {
      ball.y = ball.radius + 50;
      ball.vy *= -BOUNCE;
    }
    
    for (let i = 0; i < holes.length; i++) {
      let hole = holes[i];
      let d = dist(ball.x, ball.y, hole.x, hole.y);
      if (d < hole.radius && abs(ball.vy) > 1.5) {
        currentVolume = hole.volume;
        lastHitIndex = i;
        showSuccess = true;
        successTimer = 90;
        
        for (let j = 0; j < 25; j++) {
          particles.push(new Particle(hole.x, hole.y, hole.hue));
        }
        
        ball.vx = 0;
        ball.vy = 0;
        resetTimer = 60;
        
        break;
      }
    }
  }
  
  if (isDragging) {
    stroke(0, 80, 100);
    strokeWeight(2);
    drawingContext.setLineDash([5, 5]);
    line(ball.x, ball.y, dragStart.x, dragStart.y);
    drawingContext.setLineDash([]);
    
    let angle = atan2(dragStart.y - ball.y, dragStart.x - ball.x);
    let power = min(dist(ball.x, ball.y, dragStart.x, dragStart.y), 150);
    
    push();
    translate(ball.x, ball.y);
    rotate(angle + PI);
    stroke(0, 80, 100, 60);
    strokeWeight(power / 10);
    line(0, 0, power / 2, 0);
    pop();
  }
  
  drawBall();
  drawUI();
  
  if (showSuccess) {
    successTimer--;
    if (successTimer <= 0) {
      showSuccess = false;
    }
  }
}

function drawHole(hole, index) {
  let isLastHit = (index === lastHitIndex);
  
  let pulse = isLastHit ? sin(frameCount * 0.08) * 4 : 0;
  let displayRadius = hole.radius + pulse;
  
  if (isLastHit) {
    noStroke();
    for (let i = 6; i > 0; i--) {
      fill(hole.hue, 70, 80, 8);
      ellipse(hole.x, hole.y, displayRadius * 2 + i * 8);
    }
  }
  
  noStroke();
  
  fill(hole.hue, 60, 25);
  ellipse(hole.x, hole.y, displayRadius * 2 + 8);
  
  fill(hole.hue, 80, isLastHit ? 40 : 20);
  ellipse(hole.x, hole.y, displayRadius * 2);
  
  stroke(hole.hue, isLastHit ? 50 : 70, isLastHit ? 100 : 60);
  strokeWeight(isLastHit ? 3 : 2);
  noFill();
  ellipse(hole.x, hole.y, displayRadius * 2);
  
  if (isLastHit) {
    stroke(hole.hue, 30, 100, 50);
    strokeWeight(1);
    ellipse(hole.x, hole.y, displayRadius * 1.4);
  }
  
  noStroke();
  fill(0, 0, isLastHit ? 100 : 80);
  textAlign(CENTER, CENTER);
  textSize(hole.radius > 25 ? 12 : 10);
  textStyle(BOLD);
  text(hole.volume + '%', hole.x, hole.y);
}

function drawBall() {
  noStroke();
  
  // Schatten
  fill(0, 0, 0, 30);
  ellipse(ball.x + 4, ball.y + 4, ball.radius * 2);
  
  // Ball bleibt immer rot
  fill(0, 80, 90);
  ellipse(ball.x, ball.y, ball.radius * 2);
}

function drawUI() {
  fill(0, 0, 100);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text('Vol:', 15, 50);
  
  fill(260, 50, 20);
  rect(50, 50, 100, 14, 6);
  
  if (currentVolume > 0) {
    let volHue = map(currentVolume, 0, 100, 180, 320);
    fill(volHue, 80, 90);
    rect(50, 50, currentVolume, 14, 6);
  }
  
  fill(0, 0, 100);
  textSize(12);
  textAlign(LEFT, TOP);
  text(currentVolume + '%', 158, 51);
  
  if (showSuccess && lastHitIndex >= 0) {
    let alpha = map(successTimer, 0, 90, 0, 100);
    let hitHue = holes[lastHitIndex].hue;
    
    fill(0, 0, 0, alpha * 0.5);
    rectMode(CENTER);
    rect(width / 2, height / 2 - 40, 160, 50, 10);
    rectMode(CORNER);
    
    fill(hitHue, 70, 100, alpha);
    textAlign(CENTER, CENTER);
    textSize(22);
    textStyle(BOLD);
    text(currentVolume + '%', width / 2, height / 2 - 45);
    
    textSize(12);
    fill(0, 0, 80, alpha);
    text('Getroffen!', width / 2, height / 2 - 25);
  }
}

function mousePressed() {
  if (resetTimer > 0) return;
  
  let d = dist(mouseX, mouseY, ball.x, ball.y);
  if (d < ball.radius * 2) {
    isDragging = true;
    dragStart = createVector(mouseX, mouseY);
  }
}

function mouseDragged() {
  if (isDragging) {
    dragStart = createVector(mouseX, mouseY);
  }
}

function mouseReleased() {
  if (isDragging) {
    let force = p5.Vector.sub(createVector(ball.x, ball.y), dragStart);
    force.mult(0.4);
    force.limit(50);
    
    ball.vx = force.x;
    ball.vy = force.y;
    
    isDragging = false;
  }
}

function touchStarted() {
  mousePressed();
  return false;
}

function touchMoved() {
  mouseDragged();
  return false;
}

function touchEnded() {
  mouseReleased();
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  ball.baseY = height - 60;
  ball.y = ball.baseY;
  
  stars = [];
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      twinkle: random(TWO_PI)
    });
  }
  
  createHoles();
  lastHitIndex = -1;
}

class Particle {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.vx = random(-5, 5);
    this.vy = random(-6, 2);
    this.life = 100;
    this.size = random(4, 14);
    this.hue = hue + random(-20, 20);
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.15;
    this.life -= 3;
  }
  
  draw() {
    noStroke();
    fill(this.hue, 80, 90, this.life);
    ellipse(this.x, this.y, this.size);
  }
  
  isDead() {
    return this.life <= 0;
  }
}