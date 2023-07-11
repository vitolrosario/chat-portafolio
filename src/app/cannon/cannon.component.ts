import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'cannon-component',
  templateUrl: './cannon.component.html',
  styleUrls: ['./cannon.component.css']
})
export class CannonComponent implements OnInit {

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  c!: CanvasRenderingContext2D | null;
  mouse = { x: 0, y: 0 };
  isMouseDown = false;
  gravity = 0.08;
  desiredAngle = 0;
  cannon: any;
  cannonballs: any[] = [];
  explosions: any[] = [];
  colors: any[] = [];
  isIntroComplete: boolean = false; // Add the missing property here
  introTimer: number = 0;
  timer: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.c = this.canvasRef.nativeElement.getContext('2d');

    this.canvasRef.nativeElement.width = window.innerWidth;
    this.canvasRef.nativeElement.height = window.innerHeight;

    this.mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };

    this.initializeVariables();

    window.addEventListener("mousemove", (event) => {
      this.mouse.x = event.clientX;
      this.mouse.y = event.clientY;
    });

    window.addEventListener("resize", () => {
      this.canvasRef.nativeElement.height = window.innerHeight;
      this.canvasRef.nativeElement.width = window.innerWidth;
      this.initializeVariables();
    });

    window.addEventListener("mousedown", () => {
      this.isMouseDown = true;
    });

    window.addEventListener("mouseup", () => {
      this.isMouseDown = false;
    });

    this.canvasRef.nativeElement.addEventListener("touchstart", () => {
      this.isMouseDown = true;
    });

    this.canvasRef.nativeElement.addEventListener("touchmove", (event) => {
      event.preventDefault();
      this.mouse.x = event.touches[0].pageX;
      this.mouse.y = event.touches[0].pageY;
    });

    this.canvasRef.nativeElement.addEventListener("touchend", () => {
      this.isMouseDown = false;
    });

    setTimeout(() => {
      this.animate();
    }, 1000);
  }

  initializeVariables(): void {
    this.cannon = new Cannon(this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height, 20, 10, "white", this.mouse, this.c);
    this.cannonballs = [];
    this.explosions = [];
    this.colors = [
      {
        cannonballColor: "#fff",
        particleColors: [
          "#ff4747",
          "#00ceed",
          "#fff",
        ]
      }
    ];
  }

  animate(): void {
    window.requestAnimationFrame(() => this.animate());

    this.c!.fillStyle = "rgba(18, 18, 18, 0.2)";
    this.c!.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    this.cannon.update();

    if (!this.isIntroComplete) {
      this.introTimer += 1;

      if (this.introTimer % 3 === 0) {
        const randomColor = Math.floor(Math.random() * this.colors.length);
        const color = this.colors[randomColor];

        this.cannonballs.push(new Cannonball(this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2, 2, 2, 4, color.cannonballColor, this.cannon, color.particleColors, this.mouse, this.c, this.canvasRef, this.gravity));
      }

      if (this.introTimer > 30) {
        this.isIntroComplete = true;
      }
    }

    for (let i = 0; i < this.cannonballs.length; i++) {
      this.cannonballs[i].update();

      if (this.cannonballs[i].timeToLive <= 0) {
        this.explosions.push(new Explosion(this.cannonballs[i], this.c, this.canvasRef));
        this.cannonballs.splice(i, 1);
      }
    }

    for (let j = 0; j < this.explosions.length; j++) {
      this.explosions[j].update();

      if (this.explosions[j].particles.length <= 0) {
        this.explosions.splice(j, 1);
      }
    }

    if (this.isMouseDown === true) {
      this.timer += 1;
      if (this.timer % 3 === 0) {
        const randomParticleColorIndex = Math.floor(Math.random() * this.colors.length);
        const randomColors = this.colors[randomParticleColorIndex];

        this.cannonballs.push(new Cannonball(this.mouse.x, this.mouse.y, 2, 2, 4, randomColors.cannonballColor, this.cannon, randomColors.particleColors, this.mouse, this.c, this.canvasRef, this.gravity));
      }
    }
  }
}

class Cannon {
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  color: string;
  mouse: { x: 0, y: 0 };
  c: CanvasRenderingContext2D | null;

  constructor(x: number, y: number, width: number, height: number, color: string, mouse: any, c: CanvasRenderingContext2D | null) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = 0;
    this.color = color;
    this.mouse = mouse;
    this.c = c;
  }

  update(): void {
    const desiredAngle = Math.atan2(this.mouse.y - this.y, this.mouse.x - this.x);
    this.angle = desiredAngle;
    this.draw();
  }

  draw(): void {
    this.c!.save();
    this.c!.translate(this.x, this.y);
    this.c!.rotate(this.angle);
    this.c!.beginPath();
    this.c!.fillStyle = this.color;
    this.c!.shadowColor = this.color;
    this.c!.shadowBlur = 3;
    this.c!.shadowOffsetX = 0;
    this.c!.shadowOffsetY = 0;
    this.c!.fillRect(0, -this.height / 2, this.width, this.height);
    this.c!.closePath();
    this.c!.restore();
  }
}

class Cannonball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  color: string;
  particleColors: string[];
  source: any;
  timeToLive: number;
  mouse: { x: 0, y: 0 };
  c!: CanvasRenderingContext2D | null;
  canvasRef!: ElementRef<HTMLCanvasElement>
  gravity: number;

  constructor(x: number, y: number, dx: number, dy: number, radius: number, color: string, cannon: any, particleColors: string[], mouse: any, c: CanvasRenderingContext2D | null, canvasRef: ElementRef<HTMLCanvasElement>, gravity: number) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = -dy;
    this.radius = radius;
    this.color = color;
    this.particleColors = particleColors;
    this.source = cannon;
    this.mouse = mouse;
    this.c = c;
    this.canvasRef = canvasRef
    this.timeToLive = this.canvasRef.nativeElement.height / (this.canvasRef.nativeElement.height + 800);
    this.gravity = gravity
    this.init();
  }

  init(): void {
    this.x = Math.cos(this.source.angle) * this.source.width;
    this.y = Math.sin(this.source.angle) * this.source.width;

    this.x = this.x + (this.canvasRef.nativeElement.width / 2);
    this.y = this.y + (this.canvasRef.nativeElement.height);

    if (this.mouse.x - this.canvasRef.nativeElement.width / 2 < 0) {
      this.dx = -this.dx;
    }

    this.dy = Math.sin(this.source.angle) * 8;
    this.dx = Math.cos(this.source.angle) * 8;
  }

  update(): void {
    if (this.y + this.radius + this.dy > this.canvasRef.nativeElement.height) {
      this.dy = -this.dy;
    } else {
      this.dy += this.gravity;
    }

    this.x += this.dx;
    this.y += this.dy;
    this.draw();

    this.timeToLive -= 0.01;
  }

  draw(): void {
    this.c!.save();
    this.c!.beginPath();
    this.c!.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.c!.shadowColor = this.color;
    this.c!.shadowBlur = 5;
    this.c!.shadowOffsetX = 0;
    this.c!.shadowOffsetY = 0;
    this.c!.fillStyle = this.color;
    this.c!.fill();
    this.c!.closePath();
    this.c!.restore();
  }
}

class Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  color: string;
  timeToLive: number;
  c!: CanvasRenderingContext2D | null;
  canvasRef!: ElementRef<HTMLCanvasElement>

  constructor(x: number, y: number, dx: number, dy: number, radius: number, color: string, c: CanvasRenderingContext2D | null, canvasRef: ElementRef<HTMLCanvasElement>) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = -dy;
    this.radius = 5;
    this.color = color;
    this.timeToLive = 1;
    this.c = c;
    this.canvasRef = canvasRef
  }

  update(): void {
    if (this.y + this.radius + this.dy > this.canvasRef.nativeElement.height) {
      this.dy = -this.dy;
    }

    if (this.x + this.radius + this.dx > this.canvasRef.nativeElement.width || this.x - this.radius + this.dx < 0) {
      this.dx = -this.dx;
    }

    this.x += this.dx;
    this.y += this.dy;
    this.draw();

    this.timeToLive -= 0.01;
  }

  draw(): void {
    this.c!.save();
    this.c!.beginPath();
    this.c!.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
    this.c!.shadowColor = this.color;
    this.c!.shadowBlur = 10;
    this.c!.shadowOffsetX = 0;
    this.c!.shadowOffsetY = 0;
    this.c!.fillStyle = this.color;
    this.c!.fill();
    this.c!.closePath();
    this.c!.restore();
  }
}

class Explosion {
  particles: any[];
  rings: any[];
  source: any;
  c!: CanvasRenderingContext2D | null;
  canvasRef!: ElementRef<HTMLCanvasElement>

  constructor(cannonball: any, c: CanvasRenderingContext2D | null, canvasRef: ElementRef<HTMLCanvasElement>) {
    this.particles = [];
    this.rings = [];
    this.source = cannonball;
    this.c = c;
    this.canvasRef = canvasRef
    this.init();
  }

  init(): void {
    for (let i = 0; i < 10; i++) {
      const dx = (Math.random() * 6) - 3;
      const dy = (Math.random() * 6) - 3;

      const randomColorIndex = Math.floor(Math.random() * this.source.particleColors.length);
      const randomParticleColor = this.source.particleColors[randomColorIndex];

      this.particles.push(new Particle(this.source.x, this.source.y, dx, dy, 1, randomParticleColor, this.c, this.canvasRef));
    }
  }

  update(): void {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();

      if (this.particles[i].timeToLive < 0) {
        this.particles.splice(i, 1);
      }
    }

    for (let j = 0; j < this.rings.length; j++) {
      this.rings[j].update();

      if (this.rings[j].timeToLive < 0) {
        this.rings.splice(j, 1);
      }
    }
  }
}
