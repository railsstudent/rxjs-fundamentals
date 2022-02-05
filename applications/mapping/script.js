import { of, from, interval, fromEvent, merge, NEVER } from 'rxjs';
import { pluck, concatMap, mergeMap, take, map, switchMap, exhaustMap } from 'rxjs/operators';

import {
  getCharacter,
  render,
  startButton,
  pauseButton,
  setStatus,
} from './utilities';

const character$ = of(1, 2, 3, 4).pipe(
  concatMap(n => getCharacter(n)),
  pluck('name')
);

character$.subscribe(render);
