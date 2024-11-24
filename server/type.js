import { z } from "zod";

// Define the validation schema for nested objects like student_info and location
const studentInfoSchema = z.object({
	name_title: z.string(),
	student_id: z.string(),
	year: z.number().int(),
	major: z.string(),
});

const locationSchema = z.object({
	house_no: z.string(),
	village_no: z.string(),
	sub_district: z.string(),
	district: z.string(),
	province: z.string(),
	postal_code: z.string(),
});

const courseSchema = z.object({
	course_id: z.string(),
	course_name: z.string(),
	section: z.number().int(),
	date: z.date(),
	credit: z.number(),
	lecturer: z.string(),
	approve_by: z.string(),
});

// Define the full content schema
const contentSchema = z.object({
	topic: z.string(),
	date: z.date(),
	person_in_charge: z.string(),
	student_info: studentInfoSchema,
	location: locationSchema,
	phone_no: z.string(),
	telephone_no: z.string(),
	advisor: z.string(),
	is_add: z.boolean(),
	courses: z.array(courseSchema),
	reason: z.string(),
});

// Define the full petition schema that contains the content
const petitionSchema = z.object({
	topic: z.string(),
	date: z.date(),
	person_in_charge: z.string(),
	student_info: studentInfoSchema,
	location: locationSchema,
	phone_no: z.string(),
	telephone_no: z.string(),
	advisor: z.string(),
	is_add: z.boolean(),
	courses: z.array(courseSchema),
	reason: z.string(),
});

export { contentSchema, petitionSchema };
