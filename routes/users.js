const express = require('express');
const router = express.Router();
const url = require('url');
const qs = require('querystring');
const db = require('../database');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    const clientRes = await db.query(`SELECT * FROM users`);
    res.status(200).json({
      data: clientRes.rows,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post('/', async function (req, res, next) {
  const { email, password } = req.body;
  try {
    const { rows } = await db.query(
      `SELECT * FROM users WHERE email = '${email}'`
    );

    const [user] = rows;

    if (user) {
      return res.status(200).json({
        data: { user },
      });
    }

    res.status(200).json({
      data: {},
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
