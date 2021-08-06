const express = require("express");
const app = new express();
const ejs = require("ejs");
const axios = require("axios");

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/eos", (req, res) => {
  let url = req.query.quizlet;
  async function getUser() {
    let jsonData = [];
    try {
      const response = await axios.get(url);
      let searchHead = response.data.search("termIdToTermsMap") + 18;
      let searchBottom = response.data.search("termSort") - 2;
      let data = JSON.parse(response.data.slice(searchHead, searchBottom));
      const arrayId = Object.keys(data);
      for (el of arrayId) {
        let jsonObj = {
          answer: data[el]["word"],
          allQuestion: data[el]["definition"],
        };
        jsonData.push(jsonObj);
      }
      res.render("eos", {
        jsonData,
      });
    } catch (error) {
      res.redirect("/");
    }
  }

  getUser();
});

app.use(function (req, res, next) {
  res.status(404);

  res.redirect("/");
});

app.listen(3000, () => {
  console.log("App listening on port 3000");
});
