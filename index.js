const express = require('express')
const app = express()
require('dotenv').config()
const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('./client/build'))

morgan.token('body', (req, res) => { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get("/api/persons", (req, res) => {
    Person.find({}).then(phoneBook => {
        res.json(phoneBook);
    })
})

app.post("/api/persons", (req, res) => {
    const body = req.body;
    if (!body.number || !body.name) {
        return res.status(400).json({
            error: 'phone or name missing'
        })
    }
    const person = new Person({
        name: body.name,
        phone: body.number
    })

    person.save().then(savedPerson => {
        console.log('person saved!')
        console.log(savedPerson)
        res.json(savedPerson)
    })
})

app.get("/api/persons/:id", (req, res) => {
    Person.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note)
            }
            else {
                response.status(404).end();
            }
        })
        .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})