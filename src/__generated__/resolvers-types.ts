import { GraphQLResolveInfo } from "graphql";
import { Context } from "../graph/resolvers/types";
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Course = {
  __typename?: "Course";
  auhtor: User;
  authorId: Scalars["String"];
  createdAt: Scalars["String"];
  description: Scalars["String"];
  id: Scalars["ID"];
  intendedOutcomes: Scalars["String"];
  prereqs: Prereq;
  title: Scalars["String"];
  units?: Maybe<Unit>;
  updatedAt: Scalars["String"];
};

export type CreateCourseInput = {
  __typename?: "CreateCourseInput";
  authorId: Scalars["ID"];
  description: Scalars["String"];
  title: Scalars["String"];
};

export type CreateLoginInput = {
  email: Scalars["String"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  password: Scalars["String"];
  passwordConfirmation: Scalars["String"];
};

export type Lesson = {
  __typename?: "Lesson";
  content: Scalars["String"];
  description: Scalars["String"];
  id: Scalars["ID"];
  title: Scalars["String"];
  unit: Unit;
  unitId: Scalars["String"];
};

export type Login = {
  __typename?: "Login";
  email: Scalars["String"];
  id: Scalars["ID"];
  user: User;
};

export type LoginInput = {
  email: Scalars["String"];
  password: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  createCourse: Course;
  createLogin: Login;
  deleteCourse: Course;
  login: Session;
  logout: Session;
};

export type MutationCreateCourseArgs = {
  input: CreateCourseInput;
};

export type MutationCreateLoginArgs = {
  input: CreateLoginInput;
};

export type MutationDeleteCourseArgs = {
  id: Scalars["String"];
};

export type MutationLoginArgs = {
  input: LoginInput;
};

export type Prereq = {
  __typename?: "Prereq";
  course: Course;
  courseId: Scalars["String"];
  description: Scalars["String"];
  id: Scalars["ID"];
  title: Scalars["String"];
  topics?: Maybe<Array<Maybe<PrereqTopic>>>;
};

export type PrereqTopic = {
  __typename?: "PrereqTopic";
  description: Scalars["String"];
  id: Scalars["ID"];
  prereq: Prereq;
  prereqId: Scalars["String"];
  title: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  course?: Maybe<Course>;
  courses?: Maybe<Array<Maybe<Course>>>;
  session?: Maybe<Session>;
  users?: Maybe<Array<Maybe<User>>>;
};

export type QueryCourseArgs = {
  id: Scalars["String"];
};

export type QueryCoursesArgs = {
  authorId: Scalars["String"];
};

export type QuerySessionArgs = {
  id: Scalars["String"];
};

export type Session = {
  __typename?: "Session";
  id: Scalars["ID"];
  token: Scalars["String"];
};

export type Unit = {
  __typename?: "Unit";
  course: Course;
  courseId: Scalars["String"];
  description: Scalars["String"];
  id: Scalars["ID"];
  lessons?: Maybe<Lesson>;
  title: Scalars["String"];
};

export type User = {
  __typename?: "User";
  email?: Maybe<Scalars["String"]>;
  emailVerified?: Maybe<Scalars["Boolean"]>;
  firstName?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  lastName?: Maybe<Scalars["String"]>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  Course: ResolverTypeWrapper<Course>;
  CreateCourseInput: ResolverTypeWrapper<CreateCourseInput>;
  CreateLoginInput: CreateLoginInput;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  Lesson: ResolverTypeWrapper<Lesson>;
  Login: ResolverTypeWrapper<Login>;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<{}>;
  Prereq: ResolverTypeWrapper<Prereq>;
  PrereqTopic: ResolverTypeWrapper<PrereqTopic>;
  Query: ResolverTypeWrapper<{}>;
  Session: ResolverTypeWrapper<Session>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Unit: ResolverTypeWrapper<Unit>;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars["Boolean"];
  Course: Course;
  CreateCourseInput: CreateCourseInput;
  CreateLoginInput: CreateLoginInput;
  ID: Scalars["ID"];
  Lesson: Lesson;
  Login: Login;
  LoginInput: LoginInput;
  Mutation: {};
  Prereq: Prereq;
  PrereqTopic: PrereqTopic;
  Query: {};
  Session: Session;
  String: Scalars["String"];
  Unit: Unit;
  User: User;
}>;

export type CourseResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Course"] = ResolversParentTypes["Course"]
> = ResolversObject<{
  auhtor?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  authorId?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  intendedOutcomes?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType
  >;
  prereqs?: Resolver<ResolversTypes["Prereq"], ParentType, ContextType>;
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  units?: Resolver<Maybe<ResolversTypes["Unit"]>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateCourseInputResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["CreateCourseInput"] = ResolversParentTypes["CreateCourseInput"]
> = ResolversObject<{
  authorId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LessonResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Lesson"] = ResolversParentTypes["Lesson"]
> = ResolversObject<{
  content?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes["Unit"], ParentType, ContextType>;
  unitId?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Login"] = ResolversParentTypes["Login"]
> = ResolversObject<{
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  user?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = ResolversObject<{
  createCourse?: Resolver<
    ResolversTypes["Course"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateCourseArgs, "input">
  >;
  createLogin?: Resolver<
    ResolversTypes["Login"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateLoginArgs, "input">
  >;
  deleteCourse?: Resolver<
    ResolversTypes["Course"],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteCourseArgs, "id">
  >;
  login?: Resolver<
    ResolversTypes["Session"],
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, "input">
  >;
  logout?: Resolver<ResolversTypes["Session"], ParentType, ContextType>;
}>;

export type PrereqResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Prereq"] = ResolversParentTypes["Prereq"]
> = ResolversObject<{
  course?: Resolver<ResolversTypes["Course"], ParentType, ContextType>;
  courseId?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  topics?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["PrereqTopic"]>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PrereqTopicResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["PrereqTopic"] = ResolversParentTypes["PrereqTopic"]
> = ResolversObject<{
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  prereq?: Resolver<ResolversTypes["Prereq"], ParentType, ContextType>;
  prereqId?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = ResolversObject<{
  course?: Resolver<
    Maybe<ResolversTypes["Course"]>,
    ParentType,
    ContextType,
    RequireFields<QueryCourseArgs, "id">
  >;
  courses?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Course"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryCoursesArgs, "authorId">
  >;
  session?: Resolver<
    Maybe<ResolversTypes["Session"]>,
    ParentType,
    ContextType,
    RequireFields<QuerySessionArgs, "id">
  >;
  users?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["User"]>>>,
    ParentType,
    ContextType
  >;
}>;

export type SessionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Session"] = ResolversParentTypes["Session"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  token?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UnitResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Unit"] = ResolversParentTypes["Unit"]
> = ResolversObject<{
  course?: Resolver<ResolversTypes["Course"], ParentType, ContextType>;
  courseId?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  lessons?: Resolver<Maybe<ResolversTypes["Lesson"]>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"]
> = ResolversObject<{
  email?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  emailVerified?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  firstName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  Course?: CourseResolvers<ContextType>;
  CreateCourseInput?: CreateCourseInputResolvers<ContextType>;
  Lesson?: LessonResolvers<ContextType>;
  Login?: LoginResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Prereq?: PrereqResolvers<ContextType>;
  PrereqTopic?: PrereqTopicResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Session?: SessionResolvers<ContextType>;
  Unit?: UnitResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;
