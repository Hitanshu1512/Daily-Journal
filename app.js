const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');

const app = express();

// Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Signup Route
app.post('/signup', (req, res) => {
  const { firstName, lastName, email } = req.body;

  // Make sure fields are filled
  if (!firstName || !lastName || !email) {
    res.redirect('/failure.html');
    return;
  }

  // Construct req data
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const postData = JSON.stringify(data);

  fetch('https://us11.api.mailchimp.com/3.0/lists/1f690023b4', {
    method: 'POST',
    headers: {
      Authorization: 'auth 80770e2eccb2615fe430473f36315812-us11'
    },
    body: postData
  })
    .then(res.statusCode === 200 ?
      res.redirect('/success.html') :
      res.redirect('/failure.html'))
    .catch(err => console.log(err))
})

const PORT = process.env.PORT || 5050;

app.listen(PORT, console.log(`Server started on ${PORT}`));


// Audience id : 1f690023b4
// API Key : 80770e2eccb2615fe430473f36315812-us11
