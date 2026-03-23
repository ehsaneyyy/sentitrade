"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import TransactionCard from "../components/TransactionCard";
import ParticleBackground from "../components/ParticleBackground";
import { getTransactions, createTransaction, deleteTransaction, getNews, createNews, deleteNews } from "../lib/api";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [news, setNews] = useState([]);
  const [amount, setAmount] = useState("");
  const [userId, setUserId] = useState("");
  const [headline, setHeadline] = useState("");
  const [activeTab, setActiveTab] = useState("transactions");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    const t = await getTransactions();
    const n = await getNews();
    setTransactions(Array.isArray(t) ? t : []);
    setNews(Array.isArray(n) ? n : []);
    setLoading(false);
  }

  async function handleAddTransaction() {
    if (!amount || !userId) {
      toast.error("Please fill in all fields!");
      return;
    }
    const result = await createTransaction({ amount: parseFloat(amount), user_id: parseInt(userId) });
    setAmount(""); setUserId("");
    if (result.is_fraud) {
      toast.error("⚠ Fraud detected on this transaction!");
    } else {
      toast.success("Transaction added successfully!");
    }
    fetchAll();
  }

  async function handleAddNews() {
    if (!headline) {
      toast.error("Please enter a headline!");
      return;
    }
    const result = await createNews({ headline });
    setHeadline("");
    toast.success(`Sentiment: ${result.sentiment.toUpperCase()}`);
    fetchAll();
  }

  async function handleDeleteTransaction(id) {
    await deleteTransaction(id);
    toast.success("Transaction deleted!");
    fetchAll();
  }

  async function handleDeleteNews(id) {
    await deleteNews(id);
    toast.success("News deleted!");
    fetchAll();
  }

  const fraudCount = transactions.filter(t => t.is_fraud).length;
  const cleanCount = transactions.filter(t => !t.is_fraud).length;

  const chartData = transactions.map((t, i) => ({
    name: `#${i + 1}`,
    amount: t.amount,
    fraud: t.is_fraud ? t.amount : 0,
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#020817" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen relative" style={{ background: "#020817" }}>
      <Toaster position="top-right" toastOptions={{
        style: { background: "#0f172a", color: "white", border: "1px solid rgba(255,255,255,0.1)" }
      }} />
      <ParticleBackground />

      <div className="relative z-10">
        <nav className="glass border-b border-white/5 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
          <Link href="/">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm">ST</div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Sentitrade</span>
            </motion.div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">{new Date().toISOString().split("T")[0]}</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-sm">Live</span>
            </div>
          </div>
        </nav>

        <div className="px-8 py-10 max-w-7xl mx-auto">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Total Transactions", value: transactions.length, color: "text-blue-400" },
              { label: "Fraud Detected", value: fraudCount, color: "text-red-400" },
              { label: "Clean", value: cleanCount, color: "text-emerald-400" },
              { label: "News Articles", value: news.length, color: "text-cyan-400" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-5 glow-blue"
              >
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {chartData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 mb-10"
            >
              <h2 className="text-lg font-semibold text-white mb-4">Transaction History</h2>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#4b5563" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                  <YAxis stroke="#4b5563" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white" }} />
                  <Area type="monotone" dataKey="amount" stroke="#3b82f6" fill="url(#colorAmount)" strokeWidth={2} />
                  <Area type="monotone" dataKey="fraud" stroke="#ef4444" fill="url(#colorFraud)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                New Transaction
              </h2>
              <input
                type="number"
                placeholder="Amount ($)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full mb-3 p-3 rounded-xl bg-white/5 text-white border border-white/10 outline-none focus:border-blue-500 transition placeholder-gray-600"
              />
              <input
                type="number"
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full mb-4 p-3 rounded-xl bg-white/5 text-white border border-white/10 outline-none focus:border-blue-500 transition placeholder-gray-600"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddTransaction}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
              >
                Submit Transaction
              </motion.button>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                News Sentiment
              </h2>
              <input
                type="text"
                placeholder="Enter news headline..."
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full mb-4 p-3 rounded-xl bg-white/5 text-white border border-white/10 outline-none focus:border-cyan-500 transition placeholder-gray-600"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddNews}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition"
              >
                Analyze Sentiment
              </motion.button>
            </motion.div>
          </div>

          <div className="flex gap-2 mb-6">
            {["transactions", "news"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition capitalize ${
                  activeTab === tab ? "bg-blue-600 text-white" : "glass text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "transactions" && (
              <motion.div
                key="transactions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {transactions.length === 0 ? (
                  <p className="text-gray-600 col-span-3 text-center py-10">No transactions yet.</p>
                ) : (
                  transactions.map((t, i) => (
                    <TransactionCard key={t.id} transaction={t} index={i} onDelete={handleDeleteTransaction} />
                  ))
                )}
              </motion.div>
            )}

            {activeTab === "news" && (
              <motion.div
                key="news"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {news.length === 0 ? (
                  <p className="text-gray-600 col-span-2 text-center py-10">No news yet.</p>
                ) : (
                  news.map((n, i) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -3 }}
                      className="glass rounded-2xl p-5"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-white text-sm leading-relaxed flex-1 mr-3">{n.headline}</p>
                        <button
                          onClick={() => handleDeleteNews(n.id)}
                          className="text-gray-600 hover:text-red-400 transition text-lg leading-none"
                        >
                          ×
                        </button>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        n.sentiment === "positive" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                        n.sentiment === "negative" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                        "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      }`}>
                        {n.sentiment.toUpperCase()}
                      </span>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </main>
  );
}