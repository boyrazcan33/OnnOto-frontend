# 🔋 OnnOto Frontend

[![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.2-3178c6.svg)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.7.0-764abc.svg)](https://redux-toolkit.js.org/)
[![i18next](https://img.shields.io/badge/i18next-23.7.6-26a69a.svg)](https://www.i18next.com/)

OnnOto is Estonia's premier electric vehicle charging station reliability platform, designed to help EV drivers find reliable charging stations across the country.

![OnnOto App Screenshot](https://via.placeholder.com/800x400?text=OnnOto+App+Screenshot)

## 🚀 Features

- **Real-time station status** information
- **Reliability ratings** based on historical data
- **User-submitted reports** about station issues
- **Offline access** to critical charging station information
- **Detailed connector information** for each station
- **Interactive maps** with filtering options
- **Multi-language support** (Estonian, English, Russian)

## 📋 Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Backend server (OnnOto API) - [Repository Link](https://github.com/your-username/onnoto-backend)

## 🛠️ Setup and Installation

1. **Clone the repository**

```bash
git clone https://github.com/boyrazcan33/OnnOto-frontend.git
cd OnnOto-frontend
```

2. **Install dependencies**

```bash
# Using npm
npm install

# Using yarn
yarn
```

3. **Create environment file**

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8087/api

# Language Settings
REACT_APP_DEFAULT_LANGUAGE=et

# Map Configuration
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
REACT_APP_MAP_ID=YOUR_MAP_ID

# WebSocket Configuration
REACT_APP_WS_URL=ws://localhost:8087/ws
```

4. **Start development server**

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

The application will be available at `http://localhost:3000`.

## 🔄 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run dev:alt` | Start development server on port 3001 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run test` | Run tests |
| `npm run lint` | Run linter |
| `npm run type-check` | Run TypeScript type checking |

## 🌐 Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `REACT_APP_API_URL` | Backend API URL | `https://onnoto-backend.fly.dev/api` |
| `REACT_APP_DEFAULT_LANGUAGE` | Default language code | `et` |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | Google Maps API key | - |
| `REACT_APP_MAP_ID` | Google Maps Map ID | - |
| `REACT_APP_WS_URL` | WebSocket URL | `wss://onnoto-backend.fly.dev/ws` |

## 📁 Project Structure

```
onnoto-frontend/
├── public/            # Static files
├── src/               # Source files
│   ├── api/           # API clients and interceptors
│   ├── components/    # Reusable components
│   ├── constants/     # Constants and configurations
│   ├── contexts/      # React contexts
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── services/      # Services (offline, analytics, etc.)
│   ├── store/         # Redux store
│   ├── styles/        # SCSS styles
│   ├── types/         # TypeScript types
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main App component
│   ├── index.tsx      # Entry point
│   └── routes.tsx     # Route definitions
└── webpack.config.js  # Webpack configuration
```

## 🌍 Supported Languages

- Estonian (et)
- English (en)
- Russian (ru)

## 🔒 Offline Support

OnnOto supports offline usage with the following features:
- Caching of station data
- Offline map access
- Saving of user preferences
- Syncing when back online

## 🧪 Testing

Run tests with:

```bash
npm run test
```

## 🚢 Deployment

1. **Build the application**

```bash
npm run build
```

2. **Start the production server**

```bash
npm run start
```

For deployment to services like Vercel, Netlify, or AWS:

- Configure environment variables in your hosting platform
- Set up continuous deployment from your GitHub repository

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For questions, feedback, or support, please contact us at onnotoservice@gmail.com
