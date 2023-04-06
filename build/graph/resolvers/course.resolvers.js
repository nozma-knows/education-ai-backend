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
const client_1 = require("@prisma/client");
const llms_1 = require("langchain/llms");
const langchain_1 = require("langchain");
const output_parsers_1 = require("langchain/output_parsers");
const zod_1 = require("zod");
const crypto = require("crypto");
const prisma = new client_1.PrismaClient();
exports.courseQueryResolvers = {
    // Course query resolver
    course: (_parent, args) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab args
        const { id } = args;
        // Grab args error handling
        if (!id) {
            throw new Error("Missing required fields");
        }
        // Find course
        const course = yield prisma.course.findUnique({
            where: { id },
        });
        // Find course error handling
        if (!course) {
            throw new Error("Failed to find course");
        }
        return course;
    }),
    // Courses query resolver
    courses: (_parent, args) => __awaiter(void 0, void 0, void 0, function* () {
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
};
exports.courseMutationResolvers = {
    // Create course mutation resolver
    createCourse: (_parent, args) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab args
        const { authorId, title, description } = args.input;
        // Grab args error handling
        if (!authorId || !title || !description) {
            throw new Error("Missing required fields");
        }
        // Create model
        const model = new llms_1.OpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            temperature: 0,
            modelName: "gpt-3.5-turbo",
        });
        // Create model error handling
        if (!model) {
            throw new Error("Failed to create model");
        }
        // Create parser
        const parser = output_parsers_1.StructuredOutputParser.fromZodSchema(zod_1.z.object({
            title: zod_1.z.string().describe("Name of the course"),
            description: zod_1.z.string().describe("Description of the course"),
            prereqs: zod_1.z
                .array(zod_1.z.object({
                title: zod_1.z.string().describe("Name of the prerequisite"),
                description: zod_1.z
                    .string()
                    .describe("Description of the prerequisite"),
                topics: zod_1.z
                    .array(zod_1.z.object({ title: zod_1.z.string(), description: zod_1.z.string() }))
                    .describe("Topics covered in the prerequisite"),
            }))
                .describe("Prerequisites for the course"),
            units: zod_1.z
                .array(zod_1.z.object({
                title: zod_1.z.string().describe("Name of unit"),
                sections: zod_1.z.array(zod_1.z.object({
                    title: zod_1.z.string().describe("Name of unit"),
                    description: zod_1.z.string().describe("Description of unit"),
                })),
            }))
                .describe("Units in the course"),
            intendedOutcomes: zod_1.z
                .array(zod_1.z.string())
                .describe("Intended outcomes for the course"),
        }));
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
        const promptTemplate = new langchain_1.PromptTemplate({
            template: "Create a syllabus for a course with the following title: {title} and description: {description} and format: {format_instructions}.",
            inputVariables: ["title", "description"],
            partialVariables: { format_instructions: formatInstructions },
        });
        // Create prompt template error handling
        if (!promptTemplate) {
            throw new Error("Failed to create prompt template");
        }
        // Create prompt
        const prompt = yield promptTemplate.format({ title, description });
        // Create prompt error handling
        if (!prompt) {
            throw new Error("Failed to create prompt");
        }
        // Call openai
        const result = yield model.call(prompt);
        const parsedResult = parser.parse(result);
        // Openai results error handling
        if (!parsedResult) {
            throw new Error("Failed to create course");
        }
        // Create courseId
        const courseId = crypto.randomUUID();
        // Create courseId error handling
        if (!courseId) {
            throw new Error("Failed to create courseId");
        }
        // Create prereqId
        const prereqId = crypto.randomUUID();
        // Create prereqId error handling
        if (!prereqId) {
            throw new Error("Failed to create prereqId");
        }
        // Create prereqs
        const prereqs = parsedResult.prereqs.map((prereq) => {
            return {
                id: prereqId,
                courseId,
                title: prereq.title,
                description: prereq.description,
                topics: prereq.topics.map((topic) => {
                    return {
                        id: crypto.randomUUID(),
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
        const units = parsedResult.units.map((unit) => {
            return {
                id: crypto.randomUUID(),
                courseId,
                title: unit.title,
                description: unit.description,
                lessons: null,
            };
        });
        // Create units error handling
        if (!units) {
            throw new Error("Failed to create units");
        }
        // Create course
        const course = yield prisma.course.create({
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
    }),
    // Delete course mutation resolver
    deleteCourse: (_parent, args) => __awaiter(void 0, void 0, void 0, function* () {
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
};
