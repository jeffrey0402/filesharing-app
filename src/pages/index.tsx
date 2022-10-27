import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { SetStateAction, useState } from "react";
import { trpc } from "../utils/trpc";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronRightIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

const Home: NextPage = () => {
  const session = useSession();

  const [selectedFile, setSelectedFile] = useState<File>();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [customUrl, setCustomeUrl] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [returnUrl, setReturnUrl] = useState<string>();

  // Prompt user login
  if (!session.data && session.status !== "loading") {
    return (
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-bold leading-normal text-gray-700">
          Please sign in to upload files
        </h1>
        <button
          className="m-2 rounded-md bg-blue-600 py-2 px-4 text-white"
          onClick={() => signIn()}
        >
          Sign in
        </button>
      </main>
    );
  }

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setIsFilePicked(true);
    }
  };

  const urlChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: validate url, mark red if it is taken
    setCustomeUrl(event.target.value);
  };

  const passwordChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(event.target.value);
  };

  const uploadToServer = () => {
    const formData = new FormData();
    setReturnUrl("");
    if (!isFilePicked || !selectedFile) {
      setMessage("No file selected");
      return;
    }
    setMessage("Uploading...");
    formData.append("file", selectedFile);
    // generate query params
    const params = new URLSearchParams();
    if (customUrl) params.append("url", customUrl);
    if (password) params.append("password", password);
    // upload files to server
    fetch("api/upload?" + params, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          setMessage(`Upload complete!`);
          setReturnUrl(data.url);
        } else {
          setMessage(data.message);
        }
      })
      .catch((error) => {
        setMessage("Error: " + error);
      });
  };

  return (
    <>
      <Head>
        <title>Simple file upload app</title>
        <meta
          name="description"
          content="Upload files for free without hassle!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center p-4">
        <div className="absolute right-2 top-2">
          <button
            className="m-2 rounded-md bg-blue-600 py-2 px-4 text-white"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </div>
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          Upload <span className="text-blue-600">A</span> File
        </h1>
        <p>
          Welcome back,{" "}
          <span className="font-medium">
            {session.data?.user?.name
              ? session.data?.user?.name
              : session.data?.user?.email}
          </span>
        </p>
        <div className="py-2 mt-2 px-8 rounded-xl bg-gray-100">
          <div className="flex w-96 flex-col gap-4">
            <label htmlFor="file" className="text-2xl text-gray-700">
              Select File:{" "}
            </label>
            <input
              className=""
              type="file"
              name="file"
              multiple={false}
              onChange={changeHandler}
            />
            <Disclosure>
              <Disclosure.Button className="flex w-full items-center justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                <span>Advanced Options</span>
                <ChevronUpIcon className="h-6 ui-open:rotate-180 ui-open:transform" />
              </Disclosure.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel className="text-gray-500">
                  <label>
                    <span>Custom slug (optional)</span>
                    <div className="flex place-items-center">
                      <span className="text-gray-700">
                        https://files.jeffreyroossien.nl/
                      </span>
                      <input
                        autoComplete="off"
                        className="border:gray-300 w-full rounded-md shadow-sm"
                        name="slug"
                        minLength={2}
                        maxLength={20}
                        type="text"
                        onChange={urlChangeHandler}
                      />
                    </div>
                  </label>
                  <label>
                    <span>Password: (optional)</span>
                    <input
                      autoComplete="off"
                      className="border:gray-300 w-full rounded-md shadow-sm"
                      name="password"
                      minLength={2}
                      maxLength={20}
                      type="password"
                      onChange={passwordChangeHandler}
                    />
                  </label>
                </Disclosure.Panel>
              </Transition>
            </Disclosure>

            <button
              className="m-2 rounded-md bg-blue-600 py-2 text-white"
              onClick={uploadToServer}
            >
              Upload
            </button>
            <p>{message}</p>
            {returnUrl && (
              <>
                <input
                  readOnly
                  className="m-2 rounded-md border-2 border-blue-600 p-2"
                  type="text"
                  value={returnUrl}
                />
                <button
                  className="m-2 rounded-md bg-blue-600 py-2 text-center text-white"
                  onClick={() => {
                    navigator.clipboard.writeText(returnUrl);
                    setMessage("Copied to clipboard!");
                  }}
                >
                  Copy
                </button>
                <a
                  className="m-2 rounded-md bg-blue-600 py-2 text-center text-white"
                  href={returnUrl}
                >
                  Download
                </a>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

const AuthShowcase: React.FC = () => {
  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery();

  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {sessionData && (
        <p className="text-2xl text-blue-500">
          Logged in as {sessionData?.user?.name}
        </p>
      )}
      {secretMessage && (
        <p className="text-2xl text-blue-500">{secretMessage}</p>
      )}
      <button
        className="rounded-md border border-black bg-violet-50 px-4 py-2 text-xl shadow-lg hover:bg-violet-100"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

export default Home;
