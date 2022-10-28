import { signIn } from "next-auth/react";

const SignIn: React.FC = () => {

return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold leading-normal text-gray-700">
        Please sign in
      </h1>
      <button
        className="m-2 rounded-md bg-blue-600 py-2 px-4 text-white"
        onClick={() => signIn()}
      >
        Sign in
      </button>
    </main>
  );
};

export default SignIn;