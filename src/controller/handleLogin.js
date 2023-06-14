import User from "../models/user.js";

export async function handleLogin(req, res) {
  const { first_name, last_name, email, access_token } = req.body;
  // todo: server-side validation with access_token is pending yet

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log("user already exists");
    return res.json({ token: access_token });
  }
  const newUser = new User({
    first_name,
    last_name,
    email
  });
  await newUser
    .save()
    .then((result) => {
      console.log("New User Saved: ", result);
    })
    .catch(error => console.error(error.message));
  res.json({ token: access_token });
}