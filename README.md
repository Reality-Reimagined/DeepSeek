# DeepSeek Chat Application

A modern chat application powered by DeepSeek's 70B parameter language model, featuring real-time streaming responses, code previews, and voice input capabilities.

## Features

- 🤖 Advanced AI Chat with DeepSeek's 70B model
- 💭 Real-time thought process visualization
- 🎯 Code syntax highlighting and preview
- 🎤 Voice input support
- 📝 Multi-line input with auto-resize
- 💾 Code download and copy functionality
- 🖥️ Interactive code previews for HTML, CSS, JavaScript, and JSX
- 📱 Responsive design for all devices

## Getting Started

1. Clone the repository
2. Create a `.env` file based on `.env.example`
3. Add your DeepSeek API key to the `.env` file
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `VITE_GROQ_API_KEY`: Your DeepSeek API key (required)

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Groq SDK
- PrismJS
- Lucide Icons

## Project Structure

```
src/
├── components/     # Reusable UI components
├── lib/           # Utility functions and API handlers
├── pages/         # Main application pages
├── types/         # TypeScript type definitions
└── main.tsx       # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT License