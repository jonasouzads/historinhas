import Image from 'next/image';

export const Decorations = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Clouds */}
      <div className="absolute top-10 left-10 animate-float-slow">
        <Image src="/images/cloud1.svg" alt="Cloud" width={100} height={60} />
      </div>
      <div className="absolute top-20 right-20 animate-float-slower">
        <Image src="/images/cloud2.svg" alt="Cloud" width={80} height={48} />
      </div>
      <div className="absolute bottom-20 left-1/4 animate-float">
        <Image src="/images/cloud1.svg" alt="Cloud" width={100} height={60} />
      </div>
      
      {/* Stars */}
      <div className="absolute top-1/4 right-1/3 animate-twinkle">
        <Image src="/images/star1.svg" alt="Star" width={40} height={40} />
      </div>
      <div className="absolute top-1/3 left-1/4 animate-twinkle-slow">
        <Image src="/images/star2.svg" alt="Star" width={30} height={30} />
      </div>
      <div className="absolute bottom-1/4 right-1/4 animate-twinkle-slower">
        <Image src="/images/star1.svg" alt="Star" width={40} height={40} />
      </div>
    </div>
  );
};
