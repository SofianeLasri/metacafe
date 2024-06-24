import {defineConfig, loadEnv} from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, path.resolve(process.cwd(), '..'));
    const port = `${env.VITE_PORT ?? '5173'}`;

    return {
        resolve: {
            alias: {
                '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
                '~@': path.resolve(__dirname, 'src'),
            }
        },
        plugins: [
            vue(),
        ],
        server: {
            port: port,
        }
    };
})
