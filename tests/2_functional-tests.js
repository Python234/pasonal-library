/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: 'newTitle'})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'title', 'response object should contain title');
            assert.property(res.body, '_id', 'response should contain _id');
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 400);
            assert.equal(res.text, 'missing title', 'response should countain \'missing title\'');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], '_id', 'response should contain _id property');
            assert.property(res.body[0], 'title', 'response should contain title property');
            assert.property(res.body[0], 'commentcount', 'response should contain commentcount property');
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/idnotindb')
          .end((err, res) => {
            assert.equal(res.status, 404);
            assert.equal(res.text, 'no book with that id');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            const _id = res.body[0]._id;
            
            chai.request(server)
              .get('/api/books/' + _id)
              .end((err, res) => {
                assert.equal(res.status, 200)
                assert.isObject(res.body, 'response should be an object');
                assert.property(res.body, '_id', 'response should contain _id property');
                assert.property(res.body, 'title', 'response should contain title property');
                assert.property(res.body, 'comments', 'response should contain comments property');
                assert.isArray(res.body.comments, 'comments should be an array');
                done();
              });
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            const _id = res.body[0]._id;
            
            chai.request(server)
              .post('/api/books/' + _id)
              .send({comment: 'new comment'})
              .end((err, res) => {
                assert.equal(res.status, 200)
                assert.isObject(res.body, 'response should be an object');
                assert.property(res.body, '_id', 'response should contain _id property');
                assert.property(res.body, 'title', 'response should contain title property');
                assert.property(res.body, 'comments', 'response should contain comments property');
                assert.isArray(res.body.comments, 'comments should be an array');
                done();
              });
          });
      });
      
    });

  });

});
