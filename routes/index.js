const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const usermodel = require('../models/user');
const songModel = require('../models/songs');
const isAuthenticated = require('../config/isAuthenticated');
const isAuth = require('../config/isAuth');
const playlistModel = require('../models/playlist');


router.get('/', function(req, res, next){
  var us = req.user;
  if(!us) 
  {
    songModel.find().sort({"_id": -1}).limit(5).then(latest =>{
    res.render('index', {user: null, text: 'Login' , latestSongs: latest});
  });
  }
    else {
    songModel.find().then(latest => {
      latest= latest.reverse(); 
    songModel.find( { category: "Popular"} ).then(popular => {
      popular= popular.reverse(); 
    songModel.find( { category: "Favourite"} ).then(fav => {
      fav = fav.reverse();
    songModel.find().sort({"timesPlayed": -1}).then(songList => {
    usermodel.find({usertype: "artist"}).then(artist => {
    
      playlistModel.find({user: req.user._id})
      .populate('songs')
      .then(song => {
        song = song.map(song => song.songs)
      usermodel.find({_id: us._id})
        .populate('recent')
        .then(recentPlayed => {
          recentPlayed = recentPlayed.map(recentPlayed => recentPlayed.recent)
<<<<<<< HEAD
          recentPlayed[0] = recentPlayed[0].reverse();
        if(us && us.usertype == "listener") {res.render('index', {artistList: artist, recentlyPlayed: recentPlayed[0], playlist: song[0], uid: us._id, user: us.username,image: us.image, utype: null, notadmin: us.usertype, latestSongs: latest, popularSongs: popular, favSongs: fav, mostPlayed: songList});}
        else if (us && us.usertype == "artist") {res.render('index', {artistList: artist,recentlyPlayed: recentPlayed[0],playlist: song[0], uid: us._id, user: us.username,image: us.image, utype: us.usertype , notadmin: us.usertype, latestSongs: latest, popularSongs: popular, favSongs: fav, mostPlayed: songList}); }
        else {res.render('index', {artistList: artist,recentlyPlayed: recentPlayed[0], playlist: song[0], uid: us._id, user: us.username,image: us.image,  utype: us.usertype , notadmin: null, latestSongs: latest, popularSongs: popular, favSongs: fav, mostPlayed: songList}); }
      });
      });   
=======
          if(recentPlayed[0]){recentPlayed[0] = recentPlayed[0].reverse();}
         if(us && us.usertype == "listener") {res.render('index', {recentlyPlayed: recentPlayed[0], playlist: song[0], uid: us._id, user: us.username,image: uimage, utype: null, notadmin: us.usertype, latestSongs: latest, popularSongs: popular, favSongs: fav, mostPlayed: songList});}
         else if (us && us.usertype == "artist") {res.render('index', {recentlyPlayed: recentPlayed[0],playlist: song[0], uid: us._id, user: us.username,image: uimage, utype: us.usertype , notadmin: us.usertype, latestSongs: latest, popularSongs: popular, favSongs: fav, mostPlayed: songList}); }
         else {res.render('index', {recentlyPlayed: recentPlayed[0], playlist: song[0], uid: us._id, user: us.username,image: uimage,  utype: us.usertype , notadmin: null, latestSongs: latest, popularSongs: popular, favSongs: fav, mostPlayed: songList}); }
      }).catch(err => {
           console.log(err);
          });
      }).catch(err => {
        console.log(err);
          });   
>>>>>>> de98c6d0ee90b93e408201fbf5a94860c8798605
  });
});
  }).catch(err => {
    req.flash('info', 'Error Fetching data from server');
    res.redirect('/');
      });
    }).catch(err => {
      req.flash('info', 'Error Fetching data from server');
      res.redirect('/');
        });
    }).catch(err => {
      req.flash('info', 'Error Fetching data from server');
      res.redirect('/');
        });
  }
});

router.post('/addtoplaylist/:id/:user',isAuthenticated, function(req, res, next){
  playlistModel.findOne(
    {user: req.params.user},
    (err,playlist) => {
      if(playlist == null) {
        var newPlaylist = new playlistModel({
          user: req.params.user,
          songs: req.params.id
        });
        newPlaylist.save(function(err){
          if (err) {
            req.flash('info', 'Failed to add song');
            res.redirect('/');
          }
        });
        usermodel.update(
          { _id: req.params.user },
          { playlist: newPlaylist._id }
        )
      }
      else {
        updatePlaylist(req.params.user,req.params.id);
      }
    }
  );
});

function updatePlaylist(user,song) {
  playlistModel.update(
    { user: user },
    { $push: { songs: song}}
  )
  .then(playlist =>{
    if(playlist){
      //console.log(playlist);
    }
  });
}

router.post('/deleteSong/:id/:user',isAuthenticated, function(req, res, next){
  playlistModel.update(
    { user: req.params.user },
    { $pull: { songs: req.params.id}}
  )
  .then(playlist =>{
    if(playlist){
      //console.log(playlist);
    }
  });
})

router.post('/addtoRecent/:user/:song',isAuthenticated, function(req, res, next){
  usermodel.update(
    { _id: req.params.user },
    { $push: {recent: {$each:[req.params.song],$slice:-6}}}
  )
  .then(song => {
    if(!song) {
      res.redirect('/');
    }
  })
});

router.get('/login', function(req, res, next){
  res.render('login', {layout: 'abc'} );
});

router.get('/', function(req, res, next){
  songModel.find( { category: "popular"} )
  .then(popular => {
    popular= popular.reverse();    
    res.render('index', {popularSongs: popular});
    console.log(popular);
  });
});

router.get('/login', function(req, res, next){
  res.render('login', {layout: 'abc'} );
});
router.get('/admin' ,isAuthenticated, function(req, res, next){
  res.render('admin' , {layout: 'admin'});
});

router.get('/signup', function(req, res, next){
  res.render('signup', {layout: 'abc'});
});

router.get('/uploadfile', isAuth,  function(req, res, next){
  res.render('uploadfile', {layout: 'abc', uploadedby: req.user.username});
});

router.get('/profile',  function(req, res, next){
  playlistModel.find({user: req.user._id})
      .populate('songs')
      .then(song => {
         song = song.map(song => song.songs)
  res.render('profile',{playlist: song[0], user: req.user.username, user_id: req.user._id, uimage: req.user.image });
})
});

router.get('/artistProfile/:id',  function(req, res, next){
  usermodel.findOne( {_id: req.params.id}).then(us => {
  playlistModel.find({user: us._id})
    .populate('songs')
    .then(song => {
       song = song.map(song => song.songs)
  res.render('artistProfile',{playlist: song[0],user: us.username, uimage: us.image});
  })
  });
});

router.post('/signup', function(req, res ){
  if (!req.body.email || !req.body.password || !req.body.name || !req.body.type) {
    req.flash('info', 'Please Provide all the credentials');
    res.redirect('/signup');
  }
   else {
    var newUser = new usermodel({
      username:req.body.name, email: req.body.email, password: req.body.password,
      usertype: req.body.type,
      image: "../src/images/artist/user.png"
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        //console.log(err);
        req.flash('info', 'This email has already been used');
        res.redirect('/signup');
      }
      else{
      req.flash('info', 'Success');
      res.redirect('/login');
      }
    });
  }
});

router.post('/login', function(req, res, next) {
  if(req.body.email == 'admin@dmt.com' && req.body.password == 'dmt'){
    var user ={ username: 'admin', usertype: 'admin'};
    req.logIn(user, function (err) {
      if (err) { req.flash('info', 'Error logging in');
      res.redirect('/login'); }
      else{
        res.redirect('/');
      }
  });
}
else{
  passport.authenticate('local', function(err,user, info) {
    if( user == false)
    {
      req.flash('info', info.message);
      res.redirect('/login');
   }
    else{
      req.logIn(user, function (err) {
      if (err) { req.flash('info', 'Error logging in');
      res.redirect('/login'); }
      else{
        res.redirect('/');
      }
  });
};
})
  (req, res, next);
}
});
router.post('/members', isAuthenticated,  function(req, res) {
  res.send('Authenticated members page'); 
});

router.get('/artist',isAuthenticated, function(req,res,next){
  usermodel.find(
    { usertype: "artist"}
  )
  .select('username usertype')
  .then(artist => {    
    res.render('artist', {layout: 'admin', artistList: artist}); 
  }).catch(err => {
    req.flash('info', 'Error Fetching data from server');
    res.redirect('/');
      });
});

router.get('/songs/:artist',isAuthenticated, function(req,res,next){
  songModel.find({ 
    uploadedby: req.params.artist
  }
  )
  .select('_id fileName avatar artist timesPlayed uploadedby')
  .then(artist => {    
    res.render('songs', {layout: 'admin', artistList: artist}); 
  }).catch(err => {
    req.flash('info', 'Error Fetching data from server');
    res.redirect('/');
      });
});

router.post('/deleteArtist/:id',isAuthenticated, function(req,res,next){
  usermodel.findOneAndDelete({
    _id: req.params.id
})
.then(user => {
    if (user) {
      req.flash('info', 'Deleted successfully');
      
    }
}).catch(err => {
    req.flash('info', 'Error Fetching data from server');
      });
});

router.post('/delete/:id',isAuthenticated, function(req,res,next){
  songModel.findOneAndDelete({
    _id: req.params.id
})
.then(song => {
    if (song) {
      req.flash('info', 'Deleted successfully');
      
    }
}).catch(err => {
    req.flash('info', 'Error Fetching data from server');
      });
});

router.get('/category/:id/:opt',isAuthenticated, function(req,res,next){
  const id = req.params.id;
  const value = req.params.opt;
  songModel.update({ _id: id}, { category: value})
  .then(song => {  
    if (song) {
      req.flash('info', 'Updated successfully');  
    }
}).catch(err => {
    req.flash('info', 'Error Fetching data from server');
      });
});


module.exports = router;