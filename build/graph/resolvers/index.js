"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const login_resolvers_1 = require("./login.resolvers");
const session_resolvers_1 = require("./session.resolvers");
const course_resolvers_1 = require("./course.resolvers");
exports.resolvers = {
    Query: Object.assign(Object.assign({}, session_resolvers_1.sessionQueryResolvers), course_resolvers_1.courseQueryResolvers),
    Mutation: Object.assign(Object.assign(Object.assign({}, login_resolvers_1.loginMutationResolvers), session_resolvers_1.sessionMutationResolvers), course_resolvers_1.courseMutationResolvers),
};
