"use client";

import { Button } from "@heroui/react";

const colorClass = {
  success: "bg-green-500 hover:bg-green-600 text-white",
  danger: "bg-red-500 hover:bg-red-600 text-white",
  warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
};

type Props = {
  onPress: () => void;
  label: string;
  color: keyof typeof colorClass;
};

export function CustomButton({ onPress, label, color }: Props) {
  return (
    <Button onPress={onPress} className={colorClass[color]}>
      {label}
    </Button>
  );
}
