export function HeroBanner() {
  return (
    <section className="relative w-full rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.15)] h-[250px] sm:h-[350px] md:h-[450px] lg:h-[600px] bg-[#09080c] flex items-center justify-center">
      
      {/* Viewfinder Corners */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-8 h-8 border-t-2 border-l-2 border-[#ffea00]/80 rounded-tl-xl pointer-events-none z-10"></div>
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 border-t-2 border-r-2 border-[#ffea00]/80 rounded-tr-xl pointer-events-none z-10"></div>
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-8 h-8 border-b-2 border-l-2 border-[#ffea00]/80 rounded-bl-xl pointer-events-none z-10"></div>
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-8 h-8 border-b-2 border-r-2 border-[#ffea00]/80 rounded-br-xl pointer-events-none z-10"></div>

      <video
        src="/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
      />
    </section>
  );
}
