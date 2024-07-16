const express = require('express')
const app = express()
require('dotenv').config()
const Note = require('./note')
app.use(express.static('dist'))
const fs = require('fs');
const path = require('path');


const requestLogger = (request, response, next) => {
  const time = new Date().toISOString();
  const message = `${time} | Method: ${request.method} | Path: ${request.path} | Body: ${JSON.stringify(request.body)}\n`;
  const filePath = path.join(__dirname, 'log.txt');

  fs.appendFile(filePath, message, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
    next();
  });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(requestLogger)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/notes', async (request, response) => {
try {
  await Note.find({})
  .skip((request.query._page - 1) * request.query._per_page)
  .limit(request.query._per_page)
  .then(async notes => {
  const count = await Note.countDocuments({});
  const totalPagesCount = Math.ceil( count / request.query._per_page);
  response.status(200).json({notes, totalPagesCount});
  })
}
catch (error) 
{
  console.error('Error getting notes:', error);
  response.status(500).send("error");
}
})


app.post('/notes', (request, response) => {
  
  const body = request.body
  if (body.content === undefined)
    return response.status(400).send("Missing fields in the request")

  const note = new Note({
    id: body.id,
    title: body.title,
    author: body.author || null,
    content: body.content,
  })

  note.save().then(savedNote => {
    response.status(201).json(savedNote)
  })
})

app.get('/notes/:id', async (request, response, next) => {
  try {
    await Note.find({})
    .skip(request.params.id - 1)
    .limit(1)
    .then(async note => {
      if (note.length !== 0) {
        response.status(200).json({ note })
      } else {
        response.status(404).send("Unknown note number");
        return;
      }
    })
  }
  catch(error)
  {
    response.status(500).send("error");
  } 
})

app.delete('/notes/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
  }
    catch(error)
    {
      response.status(500).send("error");
    } 
  })

app.put('/notes/:id', async (request, response, next) => {
  try {
  const body = request.body

  const note = {
    id: body.id,
    title: body.title,
    author: body.author || null,
    content: body.content,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.status(201).json(updatedNote)
    })
  }
  catch(error)
  {
    response.status(500).send("error");
  } 
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})