import { FilmstripGalleryProps } from '@/types/gallery';
import { HoverExpand_001, type ExpandImage } from '@/components/ui/expand-on-hover';
import { cn } from '@/lib/utils';

export function FilmstripGallery({ images, className = '' }: FilmstripGalleryProps) {
  // Pass the human-readable subject / profession through so the gallery can
  // surface them on hover and to assistive tech, instead of the previous
  // "Title - Year" code string (which already starts with the subject and
  // ends up duplicated).
  const transformedImages: ExpandImage[] = images.map((image) => ({
    src: image.src,
    alt: image.alt,
    code: `${image.metadata.title} — ${image.metadata.year}`,
    caption: image.caption
      ? {
          subject: image.caption.subject,
          profession: image.caption.profession,
        }
      : undefined,
  }));

  if (images.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center h-[50vh]',
          className,
        )}
      >
        <p className="text-muted-foreground">No images to display</p>
      </div>
    );
  }

  return <HoverExpand_001 images={transformedImages} className={className} />;
}
