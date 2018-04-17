const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { ensureAuthenticated } = require('../helpers/auth');



// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Idea index page

router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({ user: req.user.id })
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    }).catch((err)=>{
      req.flash('error_msg', 'Somting wrong');
      res.redirect('/ideas');
    });

});

// Add Idea form

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});


// Edit Idea form

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    if (idea.user != req.user.id) {
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/ideas');
    } else {
      res.render('ideas/edit', {
        idea: idea
      });
    }

  }).catch((err)=>{
    req.flash('error_msg', 'Somting wrong');
    res.redirect('/ideas');
  });
});

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({
      text: 'Please add a title'
    });
  }
  if (!req.body.details) {
    errors.push({
      text: 'Please add some details'
    });
  }
  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newIdea = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    new Idea(newIdea)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Video idea added');
        res.redirect('/ideas');
      }).catch((err)=>{
        req.flash('error_msg', 'Somting wrong');
        res.redirect('/ideas');
      });
  }
});

// Edit form process

router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
      if (idea.user != req.user.id) {
        req.flash('error_msg', 'Not Authorized');
        res.redirect('/ideas');
      } else {
        // Change value
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
          .then(idea => {
            req.flash('success_msg', 'Video idea updated');
            res.redirect('/ideas');
          }).catch((err)=>{
            req.flash('error_msg', 'Somting wrong');
            res.redirect('/ideas');
          });
      }

    }).catch((err)=>{
      req.flash('error_msg', 'Somting wrong');
      res.redirect('/ideas');
    });
});


// Delete idea

router.delete('/:id', ensureAuthenticated, (req, res) => {

  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    if (idea.user != req.user.id) {
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/ideas');
    } else {
      Idea.remove({
        _id: req.params.id
      })
        .then(() => {
          req.flash('success_msg', 'Video idea removed');
          res.redirect('/ideas');
        }).catch((err)=>{
          req.flash('error_msg', 'Somting wrong');
          res.redirect('/ideas');
        });
    }

  }).catch((err)=>{
    req.flash('error_msg', 'Somting wrong');
    res.redirect('/ideas');
  });

});


module.exports = router;