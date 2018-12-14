$randH = Get-Random -minimum 0 -maximum 11
$randM = Get-Random -minimum 0 -maximum 59
$randS = Get-Random -minimum 0 -maximum 59
$randH12 = $randH + 12
$new_schedule = "$randS $randM $randH,$randH12 * * *"
Write-Output "Updating Updater timer trigger with ($new_schedule)".
$master_function = Get-Content '..\\wwwroot\\Updater\\function.json' -raw | ConvertFrom-Json
$master_function.bindings | % {if($_.name -eq 'AlertlogicUpdaterTimer'){$_.schedule=$new_schedule}}
$master_function | ConvertTo-Json  | set-content '..\\wwwroot\\Updater\\function.json'