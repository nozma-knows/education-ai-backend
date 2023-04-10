import { PrismaClient } from "@prisma/client";
import {
  CoursePrereq,
  CourseResolvers,
  CourseUnit,
  CreateCourseInput,
  Maybe,
  PrereqTopic,
  Status,
  UnitLesson,
} from "../../__generated__/resolvers-types";
import { z } from "zod";
const { OpenAI, PromptTemplate } = require("langchain");
const { StructuredOutputParser } = require("langchain/output_parsers");
const crypto = require("crypto");

interface Context {
  prisma: PrismaClient;
  userId: string;
  expiry: string;
  token: string;
}

export const courseQueryResolvers: CourseResolvers = {
  // Course query resolver
  course: async (_parent: any, args: { id: string }, contextValue: Context) => {
    // Grab prisma client
    const { prisma } = contextValue;

    if (!prisma) {
      throw new Error("Failed to find prisma client.");
    }

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
    // Grab prisma client
    const { prisma } = contextValue;

    if (!prisma) {
      throw new Error("Failed to find prisma client.");
    }

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
  //   createCourse: async (
  //     _parent: any,
  //     args: { input: CreateCourseInput },
  //     contextValue: any
  //   ) => {
  //     const prisma = new PrismaClient();
  //     const { OpenAI } = await import("langchain/llms");
  //     const { PromptTemplate } = await import("langchain");
  //     // Grab args
  //     const { authorId, title, description } = args.input;

  //     // Grab args error handling
  //     if (!authorId || !title || !description) {
  //       throw new Error("Missing required fields");
  //     }

  //     // Create model
  //     const model = new OpenAI({
  //       openAIApiKey: process.env.OPENAI_API_KEY,
  //       temperature: 0,
  //       modelName: "gpt-3.5-turbo",
  //     });

  //     // Create model error handling
  //     if (!model) {
  //       throw new Error("Failed to create model");
  //     }

  //     const formatInstructions = `json
  // {
  //   "title": string // Name of the course
  //   "description": string // Description of the course
  //   "prereqs": {
  //     "title": string // Name of the prerequisite
  //     "description": string // Description of the prerequisite
  //     "topics": {
  //       "title": string
  //       "description": string
  //     }[] // Topics covered in the prerequisite
  //   }[] // Prerequisites for the course
  //   "units": {
  //     "title": string // Name of module
  //     "description": string // Description of unit
  //     "lessons": {
  //       "title": string // Name of section
  //       "description": string // Description of section
  //     }[]
  //   }[] // Modules in the course
  //   "intendedOutcomes": string[] // Intended outcomes for the course
  // }
  // `;

  //     // Create formatInstructions error handling
  //     if (!formatInstructions) {
  //       throw new Error("Failed to create formatInstructions");
  //     }

  //     // Create prompt template
  //     const promptTemplate = new PromptTemplate({
  //       template:
  //         "Create a syllabus for a course with the following title: {title} and description: {description} and format: {format_instructions}.",
  //       inputVariables: ["title", "description"],
  //       partialVariables: { format_instructions: formatInstructions },
  //     });

  //     // Create prompt template error handling
  //     if (!promptTemplate) {
  //       throw new Error("Failed to create prompt template");
  //     }

  //     // Create prompt
  //     const prompt = await promptTemplate.format({ title, description });

  //     // Create prompt error handling
  //     if (!prompt) {
  //       throw new Error("Failed to create prompt");
  //     }
  //     // Call openai
  //     const result = await model.call(prompt);
  //     const parsedResult = JSON.parse(result);

  //     const {
  //       description: courseDescription,
  //       intendedOutcomes,
  //       prereqs,
  //       units,
  //     } = parsedResult;

  //     console.log(
  //       "about to create course without prereqs or units - prisma.course: ",
  //       prisma
  //     );

  //     // Create course without prerqs and units
  //     let course = await prisma.course.create({
  //       data: {
  //         id: crypto.randomUUID(),
  //         authorId,
  //         title,
  //         description: courseDescription,
  //         intendedOutcomes,
  //         status: Status.Pending,
  //       },
  //     });
  //     console.log("Created Course.");
  //     // Create course error handling
  //     if (!course) {
  //       throw new Error("Failed to create course");
  //     }
  //     console.log("course without prereqs and units: ", course);

  //     const coursePreqs = prereqs.map(async (prereq: CoursePrereq) => {
  //       const { title, description, topics } = prereq;
  //       let coursePrereq = await prisma.coursePrereq.create({
  //         data: {
  //           id: crypto.randomUUID(),
  //           courseId: course.id,
  //           title: title,
  //           description: description,
  //         },
  //       });

  //       if (!coursePrereq) {
  //         throw new Error("Failed to create course prereq");
  //       }

  //       const prereqTopics = topics
  //         ? topics.map(async (topic: any) => {
  //             const { title, description } = topic;
  //             const prereqTopic = await prisma.prereqTopic.create({
  //               data: {
  //                 id: crypto.randomUUID(),
  //                 prereqId: coursePrereq.id,
  //                 title: title,
  //                 description: description,
  //               },
  //             });
  //             if (!prereqTopic) {
  //               throw new Error("Failed to create prereq topic");
  //             }
  //             return prereqTopic;
  //           })
  //         : [];

  //       if (!prereqTopics) {
  //         throw new Error("Failed to create prereq topics");
  //       }

  //       coursePrereq = await prisma.coursePrereq.update({
  //         where: {
  //           id: coursePrereq.id,
  //         },
  //         data: {
  //           topics: prereqTopics,
  //         },
  //       });

  //       if (!coursePrereq) {
  //         throw new Error("Failed to create course prereq");
  //       }

  //       return coursePrereq;
  //     });

  //     if (!coursePreqs) {
  //       throw new Error("Failed to create course prereqs");
  //     }

  //     const courseUnits = units.map(async (unit: any) => {
  //       const { title, description, lessons } = unit;
  //       let courseUnit = await prisma.courseUnit.create({
  //         data: {
  //           id: crypto.randomUUID(),
  //           courseId: course.id,
  //           title: title,
  //           description: description,
  //           status: Status.Pending,
  //         },
  //       });

  //       if (!courseUnit) {
  //         throw new Error("Failed to create course unit");
  //       }

  //       const unitLessons = lessons.map(async (lesson: any) => {
  //         const { title } = lesson;
  //         const unitLesson = await prisma.unitLesson.create({
  //           data: {
  //             id: crypto.randomUUID(),
  //             unitId: courseUnit.id,
  //             title: title,
  //             status: Status.Pending,
  //           },
  //         });
  //         if (!unitLesson) {
  //           throw new Error("Failed to create unit lesson");
  //         }
  //         return unitLesson;
  //       });

  //       if (!unitLessons) {
  //         throw new Error("Failed to create unit lessons");
  //       }

  //       courseUnit = await prisma.courseUnit.update({
  //         where: {
  //           id: courseUnit.id,
  //         },
  //         data: {
  //           lessons: unitLessons,
  //         },
  //       });

  //       if (!courseUnit) {
  //         throw new Error("Failed to create course unit");
  //       }

  //       return courseUnit;
  //     });

  //     if (!courseUnits) {
  //       throw new Error("Failed to create course units");
  //     }

  //     const updatedCourse = prisma.course.update({
  //       where: {
  //         id: course.id,
  //       },
  //       data: {
  //         id: undefined,
  //         createdAt: undefined,
  //         updatedAt: undefined,
  //         authorId: undefined,
  //         title: undefined,
  //         description: undefined,
  //         prereqs: coursePreqs,
  //         units: courseUnits,
  //         intendedOutcomes: undefined,
  //         status: undefined,
  //       },
  //     });

  //     if (!updatedCourse) {
  //       throw new Error("Failed to create course");
  //     }

  //     console.log("course with everything: ", course);

  //     return updatedCourse;
  //   },

  createCourse: async (
    _parent: any,
    args: { input: CreateCourseInput },
    contextValue: Context
  ) => {
    // Grab prisma client
    const { prisma } = contextValue;

    // Grab prisma client error handling
    if (!prisma) {
      throw new Error("Failed to find prisma client.");
    }

    // Grab args
    const { authorId, title, description } = args.input;

    // Grab args error handling
    if (!authorId || !title || !description) {
      throw new Error("Missing required fields.");
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
        title: z.string().describe("Title of the course"),
        description: z.string().describe("Description of the course"),
        prereqs: z
          .array(
            z.object({
              title: z.string().describe("Title of the course prerequsiite"),
              description: z
                .string()
                .describe("Description of the course prerequisite"),
              topics: z
                .array(
                  z.object({
                    title: z
                      .string()
                      .describe("Title of the course prerequisite topic"),
                    description: z
                      .string()
                      .describe("Description of the course prerequisite topic"),
                  })
                )
                .describe("Topics of the course prerequisite"),
            })
          )
          .describe("Prerequisites of the course"),
        units: z
          .array(
            z.object({
              title: z.string().describe("Title of the course unit"),
              description: z
                .string()
                .describe("Description of the course unit"),
              lessons: z.array(
                z.object({
                  title: z.string().describe("Title of the course unit lesson"),
                })
              ),
            })
          )
          .describe("Units of the course"),
        intended_outcomes: z
          .array(z.string().describe("Intended outcome of the course"))
          .describe("Intended outcomes of the course"),
      })
    );

    // Create parser error handling
    if (!parser) {
      throw new Error("Failed to create parser");
    }

    // Create formatInstructions
    const formatInstructions = parser.getFormatInstructions();

    // Create formatInstructions error handling
    if (!formatInstructions) {
      throw new Error("Failed to create formatInstructions");
    }

    // Create promptTemplate
    const promptTemplate = new PromptTemplate({
      template: `Create a syllabus for a course with the following title: "{title}" and description: "{description}" and format: {format_instructions}.`,
      inputVariables: ["title", "description"],
      partialVariables: { format_instructions: formatInstructions },
    });

    // Create promptTemplate error handling
    if (!promptTemplate) {
      throw new Error("Failed to create promptTemplate");
    }

    // Create prompt
    const prompt = await promptTemplate.format({ title, description });

    // Create prompt error handling
    if (!prompt) {
      throw new Error("Failed to create prompt");
    }

    /// Call openai
    const result = await model.call(prompt);

    console.log("result: ", result);

    // Call openai error handling
    if (!result) {
      throw new Error("Failed to call openai");
    }

    // Parse result
    const parsedResult = await parser.parse(result);

    // Parse result error handling
    if (!parsedResult) {
      throw new Error("Failed to parse result");
    }

    console.log("parsedResult: ", parsedResult);

    // Create course
    const courseId = crypto.randomUUID();
    const course = await prisma.course.create({
      data: {
        id: courseId,
        authorId,
        title,
        description,
        status: Status.Pending,
        intendedOutcomes: parsedResult.intended_outcomes,
      },
    });

    // Create course error handling
    if (!course) {
      throw new Error("Failed to create course.");
    }

    // Create course prereqs
    const prereqs: any[] = [];
    await prisma.coursePrereq.createMany({
      data: parsedResult.prereqs.map((p: CoursePrereq) => {
        const prereqId = crypto.randomUUID();
        const prereq = {
          id: prereqId,
          courseId: course.id,
          title: p.title,
          description: p.description,
          topics: p.topics,
        };
        prereqs.push(prereq);
        return {
          id: prereqId,
          courseId: course.id,
          title: p.title,
          description: p.description,
        };
      }),
    });

    if (!prereqs) {
      throw new Error("Failed to create course prereqs");
    }

    prereqs.map(async (prereq: CoursePrereq) => {
      const topicIds: string[] = [];
      await prisma.prereqTopic.createMany({
        data: prereq.topics.map((topic: Maybe<PrereqTopic>) => {
          const topicId = crypto.randomUUID();
          topicIds.push(topicId);
          return {
            id: topicId,
            prereqId: prereq.id,
            title: topic ? topic.title : "",
            description: topic ? topic.description : "",
          };
        }),
      });
      await prisma.coursePrereq.update({
        where: {
          id: prereq.id,
        },
        data: {
          topics: {
            connect: topicIds.map((id: string) => ({ id })),
          },
        },
      });
    });

    const units: any[] = [];
    await prisma.courseUnit.createMany({
      data: parsedResult.units.map((unit: CourseUnit) => ({
        id: crypto.randomUUID(),
        courseId: course.id,
        title: unit.title,
        description: unit.description,
        status: Status.Pending,
      })),
    });

    if (!units) {
      throw new Error("Failed to create course units");
    }

    units.map(async (unit: CourseUnit) => {
      const lessonIds: string[] = [];
      await prisma.unitLesson.createMany({
        data: unit.lessons.map((lesson: Maybe<UnitLesson>) => {
          const lessonId = crypto.randomUUID();
          lessonIds.push(lessonId);
          return {
            id: lessonId,
            unitId: unit.id,
            title: lesson ? lesson.title : "",
            content: lesson ? lesson.content : "",
            status: Status.Pending,
          };
        }),
      });
      await prisma.courseUnit.update({
        where: {
          id: unit.id,
        },
        data: {
          lessons: {
            connect: lessonIds.map((id: string) => ({ id })),
          },
        },
      });
    });

    await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        prereqs: { connect: prereqs.map((prereq) => ({ id: prereq.id })) },
        units: { connect: units.map((unit) => ({ id: unit.id })) },
      },
    });

    return course; // Return course
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
