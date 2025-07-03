import { createUser, readUser, updateUser, deleteUser } from "../models/userModel.js";


const createUserPost = (req, res) => {
    const { email, password } = req.body.user;
    const result = createUser(email, password);
    console.log(result);
}

const readUserGet = (req, res) => {
    const statement = readUser();
    res.json(statement);
}

export { createUserPost, readUserGet }