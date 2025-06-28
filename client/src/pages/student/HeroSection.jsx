import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-500 to-green-400 dark:from-gray-900 dark:via-blue-900 dark:to-cyan-900 py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 animate-float [animation-duration:8s] bg-cyan-400/20 dark:bg-cyan-600/20 rounded-full w-96 h-96 blur-3xl"
        style={{ top: '-10%', left: '5%' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 animate-float [animation-duration:12s] [animation-delay:2s] bg-green-400/20 dark:bg-green-600/20 rounded-full w-96 h-96 blur-3xl"
        style={{ top: '20%', left: '60%' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 animate-float [animation-duration:10s] [animation-delay:1s] bg-blue-400/20 dark:bg-blue-600/20 rounded-full w-80 h-80 blur-3xl"
        style={{ bottom: '5%', left: '30%' }}
      />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 animate-fade-in-up bg-gradient-to-r from-white to-gray-300 dark:to-gray-400 bg-clip-text text-transparent bg-300% animate-animated-gradient-text">
          Master New Skills. Shape Your Future.
        </h1>
        <p className="text-blue-100 dark:text-blue-200 text-lg sm:text-xl max-w-3xl mx-auto mb-10 animate-fade-in-up [animation-delay:0.2s]">
          From coding to creative arts, find your passion. Our platform is your gateway to knowledge and personal growth.
        </p>
        
        <form
          onSubmit={searchHandler}
          className="relative max-w-xl mx-auto mb-8 animate-fade-in-up [animation-delay:0.4s]"
        >
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you want to learn today?"
              className="w-full pl-12 pr-4 py-3 h-14 text-lg bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm border-transparent focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 rounded-full shadow-lg transition-all"
            />
          </div>
        </form>

        <div className="animate-fade-in-up [animation-delay:0.6s]">
            <Button 
              onClick={() => navigate('/course/search?query=')}
              size="lg"
              className="bg-white text-blue-600 rounded-full hover:bg-gray-100 dark:bg-gray-100 dark:text-blue-700 dark:hover:bg-gray-200 transition-transform duration-300 hover:scale-105 shadow-md"
            >
              Explore Courses
            </Button>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
