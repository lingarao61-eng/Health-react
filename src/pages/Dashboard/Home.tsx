import { useEffect, useState } from "react";

;
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  // ============================
  // STATE FOR IOT FORM + TABLE
  // ============================
  const [formData, setFormData] = useState({
    user_id: "",
    heart_rate: "",
    temperature: "",
    spo2: "",
    Email: "",
    Patient_Name: "",
    Age: "",
  });

  const [statusMsg, setStatusMsg] = useState("");
  const [iotData, setIotData] = useState([]);

  // ============================
  // HANDLE INPUT CHANGE
  // ============================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ============================
  // POST DATA → XANO
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg("Submitting...");

    const payload = {
      user_id: Number(formData.user_id),
      heart_rate: Number(formData.heart_rate),
      temperature: Number(formData.temperature),
      spo2: Number(formData.spo2),
      Email: formData.Email,
      Patient_Name: formData.Patient_Name,
      Age: Number(formData.Age),
    };

    try {
      const res = await fetch(
        "https://x8ki-letl-twmt.n7.xano.io/api:5GbqGlNW/iot_record",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      console.log("XANO POST:", data);

      setStatusMsg("Record saved successfully ✔");

      // Reset form
      setFormData({
        user_id: "",
        heart_rate: "",
        temperature: "",
        spo2: "",
        Email: "",
        Patient_Name: "",
        Age: "",
      });

      loadIotRecords();
    } catch (err) {
      console.error(err);
      setStatusMsg("Error saving record ❌");
    }
  };

  // ============================
  // GET DATA FROM XANO
  // ============================
  const loadIotRecords = async () => {
    try {
      const res = await fetch(
        "https://x8ki-letl-twmt.n7.xano.io/api:5GbqGlNW/iot_record"
      );
      const data = await res.json();
      setIotData(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    loadIotRecords();
  }, []);

  // ============================
  // GROUP DATA BY EMAIL
  // ============================
  const groupedData = iotData.reduce((groups, row) => {
    if (!groups[row.Email]) groups[row.Email] = [];
    groups[row.Email].push(row);
    return groups;
  }, {});

  return (
    <>
      <PageMeta
        title="React.js IoT Dashboard"
        description="IoT Monitoring Dashboard with Xano"
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
       
       
        <div className="col-span-12">
          <StatisticsChart />
        </div>

      


        {/* =======================================================
            🚀 IOT FORM
        ======================================================= */}
        <div className="col-span-12">
          <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-200">
              Manual IoT Data Entry
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">User ID</label>
                <input
                  type="number"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Patient Name</label>
                <input
                  type="text"
                  name="Patient_Name"
                  value={formData.Patient_Name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Age</label>
                <input
                  type="number"
                  name="Age"
                  value={formData.Age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Heart Rate</label>
                <input
                  type="number"
                  name="heart_rate"
                  value={formData.heart_rate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Temperature</label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">SpO2</label>
                <input
                  type="number"
                  name="spo2"
                  value={formData.spo2}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Submit
              </button>
            </form>

            {statusMsg && (
              <p className="mt-4 font-semibold text-green-600">{statusMsg}</p>
            )}
          </div>
        </div>

        {/* =======================================================
            🚀 GROUPED TABLE (BY EMAIL)
        ======================================================= */}
        <div className="col-span-12">
          <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-200">
              IoT Records (Grouped by Email)
            </h2>

            <div className="space-y-6">
              {Object.keys(groupedData).map((email) => (
                <div key={email} className="border rounded-lg">
                  <div className="p-3 font-bold bg-gray-200 dark:bg-gray-700">
                    📧 {email}
                  </div>

                  <table className="min-w-full text-sm text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2">Patient Name</th>
                        <th className="p-2">Age</th>
                        <th className="p-2">Heart Rate</th>
                        <th className="p-2">Temperature</th>
                        <th className="p-2">SpO2</th>
                        <th className="p-2">Timestamp</th>
                      </tr>
                    </thead>

                    <tbody>
                      {groupedData[email].map((row) => (
                        <tr key={row.id} className="border-b">
                          <td className="p-2">{row.Patient_Name}</td>
                          <td className="p-2">{row.Age}</td>
                          <td className="p-2">{row.heart_rate}</td>
                          <td className="p-2">{row.temperature}</td>
                          <td className="p-2">{row.spo2}</td>
                          <td className="p-2">
  {row.timestamp ? new Date(row.timestamp).toLocaleString() : ""}
</td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
