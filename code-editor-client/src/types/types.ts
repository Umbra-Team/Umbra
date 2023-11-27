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
  setToastProps: (props: ToastProps | null) => void;
}

export interface AppProps {
  user?: any;
  setUser: Function;
}

export interface ExtendedCognitoUser extends CognitoUser {
  attributes: {
    email: string;
    // add other attributes as needed
  };
}
