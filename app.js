const express = require('express');
const app = express();
const mongoose = require("mongoose");

//Settings
app.set('view engine','pug');
app.set('views','views');
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true });
app.use(express.json());

//Database
const { Schema } = mongoose;

const VisitSchema = new Schema ({
  count: Number,
  name: String
})

const Visit = mongoose.model('Visit', VisitSchema);

//Routes
app.get('/', async (req,res) => {
  const searchByName = await Visit.find({name: req.query.name});
  if (searchByName.length!== 0) {
    Visit.updateOne(
      {name: req.query.name},
      {
        $inc: {count: 1}
      },
      function(err,visitor) {
        if (err) return console.error(err);
        console.log('Updated');
      }
    );
  } else {
    const visitor =  new Visit({
      count: 1,
      name: req.query.name ? req.query.name : 'Anónimo'
    })
    await visitor.save();
    console.log(visitor)
  }
  const allVisitors = await Visit.find({});
  res.render('index', {visitors: allVisitors});
});

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});