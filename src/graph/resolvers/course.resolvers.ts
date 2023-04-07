import {
  CourseResolvers,
  CreateCourseInput,
} from "../../__generated__/resolvers-types";
const crypto = require("crypto");

export const courseQueryResolvers: CourseResolvers = {
  // Course query resolver
  course: async (_parent: any, args: { id: string }, contextValue: any) => {
    const { prisma } = contextValue;
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
  courses: async (
    _parent: any,
    args: { authorId: string },
    contextValue: any
  ) => {
    const { prisma } = contextValue;
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
  createCourse: async (
    _parent: any,
    args: { input: CreateCourseInput },
    contextValue: any
  ) => {
    const { prisma } = contextValue;
    const { OpenAI } = await import("langchain/llms");
    const { PromptTemplate } = await import("langchain");
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

    const formatInstructions = `json
{
        "title": string // Name of the course
        "description": string // Description of the course
        "prereqs": {
                "title": string // Name of the prerequisite
                "description": string // Description of the prerequisite
                "topics": {
                        "title": string
                        "description": string
                }[] // Topics covered in the prerequisite
        }[] // Prerequisites for the course
        "units": {
                "title": string // Name of module
                "description: string // Description of module
                "lessons": {
                        "title": string // Name of section
                        "description": string // Description of section
                        "content": string // Content of section
                }[]
        }[] // Modules in the course
        "intendedOutcomes": string[] // Intended outcomes for the course
}
`;

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

    // Create course
    const course = await prisma.course.create({
      data: {
        id: crypto.randomUUID(),
        authorId,
        content: result,
      },
    });

    // Create course error handling
    if (!course) {
      throw new Error("Failed to create course");
    }

    return course;
  },
  // Delete course mutation resolver
  deleteCourse: async (
    _parent: any,
    args: { id: string },
    contextValue: any
  ) => {
    const { prisma } = contextValue;
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
