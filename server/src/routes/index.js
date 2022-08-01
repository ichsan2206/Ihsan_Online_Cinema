const express = require("express");

const router = express.Router();

const {uploadFile} = require("../midleware/uploadFIle")

// validate token
const {auth} = require("../midleware/auth")

// Controller Import
const {getUsers, register, checkAuth, login, deleteUser, updateUser, getUser} = require("../controlers/user");
const {addTransaction, getTransactions, notification, getTransactionsAdmin, myListTransaksi } = require("../controlers/transaction");
const {getProfile, updateProfile} = require("../controlers/profile")
const {getFilms, getLanding, addFilms, detailFilm} = require ("../controlers/film")

// router User
router.get("/User", getUsers);
router.post("/Register", register);
router.post("/Login", login);
router.get("/User/:id", getUser);
router.delete("/User/:id", deleteUser);
router.patch("/User/:id", updateUser);
router.get('/check-auth', auth, checkAuth);

//router Film
router.get("/Landing", getLanding);
router.get("/Film", auth, getFilms);
router.post("/Film", auth, uploadFile("image"), addFilms)
router.get("/Film/:id", auth, detailFilm);

// Profile
router.get("/Profile",auth, getProfile);
router.patch("/Profile", auth, uploadFile("image"), updateProfile);

//router Transaction
router.post("/Transaction", auth, addTransaction);
router.get("/Transaction", auth, getTransactions);
router.get("/TransactionAdmin", auth, getTransactionsAdmin)
router.get("/MyListFilm", auth, myListTransaksi)

router.post("/notification", notification);

module.exports = router;
