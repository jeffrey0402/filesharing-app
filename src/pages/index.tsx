import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { SetStateAction, useState } from "react";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const [selectedFile, setSelectedFile] = useState<File>();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [customUrl, setCustomeUrl] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [returnUrl, setReturnUrl] = useState<string>();

  if (!sessionData) {
    return (
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700">Please sign in to upload files</h1>
        <button className="m-2 rounded-md bg-blue-600 py-2 px-4 text-white" onClick={() => signIn()}>Sign in</button>
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

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <AuthShowcase />
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          Upload <span className="text-blue-600">A</span> File
        </h1>
        <div className="flex flex-col">
          <p className="text-2xl text-gray-700">Select File: </p>
          <input
            className="m-2 rounded-md py-2"
            type="file"
            name="file"
            multiple={false}
            onChange={changeHandler}
          />
          <label>Custom URL: (optional)</label>
          <input
            className="m-2 rounded-md border-2 border-blue-600 p-2"
            name="customUrl"
            minLength={2}
            maxLength={20}
            type="text"
            onChange={urlChangeHandler}
          />
          {/* <label>Password: (optional)</label> */}
          {/* <input
            className="m-2 rounded-md border-2 border-blue-600 p-2"
            name="password"
            type="text"
            onChange={passwordChangeHandler}
          /> */}
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