// ----------------------------- authors CRUD ---------------------
import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"

const authorsRouter = express.Router()

// To obtain authors.json file path I need to do:
// 1. I'll start from the current file I am in (index.js) obtaining the file path to it
const currentFilePath = fileURLToPath(import.meta.url)
// 2. I'll obtain the current folder index.js file is in (src/services/authors folder)
const currentDirPath = dirname(currentFilePath)
// 3. I'll concatenate folder path with authors.json
const authorsJSONPath = join(currentDirPath, "authors.json")

// GET /authors => returns the list of authors 
authorsRouter.get("/", (request, response) => {
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
    response.send(authors)
})

// GET /authors/123 => returns a single author
authorsRouter.get("/:aID", (request, response) => {
const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
const author = authors.find(s => s.id === request.params.aID)
response.send(author)
})

// POST /authors => create a new author
authorsRouter.post("/", (request, response) => {
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))   
    const author = authors.find((author) => author.email === request.body.email)    
    if(!author) { // ! turns undefined(false) into true
        const newAuthor = { ...request.body, id: uniqid(), createdAt: new Date()} 
        authors.push(newAuthor)
        fs.writeFileSync(authorsJSONPath, JSON.stringify(authors))
        response.status(201).send({ id: newAuthor.id })
    } else {
        response.status(400).send("Author with the same email already exists")
    }   
})

// PUT /authors/123 => edit the author with the given id
authorsRouter.put("/:aID", (request, response) => {
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
    const updatedAuthor = { ...request.body, id: request.params.aID }
    const remainingAuthors = authors.filter(author => author.id !== request.params.aID)
    remainingAuthors.push(updatedAuthor)

    fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors))
    response.send(updatedAuthor)
})

// DELETE /authors/123 => delete the author with the given id
authorsRouter.delete("/:aID", (request, response) => {
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
    const remainingAuthors = authors.filter(author => author.id !== request.params.aID)
    
    fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors))
    response.status(204).send()
})

export default authorsRouter