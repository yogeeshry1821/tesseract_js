import { Image } from "@/next.config";
import { useState } from "react";
import { createWorker } from "tesseract.js";
export default function Home() {
  const [isloading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [image, SetImage] = useState("");
  const [progress, setProgress] = useState(0);
  // const [file,setFile] = useState(false);
  const handleClick = async () => {
    setIsLoading(true);
    // setFile(true);
    const worker = await createWorker({
      logger: (m) => {
        console.log(m);
        if(m.status ==="recognizing text"){
          setProgress(parseInt(m.progress*100))
        }
      },
    });
    (async () => {
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const {
        data: { text },
      } = await worker.recognize(image);
      setText(text);
      setIsLoading(false);
      await worker.terminate();
    })();
  };

  return (
    <div className="flex flex-col h-96">
      {!isloading && (
        <h1>
          <div className="text-center justify-center font-bold p-5 text-xl bg-red-100 m-5 rounded-lg">
            Image to Text
          </div>
        </h1>
      )}
      {isloading && (
        <>
          <p className="m-5 bg-blue-100 p-3 w-48 rounded-2xl font-sans text-xl font-semibold text-center">
            Converting : {progress}%
          </p>
        </>
      )}

      {!isloading && !text && (
        <>
          <div className="flex justify-center ">
            <div className="m-10">
              <input
                type="file"
                className=" rounded-xl bg-blue-100 p-2 text-center"
                onChange={(e) =>
                  SetImage(URL.createObjectURL(e.target.files[0]))
                }
              />
            </div>
            <input
              type="button"
              className="bg-emerald-200 text-center font-bold rounded-xl px-4 m-8 "
              value="Convert"
              onClick={handleClick}
            />
          </div>
        </>
      )}
      <div>
        {/* <Image/> */}
      {!isloading && text && (
        <textarea
          className=" p-5 w-full mx-5 text-center "
          rows="15"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      )}
      </div>
    </div>
  );
}
