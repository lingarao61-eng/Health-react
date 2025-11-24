import { useEffect, useState } from "react";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  // ============================
  // FORM STATE
  // ============================
  const [formData, setFormData] = useState({
    user_id: "",
    Patient_Name: "",
    Email: "",
    Age: "",
    heart_rate: "",
    respiratory_rate: "",
    body_temperature: "",
    oxygen_saturation: "",
    systolic_bp: "",
    diastolic_bp: "",
  });

  const [statusMsg, setStatusMsg] = useState("");
  const [iotData, setIotData] = useState([]);

  // FORM HANDLER
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ============================
  // POST DATA → XANO
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg("Submitting...");

    const payload = {
      user_id: Number(formData.user_id),
      Patient_Name: formData.Patient_Name,
      Email: formData.Email,
      Age: Number(formData.Age),
      heart_rate: Number(formData.heart_rate),
      respiratory_rate: Number(formData.respiratory_rate),
      body_temperature: Number(formData.body_temperature),
      oxygen_saturation: Number(formData.oxygen_saturation),
      systolic_bp: Number(formData.systolic_bp),
      diastolic_bp: Number(formData.diastolic_bp),
    };

    try {
      const res = await fetch(
        "https://x8ki-letl-twmt.n7.xano.io/api:5GbqGlNW/iot/ingest_record",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      await res.json();
      setStatusMsg("Record saved successfully ✔");

      setFormData({
        user_id: "",
        Patient_Name: "",
        Email: "",
        Age: "",
        heart_rate: "",
        respiratory_rate: "",
        body_temperature: "",
        oxygen_saturation: "",
        systolic_bp: "",
        diastolic_bp: "",
      });

      loadIotRecords();
    } catch (err) {
      console.error(err);
      setStatusMsg("Error saving record ❌");
    }
  };

  // ============================
  // GET DATA
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
  // GROUP BY EMAIL
  // ============================
  const groupedData = iotData.reduce((groups, row) => {
    if (!groups[row.Email]) groups[row.Email] = [];
    groups[row.Email].push(row);
    return groups;
  }, {});

  // ============================
  // COLOR MAPPING
  // ============================
  const riskColor = (risk) => {
    switch (risk) {
      case "Normal":
        return "text-green-600 font-bold";
      case "Low Alert":
        return "text-yellow-600 font-bold";
      case "Moderate Alert":
        return "text-orange-600 font-bold";
      case "High Alert":
        return "text-red-600 font-bold";
      case "Critical":
        return "text-purple-700 font-extrabold";
      default:
        return "";
    }
  };

  return (
    <>
      <PageMeta title="React.js IoT Dashboard" description="IoT Monitoring Dashboard with Xano" />

      <div className="grid grid-cols-12 gap-4 md:gap-6">

        {/* Chart */}
        <div className="col-span-12">
          <StatisticsChart />
        </div>

        {/* ====================== FORM ===================== */}
        <div className="col-span-12">
          <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold">Manual IoT Data Entry</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                ["user_id", "User ID", "number"],
                ["Patient_Name", "Patient Name", "text"],
                ["Email", "Email", "email"],
                ["Age", "Age", "number"],
                ["heart_rate", "Heart Rate", "number"],
                ["respiratory_rate", "Respiratory Rate", "number"],
                ["body_temperature", "Body Temperature (°C)", "number"],
                ["oxygen_saturation", "SpO2 (%)", "number"],
                ["systolic_bp", "Systolic BP", "number"],
                ["diastolic_bp", "Diastolic BP", "number"],
              ].map(([name, label, type]) => (
                <div key={name}>
                  <label className="block mb-1 font-medium">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                    required
                  />
                </div>
              ))}

              <button className="w-full py-2 font-bold text-white bg-blue-600 rounded-lg">
                Submit
              </button>
            </form>

            {statusMsg && (
              <p className="mt-4 font-semibold text-green-600">{statusMsg}</p>
            )}
          </div>
        </div>

        {/* ====================== TABLE ===================== */}
        <div className="col-span-12">
          <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold">IoT Records (Grouped by Email)</h2>

            <div className="space-y-6">
              {Object.keys(groupedData).map((email) => (
                <div key={email} className="border rounded-lg">
                  <div className="p-3 font-bold bg-gray-200 dark:bg-gray-700">
                    📧 {email}
                  </div>

                  <table className="min-w-full text-sm text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2">Patient</th>
                        <th className="p-2">Age</th>
                        <th className="p-2">HR</th>
                        <th className="p-2">Temp</th>
                        <th className="p-2">Resp</th>
                        <th className="p-2">SpO2</th>
                        <th className="p-2">Sys</th>
                        <th className="p-2">Dia</th>
                        <th className="p-2">Risk</th>
                        <th className="p-2">Alert</th>
                        <th className="p-2">Recommendation</th>
                        <th className="p-2">Monitoring</th>
                        <th className="p-2">Escalation</th>
                        <th className="p-2">Timestamp</th>
                      </tr>
                    </thead>

                    <tbody>
                      {groupedData[email].map((row) => (
                        <tr key={row.id} className="border-b">
                          <td className="p-2">{row.Patient_Name}</td>
                          <td className="p-2">{row.Age}</td>
                          <td className="p-2">{row.heart_rate}</td>
                          <td className="p-2">{row.body_temperature}</td>
                          <td className="p-2">{row.respiratory_rate}</td>
                          <td className="p-2">{row.oxygen_saturation}</td>
                          <td className="p-2">{row.systolic_bp}</td>
                          <td className="p-2">{row.diastolic_bp}</td>

                          {/* COLOR-CODED RISK */}
                          <td className={`p-2 ${riskColor(row.risk_label)}`}>
                            {row.risk_label}
                          </td>

                          <td className="p-2">{row.alert_message}</td>
                          <td className="p-2">{row.recommended_action}</td>
                          <td className="p-2">{row.monitoring_suggestion}</td>
                          <td className="p-2">{row.escalation_advice}</td>

                          <td className="p-2">
                            {row.timestamp
                              ? new Date(row.timestamp).toLocaleString()
                              : ""}
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
