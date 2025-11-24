let font;
function preload() {
  font = loadFont("Standie.otf");
}

let points1, points2;
let bounds1, bounds2;

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
}

function draw() {
  background(0);

let camZ = map(sin(frameCount * 0.01), -1, 1, 700, 1500);
camera(0, 0, camZ, 0, 0, 0, 0, 1, 0);


	
  lights();
  ambientLight(100);
  directionalLight(255, 255, 255, 0.5, 0.5, -1);
  
  noStroke();
  
  rotateY(map(mouseX, 0, width, -PI, PI));
  rotateX(map(mouseY, 0, height, -PI, PI));
  
  let scaleFactor = 0.22;
  let horizontalStretch = 3;
  let lineSpacing = 300; 
  
  // Erstes Wort
  let scaleW1 = (width / bounds1.w) * scaleFactor * horizontalStretch;
  let scaleH1 = (height / bounds1.h) * scaleFactor;
  let fontX1 = -(bounds1.w * scaleW1) / 2 - bounds1.x * scaleW1;
  let fontY1 = -(bounds1.h * scaleH1) / 2 - bounds1.y * scaleH1 - lineSpacing/2;
  
  push();
  translate(fontX1, fontY1, 0);
  for (let i = 0; i < points1.length; i++) {
    let p = points1[i];
    let X = p.x * scaleW1;
    let Y = p.y * scaleH1;
    let Z = random(-20, 20);
    
    push();
    translate(X, Y, Z);
    fill(random(255), random(255), random(255));
    box(3);
    pop();
  }
  pop();
  
  // Zweites Wort
  let scaleW2 = (width / bounds2.w) * scaleFactor * horizontalStretch;
  let scaleH2 = (height / bounds2.h) * scaleFactor;
  let fontX2 = -(bounds2.w * scaleW2) / 2 - bounds2.x * scaleW2;
  let fontY2 = -(bounds2.h * scaleH2) / 2 - bounds2.y * scaleH2 + lineSpacing/2;
  
  push();
  translate(fontX2, fontY2, 0);
  for (let i = 0; i < points2.length; i++) {
    let p = points2[i];
    let X = p.x * scaleW2;
    let Y = p.y * scaleH2;
    let Z = random(-20, 20);
    
    push();
    translate(X, Y, Z);
    fill(random(255), random(255), random(255));
    sphere(2);
    pop();
  }
  pop();
}