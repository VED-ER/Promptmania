"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import Input from "./Input";

const Nav = () => {
  const [formError, setFormError] = useState<string | null>(null);
  const [signUpForm, setSignUpForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [signInForm, setSignInForm] = useState({ email: "", password: "" });
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (showDropdown) mobileDropdownRef.current?.focus();
  }, [showDropdown]);

  const handleDropdownBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setShowDropdown(false);
    }
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    console.log(signUpForm);

    if (signUpForm.username.length < 6) {
      setFormError("Username must be at least 6 characters long");
      return;
    }

    if (!signUpForm.email.match(validRegex)) {
      setFormError("Email not valid");
      return;
    }

    if (signUpForm.password !== signUpForm.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (signUpForm.password.length < 6) {
      setFormError("Password must be at least 6 characters long");
      return;
    }

    setFormError(null);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        body: JSON.stringify({
          username: signUpForm.username,
          email: signUpForm.email,
          password: signUpForm.password,
        }),
      });

      if (res.ok) {
        console.log("Created user");
      } else {
        const error = await res.json();
        setFormError(error.name);
      }
    } catch (error) {
      if (error instanceof Error) setFormError(error.message);
    }
  };

  const handleCredentialsSignIn = async (e: FormEvent) => {
    e.preventDefault();
    console.log(signInForm);

    const signInRes = await signIn("credentials", {
      email: signInForm.email,
      password: signInForm.password,
      redirect: false,
    });

    if (signInRes && !signInRes.error) {
      setShowSignIn(false);
    } else {
      setSignInError("Invalid credentials");
    }
  };
  return (
    <>
      <Modal open={showSignUp} onClose={() => setShowSignUp(false)}>
        <div className="flex flex-col gap-7 min-w-[300px]">
          <div className="flex flex-start gap-2 ms-1">
            <Image
              src={"/assets/images/logo.svg"}
              width={30}
              height={30}
              className="object-contain"
              alt="Promptmania logo"
            />
            <p className="logo_text">Promptmania</p>
          </div>
          <div className="ms-2">
            <h4 className="font-bold text-lg">Create your account</h4>
            <p className="text-slate-500 text-sm">to continue to Promptmania</p>
          </div>
          <div
            onClick={() => signIn("google")}
            className="flex items-center gap-3 py-3 px-5 border rounded-full cursor-pointer hover:bg-black hover:bg-opacity-5 transition-all"
          >
            <Image
              src={"/assets/images/google.svg"}
              width={25}
              height={25}
              className="object-contain"
              alt="Google logo"
            />
            <p className="text-sm">Sign up with Google</p>
          </div>
          <form
            className="relative flex flex-col gap-3"
            onSubmit={handleSignUp}
          >
            <Input
              type="text"
              id="username"
              name="Username"
              required={true}
              onChange={(e) =>
                setSignUpForm((prev) => ({ ...prev, username: e.target.value }))
              }
            />
            <Input
              type="email"
              id="email"
              name="Email"
              required={true}
              onChange={(e) =>
                setSignUpForm((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <Input
              type="password"
              id="password"
              name="Password"
              required={true}
              onChange={(e) =>
                setSignUpForm((prev) => ({ ...prev, password: e.target.value }))
              }
            />
            <Input
              type="password"
              id="confirmpassword"
              name="Confirm password"
              required={true}
              onChange={(e) =>
                setSignUpForm((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
            />
            <div className="absolute bottom-9 left-2">
              <p className="text-xs text-red-500">{formError}</p>
            </div>
            <button type="submit" className="black_btn mt-2">
              Sign Up
            </button>
          </form>

          <div>
            <p className="text-xs">
              Have an account?{" "}
              <span className="text-orange-600 font-bold">Sign in</span>
            </p>
          </div>
        </div>
      </Modal>
      <Modal open={showSignIn} onClose={() => setShowSignIn(false)}>
        <div className="flex flex-col gap-7 min-w-[300px]">
          <div className="flex flex-start gap-2 ms-1">
            <Image
              src={"/assets/images/logo.svg"}
              width={30}
              height={30}
              className="object-contain"
              alt="Promptmania logo"
            />
            <p className="logo_text">Promptmania</p>
          </div>
          <div className="ms-2">
            <h4 className="font-bold text-lg">Login to your account</h4>
            <p className="text-slate-500 text-sm">to continue to Promptmania</p>
          </div>
          <div
            onClick={() => signIn("google")}
            className="flex items-center gap-3 py-3 px-5 border rounded-full cursor-pointer hover:bg-black hover:bg-opacity-5 transition-all"
          >
            <Image
              src={"/assets/images/google.svg"}
              width={25}
              height={25}
              className="object-contain"
              alt="Google logo"
            />
            <p className="text-sm">Sign in with Google</p>
          </div>
          <form
            className="relative flex flex-col gap-3"
            onSubmit={handleCredentialsSignIn}
          >
            <Input
              type="email"
              id="email"
              name="Email"
              required={true}
              onChange={(e) =>
                setSignInForm((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <Input
              type="password"
              id="password"
              name="Password"
              required={true}
              onChange={(e) =>
                setSignInForm((prev) => ({ ...prev, password: e.target.value }))
              }
            />
            <div className="absolute bottom-9 left-2">
              <p className="text-xs text-red-500">{signInError}</p>
            </div>
            <button type="submit" className="black_btn mt-2">
              Sign In
            </button>
          </form>
        </div>
      </Modal>
      <nav className="flex flex-between w-full mb-16 pt-3">
        <Link href={"/"} className="flex flex-center gap-2">
          <Image
            src={"/assets/images/logo.svg"}
            width={30}
            height={30}
            className="object-contain"
            alt="Promptmania logo"
          />
          <p className="logo_text">Promptmania</p>
        </Link>

        <div className="sm:flex hidden">
          {session?.user ? (
            <div className="flex gap-3 md:gap-5">
              <Link href={"/create-prompt"} className="black_btn">
                Create Prompt
              </Link>
              <button
                type="button"
                className="outline_btn"
                onClick={() => {
                  signOut();
                  router.push("/");
                }}
              >
                Sign Out
              </button>

              <Link href={"/profile"}>
                <Image
                  src={
                    session.user.image
                      ? session.user.image
                      : "/assets/images/user.svg"
                  }
                  width={37}
                  height={37}
                  alt="profile image"
                  className="rounded-full border border-black"
                />
              </Link>
            </div>
          ) : (
            <div className="flex gap-3 md:gap-5">
              <button
                type="button"
                className="black_btn"
                onClick={() => setShowSignIn(true)}
              >
                Sign In
              </button>
              <button
                className="outline_btn ms-3"
                type="button"
                onClick={() => setShowSignUp(true)}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* mobile */}
        <div className="sm:hidden flex relative">
          {session?.user ? (
            <div className="flex">
              <Image
                src={
                  session.user.image
                    ? session.user.image
                    : "/assets/images/user.svg"
                }
                width={37}
                height={37}
                alt="profile image"
                className="rounded-full"
                onClick={() => setShowDropdown((prev) => !prev)}
              />

              {showDropdown && (
                <div
                  tabIndex={1}
                  onFocus={() => console.log("focusd")}
                  id="dropdown"
                  ref={mobileDropdownRef}
                  className="dropdown"
                  onBlur={handleDropdownBlur}
                >
                  <Link
                    href={"/profile"}
                    className="dropdown_link"
                    onClick={() => setShowDropdown(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    href={"/create-prompt"}
                    className="dropdown_link"
                    onClick={() => setShowDropdown(false)}
                  >
                    Create Prompt
                  </Link>

                  <button
                    type="button"
                    className="black_btn mt-5 w-full"
                    onClick={() => {
                      setShowDropdown(false);
                      signOut();
                      router.push("/");
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                type="button"
                className="black_btn me-3"
                onClick={() => setShowSignIn(true)}
              >
                Sign In
              </button>
              <button
                type="button"
                className="outline_btn"
                onClick={() => setShowSignUp(true)}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Nav;
