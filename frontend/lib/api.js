const BASE_URL = "http://127.0.0.1:8000";

export async function getTransactions() {
  const res = await fetch(`${BASE_URL}/transactions`);
  return res.json();
}

export async function createTransaction(data) {
  const res = await fetch(`${BASE_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTransaction(id) {
  await fetch(`${BASE_URL}/transactions/${id}`, {
    method: "DELETE",
  });
}

export async function getNews() {
  const res = await fetch(`${BASE_URL}/news`);
  return res.json();
}

export async function createNews(data) {
  const res = await fetch(`${BASE_URL}/news`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteNews(id) {
  await fetch(`${BASE_URL}/news/${id}`, {
    method: "DELETE",
  });
}