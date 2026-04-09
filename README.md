# Vibcoding Prep-dex

A modern prediction market platform built with Next.js, React, and Tailwind CSS.

## Overview

This project creates a decentralized prediction market where users can create, trade, and resolve predictions on various topics. The platform features a modern UI with real-time updates and integrates with V0 SDK for AI-powered development assistance.

## Features

- **Prediction Markets**: Create and manage prediction markets
- **Trading Interface**: Buy/sell prediction shares
- **Real-time Updates**: Live market data and price updates
- **AI Integration**: V0 SDK integration for development assistance
- **Modern UI**: Responsive design with Tailwind CSS
- **Chat System**: Interactive chat with streaming responses
- **User Authentication**: Wallet-based authentication
- **Dashboard**: Analytics and portfolio management

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **AI Integration**: V0 SDK for development assistance
- **Authentication**: Web3 wallet integration

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- Web3 wallet (MetaMask, etc.)

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
cd vibecoding-prediction-market
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
npm run db:migrate

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/prediction_market

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3005

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# V0 SDK
V0_API_KEY=your-v0-api-key
```

## Project Structure

```
vibecoding-prediction-market/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── chat/
│   │   │   ├── markets/
│   │   │   └── predictions/
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── v0/
│   │   │   ├── chat/
│   │   │   └── chats/
│   │   ├── ui/
│   │   └── ai-elements/
│   ├── lib/
│   └── types/
├── public/
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Available Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Start production server
npm run start

# Database migrations
npm run db:migrate

# Database seeding
npm run db:seed

# Linting
npm run lint

# Type checking
npm run type-check
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Markets
- `GET /api/markets` - List all markets
- `POST /api/markets` - Create new market
- `GET /api/markets/[id]` - Get market details
- `POST /api/markets/[id]/predict` - Make prediction

### Predictions
- `GET /api/predictions` - List user predictions
- `POST /api/predictions` - Create prediction
- `POST /api/predictions/[id]/resolve` - Resolve prediction

### Chat
- `POST /api/chat` - Send chat message with streaming response
- `GET /api/chat/[chatId]` - Get chat history

## Components

### V0 Integration
- **ChatDetailClient**: Main chat interface with streaming support
- **ChatMessages**: Message display with V0 SDK components
- **ChatInput**: Message input with attachment support
- **StreamingMessage**: Real-time streaming message display

### UI Components
- **MarketCard**: Market display card
- **PredictionForm**: Create prediction form
- **TradingInterface**: Buy/sell interface
- **Dashboard**: Analytics and portfolio

## Development

### Adding New Features

1. **Create Component**: Add new component in `src/components/`
2. **API Endpoint**: Create endpoint in `src/app/api/`
3. **Database Model**: Update models and migrations
4. **Integration**: Add V0 SDK assistance for development

### Code Style

- Use TypeScript for type safety
- Follow Tailwind CSS conventions
- Implement proper error handling
- Add loading states and user feedback

### Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

## Deployment

### Environment Setup

1. **Production Database**: Set up PostgreSQL instance
2. **Environment Variables**: Configure production variables
3. **Build**: `npm run build`
4. **Deploy**: Deploy to Vercel, Netlify, or your preferred platform

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Standards

- Follow existing code patterns
- Use descriptive commit messages
- Add documentation for new features
- Ensure tests pass

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review existing issues before creating new ones

---

**Built with ❤️ using Next.js, React, and V0 SDK**
