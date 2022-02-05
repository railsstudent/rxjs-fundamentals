import { fromEvent, interval, merge, NEVER } from 'rxjs';
import { setCount, startButton, pauseButton } from './utilities';

const start$ = fromEvent(startButton, 'click');
const pause$ = fromEvent(pauseButton, 'click');

const interval$ = interval(1000)
let subscription

start$.subscribe(() => {
  subscription = interval$.subscribe(setCount)
})

pause$.subscribe(() => { 
  if (subscription) {
    subscription.unsubscribe()
  }
})
