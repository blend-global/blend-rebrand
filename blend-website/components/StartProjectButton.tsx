"use client";

import { useProjectModal } from "@/components/ProjectModalProvider";
import { motion, type HTMLMotionProps } from "framer-motion";

type StartProjectButtonProps = Omit<HTMLMotionProps<"button">, "onClick"> & {
  services?: string[];
  onBeforeOpen?: () => void;
};

export default function StartProjectButton({
  services,
  children = "Start a Project",
  className = "",
  onBeforeOpen,
  type = "button",
  ...props
}: StartProjectButtonProps) {
  const { openProjectModal } = useProjectModal();

  return (
    <motion.button
      {...props}
      type={type}
      className={`${className} cursor-pointer`}
      onClick={() => {
        onBeforeOpen?.();
        openProjectModal({ services });
      }}
      whileHover={{ y: -3, scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}
