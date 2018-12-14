$date = Get-Date
$min = ($date.Minute + 1) % 15
$sec = $date.Second
$new_schedule = "$sec $min-59/15 * * * *"
Write-Output "Updating Master timer trigger with ($new_schedule)."
$master_function = Get-Content '..\\wwwroot\\Master\\function.json' -raw | ConvertFrom-Json
$master_function.bindings | % {if($_.name -eq 'AlertlogicMasterTimer'){$_.schedule=$new_schedule}}
$master_function | ConvertTo-Json  | set-content '..\\wwwroot\\Master\\function.json'