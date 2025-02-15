const Performer = require('../models/performer');
const Movie = require('../models/movie');

module.exports = {
  new: newPerformer,
  create,
   addToCast

};

function create(req, res) {
  // Need to "fix" date formatting to prevent day off by 1
  // This is due to the <input type="date"> returning the date
  // string in this format:  "YYYY-MM-DD"
  // https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off
  const s = req.body.born;
  req.body.born = `${s.substr(5, 2)}-${s.substr(8, 2)}-${s.substr(0, 4)}`;
  Performer.create(req.body, function (err, performer) {
    res.redirect('/performers/new');
  });
}

function newPerformer(req, res) {
  Performer.find({}, function (err, performers) {
    res.render('performers/new', {
      title: 'Add Performer',
      performers
    });
  })
}

function addToCast(req, res) {
  // this function will associate the performer with a movie (Tweet & User)
  
  
  // We have to find the Movie (user)
  Movie.findById(req.params.id, function(err, movie) {
      
    
    // We have to push the _id of the performer (tweet) into the cast property
    movie.cast.push(req.body.performerId)

    
    // We have to save our changes
    movie.save((err) => res.redirect(`/movies/${movie._id}`))

  })


}