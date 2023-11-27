const ImageComponent = ({
  imageData,
  extension,
}: {
  imageData: string;
  extension: string;
}) => {
  if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) {
    return (
      <div>
        <img src={imageData} alt="Uploaded image" className="post-image" />
      </div>
    );
  }

  if (extension === "txt") {
    return (
      <div>
        <a
          href={imageData}
          target="_blank"
          rel="noreferrer"
          className="post-text-file"
        >
          <pre className="post-text-file-content">Download text file</pre>
        </a>
      </div>
    );
  }

  return null;
};

export default ImageComponent;
