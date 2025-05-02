/** @jsxImportSource https://esm.sh/react@18.2.0 */
import ReactHover, { Hover, Trigger } from "https://esm.sh/react-hover@3.0.1?deps=react@18.2.0,react-dom@18.2.0";
import React, { useEffect, useRef, useState } from "https://esm.sh/react@18.2.0";
import copy from "https://esm.sh/copy-to-clipboard@3.3.3";
import { ContentState } from "../../shared/utils.ts";

export function FileDumper() {
  const [content, setContent] = useState<ContentState>({ type: "text", value: "" });
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const pasteAreaRef = useRef<HTMLDivElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hover options for CLI example
  const hoverOptions = {
    followCursor: false,
    shiftX: 0,
    shiftY: 10,
  };

  useEffect(() => {
    pasteAreaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const copyUrlToClipboard = async (url: string) => {
    try {
      const success = copy(url, {
        format: "text/plain", // Use plain text format
        onCopy: () => {
          setToastMessage("Link automatically copied!");
        }
      });
      
      if (!success) {
        setToastMessage("Failed to copy link automatically");
      }
    } catch {
      setToastMessage("Failed to copy link automatically");
    }
  };

  const handleTextUpload = async (text: string) => {
    const formData = new FormData();
    formData.append("content", text);
    formData.append("type", "text");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        setUploadedUrl(url);
        setContent({ type: "text", value: text });

        // Automatically copy the URL after upload
        await copyUrlToClipboard(url);
      }
    } catch {
      setToastMessage("Upload failed");
    }
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", file.name);
    formData.append("type", "file");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        setUploadedUrl(url);

        // Create a local preview for the file
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setContent({ type: "image", value: reader.result as string });
          };
          reader.readAsDataURL(file);
        }

        // Automatically copy the URL after upload
        await copyUrlToClipboard(url);
      }
    } catch {
      setToastMessage("Upload failed");
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();

    // Check for image first
    const file = event.clipboardData?.items[0]?.getAsFile();
    if (file) {
      handleFileUpload(file);
      return;
    }

    // If no file, check for text
    const pastedText = event.clipboardData?.getData("text/plain");
    if (pastedText) {
      handleTextUpload(pastedText);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleUrlClick = () => {
    if (urlInputRef.current) {
      urlInputRef.current.select();
      const success = copy(uploadedUrl, {
        format: "text/plain",
        onCopy: () => {
          setToastMessage("Link copied!");
        }
      });
      
      if (!success) {
        setToastMessage("Copy failed");
      }
    }
  };

  const openFileChooser = () => {
    fileInputRef.current?.click();
  };

  const renderContent = () => {
    if (content.type === "image") {
      return <img src={content.value} alt="Pasted" style={{ maxWidth: "100%", maxHeight: "300px" }} />;
    }
    if (content.type === "text") {
      return (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            textAlign: "left",
            margin: 0,
            padding: "10px",
            backgroundColor: "#f4f4f4",
            borderRadius: "5px",
          }}
        >
          {content.value || "Paste or drag a file here"}
        </pre>
      );
    }
    return "Paste or drag a file here";
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1>File Dump Thing</h1>

      <div
        ref={pasteAreaRef}
        onPaste={handlePaste}
        onClick={openFileChooser}
        contentEditable
        tabIndex={0}
        style={{
          border: "2px dashed #ccc",
          minHeight: "150px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "10px",
          outline: "none",
          cursor: "pointer",
        }}
      >
        {renderContent()}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInput}
        style={{ display: "none" }}
      />

      <div
        style={{
          marginBottom: "10px",
          fontSize: "14px",
          color: "#666",
        }}
      >
        Click, paste, or drag files here
      </div>

      {uploadedUrl && (
        <div style={{ marginTop: "10px" }}>
          <p>Shareable Link:</p>
          <input
            ref={urlInputRef}
            type="text"
            readOnly
            value={uploadedUrl}
            style={{ width: "100%" }}
            onClick={handleUrlClick}
          />
        </div>
      )}

      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          {toastMessage}
        </div>
      )}

      <div
        style={{
          marginTop: "30px",
          width: "100%",
          textAlign: "center",
          fontSize: "14px",
          color: "#666",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "4px",
        }}
      >
        - or,
        <ReactHover options={hoverOptions}>
          <Trigger type="trigger">
            <a
              href="https://www.val.town/x/wolf/FileDumpThing/branch/main/code/cli/README.md"
              target="_blank"
              style={{ textDecoration: "underline" }}
            >
              use the cli!
            </a>
          </Trigger>
          <Hover type="hover">
            <div
              style={{
                padding: "8px 12px",
                backgroundColor: "#f5f5f5",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "12px",
                fontFamily: "monospace",
                whiteSpace: "pre",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                textAlign: "left",
              }}
            >
              {`❯ deno install -grAf -n=fdt https://esm.town/v/wolf/FileDumpThing/cli/upload.ts
❯ echo "foobarbuzz" | fdt
https://filedumpthing.val.run/blob?key=blob_text_1745171403155.txt`}
            </div>
          </Hover>
        </ReactHover>
      </div>
    </div>
  );
}