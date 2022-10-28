import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import SignIn from "../components/SignIn";
import { Spinner } from "../components/Spinner";
import { trpc } from "../utils/trpc";

const Manage: NextPage = () => {
  // Prompt user login
  const session = useSession();
  // get all files from server
  const filesQuery = trpc.file.filesFromUser.useQuery(
    session.data?.user?.id ? session.data?.user?.id : "loading"
  );
  if (!session.data && session.status !== "loading") {
    return <SignIn />;
  } else if (session.status === "loading") {
    return <Spinner />;
  }


  return (
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
      <Link href="/">
        <a className="border:gray-300 rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm">
          Home
        </a>
      </Link>
      <table className="mt-2 table-auto border-collapse">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="border border-blue-600">File name</th>
            <th className="border border-blue-600">expiration date</th>
            <th className="border border-blue-600">download</th>
            <th className="border border-blue-600">Delete</th>
          </tr>
        </thead>
        <tbody>
          {filesQuery.data?.map((file) => (
            <tr key={file.id} className="bg-blue-100 text-black">
              <th className="border border-blue-700 font-normal">
                {file.filename}
              </th>
              <th className="border border-blue-700 font-normal">
                {file.expirationDate?.toDateString()}
              </th>
              <th className="border border-blue-700 font-normal">
                <a
                  className="border:gray-300 rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm"
                  href={"api/download/" + (file.slug ? file.slug : file.id)}
                >
                  Download
                </a>
              </th>
              <th className="border border-blue-700 font-normal">
                <DeleteFile id={file.id} />
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

const DeleteFile: React.FC<{ id: string }> = ({ id }) => {
  const utils = trpc.useContext();
  const deleteFile = (id: string) => {
    const success = trpc.file.delete.useQuery(id);
    if (success) {
      // invalidate the query
      utils.file.filesFromUser.invalidate();
    }
  };
  return (
    <button
      className="border:gray-300 rounded-md bg-red-600 px-4 py-2 text-white shadow-sm"
      onClick={() => deleteFile(id)}
    >
      Delete
    </button>
  );
};

export default Manage;
