import { useEffect, useState } from "react"
import DataTable from "./components/DataTable"

const App = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then(setData)
      .catch((error) => console.error("Error fetching data:", error))
  }, [])
  return (
    <>
      <DataTable data={data} />
    </>
  )
}

export default App