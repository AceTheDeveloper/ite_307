import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/providers/UserProvider";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setIsLoading] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const router = useRouter();
  const { setUser } = useUser();

  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const res = await api.post("api/auth/register", {
          name,
          email,
          password,
        });
        setIsSignUp(false);
      } else {
        const res = await api.post("api/auth/login", {
          email,
          password,
        });
        console.log("RESPONSE : ", res.data);

        if (!res.data.isSuccess && res.data.requiresOTP) {
          router.push("/verify_otp");
        }

        if (res.data.isSuccess) {
          setUser(res.data.user);

          if (res.data.user.role === "admin") {
            router.push("/dashboard");
          } else {
            router.push("/user");
          }
        }
      }
    } catch (error: any) {
      const data = error.response.data;
      if (error.response) {
        // This is the server response (your JSON)
        setError(data.message);
      } else if (error.request) {
        // Request was made but no response
      } else {
        // Some other error
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    const numberOrSymbolRegex = /[^a-zA-Z]/; // anything that's not a letter

    if (value.length > 0) {
      if (value.length < 8) {
        setPasswordError("Password must be at least 8 characters");
      } else if (!numberOrSymbolRegex.test(value)) {
        setPasswordError("Password must contain at least 1 number or symbol");
      } else {
        setPasswordError(null); // valid password
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Apple
                </Button>
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              {error && (
                <span className="text-center text-red-500">{error}</span>
              )}

              {isSignUp && (
                <Field>
                  <FieldLabel htmlFor="email">Name</FieldLabel>
                  <Input
                    id="text"
                    type="text"
                    placeholder="John Down"
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field>
              )}

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={
                    isSignUp
                      ? (e) => handlePasswordChange(e.target.value)
                      : (e) => setPassword(e.target.value)
                  }
                />
                {isSignUp && password.length > 0 && (
                  <span
                    className={`text-sm font-semibold ${
                      passwordError ? "text-red-500" : "text-emerald-500"
                    }`}
                  >
                    {passwordError ?? "Looks good!"}
                  </span>
                )}
              </Field>
              <Field>
                <Button
                  type="button"
                  onClick={handleClick}
                  disabled={!!passwordError || !password}
                >
                  {loading ? <Spinner /> : isSignUp ? "Register" : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={
                      isSignUp
                        ? () => setIsSignUp(false)
                        : () => setIsSignUp(true)
                    }
                  >
                    Sign up
                  </button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
