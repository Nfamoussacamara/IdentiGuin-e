import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface StepCardProps {
  number: string | number;
  title: string;
  icon: any;
  description: string;
  isLast?: boolean;
}

const StepCard = ({ number, title, icon: Icon, description, isLast }: StepCardProps) => {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.007 }}
      className="group relative glass-card rounded-3xl p-6 h-full flex flex-col items-start transition-all cursor-default"
    >
      {/* Number Background */}
      <span className="absolute top-4 right-6 text-4xl font-display font-black text-green/30 select-none">
        {number.toString().padStart(2, '0')}
      </span>

      {/* Icon */}
      <div className="text-green mb-6 bg-green-light/20 p-2.5 rounded-xl">
        <Icon strokeWidth={2} className="w-5 h-5" />
      </div>

      {/* Content */}
      <h3 className="font-display font-bold text-base text-text-primary mb-2">
        {title}
      </h3>
      
      <p className="font-body text-text-muted text-[13px] leading-relaxed">
        {description}
      </p>

      {/* Arrow Indicator (Desktop) */}
      {!isLast && (
        <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-green bg-bg p-1">
          <ArrowRight className="w-4 h-4" />
        </div>
      )}
    </motion.div>
  );
};

export default StepCard;
