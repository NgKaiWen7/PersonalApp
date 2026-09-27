import { useState, useEffect, useRef } from "react";
import {
  loadReadings,
  addReadings,
  deleteReadings,
  getReadingFile,
} from "./ReadingData.jsx";
import "./Reading.css";
import "./ReadingTable.css";

export default function SimpleTable({ data }) {
  const [readings, setReadings] = useState([]);
  async function deleteButtonClick(id) {
    try {
      await deleteReadings(id);
      setReadings((current) => current.filter((reading) => reading.id !== id));
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
    <div className="simple-table-container">
      <table className="simple-table">
        <thead>
          <tr>
            <th>FileName</th>
            <th>Category</th>
            <th>Delete</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {readings.map((_readings) => (
            <tr key={_readings.id} style={{ borderBottom: "1px solid #eee" }}>
              <td className="simple-table-filename">{_readings.filename}</td>
              <td className="simple-table-category">{_readings.category}</td>
              <td>
                <button
                  className="simple-table-action simple-table-delete"
                  onClick={() => deleteButtonClick(_readings.id)}
                >
                  🗑️
                </button>
              </td>
              <td>
                <button
                  className="simple-table-action"
                  onClick={() => viewButtonClick(_readings.id)}
                >
                  👁️
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

export function ReadingList() {
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
  return (
    <section className="reading">
      <div className="reading-header">
        <h2 className="reading-title">Readings</h2>
        <button className="reading-add" onClick={handleButtonClick}>
          ➕
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
        <SimpleTable data={readings}></SimpleTable>
      </div>
    </section>
  );
}
