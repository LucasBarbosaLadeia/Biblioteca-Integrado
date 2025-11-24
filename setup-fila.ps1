# Script de Setup da Fila de Notificações

Write-Host "🚀 Iniciando setup da Fila de Notificações..." -ForegroundColor Cyan
Write-Host ""

# 1. Ir para o diretório do microsserviço de notificações
Write-Host "📁 Navegando para o diretório do microsserviço..." -ForegroundColor Yellow
Set-Location -Path "Microservicos\notification"

# 2. Instalar dependências
Write-Host "📦 Instalando dependências (@nestjs/schedule)..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependências instaladas com sucesso!" -ForegroundColor Green
Write-Host ""

# 3. Voltar para o diretório raiz
Set-Location -Path "..\.."

# 4. Parar containers existentes
Write-Host "🛑 Parando containers existentes..." -ForegroundColor Yellow
docker compose down

# 5. Rebuild do microsserviço de notificações
Write-Host "🔨 Fazendo rebuild do microsserviço de notificações..." -ForegroundColor Yellow
docker compose build notification

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao fazer rebuild!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Rebuild concluído com sucesso!" -ForegroundColor Green
Write-Host ""

# 6. Subir os serviços
Write-Host "🚀 Iniciando todos os serviços..." -ForegroundColor Yellow
docker compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao iniciar serviços!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Serviços iniciados com sucesso!" -ForegroundColor Green
Write-Host ""

# 7. Aguardar serviços iniciarem
Write-Host "⏳ Aguardando serviços iniciarem (10 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 8. Verificar se os serviços estão rodando
Write-Host "🔍 Verificando status dos serviços..." -ForegroundColor Yellow
Write-Host ""

$services = @("backend", "emprestimos", "notification", "redis", "postgres-notificacoes")

foreach ($service in $services) {
    $status = docker ps --filter "name=$service" --format "{{.Status}}"
    if ($status) {
        Write-Host "  ✅ $service : " -NoNewline -ForegroundColor Green
        Write-Host "$status" -ForegroundColor White
    } else {
        Write-Host "  ❌ $service : NÃO ESTÁ RODANDO" -ForegroundColor Red
    }
}

Write-Host ""

# 9. Testar endpoint de estatísticas
Write-Host "🧪 Testando endpoint de estatísticas da fila..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

try {
    $response = Invoke-RestMethod -Uri "http://localhost/notification/fila/estatisticas" -ErrorAction Stop
    Write-Host "✅ Endpoint respondendo corretamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Estatísticas da Fila:" -ForegroundColor Cyan
    Write-Host "  Total: $($response.total)" -ForegroundColor White
    Write-Host "  Pendentes: $($response.pendentes)" -ForegroundColor Yellow
    Write-Host "  Concluídos: $($response.concluidos)" -ForegroundColor Green
    Write-Host "  Falhos: $($response.falhos)" -ForegroundColor Red
    Write-Host "  Taxa de Sucesso: $($response.taxaSucesso)" -ForegroundColor Cyan
} catch {
    Write-Host "⚠️  Endpoint ainda não está acessível. Aguarde mais alguns segundos e tente novamente." -ForegroundColor Yellow
    Write-Host "   Comando: Invoke-RestMethod -Uri http://localhost/notification/fila/estatisticas" -ForegroundColor Gray
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✨ Setup concluído com sucesso!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Próximos passos:" -ForegroundColor Cyan
Write-Host "  1. Leia o arquivo RESUMO_IMPLEMENTACAO_FILA.md" -ForegroundColor White
Write-Host "  2. Teste os comandos em TESTE_FILA.md" -ForegroundColor White
Write-Host "  3. Veja os logs: docker compose logs -f notification" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Endpoints disponíveis:" -ForegroundColor Cyan
Write-Host "  • http://localhost/notification/fila/estatisticas" -ForegroundColor White
Write-Host "  • http://localhost/notification/fila/falhos" -ForegroundColor White
Write-Host "  • http://localhost/emprestimos" -ForegroundColor White
Write-Host ""
Write-Host "Pressione qualquer tecla para ver os logs do serviço de notificações..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "📋 Mostrando logs (Ctrl+C para sair)..." -ForegroundColor Yellow
docker compose logs -f notification
