import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { PRESENTER_ANIMATIONS } from './DrawTypes';

export type PresenterTheme = 'GOLD_IVORY' | 'ROYAL_NAVY';

export interface PresenterConfig {
  modelPath?: string;
  position?: THREE.Vector3;
  rotationY?: number;
  scale?: number;
  theme?: PresenterTheme;
  mcName?: string;
}

export class PresenterRig {
  public group: THREE.Group;
  public mixer: THREE.AnimationMixer | null = null;
  public actions: Record<string, THREE.AnimationAction> = {};
  public currentActionName: string = '';
  public theme: PresenterTheme;
  public mcName: string;

  // Bone references for attaching props & procedural fallback
  public rightHandBone: THREE.Object3D | null = null;
  public leftHandBone: THREE.Object3D | null = null;
  public headBone: THREE.Object3D | null = null;
  public chestBone: THREE.Object3D | null = null;
  public rightArmBone: THREE.Object3D | null = null;
  public rightForearmBone: THREE.Object3D | null = null;
  public leftArmBone: THREE.Object3D | null = null;
  public leftForearmBone: THREE.Object3D | null = null;
  public cardHolderGroup: THREE.Group;
  public nameplateMesh: THREE.Mesh | null = null;

  private isGltfLoaded: boolean = false;
  private proceduralBones: Record<string, THREE.Object3D> = {};
  private nameplateCanvas: HTMLCanvasElement | null = null;
  private nameplateTexture: THREE.CanvasTexture | null = null;

  constructor(config?: PresenterConfig) {
    this.group = new THREE.Group();
    this.group.name = 'PresenterRig';

    this.theme = config?.theme || 'GOLD_IVORY';
    this.mcName = config?.mcName || (this.theme === 'GOLD_IVORY' ? 'MC PHAN LONG' : 'MC MINH QUÂN');

    const pos = config?.position || new THREE.Vector3(0, 0, -0.6);
    this.group.position.copy(pos);
    this.group.rotation.y = config?.rotationY ?? 0;

    const scale = config?.scale || 1.0;
    this.group.scale.set(scale, scale, scale);

    // Dedicated Card Holder Anchor (Anchored right in front of chest facing camera)
    this.cardHolderGroup = new THREE.Group();
    this.cardHolderGroup.name = 'CardHolderGroup';
    this.cardHolderGroup.position.set(0, 1.62, 0.32);
    this.cardHolderGroup.rotation.set(0.04, 0, 0);
    this.group.add(this.cardHolderGroup);

    // 1. Build procedural humanoid presenter immediately so it is instantly visible
    this.buildProceduralPresenter(this.theme);

    // 2. Build floating 3D nameplate above head
    this.createNameplate(this.mcName, this.theme);

    // 3. If a custom model path is configured and available, try loading it
    if (config?.modelPath) {
      this.loadPresenterModel(config.modelPath);
    }
  }

  // Try loading external GLB model if explicitly configured
  private loadPresenterModel(url: string) {
    const loader = new GLTFLoader();

    loader.load(
      url,
      (gltf) => {
        // Remove procedural model
        const procedural = this.group.getObjectByName('ProceduralPresenter');
        if (procedural) this.group.remove(procedural);

        this.isGltfLoaded = true;
        const model = gltf.scene;
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
          const name = child.name.toLowerCase();
          if (name.includes('righthand') || name.includes('hand_r') || name.includes('wrist_r')) {
            this.rightHandBone = child;
          }
          if (name.includes('lefthand') || name.includes('hand_l') || name.includes('wrist_l')) {
            this.leftHandBone = child;
          }
        });

        this.group.add(model);

        if (gltf.animations && gltf.animations.length > 0) {
          this.mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            const action = this.mixer!.clipAction(clip);
            this.actions[clip.name] = action;
          });
          this.playAction(PRESENTER_ANIMATIONS.idle);
        }
      },
      undefined,
      () => {
        // Keep procedural model if GLTF not found
      }
    );
  }

  // 2. High-fidelity Humanoid Rigged Presenter (Theme-based Gala Outfit)
  private buildProceduralPresenter(theme: PresenterTheme = 'GOLD_IVORY') {
    const presenterMeshGroup = new THREE.Group();
    presenterMeshGroup.name = 'ProceduralPresenter';

    const isNavy = theme === 'ROYAL_NAVY';

    // Materials - High-Contrast Luxury Gala Outfit (Contrasts sharply against dark arena)
    const jacketMat = new THREE.MeshStandardMaterial({
      color: isNavy ? 0x1e293b : 0xf8fafc, // Royal Midnight Navy vs Pearl Ivory White
      roughness: 0.25,
      metalness: 0.15,
      emissive: isNavy ? 0x0f172a : 0x334155,
      emissiveIntensity: 0.25,
    });

    const lapelMat = new THREE.MeshStandardMaterial({
      color: isNavy ? 0x020617 : 0x090d16, // Jet Black Satin Lapels
      roughness: 0.2,
      metalness: 0.35,
    });

    const pantsMat = new THREE.MeshStandardMaterial({
      color: isNavy ? 0x0f172a : 0x18181b, // Midnight Navy vs Charcoal Black Dress Trousers
      roughness: 0.45,
      metalness: 0.1,
    });

    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, // Crisp Pure White
      roughness: 0.3,
    });

    const tieMat = new THREE.MeshStandardMaterial({
      color: isNavy ? 0xb91c1c : 0xf59e0b, // Royal Crimson Burgundy Tie vs Radiant Golden Silk Tie
      roughness: 0.15,
      metalness: 0.6,
      emissive: isNavy ? 0x991b1b : 0xd97706,
      emissiveIntensity: 0.3,
    });

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xfbd09b, // Healthy Warm Skin Tone
      roughness: 0.45,
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: isNavy ? 0x3f3f46 : 0x27272a,
      roughness: 0.7,
    });

    const shoesMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.1,
    });

    const goldAccentMat = new THREE.MeshStandardMaterial({
      color: isNavy ? 0x38bdf8 : 0xfbbf24,
      metalness: 0.85,
      roughness: 0.2,
    });

    // Root Spine / Hips (Y = 1.0)
    const hips = new THREE.Group();
    hips.position.y = 1.0;
    presenterMeshGroup.add(hips);
    this.proceduralBones['hips'] = hips;

    // Legs & Pants
    const legGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.9, 16);
    const leftLeg = new THREE.Mesh(legGeo, pantsMat);
    leftLeg.position.set(-0.15, -0.45, 0);
    leftLeg.castShadow = true;
    hips.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, pantsMat);
    rightLeg.position.set(0.15, -0.45, 0);
    rightLeg.castShadow = true;
    hips.add(rightLeg);

    // Polished Oxford Shoes
    const shoeGeo = new THREE.BoxGeometry(0.12, 0.08, 0.24);
    const leftShoe = new THREE.Mesh(shoeGeo, shoesMat);
    leftShoe.position.set(-0.15, -0.9, 0.06);
    leftShoe.castShadow = true;
    hips.add(leftShoe);

    const rightShoe = new THREE.Mesh(shoeGeo, shoesMat);
    rightShoe.position.set(0.15, -0.9, 0.06);
    rightShoe.castShadow = true;
    hips.add(rightShoe);

    // Torso / Chest (Y = 1.35)
    const chest = new THREE.Group();
    chest.position.y = 0.35;
    hips.add(chest);
    this.chestBone = chest;
    this.proceduralBones['chest'] = chest;

    const jacketGeo = new THREE.CylinderGeometry(0.24, 0.2, 0.55, 16);
    const jacketMesh = new THREE.Mesh(jacketGeo, jacketMat);
    jacketMesh.position.y = 0.275;
    jacketMesh.castShadow = true;
    chest.add(jacketMesh);

    // White Shirt V-Neck
    const shirtGeo = new THREE.BoxGeometry(0.16, 0.3, 0.05);
    const shirtMesh = new THREE.Mesh(shirtGeo, shirtMat);
    shirtMesh.position.set(0, 0.38, 0.11);
    chest.add(shirtMesh);

    // Golden Silk Tie
    const tieGeo = new THREE.BoxGeometry(0.06, 0.28, 0.03);
    const tieMesh = new THREE.Mesh(tieGeo, tieMat);
    tieMesh.position.set(0, 0.34, 0.13);
    chest.add(tieMesh);

    // Golden Pocket Square
    const pocketSquare = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.025, 0.02), goldAccentMat);
    pocketSquare.position.set(-0.12, 0.42, 0.11);
    chest.add(pocketSquare);

    // Satin Tuxedo Lapels
    const leftLapel = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.32, 0.04), lapelMat);
    leftLapel.position.set(-0.09, 0.36, 0.12);
    leftLapel.rotation.z = -0.16;
    chest.add(leftLapel);

    const rightLapel = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.32, 0.04), lapelMat);
    rightLapel.position.set(0.09, 0.36, 0.12);
    rightLapel.rotation.z = 0.16;
    chest.add(rightLapel);

    // Neck & Head (Y = 1.9)
    const neck = new THREE.Group();
    neck.position.y = 0.6;
    chest.add(neck);

    const head = new THREE.Group();
    head.position.y = 0.12;
    neck.add(head);
    this.headBone = head;
    this.proceduralBones['head'] = head;

    const headMeshGeo = new THREE.SphereGeometry(0.13, 24, 20);
    headMeshGeo.scale(0.9, 1.15, 0.95);
    const headMesh = new THREE.Mesh(headMeshGeo, skinMat);
    headMesh.castShadow = true;
    head.add(headMesh);

    // Stylish Designer Glasses Frame
    const glassesMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.2,
    });
    const glassesMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.035), glassesMat);
    glassesMesh.position.set(0, 0.02, 0.12);
    head.add(glassesMesh);

    // Styled Volume Hair
    const hairGeo = new THREE.SphereGeometry(0.142, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.58);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.set(0, 0.04, -0.01);
    hairMesh.castShadow = true;
    head.add(hairMesh);

    // --- LEFT ARM HIERARCHY ---
    const leftUpperArm = new THREE.Group();
    leftUpperArm.position.set(-0.28, 0.48, 0);
    chest.add(leftUpperArm);
    this.leftArmBone = leftUpperArm;
    this.proceduralBones['leftUpperArm'] = leftUpperArm;

    const leftArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.32, 12), jacketMat);
    leftArmMesh.position.y = -0.16;
    leftArmMesh.castShadow = true;
    leftUpperArm.add(leftArmMesh);

    const leftForearm = new THREE.Group();
    leftForearm.position.y = -0.32;
    leftUpperArm.add(leftForearm);
    this.leftForearmBone = leftForearm;
    this.proceduralBones['leftForearm'] = leftForearm;

    const leftForearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.28, 12), jacketMat);
    leftForearmMesh.position.y = -0.14;
    leftForearmMesh.castShadow = true;
    leftForearm.add(leftForearmMesh);

    // Left Shirt Cuff & Gold Watch
    const leftCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.052, 0.04, 12), shirtMat);
    leftCuff.position.y = -0.27;
    leftForearm.add(leftCuff);

    const goldWatch = new THREE.Mesh(new THREE.TorusGeometry(0.054, 0.01, 8, 16), goldAccentMat);
    goldWatch.rotation.x = Math.PI / 2;
    goldWatch.position.y = -0.26;
    leftForearm.add(goldWatch);

    // Left Hand Bone
    const leftHand = new THREE.Group();
    leftHand.position.y = -0.28;
    leftForearm.add(leftHand);
    this.leftHandBone = leftHand;
    this.proceduralBones['leftHand'] = leftHand;

    const leftHandMesh = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), skinMat);
    leftHandMesh.scale.set(0.8, 1.2, 0.6);
    leftHandMesh.castShadow = true;
    leftHand.add(leftHandMesh);

    // --- RIGHT ARM HIERARCHY ---
    const rightUpperArm = new THREE.Group();
    rightUpperArm.position.set(0.28, 0.48, 0);
    chest.add(rightUpperArm);
    this.rightArmBone = rightUpperArm;
    this.proceduralBones['rightUpperArm'] = rightUpperArm;

    const rightArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.32, 12), jacketMat);
    rightArmMesh.position.y = -0.16;
    rightArmMesh.castShadow = true;
    rightUpperArm.add(rightArmMesh);

    const rightForearm = new THREE.Group();
    rightForearm.position.y = -0.32;
    rightUpperArm.add(rightForearm);
    this.rightForearmBone = rightForearm;
    this.proceduralBones['rightForearm'] = rightForearm;

    const rightForearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.28, 12), jacketMat);
    rightForearmMesh.position.y = -0.14;
    rightForearmMesh.castShadow = true;
    rightForearm.add(rightForearmMesh);

    // Right Shirt Cuff
    const rightCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.052, 0.04, 12), shirtMat);
    rightCuff.position.y = -0.27;
    rightForearm.add(rightCuff);

    // Right Hand Bone (Where ball & card attach)
    const rightHand = new THREE.Group();
    rightHand.position.y = -0.28;
    rightForearm.add(rightHand);
    this.rightHandBone = rightHand;
    this.proceduralBones['rightHand'] = rightHand;

    const rightHandMesh = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), skinMat);
    rightHandMesh.scale.set(0.8, 1.2, 0.6);
    rightHandMesh.castShadow = true;
    rightHand.add(rightHandMesh);

    this.group.add(presenterMeshGroup);
  }

  // 3. Floating 3D Nameplate Canvas
  private createNameplate(name: string, theme: PresenterTheme) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    this.nameplateCanvas = canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.drawNameplateCanvas(ctx, name, theme);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    this.nameplateTexture = texture;

    const geo = new THREE.PlaneGeometry(0.72, 0.18);
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = 'PresenterNameplate';
    mesh.position.set(0, 2.48, 0.05); // Floating clearly above presenter head (head top is ~2.23)
    mesh.renderOrder = 99;
    this.nameplateMesh = mesh;
    this.group.add(mesh);
  }

  private drawNameplateCanvas(ctx: CanvasRenderingContext2D, name: string, theme: PresenterTheme) {
    ctx.clearRect(0, 0, 512, 128);

    const isGold = theme === 'GOLD_IVORY';
    const primaryColor = isGold ? '#f59e0b' : '#38bdf8';
    const accentGrad = isGold ? ['#fbbf24', '#d97706'] : ['#38bdf8', '#2563eb'];

    // Background pill/card with dark backdrop
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 108, 24);
    ctx.fillStyle = 'rgba(2, 6, 23, 0.90)';
    ctx.fill();

    // Border glow
    const grad = ctx.createLinearGradient(10, 0, 502, 0);
    grad.addColorStop(0, accentGrad[0]);
    grad.addColorStop(1, accentGrad[1]);
    ctx.lineWidth = 4;
    ctx.strokeStyle = grad;
    ctx.stroke();

    // Subtitle badge
    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 20px Oswald, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(isGold ? '★ TRƯỞNG BAN TỔ CHỨC ★' : '★ PHÓ BAN TỔ CHỨC / KHÁCH MỜI ★', 256, 42);

    // Main MC Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Oswald, Arial, sans-serif';
    ctx.fillText(name.toUpperCase(), 256, 92);
    ctx.restore();
  }

  public setMcName(name: string) {
    this.mcName = name;
    if (this.nameplateCanvas && this.nameplateTexture) {
      const ctx = this.nameplateCanvas.getContext('2d');
      if (ctx) {
        this.drawNameplateCanvas(ctx, name, this.theme);
        this.nameplateTexture.needsUpdate = true;
      }
    }
  }

  // 4. Play Clip or Fallback Procedural Pose
  public playAction(actionName: string, duration: number = 0.5) {
    this.currentActionName = actionName;

    // If GLTF mixer is available and has this clip, crossfade
    if (this.mixer && this.actions[actionName]) {
      const nextAction = this.actions[actionName];
      nextAction.reset().fadeIn(duration).play();
      return;
    }

    // Procedural Fallback Animation with GSAP
    this.animateProceduralPose(actionName, duration);
  }

  private animateProceduralPose(poseName: string, duration: number) {
    const { chest, head, rightUpperArm, rightForearm, leftUpperArm, leftForearm } = this.proceduralBones;
    if (!chest || !head || !rightUpperArm || !rightForearm || !leftUpperArm || !leftForearm) return;

    switch (poseName) {
      case PRESENTER_ANIMATIONS.idle:
      default:
        // Natural resting standing pose
        gsap.to(head.rotation, { x: 0, y: 0, z: 0, duration, ease: 'power2.out' });
        gsap.to(chest.rotation, { x: 0, y: 0, z: 0, duration, ease: 'power2.out' });
        gsap.to(rightUpperArm.rotation, { x: 0.1, y: 0, z: -0.1, duration, ease: 'power2.out' });
        gsap.to(rightForearm.rotation, { x: 0.25, y: 0, z: 0, duration, ease: 'power2.out' });
        gsap.to(leftUpperArm.rotation, { x: 0.1, y: 0, z: 0.1, duration, ease: 'power2.out' });
        gsap.to(leftForearm.rotation, { x: 0.25, y: 0, z: 0, duration, ease: 'power2.out' });
        break;

      case 'applause':
      case 'cheer':
        // Both hands clapping in front of chest
        gsap.to(head.rotation, { x: 0.1, y: 0, z: 0, duration, ease: 'power2.out' });
        gsap.to(chest.rotation, { x: 0.05, y: 0, z: 0, duration, ease: 'power2.out' });
        gsap.to(rightUpperArm.rotation, { x: -0.65, y: -0.3, z: 0.2, duration, ease: 'power2.out' });
        gsap.to(rightForearm.rotation, { x: -0.85, y: 0.4, z: 0, duration, ease: 'power2.out' });
        gsap.to(leftUpperArm.rotation, { x: -0.65, y: 0.3, z: -0.2, duration, ease: 'power2.out' });
        gsap.to(leftForearm.rotation, { x: -0.85, y: -0.4, z: 0, duration, ease: 'power2.out' });
        break;

      case PRESENTER_ANIMATIONS.lookAtBowl:
        // Head tilts forward/down toward bowl
        gsap.to(head.rotation, { x: 0.35, y: 0, z: 0, duration, ease: 'power2.out' });
        gsap.to(chest.rotation, { x: 0.08, y: 0, z: 0, duration, ease: 'power2.out' });
        break;

      case PRESENTER_ANIMATIONS.reachBall:
        // Right arm extends down and forward into the bowl
        gsap.to(head.rotation, { x: 0.45, y: 0.1, z: 0, duration, ease: 'power2.out' });
        gsap.to(chest.rotation, { x: 0.15, y: 0.05, z: 0, duration, ease: 'power2.out' });
        gsap.to(rightUpperArm.rotation, { x: -0.95, y: -0.2, z: 0.2, duration, ease: 'power2.out' });
        gsap.to(rightForearm.rotation, { x: -0.35, y: 0, z: 0, duration, ease: 'power2.out' });
        break;

      case PRESENTER_ANIMATIONS.grabBall:
        // Hand grips ball in bowl
        gsap.to(rightUpperArm.rotation, { x: -1.05, y: -0.25, z: 0.22, duration: 0.3, ease: 'power2.out' });
        break;

      case PRESENTER_ANIMATIONS.takeBall:
      case PRESENTER_ANIMATIONS.openBall:
        // Both hands meet in front of chest holding the ball
        gsap.to(head.rotation, { x: 0.2, y: 0, z: 0, duration, ease: 'power2.out' });
        gsap.to(chest.rotation, { x: 0.02, y: 0, z: 0, duration, ease: 'power2.out' });
        gsap.to(rightUpperArm.rotation, { x: -0.65, y: -0.45, z: 0.3, duration, ease: 'power2.out' });
        gsap.to(rightForearm.rotation, { x: -0.75, y: 0.3, z: 0, duration, ease: 'power2.out' });
        gsap.to(leftUpperArm.rotation, { x: -0.65, y: 0.45, z: -0.3, duration, ease: 'power2.out' });
        gsap.to(leftForearm.rotation, { x: -0.75, y: -0.3, z: 0, duration, ease: 'power2.out' });
        break;

      case PRESENTER_ANIMATIONS.showCard:
        // Both hands hold card up at chest level facing camera
        gsap.to(head.rotation, { x: -0.04, y: 0, z: 0, duration, ease: 'power2.out' });
        gsap.to(chest.rotation, { x: 0, y: 0, z: 0, duration, ease: 'power2.out' });
        gsap.to(rightUpperArm.rotation, { x: -1.05, y: -0.22, z: 0.25, duration, ease: 'power2.out' });
        gsap.to(rightForearm.rotation, { x: -0.65, y: 0.15, z: -0.15, duration, ease: 'power2.out' });
        gsap.to(leftUpperArm.rotation, { x: -1.05, y: 0.22, z: -0.25, duration, ease: 'power2.out' });
        gsap.to(leftForearm.rotation, { x: -0.65, y: -0.15, z: 0.15, duration, ease: 'power2.out' });
        break;
    }
  }

  // 4. Attach Ball to Presenter Hand Bone
  public attachBallToHand(ballGroup: THREE.Group) {
    if (this.rightHandBone) {
      this.rightHandBone.attach(ballGroup);
      ballGroup.position.set(0, 0.05, 0.05);
    }
  }

  // 5. Attach Card to Presenter Dedicated Card Holder Anchor (Facing Camera)
  public attachCardToHand(cardMesh: THREE.Mesh) {
    this.cardHolderGroup.add(cardMesh);
    cardMesh.position.set(0, 0, 0);
    cardMesh.rotation.set(0, 0, 0);
    cardMesh.scale.set(1, 1, 1);
    cardMesh.visible = true;
  }

  // Render loop update
  public update(delta: number, camera?: THREE.Camera) {
    if (this.mixer) {
      this.mixer.update(delta);
    } else {
      // Subtle idle breathing on procedural rig
      const chest = this.proceduralBones['chest'];
      if (chest && this.currentActionName === PRESENTER_ANIMATIONS.idle) {
        chest.position.y = 0.35 + Math.sin(Date.now() * 0.002) * 0.004;
      }
    }

    // Nameplate floating and billboarding
    if (this.nameplateMesh) {
      this.nameplateMesh.position.y = 2.48 + Math.sin(Date.now() * 0.0025) * 0.015;
      if (camera) {
        const camPos = new THREE.Vector3();
        camera.getWorldPosition(camPos);
        this.nameplateMesh.lookAt(camPos);
      }
    }
  }
}
