import { initializeJwtStrategy } from "./initializeJwtStrategy";
import { initializeLogin } from "./initializeLogin";
import { initializeSignUp } from "./initializeSignUp";

export default function initializePassport() {
  initializeJwtStrategy();
  initializeLogin();
  initializeSignUp();
}
