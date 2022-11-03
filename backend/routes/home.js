const express = require('express');
const router = express.Router();

router.get('/server-data', function (req, res) {
  const data = { name: 'huiy', age: 25 };
  res.send(data);
});
module.exports = router;