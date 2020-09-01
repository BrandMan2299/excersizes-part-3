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
    Person.findById(request.params.id).then(person => {
        res.json(person)
    })
})
// app.delete("/api/persons/:id", (req, res) => {
//     const id = Number(req.params.id)
//     phoneBook = phoneBook.filter(dude => dude.id !== id)

//     res.status(204).end();
// })


// app.get("/info", (req, res) => {
//     res.send(`phoneBook has ${phoneBook.length} pepole in it
//     ${new Date()}`);
// })

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})