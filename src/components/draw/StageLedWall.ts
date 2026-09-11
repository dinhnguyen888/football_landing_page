import * as THREE from 'three';
import { DrawGroup } from './DrawTypes';

export class StageLedWall {
  public mesh: THREE.Mesh;
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public texture: THREE.CanvasTexture;
  private frameMesh: THREE.Mesh;
  public group: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'StageLedWallGroup';

    // 1. Setup 2K Canvas (2048 x 1024)
    this.canvas = document.createElement('canvas');
    this.canvas.width = 2048;
    this.canvas.height = 1024;
    this.ctx = this.canvas.getContext('2d')!;

    // 2. Setup Texture
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.generateMipmaps = false;

    // 3. Curved LED Screen Mesh (Width: 8.8m, Height: 3.8m)
    // We bend the plane vertices smoothly to form a concave curved stadium display
    const segX = 32;
    const segY = 4;
    const screenW = 8.8;
    const screenH = 3.8;
    const screenGeo = new THREE.PlaneGeometry(screenW, screenH, segX, segY);

    const posAttr = screenGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      // Parabolic forward curve along Z (edges curve forward ~0.75m towards camera)
      const z = -(x * x) * 0.038;
      posAttr.setZ(i, z);
    }
    screenGeo.computeVertexNormals();

    const screenMat = new THREE.MeshStandardMaterial({
      map: this.texture,
      roughness: 0.35,
      metalness: 0.15,
      emissive: 0xffffff,
      emissiveMap: this.texture,
      emissiveIntensity: 0.8, // Radiant stadium LED luminescence
      side: THREE.FrontSide,
    });

    this.mesh = new THREE.Mesh(screenGeo, screenMat);
    this.mesh.name = 'LedScreenDisplay';
    this.mesh.receiveShadow = false;
    this.group.add(this.mesh);

    // 4. Outer Bezel / Metallic Frame
    const frameGeo = new THREE.PlaneGeometry(screenW + 0.18, screenH + 0.18, segX, segY);
    const framePosAttr = frameGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < framePosAttr.count; i++) {
      const x = framePosAttr.getX(i);
      const z = -(x * x) * 0.038 - 0.015;
      framePosAttr.setZ(i, z);
    }
    frameGeo.computeVertexNormals();

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x050b18,
      metalness: 0.9,
      roughness: 0.2,
    });
    this.frameMesh = new THREE.Mesh(frameGeo, frameMat);
    this.frameMesh.name = 'LedScreenFrame';
    this.group.add(this.frameMesh);

    // Position behind MC (MC is at z = -0.25, table at z = 0.28)
    // Wall center at z = -2.6, height centered at y = 2.45
    this.group.position.set(0, 2.45, -2.6);

    // Render initial blank state
    this.drawInitial('UEFA CHAMPIONS LEAGUE DRAW 2026/27');
  }

  // Draw initial empty state
  public drawInitial(title: string) {
    this.update([], title);
  }

  // Render Live Groups Standings on the 2048 x 1024 Canvas
  public update(groups: DrawGroup[], tournamentTitle: string) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // 1. Dark Stadium LED Glass Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#040b1a');
    bgGrad.addColorStop(0.5, '#071530');
    bgGrad.addColorStop(1, '#020713');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle Hexagonal / Dot Matrix LED Pattern Grid
    ctx.fillStyle = 'rgba(255, 255, 255, 0.018)';
    const dotSpacing = 28;
    for (let x = 0; x < w; x += dotSpacing) {
      for (let y = 0; y < h; y += dotSpacing) {
        ctx.fillRect(x, y, 2, 2);
      }
    }

    // 2. Top Header Bar (Height: 120px)
    const headerH = 110;
    const headerGrad = ctx.createLinearGradient(0, 0, w, 0);
    headerGrad.addColorStop(0, 'rgba(2, 6, 23, 0.95)');
    headerGrad.addColorStop(0.5, 'rgba(15, 29, 58, 0.95)');
    headerGrad.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
    ctx.fillStyle = headerGrad;
    ctx.fillRect(0, 0, w, headerH);

    // Glowing Bottom Border on Header
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(0, headerH);
    ctx.lineTo(w, headerH);
    ctx.stroke();

    // Red LIVE Badge on Left
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(45, 30, 160, 50, 12);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px "Oswald", -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('● LIVE DRAW', 125, 55);

    // Center Tournament Title
    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 46px "Oswald", -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🏆 ${tournamentTitle.toUpperCase()}`, w / 2, 45);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 20px "Oswald", -apple-system, sans-serif';
    ctx.fillText('OFFICIAL LIVE GROUP STAGE STANDINGS BOARD', w / 2, 85);

    // Teams Drawn Count on Right
    const totalSlots = groups.reduce((acc, g) => acc + g.slots.length, 0) || 16;
    const filledSlots = groups.reduce((acc, g) => acc + g.slots.filter((s) => s.team !== null).length, 0);

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(w - 245, 30, 200, 50, 12);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#38bdf8';
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = '900 22px "Oswald", -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`TEAMS: ${filledSlots}/${totalSlots}`, w - 145, 55);

    // 3. Render Groups Columns
    const groupCount = Math.max(groups.length, 4);
    const isCompact = groupCount > 4;
    const paddingX = isCompact ? 26 : 40;
    const gapX = isCompact ? 14 : 24;
    const availableW = w - paddingX * 2 - gapX * (groupCount - 1);
    const colW = availableW / groupCount;
    const topY = 135;
    const colH = h - topY - 35;

    // Palette for Group Themes (A: Cyan, B: Gold, C: Emerald, D: Violet/Rose)
    const groupThemes = [
      { primary: '#0284c7', glow: '#38bdf8', bg: 'rgba(2, 132, 199, 0.18)', badge: '#0369a1' },
      { primary: '#d97706', glow: '#fbbf24', bg: 'rgba(217, 119, 6, 0.18)', badge: '#b45309' },
      { primary: '#059669', glow: '#34d399', bg: 'rgba(5, 150, 105, 0.18)', badge: '#047857' },
      { primary: '#7c3aed', glow: '#a78bfa', bg: 'rgba(124, 58, 237, 0.18)', badge: '#6d28d9' },
      { primary: '#db2777', glow: '#f472b6', bg: 'rgba(219, 39, 119, 0.18)', badge: '#be185d' },
      { primary: '#ea580c', glow: '#fb923c', bg: 'rgba(234, 88, 12, 0.18)', badge: '#c2410c' },
    ];

    for (let gIdx = 0; gIdx < groupCount; gIdx++) {
      const g = groups[gIdx];
      const theme = groupThemes[gIdx % groupThemes.length];
      const colX = paddingX + gIdx * (colW + gapX);

      // Column Outer Card
      ctx.fillStyle = 'rgba(7, 17, 38, 0.88)';
      ctx.beginPath();
      ctx.roundRect(colX, topY, colW, colH, 18);
      ctx.fill();

      ctx.lineWidth = 3;
      ctx.strokeStyle = theme.primary;
      ctx.stroke();

      // Group Header (Top of each column)
      const headerBoxH = isCompact ? 62 : 75;
      const colHeaderGrad = ctx.createLinearGradient(colX, topY, colX + colW, topY);
      colHeaderGrad.addColorStop(0, theme.primary);
      colHeaderGrad.addColorStop(1, theme.badge);
      ctx.fillStyle = colHeaderGrad;
      ctx.beginPath();
      ctx.roundRect(colX, topY, colW, headerBoxH, [18, 18, 0, 0]);
      ctx.fill();

      // Group Letter Icon
      const letter = g ? String.fromCharCode(65 + gIdx) : String.fromCharCode(65 + gIdx);
      const groupName = g ? g.name : `BẢNG ${letter}`;

      ctx.fillStyle = '#ffffff';
      ctx.font = isCompact ? '900 24px "Oswald", -apple-system, sans-serif' : '900 36px "Oswald", -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(groupName.toUpperCase(), colX + (isCompact ? 14 : 24), topY + headerBoxH / 2);

      const filledInGroup = g ? g.slots.filter((s) => s.team !== null).length : 0;
      const totalInGroup = g ? g.slots.length : 4;
      ctx.fillStyle = '#fef08a';
      ctx.font = isCompact ? '900 18px "Oswald", -apple-system, sans-serif' : '900 24px "Oswald", -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${filledInGroup}/${totalInGroup}`, colX + colW - (isCompact ? 14 : 24), topY + headerBoxH / 2);

      // Render Slots Inside Column
      const slotCount = g ? g.slots.length : 4;
      const slotStartY = topY + headerBoxH + (isCompact ? 12 : 16);
      const slotGap = isCompact ? 8 : 12;
      const slotH = (colH - headerBoxH - (isCompact ? 24 : 32) - slotGap * (slotCount - 1)) / slotCount;

      const slotPaddingX = isCompact ? 8 : 12;
      const sBoxW = colW - slotPaddingX * 2;
      const pillW = isCompact ? 36 : 48;
      const pillH = isCompact ? 28 : 36;
      const potW = isCompact ? 36 : 48;
      const potH = isCompact ? 26 : 32;

      for (let sIdx = 0; sIdx < slotCount; sIdx++) {
        const slot = g?.slots[sIdx];
        const slotY = slotStartY + sIdx * (slotH + slotGap);
        const team = slot?.team || null;
        const isJustSlotted = slot?.isJustSlotted || false;
        const sBoxX = colX + slotPaddingX;

        ctx.save();

        // 1. Slot Box Background & Border
        if (team) {
          if (isJustSlotted) {
            ctx.fillStyle = 'rgba(245, 158, 11, 0.45)';
            ctx.beginPath();
            ctx.roundRect(sBoxX, slotY, sBoxW, slotH, 10);
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#fef08a';
            ctx.stroke();
          } else {
            ctx.fillStyle = 'rgba(15, 29, 58, 0.95)';
            ctx.beginPath();
            ctx.roundRect(sBoxX, slotY, sBoxW, slotH, 10);
            ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
            ctx.stroke();
          }

          // Left Accent Stripe
          ctx.fillStyle = theme.glow;
          ctx.beginPath();
          ctx.roundRect(sBoxX, slotY, 5, slotH, [10, 0, 0, 10]);
          ctx.fill();
        } else {
          ctx.fillStyle = 'rgba(2, 6, 23, 0.65)';
          ctx.beginPath();
          ctx.roundRect(sBoxX, slotY, sBoxW, slotH, 10);
          ctx.fill();

          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // 2. Strict Clip inside slot to eliminate any possibility of overflowing
        ctx.beginPath();
        ctx.roundRect(sBoxX, slotY, sBoxW, slotH, 10);
        ctx.clip();

        // 3. Position Pill (e.g. A1, B2)
        const pillX = sBoxX + (isCompact ? 8 : 14);
        const pillY = slotY + (slotH - pillH) / 2;
        ctx.fillStyle = team ? theme.badge : 'rgba(30, 41, 59, 0.8)';
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 6);
        ctx.fill();

        ctx.fillStyle = team ? '#ffffff' : '#64748b';
        ctx.font = isCompact ? '900 16px "Oswald", -apple-system, sans-serif' : '900 20px "Oswald", -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(slot ? slot.positionName : `${letter}${sIdx + 1}`, pillX + pillW / 2, slotY + slotH / 2);

        if (team) {
          // 4. Pot Tag on Right
          const potX = sBoxX + sBoxW - potW - (isCompact ? 6 : 10);
          const potY = slotY + (slotH - potH) / 2;
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.roundRect(potX, potY, potW, potH, 6);
          ctx.fill();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = '#f59e0b';
          ctx.stroke();

          ctx.fillStyle = '#fbbf24';
          ctx.font = isCompact ? '900 14px "Oswald", -apple-system, sans-serif' : '900 18px "Oswald", -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`P${team.pot}`, potX + potW / 2, slotY + slotH / 2);

          // 5. Team Name (Auto-fitted and truncated if necessary)
          const textStartX = pillX + pillW + (isCompact ? 8 : 14);
          const maxNameW = Math.max(30, potX - textStartX - 8);

          ctx.fillStyle = '#ffffff';
          ctx.font = isCompact ? '900 17px "Oswald", -apple-system, sans-serif' : '900 25px "Oswald", -apple-system, sans-serif';
          ctx.textAlign = 'left';

          let tName = team.name.toUpperCase();
          while (tName.length > 2 && ctx.measureText(tName).width > maxNameW) {
            tName = tName.slice(0, -1);
          }
          if (tName !== team.name.toUpperCase()) {
            tName = tName.trim() + '…';
          }

          const hasClub = Boolean(team.club && !isCompact);
          ctx.fillText(tName, textStartX, hasClub ? slotY + slotH / 2 - 10 : slotY + slotH / 2);

          // Club / Subtitle (shown only when enough space)
          if (hasClub && team.club) {
            ctx.fillStyle = '#94a3b8';
            ctx.font = '700 15px "Inter", -apple-system, sans-serif';
            let clubText = team.club;
            while (clubText.length > 2 && ctx.measureText(clubText).width > maxNameW) {
              clubText = clubText.slice(0, -1);
            }
            if (clubText !== team.club) clubText = clubText.trim() + '…';
            ctx.fillText(clubText, textStartX, slotY + slotH / 2 + 14);
          }
        } else {
          // 6. Empty Placeholder (Clean, fits properly inside bounds)
          const textStartX = pillX + pillW + (isCompact ? 8 : 14);
          const maxPlaceholderW = Math.max(30, sBoxX + sBoxW - textStartX - 8);

          ctx.fillStyle = '#475569';
          ctx.font = isCompact ? '700 15px "Oswald", -apple-system, sans-serif' : '700 20px "Oswald", -apple-system, sans-serif';
          ctx.textAlign = 'left';

          const placeholderText = isCompact ? '— CHỜ BỐC —' : '— CHƯA XÁC ĐỊNH —';
          let pText = placeholderText;
          while (pText.length > 2 && ctx.measureText(pText).width > maxPlaceholderW) {
            pText = pText.slice(0, -1);
          }
          if (pText !== placeholderText) pText = pText.trim() + '…';
          ctx.fillText(pText, textStartX, slotY + slotH / 2);
        }

        ctx.restore();
      }
    }

    this.texture.needsUpdate = true;
  }
}
