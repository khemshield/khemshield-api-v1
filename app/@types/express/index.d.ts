import { IUser } from "../../modules/user/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// declare namespace Express {
//   interface Request {
//     user?: YourUserType; // Replace 'YourUserType' with the actual type of your user object
//   }
// }
