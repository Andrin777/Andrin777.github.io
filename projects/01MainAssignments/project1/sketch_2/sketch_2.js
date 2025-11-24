let font;
let buffer;
let cylinderRadius = 50;
let imagePixels = [];

function preload() {
  font = loadFont('z_Avenir.otf'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);
  textSize(width / 9);
  textAlign(CENTER, CENTER);

  // Buffer viel kleiner als Fenster
  buffer = createGraphics(windowWidth / 10, windowHeight / 10);
  buffer.fill(255);
  buffer.background(0, 255, 0);
  buffer.textFont(font);
  buffer.textAlign(CENTER, CENTER);

  buffer.textSize(22);
  buffer.text("I", buffer.width / 2, buffer.height / 4.5);
  buffer.text("love", buffer.width / 2, buffer.height / 2);
  buffer.text("apples", buffer.width / 2, buffer.height * 3 / 3.8);

  buffer.filter(BLUR, 1);

  // Pixel in Array speichern
  for (let x = 0; x < buffer.width; x++) {
    imagePixels[x] = [];
    for (let y = 0; y < buffer.height; y++) {
      let pixelColor = buffer.get(x, y);
      let r = red(pixelColor);
      imagePixels[x][y] = r / 5;
    }
  }
}

function draw() {
  background(0);
  noFill();

  let stepX = windowWidth / buffer.width;
  let stepY = windowHeight / buffer.height;

  let colors = [
    [255, 0, 128],   
    [0, 255, 255],   
    [255, 255, 0],   
    [128, 0, 255],   
    [0, 255, 128]    
  ];
  let animationSpeed = map(mouseY, 0, height/3, 0, 1);
  animationSpeed = constrain(animationSpeed, 0, 1);

  for (let y = 0; y < buffer.height; y++) {
    let colorIndex = y % colors.length;
    let col = colors[colorIndex];

    stroke(col[0], col[1], col[2], 200);
    strokeWeight(4);

    beginShape();
    for (let x = 0; x < buffer.width; x++) {
      let mx = mouseX / width;
      if (mx < 0.1) mx = 0.1;

      let h = imagePixels[x][y] * mx;

      // Noise mit variabler Geschwindigkeit
      let my = mouseY / height;
      if (my < 0.1) my = 0.1;
      
      let noiseScale = my;
      
      // Animation verlangsamt sich basierend auf Mausposition
      let animatedFrame = frameCount * animationSpeed;
      
      let noiseMouse = noise(
        x / (noiseScale * 10),
        y / (noiseScale * 10),
        animatedFrame / (noiseScale * 10)
      ) * my * 80 * animationSpeed; // Auch Amplitude reduzieren
      
      h += noiseMouse;

      curveVertex(x * stepX, (y * stepY) - h);
    }
    endShape();
  }
}

  // image(buffer, 0, 0); // zum Debuggen


// Optional: Canvas bei Fensteränderung anpassen
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}