"use client"

import { useImageStore } from "@/stores/useImageStore";
import { useEffect, useState } from "react";

const categories = [
  "Nature", "Animals", "People", "Business", "Technology", "Food", "Travel", 
  "Health", "Education", "Architecture", "Fashion", "Entertainment", 
  "Transportation", "Abstract", "Science", "Holiday", "Industrial", 
  "Military", "Religion", "Environment"
];

//@ts-ignore
function useDebounceValue(value, timeout){//implementing debouncing 

  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeValue = setTimeout(()=> {
      setDebouncedValue(value)
    }, timeout)

    return () => {//clearing the old clock
      clearTimeout(timeValue);
    }

  }, [value])

  return debouncedValue;
}

const SearchBar = () => {
    
    //@ts-ignore
    const {searchText, products, getAllProducts} = useImageStore();

    const [input, setInput] = useState("");
    console.log("input:", input);
    const debouncedInput = useDebounceValue(input, 500);
    console.log("debounced input:", debouncedInput);

    useEffect(() => {
        if (debouncedInput.trim() !== "") {
            searchText(debouncedInput);
        } else {
            getAllProducts(); // fallback to full list if search cleared
        }
    }, [debouncedInput, searchText, getAllProducts]);



  return (
    <div className="w-full max-w-4xl mx-auto text-center">
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-5 py-3 border-2 border-gray-300 rounded-2xl shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     text-gray-700 placeholder-gray-400 text-lg"
          placeholder="Search your imagination..."
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((item) => (
          <button
            key={item}
            className="bg-gray-800 hover:bg-gray-700 active:scale-95 active:bg-gray-600
                       text-white px-4 py-2 rounded-full text-sm font-medium shadow-md
                       transition transform duration-200 ease-in-out"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
