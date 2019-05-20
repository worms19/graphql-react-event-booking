const express = require('express');
const bodyParser = require('body-parser');
const graphQlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolver = require('./graphql/resolvers/index');


const app  = express();



app.use(bodyParser.json());



app.use('/graphql', graphQlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolver,
    graphiql : true
})
);

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@eventcluster-qqgzo.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
).then(()=>{

    app.listen(3000);
}).catch(err => {

    console.log(err);
});

