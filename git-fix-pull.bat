@echo off
echo ========================================
echo  Git Pull Fix Script - ArtisansWomen
echo ========================================
echo.

echo [1] Stashing your local changes...
git stash

echo.
echo [2] Pulling latest from remote...
git pull

echo.
echo [3] Restoring your local changes...
git stash pop

echo.
echo Done! Your changes are restored on top of the latest code.
echo.
echo If you see conflicts after stash pop, open the conflicted files
echo and look for lines with <<<<<<< HEAD and >>>>>>> and fix them.
pause
