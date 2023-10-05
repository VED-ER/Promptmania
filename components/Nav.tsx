"use client";

import { BuiltInProviderType } from "next-auth/providers/index";
import {
  ClientSafeProvider,
  LiteralUnion,
  getProviders,
  signIn,
  signOut,
  useSession,
} from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Nav = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const getAndSetProviders = async () => {
      const res = await getProviders();

      setProviders(res);
    };

    getAndSetProviders();
  }, []);

  return (
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
                src={session.user.image!}
                width={37}
                height={37}
                alt="profile image"
                className="rounded-full"
              />
            </Link>
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="black_btn"
                >
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>

      {/* mobile */}
      <div className="sm:hidden flex relative">
        {session?.user ? (
          <div className="flex">
            <Image
              src={session.user.image!}
              width={37}
              height={37}
              alt="profile image"
              className="rounded-full"
              onClick={() => setShowDropdown((prev) => !prev)}
            />

            {showDropdown && (
              <div className="dropdown">
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
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="black_btn"
                >
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
