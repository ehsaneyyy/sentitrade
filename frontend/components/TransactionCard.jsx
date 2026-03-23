"use client";
import { motion } from "framer-motion";

export default function TransactionCard({ transaction, index }) {
  const isFraud = transaction.is_fraud;
  const sentiment = transaction.sentiment;

  const sentimentColor =
    sentiment === "positive" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" :
    sentiment === "negative" ? "text-red-400 bg-red-400/10 border-red-400/30" :
    "text-blue-400 bg-blue-400/10 border-blue-400/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`glass rounded-2xl p-5 relative overflow-hidden cursor-pointer ${isFraud ? "border-red-500/50 glow-red" : "glow-blue"}`}
    >
      {isFraud && <div className="absolute inset-0 bg-red-500/5 rounded-2xl" />}

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Amount</p>
            <p className="text-2xl font-bold text-white">${transaction.amount.toLocaleString()}</p>
          </div>
          {isFraud ? (
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="bg-red-500/20 text-red-400 border border-red-500/50 text-xs px-3 py-1 rounded-full font-bold"
            >
              FRAUD
            </motion.span>
          ) : (
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1 rounded-full font-bold">
              CLEAN
            </span>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-gray-500 text-xs">User ID</p>
            <p className="text-gray-300 text-sm font-medium">#{transaction.user_id}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs">Time</p>
            <p className="text-gray-300 text-xs">{new Date(transaction.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>

        <div className={`mt-3 px-3 py-1.5 rounded-lg border inline-block ${sentimentColor}`}>
          <span className="text-xs font-semibold">{sentiment.toUpperCase()}</span>
        </div>
      </div>
    </motion.div>
  );
}