#!/usr/bin/python

#
# Simple set of functions to support running commands on the CLI
#

# Imports
import os
import subprocess

#
# Gets the current root directory of the project
# 
def get_project_root():

    # Get the path to our source
    file_name = os.path.basename(__file__)
    script_root = os.path.realpath(__file__).replace(file_name, '')

    source_folder = script_root + '..'
    return source_folder


#
# Runs a command line program
#
def run_command_line(command_folder, command, args):

    # Change to our folder
    os.chdir(command_folder)

    # Build up our command arguments
    command_and_args = [command]
    if (args):
        for argument in args:
            command_and_args.append(argument)

    # Print out what we're running
    command_being_run = "Running '"
    for argument in command_and_args:
        command_being_run += " " + argument
    command_being_run += "'"

    # Output what we're running
    print command_being_run
    
    # Run our command
    proc = subprocess.Popen(command_and_args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    std_out, std_err = proc.communicate()

    # Output the comment results
    if (len(std_out) != 0):
        print command_being_run + " standard output"
        print std_out + "\n"

    if (len(std_err) != 0):
        print command_being_run + " standard error"
        print std_err + "\n"

    # Did we succeed?
    if (proc.returncode != 0):
        print command_being_run + " failed with a return code of " + str(proc.returncode)
    
    # Return our return code
    return proc.returncode, std_out, std_err
