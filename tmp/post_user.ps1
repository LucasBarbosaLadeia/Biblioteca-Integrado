$body = Get-Content -Raw 'c:\7Semestre TADS\Biblioteca-Integrado\tmp\test_user.json'
Invoke-RestMethod -Uri 'http://192.168.0.104/usuarios' -Method Post -Body $body -ContentType 'application/json' -Verbose
