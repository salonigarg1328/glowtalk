import bcrypt from 'bcryptjs'

const newPassword = "Cherry@2011" // ← Jo bhi password rakhna ho

const hash = await bcrypt.hash(newPassword, 10)
console.log("Naya Hash:", hash)