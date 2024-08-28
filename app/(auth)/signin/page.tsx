"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense } from "react";

function Page() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  );
}

function PageContent() {
  const params = useSearchParams();
  const error = params.get("error");

  function handleSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const username = e.currentTarget.username.value;
    const password = e.currentTarget.password.value;
    signIn("credentials", {
      username,
      password,
      callbackUrl: "/dashboard",
    });
  }

  return (
    <div className="flex justify-center items-center w-full h-full bg-gradient-to-br from-blue-100 to-blue-400">
      <form
        className="flex flex-col gap-3 bg-white rounded-lg p-4 md:p-6 lg:p-8 shadow-lg"
        onSubmit={(e) => handleSignIn(e)}
      >
        <h2 className="text-2xl font-semibold text-gray-800">
          Membership Dashboard
        </h2>
        <label className="border-2 border-gray-100 flex items-center gap-2 bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            name="username"
            type="text"
            className="grow w-full px-2 py-1"
            placeholder="Username"
          />
        </label>
        <label className="border-2 border-gray-100 flex items-center gap-2 bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            name="password"
            type="password"
            className="grow w-full px-2 py-1"
            placeholder="Password"
          />
        </label>
        <button type="submit" className="bg-highlight rounded-md w-full p-2">
          Sign In
        </button>
        {error ? (
          <p className="text-red-500">Invalid username or password</p>
        ) : null}
      </form>
    </div>
  );
}

export default Page;
