const bcrypt = require("bcryptjs");

const users = [
  {
    name: 'Admin User',
    email: 'admin@zshop.com',
    password: bcrypt.hashSync('123456',10),
    isAdmin: true
  },
  {
    name: 'John Doe',
    email: 'john@gmail.com',
    password: bcrypt.hashSync('123456',10)
  },
  {
    name: 'Jane Doe',
    email: 'jane@gmail.com',
    password: bcrypt.hashSync('123456',10)
  }
]

module.exports = users;
