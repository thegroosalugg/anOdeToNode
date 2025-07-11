import { useEffect, useRef, useState } from "react";
import { BASE_URL } from "@/lib/util/fetchData";
import css from "./ImagePicker.module.css";

const fileTypes = ["image/png", "image/jpeg", "image/jpg"];

export default function ImagePicker({
  imgURL,
   label = "Image (Optional)",
}: {
  imgURL?: string;
   label?: string;
}) {
  const initialImg = imgURL ? BASE_URL + imgURL : "";
  const [image, setImage] = useState(initialImg);
  const [error, setError] = useState("");
  const imagePicker = useRef<HTMLInputElement>(null);
  const file = imagePicker.current?.files?.[0];
  const       color = error ? "var(--error)" : "";
  const borderColor = color;

  useEffect(() => {
    if (!file) setImage(initialImg);
  }, [initialImg, file])

  const changeHandler = () => {
    const file = imagePicker.current?.files?.[0];
    if (file) {
      if (fileTypes.includes(file.type)) {
        setImage(URL.createObjectURL(file));
        setError("");
      } else {
        setImage("");
        setError("Invalid file type");
      }
    } else {
      setImage("");
      setError("");
    }
  };

  return (
    <label
      className={`${css["picker"]} floating-box`}
        htmlFor="image"
          style={{ borderColor }}
    >
      <input
             ref={imagePicker}
        onChange={changeHandler}
          accept={fileTypes.join(', ')}
           type="file"
             id="image"
           name="image"
      />
      {image ? (
        <img src={image} alt="preview" onError={() => setImage("")} />
      ) : (
        <span style={{ color }}>{error ? error : label}</span>
      )}
    </label>
  );
}
