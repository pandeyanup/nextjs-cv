import { About } from "./about";

export interface User extends About {
  id: string;
  name: string;
  email: string;
  image: string;
  phone: string;
}
