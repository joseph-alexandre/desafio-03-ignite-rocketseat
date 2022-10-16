const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkExistsRepository (request, response, next){
  const {id} = request.params;
  const repository = repositories.find(item => item.id === id);

  if (repository === undefined) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repository = repository;
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", checkExistsRepository, (request, response) => {
  const {title, url, techs} = request.body;
  const { repository } = request;

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", checkExistsRepository, (request, response) => {
  const {repository} = request;

  repositoryIndex = repositories.findIndex(item => item.id === repository.id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", checkExistsRepository, (request, response) => {
  const { repository } = request;

  const likes = ++repository.likes;

  return response.json({
    likes
  });
});

module.exports = app;
