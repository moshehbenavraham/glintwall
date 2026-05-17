import { GalleryImage as GalleryImageType } from '@/types/gallery';
import { useState, useRef, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

interface GalleryImageProps {
  image: GalleryImageType;
  isActive: boolean;
  onClick: () => void;
  priority?: boolean; // For eager loading of critical images
}

export function GalleryImage({ image, isActive, onClick, priority = false }: GalleryImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    if (priority) return; // Skip observer for priority images

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div
      ref={imgRef}
      className="relative flex-shrink-0 h-full cursor-pointer scroll-snap-center"
      onClick={onClick}
    >
      {/* Loading Skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
          <ImageOff className="w-12 h-12 mb-2" />
          <p className="text-sm">Failed to load image</p>
        </div>
      )}

      {/* Actual Image */}
      {isVisible && !hasError && (
        <img
          src={image.src}
          sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
          alt={image.alt}
          className={`h-full w-auto object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          onError={handleError}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
        />
      )}
      
      {/* Caption Overlay - Only visible when active */}
      {isLoaded && !hasError && (
        <div
          className={`absolute bottom-0 left-0 p-6 transition-opacity duration-300 max-w-[360px] ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
          }}
        >
          <div className="flex flex-col justify-end">
            <p className="font-semibold text-white text-[0.9375rem] leading-5">
              {image.caption.subject}
            </p>
            <p className="font-normal text-white text-[0.9375rem] leading-5 opacity-90">
              {image.caption.profession}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
