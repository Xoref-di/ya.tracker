import React from 'react';

import { settings } from '@gravity-ui/date-utils';
import { TrackerPluginProvider } from '@weavix/tracker-plugin-sdk-react';
import ReactDOM from 'react-dom/client';

import App from './App';

import './styles.scss';

async function start() {
    await settings.loadLocale('ru');

    const rootElement = document.getElementById('root');

    if (!rootElement) {
        throw new Error('Root element not found');
    }

    const root = ReactDOM.createRoot(rootElement);

    root.render(
        <React.StrictMode>
            <TrackerPluginProvider>
                <App />
            </TrackerPluginProvider>
        </React.StrictMode>,
    );
}

start();
