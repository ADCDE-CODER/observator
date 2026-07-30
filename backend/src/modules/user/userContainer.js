import { db } from "../../config/database.js";
import UserModel from "./UserModel.js";
import UserService from "./UserService.js";
import UserController from "./UserController.js";

const userModel = new UserModel(db);
const userService = new UserService(userModel);
const userController = new UserController(userService);

export { userController };