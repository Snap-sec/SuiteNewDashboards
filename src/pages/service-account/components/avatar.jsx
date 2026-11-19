import { getInitials } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const isValidImage = (src) => src && src !== 'undefined' && src !== 'null' && src.trim() !== '';

const AvatarSingle = ({
    image,
    name,
    className,
    imageClass,
}) => {
    const [imgError, setImgError] = useState(false);

    const showInitials = !isValidImage(image) || imgError;

    return (
        <div className={cn('flex items-center justify-center overflow-hidden rounded-full', className)}>
            {showInitials ? (
                <div className={cn("flex h-15 w-15 items-center justify-center bg-primary/10 text-primary font-bold uppercase", imageClass)}>
                    {getInitials(name, 2)}
                </div>
            ) : (
                <img
                    src={image}
                    className={cn('h-15 w-15 object-cover', imageClass)}
                    alt={name || "avatar"}
                    onError={() => setImgError(true)}
                />
            )}
        </div>
    );
};

export { AvatarSingle };
