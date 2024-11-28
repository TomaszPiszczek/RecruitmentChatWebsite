import PropTypes from "prop-types";

const FileUpload = ({ onFileUpload, loading }) => {
  const handleChange = (event) => {
    const file = event.target.files[0];
    onFileUpload(file);
  };

  return (
    <div className="file-upload-container">
      <label htmlFor="file-upload" className={`custom-file-label ${loading ? "disabled" : ""}`}>
        {loading ? "Uploading..." : "Choose file"}
      </label>
      <input
        type="file"
        id="file-upload"
        accept="video/*"
        onChange={handleChange}
        className="video-input"
        disabled={loading}
        hidden
      />
    </div>
  );
};

FileUpload.propTypes = {
  onFileUpload: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default FileUpload;
