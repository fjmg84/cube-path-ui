import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type MetricPoint = [timestamp: number, value: number];

const metricColors = {
  sky: { stroke: "#0ea5e9", fill: "#e0f2fe" },
  violet: { stroke: "#8b5cf6", fill: "#ede9fe" },
  emerald: { stroke: "#10b981", fill: "#d1fae5" },
  amber: { stroke: "#f59e0b", fill: "#fef3c7" },
  cyan: { stroke: "#06b6d4", fill: "#cffafe" },
  fuchsia: { stroke: "#d946ef", fill: "#fae8ff" },
} as const;

export type MetricColor = keyof typeof metricColors;

function Sparkline({
  data,
  color,
}: {
  data: MetricPoint[];
  color: MetricColor;
}) {
  if (data.length < 2) {
    return (
      <div className="h-24 w-full rounded-2xl bg-gray-100 dark:bg-zinc-800" />
    );
  }

  const chartData = data.map(([timestamp, value]) => ({
    time: new Date(timestamp * 1000).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value,
  }));

  return (
    <div className="h-28 w-full overflow-hidden rounded-2xl bg-linear-to-br from-gray-50 to-white px-1 dark:from-zinc-900 dark:to-zinc-950">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient
              id={`gradient-${color}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor={metricColors[color].stroke}
                stopOpacity={0.35}
              />
              <stop
                offset="100%"
                stopColor={metricColors[color].fill}
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />
          <XAxis dataKey="time" hide />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#6b7280" }}
            formatter={(value) => [Number(value ?? 0).toFixed(4), "valor"]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={metricColors[color].stroke}
            strokeWidth={2}
            fill={`url(#gradient-${color})`}
            dot={false}
            activeDot={{ r: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MetricCard({
  title,
  value,
  average,
  peak,
  data,
  color,
}: {
  title: string;
  value: string;
  average: string;
  peak: string;
  data: MetricPoint[];
  color: MetricColor;
}) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white/95 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/95">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 dark:text-zinc-500">
            {title}
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-950 dark:text-zinc-50">
            {value}
          </p>
        </div>
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: metricColors[color].stroke }}
        />
      </div>

      <Sparkline data={data} color={color} />

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-gray-50 px-3 py-2 dark:bg-zinc-800/80">
          <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-zinc-500">
            Promedio
          </p>
          <p className="mt-1 font-medium text-gray-900 dark:text-zinc-100">
            {average}
          </p>
        </div>
        <div className="rounded-2xl bg-gray-50 px-3 py-2 dark:bg-zinc-800/80">
          <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-zinc-500">
            Pico
          </p>
          <p className="mt-1 font-medium text-gray-900 dark:text-zinc-100">
            {peak}
          </p>
        </div>
      </div>
    </section>
  );
}
