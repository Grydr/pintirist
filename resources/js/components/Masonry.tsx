import { PropsWithChildren } from 'react';
import clsx from 'clsx';

type MasonryProps = PropsWithChildren<{
  className?: string;
  columns?: string;
  gap?: string;
  ySpace?: string;
  padding?: string;
}>;

export default function Masonry({
  children,
  className,
  columns = 'columns-2 md:columns-3 lg:columns-4',
  gap = 'gap-4',
  ySpace = 'space-y-4',
  padding = 'p-4',
}: MasonryProps) {
  return (
    <div className={clsx(columns, gap, ySpace, padding, className)}>
      {children}
    </div>
  );
}
