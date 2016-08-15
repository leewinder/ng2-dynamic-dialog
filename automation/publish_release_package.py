#!/usr/bin/python

#
# Publishes an NMP package using the output generated from 'prepare_distribution_package.py'
#
# Note that this script relies on the use of Travis CI environment variables, meaning
# this script can only be run as part of a Travis CI build process
#

# Imports
import shutil, os
import subprocess


#
# Gets the main package folder
#
def get_package_folder():

    # Get the path to the distribution package
    package_path = os.getcwd() + '/../release/package/' 
    return package_path


#
# Main entry function
#
def main():

    # Do we have the Environment variable to detect the branch?
    # We only run this script on the master branch
    branch_name = 'unknown'
    try:
        branch_name = os.environ['TRAVIS_BRANCH']
    except KeyError:
        print "Unable to access the 'TRAVIS_BRANCH' environment variable\n"

    if (branch_name.lower() != 'master'):

        # Output the message
        print "Publishing packages can only be carried out on the 'master' branch"
        print "The branch being built is '" + branch_name + "' so this step will be skipped'" 

        # This is fine, so exit with 0
        exit(0)

    # Get our folder and remove existing packages
    package_path = get_package_folder()

    # Build our package
    os.chdir(package_path)
    proc = subprocess.Popen(["npm", "publish"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    std_out, std_err = proc.communicate()

    # Output the comment results
    if (len(std_out) != 0):
        print "\n*** Output ***"
        print std_out + "\n"

    if (len(std_err) != 0):
        print "\n\n*** Error ***"
        print std_err + "\n"

    # Did we succeed?
    if (proc.returncode != 0):
        print "npm publish failed with a return code of " + str(proc.returncode)
        exit(proc.returncode)

    # Move the file we just created
    shutil.move(package_path + std_out.strip(), package_path + '../')

    # Done
    print "Successfully created package file " + std_out.strip()
    


#
# Main entry point
#
if __name__ == "__main__":
    main()