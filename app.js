const { GraphQLServer } = require('graphql-yoga');

const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://localhost:27017/smart-life');
const Schema = mongoose.Schema;
const peopleSchema = new Schema({
    first: { type: String  },
    last: { type: String}
})
const People = mongoose.model('people', peopleSchema)

const typeDefs = `
type Query {
  people: [People!]!
  person(id: ID!): People
}
type People {
    id: ID
    first: String
    last: String
}
type Mutation {
    createPerson(first: String!, last: String!): People
}
`

const resolvers = {
  Query: {
    people: () => People.find({}),
  },
  Mutation: {
    createPerson: async (parent, args) =>{
        const newPerson = new People({
            first: args.first,
            last: args.last
        })
        const error = await newPerson.save()

        if(error) return error 
        return newPerson
    }
  }
}


const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start({port: 7777}, () => console.log(`The server is running on port 7777`))