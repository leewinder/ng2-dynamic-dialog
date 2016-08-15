#!/usr/bin/python

#
# Creates a local NPM package for testing using the output generated 
# from 'prepare_distribution_package.py'
#

# Imports
import shutil, os
import subprocess
import glob

#
# Gets the main package folder
#
def get_package_folder():

    # Get the path to the distribution package
    package_path = os.getcwd() + '/../release/package/'
    destination_path = os.getcwd() + '/../release/' 
    return package_path, destination_path


#
# Removes any existing packages
#
def remove_existing_packages(destination_path):
    
    # Make sure any local packages are removed
    for package_file in glob.glob(destination_path + "*.tgz"):
        os.remove(package_file)


#
# Main entry function
#
def main():

    # Get our folder and remove existing packages
    package_path, destination_path = get_package_folder()
    remove_existing_packages(destination_path)

    # Build our package
    os.chdir(package_path)
    proc = subprocess.Popen(["npm", "pack"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
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
        print "npm pack failed with a return code of " + str(proc.returncode)
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
