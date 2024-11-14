import {
  Excalidraw,
  exportToBlob,
  exportToSvg,
  getSceneVersion,
  loadFromBlob,
  serializeAsJSON,
} from "@excalidraw/excalidraw";
import React from "react";
import useSWR from "swr";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { useDebounce } from "@uidotdev/usehooks";
import { Base64 } from "js-base64";

const DEBOUNCE_MS = 500;

function App() {
  const [sceneVersion, setSceneVersion] = React.useState(0);
  const [excalidrawAPI, setExcalidrawAPI] = React.useState<
    ExcalidrawImperativeAPI | null
  >(null);
  const debouncedSavedVersion = useDebounce(sceneVersion, DEBOUNCE_MS);
  const { data: initialData, isLoading, error } = useSWR(
    "/json",
    async (path) => {
      const resp = await fetch(path);
      if (resp.status === 404) {
        setSceneVersion(0);
        return null;
      }
      if (!resp.ok) {
        throw new Error("Failed to load initial data");
      }

      const blob = await resp.blob();
      const initialData = await loadFromBlob(blob, null, null);
      setSceneVersion(getSceneVersion(initialData.elements));
      return initialData;
    }, { revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  React.useEffect(() => {
    const saveDrawing = async () => {
      const initialVersion = initialData
        ? getSceneVersion(initialData.elements)
        : 0;
      if (sceneVersion == initialVersion) {
        return;
      }

      if (!excalidrawAPI) {
        console.error("Excalidraw API not available");
        return;
      }

      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const files = excalidrawAPI.getFiles();
      const [json, svg, png] = await Promise.all([
        serializeAsJSON(elements, appState, files, "local"),
        exportToSvg({ elements, appState, files }),
        exportToBlob({ elements, appState, files }),
      ]);

      await fetch(window.location.href, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          json,
          png: Base64.fromUint8Array(
            new Uint8Array(await new Response(png).arrayBuffer()),
          ),
          svg: svg.outerHTML,
        }),
      });
    };

    saveDrawing();
  }, [debouncedSavedVersion]);

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Error loading data: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return null;
  }

  return (
    <Excalidraw
      initialData={{ ...initialData, scrollToContent: true }}
      excalidrawAPI={(api) => setExcalidrawAPI(api)}
      onChange={(elements) => {
        const previousVersion = sceneVersion;
        const currentVersion = getSceneVersion(elements);
        if (currentVersion !== previousVersion) {
          setSceneVersion(currentVersion);
        }
      }}
    />
  );
}

export default App;
