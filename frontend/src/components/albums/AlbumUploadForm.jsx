// function AlbumUploadForm({
//   selectedFile,
//   uploading,
//   uploadError,
//   onFileChange,
//   onSubmit,
//   onCancel,
// }) {
//   return (
//     <div className="card border-0 shadow-sm mb-4">
//       <div className="card-body p-4">
//         <h2 className="h5 fw-bold mb-1">
//           Upload Image
//         </h2>

//         <p className="text-secondary small mb-4">
//           Add an image to this album.
//         </p>

//         {uploadError && (
//           <div
//             className="alert alert-danger"
//             role="alert"
//           >
//             {uploadError}
//           </div>
//         )}

//         <form onSubmit={onSubmit}>
//           <div className="mb-3">
//             <label
//               htmlFor="imageFile"
//               className="form-label fw-semibold"
//             >
//               Select Image
//             </label>

//             <input
//               id="imageFile"
//               type="file"
//               className="form-control"
//               accept="image/jpeg,image/png,image/webp"
//               onChange={onFileChange}
//               disabled={uploading}
//             />

//             <div className="form-text">
//               Supported formats: JPEG, PNG, WebP.
//               Maximum size: 5 MB.
//             </div>
//           </div>

//           {selectedFile && (
//             <div className="alert alert-light border">
//               <div className="fw-semibold">
//                 Selected file
//               </div>

//               <div className="small text-secondary">
//                 {selectedFile.name}
//               </div>

//               <div className="small text-secondary">
//                 {(
//                   selectedFile.size /
//                   1024 /
//                   1024
//                 ).toFixed(2)}{" "}
//                 MB
//               </div>
//             </div>
//           )}

//           <div className="d-flex gap-2">
//             <button
//               type="submit"
//               className="btn btn-primary"
//               disabled={
//                 uploading || !selectedFile
//               }
//             >
//               {uploading ? (
//                 <>
//                   <span
//                     className="spinner-border spinner-border-sm me-2"
//                     role="status"
//                     aria-hidden="true"
//                   />

//                   Uploading...
//                 </>
//               ) : (
//                 "Upload Image"
//               )}
//             </button>

//             <button
//               type="button"
//               className="btn btn-outline-secondary"
//               disabled={uploading}
//               onClick={onCancel}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AlbumUploadForm;

// -----------------------------------------------------------------------------------
function AlbumUploadForm({
  selectedFile,
  person,
  tags,
  uploading,
  uploadError,
  onFileChange,
  onPersonChange,
  onTagsChange,
  onSubmit,
  onCancel,
}) {
  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body p-3 p-md-4">
        <h2 className="h5 fw-bold mb-1">
          Upload Image
        </h2>

        <p className="text-secondary small mb-4">
          Add an image and optional details to this album.
        </p>

        {uploadError && (
          <div
            className="alert alert-danger"
            role="alert"
          >
            {uploadError}
          </div>
        )}

        <form onSubmit={onSubmit}>
          {/* Image */}
          <div className="mb-3">
            <label
              htmlFor="imageFile"
              className="form-label fw-semibold"
            >
              Select Image
            </label>

            <input
              id="imageFile"
              type="file"
              className="form-control"
              accept="image/jpeg,image/png,image/webp"
              onChange={onFileChange}
              disabled={uploading}
            />

            <div className="form-text">
              Supported formats: JPEG, PNG, WebP.
              Maximum size: 5 MB.
            </div>
          </div>

          {/* Person + Tags */}
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <label
                htmlFor="person"
                className="form-label fw-semibold"
              >
                Person
              </label>

              <input
                id="person"
                type="text"
                className="form-control"
                placeholder="e.g. Sunny Raj"
                value={person}
                onChange={onPersonChange}
                disabled={uploading}
              />

              <div className="form-text">
                Optional person name associated with this image.
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label
                htmlFor="tags"
                className="form-label fw-semibold"
              >
                Tags
              </label>

              <input
                id="tags"
                type="text"
                className="form-control"
                placeholder="e.g. family, trip, beach"
                value={tags}
                onChange={onTagsChange}
                disabled={uploading}
              />

              <div className="form-text">
                Separate multiple tags with commas.
              </div>
            </div>
          </div>

          {/* Selected File */}
          {selectedFile && (
            <div className="alert alert-light border mb-3">
              <div className="fw-semibold mb-1">
                Selected file
              </div>

              <div className="small text-secondary text-break">
                {selectedFile.name}
              </div>

              <div className="small text-secondary">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="d-flex flex-column flex-sm-row gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploading || !selectedFile}
            >
              {uploading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />

                  Uploading...
                </>
              ) : (
                "Upload Image"
              )}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              disabled={uploading}
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AlbumUploadForm;