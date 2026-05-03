<script setup lang="ts">
import { useQuery } from 'villus';
import { graphql } from '../../graphql/setup';
import { UserProfileFragment } from './UserProfile.graphql';

const UserQuery = graphql(
  `
  query GetUser($id: ID!) {
    user(id: $id) {
      ...UserProfile
    }
  }
`,
  [UserProfileFragment],
);

// biome-ignore lint/correctness/noUnusedVariables: Used in Vue template
const { data } = useQuery({ query: UserQuery, variables: { id: '1' } });
</script>

<template>
  <div>
    <h1 v-if="data?.user">{{ data.user.name }}</h1>
    <Button label="Click Me" />
  </div>
</template>
