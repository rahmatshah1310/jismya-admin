import { toast } from "react-toastify";

const dimensionRules = {
  laptop: { width: 1280, height: 720 },
  tablet: { width: 900, height: 300 },
  mobile: { width: 500, height: 200 },
};

export const validateImageDimensions = (file, deviceType, onValid, onInvalid) => {
  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    const { width, height } = img;
    const { width: reqWidth, height: reqHeight } = dimensionRules[deviceType];

    if (width !== reqWidth || height !== reqHeight) {
      toast.error(`Invalid dimensions for ${deviceType}: ${reqWidth}x${reqHeight}px. Your image is ${width}x${height}px.`);
      onInvalid();
    } else {
      onValid();
    }
  };
};
