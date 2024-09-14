"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import withAuth from "../utils/withAuth";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Transcationform from "@/components/Transcationform";
import DoughnutChart from "@/components/DoughnutChart";

const Dashboard = () => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [investment, setInvestment] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const username = useSelector((state: RootState) => state.auth.username);

  const url = "https://expense-tracker-application-backend.onrender.com"

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
          setError("You must be logged in to view transactions.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${url}/api/transaction/get`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const transactions = response.data.transactions;

        // Calculate the totals for income, expense, and investment
        const totalIncome = transactions
          .filter((t: any) => t.type === "income")
          .reduce((sum: number, t: any) => sum + t.amount, 0);

        const totalExpense = transactions
          .filter((t: any) => t.type === "expense")
          .reduce((sum: number, t: any) => sum + t.amount, 0);

        const totalInvestment = transactions
          .filter((t: any) => t.type === "investment")
          .reduce((sum: number, t: any) => sum + t.amount, 0);

        setIncome(totalIncome);
        setExpense(totalExpense);
        setInvestment(totalInvestment);
      } catch (error: any) {
        setError(error.response?.data?.msg || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, [income]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col min-h-[100vh] p-4">
      {/* Welcome message at the top */}
      <div className="mb-6 mx-auto">
        <h1 className="text-2xl font-serif text-red-400">Welcome, {username}</h1>
      </div>

      {/* Flex container for form and chart */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-evenly gap-2">
        {/* Transcationform comes first in mobile view */}
        <div className="flex flex-col gap-2 mb-2 md:mb-0">
          <Transcationform />
        </div>

        {/* DoughnutChart will appear beside Transcationform in larger view */}
        <div className="flex flex-col gap-2 mt-8 justify-center">
          <DoughnutChart 
            income={income}
            expense={expense}
            investment={investment}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Dashboard);
