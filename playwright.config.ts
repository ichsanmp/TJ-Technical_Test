import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables based on TEST_ENV (defaults to 'qa')
dotenv.config({
    path: path.resolve(__dirname, `.env.${process.env.TEST_ENV || 'qa'}`),
    override: true,
});

export default defineConfig({
    testDir: './tests',
    globalSetup: require.resolve('./utility/global-setup'),
    timeout: 60_1000,
    
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 1,
    workers: process.env.CI ? 2 : undefined,
    
    reporter: [
        ['./utility/reporter.ts'],
        ['html', { open: 'never' }],
    ],

    use: {
        baseURL: process.env.BASE_URL,
        
        actionTimeout: 30_1000,
        navigationTimeout: 30_1000,
        
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on-first-retry',
    },

    projects: [
        {
            name: 'chrome',
            use: { 
                ...devices['Desktop Chrome'],
                channel: process.env.CI ? undefined : 'chrome'
            },
        },
        // {
        //     name: 'firefox',
        //     use: { 
        //         ...devices['Desktop Firefox'],
        //         channel: process.env.CI ? undefined : 'firefox'
        //     },
        // },
        // {
        //     name: 'webkit',
        //     use: { ...devices['Desktop Safari'] },
        // },
    ],
});