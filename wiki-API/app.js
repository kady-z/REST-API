const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const path = require('path-posix');
path.resolve(__dirname, 'foo');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true});
}

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article', articleSchema);

app.route('/articles')
    .get( function (req, res) {
        Article.find( {}, function (err, docs) {
            if(err) {
                res.send(err);
            } else {
                res.send(docs);
            }
        });
    })
    
    .post( function (req, res) {
   
        const article = new Article({
           title: req.body.title,
           content: req.body.content
       }); 
    
       article.save( function (err) {
           if(err) {
               res.send(err);
           } else {
               res.send("Successfully added article");
           }
       });
    })
    
    .delete( function (req, res) {
        Article.deleteMany( function(err) {
            if(err) {
                res.send(err);
            } else {
                res.send("Successfully deleted all");
            }
        });    
    });

app.route('/articles/:articleTitle')

    .get( function (req, res) {
        Article.findOne( {title: req.params.articleTitle}, function (err, docs) {
            if(!err) {
                if(docs) {
                    res.send(docs);
                } else {
                    res.send("Not found!!");
                }
            } else {
                res.send(err);
            }
        });
    })

    .put( function (req, res) {
        Article.updateOne(
            {
                title: req.params.articleTitle
            },
            {
                title: req.body.title,
                content: req.body.content
            },
            {
                overwrite: true
            },
            function (err, results) {
                if(!err) {
                    res.send("Successful PUT");
                } else {
                    res.send(err);
                }
            }
        );
    })

    .patch( function (req, res) {
      Article.updateOne(
          {
              title: req.params.articleTitle
          },
          {
              $set: req.body
          },
          function (err, results) {
              if(!err) {
                  res.send("Successfully PATCH");
              } else {
                  res.send(err);
              }
          }
      ); 
    })

    .delete( function(req, res) {
        Article.deleteOne(
            {
                title: req.params.articleTitle
            },
            function (err) {
                if(!err) {
                    res.send("Successfully Deleted!");
                } else {
                    res.send(err);
                }
            }
        );
    });

app.listen(3000, function (){
    console.log("Server is running");
});
