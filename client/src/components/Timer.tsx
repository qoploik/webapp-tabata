import { useMemo } from 'react';
import type { JSX } from 'react';
import { useTimer } from '../hooks/useTimer';
import { useBeep } from '../hooks/useBeep';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import './Timer.css';

interface TimerProps {
  workTime: number;
  restTime: number;
  rounds: number;
}

function Timer({ workTime, restTime, rounds }: TimerProps): JSX.Element {
  const config = useMemo(() => ({ workTime, restTime, rounds }), [workTime, restTime, rounds]);
  const { beep, unlock } = useBeep();
  const timer = useTimer(config, beep);

  const handleStart = (): void => {
    unlock();
    timer.start();
  };

  return (
    <div className="timer">
      <TimerDisplay
        phase={timer.phase}
        remainingSeconds={timer.remainingSeconds}
        currentRound={timer.currentRound}
        totalRounds={rounds}
      />
      <TimerControls
        isRunning={timer.isRunning}
        isDone={timer.phase === 'done'}
        onStart={handleStart}
        onPause={timer.pause}
        onReset={timer.reset}
      />
    </div>
  );
}

export default Timer;
