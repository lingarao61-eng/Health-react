import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // ------------------------------
  // FORM STATES
  // ------------------------------
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [resetForm, setResetForm] = useState({
    password: "",
    confirm_password: "",
  });

  const [message, setMessage] = useState("");
  const [resetMode, setResetMode] = useState(false); // toggles reset password UI

  // ------------------------------
  // HANDLE INPUT CHANGE
  // ------------------------------
  const handleChange = (e) => {
    if (resetMode) {
      setResetForm({
        ...resetForm,
        [e.target.name]: e.target.value,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  // ======================================================
  // 🔑 LOGIN → XANO
  // ======================================================
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Signing in...");

    try {
      const response = await fetch(
        "https://x8ki-letl-twmt.n7.xano.io/api:7sOVqxPz/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log("Login Response:", data);

      if (data.authToken) {
        localStorage.setItem("authToken", data.authToken);
        localStorage.setItem("user_id", data.user_id);

        setMessage("Login successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1200);
      } else {
        setMessage(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server Error. Try again.");
    }
  };

  // ======================================================
  // 🔐 UPDATE PASSWORD → XANO (/reset/update_password)
  // ======================================================
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage("Updating password...");

    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setMessage("You must be logged in to reset password.");
      return;
    }

    try {
      const response = await fetch(
        "https://x8ki-letl-twmt.n7.xano.io/api:7sOVqxPz/reset/update_password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(resetForm),
        }
      );

      const data = await response.json();
      console.log("Password Reset Response:", data);

      if (data?.message?.includes("success")) {
        setMessage("Password updated successfully!");
        setResetMode(false);
      } else {
        setMessage(data.message || "Password update failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error during reset.");
    }
  };

  // ======================================================
  // UI RETURNS
  // ======================================================
  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
       
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {resetMode ? "Reset Password" : "Sign In"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {resetMode
                ? "Enter your new password below"
                : "Enter your email and password to sign in!"}
            </p>
          </div>

          {!resetMode && (
            <>
              {/* Google + X Buttons */}
             

              <div className="relative py-3 sm:py-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  
                </div>
              </div>
            </>
          )}

          {/* =========================== */}
          {/* SIGN IN FORM */}
          {/* =========================== */}
          {!resetMode ? (
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                {/* Email */}
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    placeholder="info@gmail.com"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />

                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>

                {/* Keep me logged in */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="text-gray-700 dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>

                  <span
                    onClick={() => setResetMode(true)}
                    className="text-sm text-brand-500 cursor-pointer hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </span>
                </div>

                <div>
                  <Button className="w-full" size="sm" type="submit">
                    Sign in
                  </Button>
                </div>

                {message && (
                  <p className="text-center text-sm text-green-600 dark:text-green-400">
                    {message}
                  </p>
                )}
              </div>
            </form>
          ) : (
            // ===========================
            // RESET PASSWORD FORM
            // ===========================
            <form onSubmit={handlePasswordReset}>
              <div className="space-y-6">
                {/* New Password */}
                <div>
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter new password"
                    value={resetForm.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    name="confirm_password"
                    placeholder="Confirm new password"
                    value={resetForm.confirm_password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button className="w-full" size="sm" type="submit">
                  Update Password
                </Button>

                <p
                  onClick={() => setResetMode(false)}
                  className="text-sm text-center cursor-pointer text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Back to Login
                </p>

                {message && (
                  <p className="text-center text-sm text-green-600 dark:text-green-400">
                    {message}
                  </p>
                )}
              </div>
            </form>
          )}

          {/* SIGNUP LINK */}
          {!resetMode && (
            <div className="mt-5">
              <p className="text-sm text-center text-gray-700 dark:text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
