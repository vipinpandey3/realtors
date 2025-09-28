import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import * as passportCustom from "passport-custom";
import bcrypt from "bcryptjs";
import config from "@config/index";
import models from "@models/index";
import logger from "@utils/logger";
import jwt from "jsonwebtoken";

const CustomStrategy = passportCustom.Strategy;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SIGNING_KEY,
};

export default function (passport: passport.PassportStatic) {
  passport.use(
    "login-custom",
    new CustomStrategy(async (req: any, done: any) => {
      const reqBody = req.body;
      try {
        if (!reqBody.uuid) {
          throw new Error("Request does not have uuid");
        }
        const builder = await models.Builder.findOne({
          where: { name: reqBody.name },
          atttributes: ["id", "name", "hq_location", "established_year"],
        });
        logger.info("Builder", builder);
        if (!builder) {
          throw new Error("No builder found");
        }
        const data = JSON.parse(JSON.stringify({ builder }));
        return done(null, {
          jwt: jwt.sign(
            {
              data: {
                builder_id: builder.id,
                name: builder.name,
                location: builder.hq_location,
              },
            },
            config.JWT_SIGNING_KEY,
            {
              issuer: "realtors",
              audience: "all",
              expiresIn: "1d",
            }
          ),
          data: data,
          status: true,
        });
      } catch (error) {
        logger.logError(
          error instanceof Error ? error : new Error(String(error)),
          "error while login",
          { port: config.SERVER_PORT, environment: config.ENVIRONMENT }
        );
      }
    })
  );

  passport.use(
    new JwtStrategy(jwtOptions, (jwt_payload: any, cb: any) => {
      try {
        const data = jwt_payload.data;

        return cb(null, data);
      } catch (error) {
        cb(null, error);
      }
    })
  );
}
