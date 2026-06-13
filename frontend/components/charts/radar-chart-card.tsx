"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TRAIT_METADATA, TRAIT_ORDER } from "@/lib/questions";
import type { AssessmentResult } from "@/lib/types";

type RadarChartCardProps = {
  result: AssessmentResult;
};

type ChartDatum = {
  trait: string;
  score: number;
};

export const RadarChartCard = ({ result }: RadarChartCardProps) => {
  const data: ChartDatum[] = TRAIT_ORDER.map((trait) => ({
    trait: TRAIT_METADATA[trait].shortLabel,
    score: result[trait]
  }));

  return (
    <Card className="overflow-hidden border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>Trait balance</CardTitle>
        <CardDescription>
          The radar view makes it easy to compare the shape of your profile at a glance.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[360px] pb-6">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart data={data}>
            <PolarGrid stroke="rgb(148 163 184 / 0.35)" />
            <PolarAngleAxis dataKey="trait" tick={{ fill: "#475569", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: 16,
                border: "1px solid rgb(226 232 240)",
                boxShadow: "0 24px 80px -32px rgb(15 23 42 / 0.25)"
              }}
            />
            <Radar
              name="Big Five"
              dataKey="score"
              stroke="rgb(37 99 235)"
              fill="rgb(37 99 235)"
              fillOpacity={0.24}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
