import { motion } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

const variants = {
  initial: {
    opacity: 0,
    y: 10,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: {
      duration: 0.2,
    },
  },
};

export const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-1 w-full h-full flex flex-col"
    >
      {children}
    </motion.div>
  );
};
