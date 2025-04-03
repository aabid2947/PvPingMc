import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { Button } from "../ui/Button";
import { ArrowLeft } from "lucide-react"
import step1 from "../assets/step1.webp";
import step2 from "../assets/step2.webp";
import step3 from "../assets/step3.webp";
import step4 from "../assets/step4.webp";   
import step5 from "../assets/step5.webp"; 
import step6 from "../assets/step6.webp";
import java from "../assets/java.webp";
import bedrock from "../assets/bedrock.webp";

export default function PlayerGuide({ isOpen, onClose }) {
  const [selectedEdition, setSelectedEdition] = useState(null);
  const steps = [
    {
      title: "STEP 1",
      image:step1,
      description: "DOWNLOAD MINECRAFT: JAVA EDITION AND RUN IT.",
      details:
        "If you have the launcher downloaded but you're unable to play, you may need to download the latest version of Java.",
      action: "DOWNLOAD MINECRAFT",
    },
    {
      title: "STEP 2",
      image:step2,
      description: 'SELECT "LATEST RELEASE" AND PRESS THE PLAY BUTTON.',
      details:
        "For a complete experience, you must play on the latest version, Minecraft 1.18.1. Old versions of Minecraft are insecure and are not officially supported.",
    },
    {
      title: "STEP 3",
      image:step3,
      description: 'SELECT "MULTIPLAYER" FROM THE TITLE SCREEN.',
      details: "There's a lot of options, but don't worry. We'll guide you through adding our server!",
    },
    {
      title: "STEP 4",
      image:step4,
      description: 'PRESS THE "ADD SERVER" BUTTON.',
      details: "For quick access, we'll be adding a bookmark so you can always see our server.",
    },
    {
      title: "STEP 5",
      image:step5,
      description: "ADD IN THE INFORMATION YOU SEE IN THE SCREENSHOT.",
      details:
        'Our server name is "OPLegends" and our IP address is "play.oplegends.com". Make sure to set "Server Resource Packs" to "Enabled". Then press "Done"!',
    },
    {
      title: "STEP 6",
      image:step6,
      description: "SELECT OPLEGENDS, PRESS JOIN, AND WE WILL SEE YOU INGAME!",
      details: "Are you ready for an incredible Minecraft experience? We can't wait to welcome you to our community!",
    },
  ];
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSelect = (edition) => {
    setSelectedEdition(edition);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-transparent bg-opacity-80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-[#13141d] rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <FiX size={24} />
        </button>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              How to Play PvPingMC
            </h1>
            <div className="h-1 w-16 bg-blue-500 mx-auto"></div>
          </div>

          {/* Edition Selection */}
          {!selectedEdition && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Java Edition */}
             <div
               className={`bg-gradient-to-b from-[#45A5FE14] to-[#20212D36] rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:transform hover:scale-105 ${selectedEdition === "java" ? "ring-2 ring-blue-500" : ""
                 }`}
               onClick={() => handleSelect("java")}
             >
               <div className="pb-2 text-center">
                 <img src={java} className="mb-2" alt="" />
                 <h2 className="text-2xl font-bold text-white mb-3">Java Edition</h2>
                 <p className="text-gray-400">
                   I play Minecraft on my personal computer: macOS, Linux, or Windows.
                 </p>
               </div>
             </div>
 
             {/* Bedrock Edition */}
             <div
               className={`bg-gradient-to-b from-[#45A5FE14] to-[#20212D36] rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:transform hover:scale-105 ${selectedEdition === "bedrock" ? "ring-2 ring-blue-500" : ""
                 }`}
               onClick={() => handleSelect("bedrock")}
             >
               <div className="pb-2 text-center">
                 <img src={bedrock} alt="" />
                 <h2 className="text-2xl font-bold text-white mb-3">Bedrock Edition</h2>
                 <p className="text-gray-400">
                   I play Minecraft on my phone, tablet, console, or on PC from the Microsoft Store.
                 </p>
               </div>
             </div>
           </div>
          )}
         

          {/* Connection Instructions */}
          {selectedEdition && (
            <div className="mt-8 p-6 bg-[#1D1E29AB] rounded-lg">
              <h3 className="text-xl font-bold text-white mb-4">Connection Instructions</h3>
              {selectedEdition === "java" ? (
               <div className=" pr-2 ">
               {/* Header with back button - sticky at top */}
               <div className=" top-0 z-10 bg-[#1A1B26] pt-2 pb-4 mb-6">
                 <div className="flex items-center">
                   <Button variant="ghost" className="text-gray-400 hover:text-white mr-4" onClick={()=>setSelectedEdition(null)}>
                     <ArrowLeft size={20} className="mr-2" />
                     Back
                   </Button>
                   <div>
                     <h1 className="text-3xl md:text-4xl font-bold text-white">How to Join on Java</h1>
                     <div className="h-1 w-16 bg-blue-500 mt-2"></div>
                   </div>
                 </div>
               </div>
       
               {/* Steps */}
               <div className="space-y-6 pb-6">
                 {steps.map((step, index) => (
                   <div
                     key={index}
                     className="bg-[#1D1E29AB] rounded-lg  shadow-lg hover:shadow-xl transition-shadow"
                     style={{
                       backgroundColor: `rgba(29, 30, 41, ${0.85 + index * 0.02})`,
                     }}
                   >
                     <div className="flex flex-col justify-center text-center  items-center gap-4">
                      <img src={step.image} alt="" />
                       <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                         {index + 1}
                       </div>
                       <div className="flex-1  p-4">
                         <h3 className="text-lg font-bold  mb-1 text-center ">{step.title}</h3>
                         <h2 className="text-xl font-bold text-white mb-2 text-center ">{step.description}</h2>
                         <p className="text-gray-300 text-center ">{step.details}</p>
                         {step.action && (
                           <button className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 cursor-pointer text-white font-bold py-2 px-6 rounded-lg transition-colors mx-auto md:mx-0 block md:inline-block" 
                           onClick={() => window.open("https://www.minecraft.net/en-us/download", "_blank")}>
                             {step.action}
                           </button>
                         )}
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
              ) : (
                <div className=" top-0 z-10 bg-[#1A1B26] pt-2 pb-4 mb-6">
                 <div className="flex items-center">
                   <Button variant="ghost" className="text-gray-400 hover:text-white mr-4" onClick={()=>setSelectedEdition(null)}>
                     <ArrowLeft size={20} className="mr-2" />
                     Back
                   </Button>
                   <div>
                     <h1 className="text-3xl md:text-4xl font-bold text-white">How to Join on Bedrock</h1>
                     <div className="h-1 w-16 bg-blue-500 mt-2"></div>
                   </div>
                 </div>

                 <div className="space-y-6 p-6 flex flex-col justify-center items-center">
                 <button
                    className="w-64 h-10 inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium py-1.5 px-10 rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 uppercase tracking-wide shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)"
                    }}
                  >
                    Add Server to List
                  </button>
                  <h3>Not Working? Click here for manual setup</h3>
               </div>

               </div>
                
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
