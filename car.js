const canvas = document.getElementById('carCanvas');
const ctx = canvas.getContext('2d');

// const cars = [
//   new Car(350, 500, 50, 30, 'blue'), // First car
//   new Car(200, 300, 50, 30, 'red'), // Second car
//   new Car(500, 200, 50, 30, 'green'), // Third car
// ];

// Car class definition
class Car {
  constructor(x, y, width, height, color) {
    this.x = x; // Initial x position of the car
    this.y = y; // Initial y position of the car
    this.width = width; // Width of the car
    this.height = height; // Height of the car
    this.color = color; // Color of the car
    this.speed = 0; // Current speed of the car
    this.acceleration = 1.0; // Acceleration rate
    this.maxSpeed = 10; // Maximum speed of the car
    this.friction = 0.1; // Friction to slow down the car
    this.angle = 0; // Angle of the car in radians
    this.turnSpeed = 0.05; // Speed at which the car turns
    this.controls = { up: false, down: false, left: false, right: false }; // Track key states
  }

  // Update the car's state and redraw it
  update() {
    this.#move(); // Move the car based on current speed and angle
    this.#checkBorders(); // Ensure the car stays within canvas borders
    this.draw(); // Draw the car
  }

  // Move the car based on its speed and angle
  #move() {
    // Handle turning if left or right keys are pressed
    if (this.controls.left) {
      this.angle -= this.turnSpeed; // Turn left by decreasing the angle
    }
    if (this.controls.right) {
      this.angle += this.turnSpeed; // Turn right by increasing the angle
    }

    // Apply friction to gradually reduce speed when not accelerating
    if (this.speed > 0) {
      this.speed -= this.friction; // Slow down if moving forward
    } else if (this.speed < 0) {
      this.speed += this.friction; // Slow down if moving backward
    }

    // Ensure the car does not exceed maximum or minimum speed
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed; // Cap speed at maxSpeed
    } else if (this.speed < -this.maxSpeed) {
      this.speed = -this.maxSpeed; // Cap speed at -maxSpeed
    }

    // Update the car's position based on the current speed and angle
    this.x += Math.sin(this.angle) * this.speed; // Update x based on angle and speed
    this.y -= Math.cos(this.angle) * this.speed; // Update y based on angle and speed
  }

  // Ensure the car stays within the canvas borders
  #checkBorders() {
    if (this.x < 0) this.x = 0; // Prevent moving off the left edge
    if (this.x + this.width > canvas.width) this.x = canvas.width - this.width; // Prevent moving off the right edge
    if (this.y < 0) this.y = 0; // Prevent moving off the top edge
    if (this.y + this.height > canvas.height)
      this.y = canvas.height - this.height; // Prevent moving off the bottom edge
  }

  // Draw the car on the canvas
  draw() {
    ctx.save(); // Save the current canvas state
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2); // Move the origin to the center of the car
    ctx.rotate(this.angle); // Rotate the canvas to the car's angle
    ctx.fillStyle = this.color; // Set the car color
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height); // Draw the car rectangle
    ctx.restore(); // Restore the canvas state
  }

  // Increase the car's speed
  accelerate() {
    this.speed += this.acceleration; // Increase speed by the acceleration rate
  }

  // Decrease the car's speed
  brake() {
    this.speed -= this.acceleration; // Decrease speed by the acceleration rate
  }

  // Update control states based on key presses
  setControl(key, isPressed) {
    switch (key) {
      case 'ArrowUp':
        this.controls.up = isPressed; // Track if the up arrow key is pressed
        if (isPressed) this.accelerate(); // Accelerate if up arrow key is pressed
        break;
      case 'ArrowDown':
        this.controls.down = isPressed; // Track if the down arrow key is pressed
        if (isPressed) this.brake(); // Brake if down arrow key is pressed
        break;
      case 'ArrowLeft':
        this.controls.left = isPressed; // Track if the left arrow key is pressed
        break;
      case 'ArrowRight':
        this.controls.right = isPressed; // Track if the right arrow key is pressed
        break;
    }
  }
}

// Create a new car instance
const car = new Car(350, 500, 30, 50, 'blue');

// Draw the road background
function drawRoad() {
  const roadWidth = 200;
  const roadX = (canvas.width - roadWidth) / 2;

  ctx.fillStyle = 'gray'; // Road color
  ctx.fillRect(roadX, 0, roadWidth, canvas.height); // Draw the road rectangle

  // Draw lane markings
  ctx.strokeStyle = 'white'; // Lane marking color
  ctx.lineWidth = 5; // Line width for lane markings

  // Draw dashed lines in the middle of the road
  const laneWidth = 60; // Width of each lane marking segment
  for (let y = 0; y < canvas.height; y += laneWidth * 2) {
    ctx.beginPath();
    ctx.setLineDash([20, 20]); // Dashed line pattern
    ctx.moveTo(canvas.width / 2, y);
    ctx.lineTo(canvas.width / 2, y + laneWidth);
    ctx.stroke();
  }
}

// Animation loop to continuously update and draw the car and road
function animate() {
  drawRoad(); // Draw the road background
  car.update(); // Update the car's state and draw it

  requestAnimationFrame(animate); // Request the next frame
}

// Handle key down events
function keyDownHandler(e) {
  car.setControl(e.key, true); // Update control states when a key is pressed
}

// Handle key up events
function keyUpHandler(e) {
  car.setControl(e.key, false); // Update control states when a key is released
}

// Add event listeners for key down and key up events
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

// Start the animation loop
animate();
