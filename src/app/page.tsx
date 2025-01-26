'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from "framer-motion";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [comicPanels, setComicPanels] = useState<Array<{
    prompt: string;
    caption: string;
    imageUrl?: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateStory = async () => {
    try {
      setIsLoading(true);
      setComicPanels([]);
      setError(null);  // Reset error state
      
      const storyResponse = await fetch('/api/generate/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      const storyData = await storyResponse.json();
      if (!storyData.result?.comics || storyData.result.comics.length === 0) {
        setError("Sorry, I couldn't generate a story for this prompt. Please try a different prompt that's more appropriate for a family-friendly dog adventure!");
        setIsLoading(false);
        return;
      }
      
      setComicPanels(storyData.result.comics);
      // Start generating images for each panel
      generateNextImage(storyData.result.comics, 0);
    } catch (error) {
      console.error('Error:', error);
      setError("An error occurred while generating the story. Please try again.");
      setIsLoading(false);
    }
  };
  const generateNextImage = async (panels: typeof comicPanels, index: number) => {
    if (index >= panels.length) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/generate/image-gen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: panels[index].prompt }),
      });
      
      const data = await response.json();
      if (data.imageUrl) {
        setComicPanels(prev => prev.map((panel, i) => 
          i === index ? { ...panel, imageUrl: data.imageUrl } : panel
        ));
        // Generate next panel's image
        generateNextImage(panels, index + 1);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4 sm:p-8 
      [background-size:_400%_400%] animate-gradient">
      {/* Comic Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-12 pt-8"
      >
        <h1 className="text-5xl sm:text-7xl font-bold text-white 
          tracking-wider transform rotate-[-2deg]
          [text-shadow:4px_4px_0_#FF1493,8px_8px_0_#4B0082] 
          hover:scale-105 hover:rotate-2 transition-all duration-300
          font-comic">
          Vishruth's Goofy Adventures
        </h1>
        <p className="text-2xl mt-4 text-yellow-200 font-medium tracking-wide 
          rotate-2 hover:rotate-[-2deg] transition-all duration-300
          [text-shadow:2px_2px_0_#FF69B4]">
          Screw Vishruth Up!! 🎨✨
        </p>
      </motion.header>

      <main className="max-w-7xl mx-auto">
        {/* Input Section */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-sm rounded-[2rem] 
            shadow-[0_0_25px_rgba(255,105,180,0.5)] 
            p-8 mb-12 max-w-2xl mx-auto border-4 border-dashed border-yellow-300/50
            transform rotate-1 hover:rotate-[-1deg] transition-all duration-300"
        >
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a silly prompt (e.g. 'dancing with penguins')"
            maxLength={50}
            className="w-full px-4 py-3 border-4 border-pink-400/50 rounded-xl 
              bg-white/20 text-white placeholder-pink-200
              focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/30 
              transition-all min-h-[100px] text-lg"
          />
          <motion.button 
            onClick={generateStory}
            disabled={isLoading}
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-500 
              text-white rounded-xl font-bold text-xl
              hover:from-purple-500 hover:to-pink-500 
              transition-all disabled:from-gray-600 disabled:to-gray-400 
              disabled:text-gray-300 shadow-lg border-4 border-white/30
              hover:shadow-[0_0_20px_rgba(255,105,180,0.6)]"
          >
            {isLoading ? '�� Creating Magic...' : '✨ Generate Silly Comic! 🎨'}
          </motion.button>
          
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border-4 border-red-500/50 
              rounded-xl text-red-200 backdrop-blur-sm rotate-[-1deg]">
              {error}
            </div>
          )}
        </motion.div>

        {/* Comics Grid */}
        {comicPanels.length > 0 && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-[2rem] 
              shadow-[0_0_25px_rgba(255,105,180,0.5)] 
              p-8 border-4 border-dashed border-yellow-300/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {comicPanels.map((panel, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, opacity: 0, rotate: 10 }}
                  animate={{ scale: 1, opacity: 1, rotate: index % 2 === 0 ? -2 : 2 }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.2
                  }}
                  className="comic-panel group"
                >
                  <div className="relative aspect-square bg-gradient-to-br from-pink-400/30 to-purple-400/30 
                    rounded-2xl overflow-hidden border-8 border-white/20 
                    shadow-[0_0_15px_rgba(0,0,0,0.3)] 
                    group-hover:shadow-[0_0_30px_rgba(255,105,180,0.5)] 
                    group-hover:scale-105 group-hover:rotate-[-2deg]
                    transition-all duration-300">
                    {!panel.imageUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-16 w-16 
                          border-8 border-pink-400 border-t-transparent">
                        </div>
                      </div>
                    )}
                    {panel.imageUrl && (
                      <Image
                        src={panel.imageUrl}
                        alt={`Panel ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  {panel.imageUrl && (
                    <div className="mt-4 p-4 bg-white/20 backdrop-blur-sm rounded-xl 
                      border-4 border-pink-400/50 font-medium text-white text-lg
                      transform rotate-[-1deg] group-hover:rotate-1 
                      group-hover:scale-105 transition-all duration-300
                      [text-shadow:1px_1px_0_#FF1493]">
                      {panel.caption}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}