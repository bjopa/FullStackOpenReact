const mongoose = require('mongoose')

if (process.argv.length < 3 || process.argv.length === 4 || process.argv.length > 5) {
  console.log('Incorrect number of args')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://bjopa:${password}@fullstacknotes.gyjpl.mongodb.net/phonebook?retryWrites=true&w=majority&appName=FullstackNotes`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number,
})

if (process.argv.length === 3) {
  console.log('\nPhonebook:')
  Person.find().then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  person.save().then(() => {
    console.log(`Added ${name}, number ${number}, to Phonebook`)
    mongoose.connection.close()
  })
}
