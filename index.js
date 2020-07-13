require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')


let persons = [
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      },
      {
        "name": "rhea",
        "number": "645612",
        "id": 7
      },
      {
        "name": "shivani",
        "number": "84566666",
        "id": 9
      }
]

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(morgan(':method :url :status :req[body] - :response-time ms :body'))

morgan.token('body', (req) => {
  const body = JSON.stringify(req.body)
  if (body === JSON.stringify({})) {
      return ''
  }
  else {
      return body
  }
})
//error handler as a middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
})
})

const generateId = () => {
 return Math.floor(Math.random() * 100000) 
}

app.post('/api/persons', (req, res) => {
  if (!req.body.name || !req.body.number) {
      return res.status(400).json({
          error: 'content missing'
      })
  }

  //  if (persons.find(p => p.name === req.body.name)) {
  //       return res.status(404).json({
  //           error: 'name must be unique'
  //       })
  //   }
 // console.log(req.body)
  const person = new Person({
    name:  req.body.name,
    number: req.body.number,
    id: generateId(),
  })

  person.save().then(result => {
    res.json(result)
})
.catch(error => next(error))
})

app.get('/info', (req, res) => {
        res.send(`Phonebook has ${persons.length} people` + "\n" + new Date())
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
