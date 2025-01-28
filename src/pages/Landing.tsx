import { Link } from 'react-router-dom';
import { Brain, MessageSquare, Settings, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const features = [
  {
    icon: Brain,
    title: "Advanced Reasoning",
    description: "Watch the AI's thought process unfold with our unique chain-of-thought visualization."
  },
  {
    icon: MessageSquare,
    title: "Natural Conversations",
    description: "Engage in fluid, context-aware discussions with human-like responses."
  },
  {
    icon: Settings,
    title: "Customizable",
    description: "Fine-tune the AI's behavior with adjustable parameters and settings."
  }
];

const steps = [
  "Click 'Start Chatting' to enter the chat interface",
  "Type your message in the input field",
  "Watch as the AI processes and responds with detailed reasoning"
];

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.h1 
            className="text-6xl font-bold text-gray-900 mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Experience <span className="text-blue-600">DeepSeek AI</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Engage with one of the most advanced AI models, powered by DeepSeek's
            70B parameter language model. Witness chain-of-thought reasoning in action.
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/chat">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Start Chatting Now
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-3 gap-8 mt-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -5 }}
              className="p-6 bg-white rounded-lg shadow-lg transform transition-all duration-300"
            >
              <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="text-3xl font-bold mb-8">Getting Started</h2>
          <div className="max-w-3xl mx-auto">
            <motion.ol className="space-y-4 text-left">
              {steps.map((step, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.2 }}
                  className="flex items-center gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center"
                  >
                    {index + 1}
                  </motion.div>
                  <p>{step}</p>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </motion.div>
      </div>
    </div>
  );
}