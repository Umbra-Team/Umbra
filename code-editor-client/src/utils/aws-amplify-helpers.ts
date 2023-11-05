import { Auth } from "aws-amplify";

const TEST_USER = {
  username: "davidrd123",
  password: "bread-first",
  email: "davidrd123@gmail.com",
  phone_number: "+15555555555",
};

// const TEST_USER2 = {
//   username: "davidrd_mit",
//   password: "bread-first",
//   email: "davidrd@alum.mit.edu",
//   phone_number: "+15555555555",
// }

// const TEST_USER3 = {
//   username: "davidrd_deepen",
//   password: "bread-first",
//   email: "d@wedeepen.com",
//   phone_number: "+15555555555",
// }

// const USER_CODE = "781733";

export const signUp = async (email: string, password: string) => {
  try {
    // console.log(`Signing up as ${username}, ${email}, ${phone_number}`);
    console.log(`Signing up as ${email}`);
    const { user } = await Auth.signUp({
      username: email,
      password,
      autoSignIn: {
        enabled: true,
      },
    });
    console.log(`Signed up as ${user.getUsername()}`); // `Signed up as davidrd123
    return {
      success: true,
      message: "User SignUp Succeeded -- Verify code from email",
    };
  } catch (error) {
    const err = error as { code: string; message: string };
    console.log(err);
    return { success: false, message: "User SignUp Failed" };
  }
};

export const confirmUserCode = async (username: string, code: string) => {
  try {
    await Auth.confirmSignUp(username, code);
    return { success: true, message: "User successfully confirmed" };
  } catch (error) {
    console.log("Error confirming sign up", error);
    return { success: false, message: `Error confirming sign up: ${error}` };
  }
};

// Manually triggering signin for testing
export const signIn = async (
  setUser: Function,
  email: string,
  password: string
  // username = TEST_USER.email,
  // password = TEST_USER.password
) => {
  try {
    const user = await Auth.signIn(email, password);
    setUser(user);
    // Store the JWT token
    // localStorage.setItem('token', user.signInUserSession.idToken.jwtToken);
    console.log(`Signed in as ${user.getUsername()}`);
    return { success: true, message: "User successfully signed in" };
  } catch (error) {
    console.log("error signing in", error);
    return { success: false, message: `Error signing in: ${error}` };
  }
};

export const logout = async () => {
  try {
    await Auth.signOut();
    // Remove the JWT token

    return { success: true, message: "User successfully signed out" };
  } catch (error) {
    console.log("Error signing out", error);
    return { success: false, message: `Error signing out: ${error}` };
  }
};
