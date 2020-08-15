const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODBURI || 'mongodb://localhost/umkmtaput', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true,
    useFindAndModify : false
})
.then(() => {
    console.log("Database Connected");
}).catch((e) => {
    console.log("Database Connection Failed : " + e.message);
});