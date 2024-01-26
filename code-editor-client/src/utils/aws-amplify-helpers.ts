import { Auth } from "aws-amplify";

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
