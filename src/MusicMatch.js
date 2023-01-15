import React from "react";
import Logo from "./logo-1.png";
import { FaPlay } from "react-icons/fa";
import { BsFillHandThumbsDownFill } from "react-icons/bs";
import { BsFillHandThumbsUpFill } from "react-icons/bs";

export default function MusicMatch() {
  return (
    <div className=" h-screen  flex items-center justify-center bg-slate-500 ">
      <div id="Card" className=" h-1/2 w-1/2 flex justify-center bg-gray-900">
        <div class=" rounded overflow-hidden shadow-lg  w-full  ">
          <img
            class=" h-24 flex items-center justify-center mx-auto"
            src={Logo}
            alt="Sunset in the mountains"
          ></img>
          <div class="px-6 py-4 ">
            <div class="font-bold text-xl mb-2 flex justify-center text-white ">
              (Song Title)
            </div>
            <h2 class=" text-base flex justify-center text-white">(Artist)</h2>
            <div className="flex justify-between text-4xl mt-96">
              <a href="">
                <BsFillHandThumbsDownFill className=" fill-primary hover:fill-red-600" />
              </a>
              <a href="">
                <FaPlay className=" fill-primary hover:opacity-60" />
              </a>
              <a href="">
                <BsFillHandThumbsUpFill className=" fill-primary hover:fill-green-500" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
