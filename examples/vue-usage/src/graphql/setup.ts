import { initGraphQLTada } from 'gql-tada';
import { init } from 'villus';

// biome-ignore lint/complexity/noBannedTypes: Needed for framework interop
export const graphql = initGraphQLTada<{}>();

export function setupGraphQL() {
  const client = init({
    url: 'https://rickandmortyapi.com/graphql',
  });
  return client;
}
