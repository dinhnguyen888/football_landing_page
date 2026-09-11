import * as THREE from 'three';
import { DrawTeam } from './DrawTypes';

export class ResultCardMesh {
  public mesh: THREE.Mesh;
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public texture: THREE.CanvasTexture;

  constructor() {
    // 1. Create high-resolution 1280x720 canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1280;
    this.canvas.height = 720;
    this.ctx = this.canvas.getContext('2d')!;

    // 2. Setup CanvasTexture
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.generateMipmaps = false;

    // 3. Card Geometry & Material (Thin card with subtle thickness)
    const cardGeo = new THREE.BoxGeometry(0.54, 0.32, 0.008);
    const cardMat = new THREE.MeshStandardMaterial({
      map: this.texture,
      roughness: 0.15,
      metalness: 0.1,
      side: THREE.DoubleSide,
      emissive: 0xffffff,
      emissiveMap: this.texture,
      emissiveIntensity: 0.45,
    });

    this.mesh = new THREE.Mesh(cardGeo, cardMat);
    this.mesh.name = 'ResultCardMesh';
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.visible = false;

    // Draw blank initially
    this.drawBlank();
  }

  // Draw initial blank state before name reveal
  public drawBlank() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Clean luxury silver background with radial glow
    const grad = ctx.createRadialGradient(w / 2, h / 2, 60, w / 2, h / 2, w / 1.5);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.65, '#f1f5f9');
    grad.addColorStop(1, '#e2e8f0');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Gold borders
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#d97706';
    ctx.strokeRect(10, 10, w - 20, h - 20);

    ctx.lineWidth = 6;
    ctx.strokeStyle = '#fbbf24';
    ctx.strokeRect(26, 26, w - 52, h - 52);

    // Subtle watermark logo
    ctx.fillStyle = '#64748b';
    ctx.font = '900 34px "Oswald", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★ OFFICIAL TOURNAMENT LIVE DRAW ★', w / 2, h / 2);

    this.texture.needsUpdate = true;
  }

  // Draw full team details when REVEALING
  public updateContent(team: DrawTeam, tournamentName: string, destinationLabel?: string) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // 1. Background: Clean luxury pearlescent silver-white gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#f8fafc');
    grad.addColorStop(1, '#e2e8f0');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // 2. Luxury Gold & Cyan Frame
    ctx.lineWidth = 22;
    ctx.strokeStyle = '#d97706';
    ctx.strokeRect(11, 11, w - 22, h - 22);

    ctx.lineWidth = 6;
    ctx.strokeStyle = '#fbbf24';
    ctx.strokeRect(30, 30, w - 60, h - 60);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#0284c7';
    ctx.strokeRect(42, 42, w - 84, h - 84);

    // 3. Top Ribbon: Tournament Title & Seed Pot Badge
    ctx.fillStyle = '#091325';
    ctx.beginPath();
    ctx.roundRect(55, 52, w - 110, 68, 14);
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 28px "Oswald", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`🏆 ${tournamentName.toUpperCase()}`, 80, 86);

    // Pot Pill Badge on Right
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.roundRect(w - 230, 62, 150, 48, 10);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px "Oswald", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`POT ${team.pot}`, w - 155, 86);

    // 4. Team Crest / Shield Avatar
    const avatarX = w / 2;
    const avatarY = 240;
    const avatarR = 82;

    // Glowing circle
    const avatarGrad = ctx.createLinearGradient(avatarX - avatarR, avatarY - avatarR, avatarX + avatarR, avatarY + avatarR);
    avatarGrad.addColorStop(0, '#0284c7');
    avatarGrad.addColorStop(1, '#0369a1');

    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
    ctx.fillStyle = avatarGrad;
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();

    // Initials inside avatar
    const initials = team.name.slice(0, 2).toUpperCase();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 64px "Oswald", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, avatarX, avatarY + 3);
    ctx.restore();

    // 5. Main Team Name (Very Large, Ultra-Bold, Maximum Readability)
    ctx.fillStyle = '#020617';
    let fontSize = 72;
    const displayName = team.name.toUpperCase();
    if (displayName.length > 20) fontSize = 56;
    if (displayName.length > 28) fontSize = 46;

    ctx.font = `900 ${fontSize}px "Oswald", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(displayName, w / 2, 420);

    // 6. Club / League Subtitle
    if (team.club) {
      ctx.fillStyle = '#475569';
      ctx.font = '700 34px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText(team.club, w / 2, 480);
    }

    // 7. Destination Banner (Bảng Đấu Đích)
    if (destinationLabel) {
      const bannerW = 600;
      const bannerH = 74;
      const bannerX = (w - bannerW) / 2;
      const bannerY = 560;

      const badgeGrad = ctx.createLinearGradient(bannerX, bannerY, bannerX + bannerW, bannerY);
      badgeGrad.addColorStop(0, '#0369a1');
      badgeGrad.addColorStop(1, '#0284c7');

      ctx.fillStyle = badgeGrad;
      ctx.beginPath();
      ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 16);
      ctx.fill();

      ctx.lineWidth = 4;
      ctx.strokeStyle = '#38bdf8';
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 34px "Oswald", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`➡️ ${destinationLabel.toUpperCase()}`, w / 2, bannerY + bannerH / 2);
    }

    this.texture.needsUpdate = true;
  }
}
