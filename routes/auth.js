const token = jwt.sign(
  { id: user.id, email: user.email },
  process.env.JWT_SECRET || "votre_secret_jwt"
); 