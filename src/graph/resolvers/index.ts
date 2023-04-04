import { loginMutationResolvers } from "./login.resolvers";
import {
  sessionQueryResolvers,
  sessionMutationResolvers,
} from "./session.resolvers";

export const resolvers: any = {
  Query: {
    ...sessionQueryResolvers,
  },
  Mutation: {
    ...loginMutationResolvers,
    ...sessionMutationResolvers,
  },
};
