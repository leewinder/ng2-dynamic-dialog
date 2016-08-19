#!/usr/bin/python

#
# Publishes an NMP package using the output generated from 'prepare_distribution_package.py'
#
# Note that this script relies on the use of Travis CI environment variables, meaning
# this script can only be run as part of a Travis CI build process
#
# It also requires npm-cli-login and NPM_USER, NPM_PASS and NPM_EMAIL present in the envvars
# npm install -g npm-cli-login
#

# Imports
import os
import cli


#
# Gets the main package folder
#
def get_package_folder():

    project_path = cli.get_project_root()

    # Get the path to the distribution package
    package_path = project_path + '/release/package/' 
    return package_path


#
# Verifies the branch we're on
#
def verify_branch_name():

    # Do we have the Environment variable to detect the branch?
    # We only run this script on the master branch
    branch_name = 'unknown'
    try:
        branch_name = os.environ['TRAVIS_BRANCH']
    except KeyError:
        print "Unable to access the 'TRAVIS_BRANCH' environment variable\n"

    # We only run on master
    if (branch_name.lower() != 'master'):

        # Output the message
        print "Publishing packages can only be carried out on the 'master' branch"
        print "The branch being built is '" + branch_name + "' so this step will be skipped'" 

        return False

    # We're good
    return True


#
# Main entry function
#
def main():

    # Check we're on a branch we can run on
    branch_valid = verify_branch_name()
    if (branch_valid == False):
        exit(0)

    # Get our folder and remove existing packages
    package_path = get_package_folder()
    
    # Log in
    return_code, std_out, std_err = cli.run_command_line(package_path, "npm-cli-login", None)
    if (return_code != 0):
        exit(return_code)

    
    # Publish our package
    return_code, std_out, std_err = cli.run_command_line(package_path, "npm", ["publish"])
    if (return_code != 0):
        exit(return_code)

    # Done
    print "Successfully published package file"
    

#
# Main entry point
#
if __name__ == "__main__":
    main()