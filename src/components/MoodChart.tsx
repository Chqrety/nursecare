"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mapping Emoji ke Angka biar bisa digrafikkan
const moodScore: Record<string, number> = {
  senang: 5,
  netral: 3,
  lelah: 2,
  sedih: 1,
  marah: 0,
}

export function MoodChart({ data }: { data: any[] }) {
  // Format data biar dimengerti Recharts
  const chartData = data
    .map(log => ({
      date: new Date(log.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
      score: moodScore[log.mood] || 3, // Default netral
      mood: log.mood,
    }))
    .reverse() // Biar urut dari lama ke baru

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafik Mood 7 Hari Terakhir</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
              <YAxis domain={[0, 5]} hide />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white border p-2 rounded shadow text-sm">
                        <p className="font-bold">{payload[0].payload.date}</p>
                        <p>Mood: {payload[0].payload.mood}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2} dot={{ r: 4, fill: "#2563eb" }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 border-2 border-dashed rounded-md">
            Belum ada data mood. Yuk isi dulu!
          </div>
        )}
      </CardContent>
    </Card>
  )
}
