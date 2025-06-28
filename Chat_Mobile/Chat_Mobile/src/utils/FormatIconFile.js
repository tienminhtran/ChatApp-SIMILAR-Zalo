export const getFileIcon = (fileName) => {
    const extension = fileName?.split(".").pop()?.toLowerCase();
    let icon, color;
    switch (extension) {
      case "pdf":
        icon = "file-pdf";
        color = "red";
        break;

      case "doc":
      case "docx":
        icon = "file-word";
        color = "blue";
        break;

      case "xls":
      case "xlsx":
        icon = "file-excel";
        color = "green";
        break;

      case "ppt":
      case "pptx":
        icon = "file-powerpoint";
        color = "orange";
        break;

      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        icon = "file-image";
        color = "pink";
        break;

      case "zip":
      case "rar":
      case "tar":
      case "7z":
        icon = "file-archive";
        color = "purple"; 
        break;

      case "txt":
        icon = "file-alt";
        color = "gray";
        break;

      case "mp3":
      case "wav":
      case "ogg":
        icon = "file-audio"; // Icon cho file âm thanh
        break;

      case "mp4":
      case "mov":
      case "avi":
        icon = "file-video"; // Icon cho file video
        break;

      case "js":
      case "jsx":
      case "ts":
      case "tsx":
      case "html":
      case "css":
      case "java":
      case "py":
      case "php":
      case "c":
      case "cpp":
      case "cs":
      case "go":
      case "swift":
      case "rb":
        icon = "file-code"; 
        color = "blue"; 
        break;

      case "json":
        icon = "file-code"; // Icon cho file JSON
        color = "orange"; 
        break;
      case "csv":
        icon = "file-csv";
        color = "green";
        break;

      default:
        icon = "file";
    }
    return { icon, color };
  };