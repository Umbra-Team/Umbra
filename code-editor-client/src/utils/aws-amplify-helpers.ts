import { Auth } from "aws-amplify";

const TEST_USER = {
  username: "davidrd123",
  password: "bread-first",
  email: "davidrd123@gmail.com",
  phone_number: "+15555555555",
}

const USER_CODE = "647787";

export const signUp = async (
  username = TEST_USER.username,
  password = TEST_USER.password,
  email = TEST_USER.email,
  phone_number = TEST_USER.phone_number
) => {
  try {
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
    console.log("error signing up:", error);
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
    console.log(`Signed in as ${user.getUsername()}`);
  } catch (error) {
    console.log("error signing in", error);
  }
}
