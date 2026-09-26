import { useState, useEffect, useRef } from "react";
import { loadReadings, addReadings, deleteReadings , getReadingFile} from "./ReadingData.jsx";

export default function SimpleTable({ data }) {
  const [readings, setReadings] = useState([]);
  async function deleteButtonClick(id) {
    try {
      await deleteReadings(id);
      setReadings((current) =>
        current.filter((reading) => reading.id !== id)
      );
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }
  async function viewButtonClick(id) {
    try {
      const blob = await getReadingFile(id);

      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");
    } catch (error) {
      console.error("View failed:", error);
    }
  }
  useEffect(() => {
    setReadings(data);
  }, [data]);
  return (
    <div style={{ padding: "20px" }}>
      <table
        style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc" }}>
            <th style={{ padding: "10px" }}>FileName</th>
            <th style={{ padding: "10px" }}>Category</th>
            <th style={{ padding: "10px" }}>Delete</th>
            <th style={{ padding: "10px" }}>View</th>
          </tr>
        </thead>
        <tbody>
          {(readings).map((_readings) => (
            <tr key={_readings.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "10px" }}>{_readings.filename}</td>
              <td style={{ padding: "10px" }}>{_readings.category}</td>
              <td>
                <button onClick={() => deleteButtonClick(_readings.id)}>
                  Delete
                </button>
              </td>
              <td>
                <button onClick={() => viewButtonClick(_readings.id)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Upload() {
  const [file, setFile] = useState(null);

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }
    setFile(selectedFile);
  }

  return <input type="file" onChange={handleFileChange} />;
}

export function Readings() {
  const [readings, setAllReadings] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function getReadings() {
      const data = await loadReadings();
      setAllReadings(data);
    }

    getReadings();
  }, []);

  function handleButtonClick() {
    fileInputRef.current.click();
  }

  async function handleFileChange(event) {
    const files = Array.from(event.target.files);

    if (files.length === 0) {
      return;
    }

    try {
      for (const file of files) {
        await addReadings(file);
      }

      const data = await loadReadings();
      setAllReadings(data);

      console.log("Uploaded:", data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  }
  console.log(readings);
  return (
    <section className="reading">
      <div className="reading-header">
        <h2 className="reading-title">Readings</h2>
        <button className="reading-add" onClick={handleButtonClick}>
          Add
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      <div className="reading-list">
        <SimpleTable data = { readings }></SimpleTable>
      </div>
    </section>
  );
}
