import resolve from '@rollup/plugin-node-resolve';
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'src/index.ts',
    output: {
        dir: 'dist',
        format: 'esm'
    },
    plugins: [
        resolve({ browser: true }),
        json(),
        commonjs(),
        typescript(),
        terser()
    ]
}