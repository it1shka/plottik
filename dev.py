#!/usr/bin/env python3

# This is a script that will
# run application in development mode

import subprocess as sp
import webbrowser

def is_node_installed() -> bool:
    '''Function that checks whether node is installed'''
    try:
        sp.run(['node', '-v'], stdout=sp.PIPE, stderr=sp.PIPE, check=True)
        return True
    except sp.CalledProcessError:
        return False

def main() -> None:
    '''
    Main script function
    1) Checks whether node.js installed
       if not, opens the webpage of node.js
       and quits
    2) Checks whether all the dependencies are installed
       nodemon     -- to track typescript files
       typescript  -- to compile typescript files
       sass        -- to compile our styles
    3) Runs a bunch of development commands
       in parallel
    '''

    # checking whether node is installed
    if not is_node_installed():
        print('Node.js is not installed. Please, install it to proceed')
        webbrowser.open('https://nodejs.org/en/')
        exit(1)
    
    # checking whether all the dependencies are installed
    dependencies = ['nodemon', 'sass', 'typescript']
    for dep in dependencies:
        sp.run([f'npm install -g {dep}'], shell=True, check='True')
    
    # running commands (entering devmod)
    commands = [
        'sass --watch --no-source-map scss/styles.scss:static/styles.css',
        'nodemon --ext "ts" --watch ts --exec "tsc"',
        'nodemon --ext "go" --exec "go run ." --signal SIGTERM'
    ]
    processes = [sp.Popen(command, shell=True) for command in commands]
    try:
        for process in processes:
            process.wait()
    except KeyboardInterrupt:
        exit(0)

# running the script
if __name__ == '__main__':
    main()
