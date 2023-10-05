import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { IBEXEnum } from "@ibex/domain";

const ibexAuthMiddleWare = (req: Request, res: Response, next: NextFunction) => {
  axios
    .post(`${IBEXEnum.BASE_URL}auth/signin`, {
      email: process.env.IBEX_EMAIL,
      password: process.env.IBEX_PASSWORD,
    })
    .then((response) => {
      // Handle the API response here

      req.headers.authorization = `${response.data.accessToken}`;

      // Call next() to pass control to the next middleware function
      next();
    })
    .catch((error) => {
      // Handle API call errors here
      console.error("API error:", error);

      // You can choose to pass the error to an error handler middleware or handle it accordingly
      next(error);
    });
};

export default ibexAuthMiddleWare;
