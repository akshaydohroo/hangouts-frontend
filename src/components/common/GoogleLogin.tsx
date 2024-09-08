import { Button } from "@mui/material";
import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import { NavigateFunction, useNavigate } from "react-router";
import { backend } from "../../api";
import { googleAuthScopes } from "../../utils/variables";

export function checkAllScopesGranted(
  reqScopes: string,
  grantScopes: string
): boolean {
  const reqScopesArray = reqScopes.split(" ");
  const grantScopesArray = grantScopes.split(" ");
  return reqScopesArray.every((reqScope) => {
    return grantScopesArray.includes(reqScope);
  });
}
export async function onSuccessGoogleOAuth(
  code: Omit<CodeResponse, "error" | "error_description" | "error_uri">,
  requestType: "login" | "signin",
  navigate: NavigateFunction
) {
  try {
    if (!checkAllScopesGranted(googleAuthScopes, code.scope))
      throw Error("Not All Scopes Granted");
    await backend.post(
      "/auth/google",
      { code: code.code, requestType },
      {
        withCredentials: true,
      }
    );
    navigate("/");
  } catch (err) {
    console.error(err);
    throw err;
  }
}
export default function GoogleLogin({ text }: { text: "login" | "signin" }) {
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    scope: googleAuthScopes,
    onSuccess: (code) => onSuccessGoogleOAuth(code, text, navigate),
    // onError:,
    flow: "auth-code",
  });
  return <Button onClick={googleLogin}>{`${text} With Google`}</Button>;
}
