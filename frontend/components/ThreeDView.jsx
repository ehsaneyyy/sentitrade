"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function TransactionSphere({ transaction, index }) {
  const size = Math.min(Math.max(transaction.amount / 10000, 0.2), 2);
  
  const color = transaction.is_fraud
    ? "#ff0000"
    : transaction.sentiment === "positive"
    ? "#00ff88"
    : transaction.sentiment === "negative"
    ? "#ff6600"
    : "#4488ff";

  const x = (index % 5) * 3 - 6;
  const y = Math.floor(index / 5) * -3 + 3;

  return (
    <mesh position={[x, y, 0]}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={transaction.is_fraud ? "#ff0000" : "#000000"}
        emissiveIntensity={transaction.is_fraud ? 0.5 : 0}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
}

export default function ThreeDView({ transactions }) {
  if (!transactions || transactions.length === 0) return null;

  return (
    <div className="w-full h-96 rounded-2xl overflow-hidden border border-gray-700">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4488ff" />
        {transactions.map((t, i) => (
          <TransactionSphere key={t.id} transaction={t} index={i} />
        ))}
        <OrbitControls enableZoom={true} autoRotate={true} autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
}