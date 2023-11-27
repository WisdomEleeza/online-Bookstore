// (async () => {
//   // Technique 1 (generate a salt and hash on separate function calls):
//   const salt = await bcrypt.genSalt(saltRounds);
//   const hash = await bcrypt.hash(myPlaintextPassword, salt);
//   // Store hash in your password DB.

//   // Technique 2 (auto-gen a salt and hash):
//   const hash2 = await bcrypt.hash(myPlaintextPassword, saltRounds);
//   // Store hash in your password DB.
// })();
