const Joi = require('joi');
const express = require('express');
require('dotenv').config('index.js');

const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' },
];

// GET all the course
app.get('/api/courses', (req, res) => {
  res.send(courses);
});

// GET course by id
app.get('/api/courses/:id', (req, res) => {
  // Lookup the course by id
  const course = courses.find((it) => it.id === parseInt(req.params.id));

  // if course id not found throw error
  if (!course) return res.status(404).send('The given id is not found');

  // else send response
  res.send(course);
});

// POST Request
app.post('/api/courses', (req, res) => {
  //validate the request
  const { error } = validateCourse(req.body);
  // if invalid request throw error
  if (error) return res.status(400).send(`${error}`);

  // create course
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  // push the course in array
  courses.push(course);

  // send response
  res.send(course);
});

// PUT request
app.put('/api/courses/:id', (req, res) => {
  // Lookup the course by id
  const course = courses.find((it) => it.id === parseInt(req.params.id));

  // if course id not found return error 404
  if (!course) return res.status(404).send('The given id is not found');

  // Validate the course
  const { error } = validateCourse(req.body);

  // if not valid input like name 1 length return error
  if (error) return res.status(400).send('Bad Request');

  // everything ok send response
  course.name = req.body.name;
  res.send(course);
});

// function for validating using joi package
function validateCourse(course) {
  const scheema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return scheema.validate(course);
}

// Creating Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening port on ${port}`);
});
