const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dyeriRoutes = express.Router();
const multer = require("multer");
const Chef = require("./chef.model");
const storage = multer.diskStorage({
  destination: function(req, file, cd) {
    cd(null, "./ProjetFinal/public/img");
  },
  filename: function(req, file, cd) {
    cd(null, file.originalname);
  }
});

const upload = multer({ storage: storage });
const PORT = 4000;

let Dyeri = require("./dyeri.model");

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/dyeri", { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoBD dtabase connection established successfully");
});

//return all chef from chef table
dyeriRoutes.route("/getChef").get(function(req, res) {
  Chef.find(function(err, chef) {
    if (err) {
      console.log(err);
    } else {
      res.json(chef);
    }
  });
});

//get all products from table dyeri
dyeriRoutes.route("/getDyeri").get(function(req, res) {
  Dyeri.find(function(err, dyeri) {
    if (err) {
      console.log(err);
    } else {
      res.json(dyeri);
    }
  });
});

//find only one product from table dyeri by :id
dyeriRoutes.route("/oneDyeri/:id").get(function(req, res) {
  let id = req.params.id;
  Dyeri.findById(id, function(err, dyeri) {
    res.json(dyeri);
  });
});

//find only one chef from table chef by :id
dyeriRoutes.route("/oneChef/:id").get(function(req, res) {
  let id = req.params.id;
  Chef.findById(id, function(err, chef) {
    res.json(chef);
  });
});

//find all product(dyeri) by the id of chef
dyeriRoutes.route("/dyeriByChef/:id").get(function(req, res) {
  let id = req.params.id;
  Dyeri.find({ dyeri_chefId: id }, function(err, dyeri) {
    res.json(dyeri);
  });
});

//find all product(dyeri) by the name of chef
dyeriRoutes.route("/dyeriByChef/:name").get(function(req, res) {
  let name = req.params.name;
  Dyeri.find({ dyeri_chefName: name }, function(err, dyeri) {
    res.json(dyeri);
  });
});

//delete product(dyeri) by id
dyeriRoutes.route("/deleteDyeri/:id").get(function(req, res) {
  Dyeri.findByIdAndRemove({ _id: req.params.id }, function(err, dyeri) {
    if (err) res.json(err);
    else res.json("Successfully removed");
  });
});

//delete chef by id
dyeriRoutes.route("/deleteChef/:id").get(function(req, res) {
  Chef.findByIdAndRemove({ _id: req.params.id }, function(err, chef) {
    if (err) res.json(err);
    else res.json("Successfully removed");
  });
});

//check for valid connection (email & password)
dyeriRoutes.route("/connection").post(function(req, res) {
  let login = req.body.login;
  let mdp = req.body.mdp;
  Chef.findOne({ chef_email: login, chef_mdp: mdp }, function(err, dyeri) {
    if (err) {
      console.log(err);
    } else {
      res.json(dyeri);
    }
  });
});

dyeriRoutes.route("/register").post(function(req, res) {
  const newChef = new Chef({
    chef_email: req.body.chef_email,
    chef_mdp: req.body.chef_mdp,
    chef_username: req.body.chef_userName,
    chef_tel: req.body.chef_tel
  });
  newChef
    .save()
    .then(chef => res.json(chef))
    .catch(err => console.log(err));
});
//add deyri if not exist
dyeriRoutes.route("/addDyeri").post(function(req, res) {
  console.log("d5alet");
  let newdyeri = new Dyeri(req.body);
  let ofre = req.body;
  Dyeri.findOne(ofre, function(err, dyeri) {
    if (!dyeri) {
      newdyeri
        .save()
        .then(newdyeri => {
          res.status(200).json({ newdyeri: "dyeri added successfully" });
        })
        .catch(err => {
          res.status(400).send(err, "added new dyeri failed");
        });
    } else {
      res.status(200).send("dyri is alredy exist");
    }
  });
});
// update dyeri by id
dyeriRoutes.route("/updateDyeri/:id").post(function(req, res) {
  Dyeri.findById(req.params.id, function(err, dyeri) {
    if (!dyeri) {
      res.status(404).send("data is not found");
    } else {
      dyeri.dyeri_description = req.body.dyeri_description;
      dyeri.dyeri_name = req.body.dyeri_name;
      dyeri.dyeri_type = req.body.dyeri_type;
      dyeri.dyeri_price = req.body.dyeri_price;
      dyeri.dyeri_image = req.body.dyeri_image;
      dyeri.dyeri_date = req.body.dyeri_date;

      dyeri
        .save()
        .then(dyeri => {
          res.json("Dyeri updated");
        })
        .catch(err => {
          res.status(400).send("update not possible");
        });
    }
  });
});
// update chef data by id
dyeriRoutes.route("/updateChef/:id").post(function(req, res) {
  Chef.findById(req.params.id, function(err, chef) {
    if (!chef) {
      res.status(404).send("data is not found");
    } else {
      chef.chef_fullName = req.body.chef_fullName;
      chef.chef_userName = req.body.chef_userName;
      chef.chef_mdp = req.body.chef_mdp;
      chef.chef_adresse = req.body.chef_adresse;
      chef.chef_tel = req.body.chef_tel;
      chef.chef_email = req.body.chef_email;
      chef.chef_image = req.body.chef_image;

      chef
        .save()
        .then(chef => {
          res.json("Chef updated");
        })
        .catch(err => {
          res.status(400).send("update not possible");
        });
    }
  });
});
//create new chef if not exist
dyeriRoutes.route("/addChef").post(function(req, res) {
  let chef = new Chef(req.body);
  let check = req.body;
  Chef.findOne({ chef_email: check.chef_email }, function(err, ischef) {
    if (!ischef) {
      chef
        .save()
        .then(chef => {
          res.status(200).json({ chef: "chef added successfully" });
        })
        .catch(err => {
          res.status(400).send("added new chef failed");
        });
    } else {
      res.status(200).send("chef exist with same eamil");
    }
  });
});

//this function upload image in react public
dyeriRoutes
  .route("/uploadImg")
  .post(upload.single("image"), function(req, res) {
    console.log(req.file);
    res.status(200).send("image uploaded!");
  });

app.use("/dyeri", dyeriRoutes);

app.listen(PORT, function() {
  console.log("Server is running port:" + PORT);
});
