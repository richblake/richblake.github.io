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

# 3) Jira API base URL (pagination params added in loop)
$BaseUrl = "https://rich-blake.atlassian.net/rest/agile/1.0/board/1/issue"

# Tune this if you want (Jira often allows up to 100)
$MaxResults = 100

# 4) Output location (relative to repo root)
$RepoRoot   = Get-Location
$OutputDir  = Join-Path $RepoRoot "_data"
$OutputFile = Join-Path $OutputDir "kanban_board_structured.json"

if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

# 5) Call Jira (with fallback) + PAGINATION
$response = $null
$allIssues = @()

if ($headers) {
    try {
        $startAt = 0

        while ($true) {
            $Url = "${BaseUrl}?startAt=${startAt}&maxResults=${MaxResults}"

            $page = Invoke-RestMethod -Uri $Url -Headers $headers -Method Get -ErrorAction Stop

            if (-not $page -or -not $page.issues) {
                break
            }

            $allIssues += $page.issues

            $received = $page.issues.Count
            $total    = [int]$page.total

            # If we’ve reached or passed the total, we’re done
            $startAt += $received
            if ($startAt -ge $total) {
                break
            }

            # Defensive: if Jira ever returns 0 issues, stop to avoid infinite loop
            if ($received -eq 0) {
                break
            }
        }

        # Keep a response-like shape for the existing transform step
        $response = [PSCustomObject]@{ issues = $allIssues }
    }
    catch {
        Write-Warning "Jira request failed: $($_.Exception.Message)"
    }
}
else {
    Write-Warning "Skipping Jira request due to missing credentials."
}

# If Jira failed, fall back to existing file
if (-not $response -or -not $response.issues -or $response.issues.Count -eq 0) {
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

Write-Host "✅ Kanban JSON refreshed and saved to $OutputFile (issues: $($response.issues.Count))"
