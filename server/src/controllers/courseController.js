import { CourseModel, searchCourses } from "../models/courseModel.js";
import llm from "../config/openAI.js";
import openAIController from "../controllers/openAIController.js";
import EmploymentModel from "../models/employmentModel.js";

/**
 * Handles GET request for course search.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
async function getSearch(req, res) {
  try {
    const query = req.query.q;
    const results = await searchCourses(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "An error occurred during the search." });
  }
}

/**
 * Handles GET request for user aspiration processing.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
async function getAspiration(req, res) {
  try {
    const userAspiration = req.body.aspiration;
    const userCourse = req.params.course;

    const input = await openAIController.prompt.format({
      aspiration: userAspiration,
      course: userCourse,
    });

    const response = await llm.call(input);
    const structuredResponse = await openAIController.parser.parse(response);
    res.json(structuredResponse);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

/**
 * Handles GET request for specific course information.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
async function getCourse(req, res) {
  try {
    const course = await CourseModel.findOne({
      course_name: decodeURIComponent(req.params.course),
    });
    if (!course) {
      return res.status(400).send("Course does not exist.");
    }
    res.json(course);
  } catch (error) {
    res.status(500).send("Error retrieving course.");
  }
}

/**
 * Handles GET request for specific course employment information.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
async function getEmployment(req, res) {
  try {
    const employment = await EmploymentModel.findOne({
      degree: decodeURIComponent(req.params.course),
      year: req.body.year,
    });
    if (!employment) {
      return res.status(400).send("Employment does not exist.");
    }
    res.json(employment);
  } catch (error) {
    res.status(500).send("Error retrieving employment.");
  }
}

export default { getSearch, getAspiration, getCourse, getEmployment };