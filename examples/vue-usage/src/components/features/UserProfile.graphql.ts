import { graphql } from '../../graphql/setup';

export const UserProfileFragment = graphql(`
  fragment UserProfile on User {
    id
    name
    email
  }
`);
