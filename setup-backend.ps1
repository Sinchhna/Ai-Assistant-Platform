# 🚀 AI Marketplace Backend Setup Script
# Run this script in PowerShell as Administrator

Write-Host "🚀 Setting up AI Marketplace Backend..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Check if .env.local exists
$envFile = ".env.local"
if (Test-Path $envFile) {
    Write-Host "✅ .env.local file already exists" -ForegroundColor Green
} else {
    Write-Host "❌ .env.local file not found" -ForegroundColor Red
    Write-Host "Please create .env.local with your Supabase credentials:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "VITE_SUPABASE_URL=https://your-project-ref.supabase.co" -ForegroundColor Cyan
    Write-Host "VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Get these values from: https://app.supabase.com" -ForegroundColor Yellow
    Write-Host "Settings → API → Project URL & anon/public key" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Create Supabase project at https://supabase.com" -ForegroundColor White
Write-Host "2. Get your project credentials" -ForegroundColor White
Write-Host "3. Create .env.local with your credentials" -ForegroundColor White
Write-Host "4. Get Gemini API key from https://makersuite.google.com/app/apikey" -ForegroundColor White
Write-Host "5. Deploy Edge Function (see BACKEND_SETUP_GUIDE.md)" -ForegroundColor White

Write-Host ""
Write-Host "🔧 Alternative CLI Installation Methods:" -ForegroundColor Yellow
Write-Host "• Chocolatey: choco install supabase" -ForegroundColor White
Write-Host "• Manual download: https://github.com/supabase/cli/releases" -ForegroundColor White
Write-Host "• Use Supabase Dashboard for Edge Function deployment" -ForegroundColor White

Write-Host ""
Write-Host "📚 For detailed instructions, see: BACKEND_SETUP_GUIDE.md" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Green
