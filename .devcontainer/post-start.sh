#!/bin/zsh

echo "📌 Install pnpm..."
curl -fsSL https://get.pnpm.io/install.sh | sh -
echo "✅ Install pnpm done."

echo "📌 Install depedencies..."
pnpm install
echo "✅ Install depedencies done."

echo "📌 Install paths..."
echo "export PATH=\"\$PATH:$(pwd)/scripts\"" >> ~/.zshrc
echo "export PATH=\"\$PATH:$(pwd)/node_modules/.bin\"" >> ~/.zshrc
echo "🔧 Added ./scripts and /node_modules/.bin  to PATH."

echo "📌 Build local image..."
NX_TUI=false npx nx run-many -t build
echo "✅ Build local image done."

echo "📌 Deploy local..."
docker compose up -d --wait
echo "✅ Docker Compose started successfully."

echo "📌 Running playwright install..."
npx playwright install --with-deps
echo "✅ playwright install done."


echo "📌 Install helm..."
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
echo "✅ Install helm done."


echo "🎉 postStartCommand completed successfully!"
