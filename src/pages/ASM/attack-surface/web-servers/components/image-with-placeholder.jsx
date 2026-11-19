import { useState, useEffect } from 'react';
import appConfig from "@/config/appConfig";

// Assume you have a placeholder image in your public folder
const PLACEHOLDER_IMAGE = '/path/to/your/not-found-placeholder.png';

function ImageWithPlaceholder({ value, setImageModalOpen }) {

    const initialSrc = `${appConfig.BASE_URL}/util/screenshot?url=${value}`;
    const [imageSrc, setImageSrc] = useState(initialSrc);
    const [hasError, setHasError] = useState(false);

    // Reset the image source if the 'value' prop changes
    useEffect(() => {
        setImageSrc(initialSrc);
        setHasError(false); // Reset error state on new image
    }, [value, initialSrc]);

    const handleError = () => {
        if (!hasError) {
            setImageSrc(PLACEHOLDER_IMAGE);
            setHasError(true);
        }
    };

    if (hasError) {
        return (
            <div className="text-[11px] select-none">
                Not Found
            </div>
        )
    }

    return (
        <img
            src={imageSrc}
            className="cursor-pointer w-[200px] h-full"
            alt={hasError ? "Image not found" : "Website screenshot"}
            onClick={() => !hasError && setImageModalOpen(true)}
            onError={handleError}
        />
    );
}

export default ImageWithPlaceholder;