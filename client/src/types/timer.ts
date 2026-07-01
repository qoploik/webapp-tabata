export type Phase = 'work' | 'rest' | 'done';

export interface TimerConfig {
  workTime: number;
  restTime: number;
  rounds: number;
}

export interface TimerState {
  phase: Phase;
  remainingSeconds: number;
  currentRound: number;
  isRunning: boolean;
}
