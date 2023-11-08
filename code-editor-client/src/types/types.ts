import { CognitoUser } from "@aws-amplify/auth";

export interface Snippet {
    id: number;
    title: string;
    code: string;
    language: string;
    created_at: Date;
    updated_at: Date;
}

export interface ToastProps {
  title: string;
  description: string;
  status: "success" | "error" | "warning";
}

export interface AppProps {
  ySweetClientToken: string;
  user?: any;
  setUser: Function;
}

export interface ExtendedCognitoUser extends CognitoUser {
  attributes: {
    email: string;
    // add other attributes as needed
  };
}
