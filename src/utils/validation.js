function isValidUsername(username) {
  var length = username.length;
  return length >= 2 && length <= 16;
}

function isValidPassword(password) {
  var length = password.length;
  return length >= 8 && length <= 64;
}

export {
  isValidUsername,
  isValidPassword
}