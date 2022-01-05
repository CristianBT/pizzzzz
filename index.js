/*const { db } = require("./cnn")

console.log("Hola Const. Soft. A API-GRAPHQL")
db.any('select * from pizza').then(res=>{console.table(res)})*/
const express = require('express')
const {graphqlExpress, graphiqlExpress} = require('graphql-server-express')
const {importSchema}=require('graphql-import')
const {makeExecutableSchema}=require('graphql-tools')

const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const typeDefs=importSchema('./type-system.graphql')
const resolvers=require('./resolver')
const schema=makeExecutableSchema({
    typeDefs,
    resolvers
})

app.use("/pizza", graphqlExpress({schema}))
app.use("/graphiql",graphiqlExpress({endpointURL:"/pizza"}))

app.listen(3000,()=>{
    console.log("GraphQL-API Pizza listen http://localhost:3000/pizza")
    console.log("GraphiQL listen http://localhost:3000/graphiql")
})

