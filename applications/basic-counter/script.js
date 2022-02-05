import { fromEvent, interval, merge, NEVER } from 'rxjs';
import { skipUntil, takeUntil, scan } from 'rxjs/operators'
import { setCount, startButton, pauseButton } from './utilities';

const start$ = fromEvent(startButton, 'click');
const pause$ = fromEvent(pauseButton, 'click');

const interval$ = interval(1000)
  .pipe(
    skipUntil(start$),
    scan(total => total + 1, 0),
    takeUntil(pause$),
  )

interval$.subscribe(setCount)

// let subscription

// start$.subscribe(() => {
//   subscription = interval$.subscribe(setCount)
// })

// pause$.subscribe(() => { 
//   if (subscription) {
//     subscription.unsubscribe()
//   }
// })
