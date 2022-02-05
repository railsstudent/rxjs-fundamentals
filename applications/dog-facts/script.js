import { fromEvent, of, timer, merge, NEVER } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import {
  catchError,
  exhaustMap,
  mapTo,
  mergeMap,
  retry,
  startWith,
  switchMap,
  tap,
  pluck,
} from 'rxjs/operators';

import {
  fetchButton,
  stopButton,
  clearError,
  clearFacts,
  addFacts,
  setError,
} from './utilities';

const endpoint = 'http://localhost:3333/api/facts?count=3&delay=1000&chaos=true&flakiness=2';

const fetchFacts$ = fromEvent(fetchButton, 'click')
  .pipe(
    exhaustMap(() => {
      return fromFetch(endpoint)
        .pipe(
          mergeMap(response => {
            if (response.ok) {
              return response.json()
            }
            throw new Error(response.statusText);
          }),
          retry(4),
          catchError((err) => {
            console.warn(err)
            return of({ error: err.message })
          })
        )
    }),
    tap(console.log)
  )


fetchFacts$.subscribe(({ error, facts }) => {
  if (error) {
    return setError(error)
  }

  clearError()
  clearFacts()
  return addFacts({ facts })
})
