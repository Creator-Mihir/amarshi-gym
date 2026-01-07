import Navbar from '../../components/common/Navbar';
import { useState } from 'react';

const Gallery = () => {
  // Placeholder Images (Replace these with your real uploads later)
  const images = [
    { id: 1, src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop", category: "Vibe" },
    { id: 2, src: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop", category: "Weights" },
    { id: 3, src: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop", category: "Cardio" },
    { id: 4, src: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1475&auto=format&fit=crop", category: "Vibe" },
    { id: 5, src: "https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1470&auto=format&fit=crop", category: "Weights" },
    { id: 6, src: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=1469&auto=format&fit=crop", category: "Training" },
    { id: 7, src: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1470&auto=format&fit=crop", category: "Community" },
    { id: 8, src: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1470&auto=format&fit=crop", category: "Vibe" },
  ];

  // Simple Lightbox State (Optional: Click to view full)
  const [selectedImg, setSelectedImg] = useState(null);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#ccff00] selection:text-black">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* HEADER */}
        <div className="text-center mb-16 p-4 space-y-4">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter">
            FITNESS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-[#00f0ff]">GALLERY</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto font-mono text-sm md:text-base">
            WITNESS THE GRIND. EXPERIENCE THE VIBE. THIS IS WHERE CHAMPIONS ARE FORGED.
          </p>
        </div>

        {/* IMAGE GRID (Masonry Style Layout) */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((img) => (
            <div 
              key={img.id} 
              className="relative group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 cursor-pointer break-inside-avoid"
              onClick={() => setSelectedImg(img.src)}
            >
              {/* Image */}
              <img 
                src={img.src} 
                alt="Gym Gallery" 
                className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-[#ccff00] font-black italic text-xl uppercase tracking-widest border-b-2 border-[#ccff00]">
                  {img.category}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* LIGHTBOX MODAL (Full Screen View) */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setSelectedImg(null)}
        >
          <img 
            src={selectedImg} 
            alt="Full Screen" 
            className="max-w-full max-h-[90vh] rounded-lg shadow-[0_0_50px_rgba(204,255,0,0.2)]"
          />
          <button className="absolute top-8 right-8 text-white text-4xl hover:text-[#ccff00]">
            &times;
          </button>
        </div>
      )}

    </div>
  );
};

export default Gallery;