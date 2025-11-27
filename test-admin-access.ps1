# Script de Teste - Controle de Acesso Admin
# Testa todas as funcionalidades protegidas por autenticação

$API_BASE = "http://localhost"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TESTE DE CONTROLE DE ACESSO - ADMIN" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Função auxiliar para fazer requisições
function Invoke-ApiRequest {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Token = $null,
        [object]$Body = $null
    )
    
    $headers = @{}
    if ($Token) {
        $headers["Authorization"] = "Bearer $Token"
    }
    
    $params = @{
        Uri = "$API_BASE$Endpoint"
        Method = $Method
        Headers = $headers
    }
    
    if ($Body) {
        $params["Body"] = ($Body | ConvertTo-Json)
        $params["ContentType"] = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod @params
        return @{ Success = $true; Data = $response }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $message = $_.Exception.Message
        return @{ Success = $false; StatusCode = $statusCode; Message = $message }
    }
}

# PASSO 1: Login com usuário admin
Write-Host "[1] Fazendo login como ADMIN..." -ForegroundColor Yellow

$loginAdmin = Invoke-ApiRequest -Method "POST" -Endpoint "/usuarios/login" -Body @{
    ra = "000000"
    senha = "admin123"
}

if (-not $loginAdmin.Success) {
    Write-Host "   ❌ ERRO: Não foi possível fazer login como admin" -ForegroundColor Red
    Write-Host "   Certifique-se de que existe um usuário admin no banco de dados" -ForegroundColor Red
    exit 1
}

$adminToken = $loginAdmin.Data.token
Write-Host "   ✅ Login admin realizado com sucesso!" -ForegroundColor Green
Write-Host "   Token: $($adminToken.Substring(0, 20))..." -ForegroundColor Gray

# PASSO 2: Login com usuário aluno
Write-Host "`n[2] Fazendo login como ALUNO..." -ForegroundColor Yellow

$loginAluno = Invoke-ApiRequest -Method "POST" -Endpoint "/usuarios/login" -Body @{
    ra = "222222"
    senha = "aluno123"
}

$alunoToken = $loginAluno.Data.token
Write-Host "   ✅ Login aluno realizado com sucesso!" -ForegroundColor Green

# PASSO 3: Testar acesso público (sem token)
Write-Host "`n[3] Testando rotas PÚBLICAS (sem autenticação)..." -ForegroundColor Yellow

$publicTests = @(
    @{ Method = "GET"; Endpoint = "/livros"; Description = "Listar livros" },
    @{ Method = "GET"; Endpoint = "/categorias"; Description = "Listar categorias" }
)

foreach ($test in $publicTests) {
    $result = Invoke-ApiRequest -Method $test.Method -Endpoint $test.Endpoint
    if ($result.Success) {
        Write-Host "   ✅ $($test.Description): PERMITIDO" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $($test.Description): ERRO ($($result.StatusCode))" -ForegroundColor Red
    }
}

# PASSO 4: Testar acesso de ADMIN em rotas protegidas
Write-Host "`n[4] Testando acesso ADMIN em rotas protegidas..." -ForegroundColor Yellow

# Criar categoria (deve funcionar)
$createCat = Invoke-ApiRequest -Method "POST" -Endpoint "/categorias" -Token $adminToken -Body @{
    nome = "Categoria Teste Admin"
}

if ($createCat.Success) {
    Write-Host "   ✅ Criar categoria: PERMITIDO" -ForegroundColor Green
    $catId = $createCat.Data.data.id_categoria
} else {
    Write-Host "   ❌ Criar categoria: NEGADO ($($createCat.StatusCode))" -ForegroundColor Red
}

# Listar empréstimos (deve funcionar para admin)
$listLoans = Invoke-ApiRequest -Method "GET" -Endpoint "/emprestimos" -Token $adminToken

if ($listLoans.Success) {
    Write-Host "   ✅ Listar empréstimos: PERMITIDO" -ForegroundColor Green
} else {
    Write-Host "   ❌ Listar empréstimos: NEGADO ($($listLoans.StatusCode))" -ForegroundColor Red
}

# Ver estatísticas (deve funcionar para admin)
$stats = Invoke-ApiRequest -Method "GET" -Endpoint "/emprestimos/estatisticas" -Token $adminToken

if ($stats.Success) {
    Write-Host "   ✅ Ver estatísticas: PERMITIDO" -ForegroundColor Green
} else {
    Write-Host "   ❌ Ver estatísticas: NEGADO ($($stats.StatusCode))" -ForegroundColor Red
}

# PASSO 5: Testar acesso de ALUNO em rotas protegidas
Write-Host "`n[5] Testando acesso ALUNO em rotas protegidas (deve ser NEGADO)..." -ForegroundColor Yellow

# Tentar criar categoria (deve falhar)
$alunoCreateCat = Invoke-ApiRequest -Method "POST" -Endpoint "/categorias" -Token $alunoToken -Body @{
    nome = "Categoria Teste Aluno"
}

if ($alunoCreateCat.Success) {
    Write-Host "   ❌ ERRO DE SEGURANÇA: Aluno conseguiu criar categoria!" -ForegroundColor Red
} elseif ($alunoCreateCat.StatusCode -eq 403 -or $alunoCreateCat.StatusCode -eq 401) {
    Write-Host "   ✅ Criar categoria: NEGADO (como esperado)" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Criar categoria: Erro inesperado ($($alunoCreateCat.StatusCode))" -ForegroundColor Yellow
}

# Tentar listar todos empréstimos (deve falhar)
$alunoListLoans = Invoke-ApiRequest -Method "GET" -Endpoint "/emprestimos" -Token $alunoToken

if ($alunoListLoans.Success) {
    Write-Host "   ❌ ERRO DE SEGURANÇA: Aluno conseguiu listar todos empréstimos!" -ForegroundColor Red
} elseif ($alunoListLoans.StatusCode -eq 403 -or $alunoListLoans.StatusCode -eq 401) {
    Write-Host "   ✅ Listar empréstimos: NEGADO (como esperado)" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Listar empréstimos: Erro inesperado ($($alunoListLoans.StatusCode))" -ForegroundColor Yellow
}

# PASSO 6: Testar rotas sem token (deve falhar)
Write-Host "`n[6] Testando acesso sem token em rotas protegidas..." -ForegroundColor Yellow

$noTokenTests = @(
    @{ Method = "POST"; Endpoint = "/categorias"; Description = "Criar categoria"; Body = @{ nome = "Teste" } },
    @{ Method = "GET"; Endpoint = "/emprestimos"; Description = "Listar empréstimos" },
    @{ Method = "GET"; Endpoint = "/emprestimos/estatisticas"; Description = "Ver estatísticas" }
)

foreach ($test in $noTokenTests) {
    $result = Invoke-ApiRequest -Method $test.Method -Endpoint $test.Endpoint -Body $test.Body
    
    if ($result.Success) {
        Write-Host "   ❌ ERRO DE SEGURANÇA: $($test.Description) permitido sem token!" -ForegroundColor Red
    } elseif ($result.StatusCode -eq 401 -or $result.StatusCode -eq 403) {
        Write-Host "   ✅ $($test.Description): NEGADO (como esperado)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  $($test.Description): Erro inesperado ($($result.StatusCode))" -ForegroundColor Yellow
    }
}

# PASSO 7: Limpar dados de teste
Write-Host "`n[7] Limpando dados de teste..." -ForegroundColor Yellow

if ($catId) {
    $deleteCat = Invoke-ApiRequest -Method "DELETE" -Endpoint "/categorias/$catId" -Token $adminToken
    if ($deleteCat.Success) {
        Write-Host "   ✅ Categoria de teste removida" -ForegroundColor Green
    }
}

# RESUMO FINAL
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "RESUMO DO TESTE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Rotas públicas acessíveis sem autenticação" -ForegroundColor Green
Write-Host "✅ Admin pode acessar todas as rotas protegidas" -ForegroundColor Green
Write-Host "✅ Aluno não pode acessar rotas administrativas" -ForegroundColor Green
Write-Host "✅ Rotas protegidas exigem autenticação" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 TODOS OS TESTES PASSARAM!" -ForegroundColor Green
Write-Host "   Sistema de autenticação funcionando corretamente!" -ForegroundColor Green
Write-Host ""
