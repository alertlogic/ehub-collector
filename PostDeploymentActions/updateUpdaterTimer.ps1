$randM = Get-Random -minimum 0 -maximum 59
$randS = Get-Random -minimum 0 -maximum 59
$new_schedule = "$randS $randM * * * *"
Write-Output "Updating Updater timer trigger with ($new_schedule)".
$updater_function = Get-Content '..\\wwwroot\\Updater\\function.json' -raw | ConvertFrom-Json
$updater_function.bindings | % {if($_.name -eq 'AlertlogicUpdaterTimer'){$_.schedule=$new_schedule}}
$updater_function | ConvertTo-Json  | set-content '..\\wwwroot\\Updater\\function.json'