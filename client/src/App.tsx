import type { JSX } from 'react';
import Timer from './components/Timer';

const DEMO_WORK_TIME_SECONDS = 20;
const DEMO_REST_TIME_SECONDS = 10;
const DEMO_ROUNDS = 8;

function App(): JSX.Element {
  return (
    <Timer
      workTime={DEMO_WORK_TIME_SECONDS}
      restTime={DEMO_REST_TIME_SECONDS}
      rounds={DEMO_ROUNDS}
    />
  );
}

export default App;
