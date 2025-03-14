import * as React from "react";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
}

export function Avatar({
  className,
  src,
  alt = "",
  fallback,
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className || ''}`}
      {...props}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={handleError}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
          {fallback ? (
            <span className="text-sm font-medium">{fallback}</span>
          ) : (
            <span className="text-sm font-medium">
              {alt.split(" ").map(word => word[0]).join("").toUpperCase().substring(0, 2)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export const AvatarImage = ({ src, alt = "", className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img
    src={src}
    alt={alt}
    className={`aspect-square h-full w-full ${className || ''}`}
    {...props}
  />
);

export const AvatarFallback = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className || ''}`}
    {...props}
  >
    {children}
  </div>
);
