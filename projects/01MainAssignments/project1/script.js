let font;
function preload() {
  font = loadFont("Standie.otf");
}

let points1, points2;
let bounds1, bounds2;
let particles1 = [];
let particles2 = [];
let isExploded = false;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Erstes Wort
  points1 = font.textToPoints("Andrin", 0, 0, 5, {
    sampleFactor: 6,
    simplifyThreshold: 0,
  });
  bounds1 = font.textBounds("Andrin", 0, 0, 5);
  
  // Zweites Wort
  points2 = font.textToPoints("Nyffeler", 0, 0, 5, {
    sampleFactor: 6,
    simplifyThreshold: 0,
  });
  bounds2 = font.textBounds("Nyffeler", 0, 0, 5);
  
  // Initialisiere Partikel für beide Wörter
  initParticles();
}

function initParticles() {
  particles1 = [];
  particles2 = [];
  
  let scaleFactor = 0.22;
  let horizontalStretch = 3;
  
  // Partikel für Andrin
  let scaleW1 = (width / bounds1.w) * scaleFactor * horizontalStretch;
  let scaleH1 = (height / bounds1.h) * scaleFactor;
  
  for (let i = 0; i < points1.length; i++) {
    let p = points1[i];
    let homeX = p.x * scaleW1;
    let homeY = p.y * scaleH1;
    
    particles1.push({
      homeX: homeX,
      homeY: homeY,
      x: homeX,
      y: homeY,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      color: [random(255), random(255), random(255)]
    });
  }
  
  // Partikel für Nyffeler
  let scaleW2 = (width / bounds2.w) * scaleFactor * horizontalStretch;
  let scaleH2 = (height / bounds2.h) * scaleFactor;
  
  for (let i = 0; i < points2.length; i++) {
    let p = points2[i];
    let homeX = p.x * scaleW2;
    let homeY = p.y * scaleH2;
    
    particles2.push({
      homeX: homeX,
      homeY: homeY,
      x: homeX,
      y: homeY,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      color: [random(255), random(255), random(255)]
    });
  }
}

function mousePressed() {
  isExploded = !isExploded;
  
  if (isExploded) {
    // Explosion - gib jedem Partikel eine zufällige Geschwindigkeit
    for (let particle of particles1) {
      particle.vx = random(-15, 15);
      particle.vy = random(-15, 15);
      particle.vz = random(-15, 15);
    }
    for (let particle of particles2) {
      particle.vx = random(-15, 15);
      particle.vy = random(-15, 15);
      particle.vz = random(-15, 15);
    }
  }
}

function updateParticles() {
  // Update Andrin Partikel
  for (let particle of particles1) {
    if (isExploded) {
      // Fliege davon
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.z += particle.vz;
    } else {
      // Kehre zur Heimposition zurück
      let dx = particle.homeX - particle.x;
      let dy = particle.homeY - particle.y;
      let dz = 0 - particle.z;
      
      particle.vx = dx * 0.1;
      particle.vy = dy * 0.1;
      particle.vz = dz * 0.1;
      
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.z += particle.vz;
    }
  }
  
  // Update Nyffeler Partikel
  for (let particle of particles2) {
    if (isExploded) {
      // Fliege davon
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.z += particle.vz;
    } else {
      // Kehre zur Heimposition zurück
      let dx = particle.homeX - particle.x;
      let dy = particle.homeY - particle.y;
      let dz = 0 - particle.z;
      
      particle.vx = dx * 0.1;
      particle.vy = dy * 0.1;
      particle.vz = dz * 0.1;
      
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.z += particle.vz;
    }
  }
}

function draw() {
  background(0);

  let camZ = map(sin(frameCount * 0.01), -1, 1, 700, 1800);
  camera(0, 0, camZ, 0, 0, 0, 0, 1, 0);

  lights();
  ambientLight(100);
  directionalLight(255, 255, 255, 0.5, 0.5, -1);
  
  noStroke();
  
  rotateY(map(mouseX, 0, width, -PI, PI));
  rotateX(map(mouseY, 0, height, -PI, PI));
  
  updateParticles();
  
  let scaleFactor = 0.22;
  let horizontalStretch = 3;
  let lineSpacing = 400;
  
  // Zeichne Andrin Partikel
  let scaleW1 = (width / bounds1.w) * scaleFactor * horizontalStretch;
  let scaleH1 = (height / bounds1.h) * scaleFactor;
  let fontX1 = -(bounds1.w * scaleW1) / 2 - bounds1.x * scaleW1;
  let fontY1 = -(bounds1.h * scaleH1) / 2 - bounds1.y * scaleH1 - lineSpacing/2;
  
  push();
  translate(fontX1, fontY1, 0);
  for (let particle of particles1) {
    let Z = isExploded ? particle.z : random(-20, 20);
    push();
    translate(particle.x, particle.y, Z);
    fill(particle.color[0], particle.color[1], particle.color[2]);
    box(3);
    pop();
  }
  pop();
  
  // Zeichne Nyffeler Partikel
  let scaleW2 = (width / bounds2.w) * scaleFactor * horizontalStretch;
  let scaleH2 = (height / bounds2.h) * scaleFactor;
  let fontX2 = -(bounds2.w * scaleW2) / 2 - bounds2.x * scaleW2;
  let fontY2 = -(bounds2.h * scaleH2) / 2 - bounds2.y * scaleH2 + lineSpacing/2;
  
  push();
  translate(fontX2, fontY2, 0);
  for (let particle of particles2) {
    let Z = isExploded ? particle.z : random(-20, 20);
    push();
    translate(particle.x, particle.y, Z);
    fill(particle.color[0], particle.color[1], particle.color[2]);
    sphere(2);
    pop();
  }
  pop();
}