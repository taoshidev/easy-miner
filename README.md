<p align="center">
  <img src="public/easy-miner.png" style="width: 10%; height: auto;">
</p>
<p align="center">
    A modern web interface for managing PTN (Proprietary Trading Network) miners and cryptocurrency exchange connectivity.
</p>

## Features

**Exchange Integration**
- Support for multiple cryptocurrency exchanges with examples.
- Real-time order monitoring
- Demo/Testnet mode support

**Miner Management (coming soon)**
- Start/stop miner operations
- Real-time log viewing
- Testnet/Mainnet configuration

**Order Monitoring**
- Live order tracking
- Real-time status updates
- Detailed trade information
- Error reporting and notifications


## Prerequisites

Before you begin, ensure you have installed:
- Node.js 18+
- npm, yarn, or pnpm
- Access to a running PTN instance
- Exchange API credentials (for supported exchanges)


## Project Structure

```bash
easy-miner/
├── app/
│   ├── actions/           # Server actions
│   ├── store/            # State management
│   └── layout.tsx        # Root layout
├── components/
│   └── ui/              # Reusable UI components
├── features/
│   ├── start/           # Miner management
│   └── watch/           # Signal monitoring
├── hooks/               # Custom React hooks
├── lib/                # Utility functions
├── public/             # Static assets
├── types/              # TypeScript definitions
└── utils/              # Helper functions
```


## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/taoshidev/easy-miner.git
cd easy-miner
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Configure environment variables: Create a `.env` file in the root directory:

```bash
NEXT_PUBLIC_API_URL="http://localhost:8080/api"
NEXT_PUBLIC_WEBSOCKET_URL="ws://localhost:8080"
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open http://localhost:3000 to view the application.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License
This project is maintained by Taoshi. All rights reserved.

## Support
For support, please contact:

- Github Issues
- Email: support@taoshi.io
