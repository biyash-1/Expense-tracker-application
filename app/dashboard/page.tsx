"use client";
import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { RootState } from "../store";
import Transcationform from "@/components/Transcationform";
import DoughnutChart from "@/components/DoughnutChart";
import withAuth from "../utils/withAuth";


const fetchTransactions = async (): Promise<any[]> => {
  const url = "https://expense-tracker-application-backend.onrender.com";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) throw new Error("You must be logged in to view transactions.");

  const response = await axios.get(`${url}/api/transaction/get`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(response.data);
  return response.data.transactions;
};

const Dashboard = () => {
  const username = useSelector((state: RootState) => state.auth.username);

  // React Query hook to fetch transactions
  const {
    data: transactions = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });

  // Optimized calculations for income, expense, and investment
  const totals = transactions.reduce(
    (acc, transaction) => {
      switch (transaction.type) {
        case "income":
          acc.income += transaction.amount;
          break;
        case "expense":
          acc.expense += transaction.amount;
          break;
        case "investment":
          acc.investment += transaction.amount;
          break;
        default:
          break;
      }
      return acc;
    },
    { income: 0, expense: 0, investment: 0 }
  );

  if (isLoading) return <p>Loading...</p>;
  if (isError)
    return (
      <p>
        Error: {error instanceof Error ? error.message : "An error occurred"}
      </p>
    );

  return (
    <div className="flex flex-col min-h-[100vh] p-4">
      {/* Welcome message at the top */}
      <div className="mb-6 mx-auto">
        <h1 className="text-2xl font-serif text-red-400">
          Welcome, {username}
        </h1>
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
            income={totals.income}
            expense={totals.expense}
            investment={totals.investment}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Dashboard);
