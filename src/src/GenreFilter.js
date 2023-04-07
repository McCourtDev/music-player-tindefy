import { useState } from "react";

function GenreFilter({ handleFilter }) {
  const [selectedGenre, setSelectedGenre] = useState("");

  const handleChange = (event) => {
    setSelectedGenre(event.target.value);
    handleFilter(event.target.value);
  };

  return (
    <div className="relative">
      <select
        className="block appearance-none w-full bg-primary border border-gray-700 text-white py-3 px-4 pr-8   rounded leading-tight focus:outline-none focus:bg-primary focus:border-gray-500  "
        value={selectedGenre}
        onChange={handleChange}
      >
        <option value="">All Genres</option>
        <option value="rock">Rock</option>
        <option value="pop">Pop</option>
        <option value="hip-hop">Hip Hop</option>
        <option value="jazz">Jazz</option>
        <option value="dance">dance</option>
        <option value="deep house">deep house</option>
        <option value="rap">rap</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}

export default GenreFilter;
