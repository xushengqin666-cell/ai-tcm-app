# check_log.py
import subprocess, os, sys
sys.stdout.reconfigure(encoding='utf-8')
os.chdir(r'C:\Users\xu_fa\ai-tcm-app')

env = os.environ.copy()
env['LANG'] = 'en_US.UTF-8'
env['LC_ALL'] = 'en_US.UTF-8'

r = subprocess.run(['git', 'log', '--oneline', '-20'], capture_output=True, env=env)
print('stdout:', r.stdout.decode('utf-8', errors='replace'))
print('stderr:', r.stderr.decode('utf-8', errors='replace'))

print('\n--- log on origin ---')
r = subprocess.run(['git', 'log', 'origin/main', '--oneline', '-10'], capture_output=True, env=env)
print(r.stdout.decode('utf-8', errors='replace'))

print('\n--- HEAD~5..HEAD ---')
r = subprocess.run(['git', 'log', '-5', '--stat', '--format=%H %s'], capture_output=True, env=env)
print(r.stdout.decode('utf-8', errors='replace')[:3000])
