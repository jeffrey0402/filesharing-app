import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import FileUpload from "../components/FileUpload";
import Link from "next/link";

const Home: NextPage = () => {
  const session = useSession();

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

  return (
    <>
      <Head>
        <title>Fileshare app</title>
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
        <Link href="/manage">
          <a className="border:gray-300 rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm">
            Manage files
          </a>
        </Link>
        <FileUpload />
      </main>
    </>
  );
};

export default Home;
