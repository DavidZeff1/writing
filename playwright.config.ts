import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir:'./tests',fullyParallel:true,workers:2,timeout:30000,
 reporter:'list',use:{baseURL:'http://127.0.0.1:3100',browserName:'chromium',channel:'chrome',headless:true,trace:'retain-on-failure'},
 webServer:{command:'npm run start -- --port 3100',url:'http://127.0.0.1:3100',reuseExistingServer:false,timeout:30000},
});
