# Third-party licenses

The application uses the following open-source npm packages:

| Package | License | Purpose |
| --- | --- | --- |
| `react` | MIT | UI runtime |
| `react-dom` | MIT | React DOM renderer |
| `lucide-react` | ISC | Open-source icon set |
| `sonner` | MIT | Toast notifications |
| `vite` | MIT | Development server and build tool |
| `@vitejs/plugin-react` | MIT | React support for Vite |

The unused `web-vitals` dependency was removed. The application no longer imports fonts from an external font CDN; it uses a system font stack instead. License metadata was checked against the packages published in the project lockfile during this audit.
