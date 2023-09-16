import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { trpc } from "@elysiajs/trpc";
import { initTRPC } from "@trpc/server";
import { Elysia } from "elysia";
import { z } from "zod";
import { db } from "./db";

const t = initTRPC.create();
const p = t.procedure;

type User = {
  id: string;
  email: string;
};

function getUserById(id: string): User {
  return {
    id,
    email: `john${id}@gmail.com`,
  };
}

const router = t.router({
  greet: p.input(z.string()).query(({ input }) => input),
  getUsers: p
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input: { id } }) => {
      const user = getUserById(id);
      return user;
    }),
  createUser: p
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      const createdUser = await db
        .insertInto("User")
        .values({
          email: input.email,
        })
        .returningAll()
        .execute();
      return createdUser.at(0);
    }),
  getAllUsers: p.query(async () => {
    return await db.selectFrom("User").selectAll().execute();
  }),
});

const app = new Elysia()
  .use(
    cors({
      origin: "*",
    })
  )
  .use(trpc(router))
  .use(swagger())
  .onError(({ code, error, request, set }) => {
    console.log(error);
  })
  .get("/sample-shared", () => {
    return "sayHello";
  })
  .listen(3000);

export type Router = typeof router;
