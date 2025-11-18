$body = Get-Content -Raw 'c:\7Semestre TADS\Biblioteca-Integrado\tmp\login.json'
Invoke-RestMethod -Uri 'http://192.168.0.104/usuarios/login' -Method Post -Body $body -ContentType 'application/json' -Verbose | ConvertTo-Json -Depth 5
