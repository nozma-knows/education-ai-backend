import { createServer } from "http";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { readFileSync } from "fs";
import { resolvers } from "./graph/resolvers";
import { expressjwt } from "express-jwt";
import { PrismaClient } from "@prisma/client";

const typeDefs = readFileSync("./src/graph/schema.graphql", {
  encoding: "utf-8",
});

const startServer = async () => {
  const app = express();
  app.use(
    expressjwt({
      secret: `${process.env.JWT_PRIVATE_KEY}`,
      algorithms: ["HS256"],
      credentialsRequired: false,
    })
  );
  const httpServer = createServer(app);

  const prisma = new PrismaClient();

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: any) => {
      if (req.auth) {
        return {
          prisma,
          userId: req.auth.userId,
          expiry: req.auth.expiry,
          token: req.headers.authorization.split("Bearer ")[1],
        };
      }
      return {};
    },
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    path: "/api",
  });

  httpServer.listen({ port: process.env.PORT || 4000 }, () =>
    console.log(`Server listening on localhost:4000${apolloServer.graphqlPath}`)
  );
};

startServer();
