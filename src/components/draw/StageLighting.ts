import * as THREE from 'three';
import gsap from 'gsap';

export class StageLighting {
  public group: THREE.Group;
  public spotLight: THREE.SpotLight;
  public spotLightTarget: THREE.Object3D;
  public dirLight: THREE.DirectionalLight;
  public hemiLight: THREE.HemisphereLight;
  public ambientLight: THREE.AmbientLight;
  public rimLight: THREE.DirectionalLight;
  public rimLightTarget: THREE.Object3D;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'StageLighting';

    // 1. Dramatic Presenter Spotlight
    this.spotLight = new THREE.SpotLight(0xffffff, 18, 30, Math.PI / 5, 0.45, 1.2);
    this.spotLight.position.set(0, 8, 4);
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;
    this.spotLight.shadow.bias = -0.001;

    this.spotLightTarget = new THREE.Object3D();
    this.spotLightTarget.position.set(0, 1.4, 0);
    this.spotLight.target = this.spotLightTarget;

    this.group.add(this.spotLight);
    this.group.add(this.spotLightTarget);

    // 2. Directional Key Light for soft depth shadows
    this.dirLight = new THREE.DirectionalLight(0xffffff, 3.2);
    this.dirLight.position.set(4, 7, 5);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.group.add(this.dirLight);

    // 3. Studio Ambient & Rim Hemisphere Light (Deep navy sky, dark ground)
    this.hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x0f172a, 1.8);
    this.hemiLight.position.set(0, 10, 0);
    this.group.add(this.hemiLight);

    // 4. Base ambient light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.group.add(this.ambientLight);

    // 5. Studio Rim Backlight (Accentuates shoulders, suit, and arms silhouette)
    this.rimLight = new THREE.DirectionalLight(0xa5f3fc, 3.2);
    this.rimLight.position.set(0, 4.5, -3.5);
    this.rimLightTarget = new THREE.Object3D();
    this.rimLightTarget.position.set(0, 1.5, 0);
    this.rimLight.target = this.rimLightTarget;
    this.group.add(this.rimLight);
    this.group.add(this.rimLightTarget);
  }

  // Smooth dimming when sequence begins
  public dimStageForDraw(dim: boolean, duration: number = 0.8) {
    gsap.to(this.ambientLight, {
      intensity: dim ? 0.4 : 1.2,
      duration,
      ease: 'power2.inOut',
    });

    gsap.to(this.hemiLight, {
      intensity: dim ? 0.7 : 1.6,
      duration,
      ease: 'power2.inOut',
    });

    gsap.to(this.spotLight, {
      intensity: dim ? 12 : 8,
      duration,
      ease: 'power2.inOut',
    });
  }

  // Focus spotlight onto a specific object (e.g. card or bowl)
  public focusSpotlight(targetPos: THREE.Vector3, intensity: number = 14, duration: number = 0.8) {
    gsap.to(this.spotLightTarget.position, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration,
      ease: 'power2.out',
    });

    gsap.to(this.spotLight, {
      intensity,
      duration,
      ease: 'power2.out',
    });
  }
}
