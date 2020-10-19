/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "request.*.expect"] }] */
/* eslint-disable no-underscore-dangle */
const { afterAll, beforeEach, expect, test } = require('@jest/globals');

const mongoose = require('mongoose');
const request = require('supertest');

const app = require('../app.js');
const Blog = require('../models/blog.js');
const { blogsInDb, initialBlogs } = require('./test_helper.js');

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());

  await Promise.all(promiseArray);
});

test('blogs are returned as json', async () => {
  await request(app)
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all blogs are returned', async () => {
  const response = await request(app).get('/api/blogs');

  expect(response.body.length).toBe(initialBlogs.length);
});

test('blogs have id property instead of _id', async () => {
  const response = await request(app).get('/api/blogs');
  const blog = response.body[0];

  expect(blog.id).toBeDefined();
  expect(blog._id).not.toBeDefined();
});

test('addition of a new blog with default likes', async () => {
  const newBlog = {
    title: 'smth perfect',
    author: 'unknown',
    url: 'http://example.com',
  };

  const response = await request(app)
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  expect(response.body.likes).toBe(0);

  const blogsAtEnd = await blogsInDb();
  expect(blogsAtEnd.length).toBe(initialBlogs.length + 1);

  const titles = blogsAtEnd.map((blog) => blog.title);
  expect(titles).toContain(newBlog.title);
});

test('addition of a new blog with invalid data', async () => {
  const newBlog = {
    url: 'http://example.com',
  };

  await request(app).post('/api/blogs').send(newBlog).expect(400);

  const blogsAtEnd = await blogsInDb();
  expect(blogsAtEnd.length).toBe(initialBlogs.length);
});

test('deletion of a note', async () => {
  const blogsAtStart = await blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await request(app).delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await blogsInDb();

  expect(blogsAtEnd.length).toBe(initialBlogs.length - 1);

  const titles = blogsAtEnd.map((blog) => blog.title);

  expect(titles).not.toContain(blogToDelete.title);
});

afterAll(() => {
  mongoose.connection.close();
});
