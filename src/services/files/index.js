/* ---------------- PUT /files/upload ----------------  */

import express from "express"
import multer from "multer"
import { getAuthors, writeAuthors, saveAuthorsPicture } from "../../lib/fs-tools.js"
import { extname } from "path"

const filesRouter = express.Router()

// PUT /files/:aID/uploadAvatar
filesRouter.put("/:aID/uploadAvatar", multer().single("avatar"), async (req, res, next) => {
  try {
    console.log(req.file)
    const authors = await getAuthors()
    const authorIndex = authors.findIndex(
        (author) => author.id === req.params.aID
      );
      console.log(authorIndex)
      if (!authorIndex == -1) {
        res
          .status(404)
          .send({ message: `Author with ${req.params.aID} is not found!` });
      }
    const previousAuthorData = authors[authorIndex];
    const fileName = `${req.params.aID}${extname(req.file.originalname)}`
    
    const updatedAuthor = { 
        ...previousAuthorData, 
        avatar: `http://localhost:3001/img/authors/${fileName}`, 
        updatedAt: new Date(), 
        id: req.params.aID 
    }
    authors[authorIndex] = updatedAuthor;
    await saveAuthorsPicture(fileName, req.file.buffer)    
    
    const remainingAuthors = authors.filter(author => author.id !== req.params.aID)
    remainingAuthors.push(updatedAuthor)

    await writeAuthors(remainingAuthors)    
    res.send(updatedAuthor)
  } catch (error) {
    next(error)
  }
})


export default filesRouter