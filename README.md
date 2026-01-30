# GS-View

A demo application for viewing Gaussian Splats 3D data using [GaussianSplats3D](https://github.com/mkkellogg/GaussianSplats3D).

## Tech Stack

- **[Next.js](https://nextjs.org/)** - React framework for production
- **[GaussianSplats3D](https://github.com/mkkellogg/GaussianSplats3D)** - Three.js-based Gaussian Splats viewer
- **[Three.js](https://threejs.org/)** - 3D graphics library
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript with syntax for types
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework


## Getting Started

### Installation

```bash
# Install dependencies
bun install

# Copy environment variables
cp .env.example .env.local
```

### Using Custom Models

1. **Add your PLY model file**: Place your `.ply` file in the `public/models/` directory
   ```
   public/
   └── models/
       ├── storeroom.ply (default)
       └── your-model.ply
   ```

2. **Configure the model URL**: Edit `.env.local` and set your model path
   ```env
   NEXT_PUBLIC_GAUSSIAN_MODEL_URL=/models/your-model.ply
   ```

3. **Start the application**:
   ```bash
   bun run dev
   ```

### Viewing External PLY Paths (outside the repo)

If your PLY files live outside the repo (local path or mounted NAS), use the `/view` page with the `path` query.

1. **Allow external roots**: Edit `.env.local` to list allowed root directories (comma-separated).
   ```env
   GS_PLY_ROOTS=/data/ply,/mnt/nas/ply
   ```

2. **Open the viewer URL**:
   ```
   http://localhost:3000/view?path=/data/ply/your-model.ply
   ```

Notes:
- Only absolute paths ending with `.ply` are supported.
- Requests are restricted to the roots listed in `GS_PLY_ROOTS`.

### Development Commands

```bash
bun run dev       # Start development server
bun run build     # Build for production
bun run start     # Start production server
bun run lint      # Run ESLint
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker / Kubernetes

This project is configured for a production Docker image using Next.js standalone output.

### Build & Run (Docker)

```bash
docker build -t gs-view .
docker run --rm -p 3000:3000 \
  -e GS_PLY_ROOTS=/data/ply \
  -v /your/ply/folder:/data/ply \
  gs-view
```

Open:
```
http://localhost:3000/view?path=/data/ply/your-model.ply
```

### Kubernetes Notes

- Mount your PLY storage (NAS / NFS / hostPath) into the container.
- Set `GS_PLY_ROOTS` to the mounted root(s).
- The container listens on port `3000`.
