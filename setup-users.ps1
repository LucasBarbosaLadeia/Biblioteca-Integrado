# Script para criar usuário admin
$API_BASE = "http://localhost"

Write-Host "`n Criando usuario ADMIN..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "$API_BASE/usuarios" -Method POST -Body (@{
        nome = "Administrador"
        email = "admin@biblioteca.com"
        senha = "admin123"
        RA = "000000"
        tipo = "admin"
    } | ConvertTo-Json) -ContentType "application/json"
    
    Write-Host "Usuario admin criado com sucesso!" -ForegroundColor Green
    Write-Host "   Email: admin@biblioteca.com" -ForegroundColor Gray
    Write-Host "   Senha: admin123" -ForegroundColor Gray
}
catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "Usuario admin ja existe!" -ForegroundColor Yellow
    }
    else {
        Write-Host "Erro ao criar admin: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nCriando usuario FUNCIONARIO..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "$API_BASE/usuarios" -Method POST -Body (@{
        nome = "Bibliotecario"
        email = "funcionario@biblioteca.com"
        senha = "func123"
        RA = "111111"
        tipo = "funcionario"
    } | ConvertTo-Json) -ContentType "application/json"
    
    Write-Host "Usuario funcionario criado com sucesso!" -ForegroundColor Green
    Write-Host "   Email: funcionario@biblioteca.com" -ForegroundColor Gray
    Write-Host "   Senha: func123" -ForegroundColor Gray
}
catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "Usuario funcionario ja existe!" -ForegroundColor Yellow
    }
    else {
        Write-Host "Erro ao criar funcionario: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nCriando usuario ALUNO..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "$API_BASE/usuarios" -Method POST -Body (@{
        nome = "Aluno Teste"
        email = "aluno@teste.com"
        senha = "aluno123"
        RA = "222222"
        tipo = "aluno"
    } | ConvertTo-Json) -ContentType "application/json"
    
    Write-Host "Usuario aluno criado com sucesso!" -ForegroundColor Green
    Write-Host "   Email: aluno@teste.com" -ForegroundColor Gray
    Write-Host "   Senha: aluno123" -ForegroundColor Gray
}
catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "Usuario aluno ja existe!" -ForegroundColor Yellow
    }
    else {
        Write-Host "Erro ao criar aluno: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nSetup de usuarios concluido!`n" -ForegroundColor Green
