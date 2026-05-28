"use client"

import { useState, useEffect, useRef } from "react"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<any[]>([])
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null)
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.")
      return
    }
    setMessage("Uploading...")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (res.ok) {
        if (isMounted.current) setMessage(data.message || "Upload complete")
      } else {
        if (isMounted.current) setMessage(data.message || "Upload failed")
      }
      if (isMounted.current) {
        setSearchTerm("")
        setResults([])
      }
    } catch {
      if (isMounted.current) setMessage("Error uploading file.")
    }
  }

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value.toUpperCase().trim()
    setSearchTerm(q)
    if (!q) {
      if (isMounted.current) setResults([])
      return
    }

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { cache: "no-store" })
      const data = await res.json()
      if (isMounted.current) {
        setResults(data)
        setMessage("")
      }
    } catch {
      if (isMounted.current) {
        setMessage("Error searching data.")
        setResults([])
      }
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: "auto", fontFamily: "Arial", padding: 20 }}>
      <h1>Warehouse App</h1>

      <h2>Upload Excel or CSV file</h2>
      <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginTop: 10, marginBottom: 20 }}>
        Upload
      </button>
      {message && <p>{message}</p>}

      <h2>Search by code</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Enter code to search"
        style={{ width: "100%", padding: 8, fontSize: 16, marginBottom: 20 }}
      />

      {results.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {results.map((item) => (
            <li key={item.code} style={{ borderBottom: "1px solid #ddd", padding: 10 }}>
              <p><b>Code:</b> {item.code}</p>
              <p><b>Vendor:</b> {item.vendor}</p>
              <p><b>Name:</b> {item.name}</p>
              <p><b>Tie:</b> {item.tie}</p>
              <p><b>Height:</b> {item.height}</p>
            </li>
          ))}
        </ul>
      ) : (
        searchTerm && <p>No results found</p>
      )}
    </div>
  )
}
