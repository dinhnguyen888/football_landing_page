import * as THREE from 'three';

/**
 * FootballStageDecor
 * Adds authentic UEFA Champions League / FIFA World Cup football atmosphere to the 3D draw stage:
 * 1. Pitch Center Turf with stadium mowed grass stripes & crisp pitch markings (Center Circle, Halfway line, Spot)
 * 2. 3D Championship Gold Trophy on an illuminated luxury glass pedestal
 * 3. 3D Official Match Ball on a rotating plinth
 * 4. Stadium Floodlight Truss Towers framing the arena
 * 5. Dynamic Scrolling Digital Pitch-side LED Ribbon
 */
export class FootballStageDecor {
  public group: THREE.Group;
  private trophyGroup: THREE.Group;
  private matchBallMesh: THREE.Mesh | null = null;
  private ledRibbonCanvas: HTMLCanvasElement;
  private ledRibbonTexture: THREE.CanvasTexture;
  private scrollOffset: number = 0;
  private beamMaterials: THREE.MeshBasicMaterial[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'FootballStageDecor';

    // 1. Football Pitch Center Turf & Markings
    this.createPitchFloor();

    // 2. 3D Championship Trophy on Pedestal (Left side, x: -1.88, z: 0.15)
    this.trophyGroup = this.createChampionshipTrophy();
    this.trophyGroup.position.set(-1.88, 0, 0.15);
    this.group.add(this.trophyGroup);

    // 3. Official Match Ball on Pedestal (Right side, x: 1.88, z: 0.15)
    const matchBallPlinth = this.createMatchBallPlinth();
    matchBallPlinth.position.set(1.88, 0, 0.15);
    this.group.add(matchBallPlinth);

    // 4. Stadium Floodlight Towers (Shifted well outside the 8.5m LED Screen bounds x: ±4.85)
    const towerLeft = this.createFloodlightTower();
    towerLeft.position.set(-4.85, 0, -1.7);
    towerLeft.rotation.y = 0.65;
    this.group.add(towerLeft);

    const towerRight = this.createFloodlightTower();
    towerRight.position.set(4.85, 0, -1.7);
    towerRight.rotation.y = -0.65;
    this.group.add(towerRight);

    // 5. Pitch-side LED Advertising Board (Curved front border)
    const { mesh: ledBoardMesh, canvas, texture } = this.createLedPerimeterBoard();
    this.ledRibbonCanvas = canvas;
    this.ledRibbonTexture = texture;
    this.group.add(ledBoardMesh);
  }

  // -------------------------------------------------------------
  // 1. FOOTBALL PITCH STAGE TURF & MARKINGS
  // -------------------------------------------------------------
  private createPitchFloor() {
    const pitchGroup = new THREE.Group();
    pitchGroup.name = 'PitchCenterGround';

    // Procedural striped grass texture
    const grassCanvas = document.createElement('canvas');
    grassCanvas.width = 1024;
    grassCanvas.height = 1024;
    const ctx = grassCanvas.getContext('2d');
    if (ctx) {
      // Base dark turf
      ctx.fillStyle = '#062d21';
      ctx.fillRect(0, 0, 1024, 1024);

      // Alternating mown stripes
      const stripeCount = 16;
      const stripeWidth = 1024 / stripeCount;
      for (let i = 0; i < stripeCount; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#0a4231' : '#063426';
        ctx.fillRect(i * stripeWidth, 0, stripeWidth, 1024);
      }

      // Radial vignette / stadium lighting falloff
      const grad = ctx.createRadialGradient(512, 512, 120, 512, 512, 512);
      grad.addColorStop(0, 'rgba(16, 185, 129, 0.22)');
      grad.addColorStop(0.7, 'rgba(5, 46, 32, 0.45)');
      grad.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);
    }

    const grassTex = new THREE.CanvasTexture(grassCanvas);
    grassTex.wrapS = THREE.ClampToEdgeWrapping;
    grassTex.wrapT = THREE.ClampToEdgeWrapping;

    // Pitch circular podium
    const turfGeo = new THREE.CircleGeometry(2.7, 64);
    const turfMat = new THREE.MeshStandardMaterial({
      map: grassTex,
      roughness: 0.85,
      metalness: 0.1,
    });
    const turfMesh = new THREE.Mesh(turfGeo, turfMat);
    turfMesh.rotation.x = -Math.PI / 2;
    turfMesh.position.y = 0.008;
    turfMesh.receiveShadow = true;
    pitchGroup.add(turfMesh);

    // Crisp white football pitch center circle
    const centerCircleGeo = new THREE.RingGeometry(1.65, 1.69, 64);
    const lineMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const centerCircle = new THREE.Mesh(centerCircleGeo, lineMat);
    centerCircle.rotation.x = -Math.PI / 2;
    centerCircle.position.y = 0.012;
    pitchGroup.add(centerCircle);

    // Halfway pitch line
    const lineGeo = new THREE.PlaneGeometry(0.04, 5.3);
    const halfLine = new THREE.Mesh(lineGeo, lineMat);
    halfLine.rotation.x = -Math.PI / 2;
    halfLine.rotation.z = Math.PI / 2;
    halfLine.position.y = 0.012;
    pitchGroup.add(halfLine);

    // Center spot (Kickoff dot)
    const spotGeo = new THREE.CircleGeometry(0.08, 32);
    const spot = new THREE.Mesh(spotGeo, lineMat);
    spot.rotation.x = -Math.PI / 2;
    spot.position.set(0, 0.014, 0.28);
    pitchGroup.add(spot);

    // Outer stage glowing boundary ring
    const glowRingGeo = new THREE.RingGeometry(2.68, 2.74, 64);
    const glowRingMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b, // Golden border
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
    });
    const glowRing = new THREE.Mesh(glowRingGeo, glowRingMat);
    glowRing.rotation.x = -Math.PI / 2;
    glowRing.position.y = 0.013;
    pitchGroup.add(glowRing);

    this.group.add(pitchGroup);
  }

  // -------------------------------------------------------------
  // 2. 3D GOLDEN CHAMPIONSHIP TROPHY
  // -------------------------------------------------------------
  private createChampionshipTrophy(): THREE.Group {
    const trophyRoot = new THREE.Group();
    trophyRoot.name = 'ChampionshipTrophy';

    // Pedestal Column (Black marble & glowing cyan glass)
    const pedestalGeo = new THREE.CylinderGeometry(0.3, 0.36, 0.95, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.2,
      metalness: 0.8,
    });
    const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalMesh.position.y = 0.475;
    pedestalMesh.castShadow = true;
    pedestalMesh.receiveShadow = true;
    trophyRoot.add(pedestalMesh);

    // Pedestal gold accent rings
    const goldRingMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.15,
    });
    const pRingTop = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.015, 16, 32), goldRingMat);
    pRingTop.rotation.x = Math.PI / 2;
    pRingTop.position.y = 0.95;
    trophyRoot.add(pRingTop);

    const pRingBase = new THREE.Mesh(new THREE.TorusGeometry(0.37, 0.018, 16, 32), goldRingMat);
    pRingBase.rotation.x = Math.PI / 2;
    pRingBase.position.y = 0.03;
    trophyRoot.add(pRingBase);

    // Pedestal LED glow disc under the cup
    const ledDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.02, 32),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.7 })
    );
    ledDisc.position.y = 0.96;
    trophyRoot.add(ledDisc);

    // --- High-Gloss Metallic Gold Trophy Mesh ---
    const trophyCupGroup = new THREE.Group();
    trophyCupGroup.position.y = 0.98;

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xb45309,
      emissiveIntensity: 0.22,
      metalness: 0.95,
      roughness: 0.12,
    });

    // 1. Trophy Square Plinth Base
    const baseGeo = new THREE.CylinderGeometry(0.16, 0.18, 0.08, 24);
    const baseMesh = new THREE.Mesh(baseGeo, goldMat);
    baseMesh.position.y = 0.04;
    baseMesh.castShadow = true;
    trophyCupGroup.add(baseMesh);

    // 2. Stem & Riser
    const stemGeo = new THREE.CylinderGeometry(0.06, 0.1, 0.16, 24);
    const stemMesh = new THREE.Mesh(stemGeo, goldMat);
    stemMesh.position.y = 0.16;
    stemMesh.castShadow = true;
    trophyCupGroup.add(stemMesh);

    // Central Sphere accent on stem
    const stemSphere = new THREE.Mesh(new THREE.SphereGeometry(0.08, 20, 20), goldMat);
    stemSphere.position.y = 0.22;
    stemSphere.castShadow = true;
    trophyCupGroup.add(stemSphere);

    // 3. Main Fluted Cup Body
    const cupGeo = new THREE.CylinderGeometry(0.22, 0.11, 0.36, 32, 1, true);
    const cupMesh = new THREE.Mesh(cupGeo, goldMat);
    cupMesh.position.y = 0.44;
    cupMesh.castShadow = true;
    trophyCupGroup.add(cupMesh);

    // Cup Bottom rounded bowl
    const bowlBottomGeo = new THREE.SphereGeometry(0.12, 24, 16, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5);
    const bowlBottomMesh = new THREE.Mesh(bowlBottomGeo, goldMat);
    bowlBottomMesh.position.y = 0.28;
    bowlBottomMesh.castShadow = true;
    trophyCupGroup.add(bowlBottomMesh);

    // Cup Flared Top Rim
    const rimGeo = new THREE.TorusGeometry(0.22, 0.02, 16, 32);
    const rimMesh = new THREE.Mesh(rimGeo, goldMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 0.62;
    rimMesh.castShadow = true;
    trophyCupGroup.add(rimMesh);

    // 4. Iconic Sweeping Dual Handles (Tai cúp uốn lượn Champions League)
    const handleCurveLeft = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.21, 0.58, 0),
      new THREE.Vector3(-0.38, 0.48, 0),
      new THREE.Vector3(-0.13, 0.32, 0)
    );
    const handleGeoLeft = new THREE.TubeGeometry(handleCurveLeft, 24, 0.018, 12, false);
    const handleLeft = new THREE.Mesh(handleGeoLeft, goldMat);
    handleLeft.castShadow = true;
    trophyCupGroup.add(handleLeft);

    const handleCurveRight = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0.21, 0.58, 0),
      new THREE.Vector3(0.38, 0.48, 0),
      new THREE.Vector3(0.13, 0.32, 0)
    );
    const handleGeoRight = new THREE.TubeGeometry(handleCurveRight, 24, 0.018, 12, false);
    const handleRight = new THREE.Mesh(handleGeoRight, goldMat);
    handleRight.castShadow = true;
    trophyCupGroup.add(handleRight);

    // 5. Crown Football Star on top inside cup
    const starBallGeo = new THREE.SphereGeometry(0.065, 20, 20);
    const starBallMesh = new THREE.Mesh(starBallGeo, goldMat);
    starBallMesh.position.y = 0.68;
    starBallMesh.castShadow = true;
    trophyCupGroup.add(starBallMesh);

    // Dedicated subtle spotlight shining on the trophy
    const trophySpot = new THREE.SpotLight(0xfffbeb, 3.5, 4, Math.PI / 6, 0.3, 1.2);
    trophySpot.position.set(0, 2.5, 0.8);
    trophySpot.target = trophyCupGroup;
    trophyRoot.add(trophySpot);
    trophyRoot.add(trophySpot.target);

    trophyRoot.add(trophyCupGroup);
    return trophyRoot;
  }

  // -------------------------------------------------------------
  // 3. OFFICIAL MATCH BALL PLINTH
  // -------------------------------------------------------------
  private createMatchBallPlinth(): THREE.Group {
    const plinthRoot = new THREE.Group();
    plinthRoot.name = 'MatchBallPlinth';

    // Pedestal Column (Sleek dark navy/carbon)
    const pedestalGeo = new THREE.CylinderGeometry(0.3, 0.36, 0.95, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.2,
      metalness: 0.8,
    });
    const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalMesh.position.y = 0.475;
    pedestalMesh.castShadow = true;
    pedestalMesh.receiveShadow = true;
    plinthRoot.add(pedestalMesh);

    // Rings
    const goldRingMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // Cyan neon ring
      metalness: 0.9,
      roughness: 0.15,
    });
    const pRingTop = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.015, 16, 32), goldRingMat);
    pRingTop.rotation.x = Math.PI / 2;
    pRingTop.position.y = 0.95;
    plinthRoot.add(pRingTop);

    // Ring holder for ball
    const holderRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.12, 0.02, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 })
    );
    holderRing.rotation.x = Math.PI / 2;
    holderRing.position.y = 0.98;
    plinthRoot.add(holderRing);

    // Official Match Ball with classic football texture
    const ballCanvas = document.createElement('canvas');
    ballCanvas.width = 512;
    ballCanvas.height = 256;
    const ctx = ballCanvas.getContext('2d');
    if (ctx) {
      // White leather ball base
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 512, 256);

      // Star / Pentagon patterns
      ctx.fillStyle = '#0f172a';
      const pentagons = [
        { x: 100, y: 70 },
        { x: 256, y: 50 },
        { x: 412, y: 70 },
        { x: 178, y: 170 },
        { x: 334, y: 170 },
      ];

      pentagons.forEach((p) => {
        ctx.beginPath();
        const r = 26;
        for (let a = 0; a < 5; a++) {
          const angle = (a * 72 - 18) * (Math.PI / 180);
          const px = p.x + Math.cos(angle) * r;
          const py = p.y + Math.sin(angle) * r;
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        // Gold star accent inside pentagon
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      });

      // Tournament branding line
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 16px Oswald, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('★ OFFICIAL MATCH BALL ★', 256, 120);
    }

    const ballTexture = new THREE.CanvasTexture(ballCanvas);
    const ballMat = new THREE.MeshStandardMaterial({
      map: ballTexture,
      roughness: 0.25,
      metalness: 0.15,
    });

    const ballMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 32, 32), ballMat);
    ballMesh.position.y = 1.15;
    ballMesh.castShadow = true;
    this.matchBallMesh = ballMesh;
    plinthRoot.add(ballMesh);

    // Dedicated spotlight for match ball
    const ballSpot = new THREE.SpotLight(0xe0f2fe, 3.5, 4, Math.PI / 6, 0.3, 1.2);
    ballSpot.position.set(0, 2.5, 0.8);
    ballSpot.target = ballMesh;
    plinthRoot.add(ballSpot);
    plinthRoot.add(ballSpot.target);

    return plinthRoot;
  }

  // -------------------------------------------------------------
  // 4. STADIUM FLOODLIGHT TRUSS TOWERS
  // -------------------------------------------------------------
  private createFloodlightTower(): THREE.Group {
    const tower = new THREE.Group();
    tower.name = 'StadiumFloodlightTower';

    // Metal Truss Legs
    const trussMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.9,
      roughness: 0.35,
    });

    // 4 vertical support pylons
    const legGeo = new THREE.CylinderGeometry(0.03, 0.04, 3.8, 12);
    const offsets = [
      [-0.2, -0.2],
      [0.2, -0.2],
      [-0.2, 0.2],
      [0.2, 0.2],
    ];

    offsets.forEach(([ox, oz]) => {
      const leg = new THREE.Mesh(legGeo, trussMat);
      leg.position.set(ox, 1.9, oz);
      tower.add(leg);
    });

    // Horizontal truss braces
    for (let h = 0.8; h <= 3.6; h += 0.7) {
      const brace = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.03, 0.44), trussMat);
      brace.position.y = h;
      tower.add(brace);
    }

    // Top Light Bank Fixture (Angled downward toward center stage)
    const bankHead = new THREE.Group();
    bankHead.position.set(0, 3.8, 0);
    bankHead.rotation.x = 0.35;

    const fixtureBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.45, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.3 })
    );
    bankHead.add(fixtureBox);

    // 2x3 Grid of Bright Halogen LED Spotlight emitters
    const lampGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.04, 16);
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let r = -0.12; r <= 0.12; r += 0.24) {
      for (let c = -0.22; c <= 0.22; c += 0.22) {
        const lamp = new THREE.Mesh(lampGeo, lampMat);
        lamp.rotation.x = Math.PI / 2;
        lamp.position.set(c, r, 0.09);
        bankHead.add(lamp);
      }
    }

    // 1. Radiant Lens Flare Glow Halo (Blinding halo around the floodlight head)
    const flareCanvas = document.createElement('canvas');
    flareCanvas.width = 256;
    flareCanvas.height = 256;
    const fCtx = flareCanvas.getContext('2d');
    if (fCtx) {
      const rGrad = fCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
      rGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      rGrad.addColorStop(0.2, 'rgba(254, 240, 138, 0.85)');
      rGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.35)');
      rGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      fCtx.fillStyle = rGrad;
      fCtx.fillRect(0, 0, 256, 256);
    }
    const flareTex = new THREE.CanvasTexture(flareCanvas);
    const flareMat = new THREE.MeshBasicMaterial({
      map: flareTex,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const flareMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.3), flareMat);
    flareMesh.position.set(0, 0, 0.14);
    bankHead.add(flareMesh);

    // 2. Volumetric Light Cone Shaft (God-rays cutting through dark arena atmosphere)
    const beamCanvas = document.createElement('canvas');
    beamCanvas.width = 64;
    beamCanvas.height = 256;
    const bCtx = beamCanvas.getContext('2d');
    if (bCtx) {
      const grad = bCtx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, 'rgba(255, 253, 245, 0.9)');
      grad.addColorStop(0.12, 'rgba(254, 240, 138, 0.55)');
      grad.addColorStop(0.5, 'rgba(217, 249, 157, 0.18)');
      grad.addColorStop(1, 'rgba(2, 6, 23, 0)');
      bCtx.fillStyle = grad;
      bCtx.fillRect(0, 0, 64, 256);
    }
    const beamTex = new THREE.CanvasTexture(beamCanvas);

    const coneGeo = new THREE.CylinderGeometry(0.28, 2.2, 6.2, 32, 1, true);
    coneGeo.translate(0, -3.1, 0); // Origin at top of cone

    const coneMat = new THREE.MeshBasicMaterial({
      map: beamTex,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.beamMaterials.push(coneMat);

    const beamMesh = new THREE.Mesh(coneGeo, coneMat);
    beamMesh.rotation.x = -Math.PI / 2; // Shoot along +Z of the angled head
    beamMesh.position.set(0, 0, 0.12);
    bankHead.add(beamMesh);

    // 3. Real Dynamic SpotLight casting authentic lighting down to center stage
    const realSpot = new THREE.SpotLight(0xfffbeb, 6.5, 12, Math.PI / 3.6, 0.45, 1.1);
    realSpot.position.set(0, 0, 0.1);
    const targetObj = new THREE.Object3D();
    targetObj.position.set(0, -3.8, 4.2);
    bankHead.add(targetObj);
    realSpot.target = targetObj;
    bankHead.add(realSpot);

    tower.add(bankHead);
    return tower;
  }

  // -------------------------------------------------------------
  // 5. PITCH-SIDE DIGITAL LED RIBBON (Curved advertising hoardings)
  // -------------------------------------------------------------
  private createLedPerimeterBoard(): {
    mesh: THREE.Mesh;
    canvas: HTMLCanvasElement;
    texture: THREE.CanvasTexture;
  } {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    this.drawLedRibbon(ctx, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.x = -1; // Un-mirror text when viewed on curved cylinder from camera

    // Curved barrier in the foreground
    const boardGeo = new THREE.CylinderGeometry(3.6, 3.6, 0.22, 64, 1, true, Math.PI * 0.18, Math.PI * 0.64);
    const boardMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(boardGeo, boardMat);
    mesh.position.set(0, 0.11, 0.2);
    mesh.rotation.y = Math.PI;

    return { mesh, canvas, texture };
  }

  private drawLedRibbon(ctx: CanvasRenderingContext2D, offset: number) {
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, 1024, 128);

    // Top and bottom glowing neon lines
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(0, 0, 1024, 6);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(0, 122, 1024, 6);

    // Scrolling text banner
    ctx.save();
    ctx.font = 'bold 36px "Oswald", Impact, sans-serif';
    ctx.fillStyle = '#ffffff';

    const text = '  ⚽ SAO VÀNG CUP ™   ★   OFFICIAL DRAW CEREMONY   ★   FC ONLINE   ★   ROAD TO CHAMPIONS   ★   BỐC THĂM CHIA BẢNG ĐẤU ⚽  ';
    const textW = ctx.measureText(text).width;

    const x = -((offset * 120) % textW);
    for (let i = -1; i < 3; i++) {
      ctx.fillText(text, x + i * textW, 76);
    }
    ctx.restore();
  }

  // -------------------------------------------------------------
  // ANIMATION LOOP UPDATE
  // -------------------------------------------------------------
  public update(delta: number) {
    // 1. Slowly rotate Match Ball
    if (this.matchBallMesh) {
      this.matchBallMesh.rotation.y += delta * 0.45;
      this.matchBallMesh.rotation.x += delta * 0.08;
    }

    // 2. Trophy subtle sparkle / gleam rotation
    if (this.trophyGroup) {
      const cup = this.trophyGroup.getObjectByName('ChampionshipTrophy');
      if (cup) {
        cup.rotation.y += delta * 0.15;
      }
    }

    // 3. Scroll LED ribbon
    this.scrollOffset += delta;
    if (this.ledRibbonCanvas && this.ledRibbonTexture) {
      const ctx = this.ledRibbonCanvas.getContext('2d');
      if (ctx) {
        this.drawLedRibbon(ctx, this.scrollOffset);
        this.ledRibbonTexture.needsUpdate = true;
      }
    }

    // 4. Floodlight volumetric beam atmospheric shimmer
    const time = Date.now() * 0.003;
    this.beamMaterials.forEach((mat, idx) => {
      mat.opacity = 0.35 + Math.sin(time + idx * 2.1) * 0.05;
    });
  }
}
