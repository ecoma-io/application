#!/bin/zsh

echo "📌 Install depedencies..."
yarn install --frozen-lockfile
echo "✅ Install depedencies done."

echo "📌 Install paths..."
echo "export PATH=\"\$PATH:$(pwd)/scripts\"" >> ~/.zshrc
echo "export PATH=\"\$PATH:$(pwd)/node_modules/.bin\"" >> ~/.zshrc
echo "🔧 Added ./scripts and /node_modules/.bin  to PATH."


echo "📌 Deploy local..."
docker compose --profile infras up -d --wait
echo "✅ Docker Compose started successfully."

echo "📌 Running playwright install..."
npx playwright install --with-deps
echo "✅ playwright install done."


echo "📌 Install helm..."
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
echo "✅ Install helm done."


echo "📌 Build local image and deploy..."
NX_TUI=false npx nx run-many -t build
docker compose --profile app up -d --wait
echo "✅ Build local image and deploy done."

echo "🎉 postStartCommand completed successfully!"
