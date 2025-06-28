import React, { useEffect, useRef } from "react";
import { useState } from "react";
import "./App.css";
import { URL } from "./constants.js";
import Answers from "./components/Answers.jsx";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history"))
  );
  const [selectHistory, setSelectHistory] = useState("");
  const scrollToAns = useRef();
  const [loader, setLoader] = useState(false);

  const askQuestion = async () => {
    if (!question && !selectHistory) {
      return false;
    }

    if (question) {
      if (localStorage.getItem("history")) {
        let history = JSON.parse(localStorage.getItem("history"));
        history = [question, ...history];
        localStorage.setItem("history", JSON.stringify(history));
        setRecentHistory(history);
      } else {
        localStorage.setItem("history", JSON.stringify([question]));
        setRecentHistory([question]);
      }
    }

    const payloadData = question ? question : selectHistory;
    const payload = {
      contents: [
        {
          parts: [
            {
              text: payloadData,
            },
          ],
        },
      ],
    };
    setLoader(true);
    let response = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    response = await response.json();
    let dataString = response.candidates[0].content.parts[0].text;
    dataString = dataString.split("* ");
    dataString = dataString.map((item) => item.trim());
    //console.log(dataString);
    setResult([
      ...result,
      { type: "q", text: question ? question : selectHistory },
      { type: "a", text: dataString },
    ]);
    setQuestion("");
    setTimeout(() => {
      scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
    }, 500);
    setLoader(false);
  };

  const clearHistory = () => {
    localStorage.removeItem("history");
    setRecentHistory([]);
  };

  const isEnter = (event) => {
    if (event.key == "Enter") {
      askQuestion();
    }
  };
  useEffect(() => {
    console.log(selectHistory);
    askQuestion();
  }, [selectHistory]);

  return (
    <div className="grid grid-cols-5 h-screen text-center">
      <div className="col-span-1 bg-zinc-800 pt-3 px-2">
        <h1 className="sm:text-sm  text-white font-bold flex text-center justify-center ">
          <span >Recent History</span>
          <button onClick={clearHistory} className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#e3e3e3"
            >
              <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
            </svg>
          </button>
        </h1>
        <ul className="text-left overflow-auto text-sm">
          {recentHistory &&
            recentHistory.map((item) => (
              <li
                onClick={() => setSelectHistory(item)}
                className="p-1 pl-5 truncate text-zinc-400 cursor-pointer hover:bg-zinc-700 hover:text-zinc-200"
              >
                {item}
              </li>
            ))}
        </ul>
      </div>
      <div className="col-span-4 p-10">
        <h1 className="p-3 md:text-4xl text-xl bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700">
          Hello User, Ask me Anything
        </h1>
        {loader ? (
          <div role="status">
            <svg
              aria-hidden="true"
              class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        ) : null}
        <div
          ref={scrollToAns}
          //overflow scroll
          style={{
            overflowY: "scroll",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitScrollbar: "none",
          }}
          className="container h-110 "
        >
          <div className="text-zinc-300">
            <ul>
              {result.map((item, index) => (
                <div
                  key={index + Math.random()}
                  className={item.type === "q" ? "flex justify-end" : ""}
                >
                  {item.type === "q" ? (
                    <li
                      key={index + Math.random()}
                      className="text-right p-1 border-8 bg-zinc-700 border-zinc-700 rounded-tl-2xl rounded-bl-2xl rounded-br-2xl w-fit mt-4 mb-1"
                    >
                      <Answers
                        ans={item.text}
                        totalResult={1}
                        index={index}
                        type={item.type}
                      />
                    </li>
                  ) : (
                    item.text.map((ansItem, ansIndex) => (
                      <li
                        key={ansIndex + Math.random()}
                        className="text-left p-1"
                      >
                        <Answers
                          ans={ansItem}
                          totalResult={item.length}
                          index={ansIndex}
                        />
                      </li>
                    ))
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-zinc-800 sm:w-1 md:w-1/2 p-1 text-white m-auto mt-4 rounded-4xl border border-zinc-700 flex h-16">
          <input
            type="text"
            value={question}
            //on Enter key press
            onKeyDown={isEnter}
            onChange={(event) => setQuestion(event.target.value)}
            className="w-full h-full p-3 outline-none"
            placeholder="Search Anything"
          />
          <button onClick={askQuestion} className="mx-4 h-full py-2">
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
