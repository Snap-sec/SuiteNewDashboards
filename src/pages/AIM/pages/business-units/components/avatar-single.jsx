import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';

const AvatarSingle = ({
  image,
  fallback = '/media/avatars/default-image2.png',
  icon: Icon,
  iconClass,
  badgeClass,
  className,
  imageClass,
}) => {
  return (
    <div className={cn(className && className)}>
      {image && (
        <img
          // src={toAbsoluteUrl(`/media/avatars/${image}`)}
          src={image || fallback}
          className={cn(imageClass && imageClass)}
          alt="image"
          onError={(e) => {
            e.target.onerror = null; // prevents infinite loop
            e.target.src = fallback;
          }}
        />
      )}
    </div>
  );
};

export { AvatarSingle };
