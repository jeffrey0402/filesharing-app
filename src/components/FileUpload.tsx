import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

const FileUpload: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File>();
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [customUrl, setCustomeUrl] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [message, setMessage] = useState<string>();
    const [returnUrl, setReturnUrl] = useState<string>();
  
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
      <div className="mt-2 rounded-xl bg-gray-100 py-2 px-8">
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
              <Disclosure.Panel className="text-gray-500 p-2">
                <label>
                  <span>Custom slug (optional)</span>
                  <div className="flex place-items-center">
                    <span className="text-gray-700">
                      https://files.jeffreyroossien.nl/
                    </span>
                    <input
                      autoComplete="off"
                      className="border:gray-300 ml-1 w-full rounded-md shadow-sm"
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
    );
  };

  export default FileUpload;