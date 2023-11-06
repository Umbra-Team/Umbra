
import http from "k6/http";

export const options = {
  iterations: 1,
};

const getToken = async () => {
  const url = "http://localhost:3001/api/auth/login";
  const payload = JSON.stringify({
    username: "davidrd123",
    password: "bread-first",
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
    }
  }
  const { token } = http.post(url, payload, params);
}

export default async function () {
  const token = await getToken();
  
}
