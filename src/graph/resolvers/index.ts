import { loginMutationResolvers } from "./login.resolvers";
import {
  sessionQueryResolvers,
  sessionMutationResolvers,
} from "./session.resolvers";
import {
  courseQueryResolvers,
  courseMutationResolvers,
} from "./course.resolvers";

export const resolvers: any = {
  Query: {
    ...sessionQueryResolvers,
    ...courseQueryResolvers,
  },
  Mutation: {
    ...loginMutationResolvers,
    ...sessionMutationResolvers,
    ...courseMutationResolvers,
  },
};
