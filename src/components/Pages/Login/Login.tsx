import { useEffect, useState } from "react";
import "./Login.css";
import { EmailField } from "@/components/loginComponents/EmailField";
import { PasswordField } from "@/components/loginComponents/PasswordField";
import { Title } from "@/components/loginComponents/Title";
import { Button } from "@/components/ui/button";
import { translateError } from "@/components/loginComponents/translateError";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setErrorMessage(null);
  }, [email, password]);

  return (
    <div className="p-0 m-0 w-screen h-screen flex items-center justify-center bg-gray-900">
      <main className="login-container">
        <form
          className="login-form bg-gray-50 "
          onSubmit={(event) => {
            event.preventDefault();
            setIsLoading(true);
            setErrorMessage(null);

            fetch("https://backend-login-placeholder.deno.dev/api/users/login", {
              method: "POST",
              body: JSON.stringify({ email, password }),
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.status === "error") {
                  throw new Error(data.code);
                }
                return data.payload;
              })
              .then((payload) => {
                localStorage.setItem("token", payload.jwt);
              })
              .then(() => {
                navigate("/recipes");
              })
              .catch((error) => {
                setErrorMessage(error.message);
              })
              .finally(() => {
                setIsLoading(false);
              });
          }}
        >
          <Title>Login with email</Title>
          <p>Enter your email address to login with your account.</p>

          <EmailField
            id="email"
            labelText="Your email"
            value={email}
            onChange={setEmail}
          />
          <PasswordField
            id="password"
            labelText="Your password"
            value={password}
            onChange={setPassword}
          />
          {errorMessage && <p>{translateError(errorMessage)}</p>}
          <Button disabled={isLoading} > Login </Button>
        </form>
      </main>
    </div>
  );
};

export default Login;