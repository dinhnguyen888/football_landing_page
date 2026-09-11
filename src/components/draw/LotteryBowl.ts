import * as THREE from 'three';
import gsap from 'gsap';

export class LotteryBowl {
  public group: THREE.Group;
  public bowlMesh: THREE.Mesh;
  public tableMesh: THREE.Group;
  public ballsGroup: THREE.Group;
  public activeBall: THREE.Group;
  public activeBallTop: THREE.Mesh;
  public activeBallBottom: THREE.Mesh;
  public cardMeshInside: THREE.Mesh;

  private isMixing: boolean = false;
  private mixSpeed: number = 0;
  private ballMeshes: THREE.Mesh[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'LotteryBowlAndTable';

    // 1. Luxury Acrylic / Glass Podium Table
    this.tableMesh = new THREE.Group();

    // Table Top (Circular glass slab)
    const tableTopGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.04, 48);
    const tableGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.08,
      ior: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const tableTopMesh = new THREE.Mesh(tableTopGeo, tableGlassMat);
    tableTopMesh.position.y = 0.9;
    tableTopMesh.receiveShadow = true;
    this.tableMesh.add(tableTopMesh);

    // Table Column (Sleek dark navy & gold pedestal)
    const columnGeo = new THREE.CylinderGeometry(0.22, 0.3, 0.9, 32);
    const columnMat = new THREE.MeshStandardMaterial({
      color: 0x071126,
      metalness: 0.85,
      roughness: 0.25,
    });
    const columnMesh = new THREE.Mesh(columnGeo, columnMat);
    columnMesh.position.y = 0.45;
    columnMesh.castShadow = true;
    columnMesh.receiveShadow = true;
    this.tableMesh.add(columnMesh);

    // Gold decorative accent rings
    const ringGeo = new THREE.TorusGeometry(0.25, 0.018, 16, 32);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo, goldMat);
    ringMesh1.rotation.x = Math.PI / 2;
    ringMesh1.position.y = 0.88;
    this.tableMesh.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(ringGeo, goldMat);
    ringMesh2.rotation.x = Math.PI / 2;
    ringMesh2.position.y = 0.08;
    this.tableMesh.add(ringMesh2);

    this.group.add(this.tableMesh);

    // 2. Transparent Spherical Glass Lottery Bowl
    const bowlGeo = new THREE.SphereGeometry(0.34, 48, 36, 0, Math.PI * 2, 0, Math.PI * 0.78);
    const bowlGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transmission: 0.85,
      opacity: 0.9,
      transparent: true,
      roughness: 0.08,
      ior: 1.45,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      side: THREE.DoubleSide,
    });
    this.bowlMesh = new THREE.Mesh(bowlGeo, bowlGlassMat);
    this.bowlMesh.position.set(0, 1.20, 0);
    this.bowlMesh.rotation.x = Math.PI; // Bowl opening facing upwards
    this.bowlMesh.castShadow = true;
    this.group.add(this.bowlMesh);

    // 3. Balls Inside Bowl
    this.ballsGroup = new THREE.Group();
    this.ballsGroup.position.set(0, 1.12, 0);

    // Football pattern canvas texture for draw balls
    const ballTexCanvas = document.createElement('canvas');
    ballTexCanvas.width = 128;
    ballTexCanvas.height = 64;
    const bCtx = ballTexCanvas.getContext('2d');
    if (bCtx) {
      bCtx.fillStyle = '#f8fafc';
      bCtx.fillRect(0, 0, 128, 64);
      bCtx.fillStyle = '#0f172a';
      [[32, 20], [96, 20], [64, 48]].forEach(([px, py]) => {
        bCtx.beginPath();
        bCtx.arc(px, py, 7, 0, Math.PI * 2);
        bCtx.fill();
        bCtx.strokeStyle = '#f59e0b';
        bCtx.lineWidth = 1.5;
        bCtx.stroke();
      });
    }
    const soccerBallTex = new THREE.CanvasTexture(ballTexCanvas);

    const ballMat = new THREE.MeshStandardMaterial({
      map: soccerBallTex,
      roughness: 0.18,
      metalness: 0.1,
    });

    const ballGeo = new THREE.SphereGeometry(0.048, 24, 24);
    const ballCount = 14;

    for (let i = 0; i < ballCount; i++) {
      const bMesh = new THREE.Mesh(ballGeo, ballMat);
      const angle = (i / ballCount) * Math.PI * 2 + Math.random() * 0.3;
      const radius = 0.08 + Math.random() * 0.14;
      bMesh.position.set(
        Math.cos(angle) * radius,
        -0.08 + (i % 3) * 0.05 + Math.random() * 0.03,
        Math.sin(angle) * radius
      );
      bMesh.castShadow = true;
      this.ballMeshes.push(bMesh);
      this.ballsGroup.add(bMesh);
    }

    this.group.add(this.ballsGroup);

    // 4. Special Draw Ball (BallTop and BallBottom that can separate + Folded Card inside)
    this.activeBall = new THREE.Group();
    this.activeBall.name = 'ActiveDrawBall';

    const topGeo = new THREE.SphereGeometry(0.055, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const bottomGeo = new THREE.SphereGeometry(0.055, 24, 16, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5);

    const activeBallMat = new THREE.MeshStandardMaterial({
      map: soccerBallTex,
      roughness: 0.12,
      metalness: 0.1,
    });

    this.activeBallTop = new THREE.Mesh(topGeo, activeBallMat);
    this.activeBallTop.castShadow = true;
    this.activeBall.add(this.activeBallTop);

    this.activeBallBottom = new THREE.Mesh(bottomGeo, activeBallMat);
    this.activeBallBottom.castShadow = true;
    this.activeBall.add(this.activeBallBottom);

    // Small folded card inside ball
    const cardInsideGeo = new THREE.BoxGeometry(0.04, 0.05, 0.01);
    const cardInsideMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.3,
      metalness: 0.2,
    });
    this.cardMeshInside = new THREE.Mesh(cardInsideGeo, cardInsideMat);
    this.cardMeshInside.position.set(0, 0, 0);
    this.cardMeshInside.visible = false;
    this.activeBall.add(this.cardMeshInside);

    // Place active ball inside bowl initially
    this.activeBall.position.set(0, 1.12, 0);
    this.group.add(this.activeBall);
  }

  // Swirling physical agitation of balls during MIXING state
  public startMixing(duration: number = 1.8) {
    this.isMixing = true;
    this.mixSpeed = 1.0;

    gsap.to(this, {
      mixSpeed: 0,
      duration,
      ease: 'power2.in',
      onComplete: () => {
        this.isMixing = false;
      },
    });
  }

  // Open the two halves of the active ball
  public openBall(duration: number = 0.8) {
    // Lift and tilt top half
    gsap.to(this.activeBallTop.position, {
      y: 0.12,
      z: -0.05,
      duration,
      ease: 'power2.out',
    });
    gsap.to(this.activeBallTop.rotation, {
      x: -Math.PI * 0.45,
      duration,
      ease: 'power2.out',
    });

    // Lower bottom half slightly
    gsap.to(this.activeBallBottom.position, {
      y: -0.04,
      duration,
      ease: 'power2.out',
    });

    // Make folded card visible and emerge
    this.cardMeshInside.visible = true;
    gsap.to(this.cardMeshInside.position, {
      y: 0.06,
      duration,
      delay: 0.2,
      ease: 'back.out(1.5)',
    });
  }

  // Reset ball position and close halves
  public resetBall() {
    this.activeBallTop.position.set(0, 0, 0);
    this.activeBallTop.rotation.set(0, 0, 0);
    this.activeBallBottom.position.set(0, 0, 0);
    this.activeBallBottom.rotation.set(0, 0, 0);
    this.cardMeshInside.position.set(0, 0, 0);
    this.cardMeshInside.visible = false;
    this.activeBall.position.set(0, 1.12, 0);
    this.activeBall.rotation.set(0, 0, 0);
  }

  // Render loop update
  public update(delta: number) {
    if (this.isMixing && this.mixSpeed > 0.01) {
      // Rotate whole cluster
      this.ballsGroup.rotation.y += delta * 6.5 * this.mixSpeed;

      // Jitter individual balls
      this.ballMeshes.forEach((b, idx) => {
        b.position.y += Math.sin(Date.now() * 0.01 + idx) * 0.003 * this.mixSpeed;
        b.rotation.x += delta * 4 * this.mixSpeed;
        b.rotation.y += delta * 5 * this.mixSpeed;
      });
    }
  }
}
