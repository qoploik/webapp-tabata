import type { JSX } from 'react';
import type { Phase } from '../types/timer';

interface TimerDisplayProps {
  phase: Phase;
  remainingSeconds: number;
  currentRound: number;
  totalRounds: number;
}

const PHASE_LABEL: Record<Phase, string> = {
  work: 'WORK',
  rest: 'REST',
  done: 'DONE',
};

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function TimerDisplay({
  phase,
  remainingSeconds,
  currentRound,
  totalRounds,
}: TimerDisplayProps): JSX.Element {
  return (
    <div className={`timer-display timer-display--${phase}`}>
      <div className="timer-display__phase">{PHASE_LABEL[phase]}</div>
      <div className="timer-display__time">{formatTime(remainingSeconds)}</div>
      {phase !== 'done' && (
        <div className="timer-display__round">
          Round {currentRound} of {totalRounds}
        </div>
      )}
    </div>
  );
}

export default TimerDisplay;
