const Movie = require('../models/movie');
const Performer = require('../models/performer');

function index(req, res) {
  Movie.find({}, function (err, movies) {
    res.render('movies/index', { title: 'All Movies', movies });
  });
}

function show(req, res) {
  Movie.findById(req.params.id)
    .populate('cast')
    .exec(function (err, movie) {
      // after we find the movie, lookup all the performers in the database WHERE their id is NOT IN cast field

      // mongoose appraoch
      Performer.find({})
        .where('_id')
        .nin(movie.cast)
        .exec(function (err, performers) {
          console.log(performers);
          // add the list of all performers to the template
          res.render('movies/show', { title: 'Movie Detail', movie, performers });
        });

      // Native MongoDB approach
      // Performer.find({ _id: { $nin: movie.cast } }, function (err, performers) {
      //   console.log(performers);
      //   res.render('movies/show', {
      //     title: 'Movie Detail',
      //     movie,
      //     performers,
      //   });
      // });
    });
}

function newMovie(req, res) {
  res.render('movies/new', { title: 'Add Movie' });
}

function create(req, res) {
  // convert nowShowing's checkbox of nothing or "on" to boolean
  req.body.nowShowing = !!req.body.nowShowing;
  for (const key in req.body) {
    if (req.body[key] === '') delete req.body[key];
  }
  const movie = new Movie(req.body);

  movie.save(function (err) {
    if (err) return res.redirect('/movies/new');
    console.log(movie);
    res.redirect(`/movies/${movie._id}`);
  });
}

module.exports = {
  index,
  show,
  new: newMovie,
  create,
};
