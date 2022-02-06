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
  retry,
} from 'rxjs';

import { fromFetch } from 'rxjs/fetch';

import {
  addResults,
  addResult,
  clearResults,
  endpointFor,
  search,
  form,
  renderPokemon
} from '../pokemon/utilities';

const endpoint = 'http://localhost:3333/api/pokemon/';

const oldSearch$ = fromEvent(search, 'input')
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

const searchPokemons = (searchTerm) => 
  fromFetch(endpoint + 'search/' + searchTerm + '?delay=100&chaos=true&flakiness=2')
    .pipe(
      mergeMap((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Something went wrong!')
      }),
      retry(4),
      catchError(err => {
        console.warn(err)
        return of({
          pokemon: []
        })
      })
    )

const getPokemonDetails = (id) => 
  fromFetch(endpointFor(id))
    .pipe(
      mergeMap((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Something went wrong!')
      }),
      retry(4),
      catchError(err => {
        console.warn(err)
        return of({
          pokemon: []
        })
      })
    )

const search$ = fromEvent(form, 'submit')
  .pipe(
    debounceTime(300),
    map(() => search.value),
    distinctUntilChanged(),
    switchMap((searchTerm) => {
      return searchPokemons(searchTerm)
        .pipe(
          pluck('pokemon'),
          mergeMap(pokemons => pokemons),
          take(1),  
          switchMap(pokemon => {
            const pokemon$ = of(pokemon)
            const data$ = getPokemonDetails(pokemon.id)
              .pipe(map(data => ({
                  ...pokemon, 
                  data
                })
              ))
            return merge(pokemon$, data$)
          }),            
        )
    }),
    tap(renderPokemon)
  )

search$.subscribe(console.log)
