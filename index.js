const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())

morgan.token('body', (req, res) => { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let phoneBook = [
    {
        id: 1,
        name: "itai",
        phone: "054-798-8833"
    },
    {
        id: 2,
        name: "nir",
        phone: "054-987-6543"
    },
    {
        id: 5,
        name: "bob",
        phone: "054-123-4567"
    },
]
app.get("/api/persons", (req, res) => {
    res.json(phoneBook);
})

app.post("/api/persons", (req, res) => {
    const body = req.body;
    if (!body.phone || !body.name) {
        return res.status(400).json({
            error: 'phone or name missing'
        })
    }
    if (phoneBook.some(dude => dude.name === body.name)) {
        return res.status(400).json({ error: 'name must be unique' })
    }
    const id = Math.floor(Math.random() * 100) + 1;
    const person = {
        id: id,
        name: body.name,
        phone: body.phone
    }
    phoneBook.push(person);
    res.json(person);
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    phoneBook = phoneBook.filter(dude => dude.id !== id)

    res.status(204).end();
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const dude = phoneBook.find(person => person.id === id)
    if (dude) {
        res.json(dude);
    }
    else {
        res.status(404).end();
    }
})

app.get("/info", (req, res) => {
    res.send(`phoneBook has ${phoneBook.length} pepole in it
    ${new Date()}`);
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)