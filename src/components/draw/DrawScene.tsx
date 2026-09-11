import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { CameraController } from './CameraController';
import { StageLighting } from './StageLighting';
import { LotteryBowl } from './LotteryBowl';
import { PresenterRig } from './PresenterRig';
import { ResultCardMesh } from './ResultCardMesh';
import { ParticleSparkles } from './ParticleSparkles';
import { StageLedWall } from './StageLedWall';
import { FootballStageDecor } from './FootballStageDecor';
import { DrawState, CameraPresetName, DrawTeam, DrawGroup, PRESENTER_ANIMATIONS } from './DrawTypes';

export interface DrawSceneHandle {
  executeSequence: (
    team: DrawTeam,
    tournamentTitle: string,
    destinationLabel: string,
    onStateChange: (state: DrawState) => void,
    onComplete: () => void,
    activePresenterIndex?: 1 | 2
  ) => void;
  setCameraPreset: (preset: CameraPresetName) => void;
  playPresenterAction: (actionName: string, presenterIndex?: 1 | 2) => void;
  toggleSpotlight: () => void;
  resetScene: () => void;
  updateLedBoard: (groups: DrawGroup[], title?: string) => void;
  setDualMode: (isDual: boolean, mc1Name?: string, mc2Name?: string) => void;
  updateMcNames: (mc1Name?: string, mc2Name?: string) => void;
}

interface DrawSceneProps {
  onHandleReady: (handle: DrawSceneHandle) => void;
  tournamentTitle: string;
  groups?: DrawGroup[];
  isDualMode?: boolean;
  mc1Name?: string;
  mc2Name?: string;
}

export const DrawScene: React.FC<DrawSceneProps> = ({
  onHandleReady,
  tournamentTitle,
  groups = [],
  isDualMode = false,
  mc1Name = 'MC PHAN LONG',
  mc2Name = 'MC MINH QUÂN',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // References to Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraControllerRef = useRef<CameraController | null>(null);
  const lightingRef = useRef<StageLighting | null>(null);
  const bowlRef = useRef<LotteryBowl | null>(null);
  const presenterRef = useRef<PresenterRig | null>(null);
  const presenter2Ref = useRef<PresenterRig | null>(null);
  const isDualModeRef = useRef<boolean>(isDualMode);
  const cardRef = useRef<ResultCardMesh | null>(null);
  const sparklesRef = useRef<ParticleSparkles | null>(null);
  const ledWallRef = useRef<StageLedWall | null>(null);
  const stageDecorRef = useRef<FootballStageDecor | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const onHandleReadyRef = useRef(onHandleReady);
  onHandleReadyRef.current = onHandleReady;

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.045);
    sceneRef.current = scene;

    // 2. Camera Setup
    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const cameraController = new CameraController(camera, canvasRef.current);
    cameraControllerRef.current = cameraController;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    // 4. Stage Environment & Ground Floor
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x071126,
      roughness: 0.2,
      metalness: 0.8,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Subtle stage circular ring lines on floor
    const floorRingGeo = new THREE.RingGeometry(1.8, 1.84, 64);
    const floorRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const floorRingMesh = new THREE.Mesh(floorRingGeo, floorRingMat);
    floorRingMesh.rotation.x = -Math.PI / 2;
    floorRingMesh.position.y = 0.005;
    scene.add(floorRingMesh);

    // 4b. Authentic UEFA Football Stage Atmosphere (Pitch Turf, 3D Gold Trophy, Match Ball Plinth, Floodlight Towers, Perimeter LED)
    const footballDecor = new FootballStageDecor();
    stageDecorRef.current = footballDecor;
    scene.add(footballDecor.group);

    // Curved LED Wall Background (Live Groups Standings Display)
    const ledWall = new StageLedWall();
    ledWallRef.current = ledWall;
    scene.add(ledWall.group);
    if (groups && groups.length > 0) {
      ledWall.update(groups, tournamentTitle);
    }

    // 5. Lighting
    const lighting = new StageLighting();
    lightingRef.current = lighting;
    scene.add(lighting.group);

    // 6. Lottery Bowl & Table
    const lotteryBowl = new LotteryBowl();
    bowlRef.current = lotteryBowl;
    lotteryBowl.group.position.set(0, 0, 0.28);
    scene.add(lotteryBowl.group);

    // 7. Presenter Rigs (MC 1 - Gold/Ivory & MC 2 - Royal Navy)
    const initialDual = Boolean(isDualMode);
    isDualModeRef.current = initialDual;

    const presenter1 = new PresenterRig({
      position: initialDual ? new THREE.Vector3(-0.65, 0, -0.25) : new THREE.Vector3(0, 0, -0.25),
      rotationY: initialDual ? -0.15 : 0,
      scale: 1.05,
      theme: 'GOLD_IVORY',
      mcName: mc1Name,
    });
    presenterRef.current = presenter1;
    scene.add(presenter1.group);

    const presenter2 = new PresenterRig({
      position: new THREE.Vector3(0.65, 0, -0.25),
      rotationY: 0.15,
      scale: 1.05,
      theme: 'ROYAL_NAVY',
      mcName: mc2Name,
    });
    presenter2.group.visible = initialDual;
    presenter2Ref.current = presenter2;
    scene.add(presenter2.group);

    // 8. Result Card Mesh
    const resultCard = new ResultCardMesh();
    cardRef.current = resultCard;
    scene.add(resultCard.mesh);

    // 9. Floating Stage Sparkles
    const sparkles = new ParticleSparkles();
    sparklesRef.current = sparkles;
    scene.add(sparkles.points);

    // --- RENDER LOOP ---
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      cameraController.update();
      lotteryBowl.update(delta);
      presenter1.update(delta, camera);
      if (presenter2.group.visible) {
        presenter2.update(delta, camera);
      }
      sparkles.update(delta);
      footballDecor.update(delta);

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraControllerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraControllerRef.current.camera.aspect = w / h;
      cameraControllerRef.current.camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Expose Handle to Parent
    const handle: DrawSceneHandle = {
      executeSequence: (
        team,
        tournamentName,
        destinationLabel,
        onStateChange,
        onComplete,
        activePresenterIndex = 1
      ) => {
        const bowl = bowlRef.current;
        const pres1 = presenterRef.current;
        const pres2 = presenter2Ref.current;
        const cam = cameraControllerRef.current;
        const card = cardRef.current;
        const light = lightingRef.current;
        if (!bowl || !pres1 || !cam || !card || !light) return;

        const isDual = isDualModeRef.current && Boolean(pres2?.group.visible);
        const activePres = (isDual && activePresenterIndex === 2 && pres2) ? pres2 : pres1;
        const idlePres = (isDual && activePresenterIndex === 2) ? pres1 : (isDual ? pres2 : null);

        // Reset any previous state
        bowl.resetBall();
        card.mesh.visible = false;
        card.drawBlank();

        const tl = gsap.timeline();

        // 0.0s: CAMERA_FOCUS (Camera moves to active presenter, stage dims slightly)
        tl.call(() => {
          onStateChange('CAMERA_FOCUS');
          if (isDual) {
            const focusTarget = activePres.group.position.clone().add(new THREE.Vector3(0, 1.55, 0));
            const focusCamPos = activePres.group.position.clone().add(new THREE.Vector3(0, 1.95, 2.3));
            cam.moveToCustom(focusCamPos, focusTarget, 1.0);
          } else {
            cam.moveTo('presenter', 1.0);
          }
          light.dimStageForDraw(true, 1.0);
          activePres.playAction(PRESENTER_ANIMATIONS.lookAtBowl, 0.8);
          if (idlePres) idlePres.playAction(PRESENTER_ANIMATIONS.lookAtBowl, 0.8);
        });

        // 1.2s: MIXING (Camera zooms to bowl, balls swirl and tumble)
        tl.call(
          () => {
            onStateChange('MIXING');
            cam.moveTo('bowl', 0.9);
            bowl.startMixing(1.6);
          },
          undefined,
          '+=1.2'
        );

        // 2.8s: REACHING (Active Presenter looks down and reaches hand into bowl)
        tl.call(
          () => {
            onStateChange('REACHING');
            activePres.playAction(PRESENTER_ANIMATIONS.reachBall, 0.9);
          },
          undefined,
          '+=1.6'
        );

        // 3.8s: GRABBING (Hand touches ball, ball attaches to hand!)
        tl.call(
          () => {
            onStateChange('GRABBING');
            activePres.playAction(PRESENTER_ANIMATIONS.grabBall, 0.4);
            // Synchronize Ball to Hand
            activePres.attachBallToHand(bowl.activeBall);
          },
          undefined,
          '+=1.0'
        );

        // 4.5s: TAKING_BALL & OPENING_BALL (Presenter lifts ball up in front of chest)
        tl.call(
          () => {
            onStateChange('OPENING_BALL');
            if (isDual) {
              const ballCamPos = activePres.group.position.clone().add(new THREE.Vector3(0, 1.75, 1.4));
              const ballTarget = activePres.group.position.clone().add(new THREE.Vector3(0, 1.55, 0.1));
              cam.moveToCustom(ballCamPos, ballTarget, 0.8);
            } else {
              cam.moveTo('ball', 0.8);
            }
            activePres.playAction(PRESENTER_ANIMATIONS.openBall, 0.9);
            bowl.openBall(0.7);
          },
          undefined,
          '+=0.7'
        );

        // 5.8s: TAKING_CARD (Card extracted between hands)
        tl.call(
          () => {
            onStateChange('TAKING_CARD');
            activePres.playAction(PRESENTER_ANIMATIONS.takeCard, 0.6);
            card.mesh.visible = true;
            activePres.attachCardToHand(card.mesh);
            card.mesh.scale.set(0.1, 0.1, 0.1);
            gsap.to(card.mesh.scale, { x: 1, y: 1, z: 1, duration: 0.6, ease: 'back.out(1.4)' });
          },
          undefined,
          '+=1.3'
        );

        // 6.8s: OPENING_CARD
        tl.call(
          () => {
            onStateChange('OPENING_CARD');
            activePres.playAction(PRESENTER_ANIMATIONS.openCard, 0.5);
          },
          undefined,
          '+=1.0'
        );

        // 7.4s: SHOWING_CARD & REVEALING (Presenter holds card up facing camera)
        tl.call(
          () => {
            onStateChange('SHOWING_CARD');
            if (isDual) {
              const cardCamPos = activePres.group.position.clone().add(new THREE.Vector3(0, 1.63, 0.88));
              const cardTarget = activePres.group.position.clone().add(new THREE.Vector3(0, 1.62, 0.07));
              cam.moveToCustom(cardCamPos, cardTarget, 0.8);
            } else {
              cam.moveTo('card', 0.8);
            }
            activePres.playAction(PRESENTER_ANIMATIONS.showCard, 0.8);

            // Co-presenter claps in admiration!
            if (idlePres) {
              idlePres.playAction('applause', 0.5);
            }

            // Focus stage spotlight directly on card's world position
            const cardPos = new THREE.Vector3();
            card.mesh.getWorldPosition(cardPos);
            light.focusSpotlight(cardPos, 16, 0.8);
          },
          undefined,
          '+=0.6'
        );

        // 8.2s: REVEALING RESULT TEXT ON CARD & LOWER-THIRD
        tl.call(
          () => {
            onStateChange('REVEALING');
            card.updateContent(team, tournamentName || tournamentTitle, destinationLabel);
          },
          undefined,
          '+=0.8'
        );

        // 11.8s: RETURNING (Zoom camera out, presenter lowers card, reset)
        tl.call(
          () => {
            onStateChange('RETURNING');
            cam.moveTo('wide', 1.2);
            light.dimStageForDraw(false, 1.2);
            activePres.playAction(PRESENTER_ANIMATIONS.returnIdle, 1.0);
            if (idlePres) idlePres.playAction(PRESENTER_ANIMATIONS.returnIdle, 1.0);

            gsap.to(card.mesh.scale, {
              x: 0.001,
              y: 0.001,
              z: 0.001,
              duration: 0.6,
              onComplete: () => {
                card.mesh.visible = false;
                bowl.group.attach(bowl.activeBall);
                bowl.resetBall();
              },
            });
          },
          undefined,
          '+=3.6'
        );

        // 13.2s: Finished sequence
        tl.call(
          () => {
            activePres.playAction(PRESENTER_ANIMATIONS.idle, 0.5);
            if (idlePres) idlePres.playAction(PRESENTER_ANIMATIONS.idle, 0.5);
            onComplete();
          },
          undefined,
          '+=1.4'
        );
      },

      setCameraPreset: (preset) => {
        cameraControllerRef.current?.moveTo(preset, 0.9);
      },

      playPresenterAction: (actionName, presenterIndex = 1) => {
        const pres = (presenterIndex === 2 && presenter2Ref.current?.group.visible)
          ? presenter2Ref.current
          : presenterRef.current;
        pres?.playAction(actionName, 0.5);

        if (actionName === PRESENTER_ANIMATIONS.showCard && cardRef.current && pres) {
          cardRef.current.mesh.visible = true;
          cardRef.current.mesh.scale.set(1, 1, 1);
          pres.attachCardToHand(cardRef.current.mesh);
          cardRef.current.updateContent(
            { id: 'demo', name: 'Real Madrid', club: 'La Liga (Tây Ban Nha)', pot: 1 },
            tournamentTitle,
            'BẢNG A (A1)'
          );
        }
      },

      setDualMode: (isDual, name1, name2) => {
        isDualModeRef.current = isDual;
        if (name1) presenter1.setMcName(name1);
        if (name2) presenter2.setMcName(name2);

        if (isDual) {
          gsap.to(presenter1.group.position, { x: -0.65, z: -0.25, duration: 0.8, ease: 'power2.out' });
          gsap.to(presenter1.group.rotation, { y: -0.15, duration: 0.8, ease: 'power2.out' });
          presenter2.group.position.set(0.65, 0, -0.25);
          presenter2.group.rotation.y = 0.15;
          presenter2.group.visible = true;
        } else {
          gsap.to(presenter1.group.position, { x: 0, z: -0.25, duration: 0.8, ease: 'power2.out' });
          gsap.to(presenter1.group.rotation, { y: 0, duration: 0.8, ease: 'power2.out' });
          presenter2.group.visible = false;
        }
      },

      updateMcNames: (name1, name2) => {
        if (name1) presenter1.setMcName(name1);
        if (name2) presenter2.setMcName(name2);
      },

      toggleSpotlight: () => {
        const light = lightingRef.current;
        if (light) {
          light.spotLight.visible = !light.spotLight.visible;
        }
      },

      resetScene: () => {
        cameraControllerRef.current?.moveTo('wide', 1.0);
        bowlRef.current?.resetBall();
        if (cardRef.current) {
          cardRef.current.mesh.visible = false;
          cardRef.current.drawBlank();
          cardRef.current.mesh.scale.set(1, 1, 1);
        }
        presenterRef.current?.playAction(PRESENTER_ANIMATIONS.idle, 0.5);
        lightingRef.current?.dimStageForDraw(false, 0.8);
      },

      updateLedBoard: (newGroups: DrawGroup[], title?: string) => {
        ledWallRef.current?.update(newGroups, title || tournamentTitle);
      },
    };

    onHandleReadyRef.current(handle);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      cameraController.dispose();
      renderer.dispose();
      scene.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Synchronize dynamic background LED Board whenever groups or tournament title change
  useEffect(() => {
    if (ledWallRef.current && groups) {
      ledWallRef.current.update(groups, tournamentTitle);
    }
  }, [groups, tournamentTitle]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing">
      <canvas ref={canvasRef} className="w-full h-full block touch-none" />
    </div>
  );
};
