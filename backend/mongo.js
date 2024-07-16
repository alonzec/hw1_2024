const mongoose = require('mongoose')

const url = process.env.MONGODB_CONNECTION_URL

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  const noteSchema = new mongoose.Schema({
    id: Number,
    title: String,
    author: {name: String, email: string} || null,
    content: String
})
  
  const Note = mongoose.model('Note', noteSchema)
  
  Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    // mongoose.connection.close()
  })
})