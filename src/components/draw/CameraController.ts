import * as THREE from 'three';
import gsap from 'gsap';
import { CameraPresetName, CameraPreset } from './DrawTypes';

export class CameraController {
  public camera: THREE.PerspectiveCamera;
  public lookAtTarget: THREE.Vector3;
  private currentPreset: CameraPresetName = 'wide';

  public presets: Record<CameraPresetName, CameraPreset> = {
    // 1. Wide Shot: View presenter, glass bowl, podium and stadium background
    wide: {
      position: new THREE.Vector3(0, 2.05, 3.8),
      target: new THREE.Vector3(0, 1.45, 0.1),
    },
    // 2. Medium Shot: Focus on presenter upper body and draw table
    presenter: {
      position: new THREE.Vector3(0, 1.95, 2.8),
      target: new THREE.Vector3(0, 1.55, 0.05),
    },
    // 3. Bowl Shot: Close-up on the glass bowl while balls are mixing
    bowl: {
      position: new THREE.Vector3(0.1, 1.6, 1.6),
      target: new THREE.Vector3(0, 1.2, 0.28),
    },
    // 4. Ball Shot: Close-up on presenter's hands opening the ball
    ball: {
      position: new THREE.Vector3(0, 1.75, 1.4),
      target: new THREE.Vector3(0, 1.55, 0.1),
    },
    // 5. Card Reveal Shot: Direct close-up on the card held up by presenter
    card: {
      position: new THREE.Vector3(0, 1.63, 0.88),
      target: new THREE.Vector3(0, 1.62, 0.07),
    },
  };

  private domElement: HTMLElement | null = null;
  private isDragging = false;
  private prevMouse = { x: 0, y: 0 };
  private touchStartDist = 0;

  constructor(camera: THREE.PerspectiveCamera, domElement?: HTMLElement | null) {
    this.camera = camera;
    this.lookAtTarget = this.presets.wide.target.clone();
    this.camera.position.copy(this.presets.wide.position);
    this.camera.lookAt(this.lookAtTarget);

    if (domElement) {
      this.bindEvents(domElement);
    }
  }

  public bindEvents(el: HTMLElement) {
    this.domElement = el;

    el.addEventListener('wheel', this.onWheel, { passive: false });
    el.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    el.addEventListener('dblclick', this.onDoubleClick);

    // Touch support (mobile / tablets)
    el.addEventListener('touchstart', this.onTouchStart, { passive: false });
    el.addEventListener('touchmove', this.onTouchMove, { passive: false });
    el.addEventListener('touchend', this.onTouchEnd);
  }

  // 1. Mouse Wheel Zoom In / Zoom Out
  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    gsap.killTweensOf(this.camera.position);

    // Zoom speed factor (deltaY > 0 is scroll down / zoom out, deltaY < 0 is scroll up / zoom in)
    const zoomDelta = e.deltaY * 0.002;
    const offset = this.camera.position.clone().sub(this.lookAtTarget);
    const currentDist = offset.length();

    // Clamp distance between 0.8m (close inspection) and 7.5m (wide arena view)
    const newDist = THREE.MathUtils.clamp(currentDist * (1 + zoomDelta), 0.8, 7.5);
    offset.setLength(newDist);

    this.camera.position.copy(this.lookAtTarget).add(offset);
    this.camera.lookAt(this.lookAtTarget);
  };

  // 2. Mouse Drag Orbit / Look Around
  private onMouseDown = (e: MouseEvent) => {
    this.isDragging = true;
    this.prevMouse = { x: e.clientX, y: e.clientY };
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isDragging) return;
    gsap.killTweensOf(this.camera.position);

    const dx = (e.clientX - this.prevMouse.x) * 0.005;
    const dy = (e.clientY - this.prevMouse.y) * 0.005;
    this.prevMouse = { x: e.clientX, y: e.clientY };

    const offset = this.camera.position.clone().sub(this.lookAtTarget);

    // Horizontal orbit (Yaw around Y axis)
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), -dx);

    // Vertical orbit (Pitch around local camera right axis)
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
    offset.applyAxisAngle(right, -dy);

    // Clamp vertical height so camera doesn't dip under the floor
    if (offset.y < 0.25) offset.y = 0.25;
    if (offset.y > 5.5) offset.y = 5.5;

    this.camera.position.copy(this.lookAtTarget).add(offset);
    this.camera.lookAt(this.lookAtTarget);
  };

  private onMouseUp = () => {
    this.isDragging = false;
  };

  // 3. Double Click to reset camera to current preset
  private onDoubleClick = () => {
    this.moveTo(this.currentPreset, 0.8);
  };

  // 4. Touch Controls (Pinch to zoom & single finger orbit)
  private onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      this.isDragging = true;
      this.prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      this.isDragging = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      this.touchStartDist = Math.hypot(dx, dy);
    }
  };

  private onTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 1 && this.isDragging) {
      e.preventDefault();
      gsap.killTweensOf(this.camera.position);

      const dx = (e.touches[0].clientX - this.prevMouse.x) * 0.006;
      const dy = (e.touches[0].clientY - this.prevMouse.y) * 0.006;
      this.prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      const offset = this.camera.position.clone().sub(this.lookAtTarget);
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), -dx);

      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
      offset.applyAxisAngle(right, -dy);

      if (offset.y < 0.25) offset.y = 0.25;
      if (offset.y > 5.5) offset.y = 5.5;

      this.camera.position.copy(this.lookAtTarget).add(offset);
      this.camera.lookAt(this.lookAtTarget);
    } else if (e.touches.length === 2) {
      e.preventDefault();
      gsap.killTweensOf(this.camera.position);

      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);

      if (this.touchStartDist > 0) {
        const factor = this.touchStartDist / dist;
        const offset = this.camera.position.clone().sub(this.lookAtTarget);
        const newDist = THREE.MathUtils.clamp(offset.length() * factor, 0.8, 7.5);
        offset.setLength(newDist);
        this.camera.position.copy(this.lookAtTarget).add(offset);
        this.camera.lookAt(this.lookAtTarget);
      }
      this.touchStartDist = dist;
    }
  };

  private onTouchEnd = () => {
    this.isDragging = false;
    this.touchStartDist = 0;
  };

  public moveTo(presetName: CameraPresetName, duration: number = 1.0, ease: string = 'power3.inOut') {
    this.currentPreset = presetName;
    const targetConfig = this.presets[presetName];

    // Animate camera position
    gsap.to(this.camera.position, {
      x: targetConfig.position.x,
      y: targetConfig.position.y,
      z: targetConfig.position.z,
      duration,
      ease,
      overwrite: 'auto',
    });

    // Animate camera lookAt vector
    gsap.to(this.lookAtTarget, {
      x: targetConfig.target.x,
      y: targetConfig.target.y,
      z: targetConfig.target.z,
      duration,
      ease,
      overwrite: 'auto',
      onUpdate: () => {
        this.camera.lookAt(this.lookAtTarget);
      },
    });
  }

  public moveToCustom(pos: THREE.Vector3, target: THREE.Vector3, duration: number = 1.0, ease: string = 'power3.inOut') {
    gsap.to(this.camera.position, {
      x: pos.x,
      y: pos.y,
      z: pos.z,
      duration,
      ease,
      overwrite: 'auto',
    });

    gsap.to(this.lookAtTarget, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration,
      ease,
      overwrite: 'auto',
      onUpdate: () => {
        this.camera.lookAt(this.lookAtTarget);
      },
    });
  }

  public getCurrentPreset(): CameraPresetName {
    return this.currentPreset;
  }

  public update() {
    this.camera.lookAt(this.lookAtTarget);
  }

  // Cleanup listeners
  public dispose() {
    if (this.domElement) {
      this.domElement.removeEventListener('wheel', this.onWheel);
      this.domElement.removeEventListener('mousedown', this.onMouseDown);
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);
      this.domElement.removeEventListener('dblclick', this.onDoubleClick);
      this.domElement.removeEventListener('touchstart', this.onTouchStart);
      this.domElement.removeEventListener('touchmove', this.onTouchMove);
      this.domElement.removeEventListener('touchend', this.onTouchEnd);
    }
  }
}
