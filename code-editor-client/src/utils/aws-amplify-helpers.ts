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
    const { user } = await Auth.signUp({
      username: email,
      password,
    });
    return {
      success: true,
      message: "User SignUp Succeeded -- Verify code from email",
      user,
    };
  } catch (error: any) {
    console.log(error.code);
    throw error;
  }
};

export const confirmUserCode = async (username: string, code: string) => {
  try {
    await Auth.confirmSignUp(username, code);
    return {
      success: true,
      message: "Verification Confirmed - You can Sign In now.",
    };
  } catch (error) {
    console.log("Error confirming sign up", error);
    throw error;
  }
};

// Manually triggering signin for testing
export const signIn = async (
  setUser: Function,
  email: string,
  password: string
) => {
  try {
    const user = await Auth.signIn(email, password);
    setUser(user);
    // Store the JWT token
    // localStorage.setItem('token', user.signInUserSession.idToken.jwtToken);
    return { success: true, message: "User successfully signed in" };
  } catch (error: any) {
    if (error.code === "NotAuthorizedException") {
      throw new Error("Invalid username or password");
    }
    throw new Error(`Error signing in: ${error}`);
  }
};

// submit email for forgotten password
export const forgotPassword = async (email) => {
  try {
    const response = await Auth.forgotPassword(email);
    return { success: true, message: "Password reset code sent to email" };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// resets password with code and inputs new password
export const resetPassword = async (email, code, newPassword) => {
  try {
    const response = await Auth.forgotPasswordSubmit(email, code, newPassword);
    return { success: true, message: "Password successfully reset" };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// uset logout
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
