import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

interface StatCardProps {
  value: number;
  label: string;
  color: 'red' | 'gold';
  delay?: number;
}

const StatCard = ({ value, label, color, delay = 0 }: StatCardProps) => {
  const numColor = {
    red: "text-white",
    gold: "text-white",
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: delay }}
      className="p-6 md:p-8 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-sm flex flex-col justify-center items-start gap-3"
    >
      <h3 className={`text-4xl md:text-5xl font-display font-extrabold tracking-tighter ${numColor[color]}`}>
        <AnimatedCounter value={value} />
      </h3>
      <p className="font-body text-white text-base font-semibold leading-snug max-w-[200px]">
        {label}
      </p>
    </motion.div>
  );
};

export default StatCard;
