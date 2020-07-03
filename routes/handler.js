var express = require("express");

var router = express.Router();
var spawn = require("child_process").spawn;

var path = require("path");
//var queries = require(path.join(__dirname,'../model/queries'));
// const mime = require('mime');
var request = require("request");
//var query = require('.././model/queries');

var section;
var userDetails;
var updatedUserDetails = {};
var infoBites = 0;

var app = express();

const fs = require("fs");
var sessionId = "false";
var username = "";
var login = "";

//For scoring
var bank_init_level;
var bank_init_score;
var tax_init_level;
var tax_init_score;
var invest_init_level;
var invest_init_score;
var loans_init_level;
var loans_init_score;
var tax_set = false;
var invest_set = false;
var loans_set = false;

var path = require("path");
//var queries = require(path.join(__dirname,'../model/queries'));
// const mime = require('mime');
var request = require("request");
//var query = require('.././model/queries');

fs.openSync("assets/activity.json", "w");

const MongoClient = require("mongodb").MongoClient;
var bodyParser = require("body-parser");
const uri =
  "mongodb+srv://panu123:1234@cluster0-rjwue.mongodb.net/Finlit?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.json());

MongoClient.connect(
  uri,
  {
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) return console.error(err);
    const db = client.db("Finlit");
    const collection = db.collection("Questions");

    db.collection("Questions")
      .find()
      .toArray()
      .then((results) => {
        const jsonString = JSON.stringify(results);
        fs.writeFileSync(
          "assets/activity.json",
          '{"quizlist":' + jsonString + "}"
        );
      })
      .catch((error) => console.error(error));
    console.log("Connected to Database");
  }
);

//Landing Page
router.get("/", (req, res) => {
  if (username == "") {
    res.render("landing", { layout: "landing.handlebars" });
  } else {
    res.redirect("/dashboard");
  }
});

//Login
router.get("/login", (req, res) => {
  res.render("login", { layout: "login.handlebars" });
});

//Register
router.get("/register", (req, res) => {
  res.render("register", { layout: "register.handlebars" });
});

//First Quiz
router.get("/first_quiz", (req, res) => {
  console.log(req.query.section);
  res.render("first_quiz", { layout: "first_quiz.handlebars" });
  section = req.query.section;
});

//Dashboard
router.get("/dashboard", (req, res) => {
  if (login == "") {
    res.redirect("/register");
  } else {
    console.log(username);

    //If they just attempted an initiation for either Tax or Investments
    if (req.query.section === "tax") {
      tax_init_level = req.query.level;
      tax_init_score = req.query.score;
      tax_set = true;
      updatedUserDetails["tax_initiation_level"] = tax_init_level;
      updatedUserDetails["tax_initiation_score"] = tax_init_score;
      MongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
        const db = client.db("Finlit");
        const collection = db.collection("User");
        db.collection("User").findOneAndUpdate(
          { username: userDetails["username"] },
          {
            $set: {
              tax_initiation_level: updatedUserDetails["tax_initiation_level"],
              tax_initiation_score: updatedUserDetails["tax_initiation_score"],
            },
          },
          function (err, user) {
            if (err) {
              console.log("Error " + err);
            }
          }
        );
      });
      userDetails = updatedUserDetails;
    } else if (req.query.section === "invest") {
      invest_init_level = req.query.level;
      invest_init_score = req.query.score;
      invest_set = true;
      updatedUserDetails["investments_initiation_level"] = invest_init_level;
      updatedUserDetails["investments_initiation_score"] = invest_init_score;
      MongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
        const db = client.db("Finlit");
        const collection = db.collection("User");
        db.collection("User").findOneAndUpdate(
          { username: userDetails["username"] },
          {
            $set: {
              investments_initiation_level:
                updatedUserDetails["investments_initiation_level"],
              investments_initiation_score:
                updatedUserDetails["investments_initiation_score"],
            },
          },
          function (err, user) {
            if (err) {
              console.log("Error " + err);
            }
          }
        );
      });
      userDetails = updatedUserDetails;
    } else if (req.query.section === "loans") {
      loans_init_level = req.query.level;
      loans_init_score = req.query.score;
      loans_set = true;
      updatedUserDetails["loans_initiation_level"] = loans_init_level;
      updatedUserDetails["loans_initiation_score"] = loans_init_score;
      MongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
        const db = client.db("Finlit");
        const collection = db.collection("User");
        db.collection("User").findOneAndUpdate(
          { username: userDetails["username"] },
          {
            $set: {
              loans_initiation_level:
                updatedUserDetails["loans_initiation_level"],
              loans_initiation_score:
                updatedUserDetails["loans_initiation_score"],
            },
          },
          function (err, user) {
            if (err) {
              console.log("Error " + err);
            }
          }
        );
      });
      userDetails = updatedUserDetails;
    } else {
    }
    res.render("dashboard", { layout: "dashboard.handlebars" });
  }
});

//Send tax and/or investment results
router.get("/sendTaxInvestLoans", (req, res) => {
  if (tax_set == true || invest_set == true || loans_set == true) {
    res.json({
      tax_set: tax_set,
      tax_init_level: tax_init_level,
      tax_init_score: tax_init_score,
      invest_set: invest_set,
      invest_init_level: invest_init_level,
      invest_init_score: invest_init_score,
      loans_init_level: loans_init_level,
      laons_init_score: loans_init_score,
    });
  }
});

//Update user progress
router.get("/updateUserProgress", (req, res) => {
  updatedUserDetails["banking_secondary_level"] =
    req.query.banking_secondary_level;
  updatedUserDetails["banking_secondary_score"] =
    req.query.banking_secondary_score;
  updatedUserDetails["tax_secondary_level"] = req.query.tax_secondary_level;
  updatedUserDetails["tax_secondary_score"] = req.query.tax_secondary_score;
  updatedUserDetails["investments_secondary_level"] =
    req.query.investments_secondary_level;
  updatedUserDetails["investments_secondary_score"] =
    req.query.investments_secondary_score;
  updatedUserDetails["loans_secondary_level"] = req.query.loans_secondary_level;
  updatedUserDetails["loans_secondary_score"] = req.query.loans_secondary_score;
  updatedUserDetails["banking_quiz_entry"] = req.query.banking_quiz_entry;
  updatedUserDetails["tax_quiz_entry"] = req.query.tax_quiz_entry;
  updatedUserDetails["investments_quiz_entry"] =
    req.query.investments_quiz_entry;
  updatedUserDetails["loans_quiz_entry"] = req.query.loans_quiz_entry;
  updatedUserDetails["banking_qno"] = req.query.banking_qno;
  updatedUserDetails["tax_qno"] = req.query.tax_qno;
  updatedUserDetails["investments_qno"] = req.query.investments_qno;
  updatedUserDetails["loans_qno"] = req.query.loans_qno;
  console.log(updatedUserDetails["loans_secondary_level"]);

  userDetails = updatedUserDetails;

  MongoClient.connect(
    uri,
    {
      useUnifiedTopology: true,
    },
    (err, client) => {
      const db = client.db("Finlit");
      const collection = db.collection("User");
      db.collection("User").findOneAndUpdate(
        { username: userDetails["username"] },
        {
          $set: {
            banking_secondary_level:
              updatedUserDetails["banking_secondary_level"],
            banking_secondary_score:
              updatedUserDetails["banking_secondary_score"],
            tax_secondary_level: updatedUserDetails["tax_secondary_level"],
            tax_secondary_score: updatedUserDetails["tax_secondary_score"],
            investments_secondary_level:
              updatedUserDetails["investments_secondary_level"],
            investments_secondary_score:
              updatedUserDetails["investments_secondary_score"],
            loans_secondary_level: updatedUserDetails["loans_secondary_level"],
            loans_secondary_score: updatedUserDetails["loans_secondary_score"],
            banking_quiz_entry: updatedUserDetails["banking_quiz_entry"],
            tax_quiz_entry: updatedUserDetails["tax_quiz_entry"],
            investments_quiz_entry:
              updatedUserDetails["investments_quiz_entry"],
            loans_quiz_entry: updatedUserDetails["loans_quiz_entry"],
            banking_qno: updatedUserDetails["banking_qno"],
            tax_qno: updatedUserDetails["tax_qno"],
            investments_qno: updatedUserDetails["investments_qno"],
            loans_qno: updatedUserDetails["loans_qno"],
          },
        },
        function (err, user) {
          if (err) {
            console.log("Error " + err);
          }
          console.log("User found");
        }
      );
    }
  );

  res.send("Got updated details");
  console.log(userDetails);
});

router.get("/logout", (req, res) => {
  username = "";
  login = "";
  userDetails = {};
  updatedUserDetails = {};
  res.redirect("/");
});

//Second Quiz
router.get("/second_quiz", (req, res) => {
  console.log(req.query.section);
  res.render("second_quiz", { layout: "second_quiz.handlebars" });
  section = req.query.section;
  if (req.query.info === "yes") {
    console.log("Yep");
    infoBites = 1;
  } else {
    infoBites = 0;
  }
});

//Fetch Section/Domain
router.get("/findSection", (req, res) => {
  res.send(section + " " + infoBites);
});

//Retrieving cookie
router.get("/cookiesHandler", (req, res) => {
  var cookie = req.query.cookie;
  var cookie_arr = cookie.split("expires=");
  bank_init_level = cookie_arr[0].split("=")[1].split(",")[0];
  bank_init_score = cookie_arr[0].split("=")[2].split(",")[0];
  console.log("Cookie retrieved at handler");
  console.log(bank_init_level);
  console.log(bank_init_score);
});

//Sending user details at client's end (controller)
router.get("/ifLoggedIn", (req, res) => {
  res.send(userDetails);
});

//handler for facebook
router.get("/basics", (req, res) => {
  console.log("here?");
  res.render("basics", { layout: "basics.handlebars" });
});

router.get("/profile", (req, res) => {
  if (login == "") {
    res.redirect("/login");
  } else {
    console.log(username);
    res.render("profile", { layout: "profile.handlebars" });
  }
});

// Function callName() is executed whenever
// url is of the form localhost:3000/name
router.get("/ip", (req, res) => {
  // Use child_process.spawn method from child_process module and assign it to variable spawn
  // Parameters passed in spawn:
  // 1. type of script
  // 2. list containing path of the script and arguments for the script

  var process = spawn("python", [
    "./user_class.py",
    req.query.q1,
    req.query.q2,
    req.query.q3,
    req.query.q4,
    req.query.q5,
    req.query.q6,
    req.query.q7,
    req.query.q8,
    req.query.q9,
  ]);

  // Takes stdout data from script which executed
  // with arguments and send this data to res object
  process.stdout.on("data", function (data) {
    console.log(data.toString());
    res.send(data);
  });
});

//Storing user details while registering
router.get("/reg", (req, res) => {
  MongoClient.connect(
    uri,
    {
      useUnifiedTopology: true,
    },
    (err, client) => {
      if (err) {
        console.log("Redirecting1");
      }
      const db = client.db("Finlit");
      const collection = db.collection("User");

      var myobj = {
        name: req.query.name,
        username: req.query.username,
        email: req.query.email,
        password: req.query.password,
        banking_initiation_level: bank_init_level,
        banking_initiation_score: bank_init_score,
        tax_initiation_level: -1,
        tax_initiation_score: -1,
        investments_initiation_level: -1,
        investments_initiation_score: -1,
        loans_initiation_level: -1,
        loans_initiation_score: -1,
        banking_secondary_level: -1,
        banking_secondary_score: -1,
        tax_secondary_level: -1,
        tax_secondary_score: -1,
        investments_secondary_level: -1,
        investments_secondary_score: -1,
        loans_secondary_level: -1,
        loans_secondary_score: -1,
        banking_quiz_entry: 0,
        tax_quiz_entry: 0,
        investments_quiz_entry: 0,
        loans_quiz_entry: 0,
        banking_qno: 0,
        tax_qno: 0,
        investments_qno: 0,
        loans_qno: 0,
      };

      userDetails = myobj;
      updatedUserDetails = userDetails;

      db.collection("User").insertOne(myobj, function (err, resi) {
        if (err) {
          res.redirect("/register");
          console.log("Redirecting2");
          // throw err;
        } else {
          login = true;
          username = req.query.username;
          res.redirect("/dashboard");
        }
      });
    }
  );
});

router.get("/log", (req, res) => {
  MongoClient.connect(
    uri,
    {
      useUnifiedTopology: true,
    },
    (err, client) => {
      if (err) {
        console.log("Redirecting1");
      }
      const db = client.db("Finlit");
      const collection = db.collection("User");
      db.collection("User").findOne({ username: req.query.username }, function (
        err,
        user
      ) {
        console.log("User found ");
        // In case the user not found
        if (err) {
          console.log("THIS IS ERROR RESPONSE");
          res.json(err);
        }
        if (user == null) {
          console.log("Credentials wrong");
          res.redirect("/login");
        } else if (user.password === req.query.password) {
          console.log("User and password is correct");
          login = true;
          username = req.query.username;
          userDetails = user;
          updatedUserDetails = userDetails;
          res.redirect("/dashboard");
        } else {
          console.log("Credentials wrong");
          res.redirect("/login");
        }
      });
    }
  );
});

// To run the fuzzy script
router.get("/fuzzy", (req, res) => {
  console.log(req.query.score);
  console.log(req.query.cl);
  var process = spawn("python", [
    "./finlit_fuzzy.py",
    req.query.score,
    req.query.cl,
  ]);

  process.stdout.on("data", function (data) {
    console.log(data.toString());
    res.send(data);
  });
});

//For Facebook
var request = require("request");
var OAuth2 = require("oauth").OAuth2;
var oauth2 = new OAuth2(
  "2684637981771820",
  "8980e6c2c47d6b4f88f18e1e057d823d",
  "",
  "https://www.facebook.com/dialog/oauth",
  "https://graph.facebook.com/oauth/access_token",
  null
);
router.get("/facebook/auth", function (req, res) {
  var redirect_uri = "https://fin-lit2020.herokuapp.com/facebook/callback";
  // For eg. "http://localhost:3000/facebook/callback"
  var params = {
    redirect_uri: redirect_uri,
    scope: "publish_pages, manage_pages",
  };
  res.redirect(oauth2.getAuthorizeUrl(params));
});

router.get("/facebook/callback", function (req, res) {
  if (req.error_reason) {
    res.send(req.error_reason);
  }

  if (req.query.code) {
    var loginCode = req.query.code;
    var redirect_uri = "https://fin-lit2020.herokuapp.com/facebook/callback";
    // For eg. "/facebook/callback"

    oauth2.getOAuthAccessToken(
      loginCode,
      { grant_type: "authorization_code", redirect_uri: redirect_uri },
      function (err, accessToken, refreshToken, params) {
        if (err) {
          console.error(err);
          res.send(err);
        }
        // var access_token = accessToken;
        // var expires = params.expires;
        // console.log(req.session);
        // req.session.access_token = access_token;
        // req.session.expires = expires;
        // res.redirect('/get_email');

        oauth2.get("https://graph.facebook.com/me", accessToken, function (
          err,
          data,
          response
        ) {
          if (err) {
            console.error(err);
            res.send(err);
          } else {
            var profile = JSON.parse(data);
            console.log(profile);
            // var profile_img_url = "https://graph.facebook.com/"+profile.id+"/picture";
          }
        });

        oauth2.get(
          "https://graph.facebook.com/{page-id}?fields=+access_token&access_token=" +
            accessToken,
          function (err, data, response) {
            var page_info = JSON.parse(data);
            var page_id = page_info.id;
            var page_access_token = page_info.access_token;

            oauth2.post(
              "https://graph.facebook.com/" +
                page_id +
                "/feed?message=I reached the Intermediate level on Fin-Lit.&access_token=" +
                page_access_token
            ),
              function (err, data, response) {
                console.log("Posted");
              };
          }
        );
      }
    );
  }
});

module.exports = router;
