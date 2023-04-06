import {
  CourseResolvers,
  CreateCourseInput,
  Prereq,
} from "../../__generated__/resolvers-types";
import { PrismaClient } from "@prisma/client";
import { OpenAI } from "langchain/llms";
import { PromptTemplate } from "langchain";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
const crypto = require("crypto");

const prisma = new PrismaClient();

export const courseQueryResolvers: CourseResolvers = {
  // Course query resolver
  course: async (_parent: any, args: { id: string }) => {
    // Grab args
    const { id } = args;

    // Grab args error handling
    if (!id) {
      throw new Error("Missing required fields");
    }

    // Find course
    const course = await prisma.course.findUnique({
      where: { id },
    });

    // Find course error handling
    if (!course) {
      throw new Error("Failed to find course");
    }

    return course;
  },
  // Courses query resolver
  courses: async (_parent: any, args: { authorId: string }) => {
    // Grab args
    const { authorId } = args;

    // Grab args error handling
    if (!authorId) {
      throw new Error("Missing required fields");
    }

    // Find courses
    const courses = await prisma.course.findMany({
      where: { authorId },
    });

    // Find courses error handling
    if (!courses) {
      throw new Error("Failed to find courses");
    }

    return courses;
  },
};

export const courseMutationResolvers: CourseResolvers = {
  // Create course mutation resolver
  createCourse: async (_parent: any, args: { input: CreateCourseInput }) => {
    // Grab args
    const { authorId, title, description } = args.input;

    // Grab args error handling
    if (!authorId || !title || !description) {
      throw new Error("Missing required fields");
    }

    // Create model
    const model = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0,
      modelName: "gpt-3.5-turbo",
    });

    // Create model error handling
    if (!model) {
      throw new Error("Failed to create model");
    }

    // Create parser
    const parser = StructuredOutputParser.fromZodSchema(
      z.object({
        title: z.string().describe("Name of the course"),
        description: z.string().describe("Description of the course"),
        prereqs: z
          .array(
            z.object({
              title: z.string().describe("Name of the prerequisite"),
              description: z
                .string()
                .describe("Description of the prerequisite"),
              topics: z
                .array(z.object({ title: z.string(), description: z.string() }))
                .describe("Topics covered in the prerequisite"),
            })
          )
          .describe("Prerequisites for the course"),
        units: z
          .array(
            z.object({
              title: z.string().describe("Name of unit"),
              sections: z.array(
                z.object({
                  title: z.string().describe("Name of unit"),
                  description: z.string().describe("Description of unit"),
                })
              ),
            })
          )
          .describe("Units in the course"),
        intendedOutcomes: z
          .array(z.string())
          .describe("Intended outcomes for the course"),
      })
    );

    // Create parser error handling
    if (!parser) {
      throw new Error("Failed to create parser");
    }

    // Create instructions for formatting openai response
    const formatInstructions = parser.getFormatInstructions();

    // Create formatInstructions error handling
    if (!formatInstructions) {
      throw new Error("Failed to create formatInstructions");
    }

    // Create prompt template
    const promptTemplate = new PromptTemplate({
      template:
        "Create a syllabus for a course with the following title: {title} and description: {description} and format: {format_instructions}.",
      inputVariables: ["title", "description"],
      partialVariables: { format_instructions: formatInstructions },
    });

    // Create prompt template error handling
    if (!promptTemplate) {
      throw new Error("Failed to create prompt template");
    }

    // Create prompt
    const prompt = await promptTemplate.format({ title, description });

    // Create prompt error handling
    if (!prompt) {
      throw new Error("Failed to create prompt");
    }

    // Call openai
    const result = await model.call(prompt);
    const parsedResult = parser.parse(result);

    // Openai results error handling
    if (!parsedResult) {
      throw new Error("Failed to create course");
    }

    // Create courseId
    const courseId: string = crypto.randomUUID();

    // Create courseId error handling
    if (!courseId) {
      throw new Error("Failed to create courseId");
    }

    // Create prereqId
    const prereqId: string = crypto.randomUUID();

    // Create prereqId error handling
    if (!prereqId) {
      throw new Error("Failed to create prereqId");
    }

    // Create prereqs
    const prereqs: any = parsedResult.prereqs.map((prereq: any) => {
      return {
        id: prereqId,
        courseId,
        title: prereq.title as string,
        description: prereq.description as string,
        topics: prereq.topics.map((topic: any) => {
          return {
            id: crypto.randomUUID() as string,
            prereqId,
            title: topic.title,
            description: topic.description,
          };
        }),
      };
    });

    // Create prereqs error handling
    if (!prereqs) {
      throw new Error("Failed to create prereqs");
    }

    // Create units
    const units: any = parsedResult.units.map((unit: any) => {
      return {
        id: crypto.randomUUID() as string,
        courseId,
        title: unit.title as string,
        description: unit.description as string,
        lessons: null,
      };
    });

    // Create units error handling
    if (!units) {
      throw new Error("Failed to create units");
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        id: courseId,
        authorId,
        title: parsedResult.title,
        description: parsedResult.description,
        prereqs,
        units,
        intendedOutcomes: parsedResult.intendedOutcomes,
      },
    });

    // Create course error handling
    if (!course) {
      throw new Error("Failed to create course");
    }

    return course;
  },
  // Delete course mutation resolver
  deleteCourse: async (_parent: any, args: { id: string }) => {
    // Grab args
    const { id } = args;

    // Grab args error handling
    if (!id) {
      throw new Error("Missing required fields");
    }

    // Delete course
    const course = await prisma.course.delete({
      where: {
        id,
      },
    });

    // Delete course error handling
    if (!course) {
      throw new Error("Failed to delete course");
    }

    return course;
  },
};
