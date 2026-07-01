import { useCallback, useRef } from 'react';

const BEEP_FREQUENCY_HZ = 880;
const BEEP_DURATION_SECONDS = 0.15;
const BEEP_GAIN = 0.2;
const BEEP_GAIN_FLOOR = 0.0001;

export interface UseBeepResult {
  beep: () => void;
  unlock: () => void;
}

export function useBeep(): UseBeepResult {
  const audioContextRef = useRef<AudioContext | null>(null);

  const ensureContext = useCallback((): AudioContext => {
    if (audioContextRef.current === null) {
      audioContextRef.current = new AudioContext();
    }
    const audioContext = audioContextRef.current;
    if (audioContext.state === 'suspended') {
      void audioContext.resume();
    }
    return audioContext;
  }, []);

  const unlock = useCallback((): void => {
    ensureContext();
  }, [ensureContext]);

  const beep = useCallback((): void => {
    const audioContext = ensureContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = BEEP_FREQUENCY_HZ;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(BEEP_GAIN, now);
    gainNode.gain.exponentialRampToValueAtTime(BEEP_GAIN_FLOOR, now + BEEP_DURATION_SECONDS);

    oscillator.start(now);
    oscillator.stop(now + BEEP_DURATION_SECONDS);
  }, [ensureContext]);

  return { beep, unlock };
}
