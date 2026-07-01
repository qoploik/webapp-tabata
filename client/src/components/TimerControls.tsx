import type { JSX } from 'react';

interface TimerControlsProps {
  isRunning: boolean;
  isDone: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

function TimerControls({
  isRunning,
  isDone,
  onStart,
  onPause,
  onReset,
}: TimerControlsProps): JSX.Element {
  return (
    <div className="timer-controls">
      <button type="button" onClick={onStart} disabled={isRunning || isDone}>
        Start
      </button>
      <button type="button" onClick={onPause} disabled={!isRunning}>
        Pause
      </button>
      <button type="button" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}

export default TimerControls;
