# --- Kanban export to Jekyll _data ---

# 1) Jira credentials (from environment variables)
$User  = $env:JIRA_EMAIL
$Token = $env:JIRA_API_TOKEN

if (-not $User -or -not $Token) {
    Write-Warning "JIRA credentials missing. Will attempt to use existing JSON if available."
}

# 2) Build Basic auth header (only if creds exist)
$headers = $null

if ($User -and $Token) {
    $pair = "${User}:${Token}"
    $base64AuthInfo = [Convert]::ToBase64String(
        [Text.Encoding]::ASCII.GetBytes($pair)
    )

    $headers = @{
        Authorization = "Basic $base64AuthInfo"
        Accept        = "application/json"
    }
}

# 3) Jira API URL
$Url = "https://rich-blake.atlassian.net/rest/agile/1.0/board/1/issue?maxResults=100"

# 4) Output location (relative to repo root)
$RepoRoot   = Get-Location
$OutputDir  = Join-Path $RepoRoot "_data"
$OutputFile = Join-Path $OutputDir "kanban_board_structured.json"

if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

# 5) Call Jira (with fallback)
$response = $null

if ($headers) {
    try {
        $response = Invoke-RestMethod -Uri $Url -Headers $headers -Method Get -ErrorAction Stop
    }
    catch {
        Write-Warning "Jira request failed: $($_.Exception.Message)"
    }
}
else {
    Write-Warning "Skipping Jira request due to missing credentials."
}

# If Jira failed, fall back to existing file
if (-not $response -or -not $response.issues) {
    if (Test-Path $OutputFile) {
        Write-Warning "Using existing kanban_board_structured.json as fallback."
        exit 0
    }
    else {
        Write-Error "No Jira data and no existing JSON fallback. Cannot continue."
        exit 1
    }
}

# 6) Transform data
$kanbanStructured = @{}

foreach ($issue in $response.issues) {
    $column = $issue.fields.status.name

    if (-not $kanbanStructured.ContainsKey($column)) {
        $kanbanStructured[$column] = @()
    }

    $label   = $issue.fields.labels | Select-Object -First 1
    $blogUrl = $issue.fields.customfield_10037

    $kanbanStructured[$column] += [PSCustomObject]@{
        id        = $issue.key
        summary   = $issue.fields.summary
        column    = $column
        assignee  = $issue.fields.assignee?.displayName
        label     = $label
        blog_url  = $blogUrl
    }
}

# 7) Write JSON
$kanbanStructured |
    ConvertTo-Json -Depth 10 |
    Out-File $OutputFile -Encoding utf8

Write-Host "✅ Kanban JSON refreshed and saved to $OutputFile"