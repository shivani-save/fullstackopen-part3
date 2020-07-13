const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Enterthe password as node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://shiv98:${password}@cluster0.xtzlk.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

// const person = new Person({
//     name: 'Shivani',
//     number: '90047522'
// })

if (process.argv.length == 3) {
    console.log("Phonebook:")

    Person.find({}).then(results => {
        results.forEach(result => {
            console.log(`${result.name}: ${result.number}`)
        })
        mongoose.connection.close()
    })

} else if (process.argv.length == 5) {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(result => {
        console.log(`Added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}

