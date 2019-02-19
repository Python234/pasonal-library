/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var shortid = require('shortid');
const MONGODB_CONNECTION_STRING = process.env.DB;
var DB;
MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
  DB = db;
});

module.exports = function (app) {
  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      var books = DB.collection('books');
      books.aggregate([{$project: {
        title: 1,
        commentcount: { $size: '$comments' }
      }}]).toArray((err, docs) => {
        if (err) res.status(500).send(err.message);
        else {
          res.json(docs);
        }
      });
    })

    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (title) {
        if (title.trim().length === 0) return res.status(400).send('missing title');
        if (DB) {
            var books = DB.collection('books');
            books.findOne({title: title}, (err, doc) => {
              if (err) return res.status(500).send(err.message);
              if (doc === null) {
                books.insertOne({_id: shortid(), title: title, comments: []}, {upset: true}, (err, doc) => {
                  if (err) res.status(500).send(err.message);
                  else res.json(doc.ops[0]);
                });
              } else {
                res.status(500).send('book already exists');
              }
            });
          }
      }
      else res.status(400).send('missing title');
    })

    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      var books = DB.collection('books');
      books.deleteMany({}, (err, doc) => {
        console.log('deleted');
        if (err) res.status(500).send(err.message);
        else res.send('complete delete successful');
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      var books = DB.collection('books');
      books.findOne({_id: bookid}, (err, doc) => {
        if (err) res.status(500).send(err.message);
        else {
          if (doc) res.json(doc);
          else res.status(404).send('no book with that id');
        }
      });
    })

    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      var books = DB.collection('books');
      books.findOneAndUpdate(
        {_id: bookid},
        {
          $push: { comments: comment }
        },
        {
          returnNewDocument: true
        },
        (err, doc) => {
          if (err) res.status(500).send(err.message);
          else res.json(doc.value);
        }
      )
    })

    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      var books = DB.collection('books')
      books.findOneAndDelete({_id: bookid}, (err, doc) => {
        if (err) res.status(500).send(err.message);
        else if (doc) res.send('delete successful');
        else res.status(404).send('no such book');
      });
    });
};
