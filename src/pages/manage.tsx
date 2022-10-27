import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import FileUpload from "../components/FileUpload";
import Link from "next/link";

const Manage: NextPage = () => {
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
hello
</>
      )


    }

    export default Manage;