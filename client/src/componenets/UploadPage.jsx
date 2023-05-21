import { useState, useRef } from "react";
import "../App.css";

import {
  FileUploadContainer,
  FormField,
  DragDropText,
  UploadFileBtn,
  FilePreviewContainer,
  ImagePreview,
  PreviewContainer,
  PreviewList,
  FileMetaData,
  RemoveFileIcon,
  InputLabel,
} from "./upload.styles";

const KILO_BYTES_PER_BYTE = 1000;
const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 500000;

const convertNestedObjectToArray = (nestedObj) =>
  Object.keys(nestedObj).map((key) => nestedObj[key]);

const convertBytesToKB = (bytes) => Math.round(bytes / KILO_BYTES_PER_BYTE);

const UploadPage = ({
  maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES,
  ...otherProps
}) => {
  const fileInputField = useRef(null);
  const [files, setFiles] = useState({});
  const [newDocs, setNewDOcs] = useState([]);

  const updateUploadedFiles = (files) => {
    setNewDOcs([...newDocs, ...files]);
  };

  const handleUploadBtnClick = () => {
    fileInputField.current.click();
  };

  const addNewFiles = (newFiles) => {
    for (let file of newFiles) {
      if (file.size <= maxFileSizeInBytes) {
        if (!otherProps.multiple) {
          return { file };
        }
        files[file.name] = file;
      }
    }
    return { ...files };
  };

  const callUpdateFilesCb = (files) => {
    const filesAsArray = convertNestedObjectToArray(files);
    updateUploadedFiles(filesAsArray);
  };

  const handleNewFileUpload = (e) => {
    const { files: newFiles } = e.target;
    if (newFiles.length) {
      let updatedFiles = addNewFiles(newFiles);
      setFiles(updatedFiles);
      callUpdateFilesCb(updatedFiles);
    }
  };

  const removeFile = (fileName) => {
    delete files[fileName];
    setFiles({ ...files });
    callUpdateFilesCb({ ...files });
  };

  const handleDocumentSubmit = (event) => {
    event.preventDefault();

    console.log("DOCUMENT SUBMITTED", event);
  };

  return (
    <div className="min-w-full min-h-screen">
      <header className="sticky">
        <nav className="flex flex-row items-center justify-between m-7 font-bold">
          <h1 className="text-white text-shadow">Q-Genius</h1>
          <ul className="flex flex-row gap-4 text-[20px] text-white">
            <li>SEARCH</li>
            <li>UPLOAD</li>
            <li>ABOUT</li>
          </ul>
        </nav>
      </header>

      <div className="min-w-[276px] min-h-[536px] flex flex-col text-center">
        <h2 className="text-4xl font-bold text-white text-shadow">
          Add Documents
        </h2>
        <form onSubmit={handleDocumentSubmit}>
          <FileUploadContainer>
            <DragDropText>Drag and drop your files anywhere or</DragDropText>
            <UploadFileBtn type="button" onClick={handleUploadBtnClick}>
              <i className="fas fa-file-upload" />
              <span> Upload {otherProps.multiple ? "files" : "a file"}</span>
            </UploadFileBtn>
            <FormField
              type="file"
              ref={fileInputField}
              onChange={handleNewFileUpload}
              title=""
              value=""
              {...otherProps}
            />

            {/* <br /> */}

            <FilePreviewContainer>
              <span>To Upload</span>
              <PreviewList>
                {Object.keys(files).map((fileName, index) => {
                  let file = files[fileName];
                  let isImageFile = file.type.split("/")[0] === "image";
                  return (
                    <PreviewContainer key={fileName}>
                      <div>
                        {isImageFile && (
                          <ImagePreview
                            src={URL.createObjectURL(file)}
                            alt={`file preview ${index}`}
                          />
                        )}
                        <FileMetaData isImageFile={isImageFile}>
                          <span>{file.name}</span>
                          <aside>
                            <span>{convertBytesToKB(file.size)} kb</span>
                            <RemoveFileIcon
                              className="fas fa-trash-alt"
                              onClick={() => removeFile(fileName)}
                            />
                          </aside>
                        </FileMetaData>
                      </div>
                    </PreviewContainer>
                  );
                })}
              </PreviewList>
            </FilePreviewContainer>
            <div className="flex flex-row justify-end flex-1/2">
              <button
                className="bg-[#8294C4] w-[150px] h-[50px] text-white text-4xl"
                type="submit"
              >
                Next
              </button>
            </div>
          </FileUploadContainer>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
