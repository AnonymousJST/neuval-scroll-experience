import { ScrollPathAnimation } from './components/ScrollPathAnimation';
import { ScrollStory } from './components/ScrollStory';

function App() {
  return (
    // REMOVED 'overflow-x-hidden' which breaks position: sticky
    <div className="w-full min-h-screen bg-black relative">
      <ScrollPathAnimation />
      
      {/* Content Layer - Removed z-10 to allow mix-blend-difference to see background */}
      <div className="relative pointer-events-none">
        {/* Intro Section */}
        <div className="h-screen w-full flex flex-col items-center justify-center text-white mix-blend-difference pointer-events-none">
            <h1 className="text-8xl font-serif tracking-tighter opacity-90">SCROLL</h1>
            <p className="text-xs tracking-[0.8em] mt-6 text-gray-400 uppercase">to begin the journey</p>
        </div>

        {/* Feature Section */}
        <ScrollStory />
        
        {/* Footer/Outro Section removed - moved into ScrollStory */}
     </div>
    </div>
  );
}

export default App;
