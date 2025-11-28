let angle = 0;
let spinning = false;
let spinSpeed = 0;
let volume = 50;
let segments = 101;       // 0–100 -> 101 Segmente
let targetVolume = 50;
let inputField;
let segmentNumbers = [];
let bgImg;
let bgOffsetX = 0;        // Position der Nyan Cat

// Offscreen-Grafik fuer das Rad
let wheelG;
let wheelDiameter;
let wheelRadius;
let numberRadius;

function preload() {
  // passe den Dateinamen an deinen Sketch-Ordner an
  bgImg = loadImage("z_nyan-cat.gif");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  // Zahlen 0-100 in Array
  for (let i = 0; i <= 100; i++) {
    segmentNumbers.push(i);
  }
  shuffleArray(segmentNumbers);
  
  // Input Feld erstellen
  inputField = createInput(targetVolume.toString());
  inputField.size(80);
  inputField.style('font-size', '18px');
  inputField.style('text-align', 'center');
  positionInputField();
  
  // Rad-Grafik einmal aufbauen
  rebuildWheelGraphics();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  positionInputField();
  rebuildWheelGraphics(); // Rad an neue Fenstergroesse anpassen
}

function positionInputField() {
  inputField.position(width/2 - 40, 80);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = floor(random(i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

// Zeichnet das komplette Rad (Segmente + Zahlen + Zentrum) in wheelG
function rebuildWheelGraphics() {
  wheelDiameter = min(width, height) * 0.7;
  wheelRadius = wheelDiameter / 2;
  numberRadius = wheelRadius - 20;

  wheelG = createGraphics(wheelDiameter, wheelDiameter);
  wheelG.angleMode(DEGREES);
  wheelG.colorMode(HSB, 360, 100, 100);
  wheelG.textAlign(CENTER, CENTER);
  wheelG.textFont('sans-serif'); // optional
  
  wheelG.background(0, 0, 100, 0); // transparent
  
  wheelG.push();
  wheelG.translate(wheelRadius, wheelRadius);
  
  let segmentAngle = 360 / segments;
  
  for (let i = 0; i < segments; i++) {
    // Farbverlauf um das Rad
    let hue = map(i, 0, segments, 0, 360);
    wheelG.fill(hue, 80, 100);
    wheelG.stroke(0);
    wheelG.strokeWeight(0.5);
    
    wheelG.arc(
      0, 0,
      wheelDiameter, wheelDiameter,
      i * segmentAngle,
      (i + 1) * segmentAngle,
      PIE
    );
    
    // Zahlen – an den Rand gesetzt, groesse skaliert mit Rad
    wheelG.push();
    wheelG.rotate(i * segmentAngle + segmentAngle / 2);
    wheelG.translate(numberRadius, 0);
    wheelG.fill(0);
    wheelG.noStroke();
    wheelG.textSize(wheelDiameter / 60);
    wheelG.text(segmentNumbers[i], 0, 0);
    wheelG.pop();
  }
  
  // Mittelpunkt + "SPIN" direkt in die Grafik zeichnen
  wheelG.fill(0, 0, 100);
  wheelG.noStroke();
  wheelG.circle(0, 0, wheelDiameter * 0.15);
  wheelG.fill(0, 0, 0);
  wheelG.textSize(wheelDiameter / 20);
  wheelG.text("SPIN", 0, 0);
  
  wheelG.pop();
}

function draw() {
  background(0);

  // ---------- Nyan-Cat-Hintergrund ----------
  if (bgImg) {
    // Bild proportional skalieren
    let scaleFactor = max(width / bgImg.width, height / bgImg.height);
    let w = bgImg.width * scaleFactor;
    let h = bgImg.height * scaleFactor;
    let y = height / 2 - h / 2;

    // nur bewegen, wenn das Rad dreht
    if (spinning) {
      bgOffsetX -= 4; // Geschwindigkeit des Scrollens
    }

    // damit es endlos durchläuft
    let x = bgOffsetX % w;
    if (x > 0) x -= w;

    image(bgImg, x,       y, w, h);
    image(bgImg, x + w,   y, w, h);
  }
  // -----------------------------------------

  // Titel
  textAlign(CENTER);
  textSize(24);
  fill(255);
  text("Volume Glücksrad", width/2, 30);
  
  // Input Label
  textSize(16);
  text("Gewünschte Lautstärke:", width/2, 55);
  
  // Aktuelle Lautstaerke anzeigen
  textSize(20);
  fill(255);
  text("Aktuelle Volume: " + volume + "%", width/2, 130);
  
  // Zentrum des Rads
  let centerX = width / 2;
  let centerY = height / 2 + 50;
  
  // Rad drehen wenn spinning
 if (spinning) {
  angle += spinSpeed;
  spinSpeed *= 0.98; // Verlangsamung

  if (spinSpeed < 0.5) {
    spinning = false;

    // Winkel pro Segment
    let segmentAngle = 360 / segments;

    // Richtung des duennen Zeigers in Koordinaten des Rads
    // Zeiger zeigt nach oben (270°), Rad ist um "angle" gedreht
    let pointerAngle = 270 - (angle % 360);

    // sauber in [0, 360) normieren
    pointerAngle = (pointerAngle % 360 + 360) % 360;

    // Index des Segments, dessen MITTE am naechsten beim Zeiger liegt
    let currentSegment = round((pointerAngle - segmentAngle / 2) / segmentAngle);

    // in gueltigen Bereich [0, segments-1] holen
    currentSegment = (currentSegment % segments + segments) % segments;

    // richtige Zahl unter dem Zeiger
    volume = segmentNumbers[currentSegment];
  }
}
  
  // Rad-Grafik zeichnen
  push();
  translate(centerX, centerY);
  rotate(angle);
  imageMode(CENTER);
  image(wheelG, 0, 0);
  pop();
  
  // Zeiger oben – bleibt fix
  let pointerTipY = centerY - wheelRadius - 20;
  let pointerBaseY = centerY - wheelRadius + 10;
  
  fill(255, 0, 0);
  stroke(0);
  strokeWeight(2);
  triangle(
    centerX,      pointerTipY,     // Spitze
    centerX - 10, pointerBaseY,    // links
    centerX + 10, pointerBaseY     // rechts
  );
  
  // Zeiger-Linie
  stroke(255, 0, 0);
  strokeWeight(2);
  line(centerX, pointerTipY, centerX, pointerBaseY + 20);
  noStroke();
  
  // Button
  if (!spinning) {
    fill(100);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(18);
    text("Drehen!", width/2, height - 95);
  }
}

function mousePressed() {
  // Klick auf Mittelpunkt oder Button
  let centerX = width / 2;
  let centerY = height / 2 + 50;
  let d = dist(mouseX, mouseY, centerX, centerY);
  
  let onButton = mouseX > width/2 - 80 && mouseX < width/2 + 80 && 
                 mouseY > height - 120 && mouseY < height - 70;
  
  if ((d < wheelRadius * 0.25 || onButton) && !spinning) {
    targetVolume = int(inputField.value());
    targetVolume = constrain(targetVolume, 0, 100);
    inputField.value(targetVolume.toString());
    
    spinning = true;
    spinSpeed = random(20, 30);
  }
}