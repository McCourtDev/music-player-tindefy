import React from "react";

function FAQ() {
  return (
    <div className="bg-gray-900 p-6 rounded-lg mt-12 shadow-custom w-1/2">
      <div className="text-white">
        <h3 className="flex  font-bold">How does Tindefy work?</h3>
        <div className="flex mt-4">
          <div className="w-1/2 pr-4">
            <p>
              Tindefy is a music discovery app that recommends new music based
              on your interests. By logging in with your Spotify account,
              Tindefy can analyse your listening habits and suggest new songs
              and artists you might enjoy.
              <br />
              <br />
              Here's a demo of Tindefiy in use, showcasing its powerful features
              and functionality.
            </p>
          </div>
          <div className="w-1/2 shadow-custom">
            <video src="/Demo.mp4" width="100%" height="auto" controls>
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
