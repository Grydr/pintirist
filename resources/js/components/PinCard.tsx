type PinCardProps = {
  src: string;
  alt?: string;
  href?: string | null;
  rounded?: string;
};

export default function PinCard({
  src,
  alt = 'Pin',
  href = null,
  rounded = 'rounded-xl',
}: PinCardProps) {
  const img = (
    <img
      className={`w-full ${rounded} aspect-auto break-inside-avoid border-2 shadow`}
      src={src}
      alt={alt}
      loading="lazy"
      onError={(e) => {
        console.error('Failed to load image:', src);
        e.currentTarget.style.display = 'none';
      }}
    />
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="break-inside-avoid">
        {img}
      </a>
    );
  }

  return <div className="break-inside-avoid">{img}</div>;
}
