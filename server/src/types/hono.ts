import { JWTPayload } from "../services/auth.service.js";

export interface HonoEnv {
  Variables: {
    user: JWTPayload;
  };
}
