import * as THREE from 'three';

export class ParticleSparkles {
  public points: THREE.Points;
  private velocities: number[] = [];
  private count: number = 80;

  constructor() {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.count * 3);

    for (let i = 0; i < this.count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = 0.5 + Math.random() * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;

      this.velocities.push(0.002 + Math.random() * 0.005);
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Create small circular soft particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(0.3, 'rgba(147, 197, 253, 0.6)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);

    const mat = new THREE.PointsMaterial({
      size: 0.12,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.6,
    });

    this.points = new THREE.Points(geo, mat);
    this.points.name = 'StageSparkles';
  }

  public update(delta: number) {
    const posAttr = this.points.geometry.getAttribute('position') as THREE.BufferAttribute;
    const positions = posAttr.array as Float32Array;

    for (let i = 0; i < this.count; i++) {
      positions[i * 3 + 1] += this.velocities[i];
      if (positions[i * 3 + 1] > 4.5) {
        positions[i * 3 + 1] = 0.5;
      }
    }

    posAttr.needsUpdate = true;
  }
}
