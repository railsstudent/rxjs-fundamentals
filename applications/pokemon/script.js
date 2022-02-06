import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  mergeMap,
  switchMap,
  tap,
  of,
  merge,
  from,
  filter,
  catchError,
  concat,
  take,
  EMPTY,
  pluck,
} from 'rxjs';

import { fromFetch } from 'rxjs/fetch';

import {
  addResults,
  addResult,
  clearResults,
  endpointFor,
  search,
  form,
} from '../pokemon/utilities';

const endpoint = 'http://localhost:3333/api/pokemon/';

const search$ = fromEvent(search, 'input')
  .pipe(
    debounceTime(300),
    map(event => event.target.value),
    distinctUntilChanged(),
    switchMap((searchTerm) => {
      return fromFetch(endpoint + 'search/' + searchTerm + '?delay=100&chaos=true&flakiness=2')
        .pipe(
          mergeMap((response) => {
            if (response.ok) {
              return response.json()
            }
            throw new Error('Something went wrong!')
          }),
          catchError(err => {
            console.warn(err)
            return of({
              pokemon: []
            })
          })
        )
    }),
    tap(clearResults),
    pluck('pokemon'),
    tap(addResults),
  )

search$.subscribe(console.log)
