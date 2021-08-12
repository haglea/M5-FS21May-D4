import express from "express"
import authorsRouter from "./services/authors/index.js"
import listEndpoints from "express-list-endpoints"
import blogPostsRouter from "./services/blogPosts/index.js"

const server = express();
const port = 3001;

// ***************** MIDDLEWARES *******************************
const loggerMiddleware = (request, response, next) => {
  //console.log(`Request method ${request.method} -- Request URL ${request.url} -- ${new Date()}`)
  next() 
}

// GLOBAL LEVEL MIDDLEWARES
server.use(loggerMiddleware)

server.use(express.json()) //this comes before the routes
server.use("/authors", authorsRouter)
server.use("/blogPosts", blogPostsRouter)

console.table(listEndpoints(server))
server.listen(port, () => {
  console.log(`Server running at ${port}/`);
});