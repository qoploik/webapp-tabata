import { useCallback, useEffect, useRef, useState } from 'react';
import type { Phase, TimerConfig, TimerState } from '../types/timer';

export interface UseTimerResult extends TimerState {
  start: () => void;
  pause: () => void;
  reset: () => void;
}

const TICK_INTERVAL_MS = 200;

function phaseDuration(phase: Phase, config: TimerConfig): number {
  if (phase === 'work') return config.workTime;
  if (phase === 'rest') return config.restTime;
  return 0;
}

function nextPhase(
  phase: Phase,
  currentRound: number,
  rounds: number,
): { phase: Phase; currentRound: number } {
  if (phase === 'work') {
    return { phase: 'rest', currentRound };
  }
  if (phase === 'rest' && currentRound < rounds) {
    return { phase: 'work', currentRound: currentRound + 1 };
  }
  return { phase: 'done', currentRound };
}

export function useTimer(
  config: TimerConfig,
  onPhaseChange: (phase: Phase) => void,
): UseTimerResult {
  const [phase, setPhase] = useState<Phase>('work');
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(config.workTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const phaseRef = useRef<Phase>('work');
  const roundRef = useRef<number>(1);
  const phaseEndAtRef = useRef<number>(0);
  const intervalIdRef = useRef<number | null>(null);
  const onPhaseChangeRef = useRef(onPhaseChange);
  useEffect(() => {
    onPhaseChangeRef.current = onPhaseChange;
  }, [onPhaseChange]);

  const stopInterval = useCallback((): void => {
    if (intervalIdRef.current !== null) {
      window.clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  }, []);

  const tick = useCallback((): void => {
    const now = Date.now();

    while (phaseRef.current !== 'done' && phaseEndAtRef.current - now <= 0) {
      const next = nextPhase(phaseRef.current, roundRef.current, config.rounds);
      phaseRef.current = next.phase;
      roundRef.current = next.currentRound;
      onPhaseChangeRef.current(next.phase);

      if (next.phase === 'done') {
        phaseEndAtRef.current = now;
        break;
      }
      phaseEndAtRef.current += phaseDuration(next.phase, config) * 1000;
    }

    setPhase(phaseRef.current);
    setCurrentRound(roundRef.current);

    if (phaseRef.current === 'done') {
      setRemainingSeconds(0);
      setIsRunning(false);
      stopInterval();
      return;
    }

    setRemainingSeconds(Math.max(0, Math.ceil((phaseEndAtRef.current - now) / 1000)));
  }, [config, stopInterval]);

  const start = useCallback((): void => {
    if (isRunning || phaseRef.current === 'done') {
      return;
    }
    phaseEndAtRef.current = Date.now() + remainingSeconds * 1000;
    setIsRunning(true);
    intervalIdRef.current = window.setInterval(tick, TICK_INTERVAL_MS);
  }, [isRunning, remainingSeconds, tick]);

  const pause = useCallback((): void => {
    stopInterval();
    setIsRunning(false);
  }, [stopInterval]);

  const reset = useCallback((): void => {
    stopInterval();
    phaseRef.current = 'work';
    roundRef.current = 1;
    phaseEndAtRef.current = 0;
    setPhase('work');
    setCurrentRound(1);
    setRemainingSeconds(config.workTime);
    setIsRunning(false);
  }, [config.workTime, stopInterval]);

  useEffect(() => stopInterval, [stopInterval]);

  return { phase, remainingSeconds, currentRound, isRunning, start, pause, reset };
}
