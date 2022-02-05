import { fromEvent, interval } from 'rxjs';
import {
  throttleTime,
  debounceTime,
  delay,
  debounce,
  throttle,
  scan,
  map,
  tap,
} from 'rxjs/operators';

import {
  button,
  panicButton,
  addMessageToDOM,
  deepThoughtInput,
  setTextArea,
  setStatus,
} from './utilities';

const panicClicks$ = fromEvent(panicButton, 'click') 
const buttonClicks$ = fromEvent(button, 'click')
  .pipe(
    // throttleTime(2000),
    // delay(2000),
    // debounceTime(2000)
    // debounce(() => panicClicks$)
    throttle(() => panicClicks$)
  );

buttonClicks$.subscribe(addMessageToDOM);
