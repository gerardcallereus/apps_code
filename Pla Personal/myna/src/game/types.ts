export interface BaseObj {
    x: number;
    y: number;
    w: number;
    h: number;
}
export interface Solid extends BaseObj { type: 'grass' | 'brick'; }
export interface Hazard extends BaseObj { type: 'spike' | 'lava'; }
export interface Star extends BaseObj { id: string; }
export interface Platform extends Solid { 
    isAnimPlatform: boolean;
    vx: number; 
    startX: number; 
    maxDist: number; 
}
export interface Blaster extends BaseObj { timer: number; }
export interface Bullet extends BaseObj { vx: number; dead: boolean; }

export interface Player extends BaseObj {
    id: 1 | 2;
    vx: number;
    vy: number;
    isGrounded: boolean;
    facingRight: boolean;
    stars: string[];
    deadTimer: number;
    spawnX: number;
    spawnY: number;
    finished: boolean;
    message: string;
    messageTime: number;
    isOnPlatform: Platform | null;
}

export interface InputState {
    up: boolean; down: boolean; left: boolean; right: boolean;
}
