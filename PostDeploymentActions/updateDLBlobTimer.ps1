$date = Get-Date
$min = ($date.Minute + 1) % 15
$sec = $date.Second
$new_schedule = "$sec $min-59/15 * * * *"
Write-Output "Updating DLBlob timer trigger with ($new_schedule)."
$dlblob_function = Get-Content '..\\wwwroot\\DLBlob\\function.json' -raw | ConvertFrom-Json
$dlblob_function.bindings | % {if($_.name -eq 'AlertlogicDLBlobTimer'){$_.schedule=$new_schedule}}
$dlblob_function | ConvertTo-Json  | set-content '..\\wwwroot\\DLBlob\\function.json'