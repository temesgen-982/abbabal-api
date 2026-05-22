import type { Proverb } from '$lib/api';

let query = $state('');
let results = $state<Proverb[]>([]);
let searched = $state(false);

export function getSearchState() {
  return {
    get query() { return query; },
    set query(v) { query = v; },
    get results() { return results; },
    set results(v) { results = v; },
    get searched() { return searched; },
    set searched(v) { searched = v; },
  };
}