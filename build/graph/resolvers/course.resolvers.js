"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseMutationResolvers = exports.courseQueryResolvers = void 0;
const resolvers_types_1 = require("../../__generated__/resolvers-types");
const zod_1 = require("zod");
const { OpenAI, PromptTemplate } = require("langchain");
const { StructuredOutputParser } = require("langchain/output_parsers");
const crypto = require("crypto");
exports.courseQueryResolvers = {
    // Course query resolver
    course: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
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
        const course = yield prisma.course.findUnique({
            where: { id },
            include: {
                prereqs: {
                    include: {
                        topics: true,
                    },
                },
                units: {
                    include: {
                        lessons: true,
                        exercises: true,
                        quizzes: {
                            include: {
                                questions: true,
                            },
                        },
                    },
                },
            },
        });
        // Find course error handling
        if (!course) {
            throw new Error("Failed to find course");
        }
        return course;
    }),
    // Courses query resolver
    courses: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
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
        const courses = yield prisma.course.findMany({
            where: { authorId },
        });
        // Find courses error handling
        if (!courses) {
            throw new Error("Failed to find courses");
        }
        return courses;
    }),
    // Courses query resolver
    allCourses: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Find courses
        const courses = yield prisma.course.findMany();
        // Find courses error handling
        if (!courses) {
            throw new Error("Failed to find courses");
        }
        return courses;
    }),
    // Courses query resolver
    exercises: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Grab args
        const { unitId } = args;
        // Grab args error handling
        if (!unitId) {
            throw new Error("Missing required fields");
        }
        // Find courses
        const exercises = yield prisma.unitExercise.findMany({
            where: { unitId },
        });
        // Find courses error handling
        if (!exercises) {
            throw new Error("Failed to find courses");
        }
        return exercises;
    }),
};
exports.courseMutationResolvers = {
    // Create course mutation resolver
    createCourse: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
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
        // // Create model
        // const model = new OpenAI({
        //   openAIApiKey: process.env.OPENAI_API_KEY,
        //   temperature: 0,
        //   modelName: "gpt-3.5-turbo",
        //   // modelName: "gpt-4",
        // });
        // // Create model error handling
        // if (!model) {
        //   throw new Error("Failed to create model");
        // }
        // // Create parser
        // const parser = StructuredOutputParser.fromZodSchema(
        //   z.object({
        //     title: z.string().describe("Title of the course"),
        //     description: z.string().describe("Description of the course"),
        //     prereqs: z
        //       .array(
        //         z.object({
        //           title: z.string().describe("Title of the course prerequsiite"),
        //           description: z
        //             .string()
        //             .describe("Description of the course prerequisite"),
        //           topics: z
        //             .array(
        //               z.object({
        //                 title: z
        //                   .string()
        //                   .describe("Title of the course prerequisite topic"),
        //                 description: z
        //                   .string()
        //                   .describe("Description of the course prerequisite topic"),
        //               })
        //             )
        //             .describe("Topics of the course prerequisite"),
        //         })
        //       )
        //       .describe("Prerequisites of the course"),
        //     units: z
        //       .array(
        //         z.object({
        //           title: z.string().describe("Title of the unit"),
        //           description: z.string().describe("Description of the unit"),
        //           lessons: z.array(
        //             z.object({
        //               title: z.string().describe("Title of the lesson"),
        //               topics: z
        //                 .array(z.string().describe("Topics covered in the lesson"))
        //                 .describe("Topics covered in the lesson"),
        //             })
        //           ),
        //         })
        //       )
        //       .describe("Units of the course"),
        //     intended_outcomes: z
        //       .array(z.string().describe("Intended outcome of the course"))
        //       .describe("Intended outcomes of the course"),
        //   })
        // );
        // // Create parser error handling
        // if (!parser) {
        //   throw new Error("Failed to create parser");
        // }
        // // Create formatInstructions
        // const formatInstructions = parser.getFormatInstructions();
        // // Create formatInstructions error handling
        // if (!formatInstructions) {
        //   throw new Error("Failed to create formatInstructions");
        // }
        // // Create promptTemplate
        // const promptTemplate = new PromptTemplate({
        //   template: `Generate a course with the following title: "{title}" and description: "{description}" and format: {format_instructions}.`,
        //   inputVariables: ["title", "description"],
        //   partialVariables: { format_instructions: formatInstructions },
        // });
        // // Create promptTemplate error handling
        // if (!promptTemplate) {
        //   throw new Error("Failed to create promptTemplate");
        // }
        // // Create prompt
        // const prompt = await promptTemplate.format({ title, description });
        // // Create prompt error handling
        // if (!prompt) {
        //   throw new Error("Failed to create prompt");
        // }
        // // Query openai
        // const result = await model.call(prompt);
        // // Query openai error handling
        // if (!result) {
        //   throw new Error("Failed to call openai");
        // }
        // console.log("result: ", result);
        // // Parse result
        // const parsedResult = await parser.parse(result);
        // // Parse result error handling
        // if (!parsedResult) {
        //   throw new Error("Failed to parse result");
        // }
        // Create course
        // const courseId = crypto.randomUUID();
        const course = yield prisma.course.create({
            data: {
                // id: courseId,
                id: crypto.randomUUID(),
                authorId,
                title,
                description,
                status: resolvers_types_1.Status.Pending,
                // intendedOutcomes: parsedResult.intended_outcomes,
            },
        });
        // Create course error handling
        if (!course) {
            throw new Error("Failed to create course.");
        }
        return course;
        // // Create course prereqs
        // const prereqs: any[] = [];
        // await prisma.coursePrereq.createMany({
        //   data: parsedResult.prereqs.map((p: CoursePrereq) => {
        //     const prereqId = crypto.randomUUID();
        //     const prereq = {
        //       id: prereqId,
        //       courseId: course.id,
        //       title: p.title,
        //       description: p.description,
        //       topics: p.topics,
        //     };
        //     prereqs.push(prereq);
        //     return {
        //       id: prereqId,
        //       courseId: course.id,
        //       title: p.title,
        //       description: p.description,
        //     };
        //   }),
        // });
        // // Create course prereqs error handling
        // if (!prereqs) {
        //   throw new Error("Failed to create course prereqs");
        // }
        // // Create course prereq topics and update prereqs with topics
        // prereqs.map(async (prereq: CoursePrereq) => {
        //   const topicIds: string[] = [];
        //   await prisma.prereqTopic.createMany({
        //     data: prereq.topics.map((topic: Maybe<PrereqTopic>) => {
        //       const topicId = crypto.randomUUID();
        //       topicIds.push(topicId);
        //       return {
        //         id: topicId,
        //         prereqId: prereq.id,
        //         title: topic ? topic.title : "",
        //         description: topic ? topic.description : "",
        //       };
        //     }),
        //   });
        //   await prisma.coursePrereq.update({
        //     where: {
        //       id: prereq.id,
        //     },
        //     data: {
        //       topics: {
        //         connect: topicIds.map((id: string) => ({ id })),
        //       },
        //     },
        //   });
        // });
        // // Create course units
        // const units: any[] = [];
        // await prisma.courseUnit.createMany({
        //   data: parsedResult.units.map((u: CourseUnit) => {
        //     const unitId = crypto.randomUUID();
        //     const unit = {
        //       id: unitId,
        //       courseId: course.id,
        //       title: u.title,
        //       description: u.description,
        //       lessons: u.lessons,
        //       status: Status.Pending,
        //     };
        //     units.push(unit);
        //     return {
        //       id: unitId,
        //       courseId: course.id,
        //       title: u.title,
        //       description: u.description,
        //       status: Status.Pending,
        //     };
        //   }),
        // });
        // // Create course units error handling
        // if (!units) {
        //   throw new Error("Failed to create course prereqs");
        // }
        // // Create course prereq topics and update prereqs with topics
        // units.map(async (unit: CourseUnit) => {
        //   const lessonIds: string[] = [];
        //   await prisma.unitLesson.createMany({
        //     data: unit.lessons.map((lesson: Maybe<UnitLesson>) => {
        //       const lessonId = crypto.randomUUID();
        //       lessonIds.push(lessonId);
        //       return {
        //         id: lessonId,
        //         unitId: unit.id,
        //         title: lesson ? lesson.title : "",
        //         topics: lesson ? lesson.topics.toString() : "",
        //         content: "",
        //         status: Status.Pending,
        //       };
        //     }),
        //   });
        //   await prisma.courseUnit.update({
        //     where: {
        //       id: unit.id,
        //     },
        //     data: {
        //       lessons: {
        //         connect: lessonIds.map((id: string) => ({ id })),
        //       },
        //     },
        //   });
        // });
        // // Update course with prereqs and units
        // await prisma.course.update({
        //   where: {
        //     id: courseId,
        //   },
        //   data: {
        //     prereqs: { connect: prereqs.map((prereq) => ({ id: prereq.id })) },
        //     units: { connect: units.map((unit) => ({ id: unit.id })) },
        //   },
        // });
        // return course; // Return course
    }),
    // Delete course mutation resolver
    deleteCourse: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        const { prisma } = contextValue;
        // Grab args
        const { id } = args;
        // Grab args error handling
        if (!id) {
            throw new Error("Missing required fields");
        }
        // Delete course
        const course = yield prisma.course.delete({
            where: {
                id,
            },
        });
        // Delete course error handling
        if (!course) {
            throw new Error("Failed to delete course");
        }
        return course;
    }),
    // Generate prereqs mutation resolver
    generatePrereqs: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        // Grab prisma client error handling
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Grab args
        const { id: courseId } = args;
        // Grab args error handling
        if (!courseId) {
            throw new Error("Missing required fields.");
        }
        // Grab course
        const course = yield prisma.course.findUnique({
            where: {
                id: courseId,
            },
        });
        // Grab course error handling
        if (!course) {
            throw new Error("Failed to find course.");
        }
        // Destructure course
        const { title, description } = course;
        // Destructure course error handling
        if (!title || !description) {
            throw new Error("Course is missing required fields.");
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
        const parser = StructuredOutputParser.fromZodSchema(zod_1.z
            .array(zod_1.z.object({
            title: zod_1.z.string().describe("Title of a course prerequisite"),
            description: zod_1.z
                .string()
                .describe("A two sentence description of a course prerequisite"),
            topics: zod_1.z
                .array(zod_1.z.object({
                title: zod_1.z
                    .string()
                    .describe("Title of a course prerequisite topic"),
                description: zod_1.z
                    .string()
                    .describe("A two sentence description of a course prerequisite topic"),
            }))
                .describe("Topics of a course prerequisite"),
        }))
            .describe("Prerequisites of a course"));
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
            template: `What are the most important prerequisites for a course called "{title}" which has the following description: "{description}". Output the response with the following format: {format_instructions}. Limit the number of prerequisites to the top 3.`,
            inputVariables: ["title", "description"],
            partialVariables: { format_instructions: formatInstructions },
        });
        // Create promptTemplate error handling
        if (!promptTemplate) {
            throw new Error("Failed to create promptTemplate");
        }
        // Create prompt
        const prompt = yield promptTemplate.format({ title, description });
        // Create prompt error handling
        if (!prompt) {
            throw new Error("Failed to create prompt");
        }
        // Query openai
        const result = yield model.call(prompt);
        // Query openai error handling
        if (!result) {
            throw new Error("Failed to call openai");
        }
        // Parse result
        const parsedResult = yield parser.parse(result);
        // Parse result error handling
        if (!parsedResult) {
            throw new Error("Failed to parse result");
        }
        // Create course prereqs
        const prereqs = [];
        yield prisma.coursePrereq.createMany({
            data: parsedResult.map((p) => {
                const prereqId = crypto.randomUUID();
                const prereq = {
                    id: prereqId,
                    courseId: courseId,
                    title: p.title,
                    description: p.description,
                    topics: p.topics,
                };
                prereqs.push(prereq);
                return {
                    id: prereqId,
                    courseId: courseId,
                    title: p.title,
                    description: p.description,
                };
            }),
        });
        // Create course prereqs error handling
        if (!prereqs) {
            throw new Error("Failed to create course prereqs");
        }
        // Create course prereq topics and update prereqs with topics
        prereqs.map((prereq) => __awaiter(void 0, void 0, void 0, function* () {
            const topicIds = [];
            yield prisma.prereqTopic.createMany({
                data: prereq.topics.map((topic) => {
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
            yield prisma.coursePrereq.update({
                where: {
                    id: prereq.id,
                },
                data: {
                    topics: {
                        connect: topicIds.map((id) => ({ id })),
                    },
                },
            });
        }));
        // Update course with prereqs and units
        const updatedCourse = yield prisma.course.update({
            where: {
                id: courseId,
            },
            data: {
                prereqs: { connect: prereqs.map((prereq) => ({ id: prereq.id })) },
            },
        });
        console.log("updatedCourse: ", updatedCourse);
        return updatedCourse; // Return course
    }),
    // Generate prereqs mutation resolver
    generateUnits: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        // Grab prisma client error handling
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Grab args
        const { id: courseId } = args;
        // Grab args error handling
        if (!courseId) {
            throw new Error("Missing required fields.");
        }
        // Grab course
        const course = yield prisma.course.findUnique({
            where: {
                id: courseId,
            },
        });
        // Grab course error handling
        if (!course) {
            throw new Error("Failed to find course.");
        }
        // Destructure course
        const { title, description } = course;
        // Destructure course error handling
        if (!title || !description) {
            throw new Error("Course is missing required fields.");
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
        const parser = StructuredOutputParser.fromZodSchema(zod_1.z
            .array(zod_1.z.object({
            title: zod_1.z.string().describe("Title of a course unit"),
            description: zod_1.z.string().describe("Description of a course unit"),
            lessons: zod_1.z
                .array(zod_1.z
                .object({
                title: zod_1.z
                    .string()
                    .describe("Title of a course unit's lesson"),
                topics: zod_1.z
                    .array(zod_1.z
                    .string()
                    .describe("Topic covered in a course unit's lesson"))
                    .describe("Topics covered in a course unit's lesson"),
            })
                .describe("Lesson covered in a course unit"))
                .describe("Lessons covered in a course unit"),
        }))
            .describe("Units of a course"));
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
            template: `What are the most important units to cover for a course called "{title}" which has the following description: "{description}". Output the response with the following format: {format_instructions}. Each unit should contain a minimum of 3 lessons.`,
            inputVariables: ["title", "description"],
            partialVariables: { format_instructions: formatInstructions },
        });
        // Create promptTemplate error handling
        if (!promptTemplate) {
            throw new Error("Failed to create promptTemplate");
        }
        // Create prompt
        const prompt = yield promptTemplate.format({ title, description });
        // Create prompt error handling
        if (!prompt) {
            throw new Error("Failed to create prompt");
        }
        // Query openai
        const result = yield model.call(prompt);
        // Query openai error handling
        if (!result) {
            throw new Error("Failed to call openai");
        }
        // Parse result
        const parsedResult = yield parser.parse(result);
        // Parse result error handling
        if (!parsedResult) {
            throw new Error("Failed to parse result");
        }
        // Create course prereqs
        const units = [];
        yield prisma.courseUnit.createMany({
            data: parsedResult.map((u) => {
                const unitId = crypto.randomUUID();
                const unit = {
                    id: unitId,
                    courseId: courseId,
                    title: u.title,
                    description: u.description,
                    lessons: u.lessons,
                    status: resolvers_types_1.Status.Pending,
                };
                units.push(unit);
                return {
                    id: unitId,
                    courseId: courseId,
                    title: u.title,
                    description: u.description,
                    status: resolvers_types_1.Status.Pending,
                };
            }),
        });
        // Create course prereqs error handling
        if (!units) {
            throw new Error("Failed to create course prereqs");
        }
        // Create course prereq topics and update prereqs with topics
        units.map((unit) => __awaiter(void 0, void 0, void 0, function* () {
            const lessonIds = [];
            yield prisma.unitLesson.createMany({
                data: unit.lessons.map((lesson) => {
                    const lessonId = crypto.randomUUID();
                    lessonIds.push(lessonId);
                    return {
                        id: lessonId,
                        unitId: unit.id,
                        title: lesson ? lesson.title : "",
                        topics: lesson ? lesson.topics.toString() : "",
                        content: "",
                        status: resolvers_types_1.Status.Pending,
                    };
                }),
            });
            yield prisma.courseUnit.update({
                where: {
                    id: unit.id,
                },
                data: {
                    lessons: {
                        connect: lessonIds.map((id) => ({ id })),
                    },
                },
            });
        }));
        // Update course with units
        const updatedCourse = yield prisma.course.update({
            where: {
                id: courseId,
            },
            data: {
                units: { connect: units.map((unit) => ({ id: unit.id })) },
            },
        });
        return updatedCourse; // Return course
    }),
    // Generate intended outcomes mutation resolver
    generateIntendedOutcomes: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        // Grab prisma client error handling
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Grab args
        const { id: courseId } = args;
        // Grab args error handling
        if (!courseId) {
            throw new Error("Missing required fields.");
        }
        // Grab course
        const course = yield prisma.course.findUnique({
            where: {
                id: courseId,
            },
        });
        // Grab course error handling
        if (!course) {
            throw new Error("Failed to find course.");
        }
        // Destructure course
        const { title, description } = course;
        // Destructure course error handling
        if (!title || !description) {
            throw new Error("Course is missing required fields.");
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
        const parser = StructuredOutputParser.fromZodSchema(zod_1.z
            .array(zod_1.z.string().describe("Intended outcome of a course"))
            .describe("A list of intended outcomes for a course"));
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
            template: `Generate a list of the most important intended outcomes for a course called "{title}" which has the following description: "{description}". Output the response with the following format: {format_instructions}. The list should contain no more than 5 intended outcomes.`,
            inputVariables: ["title", "description"],
            partialVariables: { format_instructions: formatInstructions },
        });
        // Create promptTemplate error handling
        if (!promptTemplate) {
            throw new Error("Failed to create promptTemplate");
        }
        // Create prompt
        const prompt = yield promptTemplate.format({ title, description });
        // Create prompt error handling
        if (!prompt) {
            throw new Error("Failed to create prompt");
        }
        // Query openai
        const result = yield model.call(prompt);
        // Query openai error handling
        if (!result) {
            throw new Error("Failed to call openai");
        }
        // Parse result
        const parsedResult = yield parser.parse(result);
        // Parse result error handling
        if (!parsedResult) {
            throw new Error("Failed to parse result");
        }
        // Update course with units
        const updatedCourse = yield prisma.course.update({
            where: {
                id: courseId,
            },
            data: {
                intendedOutcomes: parsedResult,
            },
        });
        return updatedCourse; // Return course
    }),
    // Generate exercises mutation resolver
    generateExercises: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        // Grab prisma client error handling
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Grab args
        const { id: unitId } = args;
        // Grab args error handling
        if (!unitId) {
            throw new Error("Missing required fields.");
        }
        // Grab course
        const unit = yield prisma.courseUnit.findUnique({
            where: {
                id: unitId,
            },
            include: {
                lessons: true,
                exercises: true,
            },
        });
        // Grab course error handling
        if (!unit) {
            throw new Error("Failed to find course.");
        }
        // Destructure course
        const { title, description, lessons } = unit;
        // Destructure course error handling
        if (!title || !description || !lessons) {
            throw new Error("Course is missing required fields.");
        }
        const topics = lessons.map((lesson) => lesson.topics).join(" ");
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
        const parser = StructuredOutputParser.fromZodSchema(zod_1.z
            .array(zod_1.z
            .object({
            task: zod_1.z
                .string()
                .describe("The task required to complete the exercise"),
        })
            .describe("Exercise for a course"))
            .describe("A list of exercises for a course"));
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
            template: `Generate a list of exercise tasks for a unit in a course. The unit is called "{title}", has the following description: "{description}", and covers the following topics: {topics}. Output the response with the following format: {format_instructions}. Only include the list.`,
            inputVariables: ["title", "description", "topics"],
            partialVariables: { format_instructions: formatInstructions },
        });
        // Create promptTemplate error handling
        if (!promptTemplate) {
            throw new Error("Failed to create promptTemplate");
        }
        // Create prompt
        const prompt = yield promptTemplate.format({ title, description, topics });
        // Create prompt error handling
        if (!prompt) {
            throw new Error("Failed to create prompt");
        }
        // Query openai
        const result = yield model.call(prompt);
        // Query openai error handling
        if (!result) {
            throw new Error("Failed to call openai");
        }
        // Parse result
        const parsedResult = yield parser.parse(result);
        // Parse result error handling
        if (!parsedResult) {
            throw new Error("Failed to parse result");
        }
        // Create course prereqs
        const exerciseIds = [];
        const exercises = yield prisma.unitExercise.createMany({
            data: parsedResult.map((e) => {
                const exerciseId = crypto.randomUUID();
                exerciseIds.push(exerciseId);
                return {
                    id: exerciseId,
                    unitId: unitId,
                    task: e.task,
                    status: resolvers_types_1.Status.Pending,
                };
            }),
        });
        // Create course prereqs error handling
        if (!exercises) {
            throw new Error("Failed to create course prereqs");
        }
        // Update course with units
        const updatedUnit = yield prisma.courseUnit.update({
            where: {
                id: unitId,
            },
            data: {
                exercises: {
                    connect: exerciseIds.map((id) => ({ id })),
                },
            },
            include: {
                exercises: true,
            },
        });
        return updatedUnit.exercises; // Return course
    }),
    // Generate Quiz
    generateQuiz: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        // Grab prisma client error handling
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Grab args
        const { id } = args;
        // Grab args error handling
        if (!id) {
            throw new Error("Missing required fields.");
        }
        // Grab course
        const unit = yield prisma.courseUnit.findUnique({
            where: {
                id,
            },
            include: {
                lessons: true,
                quizzes: true,
            },
        });
        // Grab course error handling
        if (!unit) {
            throw new Error("Failed to find unit.");
        }
        // Destructure course
        const { title, description, lessons } = unit;
        // Destructure course error handling
        if (!title || !description || !lessons) {
            throw new Error("Course is missing required fields.");
        }
        // Grab topics
        const topics = lessons.map((lesson) => lesson.topics).join(" ");
        // Grab topics error handling
        if (!topics) {
            throw new Error("Failed to find topics.");
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
        const parser = StructuredOutputParser.fromZodSchema(zod_1.z
            .object({
            questions: zod_1.z
                .array(zod_1.z.object({
                question: zod_1.z.string().describe("A question for a quiz"),
                choices: zod_1.z
                    .array(zod_1.z.string())
                    .describe("A list of choices for a question"),
                answer: zod_1.z.string().describe("The answer to the question"),
            }))
                .describe("A list of quiz questions for a course unit"),
        })
            .describe("A list of quiz questions for a course unit"));
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
            template: `Generate a multiple choice quiz for a unit in a course. The unit is called "{title}", has the following description: "{description}", and covers the following topics: {topics}. Output the response with the following format: {format_instructions}.`,
            inputVariables: ["title", "description", "topics"],
            partialVariables: { format_instructions: formatInstructions },
        });
        // Create promptTemplate error handling
        if (!promptTemplate) {
            throw new Error("Failed to create promptTemplate");
        }
        // Create prompt
        const prompt = yield promptTemplate.format({ title, description, topics });
        // Create prompt error handling
        if (!prompt) {
            throw new Error("Failed to create prompt");
        }
        // Query openai
        const result = yield model.call(prompt);
        // Query openai error handling
        if (!result) {
            throw new Error("Failed to call openai");
        }
        // Parse result
        const parsedResult = yield parser.parse(result);
        // Parse result error handling
        if (!parsedResult) {
            throw new Error("Failed to parse result");
        }
        const quizId = crypto.randomUUID();
        const quiz = yield prisma.unitQuiz.create({
            data: {
                id: quizId,
                unitId: unit.id,
                status: resolvers_types_1.Status.Pending,
            },
        });
        // Create quiz error handling
        if (!quiz) {
            throw new Error("Failed to create unit quiz");
        }
        const questionIds = [];
        const quesitons = yield prisma.quizQuestion.createMany({
            data: parsedResult.questions.map((q) => {
                const questionId = crypto.randomUUID();
                questionIds.push(questionId);
                return {
                    id: questionId,
                    quizId: quizId,
                    question: q.question,
                    choices: q.choices,
                    answer: q.answer,
                    status: resolvers_types_1.Status.Pending,
                };
            }),
        });
        // Create quiz questions error handling
        if (!quesitons) {
            throw new Error("Failed to create unit quiz");
        }
        const updatedQuiz = yield prisma.unitQuiz.update({
            where: {
                id: quizId,
            },
            data: {
                questions: {
                    connect: questionIds.map((id) => ({ id })),
                },
            },
        });
        // Update course with units
        const updatedUnit = yield prisma.courseUnit.update({
            where: {
                id,
            },
            data: {
                quizzes: {
                    connect: { id: quizId },
                },
            },
            include: {
                quizzes: {
                    include: {
                        questions: true,
                    },
                },
            },
        });
        return updatedUnit.quizzes.find((quiz) => quiz.id === quizId); // Return course
    }),
    // Generate lesson mutation resolver
    generateLesson: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        // Grab prisma client error handling
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Grab args
        const { courseTitle, courseDescription, lessonId, lessonTitle, topics, pastTopics, } = args.input;
        // Grab args error handling
        if (!courseTitle ||
            !courseDescription ||
            !lessonId ||
            !lessonTitle ||
            !topics) {
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
        // Create promptTemplate
        const promptTemplate = new PromptTemplate({
            template: `Generate a lesson for a course on "{courseTitle}". The title of the lesson is "{lessonTitle}", and it should cover the following topics: "{topics}". The output should be in markdown format.`,
            inputVariables: ["courseTitle", "lessonTitle", "topics"],
        });
        // Create promptTemplate error handling
        if (!promptTemplate) {
            throw new Error("Failed to create promptTemplate");
        }
        // Create prompt
        const prompt = yield promptTemplate.format({
            courseTitle,
            courseDescription,
            lessonTitle,
            topics,
        });
        // Create prompt error handling
        if (!prompt) {
            throw new Error("Failed to create prompt");
        }
        // Query openai
        const result = yield model.call(prompt);
        // Query openai error handling
        if (!result) {
            throw new Error("Failed to call openai");
        }
        // Update lesson with content
        const lesson = yield prisma.unitLesson.update({
            where: {
                id: lessonId,
            },
            data: {
                content: result,
            },
        });
        // Update lesson with content error handling
        if (!lesson) {
            throw new Error("Failed to update lesson with content");
        }
        return lesson;
    }),
};
