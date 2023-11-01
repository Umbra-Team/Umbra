import { Auth } from "aws-amplify";

const TEST_USER = {
  username: "davidrd123",
  password: "bread-first",
  email: "davidrd123@gmail.com",
  phone_number: "+15555555555",
}

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

const USER_CODE = "396375";

export const signUp = async (
  username = TEST_USER.username,
  password = TEST_USER.password,
  email = TEST_USER.email,
  phone_number = TEST_USER.phone_number
) => {
  try {
    console.log(`Signing up as ${username}, ${email}, ${phone_number}`);
    const { user } = await Auth.signUp({
      username,
      password,
      attributes: {
        email,
        phone_number
      },
    });
    console.log(`Signed up as ${user.getUsername()}`); // `Signed up as davidrd123
  } catch (error) {
    const err = error as { code: string, message: string };
    console.log(err);
  }
}

export const confirmUserCode = async (
  username = TEST_USER.username,
  code = USER_CODE
) => {
  try {
    await Auth.confirmSignUp(username, code);
    alert("User successfully confirmed");
    return { success: true, message: 'User successfully confirmed' };
  } catch (error) {
    console.log('Error confirming sign up', error);
    return { success: false, message: `Error confirming sign up: ${error}` };
  }
};

// Manually triggering signin for testing
export const signIn = async (
  username = TEST_USER.username,
  password = TEST_USER.password
) => {
  try {
    const user = await Auth.signIn(username, password);
    // Store the JWT token
    localStorage.setItem('token', user.signInUserSession.idToken.jwtToken);
    console.log(`Signed in as ${user.getUsername()}`);
    return { success: true, message: 'User successfully signed in' };
  } catch (error) {
    console.log("error signing in", error);
    return { success: false, message: `Error signing in: ${error}` };
  }
}

export const logout = async () => {
  try {
    await Auth.signOut();
    // Remove the JWT token
    localStorage.removeItem('token');
    return { success: true, message: 'User successfully signed out' };
  } catch (error) {
    console.log('Error signing out', error);
    return { success: false, message: `Error signing out: ${error}` };
  }
};