const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const mongoose = require("mongoose");
const Product = require("./models/product");
const methodOverride = require("method-override");

const categories = Product.schema.path("category").options.enum;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.listen(port, () => {
  console.log(`LISTENING ON PORT ${port}`);
});

main().catch((err) => console.log(`Oh no...\n\n${err}\n\n:/\n\n`));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/farmStand");
  console.log("Mongo connection open...");
}

// Routes...

app.get("/products", async (req, res) => {
  const products = await Product.find({});
  res.render("products/index", { products });
});

app.get("/products/stock", async (req, res) => {
  const { category } = req.query;
  if (category) {
    const products = await Product.find({ category });
    res.render("products/stock", { products, categories, category });
  } else {
    const products = await Product.find({});
    res.render("products/stock", { products, categories, category: "" });
  }
});

app.post("/products", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.redirect("products/stock");
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/details", { product });
});

app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit", { product, categories });
});

app.put("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  res.redirect("/products/stock");
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  res.redirect("/products/stock");
});
