require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

app.get('/api/about', (req, res) =>{
  res.json({
    title: "About Us",
    paragraphs:[
      "Hello! I am Laura Liu.",
      "I am a senior majoing in CS and minoring in Data Science and Web Dev.",
      "I love cooking, baking, and reading.",
      "This is the MERN-stack web app exercise.",
      "Scroll up for a picture of me:)",
      "I led an augmented-reality accessibility project called Elegant Gathering in the Apricot Garden, created with two NYU Museum Studies graduate students. We built a mobile WebAR experience using 8th Wall and A-Frame that recognizes segments of a Ming Dynasty handscroll and lets visitors explore a dozen+ historical objects at true scale.",
      "I designed a Vue.js + HTML/CSS interface layered on the AR view, with tap-triggered hotspots that reveal text, images, and model toggles. I added gesture controls and visibility toggles (tap-hotspot, tap-close, recenter) so people can move smoothly between physical interaction and digital augmentation.",
      "To support blind and low-vision visitors, I fabricated a full-scale tactile replica using Swell-Form paper, layered textures, and Braille labels. I also captured and cleaned artifact 3D models in Blender, optimizing glb assets for low-latency rendering and accurate real-world scaling in the AR interface."
    ],
    imgURL:"http://localhost:7002/laura.jpg"
  })
}
);

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
