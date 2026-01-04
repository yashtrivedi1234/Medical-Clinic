import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiFileText, FiPlus, FiCalendar } from "react-icons/fi";
import api from "../utils/api";
import { toast } from "react-toastify";
import Loading from '../components/Loading.jsx';

const DashboardMedicalRecords = () => {
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      const response = await api.get("/user/medical-records");
      setMedicalHistory(response.data.data.medicalHistory || []);
    } catch (error) {
      toast.error("Failed to load medical records");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Medical Records</h1>
        </div>

        {medicalHistory.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Medical Records
            </h3>
            <p className="text-gray-600">
              Your medical history will appear here once your doctor adds records.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {medicalHistory.map((record, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {record.condition}
                    </h3>
                    {record.diagnosisDate && (
                      <p className="text-gray-600 mb-2 flex items-center">
                        <FiCalendar className="mr-2" />
                        Diagnosed:{" "}
                        {new Date(record.diagnosisDate).toLocaleDateString()}
                      </p>
                    )}
                    {record.notes && (
                      <p className="text-gray-600">{record.notes}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardMedicalRecords;

