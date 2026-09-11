import * as THREE from 'three';

export type DrawState =
  | 'IDLE'
  | 'CAMERA_FOCUS'
  | 'MIXING'
  | 'REACHING'
  | 'GRABBING'
  | 'TAKING_BALL'
  | 'OPENING_BALL'
  | 'TAKING_CARD'
  | 'OPENING_CARD'
  | 'SHOWING_CARD'
  | 'REVEALING'
  | 'RETURNING'
  | 'COMPLETED';

export type CameraPresetName = 'wide' | 'presenter' | 'bowl' | 'ball' | 'card';

export interface CameraPreset {
  position: THREE.Vector3;
  target: THREE.Vector3;
}

export interface DrawTeam {
  id: string;
  name: string;
  club?: string;
  pot: number;
}

export interface GroupSlot {
  positionName: string;
  team: DrawTeam | null;
  isJustSlotted?: boolean;
}

export interface DrawGroup {
  id: string;
  name: string;
  slots: GroupSlot[];
  color: string;
}

export const PRESENTER_ANIMATIONS = {
  idle: 'Idle',
  lookAtBowl: 'LookAtBowl',
  reachBall: 'ReachBall',
  grabBall: 'GrabBall',
  takeBall: 'TakeBall',
  openBall: 'OpenBall',
  takeCard: 'TakeCard',
  openCard: 'OpenCard',
  showCard: 'ShowCard',
  returnIdle: 'ReturnIdle',
} as const;
