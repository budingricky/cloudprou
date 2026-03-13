import { useEffect, useRef } from "react";
import { useSpring, useTransform } from "framer-motion";

interface CountUpProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const CountUp = ({ value, className, prefix = "", suffix = "" }: CountUpProps) => {
  const springValue = useSpring(0, {
    damping: 20,
    stiffness: 200,
  });
  const displayValue = useTransform(springValue, (current) => 
    prefix + current.toFixed(2) + suffix
  );
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  useEffect(() => {
    return displayValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = latest;
      }
    });
  }, [displayValue]);

  return <span ref={ref} className={className} />;
};
